"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

$(function () {
    $('.detail-view-btn').on('click', function () {
        $(this).parents().next('.change-product-detail').toggle();
    });
});

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
common.lang.load('mypage.updateDeliveryComplete.confirm', "해당 상품을 배송완료로 변경하시겠습니까?"); //[공통] Alert_Confirm 정의_20180322 에 confirm 35 정의되어있지않아 임의지정함
common.lang.load('mypage.updateBuyFinalized.confirm', "구매확정으로 상태변경하시겠습니까?"); //[공통] Alert_Confirm 정의_20180322 에 정의되어있지않아 임의지정함
common.lang.load('mypage.invalidDate.alert', "날짜 형식이 잘못되었습니다."); // 임의지정함
common.lang.load('mypage.wrongStartDate.alert', "시작일과 종료일을 다시 확인해주세요.");
common.lang.load('mypage.wrongDateRange.alert', "최대 5년 내 내역까지만 조회 가능합니다.");
common.lang.load('mypage.exchange.confirm', "상품 교환신청을 하시겠습니까?");
common.lang.load('mypage.return.confirm', "상품 반품신청을 하시겠습니까?");
common.lang.load('mypage.match.failure', "처리하려는 주문의 상태값이 변경되었습니다. 확인하고 다시 시도해주세요.");

