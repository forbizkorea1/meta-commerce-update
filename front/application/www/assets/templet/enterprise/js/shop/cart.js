"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
//버전픽스 퍼블 요청 사항 (확인하시고 주석 지워 주셔도 됩니다.)
//1.장바구니 없을때 코딩 필요 합니다.
//2.table 에 soldout 를 주면 안되고 tr에 처리해야 합니다. 수정바랍니다.
//3.<a href="#" class="item"></a> 를 상품 버튼까지 영역을 주신걸 <div class="item"></div> 으로 변경 하였습니다.
//4.체크박스 스크립트 변경 하였습니다.
//5.수량은 직접 입력 가능해야 하기 때문에 input 추가 했습니다.
//6.기획 적으로 추가되어 재고는 있지만 부족 장바구니에 담은 수량이 많을때 `주문 가능한 수량은 최대 N개입니다.` 문구 임의로 추가 하였습니다.

$(function () {
    if ($('.fb__shopCommon__summary').length) {
        relation_checkbox($('#cart_all_check'), $('.cart_company_check'));

        $('.cart_company_check').each(function (i, obj) {
            relation_checkbox($(obj), $(obj).closest('.js__seller-box').find('.cart_product_check:enabled'));
        });

        relation_checkbox($('#cart_all_check'), $('.cart_product_check:enabled'));
    }
});

function relation_checkbox($all_checkbox, $target_checkbox) {
    $all_checkbox.click(function () {
        if ($all_checkbox.is(':checked')) {
            $target_checkbox.prop("checked", true);
        } else {
            $target_checkbox.prop("checked", false);
        }
    });

    $target_checkbox.click(function () {
        if ($target_checkbox.length == $target_checkbox.filter(':checked').length) {
            $all_checkbox.prop("checked", true);
        } else {
            $all_checkbox.prop("checked", false);
        }
    });
}

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
//-----load language
common.lang.load('cart.select.delete.confirm', "선택한 상품을 삭제하시겠습니까?"); //Confirm_12
common.lang.load('cart.one.delete.confirm', "해당 상품을 삭제하시겠습니까?"); //Confirm_14
common.lang.load('cart.delete.noSelect.alert', "삭제할 상품을 선택해 주세요."); //Alert_47
common.lang.load('cart.update.count.failBasicCount.alert', "최소 구매 가능 수량은 {count}개입니다. {count}개 이상 입력해 주세요."); //Alert_103
common.lang.load('cart.update.count.failBasicCountCheck.alert', "구매 가능 수량을 확인해 주세요."); // 230628 수정
common.lang.load('cart.update.count.noLogin.alert', "ID당 구매 가능한 수량이 제한되어있는 상품입니다. 로그인 후 구매해주세요.");
common.lang.load('cart.update.count.failByOnePersonCount.alert', "해당 상품의 구매 가능한 수량은 최대 {count}개입니다."); //Alert_102
common.lang.load('cart.update.count.failByOnePersonCountCheck.alert', "구매 가능 수량을 확인해 주세요."); // 230628 수정
common.lang.load('cart.update.count.failStockLack.alert', "주문 가능한 재고수량은 최대 {count}개입니다."); //Alert_104
common.lang.load('cart.update.count.failNoSale.alert', "해당 상품이 품절되었습니다."); //Alert_108
common.lang.load('cart.paymentValidate.fail.alert', "상품정보가 변경된 상품이 있습니다. 일시품절 혹은 판매중지로 인한 상품은 구매불가하므로 삭제해 주세요."); //Alert_109
common.lang.load('cart.nonMbmer.payment.confirm', "비회원 구매를 하시겠습니까?"); //Confirm_25
common.lang.load('cart.buy.noSelect.alert', "구매할 상품을 선택해 주세요.");
common.lang.load('cart.paymentValidate.fail.checkCnt.alert', "주문 가능한 수량이 변경된 상품이 있습니다.");//Alert_115


//-----set input format
common.inputFormat.set($('.devCount'), {'number': true});

//-----set validation

