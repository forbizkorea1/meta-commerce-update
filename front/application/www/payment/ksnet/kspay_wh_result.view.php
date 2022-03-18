<?php
if (function_exists("mb_http_input")) mb_http_input("utf-8");
if (function_exists("mb_http_output")) mb_http_output("utf-8");
include __DIR__ . "/KSPayWebHost.inc";

$rcid       = $_POST['reWHCid'];
$rctype     = $_POST['reWHCtype'];
$rhash      = $_POST['reWHHash'];

$authyn   = "";
$trno     = "";
$trddt		= "";
$trdtm		= "";
$amt      = "";
$authno   = "";
$msg1     = "";
$msg2     = "";
$ordno		= "";
$isscd		= "";
$aqucd		= "";
$temp_v		= "";
$result		= "";
$halbu		= "";
$cbtrno   = "";
$cbauthno = "";
$resultcd = "";

//업체에서 추가하신 인자값을 받는 부분입니다
//$a = $_POST["a"];
//$b = $_POST["b"];
//$c = $_POST["c"];
//$d = $_POST["d"];

$ipg = new KSPayWebHost($rcid, null);

if ($ipg->kspay_send_msg("1"))  //KSNET 결제결과 중 아래에 나타나지 않은 항목이 필요한 경우 Null 대신 필요한 항목명을 설정할 수 있습니다.
{
    $authyn   = $ipg->kspay_get_value("authyn");
    $trno     = $ipg->kspay_get_value("trno"  );
    $trddt    = $ipg->kspay_get_value("trddt" );
    $trdtm    = $ipg->kspay_get_value("trdtm" );
    $amt      = $ipg->kspay_get_value("amt"   );
    $authno   = $ipg->kspay_get_value("authno");
    $msg1     = $ipg->kspay_get_value("msg1"  );
    $msg2     = $ipg->kspay_get_value("msg2"  );
    $ordno    = $ipg->kspay_get_value("ordno" );
    $isscd    = $ipg->kspay_get_value("isscd" );
    $aqucd    = $ipg->kspay_get_value("aqucd" );
    $temp_v   = "";
    $result   = $ipg->kspay_get_value("result");
    $halbu    = $ipg->kspay_get_value("halbu");
    $cbtrno   = $ipg->kspay_get_value("cbtrno");
    $cbauthno = $ipg->kspay_get_value("cbauthno");

    if (!empty($msg1)) $msg1 = iconv("EUC-KR", "UTF-8", $msg1);
    if (!empty($msg2)) $msg2 = iconv("EUC-KR", "UTF-8", $msg2);

    if (!empty($authyn) && 1 == strlen($authyn))
    {
        if ($authyn == "O") {
            // 정상승인
            $resultcd = "0000";
        }
        else {
            // 승인실패
            $resultcd = trim($authno);
        }
    }
}
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

$pgName = 'ksnet';

// Load Forbiz View
$view = getForbizView(true);

////////////////////////////
// 마스터 DB로 처리 START //
start_master_db();
////////////////////////////

$oid = $view->input->post('sndOrdernumber');
$sndEmail = $view->input->post('sndEmail');
$sndMobile = $view->input->post('sndMobile');
$vbankExpDate = $view->input->post('sndVirExpDt');

/* @var $paymentGatewayModel CustomMallPaymentGatewayModel */
$paymentGatewayModel = $view->import('model.mall.payment.gateway');
$paymentGatewayModel->init($pgName);
$response = $view->input->post();
$use_pay_method = $view->input->post('sndMetaPaymethod');
//$use_pay_method = $paymentGatewayModel->evalModuleMethod('getInAppPayMethod', $view->input->post('sndPaymethod'));

/* @var $orderModel CustomMallOrderModel */
$orderModel = $view->import('model.mall.order');
$products = $orderModel->getOrderProduct($view->input->post('sndOrdernumber'));
$cartIxs = array_unique(array_column($products, 'cart_ix'));

$authResultMessage = "승인실패";

if ($resultcd != "0000") {
    $paymentGatewayModel->paymentFail($authResultMessage);
    exit;
}

//결제 승인 요청
$method = $paymentGatewayModel->evalModuleMethod('getMethod', $view->input->post('sndPaymethod'));
$mainPaymentInfo = $orderModel->getPaymentRowData($oid, $method);


