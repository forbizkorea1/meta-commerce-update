<?php
/**
 * Created by PhpStorm.
 * User: JiHoon
 * Date: 2019-06-24 024
 * Time: 오전 10:41
 */

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
//**********************************************************************************
//문제발생시 로그는 오류 추적의 중요데이터 이므로 아래 소스를 이용 바랍니다.
//**********************************************************************************
//$logfile = fopen($paymentGatewayModel->getLogPath() . "/vacct_noti_" . date('Ymd') . ".log", "a+");
//fwrite($logfile, "************************************************\r\n");
//fwrite($logfile, "POST     : " . print_r($view->input->post(), true) . "\r\n");
//fclose($logfile);

$TEMP_IP = $view->input->server('REMOTE_ADDR');
$PG_IP = substr($TEMP_IP, 0, 10);

if ($PG_IP == "203.238.37" || $PG_IP == "39.115.212" || $PG_IP == "183.109.71") {

    /* @var $orderModel CustomMallOrderModel */
    $orderModel = $view->import('model.mall.order');

    $TID = $view->input->post('no_tid');                // 이니시스 거래번호
    $OID = $view->input->post('no_oid');                // 상점 주문번호
//    $BANK = $view->input->post('cd_bank');                // 은행코드
//    $DEAL = $view->input->post('cd_deal');                // 실제 입금은행 코드
//    $TRANSDATE = $view->input->post('dt_trans');        // 입금 일자
//    $TRANSTIME = $view->input->post('tm_trnas');        // 입금 시간
//    $VAACTNUM = $view->input->post('no_vacct');            // 가상계좌번호
    $INPUT = $view->input->post('amt_input');            // 입금액
//    $CHECK = $view->input->post('amt_check');            // 타행 자기앞수표 입금액
//    $FLGCLOSE = $view->input->post('flg_close');        // 마감구분
//    $CLCLOSE = $view->input->post('cl_close');            // 마감구분 ( 위 내용과 동일함 )
//    $TYPE = $view->input->post('type_msg');                // 거래구분 ( 0200: 정상, 0400: 취소 )
//    $INPUTBANK = $view->input->post('nm_inputbank');    // 예금주 은행
//    $INPUTNAME = $view->input->post('nm_input');        // 예금주
//    $INPUTSTD = $view->input->post('dt_inputstd');        // 입금 기준일
//    $CALCULSTD = $view->input->post('dt_calculstd');    // 정산 기준일
//    $TRANSBASE = $view->input->post('dt_transbase');    // 거래 기준일
//    $TRANS = $view->input->post('cl_trans');            // 거래구분코드 (1100)
//    $KOR = $view->input->post('cl_kor');                // 한글구분코드 ( 2: KSC5601 )
//    $CSHRDATE = $view->input->post('dt_cshr');            // 현금영수증 발급일자 ( 현금영수증 자동발급 설정 거래에 대하여 전달 됨 )
//    $CSHRTIME = $view->input->post('tm_cshr');            // 현금영수증 발급시간
//    $CSHRNO = $view->input->post('no_cshr_appl');        // 현금영수증 발급번호

    $tid = $TID;
    $oid = $OID;
    $amt = $INPUT;

    $payment = [
        'tid' => $tid
    ];

    $paymentInfo = $orderModel->getPaymentInfo($oid);
    $method = '';
    foreach ($paymentInfo as $key => $val) {
        if ($val['method'] == ORDER_METHOD_VBANK) {
            $method = ORDER_METHOD_VBANK;
            break;
        } else if ($val['method'] == ORDER_METHOD_ESCROW_VBANK) {
            unset($payment['tid']);
            $method = ORDER_METHOD_ESCROW_VBANK;
            break;
        }
    }

    if (!empty($method)) {
        $depositResult = $orderModel->deposit($oid, $method, $amt, $payment);

        if ($depositResult['result']) {
            //가상계좌 입금확인 이메일 보내기
            $view->event->trigger('depositSucessVbank', ['oid' => $oid]);
            echo "OK"; //절대로 지우지 마세요
        } else {
            echo "FAIL";
        }
    } else {
        echo "FAIL";
    }

}