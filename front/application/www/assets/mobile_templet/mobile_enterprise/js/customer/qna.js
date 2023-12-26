"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/

//최초 로드시 권한 여부를 APP에서 줌.
function getShowAuthority(camera, photo) {
    devPhoto.setShowAuthority(camera, photo);
}

//파일첨부 선택시 권한 여부를 APP에서 줌.
function setShowAuthority(camera, photo) {
    devPhoto.setShowAuthority(camera, photo);
}

var devCustomerQnaObj = {
    bbsForm: false,
    getBbsEmail: function () {
        return $('#devBbsEmail').val().trim();
    },
    getBbsDivSelect: function () {
        return $('#devBbsDiv').val().trim();
    },
    getBbsMobile: function () {
        return $('#devBbsHp1').val().trim() + '-' + $('#devBbsHp2').val().trim() + '-' + $('#devBbsHp3').val().trim();
    },
    initLang: function () {
        common.lang.load('write.customer.register', "1:1 문의를 등록하시겠습니까?"); // Confirm_04
        common.lang.load('write.customer.cancel', "1:1 문의 작성을 취소하시겠습니까?"); // Confirm_03
        common.lang.load('write.customer.cancel.inquiry', "1:1 문의내역으로 이동 시 입력중인 내용은 삭제됩니다. 그래도 이동하시겠습니까?"); // Confirm_32

        common.lang.load('write.customer.fail', "다시 입력해 주세요.");
        common.lang.load('write.customer.loginFail', "로그인을 해주세요.");
        common.lang.load('write.customer.success', "1:1 문의가 등록되었습니다. \n문의 상세 내역은 마이페이지 > 1:1 문의내역에서 확인하실 수 있습니다."); // Alert_77
        common.lang.load('write.customer.bbsdev.fail', "분류항목을 선택해 주세요.");
        common.lang.load('write.customer.file.find', "파일찾기");
        common.lang.load('write.customer.file.change', "파일변경");
        common.lang.load('write.customer.file.confirm.delete', "파일을 삭제하시겠습니까?");
        common.lang.load('write.customer.file.type.check', "파일 형식이 올바르지 않습니다. \n다시 첨부해주세요.");
        common.lang.load('write.customer.file.size.check', "파일 용량이 최대 30MB를 초과했습니다. \n다시 첨부해주세요.");
        common.lang.load('bbs.spam.text','스팸정책에 의해 등록할 수 없습니다.');

        common.lang.load('write.customer.pageescape.confirm', "1:1 문의하기 페이지 이탈 시 입력중인 내용은 삭제됩니다.\n그래도 이동하시겠습니까?");
    },
    initValidation: function () {
        common.validation.set($('#devBbsDiv'), {'required': true, 'getValueFunction': 'devCustomerQnaObj.getBbsDivSelect'});
        common.validation.set($('#devBbsEmail'), {
            'required': true,
            'dataFormat': 'email',
            'getValueFunction': 'devCustomerQnaObj.getBbsEmail'
        });
        common.validation.set($('#devBbsHp1, #devBbsHp2, #devBbsHp3'), {
            'required': true,
            'dataFormat': 'mobile',
            'getValueFunction': 'devCustomerQnaObj.getBbsMobile'
        });
        common.validation.set($('#devBbsSubject'), {'required': true});
        common.validation.set($('#devBbsContents'), {'required': true});
    },
    initEvent: function () {
        var self = devCustomerQnaObj;

        $('#devBbsEmailHostSelect').change(function (e) {
            var selectValue = $(this).val();
            var $bbsEmailHost = $('#devBbsEmailHost');
            $bbsEmailHost.val(selectValue);
        });

        $("#devDirectInputComEmailCheckBox").change(function (e) {

            if ($(this).is(':checked')) {
                $('#devBbsEmailHostSelect').hide();
                $('#devBbsEmailHost').show();
                $('#devBbsEmailHost').val('')
            } else {
                var host = $('#devBbsEmailHostSelect option:selected').text();
                $('#devBbsEmailHost').val(host);
                $('#devBbsEmailHostSelect').show();
                $('#devBbsEmailHost').hide();
            }
        });

        $("#devBbsForm :input").change(function () {
            $("#devBbsForm").data("changed", true);
        });

        $('#devGoMyInquiry').click(function (e) {
            if ($("#devBbsForm").data("changed")) {
                if (!common.noti.confirm(common.lang.get('write.customer.cancel.inquiry'))) {
                    return false;
                }
            }
            document.location.href = '/mypage/myInquiry';
        });

        $('#devBbsRegCancel').click(function (e) {
            e.preventDefault();
            common.noti.confirm(common.lang.get('write.customer.cancel'), function () {
                document.location.href = '/customer';
            });
        });

        $('#devBtnOrderQuery').click(function (e) {
            $(".fb__popup-layout").addClass('full-layer');

            common.util.modal.open('ajax', '주문번호 조회', '/popup/orderList', '', function () {
                self.orderListAjax = common.ajaxList();
                self.orderListAjax
                    .setLoadingTpl('#devListLoading')
                    .setListTpl('#devListDetail')
                    .setEmptyTpl('#devListEmpty')
                    .setContainerType('ul')
                    .setContainer('#devListContents')
                    .setPagination('#devPageWrap')
                    .setPageNum('#devPage')
                    .setForm('#devListForm')
                    .setController('orderHistory', 'mypage')
                    .init(function (response) {
                        self.orderListAjax.setContent(response.data.list, response.data.paging);
                    });

                $('#devPageWrap').on('click', '.devPageBtnCls', function () { // 페이징 버튼 이벤트 설정
                    self.orderListAjax.getPage($(this).data('page'));
                });
            });
        });

        $('#devModalContent').on('click', '.btn-xs', function () {
            $("#devOid").val($(this).data('oid'));
            $('.fb__popup-layout .close').trigger('click');
        });

        $('#devBbsDiv').on('change',function(){
            var divIx = $(this).val();
            common.ajax(common.util.getControllerUrl('getSubBbsDiv', 'customer'),
                {
                    divIx : divIx
                },
                function() {

                },
                function(res){
                    if(res.result == 'success' && res.data.length > 0) {
                        var str = [];
                        for (var i = 0; i < res.data.length; i++) {
                            str.push('<option value="' + res.data[i].div_ix + '" >'+ res.data[i].div_name + '</option>');
                        }
                        $('#devSubBbsDiv option[value!=""]').remove();
                        $('#devSubBbsDiv').show();
                        $('#devSubBbsDiv').append(str);

                    }else{
                        $('#devSubBbsDiv').hide();
                        $('#devSubBbsDiv option[value!=""]').remove();
                    }
                });
        });
    },
    initForm: function () {
        var self = devCustomerQnaObj;
        self.bbsForm = $('#devBbsForm');

        common.inputFormat.set($('#devBbsHp2, #devBbsHp3'), {'number': true, 'maxLength': 4});
        common.inputFormat.set($('#devBbsFileText1, #devBbsFileText2, #devBbsFileText3'), {
            'fileFormat': 'image',
            'devFileSize': 30
        });
        common.inputFormat.set($('#devBbsEmail'), {maxLength: 50});

        // 나의 문의 등록
        common.form.init(self.bbsForm, common.util.getControllerUrl('registerArticle', 'customer'), function (form) {
            if (common.validation.check(form, 'alert', false)) {
                if (common.noti.confirm(common.lang.get('write.customer.register'))) {
                    return true;
                }
            }
            return false;
        }, function (response) {
            if (response.result == "success") {
                common.noti.alert(common.lang.get("write.customer.success"));
                location.href = response.data.url;
            } else if(response.result == 'spam') {
                common.noti.alert(common.lang.get('bbs.spam.text'));
            } else if (response.result == 'loginFail') {
                common.noti.alert(common.lang.get('write.customer.loginFail'));
                document.location.href = '/member/login?url=' + encodeURI('/customer/qna');
            } else {
                common.noti.alert(common.lang.get("write.customer.fail"));
            }
        });
    },
    run: function () {
        var self = this;

        self.initLang();
        self.initValidation();
        self.initEvent();
        self.initForm();
    }
};

