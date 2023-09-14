"use strict";
var _LANGUAGE = {};

/**
 * @class
 * @classdesc 개발 공통
 * @type {{environment: string, regExp, util, noti, form, validation, crypto, ajax: common.ajax, lang}}
 */

var common = {
    /**
     * 개발 환경 정보 (return -> development, testing, production)
     * 사용하는 layout.htm 에 common.environment = "{c.ENVIRONMENT}"; set을함
     */
    environment: "",

    langType: "korean",

    bcscale: 0,
    /**
     * @constructor
     * @desc 정규식
     */
    regExp: {
        number: /[0-9]/g,
        exceptNumber: /[^0-9]/g,
        english: /[a-z]/ig,
        specialCharacters: /[!@#$%^&*\(\)_+~]/gi,
        space: /\s/,
        allowPw: /^[0-9a-zA-Z!@#$%^&*\(\)_+~\sㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        hangul: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,
        mobile: /^\d{3}-\d{3,4}-\d{4}$/
    },
    /**
     * @constructor
     */
    math: {
        /**
         * @desc a와 b를 더한다
         * @param {number}a
         * @param {number}b
         * @returns {*}
         */
        add: function (a, b) {
            return Decimal.add(a, b).toNumber();
        },
        /**
         * @desc a와 b를 뺀다
         * @param {number}a
         * @param {number}b
         * @returns {*}
         */
        sub: function (a, b) {
            return Decimal.sub(a, b).toNumber();
        },
        /**
         * @desc a와 b를 곱한다
         * @param {number}a
         * @param {number}b
         * @returns {*}
         */
        mul: function (a, b) {
            return Decimal.mul(a, b).toNumber();
        },
        /**
         * @desc a와 b를 나눈다
         * @param {number}a
         * @param {number}b
         * @returns {*}
         */
        div: function (a, b) {
            return Decimal.div(a, b).toNumber();
        }
    },

    /**
     * @constructor
     */
    util: {
        tplStore: {},
        /**
         * @param {String}text
         * @param $target
         */
        copyText: function (text, $target) {
            var $tempInput = $("<textarea>");
            //익스에서 스크롤이 아래로 내려가서.. 클릭하는 대상을 넘겨 옆에다가 처리
            $target.after($tempInput);
            $tempInput.val(text).select();
            document.execCommand("copy");
            $tempInput.remove();
        },
        dates: {
            /**
             * @param d
             * @returns {Date}
             */
            convert: function (d) {
                // Converts the date in d to a date-object. The input can be:
                //   a date object: returned without modification
                //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
                //   a number     : Interpreted as number of milliseconds
                //                  since 1 Jan 1970 (a timestamp)
                //   a string     : Any format supported by the javascript engine, like
                //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
                //  an object     : Interpreted as an object with year, month and date
                //                  attributes.  **NOTE** month is 0-11.
                return (
                    d.constructor === Date ? d :
                        d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                            d.constructor === Number ? new Date(d) :
                                d.constructor === String ? new Date(d) :
                                    typeof d === "object" ? new Date(d.year, d.month, d.date) :
                                        NaN
                );
            },
            /**
             * @param a
             * @param b
             * @returns {number}
             */
            compare: function (a, b) {
                // Compare two dates (could be of any type supported by the convert
                // function above) and returns:
                //  -1 : if a < b
                //   0 : if a = b
                //   1 : if a > b
                // NaN : if a or b is an illegal date
                // NOTE: The code inside isFinite does an assignment (=).
                return (
                    isFinite(a = this.convert(a).valueOf()) &&
                    isFinite(b = this.convert(b).valueOf()) ?
                        (a > b) - (a < b) :
                        NaN
                );
            },
            /**
             * @param d
             * @param start
             * @param end
             * @returns {*}
             */
            inRange: function (d, start, end) {
                // Checks if date in d is between dates in start and end.
                // Returns a boolean or NaN:
                //    true  : if d is between start and end (inclusive)
                //    false : if d is before start or after end
                //    NaN   : if one or more of the dates is illegal.
                // NOTE: The code inside isFinite does an assignment (=).
                return (
                    isFinite(d = this.convert(d).valueOf()) &&
                    isFinite(start = this.convert(start).valueOf()) &&
                    isFinite(end = this.convert(end).valueOf()) ?
                        start <= d && d <= end :
                        NaN
                );
            }
        },
        /**
         * @param {string} cname
         * @returns {string}
         */
        getCookie: function (cname) {
            var name = cname + "=";
            var decodedCookie = document.cookie;
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        /**
         * @param {string}cName
         * @param {string}cValue
         * @param cDay
         */
        setCookie: function (cName, cValue, cDay) {
            var expire = new Date();
            expire.setDate(expire.getDate() + cDay);
            var cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
            if (typeof cDay != 'undefined')
                cookies += ';expires=' + expire.toGMTString() + ';';
            document.cookie = cookies;
        },
        /**
         * @desc php 컨트롤 url 정보 가지고 오기
         * @param {string}methodName
         * @param {string}className
         * @returns {string}
         */
        getControllerUrl: function (methodName, className) {
            return "/controller/" + className + "/" + methodName;
        },
        /**
         * @desc javascript null 체크
         * @param value
         * @returns {boolean}
         */
        isNull: function (value) {
            return ((typeof value != "boolean" && value == "") || value == null || typeof value == 'undefined' || (value != null && typeof value == "object" && !Object.keys(value).length) ? true : false);
        },
        /**
         * @desc 팝업
         * @param {string}path
         * @param {number}width
         * @param {number}height
         * @param {string}name
         * @param {boolean}scroll
         * @returns {Window}
         */
        popup: function (path, width, height, name, scroll) {
            scroll = this.isNull(scroll) ? false : scroll;
            var winl = (screen.width - width) / 2;
            var wint = (screen.height - height) / 2;
            var winprops = 'height=' + height + ',width=' + width + ',top=' + wint + ',left=' + winl + ',scrollbars=' + (scroll ? 'yes' : 'no') + ',menubar=no,status=no,toolbar=no,resizable=no';

            return window.open(path, name, winprops);
        },
        /**
         * @desc 모달
         */
        modal: {
            // 진행중 상태 bool
            _ingBool: false,
            /**
             * 모달 보여주기
             */
            _show: function () {
                common.util.modal._ingBool = false;
                //프론트에서 만든 모달함수
                fbModal.modalShow();
            },
            /**
             * 모달 닫기
             */
            close: function () {
                $('.js__modal__layer .close, .js__modal__close').trigger('click');
            },
            /**
             * @desc 모달 열기
             * @param {string}type
             * @param {string}title
             * @param {string}parameter1
             * @param {string}parameter2
             * @param {function}completeFunction
             * @param _target
             */
            open: function (type, title, parameter1, parameter2, completeFunction, _target) {
                var target = _target ? _target : "";
                if (!common.util.modal._ingBool) {
                    common.util.modal._ingBool = true;
                    parameter2 = common.util.isNull(parameter2) ? '' : parameter2;

                    //패딩값 없어야해서 퍼블에서 추가
                    if (title == "Best Pick 보기" || title == "포토/동영상" || title == "쿠폰 다운로드" || title == "1:1 문의 내역" || title == "상품 문의 내역") {
                        $("#devModalContent").addClass("fb__modal__content--nopadding");
                    }

                    $('#devModalTitle').text(title);
                    
                    var $modalContent = $('#devModalContent');
                    
                    $modalContent.empty();

                    if (type == 'html') {
                        $modalContent.append(parameter1.clone(true));
                        common.util.modal._show();

                        if (typeof completeFunction === "function") {
                            completeFunction();
                        }
                    } 
                    else {
                        common.ajax(parameter1, parameter2, '', (function (response) {
                            $modalContent.attr("data-visible", !!target)

                            if (!!target) {
                                $modalContent.attr("data-target", target)
                            }

                            $modalContent.append(response);
                            common.util.modal._show();
                            
                            if (typeof completeFunction === "function") {
                                completeFunction();
                            }

                            $('.js__modal__content img[data-src]').lazy({
                                appendScroll: $('.js__modal__content')
                            });

                        }), 'html');
                    }
                }
            }
        },
        /**
         * @desc 주소찾기
         */
        zipcode: {
            callback: false,
            /**
             * @desc 팝업 열기
             * response = {zipcode: "000000", address1: "주소"}
             * @param {function}callback
             */
            popup: function (callback) {
                this.callback = callback;
                common.util.popup('/popup/zipcode', 422, 607, 'zipcode', false);
            }
        },
        /**
         * @desc 요소의 성격에 따라 포커스 이동
         * @param element
         */
        focus: function (element) {
            if (common.util.getElementInputType(element) == 'select') {
                var offset = $(element).offset();
                $('html, body').animate({scrollTop: offset.top - 200}, 0);
            } else {
                $(element).focus();
            }
        },
        /**
         * @desc element 의 태그명과 타입에 따라서 결과 리턴
         * @param element
         * @returns {string}
         */
        getElementInputType: function (element) {
            if (element.tagName.toLowerCase() == "select") {
                return "select";
            } else if (element.tagName.toLowerCase() == "input" && element.type == "checkbox") {
                return "checkbox";
            } else if (element.tagName.toLowerCase() == "input" && element.type == "radio") {
                return "radio";
            } else if (element.tagName.toLowerCase() == "input" && (element.type == "text" || element.type == "number" || element.type == "password" || element.type == "hidden")) {
                return "text";
            } else if (element.tagName.toLowerCase() == "input" && element.type == "file") {
                return "file";
            } else if (element.tagName.toLowerCase() == "textarea") {
                return "textarea";
            }
        },
        /**
         * @desc 이미지 미리보기
         * @param $file
         * @param $image
         */
        previewFile: function ($file, $image) {
            var file = $file.get(0).files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                $image.attr('src', e.target.result);
            }

            if (file) {
                reader.readAsDataURL(file);
            }
        },
        /**
         * @desc Get template
         * @param $selector
         * @returns {string} - {jQuery} 각각의 '{['']}' 문자열을 '{{''}}'으로 변경
         */
        getTpl: function ($selector) {
            var html = '';

            if ($($selector).is('script')) {
                html = $($selector).html();
            } else {
                html = $($selector).clone().removeAttr('id').removeClass('devForbizTpl').wrapAll("<div/>").parent().html();
            }

            return html.replace(/\{\[/g, '{{').replace(/\]\}/g, '}}');
        },
        compileTpl: function (selector) {
            var self = common.util;
            var key = 'Tpl' + common.crypto.md5(selector);

            if (typeof self.tplStore[key] === 'undefined') {
                self.tplStore[key] = Handlebars.compile(self.getTpl(selector));
            }

            return self.tplStore[key];
        },
        /**
         * @desc number format
         * @param {number}number
         * @param {number}decimals
         * @param decPoint
         * @param thousandsSep
         * @returns {string}
         */
        numberFormat: function (number, decimals, decPoint, thousandsSep) {
            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? common.bcscale : Math.abs(decimals),
                sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
                dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + (Math.round(n * k) / k)
                            .toFixed(prec);
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
                .split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '')
                    .length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1)
                    .join('0');
            }
            return s.join(dec);
        },
        /**
         * @desc 파라미터 가지고 오는 함수
         * @param {string}name
         * @param {string}url
         * @returns {string} - 모든 문자를 디코딩
         */
        getParameterByName: function (name, url) {
            if (!url)
                url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },
        /**
         * @desc 우측문자열채우기
         * @param {string}str    - 원 문자열
         * @param {number}padLen - 최대 채우고자 하는 길이
         * @param {string}padStr - 채우고자하는 문자(char)
         */
        rpad: function (str, padLen, padStr) {
            if (padStr.length > padLen) {
                return str + "";
            }
            str += ""; // 문자로
            padStr += ""; // 문자로
            while (str.length < padLen)
                str += padStr;
            str = str.length >= padLen ? str.substring(0, padLen) : str;
            return str;
        },
        /**
         * @desc 좌측문자열채우기
         * @param {string}str    - 원 문자열
         * @param {number}padLen - 최대 채우고자 하는 길이
         * @param {string}padStr - 채우고자하는 문자(char)
         */
        lpad: function (str, padLen, padStr) {
            if (padStr.length > padLen) {
                return str;
            }
            str += ""; // 문자로
            padStr += ""; // 문자로
            while (str.length < padLen)
                str = padStr + str;
            str = str.length >= padLen ? str.substring(0, padLen) : str;
            return str;
        }
    },
    /**
     * @constructor
     * @desc 알림
     */
    noti: {
        /**
         * @param {string}txt
         * @param {function}callback
         */
        alert: function (txt, callback) {
            alert(txt);
            if (typeof callback === "function") {
                callback();
            }
        },
        /**
         * @param {string}message
         * @param {function}okCallback
         * @param {function}cancelCallback
         * @return {boolean}
         */
        confirm: function (message, okCallback, cancelCallback) {
            if (confirm(message)) {
                if (typeof okCallback === "function") {
                    okCallback();
                }

                return true;
            } else {
                if (typeof cancelCallback === "function") {
                    cancelCallback();
                }

                return false;
            }
        },
        /**
         * 인풋 박스 아래 text 노출
         * devTailMsg="element.id" 에 해당하는 영역에 message 노출
         * @param {number}attributeTailMsgVal
         * @param {string}message
         * @param {string}type - basic|error|success
         */
        tailMsg: function (attributeTailMsgVal, message, type) {
            message = common.util.isNull(message) ? '' : message;
            type = common.util.isNull(type) ? 'error' : type;
            var cssClass = '';
            if (type == 'basic')
                cssClass = 'txt-guide';
            else if (type == 'success')
                cssClass = 'txt-success';
            else
                cssClass = 'txt-error';

            $('[devTailMsg~=' + attributeTailMsgVal + ']').attr('class', cssClass).html(message).css({"display": "block"});
            if (message == "") {
                $('[devTailMsg~=' + attributeTailMsgVal + ']').hide();
            }
        },
        /**
         * @desc common.environment 가 development 일떄만 로그 보임
         * @param {string}message
         * @param {string}type - log|warn|error
         */
        log: function (message) {
            if (common.environment == 'development') {
                if (!window.console) {
                    window.console = {log : function(){}} ;
                }
                console.log(message);
            }
        },
        popup: {
            layerPopupTpl: false,
            compileLayerPopup: function () {
                if (common.noti.popup.layerPopupTpl === false) {
                    var selector = '#devNotiPopupTpl';
                    common.noti.popup.layerPopupTpl = Handlebars.compile(common.util.getTpl(selector));
                    $(selector).remove();
                }
            },
            /**
             * @param data
             */
            showLayerPopupData: function (data) {
                $(common.noti.popup.layerPopupTpl(data)).appendTo('body').css({
                    left: data.popup_left + "px",
                    top: data.popup_top + "px"
                });
            },
            /**
             * @param popupIx
             * @returns {string}
             */
            getCookieKey: function (popupIx) {
                return 'notiPopup' + popupIx;
            },
            /**
             * @param datas
             */
            load: function (datas) {
                $.each(datas, function (i, data) {
                    //쿠키 관련 체크 처리
                    if (common.util.getCookie(common.noti.popup.getCookieKey(data.popup_ix)) != '1') {
                        var url = '/popup/noti/' + data.popup_ix;
                        if (data.popup_type == 'L') { //레이어 POPUP
                            common.noti.popup.compileLayerPopup();
                            common.ajax(url, {}, '', (function (response) {
                                data['popup_text'] = response;
                                common.noti.popup.showLayerPopupData(data);

                                //공지팝업 (/divide/layout.js 참고)
                                if (i == (datas.length - 1)) {
                                    setTimeout(function () {
                                        isShowNoticePopup(true);
                                    }, 100)
                                }
                            }), 'html');
                        } else {
                            common.util.popup(url, data.popup_width, data.popup_height, common.noti.popup.getCookieKey(data.popup_ix), false);
                        }
                    }
                })
            },
            /**
             * @param popupType
             * @param popupIx
             */
            close: function (popupType, popupIx) {
                //쿠키 관련 set 처리
                if ($('.devPopupToday[devPopupIx=' + popupIx + ']:checked').length > 0) {
                    common.util.setCookie(common.noti.popup.getCookieKey(popupIx), '1', 1);
                }
                if (popupType == 'L') { //레이어 POPUP
                    $('.devNotiPopup[devPopupIx=' + popupIx + ']').remove();
                } else {
                    window.close();
                }
            }
        }
    },
    ajaxManager: {
        activeStatus: true,
        deActive: function(){
            var self = common.ajaxManager;
            self.activeStatus = false;
            return common;
        },
        active: function(){
            var self = common.ajaxManager;
            self.activeStatus = true;
            return common;
        },
        eventCalback: {
            allFinish: false
        },
        reqCnt: 0,
        on: function (eventType, func) {
            var self = common.ajaxManager;

            if ($.isFunction(func)) {
                self.eventCalback[eventType] = func;
            }

            return self;
        },
        inc: function () {
            var self = common.ajaxManager;

            if (self.activeStatus === true && self.reqCnt == 0 && $.isFunction(self.eventCalback.allFinish) === false && typeof window.dev_fat !== 'undefined') {
                self.on('allFinish', window.dev_fat.initStat);
            }

            self.reqCnt++;

            return self;
        },
        dec: function () {
            var self = common.ajaxManager;
            self.reqCnt--;

            if (self.reqCnt == 0 && $.isFunction(self.eventCalback.allFinish)) {
                self.eventCalback.allFinish();
                self.eventCalback.allFinish = false;
                self.activeStatus = true;
            }

            return self;
        }
    },
    /**
     * @constructor
     * @desc 데이터 입력 포멧 제어
     */
    inputFormat: {
        /**
         * format set
         * @param $element
         * @param {Object}setData
         * number = true
         * maxLength = 20
         * fileFormat = image
         * devFileSize = 30 (메가바이트)
         */
        set: function ($element, setData) {
            setData = common.util.isNull(setData) ? {} : setData;
            if (setData['number'] == true) {
                $element.attr('devNumber', true);
            }
            if (typeof setData['maxLength'] != 'undefined' && setData['maxLength'] != '') {
                $element.attr('devMaxLength', setData['maxLength']);
            }
            if (typeof setData['fileFormat'] != 'undefined' && setData['fileFormat'] != '') {
                $element.attr('devFileFormat', setData['fileFormat']);
            }
            if (typeof setData['fileSize'] != 'undefined' && setData['fileSize'] != '') {
                $element.attr('devFileSize', setData['fileSize']);
            }
        },
        /**
         * @desc event bind
         */
        eventBind: function () {
            //number
            $(document).on({
                'input': function (e) {
                    this.value = this.value.replace(common.regExp.exceptNumber, '');
                }
            }, 'input[devNumber]');
            //maxLength
            $(document).on({
                'input': function (e) {
                    var maxLength = $(this).attr('devMaxLength');
                    if (maxLength && this.value.length > maxLength) {
                        this.value = this.value.slice(0, maxLength);
                    }
                }
            }, 'input[devMaxLength]');
            //fileFormat
            $(document).on({
                'change': function (e) {
                    if (this.files.length > 0) {
                        var file = this.files[0];
                        if (file.type.search('image') < 0) {
                            this.value = null;
                            $(this).trigger('change');
                            common.noti.alert(common.lang.get('common.inputFormat.fileFormat.fail'));
                        }
                    }
                }
            }, 'input[devFileFormat=image]');
            //fileSize
            $(document).on({
                'change': function (e) {
                    if (this.files.length > 0) {
                        var file = this.files[0];
                        var fileSize = $(this).attr('devFileSize');
                        //file.size (바이트), fileSize (메가바이트)
                        if (file.size > fileSize * 1048576) {
                            this.value = null;
                            $(this).trigger('change');
                            common.noti.alert(common.lang.get('common.inputFormat.fileSize.fail', {'size': fileSize}));
                        }
                    }
                }
            }, 'input[devFileSize]');
        }
    },
    /**
     * @constructor
     * @desc form
     */
    form: {
        /**
         * @desc form 에 ajaxForm 스크립트 set
         * @param {Object}$form
         * @param {string}url
         * @param {function}beforeCallback
         * @param {function}successCallback
         */
        init: function ($form, url, beforeCallback, successCallback) {
            (function () {
                // submit 진행 여부 (중복 액션 막기 위한 플레그)
                var _ingSubmit = false;

                $form.attr('action', url);
                // CSRF 로직 추가
                $('<input>').attr({
                    type: 'hidden',
                    name: forbizCsrf.name,
                    class: 'clsForbizCsrfId'
                }).appendTo($form);

                $form.ajaxForm({
                    method: 'post',
                    beforeSerialize: function ($form, options) {
                        $('.clsForbizCsrfId').val(common.util.getCookie('ForbizCsrfCookieName'));
                    },
                    beforeSubmit: function (formDataList) {
                        common.ajaxManager.inc();

                        if (_ingSubmit) {
                            // common.noti.alert('ajaxForm 처리중입니다.');
                            console.log('ajaxForm 처리중입니다.');
                            return false;
                        }
                        _ingSubmit = true;
                        if (typeof beforeCallback === "function") {
                            if (beforeCallback($form, formDataList)) {
                                return true;
                            } else {
                                _ingSubmit = false;
                                return false;
                            }
                        } else {
                            return true;
                        }
                    },
                    success: function (response, status) {
                        //성공후 서버에서 받은 데이터 처리
                        if (typeof successCallback === "function") {
                            successCallback(response);
                            lazyload(); //프론트엔드에서 추가
                        }
                        _ingSubmit = false;
                    },
                    error: function (xhr) {
                        _ingSubmit = false;
                        if (xhr.status == 403) {
                            $form.submit();
                        }
                    },
                    complete: function () {
                        forbizCsrf.hash = common.util.getCookie('ForbizCsrfCookieName');
                        common.ajaxManager.dec();
                    }
                });
            }());
        },
        /**
         * form에 속한 input 필드 데이터를 채운다.
         *
         * @param {jQueryObject} $form  - jQuery Form 객체, ex) $('#formID')
         * @param {Object} data    -폼데이터 키/값 쌍, ex) {name:"이름",id:"user"}
         */
        dataBind: function ($form, data) {
            if ($.isPlainObject(data)) {
                $.each(data, function (key, value) {
                    var $targetObj = $form.find('[name="' + key + '"]');
                    if ($targetObj.length > 0) {
                        switch (common.util.getElementInputType($targetObj.get(0))) {
                            case 'select':
                            case 'text':
                                $targetObj.val(value);
                                break;
                            case 'textarea':
                                $targetObj.text(value);
                                break;
                            case 'radio':
                                $targetObj.filter('[value="' + value + '"]').prop('checked', true);
                                break;
                            case 'checkbox':
                                $targetObj.prop('checked', false);
                                if ($.isArray(value)) {
                                    $.each(value, function (index, val) {
                                        $targetObj.filter('[value="' + val + '"]').prop('checked', true);
                                    })
                                } else {
                                    $targetObj.filter('[value="' + value + '"]').prop('checked', true);
                                }
                                break;
                        }
                    }
                });
            }
        }
    },
    /**
     * @constructor
     * @desc 유효성
     * 'required': true (필수)
     * 'requiredMessageTag' : common.lang.get("joinAgreement.required.message") (노출 언어 지정)
     * 'dataFormat' : 'userPassword' (회원 비밀번호), 'userId' (회원 아이디), 'companyNumber'(사업자 번호), 'email' (이메일)
     * 'compare': '#devUserPassword' (값 동일 체크 대상 jQuery 선택자 입력)
     * 'getValueFunction' : function (input 값을 조합해서 체크해야할때 사용)
     */
    validation: {

        //유효성 체크 하기 위한 attribute명
        _validationAttributeName: 'devValidation',

        //element 의 이름을 가지고 오기위한 attribute명
        _titleAttributeName: 'title',
        /**
         * @desc element에 유효성 체크 규칙 적용
         * @param $element
         * @param setData
         */
        set: function ($element, setData) {
            setData = common.util.isNull(setData) ? {} : setData;
            $element.attr(this._validationAttributeName, JSON.stringify(setData));
        },
        /**
         * @desc 해당 $object 에 유효성 적용된 element 모두 체크
         * @param {Object}$object
         * @param {string}notiType
         * @param {boolean}betch
         * @returns {boolean}
         */
        check: function ($object, notiType, betch) {
            var result = true;
            var first = true;
            var $target = $.merge($object.find('[' + this._validationAttributeName + ']'), $object.filter('[' + this._validationAttributeName + ']'));

            notiType = common.util.isNull(notiType) ? 'tailMsg' : notiType;
            betch = (betch !== false && common.util.isNull(betch)) ? true : betch;

            $target.each(function (i, elemnet) {
                var re = common.validation.checkElement(elemnet);
                if (!re.success) {
                    if (notiType == 'alert') {
                        common.noti.alert(re.message);
                    } else {
                        common.noti.tailMsg(elemnet.id, re.message);
                    }
                    result = false;
                    if (first) {
                        common.util.focus(elemnet);
                        first = false;
                        if (!betch) {
                            return false;
                        }
                    }
                } else {
                    if (notiType == 'tailMsg') {
                        common.noti.tailMsg(elemnet.id);
                    }
                }
            });
            return result;
        },
        /**
         * @desc element 에 적용된 유효성 체크
         * @param element
         * @returns {{success, message}}
         */
        checkElement: function (element) {
            //초기화
            var result = this._returnStructure(true);
            var $element = $(element);
            var setData = JSON.parse($element.attr(this._validationAttributeName));
            var title = $element.attr(this._titleAttributeName);

            var value = $element.val().trim();
            if (typeof setData['getValueFunction'] != 'undefined' && setData['getValueFunction'] != '') {
                value = (new Function('return ' + setData.getValueFunction + '();'))();
            }

            //필수
            if (setData['required'] == true) {
                var elementType = common.util.getElementInputType(element);
                var requiredMessageTag = (typeof setData['requiredMessageTag'] != 'undefined' && setData['requiredMessageTag'] != ''
                    ? setData['requiredMessageTag'] : "");
                var messageTag = "";
                var josa = "";

                if(typeof title == 'undefined' || title == '') {
                    title = '타이틀';
                }

                if (requiredMessageTag == '') {
                    josa = this.isEndWithConsonant(title) ? "을" : "를";
                }

                switch (elementType) {
                    case "select":
                    case "text":
                    case "textarea":
                    case "file":
                        if (!(value.length > 0)) {
                            switch (common.util.getElementInputType(element)) {
                                case "select":
                                    messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.select");
                                    return this._returnStructure(false, common.lang.get(messageTag, {'title': title, 'josa': josa}));
                                    break;
                                case "text":
                                case "textarea":
                                    messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.text");
                                    return this._returnStructure(false, common.lang.get(messageTag, {'title': title, 'josa': josa}));
                                    break;
                                case "file":
                                    messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.file");
                                    return this._returnStructure(false, common.lang.get(messageTag, {'title': title, 'josa': josa}));
                                    break;
                            }
                        }
                        break;
                    case "checkbox":
                        if (!($('input[type=checkbox][name="' + $element.attr('name') + '"]:checked').length > 0)) {
                            messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.checkbox");
                            return this._returnStructure(false, common.lang.get(messageTag, {'title': title, 'josa': josa}));
                        }
                        break;
                }
            }
            //회원 비밀번호
            if (setData['dataFormat'] == 'userPassword') {
                var num = value.search(common.regExp.number);
                var eng = value.search(common.regExp.english);
                var spe = value.search(common.regExp.specialCharacters);
                var space = value.search(common.regExp.space);
                var hangul = value.search(common.regExp.hangul);

                if (value.length < 8 || value.length > 20) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPassword.fail"));
                }
                if (value.replace(common.regExp.allowPw, "")) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPasswordSpecialChracter.fail"));
                }
                if (hangul != -1) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPassword.space"));
                }
                if (space != -1) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPassword.space"));
                }
                if (num < 0 || eng < 0 || spe < 0) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPassword.fail"));
                }
            }
            //회원 아이디
            if (setData['dataFormat'] == 'userId') {
                var remainStr = value.replace(common.regExp.number, '');
                // 1. 숫자만 존재시
                if (remainStr.length == 0) {
                    return this._returnStructure(false, common.lang.get("common.validation.userId.fail"));
                }
                var remainStr = value.replace(common.regExp.number, '').replace(common.regExp.english, '');
                // 2. 6자 미만, 20자 초과 일시
                if (value.length < 6 || value.length > 20) {
                    return this._returnStructure(false, common.lang.get("common.validation.userId.fail"));
                }
                // 3.영문 숫자외 문자가 존재 시
                if (remainStr.length > 0) {
                    return this._returnStructure(false, common.lang.get("common.validation.userId.fail"));
                }
            }
            //사업자 번호
            if (setData['dataFormat'] == 'companyNumber') {
                // bizID는 숫자만 10자리로 해서 문자열로 넘긴다.
                var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
                var tmpBizID, i, chkSum = 0, c2, remander;
                value = value.replace(/-/gi, '');

                for (i = 0; i <= 7; i++)
                    chkSum += checkID[i] * value.charAt(i);
                c2 = "0" + (checkID[8] * value.charAt(8));
                c2 = c2.substring(c2.length - 2, c2.length);
                chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
                remander = (10 - (chkSum % 10)) % 10;

                if (Math.floor(value.charAt(9)) != remander) {
                    return this._returnStructure(false, common.lang.get("common.validation.companyNumber.fail"));
                }
            }
            //주민 번호
            if (setData['dataFormat'] == 'juminNumber') {
                //주민등록 번호 13자리를 검사한다.
                var fmt = /^\d{6}[1234]\d{6}$/;  //포멧 설정
                if (!fmt.test(value)) {
                    return this._returnStructure(false, common.lang.get("common.validation.juminNumber.fail"));
                }
                // 생년월일 검사
                var birthYear = (value.charAt(6) <= "2") ? "19" : "20";
                birthYear += value.substr(0, 2);
                var birthMonth = value.substr(2, 2) - 1;
                var birthDate = value.substr(4, 2);
                var birth = new Date(birthYear, birthMonth, birthDate);
                if (birth.getYear() % 100 != value.substr(0, 2) || birth.getMonth() != birthMonth || birth.getDate() != birthDate) {
                    return false;
                }
                // Check Sum 코드의 유효성 검사
                var buf = new Array(13);
                for (var i = 0; i < 13; i++)
                    buf[i] = parseInt(value.charAt(i));
                var multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
                for (var sum = 0, i = 0; i < 12; i++)
                    sum += (buf[i] *= multipliers[i]);
                if ((11 - (sum % 11)) % 10 != buf[12]) {
                    return this._returnStructure(false, common.lang.get("common.validation.juminNumber.fail"));
                }

            }
            //email
            if (setData['dataFormat'] == 'email') {
                if (!common.regExp.email.test(value)) {
                    return this._returnStructure(false, common.lang.get("common.validation.email.fail"));
                }
            }
            //값 비교
            if (typeof setData['compare'] != 'undefined' && setData['compare'] != '') {
                if (value != $(setData['compare']).val()) {
                    var title = $(setData['compare']).attr(this._titleAttributeName);
                    return this._returnStructure(false, common.lang.get("common.validation.compare.fail", {'title': title}));
                }
            }
            // 모바일폰
            if (setData['dataFormat'] == 'mobile') {
                if (!common.regExp.mobile.test(value)) {
                    return this._returnStructure(false, common.lang.get("common.validation.mobile.fail", {'title': title}));
                }
            }
            //성공
            return result;
        },
        /**
         * @desc 유효성 결과 구조
         * @param {boolean}success
         * @param {string}message
         * @returns {{success: *, message: *}}
         * @private
         */
        _returnStructure: function (success, message) {
            message = common.util.isNull(message) ? "" : message;
            return {'success': success, 'message': message};
        },
        //조사 구분 함수
        isEndWithConsonant: function(korStr) {

            const finalChrCode = korStr.charCodeAt(korStr.length - 1);
            // 0 = 받침 없음, 그 외 = 받침 있음
            const finalConsonantCode = (finalChrCode - 44032) % 28;

            return finalConsonantCode !== 0;
        }
    },
    /**
     * @constructor
     * @desc 암호화
     */
    crypto: {
        /**
         * md5 라이브러리는 library.js 에 있음
         * @param {string}str
         * @returns {string|*}
         */
        md5: function (str) {
            return CryptoJS.MD5(str).toString();
        }
    },
    /**
     * @constructor
     * @desc ajax
     * @param {string}url
     * @param {Object}data
     * @param {Function}beforeCallback
     * @param {Function}successCallback
     * @param {string}dataType
     * @param {boolean}async
     */
    ajax: function (url, data, beforeCallback, successCallback, dataType, async) {
        dataType = common.util.isNull(dataType) ? "json" : dataType;
        async = common.util.isNull(async) ? true : async;
        data = typeof data !== 'object' ? {tmpData: data} : data;

        // csrf 처리
        data[forbizCsrf.name] = common.util.getCookie('ForbizCsrfCookieName');

        $.ajax({
            type: 'post',
            data: data,
            url: url,
            dataType: dataType,
            async: async,
            beforeSend: function () {
                common.ajaxManager.inc();

                if (typeof beforeCallback === "function") {
                    return beforeCallback();
                } else {
                    return true;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            },
            success: function (data) {
                if (typeof successCallback === "function") {
                    successCallback(data);
                }
            },
            complete: function () {
                forbizCsrf.hash = common.util.getCookie('ForbizCsrfCookieName');
                common.ajaxManager.dec();
            }
        });
    },
    /**
     * @constructor
     * @desc language
     */
    lang: {
        // 공통 치환 리스트 정의
        _commonChangeStrList: {'common.lineBreak': '\n'},

        // * ENVIRONMENT 가 development 때 사용 layout.htm 에 load 된 언어를 서버쪽으로 보내기 위한 저장소
        _storage: {},
        /**
         * tag 를 키로 언어 데이터를 storage 에 저장함
         * js 파일에 먼저 명시 하여 번역 데이터 관리하기 위해 만들어짐
         * @param {string}tag
         * @param {string}basicStr
         * @param {string}key
         */
        load: function (tag, basicStr, key) {
            key = common.util.isNull(key) ? "" : key;
            if (key == '') {
                key = common.crypto.md5(basicStr);
            }
            var transStr = this._getTransStr(key);
            var text = (typeof transStr !== 'undefined' && transStr != '' ? transStr : basicStr);
            this._storage[tag] = {'key': key, 'text': text};
        },
        /**
         * @desc load 된 언어 정보를 가지고 오기
         * @param {string}tag
         * @param {string}changeStr
         * @returns {string} returnStr
         */
        get: function (tag, changeStr) {
            changeStr = common.util.isNull(changeStr) ? {} : changeStr;
            var returnStr = '';
            if (typeof this._storage[tag] == 'undefined') {
                common.noti.log('js lang no load [' + tag + "]", 'error');
            } else {
                returnStr = this._storage[tag].text;
            }
            if (typeof this._commonChangeStrList == "object" && typeof returnStr !== 'undefined') {
                for (var search in this._commonChangeStrList) {
                    returnStr = common.lang._replace(search, this._commonChangeStrList[search], returnStr);
                }
            }
            if (typeof changeStr == "object" && typeof returnStr !== 'undefined') {
                for (var search in changeStr) {
                    returnStr = common.lang._replace(search, changeStr[search], returnStr);
                }
            }
            return returnStr;
        },
        /**
         * @desc 정규식으로 replace 처리 특수문자를 처리
         * @param {string}searchStr
         * @param {string}replaceStr
         * @param {string}str
         * @returns {void | string}
         * @private
         */
        _replace: function (searchStr, replaceStr, str) {
            var re = new RegExp('{' + searchStr + '}', 'g');
            return str.replace(re, replaceStr);
        },
        /**
         * @desc 사용 layout.htm 에 _LANGUAGE 변수로 된 현재 사용언어 번역 데이터에서 trans_key로 가지고 오기
         * @param {string}key
         * @returns {*}
         * @private
         */
        _getTransStr: function (key) {
            return _LANGUAGE[key];
        },
        /**
         * ENVIRONMENT 가 development 때 사용 layout.htm 맨 마지막에 load 된 데이터를 서버에 요청
         */
        jsLanguageCollection: function () {
            common.ajax(common.util.getControllerUrl('jsLanguageCollection', 'global'), {'storage': JSON.stringify(this._storage)});
        }
    },
    /**
     * @constructor
     * @desc 회원 인증
     */
    certify: {
        _success: null,
        /**
         * @desc 기본 인증 실패할 때
         * @param {string}message
         * @private
         */
        _fail: function (message) {
            common.noti.alert(message);
        },
        /**
         * @desc 인증 응답
         * @param result
         * @param {string}message
         * @param data
         */
        response: function (result, message, data) {
            if (result) {
                if (typeof this._success === "function") {
                    this._success(data);
                }
            } else {
                this._fail(message);
            }
        },
        /**
         * @desc 인증 수단 요청
         * @param {string}type
         */
        request: function (type) {
            if (type == 'certify') {
                common.util.popup('/member/cretify/request/certify', 500, 500, 'cretify');
            } else if (type == 'ipin') {
                common.util.popup('/member/cretify/request/ipin', 500, 500, 'cretify');
            } else if (type == 'sso') {
                common.util.popup('/member/cretify/request/sso', 500, 500, 'cretify');
            }
        },
        /**
         * @desc 인증 성공시 처리 set
         * @param {function}successFunction
         */
        setSuccess: function (successFunction) {
            this._success = successFunction;
        },
        /**
         * @desc 인증 실패시 처리 set
         * @param {function}failFunction
         */
        setFail: function (failFunction) {
            this._fail = failFunction;
        }
    },
    /**
     * @constructor
     * @desc 페이징
     */
    pagination: {
        pagingTpl: [
            '<div class="wrap-pagination">',
            '<button class="first devPageBtnCls" data-page="{[firstPageNum]}" {[#if firstPageNumDisable]}disabled{[/if]}><i>paging first</i></button>',
            '<button class="prev devPageBtnCls" data-page="{[underPageNum]}" {[#if underPageNumDisable]}disabled{[/if]}><i>under</i></button>',
            '{[{pageNumList}]}',
            '<button class="next devPageBtnCls" data-page="{[nextPageNum]}" {[#if nextPageNumDisable]}disabled{[/if]}><i>next</i></button>',
            '<button class="last devPageBtnCls" data-page="{[lastPageNum]}" {[#if lastPageNumDisable]}disabled{[/if]}><i>paging last</i></button>',
            '</div>'
        ],
        pageNumTpl: '<a href="javascript:void(0)" class="devPageBtnCls {[pageOn]}" data-page="{[pageNum]}">{[pageNum]}</a>',
        /**
         * @param {Object}data
         * @returns {string}
         */
        getHtml: function (data) {
            if (typeof data.page_list !== 'undefined') {
                var pagingHtml = [];
                var pageNum = Handlebars.compile(this.pageNumTpl);
                var paging = Handlebars.compile(this.pagingTpl.join(''));

                for (var i = 0; i < data.page_list.length; i++) {
                    pagingHtml.push(pageNum({
                        pageNum: data.page_list[i],
                        pageOn: (data.cur_page == data.page_list[i] ? 'on' : '')
                    }));
                }

                return paging({
                    firstPageNum: data.first_page
                    , firstPageNumDisable: (data.cur_page != data.first_page ? false : true)
                    , underPageNum: data.prev_page
                    , underPageNumDisable: (data.cur_page != data.prev_page ? false : true)
                    , pageNumList: pagingHtml.join('')
                    , nextPageNum: data.next_page
                    , nextPageNumDisable: (data.cur_page != data.next_page ? false : true)
                    , lastPageNum: data.last_page
                    , lastPageNumDisable: (data.cur_page != data.last_page ? false : true)
                });
            } else {
                return '';
            }
        }
    },
    /**
     * @constructor
     * @example
     * //ajaxList 사용방법
     * var goodsListAjax = common.ajaxList();
     goodsListAjax
     .setLoadingTpl('#devListLoading')
     .setListTpl('#devListDetail')
     .setEmptyTpl('#devListEmpty')
     .setContainerType('ul')
     .setContainer('#devListContents')
     .setPagination('#devPageWrap')
     .setPageNum('#devPage')
     .setForm('#devListForm')
     .setUseHash(true)
     .setController('getGoodsList', 'product')
     .init(function (response) {
            // 전체 상품 수
            $('#devTotalProduct').text(common.util.numberFormat(response.data.total));
            goodsListAjax.setContent(response.data.list, response.data.paging);
     });

     $('#devPageWrap').on('click', '.devPageBtnCls', function () { // 페이징 버튼 이벤트 설정
            goodsListAjax.getPage($(this).data('page'));
     });
     * @returns {{container: string, loadingTpl: string, setContent: setContent, pagination: string, getHash: (function(*): string), getPage: getPage, compileTpl: compileTpl, topPosition: number, setForm: (function(*=): common), showLoading: showLoading, formObj: string, beforCallback: (function(): boolean), setEmptyTpl: (function(*=): common), gotoTop: gotoTop, setGotoTop: (function(*=): common), useHash: boolean, reload: reload, setUseHash: (function(*): common), parseHash: parseHash, changeSearch: boolean, init: init, setPagination: (function(*): common), containerType: string, setListTpl: (function(*=): common), listTpl: string, setContainerType: (function(*): common), onLoading: boolean, useGotoTop: boolean, utl: string, setPageNum: (function(*): common), pageNum: string, removeContent: removeContent, setLoadingTpl: (function(*=): common), successCallback: (function(): boolean), emptyTpl: string, validName: validName, paginationTpl: *, setContainer: (function(*): common), setController: (function(*=, *=): common)}}
     */
    ajaxList: function () {
        return {
            container: '',
            containerType: 'table',
            pagination: '',
            paginationTpl: common.pagination,
            pageNum: '#devPage',
            listTpl: '',
            emptyTpl: '',
            loadingTpl: '',
            formObj: '',
            utl: '',
            topPosition: 0,
            onLoading: false,
            useHash: true,
            useGotoTop: false,
            changeSearch: false,
            validName: function (name) {
                switch (name) {
                    case 'max':
                    case 'page':
                    case 'ForbizCsrfTestName':
                        return false;
                        break;
                }

                return true;
            },
            getHash: function (page) {
                var tail = [];
                var self = this;

                $.each(self.formObj.serializeArray(), function (idx, field) {
                    if (self.validName(field.name) && field.value) {
                        tail.push(field.name + '=' + escape(field.value));
                    }
                });

                return '#page' + page + '&' + tail.join('&');
            },
            parseHash: function () {
                var self = this;
                var query = location.hash.substr(1).split('&');

                self.changeSearch = false;

                if (query.length > 0) {
                    $.each(query, function (idx, part) {
                        if (part.indexOf('=') > 0) {
                            var item = part.split("=");

                            if (self.validName(item[0])) {
                                var el = self.formObj.find('[name=' + item[0] + ']');
                                var type = el.prop('type');
                                item[1] = unescape(item[1]);

                                if(type == 'radio' || type == 'checkbox') {
                                    $('[name=' + item[0] + '][value="' + item[1] +'"]').prop('checked', true);
                                } else if (el.length > 0 && el.val() != item[1]) {
                                    el.val($.trim(item[1]));
                                    self.changeSearch = true;
                                }
                            }
                        }
                    });
                }
            },
            gotoTop: function () {
                $('html, body').animate({scrollTop: this.topPosition}, 0);
            },
            beforCallback: function () {
                return true;
            },
            successCallback: function () {
                return false;
            },
            compileTpl: function (tplId) {
                try {
                    var tplObj = Handlebars.compile(common.util.getTpl(tplId));
                    $(tplId).remove();
                    return tplObj;
                } catch (e) {
                    alert("Not define ForbizTpl [" + tplId + "]");
                }
            },
            setListTpl: function (tpl) {
                this.listTpl = (typeof tpl === 'function' ? tpl : this.compileTpl(tpl));
                return this;
            },
            setEmptyTpl: function (tpl) {
                this.emptyTpl = (typeof tpl === 'function' ? tpl : this.compileTpl(tpl));
                return this;
            },
            setLoadingTpl: function (tpl) {
                this.loadingTpl = (typeof tpl === 'function' ? tpl : this.compileTpl(tpl));
                return this;
            },
            setGotoTop: function (topPosition) {
                if (topPosition || topPosition === 0) {
                    this.topPosition = topPosition;
                    this.useGotoTop = true;
                } else {
                    this.topPosition = 0;
                    this.useGotoTop = false;
                }

                return this;
            },
            setForm: function (formId) {
                this.formObj = $(formId);
                return this;
            },
            setContainer: function (containerId) {
                this.container = containerId;
                return this;
            },
            setPagination: function (paginationId) {
                this.pagination = paginationId;
                return this;
            },
            setPageNum: function (pageNum) {
                this.pageNum = pageNum;
                return this;
            },
            setContainerType: function (containerType) {
                this.containerType = containerType;
                return this;
            },
            setController: function (methodName, controllerName) {
                this.url = common.util.getControllerUrl(methodName, controllerName);
                return this;
            },
            setContent: function (list, paging) {
                this.removeContent();
                if (list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        var row = list[i];
                        $(this.container).append(this.listTpl(row));
                    }

                    if (paging) {
                        $(this.pagination).html(this.paginationTpl.getHtml(paging));
                    }
                } else {
                    $(this.container).append(this.emptyTpl());
                }
            },
            setUseHash: function (useHash) {
                if (useHash === true) {
                    this.useHash = true;
                } else {
                    this.useHash = false;
                }

                return this;
            },
            removeContent: function () {
                if (this.containerType == 'table') {
                    $(this.container + ' > tr').remove();
                } else {
                    $(this.container).empty();
                }

                $(this.pagination).empty();
            },
            init: function (callback, beforeCallback) {
                var self = this;
                var page = 1;

                if (self.useHash) {
                    self.parseHash();
                    page = parseInt(location.hash.slice(5));
                    if (isNaN(page)) {
                        page = 1;
                    }

                    $(window).on('hashchange', function () {
                        self.parseHash();
                        var page = parseInt(location.hash.slice(5));
                        if (isNaN(page)) {
                            page = 1;
                        }

                        if (self.onLoading !== page || self.changeSearch) {
                            self.getPage(page);
                        }
                    });
                }

                if (typeof callback === "function") {
                    self.successCallback = callback;

                    if (typeof beforeCallback === "function") {
                        self.beforCallback = beforeCallback;
                    }

                    common.form.init(self.formObj, self.url, self.beforeCallback, self.successCallback);

                    var orgUseGotoTop = self.useGotoTop;
                    self.useGotoTop = false;
                    self.getPage(page);
                    self.useGotoTop = orgUseGotoTop;
                } else {
                    alert('Not define callback');
                }
            },
            showLoading: function () {
                this.removeContent();
                $(this.container).append(this.loadingTpl());
            },
            getPage: function (page) {
                var self = this;

                self.setGotoTop($(self.container).offset().top -400);

                if (self.useGotoTop) {
                    $(self.pagination).on('click', ".devPageBtnCls", function() {
                        $(window).scrollTop($(self.container).offset().top - 400);
                        // self.gotoTop();
                    });
                }

                self.showLoading();
                $(self.pageNum).val(page);
                self.formObj.submit();
                self.onLoading = page;
                if (self.useHash && page >= 1) {
                    window.location.hash = self.getHash(page);
                }
            },
            reload: function () {
                this.getPage(this.onLoading);
            }
        };
    },
    /**
     * @constructor
     * @desc more 페이징
     */
    morePagination: {
        pagingTpl: [
            '<button class="btn-more-view devPageBtnCls" data-page="{[nextPageNum]}" type="button">',
            '더보기 (<span>{[currentPageNum]}</span>/{[lastPageNum]})',
            '</button>'
        ],
        /**
         * @param {Object}data
         * @returns {string}
         */
        getHtml: function (data) {
            if (typeof data.page_list !== 'undefined') {
                var pagingHtml = [];
                var paging = Handlebars.compile(this.pagingTpl.join(''));

                return paging({
                    currentPageNum: data.cur_page,
                    nextPageNum: data.next_page,
                    lastPageNum: data.last_page
                });
            } else {
                return '';
            }
        }
    },
    /**
     * @constructor
     * @desc more ajaxList
     * @returns {{container: string, loadingTpl: string, setContent: setContent, pagination: string, lastPage: boolean, getHash: (function(*): string), getPage: getPage, compileTpl: compileTpl, topPosition: number, sowPagination: sowPagination, setForm: (function(*=): common), showLoading: showLoading, formObj: string, remove: boolean, beforCallback: (function(): boolean), setEmptyTpl: (function(*=): common), gotoTop: gotoTop, setGotoTop: (function(*=): common), useHash: boolean, reload: reload, setUseHash: (function(*): common), parseHash: parseHash, changeSearch: boolean, hidePagination: hidePagination, init: init, setPagination: (function(*): common), containerType: string, setListTpl: (function(*=): common), listTpl: string, setContainerType: (function(*): common), onLoading: boolean, useGotoTop: boolean, utl: string, setPageNum: (function(*): common), pageNum: string, removeContent: removeContent, setLoadingTpl: (function(*=): common), successCallback: (function(): boolean), emptyTpl: string, validName: validName, setRemoveContent: (function(*): common), setContainer: (function(*): common), setController: (function(*=, *=): common)}}
     */
    moreAjaxList: function () {
        return {
            container: '',
            containerType: 'table',
            pagination: '',
            pageNum: '#devPage',
            lastPage: false,
            listTpl: '',
            emptyTpl: '',
            loadingTpl: '',
            formObj: '',
            utl: '',
            topPosition: 0,
            remove: true,
            onLoading: false,
            useHash: true,
            useGotoTop: false,
            changeSearch: false,
            validName: function (name) {
                switch (name) {
                    case 'max':
                    case 'page':
                    case 'ForbizCsrfTestName':
                        return false;
                        break;
                }

                return true;
            },
            getHash: function (page) {
                var tail = [];
                var self = this;

                $.each(self.formObj.serializeArray(), function (idx, field) {
                    if (self.validName(field.name) && field.value) {
                        tail.push(field.name + '=' + escape(field.value));
                    }
                });

                return '#page' + page + '&' + tail.join('&');
            },
            parseHash: function () {
                var self = this;
                var query = location.hash.substr(1).split('&');

                self.changeSearch = false;

                if (query.length > 0) {
                    $.each(query, function (idx, part) {
                        if (part.indexOf('=') > 0) {
                            var item = part.split("=");

                            if (self.validName(item[0])) {
                                var el = self.formObj.find('[name=' + item[0] + ']');

                                item[1] = unescape(item[1]);
                                if (el.length > 0 && el.val() != item[1]) {
                                    el.val($.trim(item[1]));
                                    self.changeSearch = true;
                                }
                            }
                        }
                    });
                }
            },
            gotoTop: function () {
                $('html, body').animate({scrollTop: this.topPosition}, 0);
            },
            beforCallback: function () {
                return true;
            },
            successCallback: function () {
                return false;
            },
            compileTpl: function (tplId) {
                try {
                    var tplObj = Handlebars.compile(common.util.getTpl(tplId));
                    $(tplId).remove();
                    return tplObj;
                } catch (e) {
                    alert("Not define ForbizTpl [" + tplId + "]");
                }
            },
            setRemoveContent: function (remove) {
                this.remove = remove;

                return this;
            },
            setListTpl: function (tpl) {
                this.listTpl = (typeof tpl === 'function' ? tpl : this.compileTpl(tpl));
                return this;
            },
            setEmptyTpl: function (tpl) {
                this.emptyTpl = (typeof tpl === 'function' ? tpl : this.compileTpl(tpl));
                return this;
            },
            setLoadingTpl: function (tpl) {
                this.loadingTpl = (typeof tpl === 'function' ? tpl : this.compileTpl(tpl));
                return this;
            },
            setGotoTop: function (topPosition) {
                if (topPosition || topPosition === 0) {
                    this.topPosition = topPosition;
                    this.useGotoTop = true;
                } else {
                    this.topPosition = 0;
                    this.useGotoTop = false;
                }

                return this;
            },
            setForm: function (formObj) {
                this.formObj = $(formObj);
                return this;
            },
            setContainer: function (containerId) {
                this.container = containerId;
                return this;
            },
            setPagination: function (paginationId) {
                this.pagination = paginationId;
                return this;
            },
            setPageNum: function (pageNum) {
                this.pageNum = pageNum;
                return this;
            },
            setContainerType: function (containerType) {
                this.containerType = containerType;
                return this;
            },
            setController: function (methodName, controllerName) {
                this.url = common.util.getControllerUrl(methodName, controllerName);
                return this;
            },
            setContent: function (list, paging) {
                //마지막 페이지 또는 page가 1일때 숨김
                if (paging && (paging.cur_page == paging.last_page || paging.page_list.length <= 1)) {
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
                        $(this.container).append(this.listTpl(row));
                    }

                    if (paging) {
                        $(this.pagination).html(common.morePagination.getHtml(paging));
                    }
                } else {
                    $(this.container).append(this.emptyTpl());
                }
            },
            setUseHash: function (useHash) {
                if (useHash === true) {
                    this.useHash = true;
                } else {
                    this.useHash = false;
                }

                return this;
            },
            removeContent: function () {
                if (this.containerType == 'table') {
                    $(this.container + ' > tr').remove();
                } else {
                    $(this.container).empty();
                }

                $(this.pagination).empty();
            },
            init: function (callback, beforeCallback) {
                var self = this;
                var page = 1;

                if (self.useHash) {
                    self.parseHash();
                    page = parseInt(location.hash.slice(5));
                    if (isNaN(page)) {
                        page = 1;
                    }

                    $(window).on('hashchange', function () {
                        self.parseHash();
                        var page = parseInt(location.hash.slice(5));
                        if (isNaN(page)) {
                            page = 1;
                        }
                        if (self.onLoading !== page || self.changeSearch) {
                            self.getPage(page);
                        }
                    });
                }

                if (typeof callback === "function") {
                    self.successCallback = callback;

                    if (typeof beforeCallback === "function") {
                        self.beforCallback = beforeCallback;
                    }

                    common.form.init(self.formObj, self.url, self.beforeCallback, self.successCallback);

                    var orgUseGotoTop = self.useGotoTop;
                    self.useGotoTop = false;
                    self.getPage(page);
                    self.useGotoTop = orgUseGotoTop;
                } else {
                    alert('Not define callback');
                }
            },
            showLoading: function () {
//                this.removeContent();
//                $(this.container).append(this.loadingTpl());
            },
            getPage: function (page) {
                var self = this;
                var curPage = $(self.pageNum).val();

                if (page == 1 || page != curPage) {
                    if (self.useGotoTop) {
                        self.gotoTop();
                    }

                    self.showLoading();
                    $(self.pageNum).val(page);
                    self.formObj.submit();
                    self.onLoading = page;
                    if (self.useHash && page > 1) {
                        window.location.hash = self.getHash(page);
                    }
                }


            },
            reload: function () {
                this.getPage(this.onLoading);
            },
            hidePagination: function () {
                $(this.pagination).hide();
            },
            sowPagination: function () {
                $(this.pagination).show();
            }
        };
    }
};

