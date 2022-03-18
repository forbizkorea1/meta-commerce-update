<?php
// SSL 여부 확인
if (isset($_SERVER["SERVER_PORT"]) && $_SERVER["SERVER_PORT"] == "443") {
    define('HTTP_PROTOCOL', 'https://');
} else {
    define('HTTP_PROTOCOL', 'http://');
}

// 설정별 도메인정보
if (strstr(FORBIZ_BASEURL, '.devs')) {
    define('DB_CONNECTION_DIV', 'development');
    define('PORTAL_API_URL', 'http://portal.devs');
    define("FRONT_URL", str_replace('admin.', '', FORBIZ_BASEURL));
} else if(strstr(FORBIZ_BASEURL, 'admin-metacommerce')) {
    define('DB_CONNECTION_DIV', 'production');
    define('PORTAL_API_URL', HTTP_PROTOCOL . 'meta-commerce.co.kr');
    define("FRONT_URL", str_replace('admin-', '', FORBIZ_BASEURL));
} else if(strncmp(FORBIZ_BASEURL, 'admin-mcpkg', 11) === 0) {
    define('DB_CONNECTION_DIV', 'production');
    define('PORTAL_API_URL', HTTP_PROTOCOL . 'qa.meta-commerce.co.kr');
    define("FRONT_URL", str_replace('admin-', '', FORBIZ_BASEURL));
} else if (strstr(FORBIZ_BASEURL, '.forbiz.co.kr')) {
    define('DB_CONNECTION_DIV', 'development');
    define('PORTAL_API_URL', HTTP_PROTOCOL . 'qa.meta-commerce.co.kr');
    define("FRONT_URL", str_replace('adminqa-', 'qa-', FORBIZ_BASEURL));
} else {
    define('DB_CONNECTION_DIV', 'production');
    define('PORTAL_API_URL', HTTP_PROTOCOL . 'meta-commerce.co.kr');
}

define('MALL_TEMPLATE', 'enterprise');
define('MALL_MOBILE_TEMPLATE', 'mobile_enterprise');
// 기본 언어팩
define('BASIC_LANGUAGE', 'korean');

//프론트 도메인
//ncloud.meta-commerce.co.kr은 샘플 도메인이므로 사용중인 쇼핑몰 도메인은로 변경해 주세요.
defined("FRONT_URL") OR define("FRONT_URL", "ncloud.meta-commerce.co.kr");
defined("MALL_DOMAIN") OR define("MALL_DOMAIN", HTTP_PROTOCOL . FRONT_URL);

//이미지 서버 도메인
defined("IMAGE_SERVER_DOMAIN") OR define("IMAGE_SERVER_DOMAIN", "");

$_SERVER['CI_ENV'] = DB_CONNECTION_DIV;

if(strstr(FORBIZ_BASEURL, 'demo-admin.meta-commerce.co.kr')) {
    define('DEMO_USE', true);
}else {
    define('DEMO_USE', false);
}
