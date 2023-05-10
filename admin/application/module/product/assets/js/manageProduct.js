"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductManageProductObj = {
    common: {
        method: 'add',
        pid: $('[name="id"]').val(),
        initLang: function () {
            common.lang.load('common.add.success.alert', '상품 등록 완료되었습니다.');
            common.lang.load('common.put.success.alert', '상품 수정 완료되었습니다.');
            common.lang.load('common.optionSavefail.error.alert', '옵션의 정가와 판매가가 0원이 될 수 없으며, 정가가 판매가와 같거나 커야 합니다.');
            common.lang.load('common.addOptionSavefail.error.alert', '추가옵션의 정가와 판매가가 0원이 될 수 없으며, 정가가 판매가와 같거나 커야 합니다.');
            common.lang.load('common.not.basicCid.alert', '카테고리를 선택해주세요.');
            common.lang.load('common.not.optionGridData.alert', '상품 옵션을 추가해주세요.');
            common.lang.load('common.not.addOptionGridData.alert', '추가구성 상품 옵션을 추가해주세요.');
            common.lang.load('common.put.delete.alert', '삭제 되었습니다.');
            common.lang.load('common.not.delete.alert', '상품을 삭제 할 수 없습니다. (판매상태가 판매금지 또는 판매종료 일때 삭제 가능)');
            common.lang.load('common.confirm.delete.alert', '정말로 삭제 하시겠습니까?');
            common.lang.load('common.not.status.alert', '쇼핑몰에 판매중인 상품만 확인 가능합니다.');
        },
        showSaveBtn: function() {
            $('#devTopMenuSaveBtn').show();
        },
        initForm: function () {
            var self = devProductManageProductObj.common;
            var selfDetailAndNotice = devProductManageProductObj.detailAndNotice;
            var selfEtcInformation = devProductManageProductObj.etcInformation;
            var selfOption = devProductManageProductObj.option;
            var selfAddOption = devProductManageProductObj.addOption;

            //판매방식/카테고리
            common.validation.set($('[name="admin"]'), {'required': true});
            common.validation.set($('[name="state"]'), {'required': true});
            common.validation.set($('[name="is_sell_date"]'), {'required': true});
            common.validation.set($('[name="disp"]'), {'required': true});

            //기본정보
            common.validation.set($('[name="pname"]'), {'required': true});
            common.validation.set($('[name="surtax_yorn"]'), {'required': true});
            if ($("input[name=delivery_type]:checked").val() == 2) { //개별 배송
                common.validation.set($('#deliverySel2'), {'required': true});
                common.validation.set($('#deliverySel1'), {'required': false});
            } else {
                common.validation.set($('#deliverySel2'), {'required': false});
                common.validation.set($('#deliverySel1'), {'required': true});
            }

            //판매정보
            common.validation.set($('[name="coprice"]'), {'required': true});
            common.validation.set($('[name="wholesale_price"]'), {'required': true});
            common.validation.set($('[name="wholesale_sellprice"]'), {'required': true});
            common.validation.set($('[name="listprice"]'), {'required': true});
            common.validation.set($('[name="sellprice"]'), {'required': true});
            common.validation.set($('[name="stock_use_yn"]'), {'required': true});
            common.validation.set($('[name="option_name"]'), {'required': true});

            //배송정보
            common.validation.set($('[name="delivery_template"]'), {'required': true});
            

            if (self.pid) {
                self.method = 'put';
            }

            if (productType == constant_productGiftType) {
                $('.devGift_area').hide();
            } else {
                $('.devGift_area').show();
            }

            // 입력/수정폼 설정
            common.form.init(
                $('#devProductForm'),
                common.util.getControllerUrl(self.method, 'manageProduct', 'product'),
                function (formData, $form) {
                    //상품정보고시
                    if ($('[name="mandatory_use"]:checked').val() == 'Y') {
                        var noticeGridData = selfDetailAndNotice.noticeGrid.getList('all', ['mi_ix', 'detail_code', 'mid_title', 'mid_desc']);
                        if (noticeGridData != '' && noticeGridData != false) {
                            formData.push(common.form.makeData('noticeGridData', noticeGridData));
                        }
                    }

                    //디스플레이
                    var displayGridData = selfEtcInformation.displayGrid.getList();
                    if (displayGridData != '' && displayGridData != false) {
                        formData.push(common.form.makeData('displayGridData', displayGridData));
                    }

                    //삭제된 디스플레이 정보 넘기기
                    if(selfEtcInformation.deleteDisplayGridList.length > 0){
                        formData.push(common.form.makeData('deleteDisplayGridList', selfEtcInformation.deleteDisplayGridList));
                    }

                    //기타정보 관련상품
                    var relProductGridData = selfEtcInformation.relProduct.getList();
                    if (relProductGridData != '' && relProductGridData != false) {
                        formData.push(common.form.makeData('relProductGridData', relProductGridData));
                    }

                    //상품사은품 숨김처리 요청(필요시 오픈)
                    // //상품사은품
                    // var relGiftProductGridData = selfEtcInformation.relGiftProduct.getList();
                    // if (relGiftProductGridData != '' && relGiftProductGridData != false) {
                    //     formData.push(common.form.makeData('relGiftProductGridData', relGiftProductGridData));
                    // }

                    //옵션
                    var optionGridData = selfOption.optionGrid.getList();
                    if ($('[name="option_name"]').val() != '' && optionGridData == false) {
                        common.noti.alert(common.lang.get('common.not.optionGridData.alert'));
                        self.showSaveBtn();
                        return false;
                    }

                    if (optionGridData != '' && optionGridData != false) {
                        if ($("[name='option_stock_modify']").prop('checked') == false) {
                            $.each(optionGridData, function (i, v) {
                                delete optionGridData[i].option_stock;
                            });
                        }
                        formData.push(common.form.makeData('optionGridData', optionGridData));
                    }

                    //추가옵션구성
                    var addOptionData = selfAddOption.addOptionObj;
                    var addOptionGridListArray = new Array;
                    $.each(addOptionData, function (k, v) {
                        if (v) {
                            if (v.getList().length > 0) {
                                //추가구성 상품 옵션이 있으면 추가구성상품옵션명 체크
                                common.validation.set($('[name="add_option_name[]"]'), {'required': true});

                                addOptionGridListArray[k] = v.getList();
                            }
                        }
                    });

                    //옵션을 추가했다면 옵션명체크
                    if (addOptionGridListArray != '' && addOptionGridListArray != false) {
                        formData.push(common.form.makeData('addOptionGridData', addOptionGridListArray));
                    }

                    // 전송전 데이타 검증
                    if (common.validation.check($form, 'alert', false)) {
                        return true;
                    } else {
                        self.showSaveBtn();
                        return false;
                    }
                    return false;
                },
                function (response) {
                    if (response.result == 'success') {
                        if (response.data != 'put') {
                            common.noti.alert(common.lang.get('common.add.success.alert'));
                            document.location.href = '/product/manageProduct/' + response.data;
                        } else {
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                            location.replace(common.util.getControllerUrl('listProduct', 'product'));
                        }
                    } else {
                        if (response.result == 'optionSavefail') {
                            common.noti.alert(common.lang.get('common.optionSavefail.error.alert'));
                        } else if (response.result == 'addOptionSavefail') {
                            common.noti.alert(common.lang.get('common.addOptionSavefail.error.alert'));
                        } else {
                            common.noti.alert(response.result);
                        }
                        self.showSaveBtn();
                    }
                }
            );
        },
        changeStockUseUn: function (load) {
            var stockUseYn = $("input[name=stock_use_yn]:checked").val();
            var selfOptionGrid = devProductManageProductObj.option.optionGrid;
            var selfAddOptionGrid = devProductManageProductObj.addOption.addOptionGrid;
            if (stockUseYn == 'Y') {
                //품목 불러오기 버튼
                $('#devOptionInventoryGoodsPopup, #devAddOptionInventoryGoodsPopup').show();
                //옵션 그리드 항목 처리
                selfOptionGrid.addColumn([
                    {
                        key: "option_gid",
                        label: common.lang.get('grid.label.option_gid'),
                        width: 120
                    },
                    {
                        key: "option_code",
                        label: common.lang.get('grid.label.option_code'),
                        width: 120
                    },
                    {
                        key: "option_barcode",
                        label: common.lang.get('grid.label.option_barcode'),
                        width: 120
                    }
                ], 'last');

                selfAddOptionGrid.addColumn([
                    {
                        key: "option_gid",
                        label: common.lang.get('grid.label.option_gid'),
                        width: 120
                    },
                    {
                        key: "option_code",
                        label: common.lang.get('grid.label.option_code'),
                        width: 120
                    },
                    {
                        key: "option_barcode",
                        label: common.lang.get('grid.label.option_barcode'),
                        width: 120
                    }
                ], 'last');
            } else {
                $('#devOptionInventoryGoodsPopup, #devAddOptionInventoryGoodsPopup').hide();
                if (load != 'first') {
                    selfOptionGrid.removeColumn('last').removeColumn('last').removeColumn('last');
                    selfAddOptionGrid.removeColumn('last').removeColumn('last').removeColumn('last');
                }
            }
        },
        initEvent: function () {
            var self = this;

            // 저장 버튼 이벤트
            $('.devProductType').on('click', function () {
                var thisProductType = $(this).val();
                if (thisProductType == constant_productGiftType) {
                    $('.devGift_area').hide();
                } else {
                    $('.devGift_area').show();
                }
            });

            // 저장 버튼 이벤트
            $('#devTopMenuSaveBtn').on('click', function () {
                if($('input[name="product_type"]:checked').val() != constant_productGiftType){
                    if ($('.devProductCategory').find('input[name="basicCid"]').length == 0) {
                        common.noti.alert(common.lang.get('common.not.basicCid.alert'));
                        return false;
                    }
                }

                $('#devTopMenuSaveBtn').hide();

                // 입력폼 전송
                $('#devProductForm').submit();
                return false;
            });

            // 삭제 버튼 이벤트
            $('#devTopMenuDeleteBtn').on('click', function () {
                if (common.noti.confirm(common.lang.get('common.confirm.delete.alert'))) {
                    common.ajax(
                        common.util.getControllerUrl('del', 'manageProduct', 'product'),
                        {id: self.pid},
                        function () {
                            return true;
                        },
                        function (response) {
                            if (response.result == 'success') {
                                common.noti.alert(common.lang.get('common.put.delete.alert'));
                                location.href = common.util.getControllerUrl('listProduct', 'product');
                            } else if (response.result == 'fail') {
                                common.noti.alert(common.lang.get('common.not.delete.alert'));
                            } else {
                                console.log(response);
                            }
                        }
                    );
                }
            });

            if (devProductManageProductObj.common.method == 'put') {
                // 미리보기 버튼 이벤트
                $('#devTopMenuPreviewBtn').on('click', function () {
                        if($('#devSalesStatus input[name=state]:checked').val() == 1) {
                            location.href = MALL_DOMAIN + "/shop/goodsView/" + devProductManageProductObj.common.pid;
                        } else {
                            common.noti.alert(common.lang.get('common.not.status.alert'));
                            return false;
                        }
                });

                // 변경내역 버튼 이벤트
                $('#devTopMenuHistoryBtn').on('click', function (e) {
                    e.preventDefault();
                    common.util.modal.open('ajax', '변경내역', common.util.getControllerUrl('listProductHistory', 'product'), {id: self.pid}, '', {width: '750px', height: '600px'});
                });
            }
        },
        run: function () {
            this.initLang();
            this.initForm();
            this.initEvent();
        }
    },
    saleAndCategory: {
        initLang: function () {
            common.lang.load('common.empty.category.alert', '카테고리를 선택해주세요.');
            common.lang.load('common.already.category.alert', '이미 등록된 카테고리 입니다.');
            common.lang.load('common.not.category.alert', '하위 카테고리를 선택해 주세요.');
        },
        selectCategoryTpl: false,
        initSelectCategory: function () {
            var self = this;
            //카테고리 선택
            self.selectCategory = common.ui.selectCategory('getLargeCategoryList', 'getSubCategoryList', 'searchCategory', 'pub', 'Manage');
            self.selectCategory
                .setMode('multiple')
                .setChange(function (obj) {
                    $('#devSelCategoryProduct').empty();
                    var selCateHtml = [];
                    $.each(self.selectCategory.getValue().path, function (k, v) {
                        var sel = '';
                        selCateHtml = [
                            '<li>',
                            sel + v,
                            '</li>'
                        ];

                        if (k > 0) {
                            sel = ' > ';
                        }
                        $('#devSelCategoryProduct').append($(selCateHtml.join('')));
                    });
                })
                .init($('#devSelectCategoryProduct'));

            //카테고리 템플릿
            self.selectCategoryTpl = common.util.compileTpl('#devProductCategoryTemplate');
            if (categoryRelationData) {
                if (categoryRelationData.length > 0) {
                    $.each(categoryRelationData, function () {
                        self.addSelectCategory(this);
                    });
                }
            }
        },
        addSelectCategory: function (value) {
            var self = this;
            if (value.basic == '1') { //수정시 카테고리 체크
                value.basic = true;
            } else {
                value.basic = false;
            }
            $('#devProductCategoryList').append($(self.selectCategoryTpl(value)));
        },
        doBasicCidChecked: function () {
            if ($('input[name="basicCid"]:checked').length == 0) {
                $('input[name="basicCid"]:first').attr('checked', true);
            }
        },
        changeDeliveryTemplateList: function (companyId) {
            common.ajax(common.util.getControllerUrl('get', 'listDeliveryTemplate', 'seller'),
                {company_id: companyId, page: 1, max: 0},
                function () {
                    // 전송전 데이타 검증
                    return true;
                },
                function (response) {
                    $('#devDeliveryTemplate option').remove();
                    $('#devDeliveryTemplate').append("<option value=''>배송정책을 선택해주세요</option>");
                    for (var i = 0; i < response.data.total; i++) {
                        var dt = response.data.list[i];
                        $('#devDeliveryTemplate').append("<option value='" + dt.dt_ix + "'>" + dt.template_name + "</option>");
                    }
                }
            );
        },
        categoryEvent: function () {
            var self = this;

            $('#devCategoryTable').on('click', '.devProductCategoryDelete', function (e) {
                e.preventDefault();
                $(this).closest('.devProductCategory').remove();
                self.doBasicCidChecked();
            });

            //셀러업체
            $('#devSearchCompanyPopup').click(function () {
                common.pub.open('searchCompany', function (data) {
                    $('[name="admin"]').val(data.company_id);
                    $('#devCompanyText').val(data.com_name);
                    self.changeDeliveryTemplateList(data.company_id)
                });
            });

            //MD
            $('#devSearchMdPopup').click(function () {
                common.pub.open('searchMd', function (data) {
                    $('#devMdText').val(data.name);
                    $('input[name=md_code]').val(data.code);
                });
            });

            //상품분류
            $('#devProductCategoryButton').click(function () {
                //등록하려는 카테고리의 data-children 이 true인지 체크
                var cid = self.selectCategory.getValue().cid;
                var children = $('#devProductForm').find("option[value='" + cid + "']")[0].dataset.children;
                if (children == 'true') {
                    common.noti.alert(common.lang.get('common.not.category.alert'));
                    return false;
                }

                //선택한 카테고리를 임시등록
                var value = self.selectCategory.getValue();
                if (value.cid.length > 0 && $('#devProductForm').find('input[value=' + value.cid + ']').length == 0) {
                    var path = value.path.join(' > ');
                    value['path'] = path;
                    self.addSelectCategory(value);
                    self.doBasicCidChecked();
                } else {
                    if ($('input[name=basicCid]').val() == null) {
                        common.noti.alert(common.lang.get('common.empty.category.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.already.category.alert'));
                    }
                }
            });

            //판매기간 선택 시
            $("input:radio[name=is_sell_date]").click(function () {
                if ($("input[name=is_sell_date]:checked").val() == "1") {
                    $('#devDatePicker').show();
                } else {
                    $('#devDatePicker').hide();
                }
            });
        },
        initDate: function () {
            common.ui.datePicker($('#devBetweenDatePickerStart'), {
                endTartget: $('#devBetweenDatePickerEnd')
                , timepicker: true
            });
            common.ui.datePicker($('#devBetweenDatePickerEnd'), {
                startTartget: $('#devBetweenDatePickerStart')
                , timepicker: true
            });
        },
        run: function () {
            this.initSelectCategory();
            this.categoryEvent();
            this.initDate();
            this.initLang();
        }
    },
    basicInformation: {
        basicInfoEvent: function () {
            var method = devProductManageProductObj.common.method;

            //원산지
            $('#devSearchOriginPopup').click(function () {
                common.pub.open('searchOrigin', function (data) {
                    $('[name="origin"]').val(data.origin_name);
                });
            });

            //브랜드
            $('#devSearchBrandPopup').click(function () {
                common.pub.open('searchBrand', function (data) {
                    $('[name="brand"]').val(data.b_ix);
                    $('[name="brandText"]').val(data.brand_name);
                });
            });

            if (method == 'add') {
                //single
                common.ui.upload('#devBasicFileupload')
                    .init()
                    .addFileBox('basicImage');

                //multi
                common.ui.upload('#devAddFileupload')
                    .init()
                    .addFileBox('addImage1')
                    .addFileBox('addImage2')
                    .addFileBox('addImage3')
                    .addFileBox('addImage4')
                    .addFileBox('addImage5');
            } else {
                //single
                common.ui.upload('#devBasicFileupload')
                    .init()
                    .putFileBox('basicImage', $('#devBasicFileupload').data('imgSrc'));

                //multi
                common.ui.upload('#devAddFileupload')
                    .init()
                    .putFileBox('devAddImage1', $('#devAddFileupload').data('imgSrc1'))
                    .putFileBox('devAddImage2', $('#devAddFileupload').data('imgSrc2'))
                    .putFileBox('devAddImage3', $('#devAddFileupload').data('imgSrc3'))
                    .putFileBox('devAddImage4', $('#devAddFileupload').data('imgSrc4'))
                    .putFileBox('devAddImage5', $('#devAddFileupload').data('imgSrc5'));
            }
        },
        run: function () {
            this.basicInfoEvent();
        }
    },
    option: {
        initLang: function () {
            common.lang.load('grid.label.option_div', '옵션구분');
            common.lang.load('grid.label.option_coprice', '공급가');
            common.lang.load('grid.label.option_listprice', '정가');
            common.lang.load('grid.label.option_price', '판매가');
            common.lang.load('grid.label.option_wholesale_listprice', '도매가');
            common.lang.load('grid.label.option_wholesale_price', '도매판매가');
            common.lang.load('grid.label.option_soldout', '품절여부');
            common.lang.load('grid.label.option_sell_ing_cnt', '판매진행재고');
            common.lang.load('grid.label.option_stock', '실재고');
            common.lang.load('grid.label.option_gid', '품목코드');
            common.lang.load('grid.label.option_code', '품목시스템코드');
            common.lang.load('grid.label.option_barcode', '바코드');
            common.lang.load('grid.label.act', '관리');
        },
        optionGrid: false,
        initGrid: function () {
            var self = this;
            var grid = common.ui.grid();
            self.optionGrid = grid;

            var gridConfig = {
                showRowSelector: false,
                height: '300px',
                columns: [
                    {
                        key: "act",
                        label: common.lang.get('grid.label.act'),
                        align: "center",
                        width: 100,
                        formatter: function () {
                            return [
                                '<input type="button" class="fb-filter__delete--gray devOptionGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> '
                            ].join('');
                        }
                    },
                    {
                        key: "option_div",
                        label: common.lang.get('grid.label.option_div'),
                        width: 250,
                        align: "left",
                        editor: {
                            type: "text"
                            , disabled: function () {
                                return this.item.id != '';
                            }
                        },
                        styleClass: function () {
                            return this.item.id ? '' : 'fb__grid__edit--active';
                        }
                    },
                    {
                        key: "option_coprice",
                        label: common.lang.get('grid.label.option_coprice'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_wholesale_listprice",
                        label: common.lang.get('grid.label.option_wholesale_listprice'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_wholesale_price",
                        label: common.lang.get('grid.label.option_wholesale_price'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_listprice",
                        label: common.lang.get('grid.label.option_listprice'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_price",
                        label: common.lang.get('grid.label.option_price'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_soldout",
                        label: common.lang.get('grid.label.option_soldout'),
                        width: 60,
                        align: "center",
                        editor: {type: "checkbox"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_stock",
                        label: common.lang.get('grid.label.option_stock'),
                        width: 60,
                        align: "right",
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_sell_ing_cnt",
                        label: common.lang.get('grid.label.option_sell_ing_cnt'),
                        width: 100,
                        align: "right"
                    }
                ]
            };

            self.optionGrid.setGrid($('#devOptionGrid'), gridConfig)
                .setUseHash(false)
                .setForm('#devProductForm')
                .setReadOnly(false);

            //그리드 데이터 없을때
            if ($('#devOptionGrid').length == 1) {
                self.optionGrid.showEmpty();
            }

            $('#devOptionGridAdd').on('click', function () {
                var coprice = $('input[name=coprice]').val();
                var listprice = $('input[name=listprice]').val();
                var sellprice = $('input[name=sellprice]').val();
                var wholesale_price = $('input[name=wholesale_price]').val();
                var wholesale_sellprice = $('input[name=wholesale_sellprice]').val();

                self.optionGrid.addContent({
                    "id": "",
                    "option_div": "기본옵션명",
                    "option_coprice": coprice,
                    "option_listprice": listprice,
                    "option_price": sellprice,
                    "option_wholesale_listprice": wholesale_price,
                    "option_wholesale_price": wholesale_sellprice,
                    "option_soldout": "",
                    "option_sell_ing_cnt": "",
                    "option_stock": "0",
                    "option_code": "",
                    "option_gid": "",
                    "option_barcode": "",
                    "act": "",
                });
                return false;
            });

            $('#devOptionGrid [data-ax5grid-panel="body"]').on('click', '.devOptionGridDataDel', function () {
                var idx = $(this).data('idx');
                self.optionGrid.deleteRow(idx);
            });
        },
        initEvent: function () {
            var method = devProductManageProductObj.common.method;
            var pid = devProductManageProductObj.common.pid;
            var self = this;
            $('input[name=stock_use_yn]').change(function () {
                devProductManageProductObj.common.changeStockUseUn();
            });

            $('#devOptionInventoryGoodsPopup').click(function () {
                common.pub.open('searchInventoryGoods', function (data) {
                    var coprice = $('input[name=coprice]').val();
                    var listprice = $('input[name=listprice]').val();
                    var sellprice = $('input[name=sellprice]').val();
                    var wholesale_price = $('input[name=wholesale_price]').val();
                    var wholesale_sellprice = $('input[name=wholesale_sellprice]').val();

                    $.each(data, function (key, value) {
                        self.optionGrid.addContent({
                            "id": "",
                            "option_div": value.gname,
                            "option_coprice": coprice,
                            "option_listprice": listprice,
                            "option_price": sellprice,
                            "option_wholesale_listprice": wholesale_price,
                            "option_wholesale_price": wholesale_sellprice,
                            "option_soldout": "",
                            "option_sell_ing_cnt": value.sell_ing_cnt,
                            "option_stock": value.stock,
                            "option_code": value.gu_ix,
                            "option_gid": value.gid,
                            "option_barcode": value.barcode
                        });
                    });
                    return false;
                });
            });

            if (method == 'put') {
                self.optionGrid.setContent(optionDetailDataList);
            }
        },
        run: function () {
            this.initLang();
            this.initGrid();
            this.initEvent();
        }
    },
    addOption: {
        initLang: function () {
            common.lang.load('grid.label.option_div', '옵션구분');
            common.lang.load('grid.label.option_coprice', '공급가');
            common.lang.load('grid.label.option_listprice', '정가');
            common.lang.load('grid.label.option_price', '판매가');
            common.lang.load('grid.label.option_wholesale_listprice', '도매가');
            common.lang.load('grid.label.option_wholesale_price', '도매판매가');
            common.lang.load('grid.label.option_soldout', '품절여부');
            common.lang.load('grid.label.option_sell_ing_cnt', '판매진행재고');
            common.lang.load('grid.label.option_stock', '실재고');
            common.lang.load('grid.label.option_gid', '품목코드');
            common.lang.load('grid.label.option_code', '품목시스템코드');
            common.lang.load('grid.label.option_barcode', '바코드');
            common.lang.load('grid.label.act', '관리');
        },
        initGrid: function () {
            var self = this;
            var method = devProductManageProductObj.common.method;
            var grid = common.ui.grid();
            self.addOptionGrid = grid;

            self.groupTpl = Handlebars.compile(common.util.getHtml('#devAddOptionGroupTpl'));

            if (method == 'add') {
                self.appendGroupTemplate({});
            } else {
                if (addOptionDataList == null) {
                    self.appendGroupTemplate({});
                } else {
                    //추가 옵션
                    $.each(addOptionDataList, function (k, data) {
                        self.appendGroupTemplate(data);
                    });
                }
            }
        },
        groupTpl: false,
        addOptionNum: 0,
        appendGroupTemplate: function (data) {
            var self = devProductManageProductObj.addOption;

            //삭제 버튼 노출 여부
            var addOptionNum = self.addOptionNum++;

            if (addOptionNum > 0) {
                data['delBtnBool'] = true;
            }

            //템플릿 추가
            var $targetGroup = $(self.groupTpl(data));
            $targetGroup.appendTo('.devAddOptionContents');

            //추가옵션 form 데이터 바인드
            data['add_option_opn_ix[]'] = data['opn_ix'];
            data['add_option_name[]'] = data['option_name'];
            common.form.dataBind($targetGroup, data);

            //추가옵션 상세 데이터 바인드
            //추가구성 상품 사용 시 장바구니 쿠폰 마일리지 분할에 문제로 인해 임시 사용 불가 처리 해당 내용 개선 후 오픈 필요
            if(false) {
                var addOptionDetailGrid = self.setAddOptionObj($targetGroup.find('.devAddOptionGrid'));
                if (data.detailList && data.detailList.length > 0) {
                    addOptionDetailGrid.setContent(data.detailList);
                } else {
                    addOptionDetailGrid.showEmpty();
                }

                //추가구성 상품 옵션 컬럼 추가
                $targetGroup.find('.devAddOptionGridAdd').on('click', function (e) {
                    var coprice = $('input[name=coprice]').val();
                    var listprice = $('input[name=listprice]').val();
                    var sellprice = $('input[name=sellprice]').val();
                    var wholesale_price = $('input[name=wholesale_price]').val();
                    var wholesale_sellprice = $('input[name=wholesale_sellprice]').val();

                    addOptionDetailGrid.addContent({
                        "id": "",
                        "option_div": "추가기본옵션명",
                        "option_coprice": coprice,
                        "option_listprice": listprice,
                        "option_price": sellprice,
                        "option_wholesale_listprice": wholesale_price,
                        "option_wholesale_price": wholesale_sellprice,
                        "option_soldout": "",
                        "option_sell_ing_cnt": "",
                        "option_stock": "0",
                        "option_code": "",
                        "option_gid": "",
                        "option_barcode": "",
                        "act": "",
                    });
                    return false;
                });

                $targetGroup.find('[data-ax5grid-container="body"]').on('click', '.devAddOptionGridDataDel', function (e) {
                    e.preventDefault();
                    addOptionDetailGrid.deleteRow($(this).data('idx'));
                });

                //추가구성 상품 옵션 컬럼 삭제
                $targetGroup.find('.devAddOptionGroupDel').on('click', function (e) {
                    delete self.addOptionObj[addOptionNum];
                    $(this).closest('.devGroupSection').remove();
                    self.addOptionNum--;
                });
            }
        },
        addOptionObj: [],
        setAddOptionObj: function ($grid) {
            var self = devProductManageProductObj.addOption;
            var grid = common.ui.grid();

            var gridConfig = {
                showRowSelector: false,
                height: '300px',
                columns: [
                    {
                        key: "act",
                        label: common.lang.get('grid.label.act'),
                        align: "center",
                        width: 100,
                        formatter: function () {
                            return [
                                '<input type="button" class="fb-filter__delete--gray devAddOptionGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> '
                            ].join('');
                        }
                    },
                    {
                        key: "option_div",
                        label: common.lang.get('grid.label.option_div'),
                        width: 250,
                        align: "left",
                        editor: {
                            type: "text"
                            , disabled: function () {
                                return this.item.id != '';
                            }
                        },
                        styleClass: function () {
                            return this.item.id ? '' : 'fb__grid__edit--active';
                        }
                    },
                    {
                        key: "option_coprice",
                        label: common.lang.get('grid.label.option_coprice'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_wholesale_listprice",
                        label: common.lang.get('grid.label.option_wholesale_listprice'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_wholesale_price",
                        label: common.lang.get('grid.label.option_wholesale_price'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_listprice",
                        label: common.lang.get('grid.label.option_listprice'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_price",
                        label: common.lang.get('grid.label.option_price'),
                        width: 100,
                        align: "right",
                        formatter: 'money',
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_soldout",
                        label: common.lang.get('grid.label.option_soldout'),
                        width: 60,
                        align: "center",
                        editor: {type: "checkbox"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_stock",
                        label: common.lang.get('grid.label.option_stock'),
                        width: 60,
                        align: "right",
                        editor: {type: "number"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "option_sell_ing_cnt",
                        label: common.lang.get('grid.label.option_sell_ing_cnt'),
                        width: 100,
                        align: "right"
                    }
                ]
            };

            grid.setGrid($grid, gridConfig)
                .setUseHash(false)
                .setReadOnly(false);
            self.addOptionObj.push(grid);
            return grid;
        },
        getAddOptionObj: function (index) {
            var self = this;
            return self.addOptionObj[index];
        },
        initEvent: function () {
            var method = devProductManageProductObj.common.method;
            var self = this;

            $('#devAddOptionInventoryGoodsPopup').click(function () {
                common.pub.open('searchInventoryGoods', function (data) {
                    var listprice = $('input[name=listprice]').val();
                    var sellprice = $('input[name=sellprice]').val();
                    var wholesale_price = $('input[name=wholesale_price]').val();
                    var wholesale_sellprice = $('input[name=wholesale_sellprice]').val();

                    $.each(data, function (key, value) {
                        self.addOptionGrid.addContent({
                            "id": "",
                            "option_div": value.gname,
                            "option_coprice": value.sellprice,
                            "option_listprice": listprice,
                            "option_price": sellprice,
                            "option_wholesale_listprice": wholesale_price,
                            "option_wholesale_price": wholesale_sellprice,
                            "option_soldout": "",
                            "option_sell_ing_cnt": value.sell_ing_cnt,
                            "option_stock": value.stock,
                            "option_code": value.gu_ix,
                            "option_gid": value.gid,
                            "option_barcode": value.barcode
                        });
                    });
                    return false;
                });
            });

            //추가구성 상품 옵션 추가
            $(document).on('click', '#devAddOptionGroupAdd', function (e) {
                self.appendGroupTemplate({});
            });
        },
        run: function () {
            this.initLang();
            this.initGrid();
            this.initEvent();
        }
    },
    detailAndNotice: {
        initLang: function () {
            common.lang.load('grid.label.title', '항목');
            common.lang.load('grid.label.desc', '내용');
        },
        initEditor: function () {
            common.ui.tap($('#devTap'));

            common.ui.editor('devEditor')
                .setSubType('test')
                .init();

            common.ui.editor('devEditor2')
                .setSubType('test')
                .init();
        },
        noticeGrid: false,
        makeNoticeGrid: function () {
            var self = devProductManageProductObj.detailAndNotice;
            if (self.noticeGrid === false) {
                var grid = common.ui.grid();
                self.noticeGrid = grid;
                var gridConfig = {
                    showRowSelector: false,
                    columns: [
                        {
                            key: "mid_title",
                            label: common.lang.get('grid.label.title'),
                            width: 500
                        },
                        {
                            key: "mid_desc",
                            label: common.lang.get('grid.label.desc'),
                            width: 800,
                            editor: {type: "text"},
                            styleClass: 'fb__grid__edit--active'
                        }
                    ]
                };

                self.noticeGrid.setGrid($('#devNoticeGrid'), gridConfig)
                    .setUseHash(false)
                    .setForm('#devProductForm')
                    .setReadOnly(false);

                //그리드 데이터 없을때
                if ($('#devNoticeGrid').length == 1) {
                    self.noticeGrid.showEmpty();
                }
            }
        },
        detailAndNoticeEvent: function () {
            var self = this;
            var pid = devProductManageProductObj.common.pid;

            $('#devNoticeSel').change(function () {
                common.ajax(common.util.getControllerUrl('getMandatorySelList', 'manageProduct', 'product'),
                    {mi_ix: this.value},
                    function () {
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        if (response.result == 'success') {
                            self.noticeGrid.setContent(response.data);
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                );
            });

            //상품고시 정보 사용시 그리드 그리기
            if ($('#devNoticeGrid').is(':visible')) {
                self.makeNoticeGrid();
                common.ajax(common.util.getControllerUrl('getMandatoryGridList', 'manageProduct', 'product'),
                    {pid: pid},
                    function () {
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        if (response.result == 'success') {
                            self.noticeGrid.setContent(response.data);
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                );
            }

            $("input:radio[name=mandatory_use]").click(function () {
                if ($("input[name=mandatory_use]:checked").val() == "Y") {
                    $('#mandatoryUseTr').show();
                    //사용일때 그리드 그리기
                    self.makeNoticeGrid();
                } else {
                    $('#mandatoryUseTr').hide();
                }
            });
        },
        run: function () {
            this.initLang();
            this.initEditor();
            this.detailAndNoticeEvent();
        }
    },
    productDelivery: {
        initEvent: function () {
            $('[name="delivery_type"]').click(function () {
                if ($("input[name=delivery_type]:checked").val() == 2) { //개별 배송
                    $('#deliverySel2').show();
                    $('#deliverySel1').hide();

                    $('#deliverySel2').attr('disabled', false);
                    $('#deliverySel1').attr('disabled', true);
                    common.validation.set($('#deliverySel2'), {'required': true});
                    common.validation.set($('#deliverySel1'), {'required': false});
                } else {
                    $('#deliverySel2').hide();
                    $('#deliverySel1').show();

                    $('#deliverySel2').attr('disabled', true);
                    $('#deliverySel1').attr('disabled', false);
                    common.validation.set($('#deliverySel2'), {'required': false});
                    common.validation.set($('#deliverySel1'), {'required': true});
                }
            });
        },
        run: function () {
            this.initEvent();
        }
    },
    etcInformation: {
        initLang: function () {
            common.lang.load('grid.label.dp_title', '추가정보명');
            common.lang.load('grid.label.dp_desc', '추가정보내용 / 노출(20자)');
            common.lang.load('grid.label.act', '관리');
        },
        displayGrid: false,
        deleteDisplayGridList: [],
        initDisplayGrid: function () {
            var self = this;
            var pid = devProductManageProductObj.common.pid;
            var grid = common.ui.grid();
            self.displayGrid = grid;
            var gridConfig = {
                showRowSelector: false,
                height: '300px',
                columns: [
                    {
                        key: "dp_title",
                        label: common.lang.get('grid.label.dp_title'),
                        width: 400,
                        editor: {type: "text"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "dp_desc",
                        label: common.lang.get('grid.label.dp_desc'),
                        width: 800,
                        editor: {type: "text"},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "act",
                        label: common.lang.get('grid.label.act'),
                        align: "center",
                        width: 150,
                        formatter: function () {
                            return [
                                '<input type="button" class="fb-filter__delete--gray devDisplayGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> '
                            ].join('');
                        }
                    }
                ]
            };

            self.displayGrid.setGrid($('#devDisplayGrid'), gridConfig)
                .setUseHash(false)
                .setForm('#devProductForm')
                .setReadOnly(false)

            var pid = pid;
            common.ajax(common.util.getControllerUrl('getDisplayGridList', 'manageProduct', 'product'),
                {pid: pid},
                function () {
                    return true;
                },
                function (response) {
                    // 전송후 결과 확인
                    if (response.result == 'success') {
                        self.displayGrid.setContent(response.data);
                    } else {
                        common.noti.alert(response.result);
                    }
                }
            );

            $('#devDisplayGridAdd').on('click', function () {
                self.displayGrid.addContent({
                    "dp_ix": "",
                    "dp_title": "기본정보명",
                    "dp_desc": "기본정보내용",
                    "act": "",
                });
                return false;
            });

            $('#devDisplayGrid [data-ax5grid-panel="body"]').on('click', '.devDisplayGridDataDel', function () {
                var idx = $(this).data('idx');
                var row = grid.getRow($(this).data('idx'));
                if (row.dp_ix != '') {
                    self.deleteDisplayGridList.push(row.dp_ix);
                }
                self.displayGrid.deleteRow(idx);
            })

            $("input:radio[name=one_commission]").click(function () {
                if ($("input[name=one_commission]:checked").val() == "Y") {
                    $('#accountTypeTr').show();
                    $('#commissionTr1').show();
                    $('#commissionTr2').show();
                } else {
                    $('#accountTypeTr').hide();
                    $('#commissionTr1').hide();
                    $('#commissionTr2').hide();
                }
            });
        },
        relProduct: false,
        initRelProduct: function () {
            var method = devProductManageProductObj.common.method;
            var self = this;

            self.relProduct = common.ui.choiceProduct();
            self.relProduct.init($('#devRelProduct'));

            if (method == 'put') {
                self.relProduct.setContent(relProductDataList);
            }

            $('#devAddRelProductButton').click(function () {
                common.pub.open('searchProduct', function (datas) {
                    self.relProduct.addContent(datas);
                });
            });

            //그리드 데이터 없을때
            if (method != 'put' && $('#devRelProduct').length == 1) {
                self.relProduct.showEmpty();
            }
        },
        //상품사은품 숨김처리 요청(필요시 오픈)
        // relGiftProduct: false,
        // initRelGiftProduct: function () { // 상품사은품
        //     var method = devProductManageProductObj.common.method;
        //     var self = this;
        //
        //     self.relGiftProduct = common.ui.choiceProduct();
        //     self.relGiftProduct.init($('#devRelGiftProduct'));
        //
        //     if (method == 'put') {
        //         self.relGiftProduct.setContent(relGiftProductDataList);
        //     }
        //
        //     $('#devAddRelGiftProductButton').click(function () {
        //         common.pub.open('searchProduct', function (datas) {
        //             self.relGiftProduct.addContent(datas);
        //         }, {product_type : constant_productGiftType});
        //     });
        //
        //     //그리드 데이터 없을때
        //     if (method != 'put' && $('#devRelGiftProduct').length == 1) {
        //         self.relGiftProduct.showEmpty();
        //     }
        // },
        run: function () {
            this.initLang();
            this.initDisplayGrid();
            this.initRelProduct();
            //상품사은품 숨김처리 요청(필요시 오픈)
            // this.initRelGiftProduct();
        }
    },
    run: function () {
        this.common.run();
        this.saleAndCategory.run();
        this.basicInformation.run();
        this.option.run();
        this.addOption.run();
        this.detailAndNotice.run();
        this.productDelivery.run();
        this.etcInformation.run();

        //그리드가 아직 안그려졌기때문에 마지막에 실행.
        this.common.changeStockUseUn('first');
    }
}

$(function () {
    devProductManageProductObj.run();
    devProductManageProductObj.common.initForm();
});