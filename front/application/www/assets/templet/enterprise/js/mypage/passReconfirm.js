"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devPassReconfirmObj = {
    initLang: function () {
        //-----load language
        common.lang.load('passReconfirm.common.validation.userRevalidatePassword.notMatach', "비밀번호가 불일치 합니다.");
    },
    initForm: function () {
        //-----set input format
        common.inputFormat.set($('#devUserPassword'), {'maxLength': 20});
        //-----set validation
        common.validation.set($('#devUserPassword'), {'required': true});

        common.form.init(

                $('#devRevalidatePasswordForm'),
                common.util.getControllerUrl('validatePassword', 'member'),
                function (formObj) {
                    console.log(formObj);
                    return common.validation.check(formObj, 'alert', false);
                },
                function (res) {
                    // PC 처리 로직
                    if (res.result == 'noReconfirmType') {
                        history.back();
                    } else if (res.result == 'success') {
                        window.location.href = '/mypage/' + res.data;
                    } else {
                        common.noti.alert(common.lang.get("passReconfirm.common.validation.userRevalidatePassword.notMatach"));
                    }
                }
        );
    },
    run: function() {
        this.initLang();
        this.initForm();
    }
};

$(function(){
    devPassReconfirmObj.run();
});
