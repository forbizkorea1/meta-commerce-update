<?php

/**
 * 쇼핑몰 설정 데이타 클래스
 *
 * @author hoksi
 */
class ForbizConfig extends ForbizCoreConfig {
    public static function getCremaDeliveryCode($key = false)
    {
        $data = [
            //'' => 'unknown', // 미등록 택배업체
            //'' => 'hyundai_logistics', // 현대택배
            '18' => 'cj_gls', // CJ GLS
            '06' => 'korea_express', // 대한통운
            '45' => 'dhl', // DHL
            '01' => 'epost', // 우체국택배
            '05' => 'logen', // 로젠택배
            //'' => 'self', // 직접배달/수령
            '25' => 'chunil', // 천일택배
            '03' => 'dongbu_express', // KG로지스
            '41' => 'dongbu_express', // KG로지스
            '23' => 'ilyang_logis', // 일양로지스
            //'' => 'ems', // EMS
            '46' => 'ups', // UPS
            '44' => 'fedex', // Fedex
            '13' => 'hanjin', // 한진(기업고객)
            '10' => 'kgb_logis', // KGB택배
            //'' => 'twenty_four_quick', // 24quick
            //'' => 'hanjin_b2b', // 한진(기업고객)
            '21' => 'kyoungdong_express', // 경동택배
            //'' => 'usps', // USPS
            '28' => 'innogis', // 이노지스택배
            '22' => 'daesin_parcel_service', // 대신택배
            '43' => 'gtx', // GTXLogis
            //'' => 'pick_up', // 직접배달/수령
            //'' => 'fastbox', // 패스트박스
            '12' => 'lotte_logis', // 롯데택배
            //'' => 'dream_logis', // 드림택배
        ];

        $code = self::findKey($data, $key, true);

        return ($code == '' ? 'unknown' : $code);
    }
}