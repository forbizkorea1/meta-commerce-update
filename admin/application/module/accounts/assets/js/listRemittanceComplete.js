"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devAccountsListRemittanceCompleteObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.com_name', '판매자');
        common.lang.load('grid.label.com_number', '사업자등록번호');
        common.lang.load('grid.label.total_price', '총정산합계');
        common.lang.load('grid.label.taxDelivery', '과세배송비');
        common.lang.load('grid.label.taxProduct', '과세상품');
        common.lang.load('grid.label.taxFreeProduct', '면세상품');
        common.lang.load('grid.label.coprice', '공급가');
        common.lang.load('grid.label.tax', '세액');
        common.lang.load('grid.label.totalPrice', '합계');
        common.lang.load('grid.label.bank', '정산계좌');
        common.lang.load('grid.label.bankName', '은행명');
        common.lang.load('grid.label.bankOwner', '예금주');
        common.lang.load('grid.label.bankNumber', '계좌번호');
        common.lang.load('grid.label.statusText', '정산상태');
        common.lang.load('grid.label.regdate', '송금대기일자');
        common.lang.load('grid.label.ap_date', '송금완료일자');
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
            frozenColumnIndex: 3, //열고정
            columns: [
                {key: "com_name", label: common.lang.get('grid.label.com_name'), width: 120},
                {key: "com_number", label: common.lang.get('grid.label.com_number'), width: 100, align: 'center'},
                {
                    key: "total_price",
                    label: common.lang.get('grid.label.total_price'),
                    formatter: 'money',
                    width: 100,
                    align: 'right'
                },
                {
                    label: common.lang.get('grid.label.taxDelivery'),
                    columns: [
                        {
                            key: "d_tax_coprice",
                            label: common.lang.get('grid.label.coprice'),
                            formatter: 'money',
                            width: 100,
                            align: 'right'
                        },
                        {
                            key: "d_tax_price",
                            label: common.lang.get('grid.label.tax'),
                            formatter: 'money',
                            width: 100,
                            align: 'right'
                        },
                        {
                            key: "d_tax_total_price",
                            label: common.lang.get('grid.label.totalPrice'),
                            formatter: 'money',
                            width: 100,
                            align: 'right'
                        }
                    ]
                },
                {
                    label: common.lang.get('grid.label.taxProduct'),
                    columns: [
                        {
                            key: "p_tax_coprice",
                            label: common.lang.get('grid.label.coprice'),
                            formatter: 'money',
                            width: 100,
                            align: 'right'
                        },
                        {
                            key: "p_tax_price",
                            label: common.lang.get('grid.label.tax'),
                            formatter: 'money',
                            width: 100,
                            align: 'right'
                        },
                        {
                            key: "p_tax_total_price",
                            label: common.lang.get('grid.label.totalPrice'),
                            formatter: 'money',
                            width: 100,
                            align: 'right'
                        }
                    ]
                },
                {
                    label: common.lang.get('grid.label.taxFreeProduct'),
                    columns: [
                        {
                            key: "p_tax_free_price",
                            label: common.lang.get('grid.label.coprice'),
                            formatter: 'money',
                            width: 100,
                            align: 'right'
                        }
                    ]
                },
                {
                    label: common.lang.get('grid.label.bank'),
                    columns: [
                        {
                            key: "bankName",
                            label: common.lang.get('grid.label.bankName'),
                            width: 120
                        },
                        {
                            key: "bankOwner",
                            label: common.lang.get('grid.label.bankOwner'),
                            width: 100
                        },
                        {
                            key: "bankNumber",
                            label: common.lang.get('grid.label.bankNumber'),
                            width: 150
                        }
                    ]
                },
                {
                    key: "statusText",
                    label: common.lang.get('grid.label.statusText'),
                    width: 100,
                    align: 'center'
                },
                {
                    key: "regdate",
                    label: common.lang.get('grid.label.regdate'),
                    width: 130,
                    align: 'center'
                },
                {
                    key: "ap_date",
                    label: common.lang.get('grid.label.ap_date'),
                    width: 130,
                    align: 'center'
                }
            ]
        };

        // 그리드 연동
        grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUrl(common.util.getControllerUrl('get', 'listRemittanceComplete', 'accounts'))
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                grid.setContent(response.data.list, response.data.paging);
            });

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            grid.excelDown(common.util.getControllerUrl('dwn', 'listRemittanceComplete', 'accounts'));
        });
    },
    initEvent: function () {
        //초기화
        $('#devFormReset').click(function () {
            common.form.reset($('#devGridForm'));
        });
        var setSearechCompany = function (key, text) {
            $('#devCompanyId').val(key);
            $('#devCompanyText').val(text);
        }
        //판매자 팝업
        $('#devSearchCompanyPopup').click(function () {
            common.pub.open('searchCompany', function (data) {
                setSearechCompany(data.company_id, data.com_name);
            });
        });
        $('#devSearchCompanyReset').click(function () {
            setSearechCompany('', '');
        });

        //날짜
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
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initPagingGrid();
        self.initEvent()
    }
}

$(function () {
    devAccountsListRemittanceCompleteObj.run();
});