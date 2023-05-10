"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMileage = {
    init: function () {
        // BBS List
        var mileageList = common.ajaxList();

        mileageList
            .setUseHash(false)
            .setRemoveContent(false)
            .setLoadingTpl('#devMileageLoading')
            .setListTpl('#devMileageList')
            .setEmptyTpl('#devMileageListEmpty')
            .setContainerType('div')
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

        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            mileageList.getPage(pageNum);
        });

        // 검색일 설정
        $('#devSelectDate').on('change', function () {
            var sdate = $('option:selected', this).data('sdate');
            var edate = $('option:selected', this).data('edate');

            $('#sDate').val(sdate);
            $('#eDate').val(edate);
            mileageList.getPage(1);
        });
    },
    run: function () {
        var self = devMileage;

        self.init();
    }
};

$(function () {
    devMileage.run();
});