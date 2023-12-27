"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
//상세 슬라이드
function slideToggle(obj) {
    $(obj).next().slideToggle(200);
}

$(function () {
    const $document = $(document);

    //탭고정
    // if ($('.wrap-tab-area').length) {
    //     var $target = $('.goods-view-tab');

    //     var scrollCon = function () {
    //         $(window).scroll(function () {
    //             var starH = $('.wrap-tab-area').offset().top - 85,
    //                     wst = $(window).scrollTop();
    //             if (wst > starH) {
    //                 $target.addClass('sticky');

    //             } else {
    //                 $target.removeClass('sticky');
    //             }
    //             ;
    //         });
    //     };
    //     scrollCon();
    // }

    // $('.goods-view-tab a').on('click', function () {
    //     if ($(this).parent().hasClass('sticky')) {
    //         var offset = $('.wrap-tab-cont').offset();
    //         $('html , body').animate({scrollTop: offset.top - 85}, 400);
    //     }
    //     ;
    //     return false;
    // });

    //상품리뷰 토글 ajax 로 데이터 호출 후 실행하는 것으로 변경함 180921
    //상품문의 상세
    $('.qna-title').click(function () {
        slideToggle(this);
    });

    //상품상세 사은품 상세
    $('.product_gift button').click(function () {
        slideToggle(this);
    });

    //미니카트
    $('.btn-buy').on("click", function () {
        $(".minicart-dim").show();
        $('.mini-cart').slideDown();
        $('#devMinicartArea').addClass('devOpened')
        $('.goodsview-btn__default').addClass("hide");
    });
    
    $('.mini-cart .btn-closed').click(function () {
        $(".minicart-dim").hide();
        $('#devMinicartArea').removeClass('devOpened')
        $('.mini-cart').slideUp(); //개발 추가
        $('.goodsview-btn__default').removeClass("hide");
    });

    // 혜택정보 레이어 팝업 열기
    $('.open-layer-discount').click(function () {
        common.util.modal.open('html', '할인내역', $('.layer-discount:first').clone());
    });

    // 카드혜택 레이어 팝업 열기
    $('.open-layer-card').click(function () {
        common.util.modal.open('html', '카드혜택', $('.layer-card:first').clone());
        $('.fb__popup-layout').addClass('commGoodsView');
    });
  
    // 제주, 도서산간 추가 배송비 레이어 팝업 열기
    $('.open-layer-delivery').click(function () {
        common.util.modal.open('html', '제주, 도서산간 추가 배송비', $('.layer-delivery:first').clone());
        $('.fb__popup-layout').addClass('commGoodsView');
    });

     // 카드혜택 / 제주, 도서산간 추가 배송비 레이어 팝업 닫기
    $document.on("click", ".commGoodsView .close, .commGoodsView .btn-close-bottom", function() {
        $(".fb__popup-layout").removeClass("commGoodsView");
    });

    $document.on("click", ".share-sns .close, .share-sns .btn-close-bottom", function() {
        $(".fb__popup-layout").removeClass("share-sns");
    });

    $(document).on("click", ".preview__list", function(e) {
        var $this = $(this);
        var _idx = $this.index();
        var bbsIx = '';

        if(_idx < 5) {
            bbsIx = '/'+$this.data('bbsix');
        }
        $(".fb__popup-layout").addClass("full-layer popupPhotoReview");
        common.util.modal.open("ajax", "포토후기", "/popup/photoReview"+bbsIx, "", function() {
            //fbModal.addClassToModal("popupPhotoReview");
        });

        e.preventDefault();
    });
});

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
common.lang.load('product.noMember.confirm', "로그인이 필요합니다.");
common.lang.load('product.bbsQnaHidden.alert', "비공개 문의입니다.");
common.lang.load('product.bbsQnaUserCheck.alert', "회원 로그인 후 확인 가능합니다. 로그인 하시겠습니까?");

