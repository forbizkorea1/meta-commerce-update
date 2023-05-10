<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

// Load Forbiz View
$view        = getForbizView();

// 로그인 되어 있으면 / 로 이동
if (is_login()) {
    redirect('/');
} else {
    // Load Model
    /* @var $memberModel CustomMallMemberModel */
    $memberModel = $view->import('model.mall.member');
    $joinType = sess_val('join', 'type');
    
    $data = $memberModel->doJoinInput($joinType);

    $memberRegRule = ForbizConfig::getSharedMemory("member_reg_rule");
    $view->assign('useCertify', $memberRegRule['mall_use_certify']);
    $view->assign('useSso', $memberRegRule['mall_use_sso']);

    if($data == false && $memberRegRule['mall_use_certify'] == 'Y'){
        redirect('/member/login');
    }else{
        $view->assign($data);
        $view->define([
            'joinBasic' => "member/join_input/join_input_basic.htm",
            'joinCompany' => "member/join_input/join_input_company.htm"
        ]);

        echo $view->loadLayout();

        $view->event->emmit('MemberRegLogic',['code' => sess_val('user', 'code'), 'step' => 3]);

    }
}