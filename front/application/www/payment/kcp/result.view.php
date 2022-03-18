<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

$pgName = 'kcp';

// Load Forbiz View
$view = getForbizView(true);

////////////////////////////
// 마스터 DB로 처리 START //
start_master_db();
////////////////////////////

$oid = $view->input->post('ordr_idxx');
$use_pay_method = $view->input->post('use_pay_method');
$res_cd = $view->input->post('res_cd');             // 인증결과 : 0000(성공)
$res_msg = $view->input->post('res_msg');              // 인증결과 메시지
$kakaopay_direct = $view->input->post('kakaopay_direct');
$payco_direct = $view->input->post('payco_direct');
$lpay_direct = $view->input->post('lpay_direct');
$naverpay_direct = $view->input->post('naverpay_direct');
$sspay_direct = $view->input->post('sspay_direct');
$ssgpay_direct = $view->input->post('ssgpay_direct');

if (substr_count($view->input->post('card_pay_method'), 'KAKAO_') > 0) { //모바일에서 kakao pay 구분값이 없음
    $kakaopay_direct = 'Y';
}
/* @var $paymentGatewayModel CustomMallPaymentGatewayModel */
$paymentGatewayModel = $view->import('model.mall.payment.gateway');
$paymentGatewayModel->init($pgName);

/* @var $orderModel CustomMallOrderModel */
$orderModel = $view->import('model.mall.order');
$products = $orderModel->getOrderProduct($oid);
$cartIxs = array_unique(array_column($products, 'cart_ix'));

if ($res_cd != '0000') {
    $paymentGatewayModel->paymentFail($res_msg);
    exit;
}

//결제 승인 요청
if ($kakaopay_direct == 'Y') {
    $method = ORDER_METHOD_INAPP_KAKAOPAY;
} else if ($payco_direct == 'Y') {
    $method = ORDER_METHOD_INAPP_PAYCO;
} else if ($lpay_direct == 'Y') {
    $method = ORDER_METHOD_INAPP_LPAY;
} else if ($naverpay_direct == 'Y') {
    $method = ORDER_METHOD_INAPP_NAVERPAY;
} else if ($sspay_direct == 'Y') {
    $method = ORDER_METHOD_INAPP_SSPAY;
} else if ($ssgpay_direct == 'Y') {
    $method = ORDER_METHOD_INAPP_SSGPAY;
} else {
    $method = $paymentGatewayModel->evalModuleMethod('getMethod', $view->input->post('pay_method'));
}

$mainPaymentInfo = $orderModel->getPaymentRowData($oid, $method);

$c_PayPlus = $paymentGatewayModel->paymentApply([
    'enc_data' => $view->input->post('enc_data')
    , 'enc_info' => $view->input->post('enc_info')
    , 'mony' => $mainPaymentInfo['payment_price'] //결제금액 유효성 검증 금액
    , 'tran_cd' => $view->input->post('tran_cd')
    , 'oid' => $oid
    , 'logPath' => $paymentGatewayModel->getLogPath()
    , 'method' => $method
]);

