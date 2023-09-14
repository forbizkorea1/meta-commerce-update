"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMarketingManageCouponObj = {
    mode: false,
    initLang: function () {
        common.lang.load('grid.brand.label.brand_name', '브랜드명');
        common.lang.load('grid.brand.label.brand_code', '관리코드');
        common.lang.load('grid.company.label.com_name', '업체명');
        common.lang.load('grid.company.label.com_ceo', '대표자명');
        common.lang.load('grid.company.label.com_number', '사업자번호');
        common.lang.load('grid.company.label.com_phone', '전화번호');
        common.lang.load('grid.category.label.cname', '카테고리명');

        common.lang.load('grid.label.act', '관리');

        common.lang.load('common.add.success.alert', '등록이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');

        common.lang.load('common.usedate.validation.alert', '사용기간 종료일이 시작일보다 이전 일 수 없습니다.');
        common.lang.load('common.date.validation.alert', '발급기간 종료일이 시작일보다 이전 일 수 없습니다.');
        common.lang.load('common.grid.validation.alert', '적용 가능 항목을 검색해주세요.');
        common.lang.load('common.group.validation.alert', '발행 그룹 설정을 선택해주세요.');
        common.lang.load('common.limit.validation.alert', '정률(%) 할인설정은 1에서 100까지만 가능합니다.');
    },
    initForm: function () {
        var self = this;
        self.mode = $('#devMode').val();

        common.validation.set($('input[name=cupon_use_sdate], input[name=cupon_use_edate]'), {'required': true});

        common.inputFormat.set($('input[name=haddoffice_rate], input[name=seller_rate], input[name=publish_condition_price], input[name=publish_limit_price], input[name=publish_date_differ], input[name=regist_date_differ]'), {'number': true});

        common.form.init(
            $('#devForm'),
            common.util.getControllerUrl(self.mode, 'manageCoupon', 'marketing'),
            function (formData, $form) {
                if ($('input[name=cupon_acnt]:checked').val() == '1') {
                    common.validation.set($('input[name=publish_name], input[name=haddoffice_rate]'), {'required': true});
                }else {
                    common.validation.set($('input[name=publish_name], input[name=haddoffice_rate], input[name=seller_rate]'), {'required': true});
                }

                if($('input[name=use_product_type]:checked').val() == '4'){
                    var gridList = self.gridObj['4'].getList('all', ['b_ix']);
                    if (gridList.length == 0) {
                        common.noti.alert(common.lang.get('common.grid.validation.alert'));
                        return false;
                    }
                }else if($('input[name=use_product_type]:checked').val() == '2'){
                    var gridList = self.gridObj['2'].getList('all', ['cid']);
                    if (gridList.length == 0) {
                        common.noti.alert(common.lang.get('common.grid.validation.alert'));
                        return false;
                    }
                }else if($('input[name=use_product_type]:checked').val() == '5'){
                    var gridList = self.gridObj['5'].getList('all', ['company_id']);
                    if (gridList.length == 0) {
                        common.noti.alert(common.lang.get('common.grid.validation.alert'));
                        return false;
                    }
                }else if($('input[name=use_product_type]:checked').val() == '3'){
                    var gridList = self.gridObj['3'].getList('all', ['id']);
                    if (gridList.length == 0) {
                        common.noti.alert(common.lang.get('common.grid.validation.alert'));
                        return false;
                    }
                }

                if($('input[name=publish_type]:checked').val() == '4') {
                    var is_check = false;
                    $.each($('input[name="gp_ix[]"]'), function (k, v) {
                        if ($('input[name="gp_ix[]"]').is(":checked") == true) {
                            is_check = true;
                        }
                    });
                    if (is_check === false) {
                        common.noti.alert(common.lang.get('common.group.validation.alert'));
                        return false;
                    }
                }

                if($('input[name=use_date_type]:checked').val() == '1') {
                    common.validation.set($('input[name=use_sdate], input[name=use_edate]'), {'required': false});
                    common.validation.set($('input[name=publish_date_differ]'), {'required': true});
                    common.validation.set($('input[name=regist_date_differ]'), {'required': false});
                }else if($('input[name=use_date_type]:checked').val() == '2') {
                    common.validation.set($('input[name=use_sdate], input[name=use_edate]'), {'required': false});
                    common.validation.set($('input[name=publish_date_differ]'), {'required': false});
                    common.validation.set($('input[name=regist_date_differ]'), {'required': true});
                }else if($('input[name=use_date_type]:checked').val() == '3') {
                    common.validation.set($('input[name=use_sdate], input[name=use_edate]'), {'required': true});
                    common.validation.set($('input[name=publish_date_differ]'), {'required': false});
                    common.validation.set($('input[name=regist_date_differ]'), {'required': false});
                }else{
                    common.validation.set($('input[name=use_sdate], input[name=use_edate]'), {'required': false});
                    common.validation.set($('input[name=publish_date_differ]'), {'required': false});
                    common.validation.set($('input[name=regist_date_differ]'), {'required': false});
                }

                if (!common.validation.check($form, 'alert', false)) {
                    return false;
                }

                //할인 설정 100% 이하 제한
                if($('input[name=cupon_sale_type]:checked').val() == '1') {
                    var haddoffice_rate =  isNaN(parseInt($('input[name=haddoffice_rate]').val())) ? 0 : parseInt($('input[name=haddoffice_rate]').val());
                    var seller_rate =  isNaN(parseInt($('input[name=seller_rate]').val())) ? 0 : parseInt($('input[name=seller_rate]').val());
                    var couponSaleValue = haddoffice_rate + seller_rate;

                    if(couponSaleValue > 100){
                        common.noti.alert(common.lang.get('common.limit.validation.alert'));
                        return false;
                    }
                }

                if($('#devBetweenDatePickerStart').val() > $('#devBetweenDatePickerEnd').val()){
                    common.noti.alert(common.lang.get('common.usedate.validation.alert'));
                    return false;
                }

                if($('#devBetweenDatePickerStart2').val() > $('#devBetweenDatePickerEnd2').val()){
                    common.noti.alert(common.lang.get('common.date.validation.alert'));
                    return false;
                }

                if (self.gridObj['4']) {//브랜드
                    formData.push(common.form.makeData('relationBrandList', self.gridObj['4'].getList('all', ['b_ix'])));
                }
                if (self.gridObj['2']) {//카테고리
                    formData.push(common.form.makeData('relationCategoryList', self.gridObj['2'].getList('all', ['cid'])));
                }
                if (self.gridObj['5']) {//업체
                    formData.push(common.form.makeData('relationCompanyList', self.gridObj['5'].getList('all', ['company_id'])));
                }
                if (self.gridObj['3']) {//상품
                    formData.push(common.form.makeData('relationProductList', self.gridObj['3'].getList('all', ['id'])));
                }
                return formData;
            },
            function (response) {
                if (response.result == 'success') {
                    if (self.mode == 'put') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.add.success.alert'));
                        location.href = common.util.getControllerUrl(response.data.publish_ix, 'manageCoupon', 'marketing');
                    }
                } else if (response.result == 'salePriceFail'){
                    common.noti.alert(common.lang.get('common.limit.validation.alert'));
                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    initEvent: function () {
        var self = this;

        //할인 타입 선택시
        $('input[name=cupon_sale_type]').change(function () {
            if ($(this).val() == '2') {
                $('#devRoundPositionContents').hide();
            } else {
                $('#devRoundPositionContents').show();
            }
        });

        //할인 부담 선택시
        $('input[name=cupon_acnt]').change(function () {
            if ($(this).val() == '2') {
                $('#devSellerSaleContents').show();
            } else {
                $('#devSellerSaleContents').hide();
                $('input[name=seller_rate]').val(0);
                self.setCouponSaleValue();
            }
        });

        //할인 금액 입력시
        $('input[name=haddoffice_rate], input[name=seller_rate]').on('input', function () {
            self.setCouponSaleValue();
        });

        //할인 적용 가능 상품 선택시
        $('input[name=use_product_type]').change(function () {
            self.setUseProductTypeContents();
        });

        //브랜드 검색
        $('#devSearchBrandPopup').click(function () {
            common.pub.open('searchBrand', function (data) {
                self.setUseProductTypeContents([data]);
            });
        });

        //셀러 검색
        $('#devSearchCompanyPopup').click(function () {
            common.pub.open('searchCompany', function (data) {
                self.setUseProductTypeContents([data]);
            });
        });

        //카테고리 선택
        $('#devChoiceCategory').click(function () {
            var data = self.selectCategory.getValue();
            if (data.cid != '') {
                data.path = data.path.join(' > ');
                self.setUseProductTypeContents([data]);
            }
        });

        //상품 검색
        $('#devSearchProductPopup').click(function () {
            common.pub.open('searchProduct', function (datas) {
                self.setUseProductTypeContents(datas);
            });
        });

        //발급 방식 선택시
        $('input[name=issue_type]').change(function () {
            $('.devIssueTypeContents').hide();
            $('.devIssueTypeContents input').prop('disabled', true);
            var $target = $('.devIssueTypeContents[devIssueType=' + $(this).val() + ']');
            $target.find('input').prop('disabled', false);
            $target.show();
        });

        //발급 대상 선택시
        $('input[name=publish_type]').change(function () {
            $('.devPublishTypeContents').hide();
            $('.devPublishTypeContents[devPublishType=' + $(this).val() + ']').show();
        });

        //사용 기간 선택시
        $('input[name=use_date_type]').change(function () {
            $('.devUseDateTypeContents').hide();
            $('.devUseDateTypeContents[devUseDateType=' + $(this).val() + ']').show();
        });

        //사용기간 날짜 설정
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

        //발급 기간 선택시
        $('input[name=disp]').change(function () {
            $('.devDispContents').hide();
            $('.devDispContents[devDispType=' + $(this).val() + ']').show();
        });

        //발급기간 날짜 설정
        common.ui.datePicker($('#devBetweenDatePickerStart2'), {
            endTartget: $('#devBetweenDatePickerEnd2')
            
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd2'), {
            startTartget: $('#devBetweenDatePickerStart2')
            
        });
        common.ui.quickDate('+', $('#devQuickBetweenDate2'), {
            timepicker: true
            , startTartget: $('#devBetweenDatePickerStart2')
            , endTartget: $('#devBetweenDatePickerEnd2')
        });


        /*$('input[name=cupon_div]').change(function () {
            if ($(this).val() == 'C') {
                $('#devPublishMin0').prop('checked', 'true');
                $('#devPublishMax0').prop('checked', 'true');
                // $('#devPublishMin1').attr('disabled', true);
                // $('#devPublishMax1').attr('disabled', true);
                // $('input[name=publish_condition_price]').attr('disabled', true);
                // $('input[name=publish_limit_price]').attr('disabled', true);
                // common.validation.set($('input[name=publish_condition_price], input[name=publish_limit_price]'), {'required': false});
            } else {
                $('#devPublishMin1').attr('disabled', false);
                $('#devPublishMax1').attr('disabled', false);
                $('input[name=publish_condition_price]').attr('disabled', false);
                $('input[name=publish_limit_price]').attr('disabled', false);
                common.validation.set($('input[name=publish_condition_price], input[name=publish_limit_price]'), {'required': true});
            }
        });*/

        //최소 상품금액 설정
        $('input[name="publish_min"]').click(function () {
            if($(this).val() == 'N') {
                $('input[name=publish_condition_price]').attr('disabled', true);
                common.validation.set($('input[name=publish_condition_price]'), {'required': false});
            } else {
                $('input[name=publish_condition_price]').attr('disabled', false);
                common.validation.set($('input[name=publish_condition_price]'), {'required': true});
            }
        });

        //최대 할인금액 설정
        $('input[name="publish_max"]').click(function () {
            if($(this).val() == 'N') {
                $('input[name=publish_limit_price]').val(0);
                $('input[name=publish_limit_price]').attr('disabled', true);
            } else {
                $('input[name=publish_limit_price]').attr('disabled', false);
            }
        });

        $("#publish_condition_price").attr("disabled", true);
        $("#publish_limit_price").attr("disabled", true);


        //쿠폰 종류 선택 시 이벤트 처리
        $('input[name=cupon_div]').on('click',function(){
            var couponDiv = $(this).val();
            if(couponDiv == 'C'){
                $("input[name=cupon_acnt]:input[value='2']").attr('disabled',true);
                $("input[name=cupon_acnt]:input[value='1']").trigger('click');

            }else{
                $("input[name=cupon_acnt]:input[value='2']").attr('disabled',false);
            }
            self.initChangeTitle(couponDiv);
        });

        //저장
        $("#devTopMenuSaveBtn").on('click', function (e) {
            e.preventDefault();
            $("#devForm").submit();
        });
    },
    initChangeTitle: function(couponDiv){
        var self = this;
        $('.devCouponDivChangeText').each(function(){
            var text = $(this).text();
            if(couponDiv == 'C'){
                text = text.replace('상품금액', '결제금액');
                text = text.replace('할인금액', '주문할인금액');
            }else{
                text = text.replace('결제금액', '상품금액');
                text = text.replace('주문할인금액', '할인금액');
            }
            $(this).text(text);
        });
    },
    gridObj: {},
    selectCategory: false,
    initSelectCategory: function () {
        this.selectCategory = common.ui.selectCategory('getLargeCategoryList', 'getSubCategoryList', 'searchCategory', 'pub', 'Separator');
        this.selectCategory.init($('#devCategory'));
    },
    setUseProductTypeContents: function (data) {
        var self = this;
        var $grid, gridConfig, keyColumn;

        if ($('input[name=use_product_type]:checked').val() == '1') {
            $('#devUseProductTypeContents').hide();
        } else {
            if (!data && self.selectCategory == false && $('input[name=use_product_type]:checked').val() == '2') {
                this.initSelectCategory();
            }
            $('#devUseProductTypeContents').show();
        }

        var useProductType = $('input[name=use_product_type]:checked').val();

        $('.devUseProductTypeContents').hide();
        $('.devUseProductTypeContents[devUseProductType=' + useProductType + ']').show();

        switch (useProductType) {
            //전체
            case '1':
                return;
                break;
            //카테고리
            case '2':
                keyColumn = 'cid';
                $grid = $('#devCategoryGrid');
                gridConfig = {
                    columns: [
                        {
                            key: "path",
                            label: common.lang.get('grid.category.label.cname'),
                            width: 200
                        }
                    ]
                };
                break;
            //상품
            case '3':
                keyColumn = 'id';
                if (!self.gridObj[useProductType]) {
                    var choiceProduct = common.ui.choiceProduct();
                    choiceProduct.initGrid($('#devChoiceProduct'));
                    self.gridObj[useProductType] = choiceProduct;
                }
                break;
            //브랜드
            case '4':
                keyColumn = 'b_ix';
                $grid = $('#devBrandGrid');
                gridConfig = {
                    columns: [
                        {
                            key: "brand_name",
                            label: common.lang.get('grid.brand.label.brand_name'),
                            width: 200
                        },
                        {
                            key: "brand_code",
                            label: common.lang.get('grid.brand.label.brand_code'),
                            width: 200
                        }
                    ]
                };
                break;
            //셀러
            case '5':
                keyColumn = 'company_id';
                $grid = $('#devCompanyGrid');
                gridConfig = {
                    columns: [
                        {key: "com_name", label: common.lang.get('grid.company.label.com_name'), width: 200},
                        {key: "com_ceo", label: common.lang.get('grid.company.label.com_ceo'), width: 100},
                        {
                            key: "com_number",
                            label: common.lang.get('grid.company.label.com_number'),
                            width: 120,
                            align: 'center'
                        },
                        {
                            key: "com_phone",
                            label: common.lang.get('grid.company.label.com_phone'),
                            width: 120,
                            align: 'center'
                        },
                    ]
                };
                break;
        }

        if (self.gridObj[useProductType]) {
            grid = self.gridObj[useProductType];
        } else {
            //그리드 세팅 안되어 있으면 세팅
            var grid = common.ui.grid();
            gridConfig.columns.push({
                key: "act",
                label: common.lang.get('grid.label.act'),
                align: 'center',
                width: 150,
                formatter: function (data) {
                    return [
                        '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> '
                    ].join('');
                }
            });

            grid.setGrid($grid, gridConfig);

            // 삭제 버튼 이벤트
            $grid.find('[data-ax5grid-container="body"]').on('click', '.devGridDataDel', function (e) {
                e.preventDefault();
                grid.deleteRow($(this).data('idx'));
            });

            self.gridObj[useProductType] = grid;
        }

        if (data) {
            var selectIdList = grid.getList('all', [keyColumn]);
            var addData = [];
            $.each(data, function () {
                if (selectIdList.indexOf(this[keyColumn]) < 0) {
                    addData.push(this);
                }
            });
            grid.addContent(addData);
        }
    },
    setCouponSaleValue: function () {
        var haddofficeRate = parseInt($('input[name=haddoffice_rate]').val());
        var sellerRate = parseInt($('input[name=seller_rate]').val());
        if (!haddofficeRate) {
            haddofficeRate = 0;
        }
        if (!sellerRate) {
            sellerRate = 0;
        }
        $('input[name=cupon_sale_value]').val(haddofficeRate + sellerRate);
    },
    initUseProductTypeContents: function () {
        var self = this;
        var datas;
        if (relationBrandList && relationBrandList.length > 0) {
            datas = relationBrandList;
        }
        if (relationCategoryList && relationCategoryList.length > 0) {
            datas = relationCategoryList;
        }
        if (relationCompanyList && relationCompanyList.length > 0) {
            datas = relationCompanyList;
        }
        if (relationProductList && relationProductList.length > 0) {
            datas = relationProductList;
        }
        self.setUseProductTypeContents(datas);
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initForm();
        self.initUseProductTypeContents();
        self.initSelectCategory();
    }
}

$(function () {
    devMarketingManageCouponObj.run();
});