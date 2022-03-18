"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devDisplayListMainDisplayObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('initList.label.div_name', '전시그룹');
        common.lang.load('initList.label.mp_name', '전시위치');
        common.lang.load('initList.label.mp_ix', '전시코드');
        common.lang.load('initList.label.mg_title', '전시명');
        common.lang.load('initList.label.disp_text', '전시여부');
        common.lang.load('initList.label.agent_type_text', '전시타입');
        common.lang.load('initList.label.mg_use_sdate_text', '시작일');
        common.lang.load('initList.label.mg_use_edate_text', '종료일');

        common.lang.load('grid.label.act', '관리');
        common.lang.load('common.del.confirm', '{title}을/를 삭제하시겠습니까?');

        common.lang.load('initGoodsCategory.label.div_name', '분류명');
        common.lang.load('initGoodsCategory.label.div_code', '분류코드');
        common.lang.load('initGoodsCategory.label.disp_text', '노출여부');
        common.lang.load('initGoodsCategory.label.regdate', '등록일자');
        common.lang.load('common.field.div_name.alert', '분류명을 입력해주세요.');
        common.lang.load('common.field.div_code.alert', '분류코드를 입력해주세요.');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');

        common.lang.load('initGoodsCategoryPosition.label.div_name', '분류');
        common.lang.load('initGoodsCategoryPosition.label.mp_name', '위치');
        common.lang.load('initGoodsCategoryPosition.label.vieworder', '노출순서');
        common.lang.load('initGoodsCategoryPosition.label.disp_text', '사용유무');
        common.lang.load('initGoodsCategoryPosition.label.regdate', '등록일자');
    },
    listGrid: false,
    initList: function () {
        var self = this;
        // 그리드 생성
        var grid = common.ui.grid();
        self.listGrid = grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            columns: [
                {key: "div_name", label: common.lang.get('initList.label.div_name'), width: 200, align: 'center'},
                {key: "mp_name", label: common.lang.get('initList.label.mp_name'), width: 250, align: 'left'},
                {key: "mp_ix", label: common.lang.get('initList.label.mp_ix'), width: 70, align: 'center'},
                {key: "mg_title", label: common.lang.get('initList.label.mg_title'), width: 230, align: 'left'},
                {key: "disp_text", label: common.lang.get('initList.label.disp_text'), width: 80, align: 'center'},
                {key: "agent_type_text", label: common.lang.get('initList.label.agent_type_text'), width: 80, align: 'center'},
                {key: "mg_use_sdate_text", label: common.lang.get('initList.label.mg_use_sdate_text'), width: 150, align: 'center'},
                {key: "mg_use_edate_text", label: common.lang.get('initList.label.mg_use_edate_text'), width: 150, align: 'center'},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> '
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        self.listGrid.setGrid($('#devPagingGrid'), gridConfig)
        .setForm('#devListForm')
        .setPagination('#devPageWrap')
        .setPageNum('#devPageNum')
        .setUrl(common.util.getControllerUrl('get', 'listMainDisplay', 'display'))
        .init(function (response) {
            $('#devTotal').text(common.util.numberFormat(response.data.total));
            self.listGrid.setContent(response.data.list, response.data.paging);
        });

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.listGrid.formObj.submit();
        });

        //초기화
        $('#devFormReset').click(function (e) {
            common.form.reset($('#devListForm'));
        });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            window.location.href = '/display/manageMainDisplay/index/' + self.listGrid.getRow($(this).data('idx')).mg_ix;
            return false;
        });

        // 삭제
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.listGrid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.mg_title}))) {
                common.ajax(common.util.getControllerUrl('del', 'listMainDisplay', 'display'),
                    {mg_ix: row.mg_ix},
                    function () {
                        // 전송전 데이타 검증
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        if (response.result == 'success') {
                            self.listGrid.reload();
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                );
            }
        });

        //그룹선택시 그룹위치
        $('[name=divSel]').change(function () {
            if(this.value == '') {
                $('[name=mpSel] option').remove();
                $('[name=mpSel]').append("<option value=''>기본그룹</option>");
                return false;
            }
            common.ajax(common.util.getControllerUrl('getMainPosition', 'listMainDisplay', 'display'),
                {div_ix: this.value},
                function () {
                    return true;
                },
                function (response) {
                    // 전송후 결과 확인
                    if (response.result == 'success') {
                        $('[name=mpSel] option').remove();
                        $('[name=mpSel]').append("<option value=''>기본그룹</option>");
                        $.each(response.data, function (k, v) {
                            $('[name=mpSel]').append("<option value='" + v.mp_ix + "'>" + v.mp_name + "</option>");
                        });
                    } else {
                        common.noti.alert(response.result);
                    }
                }
            );
        });
    },
    initForm: function () {
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });

        //저장
        $('#devFormSubmit').click(function (e) {
            e.preventDefault();

            if ($('#devBetweenDatePickerStart').val() != '' || $('#devBetweenDatePickerEnd').val() != '') {
                if ($('select[name=dateType]').val() == '') {
                    alert('날짜검색타입을 선택해주세요.');
                    return false;
                }
            }

            $('#devListForm').submit();
        });
    },
    initTab: function () {
        var self = this;
        common.ui.tap($('#devTap'), function (selector) {
            if (selector == '#devList') {
                self.initList();
                $('#devListGridSection').show();
                $('#devGoodsCategoryGridSection').hide();
                $('#devGoodsCategoryPositionGridSection').hide();
            } else if (selector == '#devGoodsCategory') {
                self.initGoodsCategory();
                $('#devListGridSection').hide();
                $('#devGoodsCategoryGridSection').show();
                $('#devGoodsCategoryPositionGridSection').hide();
            } else if (selector == '#devGoodsCategoryPosition') {
                self.initGoodsCategoryPosition();
                $('#devListGridSection').hide();
                $('#devGoodsCategoryGridSection').hide();
                $('#devGoodsCategoryPositionGridSection').show();
            }
        });

        $('#devGoodsCategoryGridSection').hide();
        $('#devGoodsCategoryPositionGridSection').hide();
    },
    goodsCategory: false,
    initGoodsCategory: function () {
        var self = this;
        // 그리드 생성
        var grid = common.ui.grid();
        self.goodsCategory = grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: false,
            showRowSelector: false,
            columns: [
                {key: "div_name", label: common.lang.get('initGoodsCategory.label.div_name'), width: 300, align: 'center'},
                {key: "div_code", label: common.lang.get('initGoodsCategory.label.div_code'), width: 300, align: 'center'},
                {key: "disp_text", label: common.lang.get('initGoodsCategory.label.disp_text'), width: 150, align: 'center'},
                {key: "regdate", label: common.lang.get('initGoodsCategory.label.regdate'), width: 150, align: 'center'},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> '
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        self.goodsCategory.setGrid($('#devGoodsCategoryGrid'), gridConfig)
        .setForm('#devGoodsCategoryForm')
        .setUrl(common.util.getControllerUrl('get', 'manageMainDisplayDivision', 'display'))
        .init(function (response) {
            $('#devGoodsCategoryTotal').text(common.util.numberFormat(response.data.total));
            self.goodsCategory.setContent(response.data.list);
        });

        // 수정
        $('#devGoodsCategoryGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.goodsCategory.getRow($(this).data('idx'));
            $('input[name=div_ix]').val(row.div_ix);
            $('input[name=div_name]').val(row.div_name);
            $('input[name=div_code]').val(row.div_code);
            $('[name=disp][value="' + row.disp + '"]').prop('checked', true);
            $('input[name=div_ix]').attr('disabled', false);
            $('#devGoodsCategoryFormReset').show();
        });

        // 삭제
        $('#devGoodsCategoryGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.goodsCategory.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.div_name + ' ' + row.div_code}))) {
                common.ajax(common.util.getControllerUrl('del', 'manageMainDisplayDivision', 'display'),
                    {div_ix: row.div_ix},
                    function () {
                        return true;
                    },
                    function (response) {
                        if (response.result == 'success') {
                            common.form.reset($('#devGoodsCategoryForm'));
                            self.goodsCategory.reload();
                        } else {
                            console.log(response);
                        }
                    }
                );
            }
        });

        //저장
        $('#devGoodsCategoryFormSave').click(function () {
            var is_update = false;

            if ($('input[name=div_ix]').val() == '') {
                $('input[name=div_ix]').attr('disabled', true);
            } else {
                is_update = true;
            }

            var $form = $('#devGoodsCategoryForm');
            common.form.init($form, common.util.getControllerUrl('put', 'manageMainDisplayDivision', 'display'),
                function (formData) {
                    if ($('input[name=div_name]').val() == '') {
                        common.noti.alert(common.lang.get('common.field.div_name.alert'));
                        $('input[name=div_name]').focus();
                        return false;
                    }
                    if ($('input[name=div_code]').val() == '') {
                        common.noti.alert(common.lang.get('common.field.div_code.alert'));
                        $('input[name=div_code]').focus();
                        return false;
                    }
                    return formData;
                },
                function (response) {
                    if (response.result == 'success') {
                        if (is_update) {
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                        } else {
                            common.noti.alert(common.lang.get('common.add.success.alert'));
                        }
                        common.form.reset($form);
                        $('#devGoodsCategoryFormReset').hide();
                        self.initGoodsCategory();
                    } else {
                        common.noti.alert(response.result);
                    }
                }
            );
        });

        //초기화
        $('#devGoodsCategoryFormReset').on('click', function () {
            common.form.reset($('#devGoodsCategoryForm'));
            $(this).hide();
        });
    },
    goodsCategoryPosition: false,
    initGoodsCategoryPosition: function () {
        var self = this;
        // 그리드 생성
        var grid = common.ui.grid();
        self.goodsCategoryPosition = grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: false,
            showRowSelector: false,
            columns: [
                {key: "div_name", label: common.lang.get('initGoodsCategoryPosition.label.div_name'), width: 300, align: 'center'},
                {key: "mp_name", label: common.lang.get('initGoodsCategoryPosition.label.mp_name'), width: 300, align: 'center'},
                {key: "vieworder", label: common.lang.get('initGoodsCategoryPosition.label.vieworder'), width: 100, align: 'center'},
                {key: "disp_text", label: common.lang.get('initGoodsCategoryPosition.label.disp_text'), width: 150, align: 'center'},
                {key: "regdate", label: common.lang.get('initGoodsCategoryPosition.label.regdate'), width: 150, align: 'center'},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> '
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        self.goodsCategoryPosition.setGrid($('#devGoodsCategoryPositionGrid'), gridConfig)
        .setForm('#devGoodsCategoryPositionForm')
        .setUrl(common.util.getControllerUrl('get', 'manageMainDisplayPosition', 'display'))
        .init(function (response) {
            $('#devGoodsCategoryPositionTotal').text(common.util.numberFormat(response.data.total));
            self.goodsCategoryPosition.setContent(response.data.list);
        });

        // 수정
        $('#devGoodsCategoryPositionGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.goodsCategoryPosition.getRow($(this).data('idx'));
            $('input[name=mp_ix]').val(row.mp_ix);
            $('[name=div_ix]').val(row.div_ix);
            $('input[name=mp_name]').val(row.mp_name);
            $('input[name=vieworder]').val(row.vieworder);
            $('[name=disp][value="' + row.disp + '"]').prop('checked', true);
            $('input[name=mp_ix]').attr('disabled', false);
            $('#devGoodsCategoryPositionFormReset').show();
        });

        // 삭제
        $('#devGoodsCategoryPositionGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.goodsCategoryPosition.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.div_name + ' ' + row.mp_name}))) {
                common.ajax(common.util.getControllerUrl('del', 'manageMainDisplayPosition', 'display'),
                    {mp_ix: row.mp_ix},
                    function () {
                        return true;
                    },
                    function (response) {
                        if (response.result == 'success') {
                            common.form.reset($('#devGoodsCategoryPositionForm'));
                            self.goodsCategoryPosition.reload();
                        } else {
                            console.log(response);
                        }
                    }
                );
            }
        });

        //저장
        $('#devGoodsCategoryPositionFormSave').click(function () {
            var self = this;
            var $form = $('#devGoodsCategoryPositionForm');

            var is_update = false;

            if ($('input[name=mp_ix]').val() == '') {
                $('input[name=mp_ix]').attr('disabled', true);
            } else {
                is_update = true;
            }


            common.form.init($form, common.util.getControllerUrl('put', 'manageMainDisplayPosition', 'display'),
                function (formData, $form) {
                    common.validation.set($('select[name=div_ix]'), {'required': true});
                    common.validation.set($('input[name=mp_name]'), {'required': true});
                    common.validation.set($('input[name=vieworder]'), {'required': true});
                    if (common.validation.check($form, 'alert', false)) {
                        return $form;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        if (is_update) {
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                        } else {
                            common.noti.alert(common.lang.get('common.add.success.alert'));
                        }
                        common.form.reset($form);
                        $('#devGoodsCategoryPositionFormReset').hide();
                        devDisplayListMainDisplayObj.initGoodsCategoryPosition();
                    } else {
                        common.noti.alert(response.result);
                    }
                }
            );
        });

        //초기화
        $('#devGoodsCategoryPositionFormReset').on('click', function () {
            common.form.reset($('#devGoodsCategoryPositionForm'));
            $(this).hide();
        });
    },
    run: function () {
        this.initLang();
        this.initList();
        this.initForm();
        this.initTab();
    }
}

$(function () {
    devDisplayListMainDisplayObj.run();
});