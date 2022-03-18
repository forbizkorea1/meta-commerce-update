"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/


$(document).ready(function (){
    if($('.pixel-details-setting').hasClass('disabled') == true){
        $('.pixel-details-setting').find('input[type=radio]').on('click', () => false);
    }
});

$('input[name=use_pixel_yn]').on('click', function(){
    var chkVal = $(this).prop('checked', true).val();
    var target = $('.pixel-details-setting');

    target.find('input[type=radio]').off('click');
    target.find('input[type=radio][value=' + chkVal + ']').prop('checked', true);

    if (chkVal == 'N') {
        target.addClass('disabled');
        target.find('input[type=radio]').on('click', () => false);
    } else {
        target.removeClass('disabled');
        target.find('input[type=radio]').on('click', () => true);
    }
});

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMarketingCenterFacebookObj = {
    initLang: function () {
        common.lang.load('common.put.success.alert', '저장 되었습니다.');
        common.lang.load('common.fail.alert', '저장에 실패하였습니다.');
    },
    initForm: function () {

        common.form.init(
            $('#devFbSettingForm'),
            common.util.getControllerUrl('put', 'Facebook', 'marketingCenter'),
            function (formData) {
                if (common.validation.check($('#devFbSettingForm'), 'alert', false)) {
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
                common.validation.set($('[name=pixel_id]'), {'required': true});
            } else {
                common.validation.set($('[name=pixel_id]'), {'required': false});
            }
            $("#devFbSettingForm").submit();

        });
    },
    run: function() {
        this.initLang();
        this.initForm();
    }
}

$(function(){
    devMarketingCenterFacebookObj.run();
});