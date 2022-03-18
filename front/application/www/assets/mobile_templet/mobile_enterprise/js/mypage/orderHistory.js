"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/


/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
common.lang.load('mypage.updateDeliveryComplete.confirm', "배송완료로 상태변경하시겠습니까?"); //[공통] Alert_Confirm 정의_20180322 에 confirm 35 정의되어있지않아 임의지정함
common.lang.load('mypage.updateBuyFinalized.confirm', "구매확정으로 상태변경하시겠습니까?"); //[공통] Alert_Confirm 정의_20180322 에 정의되어있지않아 임의지정함
common.lang.load('mypage.exchange.confirm', "상품 교환신청을 하시겠습니까?");
common.lang.load('mypage.return.confirm', "상품 반품신청을 하시겠습니까?");

var devOrderHistoyObj = {
    orderTpl: false,
    morePopupTpl: false,
    odeIx: false,
    allCancel: true,
    ajaxList: common.ajaxList(),
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
        //ORDER_STATUS_INCOM_COMPLETE || ORDER_STATUS_DELIVERY_ING
        return status == 'DI' || status == 'DC';
    },
    isByFinalized: function (status, isComment) {
        //ORDER_STATUS_BUY_FINALIZED
        return status == 'BF' && !isComment;
    },
    isMore: function (item) {
        return item.isIncomeComplate || item.isDeliveryIng || item.isDeliveryComplate || item.isByFinalized;
    },
    exchangeDetail: function (exchageDetailData, orderItemId) {
        var self = this;
        var dItems = [];

        for (var idx = 0; idx < exchageDetailData.length; idx++) {
            exchageDetailData[idx].pt_dcprice = common.util.numberFormat(exchageDetailData[idx].pt_dcprice);
            exchageDetailData[idx].dcprice = common.util.numberFormat(exchageDetailData[idx].dcprice);
            exchageDetailData[idx].listprice = common.util.numberFormat(exchageDetailData[idx].listprice);
            exchageDetailData[idx].isExchangeDetail = true;
            exchageDetailData[idx].orderItemId = orderItemId;
            exchageDetailData[idx].isDeleveryTrace = self.isDeleveryTrace(exchageDetailData[idx].status);
            exchageDetailData[idx].isIncomeComplate = self.isIncomeComplate(exchageDetailData[idx].status);
            exchageDetailData[idx].isDeliveryIng = self.isDeliveryIng(exchageDetailData[idx].status);
            exchageDetailData[idx].isDeliveryComplate = self.isDeliveryComplate(exchageDetailData[idx].status);
            exchageDetailData[idx].isByFinalized = self.isByFinalized(exchageDetailData[idx].status, exchageDetailData[idx].is_comment);
            exchageDetailData[idx].isMore = self.isMore(exchageDetailData[idx]);

            dItems.push(self.orderTpl(exchageDetailData[idx]));
        }

        return dItems.join('');
    },
    initEvent: function () {
        var self = this;

        // 검색
        $('#devStatus,#devSdate').on('change', function () {
            self.ajaxList.getPage(1);
        });

        // More button
        $('#devOrderHistoryContent').on('click', '.devMoreLinkBtn', function () {
            var orderInfo = {
                oid: $(this).data('oid'),
                od_ix: $(this).data('od_ix'),
                brand_name: $(this).data('brand_name'),
                pid: $(this).data('pid'),
                pname: $(this).data('pname'),
                pimg: $(this).data('pimg'),
                option_text: $(this).data('option_text'),
                option_id: $(this).data('option_id'),
                isDeleveryTrace: $(this).data('dt'),
                isIncomeComplate: $(this).data('ic'),
                isDeliveryIng: $(this).data('di'),
                isDeliveryComplate: $(this).data('dc'),
                isByFinalized: $(this).data('bf'),
                ode_ix: $(this).data('ode_ix'),
                quick: $(this).data('quick'),
                invoice_no: $(this).data('invoice_no'),
                status: $(this).data('status'),
                isExchangeDetail: $(this).data('exchange')
            };

            common.util.modal.open('html', '', self.morePopupTpl(orderInfo));
            $(".fb__popup-layout").addClass("order-popup");
        });

        // 전체취소
        $('#devOrderHistoryContent').on('click', '.devOrderCancelAllBtn', function () {
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid');
        });

        // 배송완료
        $('#devModalContent').on('click', '.devOrderComplateBtn', function () {
            var odIx = $(this).data('odix');
            var oid = $(this).data('oid');
            var status = $(this).data('status');

            common.noti.confirm(common.lang.get('mypage.updateDeliveryComplete.confirm', ''), function () {
                common.ajax(common.util.getControllerUrl('updateDeliveryComplete', 'mypage'),
                    {odIx: odIx, oid: oid, status: status}
                    , ""
                    , function (result) {
                    if (result.result == 'success') {
                        // document.location.reload();
                        $('.btn-close-bottom').trigger('click');
                        self.ajaxList.reload();
                    }
                });
            });
        });

        // 구매확정
        $('#devModalContent').on('click', '.devBuyFinalizedBtn', function () {
            var odIx = $(this).data('odix');
            var oid = $(this).data('oid');
            var status = $(this).data('status');

            common.noti.confirm(common.lang.get('mypage.updateBuyFinalized.confirm', ''), function () {
                common.ajax(common.util.getControllerUrl('updateBuyFinalized', 'mypage')
                    , {odIx: odIx, oid: oid, status: status}
                    , ""
                    , function (result) {
                    if (result.result == 'success') {
                        // document.location.reload();
                        $('.btn-close-bottom').trigger('click');
                        self.ajaxList.reload();
                    }
                });
            });
        });

        // 주문취소
        $('#devModalContent').on('click', '.devOrderCancelBtn', function () {
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
        });

        // 교환신청
        $('#devModalContent').on('click', '.devOrderExchangeBtn', function () {
            if (common.noti.confirm(common.lang.get('mypage.exchange.confirm'))) {
                location.href = '/mypage/orderClaim/change/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
            }
        });
        // 반품신청
        $('#devModalContent').on('click', '.devOrderReturnBtn', function () {
            if (common.noti.confirm(common.lang.get('mypage.return.confirm'))) {
                location.href = '/mypage/orderClaim/return/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
            }
        });
        // 상품후기 작성
        $('#devModalContent').on('click', '.devByFinalized', function () {
            common.util.modal.close();
            common.util.modal.open('ajax', '상품 후기 작성', '/shop/goodsReview/' + $(this).data('pid') + '/' + $(this).data('oid') + '/' + $(this).data('optionid')+ '/' + $(this).data('odix') + '?mode=write', function () {
                $(".fb__popup-layout").addClass("full-layer floating-btn").removeClass("order-popup");
            });
            // common.util.popup('/shop/goodsReview/' + $(this).data('pid') + '/' + $(this).data('oid') + '/' + $(this).data('optionid') + '?mode=write');
        });
        // 배송추적
        $('#devModalContent').on('click', '.devInvoice', function () {
            var url = '/popup/deliveryTracking/' + $(this).data('quick') + '/' + $(this).data('invoice_no');
            $('#devMorePopupCloseBtn').trigger('click');
            window.open(url);
        });
    },
    ajaxInit: function () {
        var self = this;

        // Template compile
        self.orderTpl = self.ajaxList.compileTpl('#devOrderDetailProduct');
        self.morePopupTpl = self.ajaxList.compileTpl('#devMorePopup');

        // 컨텐츠 랜더링 메소드 리매핑
        self.ajaxList.setContent = function (list, paging) {
            //마지막 페이지 또는 page가 1일때 숨김
            if (this.scrollPage || this.remove === false && paging && (paging.cur_page == paging.last_page || paging.page_list.length <= 1)) {
                this.hidePagination();
            } else {
                this.sowPagination();
            }
            //삭제옵션, 페이지 검색시 1페이지, paging 정보 없을때
            if (this.remove === true || !paging || paging.cur_page == 1) {
                this.removeContent();
                this.setHistoryState('response', null);
            }
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
                        row.orderDetail[idx].isOther = self.isOrder(row.orderDetail[idx].ode_ix);
                        row.orderDetail[idx].isExchange = self.isExchange(row.orderDetail[idx].status);
                        row.orderDetail[idx].isDeleveryTrace = self.isDeleveryTrace(row.orderDetail[idx].status);
                        row.orderDetail[idx].isDeliveryIng = self.isDeliveryIng(row.orderDetail[idx].status);
                        row.orderDetail[idx].isDeliveryComplate = self.isDeliveryComplate(row.orderDetail[idx].status);
                        row.orderDetail[idx].isByFinalized = self.isByFinalized(row.orderDetail[idx].status, row.orderDetail[idx].is_comment);
                        row.orderDetail[idx].isExchangeToggle = (row.orderDetail[idx].exchageDetail ? true : false);
                        row.orderDetail[idx].isMore = self.isMore(row.orderDetail[idx]);
                        row.orderDetail[idx].orderItemId = common.crypto.md5(row.orderDetail[idx].od_ix);
                        // allCancel?
                        self.isAllCancel(row.orderDetail[idx].status);
                        if (row.orderDetail[idx].cartCouponApply) {
                            row.orderDetail[idx].isIncomeComplate = false; //입금확인 취소버튼
                        } else {
                            row.orderDetail[idx].isIncomeComplate = self.isIncomeComplate(row.orderDetail[idx].status);
                        }

                        oitems.push(self.orderTpl(row.orderDetail[idx]));
                        // 교환상품상세
                        if (row.orderDetail[idx].exchageDetail) {
                            oitems.push(self.exchangeDetail(row.orderDetail[idx].exchageDetail, row.orderDetail[idx].orderItemId));
                        }
                    }

                    row.orderDetail = oitems.join('');
                    row.isAllCancel = self.allCancel;
                    if(this.reverse) {
                        $(this.container).prepend(this.listTpl(row));
                    }else {
                        $(this.container).append(this.listTpl(row));
                    }
                }

                if (paging) {
                    $(this.pagination).html(common.pagination.getHtml(paging));
                    if(this.scrollPage) {
                        if(paging.last_page != paging.cur_page) {
                            this.scroll = true;
                        }
                    }
                }

                //history 정보에 sate 정보 set
                var currentState = this.getHistoryState('response');
                if (currentState != null && this.remove === false) {
                    //list data의 키 찾기
                    var listKeyName = this.getResponseListKeyName(list);
                    this.response.data[listKeyName] = currentState.data[listKeyName].concat(list);
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }
            this.setHistoryState('response', this.response);
        };

        // 주문내역 설정
        self.ajaxList
            .setUseHash(false)
            .setRemoveContent(false)
            .setLoadingTpl('#devOrderHistoryLoading')
            .setListTpl('#devOrderHistoryList')
            .setEmptyTpl('#devOrderHistoryEmpty')
            .setContainerType('div')
            .setContainer('#devOrderHistoryContent')
            .setPagination('#devPageWrap')
            .setPageNum('#devPage')
            .setScrollPage(true)
            .setForm('#devOrderHistoryForm')
            .setController('orderHistory', 'mypage')
            .init(function (data) {
                self.ajaxList.setContent(data.data.list, data.data.paging);
            });
    },
    run: function () {
        var self = this;

        // 이벤트 바인딩
        self.initEvent();
        // 주문내역 초기화
        self.ajaxInit();
    }
};

$(function () {
    devOrderHistoyObj.run()
});
