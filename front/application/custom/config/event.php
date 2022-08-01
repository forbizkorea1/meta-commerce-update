<?php
return function ($type = 'all') {
    /**
     * 예시 http://도메인/controller/global/jsLanguageCollection 일때 이벤트를 주고 싶으면
     * controller/global/jsLanguageCollection url 에 앞에 / 지우고 처리해야함
     */
    if ($type == 'controller') {
        // 컨트롤러 전역 이벤트
        $this->event->on('controller', function ($e) {
            $params = $e->getParams();
        });

        //일반회원 가입 메시지 보내기
        $this->event->on('controller/member/joinInputBasic',
            function ($e) {
            /* @var $this ForbizController */
            $params = $e->getParams();
            if (!empty($params) && isset($params['user'])) {
                sendMessage('member_reg', $params['user']['email'], $params['user']['pcs'],
                    [
                        'userName' => $params['user']['name']
                        , 'userId' => $params['user']['userId']
                        , 'registDate' => $params['user']['date']
                        , 'emailAcceptance' => $params['user']['info'] == '1' ? '수신' : '수신거부'
                        , 'smsAcceptance' => $params['user']['sms'] == '1' ? '수신' : '수신거부'
                ]);
            }
        });

        //일반회원 가입 적립금 및 쿠폰 지급
        $this->event->on('controller/member/joinInputBasic',
            function ($e) {
            $params = $e->getParams();
            if (!empty($params) && isset($params['user'])) {
                /* @var $couponModel CustomMallCouponModel */
                $couponModel = $this->import('model.mall.coupon');

                /* @var $memberModel CustomMallMemberModel */
                $memberModel = $this->import('model.mall.member');

                /* @var $mileageModel CustomMallMileageModel */
                $mileageModel = $this->import('model.mall.mileage');

                $groupInfo = $memberModel->getGroupInfo($params['user']['gpIx']);

                //사용 조건 없이 다운되도록
                $couponModel->setAgentType(['A','P','G','M','MA']);

                //특정 조건 쿠폰 자동 발급
                $couponModel->setMember($params['user']['code'], $params['user']['gpIx'], $groupInfo['use_coupon_yn']);
                $couponModel->preferredConditionGiveCoupon('1');

                //회원가입 시 마일리지 지급
                $mileageModel->setMember($params['user']['code'], $params['user']['gpIx'], $groupInfo['use_reserve_yn']);
                $mileageModel->memberJoinGiveMileage();
            }
        });

        //일반회원 가입 통계
        $this->event->on('controller/member/joinInputBasic', function ($e) {
            $params = $e->getParams();
        });

        //사업자회원 가입 메시지 보내기
        $this->event->on('controller/member/joinInputCompany',
            function ($e) {
            /* @var $this ForbizController */
            $params = $e->getParams();
            if (!empty($params)) {
                sendMessage('company_reg', $params['user']['email'], $params['user']['pcs'],
                    [
                        'userName' => $params['user']['name']
                        , 'userId' => $params['user']['userId']
                        , 'registDate' => $params['user']['date']
                        , 'emailAcceptance' => $params['user']['info'] == '1' ? '수신' : '수신거부'
                        , 'smsAcceptance' => $params['user']['sms'] == '1' ? '수신' : '수신거부'
                        , 'userComName' => $params['company']['comName']
                        , 'userComNumber' => $params['company']['comNumber']
                        , 'authorized' => $params['user']['authorized']
                ]);
            }
        });

        //사업자회원 가입 적립금 및 쿠폰 지급
        $this->event->on('controller/member/joinInputCompany',
            function ($e) {
            $params = $e->getParams();
            if (!empty($params)) {
                /* @var $couponModel CustomMallCouponModel */
                $couponModel = $this->import('model.mall.coupon');

                /* @var $memberModel CustomMallMemberModel */
                $memberModel = $this->import('model.mall.member');

                /* @var $mileageModel CustomMallMileageModel */
                $mileageModel = $this->import('model.mall.mileage');

                $groupInfo = $memberModel->getGroupInfo($params['user']['gpIx']);

                //사용 조건 없이 다운되도록
                $couponModel->setAgentType(['A','P','G','M','MA']);

                //특정 조건 쿠폰 자동 발급
                $couponModel->setMember($params['user']['code'], $params['user']['gpIx'], $groupInfo['use_coupon_yn']);
                $couponModel->preferredConditionGiveCoupon('1');

                //회원가입 시 마일리지 지급
                $mileageModel->setMember($params['user']['code'], $params['user']['gpIx'], $groupInfo['use_reserve_yn']);
                $mileageModel->memberJoinGiveMileage();
            }
        });

        //사업자회원 가입 통계
        $this->event->on('controller/member/joinInputCompany', function ($e) {
            $params = $e->getParams();
        });

        // 주문 취소
        $this->event->on('controller/mypage/updateCancelStatus',
            function ($e) {
            $params = $e->getParams();

            //입금전 취소
            if (!empty($params['data']['oid']) && $params['data']['claimStatus'] == ORDER_STATUS_INCOM_BEFORE_CANCEL_COMPLETE) {
                /* @var $mypageModel CustomMallMypageModel */
                $mypageModel = $this->import('model.mall.mypage');

                $orderData = $mypageModel->doOrderDetail(sess_val('user', 'code'), $params['data']['oid']);

                // 발송용 정보 설정
                $messageData        = $orderData['order'];
                $messageData['oid'] = $params['data']['oid'];

                //고객 입근전 취소 메일 발송
                $messageData['cancel_date'] = date('Y-m-d H:i:s');
                if ($params['data']['claimReason'] == 'DPB') {
                    $claimReasonText = '다른상품구매';
                } else if ($params['data']['claimReason'] == 'NB') {
                    $claimReasonText = '구매의사없음';
                } else if ($params['data']['claimReason'] == 'PIE') {
                    $claimReasonText = '상품정보틀림';
                } else if ($params['data']['claimReason'] == 'ETCB') {
                    $claimReasonText = '기타(구매자책임)';
                }
                $messageData['cancel_reason'] = '['.$claimReasonText.'] '.$params['data']['claimReasonMsg'];

                sendMessage('order_income_before_cancel', $messageData['bmail'], $messageData['bmobile'], $messageData);
            }
        });

        // 회원 탈퇴
        $this->event->on('withdrowMemberSendEmail',
            function ($e) {
            $params = $e->getParams();
            sendMessage('member_exit', $params['mem_mail'], $params['mem_mobile'], $params);
        });

        // 구매확정시 메세지 보내기
        $this->event->on('buyConfirm',
            function($e) {
                $params = $e->getParams();

                if (!empty($params['oid'])) {
                    /* @var $mypageModel CustomMallMypageModel */
                    $mypageModel = $this->import('model.mall.mypage');
                    $orderData   = $mypageModel->doOrderDetail(sess_val('user', 'code'), $params['oid']);

                    // 구매확정 공통 변수.
                    $messageData['bname']   = $orderData['order']['bname'];
                    $messageData['bmail']   = $orderData['order']['bmail'];
                    $messageData['bmobile'] = $orderData['order']['bmobile'];

                    sendMessage('order_buy_confirm', $messageData['bmail'], $messageData['bmobile'], $messageData, $messageData['bname']);
                }
        });
    } elseif ($type == 'viewController') {
        // View 컨트롤러 전역 이벤트
        $this->event->on('viewController', function ($e) {
            $params = $e->getParams();
        });

        //결제 완료시 메시지 보내기
        $this->event->on('payment',
            function ($e) {
            $params = $e->getParams();
            if (!empty($params['oid'])) {
                /* @var $mypageModel CustomMallMypageModel */
                $mypageModel = $this->import('model.mall.mypage');

                $orderData = $mypageModel->doOrderDetail(sess_val('user', 'code'), $params['oid']);


                // 발송용 정보 설정
                $messageData                  = $orderData['order'];
                $messageData['oid']           = $params['oid'];
                $messageData['order_date']    = $orderData['order']['order_date'];
                $messageData['mem_name']      = $orderData['order']['bname'];
                $messageData['pcnt']          = $orderData['paymentInfo']['total_pcnt'];
                $messageData['pname']         = $orderData['deliveryInfo']['msg']['0']['pname'];
                $messageData['total_price']   = number_format($orderData['paymentInfo']['payment']['0']['payment_price']); // 결제 금액
                $messageData['payment_price'] = $orderData['paymentInfo']['payment']['0']['payment_price']; // 결제금액
                $messageData['paymentInfo']   = $orderData['paymentInfo']; // 결제정보
                $messageData['method_text']   = $orderData['paymentInfo']['payment'][0]['method_text']; // 결제수단명
                // 신용카드
                if ($orderData['paymentInfo']['payment'][0]['method'] == ORDER_METHOD_CARD) {
                    $messageData['memo'] = str_replace('(00)', '', $orderData['paymentInfo']['payment'][0]['memo']); // 결제정보
                }
                // 가상계좌 추가
                if ($orderData['paymentInfo']['payment'][0]['method'] == ORDER_METHOD_VBANK) {
                    $messageData['bank_account_num'] = $orderData['paymentInfo']['payment']['0']['bank_account_num']; // 계좌번호
                    $messageData['vb_info']          = $orderData['paymentInfo']['payment']['0']['bank_account_num']; // 계좌번호, 알림톡
                    $messageData['bank_name']        = $orderData['paymentInfo']['payment']['0']['bank']; // 은행명
                    $messageData['bank_input_name']  = $orderData['paymentInfo']['payment']['0']['bank_input_name']; // 예금주
                    $messageData['payment_price']    = $orderData['paymentInfo']['payment']['0']['payment_price']; // 결제금액
                    $messageData['bank_input_date']  = $orderData['paymentInfo']['payment']['0']['bank_input_date']; // 마감일자
                }

                $messageData['deliveryInfo'] = $orderData['deliveryInfo']; // 배송정보

                sendMessage(
                    (in_array($orderData['paymentInfo']['payment'][0]['method'], [ORDER_METHOD_VBANK, ORDER_METHOD_ESCROW_VBANK]) && $orderData['order']['status'] == ORDER_STATUS_INCOM_READY
                        ? 'order_sucess_vbank' : 'order_sucess')
                    , $messageData['bmail']
                    , $messageData['bmobile']
                    , $messageData
                );
            }
        });

        //상품 상세보기 이벤트 처리
        $this->event->on('shop/goodsView',
            function ($e) {
            $productCode = $this->getParams(0);

            if ($productCode) {
                /* @var $productModel CustomMallProductModel */
                $productModel = $this->import('model.mall.product');

                if ($this->userInfo->code != '') {
                    if (!empty(sess_val('latest_product_view'))) {
                        // 세션 정보 저장
                        $productModel->replaceProductViewHistory($this->userInfo->code, '', '');
                    }

                    // 최근 본 상품 저장
                    $productModel->replaceProductViewHistory($this->userInfo->code, $productCode, '');
                } else {
                    if (isset($_SESSION['latest_product_view'])) {
                        $_SESSION['latest_product_view'][$productCode] = $productCode;
                    } else {
                        $_SESSION['latest_product_view'] = [$productCode => $productCode];
                    }

                    // 최근 본 상품 저장
                    $productModel->replaceProductViewHistory(session_id(), $productCode, '');
                }
            }
        });

        // 클레임(반품, 교환) 접수 완료 메세지 보내기
        $this->event->on('claimComplete',
            function($e) {
                $params = $e->getParams();
                $orderDetailKey = array_key_first($params['claimCompleteData']['order']['orderDetail']);
                $claimDeliveryPrice = $params['claimDeliveryPrice'];

                // 반품, 교환 공통 변수.
                $messageData['order_date'] = $params['claimCompleteData']['order']['order_date'];
                $messageData['bname']      = $params['claimCompleteData']['order']['bname'];
                $messageData['bmail']      = $params['claimCompleteData']['order']['bmail'];
                $messageData['bmobile']    = $params['claimCompleteData']['order']['bmobile'];
                $messageData['oid']        = $params['claimCompleteData']['order']['oid'];

                $messageData['pname']      = $params['claimCompleteData']['order']['orderDetail'][$orderDetailKey][0]['pname'];
                $claimCnt = count($params['claimCompleteData']['order']['orderDetail'][$orderDetailKey]);
                if($claimCnt > 1) {
                    $messageData['pname'] .= ' 외 '.($claimCnt-1).'건';
                }

                $messageData['pt_dcprice'] = g_price(array_sum(array_column($params['claimCompleteData']['order']['orderDetail'][$orderDetailKey], 'pt_dcprice')) + $claimDeliveryPrice['delivery_price']);
                sendMessage($params['claimType'].'_apply_complete', $messageData['bmail'], $messageData['bmobile'], $messageData, $messageData['bname']);
        });

        // 무통장으로 주문시 메세지 보내기.
        $this->event->on('bankComplete',
            function($e) {
                $params = $e->getParams();

                // 무통장 주문 완료 공통 변수.
                $messageData['bname']         = $params['bankCompleteData']['order']['bname'];
                $messageData['bmail']         = $params['bankCompleteData']['order']['bmail'];
                $messageData['bmobile']       = $params['bankCompleteData']['order']['bmobile'];
                $messageData['oid']           = $params['bankCompleteData']['order']['oid'];
                $messageData['bank_input_date'] = $params['bankCompleteData']['bank_input_date'];
                $messageData['payment_price'] = g_price($params['bankCompleteData']['paymentInfo']['payment'][0]['payment_price']);

                sendMessage('bank_order_complete', $messageData['bmail'], $messageData['bmobile'], $messageData, $messageData['bname']);
            }
        );

        //결제 완료시 메시지 보내기(가상계좌)
        $this->event->on('depositSucessVbank',
            function ($e) {
                $params = $e->getParams();
                if (!empty($params['oid'])) {
                    /* @var $mypageModel CustomMallMypageModel */
                    $mypageModel = $this->import('model.mall.mypage');

                    $orderData = $mypageModel->doOrderDetail(false, $params['oid']);
                    $orderData['oid'] = $orderData['order']['oid'];
                    $orderData['order_date'] = $orderData['order']['order_date'];
                    $orderData['total_price']   = number_format($orderData['paymentInfo']['payment']['0']['payment_price']); // 결제 금액

                    $domain = HTTP_PROTOCOL.FORBIZ_HOST;
                    $orderData['url'] = $domain.'/mypage/orderDetail?oid='.$params['oid'].'&schemeChk=1';

                    sendMessage(
                        'bank_deposit_complete'
                        , $orderData['order']['bmail']
                        , $orderData['order']['bmobile']
                        , $orderData
                    );
                }
            });
    }
};
