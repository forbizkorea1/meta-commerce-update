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
$paymentGatewayModel->init($pgName);

/* @var $orderModel CustomMallOrderModel */
$orderModel = $view->import('model.mall.order');
$products = $orderModel->getOrderProduct($view->input->post('orderNumber'));
$cartIxs = array_unique(array_column($products, 'cart_ix'));

$resultCode = $view->input->post('resultCode');
$resultMsg = '';
if ($resultCode != '0000') {
    $resultMsg = '[' . $resultCode . '] 주문실패 \n' . $view->input->post('resultMsg');
    $paymentGatewayModel->paymentFail($resultMsg);
    exit;
}

/*
 * ******************************************************
 * <결제 승인 요청>
 * ******************************************************
 */
$applyResult = $paymentGatewayModel->paymentApply($view->input->post());

/*
 * ******************************************************
 * <결제 성공 여부 확인>
 * ******************************************************
 */
if ($applyResult['result'] === true) {

    $applyData = $applyResult['data'];
    $tid = $applyData['tid']; // 거래 번호
    $amt = $applyData['TotPrice']; // 결제결과 금액
    $oid = $applyData['MOID']; // 주문 번호
    $authcode = $applyData['applNum'] ?? ''; // 승인번호
    $method = $view->input->post('merchantData');

    $payment = [
        'settle_module' => $paymentGatewayModel->getModuleName()
        , 'oid' => $oid
        , 'tid' => $tid
        , 'authcode' => $authcode
        , 'escrow_use' => 'N'
    ];

    $payMethod = $applyData['payMethod']; // 결제방법(지불수단)

    if (in_array($method, [ORDER_METHOD_VBANK, ORDER_METHOD_ESCROW_VBANK])) { //가상계좌
        $status = ORDER_STATUS_INCOM_READY;
        $payment['bank'] = $applyData['vactBankName']; // 입금 은행명
        $payment['bank_account_num'] = $applyData['VACT_Num']; // 입금 계좌번호
        $payment['bank_input_date'] = $applyData['VACT_Date']; // 송금 일자
        $payment['bank_input_name'] = $applyData['VACT_Name']; // 예금주 명

        if ($method == ORDER_METHOD_ESCROW_VBANK) {
            $payment['escrow_use'] = 'Y';
        }
    } else if (in_array($method, [ORDER_METHOD_ICHE, ORDER_METHOD_ESCROW_ICHE, ORDER_METHOD_ASCROW, ORDER_METHOD_INAPP_KBANKPAY])) { //실시간계좌이체
        if (in_array($method, [ORDER_METHOD_ASCROW, ORDER_METHOD_ESCROW_ICHE])) {
            $payment['escrow_use'] = 'Y';
        }
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $payment['memo'] = $paymentGatewayModel->evalModuleMethod('getBankName', $applyData['ACCT_BankCode']);
    } else if ($method == ORDER_METHOD_PHONE) { //휴대폰
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $payment['memo'] = $applyData['HPP_Num']; // 휴대폰번호
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
        $cardName = $paymentGatewayModel->evalModuleMethod('getCardName', $applyData['CARD_Code']);
        $payment['memo'] = $cardName . "(" . $applyData['CARD_Quota'] . ")";
    } else {
        $status = '';
    }

    $payment['pay_status'] = $status;

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

        //DB오류로인한 PG 취소
        $cancelData = new PgForbizCancelData();
        $cancelData->isPartial = false;
        $cancelData->oid = $oid;
        $cancelData->amt = $amt;
        $cancelData->method = $method;
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
    $paymentGatewayModel->paymentFail("결제 오류 - " . $applyResult['message']);
    exit;
}