var devOrderHistoyObj = {
    orderTpl: false,
    odeIx: false,
    allCancel: true,
    ajaxList: common.ajaxList(),
    method: 'updateDeliveryComplete',
    isOrder: function (odeIx) {
        // 배송 정책별 묶기
        if (this.odeIx === false) {
            this.odeIx = odeIx;
        } else if (odeIx != this.odeIx) {
            this.odeIx = odeIx;
            return true;
        }

        return false;
    },
    isAllCancel: function (status) {
        this.allCancel = this.allCancel && (status == 'IC' || status == 'IR')
        return this.allCancel;
    },
    isExchange: function (status) {
        //ORDER_STATUS_EXCHANGE_ING
        return status == 'EA' || status == 'EY' || status == 'EI' || status == 'ED' || status == 'ET' || status == 'EF' || status == 'EM' || status == 'EC';
    },
    isIncomeComplate: function (status) {
        //ORDER_STATUS_INCOM_COMPLETE
        return status == 'IC';
    },
    isDeliveryComplate: function (status) {
        //ORDER_STATUS_DELIVERY_COMPLETE
        return status == 'DC';
    },
    isDeliveryIng: function (status) {
        //ORDER_STATUS_DELIVERY_ING
        return status == 'DI';
    },
    isDeleveryTrace: function (status) {
        //ORDER_STATUS_DELIVERY_ING || ORDER_STATUS_EXCHANGE_DELIVERY
        return status == 'DI' || status == 'DC';
    },
    isByFinalized: function (status, isComment) {
        //ORDER_STATUS_BUY_FINALIZED
        return status == 'BF' && !isComment;
    },
    exchangeDetail: function (exchangeDetailData, exKey) {
        var self = this;
        var dItems = [];

        for (var idx = 0; idx < exchangeDetailData.length; idx++) {
            exchangeDetailData[idx].pt_dcprice = common.util.numberFormat(exchangeDetailData[idx].pt_dcprice);
            exchangeDetailData[idx].dcprice = common.util.numberFormat(exchangeDetailData[idx].dcprice);
            exchangeDetailData[idx].listprice = common.util.numberFormat(exchangeDetailData[idx].listprice);
            exchangeDetailData[idx].ea_listprice = common.util.numberFormat(exchangeDetailData[idx].ea_listprice);
            exchangeDetailData[idx].isExchangeDetail = true;
            exchangeDetailData[idx].exKey = exKey;
            exchangeDetailData[idx].isDeleveryTrace = self.isDeleveryTrace(exchangeDetailData[idx].status);
            exchangeDetailData[idx].isIncomeComplate = self.isIncomeComplate(exchangeDetailData[idx].status);
            exchangeDetailData[idx].isDeliveryIng = self.isDeliveryIng(exchangeDetailData[idx].status);
            exchangeDetailData[idx].isDeliveryComplate = self.isDeliveryComplate(exchangeDetailData[idx].status);

            exchangeDetailData[idx].isByFinalized = self.isByFinalized(exchangeDetailData[idx].status, exchangeDetailData[idx].is_comment);

            dItems.push(self.orderTpl(exchangeDetailData[idx]));
        }

        return dItems.join('');
    },
    initEvent: function () {
        var self = this;

        // 검색일 설정
        // $('.devDateBtn').on('click', function () {
        //     $('#devSdate').val($(this).data('sdate'));
        //     $('#devEdate').val($(this).data('edate'));
        // });

        // // 검색조건 리셋
        // $('#devSearchInitBtn').on('click', function () {
        //     $('.devDateBtn').removeClass('on');
        //     $('#devDateDefault').addClass('on');
        //     $('#devSdate').val($(this).data('sdate'));
        //     $('#devEdate').val($(this).data('edate'));
        //     $('#devStatus').val('all');
        //     $('#devPname').val('');
        // });

        // 검색
        $('#devSearchBtn').on('click', function () {
            var endDate = common.util.dates.convert($('#devEdate').val());
            var startDate = common.util.dates.convert($('#devSdate').val());
            var maxDate = common.util.dates.convert((startDate.getFullYear() + 5) + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate());

            var today = new Date();
            var dd = today.getDate();
            var Smm = today.getMonth();
            var Emm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (Smm < 10) {
                Smm = '0' + Smm;
            }
            if (Emm < 10) {
                Emm = '0' + Emm;
            }
            var resetStartDate = yyyy + '-' + Smm + '-' + dd;
            var resetEndDate = yyyy + '-' + Emm + '-' + dd;

            if (startDate != 'Invalid Date' && endDate != 'Invalid Date') {
                if (common.util.dates.compare(startDate, endDate) == 1) {
                    common.noti.alert(common.lang.get('mypage.wrongStartDate.alert'));

                    //날짜초기화
                    $('#devSdate').val(resetStartDate);
                    $('#devEdate').val(resetEndDate);

                    return false;
                } else if (common.util.dates.compare(endDate, maxDate) == 1) {
                    common.noti.alert(common.lang.get('mypage.wrongDateRange.alert'));
                    return false;
                }

                self.ajaxList.getPage(1);
            } else {
                common.noti.alert(common.lang.get('mypage.invalidDate.alert'));
            }
        });

        // 전체취소
        $('#devOrderHistoryContent').on('click', '.devOrderCancelAllBtn', function (e) {
            e.preventDefault();
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid');
        });

        // 주문취소
        $('#devOrderHistoryContent').on('click', '.devOrderCancelBtn', function (e) {
            e.preventDefault();
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
        });

        // 배송완료
        $('#devOrderHistoryContent').on('click', '.devOrderComplateBtn', function (e) {
            e.preventDefault();
            $('input[name=oid]').val($(this).data('oid'));
            $('input[name=odIx]').val($(this).data('odix'));
            $('input[name=status]').val($(this).data('status'));
            common.noti.confirm(common.lang.get('mypage.updateDeliveryComplete.confirm', ''), function () {
                $('#devOrderHistoryContentForm').attr('action', '/controller/mypage/updateDeliveryComplete');

                //Form init
                $('#devOrderHistoryContentForm').submit();
            });
        });

        // 교환신청
        $('#devOrderHistoryContent').on('click', '.devOrderExchangeBtn', function (e) {
            e.preventDefault();
            if (common.noti.confirm(common.lang.get('mypage.exchange.confirm'))) {
                location.href = '/mypage/orderClaim/change/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
                return false;
            }
        });

        // 반품신청
        $('#devOrderHistoryContent').on('click', '.devOrderReturnBtn', function (e) {
            e.preventDefault();
            if (common.noti.confirm(common.lang.get('mypage.return.confirm'))) {
                location.href = '/mypage/orderClaim/return/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
                return false;
            }
        });

        // 구매확정
        $('#devOrderHistoryContent').on('click', '.devBuyFinalizedBtn', function (e) {
            e.preventDefault();
            $('input[name=oid]').val($(this).data('oid'));
            $('input[name=odIx]').val($(this).data('odix'));
            $('input[name=status]').val($(this).data('status'));
            common.noti.confirm(common.lang.get('mypage.updateBuyFinalized.confirm', ''), function () {
                $('#devOrderHistoryContentForm').attr('action', '/controller/mypage/updateBuyFinalized');

                //Form init
                $('#devOrderHistoryContentForm').submit();
            });
        });

        // 상품후기 작성
        $('#devOrderHistoryContent').on('click', '.devByFinalized', function (e) {
            e.preventDefault();
            var url = '/shop/goodsReview/' + $(this).data('pid') + '/' + $(this).data('oid') + '/' + $(this).data('optionid') + '/' + $(this).data('odix') + '?mode=write';

            //common.util.popup(url, 800, 1000);
            common.util.popup(url, 800, 1000, '상품후기 작성', scroll);
        });

        $('#devOrderHistoryContent').on('click', '.devEcDetailToggleBtn', function (e) {
            e.preventDefault();
            var $this = $(this);
            var exkey = $this.data('exkey');
            $this.toggleClass("open");
            $('.devEcDetail' + exkey).toggle();
            $(this).parents(".order-list").toggleClass("btn-toggle");
        });

        $('#devOrderHistoryContent').on('click', '.devInvoice', function () {
            var url = '/popup/deliveryTracking/' + $(this).data('quick') + '/' + $(this).data('invoice_no');
            common.util.popup(url, 900, 700, '배송 추적', scroll);
            return false;
        });
    },
    ajaxInit: function () {
        var self = this;
        // Template compile
        self.orderTpl = self.ajaxList.compileTpl('#devOrderDetailProduct');
        // Template change
        $('#devOrderDetailContent').text('{[{orderDetail}]}');

        // 컨텐츠 랜더링 메소드 리매핑
        self.ajaxList.setContent = function (list, paging) {
            this.removeContent();
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    var oitems = [];

                    // odeIx reset
                    self.odeIx = false;
                    self.allCancel = true;

                    // order detail
                    for (var idx = 0; idx < row.orderDetail.length; idx++) {
                        // price number_format
                        row.orderDetail[idx].pt_dcprice = common.util.numberFormat(row.orderDetail[idx].pt_dcprice);
                        row.orderDetail[idx].dcprice = common.util.numberFormat(row.orderDetail[idx].dcprice);
                        row.orderDetail[idx].listprice = common.util.numberFormat(row.orderDetail[idx].listprice);
                        row.orderDetail[idx].ea_listprice = common.util.numberFormat(row.orderDetail[idx].ea_listprice);
                        row.orderDetail[idx].isOther = self.isOrder(row.orderDetail[idx].ode_ix);
                        row.orderDetail[idx].isExchange = self.isExchange(row.orderDetail[idx].status);
                        row.orderDetail[idx].isDeleveryTrace = self.isDeleveryTrace(row.orderDetail[idx].status);
                        row.orderDetail[idx].isDeliveryIng = self.isDeliveryIng(row.orderDetail[idx].status);
                        row.orderDetail[idx].isDeliveryComplate = self.isDeliveryComplate(row.orderDetail[idx].status);
                        row.orderDetail[idx].isByFinalized = self.isByFinalized(row.orderDetail[idx].status, row.orderDetail[idx].is_comment);
                        row.orderDetail[idx].isExchangeToggle = (row.orderDetail[idx].exchageDetail ? true : false);
                        row.orderDetail[idx].exKey = i + '-' + idx;
                        // allCancel?
                        self.isAllCancel(row.orderDetail[idx].status);

                        if (row.orderDetail[idx].cartCouponApply) {
                            row.orderDetail[idx].isIncomeComplate = false //입금확인 취소버튼
                        } else {
                            row.orderDetail[idx].isIncomeComplate = self.isIncomeComplate(row.orderDetail[idx].status);
                        }

                        oitems.push(self.orderTpl(row.orderDetail[idx]));
                        // 교환상품상세
                        if (row.orderDetail[idx].exchageDetail) {
                            oitems.push(self.exchangeDetail(row.orderDetail[idx].exchageDetail, row.orderDetail[idx].exKey));
                        }
                    }

                    row.orderDetail = oitems.join('');
                    row.isAllCancel = self.allCancel;

                    $(this.container).append(this.listTpl(row));
                }

                if (paging) {
                    $(this.pagination).html(common.pagination.getHtml(paging));
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }
        };

        // 주문내역 설정
        self.ajaxList
            .setLoadingTpl('#devOrderHistoryLoading')
            .setListTpl('#devOrderHistoryList')
            .setEmptyTpl('#devOrderHistoryEmpty')
            .setContainerType('div')
            .setContainer('#devOrderHistoryContent')
            .setPagination('#devPageWrap')
            .setPageNum('#devPage')
            .setForm('#devOrderHistoryForm')
            .setGotoTop(500)
            .setUseHash(true)
            .setController('orderHistory', 'mypage')
            .init(function (data) {
                self.ajaxList.setContent(data.data.list, data.data.paging);
            });

        // 페이징 버튼 이벤트 설정
        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            self.ajaxList.getPage($(this).data('page'));
        });
    },
    formInit: function () {
        var self = this;

        common.form.init(
            $('#devOrderHistoryContentForm'),
            common.util.getControllerUrl('updateDeliveryComplete', 'mypage'),
            function (formObj) {
                var ret = false;

                ret = common.validation.check(formObj, 'alert', false);

                // Form validation
                return ret;
            },
            function (res) {
                if (res.result == 'success') {
                    document.location.reload();
                } else if (res.result == 'alreadyChange') {
                    common.noti.alert(common.lang.get('mypage.match.failure'), function () {
                        document.location.reload();
                    });
                }
            }
        );
    },
    run: function () {
        var self = this;

        // 이벤트 바인딩
        self.initEvent();
        // 주문내역 초기화
        self.ajaxInit();
        // init
        self.formInit();
    }
};

$(function () {
    devOrderHistoyObj.run()
});
