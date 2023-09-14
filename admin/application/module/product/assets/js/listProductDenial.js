"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductListProductDenialObj = {
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
        common.lang.load('grid.label.regdate', '등록일');
        common.lang.load('grid.label.editdate', '수정일');
        common.lang.load('grid.label.act', '수정');

        common.lang.load('product.select.noDate.alert', '검색기간 타입을 선택해주세요.');
    },
    initPagingGrid: function () {
        // 그리드 생성
        var grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
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
                {key: "brandText", label: common.lang.get('grid.label.brandText'), width: 150},
                {key: "pname", label: common.lang.get('grid.label.pname'), width: 250},
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
        grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('get', 'listProductDenial', 'product'))
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                grid.setContent(response.data.list, response.data.paging);
            });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            window.open(common.util.getControllerUrl(grid.getRow($(this).data('idx')).id, 'manageProduct', 'product'));
            return false;
        });

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            grid.formObj.submit();
        });

        // 엑셀 다운로드 처리
        $('#devExcelDownload').on('click', function (e) {
            grid.excelDown(common.util.getControllerUrl('dwn', 'listProductDenial', 'product'));
        });
    },
    initForm: function () {
        //상품 검색시 다중검색 처리
        $('#devSearchProductFilterText').on('input', function () {
            $(this).val(common.util.convertMultipleSearchText($(this).val()));
        });

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
    initEvent: function () {
        //초기화
        $('#devFormReset').click(function () {
            $('#devGridForm').find('.devAddSearchProductCategoryRow').remove();
            common.form.reset($('#devGridForm'));
            setSearechCompany('', '');
            setSearechMd('', '');
            setSearechBrand('', '');
        });

        var setSearechBrand = function (key, text) {
            $('#devBrandIx').val(key);
            $('#devBrandText').val(text);
        }

        var setSearechMd = function (key, text) {
            $('#devMdIx').val(key);
            $('#devMdText').val(text);
        }

        var setSearechCompany = function (key, text) {
            $('#devCompanyId').val(key);
            $('#devCompanyText').val(text);
        }

        //셀러업체 팝업
        $('#devSearchCompanyPopup').click(function () {
            common.pub.open('searchCompany', function (data) {
                setSearechCompany(data.company_id, data.com_name);
            });
        });
        $('#devSearchCompanyReset').click(function () {
            setSearechCompany('', '');
        });

        //MD 팝업
        $('#devSearchMdPopup').click(function () {
            common.pub.open('searchMd', function (data) {
                setSearechMd(data.code, data.name);
            });
        });
        $('#devSearchMdReset').click(function () {
            setSearechMd('', '');
        });

        //브랜드 팝업
        $('#devSearchBrandPopup').click(function () {
            common.pub.open('searchBrand', function (data) {
                setSearechBrand(data.b_ix, data.brand_name);
            });
        });
        $('#devSearchBrandReset').click(function () {
            setSearechBrand('', '');
        });

        //저장
        $('#devFormSubmit').click(function (e) {
            e.preventDefault();

            if ($('[name="startDate"]').val() || $('[name="endDate"]').val()) {
                if ($('select[name=dateType] option:selected').val() == '') {
                    common.noti.alert(common.lang.get('product.select.noDate.alert'));
                    return false;
                }
            }

            $('#devGridForm').submit();
        });
    },
    selectCategory: false,
    initSelectCategory: function () {
        //카테고리 선택
        this.selectCategory = common.ui.selectCategory();
        this.selectCategory
            .setMode('add')
            .init($('#devSelectCategory'));
    },
    run: function () {
        this.initLang();
        this.initForm();
        this.initPagingGrid();
        this.initEvent();
        this.initSelectCategory();
    }
}

$(function () {
    devProductListProductDenialObj.run();
});