<?php

/**
 * Description of PgForbizKakaoPay
 * @author Kim
 */
class PgForbizKakaoPay extends PgForbiz
{

    /**
     * 카카오페이 api url
     * @var type
     */
    private $apiUrl;

    /**
     * cid key
     * @var type
     */
    private $cid;

    /**
     * admin key
     * @var
     */
    private $adminKey;

    /**
     * 로그 경로
     * @var bool
     */
    private $logPath;

    public function __construct($agentType)
    {
        parent::__construct($agentType);
        $this->apiUrl = 'https://kapi.kakao.com';
        $this->adminKey = ForbizConfig::getMallConfig('kakaopay_admin_key');

        if (ForbizConfig::getMallConfig('kakaopay_service_type') == 'service') {
            $this->cid = ForbizConfig::getMallConfig('kakaopay_cid');
        } else {
            $this->cid = 'TC0ONETIME';
        }
    }

    public function doCancel(PgForbizCancelData $cancelData, PgForbizResponseData $responseData): PgForbizResponseData
    {
        $cancelData->amt = f_decimal($cancelData->amt)->toInt();
        $cancelData->taxExAmt = f_decimal($cancelData->taxExAmt)->toInt();

        $data = [];

        $data['cid'] = $this->cid; // 가맹점 코드, 10자 (필수)
//        $data['cid_secret']; // 가맹점 코드 인증키, 24자, 숫자+영문 소문자 조합
        $data['tid'] = $cancelData->tid; // 결제 고유번호 (필수)
        $data['cancel_amount'] = $cancelData->amt; // 취소 금액 (필수)
        $data['cancel_tax_free_amount'] = $cancelData->taxExAmt; // 취소 비과세 금액 (필수)
//        $data['cancel_vat_amount']; // 취소 부가세 금액, 요청 시 값을 전달하지 않을 경우, (취소 금액 - 취소 비과세 금액)/11, 소숫점이하 반올림
//        $data['cancel_available_amount']; // 취소 가능 금액(결제 취소 요청 금액 포함)
        $data['payload'] = $cancelData->message;  // 해당 요청에 대해 저장하고 싶은 값, 최대 200자

        $this->logPath = $cancelData->logPath;

        $response = $this->callApi($this->apiUrl . '/v1/payment/cancel', $data);

        if (isset($response->aid) && !empty($response->aid)) {
            $responseData->result = true;
        } else {
            $responseData->result = false;
            $responseData->message = $response->msg;
        }
        return $responseData;
    }

    private function callApi($url, $data)
    {
        $curl = new Curl\Curl();

        try {
            $curl->setHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
                ->setHeader('Authorization', 'KakaoAK ' . $this->adminKey)
                ->post($url, $data);

            $this->writeLog("API Result $url Status : " . $curl->http_status_code);
            $this->writeLog("API Result $url ResponseText : " . $curl->response);
        } catch (RequestException $e)
        {
            $this->writeLog("Call API Result $url Error Status : " . $curl->http_status_code);
            $this->writeLog("Call API Result $url Error ResponseText : " . $curl->msg);
        }

        return json_decode($curl->response);
    }

    private function writeLog($Input_String)
    {
        if (!empty($this->logPath)) {
            $oTextStream = fopen($this->logPath . "/kakaoPay_Log_" . date("Ymd") . "_php.txt", "a");
            $today = date("Y-m-d H:i:s");

            //-----------------------------------------------------------------------------
            // 내용 기록
            //-----------------------------------------------------------------------------
            fwrite($oTextStream, $today . " " . $Input_String . "\n");

            //-----------------------------------------------------------------------------
            // 리소스 해제
            //-----------------------------------------------------------------------------
            fclose($oTextStream);
        }
    }
}
