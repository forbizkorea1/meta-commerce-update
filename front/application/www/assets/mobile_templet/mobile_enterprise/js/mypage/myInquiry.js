"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMypageMyInquiry = {
    initList: function () {
        var myInquiryList = common.ajaxList();

        myInquiryList.setContainerType('div')
                .setContainer('#devMyInquiryContent')
                .setRemoveContent(false)
                .setListTpl('#devMyInquiryList')
                .setLoadingTpl('#devMyInquiryLoading')
                .setEmptyTpl('#devMyInquiryEmpty')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devMyInquiryForm')
                .setUseHash(false)
                .setController('myInquiryList', 'mypage')
                .setScrollPage(true)
                .init(function (data) {

                    //상품후기가 1개이상일때 총갯수 노출
                    if (data.data.total > 0) {
                        $('.devTotalWrap').show();
                        $("#devTotal").text(data.data.total);
                    }

                    myInquiryList.setContent(data.data.list, data.data.paging);
                });


        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            myInquiryList.getPage(pageNum);
        });
    },
    run: function () {
        var self = this;

        self.initList();
    }
}

$(function () {
    devMypageMyInquiry.run();
});