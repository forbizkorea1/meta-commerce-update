/**
 * Created by forbiz on 2019-02-11.
 */


const layout = () => {
    const $document = $(document);
    const $window = $(window);
    const $body = $("body, html");

    const headerFloating = () => {
        $window.on("load scroll", function() {
            const $this = $(this);
            const st = $this.scrollTop();

            if ($(".fb__header__top").outerHeight() <= st) {
                $(".fb__header__nav").addClass("sticky");
            }
            else {
                $(".fb__header__nav").removeClass("sticky");
            }
        });
    };

    const gnbEvent = () => {
        const gnbEventOpen = () => {
            const $oneDpeth = $(".oneDepth__list");

            $oneDpeth.on("mouseenter", function() {
                const $this = $(this);

                if (!$this.hasClass("open")) {
                    $this.addClass("open").siblings().removeClass("open");
                }
            });
        };

        const gnbEventClose = () => {
            $(".oneDepth__list, .gnb__sub").on("mouseleave", function(e) {
                
                if (!$(e.relatedTarget).hasClass("open")) {
                    $(".oneDepth__list.open").removeClass("open");
                }
            });
        };

        const gnbEventInit = () => {
            gnbEventOpen();
            gnbEventClose();
        };

        gnbEventInit();
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

    const search = () => {
        const $close_btn = $(".js__headerSearch__reset");

        const searchlayer = (type) => {
            if (type == "focusin") {
                $(".wrap-search-layer").show();
            } 
            else {
                $(".wrap-search-layer").hide();
                $close_btn.removeClass("show");
            }
        }

        const showResetBtn = (_value) => {
            if (_value.length) $close_btn.addClass("show");
            else $close_btn.removeClass("show");
        }

        const isInsideInputArea = () => {
            $document
                .on("focusin ", ".js__headerSearch__input", function(e){
                    if (e.type == "focusin") {
                        searchlayer(e.type);
                        showResetBtn($(this).val());
                    }
                    else {
                        searchlayer(e.type);
                    }
                })
           
                .on("click", function(e) {
                    if ( !($(e.target).hasClass("wrap-search-layer")
                            || $(e.target).parents(".wrap-search-layer").hasClass("wrap-search-layer") 
                            || $(e.target).hasClass("js__headerSearch__input"))
                        ) {
                        searchlayer("blur");
                    }
                })
    
                .on("keyup", ".js__headerSearch__input", function(){
                    showResetBtn($(this).val());
                })
        }

        const resetInputWrite = () => {
            $document.on("click ", ".js__headerSearch__reset", function(e){
                $("#devHeaderSearchText").val('');
                $(this).removeClass("show");
            });
        }

        const init = () => {
            isInsideInputArea();
            resetInputWrite();
        }

        init();

       
    };

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

    const isShowNoticePopup = (Boolean) => {
        const $noticePop = $(".js__notice__popup");
       
        if (!$noticePop.length) return ;

        if (Boolean) { //true여도 쿠키값 확인하여 노출/비노출 구분
            $noticePop.each((idx, el) => {
                const $this = $(el);
                let _uuid = $this.attr("devpopupix");
                //하루 지났는지 확인 (86400), 다른 시간을 원하시면 다른 값을 넣어주세요. 초단위입니다.
                let _eachCookie = localCookie.isEnd("noticeClose" + _uuid, 86400);

                if (_eachCookie) { //쿠키굽는중
                    $this.removeClass("show");
                }
                else {
                    $this.addClass("show");
                }
            })
        }
        else { //비노출
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
    

    const fbModalEvents = () => {
        const $modal = $(".js__modal");
        const $content = $(".js__modal__content");
        const $layer = $(".js__modal__layer");
        let _addClassName = null;

        const fbModal = {
            //클래스 추가
            addClassToModal(_class) {
                const $layer = $(".js__modal__layer");
                if ($layer.length && _class) {
                    $layer.addClass(_class);
                    _addClassName = _class;
                }
            },

            // 모달 레이어 넓이 고정
            setWidthToModal(_width) {
                $layer.css("width", _width);
            },

            //모달 오픈 (dev_common.js에서 실행)
            modalShow () {
                const self = this;

                //body scroll lock
                $body.addClass("scroll--lock");
        
                $.each($content, function () {
                    let $this = $(this);
        
                    if (!!$this.attr("data-visible")) {
                        $modal.addClass("show");
                    }
                });
            },

            //모달 닫기
            modalClose() {
                $document.on("click", ".js__modal__layer .close, .js__modal__close, .js__modal__mask", function () {
                    $body.removeClass("scroll--lock");
                    $modal.removeClass("show");

                    //커스텀 class 추가한 경우
                    if (_addClassName) {
                        $layer.removeClass(_addClassName);
                    }

                    $("[data-visible]").attr("data-visible", "");
                    $("[data-target]").attr("data-target", "");

                    $("#devModalContent").empty();

                    $('.js__modal__layer').removeClass().addClass("fb__modal__layer js__modal__layer");
                    
                    return false;
                })
            },

            init() {
                const self = this;
                window.fbModal.setWidthToModal = self.setWidthToModal;
                window.fbModal.addClassToModal = self.addClassToModal;
                window.fbModal.modalShow = self.modalShow;
                window.fbModal.modalClose = self.modalClose;
                
                self.modalClose();
            }
        }

        window.fbModal = fbModal;
        fbModal.init();
    }

    //네이버 톡톡
    const menuTalkTalk = () => {
        if($('.pub-talktalk').length > 0){
            $window.scroll(function () {
                var btnTalk = $('.pub-talktalk').offset().top;
                var fixedPosition = $('.footer-menu').offset().top;

                if (btnTalk >= fixedPosition) {
                    $('.pub-talktalk').addClass("fix")
                }else {
                    $('.pub-talktalk').removeClass('fix');
                }
            });
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

    }
    const layout_init = () => {
        window.lazyload = lazyload;
        window.isShowNoticePopup = isShowNoticePopup;

        //모달 관련
        fbModalEvents();
        headerFloating();
        gnbEvent();
        header_fav();
        search();
        lazyload();
        closeNotiPopup();
        menuTalkTalk();
    };

    layout_init();
}

export default layout;
