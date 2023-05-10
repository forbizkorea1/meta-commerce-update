"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMyPageServiceRegHistoryObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.service_name', '서비스 상품명');
        common.lang.load('grid.label.service_div', '구분');
        common.lang.load('grid.label.service_point', '제공 포인트');
        common.lang.load('grid.label.service_term', '제공 기간');
        common.lang.load('grid.label.service_price', '결제/취소 금액');
        common.lang.load('grid.label.service_date', '결제/취소 일자');
        common.lang.load('grid.label.act', '관리');
        common.lang.load('grid.label.receipt', '영수증');

        common.lang.load('mypage.msg.refund.alert', '취소 및 환불은 메타커머스 고객센터에 문의해주세요.');
    },
    initEvent: function () {
        var self = devMyPageServiceRegHistoryObj;

        $('[data-ax5grid-panel="body"]').on('click', '.devDivGridCancel', function () {
            var row = self.serviceHistoryGrid.getRow($(this).data('idx'));

            if (row.service_code == 'ssl_certification') {
                common.noti.alert(common.lang.get('mypage.msg.refund.alert'));
            } else {
                common.ajax(
                    common.util.getControllerUrl('putRefundOrder', 'notice', 'thirdParty'),
                    {'od_ix' : row.od_ix,
                        'oid' : row.oid
                    },
                    '',
                    function(response){
                        // 전송후 결과 확인
                        common.noti.alert(response.data.ResultMsg);
                        if (response.result == 'success') {
                            location.reload();
                        }
                    }
                );
            }

        });
        $('[data-ax5grid-panel="body"]').on('click', '.devReciptBtn', function () {
            var row = self.serviceHistoryGrid.getRow($(this).data('idx'));

            if(row.receiptUrl){
                common.util.popup(row.receiptUrl, 460, 830, 'receipt');
            }

        });

    },
    devTabData: {},
    devServiceTab: function(selected, code, type){
        var self = devMyPageServiceRegHistoryObj;


        switch(selected) {
            case '#devServiceLookup':
            case '#devServiceAutoComplete':
            case '#devServiceSms':
            case '#devServiceAlimTalk':
            case '#devServiceBulkMail':
                self.showPointGrid();
            break;
            default:
                self.showTermGrid();
            break;
        }


        if (typeof self.devTabData[code] !== 'undefined') {
            self.serviceHistoryGrid.setContent(self.devTabData[code].data.historyList);
            return true;
        }

        if (code == 'sso') {
            common.ajax(
                common.util.getControllerUrl('getSsoServiceInfo', 'serviceRegHistory', 'myPage'),
                {},
                '',
                function(response){
                    self.devTabData[code] = response;

                    if (type == 'use') {
                        var statusBool = false;
                        $.each( response.data.sso, function (i, val) {
                            if(val.status == '1'){
                                statusBool = true;
                            }
                        });
                        if (response.data.sso.length > 0) {
                            if(statusBool){
                                $(selected+' .devRemainCount').text('신청');
                            }else{
                                $(selected+' .devRemainCount').text('신청안함');
                            }

                        } else {
                            $(selected+' .devRemainCount').text('신청안함');
                        }
                    }

                    self.serviceHistoryGrid.setContent(self.devTabData[code].data.historyList);
                    
                    //결제 취소 불가에 따른 영역 제거
                    self.serviceHistoryGrid.removeColumn()
                }
            );
        } else {
            common.ajax(
                common.util.getControllerUrl('getDeliveryProducts', 'serviceRegHistory', 'myPage'),
                {serviceCode : code},
                '',
                function(response){
                    self.devTabData[code] = response;

                    let cnt = '';
                    if (type == 'point') {
                        cnt = ' 포인트';
                    } else if (type == 'day') {
                        cnt = ' 일';
                    }

                    if(response.data.historyList.length > 0) {
                        if (type == 'use') {
                            if (response.data.historyList) {
                                $(selected+' .devRemainCount').text('신청');
                                $(selected+' .devHistoryCheck').text('연장');
                            } else {
                                $(selected+' .devRemainCount').text('신청안함');
                            }
                        } else {
                            if (response.data.remainCnt != null && response.data.remainCnt > 0) {
                                $(selected+' .devRemainCount').text(response.data.remainCnt + cnt);
                                if (type == 'day') {
                                    $(selected+' .devHistoryCheck').text('연장');
                                } else if (type == 'point') {
                                    $(selected+' .devHistoryCheck').text('충전');
                                }
                            }
                        }
                        self.serviceHistoryGrid.setContent(self.devTabData[code].data.historyList);
                    }
                }
            );
        }
    },
    initTab: function () {
        var self = devMyPageServiceRegHistoryObj;

        common.ui.tap($('#devTap'), function (selected){
            let code = '';
            let type = '';
            switch(selected) {
                case '#devServicePg':
                    type = 'use';
                    self.hideAllGrid();
                    break;
                case '#devServiceLookup':
                    code = 'delivery_tracking'
                    type = 'point';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceAutoComplete':
                    code = 'delivery_complete'
                    type = 'point';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceSsl':
                    code = 'ssl_certification'
                    type = 'use';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceSso':
                    code = 'sso'
                    type = 'use';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceSms':
                    code = 'sms'
                    type = 'point';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceAlimTalk':
                    code = 'kakao_message'
                    type = 'point';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceBulkMail':
                    code = 'mail_outbound'
                    type = 'point';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceFat':
                    code = 'FAT'
                    type = 'day';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceSeller':
                    code = 'seller'
                    type = 'day';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceMarket':
                    code = 'market'
                    type = 'day';
                    self.devServiceTab(selected, code, type);
                    break;
                case '#devServiceBigin':
                    code = 'bigin'
                    type = 'day';
                    self.devServiceTab(selected, code, type);
                    break;
                default:
                    console.log(selected);
                    break;
            }
        });

    },
    serviceHistoryGrid: false,
    pointGrid: false,
    termGrid: false,
    initServiceHistoryGrid: function (){
        var self = devMyPageServiceRegHistoryObj;
        self.pointGrid = common.ui.grid();
        self.termGrid = common.ui.grid();

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            columns: [
                {key: "sp_name", label: common.lang.get('grid.label.service_name'), width: 400},
                {key: "div_text", label: common.lang.get('grid.label.service_div'), width: 200, align: 'center'},
                {key: "offer", label: common.lang.get('grid.label.service_point'), width: 200, align: 'center'},
                {key: "ptprice_text", label: common.lang.get('grid.label.service_price'), width: 200, align: 'center'},
                {key: "payment_date", label: common.lang.get('grid.label.service_date'), width: 200, align: 'center', formatter: function () {
                        if (this.item.status == 'CC') {
                            return this.item.cancel_date;
                        } else {
                            return this.item.payment_date;
                        }
                    }},
                {key: "receitpUrl", label: common.lang.get('grid.label.receipt'), width: 200, align: 'center', formatter: function () {
                        var receiptUrl = '-';
                        if(typeof this.item.receiptBool !== 'undefined' && this.item.receiptBool == true ){
                            receiptUrl = '<input type="button" class="fb-filter__edit devReciptBtn" data-idx="' + this.item.__index + '" value="영수증" />';
                        }
                        return receiptUrl;
                    }},
                {
                    key: "act",
                    label: '',
                    align: "center",
                    width: 200,
                    formatter: function () {
                        if (this.item.status == 'CC') {
                            return "신청취소";
                        } else if (this.item.service_code == 'seller' || this.item.service_code == 'market' || this.item.service_code == 'FAT') {
                            return "-";
                        } else if (this.item.status_text == '취소/환불') {
                            return '<input type="button" class="fb-filter__edit devDivGridCancel" data-idx="' + this.item.__index + '" value="취소/환불" />';
                        }

                        return this.item.status_text;
                    }
                }
            ]
        };

        // 포인트 그리드 생성
        self.pointGrid.setGrid($('#devServiceHistoryPointGrid'), gridConfig)
            .setUseHash(false);
        // 기간 그리드 생성
        gridConfig.columns[2] = {key: "offer", label: common.lang.get('grid.label.service_term'), width: 200, align: 'center'};
        self.termGrid.setGrid($('#devServiceHistoryTermGrid'), gridConfig)
            .setUseHash(false);
        // 그리드 감추기
        self.hideAllGrid();
    },
    hideAllGrid: function(){
        // 포인트 그리드 감추기
        $('#devHistoryListPointSection').hide();
        // 기간 그리드 감추기
        $('#devHistoryListTermSection').hide();
    },
    showPointGrid: function(){
        var self = devMyPageServiceRegHistoryObj;

        self.serviceHistoryGrid = self.pointGrid;
        // 포인트 그리드 보이기
        $('#devHistoryListPointSection').show();
        // 기간 그리드 감추기
        $('#devHistoryListTermSection').hide();
    },
    showTermGrid: function(){
        var self = devMyPageServiceRegHistoryObj;

        self.serviceHistoryGrid = self.termGrid;
        // 포인트 그리드 감추기
        $('#devHistoryListPointSection').hide();
        // 기간 그리드 보이기
        $('#devHistoryListTermSection').show();
    },
    run: function () {
        var self = devMyPageServiceRegHistoryObj;

        self.initLang();
        self.initServiceHistoryGrid();
        self.initEvent();
        self.initTab();
    }
}

$(function () {
    devMyPageServiceRegHistoryObj.run();
});