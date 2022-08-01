"use strict";
/**
 * 개발 공통
 * @type {{environment: string, regExp, util, noti, form, validation, crypto, ajax: common.ajax, lang}}
 */
var common = {
    /**
     * 개발 환경 정보 (return -> development, testing, production)
     * 사용하는 layout.htm 에 common.environment = "{c.ENVIRONMENT}"; set을함
     */
    environment: "",
    /**
     * 관리자 layout 정보
     */
    layout: "",
    /**
     * 정규식
     */
    regExp: {
        number: /[0-9]/g,
        exceptNumber: /[^0-9]/g,
        english: /[a-z]/ig,
        specialCharacters: /[!@#$%^&*\(\)_+~]/gi,
        space: /\s/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        hangul: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,
        mobile: /^\d{3}-\d{3,4}-\d{4}$/,
        lineBreak: /(\n|\r\n)/g
    },
    util: {
        controllerParams: [],
        copyText: function (text) {
            var $tempInput = $("<textarea>");
            $("body").append($tempInput);
            $tempInput.val(text).select();
            document.execCommand("copy");
            $tempInput.remove();
        },
        dates: {
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
         * getCookie
         * @param {String} cname
         * @returns {String}
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
        setCookie: function (cName, cValue, cDay) {
            var expire = new Date();
            expire.setDate(expire.getDate() + cDay);
            var cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
            if (typeof cDay != 'undefined')
                cookies += ';expires=' + expire.toGMTString() + ';';
            document.cookie = cookies;
        },
        /**
         * php 컨트롤 url 정보 가지고 오기
         * @param methodName
         * @param className
         * @param moduleName
         * @returns {string}
         */
        getControllerUrl: function (methodName, className, moduleName) {
            var controller = [];
            var self = common.util;

            if (moduleName) {
                controller.push(moduleName);
            }

            controller.push(className);
            controller.push(methodName);


            var url = '/' + controller.join('/') + (self.controllerParams.length > 0 ? ('/' + self.controllerParams.join('/')) : '');
            this.controllerParams = [];

            if (common.layout != '') {
                url += '?_layout_=' + common.layout;
            }
            return url;
        },
        setParams: function () {
            var self = common.util;
            for (var i = 0; i < arguments.length; i++) {
                self.controllerParams.push(arguments[i]);
            }
            return self;
        },
        /**
         * javascript null 체크
         * @param value
         */
        isNull: function (value) {
            return ((typeof value != "boolean" && value == "") || value == null || typeof value == 'undefined' || (value != null && typeof value == "object" && !Object.keys(value).length) ? true : false);
        },
        /**
         * 팝업
         * @param path
         * @param width
         * @param height
         * @param name
         * @param scroll
         * @returns {Window}
         */
        popup: function (path, width, height, name, scroll) {
            scroll = this.isNull(scroll) ? false : scroll;
            var winl = (screen.width - width) / 2;
            var wint = (screen.height - height) / 2;
            var winprops = 'height=' + height + ',width=' + width + ',top=' + wint + ',left=' + winl + ',scrollbars=' + scroll + ',menubar=no,status=no,toolbar=no,resizable=no';
            return window.open(path, name, winprops);
        },
        /**
         * 모달
         */
        modal: {
            /**
             * 모달 보여주기
             */
            _show: function (title, html, option) {
                //퍼블쪽에서 만든 스크립트 실행
                if (!option) {
                    option = {};
                }
                modal.madal_make({name: title, bio: html}, {
                    width: option.width ? option.width : '100px',
                    height: option.height ? option.height : '100px'
                });
            },
            /**
             * 모달 닫기
             */
            close: function () {
                $('.fb-modal__close:last').trigger('click');
            },
            /**
             * 모달 열기
             * @param type
             * @param title
             * @param parameter1
             * @param parameter2
             */
            open: function (type, title, parameter1, parameter2, completeFunction, option) {
                parameter2 = common.util.isNull(parameter2) ? '' : parameter2;
                $('#devModalTitle').text(title);
                var $modalContent = $('#devModalContent');
                $modalContent.empty();
                if (type == 'html') {
                    common.util.modal._show(title, parameter1, option);
                    if (typeof completeFunction === "function") {
                        completeFunction();
                    }
                } else {
                    common.ajax(parameter1, parameter2, '', (function (response) {
                        common.util.modal._show(title, response, option);
                        if (typeof completeFunction === "function") {
                            completeFunction();
                        }
                    }), 'html');
                }
            }
        },
        /**
         * 요소의 성격에 따라 포커스 이동
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
         * element 의 태그명과 타입에 따라서 결과 리턴
         * @param element
         * @returns {*} select, checkbox, text
         */
        getElementInputType: function (element) {
            if (element.tagName.toLowerCase() == "select") {
                return "select";
            } else if (element.tagName.toLowerCase() == "input" && element.type == "checkbox") {
                return "checkbox";
            } else if (element.tagName.toLowerCase() == "input" && (element.type == "text" || element.type == "number" || element.type == "password" || element.type == "hidden")) {
                return "text";
            } else if (element.tagName.toLowerCase() == "input" && element.type == "radio") {
                return "radio";
            } else if (element.tagName.toLowerCase() == "input" && element.type == "file") {
                return "file";
            } else if (element.tagName.toLowerCase() == "textarea") {
                return "textarea";
            }
        },
        /**
         * 이미지 미리보기
         * @param $image
         * @param $file
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
         * Get template
         * @param $selector
         * @returns {jQuery}
         */
        getTpl: function ($selector) {
            return $($selector).clone().removeAttr('id').removeClass('devForbizTpl').wrapAll("<div/>").parent().html();
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
        getHtml: function (selector) {
            var html = $(selector).html();

            // form 삭제
            $(selector).remove();

            return (html ? html : '');
        },
        /**
         * number format
         * @param {type} number
         * @param {type} decimals
         * @param {type} decPoint
         * @param {type} thousandsSep
         * @returns {unresolved}
         */
        numberFormat: function (number, decimals, decPoint, thousandsSep) {
            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
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
         * 파라미터 가지고 오는 함수
         * @param {type} name
         * @param {type} url
         * @returns {String}
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
        json_encode: function (data) {
            return JSON.stringify(data);
        },
        json_decode: function (string) {
            return JSON.parse(string);
        },
        convertMultipleSearchText: function (text) {
            text = text.replace(common.regExp.lineBreak, ',').replace(',,', ',');
            if (text.trim() == ',') {
                text = '';
            }
            return text;
        },
        getChartColor: function (index, opacity) {
            if (!opacity) {
                opacity = 1;
            }
            var color = [
                'rgb(255, 99, 132,' + opacity + ')' //red
                , 'rgb(54, 162, 235,' + opacity + ')' //blue
                , 'rgb(255, 205, 86,' + opacity + ')' //yellow
                , 'rgb(75, 192, 192,' + opacity + ')' //green
                , 'rgb(255, 159, 64,' + opacity + ')' //orange
                , 'rgb(153, 102, 255,' + opacity + ')' //purple
                , 'rgb(201, 203, 207,' + opacity + ')' //grey
            ];
            if (index === true) {
                return color;
            } else {
                return color[index];
            }
        }
    },
    /**
     * 알림
     */
    noti: {
        /**
         * @param txt
         */
        alert: function (txt, callback) {
            alert(txt);
            if (typeof callback === "function") {
                callback();
            }
        },
        /**
         * @param message
         * @param okCallback
         * @param cancelCallback
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
         * type basic|error|success
         * @param attributeTailMsgVal
         * @param message
         * @param type
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
            $('[devTailMsg~=' + attributeTailMsgVal + ']').attr('class', cssClass).html(message);
        },
        /**
         * common.environment 가 development 일떄만 로그 보임
         * @param message
         * @param type (log, warn, error)
         */
        log: function (message, type) {
            type = common.util.isNull(type) ? 'log' : type;
            if (common.environment == 'development') {
                if (!window.console) {
                    eval('var console =  {"' + type + '": function() {} }');
                }
                eval('console.' + type + '("' + message + '")');
            }
        },
        popup: {
            layerPopupTpl: false,
            inItLayerTpl:function() {
                if (this.layerPopupTpl === false) {
                    // this.layerPopupTpl = Handlebars.compile([
                    //     '<section class="main_popupL-wrap devNotiPopup" devpopupix="{{{\popup_ix}}}">',
                    //     '   <div class="main_popupL-inner">{{{\popup_text}}}</div>',
                    //     '   <div class="main_popupL-btns">',
                    //     '       <label class="close-today">',
                    //     '           <input type="checkbox" class="devPopupToday" devpopupix="{{{\popup_ix}}}">',
                    //     '           <span>오늘 하루 보지 않기</span>',
                    //     '       </label>',
                    //     '       <button type="button" class="close-popup" data-devpopupix="{{{\popup_ix}}}">[닫기]</button>',
                    //     '   </div>',
                    //     '</section>'
                    // ].join(''));
                }
            },
            getCookieKey: function (popupIx) {
                return 'notiPopup' + popupIx;
            },
            layerRender: function (data,top,left) {
                var $popupWrap = $('#devNotiPopup');
                $popupWrap.empty().append(data);
                $popupWrap.css({
                    left: top+"px",
                    top: left+"px"
                });

            },
            getPopData: function (data) {
                common.ajax(
                    common.util.getControllerUrl('getPopData', 'managePopup', 'display')
                    , {'popupIx':data.popup_ix}, false
                    , function (response) {
                        if (response.result == 'success') {
                            common.noti.popup.layerRender(response.data,data.popup_left,data.popup_top);
                        } else {
                            console.log(response);
                        }
                    }
                );
            },
            load: function (datas) {
                $.each(datas, function (i, data) {
                    //쿠키 관련 체크 처리
                    if (common.util.getCookie(common.noti.popup.getCookieKey(data.popup_ix)) != '1') {
                        var url = '/pub/popup/' + data.popup_ix;

                        if (data.popup_type == 'L') { //레이어 POPUP
                            common.ajax(url, data, '', function(response) {
                                common.noti.popup.layerRender($(response).filter('.popup-wrapper').html(), data.popup_top, data.popup_left);
                            }, 'html');

                        } else {
                            common.util.popup(url, data.popup_width, data.popup_height, common.noti.popup.getCookieKey(data.popup_ix), false);
                        }
                    }
                });
            },
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
    /**
     * 데이터 입력 포멧 제어
     */
    inputFormat: {
        /**
         * format set
         * number = true
         * maxLength = 20
         * fileFormat = image, excel
         * devFileSize = 30 (메가바이트)
         * @param $element
         * @param setData
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
         * evnet bind
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
                    if (this.value.length > maxLength) {
                        this.value = this.value.slice(0, maxLength);
                    }
                }
            }, 'input[devMaxLength]');
            //fileFormat
            $(document).on({
                'change': function (e) {
                    if (this.files.length > 0) {
                        var format = $(this).attr('devFileFormat');
                        var typeSearchText;
                        if (format == 'image') {
                            typeSearchText = 'image';
                        } else if (format == 'excel') {
                            typeSearchText = 'vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        } else {
                            typeSearchText = 'error';
                        }
                        var file = this.files[0];
                        if (file.type.search(typeSearchText) < 0) {
                            this.value = null;
                            $(this).trigger('change');
                            common.noti.alert(common.lang.get('common.inputFormat.fileFormat.fail'));
                        }
                    }
                }
            }, 'input[devFileFormat]');
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

            $(document).on('click','.devFileDelete',function(e){
                var target = $(this);
                var fileUrl = $(this).data('fileUrl');
                var pageUrl = this.href;
                var inputName = $(this).data('fileName');
                if(common.noti.confirm(common.lang.get('common.delete.file.confirm'))) {
                    common.ajax(common.util.getControllerUrl('delFileUri', 'upload', 'system'),
                        {
                            fileUrl: fileUrl,
                            pageUrl: pageUrl,
                            inputName: inputName
                        },
                        function () {
                            return true;
                        },
                        function (response) {
                            // 전송후 결과 확인
                            if (response.result == 'success') {
                                if(response.data[0] == true ){
                                    target.siblings('.devFileDeleteOrg').trigger('click');
                                    return this;
                                }else if(response.data[0] == 'notUploadFile'){
                                    target.siblings('.devFileDeleteOrg').trigger('click');
                                    return this;
                                }else{
                                    common.noti.alert(common.lang.get('common.delete.file.fail'));
                                    location.reload();
                                }

                            } else {
                                common.noti.alert(response.result);
                            }
                        }
                    );
                }else{
                    return false;
                }
            });
        }
    },
    /**
     * form
     */
    form: {
        /**
         * form 에 ajaxForm 스크립트 set
         * @param $form
         * @param url
         * @param beforeCallback
         * @param successCallback
         */
        init: function ($form, url, beforeCallback, successCallback) {
            (function () {
                /**
                 * submit 진행 여부 (중복 액션 막기 위한 플레그)
                 * @type {boolean}
                 */
                var _ingSubmit = false;
                $form.attr('action', url);
                $form.ajaxForm({
                    method: 'post',
                    beforeSubmit: function (formData, $form) {
                        var deleteFile = [];

                        // File 관련 추가처리
                        for (var i in formData) {
                            if (formData[i].type == 'file') {
                                var formStatus = $('input[name="' + formData[i].name + '"][type="file"]').data('status');
                                var imgFile = $('input[name="' + formData[i].name + '"][type="file"]').data('img-src');

                                if (formStatus == 'delete' && imgFile) {
                                    deleteFile.push({column: formData[i].name, file: imgFile});
                                }
                            }
                        }

                        if (deleteFile.length > 0) {
                            formData.push(common.form.makeData('deleteFile', deleteFile));
                        }

                        // CSRF 로직 추가
                        formData.push({
                            name: forbizCsrf.name,
                            value: common.util.getCookie('ForbizCsrfCookieName'),
                            type: "hidden"
                        });

                        if (_ingSubmit) {
                            common.noti.log('ajaxForm 처리중입니다.');
                            return false;
                        }
                        _ingSubmit = true;
                        if (typeof beforeCallback === "function") {
                            var ret = beforeCallback(formData, $form);
                            if ($.isArray(ret)) {
                                formData = ret;
                                return true;
                            } else if (ret) {
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
                        if(typeof response.data.sysMsg !== 'undefined' && response.data.sysMsg == 'NoSession') {
                            alert('로그인이 필요합니다.');
                            location.replace('/system/login');
                        } else {
                            //성공후 서버에서 받은 데이터 처리
                            if (typeof successCallback === "function") {
                                successCallback(response);
                            }
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
                    }
                });
            }());
        },
        reset: function ($form) {
            $form.each(function () {
                this.reset();
                $(this).find('input[type=hidden][devReset]').val('');
            });
            //common.ui.quickDate 선택강조 초기화
            $('.fb-filter__day--active').removeClass('fb-filter__day--active');
        },
        makeData: function (key, value) {
            if ($.isArray(value) || $.isPlainObject(value)) {
                value = common.util.json_encode(value);
            }
            return {name: key, value: value, type: 'hidden', required: false};
        },
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
        },
        getObj: function ($form) {
            var formObj = $($form).serializeArray();
            var dataObj = {};

            if (typeof formObj.length !== 'undefined' && formObj.length > 0) {
                for (var idx in formObj) {
                    dataObj[formObj[idx].name] = formObj[idx].value;
                }
            }

            return dataObj;
        }
    },
    /**
     * 유효성
     * 'required': true (필수)
     * 'requiredMessageTag' : common.lang.get("joinAgreement.required.message") (노출 언어 지정)
     * 'dataFormat' : 'userPassword' (회원 비밀번호), 'userId' (회원 아이디), 'companyNumber'(사업자 번호), 'email' (이메일)
     * 'compare': '#devUserPassword' (값 동일 체크 대상 jQuery 선택자 입력)
     * 'getValueFunction' : function (input 값을 조합해서 체크해야할때 사용)
     */
    validation: {
        /**
         * 유효성 체크 하기 위한 attribute명
         * @type {string}
         */
        _validationAttributeName: 'devValidation',
        /**
         * element 의 이름을 가지고 오기위한 attribute명
         * @type {string}
         */
        _titleAttributeName: 'title',
        /**
         * element에 유효성 체크 규칙 적용
         * @param $element
         * @param setData
         */
        set: function ($element, setData) {
            setData = common.util.isNull(setData) ? {} : setData;
            $element.attr(this._validationAttributeName, JSON.stringify(setData));
        },
        unset: function ($element) {
            var self = this;

            $element.removeAttr(self._validationAttributeName);
        },
        reset: function ($form) {
            var self = this;
            $form.each(function () {
                $(this).removeAttr(self._validationAttributeName);
            })
        },
        /**
         * 해당 $object 에 유효성 적용된 element 모두 체크
         * @param $object
         * @returns {boolean}
         */
        check: function ($object, notiType, betch) {
            notiType = common.util.isNull(notiType) ? 'tailMsg' : notiType;
            betch = (betch !== false && common.util.isNull(betch)) ? true : betch;
            var result = true;
            var first = true;
            var $target = $.merge($object.find('[' + this._validationAttributeName + ']'), $object.filter('[' + this._validationAttributeName + ']'));
            $target.each(function (i, element) {
                var re = common.validation.checkElement(element);
                if (!re.success) {
                    if (notiType == 'alert')
                        common.noti.alert(re.message);
                    else
                        common.noti.tailMsg(element.id, re.message);
                    result = false;
                    if (first) {
                        common.util.focus(element);
                        first = false;
                        if (!betch) {
                            return false;
                        }
                    }
                } else {
                    if (notiType == 'tailMsg')
                        common.noti.tailMsg(element.id);
                }
            });
            return result;
        },
        /**
         * element 에 적용된 유효성 체크
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
                value = eval(setData['getValueFunction'] + '()');
            }

            //필수
            if (setData['required'] == true) {
                var elementType = common.util.getElementInputType(element);
                var requiredMessageTag = (typeof setData['requiredMessageTag'] != 'undefined' && setData['requiredMessageTag'] != ''
                    ? setData['requiredMessageTag'] : "");
                var messageTag = "";
                switch (elementType) {
                    case "select":
                    case "text":
                    case "textarea":
                    case "file":
                        if (!(value.length > 0)) {
                            switch (common.util.getElementInputType(element)) {
                                case "select":
                                    messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.select");
                                    return this._returnStructure(false, common.lang.get(messageTag, {'title': title}));
                                    break;
                                case "text":
                                case "textarea":
                                    messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.text");
                                    return this._returnStructure(false, common.lang.get(messageTag, {'title': title}));
                                    break;
                                case "file":
                                    messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.file");
                                    return this._returnStructure(false, common.lang.get(messageTag, {'title': title}));
                                    break;
                            }
                        }
                        break;
                    case "checkbox":
                        if (!($('input[type=checkbox][name="' + $element.attr('name') + '"]:checked').length > 0)) {
                            messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.checkbox");
                            return this._returnStructure(false, common.lang.get(messageTag, {'title': title}));
                        }
                        break;
                    case "radio":
                        if (!($('input[type=radio][name="' + $element.attr('name') + '"]:checked').length > 0)) {
                            messageTag = (requiredMessageTag != '' ? requiredMessageTag : "common.validation.required.checkbox");
                            return this._returnStructure(false, common.lang.get(messageTag, {'title': title}));
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
                if (value.length < 6 || value.length > 20) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPassword.fail"));
                }
                if (hangul != -1) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPassword.space"));
                }
                if (space != -1) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPassword.space"));
                }
                if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
                    return this._returnStructure(false, common.lang.get("common.validation.userPassword.fail"));
                }
            }
            //회원 아이디
            if (setData['dataFormat'] == 'userId') {
                var remainStr = value.replace(common.regExp.number, '').replace(common.regExp.english, '');
                if (value.length < 6 || value.length > 20) {
                    return this._returnStructure(false, common.lang.get("common.validation.userId.fail"));
                }
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
            //사업자 번호
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
                    return this._returnStructure(false, common.lang.get("common.validation.mobile.fail"));
                }
            }
            //성공
            return result;
        },
        /**
         * 유효성 결과 구조
         * @param success
         * @param message
         * @returns {{success: *, message: *}}
         */
        _returnStructure: function (success, message) {
            message = common.util.isNull(message) ? "" : message;
            return {'success': success, 'message': message};
        }
    },
    /**
     * 암호화
     */
    crypto: {
        /**
         * md5 라이브러리는 library.js 에 있음
         * @param str
         * @returns {string|*}
         */
        md5: function (str) {
            return CryptoJS.MD5(str).toString(CryptoJS.enc.Base64);
        }
    },
    /**
     * ajax
     * @param url
     * @param data
     * @param beforeCallback
     * @param successCallback
     * @param async
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
                if (typeof beforeCallback === "function") {
                    return beforeCallback(data);
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
            }
        });
    },
    /**
     * language
     */
    lang: {
        /**
         * 공통 치환 리스트 정의
         * @type {{[common.lineBreak]: string}}
         */
        _commonChangeStrList: {
            'common.lineBreak': '\n',
            '\\n': '\n'
        },
        /**
         * ENVIRONMENT 가 development 때 사용 layout.htm 에 load 된 언어를 서버쪽으로 보내기 위한 저장소
         * @type {{}}
         */
        _storage: {},
        /**
         * tag 를 키로 언어 데이터를 storage 에 저장함
         * js 파일에 먼저 명시 하여 번역 데이터 관리하기 위해 만들어짐
         * @param tag
         * @param basicStr
         * @param key
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
         * load 된 언어 정보를 가지고 오기
         * @param tag
         * @param changeStr
         * @returns {string}
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
        msg: function (tag, str, chageStr) {
            var msg = this.get(tag, chageStr);
            if (!msg) {
                this.load(tag, str);
                msg = this.get(tag, chageStr);
            }

            return msg;
        },
        /**
         * 정규식으로 replace 처리 특수문자를 처리
         * @param searchStr
         * @param replaceStr
         * @param str
         * @returns {XML|void|string}
         */
        _replace: function (searchStr, replaceStr, str) {
            var re = eval('/\\{' + searchStr + '\\}/g');
            return str.replace(re, replaceStr);
        },
        /**
         * 사용 layout.htm 에 _LANGUAGE 변수로 된 현재 사용언어 번역 데이터에서 trans_key로 가지고 오기
         * @param key
         * @returns {*}
         */
        _getTransStr: function (key) {
            // return _LANGUAGE[key];
        },
        /**
         * ENVIRONMENT 가 development 때 사용 layout.htm 맨 마지막에 load 된 데이터를 서버에 요청
         */
        jsLanguageCollection: function () {
            common.ajax(common.util.getControllerUrl('jsLanguageCollection', 'system'), {'storage': JSON.stringify(this._storage)});
        }
    },
    /**
     * 회원 인증
     */
    certify: {
        _success: null,
        /**
         * 기본 인증 실패할때
         * @param message
         */
        _fail: function (message) {
            common.noti.alert(message);
        },
        /**
         * 인증 응답
         * @param result
         * @param message
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
         * 인증 수단 요청
         * @param type
         */
        request: function (type) {
            if (type == 'certify') {
                common.util.popup('/member/cretify/request/certify', 500, 500, 'cretify');
            } else if (type == 'ipin') {
                common.util.popup('/member/cretify/request/ipin', 500, 500, 'cretify');
            }
        },
        /**
         * 인증 성공시 처리 set
         * @param successFunction
         */
        setSuccess: function (successFunction) {
            this._success = successFunction;
        },
        /**
         * 인증 실패시 처리 set
         * @param failFunction
         */
        setFail: function (failFunction) {
            this._fail = failFunction;
        }
    },
    /**
     * 페이징
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
     * ajaxList
     */
    ajaxList: function () {
        return {
            container: '',
            containerType: 'table',
            pagination: '',
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
                                var el = self.formObj.find('[name="' + item[0] + '"]');
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
            beforeCallback: function () {
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
            setController: function (methodName, controllerName, moduleName) {
                this.url = common.util.getControllerUrl(methodName, controllerName, moduleName);
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
                        $(this.pagination).html(common.pagination.getHtml(paging));
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
                        if (self.onLoading !== page || self.changeSearch) {
                            self.getPage(page);
                        }
                    });
                }

                if (typeof callback === "function") {
                    self.successCallback = callback;
                    if (typeof beforeCallback === "function") {
                        self.beforeCallback = beforeCallback;
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
                if (self.useGotoTop) {
                    self.gotoTop();
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
     * 북마크 관리
     * @type object
     */
    bookmark: {
        mid: false,
        tpl: false,
        initTpl: function () {
            if (this.tpl === false) {
                this.tpl = Handlebars.compile([
                    '<li class="favorites-box__list">',
                    '<a class="favorites__link" href="{{favorite_link}}">{{favorite_name}}</a> <a href="javascript:void(0);" class="favorites-box__delete devFavDelCls" data-fav="{{favorite_ix}}" data-deact="{{isCurrent}}">삭제</a>',
                    '</li>'
                ].join(''));
            }

            return this.tpl;
        },
        render: function (data) {
            var curLink = $('#devFavSwitch').data('link');

            if (data && data.length) {
                var item = [];
                for (var i = 0; i < data.length; i++) {
                    data[i].isCurrent = (data[i].favorite_link == curLink ? 'deAct' : '');
                    item.push((common.bookmark.tpl(data[i])));
                }
                $('#devFavDropDownMenu').empty().append(item.join(''));
            } else {
                $('#devFavDropDownMenu').empty().append([
                    '<li class="favorites-box__list">',
                    common.lang.get('common.emptyBookmark.txt'),
                    '</li>'
                ].join(''));
            }
        },
        get: function () {
            common.ajax(
                common.util.getControllerUrl('get', 'bookmark', 'pub')
                , {}, false
                , function (response) {
                    if (response.result == 'success') {
                        common.bookmark.render(response.data);
                        var current = $('#devFavSwitch').data('fav');
                        $(response.data).each(function (i) {
                            if(typeof response.data[i] != "undefined" && response.data[i].system_sub_menu_id == current){
                                $('#devFavSwitch').removeClass('page-header-fav').addClass('page-header-fav-active');
                            }else{
                                $('#devFavSwitch').removeClass('page-header-fav-active').addClass('page-header-fav');
                            }
                        });

                    } else {
                        console.log(response);
                    }
                }
            );
        },
        put: function () {
            var current = $(this).data('fav');
            var curClass = $(this).attr('class');

            common.ajax(
                common.util.getControllerUrl('put', 'bookmark', 'pub')
                , {current: current}, false
                , function (response) {
                    if (response.result == 'success') {
                        common.bookmark.render(response.data);

                        if (curClass == 'page-header-fav') {
                            $('#devFavSwitch').removeClass('page-header-fav').addClass('page-header-fav-active');
                        }else if(curClass == 'page-header-fav-active'){
                            $('#devFavSwitch').removeClass('page-header-fav-active').addClass('page-header-fav');
                        }
                    } else {
                        console.log(response);
                    }
                }
            );

            return false;
        },
        del: function () {
            var deAct = $(this).data('deact');

            common.ajax(
                common.util.getControllerUrl('del', 'bookmark', 'pub')
                , {bid: $(this).data('fav')}, false
                , function (response) {
                    if (response.result == 'success') {
                        common.bookmark.render(response.data);
                        if (deAct == 'deAct') {
                            $('#devFavSwitch').removeClass('page-header-fav-active').addClass('page-header-fav');
                        }
                    } else {
                        console.log(response);
                    }
                }
            );

            return false;
        },
        init: function () {
            // 북마크 호출
            this.get();
            // 템플릿
            this.initTpl();
            // 북마크 등록(등록 기능만)
            $('#devFavSwitch').on('click', this.put);

            // 북마크 삭제
            $('#devFavDropDownMenu').on('click', '.devFavDelCls', this.del);
        }
    },
    menuSearch: {
        word: false,
        tpl: function () {
            var tpl = false;
            if (tpl === false) {
                tpl = Handlebars.compile([
                    '<li class="menu-search__list">',
                    '<a href="{{link}}" class="menu-search__link">{{{menu_name}}}</a>',
                    '</li>'
                ].join(''));
            }

            return tpl;
        },
        render: function (data) {
            if (data && data.length) {
                var word = $('#devMenuSearchText').val();
                var item = [];

                for (var i = 0; i < data.length; i++) {
                    data[i].menu_name = data[i].menu_name.replace(word, '<span class="menu-search__point">' + word + '</span>');
                    item.push((common.menuSearch.tpl()(data[i])));
                }
                $('#devMenuSearchResult').html(item.join(''));
            }
        },
        search: function () {
            var search = $('#devMenuSearchText').val();

            if (this.word != search) {
                this.word = search;

                common.ajax(
                    common.util.getControllerUrl('get', 'searchMenu', 'pub')
                    , {search: search}, false
                    , function (response) {
                        if (response.result == 'success') {
                            if(response.data != ''){
                                common.menuSearch.render(response.data);
                            }else{
                                var msg = '검색 결과가 없습니다.';
                                var html = '<li class="menu-search__list">+msg+</li>';
                                $('#devMenuSearchResult').html(msg);
                            }
                        } else if (response.result == 'emptySeach') {
                            common.noti.alert(common.lang.get('menuSeachEmpt'));
                        } else {
                            console.log(response);
                        }
                    }
                );
            }
        },
        init: function () {
            common.lang.load('menuSeachEmpt', "검색어를 입력해 주세요.");
            $('#devMenuSearchBtn').on('click', this.search);

            $('#devMenuSearchText').on('keydown', function (key) {
                if (key.keyCode == 13) {
                    common.menuSearch.search();
                }
            });
        }
    },
    /**
     * UI
     */
    ui: {
        relData: {
            map: []
            , idx: 0
        },
        tap: function ($target, changeFunction) {
            var selectors = [];
            $target.find('a').each(function () {
                selectors.push($(this).attr('href'));
            });
            var _selector = '';
            $target.find('a').each(function () {
                $(this).click(function (e) {
                    e.preventDefault();
                    var selector = $(this).attr('href');

                    $target.find('.fb__tap__menu--active').removeClass('fb__tap__menu--active');
                    $(this).addClass('fb__tap__menu--active');
                    $(selectors.join(',')).hide();
                    $(selector).show();

                    // 함수가 선언된 경우 실행
                    if (typeof changeFunction == 'function') {
                        if (_selector != selector) {
                            _selector = selector;
                            changeFunction(selector);
                        }
                    }
                });
            });
        },
        datePicker: function ($target, option) {
            $.datetimepicker.setLocale('kr');
            if (!option) {
                option = {};
            }

            $target.datetimepicker({
                mask: false,
                timepicker: (option.timepicker == true ? true : false),
                format: (option.timepicker == true ? 'Y-m-d H:i:' + (option.startTartget ? '59' : '00') : 'Y-m-d'),
                inline: (option.inline == true ? true : false),
                //step: 30,
                defaultTime: (option.startTartget ? '23:59' : '00:00'),
                minTime: (option.startTartget ? '00:59' : '00:00'),
                maxTime: (option.startTartget ? '23:59' : '23:00'),
                allowTimes: (option.startTartget ? [
                    '00:59', '01:59', '02:59', '03:59', '04:59', '05:59', '06:59', '07:59', '08:59', '09:59', '10:59', '11:59',
                    '12:59', '13:59', '14:59', '15:59', '16:59', '17:59', '18:59', '19:59', '20:59', '21:59', '22:59', '23:59'
                ] : [])
                , onShow: function (ct) {
                    if (option.startTartget || option.endTartget) {
                        var opionObj = {};
                        if (option.startTartget) {
                            opionObj = {minDate: option.startTartget.val() ? option.startTartget.val() : false};
                        } else {
                            opionObj = {maxDate: option.endTartget.val() ? option.endTartget.val() : false};
                        }

                        this.setOptions(opionObj);
                    }
                }
            });
        },
        quickDate: function (mode, $target, option) {
            if (!option) {
                option = {};
            }

            var $today = $('<li><a href="#">' + (mode == '-' ? '오늘' : '1일') + '</a></li>');
            var $week = $('<li><a href="#" >1주</a></li>');
            var $day15 = $('<li><a href="#">15일</a></li>');
            var $month = $('<li><a href="#">1개월</a></li>');
            var $month3 = $('<li><a href="#">3개월</a></li>');
            var $month6 = $('<li><a href="#">6개월</a></li>');

            var today = new Date();
            var week = new Date().setDate(today.getDate() + (7 * (mode == '-' ? -1 : 1)));
            var day15 = new Date().setDate(today.getDate() + (15 * (mode == '-' ? -1 : 1)));
            var month = new Date().setMonth(today.getMonth() + (1 * (mode == '-' ? -1 : 1)));
            var month3 = new Date().setMonth(today.getMonth() + (3 * (mode == '-' ? -1 : 1)));
            var month6 = new Date().setMonth(today.getMonth() + (6 * (mode == '-' ? -1 : 1)));

            //util 쪽에 https://stove99.tistory.com/46 고민 필요
            var dateFormat = function (date) {
                //타임으로 변환되어 넘어와서 newData로 다시 처리
                date = new Date(date);
                var yyyy = date.getFullYear();
                var mm = date.getMonth() + 1;
                var dd = date.getDate();
                if (mm.toString().length == 1) {
                    mm = '0' + mm;
                }

                if (dd.toString().length == 1) {
                    dd = '0' + dd;
                }
                return yyyy + '-' + mm + '-' + dd;
            }

            var clickEvent = function (targetObj) {
                $(targetObj).closest('.fb-filter__day').find('a.fb-filter__day--active').removeClass('fb-filter__day--active');
                $(targetObj).find('a').addClass('fb-filter__day--active');
            }

            var todayStr = dateFormat(today);
            var day15Str = dateFormat(day15);
            var weekStr = dateFormat(week);
            var monthStr = dateFormat(month);
            var month3Str = dateFormat(month3);
            var month6Str = dateFormat(month6);
            if (option.dateTarget || (option.startTartget && option.endTartget)) {
                if (option.dateTarget) {
                    var timeStr = '';
                    if (option.timepicker) {
                        timeStr = option.dateTarget.val().split(' ')[1];
                        if (timeStr) {
                            timeStr = ' ' + timeStr;
                        } else {
                            timeStr = ' 00:00:00';
                        }
                    }
                    $today.on('click', function () {
                        option.dateTarget.val(todayStr + timeStr);
                        clickEvent(this);
                        return false;
                    });
                    $week.on('click', function () {
                        option.dateTarget.val(weekStr + timeStr);
                        clickEvent(this);
                        return false;
                    });
                    $day15.on('click', function () {
                        option.dateTarget.val(day15Str + timeStr);
                        clickEvent(this);
                        return false;
                    });
                    $month.on('click', function () {
                        option.dateTarget.val(monthStr + timeStr);
                        clickEvent(this);
                        return false;
                    });
                    $month3.on('click', function () {
                        option.dateTarget.val(month3Str + timeStr);
                        clickEvent(this);
                        return false;
                    });
                    $month6.on('click', function () {
                        option.dateTarget.val(month6Str + timeStr);
                        clickEvent(this);
                        return false;
                    });
                } else {
                    var startTimeStr = '';
                    var endTimeStr = '';
                    if (option.timepicker) {
                        startTimeStr = option.startTartget.val().split(' ')[1];
                        endTimeStr = option.endTartget.val().split(' ')[1];
                        if (startTimeStr) {
                            startTimeStr = ' ' + startTimeStr;
                        } else {
                            startTimeStr = ' 00:00:00';
                        }
                        if (endTimeStr) {
                            endTimeStr = ' ' + endTimeStr;
                        } else {
                            endTimeStr = ' 23:59:59';
                        }
                    }
                    if (mode == '-') {
                        $today.on('click', function () {
                            option.startTartget.val(todayStr + startTimeStr);
                            option.endTartget.val(todayStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $week.on('click', function () {
                            option.startTartget.val(weekStr + startTimeStr);
                            option.endTartget.val(todayStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $day15.on('click', function () {
                            option.startTartget.val(day15Str + startTimeStr);
                            option.endTartget.val(todayStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $month.on('click', function () {
                            option.startTartget.val(monthStr + startTimeStr);
                            option.endTartget.val(todayStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $month3.on('click', function () {
                            option.startTartget.val(month3Str + startTimeStr);
                            option.endTartget.val(todayStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $month6.on('click', function () {
                            option.startTartget.val(month6Str + startTimeStr);
                            option.endTartget.val(todayStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                    } else {
                        $today.on('click', function () {
                            option.startTartget.val(todayStr + startTimeStr);
                            option.endTartget.val(todayStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $week.on('click', function () {
                            option.startTartget.val(todayStr + startTimeStr);
                            option.endTartget.val(weekStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $day15.on('click', function () {
                            option.startTartget.val(todayStr + startTimeStr);
                            option.endTartget.val(day15Str + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $month.on('click', function () {
                            option.startTartget.val(todayStr + startTimeStr);
                            option.endTartget.val(monthStr + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $month3.on('click', function () {
                            option.startTartget.val(todayStr + startTimeStr);
                            option.endTartget.val(month3Str + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                        $month6.on('click', function () {
                            option.startTartget.val(todayStr + startTimeStr);
                            option.endTartget.val(month6Str + endTimeStr);
                            clickEvent(this);
                            return false;
                        });
                    }
                }
            } else {
                console.error('no option.dateTarget');
                return;
            }

            $('<ul class="fb-filter__day"></ul>').appendTo($target)
                .append($today)
                .append($week)
                .append($day15)
                .append($month)
                .append($month3)
                .append($month6);
        },
        editor: function ($target) {
            return {
                instance: false
                , height: '300px'
                , uploadUrl: '/system/upload/putCkUpload'
                , subType: false
                , toolbar: true
                , init: function () {
                    var self = this;
                    if ($target) {
                        if (self.instance === false) {
                            //CKEDITOR 설정은 application/www/assets/js/web/ckeditor/config.js 에서 수정 (아이프레임 허용설정등..)
                            self.instance = CKEDITOR.replace($target, {
                                height: this.height
                                , filebrowserImageUploadUrl: this.uploadUrl
                            });
                            self.instance.on('fileUploadRequest', function (evt) {
                                evt.data.requestData[forbizCsrf.name] = common.util.getCookie('ForbizCsrfCookieName');
                                evt.data.requestData.fldName = 'upload';
                                evt.data.requestData.subType = (self.subType ? self.subType : '');
                            });
                            self.instance.on('change', function (evt) {
                                self.instance.updateElement();
                            });

                            if (self.toolbar === false) {
                                self.instance.on('instanceReady', function (evt) {
                                    $('#' + evt.editor.id + '_top').hide()
                                });
                            }
                        }

                        return this;
                    } else {
                        console.log('Invalid editor target');
                    }
                }
                , setUploadUrl: function (uploadUrl) {
                    this.uploadUrl = uploadUrl;
                    return this;
                }
                , setSubType: function (subType) {
                    this.subType = subType;
                    return this;
                }
                , setHeight: function (height) {
                    this.height = height;
                    return this;
                }
                , getData: function () {
                    return this.instance.getData();
                }
                , setData: function (data) {
                    this.instance.setData(data);
                    return this;
                }
                , addData: function (data) {
                    this.setData(this.getData() + data);
                    return this;
                }
                , hideToolbar: function () {
                    this.toolbar = false;
                    return this;
                }
            }
        },
        grid: function () {
            return {
                gridObj: '',
                formObj: '',
                focusRow: false,
                eventFunc: {
                    click: false
                    , change: false
                    , dblClick: false
                    , rowMoveUp: false
                    , rowMoveDown: false
                    , swapRow: false
                    , pageClick: false
                },
                readOnly: true,
                paginationObj: '',
                pageNumObj: $('#devPage'),
                useHash: true,
                onLoading: false,
                isFirstLoad: true,
                selectIndex: false,
                _swapRow: function (orgIdx, newIdx) {
                    var data = this.gridObj.getList();
                    data[newIdx].__index = orgIdx;
                    data[orgIdx].__index = newIdx;
                    this.gridObj.updateRow(data[newIdx], orgIdx);
                    this.gridObj.updateRow(data[orgIdx], newIdx);
                    this.focusRow.rowIdx = newIdx;
                    this.gridObj.repaint();
                    this.gridObj.focus(newIdx);
                    var swapData = {
                        current: data[orgIdx]
                        , target: data[newIdx]
                    };
                    if ($.isFunction(this.eventFunc.swapRow)) {
                        this.eventFunc.swapRow(swapData);
                    }

                    return swapData;
                },
                on: function (eventName, f) {
                    this.eventFunc[eventName] = f;
                    return this;
                },
                select: function (idx, selected) {
                    if (idx) {
                        idx = (ax5.util.isNumber(idx) ? idx : parseInt(idx));
                        if (selected === true || selected === false) {
                            this.gridObj.select(idx, {selected: selected});
                        } else {
                            this.gridObj.select(idx);
                        }
                    }

                    return this;
                },
                getSelected: function (column) {
                    return this.getList('selected', column);
                },
                setFirstLoad: function(isFirstLoad) {
                    this.isFirstLoad = isFirstLoad;
                    return this;
                },
                setGrid: function ($target, option) {
                    var self = this;
                    if (!option.columns) {
                        option.columns = {};
                    }
                    if (!option.header) {
                        option.header = {};
                    }
                    if (!option.header.align) {
                        option.header.align = "center";
                    }
                    if (!option.header.columnHeight) {
                        option.header.columnHeight = 55;
                    }
                    if (!option.body) {
                        option.body = {};
                    }
                    if (!option.body.columnHeight) {
                        option.body.columnHeight = 36;
                    }

                    option.target = $target;
                    option.page = {
                        display: false
                    };

                    $target.attr("data-ax5grid", "");
                    if (option.height) {
                        $target.css("height", option.height);
                    } else {
                        $target.css("height", 400);
                    }

                    // 이벤트 처리
                    option.body.onClick = function () {
                        self.focusRow = {
                            rowIdx: this.dindex
                            , column: this.column
                            , item: this.item
                            , value: this.value
                        };
                        self.selectIndex = this.dindex;
                        if (self.readOnly) {
                            self.gridObj.repaint();
                            self.gridObj.focus(this.dindex);
                        }

                        if ($.isFunction(self.eventFunc.click)) {
                            self.eventFunc.click(self.focusRow);
                        }
                    };
                    option.body.onDBLClick = function () {
                        if ($.isFunction(self.eventFunc.dblClick)) {
                            self.eventFunc.dblClick(self.focusRow);
                        }
                    };
                    option.body.onDataChanged = function () {
                        self.focusRow = {
                            rowIdx: this.dindex
                            , column: this.column
                            , item: this.item
                            , value: this.value
                        };
                        self.selectIndex = this.dindex;
                        if ($.isFunction(self.eventFunc.change)) {
                            self.eventFunc.change(this);
                        }
                    };

                    this.gridObj = new ax5.ui.grid(option);
                    return this;
                },
                setForm: function (formObj) {
                    this.formObj = $(formObj);
                    return this;
                },
                setPagination: function (pagination) {
                    this.paginationObj = $(pagination);
                    return this;
                },
                setPageNum: function (pageNum) {
                    this.pageNumObj = $(pageNum);
                    return this;
                },
                setUseHash: function (useHash) {
                    if (useHash === true) {
                        this.useHash = true;
                    } else {
                        this.useHash = false;
                    }
                    return this;
                },
                setReadOnly: function (readOnly) {
                    this.readOnly = readOnly;

                    return this;
                },
                setUrl: function (url) {
                    this.url = url;
                    return this;
                },
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
                                    var el = self.formObj.find('[name="' + item[0] + '"]');
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
                            if (self.onLoading !== page || self.changeSearch) {
                                self.getPage(page);
                            }
                        });
                    }

                    if (typeof callback === "function") {
                        self.successCallback = callback;
                        if (typeof beforeCallback === "function") {
                            self.beforeCallback = beforeCallback;
                        }

                        common.form.init(self.formObj, self.url, self.beforeCallback, self.successCallback);
                        if (self.paginationObj) {
                            self.paginationObj.on('click', '.devPageBtnCls', function () {
                                var clickPage = $(this).data('page');
                                if ($.isFunction(self.eventFunc.pageClick)) {
                                    self.eventFunc.pageClick(self, clickPage);
                                } else {
                                    self.getPage(clickPage);
                                }
                            });
                        }

                        //세팅시 요소 추가 css 에서 노출/비노출 처리
                        if(self.isFirstLoad){
                            self.getPage(page);
                        }
                    } else {
                        alert('Not define callback');
                    }
                },
                empty: function () {
                },
                setContent: function (list, paging) {
                    var self = this;
                    if (list && list.length > 0) {
                        this.gridObj.setData(list);
                        self.hideEmpty();
                        if (paging && this.paginationObj) {
                            this.paginationObj.html(common.pagination.getHtml(paging));
                        }
                    } else {
                        this.gridObj.setData([]);
                        if (this.paginationObj) {
                            this.paginationObj.html('');
                        }
                        self.showEmpty();
                    }
                    return this;
                },
                showLoading: function () {
                    this.empty();
                    return this;
                },
                showEmpty: function () {
                    this.gridObj.$target.find("[data-ax5grid-container='body']").append('<div class="data-ax5grid-empty-container"></div>');
                    return this;
                },
                hideEmpty: function () {
                    this.gridObj.$target.find("[data-ax5grid-container='body'] .data-ax5grid-empty-container").remove();
                    return this;
                },
                getPage: function (page) {
                    var self = this;
                    if (self.useGotoTop) {
                        self.gotoTop();
                    }

                    self.showLoading();
                    self.pageNumObj.val(page);
                    self.formObj.submit();
                    self.onLoading = page;
                    if (self.useHash) {
                        window.location.hash = self.getHash(page);
                    }
                },
                reload: function () {
                    this.getPage(this.onLoading);
                },
                rowMoveUp: function () {
                    var gData = this.gridObj.getList();
                    var cRowIdx = this.focusRow.rowIdx;
                    var nRowIdx = (cRowIdx > 0 ? cRowIdx - 1 : 0);
                    if (cRowIdx > nRowIdx) {
                        var swapData = this._swapRow(cRowIdx, nRowIdx);
                        if ($.isFunction(this.eventFunc.rowMoveUp)) {
                            this.eventFunc.rowMoveUp(swapData);
                        }
                        this.selectIndex = nRowIdx;
                    }
                },
                rowMoveDown: function () {
                    var maxIdx = this.gridObj.getList().length - 1;
                    var cRowIdx = this.focusRow.rowIdx;
                    var nRowIdx = (cRowIdx < maxIdx ? cRowIdx + 1 : maxIdx);
                    if (cRowIdx < nRowIdx) {
                        var swapData = this._swapRow(cRowIdx, nRowIdx);
                        if ($.isFunction(this.eventFunc.rowMoveDown)) {
                            this.eventFunc.rowMoveDown(swapData);
                        }
                        this.selectIndex = nRowIdx;
                    }
                },
                moveRow: function (idx) {
                    if (this.focusRow.rowIdx >= 0) {
                        var gData = this.gridObj.getList();
                        var maxIdx = gData.length;
                        var newIdx = parseInt(idx) - 1;
                        var old_position = this.focusRow.rowIdx;
                        var data = [];
                        if(newIdx >= maxIdx){
                            alert("이동하려는 위치가 없습니다. 다시 확인해주세요.");
                            return false;
                        }
                        if (newIdx >= 0 && newIdx <= maxIdx && newIdx != this.focusRow.rowIdx) {
                            if (newIdx > this.focusRow.rowIdx) {
                                for (var i = this.focusRow.rowIdx; i < newIdx; i++) {
                                    var tData = gData[i + 1];
                                    tData.__index--;
                                    this.gridObj.updateRow(tData, i);
                                    data.push(tData);
                                }
                                this.focusRow.rowIdx = gData[newIdx].__index + 1;
                                this.focusRow.item.__index = this.focusRow.rowIdx;
                                this.gridObj.updateRow(this.focusRow.item, newIdx);
                                data.push(this.focusRow.item);
                            } else if (newIdx < this.focusRow.rowIdx) {
                                for (var i = this.focusRow.rowIdx; i > newIdx; i--) {
                                    var tData = gData[i - 1];
                                    tData.__index++;
                                    this.gridObj.updateRow(tData, i);
                                    data.push(tData);
                                }
                                this.focusRow.rowIdx = gData[newIdx].__index - 1;
                                this.focusRow.item.__index = this.focusRow.rowIdx;
                                this.gridObj.updateRow(this.focusRow.item, newIdx);
                                data.push(this.focusRow.item);
                                data.reverse();
                            }

                            this.gridObj.repaint();
                            this.gridObj.focus(newIdx);
                        }
                    }

                    return {
                        position: newIdx
                        , old_position: old_position
                        , data: data
                    };
                },
                excelDown: function (url, addData) {
                    return this.downLoad(url, addData);
                },
                downLoad: function (url, addData) {
                    var $form = $('<form></form>');
                    $form.attr({action: url, method: 'post'});

                    $.each(this.formObj.serializeArray(), function () {
                        $form.append($('<input>').attr({
                            type: 'hidden',
                            name: this.name,
                            value: this.value
                        }));
                    });

                    if ($.isPlainObject(addData)) {
                        $.each(addData, function (name, value) {
                            $form.append($('<input>').attr({
                                type: 'hidden',
                                name: name,
                                value: value
                            }));
                        });
                    }

                    $form.append($('<input>').attr({
                        type: 'hidden',
                        name: forbizCsrf.name,
                        value: common.util.getCookie('ForbizCsrfCookieName')
                    }));

                    $('body').append($form);
                    $form.submit();
                    $form.remove();
                },
                getList: function (mode, column, useIndex) {
                    var selData = this.gridObj.getList(mode);
                    var data = [];

                    if (selData.length > 0) {
                        if (column) {
                            column = $.isArray(column) ? column : [column];
                            for (var i = 0; i < selData.length; i++) {
                                if (column.length > 1) {
                                    var dt = {};
                                    for (var c = 0; c < column.length; c++) {
                                        dt[column[c]] = selData[i][column[c]];
                                    }
                                    data.push(dt);
                                } else {
                                    data.push(selData[i][column[0]]);
                                }
                            }
                        } else {
                            for (var i = 0; i < selData.length; i++) {
                                if (useIndex !== true) {
                                    delete selData[i]['__original_index'];
                                    delete selData[i]['__index'];
                                    delete selData[i]['__selected__'];
                                }

                                data.push(selData[i]);
                            }
                        }
                    }

                    return data;
                },
                getRow: function (idx) {
                    return this.getList()[idx];
                },
                addContent: function (data) {
                    this.gridObj.$target.find("[data-ax5grid-container='body'] .data-ax5grid-empty-container").remove();
                    this.gridObj.appendToList(data);
                },
                addRow: function (data) {
                    this.gridObj.addRow($.extend({}, data, {__index: undefined}));
                    this.hideEmpty();
                },
                deleteRow: function (mode) {
                    //first, last, selected, 1 (index)
                    this.gridObj.deleteRow(mode);
                },
                updateRow: function (idx, data) {
                    this.gridObj.updateRow(data, idx);
                },
                resize: function () {
                    this.gridObj.align();
                },
                focus: function (index) {
                    this.gridObj.focus(index);
                },
                addColumn: function (column, index) {
                    this.gridObj.addColumn(column, index);
                },
                removeColumn: function (index) {
                    this.gridObj.removeColumn(index);
                    return this;
                },
                updateColumn: function (date, index) {
                    this.gridObj.updateColumn(date, index);
                    return this;
                },
                setValue: function (index, key, value) {
                    this.gridObj.setValue(index, key, value);
                },
                repaint: function () {
                    this.gridObj.repaint();
                }
            }
        },
        simpleGrid: function (target) {
            return {
                instance: false
                , $form: false
                , config: {
                    columns: false
                    , showLineNumber: true
                    , header: {align: "center"}
                    , body: {
                        onClick: false
                        , onDBLClick: false
                        , onDataChanged: false
                    }
                    , page: {display: false}
                    , target: false
                }
                , columns: false
                , height: 300
                , focusRow: false
                , readOnly: true
                , eventFunc: {
                    click: false
                    , change: false
                    , rowMoveUp: false
                    , rowMoveDown: false
                    , swapRow: false
                    , beforeSubmit: false
                    , afterSubmit: false
                }
                , gridData: false
                , on: function (eventName, f) {
                    this.eventFunc[eventName] = f;
                    return this;
                }
                , setHeight: function (height) {
                    this.height = height;
                    return this;
                }
                , setConfig: function (option) {
                    this.config = $.extends(true, this.config, option);
                    return this;
                }
                , setColumns: function (columns) {
                    this.columns = columns;
                    return this;
                }
                , setData: function (data) {

                    if (data.length && data.length > 0) {
                        $('#devGridMsgBox').hide();
                        if (this.instance) {
                            this.instance.setData(data);
                        } else {
                            this.gridData = data;
                        }
                    } else {
                        $('#devGridMsgBox').show();
                    }

                    return this;
                }
                , _swapRow: function (orgIdx, newIdx) {
                    var data = this.instance.getList();
                    data[newIdx].__index = orgIdx;
                    data[orgIdx].__index = newIdx;
                    this.instance.updateRow(data[newIdx], orgIdx);
                    this.instance.updateRow(data[orgIdx], newIdx);
                    this.focusRow.rowIdx = newIdx;
                    this.instance.repaint();
                    this.instance.focus(newIdx);
                    var swapData = {
                        current: data[orgIdx]
                        , target: data[newIdx]
                    };
                    if ($.isFunction(this.eventFunc.swapRow)) {
                        this.eventFunc.swapRow(swapData);
                    }

                    return swapData;
                }
                , setReadOnly: function (readOnly) {
                    this.readOnly = (readOnly ? true : false)

                    return this;
                }
                , rowMoveUp: function () {
                    var self = this;
                    var gData = self.instance.getList();
                    var cRowIdx = self.focusRow.rowIdx;
                    var nRowIdx = (cRowIdx > 0 ? cRowIdx - 1 : 0);
                    if (cRowIdx > nRowIdx) {
                        var swapData = self._swapRow(cRowIdx, nRowIdx);
                        if ($.isFunction(self.eventFunc.rowMoveUp)) {
                            self.eventFunc.rowMoveUp(swapData);
                        }
                    }
                }
                , rowMoveDown: function () {
                    var self = this;
                    var maxIdx = self.instance.getList().length - 1;
                    var cRowIdx = self.focusRow.rowIdx;
                    var nRowIdx = (cRowIdx < maxIdx ? cRowIdx + 1 : maxIdx);
                    if (cRowIdx < nRowIdx) {
                        var swapData = self._swapRow(cRowIdx, nRowIdx);
                        if ($.isFunction(self.eventFunc.rowMoveDown)) {
                            self.eventFunc.rowMoveDown(swapData);
                        }
                    }
                }
                , moveRow: function (idx) {
                    if (this.focusRow.rowIdx) {
                        var maxIdx = this.instance.getList().length;
                        var newIdx = parseInt(idx) - 1;
                        if (newIdx >= 0 && newIdx <= maxIdx && newIdx != this.focusRow.rowIdx) {
                            this._swapRow(this.focusRow.rowIdx, newIdx);
                        }
                    }

                    return this;
                }
                , init: function () {
                    var self = this;
                    if (target) {
                        // 그리드 객체
                        self.instance = new ax5.ui.grid();
                        $(target).css('height', self.height).attr('data-ax5grid', '');
                        // 타겟 지정
                        self.config.target = $(target);
                        // 컬럼 설정
                        self.config.columns = self.columns;
                        // 클릭 이벤트
                        self.config.body.onClick = function () {
                            self.focusRow = {
                                rowIdx: this.dindex
                                , column: this.column
                                , item: this.item
                                , value: this.value
                            };
                            if (self.readOnly) {
                                self.instance.repaint();
                                self.instance.focus(this.dindex);
                            }

                            if ($.isFunction(self.eventFunc.click)) {
                                self.eventFunc.click(self.focusRow);
                            }
                        };
                        // 데이타 변경 이벤트
                        self.config.body.onDataChanged = function () {
                            if ($.isFunction(self.eventFunc.change)) {
                                self.eventFunc.change(this);
                            }
                        };
                        // 그리드 설정 변경
                        self.instance.setConfig(self.config);
                        if (self.gridData) {
                            self.instance.setData(self.gridData);
                        }

                        return self;
                    } else {
                        colsone.log('Grid target invalid');
                    }
                }
            }
        },
        sortable: function () {
            return {
                instance: null
                , init: function ($target) {
                    this.instance = Sortable.create($target.get(0));
                }
                , add: function (html) {
                    $(this.instance.el).append(html);
                }
            }
        },
        cascading: function (target, joinTarget, joinGroup) {
            var relData = this.relData.map;
            if(typeof joinGroup === 'undefined'){
                joinGroup = 'default';
            }

            relData.push({
                joinTarget: joinTarget,
                group: joinGroup
            });
            return {
                joinTarget: false
                , group: joinGroup
                , ajaxUrl: false
                , redIdx: this.relData.idx++
                , selData: false
                , allReset: true
                , optColumn: {
                    cascading: 'cascading'
                    , value: 'val'
                    , text: 'text'
                }
                , optTpl: false
                , eventFunc: {
                    change: false
                }
                , on: function (eventName, f) {
                    if ($.isFunction(f)) {
                        this.eventFunc[eventName] = f;
                    }

                    return this;
                }
                , setOptColumn: function (optColumn) {
                    this.optColumn.value = (optColumn.value ? optColumn.value : this.column.value);
                    this.optColumn.text = (optColumn.text ? optColumn.text : this.column.text);
                    this.optColumn.cascading = (optColumn.cascading ? optColumn.cascading : this.column.cascading);
                    return this;
                }
                , setOptTpl: function (optTpl) {
                    this.optTpl = optTpl;

                    return this;
                }
                , setUrl: function (url) {
                    this.ajaxUrl = url;
                    return this;
                }
                , setOption: function (e) {
                    if ($.isPlainObject(e.data)) {
                        var self = e.data;
                        var isCascading = $(this).children("option:selected").data(self.optColumn.cascading);
                        var value = $(this).val();
                        if ($.isArray(value)) {
                            value = value[0];
                        }
                        self.selData = value;
                        self.reset();
                        if (self.joinTarget && isCascading && self.ajaxUrl) {
                            common.ajax(
                                self.ajaxUrl,
                                {selData: value},
                                false,
                                function (response) {
                                    if (response.result == 'success') {
                                        var optTpl = Handlebars.compile(self.optTpl);
                                        for (var sIdx in response.data) {
                                            $(self.joinTarget).append(optTpl(response.data[sIdx]));
                                        }
                                    } else {
                                        console.log(response);
                                    }
                                }
                            );
                        }

                        if ($.isFunction(self.eventFunc.change)) {
                            self.eventFunc.change(this);
                        }
                    }
                    return this;
                }
                , setAllReset: function (allReset) {
                    this.allReset = allReset;
                    return this;
                }
                , reset: function () {
                    for (var idx = this.redIdx; idx < relData.length; idx++) {
                        if (relData[idx]) {
                            if (this.allReset) {
                                if(this.group == relData[idx].group) {
                                    $(relData[idx].joinTarget).empty();
                                }
                            } else {
                                if(this.group == relData[idx].group) {
                                    $(relData[idx].joinTarget).find('option:not(:eq(0))').remove();
                                }
                            }
                        }
                    }

                    return this;
                }
                , init: function () {
                    if (!this.optTpl) {
                        this.optTpl =
                            '<option value="{{' + this.optColumn.value + '}}" data-' + this.optColumn.cascading + '="{{' + this.optColumn.cascading + '}}">{{' + this.optColumn.text + '}}</option>';
                    }

                    $(target).on('change', this, this.setOption);
                    if (joinTarget) {
                        this.joinTarget = joinTarget;
                    }

                    return this;
                }
            };
        },
        tree: function (target) {
            return {
                instance: false
                , data: false
                , ajaxUrl: false
                , selectedNode: false
                , moveNode: false
                , nodeId: 'id'
                , nodeText: 'text'
                , eventFunc: {
                    select: false
                    , move: false
                }
                , on: function (eventName, f) {
                    if (eventName && $.isFunction(f)) {
                        this.eventFunc[eventName] = f;
                    }

                    return this;
                }
                , setData: function (data) {
                    this.data = data;
                    return this;
                }
                , setNodeId: function (nodeId) {
                    this.nodeId = nodeId;
                    return this;
                }
                , setNodeText: function (nodeText) {
                    this.nodeText = nodeText;
                    return this;
                }
                , setUrl: function (url) {
                    this.ajaxUrl = url;
                    return this;
                }
                , setText: function (text) {
                    if (text && this.selectedNode) {
                        this.instance.set_text(this.selectedNode.id, text);
                    }

                    return this;
                }
                , append: function (id, text, sort, type) {
                    var ret = false;
                    if (id && text) {
                        if (type == 'root') {
                            ret = this.instance.create_node('#', {id: id, text: text,children: true}, sort);
                        } else {
                            if (this.selectedNode.id) {
                                ret = this.instance.create_node(this.selectedNode.id, {id: id, text: text,children: true}, sort);
                                this.instance.open_node(this.selectedNode.id);
                            }
                        }
                    }

                    return ret;
                }
                , remove: function () {
                    var ret = false;
                    if (this.selectedNode.id) {
                        if (this.instance.is_loaded(this.selectedNode.id)) {
                            var node = this.instance.get_node(this.selectedNode.id);
                            if (node.children.length === 0) {
                                //ret = this.instance.delete_node(this.selectedNode.id); //removeDone: function() 생성
                                ret = true;
                            } else {
                                common.noti.alert(common.lang.msg('common.grid.existsChildNode', '하위 노드가 존재합니다.'));
                            }
                        } else {
                            this.instance.open_node(this.selectedNode.id);
                        }
                    }

                    return ret;
                }
                , removeDone: function () {
                    this.instance.delete_node(this.selectedNode.id);
                }
                , reload: function() {
                    this.instance.refresh();
                }
                , getSelectNode: function () {
                    return this.selectedNode;
                }
                , getMoveNode: function () {
                    return this.moveNode;
                }
                , init: function () {
                    var self = this;
                    if (target) {
                        if (self.instance === false) {
                            var nodeData = false;
                            if (self.ajaxUrl !== false) {
                                nodeData = {
                                    'url': function (node) {
                                        return self.ajaxUrl;
                                    },
                                    'data': function (node) {
                                        var params = {};
                                        params[self.nodeId] = node.id;
                                        return params;
                                    },
                                    'success': function (data) {
                                        for (var i in data) {
                                            data[i].id = data[i][self.nodeId];
                                            data[i].text = data[i][self.nodeText];
                                        }

                                        return data;
                                    }
                                };
                            } else {
                                nodeData = self.data;
                            }

                            $(target).on('select_node.jstree', function (e, data) {
                                self.selectedNode = data.node;
                                if ($.isFunction(self.eventFunc.select)) {
                                    self.eventFunc.select(data.node, data.selected);
                                }
                            }).on('move_node.jstree', function (e, data) {
                                self.moveNode = {
                                    id: data.node.id
                                    , text: data.node.text
                                    , position: data.position
                                    , old_position: data.old_position
                                    , rank_data: self.instance.get_node(data.parent).children
                                }
                                if ($.isFunction(self.eventFunc.move)) {
                                    self.eventFunc.move(self.moveNode);
                                }
                            }).jstree({
                                'core': {
                                    'data': nodeData,
                                    'force_text': true,
                                    'check_callback': function (operation, node, node_parent, node_position, more) {
                                        if (operation === "move_node") {
                                            return node.parent === node_parent.id;
                                        }

                                        return true;
                                    },
                                    'themes': {
                                        'responsive': false
                                    }

                                },
                                "dnd": {
                                    check_while_dragging: true
                                },
                                'plugins': ['dnd', 'unique']
                            });
                            self.instance = $(target).jstree(true);
                        }

                        return self;
                    } else {
                        console.log('Invalid tree target');
                    }
                }
            }
        },
        upload: function (target) {
            return {
                filSeq: 1,
                target: false,
                colName: 'userfile',
                init: function (colName) {
                    if (this.target === false) {
                        this.target = $(target);

                        if (colName) {
                            this.colName = colName;
                        }

                        this.target.append([
                            '<div class="fb__file">',
                            '   <ul class="fb__file__box">',
                            '   </ul>',
                            '</div>'
                        ].join(''));
                    }

                    return this;
                },
                setTarget: function (target) {
                    this.target = $(target);
                    return this;
                },
                setColName: function (colName) {
                    this.colName = colName;
                    return this;
                },
                addFileBox: function (colName) {
                    if (this.target === false) {
                        this.init(colName).addFileBox(colName);
                    } else {
                        colName = (colName ? colName : (this.colName + this.filSeq++));
                        this.target.find('.fb__file__box').append(this.imageForm(colName));
                    }

                    return this;
                },
                putFileBox: function (colName, imgSrc, title='') {
                    var self = this;
                    const img = new Image();
                    var num = self.filSeq++;

                    self.putFileLoader(colName, imgSrc,num, title);

                    img.onerror = function() {
                        var img;
                        var uploadStatus = 'none';
                        img = '/assets/img/common/icon_plus.gif';

                        var target = self.target.find('.fb__file__box');
                        $(target).find('.devFileNum'+num).find('img').attr('src',img);
                        $(target).find('.devFileNum'+num).find('.fb__file__input').removeClass('fb__file__input--submit');
                        $(target).find('.devFileNum'+num).find('file').attr('data-status',uploadStatus);
                    }
                    img.src = imgSrc;
                    return this;
                },
                putFileLoader: function(colName, imgSrc,num, title) {
                    if (this.target === false) {
                        this.init(colName).addFileBox(colName);
                    } else {
                        colName = (colName ? colName : (this.colName + this.filSeq++));
                        this.target.find('.fb__file__box').append(this.imageForm(colName, imgSrc,num, title));
                    }

                    return this;
                },
                imageForm: function (colName, imgSrc,num, title) {
                    var img;
                    var uploadCls = '';
                    var uploadStatus = 'none';

                    // 수정 여부 확인
                    if (imgSrc) {
                        img = imgSrc;
                        uploadCls = ' fb__file__input--submit';
                        uploadStatus = 'upload';
                    } else {
                        img = '/assets/img/common/icon_plus.gif';
                        imgSrc = '';
                    }

                    return [
                        '<li class="fb__file__list devFileNum'+num+'">',
                        '    <div class="fb__file__inner">',
                        '        <div class="fb__file__view">',
                        '            <figure>',
                        '                <img src="' + img + '" alt="Trulli">',
                        '            </figure>',
                        '        </div>',
                        '        <div class="fb__file__input' + uploadCls + '">',
                        '            <span class="fb__file__input_btn">',
                        '                업로드',
                        '                <input type="file" class="fb__file__input--file" accept="image/*" name="' + colName + '" data-status="' + uploadStatus + '" data-img-src="' + imgSrc + '" title="' + title + '">',
                        '            </span>',
                        '        </div>',
                        '        <div class="fb__file__btn">',
                        '            <a href="' + img + '" class="fb__file__btn--view">보기</a>',
                        '            <a href="javascript:void(0);" class="fb__file__btn--change" data-file-btn="change">변경</a>',
                        '            <a href="javascript:void(0);" class="fb__file__btn--del devFileDeleteOrg" style="display:none" data-file-btn="del" data-file-src="/assets/img/common/icon_plus.gif">삭제</a>',
                        '            <a href="javascript:void(0);" class="fb__file__btn--del devFileDelete" data-file-name="'+colName+'" data-file-url="'+img+'" >삭제</a>',
                        '        </div>',
                        '    </div>',
                        '</li>'
                    ].join('');
                },
                reset: function () {
                    this.filSeq = 1;
                    this.target.find('.fb__file .fb__file__box .fb__file__list').remove();
                    //this.addFileBox(this.colName);
                    return this;
                }

            };
        },
        choiceProduct: function () {
            return {
                grid: common.ui.grid(),
                init: function ($grid) {
                    this.initGrid($grid);
                    this.initEtc($grid);
                    return this;
                },
                initGrid: function ($grid) {
                    common.lang.load('choiceProduct.grid.label.image', '상품이미지');
                    common.lang.load('choiceProduct.grid.label.pname', '상품명');
                    common.lang.load('choiceProduct.grid.label.brandText', '브랜드명');
                    common.lang.load('choiceProduct.grid.label.rp_pid', '상품코드');
                    common.lang.load('choiceProduct.grid.label.pcode', '관리코드');
                    common.lang.load('choiceProduct.grid.label.sellprice', '가격');
                    common.lang.load('choiceProduct.grid.label.state', '판매상태');
                    common.lang.load('choiceProduct.grid.label.disp', '노출여부');

                    var gridConfig = {
                        showLineNumber: true,
                        columns: [
                            {
                                key: "thum_image_src",
                                label: common.lang.get('choiceProduct.grid.label.image'),
                                align: 'center',
                                width: 80,
                                formatter: function () {
                                    return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.image_src + '" height="30" /></div>';
                                }
                            },
                            {key: "pname", label: common.lang.get('choiceProduct.grid.label.pname'), width: "*"},
                            {
                                key: "brandText",
                                label: common.lang.get('choiceProduct.grid.label.brandText'),
                                width: 90
                            },
                            {
                                key: "id",
                                label: common.lang.get('choiceProduct.grid.label.rp_pid'),
                                align: 'center',
                                width: 90
                            },
                            {key: "pcode", label: common.lang.get('choiceProduct.grid.label.pcode'), width: 100},
                            {
                                key: "sellprice",
                                label: common.lang.get('choiceProduct.grid.label.sellprice'),
                                width: 70,
                                formatter: 'money',
                                align: 'right'
                            },
                            {
                                key: "stateText",
                                label: common.lang.get('choiceProduct.grid.label.state'),
                                align: 'center',
                                width: 70
                            },
                            {
                                key: "dispText",
                                label: common.lang.get('choiceProduct.grid.label.disp'),
                                align: 'center',
                                width: 70
                            },
                            {
                                key: "act",
                                label: common.lang.get('grid.label.act'),
                                align: "center",
                                width: 70,
                                formatter: function () {
                                    return [
                                        '<input type="button" class="fb-filter__edit devCommonGridDelete" data-idx="' + this.item.__index + '" value="삭제" />'
                                    ].join('');
                                }
                            },
                        ]
                    };

                    // 정적 데이타 매핑
                    this.grid.setGrid($grid, gridConfig);
                },
                resize: function() {
                    this.grid.resize();
                },
                initEtc: function ($grid) {
                    var self = this;
                    var grid = this.grid;
                    var $moveContent = $([
                        '<div class="fb__goodssearch__info">',
                        '	<button type="button" class="devUp">▲</button>',
                        '	<button type="button" class="devDown">▼</button>',
                        '	선택한 상품의 진열순서를 변경하세요.',
                        '	<div class="fb__goodssearch__info__input">',
                        '		선택한 상품을 <input type="text" devnumber="true" class="fb-filter__text devMoveRank"> 위치로',
                        '		<button type="button" class="devMove">이동</button>',
                        '	</div>',
                        '</div>'
                    ].join(''));

                    var $rank = $moveContent.find('.devMoveRank');

                    // 그리드 순서 변경(UP)
                    $moveContent.find('.devUp').on('click', function () {
                        grid.rowMoveUp();
                    });
                    // 그리드 순서 변경(DOWN)
                    $moveContent.find('.devDown').on('click', function () {
                        grid.rowMoveDown();
                    });
                    // 그리드 순서 변경(MOVE)
                    $moveContent.find('.devMove').on('click', function () {
                        grid.moveRow($rank.val());
                        $rank.val('');
                    });

                    $grid.after($moveContent);

                    // 삭제
                    $(document).on('click', '.devCommonGridDelete', function (e) {
                        grid.deleteRow('selected');
                        grid.focusRow = false;
                    });
                },
                setContent: function (data) {
                    this.grid.setContent(data, false);
                },
                getList: function (mode, column) {
                    return this.grid.getList(mode, column);
                },
                addContent: function (data) {
                    var selectIdList = this.getList('all', ['id']);
                    var addData = [];
                    $.each(data, function () {
                        if (selectIdList.indexOf(this.id) < 0) {
                            addData.push(this);
                        }
                    });
                    this.grid.addContent(addData);
                },
                deleteRow: function (mode) {
                    //first, last, selected, 1 (index)
                    this.grid.deleteRow(mode);
                },
                showEmpty: function () {
                    this.grid.gridObj.$target.find("[data-ax5grid-container='body']").append('<div class="data-ax5grid-empty-container"></div>');
                    return this;
                },
            }
        },
        selectCategory: function (methodName = 'getLargeCategoryList', methodNameSub = 'getSubCategoryList'
                                  , className = 'searchCategory', moduleName = 'pub', cateId = 'Product', siIx = 0) {
            return {
                cateType: 'product',
                cateId: cateId,
                siIx: siIx,
                idName: false,
                div: 1,
                mode: '',
                onChangeFunctoin: false,
                setCateType: function (cateType) {
                    this.cateType = cateType;
                    return this;
                },
                setDiv: function (div) {
                    this.div = div;
                    return this;
                },
                setMode: function (mode) {
                    this.mode = mode;
                    return this;
                },
                setChange: function (f) {
                    this.onChangeFunctoin = f;
                    return this;
                },
                getIdName: function (num) {
                    return this.idName + '_' + this.div + '_' + num;
                },
                init: function ($target) {
                    var self = this;

                    // 카테고리 타입 설정
                    if (self.cateType == 'inventory') {
                        self.cateId = 'Inventory';
                    } else if (self.cateType == 'standard') {
                        self.cateId = 'Standard';
                    }

                    var cateId = self.cateId;
                    self.idName = 'devSearch' + cateId + 'Category';

                    var id1 = self.getIdName(1);
                    var id2 = self.getIdName(2);
                    var id3 = self.getIdName(3);
                    var id4 = self.getIdName(4);
                    var id5 = self.getIdName(5);

                    if (self.mode == 'multiple') {
                        var htmlArr = [
                            '<select multiple id="' + id1 + '"></select>',
                            '<select multiple id="' + id2 + '"></select>',
                            '<select multiple id="' + id3 + '"></select>',
                            '<select multiple id="' + id4 + '"></select>',
                            '<select multiple id="' + id5 + '"></select>'
                        ];
                    } else {
                        var htmlArr = [
                            '<select class="fb-filter__select" id="' + id1 + '">',
                            '	<option value="">1차분류</option>',
                            '</select>',
                            '<select class="fb-filter__select" id="' + id2 + '">',
                            '	<option value="">2차분류</option>',
                            '</select>',
                            '<select class="fb-filter__select" id="' + id3 + '">',
                            '	<option value="">3차분류</option>',
                            '</select>',
                            '<select class="fb-filter__select" id="' + id4 + '">',
                            '	<option value="">4차분류</option>',
                            '</select>',
                            '<select class="fb-filter__select" id="' + id5 + '">',
                            '	<option value="">5차분류</option>',
                            '</select>'
                        ];
                    }

                    if (self.mode == 'add') {
                        htmlArr = htmlArr.concat([
                            '<input type="button" class="fb-filter__dealerSearch devAddSearch' + cateId + 'CategoryButton" value="추가"/>',
                            '<div class="fb-filter__system devAddSearch' + cateId + 'CategoryList"></div>'
                        ]);
                    }

                    var $moveContent = $(htmlArr.join(''));

                    if (self.mode == 'add') {
                        $moveContent.filter('.devAddSearch' + cateId + 'CategoryButton').click(function () {
                            var value = self.getValue();
                            if (value.cid.length > 0 && $moveContent.find('input[value=' + value.cid + ']').length == 0) {
                                $moveContent.filter('.devAddSearch' + cateId + 'CategoryList').append(self.getAddListTpl(value));
                            }
                        });
                    }

                    $target.append($moveContent);

                    //대카테고리 set
                    common.ajax(common.util.setParams(self.cateType).getControllerUrl(methodName, className, moduleName), {si_ix: self.siIx}, '', function (response) {
                        if (response.result == 'success') {
                            $.each(response.data, function () {
                                $('#' + id1).append('<option value="' + this.cid + '" data-children="' + this.children + '">' + this.cname + '</option>');
                            });
                        }
                    });

                    var url = common.util.setParams(self.cateType).getControllerUrl(methodNameSub, className, moduleName);

                    var cascadingColumn = {value: 'cid', text: 'cname', cascading: 'children'};
                    var reset = (self.mode == 'multiple' ? true : false);
                    common.ui.cascading('#' + id1, '#' + id2)
                        .setUrl(url)
                        .setAllReset(reset)
                        .setOptColumn(cascadingColumn)
                        .on('change', self.onChangeFunctoin)
                        .init();

                    common.ui.cascading('#' + id2, '#' + id3, 'categoryGroup')
                        .setUrl(url)
                        .setAllReset(reset)
                        .setOptColumn(cascadingColumn)
                        .on('change', self.onChangeFunctoin)
                        .init();

                    common.ui.cascading('#' + id3, '#' + id4)
                        .setUrl(url)
                        .setAllReset(reset)
                        .setOptColumn(cascadingColumn)
                        .on('change', self.onChangeFunctoin)
                        .init();

                    common.ui.cascading('#' + id4, '#' + id5)
                        .setUrl(url)
                        .setAllReset(reset)
                        .setOptColumn(cascadingColumn)
                        .on('change', self.onChangeFunctoin)
                        .init();
                    return this;
                },
                getValue: function () {
                    var self = this;
                    var cid = '';
                    var path = [];
                    for (var i = 5; i > 0; i--) {
                        var $obj = $('#' + self.getIdName(i));
                        if (cid == '' && $obj.val().length > 0) {
                            if (self.mode == 'multiple') {
                                cid = $obj.val()[0];
                            } else {
                                cid = $obj.val();
                            }
                        }
                        if ($obj.val().length > 0) {
                            path.push($obj.find(':selected:eq(0)').text());
                        }
                    }
                    return {cid: cid, path: path.reverse()};
                },
                getAddListTpl: function (value) {
                    var rowName = 'devAddSearch' + this.cateId + 'CategoryRow';
                    var htmlArr = [
                        '<div class="fb-filter__system-list ' + rowName + '">',
                        '	<input type="hidden" name="filterCid[]" value="' + value.cid + '">',
                        '	<ul class="fb-filter__system-inner">',
                        '           <li>',
                        value.path.join('</li><li>'),
                        '           </li>',
                        '	</ul>',
                        '	<a href="#" class="fb-filter__system-btn devAddSearch' + this.cateId + 'CategoryDelete">',
                        '           delete',
                        '	</a>',
                        '</div>'
                    ];

                    var $moveContent = $(htmlArr.join(''));
                    $moveContent.find('.devAddSearch' + this.cateId + 'CategoryDelete').click(function (e) {
                        e.preventDefault();
                        $(this).closest('.' + rowName).remove();
                    });
                    return $moveContent;
                }
            }
        }
    },
    pub: {
        callbackObj: {},
        callbak: function (className, data) {
            if (typeof this.callbackObj[className] == 'function') {
                this.callbackObj[className](data);
            }
        },
        getUrl: function (className) {
            return common.util.getControllerUrl('index', className, 'pub');
        },
        getOption: function (className) {
            if (className == 'searchBrand') {
                return {title: '브랜드검색', width: '750px', height: '650px'};
            } else if (className == 'searchProduct') {
                return {title: '상품검색', width: '950px', height: '900px'};
            } else if (className == 'searchAddress') {
                return {title: '주소검색', width: '500px', height: '650px'};
            } else if (className == 'searchOrigin') {
                return {title: '원산지검색', width: '750px', height: '650px'};
            } else if (className == 'searchManufacturer') {
                return {title: '제조사검색', width: '750px', height: '650px'};
            } else if (className == 'searchMember') {
                return {title: '회원검색', width: '750px', height: '750px'};
            } else if (className == 'searchSeller') {
                return {title: '판매자검색', width: '750px', height: '750px'};
            } else if (className == 'searchMd') {
                return {title: 'MD검색', width: '750px', height: '650px'};
            } else if (className == 'searchCompany') {
                return {title: '업체검색', width: '750px', height: '650px'};
            } else if (className == 'searchInventoryGoods') {
                return {title: '품목검색', width: '950px', height: '800px'};
            } else if (className == 'historyList') {
                return {title: '변경내역', width: '950px', height: '530px'};
            } else if (className == 'personalSmsSendPopup') {
                return {title: '개인별 SMS 발송 팝업', width: '375px', height: '530px'};
            } else if (className == 'changeService') {
                return {title: '서비스 신청 팝업', width: '1100px', height: '650px'};
            }
        },
        open: function (className, callback, data) {
            this.callbackObj[className] = callback;
            var option = this.getOption(className);
            var title = option.title;
            delete option.title;
            common.util.modal.open('ajax', title, this.getUrl(className), data, '', option);
        },
        close: function () {
            common.util.modal.close();
        },
        setParams: function () {
            if (arguments.length > 0) {
                common.util.setParams.apply(null, arguments);
            }
            return this;
        }
    },
    payment : {
        meta : {
            payStatus : false,
            sgIx : '',
            targetNum : 1,
            modalType : 'n',
            pass : '',
            num : [1,2,3,4,5,6,7,8,9,0,-1,-1],
            mode : '',
            card : false,
            setBillInfo : function(data) {
                this.pass = '';
                this.sgIx = '';
                this.card = false;

                $('.metapay-new').show();
                $('.metapay-confirm').hide();
                if(data.sgIx){
                    this.sgIx = data['sgIx'];
                    $("#devStep02").hide();
                    $("#devStep01").show();
                }
                $('.metapay-confirm').hide();

                if (common.payment.meta.mode == 'add') {
                    $("#devStep02").hide();
                    $("#devStep05").show();
                }
            },
            initCardList: function() {
                var self = this;
                self.modalType = 'n';
                common.ajax(common.util.getControllerUrl('getCardList', 'managePayment', 'store'),
                    {},
                    function () {
                        // 전송전 데이타 검증
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        var cardHtml = '';
                        var cardList = response.data;
                        var target = $('#devCardList');
                        target.removeClass('slick-initialized','slick-slider');
                        $('#devCardList > *').remove();

                        if(cardList.length > 0) {
                            if (common.payment.meta.mode != 'add') {
                                $('#devStep01').show();
                                $('#devStep02').hide();
                            }

                            for(var i =0; i < cardList.length; i++){
                                var card = cardList[i];
                                var tpl = self.cardTpl;
                                
                                tpl = tpl.replace('#cardIdx#', card.bkd_ix).replace('#cardCode#', card.cardCode).replace('#CardImgUrl#', card.CardImgUrl).replace('#CardNo#', card.CardNo).replace('#CardType#', card.CardType).replace('#regdate#', card.regdate);

                                target.append(tpl);

                            }


                            //마지막에 카드추가 붙여넣기
                            target.append('<li class="fb__metapay__reg__list">\n' +
                                '                    <div class="fb__metapay__reg__item devPlusCard">\n' +
                                '                        <button type="button">\n' +
                                '                            <span>+</span>\n' +
                                '                        </button>\n' +
                                '                        <span>결제수단을 추가하세요</span>\n' +
                                '                    </div>\n' +
                                '                </li>');
                        }else {
                            $('#devStep01').hide();
                            $('#devStep02').show();
                        }

                        if ($(".fb__metapay__reg .slide > li").length > 0) {
                            $(".fb__metapay__reg .slide").slick({
                                dots: false,
                                infinite: true,
                                speed: 300,
                                slidesToShow: 1,
                                adaptiveHeight: true,
                                nextArrow: '<span class="pay-arrow-right">left</span>',
                                prevArrow: '<span class="pay-arrow-left">right</span>',
                            });

                        }
                    }
                );
            },
            cardTpl: '<li id="#cardIdx#" class="devCard fb__metapay__reg__list cardcode_#cardCode#"><div class="fb__metapay__reg__card"><div class="fb__metapay__reg__card__wrap"><figure class="logo"><img src="#CardImgUrl#" alt=""></figure><i class="chk-ico"></i><span class="card-num">#CardNo#</span><span class="pay-exp">#CardType#</span><span class="card-date">등록일 : <span>#regdate#</span></span></div></div></li>',
            initNumPad: function() {
                this.targetNum = 1;
                this.num = [1,2,3,4,5,6,7,8,9,0,-1,-1];
                this.shuffle(this.num);
                this.setNumPad(this.num);
            },
            shuffle: function(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            },
            setNumPad: function(array) {
                $('.key').each(function(idx){
                    if(array[idx] > -1) {
                        $(this).attr('data-value', array[idx]);
                        $(this).find('span').text(array[idx]);
                    }else{
                        $(this).attr('data-value', '');
                        $(this).find('span').text('');
                    }
                });
            },
            sendCardNum: false,
            modal: function (html, mode, data, redirect = '', completeFunction) {
                var modalTitle = '메타페이 결제 ';
                var self = this;
                // 모달 설정
                common.util.modal.open(
                    'html',
                    modalTitle,
                    html,
                    '',
                    function () {

                        self.setBillInfo(data);
                        self.initCardList();
                        self.initNumPad();
                        if (typeof completeFunction === "function") {
                            completeFunction();
                        }


                        $('#devSpName').text(data['sp_name']);
                        if(data['offer'] > 0) {
                            $('#devOffer').text(common.util.numberFormat(data['offer']) + '건');
                        }else if(data['type_day'] > 0) {
                            $('#devOffer').text(common.util.numberFormat(data['type_day']) + '일');
                        }else {
                            $('#devOffer').text('-');
                        }
                        $('#devPrice').text(common.util.numberFormat(data['sp_price']));

                        $('#devModalBox').on('click', '.devPlusCard button',function () {
                            $('#devStep01').hide();
                            $('#devStep02').show();
                            $(".fb__metapay__reg .slide").slick('destroy').addClass('destroy');
                        });

                        $('#devStep02Save').on('click', function () {
                            if ($('#devMetaPayAgree:checked').val()) {

                                common.ajax(common.util.getControllerUrl('getBillPass', 'managePayment', 'store'),
                                    {},
                                    function () {
                                        // 전송전 데이타 검증
                                        return true;
                                    },
                                    function (response) {
                                        // 전송후 결과 확인
                                        if (response.result == 'Exist') {
                                            $('#devStep02').hide();
                                            $('#devStep04').show();
                                        } else if (response.result == 'Empty') {
                                            self.initNumPad();
                                            $('#devStep02').hide();
                                            $('#devStep03').show();
                                        } else {
                                            common.noti.alert(response.result);
                                        }
                                    }
                                );
                            } else {
                                common.noti.alert(common.lang.get('msg.pay.agree'));
                            }
                        });

                        $('.pad').on('click', function () {
                            if ($(this).data('value') !== '') {
                                $('#key_' + self.targetNum).addClass('on');
                                self.targetNum++;
                                self.pass += $(this).data('value');
                            }
                            
                            if (self.targetNum > 6 && self.sendCardNum === false) {
                                    self.sendCardNum = true;
                                    if (self.modalType == 'n') {
                                        common.ajax(common.util.getControllerUrl('putBillPass', 'managePayment', 'store'),
                                            {
                                                'pass': self.pass
                                            },
                                            function () {
                                                // 전송전 데이타 검증
                                                return true;
                                            },
                                            function (response) {
                                                // 전송후 결과 확인
                                                if (response.result == 'success') {
                                                    $('#devStep03').hide();
                                                    $('#devStep04').show();
                                                } else {
                                                    common.noti.alert(response.data.msg);
                                                    $('.devAllClear').click();
                                                }

                                                self.sendCardNum = false;
                                            }
                                        );

                                    } else if (self.modalType == 'p') {
                                        //결제요청
                                        common.ajax(common.util.getControllerUrl('putBillPayment', 'managePayment', 'store'),
                                            {
                                                'pass': self.pass,
                                                'sgIx': self.sgIx,
                                                'card': self.card
                                            },
                                            function () {
                                                // 전송전 데이타 검증
                                                return true;
                                            },
                                            function (response) {
                                                // 전송후 결과 확인
                                                if (response.result == 'success') {
                                                    common.noti.alert(common.lang.get('msg.pay.complete'));
                                                    $('.fb-modal__wrap').remove();
                                                    $('body').removeClass("fb-modal");
                                                    if (redirect != '') {
                                                        location.href = redirect;
                                                    } else {
                                                        location.reload();
                                                    }
                                                } else if (response.result == 'lost') {
                                                    common.noti.alert(common.lang.get('msg.pay.lost'));

                                                    $('.fb-modal__wrap').remove();
                                                    $('body').removeClass("fb-modal");
                                                } else if(response.result == 'fail') {
                                                    common.noti.alert(response.data.msg);
                                                    $('.devAllClear').click();
                                                }

                                                self.sendCardNum = false;
                                            }
                                        );
                                    }

                                }
                        });

                        $('.devAllClear').on('click', function () {
                            self.pass = '';
                            self.targetNum = 1;
                            $('.character.on').each(function () {
                                $(this).removeClass('on');
                            });
                        });

                        $('#devCancel').on('click', function () {
                            var current = $('.character.on').length - 1;
                            $('.character.on').eq(current).removeClass('on');
                            self.pass = self.pass.slice(0, -1);
                            self.targetNum--;
                        });


                        $('#devStep04Next').on('click', function () {
                            $('#devStep04').hide();
                            $('#devStep05').show();
                        });
                        $('#devStep05').find('.cardAdd input').on('click', function () {
                            if ($(this).prop('checked') == true) {
                                if ($(this).val() == '1') {
                                    $('#devStep05 .cardIdNo').find('dt span').text('생년월일');
                                    $('#devStep05 #devIDNo').attr('placeholder', '예) 961010');
                                } else if ($(this).val() == '2') {
                                    $('#devStep05 .cardIdNo').find('dt span').text('사업자번호');
                                    $('#devStep05 #devIDNo').attr('placeholder', '- 없이 숫자 10자리를 입력해주세요.');
                                }
                            }
                        });

                        $('#devPayment').on('click', function () {
                            var id = $('.slick-current.slick-active').find('.devCard').attr('id');
                            if(id){
                                self.modalType = 'p';
                                self.card = id;
                                $('.metapay-new').hide();
                                $('.metapay-confirm').show();

                                self.initNumPad();
                                $('#devStep01').hide();
                                $('#devStep03').show();
                            }else {
                                alert('등록된 카드를 선택해주세요.');
                            }
                        });

                        $('#devPaymentHide').on('click', function () {

                            var id = $('.slick-current.slick-active').find('.devCard').attr('id');
                            var listLength = $('#devCardList .slick-slide').not('.slick-cloned').length;

                            if (listLength == 2) {
                                alert('등록된 카드가 최소한 1개가 있어야 삭제가 가능합니다.');
                                return false;
                            }

                            if(id){
                                self.modalType = 'p';
                                self.card = id;


                                if(confirm("등록된 카드를 삭제하시겠습니까?") == true) {

                                    common.ajax(common.util.getControllerUrl('putHideCardBillingKey', 'managePayment', 'store'),{
                                        id: self.card
                                    }, function () {
                                        // 전송전 데이타 검증
                                        return true;
                                    }, function (res) {
                                        if (res.result == 'success') {
                                            self.initCardList();
                                        }
                                    });
                                }

                            }else {
                                alert('등록된 카드를 선택해주세요.');
                            }
                        });

                        // 벨리데이션 체크 설정
                        common.validation.set($('[name="CardNo"]'), {'required': true});
                        common.validation.set($('[name="ExpMonth"]'), {'required': true});
                        common.validation.set($('[name="ExpYear"]'), {'required': true});
                        common.validation.set($('[name="CardPw"]'), {'required': true});
                        common.validation.set($('[name="IDNo"]'), {'required': true});

                        $('#devComplete').on('click', function () {
                            var self = common.payment.meta;

                            common.ajax(common.util.getControllerUrl('putBillInfo', 'managePayment', 'store'),
                                {
                                    pass: self.pass,
                                    cardNo: $('#devCardNo').val(),
                                    cardExpMonth: $('#devExpMonth').val(),
                                    cardExpYear: $('#devExpYear').val(),
                                    cardPw: $('#devCardPw').val(),
                                    idNo: $('#devIDNo').val()
                                },
                                function () {
                                    // 전송전 데이타 검증
                                    return common.validation.check($('#relaket_pay_billing_form'), 'alert', false);
                                },
                                function (response) {
                                    // 전송후 결과 확인
                                    if (response.result == 'success') {

                                        common.noti.alert(common.lang.get('msg.bill.complete'));
                                        if (common.payment.meta.mode == 'add') {
                                            common.util.modal.close();
                                            devThirdPartyManageMetapayObj.grid.reload();
                                        } else {
                                            if (response.data.msg == 'Exist') {
                                                $('#devStep01').show();
                                                $('#devStep05').hide();
                                                self.pass = '';
                                                self.initCardList();

                                            } else {
                                                $('.fb-modal__bg').click();
                                                self.payStatus = true;
                                                if ($('#devMetaPay').length > 0) {
                                                    $('#devMetaPay').attr('disabled', 'disabled');
                                                    $('#devMetaText').text('등록완료');
                                                }
                                            }
                                            setTimeout(function () {
                                                $(".fb__metapay__reg .slide").removeClass('destroy');
                                            }, 600);
                                        }
                                    } else {
                                        common.noti.alert(response.data.msg);
                                    }
                                }
                            );
                        });
                    },
                    {width: '520px', height: '650px'}
                );

                return false;
            }
        }
    },
    license : {
        modalTpl : false,
        apply : {
            modal: function () {
                var self = common.license;
                var modalTitle = '임시 라이선스 신청';

                if (self.modalTpl === false) {
                    self.modalTpl = common.util.getHtml('#devLicenseApplyModalTpl');
                }

                // 모달 설정
                common.util.modal.open(
                    'html',
                    modalTitle,
                    self.modalTpl,
                    '',
                    function () {

                        common.license.apply.initForm();

                        common.inputFormat.set($('[name="phone_number"]'), {'maxLength': 13});
                        // 벨리데이션 체크 설정
                        common.validation.set($('[name="user_name"]'), {'required': true});
                        common.validation.set($('[name="email"]'), {
                            'required': true,
                            'dataFormat': 'email',
                        });
                        common.validation.set($('[name="phone_number"]'), {
                            'required': true,
                            'dataFormat': 'mobile',
                        });
                        common.validation.set($('[name="comment"]'), {'required': true});

                        $('#devLicenseApplySubmit').on('click', function () {
                            $('#devLicenseApplyForm').submit();
                        });

                    },
                    {width: '650px', height: '624px'}
                );

                return false;

            },
            initForm: function () {
                common.form.init(
                    $('#devLicenseApplyForm'),
                    common.util.getControllerUrl('putLicense', 'serviceRequest', 'thirdParty'),
                    function (formData) {
                        if (common.validation.check($('#devLicenseApplyForm'), 'alert', false)) {
                            return formData;
                        } else {
                            return false;
                        }
                    },
                    function (response) {
                        if (response.result == 'success') {
                            common.noti.alert(common.lang.get('msg.license.apply.complete'));
                            location.reload();
                        } else {
                            common.noti.alert("system error");
                        }
                    }
                );
            }
        }
    }
};

$(function () {
    //사용하는 언어 로드
    common.lang.load('common.validation.required.text', "{title}을/를 입력해 주세요."); //Alert_05
    common.lang.load('common.validation.required.checkbox', "{title}을/를 체크해 주세요.");
    common.lang.load('common.validation.required.select', "{title}을/를 선택해 주세요.");
    common.lang.load('common.validation.required.file', "{title}을/를 첨부해 주세요.");
    common.lang.load('common.validation.userPassword.fail', "비밀번호 입력 조건에 맞게 입력해 주세요."); //Alert_64
    common.lang.load('common.validation.userPassword.space', "비밀번호는 공백 없이 입력해주세요.");
    common.lang.load('common.validation.compare.fail', "{title}와 일치하게 입력해 주세요.");
    common.lang.load('common.validation.userId.fail', "영문, 숫자 조합하여 6~20자리로 입력해 주세요.");
    common.lang.load('common.validation.companyNumber.fail', "유효한 사업자 정보가 아닙니다."); //Alert_08
    common.lang.load('common.validation.email.fail', "이메일을 올바르게 입력해 주세요.");
    common.lang.load('common.inputFormat.fileFormat.fail', "파일 형식이 올바르지 않습니다.{common.lineBreak}다시 첨부해 주세요.");
    common.lang.load('common.inputFormat.fileSize.fail', "파일 용량이 최대 {size}MB를 초과했습니다.{common.lineBreak}다시 첨부해 주세요.");
    common.lang.load('common.validation.mobile.fail', "휴대전화번호를  올바르게 입력해 주세요.");
    common.lang.load('common.emptyBookmark.txt', '등록된 메뉴가 없습니다.');
    common.lang.load('common.delete.file.confirm', '등록된 파일을 삭제 하시겠습니까?');
    common.lang.load('common.delete.file.success', '파일삭제가 완료되었습니다.');
    common.lang.load('common.delete.file.fail', '파일삭제가 실패되었습니다.');

    //meta pay
    common.lang.load('msg.bill.complete', '메타페이 카드 등록이 완료 되었습니다.');
    common.lang.load('msg.pay.agree', '메타페이 이용약관의 동의가 필요합니다.');
    common.lang.load('msg.pay.complete', '결제 완료 되었습니다.');
    common.lang.load('msg.pay.lost', '분실된 카드입니다.');

    //임시 라이선스 신청
    common.lang.load('msg.license.apply.complete', "임시 라이선스 신청이 완료되었습니다.");

    // input event bind
    common.inputFormat.eventBind();
    // 북마크 이벤트
    common.bookmark.init();
    // 메뉴검색 이벤트
    common.menuSearch.init();
});