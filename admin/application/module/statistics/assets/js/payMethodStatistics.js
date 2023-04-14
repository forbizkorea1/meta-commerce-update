"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStatisticsPayMethodStatisticsObj = {
    initLang: function () {
        var self = this;
        // 글로벌 언어셋 설정

        common.lang.load('grid.label.date', '일자');
        common.lang.load('grid.label.card', '신용카드');
        common.lang.load('grid.label.vbank', '가상계좌');
        common.lang.load('grid.label.iche', '실시간 계좌이체');

    },
    grid: false,
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
                {key: "base_date", label: common.lang.get('grid.label.date'), width: 120, align: 'center'},
                {key: "method_1", label: common.lang.get('grid.label.card'), width: 120, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
                {key: "method_4", label: common.lang.get('grid.label.vbank'), width: 120, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
                {key: "method_5", label: common.lang.get('grid.label.iche'), width: 120, align: 'center', formatter: function () {
                        return common.util.numberFormat(this.value);
                    }},
            ]
        };

        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUseHash(true)
            .setReadOnly(false)
            .setUrl(common.util.getControllerUrl('get', 'payMethodStatistics', 'statistics'))
            .init(function (response) {
                if (!self.setGridTitleBool) {

                    var addColumns = [];
                    console.log(response)
                    $.each(response.data.addColumn, function (i, v) {
                        addColumns.push({key: i, label: v, width: 120, align: 'center', formatter: function () {
                                return common.util.numberFormat(this.value);
                            }});
                    });

                    //그리드 항목 그리기
                    if(addColumns.length > 0){
                        self.setGridTitleBool = true;
                        self.grid.addColumn(addColumns);
                    }
                }

                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
            });



        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            self.grid.excelDown(common.util.getControllerUrl('dwn', 'payMethodStatistics', 'statistics'));
            // self.grid.excelDownAsync(common.util.getControllerUrl('dwnAsync', 'payMethodStatistics', 'statistics'));
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
    run: function() {
        var self = this;
        self.initLang();
        self.initPagingGrid();
        self.initEvent();
    }
}

$(function(){
    devStatisticsPayMethodStatisticsObj.run();
});