"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devPubPgApplyPopObj = {
    initEvent: function() {
        common.form.init(
            $('#devKsnetForm'),
            common.util.getControllerUrl('putKsnetRegisterPop', 'pgApplyPop', 'pub'),
            '',
            function (response) {
                if (response.result == 'success') {
                    common.util.modal.close();
                    location.reload();
                } else {
                    console.log(response);
                }
            }
        );
    },
    run: function() {
        var self = this;

        self.initEvent();
    }
}

$(function(){
    devPubPgApplyPopObj.run();
});