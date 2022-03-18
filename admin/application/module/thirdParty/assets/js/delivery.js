"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devThirdPartyDeliveryObj = {
    payModalHtml : false,
    initLang: function () {
        common.lang.load('msg.select.package', '충전 패키지를 선택하여 주십시오.');
        common.lang.load('msg.refund.confirm', '신청하신 서비스를 취소 하시겠습니까?');

        common.lang.load('msg.modify.alert', '수정 되었습니다.');
    },
    initMetaPayModal: function () {
        var self = devThirdPartyDeliveryObj;

        if (self.payModalHtml== false) {
            self.payModalHtml = common.util.getHtml('#devMetaPayModalTpl');

            $('#devMetaPay').on('click', function () {
                var sgIx = $('[name="sg_ix[]"]:checked').val();

                if(sgIx) {
                    var data = new Array();
                    data['sgIx'] = sgIx;
                    data['sp_name'] = $('input[name="product['+sgIx+'][sp_name]"]').val();
                    data['offer'] = $('input[name="product['+sgIx+'][offer]"]').val();
                    data['add_offer'] = $('input[name="product['+sgIx+'][add_offer]"]').val();
                    data['sp_price'] = $('input[name="product['+sgIx+'][sp_price]"]').val();

                    common.payment.meta.modal(self.payModalHtml, $(this).data('mode'), data);
                }else{
                    common.noti.alert(common.lang.get('msg.select.package'));
                }
            });
        }
    },
    initEvent: function() {
        var self = devThirdPartyDeliveryObj;

        $('#devRefundBtn').on('click', function () {
            if(confirm(common.lang.get('msg.refund.confirm'))){
                var oid = $(this).data('oid');
                var od_ix = $(this).data('od_ix');
                common.ajax(common.util.getControllerUrl('putRefundOrder', 'delivery', 'thirdParty'),
                    {
                        oid : oid,
                        od_ix: od_ix
                    },
                    function () {
                        // 전송전 데이타 검증
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        common.noti.alert(response.data.ResultMsg);
                        location.reload();
                    }
                );
            }
        });

        $('.devDeliveryServiceUse').on('click', function (e){
            e.preventDefault();
            self.deliveryServiceUseModal();
        });

    },
    deliveryServiceUseModalTpl : false,
    deliveryServiceUseModal: function () {
        var self = devThirdPartyDeliveryObj;
        if(self.deliveryServiceUseModalTpl === false) {
            self.deliveryServiceUseModalTpl = common.util.getHtml('#devDeliveryServiceUseModalTpl');
        }
        common.util.modal.open('html',
            '서비스 사용 설정',
            self.deliveryServiceUseModalTpl,
            '',
            function(){
            $('.devServiceUse[value="'+devDeliveryService+'"]').prop('checked', true);

            $('.devServiceUseInfo').hide();
            $('#devServiceUse'+ devDeliveryService).show();

            $('.devServiceUse').on('click', function (){
               var $val = $(this).attr('value');
               $('.devServiceUseInfo').hide();
               $('#devServiceUse'+ $val).show();
            });
            $('#devDeliveryServiceUseSubmit').on('click', function(){
                common.ajax(
                    common.util.getControllerUrl('putDeliveryServiceUse', 'delivery', 'thirdParty'),
                    {
                        serviceUse: $('.devServiceUse:checked').val(),
                    },
                    function (formData) {

                        return true;
                    },
                    function (response) {

                        if (response.result == 'success') {
                            devDeliveryService = response.data.useYn;
                            common.noti.alert(common.lang.get('msg.modify.alert'));
                            common.util.modal.close();
                            console.log(devDeliveryService);
                            if (devDeliveryService == 'Y'){
                                $('#devDeliveryServiceStatus').text('사용중');
                            } else {
                                $('#devDeliveryServiceStatus').text('사용중지');
                            }
                            
                        }
                    }
                );
            });
        }, {
            width: '600px',
            height: '400px'
        });
    },
    run: function() {
        var self = devThirdPartyDeliveryObj;

        self.initEvent();
        self.initLang();
        self.initMetaPayModal();
        
    }
}

$(function(){
    devThirdPartyDeliveryObj.run();
});