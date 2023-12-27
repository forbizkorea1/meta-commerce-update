"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devPubExcelDownObj = {
    initEvent:function(){
        var self = this;

        $('#devDownLoadButton').on('click',function(){
            var message = $('#devMessage').val();
            var password = $('#devPassword').val();
            var returnData = {};

            if(message.length > 20){
                common.noti.alert('사유는 20자 이하로 작성해주세요.');
                return false;
            }
            returnData['message'] = message;
            returnData['password'] = password;
            common.pub.callbak('excelDown', returnData);
            common.pub.close();
        })
    },
    run: function() {
        var self = this;
        self.initEvent();
    }
}

$(function(){
    devPubExcelDownObj.run();
});