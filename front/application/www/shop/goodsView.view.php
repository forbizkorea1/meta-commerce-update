<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

// Load Forbiz View
$view = getForbizView();

// 상품 코드
$id  = $view->getParams(0);
// 카테고리 코드
$cid = $view->getParams(1);

if ($id != '') {
    $id = zerofill($id);

    /* @var $productModel CustomMallProductModel */
    $productModel = $view->import('model.mall.product');

    //상품 상세 정보
    $datas = $productModel->get($id);

    //할인정보 전체
    $basicTypeList = ['IN', 'MG', 'GP', 'SP'];   //할인정보 전체 키
    $addedTypeList = array_column($datas['discountList'], 'type'); //할인된 내역
    $fullTypeList = array_unique(array_merge($basicTypeList, $addedTypeList)); //병합후 중복제거
    $rearrangement = [];
    $lastDcPrice = 0;
    //할인안된 내역 0 값으로 추가
    foreach ($fullTypeList as $type) {
        if (!in_array($type, $addedTypeList)) {
            $dcData = [
                'type' => $type,
                'title' => ForbizConfig::getDiscount($type),
                'discount_amount' => 0
            ];
        } else {
            $key = array_search($type, $addedTypeList);
            $dcData = $datas['discountList'][$key];

            $lastDcPrice += $datas['discountList'][$key]['discount_amount'];
        }
        array_push($rearrangement, $dcData);
    }

    $datas['discountList'] = $rearrangement;   //할인내역 재정렬

    $view->assign($datas);
    $view->assign('lastDcPrice', $lastDcPrice);

    $isUserAdult   = (sess_val('user', 'age') >= '19' ? true : false);
    
    if($datas['is_adult'] && !$isUserAdult) {
        //19금상품 미성년일 경우 접근불가
        if(is_login()) {
            //로그인
            if($view->input->server('HTTP_REFERER')){
                echo "<script>alert('만 19세 이상만 구매 가능합니다.');location.href='".$view->input->server('HTTP_REFERER')."';</script>";
            }else{
                echo "<script>alert('만 19세 이상만 구매 가능합니다.');location.href='/';</script>";
            }

            exit;
        }else {
            //비로그인
            echo "<script>location.href='/member/login';</script>";
            exit;
        }
    } else if (!isset($datas['status']) || $datas['status'] == 'stop') {
        //판매중지 상품일 경우
        echo "<script>alert('판매중지된 상품입니다.');location.href='/';</script>";
        exit;
    } else {
        // 카테고리 코드 점검
        $cid = $cid ? $cid : $datas['cid'];

        /* @var $cartModel CustomMallCartModel */
        $cartModel   = $view->import('model.mall.cart');
        /* @var $sellerModel CustomMallSellerModel */
        $sellerModel = $view->import('model.mall.seller');
        /* @var $reviewModel CustomMallProductReviewModel */
        $reviewModel = $view->import('model.mall.productReview');
        /* @var $qnaModel CustomMallProductQnaModel */
        $qnaModel    = $view->import('model.mall.productQna');
        /* @var $couponModel CustomMallCouponModel */
        $couponModel = $view->import('model.mall.coupon');

        /* @var $mileageModel CustomMallMileageModel */
        $mileageModel = $view->import('model.mall.mileage');


        //쿠폰 리스트
        $couponList = $couponModel->getMallCouponList($id);

        if(!empty($couponList)) {
            $discountCouponPrice['discount_amount'] = $couponModel->calculationDiscount($datas['dcprice'], $couponList[0])['discount_amount'];
            $discountCouponPrice['total_coupon_with_dcprice'] = f_decimal($datas['dcprice']) - $discountCouponPrice['discount_amount'];
        }else {
            $discountCouponPrice = [];
        }


        //상품 배송정책 정보
        $deliveryInfos = $cartModel->getDeliveryInfo($datas['dt_ix']);
        //상품문의 개수
        $qnas          = $qnaModel->getCount($id);
        //각 상품후기 개수
        $reviews       = $reviewModel->getCount($id);

        // Data Assign
        $view->assign([
            'pid' => $id //상품 시스템코드, 카테고리값. ex) 상세주소/상품시스템코드/카테고리
            , 'coupon_use_yn' => ForbizConfig::getSharedMemory("b2c_coupon_rule")['coupon_use_yn']
            , 'categorys' => $productModel->getCategoryNavigationList($cid) //상품 카테고리 정보
            , 'delivery' => $deliveryInfos //상품 배송정책 정보
            , 'mandatoryInfos' => $productModel->getMandatoryInfos($id) //상품 상세고시 정보
            , 'relationInfos' => $productModel->getRelationProducts($id) //추천 연관상품
            , 'promotionInfos' => $productModel->getRelationPromotion($id) //관련 기획전
            , 'displayOptionInfos' => $productModel->getDisplayOptions($id) //디스플레이옵션
            , 'ranking' => $productModel->getCategoryRanking(15, $datas['cid']) //카테고리별 랭킹 정보
            //셀러 정보
            , 'sellerNotice' => $sellerModel->getSellerNotice($datas['admin']) //셀러 상품상세 공지사항
            , 'deadline' => $sellerModel->getSellerDeadline($deliveryInfos['company_id']) //셀러 배송 마감시간
            // 상품후기
            , 'avg' => $reviewModel->getAverage($id)
            , 'premiumReviewTotal' => $reviews['premiumReview']
            , 'reviewTotal' => $reviews['review']
            , 'allReviewTotal' => $reviews['total']
            // 상품문의 갯수
            , 'qnaTotal' => $qnas['all']
            , 'myQnaTotal' => $qnas['mine']
            //상품문의 분류
            , 'qnaDivs' => $qnaModel->getAllDivs()
            //쿠폰 다운로드 갯수
            , 'couponApplyCnt' => (is_null($couponList) ? 0 : count($couponList))
            //카드 혜택정보
            , 'cardBenefit' => get_schedule_banner_info(5)
            // 상품후기 등록가능 여부
            ,'afterRule' =>  ForbizConfig::getSharedMemory('use_after')
            //쿠폰혜택가
            ,'discountCouponPrice' =>  $discountCouponPrice
            //마일리지 설정 정보
            ,'mileageName' =>$mileageModel->getName()
            ,'mileageUnit' =>$mileageModel->getUnit()
        ]);


        //상품문의 설정값 적용
        $productQnaSetting = ForbizConfig::getSharedMemory('product_qna');
        $view->assign('productQnaSetting', $productQnaSetting);

        //sns 메타태그 데이터 assign
        $view->setLayoutAssign('isSnsShare', 'Y');

        $view->setLayoutAssign('snsShareImage', get_product_images_src($datas['id'], $isUserAdult, 'm', $datas['is_adult']));
        $view->setLayoutAssign('snsShareTitle', $datas['pname']);
        $view->setLayoutAssign('snsShareUrl', HTTP_PROTOCOL.FORBIZ_HOST.'/shop/goodsView/'.$id);


        // content output
        echo $view->loadLayout();
    }

} else {
    show_error('등록되지 않은 상품입니다.');
}
