"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMypageWishlist = {
    initLang: function () {
        common.lang.load('wishlist.delete.confirm', "선택한 상품을 삭제하시겠습니까?"); //Confirm_12
        common.lang.load('wishlist.delete.alert', "삭제할 상품을 선택해 주세요."); //Confirm_12
    },
    initList: function () {
        var myWishList = common.ajaxList();

        myWishList.setContainerType('li')
                .setUseHash(false)
                .setRemoveContent(false)
                .setContainer('#devMyWishContent')
                .setEmptyTpl('#devMyWishEmpty')
                .setLoadingTpl('#devMyWishLoading')
                .setListTpl('#devMyWishList')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devMyWishForm')
                .setController('myWishList', 'mypage')
                .setScrollPage(true)
                .init(function (data) {
                    // 상품 상태 sale:판매, soldout:일시품절, stop:판매중지
                    if (data.data.list.length > 0) {
                        $("#devTopButton").show();
                    } else {
                        $("#devTopButton").hide();
                    }
                    myWishList.setContent(data.data.list, data.data.paging);
                });

        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            myWishList.getPage(pageNum);

            return false;
        });

        // 관심상품 일괄삭제
        $('#devBtnDelWish').on('click', function () {

            var searchIDs = $("#devMyWishContent input:checkbox:checked").map(function () {
                return $(this).val();
            }).get();

            if (searchIDs == "") {
                common.noti.alert(common.lang.get("wishlist.delete.alert"));
                return false;
            } else {

                if (common.noti.confirm(common.lang.get('wishlist.delete.confirm'))) {
                    common.ajax(
                            common.util.getControllerUrl('deleteMyWishList', 'mypage'),
                            {wishList: searchIDs},
                            function () {},
                            function (response) {
                                if (response.result == "success") {
                                    myWishList.reload();
                                } else {
                                    common.noti.alert('system error');
                                }
                            }
                    );
                }
            }

            return false;
        });
    },
    run: function () {
        var self = this;

        self.initLang();
        self.initList();
    }
};

$(function () {
    devMypageWishlist.run();
});