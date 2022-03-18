"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
$(function () {
    $('#grade_pop').click(function () {
        common.util.modal.open('ajax', '모달테스트', '/mypage/bbs_view.php');
    });
});

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/

var devMyPageObj = {
    initLang: function () {
        common.lang.load('mypage.updateDeliveryComplete.confirm', "배송완료로 상태변경하시겠습니까?");
        common.lang.load('mypage.updateBuyFinalized.confirm', "구매확정으로 상태변경하시겠습니까?");
        common.lang.load('recentview.delete.confirm', "선택한 상품을 삭제 하시겠습니까?"); //Confirm_12
        common.lang.load('recentview.delete.alert', "삭제할 상품을 선택해 주세요."); //Alert_47
        common.lang.load('mypage.exchange.confirm', "상품 교환신청을 하시겠습니까?");
        common.lang.load('mypage.return.confirm', "상품 반품신청을 하시겠습니까?");
    },
    initEvent: function () {
        // 주문조회
        $('.devOrderStatusCnt').on('click', function () {
            location.href = '/mypage/orderHistory?order_status=' + $(this).data('status');
        });

        // 취소/반품/교환 조회
        $('.devReturnStatusCnt').on('click', function () {
            location.href = '/mypage/returnHistory?order_status=' + $(this).data('status');
        });

        // 교환신청
        $('.devOrderExchangeBtn').on('click', function () {
            if (common.noti.confirm(common.lang.get('mypage.exchange.confirm'))) {
                location.href = '/mypage/orderClaim/change/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
            }
        });

        // 반품신청
        $('.devOrderReturnBtn').on('click', function () {
            if (common.noti.confirm(common.lang.get('mypage.return.confirm'))) {
                location.href = '/mypage/orderClaim/return/apply?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
            }
        });

        // 주문취소
        $('.devOrderCancelBtn').on('click', function () {
            location.href = '/mypage/orderCancel?oid=' + $(this).data('oid') + '&od_ix=' + $(this).data('odix');
        });

        // 배송완료
        $('.devOrderComplateBtn').on('click', function () {
            var odIx = $(this).data('odix');
            var oid = $(this).data('oid');
            var status = $(this).data('status');

            common.noti.confirm(common.lang.get('mypage.updateDeliveryComplete.confirm', ''), function () {
                common.ajax(common.util.getControllerUrl('updateDeliveryComplete', 'mypage'), {odIx: odIx, oid: oid, status: status}, "", function (result) {
                    if (result.result == 'success') {
                        document.location.reload();
                    }
                });
            });
        });

        // 구매확정
        $('.devBuyFinalizedBtn').on('click', function () {
            var odIx = $(this).data('odix');
            var oid = $(this).data('oid');
            var status = $(this).data('status');

            common.noti.confirm(common.lang.get('mypage.updateBuyFinalized.confirm', ''), function () {
                common.ajax(common.util.getControllerUrl('updateBuyFinalized', 'mypage'), {
                    odIx: odIx,
                    oid: oid,
                    status: status
                }, "", function (result) {
                    if (result.result == 'success') {
                        document.location.reload();
                    }
                });
            });
        });

        // 상품후기 작성
        $('.devByFinalized').on('click', function () {
            var url = '/shop/goodsReview/' + $(this).data('pid') + '/' + $(this).data('oid') + '/' + $(this).data('optionid')+ '/' + $(this).data('odix') + '?mode=write';
            common.util.popup(url, 800, 1000);
        });

        // 배송조회
        $('.devInvoice').on('click', function () {
            var url = '/popup/deliveryTracking/' + $(this).data('quick') + '/' + $(this).data('invoice_no');
            common.util.popup(url, 900, 700, '배송 추적', scroll);
            return false;
        });

        // 최근 본 상품 일괄삭제
        $('#devBtnDelRecent').on('click', function () {

            common.form.init($('#devRecentViewForm'),
                common.util.getControllerUrl('deleteRecentView', 'mypage'), '',
                function (response) {
                    // console.log(response);
                    if (response.result == "success") {
                        location.reload();
                    } else {
                        common.noti.alert('삭제 처리에 실패했습니다.');
                    }
                }
            );

            var searchIDs = $("#devRecentViewForm input:checkbox:checked").map(function () {
                return $(this).val();
            }).get();

            if (searchIDs == "") {
                common.noti.alert(common.lang.get("recentview.delete.alert"));
                return false;
            } else {
                if (common.noti.confirm(common.lang.get('recentview.delete.confirm'))) {
                    $('#devRecentViewForm').submit();
                }
            }
        });

        // 관심상품 일괄삭제
        $('#devBtnDelRecent2').on('click', function () {

            common.form.init($('#wishlist_bottom_frm'),
                common.util.getControllerUrl('deleteMyWishList', 'mypage'), '',
                function (response) {
                    // console.log(response);
                    if (response.result == "success") {
                        location.reload();
                    } else {
                        common.noti.alert('삭제 처리에 실패했습니다.');
                    }
                });

            var searchIDs2 = $("#wishlist_bottom_frm input:checkbox:checked").map(function () {
                return $(this).val();
            }).get();

            if (searchIDs2 == "") {
                common.noti.alert(common.lang.get("recentview.delete.alert"));
                return false;
            } else {
                if (common.noti.confirm(common.lang.get('recentview.delete.confirm'))) {
                    $('#wishlist_bottom_frm').submit();
                }
            }
        });

    },
    run: function () {
        var self = devMyPageObj;

        self.initLang();
        self.initEvent();
    }
};

$(function () {
    devMyPageObj.run();
});