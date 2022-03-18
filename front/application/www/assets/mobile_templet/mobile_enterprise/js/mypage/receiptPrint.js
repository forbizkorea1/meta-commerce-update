"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devObj = {
    run: function () {
        $('.devCachInfo').on('click', function(){
            var settle_module = $(this).data('settle_module');
            switch(settle_module){
                case 'nicepay':
                    // var url = "https://pg.nicepay.co.kr/issue/IssueLoader.jsp?TID="+$(this).data('tid')+"&type=0";
                    var url = "https://npg.nicepay.co.kr/issue/IssueLoader.do?TID="+$(this).data('tid')+"&type=1&InnerWin=Y";
                    break;
                case 'kcp':
                    var url = "http://admin8.kcp.co.kr/assist/bill.BillActionNew.do?cmd=cash_bill&cash_no=" + $(this).data('tid') + "&order_id=" + $(this).data('oid') + "&trade_mony=" + $(this).data('total');
                    break;
                default :
                    var url = '#';
                    break;
            }
            // 현금영수증 조회
            //http://admin8.kcp.co.kr/assist/bill.BillActionNew.do?cmd=cash_bill&cash_no= [현금영수증거래번호]&order_id=[주문번호]&trade_mony=[거래금액]

            location.href=url;
        });

        $('.devCardInfo').on('click', function(){
            // 카드 매출 전표 조회
            var settle_module = $(this).data('settle_module');
            switch(settle_module){
                case 'nicepay':
                    // var url = "https://pg.nicepay.co.kr/issue/IssueLoader.jsp?TID="+$(this).data('tid')+"&type=0";
                    var url = "https://npg.nicepay.co.kr/issue/IssueLoader.do?TID="+$(this).data('tid')+"&type=0&InnerWin=Y";
                    break;
                case 'kcp':
                    var url = "https://admin8.kcp.co.kr/assist/bill.BillActionNew.do?cmd=card_bill&tno=" + $(this).data('tid') + "&order_no=" + $(this).data('oid') + "&trade_mony=" + $(this).data('total');
                    break;
                default :
                    var url = '#';
                    break;
            }
            //https://admin8.kcp.co.kr/assist/bill.BillActionNew.do?cmd=card_bill&tno= [NHN KCP거래번호]&order_no=[주문번호]&trade_mony=[거래금액]

            location.href=url;
        });

    }
};

$(function () {
    devObj.run();
});