"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
/* 본사 Company */
var devCompanyManageCompanyObj = {
    devTap: '#devCompanyInfo',
    isFlag: true,
    initTab: function () {
        var self = this;
        common.ui.tap($('#devTap'), function (selector) {
            self.devTap = selector;
        });
        $('#devMdInfo').hide();
        $('#devShopInfo').hide();
        $('#devSumPriceInfo').hide();
        $('#devMemberInfo').hide();
    },
    initFormat: function () {
        common.inputFormat.set($('.input-num'), {'number': true});
    },
    checkValidation: function () {
        var self = this;
        //사업자 정보 탭
        if (self.devTap == '#devCompanyInfo') {
            common.validation.reset($(self.devTap + 'Form'));
            common.validation.set($('[name=com_name]'), {'required': true});
            common.validation.set($('[name=com_ceo]'), {'required': true});
            common.validation.set($('[name=com_number_1]'), {'required': true});
            common.validation.set($('[name=com_number_2]'), {'required': true});
            common.validation.set($('[name=com_number_3]'), {'required': true});
            common.validation.set($('[name=com_business_status]'), {'required': true});
            common.validation.set($('[name=com_business_category]'), {'required': true});
            common.validation.set($('[name=com_phone1]'), {'required': true});
            common.validation.set($('[name=com_phone2]'), {'required': true});
            common.validation.set($('[name=com_phone3]'), {'required': true});
            common.validation.set($('[name=com_email]'), {'required': true});
        }

        //상점 기본 정보 탭
        if (self.devTap == '#devShopInfo') {
            common.validation.reset($(self.devTap + 'Form'));
            common.validation.set($('[name=shop_name]'), {'required': true});

            if ($("[name=cs_phone_type]:checked").val() == "1") {
                common.validation.set($('[name=cs_phone2]'), {'required': true});
                common.validation.set($('[name=cs_phone3]'), {'required': true});
            } else {
                common.validation.set($('[name=cs_phone1]'), {'required': true});
                common.validation.set($('[name=cs_phone2]'), {'required': true});
                common.validation.set($('[name=cs_phone3]'), {'required': true});
            }

            common.validation.set($('[name=officer_name]'), {'required': true});
            common.validation.set($('[name=officer_email]'), {'required': true});
        }

        //정산탭
        if (self.devTap == '#devSumPriceInfo') {
            common.validation.reset($(self.devTap + 'Form'));
            common.validation.set($('[name=ac_delivery_type]'), {'required': true});
            common.validation.set($('[name=ac_expect_date]'), {'required': true});
            common.validation.set($('[name=ac_term_div]'), {'required': true});

            if ($("[name=ac_term_div]").val() == "1") {
                common.validation.set($('[name=ac_term_date1]'), {'required': true});
            } else if ($("[name=ac_term_div]").val() == "2") {
                common.validation.set($('[name=ac_term_date1]'), {'required': true});
                common.validation.set($('[name=ac_term_date2]'), {'required': true});
            } else if ($("[name=ac_term_div]").val() == "3") {
                common.validation.set($('[name=ac_term_date_week]'), {'required': true});
            }

            common.validation.set($('[name=basic_bank]'), {'required': true});
            common.validation.set($('[name=holder_name]'), {'required': true});
            common.validation.set($('[name=bank_num]'), {'required': true});
        }

        //개인정보
        if (self.devTap == '#devMemberInfo') {
            console.log(self.devTap);
            common.validation.reset($(self.devTap + 'Form'));
            common.validation.set($('[name=name]'), {'required': true});
            common.validation.set($('[name=id]'), {'required': true});
            common.validation.set($('[name=mail]'), {'dataFormat': 'email'});
            common.validation.set($('[name=pcs_1]'), {'required': true});
            common.validation.set($('[name=pcs_2]'), {'required': true});
            common.validation.set($('[name=pcs_3]'), {'required': true});
            common.validation.set($('#devCompareUserPassword'), {'required': true, 'compare': '#devUserPassword'});
        }
    },
    initEvent: function () {
        var self = this;

        $("#cs_phone_type_1, #cs_phone_type_0").on("click", function () {
            if ($(this).val() == 0) {
                $("input[name=cs_phone1]").show();
            } else {
                $("input[name=cs_phone1]").hide();
            }
        });
        if (!$("input[name=cs_phone1]").val()) {
            $("#cs_phone_type_1").click();
        }

        $("#devDDT").hide();
        if ($("input[name=delivery_deadline_yn]:checked").val() == "Y") {
            $("#devDDT").show();
        }
        $("input[name=delivery_deadline_yn]").on("change", function () {
            if ($("input[name=delivery_deadline_yn]:checked").val() == "Y") {
                $("#devDDT").show();
            } else {
                $("#devDDT").hide();
            }
        });


        $("#devCommission").hide();
        if ($("input[name=account_div]:checked").val() == "S") {
            $("#devCommission").show();
        }

        $("input[name=account_div]").on("change", function () {
            if ($("input[name=account_div]:checked").val() == "S") {
                $("#devCommission").show();
            } else {
                $("#devCommission").hide();
            }
        });


    },
    initSelectBox: function () {
        //initSelectValue select
        $("select[name=ac_delivery_type]").val($("select[name=ac_delivery_type]").attr('item')).prop("selected", true);
        if ($("select[name=ac_delivery_type]").attr('item') == 0) {
            $("select[name=ac_delivery_type]").val("").prop("selected", true);
        }
        $("select[name=ac_expect_date]").val($("select[name=ac_expect_date]").attr('item')).prop("selected", true);

        $("select[name=delivery_deadline_hour]").val($("select[name=delivery_deadline_hour]").attr('item')).prop("selected", true);
        $("select[name=delivery_deadline_minute]").val($("select[name=delivery_deadline_minute]").attr('item')).prop("selected", true);

        $("select[name=ac_term_div]").val($("select[name=ac_term_div]").attr('item')).prop("selected", true);
        $("select[name=ac_term_date1]").val($("select[name=ac_term_date1]").attr('item')).prop("selected", true);
        $("select[name=ac_term_date2]").val($("select[name=ac_term_date2]").attr('item')).prop("selected", true);
        $("select[name=ac_term_date_week]").val($("select[name=ac_term_date_week]").attr('item')).prop("selected", true);
        $("select[name=basic_bank]").val($("select[name=basic_bank]").attr('item')).prop("selected", true);


        //월1회
        if ($("select[name=ac_term_div]").attr('item') == 1) {
            $("select[name=ac_term_date1]").show();
            $("select[name=ac_term_date2]").hide();
            $("select[name=ac_term_date_week]").hide();
        }
        //월2회
        if ($("select[name=ac_term_div]").attr('item') == 2) {
            $("select[name=ac_term_date1]").show();
            $("select[name=ac_term_date2]").show();
            $("select[name=ac_term_date_week]").hide();
        }
        //주1회
        if ($("select[name=ac_term_div]").attr('item') == 3) {
            $("select[name=ac_term_date1]").hide();
            $("select[name=ac_term_date2]").hide();
            $("select[name=ac_term_date_week]").show();
        }
        $("select[name=ac_term_div]").on("change", function () {
            //월1회
            if ($("select[name=ac_term_div] option:selected").val() == 1) {
                $("select[name=ac_term_date1]").show();
                $("select[name=ac_term_date2]").hide();
                $("select[name=ac_term_date_week]").hide();
            }
            //월2회
            if ($("select[name=ac_term_div] option:selected").val() == 2) {
                $("select[name=ac_term_date1]").show();
                $("select[name=ac_term_date2]").show();
                $("select[name=ac_term_date_week]").hide();
            }
            //주1회
            if ($("select[name=ac_term_div] option:selected").val() == 3) {
                $("select[name=ac_term_date1]").hide();
                $("select[name=ac_term_date2]").hide();
                $("select[name=ac_term_date_week]").show();
            }
        });
    },
    initForm: function () {
        var self = this;

        common.form.init(
                $(self.devTap + 'Form'),
                common.util.getControllerUrl('put', 'manageCompany', 'company'),
                function (formData) {                    
                    return self.checkValidation();
                    //return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    } else {
                        common.noti.alert(response.result);
                    }
                }
        );

    },
    initSizeLimit: function (){
      $("[name=com_number_1]").attr("maxlength", 5);
      $("[name=com_number_2]").attr("maxlength", 5);
      $("[name=com_number_3]").attr("maxlength", 5);
      
      $("[name=corporate_number_1]").attr("maxlength", 10);
      $("[name=corporate_number_2]").attr("maxlength", 10);
      
      $("[name=com_phone1]").attr("maxlength", 4);
      $("[name=com_phone2]").attr("maxlength", 4);
      $("[name=com_phone3]").attr("maxlength", 4);
      
      $("[name=com_mobile_1]").attr("maxlength", 4);
      $("[name=com_mobile_2]").attr("maxlength", 4);
      $("[name=com_mobile_3]").attr("maxlength", 4);
      
      $("[name=com_fax_1]").attr("maxlength", 4);
      $("[name=com_fax_2]").attr("maxlength", 4);
      $("[name=com_fax_3]").attr("maxlength", 4);
      
      $("[name=com_zip]").attr("maxlength", 6);

      $("[name=tel_1]").attr("maxlength", 4);
      $("[name=tel_2]").attr("maxlength", 4);
      $("[name=tel_3]").attr("maxlength", 4);

      $("[name=birthday_1]").attr("maxlength", 4);
      $("[name=birthday_2]").attr("maxlength", 4);
      $("[name=birthday_3]").attr("maxlength", 4);

      $("[name=pcs_1]").attr("maxlength", 4);
      $("[name=pcs_2]").attr("maxlength", 4);
      $("[name=pcs_3]").attr("maxlength", 4);

      $("[name=mail]").attr("maxlength", 255);
      $("[name=zip]").attr("maxlength", 6);

    },
    initPub: function () {
        //주소
        $('#devSearchAddressPopup1').click(function () {
            common.pub.open('searchAddress', function (data) {
                $("input[name=zip]").val(data.zipcode);
                $("input[name=addr1]").val(data.address1);
            });
        });
        $('#devSearchAddressPopup2').click(function () {
            common.pub.open('searchAddress', function (data) {
                $("input[name=com_zip]").val(data.zipcode);
                $("input[name=com_addr1]").val(data.address1);
            });
        });
    },
    submitEvent: function () {
        var self = this;
        $(".devSave").on('click', function () {
            if(self.isFlag == true){
                common.form.init(
                    $(self.devTap + 'Form'),
                    common.util.getControllerUrl('put', 'manageCompany', 'company'),
                    function (formData) {
                        self.checkValidation();
                        if (common.validation.check($(self.devTap + 'Form'), 'alert', false)) {
                            return formData;
                        } else {
                            return false;
                        }
                    },
                    function (response) {
                        if (response.result == 'success') {
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                            document.location.reload();
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                );

                $(self.devTap + 'Form').submit();
            }
        });
    },
    initLang: function () {
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.validation.fail', '{title} 은 필수 값입니다.');
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initFormat();
        self.initTab();
        self.initForm();
        self.submitEvent();
        self.initSelectBox();
        self.initPub();
        self.initSizeLimit();
    }
}

$(function () {
    devCompanyManageCompanyObj.run();
});