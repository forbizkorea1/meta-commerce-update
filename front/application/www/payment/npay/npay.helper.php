<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

if (!function_exists('npay_get_data')) {

    function npay_get_data()
    {
        $data = [];
        parse_str(getForbiz()->input->server('QUERY_STRING'), $data);

        return !empty($data) ? $data : false;
    }
}

if (!function_exists('npay_get_pinfo')) {

    function npay_get_pinfo($data)
    {
        /* @var $productModel CustomMallProductModel */
        $productModel = getForbiz()->import('model.mall.product');
        /* @var $cartModel CustomMallCartModel */
        $cartModel = getForbiz()->import('model.mall.cart');

        $rows = [];

        if (!empty($data)) {
            foreach ($data as $product) {
                $row = $productModel->get($product['id']);
                if (!empty($row)) {
                    if (!empty($product['merchantProductId'])) {
                        $row['option'] = $productModel->getOption($product['id']);
                        $row['merchantProductId'] = $product['merchantProductId'];
                    } else {
                        $row['option'] = $productModel->getOption($product['id']);
                    }
                    $row['shippingPolicy'] = $cartModel->getDeliveryInfo($row['dt_ix'], ['price' => $row['dcprice'], 'qty' => 1]);
                    $rows[] = $row;
                }
            }
        }

        return !empty($rows) ? $rows : false;
    }
}

if (!function_exists('npay_get_returninfo')) {

    /**
     * 최고 관리자 교환/반품지 정보
     * @return array|false
     */
    function npay_get_returninfo()
    {
        /* @var $companyModel CustomMallCompanyModel */
        $companyModel = getForbiz()->import('model.mall.company');

        $row = [];

        $row['returnInfo'] = $companyModel->getReturnAddress();

        return !empty($row) ? $row : false;
    }
}

