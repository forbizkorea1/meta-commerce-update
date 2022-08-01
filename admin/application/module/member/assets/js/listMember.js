"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMemberListMemberObj = {
    initLang: function () {
        common.lang.load('grid.label.memTypeTextDiv', '회원구분(타입)');
        common.lang.load('grid.label.gp_name', '회원그룹');
        common.lang.load('grid.label.authorized', '승인여부');
        common.lang.load('grid.label.name', '이름');
        common.lang.load('grid.label.id', '아이디');
        common.lang.load('grid.label.mail', '이메일');
        common.lang.load('grid.label.last', '최근방문일');
        common.lang.load('grid.label.visit', '로그인 횟수');
        common.lang.load('grid.label.mileage', '마일리지');

        common.lang.load('grid.label.act', '관리');

        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.put.error.alert', '수정에 실패했습니다.');
        common.lang.load('common.put.error.notMatch.alert', '비밀번호와 비번확인이 일치 하지 않습니다.');
        common.lang.load('common.del.success.alert', '삭제되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
    },
    initEvent: function () {
        var self = this;
        $(document).on('click', '#devSearchAddressPopup', function () {
            common.pub.open('searchAddress', function (data) {
                $("input[name=zip]").val(data.zipcode);
                $("input[name=addr1]").val(data.address1);
            });
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
    modalTpl: false,
    openModalHtml: function () {
        var self = this;
        self.modalTpl = Handlebars.compile(common.util.getHtml('#devMemberDetailTpl'));
        
    },
    grid: false,
    checkValidation: function () {
        var self = this;
        common.validation.set($('[name=name]'), {'required': true});
        common.validation.set($('[name=mail]'), {'dataFormat': 'email'});
    },
    initSizeLimit: function () {        
        $("[name=tel_1]").attr("maxlength", 4);
        $("[name=tel_2]").attr("maxlength", 4);
        $("[name=tel_3]").attr("maxlength", 4);
        $("[name=mail]").attr("maxlength", 255);
        $("[name=pcs_1]").attr("maxlength", 3);
        $("[name=pcs_2]").attr("maxlength", 4);
        $("[name=pcs_3]").attr("maxlength", 4); 
        $("[name=birthday_1]").attr("maxlength", 4);
        $("[name=birthday_2]").attr("maxlength", 2);
        $("[name=birthday_3]").attr("maxlength", 2);
        $("[name=zip]").attr("maxlength", 6);
    },
    initPagingGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.grid = common.ui.grid();

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [
                {key: "memTypeTextDiv", label: common.lang.get('grid.label.memTypeTextDiv'), width: 150, align: "left"},
                {key: "gp_name", label: common.lang.get('grid.label.gp_name'), width: 150, align: "left"},
                {key: "authorized", label: common.lang.get('grid.label.authorized'), width: 100, align: "center", formatter: function () {
                        switch (this.value) {
                            case "Y":
                                return "승인";
                                break;
                            case "N":
                                return "승인대기";
                                break;
                            case "X":
                                return "승인거부";
                                break;
                            default:
                                return "알수없음";
                                break;
                        }
                    }
                },
                {key: "name", label: common.lang.get('grid.label.name'), width: 200, align: "left"},
                {key: "id", label: common.lang.get('grid.label.id'), width: 150, align: "left"},
                {key: "mail", label: common.lang.get('grid.label.mail'), width: 250, align: "left"},
                {key: "last", label: common.lang.get('grid.label.last'), width: 150, align: "left"},
                {key: "visit", label: common.lang.get('grid.label.visit'), width: 100, align: "left"},
                {key: "mileage", label: common.lang.get('grid.label.mileage'), width: 100, align: "left"},
                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 180, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" />'
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
                        if (common.validation.check($("#devMemberDetailForm"), 'alert', false)) {
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
                        } else if (response.result == 'notMatchPw') {
                            common.noti.alert(common.lang.get('common.put.error.notMatch.alert'));
                        } else {
                            common.noti.alert(common.lang.get('common.put.error.alert'));
                        }
                    }
            );
        });

        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.name}))) {
                common.ajax(common.util.getControllerUrl('del', 'listMember', 'member'),
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
        $('.devReset').click(function (e) {
            common.form.reset($('#devGridForm'));
            self.grid.reload();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            self.grid.excelDown(common.util.getControllerUrl('dwn', 'listMember', 'member'), {});
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initSearchForm();
        self.initPagingGrid();
        self.openModalHtml();
        self.initSizeLimit();
    }
}

$(function () {
    devMemberListMemberObj.run();
});