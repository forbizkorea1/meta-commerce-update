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

$TEMP_IP = $view->input->server('REMOTE_ADDR');
$PG_IP = substr($TEMP_IP, 0, 10);

if ($PG_IP == "118.129.210" || $PG_IP == "183.109.71" || $PG_IP == "203.238.37")    //PG에서 보냈는지 IP로 체크
{
    /* @var $paymentGatewayModel CustomMallPaymentGatewayModel */
    $paymentGatewayModel = $view->import('model.mall.payment.gateway');
    /* @var $orderModel CustomMallOrderModel */
    $orderModel = $view->import('model.mall.order');
    $paymentGatewayModel->init($pgName);

    // 이니시스 NOTI 서버에서 받은 Value
    $P_TID;                // 거래번호
    $P_MID;                // 상점아이디
    $P_AUTH_DT;            // 승인일자
    $P_STATUS;            // 거래상태 (00:성공, 01:실패)
    $P_TYPE;            // 지불수단
    $P_OID;                // 상점주문번호
    $P_FN_CD1;            // 금융사코드1
    $P_FN_CD2;            // 금융사코드2
    $P_FN_NM;            // 금융사명 (은행명, 카드사명, 이통사명)
    $P_AMT;                // 거래금액
    $P_UNAME;            // 결제고객성명
    $P_RMESG1;            // 결과코드
    $P_RMESG2;            // 결과메시지
    $P_NOTI;            // 노티메시지(상점에서 올린 메시지)
    $P_AUTH_NO;            // 승인번호


    $P_TID = $view->input->post('P_TID');
    $P_MID = $view->input->post('P_MID');
    $P_AUTH_DT = $view->input->post('P_AUTH_DT');
    $P_STATUS = $view->input->post('P_STATUS');
    $P_TYPE = $view->input->post('P_TYPE');
    $P_OID = $view->input->post('P_OID');
    $P_FN_CD1 = $view->input->post('P_FN_CD1');
    $P_FN_CD2 = $view->input->post('P_FN_CD2');
    $P_FN_NM = $view->input->post('P_FN_NM');
    $P_AMT = $view->input->post('P_AMT');
    $P_UNAME = $view->input->post('P_UNAME');
    $P_RMESG1 = $view->input->post('P_RMESG1');
    $P_RMESG2 = $view->input->post('P_RMESG2');
    $P_NOTI = $view->input->post('P_NOTI');
    $P_AUTH_NO = $view->input->post('P_AUTH_NO');

    //WEB 방식의 경우 가상계좌 채번 결과 무시 처리
    //(APP 방식의 경우 해당 내용을 삭제 또는 주석 처리 하시기 바랍니다.)
    if ($P_TYPE == "VBANK")    //결제수단이 가상계좌이며
    {
        if ($P_STATUS != "02") //입금통보 "02" 가 아니면(가상계좌 채번 : 00 또는 01 경우)
        {
            echo "OK";
            exit;
        }
    }

    if ($P_STATUS == '01') { // 결제실패
        echo "FAIL";
        exit;
    }

    $oid = $P_OID;
    $amt = $P_AMT;
    $tid = $P_TID;
    $method = $P_NOTI;
    $authcode = $P_AUTH_NO;

    if ($method == ORDER_METHOD_VBANK || $method == ORDER_METHOD_ESCROW_VBANK) { //가상계좌 에스크로다상계좌
        //모바일 가상계좌는 입금확인시 noti 로주기 때문에 deposit 함수로 처리
        $payment = [];
        if ($method == ORDER_METHOD_VBANK)
        {
            $payment['tid'] = $tid;
        }

        $depositResult = $orderModel->deposit($oid, $method, $amt, $payment);
    } else {
        echo "FAIL";
        exit;
    }
    /***********************************************************************************
     * ' 위에서 상점 데이터베이스에 등록 성공유무에 따라서 성공시에는 "OK"를 이니시스로 실패시는 "FAIL" 을
     * ' 리턴하셔야합니다. 아래 조건에 데이터베이스 성공시 받는 FLAG 변수를 넣으세요
     * ' (주의) OK를 리턴하지 않으시면 이니시스 지불 서버는 "OK"를 수신할때까지 계속 재전송을 시도합니다
     * ' 기타 다른 형태의 echo "" 는 하지 않으시기 바랍니다
     * '***********************************************************************************/
    if ($depositResult['result']) {
        echo "OK"; //절대로 지우지 마세요
        exit;
    } else {
        //PG 취소
        $cancelData = new PgForbizCancelData();
        $cancelData->isPartial = false;
        $cancelData->oid = $oid;
        $cancelData->method = $method;
        $cancelData->amt = $amt;
        $cancelData->message = $depositResult['message'];
        $cancelData->tid = $tid;
        $response = $paymentGatewayModel->requestCancel($cancelData);
        if ($response['result']) {

            //실패시 주문정보 처리
            $orderModel->paymentFail($oid, $depositResult['message']);

            echo "OK";
        } else {
            echo "FAIL";
        }
        exit;
    }
}