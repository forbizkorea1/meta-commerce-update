<?php
// 사이트 점검중 설정
date_default_timezone_set('Asia/Seoul');
define('FORBIZ_SHUTDOWN', false); // true 점검 중 처리 false 해제


define('REDIRECT_SSL', false);

// SSL 여부 확인
$_reqUrl_ = ($_SERVER['REQUEST_URI'] ?? '/');

if ((isset($_SERVER['HTTPS']) && (($_SERVER['HTTPS'] == 'on') || ($_SERVER['HTTPS'] == '1')))
    || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == "443")
    || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')
    || (!empty($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] == 'on')
) {
    if (defined('REDIRECT_SSL') && REDIRECT_SSL === false && FORBIZ_HOST == 'mocksite.com') {
        if (_is_mobile()) {
            header("Location: https://m.".FORBIZ_BASEURL.$_reqUrl_);
        } else {
            header("Location: https://www.".FORBIZ_BASEURL.$_reqUrl_);
        }
        exit;
    } else {
        defined('HTTP_PROTOCOL') OR define('HTTP_PROTOCOL', 'https://');
    }
} else {
    if (FORBIZ_BASEURL == 'mocksite.com') {
        if (strncmp(FORBIZ_HOST, 'm.', 2) == 0) {
            header("Location: https://m.".FORBIZ_BASEURL.$_reqUrl_);
        } else {
            header("Location: https://www.".FORBIZ_BASEURL.$_reqUrl_);
        }
        exit;
    } else {
        defined('HTTP_PROTOCOL') OR define('HTTP_PROTOCOL', 'http://');
    }
}
unset($_reqUrl_);

defined('ANALYSIS_TAG_JS') OR define('ANALYSIS_TAG_JS', '/analysisTag.js');
defined("IMAGE_SERVER_DOMAIN") OR define("IMAGE_SERVER_DOMAIN", HTTP_PROTOCOL . FORBIZ_BASEURL);

define('DEFAULT_GPIX', 7); // 기본회원 등급
define('NEW_PRODUCT_DAY', 7); // 상품NEW 뱃지 노출기간 정의(일단위)

define('APP_SCHEME', 'php-vfix://');

// Js,Css 버전
define('CLIENT_VERSION', filemtime(__FILE__));
define('USE_FAT', true);

// 써드파디 라이브러리 로드
if (is_file(CUSTOM_ROOT . '/third-party/vendor/autoload.php')) {
    require_once CUSTOM_ROOT . '/third-party/vendor/autoload.php';
}

if(is_file(__DIR__ . '/cache.php')) {
    require_once __DIR__ . '/cache.php';
}

// 캐시 설정
define('CACHE_SETTING', false);
