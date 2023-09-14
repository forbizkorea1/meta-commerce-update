"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

$(function () {
    $('.btn-dl-open').on('click', function () {
        $(this).parents('dl').toggleClass('on');
    });

});
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var totalSearchCnt = 0;
var search = {
    isFirstSearch: true, // 최초검색여부
    searchAjax: false, //검색리스트 리로드
    selectedCategoryPath: false, //카테고리 경로 영역
    selectedCategorySubContents: false, //카테고리 리스트 영역
    selectedContents: false, //선택 옵션(필터) 영역
    selected: false, //선택 옵션(필터) 템플릿
    isInnerSearch: false, // 결과 내 검색여부
    setCategory: function (pathId, subContentsId) {
        this.selectedCategoryPath = pathId;
        this.selectedCategorySubContents = common.ajaxList().compileTpl(subContentsId);
        return this;
    },
    setSelected: function (contentsId, selectedId) {
        this.selectedContents = contentsId;
        this.selected = common.ajaxList().compileTpl(selectedId);
        return this;
    },
    init: function () {
        var self = this;
        this.ajaxLoad(); //리스트 세팅
        this.categoryAjax(); //카테고리 세팅
        this.eventBind(); //이벤트 목록
    },
    ajaxLoad: function () { //검색리스트 ajax
        var self = this;

        self.searchAjax = common.ajaxList();
        self.searchAjax
                .setLoadingTpl('#devListLoading')
                .setListTpl('#devListDetail')
                .setEmptyTpl('#devListEmpty')
                .setContainerType('ul')
                .setContainer('#devListContents')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devListForm')
                .setUseHash(true)
                .setController('getGoodsSearchList', 'product')
                .init(function (response) {
                    // 첫번째 검색만 적용
                    if (self.isFirstSearch) {
                        self.isFirstSearch = false;

                        // 검색된 결과가 있는 경우 필터 
                        if (response.data.total > 0) {
                            $('.fb__search').addClass('hasSearch');
                        }
                    }

                    self.searchAjax.setContent(response.data.list, response.data.paging);

                    if (self.isInnerSearch) {
                        $('#devEmptyFilter').show();
                        $('#devEmptyKeyword').hide();
                    } else {
                        self.isInnerSearch = true;
                    }

                    $('#devPrdSearchTotal').html(response.data.total); //상품 검색결과 세팅
                    $('#devSearchTotal').html(Number(response.data.total)); //전체 검색결과 개수
                    lazyload();//퍼블 레이지로드 삽입
                });



        $('#devPageWrap').on('click', '.devPageBtnCls', function () { // 페이징 버튼 이벤트 설정
            self.searchAjax.getPage($(this).data('page'));
        });
    },
    categoryAjax: function (cid) { //카테고리 ajax
        var self = this;
        common.ajax(common.util.getControllerUrl('getCategorySubList', 'product'), {cid: cid}, "", function (result) {
            if (result.result == 'success') {
                var datas = result.data;
                if (datas.length > 0) { //하위 카테고리가 있을 경우 영역 비우고 하위 카테고리로 영역 재세팅
                    $('#devSubCategorysContents').empty();
                    var subContents = [];
                    for (var i = 0; i < datas.length; i++) {
                        var pathArray = []; //카테고리 경로 데이터 생성
                        for(var i2 = 0; i2 < datas[i].pathArray.length; i2++){
                            pathArray.push(datas[i].pathArray[i2].cname);
                        }

                        datas[i].path = pathArray.join(' > ');
                        subContents.push(self.selectedCategorySubContents(datas[i]));
                    }
                    $('#devSubCategorysContents').append(subContents.join(''));
                } else { //하위 카테고리가 없을 경우 영역 그대로 둠
                    $('[class*=devCategorySelect]').removeClass('on');
                    $(this).addClass('on');
                }

                $('#devSubCategorysContents').removeClass('devForbizTpl');
                $('#devSubCategorysContents').show();
                
            }
        })
    },
    eventBind: function () {
        var self = this;

        //카테고리 클릭시
        $('#devSubCategorysContents').on('click', '[class*=devCategorySelect]', function () {
            var cid = $(this).data('cid');
            var path = $(this).data('path');
            var depth = $(this).data('depth');
            $('input[name=filterCid]').val(cid);
            self.categoryAjax(cid); //카테고리 ajax 로드
            $(self.selectedCategoryPath).html(path); //카테고리 경로 영역 재설정

            //선택옵션 데이터 생성/추가 영역
            var selectedDatas = {selected: path, devFilter: 'devCategorySelect' + cid, kind: 'category', ix: cid, depth: depth};
            $(self.selectedContents).find('[class*=devCategorySelect]').remove();
            $(self.selectedContents).append(self.selected(selectedDatas));

            self.searchAjax.reload();
            $('.dl-category').addClass('on');
        });

        //무료배송 클릭시
        $('.devFreeDelivery').on('click', function () {
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                $('input[name=filterDeliveryFree]').val('');
            } else {
                $(this).addClass('on');
                $('input[name=filterDeliveryFree]').val(1);
            }

            self.searchAjax.reload();
        });

        //결과 내 재검색
        $('#devGoInsideSearch').on('click', function () {
            var val = $('.devInsideText').val();
            $('input[name=filterInsideText]').val(val);

            self.searchAjax.reload();
        });

        //브랜드 클릭
        $('[class*=devBrandSelect]').on('click', function () {
            var brandName = $(this).text();
            var selectedIx = $(this).data('ix'); //브랜드 키
            var selectedDatas = {selected: brandName, devFilter: 'devBrandSelect' + selectedIx, kind: 'brand', ix : selectedIx}; //선택 옵션(필터) 영역 설정할 정보들

            if ($(this).hasClass('on')) { //브랜드를 이미 선택했을 경우에는 재선택시 옵션(필터) 해제됨
                $(this).removeClass('on');
                $(self.selectedContents).find('.' + selectedDatas.devFilter).remove(); //선택 옵션(필터) 영역에서 삭제
            } else {
                $(this).addClass('on');
                if ($(self.selectedContents).find('.' + selectedDatas.devFilter).length == 0) {
                    $(self.selectedContents).append(self.selected(selectedDatas));
                }
            }

            //선택된 브랜드 리스트로 데이터 생성해서 form에 세팅 후 검색리스트 ajax 재로드
            var brands = $('[class*=devBrandSelect].on').map(function () {
                return $(this).data('ix');
            }).get().join(',');
            $('input[name=filterBrands]').val(brands);

            self.searchAjax.reload();
        });

        //선택 옵션(필터) 삭제시
        $('#devSelectedView').on('click', '.devRemoveSelected', function () {
            var kind = $(this).data('kind');
            var ix = $(this).data('ix');

            if (kind == 'category') { //카테고리 삭제시
                var clickCid = $('input[name=filterCid]').val();
                var parentText = $(this).parent().text();
                var delCid = delLastCategoryStep(clickCid);
                var delPaths = parentText.split(' > ');
                var depth = $(this).data('depth');

                delPaths.pop();
                delPaths = delPaths.join(' > ');

                if(delCid == '000000000000000') {
                    delCid = '';
                }

                $('input[name=filterCid]').val(delCid);

                //선택옵션 데이터 생성/추가 영역
                var selectedDatas = {selected: delPaths, devFilter: 'devCategorySelect' + delCid, kind: 'category', ix : delCid, depth : depth - 1};
                $(self.selectedContents).find('#devCategorySelect'+ ix).remove();

                if(depth != 0 ){
                    $(self.selectedContents).append(self.selected(selectedDatas));
                }

                $(self.selectedCategoryPath).html(delPaths); //카테고리 경로 영역 재설정

                self.categoryAjax(delCid); //카테고리 ajax 로드

                $('.dl-category').addClass('on');

            } else if (kind == 'brand') { //브랜드 삭제시
                var filter = $(this).parent().attr('id');
                $('.' + filter).removeClass('on');
                $(self.selectedContents).find('#devBrandSelect' + ix).remove();

                var brands = $('[class*=devBrandSelect].on').map(function () {
                    return $(this).data('ix');
                }).get().join(',');
                $('input[name=filterBrands]').val(brands);
            }

            self.searchAjax.reload();
        });

        function delLastCategoryStep(cid) {
            for(var step=4; step>=0; step--){
                var ncid = cid.substr(step * 3, 3);
                if(ncid != '000'){
                    return common.util.rpad(cid.substr(0,step * 3),15,'0');
                }
            }
            return cid;
        }

        $('.devSortTab').on("change", function(){
            $('#devSort').val($(this).val());
            self.searchAjax.getPage(1);
        });

        $('#devRefresh').on('click', function () {

            // 적용된 카테고리 필터 삭제
            self.categoryAjax(); //카테고리 ajax 로드
            $('input[name=filterCid]').val('');
            $(self.selectedCategoryPath).html('');
            $("#devFilterCategoryPath").val('');
            $('.dl-category').removeClass('on');

            // 적용된 카테고리 브랜드 삭제
            $('[class*=devBrandSelect]').removeClass("on");
            $('input[name=filterBrands]').val('');

            // 적용된 필터리스트(하위영역) 삭제.
            $('#devSelectedView li').remove();

            // 삭제된 필터로 검색리스트 리로드.
            self.searchAjax.reload();
        });

    }
}

$(function () {
    search
            .setCategory('#devCategoryPath', '#devSubCategorys')
            .setSelected('#devSelectedView', '#devSelected')
            .init();


});