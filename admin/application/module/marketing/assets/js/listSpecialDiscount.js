"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMarketingListSpecialDiscountObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.discount_sale_title', '특별할인명');
        common.lang.load('grid.label.week_no_text', '노출요일');
        common.lang.load('grid.label.member_target_text', '회원조건');
        common.lang.load('grid.label.discount_use_sdate_text', '시작일');
        common.lang.load('grid.label.discount_use_edate_text', '종료일');
        common.lang.load('grid.label.is_use_text', '사용여부');
        common.lang.load('grid.label.is_ing_text', '진행여부');
        common.lang.load('grid.label.pcnt', '상품수량');
        common.lang.load('grid.label.regdate', '등록일자');
        common.lang.load('grid.label.act', '관리');
        common.lang.load('common.del.confirm', '{title}을/를 삭제하시겠습니까?');

        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
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
            showRowSelector: true,
            columns: [
                {key: "discount_sale_title", label: common.lang.get('grid.label.discount_sale_title'), width: 350, align: 'left'},
                // {key: "week_no_text", label: common.lang.get('grid.label.week_no_text'), width: 150, align: 'center'},
                {key: "member_target_text", label: common.lang.get('grid.label.member_target_text'), width: 100, align: 'center'},
                {key: "discount_use_sdate_text", label: common.lang.get('grid.label.discount_use_sdate_text'), width: 150, align: 'center'},
                {key: "discount_use_edate_text", label: common.lang.get('grid.label.discount_use_edate_text'), width: 150, align: 'center'},
                {key: "is_use_text", label: common.lang.get('grid.label.is_use_text'), width: 100, align: 'center'},
                {key: "is_ing_text", label: common.lang.get('grid.label.is_ing_text'), width: 100, align: 'center'},
                {key: "pcnt", label: common.lang.get('grid.label.pcnt'), width: 100, align: 'center'},
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 150, align: 'center'},
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
        .setUrl(common.util.getControllerUrl('get', 'listDiscount', 'marketing'))
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
            window.location.href = '/marketing/manageSpecialDiscount/index/' + self.listGrid.getRow($(this).data('idx')).dc_ix;
            return false;
        });

        // 삭제
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.listGrid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.discount_sale_title}))) {
                common.ajax(common.util.getControllerUrl('del', 'listSpecialDiscount', 'marketing'),
                    {dc_ix: row.dc_ix},
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
    },
    initForm: function () {
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: true
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
            , timepicker: true
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: true
        });

        common.ui.datePicker($('#devBetweenDatePickerStart2'), {
            endTartget: $('#devBetweenDatePickerEnd2')
            , timepicker: true
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd2'), {
            startTartget: $('#devBetweenDatePickerStart2')
            , timepicker: true
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate2'), {
            startTartget: $('#devBetweenDatePickerStart2')
            , endTartget: $('#devBetweenDatePickerEnd2')
            , timepicker: true
        });

        //저장
        $('#devFormSubmit').click(function (e) {
            e.preventDefault();

            if ($('input[name=search_text]').val() != '' && $('select[name=filterType]').val() == '') {
                alert('날짜검색타입을 선택해주세요.');
                return false;
            }

            $('#devListForm').submit();
        });
    },
    run: function () {
        this.initLang();
        this.initList();
        this.initForm();
    }
}

$(function () {
    devMarketingListSpecialDiscountObj.run();
});