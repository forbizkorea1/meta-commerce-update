"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var searchPwObj = {
    certify: 'basic',
    form: $('#devBasicForm'), //일반인증
    comform: $('#devCompanyForm'), //사업자인증
    initLang: function () {
        common.lang.load('searchPw.user.noSearch', '회원가입 이력이 존재하지 않는 정보입니다.'); //Alert_88
        common.lang.load('searchPw.user.noMatchData', '아이디 혹은 이름이 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.'); //Alert_13
        common.lang.load('searchPw.company.noSearch', '회원가입 시 입력한 담당자 본인명의의 휴대폰을 통해서만 인증이 가능합니다.'); //Alert_78
        common.lang.load('searchPw.company.noMatchData', '아이디 혹은 사업자 정보가 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.'); //Alert_78
    },
    initFormat: function () {
        common.inputFormat.set($('#devUserId,#devUserName,#devCompanyUserId'), {'maxLength': 20});
        common.inputFormat.set($('#devComName'), {'maxLength': 30});
        common.inputFormat.set($('#devComNumber1'), {'number': true, 'maxLength': 3});
        common.inputFormat.set($('#devComNumber2'), {'number': true, 'maxLength': 2});
        common.inputFormat.set($('#devComNumber3'), {'number': true, 'maxLength': 5});
    },
    initValidation: function () {
        common.validation.set($('#devUserId,#devCompanyUserId'), {'required': true, 'dataFormat': 'userId'});
        common.validation.set($('#devUserName'), {'required': true});
        common.validation.set($('#devUserMail'), {'required': true});
        common.validation.set($('#devComName'), {'required': true});
        common.validation.set($('#devComNumber1,#devComNumber2,#devComNumber3'), {
            'required': true,
            'dataFormat': 'companyNumber',
            'getValueFunction': 'searchPwObj.getCompanyNumber'
        });
    },
    getCompanyNumber: function () {
        return $('#devComNumber1').val() + $('#devComNumber2').val() + $('#devComNumber3').val();
    },
    initForm: function () {
        var self = searchPwObj;

        //-----공통 인증 성공
        common.certify.setSuccess(function (data) {
            if (self.certify == 'basic') {
                self.form.submit();
            } else if (self.certify == 'company') {
                self.comform.submit();
            }
        });

        //-----일반 회원
        common.form.init(self.form,
            common.util.getControllerUrl('searchUserByCertifyAndUserData', 'member'), '',
            function (response) {
                if (response.result == "success") {
                    return location.href = '/member/password';
                } else if (response.result == "noSearchUser") {
                    common.noti.alert(common.lang.get('searchPw.user.noSearch'));
                } else if (response.result == "noMatchData") {
                    common.noti.alert(common.lang.get('searchPw.user.noMatchData'));
                } else {
                    common.noti.alert("system error");
                }
            });

        //-----사업자 인증
        common.form.init(self.comform,
            common.util.getControllerUrl('searchCompanyByCertifyAndCompanyData', 'member'),
            function ($comform) {
                return common.validation.check($comform);
            },
            function (response) {
                if (response.result == "success") {
                    return location.href = '/member/password';
                } else if (response.result == "noSearchUser") {
                    common.noti.alert(common.lang.get('searchpw.company.noSearch'));
                } else if (response.result == "noMatchData") {
                    common.noti.alert(common.lang.get('searchPw.company.noMatchData'));
                } else {
                    common.noti.alert('system error');
                }
            });
    },
    initEvent: function () {
        var self = searchPwObj;

        //본인 인증
        $('#devCertifyButton').click(function (e) {
            e.preventDefault();
            if (common.validation.check(self.form)) {
                self.certify = 'basic';
                common.certify.request('certify');
            }
        });

        //미인증
        $('#devSearchPwButton').click(function (e) {
            e.preventDefault();
            if (common.validation.check(self.form)) {
                self.form.submit();
            }
        });

        //아이핀 인증
        $('#devIpinButton').click(function (e) {
            e.preventDefault();
            if (common.validation.check(self.form)) {
                self.certify = 'basic';
                common.certify.request('ipin');
            }
        });

        //사업자 본인 인증
        $('#devCompanyCertifyButton').click(function (e) {
            e.preventDefault();
            if (common.validation.check(self.comform)) {
                self.certify = 'company';
                common.certify.request('certify');
            }
        });
        
        //-----통합 인증
        $('#devCertifyButton2').click(function (e) {
            e.preventDefault();
            if (common.validation.check(self.form)) {
                self.certify = 'basic';
                common.certify.request('sso');
            }
        });
    },
    run: function () {
        var self = searchPwObj;

        self.initLang();
        self.initFormat();
        self.initValidation();
        self.initForm();
        self.initEvent();
    }
};

$(function () {
    searchPwObj.run();
});