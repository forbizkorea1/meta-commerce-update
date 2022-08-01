"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMemberManageMemberApprovalObj = {
    initLang: function () {
        common.lang.load('grid.label.date', '등록일');
        common.lang.load('grid.label.memTypeText', '회원구분');
        common.lang.load('grid.label.name', '신청인');
        common.lang.load('grid.label.id', '아이디');
        common.lang.load('grid.label.tel', '전화번호');
        common.lang.load('grid.label.pcs', '휴대폰 번호');
        common.lang.load('grid.label.mail', 'E-mail');
        common.lang.load('grid.label.gp_name', '회원그룹');
        common.lang.load('grid.label.authText', '처리상태');


        common.lang.load('grid.label.act', '관리');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
    },
    initEvent: function () {
        $("#devSerach").on('click', function () {
            $("[name=is_serach]").val("Y");
            $(this).submit();
        });
        $(document).on('click', '#devSearchAddressPopup', function () {
            common.pub.open('searchAddress', function (data) {
                $("input[name=zip]").val(data.zipcode);
                $("input[name=addr1]").val(data.address1);
            });
        });


    },
    initForm: function () {
        var self = this;
        common.form.init(
                $('#devForm'),
                common.util.getControllerUrl('put', 'manageMemberGroup', 'member'),
                function (formData) {
                    return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                        self.grid.reload();
                    } else {
                        common.noti.alert(response.result);
                    }
                }
        );
    },
    initSearchForm: function () {
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: false
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
            , timepicker: false
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            timepicker: false
            , startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });
    },
    modalTpl: false,
    openModalHtml: function () {
        var self = this;
        self.modalTpl = Handlebars.compile(common.util.getHtml('#devMemberDetailTpl'));
    },
    initSizeLimit: function () {
        $("[name=birthday_1]").attr("maxlength", 4);
        $("[name=birthday_2]").attr("maxlength", 4);
        $("[name=birthday_3]").attr("maxlength", 4);
        $("[name=pcs_1]").attr("maxlength", 4);
        $("[name=pcs_2]").attr("maxlength", 4);
        $("[name=pcs_3]").attr("maxlength", 4);
        $("[name=tel_1]").attr("maxlength", 4);
        $("[name=tel_2]").attr("maxlength", 4);
        $("[name=tel_3]").attr("maxlength", 4);
        $("[name=zip]").attr("maxlength", 6);
    },
    checkValidation: function () {
        var self = this;
        common.validation.set($('[name=name]'), {'required': true});
        common.validation.set($('[name=mail]'), {'dataFormat': 'email'});
    },
    grid: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.grid = common.ui.grid();

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [
                {key: "date", label: common.lang.get('grid.label.date'), width: 150, align: "center"},
                {key: "memTypeText", label: common.lang.get('grid.label.memTypeText'), width: 150, align: "center"},
                {key: "name", label: common.lang.get('grid.label.name'), width: 150, align: "center"},
                {key: "id", label: common.lang.get('grid.label.id'), width: 150, align: "center"},
                {key: "tel", label: common.lang.get('grid.label.tel'), width: 150, align: "center"},
                {key: "pcs", label: common.lang.get('grid.label.pcs'), width: 150, align: "center"},
                {key: "mail", label: common.lang.get('grid.label.mail'), width: 150, align: "center"},
                {key: "gp_name", label: common.lang.get('grid.label.gp_name'), width: 150, align: "center"},
                {key: "authText", label: common.lang.get('grid.label.authText'), width: 150, align: "center"},
                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
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
                .setUrl(common.util.getControllerUrl('get', 'manageMemberApproval', 'member'))
                .init(function (response) {
                    $('#devTotal').text(common.util.numberFormat(response.data.total));
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
            common.util.modal.open(
                    'html',
                    '회원수정',
                    self.modalTpl(row),
                    '', '',
                    {width: '980px', height: '650px'}
            );
            common.form.dataBind($("#devMemberDetailForm"), row);
            self.initSizeLimit();

            common.form.init(
                    $('#devMemberDetailForm'),
                    common.util.getControllerUrl('putMemberInfo', 'listMember', 'member'),
                    function (formData) {
                        self.checkValidation();
                        if (common.validation.check($('#devMemberDetailForm'), 'alert', false)) {
                            return formData;
                        } else {
                            return false;
                        }
                    },
                    function (response) {
                        if (response.result == 'success') {
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                            common.util.modal.close();
                            self.grid.reload();
                        } else {
                            common.noti.alert(common.lang.get('common.put.error.alert'));
                        }
                    }
            );
        });

        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.name}))) {
                common.ajax(common.util.getControllerUrl('delMember', 'listMember', 'member'),
                        {code: row.code},
                        function () {
                            // 전송전 데이타 검증
                            return true;
                        },
                        function (response) {
                            // 전송후 결과 확인
                            if (response.result == 'success') {
                                common.noti.alert(common.lang.get('common.del.success.alert'));
                                self.grid.reload();
                            } else {
                                common.noti.alert(response.result);
                            }
                        }
                );
            }
        });

        //초기화
        $('#devFormReset').click(function (e) {
            common.form.reset($('#devGridForm'));
            $("[name=is_serach]").val("N");
            self.grid.reload();
        });

    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initForm();
        self.initSearchForm();
        self.initPagingGrid();
        self.openModalHtml();
        self.initSizeLimit();
    }
}

$(function () {
    devMemberManageMemberApprovalObj.run();
});