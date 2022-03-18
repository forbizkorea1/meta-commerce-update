"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreSmsPointObj = {
    initLang: function () {
        common.lang.load('msg.select.package', '충전 패키지를 선택하여 주십시오.');
        common.lang.load('msg.save.complete', '사업자정보를 저장하였습니다.');
        common.lang.load('msg.order.complete', 'SMS 충전 완료하였습니다.');
        //common.lang.load('msg.pay.exist', '메타페이 이용약관의 동의가 필요합니다.');
    },
    modalHtml: false,
    payModalHtml: false,
    targetNum : 1,
    modalType: 'n',
    sgIx : false,
    companyModal: function (mode, data) {
        var self = this;
        var modalTitle = '사업자정보 ' + (mode == 'add' ? '등록' : '수정');

        // 모달 설정
        common.util.modal.open(
                'html',
                modalTitle,
                self.modalHtml,
                '', '',
                {width: '520px', height: '650px'}
        );

        var $modalForm = $('#devCompanyForm');

        // 우편번호 검색
        $('#devZipBtn').on('click', function () {
            common.pub.open('searchAddress', function (data) {
                $('[name="com_zip"]').val(data.zipcode);
                $('[name="com_addr1"]').val(data.address1);
                $('[name="com_addr2"]').val('');
            });
        });

        // 폼검증
        common.validation.set($('[name="com_number"]'), {required: true});
        common.validation.set($('[name="com_ceo"]'), {required: true});
        common.validation.set($('[name="com_name"]'), {required: true});
        common.validation.set($('[name="com_zip"]'), {required: true});
        common.validation.set($('[name="com_addr1"]'), {required: true});
        common.validation.set($('[name="com_addr2"]'), {required: true});
        common.validation.set($('[name="com_business_status"]'), {required: true});
        common.validation.set($('[name="com_business_category"]'), {required: true});
        common.validation.set($('[name="customer_name"]'), {required: true});
        common.validation.set($('[name="customer_mail"]'), {required: true});
        common.validation.set($('[name="customer_phone"]'), {required: true});

        // 모달 설정
        common.form.init(
                $modalForm,
                common.util.getControllerUrl('putCompany', 'smsPoint', 'store'),
                function (formData) {
                    if (common.validation.check($modalForm, 'alert', false)) {
                        return formData;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('msg.save.complete'));
                        common.util.modal.close();
                    } else {
                        console.log(response);
                    }
                }
        );

        return false;
    },
    initCompanyModal: function () {
        var self = this;

        if (self.modalHtml == false) {
            self.modalHtml = common.util.getHtml('#devCompanyModalTpl');

            // 사업자정보 버튼 이벤트
            $('#devCompanyInfo').on('click', function () {
                self.companyModal($(this).data('mode'));
                return false;
            });
        }
    },
    initMetaPayModal: function () {
        var self = this;

        if (self.payModalHtml== false) {
            self.payModalHtml = common.util.getHtml('#devMetaPayModalTpl');

            // 사업자정보 버튼 이벤트
            $('#devMetaPayInfo').on('click', function () {
                var sgIx = $('[name="sg_ix[]"]:checked').val();

                if(sgIx) {
                    var data = new Array();
                    data['sgIx'] = sgIx;
                    data['sp_name'] = $('input[name="product['+sgIx+'][sp_name]"]').val();
                    data['offer'] = $('input[name="product['+sgIx+'][offer]"]').val();
                    data['add_offer'] = $('input[name="product['+sgIx+'][add_offer]"]').val();
                    data['sp_price'] = $('input[name="product['+sgIx+'][sp_price]"]').val();

                    common.payment.meta.modal(self.payModalHtml, $(this).data('mode'), data);
                }else{
                    common.noti.alert(common.lang.get('msg.select.package'));
                }


                return false;
            });
        }
    },
    initEvent: function () {
        // 충전하기 버튼
        $('#devSmsCharge').on('click', function () {
            var sgIx = $('[name="sg_ix"]:checked').val();

            // common.ajax(common.util.getControllerUrl('putService', 'smsPoint', 'store'),
            //     {sg_ix: sgIx},
            //     function () {
            //         // 전송전 데이타 검증
            //         return true;
            //     },
            //     function (response) {
            //         // 전송후 결과 확인
            //         if (response.result == 'success') {
            //             common.noti.alert(common.lang.get('msg.order.complete'));
            //             self.grid.reload();
            //         } else {
            //             common.noti.alert(response.result);
            //         }
            //     }
            // );
        });
    },
    run: function () {
        var self = this;

        // 언어 설정
        self.initLang();
        // 이벤트 설정
        self.initEvent();
        // 사업자정보 모달
        self.initCompanyModal();
        //metaPay 모달
        self.initMetaPayModal();
        //self.initNumPad([1,2,3,4,5,6,7,8,9,0,-1,-1]);
    }
}

$(function () {
    devStoreSmsPointObj.run();
});