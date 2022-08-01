<?php
return (function() {
    // 메뉴 정보
    $menuInfo = get_menu();
    $nav      = get_nav();
    if (empty($nav)) {
        $nav['top'] = '';
        $nav['parent'] = '';
        $nav['current'] = '';
    }

    $popupDisplayModel = $this->import('model.scm.promotion.popupDisplay');


    $talktalk_use_type = \ForbizConfig::getMallConfig('talktalk_use_type');
    $talktalk_script = \ForbizConfig::getMallConfig('talktalk_script');
    $talktalk_mobile_script = \ForbizConfig::getMallConfig('talktalk_mobile_script');

    $happyTalk_use_type = \ForbizConfig::getMallConfig('happyTalk_use_type');
    $happyTalk_script = \ForbizConfig::getMallConfig('happyTalk_script');
    $happyTalk_mobile_script = \ForbizConfig::getMallConfig('happyTalk_mobile_script');

    $friendTalk_use_type = \ForbizConfig::getMallConfig('friendTalk_use_type');
    $friendTalk_script = \ForbizConfig::getMallConfig('friendTalk_script');
    $friendTalk_mobile_script = \ForbizConfig::getMallConfig('friendTalk_mobile_script');


    return [
        'layoutCommon' => [
            'currendMenuId' => lcfirst($this->moduleGroup).'-'.lcfirst($this->moduleName) //메뉴ID
            , 'currentPage' => lcfirst($this->moduleName)
            , 'isLogin' => (($this->adminInfo->charger_id ?? false) ? 'true' : 'false') // 로그인 여부
            , 'mem_div' => sess_val('admininfo','mem_div') // 회원타입
            , 'useApi' => \ForbizConfig::getUseOpenApi() // 오픈API 사용여부
        ]
        , 'layout' => [
            'jsonPopupList' => json_encode($popupDisplayModel->getPopupNotiList())
        ]
        , 'headerTop' => []
        , 'headerMenu' => [
            'menuData' => $menuInfo
            , 'btnData' => []
        ]
        , 'contentsAdd' => [
            'nav' => $nav
            , 'isActiveFav' => is_active_fav()
            , 'curLink' => ('/' . $this->uri->uri_string)
        ]
        , 'leftMenu' => [
            'topMenu' => ($nav['top'] ?? '')
            , 'menuData' => ($menuInfo[$nav['parent']]['subMenu'] ?? [])
            , 'current' => ($nav['current'] ?? '')
        ]
        , 'rightMenu' => []
        , 'footerMenu' => []
        , 'footerDesc' => []
        , 'adminInfo' => (array) $this->adminInfo
        , 'useFat' => defined('USE_FAT') && USE_FAT === true && (in_array(sess_val('user', 'id'), sess_val('allowFatUser')))
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
