<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

// Load Forbiz View
$view = getForbizView();

$eventIx = $view->getParams(0);

/* @var $eventModel CustomMallEventModel */
$eventModel = $view->import('model.mall.event');

//진행이벤트상세
$eventData = $eventModel->getEventDetail($eventIx);
if(empty($eventData)){
    redirect('/');
    exit;
}

//sns 메타태그 데이터 assign
$view->setLayoutAssign('isSnsShare', 'Y');
$domain = (!empty(IMAGE_SERVER_DOMAIN) ? IMAGE_SERVER_DOMAIN : HTTP_PROTOCOL . FORBIZ_HOST );

if(file_exists(MALL_DATA_PATH . "/images/event/" . $eventIx . "/event_banner_og" . $eventIx . ".gif")) {
    $imgPath = $domain . DATA_ROOT . "/images/event/" . $eventIx . "/event_banner_og" . $eventIx . ".gif";
} else {
    $imgPath = '';
}
$view->setLayoutAssign('snsShareImage', $imgPath);
$view->setLayoutAssign('snsShareTitle', $eventData['event_title']);
$view->setLayoutAssign('snsShareUrl', HTTP_PROTOCOL.FORBIZ_HOST.'/event/eventDetail/'.$eventIx);


$view->assign('event_ix', $eventIx);                   //진행이벤트 키
$view->assign($eventData);

$eventGroupGoodsData = $eventModel->getEventGroupGoods($eventIx);
$view->assign('eventGroupGoodsData', $eventGroupGoodsData);

$remainCnt = count($eventGroupGoodsData) % 3;
if($remainCnt > 0){
    $view->assign('remainCnt', 3 - $remainCnt);
}else{
    $view->assign('remainCnt', $remainCnt);
}

echo $view->loadLayout();
