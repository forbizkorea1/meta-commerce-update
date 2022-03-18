/**
 * Created by forbiz on 2019-02-11.
 */
const layout = () => {
    const $document = $(document);
    const $window = $(window);
    const $body = $('body')
    const layout_scroll = () => {

        $window.on("scroll", function() {
            const $this = $(this);
            const $sT = $this.scrollTop();
            const $title = $(".fb__content-header");
            const $contents = $(".fb_contents");
            const _header = $(".fb__header").height() + $(".fb__content-route").height();

            if($sT > _header) {
                $body.addClass("fb--fixed");
                $title.addClass("fb__content-header--fixed");
                $contents.addClass("fb_contents--fixed");
            } else {
                $body.removeClass("fb--fixed");
                $title.removeClass("fb__content-header--fixed");
                $contents.removeClass("fb_contents--fixed");
            }
        });

    };

    const layout_header = () => {
        const $1death = ".main-nav__wrap > li"
        $document.on("mouseover mouseleave focusin focusout", $1death ,function(e) {
            const $this = $(this);
            const $2dath = $this.find(".main-nav__box");
            if(e.type == "mouseover" || e.type == "focusin") {
                if(!!($2dath.length) || $2dath.is(":visible")) {
                    $2dath.addClass("main-nav__box--show");
                }
            } else {
                $2dath.removeClass("main-nav__box--show");
            }
        });
    };

    const layout_btn = () => {
        const layout_fav = () => {
            $document
                .on("click", ".relation__favorites-btn", function() {
                    const $this = $(this);
                    if($(".search-box").is(":visible")) {

                        $(".relation__search-btn").removeClass("relation__favorites-btn--open");

                    } else {

                        if($this.hasClass("relation__favorites-btn--open")) {
                            $body.removeClass("fb--fade");
                        } else {
                            $body.addClass("fb--fade");
                        }
                    }

                    $this.toggleClass("relation__favorites-btn--open");
                    return false;
                })
                .on("click", ".favorites-box__delete", function() {
                    $(this).parent().remove();
                    return false;
            });
        };

        const layout_search = () => {
            $document.on("click", ".relation__search-btn", function() {
                const $this = $(this);
                if($(".favorites-box").is(":visible")) {

                    $(".relation__favorites-btn").removeClass("relation__favorites-btn--open");

                } else {

                    if($this.hasClass("relation__favorites-btn--open")) {
                        $body.removeClass("fb--fade");
                    } else {
                        $body.addClass("fb--fade");
                    }
                }

                $this.toggleClass("relation__favorites-btn--open");

                return false;
            });
        };

        const layout_btn_init = () => {
            layout_fav();
            layout_search();
        };

        layout_btn_init();
    };

    const left_nav = () => {
        $document.on("click", ".page-nav__wrap > li" ,function(e) {
            var $this = $(this);
            $this.find("a").toggleClass("page-nav__2death--active");
            $this.find(".page-nav__subbox").toggleClass("page-nav__subbox--show");
        })
        .on("click", ".page-nav__wrap ul", function(e) {
            e.stopPropagation();
        });
    };

    const bottom_nav = () => {
        const $target = $(".fb__bottom-fixemenu");
        const bottom_nav_event = () => {
            $window.on('scroll load resize',function(e) {
                const $target = $(".fb__bottom");
                const $target_fixed = $target.find(".fb__bottom-fixemenu");
                const $target_parent = $(".fb_contents");
                const win_b =  $(window).scrollTop() + $(window).height();


                if(e.type = "Load" && $target.offset().top + $target_fixed.height() <= win_b) {
                    $target_parent.css({
                        "padding-bottom" : 67
                    })
                    $target_fixed
                        .removeClass("fb__bottom-fixemenu--fixed")
                        .css({
                            "bottom" : 0
                        });
                } else {
                    $target_parent.css({
                        "padding-bottom" : 67 + 15 + $target_fixed.height()
                    });
                    $target_fixed
                        .addClass("fb__bottom-fixemenu--fixed")
                        .css({
                            "bottom" : $(".fb__header").height() + $("#content").height() - $window.height() - $window.scrollTop()
                        })
                };

            });
        };

        const bottom_nav_click = () => {
            $target.find(".fb__fixemenu-btn").on("click", function() {
                const $this = $(this);
                $this.toggleClass("fb__fixemenu-btn--active");
                $(".fb__fixemenu__contents").toggleClass("fb__fixemenu__contents--show");
                return false;
            });
        };

        const bottom_nav_init = () => {
            bottom_nav_event();
            bottom_nav_click();
        }

        if($target.length) {
            bottom_nav_init();
        }
    }

    const common_module = () => {
        const modal = {
            madal_make(data, option) {
                const _css = {
                    width : option.width ?  option.width : "100px",
                    height : option.height ?  option.height : "100px",
                    top() {
                        return parseInt(this.height) / 2;
                    },
                    left() {
                        return parseInt(this.width) / 2;
                    }
                };

                const markup = `
                <div class="fb-modal__wrap" >
                    <div class="fb-modal__bg"></div>
                     <div class="person fb-modal__content ${option.class}" style="position: absolute; top: 50%; left: 50%;width: ${_css.width}; height: ${_css.height} ; margin-top: ${"-" + _css.top() + "px"}; margin-left: ${"-" + _css.left() + "px"} ;">
                        <header class="fb-modal__header">
                            <h2 class="fb-modal__title">
                                ${data.name}
                            </h2>
                            <a href="#" class="fb-modal__close"> close</a>
                        </header>
                        <div class="fb-modal__content fb-modal__scroll">${data.bio}</div>
                     </div>
                </div>
                `;

                $body.append(markup).addClass("fb-modal");

            },
            modal_data (callback, option, data) {
                return callback(data, option);
            },
            modal_event() {
                const $parent = this;
                $document
                    .on("click", "[data-modal]", function() {
                        const $this = $(this);
                        $parent.modal_data($parent.madal_make, $this.data("option"));
                        //madal_make($this.data("option"));
                        //modal_data(madal_make, $this.data("option"));
                        return false;
                    })
                    .on("click", ".fb-modal__close, .fb-modal__bg", function() {
                        const $this = $(this);

                        if (!$this.hasClass("notclose")) {
                            $body.removeClass("fb-modal");
                            $this.parents(".fb-modal__wrap").remove();
                        }
                        
                        return false;
                    });
            }

        };

        window.modal = modal;

        const menu = () => {
            const menu_event = () => {
                $document.on("click", ".fb__menusubmit-btn", function() {
                    const $this = $(this);

                    $this.toggleClass("fb__menusubmit-btn--open");
                    $this.parent().next().toggleClass("fb-filter--hide");
                    return false;
                })
            };

            const menu_init = () => {
                menu_event();
            };

            menu_init();
        }

        const file = () => {

            const controller = {
                change($this) {
                    $this.parents(".fb__file__list").find(".fb__file__input--file")
                        .trigger("click")
                        //.attr("data-staus", "change")
                },
                view() {
                    // modal.modal_data(modal.madal_make, {"width": "901px", "height": "497px","class" : "fileview"});
                },
                del($this) {
                    $this
                        .parents(".fb__file__list").find("img").attr("src", $this.attr("data-file-src"))
                        .end().find(".fb__file__input").removeClass("fb__file__input--submit")
                        .find(".fb__file__input--file").data("status", "delete")
                        .end().end().find(".fb__file__input--file").val("");
                }
            };

            $document
                .on("change", ".fb__file__input--file", function() {
                    const input = this;
                    const fileType = "image/jpg|image/jpeg|image/png|image/x-icon|image/vnd.microsoft.icon";  // 다른 파일 형식이 있는 경우 추가

                    if (input.files && input.files[0]) {
                        const reader = new FileReader();
                        
                        if (!input.files[0].type.match(fileType)) {
                            alert("파일 형식이 올바르지 않습니다.\n다시 첨부해주세요.");
                            return;
                        }

                        reader.onload = function(e) {
                            const $target = $(input);
                            var _staus = $target.data("status") == "upload" ? "change" : "upload";
                            $target
                                .data("status", _staus)
                                .parents(".fb__file__list").find("img").attr("src", e.target.result)
                                .parents(".fb__file__list").find(".fb__file__input").addClass("fb__file__input--submit");

                            $target.closest(".fb__file__input").siblings(".fb__file__btn").find(".fb__file__btn--view").attr("href", e.target.result);
                        };
                        reader.readAsDataURL(input.files[0]);
                    }
                })
                .on("click", "[data-file-btn]", function() {
                    const $this = $(this);
                    controller[$this.data("file-btn")]($this);
                    return false;
                })

                $document
                    .on("click", ".fb__file__btn--view", function(e) {
                        var $this  = $(this);
                        var url = $this.attr("href");

                        if (url) {
                            // var url_with_name = url.replace("data:application/pdf;", "data:application/pdf;name=myname.pdf;")

                            var html = `
                                <html>
                                    <style>
                                        html, body {padding: 0; margin: 0;}
                                        iframe {width: 100%; height: 100%; border: 0;}
                                    </style>
                                    <body>
                                        <iframe type="application/pdf" src="${url}"></iframe>
                                    </body>
                                </html>
                            `;

                            var a = window.open("about:blank", "Zupfnoter");
                            a.document.write(html);
                            a.document.close();
                        }
                        
                        e.preventDefault();
                    });
        }

        const h_add = () => {
            !(function(){if(!Handlebars.original_compile) Handlebars.original_compile = Handlebars.compile;Handlebars.compile = function(source){var s = "\\{\\[",e = "\\]\\}",RE = new RegExp('('+s+')(.*?)('+e+')','ig');var replacedSource = source.replace(RE,function(match, startTags, text, endTags, offset, string){var startRE = new RegExp(s,'ig'), endRE = new RegExp(e,'ig');startTags = startTags.replace(startRE,'\{\{');endTags = endTags.replace(endRE,'\}\}');return startTags+text+endTags;});return Handlebars.original_compile(replacedSource);};})();
        }

        const category_more = () => {
            const js_height = () => {
                const $inner = $(".fb-menudevice__inner");
                const _inner = $inner.height();
                const _content =  $(".fb-menudevice__inner > ul").height();
                const _height = _inner >= _content ? _inner : _content;
                $inner.height(_height);
            };

            window.js_height = js_height;

            $(".fb-menudevice__more").on("click", function() {
                js_height()
                return false;
            });
        }

        const return_false = () => {
            $document.on("click", ".return_false", function() {
                return false;
            });
        }

        const img_piz = () => {
            $document.on("mouseover mouseleave", ".fb-piz__img", function(e) {
                const $this = $(this);
                if(e.type == "mouseover") {
                    const posBottom = $('body').height() - $this.offset().top - 100;
                    const posLeft = $this.parent().offset().left + $this.parent().outerWidth();

                    $("body > .fb-piz__img--add").remove();
                    $("body").append(`<div class="fb-piz__img--add" style="bottom: ${ posBottom }px; left: ${ posLeft }px"><img src="${ $this.attr("data-src") }" onerror="this.src=\'/data/mall_data/images/product/noimg.gif\'" /></div>`)
                } else {
                    $(".fb-piz__img--add").remove();
                }
            });
        }

        const btn_select = () => {
            $document
                .on("click", ".fb-filter__button-btn", function() {
                    const $this = $(this);
                    $(".fb-filter__button-box").removeClass("fb-filter__button-box--show");
                    $this.next().toggleClass("fb-filter__button-box--show");
                })
                .on("click", ".fb-filter__button-link", function() {
                    const $this = $(this);
                    const $btn = $this.parents('.fb-filter__button').find(".fb-filter__button-btn");
                    if($btn.attr("data-value") != $this.attr("data-value")) {
                        $btn.attr("data-value", $this.attr("data-value"))
                        $($btn.attr("data-target")).val($this.attr("data-value"));
                        $this.parents(".fb-filter__button-box").removeClass("fb-filter__button-box--show");
                    };

                    return false;
                })
                .on("mouseleave", ".fb-filter__button",function(e) {
                    // if($(e.target).attr("class") && $(e.target).attr("class").indexOf("fb-filter__button-btn") != 0) {
                    //     $(".fb-filter__button-box").removeClass("fb-filter__button-box--show");
                    // }
                    $(".fb-filter__button-box").removeClass("fb-filter__button-box--show");
                })

        }

        const layer_popup = () => {
            $document.on("keyup","input[type='text']", function(){
                const _inputLength = $(this).val().length;
                const _inputMax = $(this).attr("maxlength");
                if(_inputLength == _inputMax) {
                    $(this).next().focus();
                }
            });
        }

        /**
         * 전체선택
         * js__check__wrapper - 전체 체크박스 감싼 영역
         * js__check__all     - 전체선택 체크박스 input
         * js__check__each    - 체크박스 각각
         *
         * 전체체크박스 안 또다른 전체체크 영역
         * js__another__wrapper - 전체 체크박스 안 또다른 체크박스 영역
         * js__another__all    - 또다른 체크박스 영역의 전체선택
         * data-another-target="true" - 또다른 체크박스 영역의 각각
         */
        const allSelectCheckbox = () => {
            //전체선택 이벤트
            const allCheckEvent = ($this, $btnEach) => {
                if ( $this.is(":checked") ) {
                    $this.add($btnEach).prop("checked", true);
                }
                else {
                    $this.add($btnEach).prop("checked", false);
                }
            }

            //개별선택 이벤트
            const eachCheckEvent = ($btnAll, $btnEach) => {
                let checkFlag = true;   // 모두 체크 상태 체크

                $btnEach.map(idx => {
                    if( !$btnEach.eq(idx).is(":checked")) {
                        checkFlag = false;

                        return false;
                    }
                });

                $btnAll.prop("checked",checkFlag).attr("checked",checkFlag);
            }

            // 클릭 이벤트 바인딩
            const bindEvents = () => {
                $document
                //전체선택 체크박스 클릭 시
                    .on("click", ".js__check__all", function() {
                        const $this = $(this);
                        const $btnEach = $this.closest(".js__check__wrapper").find(".js__check__each");

                        allCheckEvent($this, $btnEach);
                    })

                    //체크박스 안 또다른 영역이 있는 경우 (회원가입 약관동의 참고)
                    .on("click", ".js__another__all", function () {
                        const $this = $(this);
                        const $btnEach = $this.closest(".js__another__wrapper").find(".js__check__each:not(.js__another__all)");

                        allCheckEvent($this, $btnEach);

                    })

                    //개별 체크박스 클릭 시
                    .on("click", ".js__check__each", function() {
                        const $this = $(this);
                        const $area = $this.closest(".js__check__wrapper");
                        const $btnAll = $area.find(".js__check__all");
                        const $btnEach = $area.find(".js__check__each");

                        //안에 한개 더 체크해야할 경우가 있는지 체크 (회원가입 약관동의 참고)
                        const isAnotherTarget = $this.data("another-target");

                        // 안에 한개 더 체크해야할 경우 한번 더 체크
                        if (isAnotherTarget) {
                            const $anotherArea = $this.closest(".js__another__wrapper");
                            const $anotherAll = $anotherArea.find(".js__another__all");
                            const $anotherEach = $anotherArea.find(".js__check__each:not(.js__another__all)");

                            eachCheckEvent($anotherAll, $anotherEach);
                        }

                        // 기본 체크
                        eachCheckEvent($btnAll, $btnEach);
                    });
            }

            //이미 전체 선택되어있는지 체크
            const initEvents = () => {
                const $all = $(".js__check__all");
                const $each = $(".js__check__each");

                //선택된 개수가 전체선택된 개수라면 전체선택에 checked
                if ($all.length && $each.length) eachCheckEvent($all, $each);
            }

            const init = () => {
                initEvents();
                bindEvents();
            }

            init();
        }


        const common_module_init = () => {
            //modal();
            modal.modal_event();
            menu();
            file();
            h_add();
            category_more();
            return_false();
            img_piz();
            btn_select();
            layer_popup();
            allSelectCheckbox();
        }

        common_module_init();
    }

    const textarea_count = () => {
        $('.countTextarea').keyup(function (){
            var content = $(this).val();
            var $countLength = $(this).attr('maxlength')
            var $counter = $(this).closest('td').find('.counter');
            $counter.html("("+content.length+" / 최대 "+$countLength+"자)");    //글자수 실시간 카운팅

            if (content.length > $countLength){
                alert("최대 "+$countLength+"자까지 입력 가능합니다.");
                $(this).val(content.substring(0, $countLength));
                $counter.html("("+$countLength+" / 최대 "+$countLength+"자)");
            }
        });
        $document.ready(function (){
            $('.countTextarea').trigger('keyup');
        });

    }

    const select_use_disp = () => {
        $('.devSelectUse input[type=radio]').click(function () {
            var $this = $(this);
            var $thisName = $this.attr('name');
            var $target = $('#'+$thisName);
            if ($this.val() == 'Y') {
                $target.show();
            } else {
                $target.hide();
            }
        });
    }
    const layout_init = () => {
        layout_scroll();
        layout_header();
        layout_btn();
        left_nav();
        bottom_nav();
        common_module();
        textarea_count();
        select_use_disp();
    };

    layout_init();
}

export default layout;