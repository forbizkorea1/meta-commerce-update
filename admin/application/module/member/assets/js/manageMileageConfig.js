"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMemberManageMileageConfigObj = {
    initLang: function () {
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');

        common.lang.load('common.put.fail.add.rate.alert', '추가적립 사용의 마일리지를 입력해주세요.');
        common.lang.load('common.put.fail.use.number.alert', '마일리지에는 숫자를 입력해주세요.');
        common.lang.load('common.put.fail.use.max.won.alert', '정액(원) 제한 | 1회 결제 시 최대 마일리지를 입력해주세요.');
        common.lang.load('common.put.fail.use.max.rate.alert', '정액(%) 제한 | 1회 결제 시 상품구매 합계액의 %를 입력해주세요.');
    },
    changeMileageType: function (type) {
        if (type == 'S') {
            $(".mileage_info_use_s").show();
            $(".mileage_info_use_p").hide();
            $(".mileage_info_use_g").hide();
            $("#pulsMileage").show();
        } else if (type == 'P') {
            $(".mileage_info_use_s").hide();
            $(".mileage_info_use_p").show();
            $(".mileage_info_use_g").hide();
            $("#pulsMileage").show();
        } else if (type == 'G') {
            $(".mileage_info_use_s").hide();
            $(".mileage_info_use_p").hide();
            $(".mileage_info_use_g").show();
            $("#pulsMileage").show();
        }
    },
    initEvent: function () {
        var self = this;
        $("#devTopMenuSaveBtn").on("click", function () {
            $("#devForm").submit();
            return false;
        });

        self.changeMileageType($("[name=mileage_info_use]:checked").val());
        $("[name=mileage_info_use]").on("click", function () {
            self.changeMileageType($(this).val());
        });
    },
    initForm: function () {
        var self = this;
        common.inputFormat.set($('[name="mileage_rate[common]"]'), {'number': true});
        common.inputFormat.set($('[name="join_rate"]'), {'number': true});
        common.inputFormat.set($('[name="mileage_rate[p]"]'), {'number': true});
        common.inputFormat.set($('[name="mileage_rate[m]"]'), {'number': true});
        common.inputFormat.set($('#mileage_rate_9, #mileage_rate_8, #mileage_rate_7, #mileage_rate_4'), {'number': true});
        common.inputFormat.set($('[name="use_mileage_max"]'), {'number': true});
        common.inputFormat.set($('[name="max_goods_sum_rate"]'), {'number': true});


        common.form.init(
                $('#devForm'),
                common.util.getControllerUrl('put', 'manageMileageConfig', 'member'),
                function (formData) {
                    return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.put.error.alert'));
                    }
                }
        );
    },

    initSelectBox: function () {
        $("select[name=use_unit]").val($("select[name=use_unit]").attr('item')).prop("selected", true);
        $("select[name=cancel_year]").val($("select[name=cancel_year]").attr('item')).prop("selected", true);
        $("select[name=cancel_month]").val($("select[name=cancel_month]").attr('item')).prop("selected", true);
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initForm();
        self.initSelectBox();
    }

}

$(function () {
    devMemberManageMileageConfigObj.run();
});