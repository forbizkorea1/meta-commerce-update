"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
var $document = $(document);

$document.on("click", ".terms__marketing__accd", function(e) {
    var $this = $(this);

    if (!$this.hasClass("on")) {
        $this.addClass("on");
        $(".terms__marketing__cont").addClass("show");
    }
    else {
        $this.removeClass("on");
        $(".terms__marketing__cont").removeClass("show");
    }

    e.preventDefault();
});

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProfileObj = {
    initLang: function () {
        //-----load language
        common.lang.load('profile.common.validation.email.doubleCheck', "이메일 중복 확인을 해주세요.");
        common.lang.load('profile.common.validation.email.success', "사용 가능한 이메일입니다.");
        common.lang.load('profile.common.validation.email.fail', "이미 사용중인 이메일입니다.");
        common.lang.load('profile.common.validation.email.wrong', "잘못된 이메일 형식입니다.");
        common.lang.load('profile.common.policy.agree', "마케팅 활용에 대한 수신이 동의 처리 되었습니다.{common.lineBreak} 선택채널:{recvType}");
        common.lang.load('profile.common.policy.notAgree', "마케팅 활용에 대한 수신이 거부 처리 되었습니다.");
        common.lang.load('profile.common.modify.save.confirm', "회원정보를 저장하시겠습니까?");
        common.lang.load('profile.common.modify.save.success', "회원정보가 정상적으로 저장되었습니다.");
        common.lang.load('profile.common.modify.cancel.confirm', "회원정보 수정을 취소하시겠습니까?");
        common.lang.load('profile.modal.validation.passwd.change', "비밀번호를 변경하시겠습니까?");
        common.lang.load('profile.modal.validation.passwd.change.success', "비밀번호가 정상적으로 변경되었습니다.");
        common.lang.load('profile.modal.validation.password.fail', "영문 대소문자, 숫자, 특수문자 중 3개 이상을 조합하여 8자리 이상 입력해 주세요.");
        common.lang.load('profile.modal.validation.password.success', "사용 가능한 비밀번호 입니다.");
        common.lang.load('profile.modal.validation.password.fail.alreadyUsePw', "동일한 비밀번호는 사용하실 수 없습니다.");
        common.lang.load('profile.common.sns.disconnect.success', "SNS계정을 정상적으로 연동해제했습니다.");
        common.lang.load('profile.company.file.confirm.delete', "파일을 삭제하시겠습니까?");
        common.lang.load('profile.company.file.find', "파일찾기");
        common.lang.load('profile.company.file.change', "파일변경");
    },
    initValidation: function () {
        //-----set validation
        common.validation.set($('#devEmail'), {
            'required': true,
            'dataFormat': 'email',
            'getValueFunction': 'devProfileObj.basic.getEmail'
        });
        common.validation.set($('#devPcs2,#devPcs3'), {'required': true});
        common.validation.set($('#devComEmail'), {
            'required': true,
            'dataFormat': 'email',
            'getValueFunction': 'devProfileObj.company.getEmail'
        });
        common.validation.set($('#devComTel2,#devComTel3,#devComZip,#devComAddress1,#devComAddress2'), {'required': true});
        common.validation.set($('#devComEmail#devComPcs2,#devComPcs3,#devName'), {'required': true});
    },
    basic: {
        pcs1:false,
        pcs2:false,
        pcs3:false,
        di:false,
        ci:false,
        name:false,
        sexDiv:false,
        birth:false,
        //이메일 중복 버튼
        emailDoubleCheckButton: $('#devEmailDoubleCheckButton'),
        //이메일 정규식 규칙 플레그
        isEmailRegExp: true,
        //이메일 중복 체크 플레그
        isEmailDoubleCheck: true,
        getEmail: function () {
            return $('#devEmail').val().trim();
        },
        checkEmail: function () {
            this.isEmailRegExp = false;
            this.isEmailDoubleCheck = false;

            this.emailDoubleCheckButton.attr('disabled', false);

            var result = common.validation.checkElement($('#devEmail').get(0));
            if (result.success) {
                this.isEmailRegExp = true;
                common.noti.tailMsg('devEmail', common.lang.get("profile.common.validation.email.doubleCheck"));
            } else {
                common.noti.tailMsg('devEmail', result.message);
            }
        },
        emailDoubleCheckResponse: function (response) {
            var self = devProfileObj.basic;

            if (response.result == "success") {
                self.isEmailDoubleCheck = true;
                self.emailDoubleCheckButton.attr('disabled', true);
                common.noti.tailMsg('devEmail', common.lang.get("profile.common.validation.email.success"), 'success');
            } else if (response.result == "fail") {
                common.noti.tailMsg('devEmail', common.lang.get("profile.common.validation.email.fail"));
            } else {
                common.noti.tailMsg('devEmail', common.lang.get("profile.common.validation.email.wrong"));
            }
        },
        zipResponse: function (response) {
            $('#devZip').val(response.zipcode);
            $('#devAddress1').val(response.address1);
            $('#devAddress2').val('');
        },
        formInit: function () {
            var self = this;

            // 일반 회원정보 수정폼
            common.form.init(
                $('#devMemberProfileForm'), // Form
                common.util.getControllerUrl('modifyProfile', 'member'), // Controller name
                function (formObj, data) {
                    var ret = false;

                    //이메일 관련 체크
                    if (self.isEmailRegExp != true || self.isEmailDoubleCheck != true) {
                        common.noti.alert(common.lang.get('profile.common.validation.email.doubleCheck'));
                        return false;
                    }

                    if(self.pcs1){
                        data.push({name:'pcs1',value:self.pcs1,type:'text',required:false});
                        data.push({name:'pcs2',value:self.pcs2,type:'text',required:false});
                        data.push({name:'pcs3',value:self.pcs3,type:'text',required:false});
                    }

                    if(self.di){
                        data.push({name:'di',value:self.di,type:'text',required:false});
                    }

                    if(self.ci){
                        data.push({name:'ci',value:self.ci,type:'text',required:false});
                    }

                    if(self.name){
                        data.push({name:'name',value:self.name,type:'text',required:false});
                    }

                    if(self.sexDiv){
                        data.push({name:'sex_div',value:self.sexDiv,type:'text',required:false});
                    }

                    if(self.birth){
                        data.push({name:'birth',value:self.birth,type:'text',required:false});
                    }

                    ret = common.validation.check(formObj, 'alert', false);

                    // Form validation
                    return ret && common.noti.confirm(common.lang.get('profile.common.modify.save.confirm'));
                },
                function (res) {
                    if (res.result == 'success') {
                        // 마케팅 동의 확인
                        devProfileObj.maketingChk();

                        location.replace('/mypage');
                    } else {
                        console.log(res);
                        //location.replace('/mypage');
                    }
                }
            );

            $("input[id^='devBusinessFile']").click(function (e) {
                console.log("click");
                
                if(devAppType == 'iOS'){
                    devMyProductReviewPopObj.getFile();
                    var check = setShowAuthority();
                    if(check.type1 == 'N' && check.type2 == 'N'){
                        return false;
                    }
                }
            });

        },
        init: function () {
            var self = this;
            var basic = devProfileObj.basic;
            var isCompanyCertify = false; //담당자 휴대폰 인증 플레그

            //-----set input format
            common.inputFormat.set($('#devPcs2,#devPcs3'), {'number': true, 'maxLength': 4});
            common.inputFormat.set($('#devTel2,#devTel3'), {'number': true, 'maxLength': 4});

            // Bind event

            //주소 찾기
            $('#devZipPopupButton').click(function (e) {
                e.preventDefault();
                common.util.zipcode.popup(self.zipResponse);
            });

            //이메일 수정 관련 이벤트
            $('#devEmail').on({
                'input': function (e) {
                    self.checkEmail();
                }
            });

            $('#devDirectInputEmailCheckBox').click(function() {
                if($(this).is(":checked") == true) {
                    $('#devEmailHost').attr('readonly', false);
                    $('#devEmailHost').val('');
                    $('#devEmailHost').show();
                    $('#devEmailHostSelect').hide();
                } else {
                    $('#devEmailHost').hide();
                    $('#devEmailHost').val($('#devEmailHostSelect').val());
                    $('#devEmailHostSelect').show();
                }
            });
            

            $('#devDirectInputComEmailCheckBox').click(function() {
                if($(this).is(":checked") == true) {
                    $('#devComEmailHost').attr('readonly', false);
                    $('#devComEmailHost').val('');
                    $('#devComEmailHost').show();
                    $('#devComEmailHostSelect').hide();
                } else {
                    $('#devComEmailHost').hide();
                    $('#devComEmailHost').val($('#devComEmailHostSelect').val());
                    $('#devComEmailHostSelect').show();
                }
            });


            $('#devEmailHostSelect').change(function (e) {
                var selectValue = $(this).val();
                var $emailHost = $('#devEmailHost');
                $emailHost.val(selectValue);
                if (selectValue != '') {
                    $emailHost.attr('readonly', true);
                } else {
                    $emailHost.attr('readonly', false);
                }
                self.checkEmail();
            });

            //이메일 중복 체크
            self.emailDoubleCheckButton.on(
                'click',
                function (e) {
                    if (self.isEmailRegExp == true) {
                        common.ajax(
                            common.util.getControllerUrl('emailCheck', 'member'),
                            {'email': self.getEmail()},
                            "",
                            self.emailDoubleCheckResponse
                        );
                    }
                }
            );

            //본인 인증
            $('#devCertifyButton').click(function () {
                basic.pcs1 = '';
                basic.pcs2 = '';
                basic.pcs3 = '';
                basic.ci = '';
                basic.di = '';
                basic.name = '';
                basic.sexDiv = '';
                basic.birth = '';

                common.certify.request('certify');
                return false;
            });

            //본인, 아이핀 인증 응답 공통
            common.certify.setSuccess(function (data) {

                common.ajax(common.util.getControllerUrl('searchUserByCertify', 'member'), {pcs : data.pcs, name : data.name}, "", function (response) {
                    if (response.result == "success") {
                        common.noti.alert('이미 가입된 회원입니다');
                        return false;
                    } else {
                        var pcs = data.pcs.split("-");
                        var birthday = data.birthday.replace(/-/gi,'');

                        basic.pcs1 = pcs[0];
                        basic.pcs2 = pcs[1];
                        basic.pcs3 = pcs[2];
                        basic.ci = data.ci;
                        basic.di = data.di;
                        basic.name = data.name;
                        basic.sexDiv = data.sexDiv;
                        basic.birth = data.birthday;

                        isCompanyCertify = true;

                        $('#devPcs1').val(pcs[0]);
                        $('#devPcs2').val(pcs[1]);
                        $('#devPcs3').val(pcs[2]);
                        $('#devFormatUserName').val(data.name);

                        if(data.sex == '남성'){
                            $('.devFromatBirthday[value="남성"]').prop('checked', true);
                        }else if(data.sex == '여성'){
                            $('.devFromatBirthday[value="여성"]').prop('checked', true);
                        }else{
                            $('.devFromatBirthday[value="기타"]').prop('checked', true);
                        }

                        $('#devFromatBirthday').val(birthday);
                        $('#devCertifyButton').remove();
                        $('.close').trigger('click');
                    }
                });
            });
        }
    },
    company: {
        //이메일 중복 버튼
        emailDoubleCheckButton: $('#devComEmailDoubleCheckButton'),
        //이메일 정규식 규칙 플레그
        isEmailRegExp: true,
        //이메일 중복 체크 플레그
        isEmailDoubleCheck: true,
        //파일업로드 관련
        businessFile: $('#devBusinessFile'),
        businessFileButton: $('#devBusinessFileButton'),
        businessFileDeleteButton: $('#devBusinessFileDeleteButton'),
        businessFileText: $('#devBusinessFileText'),
        businessFileChangeEvnet: function () {
            var self = devProfileObj.company;

            if (self.businessFile.val() != "") {
                self.businessFileText.val(self.businessFile.val());
                // self.businessFileButton.text(common.lang.get('profile.company.file.change'));
                self.businessFileDeleteButton.show();
                self.businessFile.hide();
                $("#devBusinessFileImageWrap").show();
            } else {
                self.businessFileText.val('');
                // self.businessFileButton.text(common.lang.get('profile.company.file.find'));
                self.businessFileDeleteButton.hide();
                self.businessFile.show();
                $("#devBusinessFileImageWrap").hide();
            }
        },
        getEmail: function () {
            return $('#devComEmail').val().trim();
        },
        checkEmail: function () {
            this.isEmailRegExp = false;
            this.isEmailDoubleCheck = false;

            this.emailDoubleCheckButton.attr('disabled', false);

            var result = common.validation.checkElement($('#devComEmail').get(0));
            if (result.success) {
                this.isEmailRegExp = true;
                common.noti.tailMsg('devComEmail', common.lang.get("profile.common.validation.email.doubleCheck"));
            } else {
                common.noti.tailMsg('devComEmail', result.message);
            }
        },
        emailDoubleCheckResponse: function (response) {
            var self = devProfileObj.company;

            if (response.result == "success") {
                self.isEmailDoubleCheck = true;
                self.emailDoubleCheckButton.attr('disabled', true);
                common.noti.tailMsg('devComEmail', common.lang.get("profile.common.validation.email.success"), 'success');
            } else if (response.result == "fail") {
                common.noti.tailMsg('devComEmail', common.lang.get("profile.common.validation.email.fail"));
            } else {
                common.noti.tailMsg('devComEmail', common.lang.get("profile.common.validation.email.wrong"));
            }
        },
        zipResponse: function (response) {
            $('#devComZip').val(response.zipcode);
            $('#devComAddress1').val(response.address1);
            $('#devComAddress2').val('');
        },
        formInit: function () {
            // devCompanyProfileForm
            var self = this;
            var basic = devProfileObj.basic;

            // 일반 회원정보 수정폼
            common.form.init(
                $('#devCompanyProfileForm'), // Form
                common.util.getControllerUrl('modifyProfile', 'member'), // Controller name
                function (formObj) {
                    var ret = false;

                    // 회사 이메일 관련 체크
                    if (self.isEmailRegExp != true || self.isEmailDoubleCheck != true) {
                        common.noti.alert(common.lang.get('profile.common.validation.email.doubleCheck'));
                        return false;
                    }

                    // 담당자 이메일 관련 체크
                    if (basic.isEmailRegExp != true || basic.isEmailDoubleCheck != true) {
                        common.noti.alert(common.lang.get('profile.common.validation.email.doubleCheck'));
                        return false;
                    }

                    ret = common.validation.check(formObj, 'alert', false);

                    // Form validation
                    return ret && common.noti.confirm(common.lang.get('profile.common.modify.save.confirm'));
                },
                function (res) {
                    if (res.result == 'success') {
                        // 마케팅 동의 확인
                        devProfileObj.maketingChk();
                        // mypage 이동
                        location.replace('/mypage');
                    } else {
                        console.log(res);
                        // location.replace('/mypage');
                    }
                }
            );
        },
        init: function () {
            var self = this;

            //-----set input format
            common.inputFormat.set($('#devComTel2,#devComTel3'), {'number': true, 'maxLength': 4});
            common.inputFormat.set($('#devComPcs2,#devComPcs3'), {'number': true, 'maxLength': 4});
            common.inputFormat.set($('#devBusinessFile'), {'fileFormat': 'image', 'fileSize': 30});

            // Form init
            self.formInit();

            //주소 찾기
            $('#devComZipPopupButton').click(function (e) {
                e.preventDefault();
                common.util.zipcode.popup(self.zipResponse);
            });

            //이메일 수정 관련 이벤트
            $('#devComEmail').on({
                'input': function (e) {
                    self.checkEmail();
                }
            });

            $('#devComEmailHostSelect').change(function (e) {
                var selectValue = $(this).val();
                var $emailHost = $('#devComEmailHost');
                $emailHost.val(selectValue);
                if (selectValue != '') {
                    $emailHost.attr('readonly', true);
                } else {
                    $emailHost.attr('readonly', false);
                }
                self.checkEmail();
            });

            //이메일 중복 체크
            self.emailDoubleCheckButton.on(
                'click',
                function (e) {
                    e.preventDefault();
                    if (self.isEmailRegExp == true) {
                        common.ajax(
                            common.util.getControllerUrl('companyEmailCheck', 'member'),
                            {'email': self.getEmail()},
                            "",
                            self.emailDoubleCheckResponse
                        );
                    }
                }
            );

            //사업자 등록증 파일 등록
            self.businessFileButton.click(function (e) {
                e.preventDefault();
                self.businessFile.trigger('click');
            });

            self.businessFileDeleteButton.click(function (e) {
                e.preventDefault();
                if(common.noti.confirm(common.lang.get('profile.company.file.confirm.delete'))) {
                    self.businessFile.val('');
                    self.businessFileChangeEvnet();
                };
            });

            self.businessFile.change(function (e) {
                self.businessFileChangeEvnet();
                common.util.previewFile($("#devBusinessFile"), $("#devBusinessFileImage"));
            });
        }
    },
    maketingChk: function () {
        // 수신방법
        var selectedRecv = [];
        var unSelectedRecv = [];
        var isChanged = false;
        var isAllDenine = true;
        var agreeSms = 0;
        var agreeEmail = 0;

        if ($('#devAgreeSms').is(':checked')) {
            isAllDenine = false;
            agreeSms = 1;
            selectedRecv.push($('#devAgreeSms').attr('title'));
        }else{
            unSelectedRecv.push($('#devAgreeSms').attr('title'));
        }

        if ($('#devAgreeEmail').is(':checked')) {
            selectedRecv.push($('#devAgreeEmail').attr('title'));
            isAllDenine = false;
            agreeEmail = 1;
        }else{
            unSelectedRecv.push($('#devAgreeEmail').attr('title'));
        }

        if (agreeSms != $('#devBeforeSmsValue').val()) {
            isChanged = true;
        }

        if (agreeEmail != $('#devBeforeInfoValue').val()) {
            isChanged = true;
        }

        if(isChanged){
            if(isAllDenine){
                common.noti.alert(common.lang.get('profile.common.policy.notAgree'));
            }else{
                common.noti.alert(common.lang.get('profile.common.policy.agree', {recvType: selectedRecv.join(','),unRecvType: unSelectedRecv.join(','),}));
            }
        }
    },
    initEvent: function () {
        //마케팅 활용 동의 관련
        $('#devAgreeTerm').on('click', function () {
            var isChecked = $(this).is(':checked');

            $('#devAgreeSms').prop('checked', isChecked);
            $('#devAgreeEmail').prop('checked', isChecked);
        });

        // SMS,Email checkbox Evnet
        $('#devAgreeSms,#devAgreeEmail').on('click', function () {
            var term = $('#devAgreeTerm');

            if ($('#devAgreeSms').is(':checked') || $('#devAgreeEmail').is(':checked')) {
                term.prop('checked', true);
            } else {
                term.prop('checked', false);
            }
        });

        // 비밀번호 변경창 오픈
        $('#devChangePassword').click(function () {
            common.util.modal.open('ajax', '비밀번호 변경', '/mypage/password','',function (){
                $(".fb__popup-layout").addClass("full-layer");
                // set validation
                common.validation.set($('#devPmPassword'), {'required': true, 'dataFormat': 'userPassword'});
                common.validation.set($('#devPmComparePassword'), {'required': true, 'compare': '#devPmPassword'});
            });
        });

        //비밀번호 체크
        $('#devModalContent').on('input', '#devPmPassword', function (e) {
            if (common.validation.check($(this))) {
                common.noti.tailMsg(this.id, common.lang.get('profile.modal.validation.password.success'), 'success');
            } else {
                common.noti.tailMsg(this.id, common.lang.get('profile.modal.validation.password.fail'));
            }
        });

        // 비밀번호 변경창 닫기
        $('#devModalContent').on('click', '#devPmCancel', function () {
            common.util.modal.close();
        });

        // 비밀번호 전송
        $('#devModalContent').on('click', '#devPmSubmit', function () {
            common.ajax(
                common.util.getControllerUrl('changePassword', 'member'),
                {pw: $('#devPmPassword').val(), comparePw: $('#devPmComparePassword').val()},
                function () {
                    var ret = false;

                    ret = common.validation.check($('#devPmComparePasswordForm'), 'alert', false);

                    // Form validation
                    return ret && common.noti.confirm(common.lang.get("profile.modal.validation.passwd.change"));
                },
                function (ret) {
                    if (ret.result == 'success') {
                        common.util.modal.close();
                        common.noti.alert(common.lang.get('profile.modal.validation.passwd.change.success'));
                    } else if (ret.result == 'alreadyUsePw') {
                        common.noti.alert(common.lang.get('profile.modal.validation.password.fail.alreadyUsePw'));
                    } else {
                        console.log(ret);
                    }
                }
            );
        });

        // 취소 버튼
        $('#devProfileModifyCancel').on('click', function () {
            if (common.noti.confirm(common.lang.get('profile.common.modify.cancel.confirm'))) {
                location.href = '/mypage';
            }
        });

        //sns 연결해제 버튼
        $('.devSnsDisconnectBtn').on('click',function (e) {
            e.preventDefault();
            let snsType = $(this).data('type');

            let thisObj = $(this);
            var data = {'snsType': snsType};
            common.ajax(common.util.getControllerUrl('delSnsJoinInfo', 'mypage')
                , data
                , ""
                , function () {
                    common.noti.alert(common.lang.get('profile.common.sns.disconnect.success'));
                    if(snsType == 'google'){
                        signOut();
                        $('#g-signin2').attr('data-onsuccess', 'onSignIn');
                    }
                    thisObj.attr('disabled',true);
                    thisObj.siblings('button').attr('disabled',false);
                });
        });

        $('.devSnsJoin').on('click', function (e) {
            e.preventDefault();
            var url = $(this).data('href');
            location.href = url;
            // common.util.popup(url, 600, 800);
        });

        //apple 로그인
        $('.devAppleLogin').click(function (e) {
            e.preventDefault();
            window.webkit.messageHandlers.getSNSApple.postMessage('');
        });
    },
    run: function () {
        var self = this;

        self.initLang();
        self.initValidation();
        self.initEvent();
        // 공용회원정보 처리
        self.basic.init();
        // Profile 수정 타입 확인
        if (profileType == 'company') {
            self.company.init();
        } else {
            self.basic.formInit();
        }
    }
};

$(function () {
    devProfileObj.run();
});

function setSNSApple(data) {
    data = JSON.parse(data);
    common.ajax(
        common.util.getControllerUrl('apple', 'member')
        , {
            id: data.sub
            , mode: 'join'
        }
        , false
        , function (result) {
            if (result.result == 'success') {
                $('#devAppleId').val(result.data.id);
                $('#devAppleIdBtn').attr('disabled', true);

            } else if (result.result == 'existsSnsId') {
                common.noti.alert(common.lang.get('profile.common.validation.fail.existsSnsId'));
            } else {
                common.noti.alert(common.lang.get('coupon.download.fail'));
            }
        });

}