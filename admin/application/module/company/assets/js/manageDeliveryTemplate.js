"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devCompanyManageDeliveryTemplateObj = {
    initLang: function () {
// validation 메시지
        common.lang.load('validation.codeName.alert');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');

        common.lang.load('common.delivery.terms.alert', '수량별 할인/할증적용을 입력해주세요.');
    },
    checkValidation: function () {
        var delivery_policy = $('input[name="delivery_policy"]:checked').val();

        common.validation.set($('[name=template_name]'), {'required': true});
        common.validation.set($('[name=is_basic_template]'), {'required': true});
        common.validation.set($('[name=product_sell_type]'), {'required': true});
        common.validation.set($('[name=tekbae_ix]'), {'required': true});

        if(delivery_policy == "2"){
            common.validation.set($('[name=delivery_policy]'), {'required': false});
            common.validation.set($('[name=delivery_price]'), {'required': true});
            common.validation.set($('[name=delivery_price3]'), {'required': false});
            common.validation.set($('[name=delivery_basic_terms3]'), {'required': false});
            common.validation.set($('[name=delivery_cnt_price]'), {'required': false});
            common.validation.set($('.delivery-terms'), {'required': false});
        }else if(delivery_policy == "3"){
            common.validation.set($('[name=delivery_policy]'), {'required': false});
            common.validation.set($('[name=delivery_price]'), {'required': false});
            common.validation.set($('[name=delivery_price3]'), {'required': true});
            common.validation.set($('[name=delivery_basic_terms3]'), {'required': true});
            common.validation.set($('[name=delivery_cnt_price]'), {'required': false});
            common.validation.set($('.delivery-terms'), {'required': false});
        }else if(delivery_policy == "4"){
            common.validation.set($('[name=delivery_policy]'), {'required': false});
            common.validation.set($('[name=delivery_price]'), {'required': false});
            common.validation.set($('[name=delivery_price3]'), {'required': false});
            common.validation.set($('[name=delivery_basic_terms3]'), {'required': false});
            common.validation.set($('[name=delivery_cnt_price]'), {'required': true});
            common.validation.set($('.delivery-terms'), {'required': true});
        } else {
            common.validation.set($('[name=delivery_policy]'), {'required': true});
            common.validation.set($('[name=delivery_price]'), {'required': false});
            common.validation.set($('[name=delivery_price3]'), {'required': false});
            common.validation.set($('[name=delivery_basic_terms3]'), {'required': false});
            common.validation.set($('[name=delivery_cnt_price]'), {'required': false});
            common.validation.set($('.delivery-terms'), {'required': false});
        }

        common.validation.set($('[name=return_shipping_price]'), {'required': true});
        common.validation.set($('[name=exchange_shipping_price]'), {'required': true});

        if($('input:radio[name=delivery_region_use]:checked').val() == '1') {
            if($('input:radio[name=delivery_region_area]:checked').val() == '2') {
                common.validation.set($('[name=delivery_jeju_price]'), {'required': true});
                common.validation.set($('[name=delivery_except_price]'), {'required': false});
            }else if($('input:radio[name=delivery_region_area]:checked').val() == '3') {
                common.validation.set($('[name=delivery_jeju_price]'), {'required': true});
                common.validation.set($('[name=delivery_except_price]'), {'required': true});
            }
        }else {
            common.validation.set($('[name=delivery_jeju_price]'), {'required': false});
            common.validation.set($('[name=delivery_except_price]'), {'required': false});
        }

        if($('input:radio[name="delivery_region_area"]:checked').val() == 2) {
            $('input[name="delivery_jeju_price"]').attr('title', '제주 및 도서산간');
        } else {
            $('input[name="delivery_jeju_price"]').attr('title', '제주 지역');
        }
    },
    method: "put",
    initForm: function () {
        var self = this;
        var company_id = $('input[name=company_id]').val();
        var dt_ix =$('input[name=dt_ix]').val();
        var msg = '';

        if(dt_ix != ''){
            msg = common.lang.get('common.put.success.alert');  //수정
        }else{
            msg = common.lang.get('common.add.success.alert');  //등록
        }

        $("#devTopMenuSaveBtn").on('click', function () {
            common.form.init(
                $('#devForm'),
                common.util.getControllerUrl(self.method, 'manageDeliveryTemplate', 'company'),
                function (formData, $form) {
                    self.checkValidation();
                    if (common.validation.check($('#devForm'), 'alert', false)) {
                        return formData;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        if(company_id != ''){
                            common.noti.alert(msg);
                            location.href = "/company/manageSeller/"+company_id;
                        }else{
                            common.noti.alert(msg);
                            location.href = "/company/listDeliveryTemplate";
                        }

                    } else {
                        console.log(response);
                    }
                }
            );

            $('#devForm').submit();
            return false;
        });
    },
    editor: false,
    editor2: false,
    initEvent: function () {
        var self = this;

        // 변경내역 보기
        $('#devTopMenuHistoryBtn').on('click', function () {
            common.pub.setParams('deliveryTemplate', $('[name="dt_ix"]').val()).open('historyList', false);

            return false;
        });

        //추가지역 배송비  사용유무
        if ($('input:radio[name="delivery_region_use"]:checked').val() == 1) {
            $(".delivery_region").show();
        } else {
            $(".delivery_region").hide();
        }

        // 클릭 이벤트일시
        $("input[name=delivery_region_use]").on("change", function () {
            if ($(this).val() == 1) {
                $(".delivery_region").show();
            } else {
                $(".delivery_region").hide();
            }
        });

        //제주 2 , 3지역
        if ($('input:radio[name="delivery_region_area"]:checked').val() == 2) {
            $(".jeju2").show();
            $(".jeju3").hide();
        } else {
            $(".jeju2").hide();
            $(".jeju3").show();
        }

        // 클릭 이벤트일시
        $("input[name=delivery_region_area]").on("change", function () {
            if ($(this).val() == 2) {
                $(".jeju2").show();
                $(".jeju3").hide();
            } else {
                $(".jeju2").hide();
                $(".jeju3").show();
            }
        });

        self.editor = common.ui.editor('devEditor')
        .setSubType('')
        .setHeight('500px')
        .init();

        self.editor = common.ui.editor('devEditor2')
        .setSubType('')
        .setHeight('500px')
        .init();
    },
    addTerms: function () {
        var self = devCompanyManageDeliveryTemplateObj;

        $(document).on("click", ".devBtnAdd", function () {
            var tb = [
                '<tr>',
                '<td><input type="text" class="fb-filter__text fb-filter__text--40" name="delivery_cnt_terms[]" value="">개 이상, </td>',
                '<td><input type="text" class="fb-filter__text fb-filter__text--40" name="delivery_price_terms[]" value="">원 배송비 적용</td>',
                '<td><input type="button" class="fb-filter__edit devBtnAdd" value="추가"><input type="button" class="fb-filter__delete--gray devBtnDel" value="삭제"></td>',
                '</tr>'
            ].join('');

            $(".devPutTerms").append(tb);
        });

        $(document).on("click", ".devBtnDel", function () {
            if ($(".devPutTerms tr").length > 1) {
                $(this).parent().parent().remove();
            }
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initForm();
        self.addTerms();
    }
}

$(function () {
    devCompanyManageDeliveryTemplateObj.run();
});