// 승인 결과 값 추출
$paySuccess = false;
if ($resultcd == "0000") {
    $paySuccess = true;

    // 응답데이터
    // 결과항목 - 공통항목
    $payment = [
        'authyn' => $authyn
        , 'settle_module' => $paymentGatewayModel->getModuleName()
        , 'tid' => $trno // 거래번호
        , 'trddt' => $trddt
        , 'trdtm' => $trdtm
        , 'amt' => $amt
        , 'msg1' => $msg1
        , 'msg2' => $msg2
        , 'ordno' => $ordno
        , 'result' => $result
        , 'resultcd' => $resultcd
    ];

    if ($use_pay_method == ORDER_METHOD_CARD) { // 신용카드, 카카오페이 - 신용이랑 같으면 sndStoreCeoName, sndStorePhoneNo, sndStoreAddresscnrk 추가 작업
        $payment['authno'] = $authno; // 승인번호 : 결제 성공시에만 보임
        $payment['isscd'] = $isscd; // 발급사코드
        $payment['aqucd'] = $aqucd; // 매입사코드

        $method = ORDER_METHOD_CARD;
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $memo = $paymentGatewayModel->evalModuleMethod('getCardName', rtrim($aqucd));
        $payment['authcode'] = $authno;
        
    } else if ($use_pay_method == ORDER_METHOD_INAPP_PAYCO
        || $use_pay_method == ORDER_METHOD_INAPP_KAKAOPAY
        || $use_pay_method == ORDER_METHOD_INAPP_NAVERPAY
        || $use_pay_method == ORDER_METHOD_INAPP_SSGPAY) { // 인앱 결제

        $payment['authno'] = $authno; // 승인번호 : 결제 성공시에만 보임
        $payment['isscd'] = $isscd; // 발급사코드
        $payment['aqucd'] = $aqucd; // 매입사코드

        switch($use_pay_method){
            case ORDER_METHOD_INAPP_PAYCO:
                $method = ORDER_METHOD_INAPP_PAYCO;
                break;
            case ORDER_METHOD_INAPP_KAKAOPAY:
                $method = ORDER_METHOD_INAPP_KAKAOPAY;
                break;
            case ORDER_METHOD_INAPP_NAVERPAY:
                $method = ORDER_METHOD_INAPP_NAVERPAY;
                break;
            case ORDER_METHOD_INAPP_SSGPAY:
                $method = ORDER_METHOD_INAPP_SSGPAY;
                break;
            default:
                break;
        }

        $status = ORDER_STATUS_INCOM_COMPLETE;
        $memo = $paymentGatewayModel->evalModuleMethod('getCardName', rtrim($aqucd));
        $payment['authcode'] = $authno;

    } else if ($use_pay_method == ORDER_METHOD_VBANK) { //가상계좌(에스크로) sndEscrow ="1"
        $payment['authno'] = $authno; // 은행코드
        $payment['isscd'] = $isscd; // 계좌번호

        $method = ORDER_METHOD_VBANK;
        $status = ORDER_STATUS_INCOM_READY;

        $payment['bank'] = $paymentGatewayModel->evalModuleMethod('getBankName', $authno);
        $payment['bank_account_num'] = $isscd;
        $payment['bank_input_name'] = ForbizConfig::getCompanyInfo('com_name');
        $memo = $paymentGatewayModel->evalModuleMethod('getBankName', $authno);
        $payment['bank_input_date'] = $vbankExpDate;

    } else if ($use_pay_method == ORDER_METHOD_ICHE) { //계좌이체 sndEscrow ="0"
        $payment['authno'] = $authno; // 은행코드

        $method = ORDER_METHOD_ICHE;
        $status = ORDER_STATUS_INCOM_COMPLETE;

        if (strlen($authno < 3)) {
            $memo = $paymentGatewayModel->evalModuleMethod('getBankName', $authno);
        } else {
            $memo = $paymentGatewayModel->evalModuleMethod('getBrokerageName', $authno);
        }


    } else if ($use_pay_method == ORDER_METHOD_PHONE) { //휴대폰결제
        $payment['aqucd'] = $aqucd; // 실물구분 : 1 - 실물 / 2 - 디지털

        $method = ORDER_METHOD_PHONE;
        $status = ORDER_STATUS_INCOM_COMPLETE;
        $memo = $sndMobile;
    }

    $payment['pay_status'] = $status;
    $payment['memo'] = $memo;

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
        $cancelData->tid = $trno;
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
}
