"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
//상세검색열기
$('.btn-search-detail').click(function() {
    window.oriScroll = $(window).scrollTop();
    $('.layer-search-detail').show();
    $('.wrap-search-detail').removeClass('slide-out');
    $('.wrap-search-detail').addClass('slide-in');
    $('body').css('position' , 'fixed').css("height",$(window).height()).css("overflow","hidden");
});

//상세검색 레이어 닫기
function searchDetailClose() {
    $('.wrap-search-detail').removeClass('slide-in');
    $('.wrap-search-detail').addClass('slide-out');
    $('.layer-search-detail').fadeOut();
    $('body').css('position' , '').css("height","auto").css("overflow","");
    $(window).scrollTop(window.oriScroll);
}

//선택 브랜드 카운트 체크
//{brandCnt}개
function brandCount() {
    $('.devBrandCount').html($('[class*=devBrandSelect]:checked').length +'개');
}

$('.layer-search-detail .dim').click(function() {
    searchDetailClose();
});

$(".category__list dt").on("click", function() {
    var $this = $(this);

    if (!$this.closest(".category__list").hasClass("js--open")) {
        $this.closest(".category__list").addClass("js--open");
    } else {
        $this.closest(".category__list").removeClass("js--open");
    }
});

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/

var search = {
    isFirstSearch: true, // 최초검색여부
    seachAjax: false, //검색리스트 리로드
    selectedCategoryPath: false, //카테고리 경로 영역
    selectedCategorySubContents: false, //카테고리 리스트 영역
    selectedContents: false, //선택 옵션(필터) 영역
    selected: false, //선택 옵션(필터) 템플릿
    isInnerSearch: false, // 결과 내 검색여부
    init: function () {
        var self = this;
        this.ajaxLoad(); //리스트 세팅
        this.eventBind(); //이벤트 목록
    },
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
    ajaxLoad: function () { //검색리스트 ajax
        var self = this;
        self.seachAjax = common.ajaxList();
        self.seachAjax
                .setLoadingTpl('#devListLoading')
                .setListTpl('#devListDetail')
                .setEmptyTpl('#devListEmpty')
                .setContainerType('ul')
                .setContainer('#devListContents')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devListForm')
                .setUseHash(true)
                .setRemoveContent(false)
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
                    
                    self.seachAjax.setContent(response.data.list, response.data.paging);

                    if (self.isInnerSearch) {
                        $('#devEmptyFilter').show();
                        $('#devEmptyKeyword').hide();
                    } else {
                        self.isInnerSearch = true;
                    }

                    $('.devSearchTotal').html(response.data.total); //검색결과 세팅
                });

        // 페이징 버튼 이벤트 설정
        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            self.seachAjax.getPage($(this).data('page'));
        });

    },
    eventBind: function () {
        var self = this;

        //카테고리 클릭시
        $("[name=categoryList]").on("change", function() {
            var $this = $(this);
            var cid = $this.val();
            var cname = $this.data("name");
            var depth = $this.data("depth");

            $('input[name=filterCid]').val(cid);
            $('.devSearchCategoryName').text(cname);

            //선택옵션 데이터 생성/추가 영역
            var selectedDatas = {selected: cname, devFilter: 'devCategorySelect' + cid, kind: 'category', ix: cid, depth: depth};
            $(self.selectedContents).find('[class*=devCategorySelect]').remove();
            $(self.selectedContents).append(self.selected(selectedDatas));

            self.seachAjax.reload();
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

            self.seachAjax.reload();
        });

        //결과 내 재검색
        $('#devGoInsideSearch').on('click', function () {
            var val = $('.devInsideText').val();
            $('input[name=filterInsideText]').val(val);

            self.seachAjax.reload();
        });

        //상세검색 초기화
        $('.devRefresh').on('click',function() {
            //브랜드 초기화
            $('.devBrandCount').text("0개");
            $('[class*=devBrandSelect]').each(function(){
                $(this).prop('checked', false);
            });
            $('input[name=filterBrands]').val('');

            $(self.selectedContents).empty();
            
            //카테고리 초기화
            self.resetCategory();

            self.seachAjax.reload();
        });

        //브랜드 클릭
        $('[class*=devBrandSelect]').on('click', function () {
            var brandName = $(this).next().text();
            var selectedIx = $(this).data('ix'); //브랜드 키
            var selectedDatas = {selected: brandName, devFilter: 'devBrandSelect' + selectedIx, kind: 'brand'}; //선택 옵션(필터) 영역 설정할 정보들

            if ($(this).closest(".filterBrand__list").hasClass('on')) { //브랜드를 이미 선택했을 경우에는 재선택시 옵션(필터) 해제됨
                $(this).closest(".filterBrand__list").removeClass('on');
                $(self.selectedContents).find('.' + selectedDatas.devFilter).remove(); //선택 옵션(필터) 영역에서 삭제
            } else {
                $(this).closest(".filterBrand__list").addClass('on');
                if ($(self.selectedContents).find('.' + selectedDatas.devFilter).length == 0) {
                    $(self.selectedContents).append(self.selected(selectedDatas));
                }
            }
            
            self.resetBrand();

            self.seachAjax.reload();
        });

        //선택 옵션(필터) 삭제시
        $('#devSelectedView').on('click', '.devRemoveSelected', function () {
            var kind = $(this).data('kind');

            if (kind == 'category') { //카테고리 삭제시
                var clickCid = $('input[name=filterCid]').val();
                var delCid = self.delLastCategoryStep(clickCid);
                var depth = $(this).data('depth');

                if(depth != 0 ){
                    //이전 카테고리가 존재하면 필터 바꿔줌
                    var cname = $('.categoryList'+delCid).data('name');
                    var selectedDatas = {selected: cname, devFilter: 'devCategorySelect' + delCid, kind: 'category', ix : delCid, depth : depth - 1};
                    $(self.selectedContents).append(self.selected(selectedDatas));

                    //checked 컨트롤
                    $('.categoryList'+clickCid).prop('checked', 'false');
                    $('.categoryList'+delCid).prop('checked', 'true');

                    //검색 필터 세팅
                    $('input[name=filterCid]').val(delCid);
                    $('.devSearchCategoryName').text(cname);
                }else {
                    self.resetCategory(delCid);
                }

            } else if (kind == 'brand') { //브랜드 삭제시
                //브랜드 체크박스 풀기
                var brandClass = $(this).parent().attr('class').split(' ')[1];
                $('.'+brandClass).click();

                self.resetBrand();
            }

            $(this).parent().remove();//선택 옵션 삭제
            self.seachAjax.reload();
        });

        $('.devSortTab').on('change', function () {
            $('#devSort').val($(this).val());
            self.seachAjax.getPage(1);
        });
    },
    resetCategory: function () {
        $('input[name=filterCid]').val('');
        $(self.selectedCategoryPath).html('');
        $('.devSearchCategoryName').text('');
        $('input[name=categoryList]').prop('checked', false);
        $('.depth02').hide();
    },
    resetBrand: function () {
        var brands = $('[class*=devBrandSelect]:checked').map(function () {
            return $(this).data('ix');
        }).get().join(',');
        $('input[name=filterBrands]').val(brands);
        brandCount();
    },
    delLastCategoryStep: function (cid) {
        for(var step=4; step>=0; step--){
            var ncid = cid.substr(step * 3, 3);
            if(ncid != '000'){
                return common.util.rpad(cid.substr(0,step * 3),15,'0');
            }
        }
        return cid;
    }
}

$(function () {
    search
        .setSelected('#devSelectedView', '#devSelected')
        .init();
});