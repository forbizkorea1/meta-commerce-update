"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMarketingCenterBiginsightObj = {
    initLang: function () {
        common.lang.load('common.put.success.alert', '저장 되었습니다.');
        common.lang.load('common.fail.alert', '저장에 실패하였습니다.');
    },
    initForm: function () {

        common.form.init(
            $('#devBiSettingForm'),
            common.util.getControllerUrl('put', 'Biginsight', 'marketingCenter'),
            function (formData) {
                if (common.validation.check($('#devBiSettingForm'), 'alert', false)) {
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
                common.validation.set($('[name=biginsight_id]'), {'required': true});
            } else {
                common.validation.set($('[name=biginsight_id]'), {'required': false});
            }
            $("#devBiSettingForm").submit();

        });
    },
    run: function() {
        this.initLang();
        this.initForm();
    }
}

$(function(){
    devMarketingCenterBiginsightObj.run();
});