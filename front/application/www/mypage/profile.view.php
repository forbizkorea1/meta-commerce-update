<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

// View get
$view = getForbizView();

if (is_login()) {

    if ($view->getFlashData('reconfirmPassMode') == 'profile') {
        // Load Model
        /* @var $mypageModel CustomMallMypageModel */
        $mypageModel = $view->import('model.mall.mypage');
        $mem_type    = sess_val('user', 'mem_type');

        $view->assign($mypageModel->doProfile());

        if ($mem_type == 'C') {
            // 사업자 회원
            $view->define('profile_form', 'mypage/profile/profile_company.htm');
        } else {
            // 일반 회원
            $view->define('profile_form', 'mypage/profile/profile_basic.htm');
        }

        /* @var $snsLoginModel CustomMallSnsLoginModel */
        $snsLoginModel = $view->import('model.mall.snsLogin');

        //노출여부 가져오기
        $snsViewConfig = $snsLoginModel->getViewConfig();
        $view->assign($snsViewConfig);

        //키값 세팅
        $snsLoginModel->setKeyConfig();
        $view->assign([
            'naver_login' => $snsLoginModel->getNaverLoginIcon('join') // 네이버 로그인 버튼
            , 'facebook_login' => $snsLoginModel->getFacebookLoginIcon('join') // 페이스북 로그인 버튼
            , 'kakao_login' => $snsLoginModel->getKakaoLoginIcon('join') // 카카오 로그인 버튼
            , 'appType' => $appType = getAppType()
        ]);

        $view->assign('snsInfo', $mypageModel->chkSnsJoin());
        $view->assign('snsLogin', (is_sns_login() ? false : true));

        if(!empty($view->getFlashData('kakaoId'))) {
            $view->assign('kakaoId', $view->getFlashData('kakaoId'));
        }

        if(!empty($view->getFlashData('naverId'))) {
            $view->assign('naverId', $view->getFlashData('naverId'));
        }

        if(!empty($view->getFlashData('fbId'))) {
            $view->assign('fbId', $view->getFlashData('fbId'));
        }

        $member_reg_rule = ForbizConfig::getSharedMemory("member_reg_rule");
        $view->assign('useCertify', $member_reg_rule['mall_use_certify']);

        // Layout 출력
        echo $view->loadLayout();
    } else {
        // 비밀번호 재확인
        $view->setFlashData('passReconfirmType', 'profile');
        redirect('/mypage/passReconfirm');
    }
} else {
    redirect('/member/login?url=/mypage/profile');
}