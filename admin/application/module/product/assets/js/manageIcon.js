"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devProductManageIconObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.icon_name', '뱃지명');
        common.lang.load('grid.label.icon_type', '뱃지 타입');
        common.lang.load('grid.label.icon_text', '뱃지 텍스트');
        common.lang.load('grid.label.icon_src', '뱃지 이미지');
        common.lang.load('grid.label.dispText', '사용유무');
        common.lang.load('grid.label.regdate', '등록일시');
        common.lang.load('grid.label.act', '관리');

        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title}을/를 삭제하시겠습니까?');
    },
    grid: false,
    initGrid: function () {
        var self = this;
        // 그리드 객체 생성
        var grid = common.ui.grid();
        self.grid = grid;
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            columns: [
                {key: "icon_name", label: common.lang.get('grid.label.icon_name'), width: 200},
                {key: "typeText", label: common.lang.get('grid.label.icon_type'), width: 200},
                {key: "icon_text", label: common.lang.get('grid.label.icon_text'), width: 200},
                {
                    key: "icon_src", label: common.lang.get('grid.label.icon_src'), align: 'center', width: 150, formatter: function () {
                        var img = '';
                        if(this.item.icon_type == 'I') {
                            img = '<img src="' + this.value + '" height="30" />';
                        }

                        return img;
                    }
                },
                {key: "dispText", label: common.lang.get('grid.label.dispText'), width: 100, align: 'center'},
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 150, align: 'center'},
                {
                    key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
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
        .setUrl(common.util.getControllerUrl('get', 'manageIcon', 'product'))
        .init(function (response) {
            grid.setContent(response.data.list, response.data.paging);
        });

        //아이콘 타입 선택에 따른 이벤트
        $('#devIconImgArea').hide();
        $('#devIconTxt').on('click', function(){
            $('#devIconTxtArea').show();
            $('#devIconImgArea').hide();
        })
        $('#devIconImg').on('click', function(){
            $('#devIconTxtArea').hide();
            $('#devIconImgArea').show();
        })

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = grid.getRow($(this).data('idx'));
            if(row.icon_type == 'T'){
                $('#devIconTxtArea').show();
                $('#devIconImgArea').hide();
            }else{
                $('#devIconTxtArea').hide();
                $('#devIconImgArea').show();
            }
            self.resetFile(row.icon_src);
            common.form.dataBind($('#devForm'), row);
            $('#devFormReset').show();
        });

        // 삭제
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.icon_name}))) {
                common.ajax(common.util.getControllerUrl('del', 'manageIcon', 'product'),
                    {idx: row.idx},
                    function () {
                        // 전송전 데이타 검증
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        if (response.result == 'success') {
                            common.form.reset($('#devForm'));
                            self.grid.reload();
                            self.resetFile();
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                );
            }
        });
    },
    initform: function () {
        var self = this;

        common.validation.set($('[name="icon_name"]'), {'required': true});

        var $form = $('#devForm');
        common.form.init($form, common.util.getControllerUrl('put', 'manageIcon', 'product'), function (formData, $form) {
            // 전송전 데이타 검증
            if (common.validation.check($form, 'alert', false)) {
                return true;
            } else {
                return false;
            }
            return false;
        }, function (response) {
            // 전송후 결과 확인
            if (response.result == 'success') {
                if (response.data == 'add') {
                    common.noti.alert(common.lang.get('common.add.success.alert'));
                } else {
                    common.noti.alert(common.lang.get('common.put.success.alert'));
                }
                common.form.reset($form);
                self.grid.reload();
                self.resetFile();
            } else {
                common.noti.alert(response.result);
            }
        });

        //초기화 버튼
        $('#devFormReset').click(function () {
            common.form.reset($form);
            self.resetFile();
            $(this).hide();
        });
    },
    file: false,
    initFile: function () {
        var self = this;
        self.file = common.ui.upload('#devFileUpload')
        .addFileBox();
    },
    resetFile: function (url) {
        var self = this;

        self.file.reset();
        if (url) {
            self.file.putFileBox(false, url);
        } else {
            self.file.addFileBox();
        }
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initGrid();
        self.initform();
        self.initFile();
    }
}

$(function () {
    devProductManageIconObj.run();
});