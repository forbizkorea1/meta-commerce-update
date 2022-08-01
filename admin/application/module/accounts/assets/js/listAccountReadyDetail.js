"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devAccountsListAccountReadyDetailObj = {
    initPagingGrid: function () {
        // 그리드 생성
        var grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = devAccountDetailObj.getGridConfig();

        // 그리드 연동
        grid.setGrid($('#devAccountReadyDetailGrid'), gridConfig)
            .setForm('#devAccountReadyDetailGridForm')
            .setPagination('#devAccountReadyDetailPageWrap')
            .setPageNum('#devAccountReadyDetailPageNum')
            .setUrl(common.util.getControllerUrl('get', 'listAccountReadyDetail', 'accounts'))
            .setUseHash(false)
            .init(function (response) {
                $('#devAccountReadyDetailTotal').text(common.util.numberFormat(response.data.total));
                grid.setContent(response.data.list, response.data.paging);
            });

        // 그리드 라인수 처리
        $('#devAccountReadyDetailMax').on('change', function () {
            $('#devAccountReadyDetailGridForm [name="max"]').val($(this).val());
            grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devAccountReadyDetailExcelDownload').on('click', function (e) {
            grid.excelDown(common.util.getControllerUrl('dwn', 'listAccountReadyDetail', 'accounts'));
        });
    },
    run: function () {
        var self = this;
        self.initPagingGrid();
    }
}

$(function () {
    devAccountDetailObj.run();
    devAccountsListAccountReadyDetailObj.run();
});