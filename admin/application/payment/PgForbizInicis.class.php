<?php

/**
 * Description of PgForbizInicis
 *
 * @author Kim
 * INIApi Standard 버전
 */
class PgForbizInicis extends PgForbiz
{
    /**
     * 이니시스 MID 유형
     */
    private $inicisType;

    /**
     * 가맹점 ID
     * @var type
     */
    private $mid;

    /**
     * 구에스크로 ID
     * @var type
     */
    private $escrowMid;

    /**
     * INIAPI KEY
     * @var type
     */
    private $iniapiKey;

    /**
     * 신 이니시스 INIAPI IV
     * @var type
     */
    private $iniapiIv;

    /**
     * 신 이니시스 INIAPI IV
     * @var type
     */
    private $escrowIniApiIv;

    /**
     * 구 이니시스 INIAPI KEY
     * @var type
     */
    private $escrowIniApiKey;

    protected $api = false;
    protected $requestData = [];
    /**
     * 가맹점 KEY
     * @var type
     */
    private $serviceKey;

    /**
     * 가맹점 취소 비밀번호
     * @var type
     */
    private $cancelPassword;

    /**
     * 가맹점 표준결제 스크립트 URL
     * @var type
     */
    private $payScriptUrl;

    /**
     * 모듈 경로
     * @var text
     */
    private $homePath;

    /**
     * 환불 방식 맵핑 정보
     * @var array
     */
    private $refundMethodMapping = [
        ORDER_METHOD_CARD => 'Card'
        , ORDER_METHOD_INAPP_PAYCO => 'Card'
        , ORDER_METHOD_INAPP_KAKAOPAY => 'Card'
        , ORDER_METHOD_INAPP_SSPAY => 'Card'
        , ORDER_METHOD_INAPP_LPAY => 'Card'
        , ORDER_METHOD_INAPP_SSGPAY => 'Card'
        , ORDER_METHOD_INAPP_TOSS => 'Card'
        , ORDER_METHOD_INAPP_NAVERPAY => 'Card'
        , ORDER_METHOD_INAPP_KPAY => 'Card'
        , ORDER_METHOD_INAPP_KBANKPAY => 'Card'
        , ORDER_METHOD_ICHE => 'Acct'
        , ORDER_METHOD_VBANK => 'Vacct'
        , ORDER_METHOD_PHONE => 'HPP'
        , ORDER_METHOD_ESCROW_ICHE => 'Acct'
        , ORDER_METHOD_ESCROW_VBANK => 'Vacct'
    ];

    public function __construct($agentType)
    {
        parent::__construct($agentType);

        $this->homePath = __DIR__ . '/inicis';

        if (ForbizConfig::getPaymentConfig('service_type', 'inicis') == 'service') {
            // 결제 유형
            $this->inicisType = ForbizConfig::getPaymentConfig('inicis_type', 'inicis');
            $this->iniapiKey = ForbizConfig::getPaymentConfig('iniapi_key', 'inicis');
            $this->iniapiIv = ForbizConfig::getPaymentConfig('iniapi_iv', 'inicis');

            if ($this->inicisType == 'sin_escrow')  // 신에스크로
            {
                $this->mid = ForbizConfig::getPaymentConfig('mid', 'inicis');
                $this->escrowMid = $this->mid;
            } else { //구에스크로
                $this->mid = ForbizConfig::getPaymentConfig('mid', 'inicis');
                $this->escrowMid = ForbizConfig::getPaymentConfig('escrow_mid', 'inicis');

                // 구이니시스 에스크로 iniApiKey
                $this->escrowIniApiKey = ForbizConfig::getPaymentConfig('escrow_iniapi_key', 'inicis');
                $this->escrowIniApiIv = ForbizConfig::getPaymentConfig('escrow_iniapi_iv', 'inicis');
            }
        }
    }

