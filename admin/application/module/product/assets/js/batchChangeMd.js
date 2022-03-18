"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductBatchChangeMdObj = {
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
        common.lang.load('grid.label.mdText', '담당자ID/이름');
        common.lang.load('grid.label.regdate', '등록일');
        common.lang.load('grid.label.editdate', '수정일');
        common.lang.load('grid.label.act', '관리');

        common.lang.load('modify.not.select.alert', '담당자를 선택해주세요.');
        common.lang.load('batch.change.success.alert', '일괄변경 되었습니다.');
        common.lang.load('select.not.ids.alert', '변경할 항목을 목록에서 선택해주세요.');
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
                {key: "brandText", label: common.lang.get('grid.label.brandText'), width: 120},
                {key: "pname", label: common.lang.get('grid.label.pname'), width: 200},
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
                {key: "mdText", label: common.lang.get('grid.label.mdText'), width: 100, align: 'center'},
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 130, align: 'center'},
                {key: "editdate", label: common.lang.get('grid.label.editdate'), width: 130, align: 'center'},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 70, formatter: function () {
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
        .setUrl(common.util.getControllerUrl('get', 'batchChangeMd', 'product'))
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
            grid.excelDown(common.util.getControllerUrl('dwn', 'batchChangeMd', 'product'));
        });
    },
    initBatch: function () {
        common.ui.datePicker($('#devBetweenD' + 'atePickerStartBatch'), {
            endTartget: $('#devBetweenDatePickerEndBatch')
        });
        common.ui.datePicker($('#devBetweenDatePickerEndBatch'), {
            startTartget: $('#devBetweenDatePickerStartBatch')
        });
        common.ui.quickDate('-', $('#devQuickBetweenDateBatch'), {
            startTartget: $('#devBetweenDatePickerStartBatch')
            , endTartget: $('#devBetweenDatePickerEndBatch')
        });

        var setSearechMd = function (key, text) {
            $('#devMdIxBatch').val(key);
            $('#devMdTextBatch').val(text);
        }

        //MD 팝업
        $('#devSearchMdPopupBatch').click(function () {
            common.pub.open('searchMd', function (data) {
                setSearechMd(data.code, data.name);
            });
        });

        $('#devSearchMdResetBatch').click(function () {
            setSearechMd('', '');
        });

    },
    initForm: function () {
        var $form = $('#devModifyForm');

        // 입력/수정폼 설정
        common.form.init($form, common.util.getControllerUrl('put', 'batchChangeMd', 'product'),
            function (formData) {
                var ids = devProductBatchChangeMdObj.listGrid.getList('selected', ['id']);
                if ($('#devMdTextBatch').val() == false) {
                    common.noti.alert(common.lang.get('modify.not.select.alert'));
                    return false;
                }
                if (ids == false) {
                    common.noti.alert(common.lang.get('select.not.ids.alert'));
                    return false;
                }
                // 선택 항목명 데이터
                formData.push(common.form.makeData('ids', ids));
                return formData;
            },
            function (response) {
                if (response.result == 'success') {
                    common.noti.alert(common.lang.get('batch.change.success.alert'));
                    location.reload();
                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    run: function () {
        this.initLang();
        this.initPagingGrid();
        this.initBatch();
        this.initForm();
    }
}

$(function () {
    devProductBatchChangeMdObj.run();
    devProductCommonObj.run();
});