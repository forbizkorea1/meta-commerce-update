<?php
ob_start();
ob_implicit_flush(0);

//------------------------------------------------------------------------------
// FILE NAME : noty_url.php
// DATE : 2005-10-04
// 이페이지는 noty_url.php로 지정된 페이지로 오는 결과전문을 받고 수신응답을 하기위한 샘플페이지입니다.
//-------------------------------------------------------------------------------

function write_log ($strLogMsg)
{
    $LOG_HOME_DIR	= APPLICATION_ROOT . "/logs/ksnet/"; // 로그 경로 지정 (ex. C:/log/) ('/'로 끝나야 함)

    if (is_dir($LOG_HOME_DIR) === false) {
        mkdir($LOG_HOME_DIR, 0777, true);
    }

    if (empty($LOG_HOME_DIR) || "/" != substr($LOG_HOME_DIR,(strlen($LOG_HOME_DIR)-1))) return;

    $curr_time_14 = strftime("%Y%m%d%H:%M:%S");

    $strLogFile =	$LOG_HOME_DIR. "kspay_" . substr($curr_time_14,0,8) . ".log";

    $strRecord = "[" . substr($curr_time_14,8) . "]" . $strLogMsg . "\n";

    $fp	= fopen($strLogFile, "a");
    fwrite($fp,	$strRecord);
    fclose($fp);
}

// HTTP 통보의 경우 GET방식으로
// HTTPS 통보의 경우 POST방식으로 데이터를 전송하며
// data필드의 포멧은 URL-Encoded(EUC-KR)입니다.

$ipos = 0;
$ret = "false";

if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    $data = urldecode($_POST["data"]);
} else {
    $data = urldecode($_GET["data"]);
}

//KSNET에서 전송한 경우가 아니면 처리하지 않는다.
if ($_SERVER["REMOTE_ADDR"] != "210.181.28.114" && $_SERVER["REMOTE_ADDR"] != "210.181.29.130")
{
    write_log("ERROR:허가되지않은 IP=[" . $_SERVER["REMOTE_ADDR"] . "] msg=[" . $data . "]!!!");

    Header("Content-Length: 0");
    ob_end_flush();
    return;
}

if (strlen($data) < 300)
{
    write_log("ERROR:전문오류 msg=["  .  $data        .  "]");

    Header("Content-Length: 0");
    ob_end_flush();
    return;
}

write_log("data=[" . $data          . "]");

