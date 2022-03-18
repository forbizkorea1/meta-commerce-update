"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductManageBrandObj = {
    initEvent: function () {
        // 전송 버튼 이벤트
        $('#devTopMenuSaveBtn').on('click', function () {
            // 입력폼 전송
            $('#devManageBrandForm').submit();
            return false;
        });
    },
    initForm: function () {
        // 메시지
        common.lang.load('common.success.alert', '저장 되었습니다.');
        common.lang.load('common.not.alert', '필수 항목을 입력해주세요.');
        common.lang.load('common.duplication.alert', '브랜드명이 중복되었습니다.');

        var method = 'add';
        if ($('[name="b_ix"]').val()) {
            method = 'put';
        }

        common.validation.set($('[name="brand_name"]'), {'required': true});

        common.form.init($('#devManageBrandForm'), common.util.getControllerUrl(method, 'manageBrand', 'product'), function (formData, $form) {
            // 전송전 데이타 검증
            if (common.validation.check($form, 'alert', false)) {
                return true;
            } else {
                return false;
            }
            return false;
        }, function (response) {
            if (response.result == "success") {
                common.noti.alert(common.lang.get('common.success.alert'));
                //location.href = '/product/listBrand';
            } else if (response.result == "duplication"){
                common.noti.alert(common.lang.get('common.duplication.alert'));
                return false;
            } else {
                common.noti.alert(common.lang.get('common.not.alert'));
                return false;
            }
        });
    },
    run: function () {
        var self = this;

        self.initEvent();
        self.initForm();
    }
}

$(function () {
    devProductManageBrandObj.run();
});