"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devThirdPartyEasypaymentObj = {
    initLang: function () {
        common.lang.load('common.add.confirm.alert', '신청 하시겠습니까?');
        common.lang.load('common.add.fail.already_exist.alert', '이미 신청하셨습니다.');
        common.lang.load('common.add.success.alert', '신청이 완료 되었습니다.');
    },
    initEvent: function () {
        var self = this;


        $('#kakaoPayModal').click(function () {
            self.kakaopayModal();
        });
    },
    is_click: false,
    kakaoForm: function () {
        var self = this;

        //set validation
        common.validation.set($('[name="company_name"]'), {required: true});
        common.validation.set($('[name="biz_reg_no1"]'), {required: true});
        common.validation.set($('[name="biz_reg_no2"]'), {required: true});
        common.validation.set($('[name="biz_reg_no3"]'), {required: true});
        common.validation.set($('[name="partner_name"]'), {required: true});
        common.validation.set($('[name="company_type"]:checked'), {required: true});
        common.validation.set($('[name="ceo_name"]'), {required: true});
        common.validation.set($('[name="biz_type"]'), {required: true});
        common.validation.set($('[name="biz_item"]'), {required: true});
        common.validation.set($('[name="zipcode"]'), {required: true});
        common.validation.set($('[name="addr1"]'), {required: true});
        common.validation.set($('[name="addr2"]'), {required: true});
        common.validation.set($('[name="tel01"]'), {required: true});
        common.validation.set($('[name="tel02"]'), {required: true});
        common.validation.set($('[name="tel03"]'), {required: true});
        common.validation.set($('[name="email"]'), {required: true});
        common.validation.set($('[name="site_url"]'), {required: true});
        common.validation.set($('[name="products"]'), {required: true});
        common.validation.set($('[name="manager_name"]'), {required: true});
        common.validation.set($('[name="manager_tel01"]'), {required: true});
        common.validation.set($('[name="manager_tel02"]'), {required: true});
        common.validation.set($('[name="manager_tel03"]'), {required: true});
        common.validation.set($('[name="manager_cell_phone01"]'), {required: true});
        common.validation.set($('[name="manager_cell_phone02"]'), {required: true});
        common.validation.set($('[name="manager_cell_phone03"]'), {required: true});
        common.validation.set($('[name="manager_email"]'), {required: true});
        common.validation.set($('[name="corp_reg_no1"]'), {required: true});
        common.validation.set($('[name="corp_reg_no2"]'), {required: true});

        common.inputFormat.set($('input[name=biz_reg_no1], input[name=biz_reg_no2], input[name=biz_reg_no3]'), {'number': true});
        common.inputFormat.set($('input[name=corp_reg_no1], input[name=corp_reg_no1]'), {'number': true});
        common.inputFormat.set($('input[name=tel01], input[name=tel02], input[name=tel03]'), {'number': true});
        common.inputFormat.set($('input[name=manager_tel01], input[name=manager_tel02], input[name=manager_tel03]'), {'number': true});
        common.inputFormat.set($('input[name=manager_cell_phone01], input[name=manager_cell_phone02], input[name=manager_cell_phone03]'), {'number': true});

        $('#devSearchAddressPopup2').click(function () {
            common.pub.open('searchAddress', function (data) {
                $("#devZipCode").val(data.zipcode);
                $("#devAddr1").val(data.address1);
            });
        });

        // 회사유형 - 법인(법인등록번호필수)
        $('[name="company_type"]').change(function () {
            if (this.value == 1) {
                $("#devCorpReg").removeClass("fb-filter__title--ne");
                common.validation.set($('[name="corp_reg_no1"]'), {required: false});
                common.validation.set($('[name="corp_reg_no2"]'), {required: false});
            } else if (this.value == 2) {
                $("#devCorpReg").addClass("fb-filter__title--ne");
                common.validation.set($('[name="corp_reg_no1"]'), {required: true});
                common.validation.set($('[name="corp_reg_no2"]'), {required: true});
            }
        });

        common.form.init(
            $('#devKakaoForm'),
            common.util.getControllerUrl('putKakaopayRegister', 'payment', 'thirdParty'),
            function (formData) {
                if (common.validation.check($('#devKakaoForm'), 'alert', false)) {
                    if(!confirm(common.lang.get('common.add.confirm.alert'))){return false;}
                    return formData;
                } else {
                    self.is_click = false;
                    return false;
                }
            },
            function (response) {
                if (response.result == 'success') {
                    common.noti.alert(common.lang.get('common.add.success.alert'));
                    document.location.reload();
                } else {
                    if (response.result == 'fail') {
                        self.is_click = false;
                        common.noti.alert(response.data);
                    } else if (response.result == 'cidExist') {
                        common.noti.alert(common.lang.get('common.add.fail.already_exist.alert'));
                        document.location.reload();
                    }
                }
            }
        );
    },
    kakaopayModal: function () {
        var self = this;

        common.util.modal.open(
            'html',
            '카카오페이 신청',
            $('#devPgApplyKakaopayModalTpl').html(),
            '',
            function () {
                self.kakaoForm();

                $('#devKakaopaySubmit').click(function () {
                    if (self.is_click == false) {
                        self.is_click = true;
                        $('#devKakaoForm').submit();
                    }
                });
            },
            {width: '1200px', height: '800px'});
    },
    run: function() {
        var self = this;

        self.initLang();
        self.initEvent();

        $('#paycoDetail').click(function () {
            common.util.modal.open('html','페이코 서비스 상세안내',$('.payco').html(),'','',{width: '800px', height: '540px'});
        });
    }
}

$(function(){
    devThirdPartyEasypaymentObj.run();
});