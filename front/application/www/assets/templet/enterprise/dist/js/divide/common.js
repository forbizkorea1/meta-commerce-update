/**
 * Created by forbiz on 2019-02-11.
 */
const front_common = () => {
    const $document = $(document);
    const $window = $(window);
    const $body = $("body");
    
    /**
     * localStorage 사용한 쿠키 함수
     * 오늘하루 보지않기 등에 사용
     */
    const localCookie = {
        /**
         * 쿠키값 localStorage 있는지 확인
         * @param {string} cookieName - 쿠키이름
         */
        get(cookieName) {
            return window.localStorage.getItem(cookieName) || "";
        },
        /**
         * 쿠키 이름값으로 localStorage에 현재 시간 저장 (millisecond 기준)
         * @param {string} cookieName - 쿠키이름
         */
        make(cookieName) {
            window.localStorage.setItem(cookieName, new Date().getTime());
        },
        /**
         * localStorage에 있는 시간과 현재 시간 비교
         * calc(현재시간 - localStorage) 시간을 초 단위로 변경 후 시간 비교하여 체크
         * 
         * @param {string} cookieName - 쿠키이름, 
         * @param {number} time - 초단위의 시간
         */
        isEnd(cookieName, time) {
            const _session = Number(localCookie.get(cookieName));

            if (_session){ 
                let _result = false;
                const _current = Number(new Date().getTime());
                
                if ((_current - _session)/1000 < time) {
                    _result = true; //쿠키 굽는중
                }
                else {
                    _result = false; //쿠키 시간 지남
                    localCookie.remove(cookieName);
                }
                
                return _result;

            } else {
                return false;
            }
        },
        /**
         * localStorage 값 제거 (쿠키 제거)
         * @param {string} cookieName - 쿠키이름
         */
        remove(cookieName) {
            window.localStorage.removeItem(cookieName);
        }
    };

    /**
     * 레이어 js__layer 
     * 열기버튼 js__layer__open
     * 닫기버튼 js__layer__close
     */
    const fn_layer = () => {
        /**
         * 레이어 열기
         *   1. 동작이 일어나는 버튼에 js__layer__open 클래스 추가
         *   2. 동작이 일어나는 버튼에 data-layer="레이어 아이디값" 속성 추가
         */
        $document.on("click", ".js__layer__open, .js__infolayer__open", function () {
            const _layer = $(this).data("layer");
            const $layer = $("#" + _layer);
            const isInfolayer =  $(this).hasClass("js__infolayer__open");

            layer_show($layer, true, null, isInfolayer);
        })

        /**
         * 레이어 닫기
         *   1. 닫기버튼에 js__layer__close 클래스 추가
         *   2. 해당 레이어 최상위에 js__layer 클래스 추가
         */
        $document.on("click", ".js__layer__close", function () {
            const _this = $(this);
            const $layer = _this.closest(".js__layer");
            layer_show($layer, false);
        })
    }

    /**
     * 레이어 열고 닫기
     * @param {element} $layer - 레이어 선택자(필수)
     * @param {boolean} Boolean - open(true) / close(false)
     */
    const layer_show = ($layer, Boolean, callback, isInfolayer) => {
        if (!$layer) return ;

        if (Boolean) {
            $layer.addClass("show"); 
            
            if (!isInfolayer) $body.addClass("scroll--lock");
        }
        else{
            $layer.removeClass("show");
            $body.removeClass("scroll--lock");
        }

        if (callback) callback();
    };

    /**
     *   슬라이드 실행여부 판단 함수
     *   $target 은 swiper-container 나 그보다 부모 (슬라이드버튼, 슬라이드 컨테이너 모두 감싼 element로)
     *   슬라이드 버튼은 js__slider__nav 로 통일
     * */
    const canMakeSlider = ($target, minLength) => {
        var isPass = true;
        const $slides = $target.find(".swiper-slide");

        if ($slides.length <= minLength) {
            isPass = false;
        }

        if (isPass) $target.find(".js__slider__nav").addClass("show");
        else $target.find(".js__slider__nav").removeClass("show");

        return isPass; //슬라이드 만들거면 true / 아니면 false
    };

    /**
     * 우측 또는 좌측 fixed 메뉴 공통 스크립트
     * 프로젝트 시작할때 header가 fixed 인지 아닌지 headerFix에 true, false만 바꿔주면 됨. ****
     * 
     * @param {element} fixTarget [필수] 스크롤 따라다니는애
     * @param {element} startTarget [필수] 시작점 element
     * @param {element} bottomTarget [필수아님] (없으면 #container 하단 기준) >> offset + height임!
     */
    const sideScrollFix = (fixTarget, startTarget, bottomTarget) => {
         
        if (!fixTarget.length || !startTarget.length) return ;

        // header가 fixed 인지 아닌지 여부(프로젝트 별 상이하므로 Boolean값 변경 필요)
        let headerFix = true; 

        //element
        const $header = $(".fb__header__menu"); //여기 fixed일때 헤더높이 가져올 엘리먼트로~!
        const $bottom = bottomTarget ? bottomTarget : $("#container");
        const $start = startTarget;
        const $StickyNav = fixTarget;

        let _headerHeight = headerFix ? $header.outerHeight() : 0;

        const customStyle = {
            _reset: {
                "position": "",
                "top": "",
                "bottom": ""
            },
            
            _absolute: {
                "position": "absolute",
                "top": "auto",
                "bottom": 0
            },

            _fixed: {
                "position": "fixed",
                "top": _headerHeight,
                "bottom": "auto"
            }
        }

        $window.on("scroll", e => {
            let _stickyHeight = $StickyNav.height();
            let _current = $window.scrollTop(); //현재 스크롤위치
            let _start = $start.offset().top - _headerHeight; //시작위치
            let _bottom = ($bottom.offset().top + $bottom.height() - _headerHeight); //하단위치

           if ( _current >= _start ) { //fix 시작되는 시점
                $StickyNav.css(customStyle._fixed)

                // 내려가다가 하단에 닿았을 경우
                if ( _bottom <= _current + _stickyHeight ) $StickyNav.css(customStyle._absolute);
            } 
            else { //기본 default 상태 
                $StickyNav.css(customStyle._reset)
            }
        })
    }

    /**
     * 탭 이벤트 
     * 탭메뉴: (클래스) js__tab__menu /(탭콘텐츠전체감싼부모) data-tabArea /(탭콘텐츠) data-tabContent
     * 탭콘텐츠: id값으로 할당
     */
    const commonTabEvent = () => {
        $document.on("click", ".js__tab__menu", function () {
            const _tabContent = $(this).attr("data-tabContent");
            const $tabContent = $("#" + _tabContent);

            const _area = $(this).attr("data-tabArea");
            const $area = $("#" + _area);

            $area.children(".js__tab__content").removeClass("show");
            $tabContent.addClass("show");
        })
    }

    /**
     * 전체선택
     * js__check__wrapper - 전체 체크박스 감싼 영역
     * js__check__all     - 전체선택 체크박스 input
     * js__check__each    - 체크박스 각각
     * 
     * 회원가입 약관동의에서 케이스 추가(전체체크박스 안 또다른 전체체크 영역)
     * js__another__wrapper - 전체 체크박스 안 또다른 체크박스 영역 (마케팅 활용동의 - sms/이메일)
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

    /* 브라우저가 ie인지 체크 */
    const isIeBroswer = () => {
        const agent = navigator.userAgent.toLowerCase();
        const isIe = (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) && !(agent.indexOf("msie") != -1)
       
        return isIe;
    }

    /**
     *  details 태그 아코디언 케이스 추가
     *  모두 감싼 부모네 js__details__accordian 추가하면 됨.
     *  ie에서 동작안하는것 대비하여 직접 open attribute 컨트롤.
     */
    const detailsTagAction = () => {
        $document.on("click", "summary", function () {
            const $this = $(this);
            const $details = $this.closest("details");
            const $isAccordian = $this.closest(".js__details__accordian");

            if (!$details.attr("open")) {
                //아코디언
                if ($isAccordian.length) {
                    $isAccordian.find("details").removeAttr("open");
                }
                $details.attr("open", true);
            }
            else {
                $details.removeAttr("open");
            }

            return false;
        })
        
        //summary 안에 체크박스, 라디오 안먹는 경우가 있어서 추가
        .on("click", "summary .fb__checkbox", function (e) {
            e.stopPropagation();
        });
    }

    // custom select box
    const customSelect = () =>{
        let manager = {
            list: [],
            _createOption: function ($select, $option) {
                return $option.toArray().map(function (el) {
                    const $this = $(el);
                    let html = '';
                    html += `
                    <div class="custom-select__view__option">
                        <label tabindex="0">
                            <input type="radio" tabindex="-1" name="${$select.attr('class')}" value="${$this.val()}" ${$option.attr('checked') ? 'checked' : ''} ${$this.data('disabled') ? 'disabled' : ''}>
                            <span>${$this.text()}</span>
                    `;
                    /*if($this.data('disabled')) {
                        html += `
                            <button type="button" value="${$this.val()}">재입고알림</button>
                        `;
                    }*/
                    html += `
                        </label>
                    </div>
                    `;
                    return html;
                }).join('');
            },
            _createCustomSelect: function ($select, tempOption) {
                let label = null;
                //isMinicart인 경우 "선택" 기본 값 들어가도록 처리. (goodsView에서 사용)
                let isMinicart = $select.hasClass("devMinicartOptionsBox");

                if(isMinicart) label = $select.find('option').first().text();
                else label = $select.find('[selected]:not("[data-disabled=true]")').length > 0 ? $select.find('[selected]').text() : $select.find('option').first().text();
               
                return `
                     <div class="custom-select__view ${$select.attr('disabled') ? 'disabled' : ''}">
                        <div class="custom-select__view__title">
                            <div>
                                <span>${label}</span>
                            </div>
                        </div>
                        <div class="custom-select__view__layer">
                            <div class="scrollbar-inner">
                                <div>
                                ${tempOption}
                                </div>
                            </div>
                        </div>
                     </div>
                     `;
            },
            _isCreated: function (target) {
                if ($(target).parent().hasClass('custom-select__wrap') || $(target).hasClass('custom-select__wrap')) {
                    return true
                } else {
                    return false;
                }
            },
            _setReverse: function(target) {
                const $el = manager._getElement(target);
                const offsetBottom = $el.$wrap.offset().top + $el.$wrap.outerHeight() + $el.$layer.outerHeight();
                const pageBottom = $(window).scrollTop() + $(window).height();

                if(offsetBottom > pageBottom) {
                    $el.$wrap.addClass('reverse');
                }else {
                    $el.$wrap.removeClass('reverse');
                }

            },
            _getElement : function(target) {
                const $target = $(target);
                const $elementList = {
                    $wrap : $(),
                    $select : $(),
                    $option : $()
                }
                if(target) {
                    if($target.hasClass('custom-select__wrap')) {
                        $elementList.$wrap = $target;
                        $elementList.$select = $elementList.$wrap.find('select');

                    }else if($target[0].tagName == 'SELECT') {
                        $elementList.$select = $target;
                        $elementList.$wrap = $target.parent();
                    }

                    $elementList.$option = $elementList.$select.find('option');
                    $elementList.$layer = $elementList.$wrap.find('.custom-select__view__layer');

                }
                return $elementList;

            },
            _initEvent : function(target) {
                // custom select event
                const $el = manager._getElement(target);

                //sccrollbar init
                // const $scroll = $el.$wrap.find('.scrollbar-inner');
                // if($scroll.length > 0) {
                //     $scroll.scrollbar();
                // }


                //$(window).on('scroll.checkReverse')
                // console.log("el:", $el);
                // show list

                // custom selectbox 포커스 이벤트
                $el.$wrap.each(function (index, tag) {
                    tag.addEventListener('focusin', function(event) {
                        $(tag).addClass('active');
                    }, {capture: true});
                    tag.addEventListener('focusout', function(event) {
                        $(tag).removeClass('active');
                        $(tag).scrollTop(0);
                    }, {capture: true});
                });

                $el.$wrap.off('click.selectActive').on('click.selectActive', '.custom-select__view__title', function (e) {
                    console.log('title click');
                    e.stopPropagation();

                    //hl 커스텀 추가(상품상세 인포팝업 비노출처리)
                    if (window.location.pathname.indexOf("/shop/goodsView") != -1) {
                        $(".info__popup").removeClass("show");
                    }
                    
                    $('.custom-select__wrap').not($el.$wrap).removeClass('active');

                    if ($el.$wrap.find('.custom-select__view').hasClass('disabled')) {
                        $el.$wrap.removeClass('active');
                        $(window).off('scroll.checkReverse resize.checkReverse');
                    } else {
                        $el.$wrap.toggleClass('active');
                        // $(window).on('scroll.checkReverse resize.checkReverse', function() { manager._setReverse($el.$wrap); });
                    }
                });
                // custom selectbox 키보드 이벤트
                $el.$wrap.on('keydown.changeLable', function(event) {
                    const optionBox = $(event.target).closest('.custom-select__view__option');
                    if (![9, 13].includes(event.keyCode)) event.preventDefault();

                    if (event.keyCode === 13) {
                        $(event.target).trigger('click');

                        if ($(event.currentTarget).closest('.goods-option')) {
                            setTimeout(function() {
                                if ($(event.currentTarget).closest('.goods-option').find('input')) {
                                    $(event.currentTarget).closest('.goods-option').find('input').last().focus();
                                }
                            }, 0);

                        }
                    }

                    if ([39,40].includes(event.keyCode)) {
                        $(event.target).blur();

                        if (optionBox.index() == $el.$option.length - 1) {
                            optionBox.siblings().first().find('label').focus();
                        }
                        else {
                            optionBox.next().find('label').focus();
                        }
                    }
                    else if ([37,38].includes(event.keyCode)) {
                        $(event.target).blur();

                        if (optionBox.index() == 0) {
                            optionBox.siblings().last().find('label').focus();
                        }
                        else {
                            optionBox.prev().find('label').focus();
                        }
                    }
                });
                
                // list change
                $el.$wrap.off('change.selected').on('change.selected', 'input', function (e) {
                    e.stopPropagation();
                    const label = $(this).siblings('span').text();
                    const value = $(this).val();
                    $el.$wrap.find('.custom-select__view__title span').text(label);
                    $el.$wrap.removeClass('active');
                    $el.$wrap.scrollTop(0);
                    $(window).off('scroll.checkReverse resize.checkReverse');
                    
                    if (value) {
                        $el.$option.attr('selected', false).prop('selected', false)
                            .filter(`[value=${value}]`).attr('selected', true).prop('selected', true);
                    } else {
                        $el.$option.attr('selected', false).prop('selected', false)
                            .filter('[value=""]').attr('selected', true).prop('selected', true);
                    }
                    $el.$select.trigger('change');
                });

                //soldout event
                $el.$wrap.off('click.soldoutBtn').on('click.soldoutBtn', 'button', function() {
                    $el.$option.attr('selected', false).prop('selected', false)
                        .filter(`[value=${$(this).val()}]`).attr('selected', true).prop('selected', true);
                    $el.$select.trigger('change');
                });
                $el.$wrap.off('click.buttonPropagation').on('click.buttonPropagation', 'button', function(e) {
                    e.stopPropagation();
                });

                // hide list
                $('body').off('click.hideSelectLayer').on('click.hideSelectLayer', function (e) {
                    $('.custom-select__wrap').removeClass('active');
                    $('.custom-select__wrap').scrollTop(0);
                    // $(window).off('scroll.checkReverse');
                    // !$(e.target).hasClass('custom-select__view__title')
                    // if(!$(e.target).hasClass('custom-select__view__title')) {
                    //     $el.$wrap.removeClass('active');
                    // }
                });
            },

            // @FIXME: 버픽오류, 복수옵션인 경우 커스텀 셀렉트 초기화 되지 않음 (미니카트)
            minicartReset: function () {
                const $el = $('.custom-select.devMinicartOptionsBox');
                    $el.each(function () {
                        const $select = $(this);    // select 태그
                        if(manager._isCreated($select)) {
                            manager.update($select);
                            return true;
                        }
                        const $wrap = $('<div>').addClass('custom-select__wrap').insertAfter($select);    //select 부모박스 생성
                        const $option = $select.find('option');   // select 의 옵션태그

                        $wrap.append($select);   //select에 init 클래스 삭제

                        // option HTML template
                        const tempOption = manager._createOption($select, $option);

                        // select HTML template
                        const htmlTemplate = manager._createCustomSelect($select, tempOption);

                        //custom select appenqd
                        $select.after(htmlTemplate);
                        manager.list.push($wrap[0]);

                        manager._initEvent($wrap);
                    });
            },
            update: function (target) {
                const $target = $(target);
                if (target) {
                    $target.each(function() {
                        const $el = manager._getElement(this);

                        $el.$wrap.find('.custom-select__view').remove();

                        // option HTML template
                        const tempOption = manager._createOption($el.$select, $el.$option);
                        // select HTML template
                        const htmlTemplate = manager._createCustomSelect($el.$select, tempOption);
                        
                        $el.$wrap.append(htmlTemplate);

                        manager._initEvent($el.$wrap);
                    })


                }else {
                    manager.update($('.custom-select__wrap'));
                }
            },
            destroy : function(target) {
                const $target = $(target);
                if(target) {
                    $target.each(function() {
                        const $el = manager._getElement(this);
                        $el.$wrap.before($el.$select);
                        manager.list.splice(manager.list.indexOf($el.$select[0]), 1);
                        $el.$wrap.remove();
                    });
                }else {
                    manager.destroy($('.custom-select__wrap'));
                }
            },

            init : function() {
                const $el = $('.custom-select');
                $el.each(function () {
                    const $select = $(this);    // select 태그
                    if(manager._isCreated($select)) {
                        manager.update($select);
                        return true;
                    }
                    const $wrap = $('<div>').addClass('custom-select__wrap').insertAfter($select);    //select 부모박스 생성
                    const $option = $select.find('option');   // select 의 옵션태그

                    $wrap.append($select);   //select에 init 클래스 삭제

                    // option HTML template
                    const tempOption = manager._createOption($select, $option);

                    // select HTML template
                    const htmlTemplate = manager._createCustomSelect($select, tempOption);

                    //custom select appenqd
                    $select.after(htmlTemplate);
                    manager.list.push($wrap[0]);

                    manager._initEvent($wrap);
                });
            }
        };

        if(window.customSelect) {
            manager = window.customSelect;
        }
        manager.init();
        return manager;
    }

    // 기존함수
    const list_h = () => {
        !(function(){if(!Handlebars.original_compile) Handlebars.original_compile = Handlebars.compile;Handlebars.compile = function(source){var s = "\\{\\[",e = "\\]\\}",RE = new RegExp('('+s+')(.*?)('+e+')','ig');var replacedSource = source.replace(RE,function(match, startTags, text, endTags, offset, string){var startRE = new RegExp(s,'ig'), endRE = new RegExp(e,'ig');startTags = startTags.replace(startRE,'\{\{');endTags = endTags.replace(endRE,'\}\}');return startTags+text+endTags;});return Handlebars.original_compile(replacedSource);};})();
    };

    /* 상품 위시리스트 이벤트 */
    const fbWish = () => {
        $document.on("click", "[data-devwishbtn]", function() {
            const $this = $(this);
            const _pid = $this.attr('data-devwishbtn');
            if (forbizCsrf.isLogin) {
                wish.setTarget($(this)).run(_pid);
                // if ( $this.hasClass("product-box__heart") ) {
                //     $this.toggleClass("product-box__heart--active");
                // } else {
                $this.toggleClass("on");
                // }
            } else {
                common.noti.confirm(common.lang.get('product.wish.noMember.confirm'), function () {
                    document.location.href = '/member/login?url=' + encodeURI('/shop/goodsView/' + _pid);
                });
            }
            return false;
        });
    };

    /*
        * js__textcount__area        textarea 를 감싼 부모
        * js__textCount__textarea    textarea 엘리먼트 (textarea에 maxlength 속성 주기)
        * js__textCount__current     현재 글자수 엘리먼트
        * js__textCount__maxLength   글자수 최댓값 엘리먼트
        * 
        * 함수 실행할 때 예시
        $(document).on("focus", ".js__textCount__textarea", function () {
            const $this  = $(this);
            countTextLength($this);
        });  
    */
    const countTextLength = ($this) => {
        const $parents = $this.closest(".js__textcount__area");
        const $textarea = $parents.find(".js__textCount__textarea");
        const $currentCount = $parents.find(".js__textCount__current")
        const $maxLength = $parents.find(".js__textCount__maxLength");
        
        if (!$textarea.length || !$currentCount.length) return ;
        
        const _maxLength = $textarea.attr("maxlength");
        const _defaultLength = $textarea.val().length; 

        // 최댓값 체크
        $maxLength.text(_maxLength);

        //수정인 경우 기존 값 체크
        $currentCount.text(_defaultLength);

        //새로 쓸 때마다 체크
        $textarea.on("keyup", function(e) {
            if (Number(_maxLength) < $textarea.val().length) {
                return;
            }

            $currentCount.text($textarea.val().length);
        });
    };
    
    const snsPopup = () => {
        const snsOpen = () => {
            $document.on("click", ".js__sns__btn--open", function(e) {
                const $this = $(this);

                $this.parent().find(".fb__sns__wrapper").addClass("show");
                
                e.preventDefault();
            });
        };

        const snsClose = () => {
            $document.on("click", ".js__sns__btn--close", function(e) {
                const $this = $(this);

                $this.closest(".fb__sns__wrapper").removeClass("show");

                e.preventDefault();
            });
        };

        const snsFn = () => {
            snsOpen();
            snsClose();
        };

        snsFn();
    };
    
    const common_init = () => {
        window.localCookie = localCookie;
        window.layer_show = layer_show;
        window.canMakeSlider = canMakeSlider;
        window.sideScrollFix = sideScrollFix;
        window.customSelect = customSelect();
        window.isIeBroswer = isIeBroswer();
        window.countTextLength = countTextLength;

        list_h();
        fn_layer();
        fbWish();
        detailsTagAction();
        commonTabEvent();
        allSelectCheckbox();
        snsPopup();
    };

    common_init();
}

export default front_common;