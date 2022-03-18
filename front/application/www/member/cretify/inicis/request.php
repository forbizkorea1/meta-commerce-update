<?php

$config = require(__DIR__ . '/config.php');

$sitemid = $config['siteMid'];
$siteapikey = $config['siteApiKey'];

if (!defined('BASEPATH')) exit('No direct script access allowed');

// Load Forbiz View
$view = getForbizView(true);

$mid = $sitemid;                            // 테스트 MID 입니다. 계약한 상점 MID 로 변경 필요
$apiKey = $siteapikey;   // 테스트 MID 에 대한 apiKey
$mTxId = 'sso_' . date('YmdHms');
$reqSvcCd ='01';

// 등록가맹점 확인
$plainText1 = hash("sha256",(string)$mid.(string)$mTxId.(string)$apiKey);
$authHash = $plainText1;

$userName  = '';   // 사용자 이름
$userPhone = '';   // 사용자 전화번호
$userBirth = '';   // 사용자 생년월일

$flgFixedUser = 'N';           // 특정사용자 고정시 Y

if($flgFixedUser=="Y")
{
    $plainText2 = hash("sha256",(string)$userName.(string)$mid.(string)$userPhone.(string)$mTxId.(string)$userBirth.(string)$reqSvcCd);
    $userHash = $plainText2;
}

$responseUrl = HTTP_PROTOCOL . FORBIZ_HOST . "/member/cretify/inicis/response";
?>

<form name="saForm" method="post" style="display: none">
    <input type="text" name="mid" value="<?php echo $mid ?>">
    <input type="text" name="reqSvcCd" value="<?php echo $reqSvcCd ?>">
    <input type="text" name="mTxId" value="<?php echo $mTxId ?>">
    <input type="text" name="authHash" value="<?php echo $authHash ?>">
    <input type="text" name="flgFixedUser" value="<?php echo $flgFixedUser ?>">
    <input type="text" name="directAgency" value="">
    <input type="text" name="successUrl" value="<?php echo $responseUrl ?>">
    <input type="text" name="failUrl" value="<?php echo $responseUrl ?>">
    <!-- successUrl / failUrl 은 분리 하여 이용가능!-->
</form>
<script language="javascript">
    function callSa()
    {
        document.saForm.setAttribute("action", "https://sa.inicis.com/auth");
        document.saForm.submit();
    }

    function popupCenter() {
        let _width = 400;
        let _height = 620;
        var xPos = (document.body.offsetWidth/2) - (_width/2); // 가운데 정렬
        xPos += window.screenLeft; // 듀얼 모니터일 때

        return window.open("", "sa_popup", "width="+_width+", height="+_height+", left="+xPos+", menubar=yes, status=yes, titlebar=yes, resizable=yes");
    }
    callSa();
</script>
