<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

$view = getForbizView();

if (is_login()) {

// 마이페이지 공통
    $sDate = date("Y.m.d", strtotime("-1 month"));
    $view->assign([
        'sDate' => $sDate
        , 'eDate' => date('Y.m.d')
        , 'today' => date('Y.m.d')
        , 'oneWeek' => date('Y.m.d', strtotime('-1 week'))
        , 'oneMonth' => date('Y.m.d', strtotime('-1 month'))
        , 'sixMonth' => date('Y.m.d', strtotime('-6 month'))
        , 'oneYear' => date('Y.m.d', strtotime('-1 year'))
    ]);

    $data = \ForbizConfig::getSharedMemory('use_after');
    $view->assign('modify_posts', $data['modify_posts']);// 사용자 수정권한
    $view->assign('delete_posts', $data['delete_posts']);// 사용자 삭제권한

    $view->assign('image_review_src', IMAGE_SERVER_DOMAIN . DATA_ROOT . '/product_after');

    echo $view->loadLayout();
} else {
    redirect('/member/login?url=/mypage/myProductReview');
}