if (!function_exists('npay_pinfo_xml')) {

    /**
     * 네이버페이 상품 정보 조회용 XML
     * @param array $data
     * @return string
     */
    function npay_pinfo_xml($data)
    {
        $nPayType = [
            1 => 'FREE'
            , 2 => 'CHARGE'
            , 3 => 'CONDITIONAL_FREE'
            , 4 => 'CHARGE_BY_QUANTITY'
        ];

        // xml 헬퍼 로드
        getForbiz()->load->helper('xml');

        $products = npay_get_pinfo($data['product']);
        //$returnInfo = npay_get_returninfo();

        $xml = [];
        $xml[] = '<?xml version="1.0" encoding="utf-8"?>';
        $xml[] = '<products>';

        foreach ($products as $p) {
            $xml[] = '<product>';
            $xml[] = '<id>' . $p['id'] . '</id>'; // 상품 system code
            $xml[] = '<name>' . xml_convert($p['pname']) . '</name>'; // 상품명

            $xml[] = '<basePrice>' . $p['dcprice'] . '</basePrice>'; // 판매가 // sellprice
            $xml[] = '<ecMallProductId>' . $p['id'] . '</ecMallProductId>'; // 판매가 // sellprice
            $xml[] = '<taxType>' . ($p['surtax_yorn'] == 'N' ? "TAX" : "TAX_FREE") . '</taxType>'; // 상품명
            $xml[] = '<infoUrl>' . xml_convert('https://' . FORBIZ_BASEURL . '/shop/goodsView/' . $p['id']) . '</infoUrl>';
            $xml[] = '<imageUrl>' . $p['image_src'] . '</imageUrl>'; // 이미지

            if (!empty($p['merchantProductId'])) {
                $xml[] = '<merchantProductId>' . $p['merchantProductId'] . '</merchantProductId>';
            }
            $xml[] = '<optionSupport>true</optionSupport>'; // 옵션 서포트
            // 배송정책
            $xml[] = '<shippingPolicy>';
            $xml[] = '<groupId>' . $p['dt_ix'] . '</groupId>';
            $xml[] = '<method>DELIVERY</method>';
            switch ($p['shippingPolicy']['deliveryPolicy']) {
                case 1:
                    $xml[] = '<feeType>FREE</feeType>';
                    $xml[] = '<feePayType>FREE</feePayType>';
                    $xml[] = '<feePrice>0</feePrice>';
                    break;
                case 2:
                    $xml[] = '<feeType>CHARGE</feeType>';
                    $xml[] = '<feePayType>PREPAYED</feePayType>';
                    $xml[] = '<feePrice>' . $p['shippingPolicy']['price'] . '</feePrice>';
                    break;
                case 3:
                    $xml[] = '<feeType>CONDITIONAL_FREE</feeType>';
                    $xml[] = '<feePayType>PREPAYED</feePayType>';
                    $xml[] = '<feePrice>' . $p['shippingPolicy']['feePrice'] . '</feePrice>';
                    $xml[] = '<conditionalFree>';
                    $xml[] = '  <basePrice>' . $p['shippingPolicy']['conditionFree'] . '</basePrice>';
                    $xml[] = '</conditionalFree>';
                    break;
                case 4:
                    $qtyPriceCnt = (count(($p['shippingPolicy']['qtyPrice'] ?? [])));

                    if ($qtyPriceCnt > 0) {
                        $xml[] = '<feeType>CHARGE_BY_QUANTITY</feeType>';
                        $xml[] = '<feePayType>PREPAYED</feePayType>';
                        $xml[] = '<feePrice>' . $p['shippingPolicy']['qtyBasicPrice'] . '</feePrice>';
                        $xml[] = '<chargeByQuantity>';
                        $xml[] = '  <type>RANGE</type>';
                        $xml[] = '  <range>';
                        $xml[] = '    <type>' . ($qtyPriceCnt > 1 ? 3 : 2) . '</type>';
                        for ($i = 0; $i < 2; $i++) {
                            if ($i == 0) {
                                $xml[] = '    <range2From>' . $p['shippingPolicy']['qtyPrice'][$i]['qty'] . '</range2From>';
                                $xml[] = '    <range2FeePrice>' . $p['shippingPolicy']['qtyPrice'][$i]['price'] . '</range2FeePrice>';
                            } else {
                                $xml[] = '    <range3From>' . $p['shippingPolicy']['qtyPrice'][$i]['qty'] . '</range3From>';
                                $xml[] = '    <range3FeePrice>' . $p['shippingPolicy']['qtyPrice'][$i]['price'] . '</range3FeePrice>';
                            }
                        }
                        $xml[] = '  </range>';
                        $xml[] = '</chargeByQuantity>';
                    }
                    break;
            }
            // 지역별 배송비
            if ($p['shippingPolicy']['deliveryRegionUse'] == 1) {
                $xml[] = '  <surchargeByArea>';
                $xml[] = '  <apiSupport>false</apiSupport>';

                if ($p['shippingPolicy']['delivery_region_area'] == 3) {
                    // 3권역
                    $xml[] = '      <splitUnit>3</splitUnit>';
                    $xml[] = '      <area2Price>' . $p['shippingPolicy']['regionPrice2'] . '</area2Price>';
                    $xml[] = '      <area3Price>' . $p['shippingPolicy']['regionPrice3'] . '</area3Price>';
                } else {
                    // 2권역
                    $xml[] = '      <splitUnit>2</splitUnit>';
                    $xml[] = '      <area2Price>' . $p['shippingPolicy']['regionPrice2'] . '</area2Price>';
                }
                $xml[] = '  </surchargeByArea>';
            }
            $xml[] = '</shippingPolicy>';

            if (!empty($p['option'])) {
                // 상품옵션
                $xml[] = '<option>';
                foreach ($p['option']['viewOptions'] as $opt) {
                    $xml[] = '  <optionItem>';
                    $xml[] = '      <type>SELECT</type>';
                    $xml[] = '      <name>' . xml_convert($opt['option_name']) . '</name>';

                    foreach ($opt['optionDetailList'] as $optVal) {
                        $xml[] = '      <value>';
                        $xml[] = '          <id>' . $optVal['division'] . '</id>';
                        $xml[] = '          <text>' . xml_convert($optVal['option_div']) . '</text>';
                        $xml[] = '      </value>';
                    }

                    $xml[] = '  </optionItem>';
                }
                $xml[] = '</option>';
            }

            // 추가상품
            if (!empty($p['option']['addOptions'])) {
                foreach ($p['option']['addOptions'][0]['optionDetailList'] as $addOpt) {
                    $xml[] = '<supplement>';
                    $xml[] = '  <id>' . $addOpt['option_id'] . '</id>';
                    $xml[] = '  <name>' . xml_convert($addOpt['option_div']) . '</name>';
                    $xml[] = '  <price>' . $addOpt['option_dcprice'] . '</price>';
                    $xml[] = '  <stockQuantity>' . $addOpt['option_stock'] . '</stockQuantity>';
                    $xml[] = '</supplement>';
                }
            }

            $xml[] = '</product>';
        }

        $xml[] = '</products>';

//        echo "<xmp>";
//        print_r($products);
//        print_r($xml);
//        echo "</xmp>";


        return implode("\n", $xml);
    }
}

