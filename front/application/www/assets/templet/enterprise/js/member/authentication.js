"use strict";
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var authenticationObj = {
    //-----사업자 인증
    authCancel: function () {
        return document.location.href = '/';
    },
    certify: 'basic',
    useCertify: $('#devUseCertify').val(),
    useSso: $('#devUseSso').val(),
    comform: $('#devCompanyForm'),
    form: $('#devForm'),
    getCompanyNumber: function () {
        return $('#devComNumber1').val() + $('#devComNumber2').val() + $('#devComNumber3').val();
    },
    initLang: function () {
        common.lang.load('authentication.cancel.confirm', "회원 가입을 취소하시겠습니까?"); //Confirm_01
        common.lang.load('authentication.company.doubleCompanyNumber', "이미 가입된 사업자입니다."); //Alert_09
        common.lang.load('authentication.company.success', "인증되었습니다."); //Alert_10
        common.lang.load('authentication.certi.alreadyJoin', "{name} 고객님께서는 {id}으로 이미 가입하신 회원입니다.");
        common.lang.load('authentication.required.message', "필수 약관에 모두 동의 후 가입 진행이 가능합니다."); //Alert_03
        common.lang.load('authentication.marketing.denial', "{mallName}에서 발송하는 쇼핑 알림 서비스에 대한 {common.lineBreak}{{serviceName}}수신 거부 처리가 완료되었습니다.{common.lineBreak}전송자:{mallName} / 변경일 : {date}{common.lineBreak}변경내용 : 수신거부");
        common.lang.load('authentication.marketing.agree', "{mallName}에서 발송하는 쇼핑 알림 서비스에 대한 {common.lineBreak}{{serviceName}}수신 동의 처리가 완료되었습니다.{common.lineBreak}전송자:{mallName} / 변경일 : {date}{common.lineBreak}변경내용 : 수신동의");
        common.lang.load('authentication.certi.alert', "인증을 진행해주시기 바랍니다.");
    },
    initFormat: function () {
        common.inputFormat.set($('#devComName'), {'maxLength': 30});
        common.inputFormat.set($('#devComNumber1'), {'number': true, 'maxLength': 3});
        common.inputFormat.set($('#devComNumber2'), {'number': true, 'maxLength': 2});
        common.inputFormat.set($('#devComNumber3'), {'number': true, 'maxLength': 5});
    },
    initValidation: function () {
        var self = authenticationObj;
        common.validation.set($('#devComName'), {'required': true});
        common.validation.set($('#devName'), {'required': true});
        common.validation.set($('#devComNumber1,#devComNumber2,#devComNumber3'), {
            'required': true,
            'dataFormat': 'companyNumber',
            'getValueFunction': 'authenticationObj.getCompanyNumber'
        });
        if(self.useCertify == 'Y' || self.useSso == 'Y'){
            common.validation.set($('#devCerti'), {
                'required': true,
                'requiredMessageTag': "authentication.certi.alert"
            });
        }
    },
    beforeCallback: function ($form) {
        // return common.validation.check($form);
        var ckResult = common.validation.check($form, 'alert', false);
        if (ckResult) {
            var chkRadio = true;
            $('.devRequired').each(function (idx, item) {
                if($(this).is(":checked") == false){
                    common.noti.alert(common.lang.get("authentication.required.message"));
                    chkRadio = false;
                    return false;
                }
            });
            if(chkRadio == false){
                return false;
            }

            var date = new Date();
            var currentYear = date.getFullYear();
            var currentMonth = date.getMonth();
            var currentDate = date.getDate();
            if (parseInt(currentMonth + 1) < 10) {
                currentMonth = '0' + (currentMonth + 1).toString();
            }
            if (parseInt(currentDate) < 10) {
                currentDate = '0' + (date.getDate()).toString();
            }

            date = currentYear + "-" + currentMonth + "-" + currentDate;

            var replaceObj = {'mallName': $('#devMallName').val(), 'date': date};
            if (!$('#seller-agree-term1').is(':checked') && !$('#seller-agree-term12').is(':checked')) {
                if (!$('#devAgreeterm6').is(':checked') && !$('#devAgreeterm7').is(':checked')) {
                    replaceObj['serviceName'] = 'SMS/이메일';
                    common.noti.alert(common.lang.get('authentication.marketing.denial', replaceObj));
                } else if (!$('#devAgreeterm6').is(':checked')) {
                    replaceObj['serviceName'] = 'SMS';
                    common.noti.alert(common.lang.get('authentication.marketing.denial', replaceObj));
                } else if (!$('#devAgreeterm7').is(':checked')) {
                    replaceObj['serviceName'] = '이메일';
                    common.noti.alert(common.lang.get('authentication.marketing.denial', replaceObj));
                } else {
                    replaceObj['serviceName'] = 'SMS/이메일';
                    common.noti.alert(common.lang.get('authentication.marketing.agree', replaceObj));
                }
            }
        }
        return ckResult;
    },
    initForm: function () {
        var self  = authenticationObj;

        //약관동의
        common.form.init(self.form,
            common.util.getControllerUrl('joinAgreePolicy', 'member'),self.beforeCallback,
            function (response) {
                var self = authenticationObj;
                if (response.result == "success") {
                    if(self.useCertify == 'Y' || self.useSso == 'Y'){
                        common.noti.alert(common.lang.get('authentication.company.success'),
                            function () {
                                document.location.href = '/member/joinInput';
                            });
                    }else{
                        document.location.href = '/member/joinInput';
                    }
                } else if (response.result == "doubleCompanyNumber") {
                    common.noti.alert(common.lang.get('authentication.company.doubleCompanyNumber'));
                } else {
                    common.noti.alert('system error');
                }
            });


        //사업자 인증
        common.form.init(self.comform,
            common.util.getControllerUrl('authenticationCompany', 'member'),
            function ($form) {
                return common.validation.check($form);
            },
            function (response) {
                var self = authenticationObj;
                if (response.result == "success") {
                    $('#devCerti').val('1');
                    common.noti.alert(common.lang.get('authentication.company.success'));
                } else if (response.result == "doubleCompanyNumber") {
                    common.noti.alert(common.lang.get('authentication.company.doubleCompanyNumber'));
                } else {
                    common.noti.alert('system error');
                }
            });
    },
    initEvent: function () {
        var self = authenticationObj;

        //-----휴대폰 인증
        $('#devCertifyButton').click(function (e) {
            e.preventDefault();
            self.certify = 'basic';
            common.certify.request('certify');
        });

        //-----통합 인증
        $('#devCertifyButton2').click(function (e) {
            e.preventDefault();
            self.certify = 'basic';
            common.certify.request('sso');
        });


        //-----아이핀 인증
        $('#devIpinButton').click(function (e) {
            e.preventDefault();
            common.certify.request('ipin');
        });

        //-----인증 성공시
        common.certify.setSuccess(function (data) {
            if (self.certify === 'basic') {
                common.ajax(common.util.getControllerUrl('searchUserByCertify', 'member'), '', "", function (response) {
                    if (response.result == "success") {
                        $('.devCertifyButtonTxt').text('이미 가입된 회원입니다');
                        if (common.noti.confirm('이미 가입된 회원입니다\n로그인페이지로 이동하시겠습니까?')) {
                            location.href = '/member/login';
                        }
                    } else {
                        $('#devCerti').val('1');
                        $('.devCertifyButton').attr('disabled', true).addClass('success');
                        $('.devCertifyButtonTxt').text('인증 완료');
                    }
                });
            }
        });

        //-----취소
        $('#devCancelButton').click(function (e) {
            common.noti.confirm(common.lang.get('authentication.cancel.confirm'),
                function () {
                    return document.location.href = '/';
                });
        });

        //-----사업자 인증
        $('#devCompanySubmitButton').click(function (e) {
            e.preventDefault();
            self.certify = 'company';
            self.comform.submit();
        });

        //-----다음
        $('#devSubmitButton').click(function (e) {
            e.preventDefault();
            self.form.submit();
        });

        // [선택] 마케팅 활용 동의 - SMS수신, 이메일 수신 체크 박스 이벤트
        $("#devAgreeterm6, #devAgreeterm7").on("change", function(){
            if ($('#devAgreeterm6').is(':checked') || $('#devAgreeterm7').is(':checked')) {
                $('#devAgreeTerm5').prop('checked', true);
            } else {
                $('#devAgreeTerm5').prop('checked', false);
            }
        });

        // [선택] 마케팅 활용 동의 체크 박스 이벤트
        $('#devAgreeTerm5').on("change", function () {
            if ($(this).is(':checked')) {
                $('#devAgreeterm6, #devAgreeterm7').prop('checked', true);
            } else {
                $('#devAgreeterm6, #devAgreeterm7').prop('checked', false);
            }
        });
    },
    run: function () {
        var self = authenticationObj;
        self.initLang();
        self.initFormat();
        self.initValidation();
        self.initForm();
        self.initEvent();
    }
};

$(function () {
    authenticationObj.run();
});