"use strict";

$(document).ready(function() {

    $('.back').click(function () {
        $('.wrap-header-search').css('display', '');
    });

    $('#icon_search').on('click', function () {
        searchLayerOpen();
    });


    /////////////////////////////////////////////////////////


    //상단검색시
    $('#devHeaderSearchButton').on('click', function () {
        goSearch();
        return false;
    });

    //상단검색 엔터처리시
    $("#devHeaderSearchText").keyup(function (e) {
        $('#devSearchCloseBtn').show();
        if (e.keyCode == 13)
            goSearch();
        return false;
    });

    //상단검색어 닫기시
    $('#devSearchCloseBtn').on('click', function () {
        $("#devHeaderSearchText").val('');
        $('#devSearchCloseBtn').hide();
    });

    //최근검색어 건별삭제시
    $('#devRecent #devRecentKeyWordDelete').on('click', function () {
        var delText = $(this).attr('devDelText');
        $(this).closest('[devDelkey]').remove();
        common.ajax(common.util.getControllerUrl('deleteRecentKeyword', 'product'), {searchText: delText}, "", function () {
            console.log($('.devRecentKeyword li').length)
            if ($('.devRecentKeyword li').length == 0) {
                $('.devRecentEmpty').show();
                $('#devRecentKeyWordDeleteAll').hide();
            }
        });
    });

    //최근검색어 전체삭제시
    $('#devRecentKeyWordDeleteAll').on('click', function () {
        $('#devRecent li').remove();
        $('#devRecentKeyWordDeleteAll').hide();
        $('.devRecentEmpty').show();
        common.ajax(common.util.getControllerUrl('deleteAllRecentKeyword', 'product'));
    });

    $('.devLogout').on('click', function(){
        signOut();
        location.href='/member/logout';
    });
});

function searchLayerOpen() {
    window.oriScroll = $(window).scrollTop();
	$('.wrap-search-layer').css({
		"display" : "block"
	});
	
    $('body').css('position', 'fixed');
	$('.clearfix').css('display','none');
}

function searchLayerClose() {
   $('.wrap-search-layer').hide();
    $('body').css('position', 'relative');
    $(window).scrollTop(window.oriScroll);
}

/////////////////////////////////////////////////////////

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
        post_to_url('/shop/search',{'searchText':searchText});
    }
    // 픽셀,GA장바구니 추가 -- did8535
    if ((typeof fbq_search_yn != "undefined") && fbq_search_yn === true) {
        fbq('track', 'Search');
    }
    return false;
}

function post_to_url(path, params, method) {
    method = method || "get";

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
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
 **/
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
            source: self.searchAutocomplete,
            delay: 0,
            open: function () {
                $('.ui-menu-item span').removeClass('ui-menu-item-wrapper');
                $('.ui-menu-item div').removeClass('ui-menu-item-wrapper');
                $(this).autocomplete("widget").css({
                    "display": "block",
                    "top": "17.33333vw",
                    "left": "0"
                });
            },
            close: function () {
                $(this).autocomplete("widget").css({
                    "display": "none",
                });
            }

        }).data('ui-autocomplete')._renderItem = function (ul, item) {
            ul.addClass("top-item");
            return $('<li></li>')
            .data("ui-autocomplete-item", item)
            .append(item.label)
            .appendTo(ul);
        };

        // $(".js__headerSearch__input")
        //     .on("focusin", function() {
        //         $(".header-search__layer").css("display", "");
        //     })
        //     .on("input", function() {
        //         var $this = $(this);
        //         var _val = $this.val();

        //         if (!_val.length) {
        //             $(".header-search__layer").css("display", "");
        //         } else {
        //             $(".header-search__layer").css("display", "none");
        //         }
        //     });
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
    if ($(".js__headerSearch__input").length > 0) {
        autoSearch.run();
    }
});