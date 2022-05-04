<?php

/**
 * 쇼핑몰 설정 데이타 클래스
 *
 * @author hoksi
 */
class ForbizConfig extends ForbizCoreConfig
{
    public static function getPrivacyConfig($key)
    {
        static $data = null;

        if (defined('CACHE_SETTING') && CACHE_SETTING === false) {
            if ($data === null) {
                $row = getForbiz()->qb
                    ->select('config_name')
                    ->select('config_value')
                    ->from(TBL_SHOP_MALL_PRIVACY_SETTING)
                    ->where('mall_ix', MALL_IX)
                    ->exec()
                    ->getResultArray();

                $data = [];
                foreach ($row as $item) {
                    switch ($item['config_name']) {
                        case 'pw_combi':
                        case 'pw_continuous_check':
                        case 'pw_same_check':
                            $data[$item['config_name']] = json_decode($item['config_value'], true);
                            break;
                        default:
                            $data[$item['config_name']] = $item['config_value'];
                            break;
                    }
                }
            }
        }else{
            if(empty($data)){
                $data = fb_get('getPrivacyConfig');
                if(empty($data)){
                    $row = getForbiz()->qb
                        ->select('config_name')
                        ->select('config_value')
                        ->from(TBL_SHOP_MALL_PRIVACY_SETTING)
                        ->where('mall_ix', MALL_IX)
                        ->exec()
                        ->getResultArray();

                    $data = [];
                    foreach ($row as $item) {
                        switch ($item['config_name']) {
                            case 'pw_combi':
                            case 'pw_continuous_check':
                            case 'pw_same_check':
                                $data[$item['config_name']] = json_decode($item['config_value'], true);
                                break;
                            default:
                                $data[$item['config_name']] = $item['config_value'];
                                break;
                        }
                    }
                }
            }

        }

        return $data[$key] ?? '';
    }

    public static function getMallConfig($key)
    {
        static $data = [];
        if (defined('CACHE_SETTING') && CACHE_SETTING === false) {
            if (!isset($data[$key])) {
                $row = getForbiz()->qb
                    ->select('config_value')
                    ->from(TBL_SHOP_MALL_CONFIG)
                    ->where('mall_ix', MALL_IX)
                    ->where('config_name', $key)
                    ->limit(1)
                    ->exec()
                    ->getRow();

                $data[$key] = $row->config_value ?? '';
            }
            return $data[$key] ?? '';
        }else{
            if(empty($data)) {
                $data = fb_get('getMallConfig');
            }

            if (isset($data[$key]) === false) {
                $row = getForbiz()->qb
                    ->select('config_value')
                    ->from(TBL_SHOP_MALL_CONFIG)
                    ->where('mall_ix', MALL_IX)
                    ->where('config_name', $key)
                    ->limit(1)
                    ->exec()
                    ->getRow();
                $data[$key] = $row->config_value ?? '';
            }
            return $data[$key];
        }
    }

    public static function getPaymentConfig($key, $pg)
    {
        static $data = [];

        if (defined('CACHE_SETTING') && CACHE_SETTING === false) {
            if (!isset($data[$key])) {
                $row = getForbiz()->qb
                    ->select('config_value')
                    ->from(TBL_SHOP_PAYMENT_CONFIG)
                    ->where('mall_ix', MALL_IX)
                    ->where('pg_code', $pg)
                    ->where('config_name', $key)
                    ->limit(1)
                    ->exec()
                    ->getRow();

                $data[$key] = $row->config_value ?? '';
            }

            return $data[$key] ?? '';
        }else{
            if(empty($data)) {
                $data = fb_get('getPaymentConfig');
            }

            if (isset($data[$pg][$key]) === false) {
                $row = getForbiz()->qb
                    ->select('config_value')
                    ->from(TBL_SHOP_PAYMENT_CONFIG)
                    ->where('mall_ix', MALL_IX)
                    ->where('pg_code', $pg)
                    ->where('config_name', $key)
                    ->limit(1)
                    ->exec()
                    ->getRow();

                $data[$pg][$key] = $row->config_value ?? '';
            }

            return $data[$pg][$key];
        }
    }

