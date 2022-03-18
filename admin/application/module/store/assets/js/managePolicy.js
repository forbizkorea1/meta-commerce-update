"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreManagePolicyObj = {
    grid: false,
    editor: false,
    initLang: function () {
        // 글로벌 언어셋 설정

        common.lang.load('grid.label.pi_ix', '시스템코드');
        common.lang.load('grid.label.regdate', '등록일');
        common.lang.load('grid.label.startdate', '약관실행일자');
        common.lang.load('grid.label.moddate', '수정일');
        common.lang.load('grid.label.moddate', '수정일자');
        common.lang.load('grid.label.reg_name', '등록자');
        common.lang.load('grid.label.mod_name', '수정자');

        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.put.error.alert', '에러가 발생 하였습니다.');
        common.lang.load('grid.label.act', '관리');
    },
    initEvent: function () {
        var self = this;
        self.editor = common.ui.editor('devEditor')
                .setSubType('test')
                .setHeight('500px')
                .init();
        $("#devTap > li > a").on('click', function (){
            var tabId = $(this).attr('href');
            $(tabId).find('.fb__tap__menu:first a').click();
        });
    },
    clickSubTap: function () {
        var self = this;
        $(".devSubTap a").on('click', function (e) {
            $("li.fb__tap__menu.devSubTap a.fb__tap__menu--active").each(function () {
                $(this).removeClass('fb__tap__menu--active');
            });
            $(this).addClass('fb__tap__menu--active');
            $("input[name=mode]").val('update');
            $("input[name=pi_code]").val($(this).attr('item')); //모드에 id 값으로 넣어줌            
            self.grid.getPage(1);
            e.preventDefault();
        });
    },
    initOnLoadEvent: function () {
        var self = this;
        $("#devTap > li:first-child > a").click();

        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: false
        });
    },
    initSelectBox: function () {
    },
    initTab: function () {
        common.ui.tap($('#devTap'));
    },
    initForm: function () {
        var self = this;
        $(".devSave").on('click', function () {
            $("#devManagePolicyForm").submit();
        });

        common.form.init(
                $('#devManagePolicyForm'),
                common.util.getControllerUrl('put', 'managePolicy', 'store'),
                function (formData) {
                    return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        if (!$("[name=pi_ix]").val() || $("[name=pi_ix]").val() == 0) {
                            common.noti.alert(common.lang.get('common.add.success.alert'));
                        } else {
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                        }
                        self.grid.reload();

                    } else {
                        common.noti.alert(common.lang.get('common.put.error.alert'));
                    }
                }
        );

    },
    initPagingGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.grid = common.ui.grid();
        // 그리드 설정

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [

                {key: "reg_name", label: common.lang.get('grid.label.reg_name'), width: 150, align: "center"},
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 150, align: "center"},
                {key: "startdate", label: common.lang.get('grid.label.startdate'), width: 150, align: "center"},
                {key: "mod_name", label: common.lang.get('grid.label.mod_name'), width: 200, align: "center"},
                {key: "moddate", label: common.lang.get('grid.label.moddate'), width: 200, align: "center"},

                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />'

                        ].join('');
                    }
                }

            ]
        };
        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
                .setForm('#devGridForm')
                .setPagination('#devPageWrap')
                .setPageNum('#devPageNum')
                .setUseHash(false)
                .setUrl(common.util.getControllerUrl('get', 'managePolicy', 'store'))
                .init(function (response) {
                    $('#devTotal').text(common.util.numberFormat(response.data.total));
                    if (response.data.list[0]) {
                        common.form.dataBind($('#devManagePolicyForm'), response.data.list[0]);
                        $("input[name=mode]").val('update');
                        self.editor.setData(response.data.list[0].pi_contents);
                    } else {
                        $('#devFormReset').click();
                        $("input[name=mode]").val('insert');
                    }
                    self.grid.setContent(response.data.list, response.data.paging);

                });
        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.grid.getRow($(this).data('idx'));

            common.form.dataBind($('#devManagePolicyForm'), row);
            self.editor.setData(row.pi_contents);
            $('#devFormReset').show();
        });

        //초기화
        $('#devFormReset').click(function (e) {
            common.form.reset($('#devManagePolicyForm'));
            $("input[name=mode]").val('insert');
            self.editor.setData("");
        });


    },
    run: function () {
        //기본 이벤트 로드
        this.initEvent();
        //탭 관련 로드
        this.initTab();
        //공통 언어 설정
        this.initLang();
        //페이지네이션형 그리드 
        this.initPagingGrid();
        //기본폼
        this.initForm();
        this.clickSubTap();
        this.initOnLoadEvent();

    }
}

$(function () {
    devStoreManagePolicyObj.run();
});