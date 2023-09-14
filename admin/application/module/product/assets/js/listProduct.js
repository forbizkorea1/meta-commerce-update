"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductListProductObj = {
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
        common.lang.load('grid.label.editdate', '수정일');
        common.lang.load('grid.label.regdate', '등록일');
        common.lang.load('grid.label.act', '수정');
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
                        return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.image_src + '" height="30" onerror="this.src=\'/data/mall_data/images/product/noimg.gif\'" /></div>';
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
                {key: "stateText", label: common.lang.get('grid.label.stateText'), width: 80, align: 'center'},
                {key: "dispText", label: common.lang.get('grid.label.dispText'), width: 80, align: 'center'},
                {key: "editdate", label: common.lang.get('grid.label.editdate'), width: 130, align: 'center'},
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 130, align: 'center'},
                {
                    key: "act", label: common.lang.get('grid.label.act'), width: 80, formatter: function (data) {
                        return [
                            '<input type="button" class="fb-filter__edit devDeliveryCompanyModify" data-idx="' + this.item.__index + '" value="수정" />',
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        grid.setGrid($('#devPagingGrid'), gridConfig)
        .setUseHash(false)
        .setForm('#devGridForm')
        .setPagination('#devPageWrap')
        .setPageNum('#devPageNum')
        .setUrl(common.util.getControllerUrl('get', 'listProduct', 'product'))
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
            grid.excelDown(common.util.getControllerUrl('dwn', 'listProduct', 'product'));
        });

        //수정 버튼 이벤트
        $('[data-ax5grid-container="body"]').on('click', '.devDeliveryCompanyModify', function () {
            var row = grid.getRow($(this).data('idx'));
            window.open('/product/manageProduct/' + row.id);
        });

        $('#devFormSubmit').on('click',function () {
            $("#devPageNum").val(1);
           $('#devGridForm').submit();
        });
    },
    initForm: function () {
        //상품 검색시 다중검색 처리
        $('#devSearchProductFilterText').on('input', function () {
            $(this).val(common.util.convertMultipleSearchText($(this).val()));
        });
    },
    run: function () {
        this.initLang();
        this.initForm();
        this.initPagingGrid();
    }
}

$(function () {
    devProductCommonObj.run();
    devProductListProductObj.run();
});
