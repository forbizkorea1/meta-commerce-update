"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductCommonObj = {
    initLang: function () {
        common.lang.load('product.select.noDate.alert', '검색기간 타입을 선택해주세요.');
    },
    initForm: function () {
        //상품 검색시 다중검색 처리
        $('#devSearchProductFilterText').on('input', function () {
            $(this).val(common.util.convertMultipleSearchText($(this).val()));
        });

        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });
    },
    initEvent: function () {
        //초기화
        $('#devFormReset').click(function () {
            $('#devGridForm').find('.devAddSearchProductCategoryRow').remove();
            common.form.reset($('#devGridForm'));
            setSearechCompany('', '');
            setSearechMd('', '');
            setSearechBrand('', '');
        });

        var setSearechBrand = function (key, text) {
            $('#devBrandIx').val(key);
            $('#devBrandText').val(text);
        }

        var setSearechMd = function (key, text) {
            $('#devMdIx').val(key);
            $('#devMdText').val(text);
        }

        var setSearechCompany = function (key, text) {
            $('#devCompanyId').val(key);
            $('#devCompanyText').val(text);
        }

        //셀러업체 팝업
        $('#devSearchCompanyPopup').click(function () {
            common.pub.open('searchCompany', function (data) {
                setSearechCompany(data.company_id, data.com_name);
            });
        });

        $('#devSearchCompanyReset').click(function () {
            setSearechCompany('', '');
        });

        //MD 팝업
        $('#devSearchMdPopup').click(function () {
            common.pub.open('searchMd', function (data) {
                setSearechMd(data.code, data.name);
            });
        });

        $('#devSearchMdReset').click(function () {
            setSearechMd('', '');
        });

        //브랜드 팝업
        $('#devSearchBrandPopup').click(function () {
            common.pub.open('searchBrand', function (data) {
                setSearechBrand(data.b_ix, data.brand_name);
            });
        });
        $('#devSearchBrandReset').click(function () {
            setSearechBrand('', '');
        });

        //저장
        $('#devFormSubmit').click(function (e) {
            e.preventDefault();

            if ($('[name="startDate"]').val() || $('[name="endDate"]').val()) {
                if ($('select[name=dateType] option:selected').val() == '') {
                    common.noti.alert(common.lang.get('product.select.noDate.alert'));
                    return false;
                }
            }

            $('#devGridForm').submit();
        });
    },
    selectCategory: false,
    initSelectCategory: function () {
        //카테고리 선택
        this.selectCategory = common.ui.selectCategory();
        this.selectCategory
            .setMode('add')
            .init($('#devSelectCategory'));
    },
    run: function () {
        this.initLang();
        this.initForm();
        this.initEvent();
        this.initSelectCategory();
    }
}