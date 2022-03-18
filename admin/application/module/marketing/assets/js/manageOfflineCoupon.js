"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMarketingManageOfflineCouponObj = {
    mode: false,
    initLang: function () {
        common.lang.load('common.add.success.alert', '등록이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');

        common.lang.load('offline.noti.cuponName', '쿠폰 이름을 입력해주세요.');
        common.lang.load('offline.noti.serial', '시리얼넘버를 입력해주세요.');
        common.lang.load('offline.noti.createCnt', '생성 개수를 입력해주세요.');
        common.lang.load('offline.noti.giftAmount', '마일리지 지급 금액을 입력해주세요.');
        common.lang.load('offline.noti.cuponSelect', '지급 쿠폰 목록을 선택해주세요.');
    },
    initForm: function () {
        var self = this;
        self.mode = $('#devMode').val();

        common.form.init(
            $('#devForm'),
            common.util.getControllerUrl(self.mode, 'manageOfflineCoupon', 'marketing'),
            function (formData, $form) {
                if (!common.validation.check($form, 'alert', false)) {
                    return false;
                }
                return formData;
            },
            function (response) {
                if (response.result == 'success') {
                    if (self.mode == 'put') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.add.success.alert'));
                    }
                    location.href = "/marketing/listOfflineCoupon";
                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    selectTpl: false,
    initEvent: function () {
        var self = this;

        //발급 방식 선택시
        $('input[name=gift_type]').change(function () {
            if ($('input[name=gift_type]:checked').val() == 'R') {
                $('.devIssueTypeContentsCc').show();
                $('.devIssueTypeContentsGa').show();
                $('.devIssueTypeContentsAp').hide();

                $('select[name=gift_way]').empty();
                $('input[name=gift_prefix_code]').show();
                var option = $("<option value='1'>수동</option>");
                $('select[name=gift_way]').append(option)
                var option = $("<option value='2'>자동</option>");
                $('select[name=gift_way]').append(option);
            } else if ($('input[name=gift_type]:checked').val() == 'C') {
                $('.devIssueTypeContentsCc').show();
                $('.devIssueTypeContentsGa').hide();
                $('.devIssueTypeContentsAp').show();

                $('select[name=gift_way]').empty();
                $('input[name=gift_prefix_code]').show();
                var option = $("<option value='1'>수동</option>");
                $('select[name=gift_way]').append(option)
                var option = $("<option value='2'>자동</option>");
                $('select[name=gift_way]').append(option);
            } else if ($('input[name=gift_type]:checked').val() == 'U') {
                $('.devIssueTypeContentsCc').hide();
                $('.devIssueTypeContentsGa').hide();
                $('.devIssueTypeContentsAp').show();
                $('.devInfoText').hide();

                $('select[name=gift_way]').empty();
                $('input[name=gift_prefix_code]').hide();
                var option = $("<option value='2'>자동</option>");
                $('select[name=gift_way]').append(option);
            }
        });

        //시리얼 넘버생성 방법 선택 시
        $('select[name=gift_way]').change(function () {
            if ($('select[name=gift_way] option:selected').val() == 1) {
                $('input[name=gift_prefix_code]').show();
            } else {
                $('input[name=gift_prefix_code]').hide();
            }
        });

        //사용기간 날짜 설정
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: false
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
            , timepicker: false
        });
        common.ui.quickDate('+', $('#devQuickBetweenDate'), {
            timepicker: false
            , startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });

        //저장
        $("#devTopMenuSaveBtn").on('click', function (e) {
            e.preventDefault();

            var cuponName = $("input[name=gift_certificate_name]").val().length;
            var createCnt = $("input[name=create_cnt]").val().length;
            var giftAmount = $("input[name=gift_amount]").val().length;
            var cuponSelect = $('[name="appoint_publish_ix[]"] option:selected').val().length;

            //쿠폰 이름 체크
            if (cuponName == 0) {
                common.noti.alert(common.lang.get('offline.noti.cuponName'));
                return false;
            }

            //시리얼넘버 체크
            if ($("select[name=gift_way]").val() == 1 && $("input[name=gift_prefix_code]").val() == "") {
                common.noti.alert(common.lang.get('offline.noti.serial'));
                return false;
            }

            if ($('[name=gift_type]:checked').val() == 'R') { //마일리지 지급 상품권 체크시
                //생성 개수 체크
                if (createCnt == 0) {
                    common.noti.alert(common.lang.get('offline.noti.createCnt'));
                    return false;
                }

                //마일리지 지급 금액 체크
                if (giftAmount == 0) {
                    common.noti.alert(common.lang.get('offline.noti.giftAmount'));
                    return false;
                }
            } else if ($('[name=gift_type]:checked').val() == 'C') { //쿠폰 지급 상품권(랜덤 시리얼 넘버) 체크시
                //생성 개수 체크
                if (createCnt == 0) {
                    common.noti.alert(common.lang.get('offline.noti.createCnt'));
                    return false;
                }

                //지급 쿠폰 목록 체크
                if (cuponSelect == 0) {
                    common.noti.alert(common.lang.get('offline.noti.cuponSelect'));
                    return false;
                }
            } else if ($('[name=gift_type]:checked').val() == 'U') { //쿠폰 지급 상품권(동일 시리얼 넘버) 체크시
                //지급 쿠폰 목록 체크
                if (cuponSelect == 0) {
                    common.noti.alert(common.lang.get('offline.noti.cuponSelect'));
                    return false;
                }
            }

            $("#devForm").submit();
        });

        self.groupTpl = Handlebars.compile(common.util.getHtml('#devSelectGroupTpl'));

        //그룹 추가
        $(".devSelectGroupAddBtn").on('click', function (e) {
            e.preventDefault();
            self.appendGroupTemplate({});
        });

        //그룹 삭제
        $(document).on('click', '.devSelectGroupDelBtn', function (e) {
            e.preventDefault();
            $(this).closest('.devGroupSection').remove();
            self.groupCode--;
        });
    },
    groupTpl: false,
    appendGroupTemplate: function (data) {
        var self = this;

        var groupCode = self.groupCode++;
        data['group_code'] = groupCode;

        //템플릿 추가
        var $targetGroup = $(self.groupTpl(data));
        $('#devGroupContents').append($targetGroup);
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initForm();
    }
}

$(function () {
    devMarketingManageOfflineCouponObj.run();
});