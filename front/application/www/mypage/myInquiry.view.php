<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

$view = getForbizView();

if (is_login()) {

    /* @var $mypageModel CustomMallMypageModel */
    $mypageModel   = $view->import('model.mall.mypage');
    $qnaInfo       = $mypageModel->getQnaCounts();
    /* @var $customerModel CustomMallCustomerModel */
    $customerModel = $view->import('model.mall.customer');
    $customerModel->setBoardConfig('qna');
    $bbsDiv        = $customerModel->getDivInfo(null, false, 1);
    $view->assign('bbsDiv', $bbsDiv);

    $bbsStatus = $customerModel->getStatusInfo(null, false, 1);
    $view->assign('bbsStatus', $bbsStatus);

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
    redirect('/member/login?url=/mypage/myInquiry');
}