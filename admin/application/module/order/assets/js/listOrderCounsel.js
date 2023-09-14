"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderListOrderCounselObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.memo.label.oid', '주문번호');
        common.lang.load('grid.memo.label.memoDivText', '분류');
        common.lang.load('grid.memo.label.memo', '메모');
        common.lang.load('grid.memo.label.memoStateText', '처리상태');
        common.lang.load('grid.memo.label.counselor', '작성자');
        common.lang.load('grid.memo.label.regdate', '작성일');
    },
    initPagingGrid: function () {
        // 그리드 생성
        var grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            columns: [
                {key: "oid", label: common.lang.get('grid.memo.label.oid'), width: 150, align: 'center', styleClass: 'fb__grid__link'},
                {key: "memoDivText", label: common.lang.get('grid.memo.label.memoDivText'), width: 150, align: 'center'},
                {key: "memo", label: common.lang.get('grid.memo.label.memo'), width: 800},
                {key: "memoStateText", label: common.lang.get('grid.memo.label.memoStateText'), width: 120, align: 'center'},
                {key: "counselor", label: common.lang.get('grid.memo.label.counselor'), width: 120, align: 'center'},
                {key: "regdate", label: common.lang.get('grid.memo.label.regdate'), width: 200, align: 'center'}
            ],
            body: {
                mergeCells: ["oid"]
            }
        };

        // 그리드 연동
        grid.setGrid($('#devPagingGrid'), gridConfig)
            .setUseHash(false)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUrl(common.util.getControllerUrl('get', 'listOrderCounsel', 'order'))
            .on('click', function (e) {
                if (e.column.key == 'oid') {
                    location.href = common.util.getControllerUrl(e.item.oid, 'manageOrder', 'order');
                }
            })
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                grid.setContent(response.data.list, response.data.paging);
            });

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            grid.formObj.submit();
        });
    },
    initEvent: function () {
        //date
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });

        //초기화
        $('#devFormReset').click(function () {
            common.form.reset($('#devGridForm'));
        });
    },
    run: function () {
        this.initLang();
        this.initPagingGrid();
        this.initEvent()
    }
}

$(function () {
    devOrderListOrderCounselObj.run();
});