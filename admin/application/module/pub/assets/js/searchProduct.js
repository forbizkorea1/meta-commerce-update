"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devPubSearchProductObj = {
    initLang: function () {
        // 글로벌 언어셋 설정       
        common.lang.load('searchProduct.grid.label.image', '상품이미지');
        common.lang.load('searchProduct.grid.label.panme', '상품명');
        common.lang.load('searchProduct.grid.label.brandText', '브랜드명');
        common.lang.load('searchProduct.grid.label.id', '상품코드');
        common.lang.load('searchProduct.grid.label.pcode', '관리코드');
        common.lang.load('searchProduct.grid.label.sellprice', '가격');
        common.lang.load('searchProduct.grid.label.state', '판매상태');
        common.lang.load('searchProduct.grid.label.disp', '노출여부');
    },
    selectCategory: false,
    initSelectCategory: function () {
        //카테고리 선택
        this.selectCategory = common.ui.selectCategory();
        this.selectCategory.init($('#devSelectCategory'));
    },
    initForm: function () {
        //상품 검색시 다중검색 처리
        $('#devSearchProductFilterText').on('input', function () {
            $(this).val(common.util.convertMultipleSearchText($(this).val()));
        });
    },
    initGrid: function () {
        var self = this;
        var gridConfig = {
            height: 200,
            showRowSelector: true,
            columns: [
                {
                    key: "thum_image_src", label: common.lang.get('searchProduct.grid.label.image'), align: 'center', width: 80, formatter: function () {
                        return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.image_src + '" height="30" onerror="this.src=\'/data/mall_data/images/product/noimg.gif\'" /></div>';
                    }
                },
                {key: "pname", label: common.lang.get('searchProduct.grid.label.panme'), width: "*"},
                {key: "brandText", label: common.lang.get('searchProduct.grid.label.brandText'), width: 120},
                {key: "id", label: common.lang.get('searchProduct.grid.label.id'), align: 'center', width: 90},
                {key: "pcode", label: common.lang.get('searchProduct.grid.label.pcode'), width: 100},
                {key: "sellprice", label: common.lang.get('searchProduct.grid.label.sellprice'), width: 70, formatter: 'money', align: 'right'},
                {key: "stateText", label: common.lang.get('searchProduct.grid.label.state'), align: 'center', width: 70},
                {key: "dispText", label: common.lang.get('searchProduct.grid.label.disp'), align: 'center', width: 70}
            ]
        };

        // 검색 그리드 생성
        var searchGrid = common.ui.grid();
        searchGrid.setGrid($('#devSearchProductGrid'), gridConfig)
        .setForm('#devSearchProductGridForm')
        .setPagination('#devSearchProductPageWrap')
        .setPageNum('#devSearchProductPageNum')
        .setUseHash(false)
        .setUrl(common.util.getControllerUrl('get', 'searchProduct', 'pub'))
        .init(function (response) {
            $('#devSearchProductTotal').text(common.util.numberFormat(response.data.total));
            searchGrid.setContent(response.data.list, response.data.paging);
        }, function (formData) {
            formData.push(common.form.makeData('filterCid', self.selectCategory.getValue().cid));
            return formData
        });

        //선택 그리드 생성
        var selectGrid = common.ui.grid();
        selectGrid.setGrid($('#devSearchSelectProductGrid'), gridConfig);

        //선택목록 total
        var devSearchProductSelectTotal = function () {
            $('#devSearchProductSelectTotal').text(common.util.numberFormat(selectGrid.getList().length));
        };

        //추가
        $('#devSearchProductAddButton').click(function () {
            var data = searchGrid.getList('selected');
            if (data.length > 0) {
                var selectIdList = selectGrid.getList('', ['id']);
                var addData = [];
                $.each(data, function () {
                    if (selectIdList.indexOf(this.id) < 0) {
                        addData.push(this);
                    }
                });
                selectGrid.addContent(addData);
                devSearchProductSelectTotal();
            }
        });

        //삭제
        $('#devSearchProductSelectDeleteButton').click(function () {
            var data = selectGrid.getList('selected');
            if (data.length > 0) {
                selectGrid.deleteRow('selected');
                devSearchProductSelectTotal();
            }

            $('#devSearchSelectProductGrid [data-ax5grid-column-attr="rowSelector"]').attr("data-ax5grid-selected", false);
        });

        //저장
        $('#devSearchProductSelectButton').click(function () {
            common.pub.callbak('searchProduct', selectGrid.getList());
            common.pub.close();
        });

        //페이지 이동시
        $(document).on('click', '.wrap-pagination', function (e) {
            $('#devSearchProductGrid [data-ax5grid-column-attr="rowSelector"]').attr("data-ax5grid-selected", false);
        });
    },
    run: function () {
        this.initLang();
        this.initSelectCategory();
        this.initForm();
        this.initGrid();
    }
}

$(function () {
    devPubSearchProductObj.run();
});