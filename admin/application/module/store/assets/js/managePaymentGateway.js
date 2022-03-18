"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreManagePaymentGatewayObj = {
    initLang: function () {
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.put.error.alert', '수정 중 에러');
        common.lang.load('common.put.mid.error.alert', '유효한 key 값이 아닙니다. 키값의 확인이 필요한 경우 메타커머스 고객센터로 문의 부탁드립니다.');
        common.lang.load('common.put.mainPayMethod.error.alert', '주결제 수단이 최소 1개는 선택되어야합니다.');

        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
        common.lang.load('common.put.confirm', '간편결제(직연동) 모듈 설정을 저장 하시겠습니까?');
        common.lang.load('common.put.success.alert', '저장 되었습니다.');

        common.lang.load('common.fail.alert', '저장에 실패하였습니다.');
        common.lang.load('common.put.payment.confirm', '저장 하시겠습니까?');
        common.lang.load('common.put.payment.check.number', '숫자만 입력 할 수 있습니다.');
    },
    initEvent: function () {
        //네이버페이
        common.validation.set($('[name=naverpay_pg_partner_id]'), {'required': true});
        common.validation.set($('[name=naverpay_pg_client_id]'), {'required': true});
        common.validation.set($('[name=naverpay_pg_client_secret]'), {'required': true});

        //페이코
        common.validation.set($('[name=payco_seller_key]'), {'required': true});
        common.validation.set($('[name=payco_cp_id]'), {'required': true});
        common.validation.set($('[name=payco_product_id]'), {'required': true});

        //토스
        common.validation.set($('[name=toss_api_key]'), {'required': true});


        common.form.init(
            $('#devForm'),
            common.util.getControllerUrl('putSattleModule', 'managePaymentGateway', 'store'),
            function (formData) {

                return true;
            },
            function (response) {
                if (response.result == 'success') {
                    common.noti.alert(common.lang.get('common.put.success.alert'));
                    document.location.reload();
                } else {
                    if (response.data.error == 'mid'){
                        common.noti.alert(common.lang.get('common.put.mid.error.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.put.error.alert'));
                    }
                }
            }
        );
        common.form.init(
            $('#devEasyDirectConfigForm'),
            common.util.getControllerUrl('putEasyDirect', 'manageMallConfig', 'store'),
            function (formData) {

                var submitData = $('.devServiceSelect').find('input[type=radio][value=Y]:checked').closest('.devServiceTable');
                if (common.validation.check(submitData, 'alert', false)) {
                    if (common.noti.confirm(common.lang.get('common.put.confirm'))) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            function (response) {
                if (response.result == 'success') {
                    common.noti.alert(common.lang.get('common.put.success.alert'));
                } else {
                    common.noti.alert(common.lang.get('common.fail.alert'));
                }
            }
        );
        $('.devServiceSelect').find('input[type=radio]:checked').each(function(){
            if($(this).val() == 'N'){
                $(this).closest('.devServiceTable').find('.devServiceUse input').prop('disabled', true);
            } else {
                $(this).closest('.devServiceTable').find('.devServiceUse input').prop('disabled', false);
            }
        });

        $('.devServiceSelect').find('input[type=radio]').on('click', function(){
            if($(this).val() == 'N'){
                $(this).closest('.devServiceTable').find('.devServiceUse input').prop('disabled', true);
            } else {
                $(this).closest('.devServiceTable').find('.devServiceUse input').prop('disabled', false);
            }
        })
        $("#devTopMenuPaymentSaveBtn").on('click', function () {
            $("#devEasyDirectConfigForm").submit();
        });

        $("#devTopMenuSaveBtn").on('click', function () {
            if ($('input[name="mainPayMethod[]"]:checked').length == 0) {
                common.noti.alert(common.lang.get('common.put.mainPayMethod.error.alert'));
                return false;
            }

            if ($('#devKsnetSndStoreId').val() != undefined) {
                if ($('#devKsnetSndStoreId').val().match(/^[0-9]+$/) == null) {
                    common.noti.alert(common.lang.get('common.put.payment.check.number'));
                    return false;
                }
            };

            if (common.noti.confirm(common.lang.get('common.put.payment.confirm'))) {
                var mainPayMethodArray = new Array();

                $('input[name="mainPayMethod[]"]:checked').each(function (i, o) {
                    mainPayMethodArray.push($(this).val());
                });

                $('#devMainPayMethodTxt').val(mainPayMethodArray.join('|'));

                var simplePayMethodArray = new Array();
                $('input[name="simplePayMethod[]"]:checked').each(function (i, o) {
                    simplePayMethodArray.push($(this).val());
                });
                $('#devSimplePayMethodTxt').val(simplePayMethodArray.join('|'));

                $('.devAddPaymentModule, .devAddSattleModule').each(function(){
                    if(!$(this).is(':checked')) {
                        $(this).val('N');
                        $(this).prop('checked', true);
                    }else {
                        $(this).val('Y');
                    }
                });

                $("#devForm").submit();
            }

        });

        $('input[name=service_type]').on('click', function(){
            var $this = $(this);
            if ($this.prop('checked') && $this.val() == 'test') {
                $('.typeTest').show();
                $('.typeService').hide();
            }else if ($this.prop('checked') && $this.val() == 'service') {
                $('.typeTest').hide();
                $('.typeService').show();
            }
        });

        //재신청 팝업
        $('#devKsnetPutRegister').click(function () {
            common.util.modal.open('ajax', 'PG 신청내역', '/pub/pgApplyPop', '',
                '',{width: '900px', height: '540px'});
        });

        //갱신하기
        $('#devKsnetGetId').click(function () {
            common.ajax(common.util.getControllerUrl('getKsnetId', 'payment', 'thirdParty'),
                {

                },
                function () {
                    // 전송전 데이타 검증
                    return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        common.util.modal.close();
                        location.reload();
                    }
                }
            );
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();


    }
}

$(function () {
    devStoreManagePaymentGatewayObj.run();
});