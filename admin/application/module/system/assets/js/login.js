"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devLoginObj = {
    loginForm: $('#devLoginFrm'),
    useCapcha: false,
    initEvent: function () {
        var self = devLoginObj;
        $('#devLoginBtn').on('click', function () {
            self.loginForm.submit();
        });

        $('#devSecondLoginSubmit').on('click', function () {
            $('#devCertifyFrm').submit();
        });

        $("#devUserId, #devUserPassword").focus(function () {
            $(this).css("border-color", "#5d5d5d");
        });

        $("#devUserId, #devUserPassword").blur(function () {
            $(this).css("border-color", "#bdbdbd");
        });

        $('#devUserPassword').on('keydown', function (e) {
            if (e.which == 13) {
                self.loginForm.submit();
            }
        });
        $('#devCapchaReload').on('click', function () {
            self.capchaReload();
        });

        $('#devSearchIdPw').on('click', self.findInfoModal);

        $(document).on('click','#devSearchIdPwModal', self.findIdPwModal);

        $('#devSecondLogin').one('focusin', function(){
            var waitTime = 2 * 60 * 1000;
            var secondLoginTime = setTimeout(function (){
               common.noti.alert(common.lang.get("secondLogin.timeOut"));
               clearTimeout(secondLoginTime);
                history.back();
           }, waitTime)

        });


    },
    findInfoModalTpl: false,
    findInfoModal: function() {
        var self = devLoginObj;
        if(self.findInfoModalTpl === false) {
            self.findInfoModalTpl = common.util.getHtml('#devIdPwInfoModalTpl');
        }
        common.util.modal.open(
            'html',
            '위저드 가입 ID/PW 찾기 안내',
            self.findInfoModalTpl,
            '',
            '',
            {width: '600px', height: '302px'}
        );
    },
    findIdPwModalTpl: false,
    findIdPwModal: function() {
        var self = devLoginObj;
        if(self.findIdPwModalTpl === false) {
            self.findIdPwModalTpl = common.util.getHtml('#devIdPwModalTpl');
        }
        $('.fb-modal__close').click();

        common.util.modal.open(
            'html',
            '위저드 가입 ID/PW 찾기',
            self.findIdPwModalTpl,
            '',
            self.initFindTab,
            {width: '600px', height: '400px'}
        );

        common.validation.set($('#devComName'), {'required': true});
        common.validation.set($('#devMasterId'), {'required': false});
        common.validation.set($('.devPcsCls'), {'required': true});
        common.validation.set($('.devComNumCls'), {'required': true});
        self.initSizeLimit();
    },

    findIdPw: function() {
        common.ajax(
            common.util.getControllerUrl('getIdPw', 'login', 'system'),
            {
                findType: $('#devFindType').val(),
                com_name: $('#devComName').val(),
                id: $('#devMasterId').val(),
                pcs_1: $('#devPcs1').val(),
                pcs_2: $('#devPcs2').val(),
                pcs_3: $('#devPcs3').val(),
                com_number_1: $('#devComNum1').val(),
                com_number_2: $('#devComNum2').val(),
                com_number_3: $('#devComNum3').val()
            },
            function() {
                return common.validation.check($('#devFindIdPwForm'), 'alert', false);
            },
            function(response) {
                console.log(response);
                if (response.result == "success") {
                    devLoginObj.findIdPwSuccessModal(response);
                } else {
                    common.noti.alert(common.lang.get("searchIdPw.fail"));
                }
            }
        );
    },
    findIdPwSuccessModalTpl: false,
    findIdPwSuccessModal: function (response){
        var self = devLoginObj;
        if(self.findIdPwSuccessModalTpl === false) {
            self.findIdPwSuccessModalTpl = common.util.getHtml('#devIdPwSuccessModalTpl');
        }
        $('.fb-modal__close').click();
        common.util.modal.open(
            'html',
            '위저드 가입 ID/PW 찾기',
            self.findIdPwSuccessModalTpl,
            '',
            function (){
                if (response.data['searchType'] == 'id') {
                    $('#devSearchType').text('ID');
                    $('#devSearchValue').text(response.data['id']);
                    $('#devJoinDate').text(response.data['date']);
                } else {
                    $('#devSearchType').text('PW');
                    $('#devSearchValue').text(response.data['pw']);
                    $('#devJoinDate').text(response.data['date']);
                }

                $('#devSuccessIdPw').on('click', function () {
                    $('.fb-modal__close').trigger('click');
                });
            },

            {width: '600px', height: '400px'}
        );
    },


    capchaReload: function(){
        //(url, data, beforeCallback, successCallback, dataType, async)
        common.ajax(
            common.util.getControllerUrl('getCapcha', 'login', 'system'),
            {},
            '',
            function (response) {
                $('#devCapchaImg').empty().html(response.data.capcha_img);
            }
        );
    },
    initFindTab: function() {
        var self = devLoginObj;

        $('.fb__tap__menu a').on('click', function(){
            var $this = $(this);
            var $thisId = $this.attr('id');
            $this.addClass('fb__tap__menu--active').parent().siblings().find('a').removeClass('fb__tap__menu--active');
            if ($thisId === 'devTabSearchId') {
                $('tr.search-id').css('display','');
                $('tr.search-pw').css('display','none');
                $('#devFindType').val('id');
                common.validation.set($('#devComName'), {'required': true});
                common.validation.set($('#devMasterId'), {'required': false});
            } else if ($thisId === 'devTabSearchPw') {
                $('tr.search-pw').css('display','');
                $('tr.search-id').css('display','none');
                $('#devFindType').val('pw');
                common.validation.set($('#devComName'), {'required': false});
                common.validation.set($('#devMasterId'), {'required': true});
            }
        });

        $('#devFindIdPwBtn').on('click', self.findIdPw);
    },
    initSizeLimit: function () {
        $("[name=pcs_1]").attr("maxlength", 3);
        $("[name=pcs_2]").attr("maxlength", 4);
        $("[name=pcs_3]").attr("maxlength", 4);

        $("#devComNum1").attr("maxlength", 3);
        $("#devComNum2").attr("maxlength", 2);
        $("#devComNum3").attr("maxlength", 5);

    },
    init: function () {
        var self = this;

        // 메시지
        common.lang.load('login.fail', "아이디 혹은 비밀번호 정보가 일치하지 않습니다.{common.lineBreak}다시 입력해 주세요.");
        common.lang.load('login.standby', "관리자 승인중입니다.{common.lineBreak}관리자 승인이 지연될경우 고객센터로 문의 주시기 바랍니다.");
        common.lang.load('login.reject', "관리자 승인이 거부되었습니다.{common.lineBreak}고객센터로 문의 주시기 바랍니다.");
        common.lang.load('login.captcha', "추가문자를 정확히 입력하여 주십시오.");

        common.lang.load('searchIdPw.fail', "일치하는 정보가 없습니다.");

        common.lang.load('secondLogin.fail', "2차 인증 코드가 잘못 되었습니다.");
        common.lang.load('secondLogin.timeOut', "인증코드 유효 시간이 만료되었습니다. 다시 로그인 해주세요.");

        common.lang.load('secondLogin.sendSms', "{devChargerId}에 등록된 휴대폰으로 SMS를 발송했습니다.\n인증코드를 정확히 입력해 주세요.");


        // 폼 검증
        common.validation.set($('#devUserId'), {'required': true});
        common.validation.set($('#devUserPassword'), {'required': true});


        common.form.init(
                self.loginForm,
                common.util.getControllerUrl('getVerify', 'login', 'system'),
                function (formData, $form) {
                    return common.validation.check($form, 'alert', false);
                },
                function (response) {
                    if (response.result == "success") {
                        location.href = response.data.url;
                    } else if (response.result == "standby") {
                        common.noti.alert(common.lang.get("login.standby"));
                    } else if (response.result == "reject") {
                        common.noti.alert(common.lang.get("login.reject"));
                    } else if (response.result == "captcha" || response.result == "notMatch") {
                        if (self.useCapcha == false) {
                            self.useCapcha = true;
                            common.validation.set($('#devCaptchaText'), {'required': true});
                        }
                        $('#devCapchaImg').empty().html(response.data.capcha_img);

                        $('#devCapchaBox').show();
                        $('#devCaptchaText').val('').focus();

                        if (response.result == "captcha") {
                            common.noti.alert(common.lang.get("login.fail"));
                        } else {
                            common.noti.alert(common.lang.get("login.captcha"));
                        }
                    } else {
                        common.noti.alert(common.lang.get("login.fail"));
                    }
                });

        // 2차인증 검증
        common.validation.set($('#devSecondLogin'), {'required': true});

        common.form.init(
            $('#devCertifyFrm'),
            common.util.getControllerUrl('getVerifyAuth', 'login', 'system'),
            function (formData, $form) {
                return common.validation.check($form, 'alert', false);
            },
            function (response) {
                if (response.result == 'success') {
                    location.replace(response.data.url);
                } else if (response.result == 'fail') {
                    common.noti.alert(response.data.msg);
                } else if (response.result == 'certifyExpire') {
                    common.noti.alert(response.data.msg);
                    location.replace('/system/login');
                }
            });

        if (typeof devChargerId !== 'undefined' && devChargerId != '') {
            common.noti.alert(common.lang.get('secondLogin.sendSms', {devChargerId : devChargerId}));
            $('#devSecondLogin').focus();
        }
    },
    run: function () {
        this.init();
        this.initEvent();
    }
}

$(function () {
    devLoginObj.run();
});