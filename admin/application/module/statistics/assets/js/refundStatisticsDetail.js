"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStatisticsRefundStatisticsDetailObj = {
    initLang: function () {
        var self = this;
        // 글로벌 언어셋 설정

        common.lang.load('grid.label.pid', '상품코드');
        common.lang.load('grid.label.pname', '상품명');
        common.lang.load('grid.label.type_text', '일자');
        common.lang.load('grid.label.cancel_cnt', '취소완료/환불완료 건수');
        common.lang.load('grid.label.cancel_price', '취소완료/환불완료 금액 합계');
        common.lang.load('grid.label.return_cnt', '반품완료/환불완료 건수');
        common.lang.load('grid.label.return_price', '반품완료/환불완료 금액 합계');
        common.lang.load('grid.label.refund_price', '환불금액 합계');
    },
    grid: false,
    gridData: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 생성
        var grid = common.ui.grid();
        self.grid = grid;
        // 그리드 설정
        if(self.stDiv == 'product'){
            var gridConfig = {
                showLineNumber: true,
                columns: [
                    {key: "pid", label: common.lang.get('grid.label.pid'), width: 100, align: 'center'},
                    {key: "pname", label: common.lang.get('grid.label.pname'), width: 100, align: 'center'},
                    {key: "cancel_cnt", label: common.lang.get('grid.label.cancel_cnt'), width: 150, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "cancel_price", label: common.lang.get('grid.label.cancel_price'), width: 180, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "return_cnt", label: common.lang.get('grid.label.return_cnt'), width: 150, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "return_price", label: common.lang.get('grid.label.return_price'), width: 180, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "refund_price", label: common.lang.get('grid.label.refund_price'), width: 130, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }}
                ]
            };
        }else{
            var gridConfig = {
                showLineNumber: true,
                columns: [
                    {key: "type_text", label: common.lang.get('grid.label.type_text'), width: 100, align: 'center'},
                    {key: "cancel_cnt", label: common.lang.get('grid.label.cancel_cnt'), width: 150, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "cancel_price", label: common.lang.get('grid.label.cancel_price'), width: 180, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "return_cnt", label: common.lang.get('grid.label.return_cnt'), width: 150, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "return_price", label: common.lang.get('grid.label.return_price'), width: 180, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "refund_price", label: common.lang.get('grid.label.refund_price'), width: 130, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }}
                ]
            };
        }


        // 그리드 연동
        self.grid.setGrid($('#devDetailPagingGrid'), gridConfig)
            .setForm('#devDetailGridForm')
            .setPagination('#devDetailPageWrap')
            .setPageNum('#devDetailPageNum')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('get', 'refundStatisticsDetail', 'statistics'))
            .init(function (response) {
                self.gridData = response.data;
                $('#devDetailTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
                //차트 그리기
                if(self.stDiv != 'product') {
                    self.setChart();
                }
            });



        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devDetailExcelDownload').on('click', function (e) {
            // self.grid.excelDown(common.util.getControllerUrl('dwn', 'listRemittanceReady', 'accounts'));
            self.grid.excelDownAsync(common.util.getControllerUrl('dwnAsync', 'refundStatisticsDetail', 'statistics'));
            common.util.modal.open('ajax', '엑셀다운로드 항목', '/store/excelDownList', '',
                '',{width: '900px', height: '540px'});
        });
    },
    initCascading: function () {
        var self = this;
        // 업체별 창고
        common.ui.cascading('#devSelectCategory', '#devSelectCategory1')
            .setOptColumn({
                cascading: 'cascading',
                value: 'val',
                text: 'text'
            })
            .setUrl(common.util.getControllerUrl('getSubCategory', 'refundStatisticsDetail', 'statistics'))
            .on('change', function (obj) {
                console.log($(obj).val());
                self.grid.getPage(1);
            })
            .init();
        common.ui.cascading('#devSelectCategory1', false)
            .on('change', function (obj) {
                console.log($(obj).val())
                self.grid.getPage(1);
            })
            .init();
    },
    chart: false,
    initChart: function () {
        var self = this;
        var chartType = 'bar';
        if(self.stDiv != 'product') {
            self.chart = common.util.getChart($('#devChartDetail'), chartType);
        }
    },
    setChart: function () {
        var self = this;

        var chartData = {labels: [], datasets: []};
        //console.log(self.gridData.list);
        var datasetsData = [];
        $.each(self.gridData.list, function (listKey, list) {

            $.each(list, function (key, data) {
                //console.log(key)
                if (key == 'type_text') {
                    chartData.labels.push(self.getBasicColumnFormatter(data));
                }
                if(key == 'refund_price' ){
                    // console.log(data)
                    datasetsData.push(data);
                }

            });

        });
        var color = common.util.getChartColor(0);
        chartData.datasets.push({
            label: '환불금액'
            , borderColor: color
            , backgroundColor: color
            , data: datasetsData
            , fill: false
        });

        console.log(chartData)
        self.chart.config.data = chartData;
        self.chart.update();
    },
    getBasicColumnFormatter: function (value) {
        return value;
    },
    run: function() {
        var self = this;
        self.stDiv = $("[name=st_div").val();
        self.initLang();
        self.initPagingGrid();
        self.initCascading();
        self.initChart();
    }
}

$(function(){
    devStatisticsRefundStatisticsDetailObj.run();
});