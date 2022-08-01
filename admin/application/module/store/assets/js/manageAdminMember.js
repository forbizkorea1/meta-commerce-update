"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreManageAdminMemberObj = {
    method: 'add',
    memCode: $('[name="mem_code"]').val(),
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.name', '사용자명');
        common.lang.load('grid.label.id', '아이디');
        common.lang.load('grid.label.templateAuth', '권한템플릿');
        common.lang.load('grid.label.mail', '이메일');
        common.lang.load('grid.label.pcs', '핸드폰');
        common.lang.load('grid.label.date', '등록일자');

        common.lang.load('grid.label.act', '사용관리');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
        common.lang.load('common.put.error.alert', '오류가 발생하였습니다. 확인해주세요.');
        common.lang.load('common.pw.error.alert', '비밀번호가 일치하지 않습니다.\n다시 입력해 주세요.');

        common.lang.load('joinInput.common.validation.userId.success', "사용 가능한 아이디 입니다.");
        common.lang.load('joinInput.common.validation.userId.fail', "이미 사용중인 아이디입니다.");
        common.lang.load('joinInput.common.validation.userId.doubleCheck', "아이디 중복 확인을 해주세요.");
        common.lang.load('joinInput.common.validation.pw', "영문 대소문자, 숫자, 특수문자 중 3개 이상을 조합하여 8자리 이상 입력해 주세요.");
        common.lang.load('joinInput.common.validation.userId.check', "영문, 숫자 조합하여 6~20자리로 입력해 주세요.");
    },
    isUserIdRegExp: false, //아이디 정규식 규칙 플레그
    isUserIdDoubleCheck: false, //아이디 중복 체크 플레그
    userIdDoubleCheckResponse: function (response) {
        var self = devStoreManageAdminMemberObj;
        if (response.result == "success") {
            self.isUserIdDoubleCheck = true;
            $('#devUserIdDoubleCheckButton').attr('disabled', true);

            common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.success'), 'success');
        } else if (response.result == "fail") {
            common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.fail'));
        } else {
            common.noti.alert("system error");
        }
    },
    checkPass: function(value) {
        var re = /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        return re.test(value);
    },
    initEvent: function () {
        var self = devStoreManageAdminMemberObj;

        //아이디 입력시 정규식 체크
        $('#devUserId').on({
            'input': function (e) {
                if (!(e.keyCode >=37 && e.keyCode<=40)) {
                    var inputVal = $(this).val();
                    $(this).val(inputVal.replace(/[^a-z0-9]/gi, ''));
                }

                if (self.isUserIdDoubleCheck == true) {
                    $('#devUserIdDoubleCheckButton').attr('disabled', false);
                }

                self.isUserIdRegExp = false;
                self.isUserIdDoubleCheck = false;
                if (common.validation.check($(this))) {
                    self.isUserIdRegExp = true;
                    common.noti.tailMsg(this.id, common.lang.get('joinInput.common.validation.userId.doubleCheck'));
                }
            }
        });
        //아이디 중복 체크
        $('#devUserIdDoubleCheckButton').click(function (e) {
            e.preventDefault();

            //본인아이디 체크시 통과
            if ($('#beforeId').val() == $('#devUserId').val()) {
                //수정시 기존 아이디중복체크 통과
                self.isUserIdRegExp = true;
                self.isUserIdDoubleCheck = true;
                $('#devUserIdDoubleCheckButton').attr('disabled', true);
                common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.success'), 'success');
            } else {
                // 영문, 숫자 조합하여 6~20자리로 입력해 주세요.
                var reId = /^.*(?=^.{6,20}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;
                if (reId.test($('#devUserId').val()) == false) {
                    common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.check'), 'fail');
                    return false;
                }

                self.isUserIdDoubleCheck = false;
                if (self.isUserIdRegExp == true) {
                    common.ajax(common.util.getControllerUrl('getUserIdCheck', 'manageAdminMember', 'store'), {'id': $('#devUserId').val()}, "", self.userIdDoubleCheckResponse);
                }
            }
        });
    },
    initSelectBox: function () {
        $("select[name=system_group_type_id]").val($("select[name=system_group_type_id]").attr('item')).prop("selected", true);
        $("select[name=language_type]").val($("select[name=language_type]").attr('item')).prop("selected", true);
        $("select[name=authorized]").val($("select[name=authorized]").attr('item')).prop("selected", true);
    },
    initOnMode: function () {
        if ($("input[name=mem_code]").val()) {
            //modify mode
            $(".changeNe").removeClass("fb-filter__title--ne");
            $('#devUserId').attr('readonly', true);
            $("#devUserIdDoubleCheckButton").hide();
        } else {
            //insert mode
        }
    },
    initSizeLimit: function () {

        $("[name=tel_1]").attr("maxlength", 4);
        $("[name=tel_2]").attr("maxlength", 4);
        $("[name=tel_3]").attr("maxlength", 4);

        $("[name=birthday_1]").attr("maxlength", 4);
        $("[name=birthday_2]").attr("maxlength", 4);
        $("[name=birthday_3]").attr("maxlength", 4);


        $("[name=pcs_1]").attr("maxlength", 4);
        $("[name=pcs_2]").attr("maxlength", 4);
        $("[name=pcs_3]").attr("maxlength", 4);

        $("[name=mail]").attr("maxlength", 255);
        $("[name=zip]").attr("maxlength", 6);


    },
    checkValidation: function () {
        var self = this;
        if ($("input[name=mem_code]").val() == '') {
            common.validation.set($('[name=pw]'), {'required': true, 'dataFormat': 'userPassword'});
            common.validation.set($('[name=pw_re]'), {'required': true, 'compare': '[name=pw]'});
        }
        common.validation.set($('[name=name]'), {'required': true});
        common.validation.set($('[name=id]'), {'required': true});
        common.validation.set($('[name=system_group_type_id]'), {'required': true});
        common.validation.set($('[name=language_type]'), {'required': true});
        common.validation.set($('[name=authorized]'), {'required': true});
        common.validation.set($('[name=gp_ix]'), {'required': true});
        common.validation.set($('[name=pcs_1]'), {'required': true});
        common.validation.set($('[name=pcs_2]'), {'required': true});
        common.validation.set($('[name=pcs_3]'), {'required': true});
        common.validation.set($('[name=mail]'), {'required': true});

    },
    initForm: function () {
        var self = this;

        if (self.memCode) {
            self.method = 'put';

            //수정시 기존 아이디중복체크 통과
            self.isUserIdRegExp = true;
            self.isUserIdDoubleCheck = true;
            $('#devUserIdDoubleCheckButton').attr('disabled', true);
            common.noti.tailMsg('devUserId', '');
        }

        common.form.init(
            $('#devForm'),
            common.util.getControllerUrl('putAdminMember', 'manageAdminMember', 'store'),
            function (formData) {
                self.checkValidation();

                // 비밀번호 관련 체크
                if ($('input[name=pw]').val() != "" && self.checkPass($('input[name=pw]').val()) == false) {
                    common.noti.alert(common.lang.get('joinInput.common.validation.pw'));
                    return false;
                }
                
                //아이디 관련 체크
                if (self.isUserIdRegExp != true || self.isUserIdDoubleCheck != true) {
                    common.noti.alert(common.lang.get('joinInput.common.validation.userId.doubleCheck'));
                    return false;
                }

                if ($('input[name=pw]').val() != $('input[name=pw_re]').val()) {
                    common.noti.alert(common.lang.get('common.pw.error.alert'));
                    return false;
                }

                if (common.validation.check($("#devForm"), 'alert', false)) {
                    return formData;
                } else {
                    return false;
                }
            },
            function (response) {
                if (response.result == 'success') {
                    if (self.method == 'add') {
                        common.noti.alert(common.lang.get('common.add.success.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    }
                    location.href = "/store/listAdminMember";
                } else {
                    common.noti.alert(common.lang.get('common.put.error.alert'));
                }
            }
        );

        $(".fb-filter__save").on('click', function () {
            $("#devForm").submit();
        });

        $(".fb-filter__reset").on('click', function () {
            common.form.reset($('#devForm'));
            return false;
        });
    },
    initPub: function () {
        //주소
        $('#devSearchAddressPopup').click(function () {
            common.pub.open('searchAddress', function (data) {
                $("input[name=zip]").val(data.zipcode);
                $("input[name=addr1]").val(data.address1);
            });
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initOnMode();
        self.initSelectBox();
        self.initForm();
        self.initPub();
        self.initSizeLimit();
    }
}

$(function () {
    devStoreManageAdminMemberObj.run();
});