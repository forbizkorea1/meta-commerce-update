/**
 * Created by forbiz on 2019-02-11.
 */

const shop_goodsView = () => {
    const $document = $(document);

    const navTab = () => {
        $(".js__goodsNav a").on("click", function() {
            const $this = $(this);
            const _target = $this.attr("href").replace("#", "");

            if (!$this.hasClass("active")) {
                $this.addClass("active").siblings().removeClass("active");
                $(".js__goodsWrapper").hide();
                $("#"+ _target).show();
            }

            return false;
        });
    };

    const list_show = () => {
        const $target = $(".js__qna__answer");

        $document.on("click", ".js__qna__question", function() {
            const $this = $(this);
            
            // 비공개이면서 사용자가 작성한 글이 아닐 경우
            if(($this.hasClass('secret') && $this.hasClass('devNotSameUser'))) { 
                $this.next($target).hide();
                common.noti.alert(common.lang.get('product.bbsQnaHidden.alert'));
                return ;
            }
            else {
                if (!$this.hasClass("slideDown")) {
                    $this.addClass("slideDown on");
                    $this.next($target).slideDown("fast");
                }
                else {
                    $this.removeClass("slideDown on");
                    $this.next($target).slideUp("fast");
                }
            }
        });
    };

    const ifLogin = () => {
        if (forbizCsrf.isLogin) {
            $(".noLogin").css({
                "display": "none",
            });
            $(".isLogin").css({
                "display": "inline-block",
            });

        } else {
            $(".isLogin").css({
                "display": "none",
            })
            $(".noLogin").css({
                "display": "inline-block",
            })
        }
    };

    const lazyload = () => {
        /*
         * {layoutCommon.templetSrc}/images/common/loading.gif 로딩 이미지 샘플
         * attribute : data-src
         * */
        const $target = $('img[data-src]');
        $target.Lazy({
            threshold: 50
        });


    };

    const goodsView_slider = () => {
        // 상단 메인이미지 슬라이드
        if ( 1 < $(".thumb-area .swiper-slide").length ) {
            const mainSwiper = new Swiper('.thumb-area__inner', {
                pagination: {
                    el: '.thumb-area__inner .swiper-pagination',
                    type: 'fraction',
                },
            });
            $(".js__thumbSlider__nav").addClass("show");
        }

        // 인기상품 슬라이드
        var popularSwiper = new Swiper('.area-goods .swiper-container', {
            slidesPerView: "auto",
        });
        
        // 추천연관상품 슬라이드
        var relatedrSwiper = new Swiper('.area-goods-rel .swiper-container', {
            slidesPerView: "auto",
        });
    };

    // 상품정보 제공고시 toggle Event
    const goodsNotiToggle = () => {
        const $toggle = $('.wrap-product-noti .toggle');

        $toggle.on('click', function() {
            $(this).next().slideToggle(200);
        })

        //미니카트 추가구성 상품 토글버튼
        $(document).on("click",".add-product__btn", function () {
            $(this).parents(".add-product").toggleClass("hide");
        });
    };

    // 후기관련 js
    const goodsReview = () => {
        const goodsReviewSwitch = () => {
            $document.on("click", ".js--reviewBtn", function(e) {
                const $this = $(this);
                const $reviewList = $this.closest(".goodsReview__list");

                if (!$reviewList.hasClass("js--reviewOpen")) {
                    $reviewList.addClass("js--reviewOpen");
                }
                else {
                    $reviewList.removeClass("js--reviewOpen");
                }

                e.preventDefault();
            });
        };

        // 포토후기 팝업
        const photoReviewPopup = () => {
            const photoReviewPopupSwiper = () => {
                if ($(".popupPhotoReview__detail__photo .swiper-slide").length > 1) {
                    new Swiper(".popupPhotoReview__detail__photo", {
                        pagination: {
                            el: '.photoSlider__controller__paging',
                            type: 'fraction',
                        },
                    });

                    $(".photoSlider__controller").css("display", "block");
                }
            };

            const photoReviewPopupInit = () => {
                photoReviewPopupSwiper();
            };

            photoReviewPopupInit();
        };

        // 상품후기 이미지 보기 팝업
        const previewPopup = () => {
            const previewPopupOpen = () => {
                $document.on("click", ".photo__list", function(e) {
                    const $this = $(this);
                    const _idx = $this.index();
                    const _bbsix = $this.closest(".goodsReview__list").data("bbsix");

                    $(".fb__popup-layout").addClass("full-layer photoPreview");

                    common.util.modal.open("ajax", "이미지 보기", "/popup/photoPreview/"+ _bbsix+ "/"+ _idx, "", function() {
                    }, "");

                    e.preventDefault();
                });
            };

            const previewPopupPopupInit = () => {
                previewPopupOpen();
            };

            previewPopupPopupInit();
        };

        const goodsReviewInit = () => {
            window.photoReviewPopup = photoReviewPopup;

            goodsReviewSwitch();
            previewPopup();
        };

        goodsReviewInit();
    };

    const view_init = () => {
        navTab();
        list_show();
        ifLogin();
        lazyload();
        goodsView_slider();
        goodsNotiToggle();

        goodsReview();
    };

    view_init();
}

export default shop_goodsView;
