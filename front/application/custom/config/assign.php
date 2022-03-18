<?php
return (function () {
    /* @var $cartModel CustomMallCartModel */
    $cartModel = getForbiz()->import('model.mall.cart');
    /* @var $productModel CustomMallProductModel */
    $productModel = getForbiz()->import('model.mall.product');
    /* @var $displayModel CustomMallDisplayModel */
    $displayModel = getForbiz()->import('model.mall.display');
    /* @var $companyModel CustomMallCompanyModel */
    $companyModel = getForbiz()->import('model.mall.company');

    $isLogin = is_login();
    $appType = getAppType();
    $routeUri = getForbiz()->router->routeUri;
    $bodyId = $routeUri ? str_replace('/', '_', $routeUri) : 'main';
    $routeUri = '/' . $routeUri;

    // 네이버 페이
    $NPAY_USE = ForbizConfig::getMallConfig('add_sattle_module_naverpay_pg') == 'Y' ? 'Y' : 'N';
    $NPAY_SERVICE_TYPE = ForbizConfig::getMallConfig('naverpay_pg_service_type') ?? 'test';
    $NPAY_PRATNER_ID = ForbizConfig::getMallConfig('naverpay_pg_partner_id') ?? '';
    $NPAY_CLIENT_ID = ForbizConfig::getMallConfig('naverpay_pg_client_id') ?? '';
    $NPAY_CLIENT_SECRET = ForbizConfig::getMallConfig('naverpay_pg_client_secret') ?? '';

    define("NPAY_USE", $NPAY_USE);
    define("NPAY_SHOP_ID", $NPAY_PRATNER_ID); // naverpay_pg_partner_id
    define("NPAY_BUTTON_KEY", $NPAY_CLIENT_ID); // naverpay_pg_client_id
    define("NAPY_CERTI_KEY", $NPAY_CLIENT_SECRET); // naverpay_pg_client_secret

    if($NPAY_SERVICE_TYPE == 'service') {
        define("NPAY_REQ_HOST", "api.pay.naver.com");
        define("NPAY_ORDER_HOST", "order.pay.naver.com");
        define("NPAY_WISH_HOST", "pay.naver.com");
        define("NPAY_MOBILE_WISH_HOST", "m.pay.naver.com");
    } else {
        define("NPAY_REQ_HOST", "test-api.pay.naver.com");
        define("NPAY_ORDER_HOST", "test-order.pay.naver.com");
        define("NPAY_WISH_HOST", "test-pay.naver.com");
        define("NPAY_MOBILE_WISH_HOST", "test-m.pay.naver.com");
    }

    //프론트 라이센스 처리
    $companyModel->getMallLicense();

    $talktalk_use_type = \ForbizConfig::getMallConfig('talktalk_use_type');
    $talktalk_script = \ForbizConfig::getMallConfig('talktalk_script');
    $talktalk_mobile_script = \ForbizConfig::getMallConfig('talktalk_mobile_script');

    $happyTalk_use_type = \ForbizConfig::getMallConfig('happyTalk_use_type');
    $happyTalk_script = \ForbizConfig::getMallConfig('happyTalk_script');
    $happyTalk_mobile_script = \ForbizConfig::getMallConfig('happyTalk_mobile_script');

    $friendTalk_use_type = \ForbizConfig::getMallConfig('friendTalk_use_type');
    $friendTalk_script = \ForbizConfig::getMallConfig('friendTalk_script');
    $friendTalk_mobile_script = \ForbizConfig::getMallConfig('friendTalk_mobile_script');

    //카테고리 캐시 적용
    if (defined('CACHE_SETTING') && CACHE_SETTING === false) {
        $largeCateData = array();
    } else {
        $largeCateData = fb_get('largeCateData');
    }
    if (empty($largeCateData)) {
        //카테고리
        $largeCateData = $productModel->getLargeCategoryList();
        if (is_array($largeCateData)) {
            foreach ($largeCateData as $key => $largeCate) {
                $largeCateData[$key]['subCateList'] = $productModel->getCategorySubList($largeCate['cid'], false,'view');
                foreach ($largeCateData[$key]['subCateList'] as $subKey => $midumCate) {
                    $largeCateData[$key]['subCateList'][$subKey]['subCateList']
                        = $productModel->getCategorySubList($midumCate['cid'], false,'view');
                }
            }
        }
    }

    //sns 구글 정보가져오기
    /* @var $snsLoginModel CustomMallSnsLoginModel */
    $snsLoginModel = getForbiz()->import('model.mall.snsLogin');
    $googleKeyInfo = $snsLoginModel->setKeyConfig('google');

    // Google 설정
    defined('GOOGLE_CLIENT_ID') OR define('GOOGLE_CLIENT_ID', $googleKeyInfo['googleClientId']);
    defined('GOOGLE_CLIENT_SECRET') OR define('GOOGLE_CLIENT_SECRET', $googleKeyInfo['googleClientSecret']);

    //회원
    $userInfo = [];
    if ($isLogin) {
        $userInfo = [
            'name' => sess_val('user', 'name')
        ];
    }
    $userInfo['cartCnt'] = $cartModel->cartCnt();
    $gnbBanner = [];
    $eventBanner = [];
    if (!is_mobile()) {
        $gnbBanner = get_schedule_banner_info(6);
    }else {
        //모바일 일땐 이벤트배너
        /* @var $displayModel CustomMallDisplayModel */
        $eventModel = getForbiz()->import('model.mall.event');
        $eventInfo = $eventModel->getEventList('P', 'regdate', 'DESC', 1, 6, ['er_ix' => 2]);
        $eventBanner = $eventInfo['list'];
    }

    //브레드크럼
    if (strpos($_SERVER['PHP_SELF'], 'goodsList/')) {
        $cid = explode('/', $_SERVER['PHP_SELF']);
        $goodsListCid = $cid[4];
        $depth = $productModel->getDepth($goodsListCid);
        $breadcrumbs = $productModel->getCategoryPath($goodsListCid, $depth);
    }

    $logo = \ForbizConfig::getAdminImage('admin', 'devShopLogo', 'url');
    $mobileLogo = \ForbizConfig::getAdminImage('admin', 'devMobileLogo', 'url');
    $mall_title = \ForbizConfig::getMallConfig('mall_name');
    $mall_keyword = \ForbizConfig::getMallConfig('mall_keyword');

    //마일리지 정보
    /* @var $mileageModel CustomMallMileageModel */
    $mileageModel = getForbiz()->import('model.mall.mileage');

    return [
        'layoutCommon' => [
            'isLogin' => $isLogin
            , 'appType' => $appType
            , 'userInfo' => $userInfo
            , 'bodyId' => $bodyId
            , 'routeUri' => $routeUri
            , 'title' => $mall_title
            , 'keyword' => $mall_keyword
            , 'breadcrumbs' => ($breadcrumbs ?? '')
            , 'mileageName' => ($mileageModel->getName() ?? '마일리지')
            , 'mileageUnit' => ($mileageModel->getUnit() ?? 'P')
            , 'headerTopSearchesTags' => [
                'searchesTag' => $productModel->searchesTag()
                ]
            , 'redirectUrl' => urlencode(getForbiz()->input->get('url'))
        ]
        , 'layout' => [
            'jsonPopupList' => json_encode($displayModel->getPopupList())
        ]
        , 'headerTop' => [
            'popularKeyword' => $productModel->getPopularKeyword()
            , 'recentKeyword' => $productModel->getRecentKeyword()
            , 'logo' => '/data/mall_data/images/shop_logo.png'
            , 'mobileLogo' => '/data/mall_data/images/mobile_logo.png'
        ]
        , 'headerMenu' => [
            'categoryList' => $largeCateData,
            'gnbBanner' => $gnbBanner,
            'eventBanner' => $eventBanner //모바일용
        ]
        , 'contentsAdd' => []
        , 'leftMenu' => []
        , 'rightMenu' => [
            'historyList' => $productModel->getProductViewHistory((sess_val('user', 'code') ? sess_val('user',
                'code') : session_id()), 1, 3, false)['list']
        ]
        , 'footerMenu' => []
        , 'footerDesc' => []
        , 'useFat' => defined('USE_FAT') && USE_FAT === true && sess_val('user', 'mem_type') === 'A' && !empty(sess_val('allowFatUser'))
        , 'talktalk_use_type' => $talktalk_use_type
        , 'talktalk_script' => $talktalk_script
        , 'talktalk_mobile_script' => $talktalk_mobile_script
        , 'happyTalk_use_type' => $happyTalk_use_type
        , 'happyTalk_script' => $happyTalk_script
        , 'happyTalk_mobile_script' => $happyTalk_mobile_script
        , 'friendTalk_use_type' => $friendTalk_use_type
        , 'friendTalk_script' => $friendTalk_script
        , 'friendTalk_mobile_script' => $friendTalk_mobile_script
    ];
})();