/* ============================================================================== */
/* =   05. 승인 결과 값 추출                                                    = */
/* = -------------------------------------------------------------------------- = */
$paySuccess = false;
if ($c_PayPlus->m_res_cd == "0000") {
    $paySuccess = true;

    $tid = $c_PayPlus->mf_get_res_data("tno"); // KCP 거래 고유 번호
    $amt = $c_PayPlus->mf_get_res_data("amount"); // KCP 실제 거래 금액
    $pay_method = $c_PayPlus->mf_get_res_data("pay_method"); // 카카오페이 결제수단
//    $pnt_issue = $c_PayPlus->mf_get_res_data("pnt_issue"); // 결제 포인트사 코드
//    $coupon_mny = $c_PayPlus->mf_get_res_data("coupon_mny"); // 쿠폰금액
    $receipt_yn = $view->input->post('cash_yn');

    $payment = [
        'settle_module' => $paymentGatewayModel->getModuleName()
        , 'tid' => $tid
        , 'escrow_use' => 'N'
        , 'receipt_yn' => $receipt_yn
    ];


    $memo = '';
    /* = -------------------------------------------------------------------------- = */
    /* =   05-1. 카카오페이 & 신용카드 승인 결과 처리                               = */
    /* = -------------------------------------------------------------------------- = */
    if ($kakaopay_direct == 'Y') {
        if ($pay_method == "PACA")   //카카오페이카드
        {
//        $card_cd = $c_PayPlus->mf_get_res_data("card_cd"); // 카드사 코드
            $card_name = $c_PayPlus->mf_get_res_data("card_name"); // 카드 종류
//        $app_time = $c_PayPlus->mf_get_res_data("app_time"); // 승인 시간
            $app_no = $c_PayPlus->mf_get_res_data("app_no"); // 승인 번호
//        $noinf = $c_PayPlus->mf_get_res_data("noinf"); // 무이자 여부 ( 'Y' : 무이자 )
            $quota = $c_PayPlus->mf_get_res_data("quota"); // 할부 개월 수
//        $partcanc_yn = $c_PayPlus->mf_get_res_data("partcanc_yn"); // 부분취소 가능유무
//        $card_bin_type_01 = $c_PayPlus->mf_get_res_data("card_bin_type_01"); // 카드구분1
//        $card_bin_type_02 = $c_PayPlus->mf_get_res_data("card_bin_type_02"); // 카드구분2
//        $card_mny = $c_PayPlus->mf_get_res_data("card_mny"); // 카드결제금액

            $method = ORDER_METHOD_INAPP_KAKAOPAY;
            $status = ORDER_STATUS_INCOM_COMPLETE;
            $memo = $card_name . "(" . $quota . ")";
            $payment['authcode'] = $app_no;

        } else if ($pay_method == "PAKM") // 카카오머니
        {
//        $kakaomny_mny = $c_PayPlus->mf_get_res_data("kakaomny_mny");
//        $app_kakaomny_time = $c_PayPlus->mf_get_res_data("app_kakaomny_time");
            $method = ORDER_METHOD_INAPP_KAKAOPAY;
            $status = ORDER_STATUS_INCOM_COMPLETE;
            $memo = "카카오머니";
        }
    } else if ($use_pay_method == "100000000000" || $payco_direct == 'Y' || $lpay_direct == 'Y'
        || $naverpay_direct == 'Y' || $sspay_direct == 'Y' || $ssgpay_direct == 'Y') {
//        $card_cd = $c_PayPlus->mf_get_res_data("card_cd"); // 카드사 코드
        $card_name = $c_PayPlus->mf_get_res_data("card_name"); // 카드 종류
//        $app_time = $c_PayPlus->mf_get_res_data("app_time"); // 승인 시간
        $app_no = $c_PayPlus->mf_get_res_data("app_no"); // 승인 번호
//        $noinf = $c_PayPlus->mf_get_res_data("noinf"); // 무이자 여부 ( 'Y' : 무이자 )
        $quota = $c_PayPlus->mf_get_res_data("quota"); // 할부 개월 수
//        $partcanc_yn = $c_PayPlus->mf_get_res_data("partcanc_yn"); // 부분취소 가능유무
//        $card_bin_type_01 = $c_PayPlus->mf_get_res_data("card_bin_type_01"); // 카드구분1
//        $card_bin_type_02 = $c_PayPlus->mf_get_res_data("card_bin_type_02"); // 카드구분2
//        $card_mny = $c_PayPlus->mf_get_res_data("card_mny"); // 카드결제금액

        if ($payco_direct == 'Y') {
            $method = ORDER_METHOD_INAPP_PAYCO;
        } else if ($lpay_direct == 'Y') {
            $method = ORDER_METHOD_INAPP_LPAY;
        } else if ($naverpay_direct == 'Y') {
            $method = ORDER_METHOD_INAPP_NAVERPAY;
        } else if ($sspay_direct == 'Y') {
            $method = ORDER_METHOD_INAPP_SSPAY;
        } else if ($ssgpay_direct == 'Y') {
            $method == ORDER_METHOD_INAPP_SSGPAY;
        } else {
            $method = ORDER_METHOD_CARD;
        }

        $status = ORDER_STATUS_INCOM_COMPLETE;
        $memo = $card_name . "(" . $quota . ")";
        $payment['authcode'] = $app_no;

        /* = -------------------------------------------------------------- = */
        /* =   05-1.1. 복합결제(포인트+신용카드) 승인 결과 처리               = */
        /* = -------------------------------------------------------------- = */
        if ($pnt_issue == "SCSK" || $pnt_issue == "SCWB") {
            $pnt_amount = $c_PayPlus->mf_get_res_data("pnt_amount"); // 적립금액 or 사용금액
//            $pnt_app_time = $c_PayPlus->mf_get_res_data("pnt_app_time"); // 승인시간
//            $pnt_app_no = $c_PayPlus->mf_get_res_data("pnt_app_no"); // 승인번호
//            $add_pnt = $c_PayPlus->mf_get_res_data("add_pnt"); // 발생 포인트
//            $use_pnt = $c_PayPlus->mf_get_res_data("use_pnt"); // 사용가능 포인트
//            $rsv_pnt = $c_PayPlus->mf_get_res_data("rsv_pnt"); // 총 누적 포인트
            $total_amount = $amt + $pnt_amount;                          // 복합결제시 총 거래금액

            $amt = $total_amount;
        }
    }

    /* = -------------------------------------------------------------------------- = */
    /* =   05-2. 계좌이체 승인 결과 처리                                            = */
    /* = -------------------------------------------------------------------------- = */
    if ($use_pay_method == "010000000000") {
//        $app_time = $c_PayPlus->mf_get_res_data("app_time");  // 승인 시간
        $bank_name = $c_PayPlus->mf_get_res_data("bank_name");  // 은행명
//        $bank_code = $c_PayPlus->mf_get_res_data("bank_code");  // 은행코드
//        $bk_mny = $c_PayPlus->mf_get_res_data("bk_mny"); // 계좌이체결제금액

        $method = ORDER_METHOD_ICHE;
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $memo = $bank_name;
    }

    /* = -------------------------------------------------------------------------- = */
    /* =   05-3. 가상계좌 승인 결과 처리                                            = */
    /* = -------------------------------------------------------------------------- = */
    if ($use_pay_method == "001000000000") {
        $bankname = $c_PayPlus->mf_get_res_data("bankname"); // 입금할 은행 이름
        $depositor = $c_PayPlus->mf_get_res_data("depositor"); // 입금할 계좌 예금주
        $account = $c_PayPlus->mf_get_res_data("account"); // 입금할 계좌 번호
        $va_date = $c_PayPlus->mf_get_res_data("va_date"); // 가상계좌 입금마감시간

        $method = ORDER_METHOD_VBANK;
        $status = ORDER_STATUS_INCOM_READY;
        $payment['bank'] = $bankname;
        $payment['bank_account_num'] = $account;
        $payment['bank_input_date'] = $va_date;
        $payment['bank_input_name'] = $depositor;
    }

    /* = -------------------------------------------------------------------------- = */
    /* =   05-4. 포인트 승인 결과 처리                                               = */
    /* = -------------------------------------------------------------------------- = */
//    if ($use_pay_method == "000100000000") {
//        $pnt_amount = $c_PayPlus->mf_get_res_data("pnt_amount"); // 적립금액 or 사용금액
//        $pnt_app_time = $c_PayPlus->mf_get_res_data("pnt_app_time"); // 승인시간
//        $pnt_app_no = $c_PayPlus->mf_get_res_data("pnt_app_no"); // 승인번호
//        $add_pnt = $c_PayPlus->mf_get_res_data("add_pnt"); // 발생 포인트
//        $use_pnt = $c_PayPlus->mf_get_res_data("use_pnt"); // 사용가능 포인트
//        $rsv_pnt = $c_PayPlus->mf_get_res_data("rsv_pnt"); // 적립 포인트
//    }

    /* = -------------------------------------------------------------------------- = */
    /* =   05-5. 휴대폰 승인 결과 처리                                              = */
    /* = -------------------------------------------------------------------------- = */
    if ($use_pay_method == "000010000000") {
//        $app_time = $c_PayPlus->mf_get_res_data("hp_app_time"); // 승인 시간
//        $commid = $c_PayPlus->mf_get_res_data("commid"); // 통신사 코드
        $mobile_no = $c_PayPlus->mf_get_res_data("mobile_no"); // 휴대폰 번호

        $method = ORDER_METHOD_PHONE;
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $memo = $mobile_no;
    }

    /* = -------------------------------------------------------------------------- = */
    /* =   05-6. 상품권 승인 결과 처리                                              = */
    /* = -------------------------------------------------------------------------- = */
//    if ($use_pay_method == "000000001000") {
//        $app_time = $c_PayPlus->mf_get_res_data("tk_app_time"); // 승인 시간
//        $tk_van_code = $c_PayPlus->mf_get_res_data("tk_van_code"); // 발급사 코드
//        $tk_app_no = $c_PayPlus->mf_get_res_data("tk_app_no"); // 승인 번호
//    }

    /* = -------------------------------------------------------------------------- = */
    /* =   05-7. 현금영수증 결과 처리                                               = */
    /* = -------------------------------------------------------------------------- = */
//    $cash_authno = $c_PayPlus->mf_get_res_data("cash_authno"); // 현금 영수증 승인 번호
//    $cash_no = $c_PayPlus->mf_get_res_data("cash_no"); // 현금 영수증 거래 번호

    $payment['pay_status'] = $status;
    $payment['memo'] = $memo;

    /* = -------------------------------------------------------------------------- = */
    /* =   05. 승인 결과 처리 END                                                   = */
    /* ============================================================================== */
    //문제발생시 로그는 오류 추적의 중요데이터 이므로 아래 소스를 이용 바랍니다.
    //**********************************************************************************
//    $logfile = fopen($paymentGatewayModel->getLogPath() . "/noti_" . date('Ymd') . ".log", "a+");
//    fwrite($logfile, "************************************************\r\n");
//    fwrite($logfile, "POST     : " . print_r($view->input->post(), true) . "\r\n");
//    fwrite($logfile, "payment     : " . print_r($payment, true) . "\r\n");
//    fclose($logfile);
    //**********************************************************************************
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
        $cancelData->taxAmt = $mainPaymentInfo['tax_price'];
        $cancelData->taxExAmt = $mainPaymentInfo['tax_free_price'];
        $cancelData->expectedRestAmt = 0;
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
    $resultMsg = $c_PayPlus->m_res_msg;
    $paymentGatewayModel->paymentFail($resultMsg);
    exit;
}