if (!function_exists('npay_buy')) {

    /**
     * 네이버페이 구매용 XML 생성함수
     * @param array $cartIxs
     * @param string $backMode
     * @return string
     */
    function npay_buy($cartIxs, $backMode = 'cart')
    {
        $cartInfo = npay_get_cart_data($cartIxs);

        if (!empty($cartInfo)) {

            // 카트 정보 삭제
            //npay_del_cart_data($cartIxs);

            $baseUrl = HTTP_PROTOCOL . FORBIZ_HOST;
            $cartUrl = $baseUrl . '/shop/cart';
            $goodsViewUrl = $baseUrl . '/shop/goodsView/';

            if ($backMode == 'cart') {
                $backUrl = $cartUrl;
            } else {
                $backUrl = $goodsViewUrl . $cartInfo[0]['deliveryTemplateList'][0]['productList'][0]['id'];
            }

            $xml = [];
            $xml[] = '<?xml version="1.0" encoding="utf-8"?>';
            $xml[] = '<order>';
            $xml[] = '<merchantId>' . ForbizConfig::getMallConfig('naverpay_other_pg_shop_id') . '</merchantId>';
            $xml[] = '<certiKey>' . ForbizConfig::getMallConfig('naverpay_other_pg_certi_key') . '</certiKey>';
            $xml[] = '<backUrl><![CDATA[' . $backUrl . ']]></backUrl>';

            $xml[] = '<interface>';
            $xml[] = '<naverInflowCode><![CDATA[' . getForbiz()->input->cookie('NA_CO') . ']]></naverInflowCode>';
            $xml[] = '<saClickId><![CDATA[' . getForbiz()->input->cookie('NVADID') . ']]></saClickId>';
            $xml[] = '</interface>';

            foreach ($cartInfo as $cart) {
                foreach ($cart['deliveryTemplateList'] as $delivery) {
                    foreach ($delivery['productList'] as $product) {
                        // 파라미터 정보를 이용하여 가맹점 데이터를 가지고 온 후 XML로 구성
                        $xml[] = '<product>';
                        $xml[] = '<id>' . $product['id'] . '</id>'; // 상품코드
                        $xml[] = '<ecMallProductId>' . $product['id'] . '</ecMallProductId>'; // 네이버 EP 연동 상품 ID
                        $xml[] = '<name><![CDATA[' . $product['pname'] . ']]></name>';
                        $xml[] = '<basePrice>' . $product['dcprice'] . '</basePrice>';
                        $xml[] = '<taxType>' . ($product['surtax_yorn'] == 'N' ? "TAX" : "TAX_FREE") . '</taxType>'; // 과세 여부 (과세: TAX, 면세: TAX_FREE, 영세: ZERO_TAX)
                        $xml[] = '<infoUrl><![CDATA[' . $goodsViewUrl . $product['id'] . ']]></infoUrl>';
                        $xml[] = '<imageUrl><![CDATA[' . $product['image_src'] . ']]></imageUrl>';
                        $xml[] = '<merchantProductId>' . trim($product['select_option_id']) . '</merchantProductId>';
                        // $xml[] = '<giftName><![CDATA['.$product['giftName'].']]></giftName>'; // 사은품명

                        // 배송 정책 정보
                        $xml[] = '<shippingPolicy>';
                        $xml[] = '  <groupId>' . $delivery['dt_ix'] . '</groupId>';
                        $xml[] = '  <method>DELIVERY</method>'; // 배송방법
                        switch ($delivery['delivery_policy']) {
                            case 1:
                                $xml[] = '<feeType>FREE</feeType>';
                                $xml[] = '<feePayType>FREE</feePayType>';
                                $xml[] = '<feePrice>0</feePrice>';
                                break;
                            case 2:
                                $xml[] = '<feeType>CHARGE</feeType>';
                                $xml[] = '<feePayType>PREPAYED</feePayType>';
                                $xml[] = '<feePrice>' . $delivery['delivery_price'] . '</feePrice>';
                                break;
                            case 3:
                                $xml[] = '<feeType>CONDITIONAL_FREE</feeType>';
                                $xml[] = '<feePayType>PREPAYED</feePayType>';
                                $xml[] = '<feePrice>' . $delivery['feePrice'] . '</feePrice>';
                                $xml[] = '<conditionalFree>';
                                $xml[] = '  <basePrice>' . $delivery['conditionFree'] . '</basePrice>';
                                $xml[] = '</conditionalFree>';
                                break;
                            case 4:
                                $qtyPriceCnt = (count(($delivery['shippingPolicy']['qtyPrice'] ?? [])));

                                if ($qtyPriceCnt > 0) {
                                    $xml[] = '<feeType>CHARGE_BY_QUANTITY</feeType>';
                                    $xml[] = '<feePayType>PREPAYED</feePayType>';
                                    $xml[] = '<feePrice>' . $delivery['shippingPolicy']['qtyBasicPrice'] . '</feePrice>';
                                    $xml[] = '<chargeByQuantity>';
                                    $xml[] = '  <type>RANGE</type>';
                                    $xml[] = '  <range>';
                                    $xml[] = '    <type>' . ($qtyPriceCnt > 1 ? 3 : 2) . '</type>';
                                    for ($i = 0; $i < 2; $i++) {
                                        if ($i == 0) {
                                            $xml[] = '    <range2From>' . $delivery['shippingPolicy']['qtyPrice'][$i]['qty'] . '</range2From>';
                                            $xml[] = '    <range2FeePrice>' . $delivery['shippingPolicy']['qtyPrice'][$i]['price'] . '</range2FeePrice>';
                                        } else {
                                            $xml[] = '    <range3From>' . $delivery['shippingPolicy']['qtyPrice'][$i]['qty'] . '</range3From>';
                                            $xml[] = '    <range3FeePrice>' . $delivery['shippingPolicy']['qtyPrice'][$i]['price'] . '</range3FeePrice>';
                                        }
                                    }
                                    $xml[] = '  </range>';
                                    $xml[] = '</chargeByQuantity>';
                                }
                                break;
                        }
                        
                        // 지역별 배송비
                        if ($delivery['delivery_region_use'] == 1) {
                            $xml[] = '  <surchargeByArea>';
                            $xml[] = '      <apiSupport>false</apiSupport>';

                            if ($delivery['delivery_region_area'] == 3) {
                                $xml[] = '      <splitUnit>' . $delivery['delivery_region_area'] . '</splitUnit>';
                                $xml[] = '      <area2Price>' . $delivery['delivery_jeju_price'] . '</area2Price>';
                                $xml[] = '      <area3Price>' . $delivery['delivery_except_price'] . '</area3Price>';
                            } else {
                                $xml[] = '      <splitUnit>' . $delivery['delivery_region_area'] . '</splitUnit>';
                                $xml[] = '      <area2Price>' . $delivery['delivery_jeju_price'] . '</area2Price>';
                            }
                            $xml[] = '  </surchargeByArea>';
                        }
                        $xml[] = '</shippingPolicy>';

                        $opt = explode(':', $product['options_text']);

                        $xml[] = '<option>';
                        $xml[] = '  <quantity>' . $product['pcount'] . '</quantity>';
                        $xml[] = '  <selectedItem>';
                        $xml[] = '      <type>SELECT</type>';
                        $xml[] = '      <name><![CDATA[' . trim($opt[0]) . ']]></name>';
                        $xml[] = '      <value>';
                        $xml[] = '          <id>' . $product['select_option_id'] . '</id>';
                        $xml[] = '          <text><![CDATA[' . trim($opt[1]) . ']]></text>';
                        $xml[] = '      </value>';
                        $xml[] = '  </selectedItem>';
                        $xml[] = '</option>';

                        if (!empty($product['addOptionList'])) {
                            foreach ($product['addOptionList'] as $supplement) {
                                $xml[] = '<supplement>';
                                $xml[] = '  <id>' . $supplement['opn_d_ix'] . '</id>';
                                $xml[] = '  <name><![CDATA[' . trim($supplement['opn_text']) . ']]></name>';
                                $xml[] = '  <price>' . $supplement['sellprice'] . '</price>';
                                $xml[] = '  <quantity>' . $supplement['opn_count'] . '</quantity>';
                                $xml[] = '</supplement>';
                            }
                        }
                        $xml[] = '</product>';
                    }
                }
            }
            $xml[] = '</order>';

            return npay_api_exec('order', implode("\n", $xml));
        } else {
            return false;
        }
    }
}

