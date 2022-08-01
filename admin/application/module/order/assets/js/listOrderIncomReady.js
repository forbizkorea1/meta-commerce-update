"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderListOrderIncomReadyObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.oid', '주문번호');
        common.lang.load('grid.label.order_date', '주문일자');
        common.lang.load('grid.label.buyerInfo', '주문자');
        common.lang.load('grid.label.bmobile', '주문자 휴대폰 번호');
        common.lang.load('grid.label.methodText', '결제방법');
        common.lang.load('grid.label.payment_price', '입금예정금액');
        common.lang.load('grid.label.bank', '입금은행');
        common.lang.load('grid.label.bank_account_num', '입금계좌번호');
        common.lang.load('grid.label.bank_input_date', '입금기한');
        common.lang.load('grid.label.bank_input_name', '입금자명');

        common.lang.load('change.no.select.alert', '변경할 항목을 선택해주세요.');

        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
    },
    grid: false,
    initGrid: function () {
        var self = this;
        // 그리드 생성
        self.grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: true,
            columns: [
                {key: "oid", label: common.lang.get('grid.label.oid'), width: 150, align: 'center', styleClass: 'fb__grid__link'},
                {key: "order_date", label: common.lang.get('grid.label.order_date'), width: 130, align: 'center'},
                {key: "buyerInfo", label: common.lang.get('grid.label.buyerInfo'), width: 120},
                {key: "bmobile", label: common.lang.get('grid.label.bmobile'), width: 130, align: 'center'},
                {key: "methodText", label: common.lang.get('grid.label.methodText'), width: 100, align: 'center'},
                {key: "payment_price", label: common.lang.get('grid.label.payment_price'), width: 100, formatter: 'money', align: 'right'},
                {key: "bank", label: common.lang.get('grid.label.bank'), width: 100},
                {key: "bank_account_num", label: common.lang.get('grid.label.bank_account_num'), width: 500},
                {key: "bank_input_date", label: common.lang.get('grid.label.bank_input_date'), width: 100, align: 'center'},
                {key: "bank_input_name", label: common.lang.get('grid.label.bank_input_name'), width: 100, align: 'left'}
            ]
        };

        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
                .setForm('#devGridForm')
                .setPagination('#devPageWrap')
                .setPageNum('#devPageNum')
                .setUrl(common.util.getControllerUrl('get', 'listOrderIncomReady', 'order'))
                .on('click', function (e) {
                    if (e.column.key == 'oid') {
                        location.href = common.util.getControllerUrl(e.item.oid, 'manageOrder', 'order');
                    }
                })
                .init(function (response) {
                    $('#devTotal').text(common.util.numberFormat(response.data.total));
                    self.grid.setContent(response.data.list, response.data.paging);
                });
    },
    initForm: function () {
        var self = this;
        common.form.init($('#devModifyForm'), common.util.getControllerUrl('put', 'listOrderIncomReady', 'order'), function (formData, $form) {
            var oidList = self.grid.getList('selected', ['oid']);
            if (!(oidList.length > 0)) {
                common.noti.alert(common.lang.get('change.no.select.alert'));
                return false;
            }
            formData.push(common.form.makeData('oid', oidList));
            return formData;
        }, function (response) {
            if (response.result == "success") {
                common.noti.alert(common.lang.get('common.put.success.alert'));
                self.grid.reload();
            } else {
                devChangeOrderStatusResponseObj.noti(response);
            }
        });
    },
    initEvent: function () {
        var self = this;

        //달력
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

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initForm();
        self.initGrid();
        self.initEvent()
    }
}

$(function () {
    devOrderListOrderIncomReadyObj.run();
});