    public function doCancel(PgForbizCancelData $cancelData, PgForbizResponseData $responseData): PgForbizResponseData
    {
        $payMethod = $this->getRefundPayMethod($cancelData->method);

        $mid = $this->mid;

        if (in_array($cancelData->method, [ORDER_METHOD_ESCROW_VBANK, ORDER_METHOD_ESCROW_ICHE])) { // 에스크로
            // 구이니시스
            if ($this->inicisType != 'sin_escrow') {
                $this->iniapiKey = $this->escrowIniApiKey;
                $this->iniapiIv = $this->escrowIniApiIv;
            }
            $mid = $this->escrowMid;
        }

        // AES 암호화
        $encAcctNum = base64_encode(openssl_encrypt($cancelData->bankNumber, 'aes-128-cbc', $this->iniapiKey, OPENSSL_RAW_DATA, $this->iniapiIv));

        if ($cancelData->isPartial) {//부분취소
            $type = "PartialRefund";

            if (in_array($cancelData->method, [ORDER_METHOD_VBANK, ORDER_METHOD_ESCROW_VBANK, ORDER_METHOD_PHONE])) { // 가상계자, 휴대폰 환붏
                $hash = $this->iniapiKey . $type . $payMethod . date('YmdHis') . getRemoteAddr()
                    . $mid . $cancelData->tid . $cancelData->amt . $cancelData->expectedRestAmt
                    . $encAcctNum;
            } else {
                $hash = $this->iniapiKey . $type . $payMethod . date('YmdHis') . getRemoteAddr()
                    . $mid . $cancelData->tid . $cancelData->amt . $cancelData->expectedRestAmt;
            }
        } else {
            $type = "Refund"; // 전체취소

            if (in_array($cancelData->method, [ORDER_METHOD_VBANK, ORDER_METHOD_ESCROW_VBANK, ORDER_METHOD_PHONE])) { // 가상계자, 휴대폰 환붏
                $hash = $this->iniapiKey . $type . $payMethod . date('YmdHis') . getRemoteAddr()
                    . $mid . $cancelData->tid . $encAcctNum;
            } else {
                $hash = $this->iniapiKey . $type . $payMethod . date('YmdHis') . getRemoteAddr()
                    . $mid . $cancelData->tid;
            }
        }

        $requestData = [
            'type' => $type // 고정
            , 'paymethod' => $payMethod // 지불수단 코드
            , 'timestamp' => date('YmdHis')
            , 'clientIp' => getRemoteAddr()
            , 'mid' => $mid
            , 'tid' => $cancelData->tid
            , 'msg' => $cancelData->message
            , 'hashData' => hash("sha512", $hash)
        ];

        if ($cancelData->isPartial) {
            $requestData['price'] = $cancelData->amt; // 취소요청 금액
            $requestData['confirmPrice'] = $cancelData->expectedRestAmt; // 부분취소 후 남은금액
        }

        if (in_array($cancelData->method, [ORDER_METHOD_VBANK, ORDER_METHOD_ESCROW_VBANK, ORDER_METHOD_PHONE])) { // 가상계자, 휴대폰 환붏
            $requestData['refundAcctNum'] = $encAcctNum;
            $requestData['refundBankCode'] = $this->getBankCodeByForbizBankCode($cancelData->bankCode);;
            $requestData['refundAcctName'] = $cancelData->bankOwner;
        }

        $this->requestData = $requestData;

        $result = $this->setApi('doRefund')->callApi();

        if (isset($result["resultCode"]) && $result["resultCode"] == "00") {
            $responseData->result = true;
        } else {
            $responseData->result = false;
            $responseData->message = $result['resultMsg'];
        }
        return $responseData;
    }

    public function setApi($type)
    {
        // API 서버 선택
        $apiServer = 'https://iniapi.inicis.com/api/v1';

        switch ($type) {
            case 'doRefund':
                $this->api = $apiServer . '/refund';
                break;
            case 'doDelivery':
                $this->api = $apiServer . '/escrow';
                break;
            default:
                $this->api = false;
                break;
        }

        if ($this->api !== false) {
            return $this;
        }

        throw new \Exception('Not define api type!');
    }

    public function callApi()
    {
        $curl = new \Curl\Curl();
        $curl->setHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

        $curl->post($this->api, $this->requestData);

        $resData = json_decode($curl->response, true);

        return (json_last_error() != 0 ? $curl->response : $resData);
    }

