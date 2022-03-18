"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devShipPlaceInfoObj = {
    initLang: function () {
        // validation 메시지
        common.lang.load('validation.codeName.alert');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
    },
    devTap: "#devShipPlaceInfoForm",
    method: 'putPlaceInfo',
    checkValidation: function () {
        var self = this;
        common.validation.set($('[name=addr_name]'), {'required': true});
        common.validation.set($('[name=addr_phone_1]'), {'required': true});
        common.validation.set($('[name=addr_phone_2]'), {'required': true});
        common.validation.set($('[name=addr_phone_3]'), {'required': true});
        common.validation.set($('[name=com_zip]'), {'required': true});
        common.validation.set($('[name=com_addr1]'), {'required': true});
        common.validation.set($('[name=com_addr2]'), {'required': true});
    },
    initForm: function () {
        var self = this;
        $(".devShipPlaceInfoSave").on('click', function () {
            common.form.init(
                $(self.devTap),
                common.util.getControllerUrl(self.method, 'listDeliveryTemplate', 'company'),
                function (formData) {
                    self.checkValidation();

                    if (common.validation.check($(self.devTap), 'alert', false)) {
                        return formData;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    } else {
                        common.noti.alert(response.result);
                    }
                }
            );

            $(self.devTap).submit();
        });
    },
    initPub: function () {
        //주소
        $('.devSearchAddressPopup1').click(function () {
            common.pub.open('searchAddress', function (data) {
                $("#devShiZipCode").val(data.zipcode);
                $("#devShiAddress").val(data.address1);
            });
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initForm();
        self.initPub();
    }
}

$(function () {
    devShipPlaceInfoObj.run();
});