var goodsView = {
    miniCart: false,
    ajaxPhotoReviewImageList: false, //포토후기 ajax
    ajaxReviewList: false, //리뷰 ajax
    ajaxQnaList: false, //문의 ajax
    responseContents: '', //문의 답변 영역
    questionContents: '', //문의 내용 영역
    reviewImgsContents: '', //후기 이미지
    getQnaCount: function () {
        common.ajax(common.util.getControllerUrl('qnaCount', 'product'), {
            id: $('#devQnaPid').val(),
            qnaDiv: $('#qnaDivSelectBox').val()
        }, false, function (qnaCnt) {
            $('#devQnaTotal').text(qnaCnt.data.all);
            $('#devQnaMine').text(qnaCnt.data.mine);
        }, 'json');
    },
    initEvent: function () {
        var self = this;

        $('#devPromotionSection').on('change', '#devPromotionSelect', function () { //관련 기획전
            // top.location.href = '/event/goods_event.php?event_ix=' + $(this).val();
            top.location.href = '/event/eventDetail/' + $(this).val();
        });

        $('#devCouponDown').on('click', function () { //쿠폰받기
            var pid = $(this).data('pid');
            if (forbizCsrf.isLogin) {
                common.util.modal.open('ajax', '쿠폰 다운로드', '/shop/couponDown/' + pid);
            } else {
                common.noti.confirm(common.lang.get('product.noMember.confirm', ''), function () {
                    document.location.href = '/member/login?url=' + encodeURI('/shop/goodsView/' + pid);
                });
            }
            $(".fb__popup-layout").addClass("full-layer");
        });

        $('.devReviewsDiv').on('click', function () { //상품후기 분류 탭(프리미엄/일반)
            var bbsDiv = $(this).data('bbsdiv');
            $('input[name=bbsDiv]').val(bbsDiv);
            self.ajaxReviewList.getPage(1);
        });

        $('.devSort').on('click', function () { //상품후기 정렬
            var orderby = $(this).val();
            var sort = $(this).data('sort');

            $('input[name=orderBy]').val(orderby);
            $('input[name=orderByType]').val(sort);
            self.ajaxReviewList.reload();
            self.ajaxReviewList.getPage(1);
            self.getQnaCount();
        });

        $('#qnaDivSelectBox').on('change', function () { //상품문의 분류
            $('input[name=qnaDiv]').val($(this).val());
            self.ajaxQnaList.getPage(1);
            self.getQnaCount();
        });

        $('.devQnaSort').on('click', function () { //상품문의 타입(전체/내문의)
            var qnaType = $(this).data('type');
            var pid = $(this).data('pid');

            if (forbizCsrf.isLogin) {
                $('input[name=qnaType]').val(qnaType);
                self.ajaxQnaList.getPage(1);
            } 
            else {
                common.noti.confirm(
                    common.lang.get('product.bbsQnaUserCheck.alert', ''), 
                
                    function () { //ok callback
                        document.location.href = '/member/login?url=' + encodeURI('/shop/goodsView/' + pid);
                    }, 
                    
                    function () { //cancel callback
                        $(".devQnaSort").removeClass("on");
                        $(".devQnaSort[data-type=all]").addClass("on");
                    }
                );
            }
        });

        $('#devQnaWrite').on('click', function () { //상품문의 작성
            var pid = $(this).data('pid');
            var useauth = $(this).data('useauth');
            if (forbizCsrf.isLogin || useauth == 1) {
                document.location.href = '/shop/goodsQnaWrite/' + pid;
            } else {
                common.noti.confirm(common.lang.get('product.noMember.confirm', ''), function () {
                    document.location.href = '/member/login?url=' + encodeURI('/shop/goodsView/' + pid);
                });
            }
        });

        $('.devDetailTabs').on('click', function () { //상품상세 탭 이벤트(상품정보, 후기, 문의, 교환/반품)
            var content = $(this).data('content');

            if (content == 'devTabReview') {
                //터치시 ajax 최초 세팅. 2번째부터는 세팅된 ajax 로 로드됨.
                if ($('#devAllReviewEmpty').length == 0) {
                    if ($('#devReviewDetail').length > 0) {
                        self.initAjaxReviewList(); //최초 세팅
                        self.initAjaxPhotoReviewList(); //최초 세팅
                    } else {
                        self.ajaxReviewList.reload();
                        self.ajaxPhotoReviewImageList.reload();
                    }
                }
            } else if (content == 'devTabInquiry') {
                //터치시 ajax 최초 세팅. 2번째부터는 세팅된 ajax 로 로드됨.
                if ($('#devAllQnaEmpty').length == 0) {
                    if ($('#devQnaDetail').length > 0) {
                        self.initAjaxQnaList(); //최초 세팅
                    } else {
                        self.ajaxQnaList.reload();
                    }
                }
            }

            return false;
        });
    },
    initAfterMiniCart: function () {
        // 네이버페이 연동
        if (typeof dev_ext.npay.useNpay !== 'undefined' && dev_ext.npay.useNpay == 'Y') {
            dev_ext.npay.goodsView.init();
        }

        // 입고 알림 신청 버튼
        if(typeof devOptionData !== 'undefined') {
            for (var i in devOptionData.options) {
                var opt = devOptionData.options[i];

                if (opt.option_stock <= 0) {
                    $('#devIncomming').show();
                    // 입고 알림 신청 버튼 이벤트
                    $('#devIncommingBtn').on('click', function () {
                        alert('입고 알림 신청');
                    });
                    break;
                }
            }
        }
    },
    initMinicart: function () { //옵션 데이터 로드가 완료된 후 미니카트 관련 세팅 시작 
        var self = this;
        
        if (self.miniCart === false) {
            $.getScript($('#devMinicartScript').data('url'), function () {
                self.miniCart = devMiniCart();
                
                self.miniCart.setOptionData(devOptionData)
                        .setBasicCnt(allow_basic_cnt, allow_byoneperson_cnt)
                        .setContents('#devMinicartArea', '#devMinicartOptions', '#devMinicartAddOption', '#devLonelyOption', '#devLonelyOptionName')
                        .setChoosedContents('#devMinicartSelected', '.devOptionBox')
                        .setControlPrice('#devMinicartTotal', '.devMinicartEachPrice')
                        .setControlCntElement('.devControlCntBox', '.devCntPlus', '.devCntMinus', '.devMinicartPrdCnt')
                        .setBtn('.devMinicartDelete', '.devAddCart', '.devOrderDirect')
                        .init();

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
                if (data.result == 'success') {
                    self.ajaxPhotoReviewImageList.setContent(data.data.list, '');
                }
            });
    },
    initAjaxReviewList: function () { //리뷰 ajax 최초 세팅
        var self = this;
        self.ajaxReviewList = common.ajaxList();

        self.reviewImgsContents = self.ajaxReviewList.compileTpl('#devReviewImgsDetails'); //리뷰 상세 이미지
        $('#devReviewImgsContents').text('{[{imgDetails}]}'); //setContent 에서 템플릿 사용 가능하도록 변경

        self.ajaxReviewList.setContent = function (list, paging) { // setContent 메소드 리매핑
            //마지막 페이지 또는 page가 1일때 숨김
            if(paging && (paging.cur_page == paging.last_page || paging.page_list.length <= 1)){
                this.hidePagination();
            } else {
                this.sowPagination();
            }
            //삭제옵션, 페이지 검색시 1페이지, paging 정보 없을때
            if (this.remove === true || !paging || paging.cur_page == 1) {
                this.removeContent();
            }
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
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
                .setRemoveContent(false)
                .setLoadingTpl('#devReviewLoading')
                .setListTpl('#devReviewDetail')
                .setEmptyTpl('#devReviewEmpty')
                .setContainerType('ul')
                .setContainer('#devReviewContents')
                .setPagination('#devReviewPageWrap')
                .setPageNum('#devPage')
                .setForm('#devProductReviewForm')
                .setController('reviewLists', 'product')
                .init(function (response) {
                    self.ajaxReviewList.setContent(response.data.list, response.data.paging);
                });

        $('#devReviewContents').on('click', '.devReviewDetailContents', function () { //클릭시 상세 정보 아래로 슬라이드됨
            slideToggle(this);
            $(this).toggleClass('on')

            // 상품후기 상세내용 펼쳐진 다음, 후기 사진 이미지 슬라이드 실행
            // if($(this).hasClass("on")) {
            //     var targetElement = $(this).siblings('.review-detail').find('.swiper-container');

            //     if(window.reviewImgSlider) {
            //         window.reviewImgSlider(targetElement);
            //     }
            // }
        });

        $('#devReviewContents').on('click', '.devReviewImgs', function () {
            var bbsIx = $(this).data('bbsix');
            var index = $(this).data('index');
            common.util.modal.open('ajax', '이미지 보기', '/popup/reviewImgView/' + bbsIx + '/' + index);

            $('.popup-layout').addClass('popup-img-view');
            $('.fb__popup-layout').addClass('full-layer');
        })

        $('#devReviewPageWrap').on('click', '.devPageBtnCls', function () { // 페이징 버튼 이벤트 설정
            self.ajaxReviewList.getPage($(this).data('page'));
        });
    },
    initAjaxQnaList: function () { //문의 ajax 최초 세팅
        var self = this;
        self.ajaxQnaList = common.ajaxList();

        self.questionContents = self.ajaxQnaList.compileTpl('#devQnaQuestion'); //문의 질의 영역
        self.responseContents = self.ajaxQnaList.compileTpl('#devQnaResponse'); //문의 답변 영역
        $('#devQnaDetailContents').text('{[{qnaDetails}]}'); //setContent 에서 템플릿 사용 가능하도록 변경

        self.ajaxQnaList.setContent = function (list, paging) { // setContent 메소드 리매핑
            //마지막 페이지 또는 page가 1일때 숨김
            if(paging && (paging.cur_page == paging.last_page || paging.page_list.length <= 1)){
                this.hidePagination();
            } else {
                this.sowPagination();
            }
            //삭제옵션, 페이지 검색시 1페이지, paging 정보 없을때
            if (this.remove === true || !paging || paging.cur_page == 1) {
                this.removeContent();
            }
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    if (row.bbs_hidden == 0 || (row.isSameUser == true && row.bbs_hidden == 1)) { //공개 or 비공개 & 동일작성자일 경우 영역 노출
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
                .setRemoveContent(false)
                .setLoadingTpl('#devQnaLoading')
                .setListTpl('#devQnaDetail')
                .setEmptyTpl('#devQnaEmpty')
                .setContainerType('ul')
                .setContainer('#devQnaContents')
                .setPagination('#devQnaPageWrap')
                .setPageNum('#devQnaPage')
                .setForm('#devProductQnaForm')
                .setController('qnaLists', 'product')
                .init(function (data) {
                    self.ajaxQnaList.setContent(data.data.list, data.data.paging);
                });

        $('#devQnaPageWrap').on('click', '.devPageBtnCls', function () { // 페이징 버튼 이벤트 설정
            if (self.ajaxQnaList.onLoading != $(this).data('page')) {
                self.ajaxQnaList.getPage($(this).data('page'));
            }
        });
    },
    run: function () {
        var self = this;

        self.initMinicart();
        self.initEvent();
    }
};

$(function () {
    goodsView.run();
});
