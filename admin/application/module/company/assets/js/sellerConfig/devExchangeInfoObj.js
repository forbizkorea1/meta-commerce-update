"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devExchangeInfoObj = {    
    initPub: function () {
        //주소
        $('#devSearchAddressPopup2').click(function () {
            common.pub.open('searchAddress', function (data) {
                $("#devExiZipCode").val(data.zipcode);
                $("#devExiAddress").val(data.address1);
            });
        });
    }
}
