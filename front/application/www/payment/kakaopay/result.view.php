<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

$pgName = 'kakaoPay';

// Load Forbiz View
$view = getForbizView(true);

////////////////////////////
// 마스터 DB로 처리 START //
start_master_db();
////////////////////////////

/* @var $paymentGatewayModel CustomMallPaymentGatewayModel */
$paymentGatewayModel = $view->import('model.mall.payment.gateway');
$paymentGatewayModel->init($pgName);

/* @var $orderModel CustomMallOrderModel */
$orderModel = $view->import('model.mall.order');

$pgToken = $view->input->get('pg_token');
$orderNo = $view->input->get('orderNo');
$buyerId = $view->input->get('buyerId');

if (empty($pgToken)) {
    $paymentGatewayModel->paymentFail('결제 승인 실패');
    exit;
}

$products = $orderModel->getOrderProduct($orderNo);
$cartIxs = [];
foreach ($products as $product) {
    $cartIxs[] = $product['cart_ix'];
}
$cartIxs = array_unique($cartIxs);

//승인 요청
$response = $paymentGatewayModel->paymentApply([
    'orderNo' => $orderNo
    , 'pg_token' => $pgToken
    , 'buyerId' => !empty($buyerId) ? $buyerId : ' '
    , 'logPath' => $paymentGatewayModel->getLogPath()
]);

// 결제, 취소, 정기 결제 API 호출에 대한 고유번호, 각 API 호출 성공 시 발급
if (!empty($response->aid)) {
    /* @var $orderModel CustomMallOrderModel */
    $orderModel = $orderModel->import('model.mall.order');
    $paymentData = $orderModel->getPaymentRowData($orderNo, ORDER_METHOD_KAKAOPAY);

    $method = ORDER_METHOD_KAKAOPAY;
    $status = ORDER_STATUS_INCOM_COMPLETE;

    $tid = $response->tid;
    $authCode = $pgToken;
    $amt = $response->amount->total;
    $oid = $response->partner_order_id;

    $payment = [
        'settle_module' => $paymentGatewayModel->getModuleName()
        , 'tid' => $tid
        , 'authcode' => $pgToken
        , 'pay_status' => $status
        , 'escrow_use' => 'N'
    ];

    if ($response->payment_method_type == "MONEY")
    {
        $payment['memo'] = "카카오페이머니";
    } else if ($response->payment_method_type == "CARD")
    {
        $payment['memo'] = $response->card_info->purchase_corp . "(" . $response->card_info->install_month . ")";
    }

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

        $mainPaymentInfo = $orderModel->getPaymentRowData($oid, $method);

        //PG 취소
        $cancelData = new PgForbizCancelData();
        $cancelData->isPartial = false;
        $cancelData->oid = $oid;
        $cancelData->amt = $amt;
        $cancelData->message = $resultMsg;
        $cancelData->tid = $tid;
        $cancelData->taxAmt = $mainPaymentInfo['tax_price'];
        $cancelData->taxExAmt = $mainPaymentInfo['tax_free_price'];
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
    $paymentGatewayModel->paymentFail($response->msg);
}