if (!function_exists('npay_make_query')) {

    function npay_make_query($id, $name, $uprice, $image, $url, $thumbImg)
    {
        return http_build_query([
            'ITEM_ID' => $id
            , 'ITEM_NAME' => $name
            , 'ITEM_UPRICE' => $uprice
            , 'ITEM_IMAGE' => $image
            , 'ITEM_THUMB' => $thumbImg
            , 'ITEM_URL' => $url
        ]);
    }
}

if (!function_exists('npay_wish')) {
    function npay_wish($wid, $wtype = 'goodsView')
    {
        if ($wtype == 'cart') {
            /* @var CustomMallCartModel */
            $cartInfo = getForbiz()->import('model.mall.cart')->get($wid);
            $pid = [];
            foreach ($cartInfo as $cinfo) {
                foreach ($cinfo['deliveryTemplateList'] as $dinfo) {
                    foreach ($dinfo['productList'] as $pinfo) {
                        $pid[] = $pinfo['id'];
                    }
                }
            }
        } else {
            $pid = is_array($wid) ? $wid : [$wid];
        }

        $npayQry[] = http_build_query([
            'SHOP_ID' => ForbizConfig::getMallConfig('naverpay_other_pg_shop_id')
            , 'CERTI_KEY' => ForbizConfig::getMallConfig('naverpay_other_pg_certi_key')
        ]);

        /* @var $productModel CustomMallProductModel */
        $productModel = getForbiz()->import('model.mall.product');

        foreach ($pid as $id) {
            $pinfo = $productModel->get($id);

            if (!empty($pinfo)) {
                $npayQry[] = npay_make_query($id, $pinfo['pname'], $pinfo['sellprice'], $pinfo['image_src'],
                    (HTTP_PROTOCOL . FORBIZ_BASEURL . '/shop/goodsView/' . $id), $pinfo['thumb_src']);
            }
        }

        $queryString = implode('&', $npayQry);
        $wishUri = npay_api_wish_host();

        $req_addr = 'ssl://' . $wishUri;
        $req_url = 'POST /customer/api/wishlist.nhn HTTP/1.1'; // utf-8
        $req_host = $wishUri;
        $req_port = 443;
        $nc_sock = @fsockopen($req_addr, $req_port, $errno, $errstr);
        if ($nc_sock) {
            fwrite($nc_sock, $req_url . "\r\n");
            fwrite($nc_sock, "Host: " . $req_host . ":" . $req_port . "\r\n");
            fwrite($nc_sock, "Content-type: application/x-www-form-urlencoded; charset=utf8\r\n"); // utf-8         
            fwrite($nc_sock, "Content-length: " . strlen($queryString) . "\r\n");
            fwrite($nc_sock, "Accept: */*\r\n");
            fwrite($nc_sock, "\r\n");
            fwrite($nc_sock, $queryString . "\r\n");
            fwrite($nc_sock, "\r\n");

            $headers = '';
            $bodys = '';

            // get header
            while (!feof($nc_sock)) {
                $header = fgets($nc_sock, 4096);
                if ($header == "\r\n") {
                    break;
                } else {
                    $headers .= $header;
                }
            }

            // get body
            while (!feof($nc_sock)) {
                $bodys .= fgets($nc_sock, 4096);
            }

            fclose($nc_sock);

            $resultCode = substr($headers, 9, 3);

            if ($resultCode == 200) {
                return [
                    'result' => 'success'
                    , 'data' => explode(',', trim($bodys))
                ];
            } else {
                return [
                    'result' => 'fail'
                    , 'data' => $bodys
                ];
            }
        } else {
            return [
                'result' => 'error'
                , 'data' => "{$errstr} ({$errno})"
            ];
        }
    }
}

