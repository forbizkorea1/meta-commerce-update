"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStatisticsMemberStatisticsObj = {
    pageType:false,
    initLang: function () {
        var self = this;
        // 글로벌 언어셋 설정

        common.lang.load('grid.label.all', '전체회원');
        common.lang.load('grid.label.base_date', '날짜');
        common.lang.load('grid.label.drop_cnt', '탈퇴회원');
        common.lang.load('grid.label.in_sleep', '휴면회원');
        common.lang.load('grid.label.out_sleep', '휴면해지회원');
    },
    grid: false,
    setGridTitleBool: false,
    gridData: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 생성
        var grid = common.ui.grid();
        self.grid = grid;
        // 그리드 설정
        if(self.pageType == 'drop'){

            var gridConfig = {
                showLineNumber: true,
                columns: [
                    {key: "base_date", label: common.lang.get('grid.label.base_date'), width: 120},
                    {key: "drop_cnt", label: common.lang.get('grid.label.drop_cnt'), width: 100, align: 'center'}
                ]
            };
        }else if (self.pageType == 'sleep'){
            var gridConfig = {
                showLineNumber: true,
                columns: [
                    {key: "base_date", label: common.lang.get('grid.label.base_date'), width: 120},
                    {key: "in_sleep", label: common.lang.get('grid.label.in_sleep'), width: 100, align: 'center'},
                    {key: "out_sleep", label: common.lang.get('grid.label.out_sleep'), width: 100, align: 'center'}
                ]
            };
        }else{

            var gridConfig = {
                showLineNumber: true,
                columns: [

                ]
            };
        }

        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUseHash(true)
            .setReadOnly(false)
            .setUrl(common.util.getControllerUrl('get', 'memberStatistics', 'statistics'))
            .init(function (response) {
                self.gridData = response.data;

                if(self.pageType != 'drop' && self.pageType != 'sleep' ) {
                    self.initRemoveColumn();
                    self.setGridTitleBool = true;
                    var addColumns = [];

                    $.each(response.data.addColumn, function (i, v) {
                        addColumns.push({key: i, label: v, width: 120, align: 'center'});
                    });
                    //그리드 항목 그리기
                    self.grid.addColumn(addColumns);
                }

                //차트 그리기
                if(self.pageType == 'all'){
                    self.setChart();
                }else if(self.pageType == 'sleep'){
                    self.setDoubleLineChart();
                }else{
                    self.setLineChart();
                }

                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);

                if(typeof response.data.sumData !== 'undefined'){
                    self.initTotalStatistics(response.data.sumData);
                }

            });



        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            self.grid.excelDown(common.util.getControllerUrl('dwn', 'memberStatistics', 'statistics'));
            // self.grid.excelDownAsync(common.util.getControllerUrl('dwnAsync', 'memberStatistics', 'statistics'));
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
            console.log(picker.startDate.format('YYYY-MM-DD'));
            console.log(picker.endDate.format('YYYY-MM-DD'));
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
    initRemoveColumn: function(){
        var self = this;
        var cnt = self.grid.gridObj.columns.length;
        if(cnt > 0){
            for (var i = 0; i < cnt; i++) {
                self.grid.removeColumn();
            };
        }
    },
    statisticsDetail: function (data) {
        var self = this;
        //console.log(data)
        var title = data.item.type_text + '('+ data.item.startDate +' ~ '+data.item.endDate +')'
        common.util.modal.open('ajax', title, common.util.getControllerUrl('memberStatisticsDetail', 'statistics'),
            {
                type: data.item.type
                ,type_value: data.item.type_value
                ,startDate: data.item.startDate
                ,endDate: data.item.endDate
            }
            ,
            function () {

            }, {width: '1000px', height: '600px'});
    },
    chart: false,
    initChart: function () {
        var self = this;
        var chartType = 'bar';
        if(self.pageType != 'all'){
            chartType = 'line';
        }
        self.chart = common.util.getChart($('#devChart'),chartType);
    },
    setChart: function () {
        var self = this;

        var chartData = {labels: [], datasets: []};
        //console.log(self.gridData.list)
        $.each(self.gridData.addColumn, function (i, v) {
            if (i != 'all') {
               // console.log(v)
                chartData.labels.push(v);
            }
            //datasetsData.push(data.cntSum);
        });
        $.each(self.gridData.list, function (listKey, list) {
            var datasetsData = [];
            console.log(list)
            $.each(list, function (key, data) {
                if (key != 'all') {
                    datasetsData.push(data);
                }
            });
            var color = common.util.getChartColor(listKey);
           // console.log(self.gridData.addColumn)
            chartData.datasets.push({
                label: ''
                , borderColor: color
                , backgroundColor: color
                , data: datasetsData
                , fill: false
            });
        });

        self.chart.config.data = chartData;
        self.chart.update();
    },
    setLineChart: function () {
        var self = this;

        var chartData = {labels: [], datasets: []};
        console.log(self.gridData.list);
        var datasetsData = [];
        $.each(self.gridData.list, function (listKey, list) {


            $.each(list, function (key, data) {
              //  console.log(key)
                if (key == 'base_date') {
                    chartData.labels.push(self.getBasicColumnFormatter(data));
                }
                if(key == 'all'){
                //console.log(data)
                    datasetsData.push(data);
                }

            });

        });
        var color = common.util.getChartColor(0);
        chartData.datasets.push({
            label: ''
            , borderColor: color
            , backgroundColor: color
            , data: datasetsData
            , fill: false
        });

        self.chart.config.data = chartData;
        self.chart.update();
    },
    setDoubleLineChart: function () {
        var self = this;

        var chartData = {labels: [], datasets: []};

        var datasetsData = [];
        var datasetsData2 = [];
        $.each(self.gridData.list, function (listKey, list) {

            $.each(list, function (key, data) {
                //  console.log(key)
                if (key == 'base_date') {
                    chartData.labels.push(self.getBasicColumnFormatter(data));
                }
                if(key == 'in_sleep'){
                    //console.log(data)
                    datasetsData.push(data);
                }
                if(key == 'out_sleep'){
                    //console.log(data)
                    datasetsData2.push(data);
                }

            });

        });
        var color = common.util.getChartColor(0);
        chartData.datasets.push({
            label: '휴면회원'
            , borderColor: color
            , backgroundColor: color
            , data: datasetsData
            , fill: false
        });
        var color = common.util.getChartColor(1);
        chartData.datasets.push({
            label: '휴면해제회원'
            , borderColor: color
            , backgroundColor: color
            , data: datasetsData2
            , fill: false
        });

        self.chart.config.data = chartData;
        self.chart.update();
    },
    getBasicColumnFormatter: function (value) {
        return value;

    },

    initTotalStatistics: function(item){
        var self = this;

        if(typeof item.total_cnt !== 'undefined'){
            $("#devTotalCnt").html(common.util.numberFormat(item.total_cnt));
        }
        if(typeof item.in_total !== 'undefined'){
            $("#devInTotalCnt").html(common.util.numberFormat(item.in_total));
        }
        if(typeof item.out_total !== 'undefined'){
            $("#devOutTotalCnt").html(common.util.numberFormat(item.out_total));
        }



    },
    run: function() {
        var self = this;
        self.type = $('#devTypeSelect option:selected').val();
        self.pageType = $('input[name=st_div]').val();
        self.initLang();
        self.initPagingGrid();
        self.initEvent();
        self.initChart();
    }
}

$(function(){
    devStatisticsMemberStatisticsObj.run();
});