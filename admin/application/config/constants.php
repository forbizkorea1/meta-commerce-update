<?php
// 세션 타입 설정
define('FORBIZ_SESSION_TYPE', 'file');

define('MODULE_ASSETS', DOCUMENT_ROOT . '/assets/module');
define('MODULE_ASSETS_URL', '/assets/module');

define('LAYOUT_ASSETS', DOCUMENT_ROOT . '/assets/layout');
define('LAYOUT_ASSETS_URL', '/assets/layout');

define('SCM_TPL_COMPILE', DOCUMENT_ROOT . '/assets/_compile');

// 써드파디 라이브러리 로드
if (is_file(APPLICATION_ROOT . '/third-party/vendor/autoload.php')) {
    require_once APPLICATION_ROOT . '/third-party/vendor/autoload.php';
}