<?php

/**
 * Description of PgForbizInicis
 *
 * @author Lee
 * INIpay Standard 버전
 */
class PgForbizInicis extends PgForbiz
{
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

    public function __construct($agentType)
    {
        parent::__construct($agentType);

        $this->homePath = __DIR__ . '/inicis';

        if (ForbizConfig::getPaymentConfig('service_type', 'inicis') == 'service') {
            // 결제 유형
            $inicis_type = ForbizConfig::getPaymentConfig('inicis_type', 'inicis');
            $this->iniapiKey = ForbizConfig::getPaymentConfig('iniapi_key', 'inicis');

            if ($inicis_type == 'sin_escrow')  // 신에스크로
            {
                $this->mid = ForbizConfig::getPaymentConfig('mid', 'inicis');
                $this->escrowMid = $this->mid;
            } else { //구에스크로
                $this->mid = ForbizConfig::getPaymentConfig('mid', 'inicis');
                $this->escrowMid = ForbizConfig::getPaymentConfig('escrow_mid', 'inicis');
            }
            $this->cancelPassword = ForbizConfig::getPaymentConfig('cancel_pwd', 'inicis');
        }
    }

    public function doCancel(PgForbizCancelData $cancelData, PgForbizResponseData $responseData): PgForbizResponseData
    {
        require_once __DIR__ . '/inicis/libs/INILib.php';

        $inipay = new INIpay50;

        /* * *******************
         * 3. 취소 정보 설정 *
         * ******************* */
        $inipay->SetField("inipayhome", $this->homePath); // 이니페이 홈디렉터리(상점수정 필요)
        $inipay->SetField("debug", "false");                             // 로그모드("true"로 설정하면 상세로그가 생성됨.)
        $inipay->SetField("mid", $this->mid);                                 // 상점아이디

        if ($cancelData->method == ORDER_METHOD_ESCROW_VBANK || $cancelData->method == ORDER_METHOD_ESCROW_ICHE)
        {
            $inipay->SetField("mid", $this->escrowMid);                                 // 에스크로 상점아이디
        }

        if ($cancelData->isPartial) {//부분취소
            if ($cancelData->method == ORDER_METHOD_VBANK || $cancelData->method == ORDER_METHOD_ESCROW_VBANK) {
                $payMethod = "virtual-part";
            } else {
                $payMethod = "card-part";
            }
        } else {//전체취소
            if ($cancelData->method == ORDER_METHOD_VBANK || $cancelData->method == ORDER_METHOD_ESCROW_VBANK) {
                $payMethod = "virtual-all";
            } else {
                $payMethod = "card-all";
            }
        }

        $inipay->SetField("type", $payMethod);                            // 고정 (절대 수정 불가)

        if (in_array($payMethod, ['virtual-all', 'virtual-part', 'card-part'])) {
            $rbankCode = $this->getBankCodeByForbizBankCode($cancelData->bankCode);
            $racctName = iconv("UTF-8", "EUC-KR", $cancelData->bankOwner);
        }

        switch ($payMethod) {
            case 'escrow' :
                $inipay->SetField("tid", $cancelData->tid); // 거래아이디
                //$inipay->SetField("mid", $this->mid); // 상점아이디
                $inipay->SetField("type", "escrow");                                    // 고정 (절대 수정 불가)
                $inipay->SetField("escrowtype", "dcnf");                                    // 고정 (절대 수정 불가)
                $inipay->SetField("dcnf_name", 'system');
                break;
            case 'virtual-all' :
                // Vcard ( or virtual ) - All Cancel
                $inipay->SetField("type", "refund");
                //$inipay->SetField("mid", $this->mid);
                $inipay->SetField("tid", $cancelData->tid);
                $inipay->SetField("racctnum", $cancelData->bankNumber);
                $inipay->SetField("rbankcode", $rbankCode);
                $inipay->SetField("racctname", $racctName);
                break;
            case 'virtual-part' :
                // Vcard ( or virtual ) - Part Cancel
                $inipay->SetField("type", "vacctrepay");
                $inipay->SetField("pgid", "INIphpRPAY");
                $inipay->SetField("subpgip", "203.238.3.10");
                //$inipay->SetField("mid", $this->mid);
                $inipay->SetField("oldtid", $cancelData->tid);
                $inipay->SetField("currency", 'WON');
                $inipay->SetField("price", $cancelData->amt);
                $inipay->SetField("confirm_price", $cancelData->expectedRestAmt);
                $inipay->SetField("buyeremail", $cancelData->buyerEmail);
                $inipay->SetField("refundbankcode", $rbankCode);
                $inipay->SetField("refundacctnum", $this->bankNumber);
                $inipay->SetField("refundacctname", $racctName);
                $inipay->SetField("refundflgremit", '0'); // 펌뱅킹 사용여부 ? || 가상계좌 부분환불 송금 처리 여부(1:송금환불사용) ?
                break;
            case 'card-all':
                // Card - All Cancel
                $inipay->SetField("type", "cancel");
                //$inipay->SetField("mid", $this->mid);
                $inipay->SetField("tid", $cancelData->tid);
                break;
            case 'card-part':
                // Card - Part Cancel
                $inipay->SetField("type", "repay");
                $inipay->SetField("pgid", "INIphpRPAY");      // 고정 (절대 수정 불가)
                $inipay->SetField("subpgip", "203.238.3.10");                // 고정
                //$inipay->SetField("mid", $this->mid);
                $inipay->SetField("oldtid", $cancelData->tid);
                $inipay->SetField("currency", 'WON');
                $inipay->SetField("price", $cancelData->amt);
                $inipay->SetField("confirm_price", $cancelData->expectedRestAmt);
                $inipay->SetField("buyeremail", $cancelData->buyerEmail);
                if (in_array($rbankCode, ['04'])) {
                    $inipay->SetField('no_acct', $this->bankNumber);
                    $inipay->SetField('nm_acct', $racctName);
                }
                break;
            default :
                break;
        }
        /* * ************************************************************************************************
         * admin 은 키패스워드 변수명입니다. 수정하시면 안됩니다. 1111의 부분만 수정해서 사용하시기 바랍니다.
         * 키패스워드는 상점관리자 페이지(https://iniweb.inicis.com)의 비밀번호가 아닙니다. 주의해 주시기 바랍니다.
         * 키패스워드는 숫자 4자리로만 구성됩니다. 이 값은 키파일 발급시 결정됩니다.
         * 키패스워드 값을 확인하시려면 상점측에 발급된 키파일 안의 readme.txt 파일을 참조해 주십시오.
         * ************************************************************************************************ */
        $inipay->SetField("admin", $this->cancelPassword);
        $inipay->SetField("cancelmsg", $cancelData->message); // 취소사유

        /* * **************
         * 4. 취소 요청 *
         * ************** */
        $inipay->startAction();

        /* * **************************************************************
         * 5. 취소 결과                                           	*
         *                                                        	*
         * 결과코드 : $inipay->getResult('ResultCode') ("00"이면 취소 성공)  	*
         * 결과내용 : $inipay->getResult('ResultMsg') (취소결과에 대한 설명) 	*
         * 취소날짜 : $inipay->getResult('CancelDate') (YYYYMMDD)          	*
         * 취소시각 : $inipay->getResult('CancelTime') (HHMMSS)            	*
         * 현금영수증 취소 승인번호 : $inipay->getResult('CSHR_CancelNum')    *
         * (현금영수증 발급 취소시에만 리턴됨)                          *
         * ************************************************************** */
        if ($inipay->getResult('ResultCode') == '00') {
            $responseData->result = true;
        } else {
            $responseData->result = false;
            $responseData->message = trim(iconv('euc-kr', 'utf-8', $inipay->getResult('ResultMsg')));
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
}
