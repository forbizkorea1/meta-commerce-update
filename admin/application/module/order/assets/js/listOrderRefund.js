"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderListOrderRefundObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.act', '관리');
        common.lang.load('grid.label.oid', '주문번호');
        common.lang.load('grid.label.claim_group', '클레임번호');
        common.lang.load('grid.label.refundStatusText', '환불상태');
        common.lang.load('grid.label.od_ix', '주문상세번호');
        common.lang.load('grid.label.statusText', '처리상태');
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
        common.lang.load('grid.label.ode_ix', '배송비번호');
        common.lang.load('grid.label.delivery_dcprice', '배송비');
        common.lang.load('grid.label.buyerInfo', '주문자');
        common.lang.load('grid.label.bmobile', '주문자 휴대폰 번호');
        common.lang.load('grid.label.ic_date', '입금일자');
        common.lang.load('grid.label.claimReason', '취소사유');
        common.lang.load('grid.label.order_date', '주문일자');
        common.lang.load('grid.label.fa_date', '환불요청일자');
        common.lang.load('grid.label.fc_date', '환불완료일자');

        common.lang.load('change.no.select.alert', '변경할 항목을 선택해주세요.');

        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
    },
    initTab: function () {
        var self = this;
        common.ui.tap($('#devTap'), function (selector) {
            var actCellConfig = self.getGridActCellConfig();
            var refundStatus = selector.replace('#', '');
            $('#devSearchStatus').val(refundStatus);
            if (selector == '#FA') {
                $('#devSearchDateType').val('fa_date');
                self.grid.addColumn(actCellConfig.column, actCellConfig.positionIndex);
            } else if (selector == '#FC') {
                $('#devSearchDateType').val('fc_date');
                self.grid.removeColumn(actCellConfig.positionIndex);
            }
            $(document).scroll(); //일괄변경 스크롤 이벤트 줘야지 노출됨
            self.grid.formObj.submit();
        });
    },
    getGridActCellConfig: function () {
        return {
            positionIndex: 1
            , column: {
                key: "refundGroup",
                label: common.lang.get('grid.label.act'),
                width: 70,
                align: 'center',
                styleClass: 'fb__grid__link',
                formatter: function () {
                    return '환불';
                }
            }
        };
    },
    grid: false,
    initGrid: function () {
        var self = this;
        // 그리드 생성
        self.grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            frozenColumnIndex: 4, //열고정
            columns: [
                {
                    key: "oid",
                    label: common.lang.get('grid.label.oid'),
                    width: 150,
                    align: 'center',
                    styleClass: 'fb__grid__link'
                },
                self.getGridActCellConfig().column,
                {key: "claim_group", label: common.lang.get('grid.label.claim_group'), width: 90, align: 'right'},
                {
                    key: "refundStatusText",
                    label: common.lang.get('grid.label.refundStatusText'),
                    width: 120,
                    align: 'center'
                },
                {key: "od_ix", label: common.lang.get('grid.label.od_ix'), width: 90, align: 'right'},
                {key: "statusText", label: common.lang.get('grid.label.statusText'), width: 120, align: 'center'},
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
                {
                    key: "pcnt",
                    label: common.lang.get('grid.label.pcnt'),
                    width: 70,
                    formatter: 'money',
                    align: 'right'
                },
                {
                    key: "pt_dcprice",
                    label: common.lang.get('grid.label.pt_dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "ode_ix", label: common.lang.get('grid.label.ode_ix'), width: 90, align: 'center'},
                {
                    key: "delivery_dcprice",
                    label: common.lang.get('grid.label.delivery_dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "buyerInfo", label: common.lang.get('grid.label.buyerInfo'), width: 120},
                {key: "bmobile", label: common.lang.get('grid.label.bmobile'), width: 110, align: 'center'},
                {key: "ic_date", label: common.lang.get('grid.label.ic_date'), width: 130, align: 'center'},
                {key: "claimReason", label: common.lang.get('grid.label.claimReason'), width: 200, align: 'left'},
                {key: "order_date", label: common.lang.get('grid.label.order_date'), width: 130, align: 'center'},
                {key: "fa_date", label: common.lang.get('grid.label.fa_date'), width: 130, align: 'center'},
                {key: "fc_date", label: common.lang.get('grid.label.fc_date'), width: 130, align: 'center'}
            ],
            body: {
                mergeCells: ["oid", 'refundGroup', 'claim_group']
            }
        };

        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUrl(common.util.getControllerUrl('get', 'listOrderRefund', 'order'))
            .on('click', function (e) {
                if (e.column.key == 'oid') {
                    location.href = common.util.getControllerUrl(e.item.oid, 'manageOrder', 'order');
                } else if (e.column.key == 'refundGroup') {
                    common.util.modal.open('ajax', '환불', common.util.getControllerUrl('applyRefundOrder', 'order'), {oid: e.item.oid}, function () {
                        devOrderApplyRefundOrderObj.callback = function () {
                            self.grid.reload();
                        }
                    }, {width: '900px', height: '850px'});
                }
            })
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
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

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });
    },
    run: function () {
        this.initLang();
        this.initTab();
        this.initGrid();
        this.initEvent()
    }
}

$(function () {
        devOrderListOrderRefundObj.run();
    }
)
;