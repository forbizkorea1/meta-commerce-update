"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMyPageServiceLogObj = {
    initLang: function(){
        var self = this;
        common.lang.load('grid.label.status_message', '발송요청상태');
        common.lang.load('grid.label.message_type', 'Type');
        common.lang.load('grid.label.from_number', '발신번호');
        common.lang.load('grid.label.to_number', '수신번호');
        common.lang.load('grid.label.request_time', '요청일시');
        common.lang.load('grid.label.act', '관리');


        common.lang.load('grid.label.failover_status', 'Failover 상태');
        common.lang.load('grid.label.template_code', '템플릿 코드');
        common.lang.load('grid.label.chanel_name', '카카오톡 채널');


        common.lang.load('grid.label.mail_id', '요청 아이디');
        common.lang.load('grid.label.from_mail', '발송자 주소');
        common.lang.load('grid.label.to_mail', '수신자 주소');
    },
    initTab: function () {
        var self = this;

        common.ui.tap($('#devTap'), function (selector) {
            if (selector == '#devSmsLog') {
                self.initSmsLogGrid();
                $('#devSmsGridSection').show();
                $('#devKakaoGridSection').hide();
                $('#devMailGridSection').hide();
            } else if (selector == '#devKakaoLog') {
                self.initKakaoLogGrid();
                $('#devSmsGridSection').hide();
                $('#devKakaoGridSection').show();
                $('#devMailGridSection').hide();
            } else if (selector == '#devMailLog') {
                self.initMailLogGrid();
                $('#devSmsGridSection').hide();
                $('#devKakaoGridSection').hide();
                $('#devMailGridSection').show();
            }
        });
    },
    initSearchForm: function () {
        common.ui.datePicker($('#devSmsLogDatePickerStart'), {
            endTartget: $('#devSmsLogDatePickerEnd')
            , timepicker: false
        });
        common.ui.datePicker($('#devSmsLogDatePickerEnd'), {
            startTartget: $('#devSmsLogDatePickerStart')
            , timepicker: false
        });
        common.ui.quickDate('-', $('#devQuickSmsLogDate'), {
            timepicker: false
            , startTartget: $('#devSmsLogDatePickerStart')
            , endTartget: $('#devSmsLogDatePickerEnd')
        });

        common.ui.datePicker($('#devKakaoLogDatePickerStart'), {
            endTartget: $('#devKakaoLogDatePickerEnd')
            , timepicker: false
        });
        common.ui.datePicker($('#devKakaoLogDatePickerEnd'), {
            startTartget: $('#devKakaoLogDatePickerStart')
            , timepicker: false
        });
        common.ui.quickDate('-', $('#devQuickKakaoLogDate'), {
            timepicker: false
            , startTartget: $('#devKakaoLogDatePickerStart')
            , endTartget: $('#devKakaoLogDatePickerEnd')
        });

        common.ui.datePicker($('#devMailLogDatePickerStart'), {
            endTartget: $('#devMailLogDatePickerEnd')
            , timepicker: false
        });
        common.ui.datePicker($('#devMailLogDatePickerEnd'), {
            startTartget: $('#devMailLogDatePickerStart')
            , timepicker: false
        });
        common.ui.quickDate('-', $('#devQuickMailLogDate'), {
            timepicker: false
            , startTartget: $('#devMailLogDatePickerStart')
            , endTartget: $('#devMailLogDatePickerEnd')
        });
    },
    smsLogGrid: false,
    initSmsLogGrid: function () {
        var self = this;
        // 그리드 생성
        self.smsLogGrid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            columns: [
                {key: "status_message", label: common.lang.get('grid.label.status_message'), width: 150, align: "center"},
                {key: "type", label: common.lang.get('grid.label.message_type'), width: 150, align: "center"},
                {key: "from", label: common.lang.get('grid.label.from_number'), width: 150, align: "center"},
                {key: "to", label: common.lang.get('grid.label.to_number'), width: 130, align: "center"},
                {key: "request_time", label: common.lang.get('grid.label.request_time'), width: 130, align: "center"},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devDetailLogView" data-service-type="sms" data-idx="' + this.item.idx + '" value="상세" />',
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        self.smsLogGrid.setGrid($('#devSmsLogPagingGrid'), gridConfig)
            .setForm('#devSmsLogListForm')
            .setPagination('#devSmsLogPageWrap')
            .setPageNum('#devSmsLogPageNum')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('getServiceSmsLog', 'serviceLog', 'myPage'))
            .init(function (response) {
                $('#devSmsTotal').text(common.util.numberFormat(response.data.total));
                $('#devSmsSuccessTotal').text(common.util.numberFormat(response.data.successCnt));
                $('#devSmsFailTotal').text(common.util.numberFormat(response.data.failCnt));
                $('#devSmsReadyTotal').text(common.util.numberFormat(response.data.readyCnt));

                self.smsLogGrid.setContent(response.data.list, response.data.paging);

                self.initMessage(response);

            });
    },

    initMessage: function (response){
        var self = this;
        if(response.result == 'fail'){
            if(response.data.data.msg){
                common.noti.alert(response.data.data.msg)
            }
        }
    },
    kakaoLogGrid: false,
    initKakaoLogGrid: function () {
        var self = this;
        // 그리드 생성
        self.kakaoLogGrid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            columns: [
                {key: "status_message", label: common.lang.get('grid.label.status_message'), width: 150, align: "center"},
                {key: "failover_status", label: common.lang.get('grid.label.failover_status'), width: 150, align: "center"},
                {key: "template_code", label: common.lang.get('grid.label.template_code'), width: 150, align: "center"},
                {key: "plus_friend_id", label: common.lang.get('grid.label.chanel_name'), width: 150, align: "center"},
                {key: "to", label: common.lang.get('grid.label.to_number'), width: 130, align: "center"},
                {key: "request_time", label: common.lang.get('grid.label.request_time'), width: 130, align: "center"},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devDetailLogView" data-service-type="kakao" data-idx="' + this.item.idx + '" value="상세" />',
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        self.kakaoLogGrid.setGrid($('#devKakaoLogPagingGrid'), gridConfig)
            .setForm('#devKakaoLogListForm')
            .setPagination('#devKakaoLogPageWrap')
            .setPageNum('#devKakaoLogPageNum')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('getServiceKakaoLog', 'serviceLog', 'myPage'))
            .init(function (response) {
                $('#devKakaoTotal').text(common.util.numberFormat(response.data.total));
                $('#devKakaoSuccessTotal').text(common.util.numberFormat(response.data.successCnt));
                $('#devKakaoFailTotal').text(common.util.numberFormat(response.data.failCnt));
                self.kakaoLogGrid.setContent(response.data.list, response.data.paging);
                self.initMessage(response);
            });
    },


    mailLogGrid: false,
    initMailLogGrid: function () {
        var self = this;
        // 그리드 생성
        self.mailLogGrid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            columns: [
                {key: "status_message", label: common.lang.get('grid.label.status_message'), width: 150, align: "center"},
                {key: "request_id", label: common.lang.get('grid.label.mail_id'), width: 150, align: "center"},
                {key: "template_code", label: common.lang.get('grid.label.template_code'), width: 150, align: "center"},
                {key: "from", label: common.lang.get('grid.label.from_mail'), width: 150, align: "center"},
                {key: "to", label: common.lang.get('grid.label.to_mail'), width: 130, align: "center"},
                {key: "request_time", label: common.lang.get('grid.label.request_time'), width: 130, align: "center"}
            ]
        };

        // 그리드 연동
        self.mailLogGrid.setGrid($('#devMailLogPagingGrid'), gridConfig)
            .setForm('#devMailLogListForm')
            .setPagination('#devMailLogPageWrap')
            .setPageNum('#devMailLogPageNum')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('getServiceMailLog', 'serviceLog', 'myPage'))
            .init(function (response) {
                $('#devMailTotal').text(common.util.numberFormat(response.data.total));
                $('#devMailSuccessTotal').text(common.util.numberFormat(response.data.successCnt));
                $('#devMailFailTotal').text(common.util.numberFormat(response.data.failCnt));
                self.mailLogGrid.setContent(response.data.list, response.data.paging);
                self.initMessage(response);
            });
    },
    initEvent:function(){
        var self = this;

        $(document).on('click', '.devDetailLogView', function () {
            var idx = $(this).data('idx');
            var serviceType = $(this).data('serviceType');
            var title = '';
            if(serviceType == 'sms'){
                title = 'SMS 상세보기';
            }else if (serviceType == 'kakao'){
                title = '알림톡 상세보기';
            }
            common.util.modal.open('ajax', title, common.util.getControllerUrl('serviceLogDetail', 'myPage'),
                {serviceType: serviceType,idx:idx,title:title},
                '',
                { width: '750px', height: '600px'}
            );
        });

        //초기화
        $('#devSmsLogFormReset').click(function (e) {
            common.form.reset($('#devSmsLogListForm'));
            self.smsLogGrid.reload();
        });

        //초기화
        $('#devKakaoLogFormReset').click(function (e) {
            common.form.reset($('#devKakaoLogListForm'));
            self.kakaoLogGrid.reload();
        });

        //초기화
        $('#devMailLogFormReset').click(function (e) {
            common.form.reset($('#devMailLogListForm'));
            self.mailLogGrid.reload();
        });

        // 엑셀 다운로드 처리
        $('#devSmsExcelDownload').on('click', function (e) {
            self.smsLogGrid.excelDown(common.util.getControllerUrl('dwnSms', 'serviceLog', 'myPage'));
        });

        // 엑셀 다운로드 처리
        $('#devKakaoExcelDownload').on('click', function (e) {
            self.kakaoLogGrid.excelDown(common.util.getControllerUrl('dwnKakao', 'serviceLog', 'myPage'));
        });

        // 엑셀 다운로드 처리
        $('#devMailExcelDownload').on('click', function (e) {
            self.mailLogGrid.excelDown(common.util.getControllerUrl('dwnMail', 'serviceLog', 'myPage'));
        });
    },
    run: function() {
        var self = this;
        self.initTab();
        self.initLang();
        self.initSearchForm();
        self.initSmsLogGrid();
        self.initEvent();
    }
}

$(function(){
    devMyPageServiceLogObj.run();
});