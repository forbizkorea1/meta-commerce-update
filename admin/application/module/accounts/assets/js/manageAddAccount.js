"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devAccountsManageAddAccountObj = {
    callback: false,
    initLang: function () {
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title}을/를 삭제하시겠습니까?');
    },
    grid: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 생성
        self.grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            columns: devAddAccountObj.getGridColumns()
        };

        // 그리드 연동
        self.grid.setGrid($('#devAddAccountGrid'), gridConfig)
            .setForm('#devAddAccountGridForm')
            .setPagination('#devAddAccountPageWrap')
            .setPageNum('#devAddAccountPageNum')
            .setUrl(common.util.getControllerUrl('get', 'manageAddAccount', 'accounts'))
            .setUseHash(false)
            .init(function (response) {
                self.grid.setContent(response.data.list, response.data.paging);
            });
    },
    initForm: function () {
        var self = this;

        common.validation.set($('#devAddAccountPrice, #devAddAccountMsg'), {required: true});
        common.inputFormat.set($('#devAddAccountPrice'), {number: true});

        common.form.init($('#devAddAccountForm'), common.util.getControllerUrl('put', 'manageAddAccount', 'accounts'), function (formData, $form) {
            return common.validation.check($form, 'alert', false);
        }, function (response) {
            if (response.result == 'success') {
                //등록 구분지어 문구 처리
                if (response.data.type == 'add') {
                    common.noti.alert(common.lang.get('common.add.success.alert'));
                } else {
                    common.noti.alert(common.lang.get('common.put.success.alert'));
                }
                common.form.reset($('#devAddAccountForm'));
                $('#devAddAccountFormReset').hide();
                self.grid.reload();
                if ($.isFunction(self.callback)) {
                    self.callback();
                }
            } else {
                common.noti.alert(response.result);
            }
        });
    },
    initEvent: function () {
        var self = this;

        //초기화
        $('#devAddAccountFormReset').click(function (e) {
            common.form.reset($('#devAddAccountForm'));
            $(this).hide();
        });

        // 추가 정산 수정
        $('#devAddAccountGrid [data-ax5grid-panel="body"]').on('click', '.devAddAccountModify', function () {
            var row = self.grid.getRow($(this).data('idx'));
            common.form.dataBind($('#devAddAccountForm'), row);
            $('#devAddAccountFormReset').show();
        });

        // 추가 정산 삭제
        $('#devAddAccountGrid [data-ax5grid-panel="body"]').on('click', '.devAddAccountDel', function () {
            var row = self.grid.getRow($(this).data('idx'));
            common.noti.confirm(common.lang.get('common.del.confirm', {title: row.app_msg}), function () {
                common.ajax(common.util.getControllerUrl('del', 'manageAddAccount', 'accounts'), {
                        aap_ix: row.aap_ix
                    },
                    function () {
                        return true;
                    },
                    function (response) {
                        if (response.result == 'success') {
                            self.grid.reload();
                            if ($.isFunction(self.callback)) {
                                self.callback();
                            }
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                )
                ;
            })
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initPagingGrid();
        self.initForm();
        self.initEvent();
    }
}

$(function () {
    devAddAccountObj.run();
    devAccountsManageAddAccountObj.run();
});