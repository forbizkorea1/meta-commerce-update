
"use strict";

/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/


/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
common.lang.load('mypage.updateDeliveryComplete.confirm', "배송완료로 상태변경하시겠습니까?"); //[공통] Alert_Confirm 정의_20180322 에 confirm 35 정의되어있지않아 임의지정함
common.lang.load('mypage.updateBuyFinalized.confirm', "구매확정으로 상태변경하시겠습니까?"); //[공통] Alert_Confirm 정의_20180322 에 정의되어있지않아 임의지정함
common.lang.load('mypage.match.failure', "처리하려는 주문의 상태값이 변경되었습니다. 확인하고 다시 시도해주세요.");
common.lang.load('mypage.differentDeliveryPrice.alert', "선택하신 지역은 배송정책이 다른 지역이므로 주문 전체 취소 후 재 주문해 주세요.");
common.lang.load('mypage.notExists.alert', "배송지 선택이 잘못되었습니다.");

var orderDetail = {
    initEvent: function () {
        var self = this;

        // 배송완료
        $('#devOrderDetailContent').on('click', '.devOrderComplateBtn', function () {
            $('input[name=oid]').val($(this).data('oid'));
            $('input[name=odIx]').val($(this).data('odix'));
            $('input[name=status]').val($(this).data('status'));
            common.noti.confirm(common.lang.get('mypage.updateDeliveryComplete.confirm', ''), function () {
                //Form init
                common.ajax(
                    common.util.getControllerUrl('updateDeliveryComplete', 'mypage'), {
                        oid: $('input[name=oid]').val(),
                        odIx: $('input[name=odIx]').val(),
                        status: $('input[name=status]').val(),
                    }, (function () {
                    }), (function (res) {
                        if (res.result == 'success') {
                            document.location.reload();
                        } else if (res.result == 'alreadyChange') {
                            common.noti.alert(common.lang.get('mypage.match.failure'), function () {
                                document.location.reload();
                            });
                        }
                    }));
            });
            return false;
        });

        // 구매확정
        $('#devOrderDetailContent').on('click', '.devBuyFinalizedBtn', function () {
            $('input[name=oid]').val($(this).data('oid'));
            $('input[name=odIx]').val($(this).data('odix'));
            $('input[name=status]').val($(this).data('status'));
            common.noti.confirm(common.lang.get('mypage.updateBuyFinalized.confirm', ''), function () {
                //Form init
                common.ajax(
                    common.util.getControllerUrl('updateBuyFinalized', 'mypage'), {
                        oid: $('input[name=oid]').val(),
                        odIx: $('input[name=odIx]').val(),
                        status: $('input[name=status]').val(),
                    }, (function () {
                    }), (function (res) {
                        if (res.result == 'success') {
                            document.location.reload();
                        } else if (res.result == 'alreadyChange') {
                            common.noti.alert(common.lang.get('mypage.match.failure'), function () {
                                document.location.reload();
                            });
                        }
                    }));
            });
            return false;
        });

        // 주문취소
        $('#devOrderDetailContent').on('click', '.devOrderCancelBtn', function () {
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
        });

        // 교환신청
        $('#devOrderDetailContent').on('click', '.devOrderExchangeBtn', function () {
            location.href = '/mypage/orderClaim/change/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
        });

        // 반품신청
        $('#devOrderDetailContent').on('click', '.devOrderReturnBtn', function () {
            location.href = '/mypage/orderClaim/return/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
        });

        // 상품후기 작성
        $('#devOrderDetailContent').on('click', '.devByFinalized', function () {
            common.util.modal.open("ajax","상품 후기 작성",'/shop/goodsReview/' + $(this).data('pid') + '/' + $(this).data('oid') + '/' + $(this).data('optionid') + '?mode=write', function () {
                $(".fb__popup-layout").addClass("full-layer floating-btn");
                countTextLength();
            });
        }); 

        // 배송추적
        $('#devOrderDetailContent').on('click', '.devDeliveryTrace', function () {
            var url = '/popup/deliveryTracking/' + $(this).data('quick') + '/' + $(this).data('invoice_no');
            window.open(url);
        });

        // 전체취소
        $('#devOrderDetailContent').on('click', '.devOrderCancelAllBtn', function () {
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid');
        });

        //배송지 변경 버튼
        $('#devDeliveryChangeBtn').on('click', function () {
            $(".fb__popup-layout").addClass("full-layer floating-btn deliveryPopup");
            var oid = $(this).data('oid');

            common.util.modal.open('ajax', '배송지 변경', '/mypage/addressbookSelect/' + oid, '', function () {
                devAddressBookPopObj.callbackSelect = function (deliveryIx) {
                    common.ajax(
                        // 주문정보에 배송지 변경 처리 후 리로딩
                        common.util.getControllerUrl('deliveryAddressChange', 'mypage'), {deliveryIx:deliveryIx, oId:oid}, function () {
                            return deliveryIx;
                        }, function (response) {
                            if (response.result == 'success') {
                                location.reload();
                            }else if (response.result == 'differentPrice') {
                                common.noti.alert(common.lang.get('mypage.differentDeliveryPrice.alert'));
                            } else {
                                common.noti.alert(common.lang.get('mypage.notExists.alert'));
                            }
                        });
                };
            });
        });

        // 결제영수증
        $('#devReceipt').click(function(){
            location.href='/mypage/receiptPrint?oid='+$(this).data('oid');
        });

        $('#devDeliveryRequestChangeBtn').click(function () {
            location.href = '/mypage/deliverymsgChange/' + $(this).data('oid');
        });

        $('#devQna').click(function () {
            location.href = '/customer/qna?oid=' + $(this).data('oid');
        });
    },
    run: function () {
        var self = this;

        // 이벤트 바인딩
        self.initEvent();

    }
}

$(function () {
    orderDetail.run()
});