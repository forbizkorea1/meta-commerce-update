"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
var $document = $(document);

$document
    .on("click", ".js__photo--click", function(e) {
        var $this = $(this);
        var _src = $this.find("img").attr("src");

        if (!$this.hasClass("active")) {
            $(".photo__main img").attr("src", _src);
            $this.addClass("active").siblings().removeClass("active");
        }

        e.preventDefault();
    })

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devPhotoReviewObj = {
    pid : false,
    bbsIx : '',
    ajaxPhotoReviewList : false,
    ajaxPhotoReviewDetail : false,
    detailTemplate : false,
    initLang: function () {
    },
    initTpl: function () {
        var self = devPhotoReviewObj;

        self.detailTemplate = common.util.compileTpl('#devReviewDetailTpl');
    },
    initEvent: function () {
        var self = devPhotoReviewObj;

        $('#devAllReviewList').on('click', function(){
           self.toggleAllReviewListButton();
           self.toggleListAndView();
        });

        $('#devPopPhotoReviewList').on('click', '#devPhotoReviewContents > li', function(e){
            e.preventDefault();
            self.bbsIx = $(this).data('bbsix');
            self.toggleAllReviewListButton();
            self.toggleListAndView();
            self.getPhotoReviewDetail();
        });

    },
    toggleAllReviewListButton: function() {
        $('#devAllReviewList').toggle();
    },
    toggleListAndView: function() {
        $('#devPopPhotoReviewList').toggle();
        $('#devPopPhotoReviewDetail').toggle();
    },
    initAjaxPhotoReviewList : function(){
        var self = devPhotoReviewObj;

        if(bbs_ix){
            self.toggleListAndView();
            self.bbsIx = bbs_ix;
            self.getPhotoReviewDetail();
        }else{
            self.toggleAllReviewListButton();
        }

        self.ajaxPhotoReviewList = common.ajaxList();

        self.ajaxPhotoReviewList.setContent = function(list, paging) { // setContent 메소드 리매핑
            this.removeContent();
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    var items = [];

                    row.isManyImg = false;

                    if(row.anotherImgs.length > 1) {
                        row.isManyImg = true;
                        row.imageCnt = row.anotherImgs.length;
                    }

                    row.imgDetails = items.join('');
                    $(this.container).append(this.listTpl(row));
                }

                if (paging) {
                    $(this.pagination).html(common.pagination.getHtml(paging));
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }
        };

        self.ajaxPhotoReviewList
            .setUseHash(false)
            .setLoadingTpl('#devPhotoReviewListLoading')
            .setListTpl('#devPhotoReviewListDetail')
            .setEmptyTpl('#devPhotoReviewListEmpty')
            .setContainerType('ul')
            .setContainer('#devPhotoReviewContents')
            .setPagination('#devPhotoReviewListPageWrap')
            .setPageNum('#devListPage')
            .setGotoTop(false)
            .setForm('#devProductReviewListForm')
            .setController('reviewLists', 'product')
            .init(function(data) {
                self.ajaxPhotoReviewList.setContent(data.data.list, data.data.paging);
            });

        $('#devPhotoReviewListPageWrap').on('click', '.devPageBtnCls', function(e) { // 페이징 버튼 이벤트 설정
            e.preventDefault();
            self.ajaxPhotoReviewList.getPage($(this).data('page'));
        });

    },
    setPid: function () {
        var self = devPhotoReviewObj;
        var path = location.pathname;

        path = path.split('/');
        self.pid = path[3];
        $('#devPhotoReviewListPid').val(self.pid);
    },
    getPhotoReviewDetail: function () {
        var self = devPhotoReviewObj;

        common.ajax(common.util.getControllerUrl('getReviewDetail', 'product'),
            {
                bbsIx : self.bbsIx
            },
            function() {
                $('#devPopPhotoReviewDetail > *').remove();
            },
            function(res) {
                if (res.result == 'success') {
                    if (res.data.review.anotherImgs.length > 0) {
                        res.data.review.reviewThumbImg = res.data.review.anotherImgs[0];
                    }

                    $('#devPopPhotoReviewDetail').append(self.detailTemplate(res.data));
                    $(".photo__sub__list:eq(0)").addClass("active");
                }
            });
    },
    run: function () {
        var self = devPhotoReviewObj;
        self.initLang();
        self.initTpl();
        self.initEvent();
        self.setPid();
        self.initAjaxPhotoReviewList();
    }
};

$(function () {
    devPhotoReviewObj.run();
});