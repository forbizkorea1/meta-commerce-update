"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devObj = {
    ajaxList: false,
    formTpl: false,
    showModifyBtn: function () {
        $('#devDivSaveBtnGroup').hide();
        $('#devDivModifyBtnGroup').show();
    },
    showSaveBtn: function () {
        $('#devDivModifyBtnGroup').hide();
        $('#devDivSaveBtnGroup').show();
    },
    initLang: function () {
        common.lang.load('refund.account.delete.confirm', "환불계좌를 삭제하시겠습니까?");
        common.lang.load('refund.account.replace.success', '환불 계좌가 정상적으로 등록되었습니다.');
    },
    init: function () {
        var self = devObj;

        // 환불계좌 AJAX list
        self.ajaxList = common.ajaxList();
        // 환불계좌 입력/수정 템플릿 컴파일
        self.formTpl = self.ajaxList.compileTpl('#devRefundAccountReplaceForm');

        // 환불계좌 리스트
        self.ajaxList
            .setLoadingTpl('#devRefundAccountLoading')
            .setListTpl('#devRefundAccountList')
            .setEmptyTpl(self.formTpl)
            .setContainerType('div')
            .setContainer('#devRefundAccountContent')
            .setForm('#devRefundAccountForm')
            .setUseHash(false)
            .setController('refundAccount', 'mypage')
            .init(function (data) {
                self.ajaxList.setContent(data.data.list, data.data.paging);
                if (data.data.list !== false) {
                    self.showModifyBtn();
                } else {
                    self.showSaveBtn();
                }
            });
    },
    initEvent: function () {
        var self = devObj;

        // 변경 버튼 이벤트
        $('#devRefundAccountForm').on('click', '#devRefundAccountItemModify', function () {
            var bankCode = $('#devRefundAccountData').data('bankcode');
            var bankOwner = $('#devRefundAccountData').data('bankowner');
            var bankIx = $('#devRefundAccountData').data('bankix');

            self.ajaxList.removeContent();
            $(self.ajaxList.container).append(self.formTpl);

            $('#devBankCode').val(bankCode);
            $('#devBankOwner').val(bankOwner);
            $('#devRefundAccountItemSave').data('bankix', bankIx);

            self.showSaveBtn();
        });

        // 저장 버튼 이벤트
        $('#devRefundAccountForm').on('click', '#devRefundAccountItemSave', function () {
            common.ajax(
                common.util.getControllerUrl('replaceRefundAccount', 'mypage'),
                {
                    bank_ix: $(this).data('bankix'),
                    bank_code: $('#devBankCode').val(),
                    bank_owner: $('#devBankOwner').val(),
                    bank_number: $('#devBankNumber').val()
                },
                function () {
                    //-----set input format
                    common.inputFormat.set($('#devBankNumber'), {'maxLength': 40});
                    //-----set validation
                    common.validation.set($('#devBankCode,#devBankOwner,#devBankNumber'), {'required': true});
                    // Check Validation
                    return common.validation.check($('#devRefundAccountForm'), 'alert', false);
                },
                function (data) {
                    if (data.result == 'success') {
                        common.noti.alert(common.lang.get('refund.account.replace.success'));
                        self.ajaxList.reload();
                    }
                }
            );
        });

        // 변경 취소 이벤트
        $('#devRefundAccountForm').on('click', '#devRefundAccountModifyCancel', function () {
            self.ajaxList.reload();
        });

        // 삭제 버튼 이벤트
        $('#devRefundAccountForm').on('click', '#devRefundAccountItemDelete', function () {
            if (confirm(common.lang.get('refund.account.delete.confirm'))) {
                common.ajax(
                    common.util.getControllerUrl('removeRefundAccount', 'mypage'),
                    {bank_ix: $('#devRefundAccountData').data('bankix')},
                    function () {
                        return true;
                    },
                    function (data) {
                        $('#devRefundAccountItemSave').data('bankix', '');
                        self.ajaxList.reload();
                    }
                );
            }
        });
    },
    run: function () {
        var self = devObj;

        self.initLang();
        self.init();
        self.initEvent();
    }
};

$(function () {
    devObj.run();
});