if (!function_exists('npay_api_request_host')) {
    /**
     * 네이버페이 REQUEST 호스트
     * @return string
     */
    function npay_api_request_host()
    {
        if (ForbizConfig::getMallConfig('naverpay_other_pg_service_type') == 'service') {
            return 'api.pay.naver.com';
        } else {
            return 'test-api.pay.naver.com';
        }
    }
}

if (!function_exists('npay_api_order_host')) {
    /**
     * 네이버페이 ORDER 호스트
     * @return string
     */
    function npay_api_order_host()
    {
        if (ForbizConfig::getMallConfig('naverpay_other_pg_service_type') == 'service') {
            if(is_mobile()) {
                return 'm.pay.naver.com/o';
            } else {
                return 'order.pay.naver.com';
            }
        } else {
            if(is_mobile()) {
                return 'test-m.pay.naver.com/o';
            } else {
                return 'test-order.pay.naver.com';
            }
        }
    }
}

if (!function_exists('npay_api_wish_host')) {
    /**
     * 네이버페이 ORDER 호스트
     * @return string
     */
    function npay_api_wish_host()
    {
        if (ForbizConfig::getMallConfig('naverpay_other_pg_service_type') == 'service') {
            if(is_mobile()){
                return 'm.pay.naver.com';
            } else {
                return 'pay.naver.com';
            }
        } else {
            if(is_mobile()){
                return 'test-m.pay.naver.com';
            } else {
                return 'test-pay.naver.com';
            }
        }
    }
}

