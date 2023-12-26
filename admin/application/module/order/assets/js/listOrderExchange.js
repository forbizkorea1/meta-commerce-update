"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderListOrderExchangeObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.oid', '주문번호');
        common.lang.load('grid.label.statusText', '처리상태');
        common.lang.load('grid.label.order_date', '주문일자');
        common.lang.load('grid.label.orderFromText', '판매처');
        common.lang.load('grid.label.od_ix', '주문상세번호');
        common.lang.load('grid.label.company_name', '판매자');
        common.lang.load('grid.label.pid', '상품코드');
        common.lang.load('grid.label.thum_image_src', '상품이미지');
        common.lang.load('grid.label.pname', '상품명');
        common.lang.load('grid.label.option_text', '옵션명');
        common.lang.load('grid.label.brand_name', '브랜드명');
        common.lang.load('grid.label.pcode', '상품관리코드');
        common.lang.load('grid.label.gid', '품목코드');
        common.lang.load('grid.label.psprice', '상품판매단가');
        common.lang.load('grid.label.pcnt', '구매수량');
        common.lang.load('grid.label.pt_dcprice', '상품결제금액');
        common.lang.load('grid.label.buyerInfo', '주문자');
        common.lang.load('grid.label.bmobile', '주문자 휴대폰 번호');
        common.lang.load('grid.label.rname', '수취인');
        common.lang.load('grid.label.rmobile', '수취인 휴대폰 번호');
        common.lang.load('grid.label.ic_date', '입금일자');
        common.lang.load('grid.label.dr_date', '배송준비중일자');
        common.lang.load('grid.label.di_date', '배송중일자');
        common.lang.load('grid.label.dc_date', '배송완료일자');
        common.lang.load('grid.label.ea_date', '교환요청일자');
        common.lang.load('grid.label.claimReason', '교환사유');
        common.lang.load('grid.label.returnSendTypeText', '반품상품 발송방법');
        common.lang.load('grid.label.turnQuickTextClaim', '회수 택배사');
        common.lang.load('grid.label.turnInvoiceNo', '회수 송장번호');

        common.lang.load('change.no.select.alert', '변경할 항목을 선택해주세요.');

        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');

        common.lang.load('common.npay.ei_fail.alert', '네이버페이 주문입니다.\n' +
            '교환승인 상태 변경은 네이버로 전송되지 않습니다.\n' +
            '자사몰 변경후 네이버페이 쇼핑센터에서 직접 상태값을 변경 해주세요.\n');
        common.lang.load('common.npay.ec_fail.alert', '네이버페이 주문입니다.\n' +
            '교환반품확정 상태 변경은 네이버로 전송되지 않습니다.\n' +
            '자사몰 변경후 네이버페이 쇼핑센터에서 직접 상태값을 변경 해주세요.\n');
        common.lang.load('common.npay.em_fail.alert', '교환불가는 네이버페이센터에서 관리해주세요.');
    },
    initTab: function () {
        var self = this;
        common.ui.tap($('#devTap'), function (selector) {
            var status = selector.replace('#', '');
            $('#devSearchStatus').val(status);
            if (status == 'EC') {
                $('#devModifySection').hide();
            } else {
                $('#devModifySection').show();
            }

            if($("#devFixMenuBtn").hasClass("fb__fixemenu-btn--active")) {
                $("#devFixMenuBtn").trigger("click");
            }

            $(document).scroll(); //일괄변경 스크롤 이벤트 줘야지 노출됨
            self.grid.formObj.submit();
        });
    },
    getAuthGridColumns: function (gridColumns) {
        if (manageLevel != 9) {
            var columns = [];
            $.each(gridColumns, function () {
                if (['orderFromText', 'gid'].indexOf(this.key) < 0) {
                    columns.push(this)
                }
            });
            return columns;
        } else {
            return gridColumns;
        }
    },
    grid: false,
    initGrid: function () {
        var self = this;
        // 그리드 생성
        self.grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: true,
            frozenColumnIndex: 3, //열고정
            columns: self.getAuthGridColumns([
                {
                    key: "oid",
                    label: common.lang.get('grid.label.oid'),
                    width: 150,
                    align: 'center',
                    styleClass: 'fb__grid__link'
                },
                {key: "statusText", label: common.lang.get('grid.label.statusText'), width: 120, align: 'center'},
                {key: "order_date", label: common.lang.get('grid.label.order_date'), width: 130, align: 'center'},
                {key: "orderFromText", label: common.lang.get('grid.label.orderFromText'), width: 100, align: 'center'},
                {key: "od_ix", label: common.lang.get('grid.label.od_ix'), width: 90, align: 'right'},
                {key: "company_name", label: common.lang.get('grid.label.company_name'), width: 120},
                {key: "pid", label: common.lang.get('grid.label.pid'), width: 90, align: 'center'},
                {
                    key: "thum_image_src",
                    label: common.lang.get('grid.label.thum_image_src'),
                    align: 'center',
                    width: 80,
                    formatter: function () {
                        return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.image_src + '" height="30" /></div>';
                    }
                },
                {key: "pname", label: common.lang.get('grid.label.pname'), width: 200},
                {key: "option_text", label: common.lang.get('grid.label.option_text'), width: 150},
                {key: "brand_name", label: common.lang.get('grid.label.brand_name'), width: 100},
                {key: "pcode", label: common.lang.get('grid.label.pcode'), width: 90},
                {key: "gid", label: common.lang.get('grid.label.gid'), width: 90},
                {
                    key: "psprice",
                    label: common.lang.get('grid.label.psprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "pcnt", label: common.lang.get('grid.label.pcnt'), width: 70, formatter: 'money', align: 'right'},
                {
                    key: "pt_dcprice",
                    label: common.lang.get('grid.label.pt_dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "buyerInfo", label: common.lang.get('grid.label.buyerInfo'), width: 120},
                {key: "bmobile", label: common.lang.get('grid.label.bmobile'), width: 110, align: 'center'},
                {key: "rname", label: common.lang.get('grid.label.rname'), width: 80},
                {key: "rmobile", label: common.lang.get('grid.label.rmobile'), width: 110, align: 'center'},
                {key: "ic_date", label: common.lang.get('grid.label.ic_date'), width: 130, align: 'center'},
                {key: "dr_date", label: common.lang.get('grid.label.dr_date'), width: 130, align: 'center'},
                {key: "di_date", label: common.lang.get('grid.label.di_date'), width: 130, align: 'center'},
                {key: "dc_date", label: common.lang.get('grid.label.dc_date'), width: 130, align: 'center'},
                {key: "ea_date", label: common.lang.get('grid.label.ea_date'), width: 130, align: 'center'},
                {key: "claimReason", label: common.lang.get('grid.label.claimReason'), width: 200, align: 'left'},
                {key: "returnSendTypeText", label: common.lang.get('grid.label.returnSendTypeText'), width: 150, align: 'left'},
                {key: "turnQuickTextClaim", label: common.lang.get('grid.label.turnQuickTextClaim'), width: 150, align: 'left'},
                {key: "turnInvoiceNo", label: common.lang.get('grid.label.turnInvoiceNo'), width: 150, align: 'left'}
            ]),
            body: {
                mergeCells: ["oid"]
            }
        };

        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
            .setUseHash(false)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUrl(common.util.getControllerUrl('get', 'listOrderExchange', 'order'))
            .on('click', function (e) {
                if (e.column.key == 'oid') {
                    window.open(common.util.getControllerUrl(e.item.oid, 'manageOrder', 'order'));
                }
            })
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
            });
    },
    initForm: function () {
        var self = this;
        common.form.init($('.devModifyForm'), common.util.getControllerUrl('put', 'listOrderExchange', 'order'), function (formData, $form) {
            var odIxList = self.grid.getList('selected', ['od_ix']);
            var orderFromList = self.grid.getList('selected', ['order_from']);
            var coOdIxList = self.grid.getList('selected', ['co_od_ix']).filter(co_od_ix => co_od_ix != '');

            if (coOdIxList.length > 0 && orderFromList == 'self') {
                if (formData[0].value == 'EI') {
                    if(!common.noti.confirm(common.lang.get('common.npay.ei_fail.alert'))) {
                        return false;
                    }
                } else if (formData[0].value == 'EC') {
                    if(!common.noti.confirm(common.lang.get('common.npay.ec_fail.alert'))) {
                        return false;
                    }
                } else if (formData[0].value == 'EM') {
                    common.noti.alert(common.lang.get('common.npay.em_fail.alert'));
                    return false;
                }
            }

            if (!(odIxList.length > 0)) {
                common.noti.alert(common.lang.get('change.no.select.alert'));
                return false;
            }

            if (!common.validation.check($form, 'alert', false)) {
                return false;
            }

            formData.push(common.form.makeData('od_ix', odIxList));
            formData.push(common.form.makeData('order_from', self.grid.getList('selected', 'order_from')));
            formData.push(common.form.makeData('view', self.grid.getList('selected', ['od_ix', 'status'])));
            return formData;
        }, function (response) {
            if (response.result == "success") {
                common.noti.alert(common.lang.get('common.put.success.alert'));
                self.grid.reload();
            } else {
                devChangeOrderStatusResponseObj.noti(response);
            }
        });
    },
    initEvent: function () {
        var self = this;

        //달력
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

        //초기화
        $('#devFormReset').click(function () {
            common.form.reset($('#devGridForm'));
        });

        var setSearechBrand = function (key, text) {
            $('#devBrandIx').val(key);
            $('#devBrandText').val(text);
        }

        var setSearechCompany = function (key, text) {
            $('#devCompanyId').val(key);
            $('#devCompanyText').val(text);
        }
        //판매자 팝업
        $('#devSearchCompanyPopup').click(function () {
            common.pub.open('searchCompany', function (data) {
                setSearechCompany(data.company_id, data.com_name);
            });
        });
        $('#devSearchCompanyReset').click(function () {
            setSearechCompany('', '');
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

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        //상품 내용 수정
        $('.devStatus').click(function () {
            var $form = $(this).closest('form');
            var status = $(this).val();

            var $allOptions = $form.find('.devChangeStatusOption');
            $allOptions.hide();
            common.validation.set($allOptions.find('.devRequired'), {required: false});

            var $selectOptions = $form.find('.devChangeStatusOption[devStatus=' + status + ']');
            $selectOptions.show();
            common.validation.set($selectOptions.find('.devRequired'), {required: true});
        });
    },
    run: function () {
        this.initLang();
        this.initTab();
        this.initForm();
        this.initGrid();
        this.initEvent()
    }
}

$(function(){
    devOrderListOrderExchangeObj.run();
});