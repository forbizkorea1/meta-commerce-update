"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderApplyClaimOrderObj = {
    initLang: function () {
        common.lang.load('grid.label.thum_image_src', '상품이미지');
        common.lang.load('grid.label.pname', '상품명');
        common.lang.load('grid.label.statusText', '처리상태');
        common.lang.load('grid.label.od_ix', '주문상세번호');
        common.lang.load('grid.label.pid', '상품코드');
        common.lang.load('grid.label.option_text', '옵션명');
        common.lang.load('grid.label.brand_name', '브랜드명');
        common.lang.load('grid.label.pcode', '상품관리코드');
        common.lang.load('grid.label.gid', '품목코드');
        common.lang.load('grid.label.psprice', '상품판매단가');
        common.lang.load('grid.label.pcnt', '구매수량');
        common.lang.load('grid.label.applyPcnt', '신청수량');
        common.lang.load('grid.label.pt_dcprice', '상품결제금액');
        common.lang.load('grid.label.company_name', '판매자');


        common.lang.load('common.rejection.reason.alert', '네이버페이 주문의 클레임 사유는 기타로 지정할 수 없습니다.');
        common.lang.load('common.rejection.return.alert', '네이버페이 주문은 반품요청 후 반품승인해야 합니다.');
        common.lang.load('common.rejection.cancel.alert', '네이버페이 주문은 취소요청 후 취소승인해야 합니다.');
        common.lang.load('common.rejection.return.delivery.type.alert', '네이버페이 주문의 반품상품 발송은 직접발송만 지정 할 수 있습니다.');

        common.lang.load('common.apply.success.alert', '신청이 완료되었습니다.');
        common.lang.load('applyPcnt.many.alert', '신청 수량은 구매 수량보다 높을 수 없습니다.');
        common.lang.load('applyPcnt.zero.alert', '신청 수량 `0`보다 커야 합니다.');
    },
    productGrid: false,
    initGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.productGrid = common.ui.grid();

        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            height: '200px',
            columns: [
                {key: "thum_image_src", label: common.lang.get('grid.label.thum_image_src'), align: 'center', width: 80, formatter: function () {
                        return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.image_src + '" height="30" /></div>';
                    }
                },
                {key: "pname", label: common.lang.get('grid.label.pname'), width: 300},
                {key: "option_text", label: common.lang.get('grid.label.option_text'), width: 250},
                {key: "applyPcnt", label: common.lang.get('grid.label.applyPcnt'), width: 70, formatter: 'money', align: 'right', editor: {type: "number"}, styleClass: 'fb__grid__edit--active'},
                {key: "pcnt", label: common.lang.get('grid.label.pcnt'), width: 70, formatter: 'money', align: 'right'},
                {key: "statusText", label: common.lang.get('grid.label.statusText'), width: 120, align: 'center'},
                {key: "od_ix", label: common.lang.get('grid.label.od_ix'), width: 90, align: 'right'},
                {key: "pid", label: common.lang.get('grid.label.pid'), width: 90, align: 'center'},
                {key: "brand_name", label: common.lang.get('grid.label.brand_name'), width: 100},
                {key: "pcode", label: common.lang.get('grid.label.pcode'), width: 90},
                {key: "gid", label: common.lang.get('grid.label.gid'), width: 90},
                {key: "psprice", label: common.lang.get('grid.label.psprice'), width: 90, formatter: 'money', align: 'right'},
                {key: "pt_dcprice", label: common.lang.get('grid.label.pt_dcprice'), width: 90, formatter: 'money', align: 'right'},
                {key: "company_name", label: common.lang.get('grid.label.company_name'), width: 120}
            ]
        };

        //set 신청 수량
        $.each(productData, function (key, value) {
            productData[key].applyPcnt = value.pcnt
        });

        // 그리드 연동
        self.productGrid
                .setGrid($('#devProductGrid'), gridConfig)
                .setReadOnly(false)
                .setContent(productData)
                .on('change', function (data) {
                    if (data.key == 'applyPcnt') {
                        self.changeClaimApply();
                    }
                });
    },
    initForm: function () {
        var self = this;

        common.validation.set($('#devReason, #devReasonDetail'), {'required': true});
        common.validation.set($('#defClaimDeliveryPrice'), {'required': true});
        common.validation.set($('#devReAddressSection input[type=text]:not([name=cmsg]):not([name=rmsg])'), {'required': true});

        common.inputFormat.set($('#defClaimDeliveryPrice'), {number: true});

        common.form.init($('#devClaimForm'), common.util.getControllerUrl('add', 'applyClaimOrder', 'order'), function (formData, $form) {
            if (!common.validation.check($form, 'alert', false)) {
                return false;
            }

            var denyReason = ['ETCB', 'ETCS'];   // 네이버페이 지정불가 사유

            if (paymentMethodData.includes('60')) {  // 네이버페이 주문 확인
                if (denyReason.includes($('#devReason').val())) {
                    common.noti.alert(common.lang.get('common.rejection.reason.alert'));
                    return false;
                } else if ($('#devClaimForm [name=send_type]:checked').val() == 2) {
                    common.noti.alert(common.lang.get('common.rejection.return.delivery.type.alert'));
                    return false;
                } else if ($('#devClaimForm [name=status]:checked').val() == 'RI') {
                    common.noti.alert(common.lang.get('common.rejection.return.alert'));
                    return false;
                } else if ($('#devClaimForm [name=status]:checked').val() == 'CC') {
                    common.noti.alert(common.lang.get('common.rejection.cancel.alert'));
                    return false;
                }
            }

            var check = self.checkApplyPcnt();
            if (!check.result) {
                return false;
            }

            formData.push(common.form.makeData('productList', check.data));

            return formData;
        }, function (response) {
            if (response.result == "success") {
                common.noti.alert(common.lang.get('common.apply.success.alert'));
                location.replace(common.util.getControllerUrl(self.getOid(), 'manageOrder', 'order'));
            } else {
                if (response.data.failMsg) {
                    common.noti.alert(response.data.failMsg);
                } else {
                    common.noti.alert(response.result);
                }
            }
        });
    },
    initEvent: function () {
        var self = this;
        $('#devReason').change(function () {
            self.changeClaimApply();
        });

        var changeRefundTotalPrice = function () {
            var refundTotalPrice;
            if ($('#devSubtraction').is(':checked')) {
                refundTotalPrice = parseInt(self.claimData.refundProductPrice) - parseInt($('#defClaimDeliveryPrice').val());
            } else {
                refundTotalPrice = parseInt(self.claimData.refundProductPrice) + parseInt($('#defClaimDeliveryPrice').val());
            }
            $('#devRefundTotalPrice').text(common.util.numberFormat(refundTotalPrice));
        }

        //환불 배송비 수정
        $('#defClaimDeliveryPrice').on('input', function () {
            changeRefundTotalPrice();
        });

        //환불 배송비 - 차감
        $('#devSubtraction').click(function () {
            changeRefundTotalPrice();
        });

        //신청
        $('#devTopMenuApplyBtn').click(function (e) {
            e.preventDefault();
            $('#devClaimForm').submit();
        });

        //반품상품 발송방법
        $('.devSendType').click(function () {
            self.changeClaimDelivery();
            self.changeClaimApply();
        });

        //반품상품 배송비
        $('.devDeliveryPayType').click(function () {
            self.changeClaimApply();
        });

        //반품상품 주소 찾기
        $('.devSearchAddressPopup').click(function () {
            var type = $(this).data('type');
            common.pub.open('searchAddress', function (data) {
                if(type == 'C'){
                    $('#devClaimForm [name=czip]').val(data.zipcode);
                    $('#devClaimForm [name=caddr1]').val(data.address1);
                }else if(type == 'R'){
                    $('#devClaimForm [name=rzip]').val(data.zipcode);
                    $('#devClaimForm [name=raddr1]').val(data.address1);
                }

            });
        });

        //최초 실행
        self.changeClaimDelivery();
    },
    changeClaimDelivery: function () {
        var sendType = $('.devSendType:checked').val();
        if (sendType == '2') { // 지정택배방문요청(셀러업체와 계약된 택배업체 방문수령 수거)
            common.validation.set($('[name="quick"]'), {'required': false});
            common.validation.set($('[name="invoice_no"]'), {'required': false});
            common.validation.set($('#devReturnAddressSection input[type=text]:not([name=cmsg]):not([name=rmsg])'), {'required': true});
            $('#devReturnAddressSection').show();
            $('.devSendOption').hide();
        } else { // 직접발송(구매자께서 개별로 배송할 경우)
            common.validation.set($('[name="quick"]'), {'required': true});
            common.validation.set($('[name="invoice_no"]'), {'required': true});
            common.validation.set($('#devReturnAddressSection input[type=text]:not([name=cmsg]):not([name=rmsg])'), {'required': false});
            $('#devReturnAddressSection').hide();
            $('.devSendOption').show();
        }
    },
    getOid: function () {
        return $('#devClaimForm [name=oid]').val();
    },
    checkApplyPcnt: function () {
        var self = this;
        var data = self.productGrid.getList('all', ['od_ix', 'applyPcnt', 'pcnt']);
        var result = true;
        $.each(data, function () {
            var applyPcnt = parseInt(this.applyPcnt);
            var pcnt = parseInt(this.pcnt);
            if (applyPcnt > pcnt) {
                result = false;
                common.noti.alert(common.lang.get('applyPcnt.many.alert'));
                return false;
            } else if (!(applyPcnt > 0)) {
                result = false;
                common.noti.alert(common.lang.get('applyPcnt.zero.alert'));
                return false;
            }
        });

        return {result: result, data: data};
    },
    claimData: {},
    changeClaimApply: function () {
        var self = this;
        var reason = $('#devReason').val()
        if (reason != '') {
            var check = self.checkApplyPcnt();
            if (check.result) {
                common.ajax(
                        common.util.getControllerUrl('get', 'applyClaimOrder', 'order')
                        , {
                            oid: self.getOid()
                            , status: $('#devClaimForm [name=status]:checked').val()
                            , reason: reason, productList: common.util.json_encode(check.data)
                            , send_type: $('.devSendType:checked').val()
                            , delivery_pay_type: $('.devDeliveryPayType:checked').val()
                        }
                , function () {
                }, function (response) {
                    if (response.result == "success") {
                        self.claimData = response.data;
                        $('#devRefundProductPrice').text(common.util.numberFormat(response.data.refundProductPrice));
                        $('#devRefundDeliveryPrice').text(common.util.numberFormat(response.data.refundDeliveryPrice));
                        $('#devAddDeliveryPrice').text(common.util.numberFormat(response.data.addDeliveryPrice));
                        $('#devRefundTotalPrice').text(common.util.numberFormat(response.data.refundTotalPrice));
                        if (response.data.claimDeliveryPrice < 0) {
                            $('#devSubtraction').prop('checked', true);
                            $('#defClaimDeliveryPrice').val(response.data.claimDeliveryPrice * -1);
                        } else {
                            $('#devSubtraction').prop('checked', false);
                            $('#defClaimDeliveryPrice').val(response.data.claimDeliveryPrice);
                        }
                    }
                });
            }
        }
    },
    run: function () {
        this.initLang();
        this.initGrid();
        this.initForm();
        this.initEvent();
    }
}

$(function () {
    devOrderApplyClaimOrderObj.run();
});