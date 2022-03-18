<?php

/**
 * 글로벌 가격 노출
 * @param type $price
 * @return type
 */
function g_price($price)
{
    return number_format($price);
}

/**
 * 문자열을 자른후 ... 을 붙임
 *
 * @param string $str
 * @param int $len
 * @return string
 */
function str_cut($str, $len = 30)
{
    return mb_substr($str, 0, $len) . (mb_strlen($str) > $len ? ' ...' : '');
}

/**
 * 전화번호에 - 만 붙었을경우 공백으로 리턴
 * @param type $text
 */
function str_cut_number_dash($text = "")
{
    $cut_text = str_replace("--", "", trim($text));
    $cut_text = str_replace("-", "", trim($cut_text));
    if (!$cut_text) {
        $text = "";
    }
    return $text;
}

/**
 *  *  전화번호 - 를 자동으로 배열로 분리해서 rows에 더해줌
 * @param type $key
 * @param type $value
 * @param type $rows
 * @return type
 */
function auto_explode_number($key, $value)
{
    $arr = [];
    if ($value) {
        foreach (explode("-", $value) as $kk => $vv) {
            $kk++;
            $arr["{$key}_" . "{$kk}"] = $vv;
        }
    }
    return $arr;
}

function xmp_print_exit($arr = [])
{
    echo '<xmp>';
    print_r($arr);
    echo '</xmp>';
    exit;
}

/**
 * iOS, Android Push 전송
 * @param array $tokens ['pushToken', 'pushToken' ...]
 * @param array $message ['title' => 'Title', 'body' => 'pushText', 'text' => 'pushText', 'openURL' => 'http://forbiz.co.kr']
 * @return array
 */
function app_push_noti(array $tokens, array $message)
{
    static $serverKey = null;

    if ($serverKey === null) {
        $serverKey = (ForbizConfig::getSharedMemory('mobile_config')['app_push_key'] ?? false);
    }

    if ($serverKey) {
        $fields = [
            'registration_ids' => $tokens,
            'content_available' => true,
            'priority' => 'high',
            'data' => $message['data']
        ];

        if($message['notification']) {
            $fields['notification'] = $message['notification'];
        }

        $fields = json_encode($fields);

        $curl = new \Curl\Curl();

        $curl->setOpt(CURLOPT_RETURNTRANSFER, true);
        $curl->setOpt(CURLOPT_SSL_VERIFYHOST, false);
        $curl->setOpt(CURLOPT_SSL_VERIFYPEER, false);
        $curl
            ->setHeader('Authorization', "key={$serverKey}")
            ->setHeader('Content-Type', 'application/json')
            ->post('https://fcm.googleapis.com/fcm/send', $fields)
            ->close();

        return $curl->error ? [
            'error' => $curl->error_code,
            'errorMsg' => $curl->response
        ] : json_decode($curl->response, true);
    } else {
        return ['error' => '9000', 'errorMsg' => 'serverKey is NULL'];
    }
}

/**
 * test 함수
 * 배열 내 정보 확인
 */
function dd($arr, $c = true)
{
    echo "<pre>";
    print_r($arr);
    if ($c === true) {
        exit;
    }
}

/**
 * test 함수
 * 최근 실행한 쿼리 출력
 */
function eq($obj)
{
    echo $obj->qb->lastQuery();
    exit;
}

function is_html($string)
{
    return preg_match("/<[^<]+>/", $string, $m) != 0;
}


/**
 * REMOTE_ADDR 추출
 * @return string
 */
function getRemoteAddr()
{
    if (isset($_SERVER['HTTP_CLIENT_IP']) && $_SERVER['HTTP_CLIENT_IP']) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && $_SERVER['HTTP_X_FORWARDED_FOR']) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else if (isset($_SERVER['HTTP_X_FORWARDED']) && $_SERVER['HTTP_X_FORWARDED']) {
        return $_SERVER['HTTP_X_FORWARDED'];
    } else if (isset($_SERVER['HTTP_FORWARDED_FOR']) && $_SERVER['HTTP_FORWARDED_FOR']) {
        return $_SERVER['HTTP_FORWARDED_FOR'];
    } else if (isset($_SERVER['HTTP_FORWARDED']) && $_SERVER['HTTP_FORWARDED']) {
        return $_SERVER['HTTP_FORWARDED'];
    } else {
        return ($_SERVER['REMOTE_ADDR'] ?? '');
    }
}