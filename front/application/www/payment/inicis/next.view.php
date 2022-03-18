<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

$pgName = 'inicis';

// Load Forbiz View
$view = getForbizView(true);

////////////////////////////
// 마스터 DB로 처리 START //
start_master_db();
////////////////////////////

/* @var $paymentGatewayModel CustomMallPaymentGatewayModel */
$paymentGatewayModel = $view->import('model.mall.payment.gateway');
/* @var $orderModel CustomMallOrderModel */
$orderModel = $view->import('model.mall.order');
$paymentGatewayModel->init($pgName);

$requestData = $view->input->post();
if (!isset($requestData['P_STATUS'])) {
    $requestData = $view->input->get();
}

if ($requestData['P_STATUS'] != '00') {
    $paymentGatewayModel->paymentFailGoCart($requestData['P_RMESG1']);
    exit;
}

//승인 요청
$applyResult = $paymentGatewayModel->evalModuleMethod('doMobileApply', $requestData);

//결제 처리
if ($applyResult['result']) {

    $applyData = $applyResult['data'];

    $oid = $applyData['P_OID'];
    $tid = $applyData['P_TID'];
    $amt = $applyData['P_AMT'];
    $method = $applyData['P_NOTI'];

    $payment = [
        'settle_module' => $paymentGatewayModel->getModuleName()
        , 'oid' => $oid
        , 'tid' => $tid
        , 'authcode' => $applyData['P_AUTH_NO']
        , 'escrow_use' => 'N'
    ];

    if ($method == ORDER_METHOD_VBANK) { //가상계좌
        $status = ORDER_STATUS_INCOM_READY;
        $payment['bank'] = $paymentGatewayModel->evalModuleMethod('getBankName', $applyData['P_VACT_BANK_CODE']);
        $payment['bank_account_num'] = $applyData['P_VACT_NUM']; // 입금 계좌번호
        $payment['bank_input_date'] = $applyData['P_VACT_DATE']; // 송금 일자
        $payment['bank_input_name'] = $applyData['P_VACT_NAME']; // 계좌주명
    } else if (in_array($method, [ORDER_METHOD_ICHE, ORDER_METHOD_ASCROW, ORDER_METHOD_INAPP_KBANKPAY])) { //실시간계좌이체
        if ($method == ORDER_METHOD_ASCROW) {
            $payment['escrow_use'] = 'Y';
        }
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $payment['memo'] = $paymentGatewayModel->evalModuleMethod('getBankName', $applyData['P_FN_CD1']);
    } else if ($method == ORDER_METHOD_PHONE) { //휴대폰
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $payment['memo'] = $applyData['P_HPP_NUM'];
    } else if (in_array($method,
        [ORDER_METHOD_CARD,
            ORDER_METHOD_INAPP_PAYCO,
            ORDER_METHOD_INAPP_KAKAOPAY,
            ORDER_METHOD_INAPP_SSPAY,
            ORDER_METHOD_INAPP_SSGPAY,
            ORDER_METHOD_INAPP_TOSS,
            ORDER_METHOD_INAPP_LPAY,
            ORDER_METHOD_INAPP_KPAY,
            ORDER_METHOD_INAPP_NAVERPAY])) { //카드
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $payment['memo'] = $applyData['P_FN_NM'] . ($applyData['CARD_Quota'] ? "(" . $applyData['CARD_Quota'] . ")" : '');
    } else {
        $status = '';
    }

    $products = $orderModel->getOrderProduct($oid);
    $cartIxs = array_unique(array_column($products, 'cart_ix'));

    $paymentResult = $orderModel->payment($oid, $method, $status, $amt, $payment);
    if ($paymentResult['result']) {
        //장바구니 삭제
        /* @var $cartModel CustomMallCartModel */
        $cartModel = $view->import('model.mall.cart');
        $cartModel->delete($cartIxs);

        $view->setFlashData('payment_oid', $oid);
        $view->event->trigger('payment', ['oid' => $oid]);
        $paymentGatewayModel->paymentSuccess($oid);
        exit;
    } else {
        $resultMsg = $paymentResult['message'];

        //DB오류로인한 PG 취소
        $cancelData = new PgForbizCancelData();
        $cancelData->isPartial = false;
        $cancelData->oid = $oid;
        $cancelData->method = $method;
        $cancelData->amt = $amt;
        $cancelData->message = $resultMsg;
        $cancelData->tid = $tid;
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
    $paymentGatewayModel->paymentFailGoCart("결제 오류 - " . $applyResult['message']);
    exit;
}