"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreManagePrivacyConfigObj = {
    initEvent: function () {
        var self = this;
        self.initSelectBox();

    },
    initLang: function () {
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
    },
    initSelectBox: function () {
        $("select[name=sleep_user_mailing_day]").val($("select[name=sleep_user_mailing_day]").attr('item')).prop("selected", true);
    },
    initForm: function () {
        common.form.init(
                $('#devForm'),
                common.util.getControllerUrl('put', 'managePrivacyConfig', 'store'),
                function (formData) {
                    return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    } else {
                        common.noti.alert(response.result);
                    }
                }
        );

        $("#devTopMenuSaveBtn").on('click', function () {
            $("#devForm").submit();
        });
    }
    ,
    run: function () {
        this.initLang();
        this.initEvent();
        this.initForm();
    }
}

$(function(){
    devStoreManagePrivacyConfigObj.run();
});