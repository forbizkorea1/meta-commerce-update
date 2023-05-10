<?php

$config = require(__DIR__ . '/config.php');

$sitecode = $config['siteCode'];
$sitepasswd = $config['sitePasswd'];
$cb_encode_path = $config['cbEncodePath'];

$authtype = "";            // 없으면 기본 선택화면, X: 공인인증서, M: 핸드폰, C: 카드

$popgubun = "N";            // Y : 취소버튼 있음 / N : 취소버튼 없음

$customize = "";            // 없으면 기본 웹페이지 / Mobile : 모바일페이지
if (is_mobile()) {
    $customize = "Mobile";
}

$gender = "";                // 없으면 기본 선택화면, 0: 여자, 1: 남자

//$reqseq = "REQ_0123456789";     // 요청 번호, 이는 성공/실패후에 같은 값으로 되돌려주게 되므로
$commend = "{$cb_encode_path} SEQ " . $sitecode;
$reqseq = `$commend`;
if ($reqseq === false) {
    echo $commend;
    dd($reqseq);
}

// CheckPlus(본인인증) 처리 후, 결과 데이타를 리턴 받기위해 다음예제와 같이 http부터 입력합니다.
// 리턴url은 인증 전 인증페이지를 호출하기 전 url과 동일해야 합니다. ex) 인증 전 url : http://www.~ 리턴 url : http://www.~
$returnurl = HTTP_PROTOCOL . FORBIZ_HOST . "/member/cretify/checkPlusSafe/response";    // 성공시 이동될 URL
$errorurl = HTTP_PROTOCOL . FORBIZ_HOST . "/member/cretify/checkPlusSafe/cancel";        // 실패시 이동될 URL

// reqseq값은 성공페이지로 갈 경우 검증을 위하여 세션에 담아둔다.

$_SESSION["REQ_SEQ"] = $reqseq;

// 입력될 plain 데이타를 만든다.
$plaindata = "7:REQ_SEQ" . strlen($reqseq) . ":" . $reqseq .
    "8:SITECODE" . strlen($sitecode) . ":" . $sitecode .
    "9:AUTH_TYPE" . strlen($authtype) . ":" . $authtype .
    "7:RTN_URL" . strlen($returnurl) . ":" . $returnurl .
    "7:ERR_URL" . strlen($errorurl) . ":" . $errorurl .
    "11:POPUP_GUBUN" . strlen($popgubun) . ":" . $popgubun .
    "9:CUSTOMIZE" . strlen($customize) . ":" . $customize .
    "6:GENDER" . strlen($gender) . ":" . $gender;


//$enc_data = get_encode_data($sitecode, $sitepasswd, $plaindata);
$commend = sprintf('%s ENC %s %s %s', $cb_encode_path, $sitecode, $sitepasswd, $plaindata);
$enc_data = `$commend`;

if ($enc_data == -1) {
    $returnMsg = "암/복호화 시스템 오류입니다.";
    $enc_data = "";
} else if ($enc_data == -2) {
    $returnMsg = "암호화 처리 오류입니다.";
    $enc_data = "";
} else if ($enc_data == -3) {
    $returnMsg = "암호화 데이터 오류 입니다.";
    $enc_data = "";
} else if ($enc_data == -9) {
    $returnMsg = "입력값 오류 입니다.";
    $enc_data = "";
} else {
    $returnMsg = '암호화에 실패 하였습니다. CPClint 의 실행 권한을 확인해주세요.';
}

if (empty($enc_data)) {
    /* @var $memberModel CustomMallMemberModel */
    $memberModel = $view->import('model.mall.member');
    $memberModel->doCretifyFail($returnMsg);
}

?>

<!-- 본인인증 서비스 팝업을 호출하기 위해서는 다음과 같은 form이 필요합니다. -->
<form name="form_chk" method="post">
    <input type="hidden" name="m" value="checkplusSerivce">                        <!-- 필수 데이타로, 누락하시면 안됩니다. -->
    <input type="hidden" name="EncodeData" value="<?= $enc_data ?>">        <!-- 위에서 업체정보를 암호화 한 데이타입니다. -->
</form>

<script language='javascript'>
    window.name = "Parent_window";

    function fnPopup() {
        // window.open('', 'popupChk', 'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
        document.form_chk.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
        // document.form_chk.target = "popupChk";
        document.form_chk.submit();
    }
    fnPopup();
</script>
