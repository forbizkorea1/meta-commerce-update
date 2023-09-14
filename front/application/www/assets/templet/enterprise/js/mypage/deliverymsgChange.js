"use strict";
/*--------------------------------------------------------------*
 * 공용변수 선언 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devAddressBookRequestObj = {
    callbackSelect: false,
    initLang: function () {
        common.lang.load('delivery.require.change.success', "배송요청사항 변경이 완료되었습니다.");
        common.lang.load('delivery.require.noorder', "주문이 존재하지 않습니다.");
    },
    initEvent: function () {
        var self = this;

        $('.devDeliveryMessageSelectBox').change(function () {
            var $deliveryMessageContents = $(this).closest('.devDeliveryMessageContents,.devEachDeliveryMessageContents');
            var $deliveryMessageDirectContents = $deliveryMessageContents.find('.devDeliveryMessageDirectContents');
            var $deliveryMessageDoorContents = $deliveryMessageContents.find('.devDeliveryMessageDoorContents');
            var $deliveryMessage = $deliveryMessageDirectContents.find('.devDeliveryMessage');
            var message = $(this).val();
            $deliveryMessage.val('');

            if (message == 'direct') {
                $deliveryMessageDirectContents.show();
                $deliveryMessageDoorContents.hide();
                $('.devDeliveryEntranceWay').val('');
                $('.devDoorMessage').val('');
            } else if(message == 'door') {
                $deliveryMessageDoorContents.show();
                $deliveryMessageDirectContents.hide();
                $deliveryMessage.val($(this).find("option:selected").text());
            } else {
                $deliveryMessageDirectContents.hide();
                $deliveryMessageDoorContents.hide();
                $deliveryMessage.val(message);
                $('.devDeliveryEntranceWay').val('');
                $('.devDoorMessage').val('');
            }
            //배송 메세지 길이 이벤트 실행
            $deliveryMessage.trigger('input');
        });

        $('.devDeliveryEntranceWay').on('change', function() {
            var $devDeliveryMessageDoorContents = $(this).closest('.devDeliveryMessageDoorContents');
            var $deliveryMessageDoorContents = $devDeliveryMessageDoorContents.find('.devDeliveryMessageDoorContents');
            var $doorMessage = $deliveryMessageDoorContents.find('.devDoorMessage');
            var message = $(this).val();

            if(message == 'direct' || message == 'door') {
                $('.devDeliveryEntranceWayMessageWrap').show();
            }else {
                $('.devDeliveryEntranceWayMessageWrap').hide();
                $doorMessage.val(message);
            }
        });

        // 배송지 변경
        $('#devDeliveryMsgForm').on('click', '#devMsgSubmitBtn', function () {

            var oid = $('#devOid').val();
            var oddIx = $('#devOddIx').val();
            var msgType = 'D';
            var deliveryMsg = $('.devDeliveryMessageContents .devDeliveryMessage').val().trim();
            var devDeliveryEntranceWay = $('.devDeliveryEntranceWay > option:selected'); //문앞 > 문앞 상세 배송요청 선택값
            var doorMsg = '';

            if($('.devDeliveryMessageSelectBox').val() == 'door'){

                if(devDeliveryEntranceWay.index() == 0 || devDeliveryEntranceWay.val() == 'direct') {
                    var selectMsg = '';
                }else{
                    var selectMsg = devDeliveryEntranceWay.text().trim();

                    if(devDeliveryEntranceWay.val() == 'door'){
                        selectMsg += ' / ';
                    }
                }

                var doorDirectMsg = $('.devDeliveryMessageContents .devDoorMessage').val().trim();
                doorMsg += selectMsg;

                if(doorDirectMsg) {
                    doorMsg += doorDirectMsg;
                }
            }

            common.ajax(
                common.util.getControllerUrl('deliveryMsgModify', 'mypage'),
                {oId: oid, msgType: msgType, msgIx: oddIx, deliveryMsg: deliveryMsg, doorMsg : doorMsg},
                '',
                function (res) {
                    if (res.result == 'success') {
                        common.noti.alert(common.lang.get('delivery.require.change.success'));
                        opener.parent.location.reload();
                        window.close();
                    } else if(res.result == 'noOrder') {
                        common.noti.alert(common.lang.get('delivery.require.noorder'));
                        window.close();
                    }else {
                        common.noti.alert(res.data);
                    }
                }
            );
        });

        // 취소
        $('#devMsgCancelBtn').on('click', function () {
            if (window.opener) { window.close() };
            // document.location.href = '/mypage/orderDetail?oid=' + $('#oid').val();
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
    }
}
$(function () {
    devAddressBookRequestObj.run()
});