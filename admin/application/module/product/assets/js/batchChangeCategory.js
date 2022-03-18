"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductBatchChangeCategoryObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.thum_image_src', '상품이미지');
        common.lang.load('grid.label.sellerText', '셀러업체');
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
        common.lang.load('grid.label.categoryPathText', '카테고리');
        common.lang.load('grid.label.regdate', '등록일');
        common.lang.load('grid.label.editdate', '수정일');
        common.lang.load('grid.label.act', '수정');


        common.lang.load('product.select.noDate.alert', '검색기간 타입을 선택해주세요.');
        common.lang.load('category.add.not.alert', '기본변경시 카테고리는 1개만 추가 할 수 있습니다.');
        common.lang.load('batch.change.success.alert', '일괄변경 되었습니다.');
        common.lang.load('select.not.ids.alert', '변경할 항목을 목록에서 선택해주세요.');
        common.lang.load('select.not.category.alert', '일괄변경 할 카테고리를 추가해주세요.');
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
                {key: "sellerText", label: common.lang.get('grid.label.sellerText'), width: 100},
                {key: "brandText", label: common.lang.get('grid.label.brandText'), width: 100},
                {key: "pname", label: common.lang.get('grid.label.pname'), width: 150},
                {
                    key: "id",
                    label: common.lang.get('grid.label.id'),
                    width: 80,
                    align: 'center'
                },
                {key: "pcode", label: common.lang.get('grid.label.pcode'), width: 100},
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
                {
                    key: "categoryPathText",
                    label: common.lang.get('grid.label.categoryPathText'),
                    width: 100,
                    align: 'left'
                },
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 130, align: 'center'},
                {key: "editdate", label: common.lang.get('grid.label.editdate'), width: 130, align: 'center'},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 80, formatter: function () {
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
            .setUrl(common.util.getControllerUrl('get', 'batchChangeCategory', 'product'))
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.listGrid.setContent(response.data.list, response.data.paging);
            });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            location.href = common.util.getControllerUrl(self.listGrid.getRow($(this).data('idx')).id, 'manageProduct', 'product');
            return false;
        });

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.listGrid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            self.listGrid.excelDown(common.util.getControllerUrl('dwn', 'batchChangeCategory', 'product'));
        });
    },

    selectCategoryBottom: false,
    initSelectCategoryBottom: function () {
        //카테고리 선택
        this.selectCategoryBottom = common.ui.selectCategory();
        this.selectCategoryBottom
            .setMode('add')
            .setDiv('buttom')
            .init($('#devSelectCategoryBottom'));

        $('input[name=basicTypeBatch]').on('click', function (e) {
            if ($('input[name=basicTypeBatch]:checked').val() == 0) {
                $('#basicTypeRadio').show();
                $('#basicTypeRadio').attr('disabled', false);

                if ($('input[name=productRelationBatch]:checked').val() == 3) {
                    $('#devSelectCategoryBottom').hide();
                } else {
                    $('#devSelectCategoryBottom').show();
                }
            } else {
                $('#basicTypeRadio').hide();
                $('#basicTypeRadio').attr('disabled', true);

                $('#devSelectCategoryBottom').show();
            }
        });

        $('.devAddSearchProductCategoryButton').on('click', function (e) {
            if ($('input[name=basicTypeBatch]:checked').val() == 1) {
                if ($('.devAddSearchProductCategoryRow').length > 1) {
                    e.preventDefault();
                    $('.devAddSearchProductCategoryRow:last').remove();
                    common.noti.alert(common.lang.get('category.add.not.alert'));
                    return false;
                }
            }
        });

        $('input[name=productRelationBatch]').on('click', function (e) {
            if ($('input[name=productRelationBatch]:checked').val() == 3) {
                $('#devSelectCategoryBottom').hide();
            } else {
                $('#devSelectCategoryBottom').show();
            }
        });
    },
    initForm: function () {
        var $form = $('#devModifyForm');

        // 입력/수정폼 설정
        common.form.init($form, common.util.getControllerUrl('put', 'batchChangeCategory', 'product'),
            function (formData) {
                var ids = devProductBatchChangeCategoryObj.listGrid.getList('selected', ['id']);
                if (ids == false) {
                    common.noti.alert(common.lang.get('select.not.ids.alert'));
                    return false;
                }
                if ($('.devAddSearchProductCategoryRow').length == 0 && $('input[name=productRelationBatch]:checked').val() != 3) {
                    common.noti.alert(common.lang.get('select.not.category.alert'));
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
        this.initSelectCategoryBottom();
        this.initForm();
    }
}

$(function () {
    devProductBatchChangeCategoryObj.run();
    devProductCommonObj.run();
});