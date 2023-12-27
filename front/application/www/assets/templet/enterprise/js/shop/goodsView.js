/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
//상세 슬라이드
function slideToggle(obj) {
    $(obj).next().slideToggle(200);
}

$(function() {
    //상세보기 zoom
    $('.picZoomer').picZoomer();

    $('.goods-view-tab a').on('click', function() {
        if ($(this).parent().hasClass('sticky')) {
            var offset = $('.wrap-tab-area .wrap-tab-cont').offset().top;
            $('html , body').animate({ scrollTop: offset - 60 }, 400);
        };

        return false;
    });

    //상품문의 상세
    $('.js__qna__title').click(function() {
        slideToggle(this);
    });

    //상품정보 제공고시 상세
    $('.wrap-product-noti button').click(function() {
        slideToggle(this);
    });

    $('.open-layer-card').click(function() {
        $('.layer-card').toggle();
    });

    $('.open-layer-delivery').click(function() {
        $('.layer-delivery').toggle();
    });
    
    $('.btn-layer-close').click(function() {
        $(this).parents('div[class^=layer-]').hide();
    });

    $(document).on("click", ".js__photo__review", function(e) {
        var $this = $(this);
        var _idx = $this.index();
        var bbsIx = '';

        if(_idx < 5) {
            bbsIx = '/'+$this.data('bbsix');
        }

        common.util.modal.open("ajax", "포토후기", "/popup/photoReview"+bbsIx, "", function() {
            fbModal.addClassToModal("popupPhotoReview");
        });

        e.preventDefault();
    });
});



/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
common.lang.load('product.noMember.coupon.confirm', "쿠폰은 로그인 시에만 다운로드 가능합니다.{common.lineBreak}로그인하시겠습니까?");
common.lang.load('product.bbsQnaHidden.alert', "비공개 문의입니다.");
common.lang.load('product.pcodeCoyp.alert', "상품번호가 복사되었습니다.");
common.lang.load('product.qnaTitle.popup', "상품문의 작성");
common.lang.load('product.noMember.productQna.confirm', "상품문의 작성은 로그인 시에만 가능합니다.{common.lineBreak}로그인하시겠습니까?");
common.lang.load('product.noMember.reView.confirm', "댓글 작성은 로그인 시에만 가능합니다.{common.lineBreak}로그인하시겠습니까?");
common.lang.load('product.noMember.productReview.confirm', "로그인한 상태에서만 선택 가능합니다. {common.lineBreak}로그인하시겠습니까?");
common.lang.load('product.add.confirm.input', "댓글을 등록 하시겠습니까?");
common.lang.load('product.bbsQnaUserCheck.alert', "회원 로그인 후 확인 가능합니다. 로그인 하시겠습니까?");

