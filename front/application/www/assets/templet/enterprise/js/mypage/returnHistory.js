"use strict";
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
common.lang.load('mypage.invalidDate.alert', "날짜 형식이 잘못되었습니다.");
common.lang.load('mypage.wrongStartDate.alert', "시작일은 종료일 보다 이후일 수 없습니다.");
common.lang.load('mypage.wrongDateRange.alert', "최대 5년 내 내역까지만 조회 가능합니다.");

var devReturnHistoyObj = {
    returnTpl: {},
    ajaxList: common.ajaxList(),
    initEvent: function () {
        var self = this;

        // 검색
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

                self.ajaxList.getPage(1);
            } else {
                common.noti.alert(common.lang.get('mypage.invalidDate.alert'));
            }

        });
    },
    ajaxInit: function () {
        var self = this;

        // Template compile
        self.returnTpl.returnProduct = self.ajaxList.compileTpl('#devReturnProduct');
        // Template change
        $('#devOrderDetailContent').text('{[{orderDetail}]}');

        // 컨텐츠 랜더링 메소드 리매핑
        self.ajaxList.setContent = function (list, paging) {
            this.removeContent();
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    var oitems = [];

                    // order detail
                    for (var idx = 0; idx < row.orderDetail.length; idx++) {
                        // price number_format
                        row.orderDetail[idx].pt_dcprice = common.util.numberFormat(row.orderDetail[idx].pt_dcprice);
                        row.orderDetail[idx].dcprice = common.util.numberFormat(row.orderDetail[idx].dcprice);
                        row.orderDetail[idx].listprice = common.util.numberFormat(row.orderDetail[idx].listprice);
                        row.orderDetail[idx].ea_listprice = common.util.numberFormat(row.orderDetail[idx].ea_listprice);
                        row.orderDetail[idx].exchangePrd = (row.orderDetail[idx].exchangePrd ? true : false);

                        oitems.push(self.returnTpl.returnProduct(row.orderDetail[idx]));
                    }

                    row.orderDetail = oitems.join('');

                    $(this.container).append(this.listTpl(row));
                }

                if (paging) {
                    $(this.pagination).html(common.pagination.getHtml(paging));
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }
        };

        // 주문내역 설정
        self.ajaxList
            .setLoadingTpl('#devReturnHistoryLoading')
            .setListTpl('#devReturnHistoryList')
            .setEmptyTpl('#devReturnHistoryEmpty')
            .setContainerType('div')
            .setContainer('#devReturnHistoryContent')
            .setPagination('#devPageWrap')
            .setPageNum('#devPage')
            .setForm('#devReturnHistoryForm')
            .setGotoTop(500)
            .setUseHash(true)
            .setController('returnHistory', 'mypage')
            .init(function (data) {
                self.ajaxList.setContent(data.data.list, data.data.paging);
            });

        // 페이징 버튼 이벤트 설정
        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            self.ajaxList.getPage($(this).data('page'));
        });
    },
    run: function () {
        var self = this;

        // 이벤트 바인딩
        self.initEvent();
        // 주문내역 초기화
        self.ajaxInit();
    }
};

$(function () {
    devReturnHistoyObj.run()
});
