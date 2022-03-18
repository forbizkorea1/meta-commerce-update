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
//            $this->mid = 'nicepay00m';
//            $this->serviceKey = 'EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==';
//            $this->cancelPassword = "123456";
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

        if (ForbizConfig::getPaymentConfig('service_type', 'nicepay') != 'service') {
            if ($cancelData->method == ORDER_METHOD_INAPP_PAYCO) {
                $this->mid = 'paycot001m';
                $this->cancelPassword = '123456';
                $this->serviceKey = 't+j9YrQLJMeMAWgVv94VVJi/8t9Z8vzncUbPyINZ/aKg+hCAjj/nhBK2S2VuPet4pOzsfLaa7Nx35HpnjDqlDA==';
            } elseif($cancelData->method == ORDER_METHOD_INAPP_KAKAOPAY) {
                $this->mid = 'nickakao1m';
                $this->cancelPassword = '123456';
                $this->serviceKey = 'A2SY4ztPs6LPymgFl/5bbsLuINyvgKq5eOdDSHb31gdO4dfGr3O6hBxvRp9oXdat45VninNUySc7E/5UT01vKw==';
            } else if ($cancelData->method == ORDER_METHOD_INAPP_SSPAY) {
                $this->mid = 'nicessp01m';
                $this->cancelPassword = '123456';
                $this->serviceKey = 'tzTm144xeKLJzDtYUefi5Z1xMRCby31z3VZj4mmSnNLkGhk6UXTcHxiOoO3056/OPCe0R4b8suqzMQYhi/4K+w==';
            } else if ($cancelData->method == ORDER_METHOD_INAPP_SKPAY) {
                $this->mid = 'nictest00m';
                $this->cancelPassword = '123456';
                $this->serviceKey = '33F49GnCMS1mFYlGXisbUDzVf2ATWCl9k3R++d5hDd3Frmuos/XLx8XhXpe+LDYAbpGKZYSwtlyyLOtS/8aD7A==';
            } else if ($cancelData->method == ORDER_METHOD_INAPP_NAVERPAY) {
                $this->mid = 'nicnaver0m';
                $this->cancelPassword = '123456';
                $this->serviceKey = 'kNuUIpYvHPGcTTlmRsFddsqp6P9JoTcEcoRB1pindAwCZ0oySNuCQX5Zv483XTU5UuRiy/VYZ9BXw1BRvEUYMg==';
            }
        }

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
