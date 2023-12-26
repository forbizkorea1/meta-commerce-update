"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/


/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMypageMyGoodsInquiry = {
    initList: function () {
        var myGoodsList = common.ajaxList();

        myGoodsList.commentList = myGoodsList.compileTpl('#devCommentList'); //리뷰 상세 이미지
        $('#devCommentList').text('{[{imgDetails}]}'); //setContent 에서 템플릿 사용 가능하도록 변경

        myGoodsList.setContent = function (list, paging) { // setContent 메소드 리매핑
            if (myGoodsList.scrollPage || paging && paging.cur_page == paging.last_page) {
                myGoodsList.hidePagination();
            }

            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    var items = [];

                    if (row.comments.length > 0) {  // 리뷰 댓글이 있을경우
                        for (var idx = 0; idx < row.comments.length; idx++) {
                            items.push(myGoodsList.commentList(row.comments[idx]));
                        }
                    }
                    row.cmtHtml = items.join('');
                    $(this.container).append(this.listTpl(row));
                }

                if (paging) {
                    $(this.pagination).html(common.pagination.getHtml(paging));

                    if(this.scrollPage) {
                        if(paging.last_page > paging.cur_page) {
                            this.scroll = true;
                        } else {
                            this.scroll = false;
                        }
                    }
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }
        };


        myGoodsList.setContainerType('div')
                .setContainer('#devMyGoodsContent')
                .setListTpl('#devMyGoodsList')
                .setRemoveContent(false)
                .setLoadingTpl('#devMyGoodsLoading')
                .setEmptyTpl('#devMyGoodsEmpty')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devMyGoodsForm')
                .setUseHash(false)
                .setController('myGoodsInquiryList', 'mypage')
                .setScrollPage(true)
                .init(function (data) {
                    $("#devTotal").text(data.data.total);
                    myGoodsList.setContent(data.data.list, data.data.paging);

                    //상품후기가 1개이상일때 총갯수 노출
                    if (data.data.total > 0) {
                        $('.devTotalWrap').show();
                        $("#devTotal").text(data.data.total);
                    }

                    if (data.data.total <= 10) {
                        $('#devPageWrap').hide();
                    }
                });


        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            myGoodsList.getPage(pageNum);
            $('#devPage').val(pageNum);
        });
    },
    run: function(){
        var self = this;
        
        self.initList();
    }
};

$(function () {
    devMypageMyGoodsInquiry.run();
});