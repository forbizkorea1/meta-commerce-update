"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
//-----load language
common.lang.load('claim.cancel.confirm.change', "교환 신청을 취소하시겠습니까?"); //Confirm_39
common.lang.load('claim.cancel.confirm.return', "반품 신청을 취소하시겠습니까?"); //Confirm_41
common.lang.load('claim.selected.fail', "{claimTxt}할 상품을 선택해 주세요.");
common.lang.load('common.validation.required.select', "{title}를 선택해 주세요.");
common.lang.load('common.validation.required.text', "{title}를 입력해 주세요."); //Alert_05
common.lang.load('mypage.exchange.confirm', "상품 교환신청을 하시겠습니까?");
common.lang.load('mypage.return.confirm', "상품 반품신청을 하시겠습니까?");
common.lang.load('mypage.alreadyRefundInfo.confirm', '기존 반품 신청 시 등록하신 계좌가 있는 경우 현재 입력하신 계좌로 변경됩니다. 반품 신청을 하시겠습니까?');

var devOrderClaim = {
    resetFormValidation: function () {
        this.apply.form.find('[' + common.validation._validationAttributeName + ']').each(function () {
            $(this).removeAttr(common.validation._validationAttributeName);
        });
    },
    apply: {
        form: $('#devClaimApplyForm'),
        formValidation: function ($form) {
            devOrderClaim.resetFormValidation();
            common.validation.set($('#devClaimMsg'), {'required': true});
            common.validation.set($("select[name=claim_reason]"), {'required': true});

            if (!common.validation.check($form, 'alert', false)) {
                // 선택 안된 상품이어도 input 갯수 노출
                $(".devOdIxCls").each(function () {
                    var od_ix = $(this).val();
                    if ($(this).is(':checked') === false) {
                        var pcnt = $('#devClaimCnt' + od_ix).attr("pcnt");
                        $('#devClaimCnt' + od_ix).val(pcnt);
                    }
                });

                return false;
            }

            return common.noti.confirm($('#devNextBtn').data('claim') == 'change' ? common.lang.get('mypage.exchange.confirm') : common.lang.get('mypage.return.confirm'));
        },
        initChangeForm: function () {
            var url = ['orderClaim', 'change', 'apply'];

            common.inputFormat.set($('#devCmobile2,#devCmobile3'), {'number': true, 'maxLength': 4});
            common.inputFormat.set($('#devCtel2,#devCtel3'), {'number': true, 'maxLength': 4});
            common.inputFormat.set($('#devRmobile2,#devRmobile3'), {'number': true, 'maxLength': 4});
            common.inputFormat.set($('#devRtel2,#devRtel3'), {'number': true, 'maxLength': 4});

            common.form.init(
                this.form,
                common.util.getControllerUrl(url.join('/'), 'mypage'),
                this.formValidation,
                function (response) {
                    if (response.result == 'success') {
                        location.href = response.data.url;
                    }
                }
            );
        },
        initReturnForm: function () {
            var url = ['orderClaim', 'return', 'apply'];

            common.inputFormat.set($('#devCmobile2,#devCmobile3'), {'number': true, 'maxLength': 4});
            common.inputFormat.set($('#devCtel2,#devCtel3'), {'number': true, 'maxLength': 4});

            common.form.init(
                this.form,
                common.util.getControllerUrl(url.join('/'), 'mypage'),
                this.formValidation,
                function (response) {
                    if (response.result == 'success') {
                        location.href = response.data.url;
                    }
                }
            );
        },
        initEvent: function () {
            var self = this;

            // 발송 방법 선택 이벤트
            $('.devSendTypeCls').on('click', function () {
                var type = $(this).data('type');
                $('input[name=send_type]').val(type);

                if (type == 1) {
                    $('#devDirectDelivery').addClass('active').show();
                    $('#devMethod1').addClass('active').show();
                    $('#devMethod2').removeClass('active').hide();
                    $(".addressForm").hide();
                    sessionStorage.setItem("send_type", 1);
                } else {
                    $('#devDirectDelivery').removeClass('active').hide();
                    $('#devMethod1').removeClass('active').hide();
                    $('#devMethod2').addClass('active').show();
                    $(".addressForm").show();
                    sessionStorage.setItem("send_type", 2);
                }
            });

            // 직접발송시 배송업체 정보 입력 안함 이벤트
            $('.devSelectDeliveryInfo').on('click', function () {
                var type = $(this).data('type');
                if (type == 1) {
                    $('#devSelectDeliveryInfo1').addClass('on');
                    $('#devSelectDeliveryInfo2').removeClass('on');
                    $('input[name=quick_info]').val('');
                    $('#devDeliveryInfo').addClass('active').show();
                    sessionStorage.setItem("dCompanyCk", 1);
                } else {
                    $('#devSelectDeliveryInfo1').removeClass('on');
                    $('#devSelectDeliveryInfo2').addClass('on');
                    $('input[name=quick_info]').val('N');
                    $('#devDeliveryInfo').removeClass('active').hide();
                    sessionStorage.setItem("dCompanyCk", 2);
                }
            });

            // 배송비 선불 착불 여부
            $('.devPayType').on('click', function () {
                var type = $(this).data('type');
                $('input[name=delivery_pay_type]').val(type);
                //if($("#devClaimReason").val() != "ETCS" || $("#devClaimReason").val() != "ETCS" ) {
                if ($("#devClaimReason option:selected").attr("data-type") != "S") {
                    if (type == 1) {
                        $('#devPayType1').addClass('on');
                        $('#devPayType2').removeClass('on');
                    } else {
                        $('#devPayType1').removeClass('on');
                        $('#devPayType2').addClass('on');
                    }
                } else {
                    $('#devPayType1').removeClass('on');
                    $('#devPayType2').addClass('on');
                }
            });

            // Claim사유 변경 이벤트
            $('#devClaimReason').on('change', function () {
                if ($(this).find('option:selected').data('type') == 'S') {
                    $('input[name=delivery_pay_type]').val(2);
                    $('#devPayType1').removeClass('on');
                    $('#devPayType2').addClass('on');
                } else {
                    $('input[name=delivery_pay_type]').val(1);
                    $('#devPayType1').addClass('on');
                    $('#devPayType2').removeClass('on');
                }
            });

            // 이전 버튼 이벤트
            $('#devPrevBtn').on('click', function () {
                if (devClaimType == 'change') {
                    var messageTag = 'claim.cancel.confirm.change';
                } else if (devClaimType == 'return') {
                    var messageTag = 'claim.cancel.confirm.return';
                }
                common.noti.confirm(common.lang.get(messageTag), historyBack);
            });

            var historyBack = function () {
                history.back();
            }

            // 다음 버튼 이벤트
            $('#devNextBtn').on('click', function () {
                var checkedCnt = 0;

                $(".devOdIxCls").each(function () {
                    var od_ix = $(this).val();
                    // 신청시 선택 안된 상품이면 갯수 0으로 변경
                    if ($(this).is(':checked') === false) {
                        $('#devClaimCnt' + od_ix).val(0);
                    } else {
                        checkedCnt++;
                    }
                });

                if(checkedCnt == 0) {
                    var mode = $('#devNextBtn').data('claim') == 'change' ? '교환' : '반품';
                    common.noti.alert(common.lang.get('claim.selected.fail', {claimTxt: mode}));
                    $('.devClaimCntCls').each(function(i, obj){
                        $(obj).children('option:eq(0)').attr("selected", "selected");
                    });

                    return false;
                }
                self.form.submit();
            });

            //송장번호 숫자만
            $(".devClaimDeliveryCls").on("keyup", function () {
                $(this).val($(this).val().replace(/[^0-9]/g, ""));
            });
        },
        initChangeEvent: function () {
            var self = this;

            // 상품 수거지 주소
            $('#devClaim1ZipPopupButton').on('click', function() {
                common.util.zipcode.popup(function (response) {
                    $('#devClaim1Zip').val(response.zipcode);
                    $('#devClaim1Address1').val(response.address1);
                });
            });

            // 교환상품 받으실 주소 찾기 버튼 이벤트
            $('#devClaim2ZipPopupButton').on('click', function() {
                common.util.zipcode.popup(function (response) {
                    $('#devClaim2Zip').val(response.zipcode);
                    $('#devClaim2Address1').val(response.address1);
                });
            });
        },
        run: function () {
            var self = this;

            // 이벤트 설정
            self.initEvent();
            if (devClaimType == 'change') {
                // 교환 전용 이벤트
                self.initChangeEvent();
                self.initChangeForm();
            } else {
                self.initReturnForm();
            }
        }
    },
    confirm: {
        form: $('#devClaimConfirmForm'),
        initForm: function () {
            var url = ['orderClaim', devClaimType, 'confirm'];

            if ($('#devMethod').val() == '0' || $('#devMethod').val() == '4' || $('#devMethod').val() == '9' || $('#devMethod').val() == '10') {
                common.validation.set($('#devBankCode, #devBankOwner, #devBankNumber'), {'required': true});
            }

            common.form.init(
                this.form,
                common.util.getControllerUrl(url.join('/'), 'mypage'),
                function ($form) {
                    return common.validation.check($form, 'alert', false);
                },
                function (response) {
                    if (response.result == 'success') {
                        location.href = response.data.url;
                    }
                }
            );
        },
        initCommonEvent: function () {
            var self = this;

            // 이전 버튼 이벤트
            $('#devPrevBtn').on('click', function () {
                if (devClaimType == 'change') {
                    var messageTag = 'claim.cancel.confirm.change';
                } else if (devClaimType == 'return') {
                    var messageTag = 'claim.cancel.confirm.return';
                }
                common.noti.confirm(common.lang.get(messageTag), historyBack);
            });

            var historyBack = function () {
                history.go(-1);
            }

            // 다음 버튼 이벤트
            $('#devNextBtn').on('click', function () {
                var alreadyRefundInfo = $("#devAlreadyRefundInfo").val();
                if (alreadyRefundInfo == 1) {
                    common.noti.confirm(common.lang.get('mypage.alreadyRefundInfo.confirm'),
                        function (){
                            self.form.submit();
                        },
                        function (){
                            return false;
                        }
                    );
                } else {
                    self.form.submit();
                }
            });
        },
        run: function () {
            var self = this;

            self.initCommonEvent();
            self.initForm();
        }
    },
    complete: {
        initEvent: function () {
            $('#devFineshBtn').on('click', function () {
                location.replace('/mypage/returnHistory');
            });

            $('#devFineshOrderBtn').on('click', function () {
                location.replace('/mypage/orderHistory');
            });
        },
        run: function () {
            this.initEvent();
        }
    }
};

