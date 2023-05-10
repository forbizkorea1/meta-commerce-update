<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

$view = getForbizView();

if (is_login()) {

    /* @var $mypageModel CustomMallMypageModel */
    $mypageModel = $view->import('model.mall.mypage');
    $result       = $mypageModel->getMyMileageInfo();
    $view->assign($result);

    // 소멸예정 마일리지 총액 (30일이내)
    /* @var $mileageModel CustomMallMileageModel */
    $mileageModel = $view->import('model.mall.mileage');
    $view->assign('ext_mileage_amount', g_price($mileageModel->getExtMilageAmount()));

    // 마이페이지 공통
    $sDate = date('Y.m.d', strtotime('-1 month'));
    $view->assign('sDate', $sDate);
    $view->assign('eDate', date('Y.m.d'));

    $view->assign([
        'today' => date('Y.m.d'),
        'oneWeek' => date('Y.m.d', strtotime('-1 week')),
        'oneMonth' => date('Y.m.d', strtotime('-1 month')),
        'sixMonth' => date('Y.m.d', strtotime('-6 month')),
        'oneYear' => date('Y.m.d', strtotime('-1 year')),
        'mileageName' => $mileageModel->getName(),
        'mileageUnit' => $mileageModel->getUnit()
    ]);

    echo $view->loadLayout();
} else {
    redirect('/member/login?url=/mypage/mileage');
}
