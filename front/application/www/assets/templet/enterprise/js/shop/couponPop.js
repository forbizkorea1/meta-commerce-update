"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/

var devCouponPopObj = {
    initLang: function () {
        common.lang.load('coupon.invalid.msg', "상품 금액 보다 쿠폰 적용 금액이 커서 쿠폰적용이 불가합니다.");
        common.lang.load('coupon.select.msg', "상품쿠폰 선택 시 장바구니 쿠폰이 초기화됩니다. 계속 진행하시겠습니까?");
        common.lang.load('coupon.cart.msg', "장바구니쿠폰 선택 시, 상품쿠폰이 초기화됩니다. 초기화 하시겠습니까?");
    },
    getCouponInfoBySelect: function ($select) {
        var cartIx = $select.attr('devCouponSelect');
        var $checkedOption = $select.find('option:checked');
        var registIx = $checkedOption.val();
        var totalCouponWithDcprice = $checkedOption.attr('devTotalCouponWithDcprice');
        var discountAmount = $checkedOption.attr('devDiscountAmount');
        var couponDIv = $checkedOption.attr('devCouponDiv');
        return {cartIx: cartIx, registIx: registIx, totalCouponWithDcprice: totalCouponWithDcprice, discountAmount: discountAmount, couponDIv: couponDIv}
    },
    changeCouponText: function (cartIx, totalCouponWithDcprice, discountAmount) {
        if (totalCouponWithDcprice >= 0) {
            $('[devTotalCouponWithDcpriceText="' + cartIx + '"]').text(common.util.numberFormat(totalCouponWithDcprice));
            $('[devDiscountAmountText="' + cartIx + '"]').text(common.util.numberFormat(discountAmount));
        } else {
            common.noti.alert(common.lang.get('coupon.invalid.msg'));
            $('select[devCouponSelect]').val('');
        }
    },
    changeProductDcpriceText: function () {
        var totalDiscountAmount = 0;
        $('select[devCouponSelect], select[devCartCouponSelect]').each(function () {
            var registIx = $(this).val();
            if (registIx != '') {
                totalDiscountAmount += parseFloat($(this).find('option[value="' + registIx + '"]:checked').attr('devDiscountAmount'));
            }
        });
        var totalProductDcprice = parseInt($('#devTotalProductDcprice').val());
        $('#devTotalCouponDiscountAmount').text(common.util.numberFormat(totalDiscountAmount));
        $('#devTotalCouponWithProductDcprice').text(common.util.numberFormat(totalProductDcprice - totalDiscountAmount));
    },
    check_select_cupon: function () {
        //일단 전체 숨김
        $('.devCancelCoupon').hide();
        $('.devCancelCart').hide();

        //상품 쿠폰 셀렉트 박스들을 전체 검색
        var cupon_select_id = null;
        $('.cupon_select').each(function (k, v) {
            cupon_select_id = $(this).attr("devCouponSelect");
            if ($(this).find(' option:selected').val()) {
                //값이 있는 것만 취소 버튼 활성화
                $('#cupon_cancel' + cupon_select_id).show();
            }
        });

        //카트 쿠폰은 전체 취소.. 1개만 있음
        $('.devCancelCart').hide();

    },
    initEvent: function () {
        var self = devCouponPopObj;

        //기본은 취소버튼 숨김
        self.check_select_cupon();

        //쿠폰 선택
        $('select[devCouponSelect]').change(function () {
            var data = self.getCouponInfoBySelect($(this));
            var cartIx = $(this).attr('devCouponSelect');
            var isProcess = true;

            if($(this).val() != ''){
                if($('select[devCartCouponSelect] option:selected').val() !=''){
                    common.noti.confirm(common.lang.get('coupon.select.msg')
                        , function () {
                            isProcess = true;
                        }
                        ,function () {
                            isProcess = false;
                        })
                }
            }

            if(isProcess) {
                //장바구니 쿠폰 취소 버튼 초기화
                $('.devCancelCart').hide();

                if (data.registIx > 0) {
                    self.changeCouponText(data.cartIx, data.totalCouponWithDcprice, data.discountAmount);

                    //다른 선택 사항 초기화
                    $('select[devCouponSelect]:not([devCouponSelect="' + data.cartIx + '"]) option[value="' + data.registIx + '"]:checked').closest('select').each(function () {
                        $(this).val('');
                        var cartIx = $(this).attr('devCouponSelect');
                        self.changeCouponText(cartIx, 0, 0);
                        $('#cupon_cancel' + cartIx).hide();
                    });
                    //장바구니쿠폰 초기화
                    $('select[devCartCouponSelect]').val('');
                } else {
                    self.changeCouponText(data.cartIx, 0, 0);
                }

                //선택 했으니 취소버튼 오픈
                $('#cupon_cancel' + cartIx).show();
                if (!data.registIx) {
                    //없는 값 선택 했으니 취소버튼 숨김
                    $('#cupon_cancel' + cartIx).hide();
                }
            } else {
                $('select[devCouponSelect]').val('');
            }

            self.changeProductDcpriceText();
        });

        //장바구니쿠폰 선택
        $('select[devCartCouponSelect]').change(function () {
            var isProcess = true;
            $('select[devCouponSelect] option[value!=""]:checked').closest('select').each(function () {
                if($(this).val() != ''){
                    isProcess = false;
                }
            });

            if(isProcess == false) {
                common.noti.confirm(common.lang.get('coupon.cart.msg')
                    , function () {
                        isProcess = true;
                    }
                    , function () {
                        isProcess = false;
                    })

            }

            if(isProcess) {
                var data = self.getCouponInfoBySelect($(this));
                if (data.registIx > 0) {
                    self.changeCouponText(data.cartIx, data.totalCouponWithDcprice, data.discountAmount);

                    //다른 선택 사항 초기화
                    $('select[devCouponSelect]:not([devCouponSelect="' + data.cartIx + '"]) option[value="' + data.registIx + '"]:checked').closest('select').each(function () {
                        $(this).val('');
                        var cartIx = $(this).attr('devCouponSelect');
                        self.changeCouponText(cartIx, 0, 0);
                        //장바구니 쿠폰 선택 했으니 취소 버튼 초기화
                        $('.devCancelCoupon').hide();
                    });
                    //상품쿠폰 초기화
                    $('select[devCouponSelect] option[value!=""]:checked').closest('select').each(function () {
                        $(this).val('');
                        var cartIx = $(this).attr('devCouponSelect');
                        self.changeCouponText(cartIx, 0, 0);
                        $('#cupon_cancel' + cartIx).hide();
                    });
                } else {
                    self.changeCouponText(data.cartIx, 0, 0);
                }

                //선택 되면 취소 버튼 노출
                $('.devCancelCart').show();
                if (!data.registIx) {
                    //없는 값 선택 했으니 취소버튼 숨김
                    $('.devCancelCart').hide();
                    $('.devCancelCoupon').hide();
                }
                //상품쿠폰 초기화
                $('select[devCouponSelect] option[value!=""]:checked').closest('select').each(function () {
                    $(this).val('');
                    var cartIx = $(this).attr('devCouponSelect');
                    self.changeCouponText(cartIx, 0, 0);
                });
            } else {
                $('select[devcartcouponselect]').val('');
            }

            self.changeProductDcpriceText();

        });

        //상품 쿠폰 취소
        $('[devCancelCouponSelect]').click(function () {
            $('select[devCouponSelect] option[value!=""]:checked').closest('select').each(function () {
                $(this).val('');
                var cartIx = $(this).attr('devCouponSelect');
                self.changeCouponText(cartIx, 0, 0);
                $('#cupon_cancel' + cartIx).hide();
            });
            self.changeProductDcpriceText();
        });

        //장바구니 쿠폰 취소
        $('[devCancelCartCouponSelect]').click(function () {
            $('select[devCartCouponSelect] option[value!=""]:checked').closest('select').each(function () {
                $(this).val('');
                var cartIx = $(this).attr('devCouponSelect');
                self.changeCouponText(cartIx, 0, 0);
            });
            self.changeProductDcpriceText();
            $('select[devCartCouponSelect]').val('');
            //취소 하니 취소버튼 숨김
            $('.devCancelCart').hide();
        });

        //쿠폰 적용
        $('#devApplyCouponButton').click(function () {
            var useData = {};
            var couponType = '';
            var couponCnt = 0;
            var cartCouponCnt = 0;
            var isAppCoupon = false;
            $('select[devCouponSelect]').each(function () {
                var data = self.getCouponInfoBySelect($(this));
                useData[data.cartIx] = data.registIx;

                if(data.registIx != '') {
                    couponCnt++;
                }
            });

            $('select[devCartCouponSelect]').each(function () {
                var data = self.getCouponInfoBySelect($(this));
                useData['cart'] = data.registIx;
                if(data.registIx != '') {
                    cartCouponCnt++;
                }
                if(data.couponDIv == 'A') {
                    isAppCoupon = true;
                }
            });

            if(couponCnt > 0) {
                couponType = 'G';
            } else if(cartCouponCnt > 0) {
                couponType = 'C';
            }

            if(isAppCoupon) {
                couponType = 'A';
            }

            devInfoinputObj.setUseCouponData(useData, couponType);
            $('#devCouponCancelButton').trigger('click');
        });

        //취소
        $('#devCouponCancelButton').click(function() {
            $('.coupon-pop .js__modal__close').trigger('click');
        });

        $('select[devCouponSelect]').trigger('change');
    },
    run: function () {
        var self = devCouponPopObj;

        self.initLang();
        self.initEvent();

        if(couponMode == 'G'){
            $('select[devCouponSelect]').trigger('change');
        } else {
            $('select[devcartcouponselect]').trigger('change');
        }
    }
};

$(function () {
    devCouponPopObj.run();
    $('.scroll__area').scrollbar(); //스크롤바 플러그인
});

