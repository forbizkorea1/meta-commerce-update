<?php

if (!defined('BASEPATH')) exit('No direct script access allowed');

$view = getForbizView();

$quick = $view->getParams(0);
$invoice_no = $view->getParams(1);

$deliveryInfo = get_delivery_info($quick, $invoice_no);

if ($deliveryInfo) {
    // 서비스 결제시
    $view->assign('deliveryInfo', $deliveryInfo);
    $view->assign('invoice_no', $invoice_no);
    // content output
    echo $view->loadLayout();
} else {
    // 서비스 미결제시
    redirect('/mypage/searchGoodsFlow/' . $quick . '/' . $invoice_no);
}

