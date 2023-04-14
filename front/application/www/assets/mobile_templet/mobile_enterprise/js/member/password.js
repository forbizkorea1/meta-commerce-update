"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var passwordObj = {
    continueBeforeCallback: false,
    continueSuccessCallback: function (response) {
        if (response.result == "success") {
            location.replace('/');
        } else {
            common.noti.alert('system error');
        }
    },
    beforeCallback: function ($form) {
        return common.validation.check($form);
    },
    responseUrl: false,
    successCallback: function (response) {
        var self = passwordObj;
        if (response.result == "success") {
            self.responseUrl = response.data.url;
            common.noti.alert(common.lang.get("password.change.success"), self.successLocation);
        } else if (response.result == "alreadyUsePw") {
            common.noti.alert(common.lang.get("password.change.fail.alreadyUsePw"));
        }  else {
            common.noti.alert(common.lang.get("password.change.not_identical"));
        }
    },
    successLocation: function () {
        var self = passwordObj;
        location.replace(self.responseUrl);
    },
    sleepReleaseCancel: function () {
        return location.href = '/member/logout';
    },
    init: function () {
        var self = this;
        common.lang.load('password.change.success', "비밀번호가 정상적으로 변경되었습니다."); //Alert_18
        common.lang.load('password.change.fail.alreadyUsePw', "동일한 비밀번호는 사용하실 수 없습니다.");
        common.lang.load('password.sleep.cancel.confirm', "휴면 계정 해제를 취소하시겠습니까?{common.lineBreak}취소 시 비로그인 상태로 유지됩니다."); //Confirm_28
        common.lang.load('password.change.not_identical', "새 비밀번호와 일치하게 입력해 주세요.");

        common.validation.set($('#devUserPassword'), {'required': true, 'dataFormat': 'userPassword'});
        common.validation.set($('#devCompareUserPassword'), {'required': true, 'compare': '#devUserPassword'});
    },
    initEvent: function () {
        var self = this;

        //-----재알림
        $('#devContinueButton').click(function (e) {
            e.preventDefault();
            common.ajax(common.util.getControllerUrl('passwordContinue', 'member'), "", self.continueBeforeCallback, self.continueSuccessCallback);
        });

        //-----휴면회원 비밀번호 변경 취소시
        //취소
        $('#devSleepCancelButton').click(function (e) {
            e.preventDefault();
            common.noti.confirm(common.lang.get('password.sleep.cancel.confirm'), self.sleepReleaseCancel);
        });
        //비밀번호 체크
        $('#devUserPassword').on({
            'input': function (e) {
                if (common.validation.check($(this),'tailMsg')) {
                    common.noti.tailMsg(this.id, common.lang.get('joinInput.common.validation.userPassword.success'), 'success');
                } else {
                    // common.noti.tailMsg(this.id, common.lang.get('joinInput.common.validation.userPassword.fail'));
                }
            }
        });

        //-----변경
        var $form = $('#devForm');
        var url = common.util.getControllerUrl('changePassword', 'member');

        common.form.init($form, url, self.beforeCallback, self.successCallback);

        $('#devSubmitButton').click(function (e) {
            e.preventDefault();
            $form.submit();
        });
    },
    run: function () {
        var self = this;
        self.init();
        self.initEvent();
    }
}

$(function () {
    passwordObj.run();
});