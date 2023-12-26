"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreManageMallConfigObj = {
    initEvent: function () {
        var self = this;

        // 추가 결제 모듈 선택
        $('.devAddSattleModule').click(function () {
            var $this = $(this);
            var $target = $('.devAddSattleModuleConfig[data-pg=' + $this.data('pg') + ']');
            if ($this.is(':checked')) {
                $target.show();
            } else {
                $target.hide();
            }
        });

        // 굿스플로 모듈 선택
        $('.devGoodsFlowUseType').click(function () {
            var $this = $(this);
            var $target = $('.devGoodsflowConfig');
            if ($this.val() == 'Y') {
                $target.show();
            } else {
                $target.hide();
            }
        });

        // 톡톡 서비스 사용
        $('input[name=talktalk_use_type]').click(function () {
            var $this = $(this);
            var $target = $('.talktalkUseConfig');
            if ($this.val() == 'Y') {
                $target.show();
            } else {
                $target.hide();
            }
        });

        // 해피톡 서비스 사용
        $('input[name=happyTalk_use_type]').click(function () {
            var $this = $(this);
            var $target = $('.happyTalkUseConfig');
            if ($this.val() == 'Y') {
                $target.show();
            } else {
                $target.hide();
            }
        });

        // 친구톡 서비스 사용
        $('input[name=friendTalk_use_type]').click(function () {
            var $this = $(this);
            var $target = $('.friendTalkUseConfig');
            if ($this.val() == 'Y') {
                $target.show();
            } else {
                $target.hide();
            }
        });

        // 크리마 서비스 사용
        $('input[name=crema_use_type]').click(function () {
            var $this = $(this);
            var $target = $('.cremaUseConfig');
            if ($this.val() == 'Y') {
                $target.show();
            } else {
                $target.hide();
            }
        });
        
        // 간편 로그인 모듈 선택
        $('.devAddSnsSimpleLogin').click(function () {
            var $this = $(this);

            var $target = $('.devSnsSimpleLoginModuleConfig[data-login=' + $this.data('login') + ']');
            if ($this.is(':checked')) {
                $target.show();
            } else {
                $target.hide();
            }
        });
    },
    initLang: function () {
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.fail.alert', '저장에 실패하였습니다.');
    },
    initForm: function () {
        common.validation.set($('[name=mall_dc_interval]'), {'required': true});
        common.validation.set($('[name=mall_cc_interval]'), {'required': true});
        common.validation.set($('[name=cart_delete_day]'), {'required': true});
        common.validation.set($('[name=cancel_auto_day]'), {'required': true});
        common.validation.set($('[name=check_order_day]'), {'required': true});
        common.validation.set($('[name=mall_name]'), {'required': true});

        common.form.init(
                $('#devManagerConfigForm'),
                common.util.getControllerUrl('put', 'manageMallConfig', 'store'),
                function (formData) {
                    if (common.validation.check($('#devManagerConfigForm'), 'alert', false)) {
                        return formData;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                        window.location.reload();
                    } else {
                        common.noti.alert(common.lang.get('common.fail.alert'));
                    }
                }
        );

        //쇼핑몰로고
        common.ui.upload('#devShopLogo')
                .init()
                .putFileBox('devShopLogo', $('#devShopLogo').data('imgSrc'));
        //모바일로고
        common.ui.upload('#devMobileLogo')
                .init()
                .putFileBox('devMobileLogo', $('#devMobileLogo').data('imgSrc'));
        //이메일로고
        common.ui.upload('#devMailLogo')
                .init()
                .putFileBox('devMailLogo', $('#devMailLogo').data('imgSrc'));
        //파비콘
        common.ui.upload('#devFavicon')
                .init()
                .putFileBox('devFavicon', $('#devFavicon').data('imgSrc'));
        //파비콘 PNG
        common.ui.upload('#devFaviconPng')
                .init()
                .putFileBox('devFaviconPng', $('#devFaviconPng').data('imgSrc'));
        $('.fb__file__btn--view').hide();
        $("#devTopMenuSaveBtn").on('click', function () {

            //sns 간편로그인 설정, 추가 결제모듈 체크박스 처리
            $('.devAddSnsSimpleLogin, .devAddSattleModule').each(function(){
                if(!$(this).is(':checked')) {
                    $(this).val('N');
                    $(this).prop('checked', true);
                }else {
                    $(this).val('Y');
                }
            });

            $("#devManagerConfigForm").submit();

            //submit 후 원상태로 처리함. reload할 경우 간헐적으로 alert 뜨지않고 저장 안 되는 상황 발생.
            $('.devAddSnsSimpleLogin, .devAddSattleModule').each(function(){
                if($(this).val() == 'N') {
                    $(this).prop('checked', false).removeAttr('checked');
                    $(this).val('Y');
                }
            });
        });
    },
    run: function () {
        this.initLang();
        this.initEvent();
        this.initForm();
    }
}

$(function () {
    devStoreManageMallConfigObj.run();
});