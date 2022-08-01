"use strict";
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devChangeOrderStatusResponseObj = {
    initLang: function () {
        common.lang.load('canNotIncomComplete.response.alert', '입금확인으로 변경할수 없는 상태입니다.');
        common.lang.load('sameChangeStatus.response.alert', '변경하려는 상태와 동일한 주문 건이 있습니다.');
        common.lang.load('beforeActingChangeStatus.response.alert', '변경된 주문 건이 있습니다. 새로 고침후 다시 시도해주세요.');
        common.lang.load('undefinedStatus.response.alert', '정의되지 않은 상태입니다.');
        common.lang.load('canNotDeliveryIng.response.alert', '배송준비중, 배송지연 상태가 아닌 주문 건이 포함되어 있습니다.');
        common.lang.load('unacceptableQuick.response.alert', '배송업체 코드를 확인해주세요.');
        common.lang.load('canNotCancelCompleteClaim.response.alert', '입금확인, 배송지연, 배송준비중 상태가 아닌 주문 건이 포함되어 있습니다.');
        common.lang.load('canNotCancelComplete.response.alert', '취소요청 상태가 아닌 주문 건이 포함되어 있습니다.');
        common.lang.load('canNotDeliveryReady.response.alert', '배송완료, 구매확정 상태인 주문 건이 포함되어 있습니다.');
    },
    noti: function (response) {
        if (response.result == "changeOrderStatusFail") {
            common.noti.alert(common.lang.get(response.data.failCode + '.response.alert'));
        } else {
            common.noti.alert(response.result);
        }
    },
    run: function () {
        this.initLang();
    }
}

$(function () {
    devChangeOrderStatusResponseObj.run();
});