"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMobileSendPushObj = {
    initLang: function () {
        common.lang.load('push.reservation.success.alert', '예약이 완료되었습니다.');
        common.lang.load('push.send.success.alert', '발송이 완료되었습니다.');
    },
    initFormat : function () {
        common.inputFormat.set($('#devPushTitle'), {'maxLength': 23});
        common.inputFormat.set($('#devPushContent'), {'maxLength': 26});
    },
    initValidation : function () {
        common.validation.set($('input[name=title], input[name=push_title], input[name=contents], input[name=link]'), {required: true});
    },
    initForm: function () {
        common.form.init($('#devForm'), common.util.getControllerUrl('add', 'sendPush', 'mobile'),
            function (formData, $form) {
                return common.validation.check($form, 'alert', false);
            },
            function (response) {
                if (response.result == 'success') {
                    if (response.data.send_type == 'R') {
                        common.noti.alert(common.lang.get('push.reservation.success.alert'));
                    } else {
                        common.noti.alert(common.lang.get('push.send.success.alert'));
                    }
                    location.reload();
                } else {
                    console.log(response);
                }
            }
        );
    },
    initEvent: function () {
        //날짜
        common.ui.datePicker($('#devReservationDate'), {
            timepicker: true
        });

        //발송 기종 선택
        $('input[name=send_type]').change(function () {
            if ($(this).val() == 'R') {
                $('#devSendTypeReservationContents').show();
            } else {
                $('#devSendTypeReservationContents').hide();
            }
        });

        // 전송 버튼 이벤트
        $('#devTopMenuSaveBtn').on('click', function () {
            // 입력폼 전송
            $('#devForm').submit();
            return false;
        });

        //이미지
        common.ui.upload('.devPushFileupload')
            .init()
            .putFileBox('pushImage', $('#devForm').find('.devPushFileupload').data('imgSrc'));
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initValidation();
        self.initFormat();
        self.initForm();
        self.initEvent();
    }
}

$(function () {
    devMobileSendPushObj.run();
});