"use strict";

$(document).ready(function () {
    // $('.header-subbanner.flexslider').flexslider({
    //     animation: "slide",
    //     direction: "vertical",
    //     controlNav: false,
    //     directionNav: true
    // });
    //
    // // 검색레이어영역 제외 클릭 시 검색 레이어 닫기
    // $('body').on('click', function(e){
    //     var container = $(".search-area");
    //
    //     if (!container.is(e.target) && container.has(e.target).length === 0){
    //         searchLayerClose();
    //     }
    // });

    //윈도우 창 resize 시
    // $(window).on('resize', function () {
    //     var window_w = $(window).width();
    //     if (window_w > 1700) {
    //         $('.search').css("display", "none");
    //         $('.search').find('form').css("display", "none");
    //     } else {
    //         $('.wrap-search-layer').css("display", "none");
    //     }
    // });

    // $('#devHeaderSearchText').on('click', function (e) {
    //     searchLayerOpen();
    // });

    // $('.wrap_right_menu .flexslider').flexslider({
    //     animation: "slide",
    //     controlNav: false,
    //     slideshow: false
    // });

    $("#btnScrollTop").click(function () {
        $("html, body").animate({
            scrollTop: 0
        });
    });

    /////////////////////////////////////////////////////////


    $('#devHeaderSearchButton').on('click', function () {
        var window_w = $(window).width();
        if (window_w <= 1700) {
            $('.search').css("display", "block");
            $('.search').find('form').css("display", "block");
            return false;
        } else {
            $('.search').css("display", "none");
            $('.search').find('form').css("display", "none");
            goSearch();
        }
    });

    //상단검색 엔터처리시
    $("#devHeaderSearchText , .search_input").keyup(function (e) {
        if (e.keyCode == 13)
            goSearch();
    });

    //상단 검색 x버튼 클릭시
    $('.search_close').click(function () {
        $(this).parents('.search').css("display", "none");
    });
    $('.search_txt_clear').on('click', function () {
        $('.search_input').val('');
    });

    //최근검색어 건별삭제시
    $('.search-word-del').on('click', function () {
        var delText = $(this).attr('devDelText');

        $(this).closest('[devDelkey]').remove();

        common.ajax(common.util.getControllerUrl('deleteRecentKeyword', 'product'), {searchText: delText}, "", function () {
            if ($('.ul-recent-search').children().length == 0) {
                $('#tab2').html("<div class='fb__empty devRecentEmpty'><p class='fb__empty__text'>최근 검색어가 없습니다.</p></div>")
            }
        });

        return false;
    });

    //최근검색어 전체삭제시
    $('#devRecentKeyWordDeleteAll').on('click', function () {
        $('.ul-recent-search li').hide();

        common.ajax(common.util.getControllerUrl('deleteAllRecentKeyword', 'product'), {}, "", function () {
            // $('.lately').html("<div class='fb__empty devRecentEmpty'><p class='fb__empty__text'>최근 검색어가 없습니다.</p></div>")
        });
    });

    $('.devLogout').on('click', function(){
        signOut();
        location.href='/member/logout';
    });

    function goSearch() {	//검색입력 우측 검색이미지 클릭시 검색페이지 호출
        var searchText = $('#devHeaderSearchText').val();
        var searchTextLength = searchText.length;
        var pattern = /([^가-힣|a-z|A-Z|0-9|\-|\.|\x20])/i;

        if (searchText == '') {
            if ($('#devHeaderSearchText').attr('devTagUrl')) {
                location.href = $('#devHeaderSearchText').attr('devTagUrl');
            } else {
                alert('검색어는 2글자 이상 입력해 주세요.');
                $("#devHeaderSearchText").focus();
                return false;
            }
        } else if(searchTextLength < 2) {
            alert('검색어는 2글자 이상 입력해 주세요.');
            $("#devHeaderSearchText").focus();
            return false;
        }else if (pattern.test(searchText)) {
            alert('검색어는 단어 기준으로 입력해 주세요.');
            $("#devHeaderSearchText").focus();
            return false;
        } else {
            post_to_url('/shop/search', {'searchText': searchText});
        }
        // 픽셀,GA장바구니 추가 -- did8535
        if ((typeof fbq_search_yn != "undefined") && fbq_search_yn === true) {
            fbq('track', 'Search');
        }
        return false;
    }


});

// function searchLayerOpen() {
//     $('.wrap-search-layer').show();
// }

// function searchLayerClose() {
//     $('.wrap-search-layer').hide();
// }


/////////////////////////////////////////////////////////


function post_to_url(path, params, method) {
    method = method || "get";

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", encodeURI(encodeURIComponent(params[key])));
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}

/**
 * 자동 검색 완성
 * @type type
 */
var autoSearch = {
    searchCallBack: function () {	//검색입력 우측 검색이미지 클릭시 검색페이지 호출
        var searchText = $('#devHeaderSearchText').val();
        var pattern = /([^가-힣|a-z|A-Z|0-9|\-|\.|\x20])/i;

        if (searchText == '') {
            if ($('#devHeaderSearchText').attr('devTagUrl')) {
                location.href = $('#devHeaderSearchText').attr('devTagUrl');
            } else {
                alert('검색어를 입력해 주세요.');
                $("#devHeaderSearchText").focus();
                return false;
            }
        } else {
            post_to_url('/shop/search', {'searchText': searchText});
        }
        return false;
    },
    initClick: function () {
        var self = autoSearch;
        $(document).on("click", ".top-item .ui-menu-item", function () {
            self.searchCallBack();
        });
    },
    initAuotcomplete: function () {
        var self = autoSearch;
        $(".devAutoComplete").autocomplete({
            appendTo: $('.js__autoComplete'),
            source: self.searchAutocomplete,
            delay: 0,
            open: function () {
                $('.ui-menu-item span').removeClass('ui-menu-item-wrapper');
                $('.ui-menu-item div').removeClass('ui-menu-item-wrapper');
                $(this).autocomplete("widget").css({
                    "width": "100%",
                });
            },
            close: function () {
                $(this).autocomplete("widget").css({
                    "display": "none",
                    "margin-left": "0px",
                    "margin-top": "0px"
                });
            }

        }).data('ui-autocomplete')._renderItem = function (ul, item) {
            ul.addClass("top-item");
            return $('<li></li>')
            .data("ui-autocomplete-item", item)
            .append(item.label)
            .appendTo(ul);
        };

        $(".js__headerSearch__input")
            .on("focusin", function() {
                $(".header-search__layer").css("display", "");
            })
            .on("input", function() {
                var $this = $(this);
                var _val = $this.val();

                if (!_val.length) {
                    $(".header-search__layer").css("display", "");
                } else {
                    $(".header-search__layer").css("display", "none");
                }
            });
    },
    cache: {},
    searchAutocomplete: function (req, res) {
        var self = autoSearch;
        var term = req.term;

        if (term in self.cache) {
            return res(self.cache[term]);
        } else {
            common.ajax(common.util.getControllerUrl('getAutoSearchList', 'product'),
                {searchText: req.term},
                function () {
                    // 전송전 데이타 검증
                    return true;
                },
                function (response) {
                    if (response.data && response.data.length) {
                        $(".header-search__layer").css("display", "none");
                    }

                    if (response.result == "success" && typeof response.data !== "undefined" && response.data.length > 0) {
                        self.cache[term] = response.data;
                        return res(response.data);
                    } else {
                        return res([]);
                    }
                }
            );
        }
    },
    run: function () {
        var self = this;
        //자동완성
        self.initAuotcomplete();
        self.initClick();
    }
}

$(function () {
    autoSearch.run();
});
