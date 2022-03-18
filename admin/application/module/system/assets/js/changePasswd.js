"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devSystemChangePasswdObj = {
    initModal: function () {
        // 비밀번호 변경 모달
        common.util.modal.open(
            'html',
            '비밀번호 변경',
            common.util.getHtml('#devChangePasswdTpl'),
            '', function () {
                $(".fb-modal__bg").addClass('notclose');
            },
            {width: '500px', height: '480px'}
        );

        common.validation.set($('#devNewPasswd1'), {'required': true, 'dataFormat': 'userPassword'});
        common.validation.set($('#devNewPasswd2'), {'required': true, 'compare': '#devNewPasswd1'});

        // $form, url, beforeCallback, successCallback
        common.form.init(
            $('#devChangePasswdForm'),
            common.util.getControllerUrl('putPassword', 'changePasswd', 'system'),
            function (formData) {
                if ($('#devNextChange').val() == 'Y') {
                    return true;
                } else {
                    return common.validation.check($('#devChangePasswdForm'), 'alert', false);
                }
            },
            function (response) {
                if (response.result == 'nextChange') {
                    location.replace(response.data.url);
                } else if (response.result == 'success') {
                    devSystemChangePasswdObj.successModal(response.data);
                } else {
                    var msgCode = response.data.msgCode;

                    if (msgCode == 'usedPasswd') {
                        common.noti.alert(common.lang.get("system.changePassword.msg.usedPassword"));
                    } else {
                        common.noti.alert(common.lang.get("common.validation.userPassword.fail"));
                    }
                }
            }
        );

    },
    successModal: function (successData) {
        // 비밀번호 수정 완료 모달
        common.util.modal.open(
            'html',
            '비밀번호 변경',
            common.util.getHtml('#devChangeSuccessTpl'),
            '', function () {
                $(".fb-modal__bg").addClass('notclose');
                $('#devContinueLogin').on('click', function(){
                    location.replace(successData.url);
                });
            },
            {width: '500px', height: '250px'}
        );
    },
    initEvent: function () {
        var self = this;

        // 다음에 변경하기 버튼
        $('#devNextChangeBtn').on('click', function () {
            $('#devNextChange').val('Y');
            $('#devChangePasswdForm').submit();
        });

        // 비밀번호 변경 버튼
        $('#devPasswordChangeBtn').on('click', function () {
            $('#devChangePasswdForm').submit();
        });

        $('.fb-modal__close').on('click',function(){
            alert()
        });
    },
    initLang: function () {
        common.lang.load('system.changePassword.msg.usedPassword', "현재 비밀번호와 같은 비밀번호입니다.");
    },
    run: function () {
        var self = this;

        self.initLang();
        self.initModal();
        self.initEvent();
    }
}

$(function () {
    devSystemChangePasswdObj.run();
});