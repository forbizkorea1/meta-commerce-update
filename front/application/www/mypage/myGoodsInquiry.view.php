<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

$view            = getForbizView();

if (is_login()) {

    /* @var $productQnaModel CustomMallProductQnaModel */
    $productQnaModel = $view->import('model.mall.productQna');
    $divsInfo        = $productQnaModel->getAllDivs();
    $view->assign('divsInfo', $divsInfo);

    // 마이페이지 공통
    $sDate = date("Y.m.d", strtotime("-1 month"));
    $view->assign('sDate', $sDate);
    $view->assign('eDate', date('Y.m.d'));

    $view->assign([
        'today' => date('Y.m.d'),
        'oneWeek' => date('Y.m.d', strtotime('-1 week')),
        'oneMonth' => date('Y.m.d', strtotime('-1 month')),
        'sixMonth' => date('Y.m.d', strtotime('-6 month')),
        'oneYear' => date('Y.m.d', strtotime('-1 year'))
    ]);

    echo $view->loadLayout();
} else {
    redirect('/member/login?url=/mypage/myGoodsInquiry');
}