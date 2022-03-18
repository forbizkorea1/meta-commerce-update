<?php

/**
 * Description of PgForbizNicepay
 *
 * @author Hong
 */
class PgForbizNicepay extends PgForbiz
{

    /**
     * 가맹점 ID
     * @var type
     */
    private $mid;

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

    public function __construct($agentType)
    {
        parent::__construct($agentType);

        if (ForbizConfig::getPaymentConfig('service_type', 'nicepay') == 'service') {
            $this->mid = ForbizConfig::getPaymentConfig('mid', 'nicepay');
            $this->serviceKey = ForbizConfig::getPaymentConfig('service_key', 'nicepay');
            $this->cancelPassword = ForbizConfig::getPaymentConfig('cancel_pwd', 'nicepay');
        } else {
            $this->mid = ForbizConfig::getPaymentConfig('test_mid', 'nicepay');
            $this->serviceKey = ForbizConfig::getPaymentConfig('test_service_key', 'nicepay');
            $this->cancelPassword = ForbizConfig::getPaymentConfig('test_cancel_pwd', 'nicepay');
        }
    }

    public function doCancel(\PgForbizCancelData $cancelData, \PgForbizResponseData $responseData): \PgForbizResponseData
    {
        require_once APPLICATION_ROOT . '/payment/nicepay/lib/nicepay/web/NicePayWEB.php';
        require_once APPLICATION_ROOT . '/payment/nicepay/lib/nicepay/core/Constants.php';
        require_once APPLICATION_ROOT . '/payment/nicepay/lib/nicepay/web/NicePayHttpServletRequestWrapper.php';

        $requestData = [
            'MID' => $this->mid
            , 'TID' => $cancelData->tid
            , 'CancelAmt' => $cancelData->amt
            , 'CancelMsg' => $cancelData->message
            , 'CancelPwd' => $this->cancelPassword
            , 'PartialCancelCode' => ($cancelData->isPartial ? "1" : "0")
            , 'Moid' => $cancelData->oid
        ];

        $httpRequestWrapper = new NicePayHttpServletRequestWrapper($requestData);
        $_REQUEST = $httpRequestWrapper->getHttpRequestMap();
        $nicepayWEB = new NicePayWEB();

        $nicepayWEB->setParam("NICEPAY_LOG_HOME", $cancelData->logPath);             // 로그 디렉토리 설정
        $nicepayWEB->setParam("APP_LOG", "1");                           // 이벤트로그 모드 설정(0: DISABLE, 1: ENABLE)
        $nicepayWEB->setParam("EVENT_LOG", "1");                         // 어플리케이션로그 모드 설정(0: DISABLE, 1: ENABLE)
        $nicepayWEB->setParam("EncFlag", "S");                           // 암호화플래그 설정(N: 평문, S:암호화)
        $nicepayWEB->setParam("SERVICE_MODE", "CL0");                   // 서비스모드 설정(결제 서비스 : PY0 , 취소 서비스 : CL0)
        $nicepayWEB->setParam("CHARSET", "UTF8");                       // 인코딩

        /*
         * ******************************************************
         * <취소 결과 필드>
         * ******************************************************
         */
        $responseDTO = $nicepayWEB->doService($_REQUEST);
        $resultCode = $responseDTO->getParameter("ResultCode");        // 결과코드 (취소성공: 2001, 취소성공(LGU 계좌이체):2211)
        $resultMsg = $responseDTO->getParameterUTF("ResultMsg");      // 결과메시지
        $cancelAmt = $responseDTO->getParameter("CancelAmt");         // 취소금액
        $cancelDate = $responseDTO->getParameter("CancelDate");        // 취소일
        $cancelTime = $responseDTO->getParameter("CancelTime");        // 취소시간
        $cancelNum = $responseDTO->getParameter("CancelNum");         // 취소번호
        $payMethod = $responseDTO->getParameter("PayMethod");         // 취소 결제수단
        $mid = $responseDTO->getParameter("MID");               // 상점 ID
        $tid = $responseDTO->getParameter("TID");               // 거래아이디 TID

        $resultCode = trim($resultCode);

        if ($resultCode == '2001' || $resultCode == '2211') {
            $responseData->result = true;
        } else {
            $responseData->result = false;
            $responseData->message = trim($resultMsg);
        }
        return $responseData;
    }
}
