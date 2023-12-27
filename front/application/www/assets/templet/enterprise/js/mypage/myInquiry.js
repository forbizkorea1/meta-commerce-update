"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMypageMyInquiry = {
    initLang: function () {
        common.lang.load('mypage.invalidDate.alert', "날짜 형식이 잘못되었습니다.");
        common.lang.load('mypage.wrongStartDate.alert', "시작일은 종료일 보다 이후일 수 없습니다.");
        common.lang.load('mypage.wrongDateRange.alert', "최대 5년 내 내역까지만 조회 가능합니다.");
    },
    initList: function () {
        var myInquiryList = common.ajaxList();

        myInquiryList.setContainerType('table')
                .setContainer('#devMyInquiryContent')
                .setListTpl('#devMyInquiryList')
                .setLoadingTpl('#devMyInquiryLoading')
                .setEmptyTpl('#devMyInquiryEmpty')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devMyInquiryForm')
                .setController('myInquiryList', 'mypage')
                .init(function (data) {
                    $("#devTotal").text(data.data.total);
                    myInquiryList.setContent(data.data.list, data.data.paging);
                });

        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            myInquiryList.getPage(pageNum);
        });

        var ckStatusList = "";
        
        $('.devStatus').each(function () {
            if (this.checked === true) {
                if (ckStatusList == '') {
                    ckStatusList = this.value;
                } else {
                    ckStatusList += "," + this.value;
                }
            }
        });
        $("#devCkStatus").val(ckStatusList);



        $('#devSearchBtn').on('click', function () {

            var ckStatusList = "";
            $('.devStatus').each(function () {
                if (this.checked === true) {
                    if (ckStatusList == '') {
                        ckStatusList = this.value;
                    } else {
                        ckStatusList += "," + this.value;
                    }
                }
            });
            $("#devCkStatus").val(ckStatusList);

            var endDate = common.util.dates.convert($('#devEdate').val());
            var startDate = common.util.dates.convert($('#devSdate').val());
            var maxDate = common.util.dates.convert((startDate.getFullYear() + 5) + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate());

            if (startDate != 'Invalid Date' && endDate != 'Invalid Date') {
                if (common.util.dates.compare(startDate, endDate) == 1) {
                    common.noti.alert(common.lang.get('mypage.wrongStartDate.alert'));
                    return false;
                } else if (common.util.dates.compare(endDate, maxDate) == 1) {
                    common.noti.alert(common.lang.get('mypage.wrongDateRange.alert'));
                    return false;
                }

                myInquiryList.getPage(1);
            } else {
                common.noti.alert(common.lang.get('mypage.invalidDate.alert'));
            }
        });


        // 팝업
        $('#devMyInquiryContent').on('click', '[devBbsIx]', function () {
            var requestData = {};
            requestData['bbs_ix'] = $(this).attr('devBbsIx');
            common.util.modal.open('ajax', '1:1 문의 내역', '/mypage/myInquiryDetail', requestData);
        });
    },
    run: function () {
        var self = this;

        self.initList();
    }
};

$(document).ready(function () {
    devMypageMyInquiry.run();
});