//사용하는 언어 로드
common.lang.load('common.validation.required.text', "{title}{josa} 입력해 주세요."); //Alert_05
common.lang.load('common.validation.required.checkbox', "{title}{josa} 체크해 주세요.");
common.lang.load('common.validation.required.select', "{title}{josa} 선택해 주세요.");
common.lang.load('common.validation.required.file', "{title}{josa} 첨부해 주세요.");
common.lang.load('common.validation.userPassword.fail', "영문 대소문자, 숫자, 특수문자 중 3개 이상을 조합하여 8자리 이상 입력해 주세요."); //Alert_64
common.lang.load('common.validation.userPasswordSpecialChracter.fail', "특수문자는 !@#$%^&*()_+~ 만 사용해 주세요.");
common.lang.load('common.validation.userPassword.space', "비밀번호는 공백 없이 입력해주세요.");
common.lang.load('common.validation.compare.fail', "{title}와 일치하게 입력해 주세요.");
common.lang.load('common.validation.userId.fail', "영문 혹은 영문+숫자를 조합하여 6~20자리로 입력해 주세요.");
common.lang.load('common.validation.companyNumber.fail', "유효한 사업자 정보가 아닙니다."); //Alert_08
common.lang.load('common.validation.juminNumber.fail', "유효한 주민등록 정보가 아닙니다."); //Alert_08
common.lang.load('common.validation.email.fail', "이메일을 올바르게 입력해 주세요.");
common.lang.load('common.inputFormat.fileFormat.fail', "파일 형식이 올바르지 않습니다.{common.lineBreak}다시 첨부해 주세요.");
common.lang.load('common.inputFormat.fileSize.fail', "파일 용량이 최대 {size}MB를 초과했습니다.{common.lineBreak}다시 첨부해 주세요.");
common.lang.load('common.validation.mobile.fail', "휴대폰번호를  올바르게 입력해 주세요.");
//inputFormat bind
common.inputFormat.eventBind();