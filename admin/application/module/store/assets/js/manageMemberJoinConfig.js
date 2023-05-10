"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreMallManageObj = {
    initLang: function () {
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.fail.alert', '저장에 실패하였습니다.');
        common.lang.load('common.check.jointype', '회원형태를 1개이상 선택해주세요.');
        common.lang.load('common.put.mid.error.alert', '유효한 key 값이 아닙니다. 키값의 확인이 필요한 경우 메타커머스 고객센터로 문의 부탁드립니다.');
    },
    initForm: function () {
        common.form.init(
                $('#devMemberManageForm'),
                common.util.getControllerUrl('put', 'manageMemberJoinConfig', 'store'),
                function (formData) {
                    return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    } else {
                        if (response.data.error == 'mid'){
                            common.noti.alert(common.lang.get('common.put.mid.error.alert'));
                        }else{
                            common.noti.alert(common.lang.get('common.fail.alert'));
                        }
                    }
                }
        );

        $("#devTopMenuSaveBtn").on('click', function () {
            $("#devMemberManageForm").submit();
        });

        $("input:radio[name=mall_use_certify]").on('click', function () {
            if($(this).val() == 'Y'){
                $("#mall_certify_input").show();
            }else if($(this).val() == 'N'){
                $("#mall_certify_input").hide();
            }
        });

        $("input:radio[name=mall_use_sso]").on('click', function () {
            if($(this).val() == 'Y'){
                $("#mall_sso_input").show();
            }else if($(this).val() == 'N'){
                $("#mall_sso_input").hide();
            }
        });

        $("input:radio[name=mall_use_ipin]").on('click', function () {
            if($(this).val() == 'Y'){
                $("#mall_ipin_input").show();
            }else if($(this).val() == 'N'){
                $("#mall_ipin_input").hide();
            }
        });
    },
    run: function () {
        this.initLang();
        this.initForm();
    }
}

$(function () {
    devStoreMallManageObj.run();
});