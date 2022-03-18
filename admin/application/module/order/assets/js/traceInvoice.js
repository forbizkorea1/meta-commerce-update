"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderTraceInvoiceObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('traceInvoice.grid.label.statusText', '배송상태');
        common.lang.load('traceInvoice.grid.label.position', '위치');
        common.lang.load('traceInvoice.grid.label.admin_message', '배송정보');
        common.lang.load('traceInvoice.grid.label.date', '일시');
    },
    initPagingGrid: function () {
        // 그리드 생성
        var grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showRowSelector: false,
            height: '260px',
            columns: [
                {key: "status.text", label: common.lang.get('traceInvoice.grid.label.statusText'), width: 150, align: 'center'},
                {key: "location.name", label: common.lang.get('traceInvoice.grid.label.position'), width: 150},
                {key: "time", label: common.lang.get('traceInvoice.grid.label.date'), width: 150, align: 'center'},
                {key: "description", label: common.lang.get('traceInvoice.grid.label.admin_message'), width: "*"}
            ]
        };

        // 그리드 연동
        grid.setGrid($('#devTraceInvoiceGrid'), gridConfig).setContent(devTraceData);

    },
    run: function() {
        var self = this;
        this.initLang();
        this.initPagingGrid();
    }
}

$(function(){
    devOrderTraceInvoiceObj.run();
});