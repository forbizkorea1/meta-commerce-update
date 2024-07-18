"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMemberManageMemberMileageObj = {
    initLang: function () {
        common.lang.load('grid.label.oid', '주문번호');
        common.lang.load('grid.label.name', '회원명');
        common.lang.load('grid.label.id', '아이디');
        common.lang.load('grid.label.gp_name', '회원그룹');
        common.lang.load('grid.label.message', '적립내용');
        common.lang.load('grid.label.ml_mileage', '마일리지');
        common.lang.load('grid.label.ml_state_text', '적립상태');
        common.lang.load('grid.label.date', '처리일자');

        common.lang.load('grid.label.act', '관리');

        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.put.error.alert', '수정을 실패하였습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
    },
    initEvent: function () {
        var self = this;
        $("#devMemPopSave").on("click", function (){
           $("#devMemPopForm").submit();
           return false;
        });
    },
    initForm: function () {
        var self = this;
        common.form.init(
                $('#devMemPopForm'),
                common.util.getControllerUrl('put', 'manageMemberMileage', 'member'),
                function (formData) {
                    self.checkValidation();
                    if (common.validation.check($('#devMemPopForm'), 'alert', false)) {
                        return formData;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                        self.grid.reload();
                    } else {
                        common.noti.alert(common.lang.get('common.put.error.alert'));
                    }
                }
        );
    },
    checkValidation: function () {
        var self = this;

        common.validation.set($('[name=etc]'), {'required': true});
        common.validation.set($('[name=reserve]'), {'required': true});
    },
    grid: false,
    initPagingGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.grid = common.ui.grid();

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [
                {key: "date", label: common.lang.get('grid.label.date'), width: 100, align: "center"},
                {key: "message", label: common.lang.get('grid.label.message'), width: '*', align: "left"},
                {key: "ml_mileage", label: common.lang.get('grid.label.ml_mileage'), width: 100, align: "right"},
                {key: "ml_state_text", label: common.lang.get('grid.label.ml_state_text'), width: 100, align: "center"},
                {key: "oid", label: common.lang.get('grid.label.oid'), width: 150, align: "left"}                
            ]
        };
        // 그리드 연동
        self.grid.setGrid($('#devMemPopPagingGrid'), gridConfig)
                .setForm('#devMemPopGridForm')
                .setPagination('#devMemPopPageWrap')
                .setPageNum('#devMemPopPageNum')
                .setUseHash(false)
                .setUrl(common.util.getControllerUrl('get', 'listMileage', 'member'))
                .init(function (response) {                    
                    $('#devTotalSumMileage').text(common.util.numberFormat(response.data.total));
                    self.grid.setContent(response.data.list, response.data.paging);
                });
        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        //초기화
        $('#devMemPopReSet').click(function (e) {
            common.form.reset($('#devMemPopForm'));
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();        
        self.initForm();
        self.initPagingGrid();
    }
}

$(function(){
    devMemberManageMemberMileageObj.run();
});