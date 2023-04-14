"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStatisticsMemberStatisticsDetailObj = {
    initLang: function () {
        var self = this;
        // 글로벌 언어셋 설정

        common.lang.load('grid.label.type_text', '일자');
        common.lang.load('grid.label.user_cnt', '신규회원');
        common.lang.load('grid.label.drop_cnt', '탈퇴회원');
        common.lang.load('grid.label.sleep_cnt', '휴면회원');
    },
    grid: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 생성
        var grid = common.ui.grid();
        self.grid = grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            columns: [
                {key: "type_text", label: common.lang.get('grid.label.type_text'), width: 120, align: 'center'},
                {key: "sum_user_cnt", label: common.lang.get('grid.label.user_cnt'), width: 100, align: 'center'},
                {key: "sum_drop_cnt", label: common.lang.get('grid.label.drop_cnt'), width: 100, align: 'center'},
                {key: "sum_sleep_cnt", label: common.lang.get('grid.label.sleep_cnt'), width: 100, align: 'center'}
            ]
        };

        // 그리드 연동
        self.grid.setGrid($('#devDetailPagingGrid'), gridConfig)
            .setForm('#devDetailGridForm')
            .setPagination('#devDetailPageWrap')
            .setPageNum('#devDetailPageNum')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('get', 'memberStatisticsDetail', 'statistics'))
            .init(function (response) {
                $('#devDetailTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
            });



        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            // self.grid.excelDown(common.util.getControllerUrl('dwn', 'listRemittanceReady', 'accounts'));
        });
    },
    run: function() {
        var self = this;
        self.initLang();
        self.initPagingGrid();
    }
}

$(function(){
    devStatisticsMemberStatisticsDetailObj.run();
});