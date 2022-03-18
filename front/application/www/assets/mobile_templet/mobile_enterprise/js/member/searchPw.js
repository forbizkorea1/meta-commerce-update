"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
$('ul.tabs2 li').click(function(){
    var tab_id = $(this).attr('data-tab');

    $('ul.tabs2 li').removeClass('current');
    $('.tab-content2').removeClass('current');

    $(this).addClass('current');
    $("#"+tab_id).addClass('current');
})
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var searchPwObj = {
    getCompanyNumber: function () {
        return $('#devComNumber1').val() + $('#devComNumber2').val() + $('#devComNumber3').val();
    },
    certify: 'basic',
    successCallback: function (response) {
        if (response.result == "success") {
            return location.href = '/member/password';
        } else if (response.result == "noSearchUser") {
            common.noti.alert(common.lang.get('searchPw.user.noSearch'));
        } else if (response.result == "noMatchData") {
            common.noti.alert(common.lang.get('searchPw.user.noMatchData'));
        } else {
            common.noti.alert("system error");
        }
    },
    init: function () {
        var self = this;
        //-----load language
        common.lang.load('searchPw.user.noSearch', '회원가입 이력이 존재하지 않는 정보입니다.'); //Alert_88
        common.lang.load('searchPw.user.noMatchData', '아이디 혹은 이름이 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.'); //Alert_13
        common.lang.load('searchPw.company.noSearch', '회원가입 시 입력한 담당자 본인명의의 휴대폰을 통해서만 인증이 가능합니다.'); //Alert_78
        common.lang.load('searchPw.company.noMatchData', '아이디 혹은 사업자 정보가 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.'); //Alert_78

        //-----set input format
        common.inputFormat.set($('#devUserId,#devUserName,#devCompanyUserId'), {'maxLength': 20});
        common.inputFormat.set($('#devComName'), {'maxLength': 30});
        common.inputFormat.set($('#devComNumber1'), {'number': true, 'maxLength': 3});
        common.inputFormat.set($('#devComNumber2'), {'number': true, 'maxLength': 2});
        common.inputFormat.set($('#devComNumber3'), {'number': true, 'maxLength': 5});

        //-----set validation
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
    checkBasicValidation: function ($form) {
        return common.validation.check($form);
    },
    comBeforeCallback: function ($comform) {
        return common.validation.check($comform);
    },
    comSuccessCallback: function (response) {
        if (response.result == "success") {
            return location.href = '/member/password';
        } else if (response.result == "noSearchUser") {
            common.noti.alert(common.lang.get('searchpw.company.noSearch'));
        } else if (response.result == "noMatchData") {
            common.noti.alert(common.lang.get('searchPw.company.noMatchData'));
        } else {
            common.noti.alert('system error');
        }
    },
    initEvent: function () {
        var self = this;
        var $form = $('#devBasicForm'); //일반인증
        var $comform = $('#devCompanyForm'); //사업자인증
        var url = common.util.getControllerUrl('searchUserByCertifyAndUserData', 'member');
        var comUrl = common.util.getControllerUrl('searchCompanyByCertifyAndCompanyData', 'member');

        //-----공통 인증 성공        
        common.certify.setSuccess(function (data) {
            if (self.certify == 'basic') {
                $form.submit();
            } else if (self.certify == 'company') {
                $comform.submit();
            }
        });

        //-----일반 회원
        common.form.init($form, url, '', self.successCallback);
        //휴대폰 인증
        $('#devCertifyButton').click(function (e) {
            e.preventDefault();
            if (self.checkBasicValidation($form)) {
                self.certify = 'basic';
                common.certify.request('certify');
            }
        });

        //-----미인증
        $('#devSearchPwButton').click(function (e) {
            e.preventDefault();
            if (self.checkBasicValidation($form)) {
                $form.submit();
            }
        });
        
        //통합 인증
        $('#devCertifyButton2').click(function (e) {
            e.preventDefault();
            if (self.checkBasicValidation($form)) {
                self.certify = 'basic';
                common.certify.request('sso');
            }
        });

        //아이핀 인증
        $('#devIpinButton').click(function (e) {
            e.preventDefault();
            if (self.checkBasicValidation($form)) {
                self.certify = 'basic';
                common.certify.request('ipin');
            }
        });

        //-----사업자 인증
        common.form.init($comform, comUrl, self.comBeforeCallback($comform), self.comSuccessCallback);
        //본인 인증
        $('#devCompanyCertifyButton').click(function (e) {
            e.preventDefault();
            if (common.validation.check($comform)) {
                self.certify = 'company';
                common.certify.request('certify');
            }
        });
    },
    run: function () {
        var self = this;
        self.init();
        self.initEvent();
    }
}

$(function () {
    searchPwObj.run();
});