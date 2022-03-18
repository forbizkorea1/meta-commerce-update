<?php
define('MALL_TEMPLATE', 'enterprise');
define('MALL_MOBILE_TEMPLATE', 'mobile_enterprise');
define('BASIC_LANGUAGE', 'korean');

// 환경설정 파일(shared), layout 정보, email 템플릿 정보, company.php, 언어 파일 cache 사용 여부
define('USE_SHARED_CACHE', false);

// SSL 여부 확인
if (isset($_SERVER["SERVER_PORT"]) && $_SERVER["SERVER_PORT"] == "443") {
    define('HTTP_PROTOCOL', 'https://');
} else {
    define('HTTP_PROTOCOL', 'http://');
}

if (strstr(FORBIZ_BASEURL, '.devs')) {
    define('DB_CONNECTION_DIV', 'development');
    define('PORTAL_API_URL', 'http://portal.devs');
} else if(strncmp(FORBIZ_BASEURL, 'mcpkg', 5) === 0) {
    
    define('DB_CONNECTION_DIV', 'production');
    define('PORTAL_API_URL', HTTP_PROTOCOL . 'qa.meta-commerce.co.kr');
} else if (strstr(FORBIZ_BASEURL, '.forbiz.co.kr')) {
    define('DB_CONNECTION_DIV', 'development');
    define('PORTAL_API_URL', HTTP_PROTOCOL . 'qa.meta-commerce.co.kr');
} else {
    define('DB_CONNECTION_DIV', 'production');
    define('PORTAL_API_URL', HTTP_PROTOCOL . 'meta-commerce.co.kr');
}

$_SERVER['CI_ENV'] = DB_CONNECTION_DIV;

if(strstr(FORBIZ_BASEURL, 'demo.meta-commerce')) {
    define('DEMO_USE', true);
}else {
    define('DEMO_USE', false);
}

// 상품상세 페이지 유입 정보 수집
define("COLLECT_PRODUCT_VIEW_CNT", true);
define("DB_FAT", 'mall_db');
define("DB_PRODUCT", 'mall_db');

////////////////////// 간편로그인 설정 ///////////////////////////
defined('FORBIZ_HOST') OR define('FORBIZ_HOST', $_SERVER['HTTP_HOST']);
// 네이버 간편로그인 설정
define('NAVER_CLIENT_ID', '');
define('NAVER_CLIENT_SECRET', '');
define('NAVER_CALLBACK_URL', HTTP_PROTOCOL.FORBIZ_HOST.'/controller/member/naver');
define('NAVER_LOGIN_CALLBACK_URL', HTTP_PROTOCOL.FORBIZ_HOST.'/controller/member/naver/login');
define('NAVER_JOIN_CALLBACK_URL', HTTP_PROTOCOL.FORBIZ_HOST.'/controller/member/naver/join');
// 카카오 간편로그인 설정
define('KAKAO_APP_KEY', '');
define('KAKAO_APP_SECRET', '');
define('KAKAO_CALLBACK_URL', HTTP_PROTOCOL.FORBIZ_HOST.'/controller/member/kakao');
// Facebook 설정
define('FACEBOOK_APP_ID', '');
define('FACEBOOK_APP_SECRET', '');
define('FACEBOOK_CALLBACK_URL', HTTP_PROTOCOL.FORBIZ_HOST.'/controller/member/facebook');
///////////////////// 결제 관련 설정 /////////////////////////////