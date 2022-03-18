<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

// Load Forbiz View
$view = getForbizView(true);

$params = $view->getParams();

$cretifyType = $params[0];

//모듈 분기 처리
$cretifyModuleName = '';
if ($cretifyType == 'certify') { // 본인인증
    $cretifyModuleName = 'checkPlusSafe'; //NICE평가정보㈜에서 제공하는 안심본인인증서비스
} else if ($cretifyType == 'ipin') { // 아이핀

} else if ($cretifyType == 'sso') { // 통합인증 이니시스
    $cretifyModuleName = 'inicis';
}

if (!empty($cretifyModuleName)) {
    require(__DIR__ . '/' . $cretifyModuleName . '/request.php');
}