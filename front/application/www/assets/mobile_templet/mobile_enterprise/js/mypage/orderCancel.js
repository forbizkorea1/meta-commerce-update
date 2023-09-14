"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
common.lang.load('mypage.cancel.confirm', "취소 신청을 취소하시겠습니까?");
common.lang.load('mypage.apply.confirm', "취소 신청하시겠습니까?");
common.lang.load('mypage.cancel.reson', "취소사유를 입력해 주세요.");
common.lang.load('mypage.cancel.noCk', "상품을 선택해주세요.");
common.lang.load('mypage.refund.reson.alert', "환불정보를 입력해 주세요.");
common.lang.load('mypage.cancel.complete', "취소 신청 완료 되었습니다.");
common.lang.load('mypage.cancel.select', "취소 사유를 선택하세요.");
common.lang.load('mypage.match.failure', "취소 신청하려는 주문의 상태값이 변경되었습니다. 다시 시도해주세요.");
common.lang.load('mypage.alreadyRefundInfo.confirm', '기존 환불 신청 시 등록하신 계좌가 있는 경우 현재 입력하신 계좌로 변경됩니다. 환불 신청을 하시겠습니까?');

var devOrderCancel = {
    odIx: {},
    odIxCk: true,
    setOdix: function () {
        var self = this;
        var ccReason = $('#devCcReason').val();

        if (self.odIxCk == false) {
            // 선택된 상품이 하나도 없다면 이전에 계산된 금액 전부 0으로 되돌림
            $('#devCancelProductPrice').html(0); //총 금액
            $('.devCancelMileageReturnPrice').html(0); //사용마일리지
            $('#devCancelTotalPrice').html(0); //상품 총 금액
            $('#devCancelDeliveryReceivePrice, #devCancelTotalReceivePrice, #devCancelDeliveryPrice').html(0); //차감해야할 배송비
            $('#devCancelDeliveryReturnPrice').html(0); //고객이 환불받아야할 배송비
            $('#devCancelTotalReturnPrice').html(0); //환불 금액
            $('#devCancelProductReturnPrice').html(0); //환불 예정 금액
        } else {
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
                    odIx: this.odIx,
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
                            $('#devCancelTotalPrice').html(0);
                            $('#devCancelTotalReturnPrice').html(0);
                            $('#devCancelDeliveryReceivePrice').html(0);
                            return;
                        } else {
                            $('#devCancelProductPrice').html(common.util.numberFormat(product.product_dc_price)); //총 금액
                            $('#devCancelTotalReturnPrice').html(common.util.numberFormat(priceDatas.price+priceDatas.mileage)); //환불 금액
                            $('#devCancelProductReturnPrice').html(common.util.numberFormat(priceDatas.price)); //환불 예정 금액
                            $('#devOrgDeliveryPrice').html(common.util.numberFormat(delivery.delivery_dc_price)); //결제시 배송비
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
                                $('#devCancelDeliveryReceivePrice, #devCancelTotalReceivePrice, #devCancelDeliveryPrice').html(common.util.numberFormat(delivery.delivery_dc_price)); //차감해야할 배송비
                                $('#devCancelDeliveryReturnPrice').html(0); //고객이 환불받아야할 배송비
                            }
                        }
                    }
                }
            );
        }
    },
    submitCancelApply: function () {
        //Form init
        $('#devForm').submit();
    },
    initEvent: function () {
        var self = this;

        // 취소사유, 취소수량  선택 이벤트
        $('#devCcReason,.devCancelCntCls').on('change', function () {
            self.setOdix();
        });

        // 주문 선택 이벤트
        $('.devOdIxCls').on('click', function () {
            // 선택된 상품이 없다면 false
            if ($('.devOdIxCls:checked').length > 0) {
                self.odIxCk = true;
            } else {
                self.odIxCk = false;
            }

            self.setOdix();
        });

        // 취소 상세 글자수 표시 이벤트
        $('#devCcMsg').on('keyup', function () {
            $('#devMsgLength').text($(this).val().length);
        });

        // 전체 주문 선택 이벤트
        $('#devOdIxAll').on('click', function () {
            if ($(this).is(':checked')) {
                $(".devOdIxCls").prop('checked', true);
                $(".devOdIxCls").attr('checked', true);
            } else {
                $(".devOdIxCls").prop('checked', false);
                $(".devOdIxCls").attr('checked', false);
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
            // 선택된 상품이 없을 경우
            if (self.odIxCk == false) {
                common.noti.alert(common.lang.get('mypage.cancel.noCk'));
                return false;
            }

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

            var alreadyRefundInfo = $("#devAlreadyRefundInfo").val();
            if (alreadyRefundInfo == 1) {
                common.noti.confirm(common.lang.get('mypage.alreadyRefundInfo.confirm'),
                    function (){
                        // 취소신청
                        self.submitCancelApply();
                    },
                    function (){
                        return false;
                    }
                );
            } else {
                // 취소신청
                self.submitCancelApply();
            }
        });
    },
    formInit: function () {
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
        var self = this;

        // 이벤트
        self.initEvent();
        // 가격점검
        self.setOdix();

        self.formInit();
    }
};

$(function () {
    devOrderCancel.run();
});