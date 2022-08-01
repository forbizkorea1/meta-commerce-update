"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreListAdminMemberObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.name', '사용자명');
        common.lang.load('grid.label.id', '아이디');
        common.lang.load('grid.label.templateAuth', '권한템플릿');
        common.lang.load('grid.label.isMD', 'MD여부');
        common.lang.load('grid.label.mail', '이메일');
        common.lang.load('grid.label.pcs', '휴대폰 번호');
        common.lang.load('grid.label.date', '등록일시');
        
        common.lang.load('grid.label.act', '사용관리');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '관리자 계정 {title} 삭제 시, 해당 계정으로 즉시 로그인이 불가합니다. 계속 진행하시겠습니까?');
        common.lang.load('common.reset.password', '{title}의 비밀번호를 초기화하시겠습니까?');
        common.lang.load('common.reset.password.success', '비밀번호를 초기화가 완료되었습니다.');
        common.lang.load('common.reset.password.fail', '비밀번호를 초기화가 실패하였습니다.');
    },
    initEvent: function (){
        
    },
    initSearchForm: function () {
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: false
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
            , timepicker: false
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            timepicker: false
            , startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });
    },
    grid: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.grid = common.ui.grid();
        var grid = self.grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: 0, //열고정
            columns: [
                {key: "name", label: common.lang.get('grid.label.name'), width: 200, align: 'left'},
                {key: "id", label: common.lang.get('grid.label.id'), width: 200, align: 'left'},
                {key: "templateAuth", label: common.lang.get('grid.label.templateAuth'),  width: 150, align: 'left'},
                {key: "mem_div", label: common.lang.get('grid.label.isMD'),  width: 100, align: 'center', formatter: function () {
                        if (this.value == "MD") {
                            return "O";
                        } else {
                            return "X";
                        }
                    }},
                {key: "mail", label: common.lang.get('grid.label.mail'), width: 250, align: 'left'},
                {key: "pcs", label: common.lang.get('grid.label.pcs'), width: 200, align: 'center'},
                {key: "date", label: common.lang.get('grid.label.date'), width: 200, align: 'center'},
                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 180, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> '
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        grid.setGrid($('#devPagingGrid'), gridConfig)
                .setForm('#devGridForm')
                .setPagination('#devPageWrap')
                .setPageNum('#devPageNum')
                .setUseHash(false)
                .setUrl(common.util.getControllerUrl('getAdminGroup', 'listAdminMember', 'store'))
                .init(function (response) {
                    $('#devTotal').text(common.util.numberFormat(response.data.total));
                    grid.setContent(response.data.list, response.data.paging);
                });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = grid.getRow($(this).data('idx'));
            
            common.util.getControllerUrl('index', 'manageAdminMember', 'store');
            document.location.href = '/store/manageAdminMember/'+row.code;
        });

        // 삭제
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.id}))) {
                common.ajax(common.util.getControllerUrl('delAdminGroupUser', 'listAdminMember', 'store'),
                        {code: row.code},
                        function () {
                            // 전송전 데이타 검증
                            return true;
                        },
                        function (response) {
                            // 전송후 결과 확인
                            if (response.result == 'success') {
                                self.grid.reload();
                            } else {
                                common.noti.alert(response.result);
                            }
                        }
                );
            }
        });

        //초기화
        $('.devReset').click(function (e) {
            common.form.reset($('#devGridForm'));
            self.grid.reload();
        });
    },
    run: function() {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initPagingGrid();
        self.initSearchForm();
    }
}

$(function(){
    devStoreListAdminMemberObj.run();
});