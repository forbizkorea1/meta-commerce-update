"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMyGoodsInquiry = {
    initLang: function () {
        common.lang.load('mypage.invalidDate.alert', "날짜 형식이 잘못되었습니다.");
        common.lang.load('mypage.wrongStartDate.alert', "시작일은 종료일 보다 이후일 수 없습니다.");
        common.lang.load('mypage.wrongDateRange.alert', "최대 5년 내 내역까지만 조회 가능합니다.");
    },
    initList: function () {
        var myGoodsInquiryList = common.ajaxList();
        myGoodsInquiryList
                .setContainer('#devMyContent')
                .setLoadingTpl('#devMyLoading')
                .setListTpl('#devMyList')
                .setEmptyTpl('#devMyListEmpty')
                .setContainerType('table')
                .setPagination('#devPageWrap')
                .setPageNum('#devPage')
                .setForm('#devMyGoodsInquiryForm')
                .setController('myGoodsInquiryList', 'mypage')
                .init(function (data) {
                    $("#devTotal").text(data.data.total);

                    if ((data.data.list).length > 0) {
                        for (var i = 0; i < (data.data.list).length; i++) {
                            if (data.data.list[i].bbs_re_cnt > 0) {
                                data.data.list[i].res_status = "답변완료";
                            } else {
                                data.data.list[i].res_status = "답변대기";
                            }
                        }
                    }
                    myGoodsInquiryList.setContent(data.data.list, data.data.paging);
                });


        $('#devSearchBtn').on('click', function () {
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
                myGoodsInquiryList.getPage(1);
            } else {
                common.noti.alert(common.lang.get('mypage.invalidDate.alert'));
            }
        });

        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            myGoodsInquiryList.getPage(pageNum);
        });

        $("#devSdate").datepicker({
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            showMonthAfterYear: true,
            dateFormat: 'yy.mm.dd',
            buttonImageOnly: true,
            buttonText: '달력',
            onSelect: function (dateText) {
                if ($('#devEdate').val() != '' && $('#devEdate').val() < dateText) {
                    $('#devSdate').val($('#sDateDef').val());
                    $('#devEdate').val($('#eDateDef').val());
                    common.noti.tailMsg('devEmailId', common.lang.get("joinInput.common.validation.email.doubleCheck"));
                    alert('시작일은 종료일 보다 이후일 수 없습니다.');
                }
            }
        });

        $('#devEdate').datepicker({
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            showMonthAfterYear: true,
            dateFormat: 'yy.mm.dd',
            buttonImageOnly: true,
            buttonText: '달력',
            onSelect: function (dateText) {
                if ($('#devSdate').val() != '' && $('#devSdate').val() > dateText) {
                    $('#devSdate').val($('#sDateDef').val());
                    $('#devEdate').val($('#eDateDef').val());
                    common.noti.tailMsg('devEmailId', common.lang.get("joinInput.common.validation.email.doubleCheck"));
                    alert('종료일은 시작일 보다 이전일 수 없습니다.');
                }
            }
        });

        // 팝업
        $('#devMyContent').on('click', '[devBbsIx]', function () {
            var requestData = {};
            requestData['bbs_ix'] = $(this).attr('devBbsIx');
            common.util.modal.open('ajax', '상품 문의 내역', '/mypage/myGoodsInquiryDetail', requestData);
        });
    },    
    run: function(){
        var self = this;
        
        self.initLang();
        self.initList();
    }
};

$(function () {
    devMyGoodsInquiry.run();


});