var devCartObj = {
    //상품 품절 체크 후 infoInput 페이지로 이동 (cartIxs = [])
    orderInfoinput: function (cartIxs) {
        var data = {'cartIxs': cartIxs};
        common.ajax(common.util.getControllerUrl('paymentValidate', 'cart'), data, "", function (result) {
            if (result.result == 'success') {
                // 빅인스크립트 이벤트 추가
                if ((typeof use_biginsight_yn != "undefined") && use_biginsight_yn === true) {
                    bigin.event('checkout');
                }

                if (forbizCsrf.isLogin) {
                    document.location.href = '/shop/infoInput?cartIx=' + cartIxs.join(",");
                } else {
                    //비회원은 확인시 로그인으로 유도 취소시 비회원 주문
                    common.noti.confirm(common.lang.get('cart.nonMbmer.payment.confirm'), function () {
                        document.location.href = '/shop/infoInput?cartIx=' + cartIxs.join(",");
                    });
                }
            }
            //주문시 판매중이 아닌 상품 포함시
            else if (result.result == 'fail') {
                common.noti.alert(common.lang.get('cart.paymentValidate.fail.alert'));
                document.location.reload();
            }else if(result.result == 'failByOnePersonCount'){
                common.noti.alert(common.lang.get('cart.update.count.failByOnePersonCount.alert', {count: result.data.buy_cnt}));
                //$contents.find('.devTailMsg').text(common.lang.get('cart.update.count.failByOnePersonCount.alert', {count: result.data.buy_cnt}));
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
    },
    //상품 수량 검증
    verificationCount: function ($count) {
        var count = parseInt($count.val());
        if (!(count > 0)) {
            $count.val(1);
        }
    },
    //상품 수량 수정
    changeCount: function (type, $count) {
        var self = this;
        var count = parseInt($count.val());
        if (type == 'down') {
            $count.val(count - 1);
        } else {
            $count.val(count + 1);
        }
        self.verificationCount($count);
    },
    //선택된 상품 cart_ix 리턴
    getSelectCartIx: function () {
        var cartIxs = [];
        $('.devCartIx:checked').each(function (i, obj) {
            cartIxs.push($(obj).val());
        });
        return cartIxs;
    },
    //선택 상품 삭제
    cartDelete: function (cartIxs) {
        var data = {'cartIxs': cartIxs};
        common.ajax(common.util.getControllerUrl('delete', 'cart'), data, "", function () {
            document.location.reload();
        });
    },
    //금액영역 초기화
    resetPriceText: function () {
        $('[devPrice]').text('0');
    },
    //금액 처리
    setPriceText: function ($contents, type, price) {
        $contents.find('[devPrice=' + type + ']').text(common.util.numberFormat(price));
    },
    initEvent: function () {
        var self = devCartObj;

        //금액 변경
        $('.devChangePriceEvent').click(function () {
            var cartIxs = self.getSelectCartIx();

            if (cartIxs.length > 0) {
                var data = {'cartIxs': cartIxs};
                common.ajax(common.util.getControllerUrl('getSummary', 'cart'), data, "", function (result) {
                    self.resetPriceText();
                    //업체별 합계
                    // for (var i = 0; i < result.data.companySummary.length; i++) {
                    //     var $contents = $('[devCartCompanyPriceContents=' + result.data.companySummary[i].company_id + ']');
                    //     $.each(result.data.companySummary[i], function (type, price) {
                    //         self.setPriceText($contents, type, price);
                    //     });
                    // }

                    //전체 합계
                    var $contents = $('#devCartPriceContents');
                    $.each(result.data.summary, function (type, price) {
                        self.setPriceText($contents, type, price);
                    });

                    //배송정책별 합계
                    $.each(result.data.deliverySummary, function (type, price) {
                        $.each(price, function(key, value) {
                            $('[devDeliveryTemplatePrice' + type + ']').find('[devPrice=' + key + ']').text(common.util.numberFormat(value));
                        });
                    });
                });
            } else {
                self.resetPriceText();
            }
        });

        //일괄 삭제
        $('#devSelectDeleteButton').click(function () {
            var cartIxs = self.getSelectCartIx();
            //선택된 상품이 없을때
            if (!(cartIxs.length > 0)) {
                common.noti.alert(common.lang.get('cart.delete.noSelect.alert'));
                return;
            }

            common.noti.confirm(common.lang.get('cart.select.delete.confirm'), function () {
                self.cartDelete(cartIxs);
            });
        });

        //상품 개별 삭제
        $('.devDeleteButton').click(function () {
            var cartIxs = [];
            cartIxs.push($(this).closest('.devProductContents').find('.devCartIx').val());

            common.noti.confirm(common.lang.get('cart.one.delete.confirm'), function () {
                self.cartDelete(cartIxs);

                // 빅인스크립트 이벤트 추가
                if ((typeof use_biginsight_yn != "undefined") && use_biginsight_yn === true) {
                    bigin.event('removeCart');
                }
            });
        });

        //추가 구성 상품 삭제
        $('.devAddOptionDeleteButton').click(function () {
            var cartOptionIxs = [];
            cartOptionIxs.push($(this).closest('.devAddOptionContents').find('.devCartOptionIx').val());

            var data = {'cartOptionIxs': cartOptionIxs};
            common.ajax(common.util.getControllerUrl('deleteOption', 'cart'), data, "", function () {
                document.location.reload();
            });
        });

        //상품 수량 DOWN
        $('.devCountDownButton').click(function () {
            var $count = $(this).closest('.devProductContents, .devAddOptionContents').find('.devCount');
            self.changeCount('down', $count);
        });

        //상품 수량 UP
        $('.devCountUpButton').click(function () {
            var $count = $(this).closest('.devProductContents, .devAddOptionContents').find('.devCount');
            self.changeCount('up', $count);
        });

        //상품 수량 직접 수정
        $('.devCount').on('input', function (e) {
            self.verificationCount($(this));
        });

        //상품 수량 변경
        $('.devCountUpdateButton').click(function () {
            var $contents = $(this).closest('.devProductContents');
            var cartIx = $contents.find('.devCartIx').val();
            var totalCnt = 0;
            var targetPid = $(this).val(); // 230628 수정


            $('.devCount').each(function (i, v) {
                var pid = $(v).attr("pid");

                if(targetPid == pid){
                    totalCnt += parseInt($(v).val());
                }
            });

            var count = $contents.find('.devCount').val();
            if (count == '') {
                count = 1;
                $contents.find('.devCount').val(1);
            }

            var data = {cartIx: cartIx, count: count, sumPidCnt: totalCnt};
            common.ajax(common.util.getControllerUrl('updateCount', 'cart'), data, "", function (result) {
                if (result.result == 'success') {
                    document.location.reload();
                } else if(result.result == 'noLogin'){
                    common.noti.alert(common.lang.get('cart.update.count.noLogin.alert'));
                }
                //기본 구매 수량 보다 낮은 수량 수정시
                else if (result.result == 'failBasicCount') {
                    //common.noti.alert(common.lang.get('cart.update.count.failBasicCount.alert', {count: result.data}));
                    $contents.find('.devTailMsg').text(common.lang.get('cart.update.count.failBasicCount.alert', {count: result.data})); // 230628 수정
                    $contents.find('.txt-error').css("display", "block"); // 230628 수정
                    $contents.find('.devCount').val(result.data); // 230628 수정

                    common.noti.alert(common.lang.get('cart.update.count.failBasicCountCheck.alert')); // 230628 수정
                }
                //ID별 구매 수량 초과시
                else if (result.result == 'failByOnePersonCount') {
                    //common.noti.alert(common.lang.get('cart.update.count.failByOnePersonCount.alert', {count: result.data}));
                    $contents.find('.devTailMsg').text(common.lang.get('cart.update.count.failByOnePersonCount.alert', {count: result.data}));
                    $contents.find('.txt-error').css("display", "block"); // 230628 수정
                    $contents.find('.devCount').val(result.data);

                    common.noti.alert(common.lang.get('cart.update.count.failByOnePersonCountCheck.alert')); // 230628 수정
                }
                //장바구니 수량보다 재고가 많을경우
                else if (result.result == 'failStockLack') {
                    common.noti.alert(common.lang.get('cart.update.count.failStockLack.alert', {count: result.data}));
                    $contents.find('.devTailMsg').text(common.lang.get('cart.update.count.failStockLack.alert', {count: result.data}));
                }
                //품절 되었을 경우
                else if (result.result == 'failNoSale') {
                    common.noti.alert(common.lang.get('cart.update.count.failNoSale.alert'), function () {
                        document.location.reload();
                    });
                } else {
                    common.noti.alert('error');
                }
            });
        });

        //추가구성상품 수량 변경
        $('.devAddOptionCountUpdateButton').click(function () {
            var $contents = $(this).closest('.devAddOptionContents');
            var cartOptionIx = $contents.find('.devCartOptionIx').val();
            var count = $contents.find('.devCount').val();
            var data = {cartOptionIx: cartOptionIx, count: count};
            common.ajax(common.util.getControllerUrl('updateOptionCount', 'cart'), data, "", function (result) {
                if (result.result == 'success') {
                    document.location.reload();
                }
                //장바구니 수량보다 재고가 많을경우
                else if (result.result == 'failStockLack') {
                    common.noti.alert(common.lang.get('cart.update.count.failStockLack.alert', {count: result.data}));
                } else {
                    common.noti.alert('error');
                }
            });
        });

        //상품 바로구매
        $('.devDirectBuyButton').click(function () {
            self.orderInfoinput([$(this).closest('.devProductContents').find('.devCartIx').val()]);
        });

        //구매하기
        $('#devBuyButton').click(function () {
            var cartIxs = self.getSelectCartIx();
            //선택된 상품이 없을때
            if (!(cartIxs.length > 0)) {
                common.noti.alert(common.lang.get('cart.buy.noSelect.alert'));
                return;
            }
            self.orderInfoinput(cartIxs);
        });
    },
    //cart run
    run: function () {
        var self = this;

        // 이벤트 설정
        self.initEvent();
        // 네이버페이 연동
        if (typeof dev_ext.npay.useNpay !== 'undefined' && dev_ext.npay.useNpay == 'Y') {
            dev_ext.npay.cart.init();
        }
    }
}

$(function () {
    devCartObj.run();
});