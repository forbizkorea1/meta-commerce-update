"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devCompanyManageSellerUserObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.name', '사용자명');
        common.lang.load('grid.label.id', '아이디');
        common.lang.load('grid.label.templateAuth', '권한템플릿');
        common.lang.load('grid.label.mail', '이메일');
        common.lang.load('grid.label.pcs', '휴대폰 번호');
        common.lang.load('grid.label.date', '등록일자');

        common.lang.load('grid.label.act', '사용관리');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');

        common.lang.load('joinInput.common.validation.userId.success', "<p class=\'fb__menusubmit-text\'>사용 가능한 아이디 입니다.<\/p>");
        common.lang.load('joinInput.common.validation.userId.fail', "<p class=\'fb__menusubmit-text\'>이미 사용중인 아이디입니다.<\/p>");
        common.lang.load('joinInput.common.validation.userId.doubleCheck', "<p class=\'fb__menusubmit-text\'>아이디 중복 확인을 해주세요.<\/p>");
        common.lang.load('joinInput.common.validation.userId.Check', "아이디 중복 확인을 해주세요.");
        common.lang.load('joinInput.common.validation.userId.reset', "<p class=\'fb__menusubmit-text\'>영문, 숫자 조합하여 6~20자리로 입력해 주세요.<\/p>");
        common.lang.load('joinInput.common.validation.pw', "영문 대소문자, 숫자, 특수문자 중 3개 이상을 조합하여 8자리 이상 입력해 주세요.");
    },
    isUserIdRegExp: false, //아이디 정규식 규칙 플레그
    isUserIdDoubleCheck: false, //아이디 중복 체크 플레그
    beforeId : '',
    userIdDoubleCheckResponse: function (response) {
        var self = devCompanyManageSellerUserObj;
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
        var self = devCompanyManageSellerUserObj;

        $("#devUserId").keyup(function(event){
            if (!(event.keyCode >=37 && event.keyCode<=40)) {
                var inputVal = $(this).val();
                $(this).val(inputVal.replace(/[^a-z0-9]/gi, ''));
            }
        });

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
            if (self.beforeId == $('#devUserId').val()) {
                //수정시 기존 아이디중복체크 통과
                self.isUserIdRegExp = true;
                self.isUserIdDoubleCheck = true;
                $('#devUserIdDoubleCheckButton').attr('disabled', true);
                common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.success'), 'success');
            } else {
                // 영문, 숫자 조합하여 6~20자리로 입력해 주세요.
                var reId = /^.*(?=^.{6,20}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;
                if (reId.test($('#devUserId').val()) == false) {
                    common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.reset'), 'fail');
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
        $("select[name=gp_ix]").val($("select[name=gp_ix]").attr('item')).prop("selected", true);
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
        var self = devCompanyManageSellerUserObj;
        common.validation.reset($('#devForm'));
        common.validation.set($('[name=name]'), {'required': true});
        common.validation.set($('[name=id]'), {'required': true});
        common.validation.set($('[name=system_group_type_id]'), {'required': true});
        if ($("[name=mode]").val() != "update") {
            common.validation.set($('[name=pw]'), {'dataFormat': 'userPassword'});
            common.validation.set($('[name=pw_re]'), {'dataFormat': 'userPassword'});
        }
        common.validation.set($('[name=mail]'), {'dataFormat': 'email'});
        common.validation.set($('[name=mem_type]'), {'required': true});

        common.validation.set($('[name=language_type]'), {'required': true});
        common.validation.set($('[name=authorized]'), {'required': true});
        common.validation.set($('[name=pcs_1]'), {'required': true});
        common.validation.set($('[name=pcs_2]'), {'required': true});
        common.validation.set($('[name=pcs_3]'), {'required': true});
        common.validation.set($('[name=gp_ix]'), {'required': true});

    },

    initForm: function () {
        var self = devCompanyManageSellerUserObj;
        common.form.init(
            $('#devForm'),
            common.util.getControllerUrl('putSellerUser', 'manageSellerUser', 'company'),
            function (formData) {

                //아이디 관련 체크
                if (self.isUserIdRegExp != true || self.isUserIdDoubleCheck != true) {
                    common.noti.alert(common.lang.get('joinInput.common.validation.userId.Check'));
                    return false;
                }

                self.checkValidation();

                //비밀번호 관련 체크
                if ($('input[name=pw]').val() != "" && self.checkPass($('input[name=pw]').val()) == false) {
                    common.noti.alert(common.lang.get('joinInput.common.validation.pw'));
                    return false;
                }

                if (common.validation.check($('#devForm'), 'alert', false)) {
                    return formData;
                } else {
                    return false;
                }
            },
            function (response) {
                if (response.result == 'success') {
                    if ($("[name=mode]").val() == "insert") {
                        common.noti.alert(common.lang.get('common.add.success.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    }

                    self.grid.reload();
                    common.form.reset($('#devForm'));
                    $('input[name=mode]').val('insert');
                    $(".changeNe").addClass("fb-filter__title--ne");
                    $('#devUserId').attr('readonly', false);
                    $("#devUserIdDoubleCheckButton").show();
                } else if (response.result == 'fail pw') {
                    common.noti.alert(response.data);
                } else {
                    common.noti.alert(common.lang.get('common.put.error.alert'));
                }
                common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.reset'), 'success');
            }
        );

        $(".devSave").on('click', function () {
            $("#devForm").submit();
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
    initPagingGrid: function () {
        var self = devCompanyManageSellerUserObj;
        // 그리드 객체 생성
        self.grid = common.ui.grid();
        // 그리드 설정

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [

                {key: "name", label: common.lang.get('grid.label.name'), width: 250, align: "left"},
                {key: "id", label: common.lang.get('grid.label.id'), width: 150, align: "left"},
                {key: "mail", label: common.lang.get('grid.label.mail'), width: 250, align: "left"},
                {key: "pcs", label: common.lang.get('grid.label.pcs'), width: 200, align: "center"},
                {key: "date", label: common.lang.get('grid.label.date'), width: 200, align: "center"},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />'
                        ].join('');
                    }
                }

            ]
        };
        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
        .setForm('#devGridForm')
        .setPagination('#devPageWrap')
        .setPageNum('#devPageNum')
        .setUseHash(false)
        .setUrl(common.util.getControllerUrl('getSellerList', 'manageSellerUser', 'company'))
        .init(function (response) {
            self.grid.setContent(response.data.list, response.data.paging);
        });
        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.grid.getRow($(this).data('idx'));
            common.form.dataBind($('#devForm'), row);


            $('input[name=mode]').val('update');
            $(".changeNe").removeClass("fb-filter__title--ne");
            $('#devUserId').attr('readonly', true);
            $("#devUserIdDoubleCheckButton").hide();
            $('#devFormReset').show();

            //수정시 기존 아이디중복체크 통과
            self.beforeId = $('#devUserId').val();
            self.isUserIdRegExp = true;
            self.isUserIdDoubleCheck = true;
            $('#devUserIdDoubleCheckButton').attr('disabled', true);
            common.noti.tailMsg('devUserId', '', 'success');
        });

        //초기화
        $('.devFormReset').click(function (e) {
            common.form.reset($('#devForm'));
            $('input[name=mode]').val('insert');
            $(".changeNe").addClass("fb-filter__title--ne");
            $('#devUserId').attr('readonly', false);
            $("#devUserIdDoubleCheckButton").show();
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initPagingGrid();
        self.initSelectBox();
        self.initForm();
        self.initPub();
        self.initSizeLimit();
    }
}

$(function () {
    devCompanyManageSellerUserObj.run();
});