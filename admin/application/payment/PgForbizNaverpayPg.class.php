<?php

/**
 * Description of PgForbizNaverpayPg
 * https://developer.pay.naver.com/docs/v2/api#common-common_certi
 * @author Hong
 */
class PgForbizNaverpayPg extends PgForbiz
{
    /**
     * 파트너 ID
     * @var type
     */
    private $partnerId;

    /**
     * 클라이언트 ID
     * @var type
     */
    private $clientId;

    /**
     * 클라이언트 시크릿 키
     * @var type
     */
    private $clientSecret;

    /**
     * 체인 아이디
     * @var
     */
    private $chainId;
    /**
     * 모드 development or production
     * @var
     */
    private $mode;

    /**
     * API 도메인
     * @var
     */
    private $apiDomain;

    /**
     * 서비스 도메인
     * @var
     */
    private $serviceDomain;

    public function __construct($agentType)
    {
        parent::__construct($agentType);

        $this->partnerId = ForbizConfig::getMallConfig('naverpay_pg_partner_id');
        $this->clientId = ForbizConfig::getMallConfig('naverpay_pg_client_id');
        $this->clientSecret = ForbizConfig::getMallConfig('naverpay_pg_client_secret');
        $this->chainId = ForbizConfig::getMallConfig('naverpay_pg_chain_id');

        if (ForbizConfig::getMallConfig('naverpay_pg_service_type') == 'service') {
            $this->mode = 'production';
            $this->apiDomain = 'https://apis.naver.com';
            if ($agentType == 'W') {
                $this->serviceDomain = 'https://pay.naver.com';
            } else {
                $this->serviceDomain = 'https://m.pay.naver.com';
            }
        } else {
            $this->mode = 'development';
            $this->apiDomain = 'https://dev.apis.naver.com';
            if ($agentType == 'W') {
                $this->serviceDomain = 'https://test-pay.naver.com';
            } else {
                $this->serviceDomain = 'https://test-m.pay.naver.com';
            }
        }
    }

    /**
     * 거래완료
     * @param $data
     */
    public function doPurchaseConfirm($data)
    {
//        paymentId	String	50바이트	필수	네이버페이 결제번호
//        requester	String	20바이트	필수	요청자(1: 구매자, 2: 가맹점 관리자) 구분이 애매한 경우 가맹점 관리자로 입력합니다
        $this->callApi($this->apiDomain . '/' . $this->partnerId . '/naverpay/payments/v1/purchase-confirm', $data);
    }

    /**
     * 주문 정보 조회
     * @param $data
     * @return mixed
     */
    public function getHistory($data)
    {
//        paymentId	String	50바이트	부분선택	조회하고자 하는 네이버페이 결제번호 결제번호를 입력값으로 선택하면 startTime, endTime, pageNumber, rowsPerPage 파라미터 값은 무시됩니다
//        startTime	String	14바이트	부분선택	검색 시작 일시(YYYYMMDDHH24MMSS) 검색 기간(startTime과 endTime 사이의 시간)은 31일 이내여야 합니다
//        endTime	String	14바이트	부분선택	검색 종료 일시(YYYYMMDDHH24MMSS) 검색 기간(startTime과 endTime 사이의 시간)은 31일 이내여야 합니다
//        approvalType	String	20바이트	선택	ALL:전체, APPROVAL:승인, CANCEL:취소, CANCEL_FAIL:취소실패
//        pageNumber	Number		부분선택	조회하고자 하는 페이지번호 값이 없으면 1로 간주합니다
//        rowsPerPage	Number		부분선택	페이지 당 row 건수 1~50까지 지정 가능하며, 값이 없으면 20으로 간주합니다
//        collectChainGroup	Number		선택	1: 해당 그룹에 속한 모든 가맹점의 결제내역을 조회 할 수 있습니다 일반 개별 가맹점에서는 사용 할 수 없고, 그룹형 마스터 가맹점만 사용 가능한 옵션입니다
        return $this->callApi($this->apiDomain . '/' . $this->partnerId . '/naverpay/payments/v2.2/list/history', json_encode($data), 'json');
    }

    public function doCancel(PgForbizCancelData $cancelData, PgForbizResponseData $responseData): PgForbizResponseData
    {
        $cancelData->amt = f_decimal($cancelData->amt)->toInt();
        $cancelData->taxAmt = f_decimal($cancelData->taxAmt)->toInt();
        $cancelData->taxExAmt = f_decimal($cancelData->taxExAmt)->toInt();
        $cancelData->expectedRestAmt = f_decimal($cancelData->expectedRestAmt)->toInt();

        $requestData = [
            'paymentId' => $cancelData->tid
            , 'cancelAmount' => $cancelData->amt
            , 'cancelReason' => substr($cancelData->message, 0,79)
            , 'cancelRequester' => $cancelData->cancelRequester == 'M' ? '1' : '2' // 취소 요청자(1: 구매자, 2: 가맹점 관리자) 구분이 애매한 경우 가맹점 관리자로 입력합니다
            , 'taxScopeAmount' => $cancelData->taxAmt //과세 대상 금액
            , 'taxExScopeAmount' => $cancelData->taxExAmt //면세 대상 금액
            , 'doCompareRest' => 1
            , 'expectedRestAmount' => $cancelData->expectedRestAmt // 이번 취소가 수행되고 난 후에 남을 가맹점의 예상 금액 , 옵션 파라미터인 doCompareRest값이 1일 때에만 동작합니다 Ex) 결제금액 1000원 중 200원을 취소하고 싶을 때 => expectedRestAmount =800원, cancelAmount=200원으로 요청
        ];

        $response = $this->callApi($this->apiDomain . '/' . $this->partnerId . '/naverpay/payments/v1/cancel', $requestData);

        if ($response->code == 'Success') {
            $responseData->result = true;
        } else if ($response->code == 'CancelNotComplete') { //취소처리가 완료되지 않아, 반드시 취소 재시도가 필요
            return $this->doCancel($cancelData, $responseData);
        } else {
            $responseData->result = false;
            $responseData->message = $response->message;
        }
        return $responseData;
    }

    public function getCashAmount($data)
    {
        return $this->callApi($this->apiDomain . '/' . $this->partnerId . '/naverpay/payments/v2/receipt/cash-amount', json_encode($data), 'json');
    }

    private function callApi($url, $data, $requestType = false)
    {
        $curl = new Curl\Curl();

        $curl->setOpt(CURLOPT_TIMEOUT, 60);

        if ($requestType == 'json') {
            $curl->setHeader('Content-Type', 'application/json');
        }

        $curl->setHeader('X-Naver-Client-Id', $this->clientId)
            ->setHeader('X-Naver-Client-Secret', $this->clientSecret)
            ->setHeader('X-NaverPay-Chain-Id', $this->chainId)
            ->post($url, $data);

        return json_decode($curl->response);
    }
}