    public static function getOrderSelectStatus($type, $fkey, $skey, $code = false, $key = false)
    {
        $data = [
            "F" => [
                ORDER_STATUS_INCOM_READY => [
                    //입금예정->취소요청(프론트)
                    ORDER_STATUS_CANCEL_APPLY => [
                        "DPB" => ["type" => "N", "title" => "다른상품구매"],
                        "NB" => ["type" => "N", "title" => "구매의사없음"],
                        "PIE" => ["type" => "N", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "N", "title" => "기타(구매자책임)"]
                    ],
                    //입금예정->취소완료(프론트)
                    ORDER_STATUS_INCOM_BEFORE_CANCEL_COMPLETE => [
                        "DPB" => ["type" => "N", "title" => "다른상품구매"],
                        "NB" => ["type" => "N", "title" => "구매의사없음"],
                        "PIE" => ["type" => "N", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "N", "title" => "기타(구매자책임)"]
                    ]
                ],
                ORDER_STATUS_INCOM_COMPLETE => [
                    //입금완료->취소요청(프론트)
                    ORDER_STATUS_CANCEL_APPLY => [
                        "DPB" => ["type" => "B", "title" => "다른상품구매"],
                        "NB" => ["type" => "B", "title" => "구매의사없음/변심"],
                        "DD" => ["type" => "S", "title" => "배송처리늦음/지연"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ],
                    //입금완료->취소완료(프론트)
                    ORDER_STATUS_CANCEL_COMPLETE => [
                        "DPB" => ["type" => "B", "title" => "다른상품구매"],
                        "NB" => ["type" => "B", "title" => "구매의사없음/변심"],
                        "DD" => ["type" => "S", "title" => "배송처리늦음/지연"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ]
                ],
                //발주확인->취소요청(프론트)
                ORDER_STATUS_DELIVERY_READY => [
                    ORDER_STATUS_CANCEL_APPLY => [
                        "DPB" => ["type" => "B", "title" => "다른상품구매"],
                        "NB" => ["type" => "B", "title" => "구매의사없음/변심"],
                        "DD" => ["type" => "S", "title" => "배송처리늦음/지연"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ]
                ],
                //배송지연->취소신청(프론트)
                ORDER_STATUS_DELIVERY_DELAY => [
                    ORDER_STATUS_CANCEL_APPLY => [
                        "DPB" => ["type" => "B", "title" => "다른상품구매"],
                        "NB" => ["type" => "B", "title" => "구매의사없음/변심"],
                        "DD" => ["type" => "S", "title" => "배송처리늦음/지연"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ]
                ],
                ORDER_STATUS_DELIVERY_COMPLETE => [
                    //배송완료->교환요청(프론트)
                    ORDER_STATUS_EXCHANGE_APPLY => [
                        "OCF" => ["type" => "B", "title" => "사이즈,색상잘못선택"],
                        "PD" => ["type" => "S", "title" => "배송상품 파손/하자"],
                        "DE" => ["type" => "S", "title" => "배송상품 오배송"],
                        "PNT" => ["type" => "S", "title" => "상품미도착"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ],
                    //배송완료->반품요청(프론트)
                    ORDER_STATUS_RETURN_APPLY => [
                        "OCF" => ["type" => "B", "title" => "사이즈,색상잘못선택"],
                        "PD" => ["type" => "S", "title" => "배송상품 파손/하자"],
                        "DE" => ["type" => "S", "title" => "배송상품 오배송"],
                        "PNT" => ["type" => "S", "title" => "상품미도착"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ]
                ],
            ],
            "A" => [
                //입금예정->취소요청(관리자)
                ORDER_STATUS_INCOM_READY => [
                    ORDER_STATUS_CANCEL_APPLY => [
                        "DPB" => ["type" => "N", "title" => "다른상품구매"],
                        "NB" => ["type" => "N", "title" => "구매의사없음/변심"],
                        "DD" => ["type" => "N", "title" => "배송처리늦음/지연"],
                        "PIE" => ["type" => "N", "title" => "상품정보상이"],
                        "PSL" => ["type" => "S", "title" => "상품재고부족"],
                        "PSO" => ["type" => "S", "title" => "상품품절"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"],
                        "SYS" => ["type" => "N", "title" => "시스템자동취소"]
                    ]
                ],
                //입금완료->취소요청(관리자)
                ORDER_STATUS_INCOM_COMPLETE => [
                    ORDER_STATUS_CANCEL_APPLY => [
                        "DPB" => ["type" => "B", "title" => "다른상품구매"],
                        "NB" => ["type" => "B", "title" => "구매의사없음/변심"],
                        "DD" => ["type" => "S", "title" => "배송처리늦음/지연"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "PSL" => ["type" => "S", "title" => "상품재고부족"],
                        "PSO" => ["type" => "S", "title" => "상품품절"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"],
                        "SYS" => ["type" => "N", "title" => "시스템자동취소"]
                    ]
                ],
                //발주확인->취소요청(관리자)
                ORDER_STATUS_DELIVERY_READY => [
                    ORDER_STATUS_CANCEL_APPLY => [
                        "DPB" => ["type" => "B", "title" => "다른상품구매"],
                        "NB" => ["type" => "B", "title" => "구매의사없음/변심"],
                        "DD" => ["type" => "S", "title" => "배송처리늦음/지연"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "PSL" => ["type" => "S", "title" => "상품재고부족"],
                        "PSO" => ["type" => "S", "title" => "상품품절"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"],
                    ]
                ],
                //취소요청->취소거부(관리자)
                ORDER_STATUS_CANCEL_APPLY => [
                    ORDER_STATUS_CANCEL_DENY => [
                        "MCC" => ["type" => "N", "title" => "주문제작 취소불가"],
                        "NCP" => ["type" => "N", "title" => "취소불가상품(상품페이지참조)"],
                        "DR" => ["type" => "N", "title" => "포장완료/배송대기"],
                        "ETC" => ["type" => "N", "title" => "기타"]
                    ]
                ],
                //배송지연(관리자)
                ORDER_STATUS_DELIVERY_DELAY => [
                    //배송지연
                    ORDER_STATUS_DELIVERY_DELAY => [
                        "STS" => ["type" => "N", "title" => "단기재고부족"],
                        "OG" => ["type" => "N", "title" => "주문폭주로인한 작업지연"],
                        "OMI" => ["type" => "N", "title" => "주문제작 중"],
                        "BA" => ["type" => "N", "title" => "고객요청"],
                        "ETC" => ["type" => "N", "title" => "기타"]
                    ],
                    //배송지연->취소요청(관리자)
                    ORDER_STATUS_CANCEL_APPLY => [
                        "DPB" => ["type" => "B", "title" => "다른상품구매"],
                        "NB" => ["type" => "B", "title" => "구매의사없음/변심"],
                        "DD" => ["type" => "S", "title" => "배송처리늦음/지연"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "PSL" => ["type" => "S", "title" => "상품재고부족"],
                        "PSO" => ["type" => "S", "title" => "상품품절"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ]
                ],
                //교환거부(관리자)
                ORDER_STATUS_EXCHANGE_DENY => [
                    ORDER_STATUS_EXCHANGE_DENY => [
                        "MPNE" => ["type" => "N", "title" => "주문제작상품으로 교환불가"],
                        "NEP" => ["type" => "N", "title" => "교환불가상품(상세페이지참조)"],
                        "ETC" => ["type" => "N", "title" => "기타"]
                    ]
                ],
                //교환보류(관리자)
                ORDER_STATUS_EXCHANGE_DEFER => [
                    ORDER_STATUS_EXCHANGE_DEFER => [
                        "NRA" => ["type" => "N", "title" => "반품상품 미입고"],
                        "NRDP" => ["type" => "N", "title" => "반품배송비 미동봉"],
                        "RPD" => ["type" => "N", "title" => "반품상품 훼손/파손"],
                        "RPPD" => ["type" => "N", "title" => "반품상품포장 훼손/파손"],
                        "ETC" => ["type" => "N", "title" => "기타"]
                    ]
                ],
                //교환불가(관리자)
                ORDER_STATUS_EXCHANGE_IMPOSSIBLE => [
                    ORDER_STATUS_EXCHANGE_IMPOSSIBLE => [
                        "RPD" => ["type" => "N", "title" => "반품상품 훼손/파손"],
                        "RPPD" => ["type" => "N", "title" => "반품상품포장 훼손/파손"],
                        "BNC" => ["type" => "N", "title" => "구매자 연락되지 않음"]
                    ]
                ],
                //배송완료(관리자)
                ORDER_STATUS_DELIVERY_COMPLETE => [
                    //반품요청
                    ORDER_STATUS_RETURN_APPLY => [
                        "OCF" => ["type" => "B", "title" => "사이즈,색상잘못선택"],
                        "PD" => ["type" => "S", "title" => "배송상품 파손/하자"],
                        "DE" => ["type" => "S", "title" => "배송상품 오배송"],
                        "PNT" => ["type" => "S", "title" => "상품미도착"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ],
                    //교환요청
                    ORDER_STATUS_EXCHANGE_APPLY => [
                        "OCF" => ["type" => "B", "title" => "사이즈,색상잘못선택"],
                        "PD" => ["type" => "S", "title" => "배송상품 파손/하자"],
                        "DE" => ["type" => "S", "title" => "배송상품 오배송"],
                        "PNT" => ["type" => "S", "title" => "상품미도착"],
                        "PIE" => ["type" => "S", "title" => "상품정보상이"],
                        "ETCB" => ["type" => "B", "title" => "기타(구매자책임)"],
                        "ETCS" => ["type" => "S", "title" => "기타(판매자책임)"]
                    ]
                ],
                //반품거부(관리자)
                ORDER_STATUS_RETURN_DENY => [
                    ORDER_STATUS_RETURN_DENY => [
                        "MPNE" => ["type" => "N", "title" => "주문제작상품으로 교환불가"],
                        "NEP" => ["type" => "N", "title" => "교환불가상품(상세페이지참조)"],
                        "ETC" => ["type" => "N", "title" => "기타"]
                    ]
                ],
                //반품보류(관리자)
                ORDER_STATUS_RETURN_DEFER => [
                    ORDER_STATUS_RETURN_DEFER => [
                        "NRA" => ["type" => "N", "title" => "반품상품 미입고"],
                        "NRDP" => ["type" => "N", "title" => "반품배송비 미동봉"],
                        "RPD" => ["type" => "N", "title" => "반품상품 훼손/파손"],
                        "RPPD" => ["type" => "N", "title" => "반품상품포장 훼손/파손"],
                        "ETC" => ["type" => "N", "title" => "기타"]
                    ]
                ],
                //반품불가(관리자)
                ORDER_STATUS_RETURN_IMPOSSIBLE => [
                    ORDER_STATUS_RETURN_IMPOSSIBLE => [
                        "RPD" => ["type" => "N", "title" => "반품상품 훼손/파손"],
                        "RPPD" => ["type" => "N", "title" => "반품상품포장 훼손/파손"],
                        "BNC" => ["type" => "N", "title" => "구매자 연락되지 않음"]
                    ]
                ]
            ]
        ];

        if (isset($data[$type][$fkey][$skey])) {
            if ($code === false) {
                return $data[$type][$fkey][$skey];
            } elseif ($key === false) {
                return ($data[$type][$fkey][$skey][$code] ?? []);
            } else {
                return ($data[$type][$fkey][$skey][$code][$key] ?? '');
            }
        } else {
            return '';
        }
    }
}