"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMarketingManageSpecialDiscountObj = {
    method: 'add',
    groupCode: 1,
    ix: $('[name="dc_ix"]').val(),
    initLang: function () {
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.not.alert', '할인상품을/를 선택해 주세요.');

        common.lang.load('common.rate.check.alert', '정률할인은 100% 를 넘길 수 없습니다.');
    },
    initEvent: function () {
        var self = this;

        if (self.ix) {
            self.method = 'put';
        }

        self.groupTpl = Handlebars.compile(common.util.getHtml('#devBasicGroupTpl'));

        if (self.method == 'add') {
            self.appendGroupTemplate({});
        } else {
            $.each(productGroupListData, function (k, data) {
                self.appendGroupTemplate(data); //상품그룹별 set 바인딩
            });
        }

        //상품그룹 추가
        $(document).on('click', '.devGroupAddBtn', function (e) {
            self.appendGroupTemplate({});
        });

        //상품그룹 삭제
        $(document).on('click', '.devGroupDelBtn', function (e) {
            $(this).closest('.devGroupSection').remove();
            self.groupCode--;
        });

        //저장
        $('#devTopMenuSaveBtn').on('click', function () {
            $('#devDisplayForm').submit();
            return false;
        });

        //할인 타입 선택시
        $('input[name=discount_sale_type]').change(function () {
            if ($(this).val() == '2') {
                $('#devRoundPositionContents').hide();
            } else {
                $('#devRoundPositionContents').show();
            }
        });

        //회원 그룹 선택시
        $('input[name=member_target]').change(function () {
            $('.devPublishTypeContents').hide();
            $('.devPublishTypeContents[devPublishType=' + $(this).val() + ']').show();
        });

        //할인 금액 입력시
        $('input[name=headoffice_rate], input[name=seller_rate]').on('input', function () {
            self.setSaleRateValue();
        });
    },
    setSaleRateValue: function () {
        var headofficeRate = parseInt($('input[name=headoffice_rate]').val());
        var sellerRate = parseInt($('input[name=seller_rate]').val());
        if (!headofficeRate) {
            headofficeRate = 0;
        }
        if (!sellerRate) {
            sellerRate = 0;
        }
        $('input[name=sale_rate]').val(headofficeRate + sellerRate);
    },
    groupTpl: false,
    appendGroupTemplate: function (data) {
        var self = this;

        var groupCode = self.groupCode++;
        data['group_code'] = groupCode;

        //삭제 버튼 노출 여부
        if (groupCode != 1) {
            data['delBtnBool'] = true;
        }

        //템플릿 추가
        var $targetGroup = $(self.groupTpl(data));
        $('#devGroupContents').append($targetGroup);

        //전시상품
        var choiceProduct = self.setChoiceProductObj(groupCode);
        choiceProduct.init($targetGroup.find('.devChoiceProduct'));
        $targetGroup.find('.devAddChoiceProductButton').click(function () {
            common.pub.open('searchProduct', function (datas) {
                choiceProduct.addContent(datas);
            });
        });
        if (data.productList) {
            choiceProduct.setContent(data.productList);
        }

        //그룹 폼 필수값 처리
        common.validation.set($targetGroup.find('[name=group_name]'), {'required': true});
        common.validation.set($targetGroup.find('[name=commission]'), {'required': true});
        common.validation.set($targetGroup.find('[name=headoffice_rate]'), {'required': true});
        common.validation.set($targetGroup.find('[name=seller_rate]'), {'required': true});

        //form 데이터 바인드
        common.form.dataBind($targetGroup.find('.devGroupForm'), data);
    },
    choiceProductObj: {},
    setChoiceProductObj: function (groupCode) {
        var self = this;
        self.choiceProductObj[groupCode] = common.ui.choiceProduct();
        return self.getChoiceProductObj(groupCode);
    },
    getChoiceProductObj: function (groupCode) {
        var self = this;
        return self.choiceProductObj[groupCode];
    },
    initForm: function () {
        var self = this;

        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: true
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
            , timepicker: true
        });
        common.ui.quickDate('+', $('#devQuickBetweenDate'), {
            timepicker: true
            , startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });

        common.validation.set($('[name="is_use"]'), {'required': true});
        common.validation.set($('[name="discount_sale_title"]'), {'required': true});
        common.validation.set($('[name="discount_use_sdate"]'), {'required': true});
        common.validation.set($('[name="discount_use_edate"]'), {'required': true});

        common.form.init($('#devDisplayForm'), common.util.getControllerUrl(self.method, 'manageDiscount', 'marketing'), function (formData, $form) {
                if (!common.validation.check($form, 'alert', false)) {
                    return false;
                }
                var groupValidationBool = true;
                var groupRateBool = true;
                var groupData = [];
                //그룹 for문 돌리기
                $('.devGroupForm').each(function () {
                    var $groupForm = $(this);

                    //'할인상품'이 지정되지 않았을때, return false
                    if (self.convertFormData($groupForm).productIds.length === 0){
                        common.noti.alert(common.lang.get('common.not.alert'));
                        groupValidationBool = false;
                        return false;
                    }

                    if (!common.validation.check($groupForm, 'alert', false)) {
                        groupValidationBool = false;
                        return false;
                    }

                    var discountType = $($groupForm).find('input[name=discount_sale_type]:checked').val();
                    var saleRate =  isNaN(parseInt($($groupForm).find('input[name=sale_rate]').val())) ? 0 : parseInt($($groupForm).find('input[name=sale_rate]').val());

                    if(discountType == '1'){
                        if(saleRate > 100){
                            groupRateBool = false;
                            return false;
                        }
                    }
                    //그룹 데이터 생성
                    groupData.push(self.convertFormData($groupForm));
                });
                //그룹 필수값 false 시 submit 안됨
                if (!groupValidationBool) {
                    return false;
                }

                if(groupRateBool === false){
                    common.noti.alert(common.lang.get('common.rate.check.alert'));
                    return false;
                }

                //그룹 데이터 추가
                formData.push(common.form.makeData('groupData', groupData));
                return formData;
            },
            function (response) {
                if (response.result == 'success') {
                    if (self.method == 'add') {
                        common.noti.alert(common.lang.get('common.add.success.alert'));
                        location.href = "/marketing/manageSpecialDiscount/" + response.data.ix;
                    } else {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                        document.location.reload();
                    }
                } else if(response.result == 'saleRateFail'){
                    common.noti.alert(common.lang.get('common.rate.check.alert'));
                } else {
                    common.noti.alert(response.result);
                }
            }, function () {
                console.log(this);
            });
    },
    convertFormData: function ($form) {
        var self = this;
        var dataArray = $form.serializeArray();
        var data = {};
        $.each(dataArray, function (k, v) {
            data[v.name] = v.value;
        });
        data['productIds'] = self.getChoiceProductObj(data['group_code']).getList('all', ['id']);
        return data;
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initForm();
    }
}

$(function () {
    devMarketingManageSpecialDiscountObj.run();
});