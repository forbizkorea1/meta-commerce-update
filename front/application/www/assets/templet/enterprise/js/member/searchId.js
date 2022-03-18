"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/

var searchIdObj = {
    comform: $('#devCompanyForm'),
    userform: $('#devUserForm'),
    initLang: function () {
        common.lang.load('searchId.user.noSearch', '회원가입 이력이 존재하지 않는 정보입니다.'); //Alert_88
        common.lang.load('searchId.user.noMatch', '이름이 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.');
        common.lang.load('searchId.company.noSearch', '사업자 정보가 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.'); //Alert_12
        common.lang.load('searchId.company.invalidBizNum', '유효한 사업자 정보가 아닙니다.');
    },
    initFormat: function () {
        common.inputFormat.set($('#devComName'), {'maxLength': 30});
        common.inputFormat.set($('#devComCeo'), {'maxLength': 30});
        common.inputFormat.set($('#devComNumber1'), {'number': true, 'maxLength': 3});
        common.inputFormat.set($('#devComNumber2'), {'number': true, 'maxLength': 2});
        common.inputFormat.set($('#devComNumber3'), {'number': true, 'maxLength': 5});
    },
    initValidation: function () {
        common.validation.set($('#devUserName'), {'required': true});
        common.validation.set($('#devUserMail'), {'required': true});
        common.validation.set($('#devComName'), {'required': true});
        common.validation.set($('#devComCeo'), {'required': true});
        common.validation.set($('#devComNumber1,#devComNumber2,#devComNumber3'), {
            'required': true,
            'dataFormat': 'companyNumber',
            'getValueFunction': 'searchIdObj.getCompanyNumber'
        });
    },
    getCompanyNumber: function () {
        return $('#devComNumber1').val() + $('#devComNumber2').val() + $('#devComNumber3').val();
    },
    searchUserByCertifyResponse: function (response) {
        if (response.result == "success") {
            return location.href = '/member/searchIdResult';
        } else if (response.result == "noSearchUser") {
            common.noti.alert(common.lang.get('searchId.user.noSearch'));
        } else {
            common.noti.alert(common.lang.get('searchId.company.invalidBizNum'));
        }
    },
    initForm: function () {
        var self = searchIdObj;

        common.form.init(self.comform,
            common.util.getControllerUrl('searchCompany', 'member'),
            function ($form) {
                return common.validation.check($form);
            },
            function (response) {
                if (response.result == "success") {
                    return location.href = '/member/searchIdResult';
                } else if (response.result == "noSearchCompany") {
                    common.noti.alert(common.lang.get('searchId.company.noSearch'));
                } else {
                    common.noti.alert('system error');
                }
            });

        common.form.init(self.userform,
            common.util.getControllerUrl('searchUserByMail', 'member'),
            function ($form) {
                return common.validation.check($form);
            },
            function (response) {
                if (response.result == "success") {
                    return location.href = '/member/searchIdResult';
                } else if (response.result == "noSearchUser") {
                    common.noti.alert(common.lang.get('searchId.user.noSearch'));
                } else if (response.result == "noMatchData") {
                    common.noti.alert(common.lang.get('searchId.user.noMatch'));
                } else {
                    common.noti.alert('system error');
                }
            });
    },
    initEvent: function () {
        var self = searchIdObj;

        //-----휴대폰 인증
        $('#devCertifyButton').click(function (e) {
            e.preventDefault();
            common.certify.request('certify');
        });

        //-----통합 인증
        $('#devCertifyButton2').click(function (e) {
            e.preventDefault();
            common.certify.request('sso');
        });

        //-----아이핀 인증
        $('#devIpinButton').click(function (e) {
            e.preventDefault();
            common.certify.request('ipin');
        });

        //-----인증 성공시
        common.certify.setSuccess(function (data) {
            common.ajax(common.util.getControllerUrl('searchUserByCertify', 'member'), '', '', self.searchUserByCertifyResponse);
        });

        //-----사업자 인증
        $('#devCompanySubmitButton').click(function (e) {
            e.preventDefault();
            self.comform.submit();
        });

        $('#devUserSubmitButton').click(function (e) {
            e.preventDefault();
            self.userform.submit();
        });
    },
    run: function () {
        var self = searchIdObj;

        self.initLang();
        self.initFormat();
        self.initValidation();
        self.initForm();
        self.initEvent();
    }
};

$(function () {
    searchIdObj.run();
});