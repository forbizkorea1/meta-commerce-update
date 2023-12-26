/**
 * Created by forbiz on 2019-02-11.
 */
 
const front_common = () => {
    const $document = $(document);
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
      * 레이어 js__layer 
      * 닫기버튼 js__layer__close
      * 열기버튼 js__layer__open
      */
    const fn_layer = () => {
        /**
         * 레이어 열기
         *   1. 동작이 일어나는 버튼에 js__layer__open 클래스 추가
         *   2. 동작이 일어나는 버튼에 data-layer="레이어 아이디값" 속성 추가
         */
        $document.on("click", ".js__layer__open", function () {
            const _layer = $(this).data("layer");
            const $layer = $("#" + _layer);

            $(".fb__infolayer.js__layer").removeClass("show");
            layer_show($layer, true);
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
    function layer_show($layer, Boolean, callback) {
        if (!$layer) return ;

        if (Boolean) {
            $layer.addClass("show"); 
            $body.addClass("scroll--lock");
        }
        else{
            $layer.removeClass("show");
            $body.removeClass("scroll--lock");
        }

        if (callback) callback();
    }

    /*레이어 팝업에 붙였던 클래스 모두 삭제*/
    const removePopupClassAll = () => {
        $document.on("click", ".fb__popup-layout .close, .popup-mask", function () {
            $(".fb__popup-layout").removeClass().addClass("fb__popup-layout");

            $body.css({
                "position": "",
                "marginTop": "",
            });

            $(".fb__popup-layout, .js__modal__mask").hide();
            $(window).scrollTop(window.oriScroll);
        })
    }
     
    /**
     * 띠배너 영역 + 로고 영역 포함한 height 구하기 (마이너스값 뱉어냄)
     */
    const getHeaderHideHeight = () => {
        const $hideTarget = $(".fb__header__top");
        if (!$hideTarget.length) return ;

        return $hideTarget.outerHeight() * (-1) / 7.5 + "vw";
    }

    /**
     * scroll down
     * => 헤더, 독바 hide
     * 
     * scroll up
     * => 헤더, 독바 show
     * 
     * @param {string} isDown - "down" / "up" 
     */
    const isScrollDown = (isDown) => {
        const $header = $(".fb__header__inner");
        const $footer = $("#dockbar");

        if (!$header || !$footer) return ;

        if (isDown == "down") {
            $header.css({"top": getHeaderHideHeight()});
            $footer.addClass("dockbar--hide");
        } 
        else {
            $header.css({"top": 0});
            $footer.removeClass("dockbar--hide");
        }
    }
 
    /**
      * 카드번호 유효성 검사
      * 카드번호는 꼭 String으로 넘어와야합니다.
      * @param {String} cardNum
      */
    const isPassSimpleCard = (cardNum) => {
         const cardNumber = cardNum.replace(/-/gi, "");
         const numArray = cardNumber.split("").reverse();
         let total = 0;
 
         // 마지막 숫자를 제외하고 거꾸로 2 1 순서로 곱하기
         numArray.forEach((n, idx) => {
             if (idx != 0) {
 
                 if ( idx % 2 == 1) {
                     let doubleNumber = n * 2;
                     total += isCheckBigger(doubleNumber);
                 } 
                 else {
                     total += isCheckBigger(n);
                 }
             }
         });
 
         //마지막 숫자
         const lastNum = String(total).split("")[String(total).length - 1];
 
         //검증코드
         let code = lastNum == 0 ? 0 : code = 10 - lastNum;
 
         //검증결과 반환
         if (code == numArray[0]) return true;
         else return false;
    }
 
    const isCheckBigger = (num) => {
        let count = 0;

        if (num < 10) {
            count += Number(num);
        } 
        else {
            const eachNum = String(num).split("");
            count += Number(eachNum[0]) + Number(eachNum[1]);
        }

        return count;
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

                    console.log("js__another__all")
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

    const list_h = () => {
        !(function(){if(!Handlebars.original_compile) Handlebars.original_compile = Handlebars.compile;Handlebars.compile = function(source){var s = "\\{\\[",e = "\\]\\}",RE = new RegExp('('+s+')(.*?)('+e+')','ig');var replacedSource = source.replace(RE,function(match, startTags, text, endTags, offset, string){var startRE = new RegExp(s,'ig'), endRE = new RegExp(e,'ig');startTags = startTags.replace(startRE,'\{\{');endTags = endTags.replace(endRE,'\}\}');return startTags+text+endTags;});return Handlebars.original_compile(replacedSource);};})();
    };
 
    const initDockbar = () => {
         const dockbarEl = document.getElementById("dockbar");
         let oldScrollY = window.scrollY;
         let oldDirection = "up";
 
         window.addEventListener("scroll", function(e) {
             if(!$('body').hasClass('layout-pop')){
                 // up
                 if("down" === oldDirection && oldScrollY > window.scrollY) {
                     oldDirection = "up";
                     dockbarEl.classList.add("dockbar--active");
                 }
                 // down
                 else if("up" === oldDirection && oldScrollY < window.scrollY) {
                     oldDirection = "down";
                     dockbarEl.classList.remove("dockbar--active");
                 }
             }
             
             oldScrollY = window.scrollY;
         });
    }

    /* 앱관련 함수 */
    const isApp = () => {
        console.log(navigator.userAgent)
        if (navigator.userAgent.match(/HLeshopAOSApp/i) || navigator.userAgent.match(/HLeshopIOSApp/i)) return true;
        else return false;
    }

    const getAppType = () => {
       if (navigator.userAgent.match(/HLeshopAOSApp/i)) {
           return "aos";
       }
       else if (navigator.userAgent.match(/HLeshopIOSApp/i)) {
           return "ios";   
       }
       else {
           return false;
       }
    }

    const callAppInterface = (method) => {
        var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
        var webInterface = arguments[2];

        if (navigator.userAgent.match(/HLeshopAOSApp/i)) {
            if (window.JavascriptInterface[method]) {
                if (values != "") {
                    window.JavascriptInterface[method](values);
                } else {
                    window.JavascriptInterface[method]();
                }
            }
        } else if (navigator.userAgent.match(/HLeshopIOSApp/i)) {
            if (window.webkit.messageHandlers[method]) {
                window.webkit.messageHandlers[method].postMessage(values);
            }
        } else {
            if (typeof webInterface == 'function') {
                webInterface();
            } else {
                console.log('앱기능입니다.');
            }
        }
    };
 
    // slideToggle Evennt (약관 내용 보기)
    const agree_accord = () => {
        $document.on('click', '.accord-btn', function() {
            $(this).toggleClass("on");
            $(this).parents().next('.terms-content').slideToggle(200);
        })
    }

    /*
        * js__textcount__area        textarea 를 감싼 부모
        * js__textCount__textarea    textarea 엘리먼트 (textarea에 maxlength 속성 주기)
        * js__textCount__current     현재 글자수 엘리먼트
        * js__textCount__maxLength   글자수 최댓값 엘리먼트
    */
    const countTextLength = () => {
        const $parents = $(".js__textcount__area");
        const $textarea = $parents.find(".js__textCount__textarea");
        const $currentCount = $parents.find(".js__textCount__current")
        const $maxLength = $parents.find(".js__textCount__maxLength");
        
        if (!$textarea.length || !$currentCount.length) return;
        
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

    const inputValidation = () => {
        const onlyNumber = () => {
            $document
                .on("input", ".js__input--onlyNumber", function() {
                    const $this = $(this);

                    $this.val($this.val().replace(/[^0-9]/gi, ""));
                });
        };

        const inputValidationInit = () => {
            onlyNumber();
        };
        
        inputValidationInit();
    };

    const snsPopup = () => {
        const snsOpen = () => {
            $document.on("click", ".js__sns__btn--open", function(e) {

                $(".fb__sns__wrapper").addClass("show");
                
                e.preventDefault();
            });
        };

        const snsClose = () => {
            $document.on("click", ".js__sns__btn--close", function(e) {

                $(".fb__sns__wrapper").removeClass("show");

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
        //기존
        list_h();
        agree_accord();
        initDockbar();

        inputValidation();

        //프론트 공통함수 추가 (20.12.10)
        removePopupClassAll();
        fn_layer();
        allSelectCheckbox();
        detailsTagAction();
        snsPopup();
        
        //전역
        window.localCookie = localCookie;
        window.canMakeSlider = canMakeSlider;
        window.layer_show = layer_show;
        window.isPassSimpleCard = isPassSimpleCard;
        window.isApp = isApp;
        window.getAppType = getAppType;
        window.callAppInterface = callAppInterface;
        window.countTextLength = countTextLength;
    };
 
    common_init();
}
 
export default front_common;