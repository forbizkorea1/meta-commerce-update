"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMypageMyGoodsReview = {
    myReviewLis: false,
    reviewImgsContents: false,
    cmtTpl: false,
    initLang: function () {
        common.lang.load('myProductReview.delete.confirm', "상품 후기를 삭제하시겠습니까?"); //Confirm_34
        common.lang.load('mypage.invalidDate.alert', "날짜 형식이 잘못되었습니다.");
        common.lang.load('mypage.wrongStartDate.alert', "시작일은 종료일 보다 이후일 수 없습니다.");
        common.lang.load('mypage.wrongDateRange.alert', "최대 5년 내 내역까지만 조회 가능합니다.");
    },
    initList: function () {
        var self = devMypageMyGoodsReview;

        if (self.myReviewLis === false) {
            // REVIEW List
            self.myReviewList = common.ajaxList();
            self.cmtTpl = self.myReviewList.compileTpl('#devMyReviewCmt');

            // setContent 재정의
            self.myReviewList.setContent = function (list, paging) {
                this.removeContent();
                if (list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        var row = list[i];
                        $(this.container).append(this.listTpl(row));
                        if (row.cmt.length > 0) {
                            for(var cmtIndex = 0; cmtIndex < row.cmt.length; cmtIndex++)
                            {
                                if (row.cmt[cmtIndex].cmt_contents != '') {
                                    $(this.container).append(self.cmtTpl(row.cmt[cmtIndex]));
                                }
                            }
                        }
                    }

                    if (paging) {
                        $(this.pagination).html(common.pagination.getHtml(paging));
                    }
                } else {
                    $(this.container).append(this.emptyTpl());
                }
            };

            // 리뷰 리스트 init
            self.myReviewList
                    .setLoadingTpl('#devMyReviewLoading')
                    .setListTpl('#devMyReviewList')
                    .setEmptyTpl('#devMyReviewListEmpty')
                    .setContainerType('table')
                    .setContainer('#devMyReviewContent')
                    .setPagination('#devPageWrap')
                    .setPageNum('#devPage')
                    .setForm('#devMyReviewForm')
                    .setController('myReviewList', 'mypage')
                    .init(function (data) {
                        $("#devTotal").text(data.data.total);
                        self.myReviewList.setContent(data.data.list, data.data.paging);
                    });
        }
    },
    initEvent: function () {
        var self = devMypageMyGoodsReview;
        var myReviewList = self.myReviewList;

        $("[id^=mltab_]").on('click', function () {
            var tmp = (this.id).split("_");
            $("#devState").val(tmp['1']);
            myReviewList.getPage(1);
        });

        $('#devSearchBtn').on('click', function () {
            var endDate = common.util.dates.convert($('#devEdate').val());
            var startDate = common.util.dates.convert($('#devSdate').val());
            var maxDate = common.util.dates.convert((startDate.getFullYear() + 5) + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate());

            if (startDate != 'Invalid Date' && endDate != 'Invalid Date') {
                if (common.util.dates.compare(startDate, endDate) == 1) {
                    common.noti.alert(common.lang.get('mypage.wrongStartDate.alert'));
                    return false;
                } else if (common.util.dates.compare(endDate, maxDate) == 1) {
                    common.noti.alert(common.lang.get('mypage.wrongDateRange.alert'));
                    return false;
                }
                myReviewList.getPage(1);
            } else {
                common.noti.alert(common.lang.get('mypage.invalidDate.alert'));
            }
        });

        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            myReviewList.getPage(pageNum);
        });

        // 후기 수정
        $('#devMyReviewContent').on('click', '.devReviewModifyBtnCls', function () {
            common.util.popup('/shop/goodsReview?mode=modify&bbsIx=' + $(this).data('bbsidx')+'&odIx=' + $(this).data('odix'), 800, 800, '상품 후기 수정');
        });

        // 후기 상세

        // $('#devMyReviewContent').on('click', '.txt-area', function () {
        //     common.util.popup('/shop/goodsReview?mode=read&bbsIx=' + $(this).data('bbsidx'), 720, 870, '상품 후기 내역');
        // });

        $('#devMyReviewContent').on('click', '.txt-area', function () {
            common.util.modal.open('ajax', '상품 후기 내역', '/shop/goodsReview?mode=read&bbsIx=' + $(this).data('bbsidx') , function () {
            });
        });


        // 후기 삭제
        $('#devMyReviewContent').on('click', '.devReviewDeleteBtnCls', function () {
            var bbsidx = $(this).data('bbsidx');
            common.noti.confirm(common.lang.get('myProductReview.delete.confirm'), function () {
                common.ajax(
                        common.util.getControllerUrl('deleteMyProductReview', 'mypage'),
                        {bbsIx: bbsidx},
                        function ($form1) {
                            return true;
                        },
                        function (response) {
                            if (response.result == "success") {
                                self.myReviewList.reload();
                            } else {
                                common.noti.alert('system error');
                            }
                        }
                );
            });
        });
    },
    run: function () {
        var self = this;

        self.initLang();
        self.initList();
        self.initEvent();
    }
};


$(function () {
    devMypageMyGoodsReview.run();
});
