<?php

namespace CustomScm\Model\Npay;

/**
 * 네이버페이 주문형 주문 관련 모델
 *
 * @author sammy
 */
class NaverPayOrder extends \ForbizScm\Model\Npay\NaverPayOrder
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 주문내역 상세조회
     * @param {string} $orderNo = 주문번호
     */
    public function getProductOrderInfoList($orderNo)
    {
        $return = parent::getProductOrderInfoList($orderNo);

        return $return;
    }

    /**
     * npay 주문조회
     * @param $sdate = 조회 시작 일시 YYYY-MM-DDThh:mm:ss
     * @param $edate = 조회 종료 일시 YYYY-MM-DDThh:mm:ss
     * @param $statuscode = 최종 상품 주문 상태 코드 =>
     * PAY_WAITING-입금대기, PAYED-결제완료, DISPATCHED-발송처리, CANCEL_REQUESTED-취소요청, RETURN_REQUESTED-반품요청,
     * EXCHANGE_REQUESTED-교환요청, EXCHANGE_REDELIVERY_READY-교환 재배송 준비, HOLDBACK_REQUESTED-구매확정 보류요청,
     * CANCELED-취소, RETURNED-반품, EXCHANGED-교환, PURCHASE_DECIDED-구매확정
     */
    public function getChangedProductOrderList($sdate = '', $edate = '', $statuscode = '', $inquiryExtraData = '')
    {
        $result = parent::getChangedProductOrderList($sdate, $edate, $statuscode, $inquiryExtraData);

        return $result;
    }

    /**
     * 상품 평가내역 조회
     * @param $startTime
     * @param $endTime
     * @return array
     */
    public function getReviewList($startTime, $endTime)
    {
        $premiumReview = $this->getReviewList_premium($startTime, $endTime);
        $generalReview = $this->getReviewList_general($startTime, $endTime);

        $review_list = array_merge($premiumReview, $generalReview);

        return $review_list;
    }

    public function getReviewList_premium($startTime, $endTime)
    {
        $return = parent::getReviewList_premium($startTime, $endTime);

        return $return;
    }

    public function getReviewList_general($startTime, $endTime)
    {
        $return = parent::getReviewList_general($startTime, $endTime);

        return $return;
    }

    /**
     * 발송처리
     * @param $coOdIx
     * @param $data
     * @return array
     */
    public function shipProductOrder($coOdIx, $data)
    {
        $return = parent::shipProductOrder($coOdIx, $data);

        return $return;
    }

    /**
     * 상태변경 공통함수
     * @param $orderNo = 주문번호
     * @param $operation = 오퍼레이션 => 발주처리(PlaceProductOrder), 발송지연(DelayProductOrder), 취소승인(ApproveCancelApplication),
     *                                  취소요청(CancelSale), 반품접수(RequestReturn) 반품보류(WithholdReturn),
     *                                  반품승인(ApproveReturnApplication), 반품거부(RejectReturn), 반품보류해제(ReleaseReturnHold),
     *                                  교환수거완료(ApproveCollectedExchange), 교환상품재배송(ReDeliveryExchange),
     *                                  교환거부(RejectExchange), 교환보류(WithholdReturn)
     */
    public function doApproveOperation($orderNo, $operation, $orderData = [])
    {
        $return = parent::doApproveOperation($orderNo, $operation, $orderData);

        return $return;
    }

    /**
     * 문의 내역 조회 후 저장
     * @param $startTime
     * @param $endTime
     * @return array
     */
    public function getCustomerInquiryList($startTime, $endTime)
    {
        $inquiryData = parent::getCustomerInquiryList($startTime, $endTime);

        return $inquiryData;
    }

    /**
     * 문의 답변 및 수정
     * @param $datas
     * @return resultData
     */
    public function answerCustomerInquiry($datas)
    {
        $result = parent::answerCustomerInquiry($datas);

        return $result;
    }

    /**
     * 클레임 요청 사유 코드
     * @param $code
     * @param string $from
     * $from => NpayCancel = 네이버페이 취소, NpayReturn = 네이버페이 반품/교환, mall = 자사몰 어드민 클레임
     * @return string
     */
    public function getClaimRequestReasonCode($code, $from = '')
    {
        if ($from == 'NpayCancel') {
            //from Npay
            switch ($code) {
                case 'SOLD_OUT':                    //상품 품절
                    $result = "PSO";
                    break;
                case 'INTENT_CHANGED':              //구매 의사 취소
                    $result = "NB";
                    break;
                case 'COLOR_AND_SIZE':              //색상 및 사이즈 변경
                    $result = "DPB";
                    break;
                case 'WRONG_ORDER':                 //다른 상품 잘못 주문
                    $result = "DPB";
                    break;
                case 'PRODUCT_UNSATISFIED':         //서비스 및 상품 불만족
                    $result = "PU";
                    break;
                case 'INCORRECT_INFO':              //상품 정보 상이
                    $result = "PIE";
                    break;
                case 'DELAYED_DELIVERY':            //배송 지연
                    $result = "DD";
                    break;
                default :
                    $result = 'ETC';
                    break;
            }
        } elseif ($from == 'NpayReturn') {
            //from Npay
            switch ($code) {
                case 'SOLD_OUT':                    //상품 품절
                    $result = "PSO";
                    break;
                case 'INTENT_CHANGED':              //구매 의사 취소
                    $result = "ETCB";
                    break;
                case 'COLOR_AND_SIZE':              //색상 및 사이즈 변경
                    $result = "OCF";
                    break;
                case 'WRONG_ORDER':                 //다른 상품 잘못 주문
                    $result = "OCF";
                    break;
                case 'PRODUCT_UNSATISFIED':         //서비스 및 상품 불만족
                    $result = "PU";
                    break;
                case 'INCORRECT_INFO':              //상품 정보 상이
                    $result = "PIE";
                    break;
                case 'DELAYED_DELIVERY':            //배송 지연
                    $result = "PNT";
                    break;
                case 'DROPPED_DELIVERY':            //배송 누락
                    $result = "PNT";
                    break;
                case 'BROKEN':                      //상품 파손
                    $result = "PD";
                    break;
                case 'WRONG_DELIVERY':              //오배송
                    $result = "DE";
                    break;
                case 'WRONG_OPTION':                //색상 등이 다른 상품을 잘못 배송
                    $result = "DE";
                    break;
                default :
                    $result = 'ETC';
                    break;
            }
        } else {
            //to Npay
            switch ($code) {
                case 'OCF' :                        // 사이즈, 색상 잘못 선택
                    $result = 'COLOR_AND_SIZE';
                    break;
                case 'PD' :                        // 배송상품 파손/하자
                    $result = 'BROKEN';
                    break;
                case 'DE' :                        // 배송상품 오배송
                    $result = 'WRONG_DELIVERY';
                    break;
                case 'PNT' :                        //상품미도착
                    $result = 'DROPPED_DELIVERY';
                    break;
                case 'PIE' :                        //상품정보 틀림
                    $result = 'INCORRECT_INFO';
                    break;
                case 'DPB' :                        //다른상품 구매
                    $result = 'INTENT_CHANGED';
                    break;
                case 'NB' :                        //구매의사 없음/변심
                    $result = 'INTENT_CHANGED';
                    break;
                case 'DD' :                        //배송처리늦음/지연
                    $result = 'DELAYED_DELIVERY';
                    break;
                case 'PSL' :                        //상품 재고 부족
                    $result = 'SOLD_OUT';
                    break;
                case 'PSO' :                        //상품 품절
                    $result = 'SOLD_OUT';
                    break;
                case 'PU' :                        //서비스 및 상품 불만족
                    $result = 'PRODUCT_UNSATISFIED';
                    break;
            }
        }
        return $result;
    }

    /**
     * 택배사 코드 목록
     * @param {string} $dlvEtprsCd = 쇼핑몰 택배사 코드
     * @return {string} $dlvComCode = 샵N 택배사 코드
     */
    public function getDeliveryCompanyCode($dlvEtprsCd)
    {
        switch ($dlvEtprsCd) {
            case '01':    //    우체국택배
                $result = "EPOST";
                break;
            case '05':    //	로젠택배
                $result = "KGB";
                break;
            case '06':    //	대한통운
                $result = "CJGLS";
                break;
            case '12':    //	현대택배(롯데택배)
                $result = "HYUNDAI";
                break;
            case '13':    //	한진택배
                $result = "HANJIN";
                break;
            case '18':    //	CJ대한통운
                $result = "CJGLS";
                break;
            case '21':    //	경동택배
                $result = "KDEXP";
                break;
            case '24':    //	건영택배
                $result = "KUNYOUNG";
                break;
            case '25':    //	천일택배
                $result = "CHUNIL";
                break;
            case '26':    //	합동택배
                $result = "HDEXP";
                break;
            case '27':    //	호남택배
                $result = "HONAM";
                break;
            case '42':    //	CVSNET(편의점택배)
                $result = "CVSNET";
                break;
            case '44':    //	FEDEX
                $result = "FEDEX";
                break;
            case '45':    //	DHL
                $result = "DHL";
                break;
            case '46':    //	UPS
                $result = "UPS";
                break;
            case '47':    //	i-parcel
                $result = "IPARCEL";
                break;
            case '50':    //	범한판토스
                $result = "PANTOS";
                break;
            case '51':    //	ACI Express
                $result = "ACIEXPRESS";
                break;
            case 'CH1' :    //  기타택배
                $result = "40";
                break;
            case 'EPOST':    //	우체국택배
                $result = "01";
                break;
            case 'KGB':    //	로젠택배
                $result = "05";
                break;
            case 'HYUNDAI':    //	현대택배(롯데택배)
                $result = "12";
                break;
            case 'HANJIN':    //	한진택배
                $result = "13";
                break;
            case 'CJGLS':    //	CJ대한통운
                $result = "18";
                break;
            case 'KDEXP':    //	경동택배
                $result = "21";
                break;
            case 'KUNYOUNG':    //	건영택배
                $result = "24";
                break;
            case 'CHUNIL':    //	천일택배
                $result = "25";
                break;
            case 'HDEXP':    //	합동택배
                $result = "26";
                break;
            case 'HONAM':    //	호남택배
                $result = "27";
                break;
            case 'CVSNET':    //	CVSNET(편의점택배)
                $result = "42";
                break;
            case 'FEDEX':    //	FEDEX
                $result = "44";
                break;
            case 'DHL':    //	DHL
                $result = "45";
                break;
            case 'UPS':    //	UPS
                $result = "46";
                break;
            case 'IPARCEL':    //	i-parcel
                $result = "47";
                break;
            case 'PANTOS':    //	범한판토스
                $result = "50";
                break;
            case 'ACIEXPRESS':    //	ACI Express
                $result = "51";
                break;
            default :       //기타택배
                $result = $dlvEtprsCd;  //  $result = "40";
                break;
        }

        return $result;
    }

    /**
     * 파일 로그 남기기
     *
     * @param $cmt
     * @param $data
     */
    public function logWrite($cmt, $data, $function_name)
    {
        $file = fopen($_SERVER["DOCUMENT_ROOT"] . '/data/meta_data/_logs/npay/call_history_' . date('Ymd') . '.txt', 'a');
        $text = '------------------------------------------------------------------------------------' . "\n";
        $text .= '[Call] ' . $function_name . "\n";
        $text .= $cmt . "\n";
        $text .= $data . "\n";

        fwrite($file, $text);
        fclose($file);
        unset($text);
    }

}