var devPhoto = {
    appCamera: false,
    appPhoto: false,
    initEvent: function () {
        var self = this;
        
        $('#devBbsFileText1').click(function (e) {
            var chk = true;

            if (devAppType == 'iOS') {
                chk = self.iosCheck(e, '1');
            }

            if (chk === true) {
                self.fileAttachments('1');
            }
        });

        $('#devBbsFileText2').click(function (e) {
            var chk = true;

            if (devAppType == 'iOS') {
                chk = self.iosCheck(e, '2');
            }

            if (chk === true) {
                self.fileAttachments('2');
            }
        });

        $('#devBbsFileText3').click(function (e) {
            var chk = true;

            if (devAppType == 'iOS') {
                chk = self.iosCheck(e, '3');
            }

            if (chk === true) {
                self.fileAttachments('3');
            }
        });

        $('#devBusinessFileDeleteButton1').click(function (e) {
            self.fileDelete('1');
        });

        $('#devBusinessFileDeleteButton2').click(function (e) {
            self.fileDelete('2');
        });

        $('#devBusinessFileDeleteButton3').click(function (e) {
            self.fileDelete('3');
        });
    },
    getFile: function () {
        if (devAppType == 'iOS') {
            //아이폰용
            try {
                webkit.messageHandlers.showAuthority.postMessage("");
            } catch (err) {
                console.log(err);
            }
        } else if (devAppType == 'Android') {
            //안드로이드용
        }
    },
    getLoad: function () {
        if (devAppType == 'iOS') {
            //아이폰용
            try {
                webkit.messageHandlers.initStatusAuthority.postMessage("");
            } catch (err) {
                console.log(err);
            }
        } else if (devAppType == 'Android') {
            //안드로이드용
        }
    },
    FileChangeEvent: function ($file, $fileWrap, $imageWrap, $image) {
        if ($file.val() != "") {
            $fileWrap.hide();
            $imageWrap.show();
            common.util.previewFile($file, $image);
        } else {
            $fileWrap.show();
            $imageWrap.hide();
            $image.attr('src', '');
        }
    },
    fileAttachments: function (num) {
        var $file = $('#devBbsFileText' + num);
        var $fileWrap = $('#devBusinessFileWrap' + num);
        var $imageWrap = $('#devBusinessFileImageWrap' + num);
        var $image = $('#devBusinessFileImage' + num);
        //var $fileDeleteButton = $('#devBusinessFileDeleteButton'+num);

        $file.change(function () {
            if(devAppType == 'iOS' || devAppType == 'Android' ) {
                devPhoto.FileChangeEvent($file, $fileWrap, $imageWrap, $image);
            } else {
                devPhoto.FileChangeEvent($file, $fileWrap, $imageWrap, $image);
            }
        });
    },
    fileDelete: function (num) {
        var $file = $('#devBbsFileText' + num);
        var $fileWrap = $('#devBusinessFileWrap' + num);
        var $imageWrap = $('#devBusinessFileImageWrap' + num);
        var $image = $('#devBusinessFileImage' + num);

        if (common.noti.confirm(common.lang.get('write.customer.file.confirm.delete'))) {
            $file.val('');
            devPhoto.FileChangeEvent($file, $fileWrap, $imageWrap, $image);
        }
    },
    setShowAuthority: function (camera, photo) {
        devPhoto.appCamera = camera;
        devPhoto.appPhoto = photo;
    },
    iosCheck: function (e) {
        if (devPhoto.appCamera == 'N' && devPhoto.appPhoto == 'N') {
            devPhoto.getFile();
        }

        if (devPhoto.appCamera == 'N' && devPhoto.appPhoto == 'N') {
            e.preventDefault();
            return false;
        } else {
            return true;
        }
    },
    run: function () {
        devPhoto.getLoad();
    }
};


$(function () {
    devCustomerQnaObj.run();
    devPhoto.initEvent();
    devPhoto.run();
});

