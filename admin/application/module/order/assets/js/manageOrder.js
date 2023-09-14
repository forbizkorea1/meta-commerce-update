"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderManageOrderObj = {
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
        common.lang.load('grid.label.dcprice', '상품판매단가');
        common.lang.load('grid.label.pcnt', '구매수량');

        common.lang.load('grid.label.plan_dc', '기획할인');
        common.lang.load('grid.label.user_dc', '회원할인');
        common.lang.load('grid.label.special_dc', '특별할인');
        common.lang.load('grid.label.coupon_dc', '쿠폰할인');
        common.lang.load('grid.label.coupon_info', '쿠폰정보');
        common.lang.load('grid.label.use_reserve', '마일리지 사용');
        common.lang.load('grid.label.reserve', '예상적립 마일리지');

        common.lang.load('grid.label.pt_dcprice', '상품결제금액');
        common.lang.load('grid.label.company_name', '판매자');
        common.lang.load('grid.label.odd_ix', '배송지 번호');
        common.lang.load('grid.label.rname', '수취인');
        common.lang.load('grid.label.rmobile', '수취인 휴대폰 번호');
        common.lang.load('grid.label.zip', '수취인 우편번호');
        common.lang.load('grid.label.addr1', '수취인 주소');
        common.lang.load('grid.label.addr2', '수취인 상세주소');
        common.lang.load('grid.label.ode_ix', '배송비번호');
        common.lang.load('grid.label.odd_msg', '배송요청사항');
        common.lang.load('grid.label.delivery_dcprice', '배송비');
        common.lang.load('grid.label.quickText', '택배업체');
        common.lang.load('grid.label.invoice_no', '송장번호');
        common.lang.load('grid.label.dr_date', '배송준비중일자');
        common.lang.load('grid.label.di_date', '배송일자');
        common.lang.load('grid.label.dc_date', '배송완료일자');
        common.lang.load('grid.label.dc_inquire', '배송조회');
        common.lang.load('grid.label.claimReason', '클레임 사유');
        common.lang.load('grid.label.claimApplyDate', '클레임 신청일자');
        common.lang.load('grid.label.returnSendTypeText', '교환/반품발송방법');
        common.lang.load('grid.label.turnQuickTextClaim', '회수 택배사');
        common.lang.load('grid.label.turnInvoiceNo', '회수 송장번호');

        common.lang.load('grid.memo.label.memoDivText', '분류');
        common.lang.load('grid.memo.label.memo', '메모');
        common.lang.load('grid.memo.label.memoStateText', '처리상태');
        common.lang.load('grid.memo.label.counselor', '작성자');
        common.lang.load('grid.memo.label.regdate', '작성일');
        common.lang.load('grid.memo.label.act', '관리');

        common.lang.load('grid.payment.label.methodText', '결제방법');
        common.lang.load('grid.payment.label.payment_price', '결제금액');
        common.lang.load('grid.payment.label.refund_price', '환불금액');
        common.lang.load('grid.payment.label.remain_price', '잔여금액');
        common.lang.load('grid.payment.label.etc', '기타');

        common.lang.load('change.no.select.alert', '변경할 항목을 선택해주세요.');

        common.lang.load('change.claim.apply.odeIx.fail.alert', '배송비번호가 같아야 신청이 가능합니다.');
        common.lang.load('change.cancel.apply.fail.alert', '배송 `전` 주문 건수만 신청 가능합니다.');
        common.lang.load('change.return.apply.fail.alert', '배송 `후` 주문 건수만 신청 가능합니다.');

        common.lang.load('change.income.complete.naver.fail.alert', '네이버페이 주문입니다. 입금확인은 네이버페이센터에서 관리해주세요.');
        common.lang.load('change.exchange.naver.fail.alert', '네이버페이 주문입니다. 교환요청 및 승인은 네이버페이센터에서 관리해주세요.');
		common.lang.load('change.delivery.escrow.fail.alert', '에스크로 주문입니다. 전체 주문 건만 배송중으로 변경 가능합니다.');
		
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
    },
    initForm: function () {
        var self = this;
        common.validation.set($('#devBuyerForm [name="bmobile"]'), {'required': true});

        //주문자 정보 form init
        common.form.init($('#devBuyerForm'), common.util.getControllerUrl('putBuyer', 'manageOrder', 'order'), function (formData, $form) {
            if (!common.validation.check($form, 'alert', false)) {
                return false;
            }

            if (!common.regExp.mobile.test($('#devBuyerForm [name="bmobile"]').val())) {
                common.noti.alert(common.lang.get('common.validation.mobile.fail'));
                $('input[name=bmobile]').focus();
                return false;
            }

            formData.push(common.form.makeData('oid', self.getOid()));
            return formData;
        }, function (response) {
            if (response.result == "success") {
                common.noti.alert(common.lang.get('common.put.success.alert'));
                location.reload();
            } else {
                common.noti.alert(response.result);
            }
        });

        if ($('#devIncomCompleteForm').length > 0) {
            common.form.init($('#devIncomCompleteForm'), common.util.getControllerUrl('putIncomComplete', 'manageOrder', 'order'), function (formData, $form) {
                //네이버페이 입금확인 알럿
                if (self.getPaymentMethod() == '60') {
                    common.noti.alert(common.lang.get('change.income.complete.naver.fail.alert'));
                    return false;
                }

                formData.push(common.form.makeData('oid', self.getOid()));
                return formData;
            }, function (response) {
                if (response.result == "success") {
                    common.noti.alert(common.lang.get('common.put.success.alert'));
                    location.reload();
                } else {
                    devChangeOrderStatusResponseObj.noti(response);
                }
            });
        }

        if ($('#devChangeOrderStatusForm').length > 0) {
            common.validation.set($('#devChangeOrderStatusSelect'), {'required': true});

            common.form.init($('#devChangeOrderStatusForm'), common.util.getControllerUrl('putStatus', 'manageOrder', 'order'), function (formData, $form) {
                var method = $('#devOrderMethod').val();
                var status = $('#devChangeOrderStatusSelect').val();
                if (!common.validation.check($form, 'alert', false)) {
                    return false;
                }

                var odIxList = self.normalProductGrid.getList('selected', ['od_ix']);
                if (!(odIxList.length > 0)) {
                    common.noti.alert(common.lang.get('change.no.select.alert'));
                    return false;
                }

                if (status == 'CA' || status == 'RA' || status == 'EA') {//취소,반품,교환 요청
                    var odeIxList = self.normalProductGrid.getList('selected', ['ode_ix']);
                    var odeIx = false;
                    var odeIxBool = true;

                    //네이버페이 교환요청 알럿
                    var selectCoOidList = self.normalProductGrid.getList('selected', ['co_oid']).filter(co_oid => co_oid != '');

                    if (status == 'EA' && selectCoOidList.length > 0 && self.getPaymentMethod() == '60') {
                        common.noti.alert(common.lang.get('change.exchange.naver.fail.alert'));
                        return false;
                    }

                    $.each(odeIxList, function () {
                        if (odeIx === false) {
                            odeIx = this;
                        }
                        if (odeIx != this) {
                            odeIxBool = false;
                            return false;
                        }
                    });

                    if (!odeIxBool) {
                        common.noti.alert(common.lang.get('change.claim.apply.odeIx.fail.alert'));
                        return false;
                    }

                    var viewStatusList = self.normalProductGrid.getList('selected', ['status']);
                    var actionBool = true;
                    $.each(viewStatusList, function () {
                        if (status == 'CA') {
                            if (['IC', 'DR', 'DD'].indexOf(this) < 0) {
                                actionBool = false;
                                return false;
                            }
                        } else {
                            if (['DI', 'DC', 'BF'].indexOf(this) < 0) {
                                actionBool = false;
                                return false;
                            }
                        }
                    });
                    if (actionBool) {
                        location.href = common.util.getControllerUrl('applyClaimOrder', 'order') + '/' + status + '/' + self.getOid() + '/' + odIxList.join('/');
                    } else {
                        if (status == 'CA') {
                            common.noti.alert(common.lang.get('change.cancel.apply.fail.alert'));
                        } else {
                            common.noti.alert(common.lang.get('change.return.apply.fail.alert'));
                        }
                    }
                } else if(status == 'CA') {
                    location.href = common.util.getControllerUrl('applyClaimOrder', 'order') + '/' + status + '/' + self.getOid() + '/' + odIxList.join('/');
                } else {
                    if (status == 'DI' && (method == 16 || method == 17)) {
                        // 이니시스 에스크로 주문건
                        var orderList = self.normalProductGrid.getList(['od_ix']);

                        if (odIxList.length != orderList.length) {
                            common.noti.alert(common.lang.get('change.delivery.escrow.fail.alert'));
                            return false;
                        }
                    }

                    formData.push(common.form.makeData('oid', self.getOid()));
                    formData.push(common.form.makeData('od_ix', odIxList));
                    formData.push(common.form.makeData('view', self.normalProductGrid.getList('selected', ['od_ix', 'status'])));
                    return formData;
                }
            }, function (response) {
                if (response.result == "success") {
                    common.noti.alert(common.lang.get('common.put.success.alert'));
                    self.productGridReload();
                } else {
                    if (response.data.failMsg == false) {
                        devChangeOrderStatusResponseObj.noti(response);
                    } else {
						common.noti.alert(response.data.failMsg);
                    }
                }
            });
        }
    },
    normalProductGrid: false,
    claimProductGrid: false,
    memoGrid: false,
    initGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.normalProductGrid = common.ui.grid();

        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: ($('#devIncomCompleteForm').length > 0 ? false : true),
            height: '300px',
            frozenColumnIndex: 4, //열고정
            columns: [
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
                {key: "statusText", label: common.lang.get('grid.label.statusText'), width: 120, align: 'center'},
                {
                    key: "odd_ix",
                    label: common.lang.get('grid.label.odd_ix'),
                    width: 80,
                    align: 'center',
                    styleClass: 'fb__grid__edit--active'
                },
                {key: "od_ix", label: common.lang.get('grid.label.od_ix'), width: 90, align: 'right'},
                {key: "pid", label: common.lang.get('grid.label.pid'), width: 90, align: 'center'},
                {key: "option_text", label: common.lang.get('grid.label.option_text'), width: 150},
                {key: "brand_name", label: common.lang.get('grid.label.brand_name'), width: 100},
                {key: "pcode", label: common.lang.get('grid.label.pcode'), width: 90},
                {key: "gid", label: common.lang.get('grid.label.gid'), width: 90},
                {
                    key: "psprice",
                    label: common.lang.get('grid.label.dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "pcnt", label: common.lang.get('grid.label.pcnt'), width: 70, formatter: 'money', align: 'right'},
                {key: "user_dc", label: common.lang.get('grid.label.user_dc'), width: 70, formatter: 'money', align: 'right'},
                {key: "plan_dc", label: common.lang.get('grid.label.plan_dc'), width: 70, formatter: 'money', align: 'right'},
                {key: "special_dc", label: common.lang.get('grid.label.special_dc'), width: 70, formatter: 'money', align: 'right'},
                {key: "coupon_dc", label: common.lang.get('grid.label.coupon_dc'), width: 70, formatter: 'money', align: 'right'},
                {
                    key: "coupon_info",
                    label: common.lang.get('grid.label.coupon_info'),
                    width: 190,
                    align: 'center',
                    formatter: function () {
                        return [
                            '<div title = "' + this.item.coupon_info + '"><span>' + this.item.coupon_info + '</span></div>'
                        ].join('');
                    }
                },
                {key: "use_reserve", label: common.lang.get('grid.label.use_reserve'), width: 90, formatter: 'money', align: 'right'},
                {key: "pt_dcprice", label: common.lang.get('grid.label.pt_dcprice'),  width: 90, formatter: 'money', align: 'right'},
                {key: "reserve", label: common.lang.get('grid.label.reserve'), width: 120, formatter: 'money', align: 'right'},
                {key: "company_name", label: common.lang.get('grid.label.company_name'), width: 120},
                {key: "rname", label: common.lang.get('grid.label.rname'), width: 80},
                {key: "rmobile", label: common.lang.get('grid.label.rmobile'), width: 110, align: 'center'},
                {key: "zip", label: common.lang.get('grid.label.zip'), width: 80, align: 'center'},
                {key: "addr1", label: common.lang.get('grid.label.addr1'), width: 250},
                {key: "addr2", label: common.lang.get('grid.label.addr2'), width: 200},
                {key: "ode_ix", label: common.lang.get('grid.label.ode_ix'), width: 90, align: 'center'},
                {key: "odd_msg", label: common.lang.get('grid.label.odd_msg'), width: 120, align: 'center'},
                {
                    key: "delivery_dcprice",
                    label: common.lang.get('grid.label.delivery_dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "quickText", label: common.lang.get('grid.label.quickText'), width: 100},
                {key: "invoice_no", label: common.lang.get('grid.label.invoice_no'), width: 100},
                {key: "dr_date", label: common.lang.get('grid.label.dr_date'), width: 130, align: 'center'},
                {key: "di_date", label: common.lang.get('grid.label.di_date'), width: 130, align: 'center'},
                {key: "dc_date", label: common.lang.get('grid.label.dc_date'), width: 130, align: 'center'},
                {
                    key: "dc_date",
                    label: common.lang.get('grid.label.dc_inquire'),
                    width: 130,
                    align: 'center',
                    formatter: function () {
                        console.log(this.item);
                        return [
                            '<button type="button" id="devOrderTraceInvoiceBtn" class="fb-filter__edit" data-idx="' + this.item.__index + '">배송추적</button>'
                        ].join('');
                    }
                }
            ],
            body: {
                mergeCells: ["odd_ix"]
            }
        };

        // 그리드 연동
        self.normalProductGrid
            .setGrid($('#devNormalProductGrid'), gridConfig)
            .setReadOnly(false)
            .on('dblClick', function (data) {
                if (data.column.key == 'odd_ix') {
                    self.orderMemoDeliveryInfo(data.value);
                }
            });

        // 그리드 객체 생성
        self.claimProductGrid = common.ui.grid();

        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            height: '200px',
            frozenColumnIndex: 4, //열고정
            columns: [
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
                {key: "statusText", label: common.lang.get('grid.label.statusText'), width: 120, align: 'center'},
                {
                    key: "odd_ix",
                    label: common.lang.get('grid.label.odd_ix'),
                    width: 80,
                    align: 'center',
                    styleClass: 'fb__grid__edit--active'
                },
                {key: "od_ix", label: common.lang.get('grid.label.od_ix'), width: 90, align: 'right'},
                {key: "pid", label: common.lang.get('grid.label.pid'), width: 90, align: 'center'},
                {key: "option_text", label: common.lang.get('grid.label.option_text'), width: 150},
                {key: "brand_name", label: common.lang.get('grid.label.brand_name'), width: 100},
                {key: "pcode", label: common.lang.get('grid.label.pcode'), width: 90},
                {key: "gid", label: common.lang.get('grid.label.gid'), width: 90},
                {
                    key: "psprice",
                    label: common.lang.get('grid.label.dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "pcnt", label: common.lang.get('grid.label.pcnt'), width: 70, formatter: 'money', align: 'right'},
                {key: "user_dc", label: common.lang.get('grid.label.user_dc'), width: 70, formatter: 'money', align: 'right'},
                {key: "plan_dc", label: common.lang.get('grid.label.plan_dc'), width: 70, formatter: 'money', align: 'right'},
                {key: "special_dc", label: common.lang.get('grid.label.special_dc'), width: 70, formatter: 'money', align: 'right'},
                {key: "coupon_dc", label: common.lang.get('grid.label.coupon_dc'), width: 70, formatter: 'money', align: 'right'},
                {
                    key: "coupon_info",
                    label: common.lang.get('grid.label.coupon_info'),
                    width: 190,
                    align: 'center',
                    formatter: function () {
                        return [
                            '<div title = "' + this.item.coupon_info + '"><span>' + this.item.coupon_info + '</span></div>'
                        ].join('');
                    }
                },
                {key: "use_reserve", label: common.lang.get('grid.label.use_reserve'), width: 90, formatter: 'money', align: 'right'},
                {key: "pt_dcprice", label: common.lang.get('grid.label.pt_dcprice'), width: 90, formatter: 'money', align: 'right'},
                {key: "reserve", label: common.lang.get('grid.label.reserve'), width: 120, formatter: 'money', align: 'right'},
                {key: "company_name", label: common.lang.get('grid.label.company_name'), width: 120},
                {key: "rname", label: common.lang.get('grid.label.rname'), width: 80},
                {key: "rmobile", label: common.lang.get('grid.label.rmobile'), width: 110, align: 'center'},
                {key: "zip", label: common.lang.get('grid.label.zip'), width: 80, align: 'center'},
                {key: "addr1", label: common.lang.get('grid.label.addr1'), width: 250},
                {key: "addr2", label: common.lang.get('grid.label.addr2'), width: 200},
                {key: "ode_ix", label: common.lang.get('grid.label.ode_ix'), width: 90, align: 'center'},
                {key: "odd_msg", label: common.lang.get('grid.label.odd_msg'), width: 120, align: 'center'},
                {
                    key: "delivery_dcprice",
                    label: common.lang.get('grid.label.delivery_dcprice'),
                    width: 90,
                    formatter: 'money',
                    align: 'right'
                },
                {key: "quickText", label: common.lang.get('grid.label.quickText'), width: 100},
                {key: "invoice_no", label: common.lang.get('grid.label.invoice_no'), width: 100},
                {key: "dr_date", label: common.lang.get('grid.label.dr_date'), width: 130, align: 'center'},
                {key: "di_date", label: common.lang.get('grid.label.di_date'), width: 130, align: 'center'},
                {key: "dc_date", label: common.lang.get('grid.label.dc_date'), width: 130, align: 'center'},
                {key: "claimReason", label: common.lang.get('grid.label.claimReason'), width: 250},
                {
                    key: "claimApplyDate",
                    label: common.lang.get('grid.label.claimApplyDate'),
                    width: 130,
                    align: 'center'
                },
                {key: "returnSendTypeText", label: common.lang.get('grid.label.returnSendTypeText'), width: 150, align: 'left'},
                {key: "turnQuickTextClaim", label: common.lang.get('grid.label.turnQuickTextClaim'), width: 100},
                {key: "turnInvoiceNo", label: common.lang.get('grid.label.turnInvoiceNo'), width: 100},
            ],
            body: {
                mergeCells: ["odd_ix"]
            }
        };

        // 그리드 연동
        self.claimProductGrid
            .setGrid($('#devClaimProductOrderGrid'), gridConfig)
            .setReadOnly(false)
            .on('dblClick', function (data) {
                if (data.column.key == 'odd_ix') {
                    self.orderMemoDeliveryInfo(data.value);
                }
            }).on('dblClick', function (e) {
            if (e.column.key == 'refundGroup') {
                if(e.item.refund_status == 'FA'){
                    common.util.modal.open('ajax', '환불'
                        , common.util.getControllerUrl('applyRefundOrder', 'order')
                        , {oid: self.getOid()}
                        , function () {
                            devOrderApplyRefundOrderObj.callback = function () {
                                self.claimProductGrid.reload();
                            }
                        }, {width: '900px', height: '800px'});
                }

            }
        });

        if ($('#devMemoGrid').length > 0) {
            // 그리드 객체 생성
            self.memoGrid = common.ui.grid();

            // 그리드 설정
            var gridConfig = {
                showLineNumber: true,
                height: '200px',
                columns: [
                    {
                        key: "memoDivText",
                        label: common.lang.get('grid.memo.label.memoDivText'),
                        width: 150,
                        align: 'center'
                    },
                    {key: "memo", label: common.lang.get('grid.memo.label.memo'), width: '*'},
                    {
                        key: "memoStateText",
                        label: common.lang.get('grid.memo.label.memoStateText'),
                        width: 120,
                        align: 'center'
                    },
                    {
                        key: "counselor",
                        label: common.lang.get('grid.memo.label.counselor'),
                        width: 120,
                        align: 'center'
                    },
                    {key: "regdate", label: common.lang.get('grid.memo.label.regdate'), width: 200, align: 'center'},
                    {
                        key: "act",
                        label: common.lang.get('grid.memo.label.act'),
                        align: "center",
                        width: 150,
                        formatter: function () {
                            return [
                                '<input type="button" class="fb-filter__edit devMemoModify" data-om_ix="' + this.item.om_ix + '" value="수정" />'
                            ].join('');
                        }
                    }
                ]
            };

            // 그리드 연동
            $('body').append('<form id="devMemoForm"></form>');
            self.memoGrid.setGrid($('#devMemoGrid'), gridConfig)
                .setForm('#devMemoForm')
                .setUrl(common.util.getControllerUrl('getMemoList', 'manageOrder', 'order'))
                .setReadOnly(false)
                .setUseHash(false)
                .init(function (response) {
                    self.memoGrid.setContent(response.data);
                }, function (formData) {
                    formData.push(common.form.makeData('oid', self.getOid()));
                    return formData;
                });

            // 수정
            $('#devMemoGrid [data-ax5grid-panel="body"]').on('click', '.devMemoModify', function () {
                self.orderMemoModal($(this).data('om_ix'));
            });
        }

        if ($('#devPaymentGrid').length > 0) {
            // 그리드 객체 생성
            var paymentGrid = common.ui.grid();

            // 그리드 설정
            var gridConfig = {
                showLineNumber: true,
                height: '150px',
                columns: [
                    {
                        key: "methodText",
                        label: common.lang.get('grid.payment.label.methodText'),
                        width: 150,
                        align: 'center'
                    },
                    {
                        key: "payment_price",
                        label: common.lang.get('grid.payment.label.payment_price'),
                        width: 150,
                        formatter: 'money',
                        align: 'right'
                    },
                    {
                        key: "refund_price",
                        label: common.lang.get('grid.payment.label.refund_price'),
                        width: 150,
                        formatter: 'money',
                        align: 'right'
                    },
                    {
                        key: "remain_price",
                        label: common.lang.get('grid.payment.label.remain_price'),
                        width: 150,
                        formatter: 'money',
                        align: 'right'
                    },
                    {key: "etc", label: common.lang.get('grid.payment.label.etc'), width: '*'}
                ]
            };

            // 그리드 연동
            $('body').append('<form id="devPaymentForm"></form>');
            paymentGrid.setGrid($('#devPaymentGrid'), gridConfig)
                .setForm('#devPaymentForm')
                .setUrl(common.util.getControllerUrl('getPaymentList', 'manageOrder', 'order'))
                .setUseHash(false)
                .init(function (response) {
                    paymentGrid.setContent(response.data);
                }, function (formData) {
                    formData.push(common.form.makeData('oid', self.getOid()));
                    return formData;
                });
        }
    },
    getOid: function () {
        return $('#devOid').val();
    },
    getPaymentMethod: function () {
        return $('#devPaymentMethod').val();
    },
    productGridReload: function () {
        var self = this;
        common.ajax(common.util.getControllerUrl('getProduct', 'manageOrder', 'order'), {oid: self.getOid()}, '', function (response) {
            if (response.result == "success") {
                if (response.data.normalProduct && response.data.normalProduct.length > 0) {
                    self.normalProductGrid.setContent(response.data.normalProduct);
                    $('#devNormalProductSection').show();
                } else {
                    $('#devNormalProductSection').hide();
                }
                if (response.data.claimProduct && response.data.claimProduct.length > 0) {
                    self.claimProductGrid.setContent(response.data.claimProduct);
                    $('#devClaimProductSection').show();
                } else {
                    $('#devClaimProductSection').hide();
                }
            } else {
                common.noti.alert(response.result);
            }
        });
    },
    orderTraceInvoiceBtn: false,
    initEvent: function () {
        var self = this;

        //메모등록
        $('#devTopMenuAddMemoBtn').click(function (e) {
            e.preventDefault();
            self.orderMemoModal('');
        });

        //변경내역
        $('#devTopMenuOrderHistoryBtn').click(function (e) {
            e.preventDefault();
            self.orderHistoryModal();
        });

        //주문분할
        $('#devTopMenuOrderSeparateBtn').click(function (e) {
            e.preventDefault();
            self.orderSeparateModal();
        });

        //상태변경
        $('#devChangeOrderStatusSelect').change(function () {
            //배송중
            if ($(this).val() == 'DI') {
                common.validation.set($('#devChangeQuick, #devChangeInvoiceNo'), {'required': true});
                $('#devChangeQuick').show();
                $('#devChangeInvoiceNo').show();
            } else {
                common.validation.set($('#devChangeQuick, #devChangeInvoiceNo'), {'required': false});
                $('#devChangeQuick').hide();
                $('#devChangeInvoiceNo').hide();
            }
        });

        //송장번호
        var count = 0;
        $(document).on('click', '#devOrderTraceInvoiceBtn' ,function (e) {
            count++;
            var self = devOrderManageOrderObj;
            console.log(count);
            if(count < 2 && self.orderTraceInvoiceBtn === false) {
                self.orderTraceInvoiceBtn = true;
                e.preventDefault();
                var row = self.normalProductGrid.getRow($(this).data('idx'));
                common.util.modal.open(
                    'ajax',
                    '국내배송조회',
                    common.util.getControllerUrl('traceInvoice', 'order'),
                    {
                        quick: row.quick,
                        invoice_no: row.invoice_no
                    },
                    function (){
                        self.orderTraceInvoiceBtn = false;
                        count = 0;
                    },
                    {
                        width: '800px',height: '650px'
                    });

            }
        });
    },
    orderMemoModal: function (omIx) {
        var self = this;
        common.util.modal.open('ajax', '메모관리', common.util.getControllerUrl('manageOrderMemo', 'order'), {
            oid: self.getOid(),
            omIx: omIx
        }, function () {
            devOrderManageOrderMemoObj.callback = function () {
                self.memoGrid.reload();
            }
        }, {width: '600px', height: '300px'});
    },
    orderMemoDeliveryInfo: function (odd_ix) {
        var self = this;
        common.util.modal.open('ajax', '배송지관리', common.util.getControllerUrl('manageOrderDeliveryInfo', 'order'), {odd_ix: odd_ix}, function () {
            devOrderManageOrderDeliveryInfoObj.callback = function () {
                self.productGridReload();
            }
        }, {width: '600px', height: '300px'});
    },
    orderSeparateModal: function () {
        var self = this;
        common.util.modal.open('ajax', '주문분할', common.util.getControllerUrl('separateOrder', 'order'), {oid: self.getOid()}, function () {
            devOrderSeparateOrderObj.callback = function () {
                self.productGridReload();
            }
        }, {width: '800px', height: '350px'});
    },
    orderHistoryModal: function () {
        var self = this;
        common.util.modal.open('ajax', '변경내역', common.util.getControllerUrl('searchOrderHistory', 'order'), {oid: self.getOid()}, '', {
            width: '750px',
            height: '600px'
        });
    },
    cashAmountTpl: false,
    cashAmountModal: function () {
        var self = this;

        if (self.cashAmountTpl === false) {
            self.cashAmountTpl = common.util.getHtml('#cashAmountTpl');
        }

        common.util.modal.open(
            'html',
            '네이버페이 현금영수증 금액조회',
            self.cashAmountTpl,
            '',
            function(){

            },
            {width: '760px', height: '466px'}
        );
    },
    run: function () {
        this.initLang();
        this.initForm();
        this.initGrid();
        this.productGridReload();
        this.initEvent();
    }
}

$(function () {
    devOrderManageOrderObj.run();
});