$(function () {
    switch (devClaimStep) {
        case 'confirm':
            devOrderClaim.confirm.run();
            break;
        case 'complete':
            devOrderClaim.complete.run();
            break;
        default:
            devOrderClaim.apply.run();
            break;
    }

    if ($('#devInfoType').val() == '카드' || $('#devInfoType').val() == '휴대폰결제') {
        $('#devInfoBankNumber').hide();
    }

    //전체체크박스 확인
    $(".devOdIxCls").click(function () {
        var max = $(".devOdIxCls").length;
        var cnt = 0;
        $(".devOdIxCls").each(function (k, v) {
            if ($(this).prop("checked"))
                cnt++;
        });

        if (cnt >= max) {
            $("#all_check").prop("checked", true);
        } else {
            $("#all_check").prop("checked", false);
        }
    });

    $('.devDeliveryMessageSelectBox').change(function () {
        var $deliveryMessageContents = $(this).closest('.devDeliveryMessageContents,.devEachDeliveryMessageContents');
        var $deliveryMessageDirectContents = $deliveryMessageContents.find('.devDeliveryMessageDirectContents');
        var $deliveryMessageDoorContents = $deliveryMessageContents.find('.devDeliveryMessageDoorContents');
        var $deliveryMessage = $deliveryMessageDirectContents.find('.devDeliveryMessage');
        var message = $(this).val();
        $deliveryMessage.val('');

        if (message == 'direct') {
            $deliveryMessageDirectContents.show();
            $deliveryMessageDoorContents.hide();
            $deliveryMessageDoorContents.find('.devDeliveryEntranceWay').val('');
            $deliveryMessageDoorContents.find('.devDoorMessage').val('');
        } else if(message == 'door') {
            $deliveryMessageDoorContents.show();
            $deliveryMessageDirectContents.hide();
            $deliveryMessage.val($(this).find("option:selected").text());
        } else {
            $deliveryMessageDirectContents.hide();
            $deliveryMessageDoorContents.hide();
            $deliveryMessage.val(message);
            $deliveryMessageDoorContents.find('.devDeliveryEntranceWay').val('');
            $deliveryMessageDoorContents.find('.devDoorMessage').val('');
        }
        //배송 메세지 길이 이벤트 실행
        $deliveryMessage.trigger('input');
    });

    $('.devDeliveryEntranceWay').on('change', function() {
        var $devDeliveryMessageDoorContents = $(this).closest('.devDeliveryMessageDoorContents');
        var $deliveryMessageDoorContents = $devDeliveryMessageDoorContents.find('.devDeliveryMessageDoorContents');
        var $doorMessage = $deliveryMessageDoorContents.find('.devDoorMessage');
        var message = $(this).val();

        if(message == 'direct' || message == 'door') {
            $devDeliveryMessageDoorContents.find('.devDeliveryEntranceWayMessageWrap').show();
        }else {
            $devDeliveryMessageDoorContents.find('.devDeliveryEntranceWayMessageWrap').hide();
            $doorMessage.val(message);
        }
    });

    var send_type = sessionStorage.getItem("send_type");
    // 이전에 선택했던 교환 발송 방법이 '직접발송'이라면
    if (send_type == "1") {
        $("#send_type_1").prop('checked', true);
        $('#devDirectDelivery').addClass('active').show();
        $('#devMethod1').addClass('active').show();
        $('#devMethod2').removeClass('active').hide();
        $(".addressForm").hide();

        // '배송업체정보 입력 안함'을 체크했다면
        if (sessionStorage.getItem("dCompanyCk") == 1) {
            $("#devSelectDeliveryInfo1").prop('checked', true);
            $('#devSelectDeliveryInfo1').addClass('on');
            $('#devSelectDeliveryInfo2').removeClass('on');
            $('input[name=quick_info]').val('');
            $('#devDeliveryInfo').addClass('active').show();
        } else {
            $("#devSelectDeliveryInfo2").prop('checked', true);
            $('#devSelectDeliveryInfo1').removeClass('on');
            $('#devSelectDeliveryInfo2').addClass('on');
            $('input[name=quick_info]').val('N');
            $('#devDeliveryInfo').removeClass('active').hide();
        }
    } else {
        $('#devDirectDelivery').removeClass('active').hide();
        $('#devMethod1').removeClass('active').hide();
        $('#devMethod2').addClass('active').show();
        $(".addressForm").show();
    }
});
