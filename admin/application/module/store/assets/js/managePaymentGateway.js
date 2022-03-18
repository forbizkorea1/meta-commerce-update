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
    },
    initEvent: function () {
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

        $("#devTopMenuSaveBtn").on('click', function () {
            if ($('input[name="mainPayMethod[]"]:checked').length == 0) {
                common.noti.alert(common.lang.get('common.put.mainPayMethod.error.alert'));
                return false;
            }

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