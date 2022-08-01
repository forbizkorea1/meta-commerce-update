"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/


/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devSystemManageMessageTemplateObj = {
    messageForm: $('#devMessageConfigForm'),
    initLang: function () {
        common.lang.load('exists.mcCode.alert', '등록된 메일코드가 있습니다.');
    },
    initForm: function () {
        var self = this;

        common.validation.set($('[name="mc_code"], [name="mc_title"], [name="mc_mail_title"]'), {required: true});
        common.form.init(
                self.messageForm,
                common.util.getControllerUrl('put', 'manageMessageTemplate', 'system'),
                function (formData) {
                    if (common.validation.check(self.messageForm, 'alert', false)) {
                        return formData;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        location.replace(common.util.getControllerUrl(response.data.mc_ix, 'manageMessageTemplate', 'system'));
                    } else if (response.result == 'existsMcCode') {
                        common.noti.alert(common.lang.get('exists.mcCode.alert'));
                    } else {
                        console.log(response);
                    }
                }
        );
    },
    initEvent: function () {
        var self = this;

        // 취소 버튼 이벤트
        $('#devTopMenuCancelBtn').on('click', function () {
            location.replace(common.util.getControllerUrl('listMessageTemplate', 'system'));
        });

        // 저장 버튼 이벤트
        $('#devTopMenuAddBtn').on('click', function () {
            self.messageForm.submit();

            return false;
        });

        $(document).on('change', '#devKakaoChannelSelect', function(){
            var channel_id = $(this).val();

            common.ajax(common.util.getControllerUrl('getTemplateList', 'manageAlimTalk', 'system'),
                {
                    'channel_id' : channel_id
                    , 'page' : 1
                    , 'max' : 100
                    , 'template_inspection_status' : 'COMPLETE'
                },
                function () {
                    return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        var rows = response.data.list;
                        var options = '<option value="">템플릿 선택</option>';
                        var total = response.data.total;

                        $('#devKakaoTemplateSelect > *').remove();

                        for(var i =0; i<total; i++) {
                            var option = rows[i];
                            options += '<option value="'+option.template_code+'">'+option.template_name+'</option>';
                        }

                        $('#devKakaoTemplateSelect').append(options);
                    } else {
                        console.log(response);
                    }
                });
        });
    },
    run: function () {
        var self = this;

        self.initEvent();
        self.initForm();
    }
}

$(function () {
    devSystemManageMessageTemplateObj.run();
});