if (!function_exists('npay_api_exec')) {

    /**
     * 네이버 페이 API 호출
     * @param string $type
     * @param string $xml
     * @return array
     */
    function npay_api_exec($type, $xml)
    {

        $api = [
            'order' => [
                'exec' => "https://" . npay_api_request_host() . "/o/customer/api/order/v20/register"
                , 'url' => "https://" . npay_api_order_host() . "/customer/buy"
            ]
        ];

        if (isset($api[$type])) {
            // 주문 등록 API 호출
            $ci = curl_init();
            curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, FALSE);
            curl_setopt($ci, CURLOPT_SSL_VERIFYHOST, FALSE);
            curl_setopt($ci, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ci, CURLOPT_HTTPHEADER, ['Content-Type: application/xml; charset=utf-8']);
            curl_setopt($ci, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
            curl_setopt($ci, CURLOPT_URL, $api[$type]['exec']);
            curl_setopt($ci, CURLOPT_POST, TRUE);
            curl_setopt($ci, CURLOPT_TIMEOUT, 10);
            curl_setopt($ci, CURLOPT_POSTFIELDS, $xml);
            // 주문 등록 후 결과값 확인
            $response = curl_exec($ci);
            curl_close($ci);

            $param = explode(':', $response);
            if ($param[0] == "SUCCESS") {
                // 성공일 경우
                return [
                    'result' => true
                    , 'data' => $api[$type]['url'] . "/" . $param[1] . "/" . $param[2]
                ];
            } else {
                return [
                    'result' => false
                    , 'data' => $response
                ];
            }
        } else {
            return [
                'result' => false
                , 'data' => 'Not define api type'
            ];
        }
    }
}

if (!function_exists('npay_get_cart_data')) {

    /**
     * 카트 아이디를 이용하여 카트 정보 조회
     * @param array $cartIxs
     * @return boolean|array
     */
    function npay_get_cart_data($cartIxs)
    {
        if (!empty($cartIxs)) {
            /* @var $cartModel CustomMallCartModel */
            $cartModel = getForbiz()->import('model.mall.cart');
            //카트정보 조회

            return $cartModel->get($cartIxs);
        } else {
            return false;
        }
    }
}

if (!function_exists('npay_del_cart_data')) {

    /**
     * 카트 아이디를 이용하여 카트 정보 삭제
     * @param array $cartIxs
     */
    function npay_del_cart_data($cartIxs)
    {
        /* @var $cartModel CustomMallCartModel */
        $cartModel = getForbiz()->import('model.mall.cart');
        //카트정보 삭제
        $cartModel->delete($cartIxs);
    }
}