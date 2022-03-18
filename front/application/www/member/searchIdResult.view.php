<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

// Load Forbiz View
$view        = getForbizView();
/* @var $memberModel CustomMallMemberModel */
$memberModel = $view->import('model.mall.member');
$memberRegRule = ForbizConfig::getSharedMemory("member_reg_rule");

$authData = $memberModel->getAuthSessionData();
$memberModel->resetAuthSession();

if (is_login()) {
    redirect('/');
} elseif(empty($authData['ci']) && empty ($authData['companyId']) && $memberRegRule['mall_use_certify'] == 'Y') {
    redirect('/member/searchId');
} elseif(empty($authData['mail']) && $memberRegRule['mall_use_certify'] == 'N') {
    redirect('/member/searchId');
} else {
    if($memberRegRule['mall_use_certify'] == 'Y'){
        if(!empty($authData['ci'])) {
            $userData = $memberModel->getUserDataByCi($authData['ci']);
        }else{
            $userData = $memberModel->getUserDataByCompanyId($authData['companyId']);
        }
    }else{
        $userData = $memberModel->getUserDataByMail($authData['mail']);
        $userData['id'] = letter_masking($userData['id'], 'id');
    }

    $view->assign('userId', $userData['id']);
    $view->assign('registDate', date('Y.m.d', strtotime($userData['date'])));
    $view->assign('useCertify', $memberRegRule['mall_use_certify']);

    echo $view->loadLayout();
}