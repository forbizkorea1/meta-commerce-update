/**
 * Created by forbiz on 2019-02-11.
 */

const layout = () => {
    const $document = $(document);
    const $window = $(window);
    const $body = $("body, html");

    const lazyload = () =>{
        /*
         * {layoutCommon.templetSrc}/images/common/loading.gif 로딩 이미지 샘플
         * attribute : data-src
         * + 모달의 컨텐츠 스크롤 영역에 lazyLoadPopup 클래스 추가
         * */
        const $target = $('img[data-src]');
        $target.attr("src", common.templetSrc + "/images/common/loading.gif");

        const $wrapper = $('.lazyLoadPopup').add(window);

        $target.Lazy({
            threshold: 50,
            appendScroll: $wrapper,
            onError: function (obj) {
                $(obj).attr("src", common.templetSrc + "/images/common/noimg.gif");
            },
        });
    };

    const header_back = () => {
        $(".header .js__header-back").on("click", function(e) {
            history.back(-1);

            e.preventDefault();
        });
    };

    const header_fav = () => {
        $document.on("click", ".fb__header__etc-fav", function() {
            var bookmarkURL = window.location.href;
            var bookmarkTitle = document.title;
            var triggerDefault = false;
            if (window.sidebar && window.sidebar.addPanel) {
                // Firefox version < 23
                window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
            } else if ((window.sidebar && (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)) || (window.opera && window.print)) {
                // Firefox version >= 23 and Opera Hotlist
                var $this = $(this); $this.attr('href', bookmarkURL);
                $this.attr('title', bookmarkTitle);
                $this.attr('rel', 'sidebar');
                $this.off(e);
                triggerDefault = true;
            } else if (window.external && ('AddFavorite' in window.external)) {
                // IE Favorite
                window.external.AddFavorite(bookmarkURL, bookmarkTitle);
            } else {
                // WebKit - Safari/Chrome
                alert((navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D 키를 눌러 즐겨찾기에 등록하실 수 있습니다.');
            }
            return triggerDefault;
        });
    };

    const gnbNavgation = () => {
        const navH = $(window).height();

        const gnbNavgationOpen = () => {
            $('#header .menu, #dockbar .dockbar__btn--caterogy').on('click', function() {

                if (!$('#document').is('.menu-open')) {
                    $('#document').addClass('menu-open').css({ height: navH });
                    $('#navigation .dim').show();
                } else {
                    $('#document').removeClass('menu-open').css({ height: 'auto' });
                    $('#navigation .dim').hide();
                }
            });
        };

        const gnbNavgationClose = () => {
            $document.on("click", ".dim, .menu-close", function() {
                if ($('#document').is('.menu-open')) {
                    $('#document').removeClass('menu-open').css({ height: 'auto' });
                    $('#navigation .dim').hide();
                }
            });
        };

        const gnbNavgationAccd = () => {
            $(".oneDepth__list__inner").on("click", function() {
                const $this = $(this);

                if (!$this.hasClass("on")) {
                    $this.addClass("on");
                } else {
                    $this.removeClass("on");
                }
            });

            $(".twoDepth__list__btn").on("click", function() {
                const $this = $(this);
                
                if (!$this.hasClass("on")) {
                    $this.addClass("on");
                } else {
                    $this.removeClass("on");
                }
            })
        };

        const gnbNavgationInit = () => {
            gnbNavgationOpen();
            gnbNavgationClose();
            gnbNavgationAccd();
        };

        gnbNavgationInit();
    };

    const topBtn = () => {
        const $btnTop = $(".btn-top");

        $btnTop.on("click", function() {
            $('body, html').stop().animate({
                scrollTop: 0
            });

            return false;
        });

        $window.off('scroll.scrollEvt').on('scroll.scrollEvt', function() {
            const $this = $(this);
            if ($this.scrollTop() > 0) {
                $btnTop.stop().fadeIn();
            } else {
                $btnTop.stop().fadeOut();
            }
        })
    };

    const fbModalEvents = () => {

        const modalShow  = () => {
            const $modal = $(".fb__popup-layout");
            $body.addClass("scroll--lock");
            $modal.addClass("show");
        };

        const modalClose = () => {
            $document.on("click", ".js__modal__close, .js__modal__mask", function () {
                //현재 모달 (모달 구분)
                const $target = $(this).closest(".js__modal");

                //target 모달 끄기
                $target.removeClass("show");
                $body.removeClass("scroll--lock");

                //클래스 reset
                $target.find(".js__modal__layer").removeClass().addClass("popup-layout js__modal__layer");

                return false;
            })
        };

        const init = () => {
            modalShow();
            modalClose();
        }

        init();
    }

    const isShowNoticePopup = (Boolean) => {
        const $noticePop = $(".js__notice__popup");

        if (!$noticePop.length) return ;

        if (Boolean) { //true여도 쿠키값 확인
            $noticePop.each((idx, el) => {
                const $this = $(el);
                let _uuid = $this.attr("devpopupix");
                let _eachCookie = localCookie.isEnd("noticeClose" + _uuid, 86400);

                if (_eachCookie) { //쿠키굽는중
                    $this.removeClass("show");
                }
                else {
                    $this.addClass("show");
                }
            })
        }
        else { //안보이기
            $noticePop.removeClass("show");
        }
    }

    /**
     * 공지팝업 - 오늘하루보지않기 / 닫기
     */
    const closeNotiPopup = () => {
        $document
            //닫기
            .on("click", ".js__notice__close", function () {
                $body.removeClass("scroll--lock");
            })
            //오늘하루 그만보기
            .on("click", ".js__notice__today-close", function () {
                const $noticePop = $(this).closest(".js__notice__popup");
                let _uuid = $noticePop.attr("devpopupix");

                //쿠키굽기
                localCookie.make("noticeClose" + _uuid);

                $body.removeClass("scroll--lock");

                //팝업닫기
                $noticePop.find(".js__notice__close").trigger("click");
            })
    }

    // 드로어 슬라이드 배너
    const drawerBanner = () => {
        new Swiper(".event__banner", {
            centeredSlides: true,
            loop: true,
            slidesPerView: "auto",
            pagination: {
                el: ".event__banner__pager",
            },
        });
    }

    const membershipLayerOpen = () => {
        $document.on("click", ".js__membership__open", function () {
            $(".fb__popup-layout").addClass("full-layer");
            common.util.modal.open('ajax', '회원등급혜택', '/popup/membershipBenefit/');

            return false;
        })
    }

    //네이버 톡톡
    const menuTalkTalk = () => {
        $document.on('click', '.btn-talktalk',function(){
            $(this).hide();
            $(this).siblings('.pub-talktalk__wrap').toggle();
        });

        $document.mouseup(function(e){
            var talkTalkWrap = $(".pub-talktalk__wrap");
            if(talkTalkWrap.has(e.target).length === 0){
                $('.btn-talktalk').show();
                talkTalkWrap.hide();
            }
        });
    }

    const layout_init = () => {
        window.lazyload = lazyload;
        window.isShowNoticePopup = isShowNoticePopup;
        window.fbModalEvents = fbModalEvents;

        header_back();
        header_fav();
        gnbNavgation();
        topBtn();
        lazyload();
        closeNotiPopup();
        drawerBanner();
        membershipLayerOpen();
        menuTalkTalk();
    };

    layout_init();
}

export default layout;
