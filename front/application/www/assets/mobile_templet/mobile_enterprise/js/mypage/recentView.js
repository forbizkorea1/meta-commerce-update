"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMypageRecentView = {
    initLang: function () {
        common.lang.load('recentview.delete.confirm', "선택한 상품을 삭제하시겠습니까?"); //Confirm_12
        common.lang.load('recentview.delete.alert', "삭제할 상품을 선택해 주세요."); //Alert_47
        common.lang.load('recentview.fail.alert', "삭제 처리에 실패했습니다.");
    },
    initList: function () {
        var myRecentList = common.ajaxList();

        myRecentList.setContainerType('div')
                .setRemoveContent(false)
                .setLoadingTpl('#devRecentViewLoading')
                .setListTpl('#devRecentViewList')
                .setEmptyTpl('#devRecentViewEmpty')
                .setContainer('#devRecentViewContent')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devRecentViewForm')
                .setUseHash(false)
                .setController('recentView', 'mypage')
                .init(function (data) {
                    if (data.data.list.length > 0) {
                        $('#devRecentViewSelector').show();
                    } else {
                        $('#devRecentViewSelector').hide();
                    }
                    myRecentList.setContent(data.data.list, data.data.paging);
                });


        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            myRecentList.getPage(pageNum);
            
            return false;
        });

        // 관심상품 일괄삭제
        $('#devBtnDelRecent').on('click', function () {
            // 선택된 상품 ID 조회
            var searchIDs = $("#devRecentViewContent input:checkbox:checked").map(function () {
                return $(this).val();
            }).get();

            // 선택된 최근 본 상품이 있는가?
            if (searchIDs.length === 0) {
                common.noti.alert(common.lang.get("recentview.delete.alert"));
                return false;
            } else {
                // 삭제 확인
                common.noti.confirm(common.lang.get('recentview.delete.confirm'), function () {
                    // 삭제 처리
                    common.ajax(
                        common.util.getControllerUrl('deleteRecentView', 'mypage'),
                        {"recentList": searchIDs},
                        function () {
                            return searchIDs.length > 0;
                        },
                        function (response) {
                            if (response.result == "success") {
                                myRecentList.reload();
                            } else {
                                common.noti.alert(common.lang.get("recentview.fail.alert"));
                            }
                        }
                    );
                });
            }

            return false;
        });

        // $('#all-check').on('click', function () {
        //     var ck = $(this).is(':checked');

        //     console.log(ck)

        //     if (ck) {
        //         $(this).prop('checked', false);
        //         $("#devRecentViewContent input[name=recentList\\[\\]]").prop('checked', true);
        //     }
        //     else {
        //         $(this).prop('checked', true);
        //         $("#devRecentViewContent input[name=recentList\\[\\]]").prop('checked', false);
        //     }

        //     return false;
        // });
    },
    run: function () {
        var self = this;
        
        self.initLang();
        self.initList();
    }
}

$(function () {
    devMypageRecentView.run();
});