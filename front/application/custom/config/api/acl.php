<?php
// 접근 가능 API
// '{uri}::*' =>  모든 방식 접근 가능
// '{uri}::get' => GET 방식 접근 가능
// '{uri}::post' => POST 방식 접근 가능
// '{uri}::put' => PUT 방식 접근 가능
// '{uri}::delete' => DELETE 방식 접근 가능
return [
    // Product
    'api/v1/product::get' => true,
    'api/v1/product::post' => true,
    'api/v1/product::put' => true,
    // ProductState
    'api/v1/productState::get' => true,
    'api/v1/productState::put' => true,
    // ProductQna
    'api/v1/productQna::get' => true,
    // ProductQnaReply
    'api/v1/productQnaReply::get' => true,
    'api/v1/productQnaReply::post' => true,
    // OptionStock
    'api/v1/optionStock::get' => true,
    'api/v1/optionStock::put' => true,
    // Category
    'api/v1/category::get' => true,
    // Brand
    'api/v1/brand::get' => true,
    // Mandatory
    'api/v1/mandatory::get' => true,
    // DeliveryTemplate
    'api/v1/deliveryTemplate::get' => true,
    // DeliveryCompany
    'api/v1/deliveryCompany::get' => true,
    // PlaceInfo
    'api/v1/placeInfo::get' => true,
    // Order
    'api/v1/order::get' => true,
    // OrderStatus
    'api/v1/orderStatus::put' => true,
];