var goodsView = {
    miniCart: false,
    ajaxPhotoReviewImageList: false, //포토후기 ajax
    ajaxReviewList: false, //리뷰 ajax
    ajaxQnaList: false, //문의 ajax
    responseContents: '', //문의 답변 영역
    questionContents: '', //문의 내용 영역
    reviewImgsContents: '', //후기 이미지
    getQnaCount: function() {
        common.ajax(common.util.getControllerUrl('qnaCount', 'product'), {
            id: $('#devQnaPid').val(),
            qnaDiv: $('#qnaDivSelectBox').val()
        }, false, function(qnaCnt) {
            $('#devQnaTotal').text(qnaCnt.data.all);
            $('#devQnaMine').text(qnaCnt.data.mine);
        }, 'json');
    },
    initEvent: function() {
        var self = this;

        $('#devCopyPcode').on('click', function() {
            var pcode = $(this).data('pcode');
            common.noti.alert(common.lang.get('product.pcodeCoyp.alert'), function() {
                common.util.copyText(pcode);
            });
        });

        $('.devSelectCid').on('change', function() {
            top.document.location.href = '/shop/goodsList/' + $(this).val();
        });

        $('#devPromotionSection').on('change', '#devPromotionSelect', function() { //관련 기획전
            // top.location.href = '/event/goods_event.php?event_ix=' + $(this).val();
            top.location.href = '/event/eventDetail/' + $(this).val();
        });

        $('#devCouponDown').on('click', function() { //쿠폰받기
            var pid = $(this).data('pid');
            if (forbizCsrf.isLogin) {
                common.util.modal.open('ajax', '쿠폰 다운로드', '/shop/couponDown/' + pid);
            } else {
                common.noti.confirm(common.lang.get('product.noMember.coupon.confirm', ''), function() {
                    document.location.href = '/member/login?url=' + encodeURI('/shop/goodsView/' + pid);
                });
            }
        });

        $('.devReviewsDiv').on('click', function() { //상품후기 분류 탭(프리미엄/일반/동영상후기)
            var bbsDiv = $(this).data('bbsdiv');
            $('input[name=bbsDiv]').val(bbsDiv);
            self.ajaxReviewList.reload();
        });

        $('.devSort').on('click', function() { //상품후기 정렬
            var orderby = $(this).val();
            var sort = $(this).data('sort');

            $('input[name=orderBy]').val(orderby);
            $('input[name=orderByType]').val(sort);

            self.ajaxReviewList.reload();
        });

        $('#qnaDivSelectBox').on('change', function() { //상품문의 분류
            $('input[name=qnaDiv]').val($(this).val());
            self.ajaxQnaList.reload();
            self.getQnaCount();
        });

        $('.devQnaSort').on('click', function() { //상품문의 타입(전체/내문의)
            var qnaType = $(this).data('type');
            var pid = $(this).data('pid');

            if (forbizCsrf.isLogin) {
                $('#devQnaType').val(qnaType);
                self.ajaxQnaList.reload();

                $(".devQnaSort").removeClass("active");
                $(`.devQnaSort[data-type=${qnaType}]`).addClass("active");
            } 
            else {
                common.noti.confirm(
                    common.lang.get('product.bbsQnaUserCheck.alert'), 

                    function() { //ok callback
                        document.location.href = '/member/login?url=' + encodeURI('/shop/goodsView/' + pid);
                    }, 

                    function () { //cancel callback
                        $(".devQnaSort").removeClass("active");
                        $(".devQnaSort[data-type=all]").addClass("active");
                    }
                );
             
            }

            return false;
        });

        $('#devQnaWrite').on('click', function() { //상품문의 작성
            var pid = $(this).data('pid');
            var useauth = $(this).data('useauth');
            if (forbizCsrf.isLogin || useauth == 1) {
                common.util.popup('/shop/goodsQnaWrite/' + pid, 750, 1050, common.lang.get('product.qnaTitle.popup'), true);
            } else {
                common.noti.confirm(common.lang.get('product.noMember.productQna.confirm', ''), function() {
                    document.location.href = '/member/login?url=' + encodeURI('/shop/goodsView/' + pid);
                });
            }
        });

        $('.devDetailTabs').on('click', function() { //상품상세 탭 이벤트(상품정보, 후기, 문의, 교환/반품)
            var content = $(this).data('content');

            if (content == 'devTabReview') { //터치시 ajax 최초 세팅. 2번째부터는 세팅된 ajax 로 로드됨.
                if ($('#devAllReviewEmpty').length == 0) {
                    if ($('#devReviewDetail').length > 0) {
                        self.initAjaxReviewList(); //최초 세팅
                        self.initAjaxPhotoReviewList();//최초 세팅
                    } else {
                        self.ajaxReviewList.reload();
                        self.ajaxPhotoReviewImageList.reload();
                    }
                }
            } else if (content == 'devTabInquiry') { //터치시 ajax 최초 세팅. 2번째부터는 세팅된 ajax 로 로드됨.
                if ($('#devAllQnaEmpty').length == 0) {
                    if ($('#devQnaDetail').length > 0) {
                        self.initAjaxQnaList(); //최초 세팅
                    } else {
                        self.ajaxQnaList.reload();
                    }
                }
            }
        });

        // 상품후기 작성
        $('.devByFinalized').on('click', function () {
            var url = '/shop/goodsReview/' + $(this).data('pid') + '?mode=write';
            common.util.popup(url, 800, 1000);
        });
    },
    initAfterMiniCart: function() {
        // 네이버페이 연동
        if (typeof dev_ext.npay.useNpay !== 'undefined' && dev_ext.npay.useNpay == 'Y') {
            dev_ext.npay.goodsView.init();
        }

        // 입고 알림 신청 버튼
        if (typeof devOptionData !== 'undefined') {
            for (var i in devOptionData.options) {
                var opt = devOptionData.options[i];

                if (opt.option_stock <= 0) {
                    $('#devIncomming').show();
                    // 입고 알림 신청 버튼 이벤트
                    $('#devIncommingBtn').on('click', function() {
                        alert('입고 알림 신청');
                    });
                    break;
                }
            }
        }
    },
    initMinicart: function() { //옵션 데이터 로드가 완료된 후 미니카트 관련 세팅 시작 
        var self = this;

        if (self.miniCart === false) {
            $.getScript($('#devMinicartScript').data('url'), function() {
                self.miniCart = devMiniCart(); //상단 옵션 영역
                var minicart = self.miniCart;
                minicart
                    .setOptionData(devOptionData)
                    .setBasicCnt(allow_basic_cnt, allow_byoneperson_cnt)
                    .setContents('#devMinicartArea', '#devMinicartOptions', '#devMinicartAddOption', '#devLonelyOption', '#devLonelyOptionName')
                    .setChoosedContents('#devMinicartSelected', '.devOptionBox')
                    .setControlPrice('#devMinicartTotal', '.devMinicartEachPrice')
                    .setControlCntElement('.devControlCntBox', '.devCntPlus', '.devCntMinus', '.devMinicartPrdCnt')
                    .setBtn('.devMinicartDelete', '.devAddCart', '.devOrderDirect')
                    .init();

                var sildeMinicart = devMiniCart(); //하단 옵션 영역
                sildeMinicart
                    .setOptionData(devOptionData)
                    .setBasicCnt(allow_basic_cnt, allow_byoneperson_cnt)
                    .setContents('#devSildeMinicartArea', '#devSildeMinicartOptions', '#devSlideMinicartAddOption', '#devSildeLonelyOption', '#devSildeLonelyOptionName')
                    .setChoosedContents('#devSlideMinicartSelected', '.devSlideOptionBox')
                    .setControlPrice('#devSildeMinicartTotal', '.devMinicartEachPrice')
                    .setControlCntElement('.devControlCntBox', '.devCntPlus', '.devCntMinus', '.devMinicartPrdCnt')
                    .setBtn('.devMinicartDelete', '.devSlideAddCart', '.devSlideOrderDirect')
                    .init();

                //상단, 하단 옵션 영역을 싱크하기 위해 작업
                minicart.sync(sildeMinicart);
                sildeMinicart.sync(minicart);

                // 미니카트 로딩후 처리
                self.initAfterMiniCart();
            });
        }
    },
    initAjaxPhotoReviewList: function() { //포토 리슈 ajax 최초 세팅
        var self = this;

        self.ajaxPhotoReviewImageList = common.ajaxList();

        self.ajaxPhotoReviewImageList.setContent = function(list, paging) { // setContent 메소드 리매핑
            this.removeContent();
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    var items = [];

                    row.isManyImg = false;
                    if (row.anotherImgs.length > 0) { //리뷰 상세 이미지가 있을 경우. 첫번째 이미지는 대표이미지이므로 해당 데이터에는 없음.

                        if(row.anotherImgs.length > 1) {
                            row.isManyImg = true;
                            row.imageCnt = row.anotherImgs.length;
                        }
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

        self.ajaxPhotoReviewImageList
            .setUseHash(false)
            .setLoadingTpl('#devPhotoReviewLoading')
            .setListTpl('#devPhotoReviewImageDetail')
            .setEmptyTpl('#devPhotoReviewEmpty')
            .setContainerType('ul')
            .setContainer('#devPhotoReviewImageContents')
            .setPagination(false)
            .setPageNum(false)
            .setForm('#devPhotoReviewForm')
            .setController('reviewLists', 'product')
            .init(function(data) {
                if(data.result == 'success') {
                    self.ajaxPhotoReviewImageList.setContent(data.data.list, '');
                }
            });
    },
    initAjaxReviewList: function() { //리뷰 ajax 최초 세팅
        var self = this;
        self.ajaxReviewList = common.ajaxList();

        self.reviewImgsContents = self.ajaxReviewList.compileTpl('#devReviewImgsDetails'); //리뷰 상세 이미지
        $('#devReviewImgsContents').text('{[{imgDetails}]}'); //setContent 에서 템플릿 사용 가능하도록 변경

        self.ajaxReviewList.setContent = function(list, paging) { // setContent 메소드 리매핑
            this.removeContent();
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    console.log(row);
                    row.isManyImg = false;
                    if (row.bbs_hidden == '0' || (row.isSameUser == true && row.bbs_hidden == '1')) { //공개 or 비공개 & 동일작성자일 경우 영역 노출
                        var items = [];
                        if (row.anotherImgs.length > 0) { //리뷰 상세 이미지가 있을 경우. 첫번째 이미지는 대표이미지이므로 해당 데이터에는 없음.
                            for (var idx = 0; idx < row.anotherImgs.length; idx++) {
                                var img = new Object();
                                img.img = row.anotherImgs[idx];
                                img.bbsIx = row.bbs_ix;
                                img.index = idx;
                                img.isManyImg = true;
                                img.imageCnt = row.anotherImgs.length;
                                items.push(self.reviewImgsContents(img));
                            }
                        }
                        row.imgDetails = items.join('');
                        $(this.container).append(this.listTpl(row));
                    }
                }

                if (paging) {
                    $(this.pagination).html(common.pagination.getHtml(paging));
                }
            } else {
                $(this.container).append(this.emptyTpl());
                $('#devReviewTotalScore').hide();
            }
        };

        self.ajaxReviewList
            .setUseHash(false)
            .setLoadingTpl('#devReviewLoading')
            .setListTpl('#devReviewDetail')
            .setEmptyTpl('#devReviewEmpty')
            .setContainerType('ul')
            .setContainer('#devReviewContents')
            .setPagination('#devReviewPageWrap')
            .setPageNum('#devPage')
            .setForm('#devProductReviewForm')
            .setController('reviewLists', 'product')
            .init(function(data) {
                if (data.data.list && data.data.list.length) {
                    $(".goodsReview__tab").css("display", "block");
                }

                $.each(data.data.list, function(key, obj) {
                    obj.nick_name = '{[nick_name]}';
                    obj.comment = '{[{comment}]}';
                    obj.date = '{[date]}';
                    obj.idx = '{[idx]}';
                    obj.modifyBool = '{[modifyBool]}';
                    data.data.list[key] = obj;
                });

                self.ajaxReviewList.setContent(data.data.list, data.data.paging);

                $('.devReviewImgs').click(function() {
                    var bbsIx = $(this).data('bbsix');
                    var index = $(this).data('index');
                    $('body').addClass('popup--open');
                    common.util.modal.open('ajax', '포토/동영상', '/popup/reviewImgList/view/' + bbsIx);
                })
                $('.devBestPickDetail').on('click', '', function() {
                    var bbsIx = $(this).data('bbsix');
                    common.util.modal.open('ajax', 'Best Pick 보기', '/popup/reviewImgList/bestView/' + bbsIx);
                })

                $('.devReviewImgList').click(function() {
                    var pid = $(this).attr('data-pid');
                    $('body').addClass('popup--open');
                    common.util.modal.open('ajax', '포토/동영상', '/popup/reviewImgList/list/' + pid);
                })




                var openReviewDetail = new Array(); //배열선언
                $('.devViewVideoReview').on('click', function() {
                    var video_idx = $(this).data('video_idx');
                    if (openReviewDetail[video_idx] != true) {
                        openReviewDetail[video_idx] = false;
                    }

                    if (video_idx) {
                        if ($('#devDetailView_' + video_idx).css('display') == 'none') {
                            if (openReviewDetail[video_idx] == false) {

                                self.initVideoCommentList(video_idx);
                                openReviewDetail[video_idx] = true;
                            }
                        }
                    }

                });
                $('.devCommentButton').on('click', function() {
                    const $target = $(this).siblings(".review-detail__user-comment");
                    var video_idx = $(this).data('video_idx');

                    if (!$target.hasClass("review-detail__user-comment--show")) {
                        $target.addClass("review-detail__user-comment--show");
                        self.ajaxVideoReviewComment[video_idx].reload();
                        $('#devVideoCommentPageWrap_' + video_idx).show();

                    } else {
                        $target.removeClass("review-detail__user-comment--show");
                        $('#devVideoCommentPageWrap_' + video_idx).hide();
                    }

                });

                var commentSubmitBool = false;
                $('.devAddCommentButton').click(function(e) {
                    e.preventDefault();
                    if (commentSubmitBool) {
                        alert('등록중 입니다.');
                    } else {
                        commentSubmitBool = true;

                        var $area = $(this).closest('form');

                        var comment = $area.find('.devComment').val();
                        var video_idx = $(this).data('video_idx');
                        common.ajax(common.util.getControllerUrl('viewTvInputComment', 'Viewtv'), {
                            video_idx: video_idx,
                            comment: comment
                        }, function() {
                            if (comment.length == 0) {
                                common.noti.alert('댓글을 입력 해 주세요');
                                commentSubmitBool = false;
                                return false;

                            }
                            return true;
                        }, function(res) {

                            //성공일때 처리
                            commentSubmitBool = false;
                            self.ajaxVideoReviewComment[video_idx].reload();
                            $('.devCommentButton em').html(res.data);
                            $('.devComment').val('');
                            $('.devAddCommentButton').removeClass("input-comment__save").addClass("input-comment__save--disabled");
                            $('.devCommentLimit em').html(0);
                        });
                    }
                });



            });

        $('#devReviewContents').on('click', '.devReviewDetailContents', function(e) { //클릭시 상세 정보 아래로 슬라이드됨
            if (!!$(e.target).attr("class") && $(e.target).attr("class").indexOf("help-btns--") < 0)
                slideToggle(this);
                $(this).toggleClass('on');

        
                // 상품후기 상세내용 펼쳐진 다음, 후기 사진 이미지 슬라이드 실행
                if($(this).hasClass("on")) {
                    
                    var targetElement = $(this).find('.swiper-container');
    
                    if(window.reviewImgSlider) {
                        window.reviewImgSlider(targetElement);
                    }
                }
        });

        $(document).on('click', '.devViewReviewImg', function() {
            var bbsIx = $(this).data('bbsix');
            var index = $(this).data('index');
            common.util.modal.open('ajax', '이미지 보기', '/popup/reviewImgView/' + bbsIx + '/' + index);
        });

        $('#devReviewPageWrap').on('click', '.devPageBtnCls', function() { // 페이징 버튼 이벤트 설정
            self.ajaxReviewList.getPage($(this).data('page'));
        });
    },
    ajaxVideoReviewComment: [],
    initVideoCommentList: function(video_idx) {
        var self = this;
        self.ajaxVideoReviewComment[video_idx] = common.ajaxList();

        self.ajaxVideoReviewComment[video_idx]
            .setContainerType('div')
            .setLoadingTpl('#devVideoCommentLoading_' + video_idx)
            .setListTpl('#devVideoCommentList_' + video_idx)
            .setEmptyTpl('#devVideoCommentEmpty_' + video_idx)
            .setContainer('#devVideoCommentContent_' + video_idx)
            .setPagination('#devVideoCommentPageWrap_' + video_idx)
            .setPageNum('#devVideoCommentPage_' + video_idx)
            .setForm('#devVideoCommentForm_' + video_idx)
            .setController('getVideoCommentData', 'video')
            .setUseHash(false)
            .init(function(data) {
                self.ajaxVideoReviewComment[video_idx].setContent(data.data.list, data.data.paging);
                $('.devVideoCommentModifyBtn[devModify=false]').remove();
            });

        $('#devVideoCommentPageWrap_' + video_idx).on('click', '.devPageBtnCls', function() { // 페이징 버튼 이벤트 설정
            self.ajaxVideoReviewComment[video_idx].getPage($(this).data('page'));
        });

        $('.devLoginCheck').on('click', function() {
            common.noti.confirm(common.lang.get('product.noMember.reView.confirm'), function() {
                document.location.href = '/member/login?url=' + encodeURI(window.location.href);
            });
        });

        var commentModifyBool = false;
        $('#devDetailView_' + video_idx).on('click', '.devCommentModifyBtn', function(e) {

            e.preventDefault();
            if (commentModifyBool) {
                alert('등록중 입니다.');
            } else {
                commentModifyBool = true;

                var $area = $(this).closest('form');

                var comment = $area.find('.devCommentModify').val();
                var comment_idx = $(this).data('comment-idx');
                var video_idx = $(this).data('video_idx');

                common.ajax(common.util.getControllerUrl('viewTvInputModifyComment', 'Viewtv'), {
                    comment_idx: comment_idx,
                    video_idx: video_idx,
                    comment: comment
                }, '', function() {
                    //성공일때 처리
                    commentModifyBool = false;
                    self.ajaxVideoReviewComment[video_idx].reload();
                });
            }
        });
    },
    initAjaxQnaList: function() { //문의 ajax 최초 세팅
        var self = this;
        var basicClone = $('#devQnaBasicContents').clone();
        self.ajaxQnaList = common.ajaxList();

        self.questionContents = self.ajaxQnaList.compileTpl('#devQnaQuestion'); //문의 질의 영역
        self.responseContents = self.ajaxQnaList.compileTpl('#devQnaResponse'); //문의 답변 영역
        $('#devQnaDetailContents').text('{[{qnaDetails}]}'); //setContent 에서 템플릿 사용 가능하도록 변경

        self.ajaxQnaList.setContent = function(list, paging) { // setContent 메소드 리매핑
            this.removeContent();
            $(this.container).append(basicClone);

            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    if (row.bbs_hidden == '0' || (row.isSameUser == true && row.bbs_hidden == '1')) { //공개 or 비공개 & 동일작성자일 경우 영역 노출
                        var oitems = [];
                        oitems.push(self.questionContents(row));

                        if (row.comments.length > 0) { //답변 있을 경우
                            for (var idx = 0; idx < row.comments.length; idx++) {
                                oitems.push(self.responseContents(row.comments[idx]));
                            }
                        }

                        row.qnaDetails = oitems.join('');
                    }
                    $(this.container).append(this.listTpl(row));
                }

                if (paging) {
                    $(this.pagination).html(common.pagination.getHtml(paging));
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }
        };

        self.ajaxQnaList
            .setUseHash(false)
            .setLoadingTpl('#devQnaLoading')
            .setListTpl('#devQnaDetail')
            .setEmptyTpl('#devQnaEmpty')
            .setContainerType('ul')
            .setContainer('#devQnaContents')
            .setPagination('#devQnaPageWrap')
            .setPageNum('#devQnaPage')
            .setForm('#devProductQnaForm')
            .setController('qnaLists', 'product')
            .init(function(data) {
                if (data.data.list && data.data.list.length) {
                    $(".goodsInquiry__sort").css("display", "block");
                }

                self.ajaxQnaList.setContent(data.data.list, data.data.paging);
            });


        $('#devQnaPageWrap').on('click', '.devPageBtnCls', function() { // 페이징 버튼 이벤트 설정
            self.ajaxQnaList.getPage($(this).data('page'));
        });
    },

    run: function() {
        var self = this;
        self.initMinicart();
        self.initEvent();
    },
};




$(function() {
    goodsView.run();

});
