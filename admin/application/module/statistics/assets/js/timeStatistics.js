"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStatisticsTimeStatisticsObj = {
    initLang: function () {
        var self = this;
        // 글로벌 언어셋 설정

        common.lang.load('grid.label.timeArea', '시간대');
        common.lang.load('grid.label.order_cnt', '주문건수');
        common.lang.load('grid.label.order_detail_cnt', '주문상세건수');
        common.lang.load('grid.label.list_price', '판매가 합계');
        common.lang.load('grid.label.dc_price', '최종할인가 합계');
        common.lang.load('grid.label.payment_price', '결제 금액 합계');
        common.lang.load('grid.label.product_price', '상품 금액');
        common.lang.load('grid.label.cancel_price', '취소 금액');
        common.lang.load('grid.label.return_price', '반품 금액');
        common.lang.load('grid.label.sales_price', '매출액');

    },
    grid: false,
    gridData: false,
    setGridTitleBool: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 생성
        var grid = common.ui.grid();
        self.grid = grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            columns: [
                {key: "type_text", label: common.lang.get('grid.label.timeArea'), width: 120, align: 'center'},
                {key: "order_cnt", label: common.lang.get('grid.label.order_cnt'), width: 100, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
                {key: "order_detail_cnt", label: common.lang.get('grid.label.order_detail_cnt'), width: 100, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
                {key: "payment_price", label: common.lang.get('grid.label.payment_price'), width: 100, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
                {key: "product_price", label: common.lang.get('grid.label.product_price'), width: 100, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
                {key: "cancel_price", label: common.lang.get('grid.label.cancel_price'), width: 100, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
                {key: "return_price", label: common.lang.get('grid.label.return_price'), width: 100, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
                {key: "sales_price", label: common.lang.get('grid.label.sales_price'), width: 100, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }}
            ]
        };

        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUseHash(true)
            .setReadOnly(false)
            .setUrl(common.util.getControllerUrl('get', 'timeStatistics', 'statistics'))
            .init(function (response) {
                self.gridData = response.data;
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
                self.initTotalStatistics(response.data.sumData);
                //차트 그리기
                self.setChart();
            });



        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            self.grid.excelDown(common.util.getControllerUrl('dwn', 'timeStatistics', 'statistics'));
            // self.grid.excelDownAsync(common.util.getControllerUrl('dwnAsync', 'timeStatistics', 'statistics'));
            // common.util.modal.open('ajax', '엑셀다운로드 항목', '/store/excelDownList', '',
            //     '',{width: '900px', height: '540px'});
        });
    },
    initEvent: function(){
        var self = this;

        //구간선택 달력
        common.ui.dateRangePicker($('#devDateRangePicker'), {
            startDate:$('#devStartDate').val(),
            endDate:$('#devEndDate').val(),
            maxDate:$('#devLastDate').val()
        });
        //달력 날짜 적용 시 발생 이벤트
        $('#devDateRangePicker').on('apply.daterangepicker', function(ev, picker) {
            $('#devStartDate').val(picker.startDate.format('YYYY-MM-DD'));
            $('#devEndDate').val(picker.endDate.format('YYYY-MM-DD'));
            self.grid.getPage(1);
            //self.grid.formObj.submit();
        });
        //구간선택 달력

        $('#devTypeSelect').on('change',function(){
            if($(this).val()) {
                $('#devType').val($(this).val());
                self.type = $(this).val();
                self.grid.getPage(1);
                //location.replace(common.util.getControllerUrl($(this).val(), 'salesStatistics', 'statistics'));
            }
        });

        //
    },

    initTotalStatistics: function(item){
        var self = this;
        if (typeof item !== 'undefined') {
            $("#devTotalOrderCnt").html(common.util.numberFormat(item.order_cnt));
            $("#devTotalOrderDetailCnt").html(common.util.numberFormat(item.order_detail_cnt));
            $("#devTotalPaymentPrice").html(common.util.numberFormat(item.payment_price));
            $("#devTotalProductPrice").html(common.util.numberFormat(item.product_price));
            $("#devTotalCancelPrice").html(common.util.numberFormat(item.cancel_price));
            $("#devTotalSalesPrice").html(common.util.numberFormat(item.sales_price));
        }

    },
    chart: false,
    initChart: function () {
        var self = this;
        var chartType = 'line';
        self.chart = common.util.getChart($('#devChart'),chartType);
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
                if(key == 'order_cnt' ){
                     console.log(data)
                    datasetsData.push(data);
                }

            });

        });
        var color = common.util.getChartColor(0);
        chartData.datasets.push({
            label: '시간대별'
            , borderColor: color
            , backgroundColor: color
            , data: datasetsData
            , fill: false
        });

        self.chart.config.data = chartData;
        self.chart.update();
    },
    getBasicColumnFormatter: function (value) {
        return value;
    },
    run: function() {
        var self = this;
        self.initLang();
        self.initPagingGrid();
        self.initEvent();
        self.initChart();
    }
}

$(function(){
    devStatisticsTimeStatisticsObj.run();
});