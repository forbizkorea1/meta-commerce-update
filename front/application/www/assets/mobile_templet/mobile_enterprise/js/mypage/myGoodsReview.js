"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMypageMyGoodsReview = {
    myReviewLis: false,
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

            // 리뷰 리스트 init
            self.myReviewList
                .setContainerType('div')
                .setContainer('#devMyReviewContent')
                .setRemoveContent(false)
                .setListTpl('#devMyReviewList')
                .setLoadingTpl('#devMyReviewLoading')
                .setEmptyTpl('#devMyReviewEmpty')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devMyReviewForm')
                .setUseHash(true)
                .setController('myReviewList', 'mypage')
                .setScrollPage(true)
                .init(function (data) {

                    //상품후기가 1개이상일때 총갯수 노출
                    if (data.data.total > 0) {
                        $('.devTotalWrap').show();
                        $("#devTotal").text(data.data.total);
                    }

                    self.myReviewList.setContent(data.data.list, data.data.paging);

                    $(".goodsReview__list").each(function() {
                        var $this = $(this);

                        if ($this.find(".review__img__list").length == 0) {
                            $this.find(".review__img").empty();
                        }
                    });

                    // 리뷰 score width 설정 (작성자 : JDY)
                    // var $widthTarget = $('[data-width]');
                    // $widthTarget.each(function () {
                    //     var $this = $(this),
                    //         _width = $this.data('width');
                    //     $this.css('width', _width);
                    // });

                    // reviewImgSlider();
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

        $('#devBtnSearch').on('click', function () {
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

        $('#devBtnReset').on('click', function () {
            $("#devSdate").val($("#sDateDef").val());
            $("#devEdate").val($("#eDateDef").val());
            $(".jq-radio a").removeClass("on");
            $("#devDateDefault").addClass("on");
        });

        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            myReviewList.getPage(pageNum);
        });

        // 검색일 설정
        $('.devDateBtn').on('click', function () {
            $('#devSdate').val($(this).data('sdate'));
            $('#devEdate').val($(this).data('edate'));
        });


        // 후기 수정
        $('#devMyReviewContent').on('click', '.devReviewModifyBtnCls', function () {
            common.util.modal.open('ajax', '상품 후기 수정', '/shop/goodsReview?mode=modify&bbsIx=' + $(this).data('bbsidx')+'&odIx=' + $(this).data('odix'), null, function () {
                $(".fb__popup-layout").addClass("full-layer floating-btn");
                countTextLength();
            });
            // common.util.popup('/shop/goodsReview?mode=modify&bbsIx=' + $(this).data('bbsidx'), 720, 870, '상품 후기 수정');
        });

        // 후기 상세
        $('#devMyReviewContent').on('click', '.txt-area', function () {
            common.util.popup('/shop/goodsReview?mode=read&bbsIx=' + $(this).data('bbsidx'), 720, 870, '상품 후기 내역');
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