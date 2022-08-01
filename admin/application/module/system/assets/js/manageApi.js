"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devSystemManageApiObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.accessKeyId', 'Access Key ID');
        common.lang.load('grid.label.secretKey', 'Secret Key');
        common.lang.load('grid.label.date', '생성일자');
        common.lang.load('grid.label.status', '상태');
        common.lang.load('grid.label.constructor', '생성자');
        common.lang.load('grid.label.act', '관리');
        common.lang.load('grid.label.memo', '메모');
        common.lang.load('grid.label.act', '사용관리');

        common.lang.load('common.add.success.alert', '새로운 API 인증키가 생성되었습니다.');
        common.lang.load('common.add.duplication.alert', '새로운 인증키를 생성할 수 없습니다.\n(최대 2개까지 생성 가능합니다.)');
        common.lang.load('common.required.confirm.memo', '{메모}는 필수 입력 사항입니다.\n인증키 발급 메모를 입력해주세요.');

        common.lang.load('common.confirm.pause', '선택한 API 인증키의 사용을\n중지 하시겠습니까?');
        common.lang.load('common.confirm.use', '선택한 API 인증키를\n다시 사용 하시겠습니까?');
        common.lang.load('common.confirm.del', '선택한 API 인증키를\n삭제 하시겠습니까?');

        common.lang.load('common.alert.pause', '사용이 중지 되었습니다.');
        common.lang.load('common.alert.use', '사용 전환 되었습니다.');
        common.lang.load('common.alert.del', '삭제 되었습니다.');
    },
    putAccessKey: function(data) {
        var self = devSystemManageApiObj;
        var memoTxt = $('input[name=memo_text]').val();

        if(memoTxt == ''){
            common.noti.alert(common.lang.get('common.required.confirm.memo'));
            return false;
        }
        common.ajax(common.util.getControllerUrl('putAccessKey', 'manageApi', 'system'),
            {
                access_key: data.accessKey,
                secret_key: data.secretKey,
                memo: memoTxt
            },
            function () {
                // 전송전 데이타 검증
                return true;
            },
            function (response) {
                // 전송후 결과 확인
                if (response.result == 'success') {
                    common.noti.alert(common.lang.get('common.add.success.alert'));
                    common.util.modal.close();
                    self.grid.reload();
                } else {
                    common.noti.alert(common.lang.get('common.add.duplication.alert'));
                    common.util.modal.close();
                }
            }
        );

    },
    showAccessKey: function(data) {
        var self = devSystemManageApiObj;
        common.util.modal.open(
            'html',
            '신규 API 인증키 생성',
            self.memoModalTpl(data),
            '',
            function () {
                $('#devSaveBtn').on('click', function(){
                    self.putAccessKey(data);
                });
            },
            {width: '600px', height: '263px'}
        );
    },
    getAccessKey: function() {
        var self = devSystemManageApiObj;

        common.ajax(common.util.getControllerUrl('getAccessKey', 'manageApi', 'system'),
            {},
            function () {
                // 전송전 데이타 검증
                return true;
            },
            function (response) {
                // 전송후 결과 확인
                if (response.result == 'success') {
                    self.showAccessKey(response.data);
                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    detailModalTpl: false,
    memoModalTpl: false,
    initEvent: function (){
        var self = devSystemManageApiObj;
        $('#devTopMenuAddBtn').on('click', function () {
            if (self.memoModalTpl === false) {
                self.memoModalTpl = Handlebars.compile(common.util.getHtml('#devApiKeyModalTpl'));
            }
            common.ajax(common.util.getControllerUrl('getListCount', 'manageApi', 'system'),
                {},
                function () {
                    // 전송전 데이타 검증
                    return true;
                },
                function (response) {
                    // 전송후 결과 확인
                    if (response.data == 'false') {
                        common.noti.alert(common.lang.get('common.add.duplication.alert'));
                        return false;
                    } else {
                        self.getAccessKey();
                    }
                }
            );


        });
    },
    grid: false,
    initPagingGrid: function () {
        var self = devSystemManageApiObj;
        // 그리드 객체 생성
        self.grid = common.ui.grid();
        var grid = self.grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: 0, //열고정
            columns: [
                {key: "access_key", label: common.lang.get('grid.label.accessKeyId'), width: 300, align: 'center'},
                {key: "secret_key", label: common.lang.get('grid.label.secretKey'), width: 150, align: 'center', formatter: function () {
                        return '<input type="button" class="fb-filter__edit devGridData" data-idx="' + this.item.__index + '" value="보기" />';
                    }
                },
                {key: "regdate", label: common.lang.get('grid.label.date'),  width: 150, align: 'center'},
                {key: "status", label: common.lang.get('grid.label.status'),  width: 100, align: 'center', formatter: function (){
                        if (this.value == "Y") {
                            return "사용 중";
                        } else {
                            return "사용 중지";
                        }
                    }},
                {key: "member", label: common.lang.get('grid.label.constructor'), width: 200, align: 'center'},

                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 180, formatter: function () {
                        var html = '';
                        if (this.item.status == "Y") {
                            html = '<input type="button" class="fb-filter__edit devGridDataUseYN" data-idx="' + this.item.__index + '" value="사용 중지" data-status="N" />';
                        } else {
                            html = '<input type="button" class="fb-filter__edit devGridDataUseYN" data-idx="' + this.item.__index + '" value="사용" data-status="Y" /> <input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제"/>';
                        }
                        return html; 
                    }
                },
                {key: "memo", label: common.lang.get('grid.label.memo'), width: 300, align: 'center'}
            ]
        };

        // 그리드 연동
        grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('get', 'manageApi', 'system'))
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                grid.setContent(response.data.list, response.data.paging);
            });

        // 보기
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridData', function () {
            var self = devSystemManageApiObj;

            var row = grid.getRow($(this).data('idx'));

            if (self.detailModalTpl === false) {
                self.detailModalTpl = Handlebars.compile(common.util.getHtml('#devDetailModalTpl'));
            }

            common.util.modal.open(
                'html',
                'Secret Key 확인',
                self.detailModalTpl(row),
                '',
                function () {
                    $('#devConfirmBtn').on('click', function(){
                        common.util.modal.close();
                    });
                },
                {width: '500px', height: '212px'}
            );

        });

        // 사용, 사용 중지
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataUseYN', function () {
            var row = grid.getRow($(this).data('idx'));
            var statusUse = $(this).data('status')
            var confrimMsg = ($(this).data('status') == 'Y' ? common.lang.get('common.confirm.use') : common.lang.get('common.confirm.pause'));
            var alertMsg = ($(this).data('status') == 'Y' ? common.lang.get('common.alert.use') : common.lang.get('common.alert.pause'));

            common.noti.confirm(confrimMsg, function () {
                common.ajax(common.util.getControllerUrl('putStatus', 'manageApi', 'system'),
                    {
                        saak_ix: row.saak_ix,
                        status: statusUse
                    },
                    function () {
                        // 전송전 데이타 검증
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        if (response.result == 'success') {
                            common.noti.alert(alertMsg);
                            self.grid.reload();
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                );
            });

        });

        // 삭제
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = grid.getRow($(this).data('idx'));

            if (common.noti.confirm(common.lang.get('common.confirm.del', {title: row.id}))) {
                common.ajax(common.util.getControllerUrl('del', 'manageApi', 'system'),
                    {saak_ix: row.saak_ix},
                    function () {
                        // 전송전 데이타 검증
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        if (response.result == 'success') {
                            common.noti.alert(common.lang.get('common.alert.del'));
                            self.grid.reload();
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                );
            }
        });

    },
    run: function() {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initPagingGrid();
    }
}

$(function(){
    devSystemManageApiObj.run();
});