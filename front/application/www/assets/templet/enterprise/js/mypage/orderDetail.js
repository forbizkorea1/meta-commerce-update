"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
$(function () {
    $('.receipt-btn').click(function () {
        common.util.popup('/mypage/receiptPrint?oid=' + $(this).data('oid'), 660, 1000, '결제영수증',true);
    });
});

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devOrderDetailObj = {
    callback:function(deliveryIx, oId, deliveryInfo){this.deliveryAddressChange(deliveryIx, oId, deliveryInfo);},
    // deliveryMsgModify: function () {
    //     var msgIx = $(this).data('msgix');
    //     var msgType = $(this).data('msgtype');
    //     var oId = $(this).data('oid');
    //
    //     var msgText = $('#devDeliveryMsgText' + msgIx);
    //     var msgInput = $('#devDeliveryMsg' + msgIx);
    //
    //     // Ajax Call
    //     common.ajax(
    //         common.util.getControllerUrl('deliveryMsgModify', 'mypage'),
    //         {
    //             oId: oId,
    //             msgIx: msgIx,
    //             msgType: msgType,
    //             deliveryMsg: msgInput.val()
    //         }, '',
    //         function (data) {
    //             if (data.result == 'success') {
    //                 msgText.text(data.data);
    //                 msgInput.val('');
    //                 $('#devMsgLength' + msgIx).text(0);
    //             } else {
    //                 alert(data.result);
    //             }
    //         }
    //     );
    // },
    deliveryAddressChange: function (deliveryIx, oId, deliveryInfo) {
        common.ajax(
            common.util.getControllerUrl('deliveryAddressChange', 'mypage'),
            {
                oId: oId,
                deliveryIx: deliveryIx,
                deliveryInfo: deliveryInfo
            },
            function () {
                return oId && (deliveryIx || deliveryInfo);
            },
            function (ret) {

                if (ret.result == 'success') {
                    $('#devRnameTxt').text(ret.data.rname);
                    $('#devZipTxt').text(ret.data.zip);
                    $('#devAddr1Txt').text(ret.data.addr1);
                    $('#devAddr2Txt').text(ret.data.addr2);
                    $('#devRmobileTxt').text(ret.data.rmobile);
                    $('#devRtelTxt').text(ret.data.rtel);
                } else if (ret.result == 'differentPrice') {
                    common.noti.alert(common.lang.get('mypage.differentDeliveryPrice.alert'));
                } else {
                    common.noti.alert(common.lang.get('mypage.notExists.alert'));
                }
            }
        );
    },
    initLang: function () {
        common.lang.load('addressbook.popup.change.title', '배송지 변경');
        common.lang.load('mypage.differentDeliveryPrice.alert', "선택하신 지역은 배송정책이 다른 지역이므로 주문 전체 취소 후 재 주문해 주세요.");
        common.lang.load('mypage.notExists.alert', "배송지 선택이 잘못되었습니다.");
        common.lang.load('mypage.updateDeliveryComplete.confirm', "해당 상품을 배송완료로 변경하시겠습니까?");
        common.lang.load('mypage.updateBuyFinalized.confirm', "구매확정으로 상태변경하시겠습니까?");
        common.lang.load('mypage.exchange.confirm', "상품 교환신청을 하시겠습니까?");
        common.lang.load('mypage.return.confirm', "상품 반품신청을 하시겠습니까?");
    },
    initEvent: function () {
        var self = this;

        // 배송 메시지 더보기 버튼
        $('#devDeliveryMsgMoreBtn').on('click', function () {
            $('.devDeliveryMsgBox').toggle();
        });

        // 배송 메시지 길이 표시
        $('.devDeliveryMsgInputBox').on('keyup', function () {
            var msgIx = $(this).data('msgix');
            $('#devMsgLength' + msgIx).text($(this).val().length);
        });

        // 배송 메시지 수정
        $('.devDeliveryMsgModifyBtn').on('click', function() {
            var width = orderDetailMode == 'guest' ? 640 : 580;
            var height = orderDetailMode == 'guest' ? 620 : 462;
            var popWinodw = common.util.popup('/mypage/deliverymsgChange/' + $(this).data('oid'), width, height, common.lang.get('addressbook.popup.change.title'));
        });

        //  배송지 변경
        $('#devDeliveryChangeBtn').click(function () {
            var width = orderDetailMode == 'guest' ? 640 : 575;
            var height = orderDetailMode == 'guest' ? 620 : 650;
            console.log(width, height)
            var popWinodw = common.util.popup('/mypage/addressbookSelect/' + $(this).data('oid'), width, height, common.lang.get('addressbook.popup.change.title'));
        });

        // 전체취소
        $('#devOrderDetailContent').on('click', '.devOrderCancelAllBtn', function () {
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid');
        });

        // 주문취소
        $('#devOrderDetailList').on('click', '.devOrderCancelBtn', function (e) {
            e.preventDefault();
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
        });

        // 배송완료
        $('#devOrderDetailList').on('click', '.devOrderComplateBtn', function (e) {
            e.preventDefault();
            $('input[name=oid]').val($(this).data('oid'));
            $('input[name=odIx]').val($(this).data('odix'));
            $('input[name=status]').val($(this).data('status'));
            common.noti.confirm(common.lang.get('mypage.updateDeliveryComplete.confirm', ''), function () {
                //Form init
                $('#devOrderHistoryContentForm').submit();
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

        // 교환신청
        $('#devOrderDetailList').on('click', '.devOrderExchangeBtn', function (e) {
            e.preventDefault();
            if (common.noti.confirm(common.lang.get('mypage.exchange.confirm'))) {
                location.href = '/mypage/orderClaim/change/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
                return false;
            }
        });

        // 반품신청
        $('#devOrderDetailList').on('click', '.devOrderReturnBtn', function (e) {
            e.preventDefault();
            if (common.noti.confirm(common.lang.get('mypage.return.confirm'))) {
                location.href = '/mypage/orderClaim/return/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
                return false;
            }
        });

        // 구매확정
        $('#devOrderDetailList').on('click', '.devBuyFinalizedBtn', function (e) {
            e.preventDefault();
            $('input[name=oid]').val($(this).data('oid'));
            $('input[name=odIx]').val($(this).data('odix'));
            $('input[name=status]').val($(this).data('status'));
            common.noti.confirm(common.lang.get('mypage.updateBuyFinalized.confirm', ''), function () {
                //Form init
                $('#devOrderHistoryContentForm').submit();
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

        // 상품후기 작성
        $('#devOrderDetailList').on('click', '.devByFinalized', function (e) {
            e.preventDefault();
            var url = '/shop/goodsReview/' + $(this).data('pid') + '/' + $(this).data('oid') + '/' + $(this).data('optionid') + '/' + $(this).data('odix') + '?mode=write';

            //common.util.popup(url, 800, 1000);
            common.util.popup(url, 800, 1000, '상품후기 작성', scroll);
        });

        // 배송추적
        $('#devOrderDetailList').on('click', '.devDeliveryTrace', function () {
            var url = '/popup/deliveryTracking/' + $(this).data('quick') + '/' + $(this).data('invoice_no');
            common.util.popup(url, 900, 700, '배송 추적', scroll);
            return false;
        });

    },
    run: function () {
        this.initLang();
        this.initEvent();
    }
};

function runCallback(deliveryIx, oId, deliveryInfo) {
    devOrderDetailObj.callback(deliveryIx, oId, deliveryInfo);
}

// Script run
$(function () {
    devOrderDetailObj.run();
});