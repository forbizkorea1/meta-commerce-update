<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

$pgName = 'nicepay';

// Load Forbiz View
$view = getForbizView(true);

////////////////////////////
// 마스터 DB로 처리 START //
start_master_db();
////////////////////////////
$easyPay = $view->getFlashData('param');
/* @var $paymentGatewayModel CustomMallPaymentGatewayModel */
$paymentGatewayModel = $view->import('model.mall.payment.gateway');
$paymentGatewayModel->init($pgName);

/* @var $orderModel CustomMallOrderModel */
$orderModel = $view->import('model.mall.order');
$products = $orderModel->getOrderProduct($view->input->post('Moid'));
$cartIxs = array_unique(array_column($products, 'cart_ix'));

$authResultCode = $_REQUEST['AuthResultCode'];             // 인증결과 : 0000(성공)
$authResultMsg = $_REQUEST['AuthResultMsg'];              // 인증결과 메시지

if ($authResultCode != '0000') {
    $paymentGatewayModel->paymentFail($authResultMsg);
    exit;
}

$_REQUEST['logPath'] = $paymentGatewayModel->getLogPath();
$responseDTO = $paymentGatewayModel->paymentApply($_REQUEST);

/*
 * ******************************************************
 * <결제 결과 필드>
 * 아래 응답 데이터 외에도 전문 Header와 개별부 데이터 Get 가능
 * ******************************************************
 */
$resultCode = $responseDTO->getParameter("ResultCode");     // 결과코드 (정상 결과코드:3001)
$resultMsg = $responseDTO->getParameterUTF("ResultMsg");   // 결과메시지
$payMethod = $responseDTO->getParameter("PayMethod");       // 결제방법
$authDate = $responseDTO->getParameter("AuthDate");       // 승인일시 (YYMMDDHH24mmss)
$authCode = $responseDTO->getParameter("AuthCode");       // 승인번호
$buyerName = $responseDTO->getParameterUTF("BuyerName");   // 구매자명
$mallUserID = $responseDTO->getParameter("MallUserID");     // 회원사고객ID
$goodsName = $responseDTO->getParameterUTF("GoodsName");   // 상품명
$mid = $responseDTO->getParameter("MID");            // 상점ID
$tid = $responseDTO->getParameter("TID");            // 거래ID
$moid = $responseDTO->getParameter("Moid");           // 주문번호
$amt = $responseDTO->getParameter("Amt");            // 금액
$cardQuota = $responseDTO->getParameter("CardQuota");      // 카드 할부개월 (00:일시불,02:2개월)
$cardCode = $responseDTO->getParameter("CardCode");       // 결제카드사코드
$cardName = $responseDTO->getParameterUTF("CardName");    // 결제카드사명
$bankCode = $responseDTO->getParameter("BankCode");       // 은행코드
$bankName = $responseDTO->getParameterUTF("BankName");    // 은행명
$rcptType = $responseDTO->getParameter("RcptType");       // 현금 영수증 타입 (0:발행되지않음,1:소득공제,2:지출증빙)
$rcptAuthCode = $responseDTO->getParameter("RcptAuthCode");   // 현금영수증 승인번호
$carrier = $responseDTO->getParameter("Carrier");        // 이통사구분
$dstAddr = $responseDTO->getParameter("DstAddr");        // 휴대폰번호
$vbankBankCode = $responseDTO->getParameter("VbankBankCode");  // 가상계좌은행코드
$vbankBankName = $responseDTO->getParameterUTF("VbankBankName");  // 가상계좌은행명
$vbankNum = $responseDTO->getParameter("VbankNum");       // 가상계좌번호
$vbankExpDate = $responseDTO->getParameter("VbankExpDate");   // 가상계좌입금예정일

$payMethod = trim($payMethod);
$oid = $moid;
/*
 * ******************************************************
 * <결제 성공 여부 확인>
 * ******************************************************
 */
