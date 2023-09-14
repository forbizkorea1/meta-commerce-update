const shop_goodsView = () => {
    const $window = $(window);
    const $document = $(document);

    // 상단 네비게이션 바 : 옵션 갯수 8개 초과시 
    const pageNavBox = () => {
        $(".custom-select__view__title").on("click", function() {
            const $this = $(this);
            const $parents = $this.closest(".custom-select__view");
            const $optionBox = $parents.find(".custom-select__view__layer");
            const $option = $parents.find(".custom-select__view__option");
            const _columnPerView = 8; 
        
            if (!$option.length) return;

            if (_columnPerView < $option.length) {
                $optionBox.addClass("column2");
            }
            else {
                $optionBox.removeClass("column2");
            }
        });
    };

    const view_piz = () => {
        $.fn.picZoomer = function(options) {
            var opts = $.extend({}, $.fn.picZoomer.defaults, options),
                $this = this,
                $picBD = $('<div class="picZoomer-pic-wp"></div>').css({ 'width': opts.picWidth + 'px', 'height': opts.picHeight + 'px' }).appendTo($this),
                $pic = $this.children('img').addClass('picZoomer-pic').appendTo($picBD),
                $cursor = $('<div class="picZoomer-cursor"><i class="f-is picZoomCursor-ico"></i></div>').appendTo($picBD),
                cursorSizeHalf = { w: $cursor.width() / 2, h: $cursor.height() / 2 },
                $zoomWP = $('<div class="picZoomer-zoom-wp"><img src="" alt="" class="picZoomer-zoom-pic"></div>').appendTo($this),
                $zoomPic = $zoomWP.find('.picZoomer-zoom-pic'),
                picBDOffset = { x: $picBD.offset().left, y: $picBD.offset().top };

            opts.zoomWidth = opts.zoomWidth || opts.picWidth;
            opts.zoomHeight = opts.zoomHeight || opts.picHeight;
            var zoomWPSizeHalf = { w: opts.zoomWidth / 2, h: opts.zoomHeight / 2 };

            $zoomWP.css({ 'width': opts.zoomWidth + 'px', 'height': opts.zoomHeight + 'px' });
            $zoomWP.css(opts.zoomerPosition || { top: 0, left: opts.picWidth + 30 + 'px' });
            $zoomPic.css({ 'width': opts.picWidth * opts.scale + 'px', 'height': opts.picHeight * opts.scale + 'px' });

            $picBD.on('mouseenter', function(event) {
                $cursor.show();
                $zoomWP.show();
                $zoomPic.attr('src', $pic.attr('src'))
            }).on('mouseleave', function(event) {
                $cursor.hide();
                $zoomWP.hide();
            }).on('mousemove', function(event) {
                var x = event.pageX - picBDOffset.x,
                    y = event.pageY - picBDOffset.y;

                $cursor.css({ 'left': x - cursorSizeHalf.w + 'px', 'top': y - cursorSizeHalf.h + 'px' });
                $zoomPic.css({ 'left': -(x * opts.scale - zoomWPSizeHalf.w) + 'px', 'top': -(y * opts.scale - zoomWPSizeHalf.h) + 'px' });

            });
            return $this;

        };

        $.fn.picZoomer.defaults = {
            picWidth: 640,
            picHeight: 640,
            scale: 1.5,
            zoomerPosition: { top: '0', left: '640px' },
            zoomWidth: 640,
            zoomHeight: 640
        };
    };

    // 상단 상품이미지 슬라이더
    const goodsPhotoEvent = () => {
        const PhotoSlider = () => {
            const $target = $(".js__goodsPhoto__wrapper");
            const minLength = 5;
            const isPass = canMakeSlider($target, minLength);

            if (!isPass) return;
            
            new Swiper(".js__goodsPhoto__slider", {
                slidesPerView: "auto",
                loop: true,
                navigation: {
                    prevEl: '.js__goodsImages__prev',
                    nextEl: '.js__goodsImages__next',
                },
            });

        }

        const PhotoChange = () => {
            $document.on("click", ".js__goodsPhoto__item a", function() {
                const $this = $(this);
                const $target = $(".js__goods-view__thumb");
                const $pic = $this.find('img');
                const _pic_src = $pic.attr('src');

                $(".js__goodsPhoto__item a").removeClass("on");
                $(this).addClass("on");
                
                $target.find(".js__goods-view__image").attr("src", _pic_src);
                return false;
            });
        }

        const init = () => {
            PhotoSlider();
            PhotoChange();
        }

        init();
    };

    const tab_menu = () => {
        $document.on("click", ".js__goodsTab", function(e) {
            const $this = $(this);
            const _id = $this.find(".devDetailTabs").data("content");

            if (!$this.hasClass("active")) {
                $this.addClass("active").siblings().removeClass("active");
                $(".detail__cont").removeClass("show");
                $("#"+ _id).addClass("show");
            }

            e.preventDefault();
        })
    };

    const asideFixed = () => {
        const $header = $('.fb__header__nav');
        const $content = $(".fb__goodsView__detail");
        const $floating = $('.detail__aside');
        
        $window.on("load scroll" , function() {
            const $this = $(this);
            const minNum = 0;
            const headerHeight = $header.outerHeight(true);
            const maxNum = $content.height() - $floating.outerHeight(true);

            const currentNum = $this.scrollTop() - ($content.offset().top - headerHeight);
            const val = Math.min(maxNum, Math.max(currentNum, minNum));

            if (val >= 0) {
                $floating.css({
                    'transform': 'translate3d(0, '+ val +'px, 0)'
                });
            }

        });
    };

    const info_popup = () => {
        $document.on("click", ".info__question", function() {
            const $this = $(this);
            const $target = $this.parents(".info__wrap-popup").find(".info__popup");
            const $allPopup = $('.info__question').parents(".info__wrap-popup").find(".info__popup");
            $allPopup.removeClass("info__popup--show");
            $target.addClass("info__popup--show");
            close_popup();
        });

        const close_popup = () => {
            $document.on("click", ".info__popup__close", function() {
            const $this = $(this);
            const $popup_box = $this.parent(".info__popup");
            $popup_box.removeClass("info__popup--show");
            });
        }
    };
    
    //문의 slide
    const list_show = () => {
        $document.on("click", ".js__qna__question", function() {
            const $this = $(this);
            const $target   = $this.closest(".js__qna__wrapper").find(".js__qna__answer");
            
            // 비공개이면서 사용자가 작성한 글이 아닐 경우
            if ($this.find(".tit-txt").hasClass('private') && $this.find(".tit-txt").hasClass('devNotSameUser')) { 
                $target.hide();
                common.noti.alert(common.lang.get('product.bbsQnaHidden.alert'));
                return;
            }
            else {
                if (!$this.hasClass("slideDown")) {
                    $this.addClass("slideDown");
                    $target.slideDown("fast");
                }
                else {
                    $this.removeClass("slideDown");
                    $target.slideUp("fast");
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
        * {layoutCommon.templetSrc}/Photo/common/loading.gif 로딩 이미지 샘플
        * attribute : data-src
        * */
        const $target = $('img[data-src]');
        $target.Lazy({
            threshold: 50
        });


    };

    // 관련상품 슬라이더
    const relatedSlider = () => {
        const $target = $(".related__slider");
        const minLength = 6;
        const isPass = canMakeSlider($target, minLength);

        if (!isPass) return;
        
        new Swiper(".js__related__slider .swiper-container", {
            loop: true,
            spaceBetween: 22,
            slidesPerView: 6,
            slidesPerGroup: 6,
            loopFillGroupWithBlank: true,
            navigation: {
                prevEl: '.js__related__prev',
                nextEl: '.js__related__next',
            },
            pagination: {
                type: "fraction",
                el: '.js__related__pagination',
            },
        });

        $(".related__control").addClass("show");
    };

    // 관련상품 스크롤바 플러그인
    const relatedExhibitionScroll = () => {
        $('.related-exhibition__scroll').scrollbar();
    }

    // 인기상품 슬라이더
    const popularSlider = () => {
        const $target = $(".js__popular__slider");
        const minLength = 5;
        const isPass = canMakeSlider($target, minLength);

        if (!isPass) return;
        
        new Swiper(".js__popular__slider .swiper-container", {
            loop: true,
            spaceBetween: 30,
            slidesPerView: 5,
            slidesPerGroup: 5,
            loopFillGroupWithBlank: true,
            navigation: {
                prevEl: '.js__popular__prev',
                nextEl: '.js__popular__next',
            },
            pagination: {
                type: "fraction",
                el: '.js__popular__pagination',
            },
        });

        $(".popular__control").addClass("show");
    }

    const copy_item_number = () => {
        var $copyText = $('.info__item-number .code-number ');

        $document.on('click', '.info__item-number--copy', function() {
            $copyText.select();
            document.execCommand( 'Copy' );
        })
    };

    const photoSliderOn = () => {
        const $sliderThumb = $(".photo__slider__item");
        $sliderThumb.first().addClass("photo__slider__item--on");
        $document.on("click", ".photo__slider__item a", function () {
            $(this)
                .parents(".photo__slider__item")
                .addClass("photo__slider__item--on")
                .siblings()
                .removeClass("photo__slider__item--on");
        })
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
            

            const photoReviewPopupInit = () => {
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

                    common.util.modal.open("ajax", "이미지 보기", "/popup/photoPreview/"+ _bbsix+ "/"+ _idx, "", function() {
                    }, "");

                    e.preventDefault();
                });
            };

            const previewPopupSlider = _idx => {
                if ($(".popupGoodsPerview__list").length > 1) {
                    new Swiper(".popupGoodsPerview", {
                        loop: true,
                        slidesPerView: "auto",
                        navigation: {
                            prevEl: ".popupGoodsPerview__controller__btn--prev",
                            nextEl: ".popupGoodsPerview__controller__btn--next",
                        },
                        pagination: {
                            el: ".popupGoodsPerview__controller__paging",
                            type: "fraction",
                        },
                    }).slideTo(_idx, 0);

                    $(".popupGoodsPerview__controller").css("display", "block");
                }
            };

            const previewPopupPopupInit = () => {
                previewPopupOpen();
                window.previewPopupSlider = previewPopupSlider;
            };

            previewPopupPopupInit();
        };

        const goodsReviewInit = () => {
            goodsReviewSwitch();
            photoReviewPopup();
            previewPopup();
        };

        goodsReviewInit();
    };

    const view_init = () => {
        setTimeout( () => { pageNavBox(); }, 200 );
        pageNavBox();
        view_piz();
        goodsPhotoEvent();
        info_popup();
        tab_menu();
        asideFixed();
        list_show();
        ifLogin();
        lazyload();
        copy_item_number();
        photoSliderOn();
        relatedSlider(); //관련상품 슬라이더
        relatedExhibitionScroll(); //관련상품 스크롤
        popularSlider(); //인기상품 슬라이더
        goodsReview();
    };

    view_init();
};
 
export default shop_goodsView;
