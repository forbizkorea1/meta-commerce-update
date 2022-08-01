<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

// 네이버페이 전용 헬퍼 로드
require_once (__DIR__.'/npay.helper.php');

// 프레임워크 로드
$view = getForbizView(false);

////////////////////////////
// 마스터 DB로 처리 START //
start_master_db();
////////////////////////////

$cartIxs = $view->input->post('cartIxs');

$backMode = 'cart';
if (is_string($cartIxs)) {
    $cartIxs = explode(',', $view->input->post('cartIxs'));
    $backMode = 'product';
}

if (!empty($cartIxs)) {
    $npayRes = npay_buy($cartIxs, $backMode);

    echo json_encode([
        'result' => $npayRes['result'] ? 'success' : 'fail'
        , 'data' => $npayRes['data']
    ]);
} else {
    echo json_encode([
        'result' => 'fail'
        , 'data' => [
            'msg' => 'Invalid goods info'
        ]
    ]);
}


