<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

// Load Forbiz View
$view = getForbizView(true);

/* @var $memberModel CustomMallMemberModel */
$memberModel = $view->import('model.mall.member');

extract($_POST);

//echo '<인증결과내역>'."<br/><br/>";
//echo 'resultCode : '.$_REQUEST["resultCode"]."<br/>";
//echo 'resultMsg : '.$_REQUEST["resultMsg"]."<br/>";
//echo 'authRequestUrl : '.$_REQUEST["authRequestUrl"]."<br/>";
//echo 'txId : '.$_REQUEST["txId"]."<br/>";

// STEP2 에 이어 인증결과가 성공일(resultCode=0000) 경우 STEP2 에서 받은 인증결과로 아래 승인요청 진행

$mid  = 'INIiasTest';    // 부여받은 MID(상점ID) 입력(영업담당자 문의)
$txId = $_REQUEST["txId"];

if ($_REQUEST["resultCode"] === "0000") {
    $data = array(
        'mid' => $mid,
        'txId' => $txId
    );

    $post_data = json_encode($data);

// curl 통신 시작
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $_REQUEST["authRequestUrl"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    curl_close($ch);

// -------------------- 결과 수신 -------------------------------------------
//    echo '<결과내역>'."<br/><br/>";
//    echo $response;

    $response = json_decode($response, true);

    $mobileno = $response['userPhone'];
    $birthdate = $response['userBirthday'];
    $birthdateFormat = substr($birthdate, 0, 4) . '-' . substr($birthdate, 4, 2) . '-' . substr($birthdate, 6, 2);
    $pcsFormat = substr($mobileno, 0, 3) . '-' . substr($mobileno, 3, 4) . '-' . substr($mobileno, 7, 4);

    $data['name'] = $response['userName'];
    $data['ci'] = $response['userCi'];
    $data['birthday'] = $birthdateFormat; //0000-00-00
    $data['pcs'] = $pcsFormat; //000-0000-0000

    $birth_time = strtotime($response['userBirthday']);
    $now = date('Ymd');
    $birthday = date('Ymd', $birth_time);
    $age = floor(($now - $birthday) / 10000);

    if ($age < 14) {
        $msg = '14세 미만은 가입이 불가능 합니다.';
        $memberModel->doCretifyFail($msg);
    }

    $memberModel->setAuthSessionData($data);

    $retData = [
        'name' =>  $response['userName']
        , 'birthday' => $response['userBirthday']
        , 'pcs' => $response['userPhone']
        , 'ci' => $response['userCi']
    ];
    $memberModel->doCretifySuccess($retData);

}else {   // resultCode===0000 아닐경우 아래 인증 실패를 출력함
    echo 'resultCode : '.$_REQUEST["resultCode"]."<br/>";
    echo 'resultMsg : '.$_REQUEST["resultMsg"]."<br/>";

    $msg = $_REQUEST["resultMsg"];
    $memberModel->doCretifyFail($msg);
}
