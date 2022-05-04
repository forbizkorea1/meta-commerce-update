<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

// Load Forbiz View
$view = getForbizView();

////////////////////////////
// 마스터 DB로 처리 START //
start_master_db();
////////////////////////////

$isLogin = is_login();

if ($isLogin) {
    $view->define(['userTemplate' => "shop/infoinput/infoinput_member.htm"]);
} else {
    $view->define(['userTemplate' => "shop/infoinput/infoinput_non_member.htm"]);
}
$view->define(['cartTemplate' => "shop/infoinput/infoinput_item_template.htm"]);

$cartIx = $view->input->get('cartIx');
if (empty($cartIx)) {
    redirect('/shop/cart');
    exit;
}

$cartIxs = explode(",", $view->input->get('cartIx'));

//장바구니 정보 가지고 오기
/* @var $cartModel CustomMallCartModel */
$cartModel = $view->import('model.mall.cart');

$cartData = $cartModel->get($cartIxs);
$cartSummary = $cartModel->getSummary($cartData);

if (empty($cartData)) {
    redirect('/shop/cart');
    exit;
}

$view->assign('cart', $cartData);
$view->assign('cartSummary', $cartSummary['summary']);

/* @var $companyModel CustomMallCompanyModel */
$companyModel = $view->import('model.mall.company');

//모바일에서 상품 노출 구조가 다름
if (is_mobile()) {
    $firstCartDeliveryTemplateData = false;
    $moreCartDeliveryTemplateData = [];
    foreach ($cartData as $cart) {
        foreach ($cart['deliveryTemplateList'] as $deliveryTemplate) {
            if ($firstCartDeliveryTemplateData === false) {
                $firstCartDeliveryTemplateData = [$deliveryTemplate];
            } else {
                $moreCartDeliveryTemplateData[] = $deliveryTemplate;
            }
        }
    }

    $view->assign('firstCartDeliveryTemplateData', $firstCartDeliveryTemplateData);
    $view->assign('moreCartDeliveryTemplateData', $moreCartDeliveryTemplateData);
}


//개인정보 제3자 정보 제공 동의 노출 조건 체크
$isThirdBool = true;
//장바구니 상품명 축약
$contractionProductName = "";
//장바구니 상품종류 갯수
$productKindCount = 0;
//장바구니 담긴 상품 정보
$cartProductList = [];
foreach ($cartData as $cart) {
    if ($cart['company_id'] != ForbizConfig::getCompanyInfo('company_id')) {
        $isThirdBool = true;
    }

    foreach ($cart['deliveryTemplateList'] as $deliveryTemplate) {
        foreach ($deliveryTemplate['productList'] as $product) {
            $cartProductList[] = ['cart_ix' => $product['cart_ix'], 'pname' => $product['pname'], 'options_text' => $product['options_text']];

            if (empty($contractionProductName)) {
                $contractionProductName = $product['pname'];
            }
            $productKindCount++;
        }
    }
}
if ($productKindCount > 1) {
    $contractionProductName .= ' 외 ' . ($productKindCount - 1) . '건';
}
$view->assign('isThirdBool', $isThirdBool);
$view->assign('contractionProductName', $contractionProductName);
$view->assign('productKindCount', $productKindCount);

$view->assign('cartProductList', $cartProductList);

//자동 취소 일자
$cancelAutoDay = ForbizConfig::getMallConfig('mall_cc_interval');
$view->assign('cancelAutoDay', $cancelAutoDay);

// 결제수단 종류 확인
$view->assign('sattle_module', ForbizConfig::getMallConfig('sattle_module'));
$sattle_module = ForbizConfig::getMallConfig('sattle_module');

