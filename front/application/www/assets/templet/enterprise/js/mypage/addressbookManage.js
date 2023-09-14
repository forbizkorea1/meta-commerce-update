"use strict";
/*--------------------------------------------------------------*
 * 공용변수 선언 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devAddressBookAddPopObj = {
    callbackUpdate: false,
    callbackAdd: false,
    addressBookform: $('#devAddressBookAddForm'),
    initForm: function () {
        var self = this;

        //-----set input format
        common.inputFormat.set($('#devRecipient,#devShippingName'), {'maxLength': 20});
        common.inputFormat.set($('#devPcs2,#devPcs3'), {'number': true, 'maxLength': 4});
        common.inputFormat.set($('#devTel2,#devTel3'), {'number': true, 'maxLength': 4});

        //-----set validation
        common.validation.set($('#devRecipient,#devZip,#devAddress1,#devAddress2,#devPcs1,#devPcs2,#devPcs3'), {'required': true});

        common.form.init(
            self.addressBookform,
            common.util.getControllerUrl('addressBookReplace', 'mypage'),
            function (formObj) {
                if (common.validation.check(formObj, 'alert', false) && confirm(common.lang.get('addressbook.add.confirm'))) {
                    var isBool= true;
                    if($('#devPcs2').val().length < 3) {
                        common.noti.alert('휴대폰 번호 3자리 이상 입력해 주시기 바랍니다.');
                        isBool = false;
                    }
                    if($('#devPcs3').val().length < 4) {
                        common.noti.alert('휴대폰 번호 4자리 이상 입력해 주시기 바랍니다.');
                        isBool = false;
                    }
                    return isBool;
                } else {
                    return false;
                }
            },
            function (res) {
                if(res.result == 'basicAddress'){
                    common.noti.alert(common.lang.get('addressbook.modify.fail.basicAddress'));
                }else {
                    if (res.data.mode == 'update') {
                        if ($.isFunction(self.callbackUpdate)) {
                            self.callbackUpdate();
                        } else {
                            opener.cbReload();
                        }
                    } else {
                        if ($.isFunction(self.callbackAdd)) {
                            self.callbackAdd();
                        } else {
                            opener.cbReload();
                        }
                    }
                    window.close();
                }
            }
        );
    },
    initLang: function () {
        //-----load language
        common.lang.load('addressbook.add.cancel.confirm', '배송지 추가를 취소하시겠습니까?');
        common.lang.load('addressbook.modify.cancel.confirm', '배송지 수정을 취소하시겠습니까?');
        common.lang.load('addressbook.add.confirm', '배송지를 저장하시겠습니까?');
        common.lang.load('addressbook.modify.fail.basicAddress', '기본배송지는 1개 존재해야 합니다.');
    },
    initEvent: function () {
        var self = this;
        // 배송지 저장
        $('#devAddressBookAddBtn').on('click', function () {
            self.addressBookform.submit();
        });

        // 배송지 창 닫기
        $('#devAddressBookAddCancelBtn').on('click', function () {
            var msg;

            if ($('#devMode').val() == 'insert') {
                msg = common.lang.get('addressbook.add.cancel.confirm');
            } else {
                msg = common.lang.get('addressbook.modify.cancel.confirm');
            }

            if (confirm(msg)) {
                window.close();
            }
        });

        //주소 찾기
        $('#devZipPopupButton').on('click', function () {
            common.util.zipcode.popup(function (response) {
                $('#devZip').val(response.zipcode);
                $('#devAddress1').val(response.address1);
            });
        });
    },
    run: function () {
        var self = this;

        self.initLang();
        self.initForm();
        self.initEvent();
    }
}

$(function () {
    devAddressBookAddPopObj.run();
});