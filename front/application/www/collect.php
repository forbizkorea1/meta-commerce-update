<?php
///////////////////////////////////////////////////
// 수집 환경 설정 파일 로드
///////////////////////////////////////////////////
require_once __DIR__.'/../custom/collect/collect.config.php';

///////////////////////////////////////////////////
// 수집 환경 설정 로드 확인
///////////////////////////////////////////////////
defined('USE_COLLECT') OR exit('No direct script access allowed(collect.config)');

// cookie clean (test시 사용)
if (isset($_GET['clean'])) {
    setcookie("USERID", '', time() + 2592000, "/", COOKIE_DOMAIN);
    setcookie("UCODE", '', time() + 2592000, "/", COOKIE_DOMAIN);
    setcookie("KWID", '', time() + 2592000, "/", COOKIE_DOMAIN);
    setcookie("UVID", '', time() + 2592000, "/", COOKIE_DOMAIN);
    setcookie("VISITORDATE", '', time() + 2592000, "/", COOKIE_DOMAIN);
    setcookie("PAGEID", '', time() + 2592000, "/", COOKIE_DOMAIN);
    setcookie("RFID", '', time() + 2592000, "/", COOKIE_DOMAIN);
    setcookie("VID", '', time() + 2592000, "/", COOKIE_DOMAIN);
    setcookie("LAST_CON_TIME", '', time() + 2592000, "/", COOKIE_DOMAIN);

    echo '<xmp>';
    print_r($_COOKIE);
} else if (defined('USE_COLLECT') && USE_COLLECT === true && is_file(CUSTOM_CONFIG_PATH.'/server/metacommerce.config.php')) {
    if (ini_get('session.save_handler') === 'files') {
        $session_path = CUSTOM_ROOT.'/_session/mall';
        if (!is_dir($session_path)) {
            mkdir($session_path, 0777, true);
        }
        ini_set('session.save_path', $session_path);
    }

    ini_set('session.cookie_domain', ('.'.FORBIZ_BASEURL));

    if (defined('SESSION_INTEGRATION') && SESSION_INTEGRATION === true) {
        // 언어별 세션ID 사용
        session_name('SESSION_ID_'.strtoupper(BASIC_LANGUAGE));
    }

    // 타임존 설정
    date_default_timezone_set('Asia/Seoul');

    // 세션 시작
    session_start();

    // 헤더 설정 (nocache)
    header("Cache-control: no-cache");
    header("Pragma: no-cache");
    header("P3P:CP=\"NOI DSP COR DEVa TAIa OUR BUS UNI COM NAV STA PRE\"");

    if (defined('RABBITMQ_USE') && RABBITMQ_USE === true) {
        // rebbitMQ 사용
        require_once COLLECT_INC_ROOT.'useQueue.inc.php';
    } else {
        // DB에 직접 통계정보 작성
        require_once COLLECT_INC_ROOT.'useDb.inc.php';
    }

    // image 헤더 설정
    header('Content-Type: image/png');
    echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
}