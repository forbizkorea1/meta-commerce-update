const event_detail = () => {
    const $window = $(window);
    const $document = $(document);

    const event_detail_sticky = () => {
        let stFlag = false;

        if ($("#stickytab li").length < 2) {
            $(".goodsbox__tab").hide();
        } else {
            $(".goodsbox__tab").css({
                "height": $("#stickytab").outerHeight() 
            })
        }

        $document
            .on("click", "#stickytab li a", function() {
                const $this = $(this);
                const $floating = $this.closest('#stickytab');
                const _id = $this.attr('href').replace("#", "");
                const $content = $("#"+ _id);
                const _contentOffset = Math.round($content.offset().top);
                const _headerHeight = $('#navigation,.fb__header__nav').outerHeight();

                $this.closest("li").addClass("on").siblings().removeClass("on");
                stFlag = true;

                $('html, body').stop().animate({
                    scrollTop: _contentOffset - _headerHeight - Math.round($floating.height())
                }, 500, function() {
                    stFlag = false;
                });

                return false;
            });
    
        $window
            .on('load scroll', function() {
                const $this = $(this);
                const $floating = $('#stickytab');
                const $floatingList = $floating.find("li");
                const $box = $(".fb__event-detail__goodsbox");
                const $itemInner = $('.goodsbox__contents');
                const _headerHeight = $('#navigation,.fb__header__nav').outerHeight();;
                const _fixedHeight = _headerHeight + $floating.outerHeight();
                const _st = $this.scrollTop();

                if (!$box.length) return;

                if ($box.offset().top - _headerHeight <= _st && ($box.offset().top + $box.outerHeight()) - (_headerHeight + $('#stickytab').outerHeight()) > _st) {
                    $floating.removeClass("absolute").addClass('sticky').css({
                        "top": _headerHeight +"px",
                        "bottom": "",
                    });
                } else if ($box.offset().top + $box.outerHeight() - (_headerHeight + $('#stickytab').outerHeight()) <= _st) {
                    $floating.removeClass("sticky").addClass('absolute').css({
                        "top": ""
                    });
                } else {
                    $floating.removeClass('sticky').css({
                        "top": ""
                    });;
                }
        
                if (!stFlag) {
                    for (var i = 0; i < $itemInner.length; i++) {
                        if (Math.round($itemInner.eq(i).offset().top) - _fixedHeight <= _st && _st < (Math.round($itemInner.eq(i).offset().top) + $itemInner.eq(i).outerHeight(true)) - _fixedHeight) {
                            $floatingList.removeClass("on");
                            $floatingList.eq(i).addClass("on");
                        }
                    }
                }
            });
    };

    const event_review = () => {
        const $write_area = $('.comment__write__area');
        const $write_btn = $('.comment__write__button');

        // 수정 영역
        const edit_area = () => {
            $document.on("click", ".js__edit__btn", function() {
                const $this = $(this);
                const $parents = $this.closest(".js__comment");
                const $editArea = $parents.find(".js__edit__wrapper");
                const $textArea = $parents.find(".js__edit__textArea");
                const _targetText = $parents.find(".js__comment__text").text().trim();

                $editArea.addClass("show");
                $textArea.text(_targetText);
                countTextLength($textArea);
            });

            $document.on("click", ".js__edit__cancel", function() {
                const $this = $(this);
                const $target = $this.closest(".js__comment").find(".js__edit__wrapper");

                $target.removeClass("show");
            })
        }

        // 로그인 여부 확인
        if (forbizCsrf.isLogin) {
            $write_area.attr('disabled', false);
            $write_btn.attr('disabled', false);
        } 
        else {
            $write_area.attr('placeholder', '로그인 후 댓글을 입력해 주세요');
            $('.js__form__login').css({
                'display': 'block'
            });
        }

        edit_area();
    };

    const eventDetail_init = () => {
        event_detail_sticky();
        event_review();
        countTextLength($(".js__textcount__area"));
    };
    
    eventDetail_init();
};

export default event_detail;
