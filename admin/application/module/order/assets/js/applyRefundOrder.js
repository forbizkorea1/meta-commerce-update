"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderApplyRefundOrderObj = {
    callback: false,
    initLang: function () {
        common.lang.load('grid.refund.claim.label.thum_image_src', '상품이미지');
        common.lang.load('grid.refund.claim.label.pname', '상품명');
        common.lang.load('grid.refund.claim.label.od_ix', '주문상세번호');
        common.lang.load('grid.refund.claim.label.option_text', '옵션명');
        common.lang.load('grid.refund.claim.label.pcnt', '구매수량');
        common.lang.load('grid.refund.claim.label.pt_dcprice', '상품결제금액');
        common.lang.load('grid.refund.claim.label.ode_ix', '배송비번호');
        common.lang.load('grid.refund.claim.label.delivery_dcprice', '배송비');
        common.lang.load('grid.refund.claim.label.claimReason', '클레임 사유');
        common.lang.load('grid.refund.claim.label.claim_group', '클레임 번호');
        common.lang.load('grid.refund.claim.label.refund_product_price', '환불 상품금액');
        common.lang.load('grid.refund.claim.label.claim_delivery_price', '환불 배송비');
        common.lang.load('grid.refund.claim.label.total', '합계');

        common.lang.load('grid.refund.payment.label.methodText', '결제방법');
        common.lang.load('grid.refund.payment.label.remain_price', '잔여금액');
        common.lang.load('grid.refund.payment.label.apply_refund_tax_price', '환불금액(과세)');
        common.lang.load('grid.refund.payment.label.apply_refund_tax_free_price', '환불금액(비과세)');
        common.lang.load('grid.refund.payment.label.apply_refund_price', '총 환불금액');
        common.lang.load('grid.refund.payment.label.manual', '수동처리');

        common.lang.load('refund.put.fail.inputPrice.alert', '환불요청금액과 환불금액이 다릅니다.');
        common.lang.load('refund.put.confirm', '{price} 환불 하시겠습니까?');

        common.lang.load('refund.naver.fail.alert', '네이버페이 주문 : 전체 금액 환불 필요');
        common.lang.load('refund.naver.refund.alert', '네이버페이 주문 : 환불배송비 적용 필요');
    },
    getTotalApplyRefundPrice: function (data) {
        return parseInt(data.apply_refund_tax_price) + parseInt(data.apply_refund_tax_free_price);
    },
    getClaimTotalRefundPrice: function (data) {
        return parseInt(data.refund_product_price) + parseInt(data.claim_delivery_price) + parseInt(data.refund_reserve_price);
    },
    productGrid: false,
    claimGrid: false,
    refundGrid: false,
    initGrid: function () {
        var self = this;

        // 그리드 객체 생성
        self.productGrid = common.ui.grid();

        // 그리드 설정
        var gridConfig = {
            showLineNumber: false,
            height: '150px',
            frozenColumnIndex: 1, //열고정
            columns: [
                {
                    key: "claim_group",
                    label: common.lang.get('grid.refund.claim.label.claim_group'),
                    width: 90,
                    align: 'right'
                },
                {key: "od_ix", label: common.lang.get('grid.refund.claim.label.od_ix'), width: 90, align: 'right'},
                {
                    key: "thum_image_src",
                    label: common.lang.get('grid.refund.claim.label.thum_image_src'),
                    align: 'center',
                    width: 80,
                    formatter: function () {
                        return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.image_src + '" height="30" /></div>';
                    }
                },
                {key: "pname", label: common.lang.get('grid.refund.claim.label.pname'), width: 200},
                {key: "option_text", label: common.lang.get('grid.label.option_text'), width: 150},

                {
                    key: "pcnt",
                    label: common.lang.get('grid.refund.claim.label.pcnt'),
                    width: 70,
                    formatter: 'money',
                    align: 'right'
                },
                {
                    key: "pt_dcprice",
                    label: common.lang.get('grid.refund.claim.label.pt_dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "ode_ix", label: common.lang.get('grid.refund.claim.label.ode_ix'), width: 90, align: 'center'},
                {
                    key: "delivery_dcprice",
                    label: common.lang.get('grid.refund.claim.label.delivery_dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "claimReason", label: common.lang.get('grid.refund.claim.label.claimReason'), width: 250}
            ],
            body: {
                mergeCells: ["claim_group"]
            }
        };

        // 그리드 연동
        self.productGrid
            .setGrid($('#devClaimProductGrid'), gridConfig)
            .setUseHash(false)
            .setContent(productData);

        // 그리드 객체 생성
        self.claimGrid = common.ui.grid();

        // 그리드 설정
        var claimGridHeight = (claimData.length > 2 ? 2 : claimData.length) * 36;
        claimGridHeight += 55; //header 높이 추가
        var claimGridFootSum = [];
        if (claimData.length > 1) {
            claimGridHeight += 36; //foot 높이 추가
            claimGridFootSum = [
                [
                    {label: common.lang.get('grid.refund.claim.label.total'), align: 'center'},
                    {key: "refund_product_price", collector: "sum", formatter: "money", align: "right"},
                    {key: "claim_delivery_price", collector: "sum", formatter: "money", align: "right"},
                    {
                        key: "total_refund_price", formatter: "money", align: "right", collector: function () {
                        var price = 0;
                        this.list.forEach(function (n) {
                            price += self.getClaimTotalRefundPrice(n);
                        });
                        return ax5.util.number(price, {"money": 1});
                    }
                    }
                ]
            ];
        }
        var gridConfig = {
            showLineNumber: false,
            height: claimGridHeight + 'px',
            columns: [
                {
                    key: "claim_group",
                    label: common.lang.get('grid.refund.claim.label.claim_group'),
                    width: 200,
                    align: 'right'
                },
                {
                    key: "refund_product_price",
                    label: common.lang.get('grid.refund.claim.label.refund_product_price'),
                    width: 200,
                    formatter: 'money',
                    align: 'right'
                },
                {
                    key: "claim_delivery_price",
                    label: common.lang.get('grid.refund.claim.label.claim_delivery_price'),
                    width: 200,
                    align: 'right',
                    formatter: 'money',
                    editor: {type: "number", updateWith: ['total_refund_price']},
                    styleClass: 'fb__grid__edit--active'
                },
                {
                    key: "total_refund_price",
                    label: common.lang.get('grid.refund.claim.label.total'),
                    width: '*',
                    align: 'right',
                    formatter: function () {
                        var price = self.getClaimTotalRefundPrice(this.item);
                        return ax5.util.number(price, {"money": 1});
                    }
                }
            ]
            , footSum: claimGridFootSum
        };

        // 그리드 연동
        self.claimGrid
            .setGrid($('#devClaimGrid'), gridConfig)
            .setReadOnly(false)
            .setUseHash(false)
            .setContent(claimData);

        // 그리드 객체 생성
        self.refundGrid = common.ui.grid();

        var refundGridHeight = (paymentData.length > 2 ? 2 : paymentData.length) * 36;
        refundGridHeight += 55; //header 높이 추가
        var refundGridFootSum = [];
        if (paymentData.length > 1) {
            refundGridHeight += 36; //foot 높이 추가
            refundGridFootSum = [
                [
                    {label: common.lang.get('grid.refund.claim.label.total'), align: 'center', colspan: 3},
                    {
                        key: "apply_refund_tax_price", formatter: "money", align: "right", collector: function () {
                        var price = 0;
                        this.list.forEach(function (n) {
                            price += parseInt(n.apply_refund_tax_price);
                        });
                        return ax5.util.number(price, {"money": 1});
                    }
                    },
                    {key: "apply_refund_tax_free_price", collector: "sum", formatter: "money", align: "right"},
                    {
                        key: "apply_refund_price", formatter: "money", align: "right", collector: function () {
                        var price = 0;
                        this.list.forEach(function (n) {
                            price += self.getTotalApplyRefundPrice(n);
                        });
                        return ax5.util.number(price, {"money": 1});
                    }
                    }
                ]
            ];
        }

        // 그리드 설정
        var gridConfig = {
                showLineNumber: false,
                height: refundGridHeight + 'px',
                columns: [
                    {
                        key: "manual",
                        label: common.lang.get('grid.refund.payment.label.manual'),
                        width: 90,
                        align: 'center',
                        editor: {
                            type: "checkbox", config: {trueValue: "Y", falseValue: "N"}
                        }
                        , styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "methodText",
                        label: common.lang.get('grid.refund.payment.label.methodText'),
                        width: '*'
                    },
                    {
                        key: "remain_price",
                        label: common.lang.get('grid.refund.payment.label.remain_price'),
                        width: 130,
                        formatter: 'money',
                        align: 'right'
                    },
                    {
                        key: "apply_refund_tax_price",
                        label: common.lang.get('grid.refund.payment.label.apply_refund_tax_price'),
                        width: 130,
                        formatter: 'money',
                        align: 'right',
                        editor: {type: "number", updateWith: ['apply_refund_price']},
                        styleClass: 'fb__grid__edit--active'
                    },
                    {
                        key: "apply_refund_tax_free_price",
                        label: common.lang.get('grid.refund.payment.label.apply_refund_tax_free_price'),
                        width: 130,
                        formatter: 'money',
                        align: 'right'
                    },
                    {
                        key: "apply_refund_price",
                        label: common.lang.get('grid.refund.payment.label.apply_refund_price'),
                        width: 130,
                        formatter: function () {
                            var price = self.getTotalApplyRefundPrice(this.item);
                            return ax5.util.number(price, {"money": 1});
                        },
                        align: 'right'
                    }
                ]
                ,
                footSum: refundGridFootSum
            }
        ;

        // 그리드 연동
        self.refundGrid
            .setGrid($('#devRefundGrid'), gridConfig)
            .setReadOnly(false)
            .setUseHash(false)
            .setContent(paymentData);
    },
    initForm: function () {
        var self = this;

        common.validation.set($('#bankCode, #bankNumber, #bankOwner'), {'required': true});

        common.form.init($('#devRefundForm'), common.util.getControllerUrl('put', 'applyRefundOrder', 'order'), function (formData, $form) {
            if (!common.validation.check($form, 'alert', false)) {
                return false;
            }

            var claim = self.claimGrid.getList('all', ['claim_group', 'claim_delivery_price', 'refund_product_price','refund_reserve_price']);
            var claimTotalRefundPrice = 0;
            claim.forEach(function (d) {
                claimTotalRefundPrice += self.getClaimTotalRefundPrice(d);
            });

            var refund = self.refundGrid.getList('all', ['manual', 'method', 'escrow_use', 'payment_price', 'refund_price', 'remain_price', 'apply_refund_tax_price', 'apply_refund_tax_free_price']);
            var totalRefundPrice = 0;
            refund.forEach(function (d, key) {
                var apply_refund_price = self.getTotalApplyRefundPrice(d);
                refund[key].apply_refund_price = apply_refund_price;
                totalRefundPrice += apply_refund_price;
            });

            //금액 체크 후 처리
            if (claimTotalRefundPrice != totalRefundPrice) {
                common.noti.alert(common.lang.get('refund.put.fail.inputPrice.alert'));
                return false;
            }

            //네이버페이 환불배송비 확인
            /*if (npayData != null) {
                if (npayData.npayInfoText != undefined) {
                    var refundFee = npayData.npayRefundFee;
                    var claim_ix;

                    for (claim_ix = 0; claim_ix < claim.length; claim_ix++) {
                        if (!refundFee.includes(claim[claim_ix].claim_group) && claim[claim_ix].claim_delivery_price != 0) {
                            common.noti.alert(common.lang.get('refund.naver.fail.alert'));
                            return false;
                        } else if (refundFee.includes(claim[claim_ix].claim_group) && claim[claim_ix].claim_delivery_price == 0) {
                            common.noti.alert(common.lang.get('refund.naver.refund.alert'));
                            return false;
                        }
                    }
                }
            }*/

            if (common.noti.confirm(common.lang.get('refund.put.confirm', {price: common.util.numberFormat(totalRefundPrice)}))) {
                formData.push(common.form.makeData('product', self.productGrid.getList('all', ['od_ix', 'pt_dcprice'])));
                formData.push(common.form.makeData('claim', claim));
                formData.push(common.form.makeData('refund', refund));
                return formData;
            } else {
                return false;
            }


        }, function (response) {
            if (response.result == "success") {
                common.util.modal.close();
                if ($.isFunction(self.callback)) {
                    self.callback();
                }
            } else if (response.result == "changeOrderRefundStatusFail") {
                common.noti.alert(response.data.failMsg);
            } else {
                common.noti.alert(response.result);
            }
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initGrid();
        self.initForm();
    }
}

$(function () {
        devOrderApplyRefundOrderObj.run();
    }
)
;