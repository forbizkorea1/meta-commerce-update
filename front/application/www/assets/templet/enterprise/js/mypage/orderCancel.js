"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/

var devOrderCancel = {
    odIx: {},
    initLang: function () {
        common.lang.load('mypage.cancel.confirm', "취소 신청을 취소하시겠습니까?");
        common.lang.load('mypage.apply.confirm', "취소 신청하시겠습니까?");
        common.lang.load('mypage.cancel.reson', "취소사유를 입력해 주세요.");
        common.lang.load('mypage.refund.reson.alert', "환불정보를 입력해 주세요.");
        common.lang.load('mypage.cancel.complete', "취소 신청 완료 되었습니다.");
        common.lang.load('mypage.cancel.select', "취소 사유를 선택하세요.");
        common.lang.load('mypage.match.failure', "처리하려는 주문의 상태값이 변경되었습니다. 확인하고 다시 시도해주세요.");
    },
    setOdix: function () {
        var self = devOrderCancel;
        var ccReason = $('#devCcReason').val();

        $(".devOdIxCls").each(function () {
            var od_ix = $(this).val();

            if ($('#devOdIx' + od_ix).is(':checked')) {
                self.odIx[od_ix] = $('#devCancelCnt' + od_ix).val();
            } else {
                self.odIx[od_ix] = 0;
            }
        });

        common.ajax(
            common.util.getControllerUrl('claimConfirm', 'mypage'),
            {
                oid: $('#devOid').data('oid'),
                status: $('#devOid').data('status'),
                claimStatus: $('#devOid').data('claimstatus'),
                odIx: self.odIx,
                ccReason: ccReason
            },
            function () {
                return true;
            },
            function (data) {
                if (data.result == 'success') {
                    var priceDatas = data.data;
                    var product = data.data.product;
                    var delivery = data.data.delivery;

                    if (priceDatas.length == 0) {
                        $('.devCancelPriceContents').find('em').html(0);
                        return;
                    } else {
                        $('#devCancelProductPrice').html(common.util.numberFormat(product.product_dc_price)); //총 금액
                        $('.devCancelMileageReturnPrice').html(common.util.numberFormat(priceDatas.mileage)); //사용마일리지

                        //배송비가 차감되어야 하는 케이스에서는 상품 총금액에 영향을 주기 때문에 조건에 빠른 분기 처리
                        if(delivery.delivery_dc_price > 0){
                            var cancelTotalPrice = common.util.numberFormat(product.product_dc_price + delivery.delivery_dc_price + priceDatas.mileage)
                        }else{
                            var cancelTotalPrice = common.util.numberFormat(product.product_dc_price + priceDatas.mileage)
                        }


                        if (delivery.delivery_dc_price > 0) {
                            $('#devCancelTotalPrice').html(cancelTotalPrice); //상품 총 금액
                            $('#devCancelDeliveryReceivePrice, #devCancelTotalReceivePrice, #devCancelDeliveryPrice').html(0); //차감해야할 배송비
                            $('#devCancelDeliveryReturnPrice').html(common.util.numberFormat(delivery.delivery_dc_price)); //고객이 환불받아야할 배송비
                        } else {
                            $('#devCancelTotalPrice').html(cancelTotalPrice); //상품 총 금액
                            $('#devCancelDeliveryReceivePrice, #devCancelTotalReceivePrice, #devCancelDeliveryPrice').html(common.util.numberFormat(priceDatas.view_apply_delivery_price));//차감해야할 배송비
                            $('#devCancelDeliveryReturnPrice').html(0);//고객이 환불받아야할 배송비
                        }

                        $('#devCancelTotalReturnPrice').html(common.util.numberFormat(priceDatas.price+priceDatas.mileage)); //환불 금액

                        $('#devCancelProductReturnPrice').html(common.util.numberFormat(priceDatas.price)); //환불 예정 금액
                    }
                }
            }
        );
    },
    submitCancelApply: function () {
        //Form init
        $('#devForm').submit();
    },
    initEvent: function () {
        var self = devOrderCancel;

        // 취소사유, 취소수량  선택 이벤트
        $('#devCcReason,.devCancelCntCls').on('change', function () {
            self.setOdix();
        });

        // 주문 선택 이벤트
        $('.devOdIxCls').on('click', function () {
            if ($('.devOdIxCls').length == $('.devOdIxCls:checked').length) {
                $("#devOdIxAll").prop('checked', true);
            } else {
                $("#devOdIxAll").prop('checked', false);
            }
            self.setOdix();
        });

        // 전체 주문 선택 이벤트
        $('#devOdIxAll').on('click', function () {
            if ($(this).is(':checked')) {
                $(".devOdIxCls").prop('checked', true);
            } else {
                $(".devOdIxCls").prop('checked', false);
            }

            self.setOdix();
        });

        // 취소신청 취소
        $('#devClaimCancel').on('click', function () {
            common.noti.confirm(common.lang.get('mypage.cancel.confirm', ''), function () {
                history.back();
            });
        });

        // 취소신청
        $('#devClaimApply').on('click', function (e) {

            if ($("select[name=cc_reason]").val() == '') {
                common.noti.alert(common.lang.get('mypage.cancel.select'));
                return false;
            }

            if ($('#devCcMsg').val() == '') {
                common.noti.alert(common.lang.get('mypage.cancel.reson'));
                return false;
            }

            // 계좌이체 결제는 제외
            if ($("#devRefundMethod").is(":visible") == true) {
                if ($("#devBankCode").val() == '') {
                    common.noti.alert(common.lang.get('mypage.refund.reson.alert'));
                    $("#devBankCode").focus();
                    return false;
                } else if ($("#devBankOwner").val() == '') {
                    common.noti.alert(common.lang.get('mypage.refund.reson.alert'));
                    $("#devBankOwner").focus();
                    return false;
                } else if ($("#devBankNumber").val() == '') {
                    common.noti.alert(common.lang.get('mypage.refund.reson.alert'));
                    $("#devBankNumber").focus();
                    return false;
                }
            }

            // 취소신청
            self.submitCancelApply();
        });
    },
    initForm: function () {
        var $form = $('#devForm');
        var url = common.util.getControllerUrl('updateCancelStatus', 'mypage');
        var beforeCallback = function ($form) {
            return common.validation.check($form, 'alert');
        };
        var successCallback = function (response) {
            if (response.result == 'success') {
                    common.noti.alert(common.lang.get('mypage.cancel.complete'), function () {
                        document.location.href = '/mypage/returnHistory';
                    });
            } else if (response.result == 'alreadyChange') {
                common.noti.alert(common.lang.get('mypage.match.failure'), function () {
                    document.location.href = '/mypage/orderHistory';
                });
            }
        };

        common.form.init($form, url, beforeCallback, successCallback);
    },
    run: function () {
        var self = devOrderCancel;

        self.initLang();
        // 이벤트
        self.initEvent();
        // 가격점검
        self.setOdix();

        self.initForm();
    }
};

$(function () {
    devOrderCancel.run();
});