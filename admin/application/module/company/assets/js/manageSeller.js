"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devCompanyManageSellerObj = {

    devTap: '#devCompanyInfo',
    method: 'putCompanyInfo',
    isCompanyId: true,
    devCompanyInfo: devCompanyInfoObj,
    devMdInfo: devMdInfoObj,
    devShopInfo: devShopInfoObj,
    devSumPriceInfo: devSumPriceInfoObj,

    devDeliveryList: devDeliveryListObj,
    devDeliveryGroup: devDeliveryGroupObj,
    devExchangeInfo: devExchangeInfoObj,
    initTab: function () {
        var self = this;
        if (!$("#devCompanyInfoForm").find("input[name=company_id]").val()) {
            $("ul#devTap > li").hide();
            $("ul#devTap > li").eq(0).show();

            self.isCompanyId = false;
            self.method = 'addCompanyInfo';
        }

        common.ui.tap($('#devTap'), function (selector) {
            self.devTap = selector;
            if (selector == "#devDeliveryList") {
                $('.delivery_list').show();
                self.devDeliveryList.tapListDeliveryTemplateGrid();
                self.method = "putGroupDeliveryContents";
            } else if (selector == "#devDeliveryGroup") {
                $('.delivery_list').hide();
                self.devDeliveryGroup.tapGroupDeliveryGrid();
                self.method = "putGroupDeliveryContents";
            } else if (selector == "#devExchangeInfo") {
                $('.delivery_list').hide();
                self.method = "putExchangeInfo";
            } else {
                $('.delivery_list').hide();
                self.method = "putCompanyInfo"; //[사업자정보, 상점기본정보, 정산관리, 담당자정보] 탭은 같은 메소드
                if (!self.isCompanyId)
                    self.method = "addCompanyInfo";
            }
        });

        $('#devCompanyInfo').show();        //사업자 정보
        $('#devMdInfo').hide();             //상점기본정보
        $('#devShopInfo').hide();           //담당자 정보
        $('#devSumPriceInfo').hide();       //정산관리
        $('#devShipPlaceInfo').hide();      //출고지 관리
        $('#devDeliveryList').hide();       //배송 택배정책
        $('#devDeliveryGroup').hide();      //묶음배송 그룹 정책
        $('#devExchangeInfo').hide();       //교환/반품지 관리
        $('.delivery_list').hide();

        //MD
        $('#devSearchMdPopup').click(function () {
            common.pub.open('searchMd', function (data) {
                $('#devMdCode').val(data.code);
                $('#devMdName').val(data.name);
            });
        });

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
      
      
      //교환반품지
      $("[name=addr_phone_1]").attr("maxlength", 4);
      $("[name=addr_phone_2]").attr("maxlength", 4);
      $("[name=addr_phone_3]").attr("maxlength", 4);
      $("[name=addr_mobile_1]").attr("maxlength", 4);
      $("[name=addr_mobile_2]").attr("maxlength", 4);
      $("[name=addr_mobile_3]").attr("maxlength", 4);
      $("[name=com_zip]").attr("maxlength", 6);
    },
    initEvent: function () {
        var self = this;
        self.devCompanyInfo.initEvent();
        self.devMdInfo.initEvent();
        self.devShopInfo.initEvent();
        self.devMdInfo.initEvent();
        self.devSumPriceInfo.initEvent();
        self.devDeliveryGroup.initAddTemplate();        
        self.devExchangeInfo.initPub();

    },
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.companyName', '업체명');
        common.lang.load('grid.label.traceUrl', '배송정보추적 URL');
        common.lang.load('grid.label.httpMethod', '전송방법');
        common.lang.load('grid.label.httpPrams', '송장번호 파라미터');
        common.lang.load('grid.label.isUse', '사용유무');
        common.lang.load('grid.label.act', '관리');
        // validation 메시지
        common.lang.load('validation.codeName.alert');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');

        // 에러메시지
        common.lang.load('existsCodeName.alert', '등록된 업체입니다.');
        common.lang.load('deleteCompany.confirm', '택배업체({code_name})를 삭제 하시겠습니까?');
        common.lang.load('common.del.fail.alert', '해당 배송정책이 설정된 상품이 있어 삭제할 수 없습니다.');


        //배송정책 템플릿 리스트
        common.lang.load('grid.label.template_name', '배송 정책명');
        common.lang.load('grid.label.com_name', '셀러명');
        common.lang.load('grid.label.product_sell_type', '소매/도매');
        common.lang.load('grid.label.delivery_basic_policy', '배송비 결제수단');
        common.lang.load('grid.label.delivery_package', '배송방식');
        //common.lang.load('grid.label.delivery_relation', '묶음배송 그룹여부');
        common.lang.load('grid.label.delivery_policy', '배송비 조건');

        //묶음 배송
        common.lang.load('grid.label.group_name', '묶음배송 그룹명');
        common.lang.load('grid.label.group_state', '사용여부');
        common.lang.load('grid.label.group_contents', '배송정책 템플릿');

        //교환반품 처리 리스트
        common.lang.load('grid.label.code', '코드');
        common.lang.load('grid.label.addr_name', '주소명');
        common.lang.load('grid.label.person_name', '담당자명');
        common.lang.load('grid.label.addr_phone', '전화번호');
        common.lang.load('grid.label.addr_mobile', '핸드폰번호');
        common.lang.load('grid.label.address', '상세주소');
        common.lang.load('grid.label.zip_code', '우편번호');
        common.lang.load('grid.label.basic_addr_use', '기본주소여부');
    },
    checkValidation: function () {
        var self = this;
        if (self.devTap == "#devCompanyInfo") {
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
            common.validation.set($('[name=com_email]'), {'dataFormat': 'email'} );
        }else  if (self.devTap == "#devExchangeInfo") {
            
            common.validation.set($('[name=addr_name]'), {'required': true}); 
            common.validation.set($('[name=addr_phone_1]'), {'required': true});
            common.validation.set($('[name=addr_phone_2]'), {'required': true});
            common.validation.set($('[name=addr_phone_3]'), {'required': true});
            
            common.validation.set($('[name=com_zip]'), {'required': true});
            common.validation.set($('[name=com_addr1]'), {'required': true});
            common.validation.set($('[name=com_addr2]'), {'required': true});
        }
    },
    initForm: function () {
        var self = this;
        // 처음 불러오는 탭의 폼 .. init 으로 한번만 호출된다
        $(".devSave").on('click', function () {
            if (!$("#devDeliveryGroupForm").find("input[name=g_ix]").val()) {
                self.isCompanyId = false;
            }else{
                self.isCompanyId = true;
            }
            common.form.init(
                    $(self.devTap + 'Form'),
                    common.util.getControllerUrl(self.method, 'manageSeller', 'company'),
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
                            if (!self.isCompanyId) {
                                common.noti.alert(common.lang.get('common.add.success.alert'));
                            } else {
                                common.noti.alert(common.lang.get('common.put.success.alert'));
                            }
                            document.location.reload();
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
            );
            $(self.devTap + 'Form').submit();
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initTab();
        self.initEvent();
        self.initForm();
        self.initSizeLimit();
    }
}

$(function () {
    devCompanyManageSellerObj.run();
});