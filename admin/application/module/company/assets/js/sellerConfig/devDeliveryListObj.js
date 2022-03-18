"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devDeliveryListObj = {    
    grid: false,
    tapListDeliveryTemplateGrid: function () {
        var self = this;
        self.grid = common.ui.grid();
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [
                {key: "template_name", label: common.lang.get('grid.label.template_name'), width: 280, align: "left"},
                {key: "product_sell_type", label: common.lang.get('grid.label.product_sell_type'), width: 100, align: "center"},
                {key: "delivery_basic_policy", label: common.lang.get('grid.label.delivery_basic_policy'), width: 100, align: "center"},
                //{key: "delivery_relation", label: common.lang.get('grid.label.delivery_relation'), width: 120, align: "center"},
                {key: "delivery_policy", label: common.lang.get('grid.label.delivery_policy'), width: 300, align: "left"},

                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" />'
                        ].join('');
                    }
                }

            ]
        };
        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
                .setForm('#devGridForm')
                .setPagination('#devPageWrapTamplate')
                .setPageNum('#devPageNum')
                .setUrl(common.util.getControllerUrl('get', 'listDeliveryTemplate', 'seller'))
                .setUseHash(false)
                .init(function (response) {
                    $('#devTotalTemplate').text(common.util.numberFormat(response.data.total));
                    self.grid.setContent(response.data.list, response.data.paging);
                });
        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.grid.getRow($(this).data('idx'));
            var company_id = $('#devDeliveryList').find('input[name=company_id]').val();
            //  /company/manageDeliveryTemplate/
            common.util.getControllerUrl('index', 'manageDeliveryTemplate', 'seller');
            document.location.href = '/company/manageDeliveryTemplate/' + row.dt_ix+'/'+company_id;
        });

        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.template_name}))) {
                common.ajax(common.util.getControllerUrl('delTemplate', 'listDeliveryTemplate', 'seller'),
                        {dt_ix: row.dt_ix},
                        function () {
                            // 전송전 데이타 검증
                            return true;
                        },
                        function (response) {
                            // 전송후 결과 확인
                            if (response.result == 'success') {
                                self.grid.reload();
                            } else {
                                common.noti.alert(response.result);
                            }
                        }
                );
            }

        });

        //초기화
        $('#devFormReset').click(function (e) {
            common.form.reset($('#devManagePolicyForm'));
        });
    }
}