$paySuccess = false;
$payment = [
    'settle_module' => $paymentGatewayModel->getModuleName()
    , 'tid' => $tid
    , 'authcode' => $authCode
    , 'escrow_use' => 'N'
];
$cardQuotaText = "";
if($cardQuota == '00'){
    $cardQuotaText = "일시불";
}else{
    $cardQuotaText = (int)$cardQuota."개월";
}
if ($payMethod == "CARD") {
    if ($easyPay == 'kakao') {
        $method = ORDER_METHOD_INAPP_KAKAOPAY;
    } else if ($easyPay == 'samsung') {
        $method = ORDER_METHOD_INAPP_SSPAY;
    } else if ($easyPay == 'payco') {
        $method = ORDER_METHOD_INAPP_PAYCO;
    } else if ($easyPay == 'ssg') {
        $method = ORDER_METHOD_INAPP_SSGPAY;
    } else if ($easyPay == 'naver') {
        $method = ORDER_METHOD_INAPP_NAVERPAY;
    } else if ($easyPay == 'skpay') {
        $method = ORDER_METHOD_INAPP_SKPAY;
    } else if ($easyPay == 'lpay') {
        $method = ORDER_METHOD_INAPP_LPAY;
    } else {
        $method = ORDER_METHOD_CARD;
    }
    $status = ORDER_STATUS_INCOM_COMPLETE;
    $payment['memo'] = $cardName . "(" . $cardQuotaText . ")";
    if ($resultCode == "3001")
        $paySuccess = true;               // 신용카드(정상 결과코드:3001)
} else if ($payMethod == "BANK") {
    $method = ORDER_METHOD_ICHE;
    $status = ORDER_STATUS_INCOM_COMPLETE;
    $payment['memo'] = $bankName;
    if ($resultCode == "4000")
        $paySuccess = true;               // 계좌이체(정상 결과코드:4000)
} else if ($payMethod == "CELLPHONE") {
    $method = ORDER_METHOD_PHONE;
    $status = ORDER_STATUS_INCOM_COMPLETE;
    $payment['memo'] = $dstAddr;
    if ($resultCode == "A000")
        $paySuccess = true;               // 휴대폰(정상 결과코드:A000)
} else if ($payMethod == "VBANK") {
    $method = ORDER_METHOD_VBANK;
    $status = ORDER_STATUS_INCOM_READY;
    $payment['bank'] = $vbankBankName;
    $payment['bank_account_num'] = $vbankNum;
    $payment['bank_input_date'] = $vbankExpDate;
    $payment['bank_input_name'] = ForbizConfig::getCompanyInfo('com_name');
    if ($resultCode == "4100")
        $paySuccess = true;               // 가상계좌(정상 결과코드:4100)
}
//else if ($payMethod == "SSG_BANK") {
//    if ($resultCode == "0000")
//        $paySuccess = true;               // SSG은행계좌(정상 결과코드:0000)
//}

$payment['pay_status'] = $status;

if ($paySuccess) {
    //결제 처리
    $paymentResult = $orderModel->payment($oid, $method, $status, $amt, $payment);
    if ($paymentResult['result']) {
        //장바구니 삭제
        /* @var $cartModel CustomMallCartModel */
        $cartModel = $view->import('model.mall.cart');
        $cartModel->delete($cartIxs);

        $view->setFlashData('payment_oid', $oid);
        //SMS & 메일 보내기
        $view->event->trigger('payment', ['oid' => $oid]);
        $paymentGatewayModel->paymentSuccess($oid);
        exit;
    } else {
        $resultMsg = $paymentResult['message'];

        //PG 취소
        $cancelData = new PgForbizCancelData();
        $cancelData->isPartial = false;
        $cancelData->oid = $oid;
        $cancelData->amt = $amt;
        $cancelData->message = $resultMsg;
        $cancelData->tid = $tid;
        $cancelData->logPath = $paymentGatewayModel->getLogPath();
        $response = $paymentGatewayModel->requestCancel($cancelData);
        if ($response['result']) {
            $resultMsg .= "(PG 취소 완료)";
        } else {
            $resultMsg .= "(PG 취소 실패 - " . $response['message'] . ")";
        }

        //실패시 주문정보 처리
        $orderModel->paymentFail($oid, $resultMsg);

        $paymentGatewayModel->paymentFail($resultMsg);
        exit;
    }
} else {
    $paymentGatewayModel->paymentFail($resultMsg);
    exit;
}