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
                        "PU" => ["type" => "B", "title" => "서비스 및 상품 불만족"],
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
                        "PU" => ["type" => "B", "title" => "서비스 및 상품 불만족"],
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
                        "PU" => ["type" => "B", "title" => "서비스 및 상품 불만족"],
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