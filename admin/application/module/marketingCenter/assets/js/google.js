"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMarketingCenterGoogleObj = {
    initLang: function () {
        common.lang.load('common.put.success.alert', '저장 되었습니다.');
        common.lang.load('common.fail.alert', '저장에 실패하였습니다.');
    },
    initForm: function () {

        common.form.init(
            $('#devGaSettingForm'),
            common.util.getControllerUrl('put', 'Facebook', 'marketingCenter'),
            function (formData) {
                if (common.validation.check($('#devGaSettingForm'), 'alert', false)) {
                    return formData;
                } else {
                    return false;
                }
            },
            function (response) {
                if (response.result == 'success') {
                    common.noti.alert(common.lang.get('common.put.success.alert'));
                    window.location.reload();
                } else {
                    common.noti.alert(common.lang.get('common.fail.alert'));
                }
            }
        );


        $("#devTopMenuSaveBtn").on('click', function () {
            if ($('input[name=use_biginsight_yn][value="Y"]').is(':checked')) {
                common.validation.set($('[name=ga_id]'), {'required': true});
            } else {
                common.validation.set($('[name=ga_id]'), {'required': false});
            }
            $("#devGaSettingForm").submit();

        });
    },
    run: function() {
        this.initLang();
        this.initForm();
    }
}

$(function(){
    devMarketingCenterGoogleObj.run();
});