if (!empty(ForbizConfig::getPaymentConfig('mainPayMethod', $sattle_module))) {
    $mainPayMethodArray = explode('|', ForbizConfig::getPaymentConfig('mainPayMethod', $sattle_module) ?? "");

    $view->assign('mainPayMethodArray', $mainPayMethodArray);

    $mainPayMethod = [
        ORDER_METHOD_CARD => '신용카드 결제',
        ORDER_METHOD_VBANK => '가상계좌 결제',
        ORDER_METHOD_ICHE => '실시간 계좌이체',
        ORDER_METHOD_PHONE => '휴대폰 결제'
    ];

    $view->assign('mainPayMethod', $mainPayMethod);
}
if (!empty(ForbizConfig::getPaymentConfig('simplePayMethod', $sattle_module))) {
    $simplePayMethodArray = explode('|', ForbizConfig::getPaymentConfig('simplePayMethod', $sattle_module) ?? "");

    $view->assign('simplePayMethodArray', $simplePayMethodArray);

    $simplePayMethod = [
        ORDER_METHOD_INAPP_PAYCO => '페이코',
        ORDER_METHOD_INAPP_NAVERPAY => '네이버페이',
        ORDER_METHOD_INAPP_KAKAOPAY => '카카오페이',
        ORDER_METHOD_INAPP_SSGPAY => '쓱페이',
        ORDER_METHOD_INAPP_SSPAY => '삼성페이',
        ORDER_METHOD_INAPP_SKPAY => 'SK페이',
        ORDER_METHOD_INAPP_LPAY => '엘페이',
        ORDER_METHOD_INAPP_TOSS => 'TOSS', 
        ORDER_METHOD_INAPP_KPAY => '케이페이',
        ORDER_METHOD_INAPP_KBANKPAY => '케이뱅크페이'
    ];

    $view->assign('simplePayMethod', $simplePayMethod);

    if (is_mobile()) {
        $simpleClassArray = [
            ORDER_METHOD_INAPP_PAYCO => 'payco',
            ORDER_METHOD_INAPP_KAKAOPAY => 'kakaoPay',
            ORDER_METHOD_INAPP_NAVERPAY => 'nPay',
            ORDER_METHOD_INAPP_SSGPAY => 'ssg',
            ORDER_METHOD_INAPP_SKPAY => 'sk',
            ORDER_METHOD_INAPP_TOSS => 'toss'
        ];
    } else {
        $simpleClassArray = [
            ORDER_METHOD_INAPP_PAYCO => 'payco',
            ORDER_METHOD_INAPP_KAKAOPAY => 'kakao',
            ORDER_METHOD_INAPP_NAVERPAY => 'npay',
            ORDER_METHOD_INAPP_SSGPAY => 'ssg',
            ORDER_METHOD_INAPP_SKPAY => 'sk',
            ORDER_METHOD_INAPP_TOSS => 'toss'
        ];
    }

    $view->assign('simpleClassArray', $simpleClassArray);
}

//추가 결제 수단
$view->assign('naverpay_pg_service_use', ForbizConfig::getMallConfig('naverpay_pg_service_use'));
$view->assign('payco_service_use', ForbizConfig::getMallConfig('payco_service_use'));
$view->assign('toss_service_use', ForbizConfig::getMallConfig('toss_service_use'));

//결제 스크립트
/* @var $paymentGatewayModel CustomMallPaymentGatewayModel */
$paymentGatewayModel = $view->import('model.mall.payment.gateway');
$view->assign('paymentIncludeJavaScript', $paymentGatewayModel->getPaymentIncludeJavaScript());

