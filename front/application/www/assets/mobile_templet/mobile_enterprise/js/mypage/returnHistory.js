"use strict";
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devReturnHistoyObj = {
    returnTpl: {},
    ajaxList: common.ajaxList(),
    initEvent: function () {
        var self = this;

        // 검색
        $('#devStatus, #devSdate').on('change', function () {
            self.ajaxList.getPage(1);
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
            //마지막 페이지 또는 page가 1일때 숨김
            if(paging && (paging.cur_page == paging.last_page || paging.page_list.length <= 1)){
                this.hidePagination();
            } else {
                this.sowPagination();
            }
            //삭제옵션, 페이지 검색시 1페이지, paging 정보 없을때
            if (this.remove === true || !paging || paging.cur_page == 1) {
                this.removeContent();
                this.setHistoryState('response', null);
            }
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    var oitems = [];

                    // order detail
                    if (typeof row.orderDetail !== 'string'){
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
                    }

                    $(this.container).append(this.listTpl(row));
                }

                if (paging) {
                    $(this.pagination).html(common.pagination.getHtml(paging));
                    if(this.scrollPage) {
                        if(paging.last_page != paging.cur_page) {
                            this.scroll = true;
                        }
                    }
                }

                //history 정보에 sate 정보 set
                var currentState = this.getHistoryState('response');
                if (currentState != null && this.remove === false) {
                    //list data의 키 찾기
                    var listKeyName = this.getResponseListKeyName(list);
                    this.response.data[listKeyName] = currentState.data[listKeyName].concat(list);
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }

            this.setHistoryState('response', this.response);
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
            .setUseHash(true)
            .setRemoveContent(false)
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
