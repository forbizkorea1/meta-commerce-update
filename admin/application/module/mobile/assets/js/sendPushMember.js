"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMobileSendPushMemberObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.gp_name', '그룹');
        common.lang.load('grid.label.name', '이름');
        common.lang.load('grid.label.id', '아이디');
        common.lang.load('grid.label.last', '최근방문일');
        common.lang.load('grid.label.date', '가입일');
        common.lang.load('grid.label.osText', '기종타입');
        common.lang.load('grid.label.isAllowableText', '이벤트/혜택 수신여부');

        common.lang.load('change.no.select.alert', '발송할 회원을 선택해주세요.');
        common.lang.load('push.reservation.success.alert', '예약이 완료되었습니다.');
        common.lang.load('push.send.success.alert', '발송이 완료되었습니다.');
    },
    grid: false,
    initGrid: function () {
        var self = this;
        // 그리드 생성
        self.grid = common.ui.grid();
        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: true,
            columns: [
                {key: "gp_name", label: common.lang.get('grid.label.gp_name'), width: 150},
                {key: "name", label: common.lang.get('grid.label.name'), width: 150},
                {key: "id", label: common.lang.get('grid.label.id'), width: 150},
                {key: "last", label: common.lang.get('grid.label.last'), width: 130, align: "center"},
                {key: "date", label: common.lang.get('grid.label.date'), width: 130, align: "center"},
                {key: "osText", label: common.lang.get('grid.label.osText'), width: 100, align: "center"},
                {
                    key: "isAllowableText",
                    label: common.lang.get('grid.label.isAllowableText'),
                    width: 150,
                    align: "center"
                }
            ]
        };

        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUrl(common.util.getControllerUrl('get', 'sendPushMember', 'mobile'))
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
            });
    },
    initForm: function () {
        var self = this;

        common.validation.set($('#devModifyForm').find('input[name=title], input[name=push_title], textarea[name=contents], input[name=link]'), {required: true});
        common.inputFormat.set($('#devPushTitle'), {'maxLength': 23});
        common.inputFormat.set($('#devPushContent'), {'maxLength': 26});

        common.form.init($('#devModifyForm'), common.util.getControllerUrl('add', 'sendPushMember', 'mobile'),
            function (formData, $form) {
                var codeList = self.grid.getList('selected', ['code']);
                if (!(codeList.length > 0)) {
                    common.noti.alert(common.lang.get('change.no.select.alert'));
                    return false;
                }
                if (!common.validation.check($form, 'alert', false)) {
                    return false;
                }
                formData.push(common.form.makeData('code', codeList));
                return formData;
            },
            function (response) {
                if (response.result == 'success') {
                    if (response.data.send_type == 'R') {
                        common.noti.alert(common.lang.get('push.reservation.success.alert'));
                    } else {
                        common.noti.alert(common.lang.get('push.send.success.alert'));
                    }
                    common.form.reset($('#devModifyForm'));
                    self.pushFileLoader.setColName('pushImage').reset();
                    $('#devSendTypeReservationContents').hide();
                } else {
                    console.log(response);
                }
            }
        );
    },
    initEvent: function () {
        var self = this;

        //달력
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });

        //날짜
        common.ui.datePicker($('#devReservationDate'), {
            timepicker: true
        });

        //초기화
        $('#devFormReset').click(function () {
            common.form.reset($('#devGridForm'));
        });

        //발송 기종 선택
        $('#devModifyForm input[name=send_type]').change(function () {
            if ($(this).val() == 'R') {
                $('#devSendTypeReservationContents').show();
            } else {
                $('#devSendTypeReservationContents').hide();
            }
        });

        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        //폼 서브밋
        $('#devModifyBtn').on('click', function () {
            //if(common.noti.confirm(common.lang.get())) {
            $('#devModifyForm').submit();
            //}
        });

        //이미지
        common.ui.upload('.devPushFileupload')
            .init()
            .putFileBox('pushImage', $('#devForm').find('.devPushFileupload').data('imgSrc'));
    },
    run: function () {
        this.initLang();
        this.initForm();
        this.initGrid();
        this.initEvent()
    }
}

$(function () {
    devMobileSendPushMemberObj.run();
});