    /**
     * 배송등록 API
     * @return void
     */
    public function doDelivery($data)
    {
        // 구이니시스
        if ($this->inicisType != 'sin_escrow') {
            $this->iniapiKey = $this->escrowIniApiKey;
        }

        $hash = $this->iniapiKey . 'Dlv' . date('YmdHis') . getRemoteAddr()
            . $this->escrowMid . $data['oid'] . $data['tid'] . $data['price'];

        $this->requestData = [
            'type' => 'Dlv' // 고정
            , 'mid' => $this->escrowMid
            , 'clientIp' => getRemoteAddr()
            , 'timestamp' => date('YmdHis')
            , 'tid' => $data['tid']
            , 'oid' => $data['oid']
            , 'price' => $data['price']
            , 'report' => "I" // ["I":등록, "U":변경]
            , 'invoice' => $data['invoice']
            , 'registName' => $data['registName']
            , 'exCode' => $this->getDeliveryCode($data['exCode'])
            , 'exName' => $data['exName']
            , 'charge' => "SH" // ("SH":판매자부담, "BH":구매자부담)
            , 'invoiceDay' => date('Y-m-d H:i:s')
            , 'sendName' => $data['sendName']
            , 'sendTel' => $data['sendTel']
            , 'sendPost' => $data['sendPost']
            , 'sendAddr1' => $data['sendAddr1']
            , 'sendAddr2' => $data['sendAddr2']
            , 'recvTel' => $data['recvTel']
            , 'recvName' => $data['recvName']
            , 'recvPost' => $data['recvPost']
            , 'recvAddr' => $data['recvAddr']
            , 'hashData' => hash("sha512", $hash)
        ];

        $result = $this->setApi('doDelivery')->callApi();

        if (isset($result["resultCode"]) && $result["resultCode"] == "00") {
            return $result;
        } else {
            return $result;
        }
    }

    private function getBankCodeByForbizBankCode($code)
    {
        $BankCode = [
            'su' => '02'
            , 'ku' => '03'
            , 'km' => '04'
            , 'yh' => '05'
            , 'ss' => '07'
            , 'nh' => '11'
            , 'nh2' => '12'
            , 'ch' => '16'
            , 'wr' => '20'
            , 'sh' => '26'
            , 'jh' => '21'
            , 'shjh' => '88'
            , 'sc' => '23'
            , 'hn' => '81'
            , 'hn2' => '25'
            , 'hc' => '27'
            , 'dk' => '31'
            , 'bs' => '32'
            , 'kj' => '34'
            , 'jj' => '35'
            , 'jb' => '37'
            , 'gw' => '38'
            , 'kn' => '39'
            , 'bc' => '41'
            , 'ct' => '53'
            , 'hks' => '54'
            , 'po' => '71'
            , 'ph' => '83'
            , 'ssg' => '87'
            , 'sl' => '64'
            , 'sk' => '45'
            , 'sj' => '50'
            , 'kbk'=> '89'
            , 'kko' => '90'
        ];

        return $BankCode[$code] ?? '';
    }

    public function getDeliveryCode($code)
    {
        $deliveryCode = [
            //'' => '9999'        //기타택배
            '18' => 'korex'       //CJ대한통운
            , '10' => 'kgbps'        //KGB택배
            //, '' => 'registpost'    //우편등기
            , '13' => 'hanjin'        //한진택배
            , '25' => 'chunil'        //천일택배
            , '23' => 'ilyang'       //일양로지스
            , '42' => 'cvsnet'       // 편의점택배
            , '05' => 'kgb'           // 로젠택배
            , '12' => 'hyundai'       // 롯데택배(구.현대)
            , '01' => 'EPOST'        // 우체국택배
            , '18' => 'cjgls'         // CJ GLS
            , '21' => 'kdexp'         // 경동택배
            , '22' => 'daesin'        // 대신택배
            //, '' => 'honam'   // 우리택배(구.호남)
            , '26' => 'hdexp'          //합동택배
        ];

        return $deliveryCode[$code] ?? '9999';
    }

    private function getRefundPayMethod($method)
    {
        return $this->refundMethodMapping[$method] ?? '';
    }
}
