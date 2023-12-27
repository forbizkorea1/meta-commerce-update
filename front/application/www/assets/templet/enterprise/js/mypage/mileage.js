"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/

var devMileageObj = {
    initLang: function () {
        common.lang.load('mypage.invalidDate.alert', "날짜 형식이 잘못되었습니다.");
        common.lang.load('mypage.wrongStartDate.alert', "시작일은 종료일 보다 이후일 수 없습니다.");
        common.lang.load('mypage.wrongEndDate.alert', "종료일은 시작일보다 이전일 수 없습니다.");
        common.lang.load('mypage.wrongDateRange.alert', "최대 5년 내 내역까지만 조회 가능합니다.");
    },
    tabId:false,
    init: function () {
        // BBS List
        var mileageList = common.ajaxList();

        mileageList
            .setLoadingTpl('#devMileageLoading')
            .setListTpl('#devMileageList')
            .setEmptyTpl('#devMileageListEmpty')
            .setContainerType('table')
            .setContainer('#devMileageContent')
            .setPagination('#devPageWrap')
            .setPageNum('#devPage')
            .setForm('#devMileageForm')
            .setController('mileageList', 'mypage')
            .init(function (data) {
                mileageList.setContent(data.data.list, data.data.paging);
            });

        $(".devFilterState").on('click', function () {
            $("#devState").val($(this).data('index'));
            mileageList.getPage(1);
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

                mileageList.getPage(1);
            } else {
                common.noti.alert(common.lang.get('mypage.invalidDate.alert'));
            }
        });

        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            mileageList.getPage(pageNum);
        });
    },
    initEvent: function () {
        var self = this;

        self.tabId = $('#devState').val()

        $(document).on('click','.devLocationOrder', function () {
            var oid = $(this).data('oid');
            location.href = '/mypage/orderDetail?oid='+oid;
            return false;
        });

    },
    initTab: function(){
        var self = this;
        $(".devFilterState[data-index='"+self.tabId+"']").addClass("fb__mypage__tab-menu--active").siblings().removeClass("fb__mypage__tab-menu--active");
    },
    run: function () {
        var self = devMileageObj;

        self.initLang();
        self.init();
        self.initEvent();
        self.initTab();
    }
};

$(function () {
    devMileageObj.run();
});