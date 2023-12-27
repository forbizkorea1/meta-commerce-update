"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductBatchChangeStatusObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.thum_image_src', '상품이미지');
        common.lang.load('grid.label.brandText', '브랜드명');
        common.lang.load('grid.label.pname', '상품명');
        common.lang.load('grid.label.id', '상품코드');
        common.lang.load('grid.label.pcode', '관리코드');
        common.lang.load('grid.label.listprice', '정가');
        common.lang.load('grid.label.sellprice', '판매가');
        common.lang.load('grid.label.coprice', '공급가');
        common.lang.load('grid.label.wholesale_price', '도매가');
        common.lang.load('grid.label.wholesale_sellprice', '도매판매가');
        common.lang.load('grid.label.stateText', '판매상태');
        common.lang.load('grid.label.dispText', '노출여부');
        common.lang.load('grid.label.sellDate', '판매기간');
        common.lang.load('grid.label.regdate', '등록일');
        common.lang.load('grid.label.editdate', '수정일');
        common.lang.load('grid.label.act', '관리');


        common.lang.load('modify.not.date.alert', '판매기간을 입력해주세요.');
        common.lang.load('date.compare.not.alert', '종료일은 시작일보다 이전일 수 없습니다.');
        common.lang.load('batch.change.success.alert', '선택한 값으로 일괄 변경되었습니다.');
        common.lang.load('select.not.ids.alert', '목록에서 일괄 변경할 항목을 선택해 주세요.');
    },
    listGrid: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 생성
        var grid = common.ui.grid();
        self.listGrid = grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: true,
            columns: [
                {
                    key: "thum_image_src",
                    label: common.lang.get('grid.label.thum_image_src'),
                    align: 'center',
                    width: 75,
                    formatter: function () {
                        return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.image_src + '" height="30" /></div>';
                    }
                },
                {key: "brandText", label: common.lang.get('grid.label.brandText'), width: 100},
                {key: "pname", label: common.lang.get('grid.label.pname'), width: 150},
                {
                    key: "id",
                    label: common.lang.get('grid.label.id'),
                    width: 80,
                    align: 'center'
                },
                {key: "pcode", label: common.lang.get('grid.label.pcode'), width: 120},
                {
                    key: "listprice",
                    label: common.lang.get('grid.label.listprice'),
                    width: 100,
                    formatter: 'money',
                    align: 'right'
                },
                {
                    key: "sellprice",
                    label: common.lang.get('grid.label.sellprice'),
                    width: 100,
                    formatter: 'money',
                    align: 'right'
                },
                {
                    key: "coprice",
                    label: common.lang.get('grid.label.coprice'),
                    width: 100,
                    formatter: 'money',
                    align: 'right'
                },
                {
                    key: "wholesale_price",
                    label: common.lang.get('grid.label.wholesale_price'),
                    width: 100,
                    formatter: 'money',
                    align: 'right'
                },
                {
                    key: "wholesale_sellprice",
                    label: common.lang.get('grid.label.wholesale_sellprice'),
                    width: 100,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "stateText", label: common.lang.get('grid.label.stateText'), width: 100, align: 'center'},
                {key: "dispText", label: common.lang.get('grid.label.dispText'), width: 80, align: 'center'},
                {key: "sellDate", label: common.lang.get('grid.label.sellDate'), width: 150, align: 'left'},
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 130, align: 'center'},
                {key: "editdate", label: common.lang.get('grid.label.editdate'), width: 130, align: 'center'},
                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 70, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        self.listGrid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('get', 'batchChangeStatus', 'product'))
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                grid.setContent(response.data.list, response.data.paging);
            });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            location.href = common.util.getControllerUrl(self.listGrid.getRow($(this).data('idx')).id, 'manageProduct', 'product');
            return false;
        });

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            self.listGrid.excelDown(common.util.getControllerUrl('dwn', 'batchChangeStatus', 'product'));
        });
    },
    initBatch: function () {
        common.ui.datePicker($('#devBetweenD' + 'atePickerStartBatch'), {
            endTartget: $('#devBetweenDatePickerEndBatch')
            , timepicker: false
        });
        common.ui.datePicker($('#devBetweenDatePickerEndBatch'), {
            startTartget: $('#devBetweenDatePickerStartBatch')
            , timepicker: false
        });
        common.ui.quickDate('-', $('#devQuickBetweenDateBatch'), {
            startTartget: $('#devBetweenDatePickerStartBatch')
            , endTartget: $('#devBetweenDatePickerEndBatch')
        });

        $('input[name=batchType]').on('click', function () {
            if ($('input[name=batchType]:checked').val() == 'is_sell_date') {
                $('#isSellDateBatchTr1').show();
                $('#isSellDateBatchTr2').show();
                $('#stateBatchTr').hide();
                $('#dispBatchTr').hide();
                $('input[name=startDateBatch]').attr('disabled', false);
                $('input[name=endDateBatch]').attr('disabled', false);
                $('input[name=stateBatch]').attr('disabled', true);
                $('input[name=dispBatch]').attr('disabled', true);
            } else if ($('input[name=batchType]:checked').val() == 'state') {
                $('#isSellDateBatchTr1').hide();
                $('#isSellDateBatchTr2').hide();
                $('#stateBatchTr').show();
                $('#dispBatchTr').hide();
                $('input[name=startDateBatch]').attr('disabled', true);
                $('input[name=endDateBatch]').attr('disabled', true);
                $('input[name=stateBatch]').attr('disabled', false);
                $('input[name=dispBatch]').attr('disabled', true);
            } else if ($('input[name=batchType]:checked').val() == 'disp') {
                $('#isSellDateBatchTr1').hide();
                $('#isSellDateBatchTr2').hide();
                $('#stateBatchTr').hide();
                $('#dispBatchTr').show();
                $('input[name=startDateBatch]').attr('disabled', true);
                $('input[name=endDateBatch]').attr('disabled', true);
                $('input[name=stateBatch]').attr('disabled', true);
                $('input[name=dispBatch]').attr('disabled', false);
            }
        })
    },
    initForm: function () {
        var $form = $('#devModifyForm');

        // 입력/수정폼 설정
        common.form.init($form, common.util.getControllerUrl('put', 'batchChangeStatus', 'product'),
            function (formData) {
                var ids = devProductBatchChangeStatusObj.listGrid.getList('selected', ['id']);
                if ($('input[name=batchType]:checked').val() == 'is_sell_date') {
                    if ($('input[name=isSellDateBatch]:checked').val() == '1') {
                        if ($('input[name=startDateBatch]').val() == false || $('input[name=endDateBatch]').val() == false) {
                            common.noti.alert(common.lang.get('modify.not.date.alert'));
                            return false;

                        } else {
                            if ($('input[name=startDateBatch]').val() > $('input[name=endDateBatch]').val()) {
                                common.noti.alert(common.lang.get('date.compare.not.alert'));
                                return false;
                            }
                        }
                    }
                }
                if (ids == false) {
                    common.noti.alert(common.lang.get('select.not.ids.alert'));
                    return false;
                }
                // 선택 항목명 데이터
                formData.push(common.form.makeData('ids', ids));
                return formData;
            }, function (response) {
                if (response.result == 'success') {
                    common.noti.alert(common.lang.get('batch.change.success.alert'));
                    location.reload();
                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    initTab: function () {
        var self = this;
        common.ui.tap($('#devTap'), function (selector) {
            if (selector == '#devSale') {
                $("input[name='state[]']").val(1);
                self.initPagingGrid();

                $.each($("input[name='stateBatch']"), function (i) {
                    if ($("input[name='stateBatch']").eq(i).val() == 1) {
                        $("input[name='stateBatch']").eq(i).attr('checked', true);
                    } else {
                        $("input[name='stateBatch']").eq(i).attr('checked', false);
                    }
                })
            } else if (selector == '#devSoldOut') {
                $("input[name='state[]']").val(0);
                self.initPagingGrid();

                $.each($("input[name='stateBatch']"), function (i) {
                    if ($("input[name='stateBatch']").eq(i).val() == 0) {
                        $("input[name='stateBatch']").eq(i).attr('checked', true);
                    } else {
                        $("input[name='stateBatch']").eq(i).attr('checked', false);
                    }
                })
            }

            if($("#devFixMenuBtn").hasClass("fb__fixemenu-btn--active")) {
                $("#devFixMenuBtn").trigger("click");
            }
        });
    },
    run: function () {
        this.initLang();
        this.initPagingGrid();
        this.initBatch();
        this.initForm();
        this.initTab();
    }
}

$(function () {
    devProductBatchChangeStatusObj.run();
    devProductCommonObj.run();
});