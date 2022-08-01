"use strict";

// 확장개체
var dev_ext = {
    npay: {
        useNpay: false,
        buttonKey: false,
        mType: false,
        showNpayBtn: function (type) {
            var self = dev_ext.npay;
            if (self.buttonKey === false) {
                self.init();
            }

            var mType = (self.mType === 'mobile' ? 'MA' : 'A');

            if(type == 'product'){
                var count = 2
            }else{
                var count = 1
            }

            naver.NaverPayButton.apply({
                BUTTON_KEY: self.buttonKey,
                TYPE: mType,
                COLOR: 1,
                COUNT: count,
                ENABLE: "Y",
                "": ""
            });
        },
        goodsView: {
            isNpayAdding: false,
            nPayCallback: function (cartIxs) {
                var self = dev_ext.npay.goodsView;
                var miniCart = goodsView.miniCart;

                if (cartIxs.length > 0) { //본품 주문여부 체크
                    if (self.isNpayAdding == false) {
                        self.isNpayAdding = true; // requesting only one
                        common.ajax('/payment/npay/buy', {type: 'cart', cartIxs: cartIxs}, '', function (response) {
                            if (response.result == "success") {
                                console.log(response.data);
                                window.open(response.data);
                                window.location.reload();
                            } else {
                                common.noti.alert(common.lang.get('npay.wrongOrder.alert'));
                            }

                            self.isNpayAdding = false;
                        });
                    }
                } else {
                    common.noti.alert(common.lang.get('cart.update.count.checkOrderPossible.alert'));
                }
            },
            bindEvent: function (cartIxs) {
                // 네이버페이 구매
                goodsView.miniCart._add('nPay');

                return false;
            },
            zzimEvent: function () {
                var pid = $('#devMinicartArea').data('pid');
                var url = '/payment/npay/wish/goodsView?id[]=' + pid;
                
                window.open(url,"naverWish","width=100,height=100,scrollbars=0");
                
                return false;
            },
            initLang: function () {
                common.lang.load('npay.notDefineGoodsView.msg', 'goodsView가 선언되어 있지 않습니다.');
                common.lang.load('npay.wrongOrder.alert', '상품정보가 올바르지 않습니다.');
            },
            init: function () {
                var self = this;

                self.initLang();
                if (typeof goodsView !== 'undefined') {
                    // 네이버페이 구매버튼 이벤트
                    $(document).on('click', '.npay_btn_pay', self.bindEvent);
                    // 네이버페이 찜버튼 이벤트
                    $(document).on('click', '.npay_btn_zzim', self.zzimEvent);
                    // 장바구니 이벤트
                    goodsView.miniCart.on('nPay', self.nPayCallback);
                } else {
                    common.noti.alert(common.lang.get('npay.notDefineGoodsView.msg'));
                }
            }
        },
        cart: {
            isNpayAdding: false,
            bindEvent: function () {

                var self = dev_ext.npay.cart;
                var cartIxs = devCartObj.getSelectCartIx();

                if (cartIxs.length > 0) { //본품 주문여부 체크


                    if (self.isNpayAdding == false) {
                        self.isNpayAdding = true; // requesting only one

                        var data = {'cartIxs': cartIxs};
                        common.ajax(common.util.getControllerUrl('paymentValidate', 'cart'), data, "", function (result) {
                            if (result.result == 'success') {

                                common.ajax('/payment/npay/buy', {type: 'goodsView', cartIxs: cartIxs}, '', function (response) {
                                    if (response.result == "success") {
                                        console.log(response.data);
                                        window.open(response.data);
                                    } else {
                                        common.noti.alert(common.lang.get('npay.wrongOrder.alert'));
                                    }

                                    self.isNpayAdding = false;
                                });
                            }
                            //주문시 판매중이 아닌 상품 포함시
                            else if (result.result == 'fail') {
                                common.noti.alert(common.lang.get('cart.paymentValidate.fail.alert'));
                                document.location.reload();
                            }else if(result.result == 'failByOnePersonCount'){
                                common.noti.alert(common.lang.get('cart.update.count.failByOnePersonCount.alert', {count: result.data.buy_cnt}));
                            }else if(result.result == 'failCheckCnt'){
                                common.noti.alert(common.lang.get('cart.paymentValidate.fail.checkCnt.alert'))
                                document.location.reload();
                            }else if (result.result == 'noLogin') {
                                common.noti.alert(common.lang.get('cart.update.count.noLogin.alert'));
                                document.location.reload();
                            } else {
                                common.noti.alert('error');
                            }
                        });
                        self.isNpayAdding = false;
                    }
                } else {
                    common.noti.alert(common.lang.get('cart.buy.noSelect.alert'));
                }

                return false;
            },
            zzimEvent: function () {
                var cartIxs = devCartObj.getSelectCartIx();
                var cids = [];
                
                for(var cid in cartIxs) {
                    cids.push('id[]=' + cartIxs[cid]);
                }

                var url = '/payment/npay/wish/cart?' + cids.join('&');
                
                window.open(url,"naverWish","width=100,height=100,scrollbars=0");

                return false;
            },
            initLang: function () {
                common.lang.load('npay.notDefineDevCartObj.msg', 'devCartObj가 선언되어 있지 않습니다.');
                common.lang.load('npay.wrongOrder.alert', '상품정보가 올바르지 않습니다.');
            },
            init: function () {
                var self = this;

                self.initLang();

                if (typeof devCartObj !== 'undefined') {
                    // 네이버페이 구매버튼 이벤트
                    $(document).on('click', '.npay_btn_pay', self.bindEvent);
                    // 네이버페이 찜버튼 이벤트
                    $(document).on('click', '.npay_btn_zzim', self.zzimEvent);
                } else {
                    common.noti.alert(common.lang.get('npay.notDefineDevCartObj.msg'));
                }
            }
        },
        init: function (buttonKey, mType) {
            var self = this;

            self.buttonKey = buttonKey;
            self.mType = mType;

            return this;
        }
    }
};