if (substr($data,$ipos,2) == "VR")                                   // 에코전문
{
    //deal_sele = 20 : 입금, 51 : 입금취소
    //중복체크 : deal_sele, cms_no, seq_no, deal_star_date, deal_star_time

    $busi_sele               = substr($data, $ipos,  2); $ipos +=  2;//  업무구분 - VR
    $rVTransactionNo         = substr($data, $ipos, 12); $ipos += 12;// *거래번호
    $deal_code               = substr($data, $ipos,  9); $ipos +=  9;//  식별(거래)코드
    $comp_code               = substr($data, $ipos,  8); $ipos +=  8;//  업체코드(대행업체인경우 SPACE)
    $acco_code               = substr($data, $ipos,  2); $ipos +=  2;// *모계좌은행코드
    $mess_code               = substr($data, $ipos,  4); $ipos +=  4;//  메시지코드
    $job_diff                = substr($data, $ipos,  3); $ipos +=  3;//  업무구분
    $tran_numb               = substr($data, $ipos,  1); $ipos +=  1;//  송신횟수
    $seq_no                  = substr($data, $ipos,  6); $ipos +=  6;// *전문번호
    $tran_date               = substr($data, $ipos,  8); $ipos +=  8;//  전송일자 - KSNET에서 입력
    $tran_time               = substr($data, $ipos,  6); $ipos +=  6;//  전송시간 - KSNET에서 입력
    $stan_resp_code          = substr($data, $ipos,  4); $ipos +=  4;//  응답코드 - KSNET 공통에러코드
    $bank_resp_code          = substr($data, $ipos,  4); $ipos +=  4;//  은행응답코드
    $inqu_date               = substr($data, $ipos,  8); $ipos +=  8;//  조회일자
    $inqu_no                 = substr($data, $ipos,  6); $ipos +=  6;//  조회번호
    $filler_1                = substr($data, $ipos, 31); $ipos += 31;//  예비
    $acco_numb               = substr($data, $ipos, 15); $ipos += 15;//  계좌번호 - 모계좌번호
    $comp_cnt                = substr($data, $ipos,  2); $ipos +=  2;//  조립건수
    $deal_sele               = substr($data, $ipos,  2); $ipos +=  2;// *거래구분
    $in_bank_cd              = substr($data, $ipos,  2); $ipos +=  2;//  송금자은행코드
    $total_amt               = substr($data, $ipos, 13); $ipos += 13;// *금액
    $bala_mone               = substr($data, $ipos, 13); $ipos += 13;//  잔액, 대행업체인 경우 ALL '0'
    $giro                    = substr($data, $ipos,  6); $ipos +=  6;//  입금점지로코드
    $rece_nm                 = substr($data, $ipos, 14); $ipos += 14;// *입금인 성명
    $chec_no                 = substr($data, $ipos, 10); $ipos += 10;//  수표번호
    $cash                    = substr($data, $ipos, 13); $ipos += 13;//  현금(현금_당좌수표)
    $out_bank_chec           = substr($data, $ipos, 13); $ipos += 13;//  타행수표금액
    $etc_chec                = substr($data, $ipos, 13); $ipos += 13;//  가계수표,기타
    $cms_no                  = substr($data, $ipos, 16); $ipos += 16;// *가상계좌번호(CMS NO)
    $deal_star_date          = substr($data, $ipos,  8); $ipos +=  8;// *거래일자
    $deal_star_time          = substr($data, $ipos,  6); $ipos +=  6;// *거래시간
    $acco_seri_no            = substr($data, $ipos,  6); $ipos +=  6;//  통장거래일련번호
    $filler_2                = substr($data, $ipos    );             //  예비

    $StoreId				 = substr($filler_2, 0,10 );// *상점아이디

// DB처리항목
// $rVTransactionNo, $acco_code, $seq_no, $deal_sele, $in_bank_cd, $total_amt, $rece_nm, $cms_no, $deal_star_date, $deal_star_time, $StoreId
// "INSERT INTO VIRT_HST (PG_DEAL_NUMB,PARE_ACCO_CODE,SEQ_NO,DEAL_SELE,CUST_ACCO_CODE,AMOUNT,RECE_NAME,VIRT_ACCO_NUMB,DEAL_DATE,DEAL_TIME,SHOP_ID,RECV_DATE,RECV_TIME) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
// CREATE TABLE   VIRT_HST
// (
//   PG_DEAL_NUMB    char (12)  NOT NULL,
//   PARE_ACCO_CODE  char (2)   NULL,
//   SEQ_NO          char (6)   NOT NULL,
//   DEAL_SELE       char (2)   NOT NULL,
//   CUST_ACCO_CODE  char (2)   NULL,
//   AMOUNT          int        NULL,
//   RECE_NAME       char (14)  NULL,
//   VIRT_ACCO_NUMB  char (16)  NOT NULL,
//   DEAL_DATE       char (8)   NOT NULL,
//   DEAL_TIME       char (6)   NOT NULL,
//   SHOP_ID         char (10)  NULL,
//   RECV_DATE       char (8)   NULL,
//   RECV_TIME       char (6)   NULL
// );
// create unique index pk_VIRT_HST on VIRT_HST (DEAL_DATE,DEAL_TIME,VIRT_ACCO_NUMB,DEAL_SELE,SEQ_NO);
// create index idx01_VIRT_HST on VIRT_HST (PG_DEAL_NUMB);
    if (!defined('BASEPATH'))
        exit('No direct script access allowed');

    $pgName = 'ksnet';

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

    $payment = [
        'tid' => $rVTransactionNo // 거래번호
    ];

    if ($deal_sele = "20") {

        $order =  $orderModel->getOrderDetailByTid($rVTransactionNo);
        $oid = $order->oid;
        $depositResult = $orderModel->deposit($oid, ORDER_METHOD_VBANK, $total_amt, $payment);

        if ($depositResult['result']) {
            //가상계좌 입금확인 이메일 보내기
            $view->event->trigger('depositSucessVbank', ['oid' => $oid]);
        }

    }

    write_log("TO_DB_OLD=[INSERT INTO VIRT_HST (PG_DEAL_NUMB,PARE_ACCO_CODE,SEQ_NO,DEAL_SELE,CUST_ACCO_CODE,AMOUNT,RECE_NAME,VIRT_ACCO_NUMB,DEAL_DATE,DEAL_TIME,SHOP_ID,RECV_DATE,RECV_TIME) VALUES('". $rVTransactionNo . "','" . $acco_code . "','" . $seq_no . "','" . $deal_sele . "','" . $in_bank_cd . "','" . $total_amt . "','" . $rece_nm . "','" . $cms_no . "','" . $deal_star_date . "','" . $deal_star_time . "','" . $StoreId ."',?,?)]");

    $ret = "OK";

}else if  (substr($data,$ipos  ,1) >= "0" && substr($data,$ipos  ,1) <= "9" &&                                 // 신PG 4byte길이
    substr($data,$ipos+1,1) >= "0" && substr($data,$ipos+1,1) <= "9" &&
    substr($data,$ipos+2,1) >= "0" && substr($data,$ipos+2,1) <= "9" &&
    substr($data,$ipos+3,1) >= "0" && substr($data,$ipos+3,1) <= "9")
{
    // 신PG 헤더
    $RecvLen                = substr($data, $ipos,  4); $ipos +=  4;
    $EncType                = substr($data, $ipos,  1); $ipos +=  1; //  0: 암화안함, 1:openssl, 2: seed
    $Version                = substr($data, $ipos,  4); $ipos +=  4; //  전문버전
    $VersionType            = substr($data, $ipos,  2); $ipos +=  2; //  구분
    $Resend                 = substr($data, $ipos,  1); $ipos +=  1; //  전송구분 : 0 : 처음,  2: 재전송
    $RequestDate            = substr($data, $ipos, 14); $ipos += 14; //  요청일자 : yyyymmddhhmmss
    $StoreId                = substr($data, $ipos, 10); $ipos += 10; // *상점아이디
    $OrderNumber            = substr($data, $ipos, 50); $ipos += 50; //  주문번호
    $UserName               = substr($data, $ipos, 50); $ipos += 50; //  주문자명
    $IdNum                  = substr($data, $ipos, 13); $ipos += 13; //  주민번호 or 사업자번호
    $Email                  = substr($data, $ipos, 50); $ipos += 50; //  email
    $GoodType               = substr($data, $ipos,  1); $ipos +=  1; //  제품구분 0 : 실물, 1 : 디지털
    $GoodName               = substr($data, $ipos, 50); $ipos += 50; //  제품명
    $KeyInType              = substr($data, $ipos,  1); $ipos +=  1; //  KeyInType 여부 : 1 : Swap, 2: KeyIn
    $LineType               = substr($data, $ipos,  1); $ipos +=  1; //  lineType 0 : offline, 1:internet, 2:Mobile
    $PhoneNo                = substr($data, $ipos, 12); $ipos += 12; //  휴대폰번호
    $ApprovalCount          = substr($data, $ipos,  1); $ipos +=  1; //  승인갯수
    $HeadFiller             = substr($data, $ipos, 35); $ipos += 35; //  예비

    if (substr($data,$ipos,2) == "50" || substr($data,$ipos,2) == "61")     // CMS입금/입금취소 가상계좌 입금/취소
    {
        //$deal_sele = 20 : 입금, 51 : 입금취소
        //중복체크 : $deal_sele, $cms_no, $seq_no, $deal_star_date, $deal_star_time

        $rApprovalType     = substr($data, $ipos,  4); $ipos +=   4;//  승인구분
        $rVTransactionNo   = substr($data, $ipos, 12); $ipos +=  12;// *거래번호
        $deal_code         = substr($data, $ipos,  9); $ipos +=   9;//  식별(거래)코드
        $comp_code         = substr($data, $ipos,  8); $ipos +=   8;//  업체코드(대행업체인경우 SPACE)
        $acco_code         = substr($data, $ipos,  6); $ipos +=   6;// *모계좌은행코드  2 -> 6 hyun
        $mess_code         = substr($data, $ipos,  4); $ipos +=   4;//  메시지코드
        $job_diff          = substr($data, $ipos,  3); $ipos +=   3;//  업무구분
        $tran_numb         = substr($data, $ipos,  1); $ipos +=   1;//  송신횟수
        $seq_no            = substr($data, $ipos, 10); $ipos +=  10;// *전문번호 6 -> 10  hyun
        $tran_date         = substr($data, $ipos,  8); $ipos +=   8;//  전송일자 - KSNET에서 입력
        $tran_time         = substr($data, $ipos,  6); $ipos +=   6;//  전송시간 - KSNET에서 입력
        $stan_resp_code    = substr($data, $ipos,  4); $ipos +=   4;//  응답코드 - KSNET 공통에러코드
        $bank_resp_code    = substr($data, $ipos,  4); $ipos +=   4;//  은행응답코드
        $inqu_date         = substr($data, $ipos,  8); $ipos +=   8;//  조회일자
        $inqu_no           = substr($data, $ipos,  6); $ipos +=   6;//  조회번호
        $filler_1          = substr($data, $ipos, 27); $ipos +=  27;//  예비       30 -> 27 hyun
        $acco_numb         = substr($data, $ipos, 15); $ipos +=  15;//  계좌번호 - 모계좌번호
        $comp_cnt          = substr($data, $ipos,  2); $ipos +=   2;//  조립건수
        $deal_sele         = substr($data, $ipos,  2); $ipos +=   2;// *거래구분
        $in_bank_cd        = substr($data, $ipos,  6); $ipos +=   6;//  송금자은행코드   2 -> 6 hyun
        $total_amt         = substr($data, $ipos, 13); $ipos +=  13;// *금액
        $bala_mone         = substr($data, $ipos, 13); $ipos +=  13;//  잔액, 대행업체인 경우 ALL '0'
        $giro              = substr($data, $ipos,  6); $ipos +=   6;//  입금점지로코드
        $rece_nm           = substr($data, $ipos, 14); $ipos +=  14;// *입금인 성명
        $chec_no           = substr($data, $ipos, 10); $ipos +=  10;//  수표번호
        $cash              = substr($data, $ipos, 13); $ipos +=  13;//  현금(현금_당좌수표)
        $out_bank_chec     = substr($data, $ipos, 13); $ipos +=  13;//  타행수표금액
        $etc_chec          = substr($data, $ipos, 13); $ipos +=  13;//  가계수표,기타
        $cms_no            = substr($data, $ipos, 16); $ipos +=  16;// *가상계좌번호(CMS NO)
        $deal_star_date    = substr($data, $ipos,  8); $ipos +=   8;// *거래일자
        $deal_star_time    = substr($data, $ipos,  6); $ipos +=   6;// *거래시간
        $acco_seri_no      = substr($data, $ipos,  6); $ipos +=   6;//  통장거래일련번호
        $filler_2          = substr($data, $ipos    );              //  예비

        $acco_code = trim($acco_code);
        if (strlen($acco_code) == 3) $acco_code = substr($acco_code,1);

        $seq_no = substr($seq_no,4);

        $in_bank_cd = trim($in_bank_cd);
        if (strlen($in_bank_cd) == 3) $in_bank_cd = substr($in_bank_cd,1);

// DB처리항목
// $rVTransactionNo, $acco_code, $seq_no, $deal_sele, $in_bank_cd, $total_amt, $rece_nm, $cms_no, $deal_star_date, $deal_star_time, $StoreId
// "INSERT INTO VIRT_HST (PG_DEAL_NUMB,PARE_ACCO_CODE,SEQ_NO,DEAL_SELE,CUST_ACCO_CODE,AMOUNT,RECE_NAME,VIRT_ACCO_NUMB,DEAL_DATE,DEAL_TIME,SHOP_ID,RECV_DATE,RECV_TIME) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
// CREATE TABLE   VIRT_HST
// (
//   PG_DEAL_NUMB    char (12)  NOT NULL,
//   PARE_ACCO_CODE  char (2)   NULL,
//   SEQ_NO          char (6)   NOT NULL,
//   DEAL_SELE       char (2)   NOT NULL,
//   CUST_ACCO_CODE  char (2)   NULL,
//   AMOUNT          int        NULL,
//   RECE_NAME       char (14)  NULL,
//   VIRT_ACCO_NUMB  char (16)  NOT NULL,
//   DEAL_DATE       char (8)   NOT NULL,
//   DEAL_TIME       char (6)   NOT NULL,
//   SHOP_ID         char (10)  NULL,
//   RECV_DATE       char (8)   NULL,
//   RECV_TIME       char (6)   NULL
// );
// create unique index pk_VIRT_HST on VIRT_HST (DEAL_DATE,DEAL_TIME,VIRT_ACCO_NUMB,DEAL_SELE,SEQ_NO);
// create index idx01_VIRT_HST on VIRT_HST (PG_DEAL_NUMB);

        if (!defined('BASEPATH'))
            exit('No direct script access allowed');

        $pgName = 'ksnet';

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

        $payment = [
            'tid' => $rVTransactionNo // 거래번호
        ];

        if ($deal_sele = "20") {

            $order =  $orderModel->getOrderDetailByTid($rVTransactionNo);
            $oid = $order->oid;
            $depositResult = $orderModel->deposit($oid, ORDER_METHOD_VBANK, $total_amt, $payment);

            if ($depositResult['result']) {
                //가상계좌 입금확인 이메일 보내기
                $view->event->trigger('depositSucessVbank', ['oid' => $oid]);
            }

        }

        write_log("TO_DB_NEW=[INSERT INTO VIRT_HST (PG_DEAL_NUMB,PARE_ACCO_CODE,SEQ_NO,DEAL_SELE,CUST_ACCO_CODE,AMOUNT,RECE_NAME,VIRT_ACCO_NUMB,DEAL_DATE,DEAL_TIME,SHOP_ID,RECV_DATE,RECV_TIME) VALUES('". $rVTransactionNo . "','" . $acco_code . "','" . $seq_no . "','" . $deal_sele . "','" . $in_bank_cd . "','" . $total_amt . "','" . $rece_nm . "','" . $cms_no . "','" . $deal_star_date . "','" . $deal_star_time . "','" . $StoreId ."',?,?)]");

        $ret = "OK";
    }else
    {
        write_log("ERROR(UNKNOWN MESSAGE)           =["  .  $data       .  "]");

    }
}
//명시적으로 읽어들일 길이를 header에 설정한다.

$msg = "result=" . $ret;

write_log("msg=[" . $msg          . "]");

echo($msg);
Header("Content-Length: " . strlen($msg));
ob_end_flush();

?>
