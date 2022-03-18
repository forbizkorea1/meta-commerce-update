"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
$('ul.tabs li').click(function(){
    var tab_id = $(this).attr('data-tab');

    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');

    $(this).addClass('current');
    $("#"+tab_id).addClass('current');
})
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var searchIdObj = {
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
    comBeforeCallback: function ($form) {
        return common.validation.check($form);
    },
    comSuccessCallback: function (response) {
        if (response.result == "success") {
            return location.href = '/member/searchIdResult';
        } else if (response.result == "noSearchCompany") {
            common.noti.alert(common.lang.get('searchId.company.noSearch'));
        } else {
            common.noti.alert('system error');
        }
    },
    userSuccessCallback: function (response) {
        if (response.result == "success") {
            return location.href = '/member/searchIdResult';
        } else if (response.result == "noSearchUser") {
            common.noti.alert(common.lang.get('searchId.user.noSearch'));
        } else if (response.result == "noMatchData") {
            common.noti.alert(common.lang.get('searchId.user.noMatch'));
        } else {
            common.noti.alert('system error');
        }
    },
    init: function () {
        var self = this;
        //-----load language
        common.lang.load('searchId.user.noSearch', '회원가입 이력이 존재하지 않는 정보입니다.'); //Alert_88
        common.lang.load('searchId.user.noMatch', '이름이 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.');
        common.lang.load('searchId.company.noSearch', '사업자 정보가 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.'); //Alert_12
        common.lang.load('searchId.company.invalidBizNum', '유효한 사업자 정보가 아닙니다.');

        //-----set input format
        common.inputFormat.set($('#devComName'), {'maxLength': 30});
        common.inputFormat.set($('#devComCeo'), {'maxLength': 30});
        common.inputFormat.set($('#devComNumber1'), {'number': true, 'maxLength': 3});
        common.inputFormat.set($('#devComNumber2'), {'number': true, 'maxLength': 2});
        common.inputFormat.set($('#devComNumber3'), {'number': true, 'maxLength': 5});

        //-----set validation
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
    initEvent: function () {
        var self = this;
        //-----본인 인증
        $('#devCertifyButton').click(function (e) {
            e.preventDefault();
            common.certify.request('certify');
        });

        //-----본인 인증
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
        var $comform = $('#devCompanyForm');
        var comUrl = common.util.getControllerUrl('searchCompany', 'member');
        common.form.init($comform, comUrl, self.comBeforeCallback, self.comSuccessCallback);
        $('#devCompanySubmitButton').click(function (e) {
            e.preventDefault();
            $comform.submit();
        });

        //-----미인증 회원
        var $userform = $('#devUserForm');
        var userUrl = common.util.getControllerUrl('searchUserByMail', 'member');
        common.form.init($userform, userUrl, self.comBeforeCallback, self.userSuccessCallback);
        $('#devUserSubmitButton').click(function (e) {
            e.preventDefault();
            $userform.submit();
        });
    },
    run: function () {
        var self = this;
        self.init();
        self.initEvent();
    }
}

$(function () {
    searchIdObj.run();
});