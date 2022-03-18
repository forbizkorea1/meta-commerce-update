"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMemberBatchGiveCouponObj = {
    initLang: function () {
        common.lang.load('grid.label.memTypeTextDiv', '회원구분(타입)');
        common.lang.load('grid.label.gp_name', '그룹');
        common.lang.load('grid.label.authorized', '승인여부');
        common.lang.load('grid.label.name', '이름');
        common.lang.load('grid.label.id', '아이디');
        common.lang.load('grid.label.mail', '이메일');
        common.lang.load('grid.label.last', '최근방문일');
        common.lang.load('grid.label.date', '가입일');

        common.lang.load('grid.label.pcs', '휴대폰');

        common.lang.load('grid.label.smsText', 'SMS 수신여부');
        common.lang.load('grid.label.infoText', '메일 수신여부');

        common.lang.load('grid.label.act', '관리');

        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.give.cupon.alert', '쿠폰지급이 완료되었습니다.');
        common.lang.load('common.put.error.alert', '쿠폰지급을 실패하였습니다.');

        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');

        common.lang.load('common.fail.count.alert', '선택이 안되어있습니다.');

    },
    initForm: function () {
        var self = this;
        common.form.init(
                $('#devModifyForm'),
                common.util.getControllerUrl('add', 'batchGiveCoupon', 'member'),
                function (formData) {

                    if ($("[name=update_type]").val() == 2) {
                        if (self.grid.getList('selected', ['code']).length <= 0) {
                            common.noti.alert(common.lang.get('common.fail.count.alert'));
                            return false;
                        }
                    }
                    self.checkValidation();
                    if (common.validation.check($('#devModifyForm'), 'alert', false)) {
                        return formData;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.give.cupon.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.put.error.alert'));
                    }
                }
        );

        $('#devModifyBtn').on("click", function () {
            // console.log(self.grid.getList('selected', ['code']));return false;
            // $("[name=selectCode]").val(self.grid.getList('selected', ['code']));
            // $('#devModifyForm').submit();

            $("[name=selectCode]").val(self.grid.getList('selected', ['code']));
            $("#devGridForm > fieldset").clone().appendTo($("#cloneForm"));
            common.form.dataBind($("#cloneForm"), common.form.getObj($('#devGridForm')));
            $('#devModifyForm').submit();
            $("#cloneForm").html("");
            return false;
        });
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
    grid: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.grid = common.ui.grid();

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: true,
            frozenColumnIndex: false, //열고정
            columns: [
                {key: "date", label: common.lang.get('grid.label.date'), width: 150, align: "center"},
                {key: "last", label: common.lang.get('grid.label.last'), width: 150, align: "center"},
                {key: "gp_name", label: common.lang.get('grid.label.gp_name'), width: 150, align: "left"},
                {key: "id", label: common.lang.get('grid.label.id'), width: 200, align: "left"},
                {key: "pcs", label: common.lang.get('grid.label.pcs'), width: 150, align: "left"},
                {key: "mail", label: common.lang.get('grid.label.mail'), width: 250, align: "left"},
                {key: "smsText", label: common.lang.get('grid.label.smsText'), width: 120, align: "center"},
                {key: "infoText", label: common.lang.get('grid.label.infoText'), width: 120, align: "center"},

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
                .setUrl(common.util.getControllerUrl('get', 'listMember', 'member'))
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
            //console.log(row);
            common.util.modal.open(
                    'html',
                    '회원수정',
                    self.modalTpl(row),
                    '', '',
                    {width: '980px', height: '650px'}
            );
            common.form.dataBind($("#devMemberDetailForm"), row);

            common.form.init(
                    $('#devMemberDetailForm'),
                    common.util.getControllerUrl('putMemberInfo', 'listMember', 'member'),
                    function (formData) {
                        return true;
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
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            self.grid.excelDown(common.util.getControllerUrl('dwn', 'listMember', 'member'), {});
        });
    },
    modalTpl: false,
    openModalHtml: function () {
        var self = this;
        self.modalTpl = Handlebars.compile(common.util.getHtml('#devMemberDetailTpl'));
    },
    checkValidation: function () {
        var self = this;
        common.validation.set($('[name=update_type]'), {'required': true});        
    },
    initSizeLimit: function () {
        $("[name=tel_1]").attr("maxlength", 4);
        $("[name=tel_2]").attr("maxlength", 4);
        $("[name=tel_3]").attr("maxlength", 4);
        $("[name=mail]").attr("maxlength", 255);
        $("[name=pcs_1]").attr("maxlength", 4);
        $("[name=pcs_2]").attr("maxlength", 4);
        $("[name=pcs_3]").attr("maxlength", 4);
        $("[name=birthday_1]").attr("maxlength", 4);
        $("[name=birthday_2]").attr("maxlength", 4);
        $("[name=birthday_3]").attr("maxlength", 4);
        $("[name=zip]").attr("maxlength", 6);
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initForm();
        self.initSearchForm();
        self.initPagingGrid();
        self.openModalHtml();
        self.initSizeLimit();

    }
}

$(function () {
    devMemberBatchGiveCouponObj.run();
});