"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStatisticsRefundStatisticsObj = {
    initLang: function () {
        var self = this;
        // 글로벌 언어셋 설정

        if(self.type == 'order_date'){
            common.lang.load('grid.label.type_text', '일자');
        }else{
            common.lang.load('grid.label.type_text', '분류명');
        }

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

            var gridConfig = {
                showLineNumber: true,
                sortable: true,
                columns: [
                    {key: "type_text", label: common.lang.get('grid.label.type_text'), width: 120,sortable: false, align: 'center', styleClass: function () {
                            return (this.item.type != 'order_date' ? 'fb__grid__edit--active' : '');
                        }},
                    {key: "cancel_cnt", label: common.lang.get('grid.label.cancel_cnt'), width: 180, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "cancel_price", label: common.lang.get('grid.label.cancel_price'), width: 180, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "return_cnt", label: common.lang.get('grid.label.return_cnt'), width: 180, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "return_price", label: common.lang.get('grid.label.return_price'), width: 180, align: 'center', formatter: function () {
                            return common.util.numberFormat(this.value);
                        }},
                    {key: "refund_price", label: common.lang.get('grid.label.refund_price'), width: 160, align: 'center', formatter: function () {
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
            .setUrl(common.util.getControllerUrl('get', 'refundStatistics', 'statistics'))
            .on('dblClick', function (data) {
                if (self.type != 'order_date') {
                    self.statisticsDetail(data);
                }
            })
            .init(function (response) {
                self.gridData = response.data;
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
                self.initTotalStatistics(response.data.sumData);

                if(self.type == 'sex' || self.type == 'payment_agent_type'){
                    //차트 그리기
                    self.setPieChart();
                }else{
                    //차트 그리기
                    self.setChart();
                }

            });



        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            self.grid.excelDown(common.util.getControllerUrl('dwn', 'refundStatistics', 'statistics'));
            //self.grid.excelDownAsync(common.util.getControllerUrl('dwnAsync', 'refundStatistics', 'statistics'));
            //common.util.modal.open('ajax', '엑셀다운로드 항목', '/store/excelDownList', '',
            //    '',{width: '900px', height: '540px'});
        });
    },
    initTotalStatistics: function(item){
        var self = this;
        if (typeof item !== 'undefined') {
            $("#devTotalCancelCnt").html(common.util.numberFormat(item.cancel_cnt));
            $("#devTotalCancelRefundPrice").html(common.util.numberFormat(item.cancel_price));
            $("#devTotalReturnCnt").html(common.util.numberFormat(item.return_cnt));
            $("#devTotalReturnRefundPrice").html(common.util.numberFormat(item.return_price));
            $("#devTotalRefundPrice").html(common.util.numberFormat(item.refund_price));
        }

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
            var sDate = picker.startDate.format('YYYY-MM-DD');
            var eDate = picker.endDate.format('YYYY-MM-DD');
            $('#devStartDate').val(sDate);
            $('#devEndDate').val(eDate);
            // console.log(picker.startDate.format('YYYY-MM-DD'));
            // console.log(picker.endDate.format('YYYY-MM-DD'));
            self.grid.getPage(1);
            self.initChangeDate(sDate,eDate);
            //self.grid.formObj.submit();
        });
        //구간선택 달력

        $('#devTypeSelect').on('change',function(){
            if($(this).val()) {
                $('#devType').val($(this).val());
                self.type = $(this).val();
                self.initUpdateGridColumn();
                self.grid.getPage(1);
                //location.replace(common.util.getControllerUrl($(this).val(), 'salesStatistics', 'statistics'));
            }
        });

        self.initUpdateGridColumn();
        //
    },
    initChangeDate: function(sDate,eDate){
        var self = this;
        common.ajax(
            common.util.getControllerUrl('putChangeSearchDate', 'salesStatistics', 'statistics'),
            {
                startDate: sDate,
                endDate: eDate
            },
            function () {
                return true;
            },
            function (response) {

            }
        );
    },
    initUpdateGridColumn: function(){
        var self = this;
        self.type = $('#devTypeSelect option:selected').val();
        if(self.type == 'order_date'){
            self.grid.updateColumn({key: "type_text", label: "일자", align:'center',sortable: false, styleClass: function () {
                    return (this.item.type != 'order_date' ? 'fb__grid__edit--active' : '');
                }}, 0);
        }else{
            self.grid.updateColumn({key: "type_text", label: "분류명", align:'center',sortable: false, styleClass: function () {
                    return (this.item.type != 'order_date' ? 'fb__grid__edit--active' : '');
                }}, 0);
        }
    },
    statisticsDetail: function (data) {
        var self = this;
        //console.log(data)
        // var title = data.item.type_text + '('+ data.item.startDate +' ~ '+data.item.endDate +')';
        var title = data.item.type_text + ' 일별 환불통계';
        common.util.modal.open('ajax', title, common.util.getControllerUrl('refundStatisticsDetail', 'statistics'),
            {
                type: data.item.type
                ,type_value: data.item.type_value
                ,startDate: data.item.startDate
                ,endDate: data.item.endDate
                ,stDiv: self.stDiv
            }
            ,
            function () {

            }, {width: '1000px', height: '600px'});
    },
    chart: false,
    pieChart: false,
    removeChart: function(){
        var self = this;

        $('#devChart').remove(); // this is my <canvas> element
        $('.devChartArea').append('<canvas id="devChart"><canvas>');
    },
    setPieChart: function () {
        var self = this;
        self.removeChart();
        self.pieChart = common.util.getPieChart($('#devChart'),'pie');
        var chartData = {labels: [], datasets: []};
        //console.log(self.gridData.list);

        var datasetsData = {data: [], color: []};
        $.each(self.gridData.list, function (listKey, list) {
            //console.log(list)
            $.each(list, function (key, data) {
                // console.log(data)
                if (key == 'type_text') {
                    chartData.labels.push(self.getBasicColumnFormatter(data));
                }
                if(key == 'refund_price' ){
                    // console.log(data)
                    datasetsData.data.push(data);
                }

            });

            datasetsData.color.push(common.util.getChartColor(listKey));
        });
        //console.log(datasetsData)
        var color = common.util.getChartColor(0);
        chartData.datasets.push({
            label: chartData.labels
            , borderColor: datasetsData.color
            , backgroundColor: datasetsData.color
            , data: datasetsData.data
            , fill: false

        });
        //console.log(chartData.datasets)

        self.pieChart.config.data = chartData;
        self.pieChart.config.type = 'pie';
        self.pieChart.update();
    },
    setChart: function () {
        var self = this;

        self.removeChart();
        self.chart = common.util.getChart($('#devChart'),'bar');
        var chartData = {labels: [], datasets: []};
        //console.log(self.gridData.list);
        var datasetsData = [];
        $.each(self.gridData.list, function (listKey, list) {


            $.each(list, function (key, data) {
                console.log(key)
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
        var barThickness = self.initChartBarThickness(chartData.labels.length);
        self.chart.config.data = chartData;
        self.chart.config.type = 'bar';
        self.chart.options.scales.xAxes[0].barThickness = barThickness;
        self.chart.update();
    },
    initChartBarThickness: function(length){
        var self = this;
        var labelCount = length;

        var maxBarThickness = 700; // 최대 막대 두께를 설정
        // 최대 막대 두께를 라벨 개수로 나누어서 평균 막대 두께를 계산
        var avgBarThickness = Math.floor(maxBarThickness / labelCount);
        // 최소 막대 두께를 설정
        var minBarThickness = 7;
        // 막대 두께가 최소값보다 작으면 최소값으로 설정
        var barThickness = Math.max(minBarThickness, avgBarThickness);
        if(barThickness > 40){
            barThickness = 40;
        }

        return barThickness;
    },
    getBasicColumnFormatter: function (value) {
        return value;
    },
    run: function() {
        var self = this;
        self.type = $('#devTypeSelect option:selected').val();
        self.stDiv = $("[name=st_div").val();
        self.initLang();
        self.initPagingGrid();
        self.initEvent();
    }
}

$(function(){
    devStatisticsRefundStatisticsObj.run();
});