if ($isLogin) {

    //마일리지 정보 
    /* @var $mileageModel CustomMallMileageModel */
    $mileageModel = $view->import('model.mall.mileage');

    $userMileage = $mileageModel->getUserAmount();

    $maxUseMileage = $userMileage;
    $mileageConditionUseDeliverypriceYn = $mileageModel->getConfig('deliveryprice');
    if ($mileageConditionUseDeliverypriceYn == 'Y') {
        $mileageTargetPrice = $cartSummary['summary']['payment_price'];
    } else {
        $mileageTargetPrice = $cartSummary['summary']['product_dcprice'];;
    }
    if ($userMileage > $mileageTargetPrice) {
        $maxUseMileage = $mileageTargetPrice;
    }

    $mileageRateRound = 0;
    $unitPosition = 1;
    switch ($mileageModel->getConfig('use_unit')) {
        case '1':
            $mileageRateRound = 0;
            $unitPosition = 1;
            break;
        case '10':
            $mileageRateRound = -1;
            $unitPosition = 2;
            break;
        case '100':
            $mileageRateRound = -2;
            $unitPosition = 3;
            break;
    }

    $mileageConditionUseLimitType = "noLimit";
    $mileageConditionUseLimitValue = "";
    $mileageRatePrice = 0;
    switch ($mileageModel->getConfig('mileage_one_use_type')) {
        case '1';
            $mileageConditionUseLimitType = "price";
            $mileageConditionUseLimitValue = $mileageModel->getConfig('use_mileage_max');
            if ($mileageConditionUseLimitValue < $maxUseMileage) {
                $maxUseMileage = $mileageConditionUseLimitValue;
            }
            break;
        case '2';
            $mileageConditionUseLimitType = "rate";
            $mileageConditionUseLimitValue = $mileageModel->getConfig('max_goods_sum_rate');
            if ($mileageConditionUseLimitValue > 0) {
                $mileageRatePrice = calNumberCutting(($mileageTargetPrice * $mileageConditionUseLimitValue) / 100, $unitPosition, 1);
                if ($mileageRatePrice < $maxUseMileage) {
                    $maxUseMileage = $mileageRatePrice;
                }
            }
            break;
    }
    $view->assign('mileageConditionUseLimitType', $mileageConditionUseLimitType);
    $view->assign('mileageConditionUseLimitValue', $mileageConditionUseLimitValue);

    $mileage_use_yn = $mileageModel->getConfig('mileage_use_yn');
    $mileageConditionMinBuyAmt = $mileageModel->getConfig('total_order_price') ?? 0;
    $view->assign([
        'mileageName' => $mileageModel->getName()
        , 'mileageUnit' => $mileageModel->getUnit()
        , 'userMileage' => $userMileage
        , 'mileageConditionMinMileage' => $mileageModel->getConfig('min_mileage_price')
        , 'mileageConditionUseUnit' => $mileageModel->getConfig('use_unit')
        , 'mileageConditionMinBuyAmt' => $mileageConditionMinBuyAmt
        , 'maxUseMileage' => $maxUseMileage
        , 'mileageTargetPrice' => $mileageTargetPrice
        , 'mileageConditionUseDeliverypriceYn' => $mileageConditionUseDeliverypriceYn
        , 'useMileageBool' => ($mileage_use_yn == 'Y' && $mileageTargetPrice >= $mileageConditionMinBuyAmt)
    ]);

    //쿠폰 정보
    /* @var $couponModel CustomMallCouponModel */
    $couponModel = $view->import('model.mall.coupon');
    $userCouponCnt = $couponModel->getCouponCnt(false);
    $view->assign('userCouponCnt', $userCouponCnt);
    $view->assign('coupon_use_yn', $couponModel->getConfig('coupon_use_yn'));

    //회원 정보
    $view->assign('buyerName', sess_val('user', 'name'));

    $buyerEmail = sess_val('user', 'mail');
    $view->assign('buyerEmail', $buyerEmail);

    $buyerMobile = sess_val('user', 'pcs');
    $view->assign('buyerMobile', $buyerMobile);
    $ExBuyerMobile = explode("-", $buyerMobile);
    $view->assign('buyerMobile1', ($ExBuyerMobile[0] ?? ''));
    $view->assign('buyerMobile2', ($ExBuyerMobile[1] ?? ''));
    $view->assign('buyerMobile3', ($ExBuyerMobile[2] ?? ''));
}

///////////////////////////
// 마스터 DB로 처리 END //
end_master_db();
///////////////////////////

//슬레이브 디비 타기 위하여 end_master_db() 아래로 이동//

//약관
$view->assign($companyModel->getPolicy('consign', 'third', 'collection'));
if (!$isLogin) {
    //비회원 약관 동의 가지고 오기
    $nonMemberPolicy = $companyModel->getPolicy('terms-nomember');
    $view->assign('termsNonMember', ($nonMemberPolicy['terms-nomember']['contents'] ?? ''));
}

echo $view->loadLayout();