<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

// 네이버페이 전용 헬퍼 로드
require_once (__DIR__.'/npay.helper.php');

// 프레임워크 로드
$view = getForbizView(false);

////////////////////////////
// 마스터 DB로 처리 START //
start_master_db();
////////////////////////////

// 찜 타입
$wtype = $view->getParams(0);
// 상품 or cart 정보
$wid = $view->input->get('id') ?:[];

for($i=0; $i < count($wid); $i++) {
    if($wid[$i] == '') {
        unset($wid[$i]);
    }
}

if (!empty($wid)) {
    $res = npay_wish($wid, $wtype);
    $host = npay_api_wish_host();

    if(is_mobile()){
        $url = '/mobile/customer/wishList.nhn';
    } else {
        $url = '/customer/wishlistPopup.nhn';
    }

    $wishlistPopupUrl = 'https://' . $host . $url;

} else {
    $res = [
        'result' => 'fail'
        , 'data' => '상품정보가 없습니다.'
    ];
}
?>

<html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <?php if ($res['result'] == 'success'): ?>
            <form name="frm" method="get" action="<?= $wishlistPopupUrl ?>">
                <input type="hidden" name="SHOP_ID" value="<?= ForbizConfig::getMallConfig('naverpay_other_pg_shop_id') ?>">
                <?php foreach ($res['data'] as $item_id): ?>
                    <input type="hidden" name="ITEM_ID" value="<?= $item_id ?>">
                <?php endforeach; ?>
            </form>
            <script>
                document.frm.target = "_top";
                document.frm.submit();
            </script>
        <?php else: ?>
            <h1><?= $res['result'].':'.$res['data'] ?></h1>
        <?php endif; ?>
    </body>
</html>
