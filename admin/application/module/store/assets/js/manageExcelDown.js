"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreManageExcelDownObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.mem_name', '업체명');
        common.lang.load('grid.label.mem_id', '아이디');
        common.lang.load('grid.label.file_type', '파일구분');
        common.lang.load('grid.label.file_name', '파일명');
        common.lang.load('grid.label.dwn_date', '다운로드일시');
        common.lang.load('grid.label.dwn_ip', '다운로드IP');
        common.lang.load('grid.label.dstr_status', '파기여부');
        common.lang.load('grid.label.dstr_date', '파기한시간');
        common.lang.load('grid.label.dstr_name', '파기자명');
        common.lang.load('grid.label.dstr_id', '파기자ID');
        common.lang.load('grid.label.dstr_ip', '파기자IP');
        common.lang.load('msg.destory.completed', '해당 문서를 파기 하시겠습니까?');
    },
    excelDownGrid: false,
    initDatePicker: function () {
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
    initExcelDownGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.excelDownGrid = common.ui.grid();
        var grid = self.excelDownGrid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: false,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [
                {key: "mem_name", label: common.lang.get('grid.label.mem_name'), width: 120, align: 'center'},
                {key: "mem_id", label: common.lang.get('grid.label.mem_id'), width: 120, align: 'center'},
                {key: "file_type", label: common.lang.get('grid.label.file_type'), width: 75, align: 'center'},
                {key: "file_name", label: common.lang.get('grid.label.file_name'), width: 310, align: 'center'},
                {key: "dwn_date", label: common.lang.get('grid.label.dwn_date'), width: 150, align: 'center'},
                {key: "dwn_ip", label: common.lang.get('grid.label.dwn_ip'), width: 120, align: 'center'},
                {key: "dstr_status", label: common.lang.get('grid.label.dstr_status'), width: 80, align: 'center', formatter: function () {
                        return (this.value == '파기완료' ? this.value : '<input type="button" class="fb-filter__delete--gray devHisoryDestroy" data-idx="' + this.item.__index + '" value="파기" />');
                    }},
                {key: "dstr_date", label: common.lang.get('grid.label.dstr_date'), width: 150, align: 'center'},
                {key: "dstr_name", label: common.lang.get('grid.label.dstr_name'), width: 120, align: 'center'},
                {key: "dstr_id", label: common.lang.get('grid.label.dstr_id'), width: 120, align: 'center'},
                {key: "dstr_ip", label: common.lang.get('grid.label.dstr_ip'), width: 120, align: 'center'}
            ]
        };

        // 그리드 연동
        grid.setGrid($('#devExcelDownGrid'), gridConfig)
                .setUseHash(false)
                .setForm('#devExcelDownGridForm')
                .setPagination('#devPageWrap')
                .setPageNum('#devPageNum')
                .setUrl(common.util.getControllerUrl('get', 'manageExcelDown', 'store'))
                .init(function (response) {
                    $('#devTotal').text(common.util.numberFormat(response.data.total));
                    grid.setContent(response.data.list, response.data.paging);
                });

        // 페이지 이벤트
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            grid.reload();
        });
        
        // 초기화 버튼 이벤트
        $('.devReset').on('click', function (){
            common.form.reset($('#devExcelDownGridForm'));
        });

        // 삭제 버튼 이벤트
        $('[data-ax5grid-container="body"]').on('click', '.devHisoryDestroy', function () {
            var gIdx = $(this).data('idx');
            var row = grid.getRow(gIdx);

            common.ajax(
                    common.util.getControllerUrl('put', 'manageExcelDown', 'store'),
                    {system_excel_dwn_history_id: row.system_excel_dwn_history_id},
                    function () {
                        return true;
                    },
                    function (response) {
                        if(response.result == 'success') {
                            $.extend(row, response.data);
                            if(common.noti.confirm(common.lang.get('msg.destory.completed'))){
                                self.excelDownGrid.updateRow(gIdx, row);
                            }else {
                                return false;
                            }
                        } else {
                            console.log(response);
                        }
                    }
            );
        });
    },
    run: function () {
        var self = this;

        // 글로벌 언어
        self.initLang();
        // 그리드
        self.initExcelDownGrid();
        // datePicker
        self.initDatePicker();
    }
}

$(function () {
    devStoreManageExcelDownObj.run();
});