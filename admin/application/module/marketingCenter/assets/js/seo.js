"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
$('.devUseN .sitemap_use').on('click', function (){
    var $_this = $(this);
    var target = $_this.closest('tr').next('tr').find('td');
    if($_this.val() == 'Y') {
        target.find('.devSitemapInput').hide();
        target.find('.devSitemapText').show();
    } else {
        target.find('.devSitemapText').hide();
        target.find('.devSitemapInput').show();
    }
});

$('.devBtnCopy').on('click', function(){
    var copyValue = $(this).closest('td').find('.devCopyValue').val();
    var copyLast = $(this).closest('td').find('.devCopyLast').text();

    copyToClipboard(copyValue.trim()+copyLast);
    alert('URL이 복사 되었습니다.');
});

function copyToClipboard(val) {
    const t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = val;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
}

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMarketingCenterSeoObj = {
    initLang: function () {
        common.lang.load('common.put.success.alert', '저장 되었습니다.');
        common.lang.load('common.fail.alert', '저장에 실패하였습니다.');
    },
    initForm: function () {
        common.form.init(
            $('#devSeoSettingForm'),
            common.util.getControllerUrl('put', 'seo', 'marketingCenter'),
            function (formData) {
                return formData;
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
        //og:image
        common.ui.upload('#devOgTagImg')
            .init()
            .putFileBox('og_img', $('#devOgTagImg').data('imgSrc'));

        $("#devTopMenuSaveBtn").on('click', function () {

            $("#devSeoSettingForm").submit();

        });
        $("#devTopMenuRobotSaveBtn").on('click', function () {

            $("#devSeoSettingForm").submit();
            common.ajax(common.util.getControllerUrl('set', 'seo', 'marketingCenter'),
                '',
                function (){

                },
                function (){

                }
            );
        });
    },
    run: function() {
        this.initLang();
        this.initForm();
    }
}

$(function(){
    devMarketingCenterSeoObj.run();
});