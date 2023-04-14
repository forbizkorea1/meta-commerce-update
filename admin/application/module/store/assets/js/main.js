"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
function bannerSlider(target) {
    target.slick({
        dots: false,
        infinite: true,
        arrows: false,
        autoplay: true,
        pauseOnFocus: true,
        pauseOnHover: true,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 1
    });
}

$('#devNoticeTab').find('a').click(function(){
   var btnType = $(this).attr('btn');
   $(this).addClass('tab-menu--active').siblings().removeClass('tab-menu--active');
   $('.notice-list, .noice-more-btn').hide();
   $('#'+btnType+', .noice-more-btn.'+btnType).show();
});
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devStoreMainObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('common.confirm.version.check', '새로운 코어 버전이 출시 되었습니다.\n코어 업데이트 화면으로 이동 하시겠습니까?');
        common.lang.load('metacommerce.server.unofficial', 'META COMMERCE 공식 라이선스를 사용해 주세요.\n비공식 라이선스를 사용할 경우 예고 없이 서비스 이용이 제한될 수 있습니다.');
        common.lang.load('not.enough.free.space', 'Disk 가용 공간이 20% 이하입니다.');
    },
    initEvent: function () {
        // window.onload = function(){
        //     common.noti.alert(common.lang.get('metacommerce.server.unofficial'));
        // };
    },
    initChart: function () {
        var self = this;

        var labels = [];
        var data = [];
        var color = common.util.getChartColor(1);

        $.each(dailySales, function (k, v) {
            labels.push(self.getDayFormatter(v.day));
            data.push(v.price);
        });

        var chart = new Chart($('#devChart'), {
            type: 'line'
            , data: {
                labels: labels
                , datasets: [{
                    label: '매출액'
                    , borderColor: color
                    , backgroundColor: color
                    , data: data
                    , fill: false
                }]
            }, options: {
                legend: {
                    display: false
                },
                animation: {
                    duration: 0 // 그래프 선 에니메니션 끔
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (tooltipItem) {
                            return common.util.numberFormat(tooltipItem.yLabel);
                        }
                    }
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                callback: function (label) {
                                    return common.util.numberFormat(label);
                                }
                            }
                        }
                    ]
                },
                aspectRatio: 4
            }
        });
    },
    getDayFormatter: function (value) {
        return parseInt(value) + '일';
    },
    getLatestPackage: function (){
        var version = $('#devVersion').val();
        var url = "https://updatecentral.meta-commerce.co.kr/getLatestVersion?version=" + version;

        jQuery.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            async: false,
            success: function(results){
                if(results.latestVersion != $('#devVersion').val()) {
                    if(common.noti.confirm(common.lang.get('common.confirm.version.check'))){
                        location.href = '/system/updater';
                    }
                }
            },
            error: function(xhr, status, text){
            }
        });
    },
    initNotice: function () {
        var self = devStoreMainObj;

        self.callNotice('notice', $('#noti'));
    },
    initUpdateNotice: function () {
        var self = devStoreMainObj;

        self.callNotice('updateNotice', $('#update'));
    },
    callNotice: function (type, target) {
        common.ajax(common.util.getControllerUrl('getPortalNotice', 'main', 'store'),
            {type : type},
            function () {
                // 전송전 데이타 검증
                return true;
            },
            function (response) {
                // 전송후 결과 확인
                if (response.result == 'success') {
                    if(response.data.total > 0) {
                        var data = [];
                        for (var i in response.data.list) {
                            var item = response.data.list[i];

                            data.push('<li>');
                            data.push('<a href="' + item.linkUrl + '" target="_blank" title="'+item.bbs_subject+'"> ');
                            data.push('<strong>');
                            data.push(item.bbs_subject);
                            data.push('</strong>');
                            data.push('<span>' + item.reg_date + '</span>');
                            data.push('</a>');
                            data.push('</li>');
                        }

                        target.append(data.join(''));
                    }

                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    getAccountReady: function () {
        common.ajax(common.util.getControllerUrl('get', 'listAccountPlan', 'accounts'),
            {
                'page' : 1
                , 'max': 1000
            },
            function () {
                // 전송전 데이타 검증
                return true;
            },
            function (response) {
                // 전송후 결과 확인
                if (response.result == 'success') {
                    var totalAccount = response.data.totalAccount;
                    $('#devAccountReady').text(common.util.numberFormat(totalAccount));
                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    getRemittanceReady: function () {
        common.ajax(common.util.getControllerUrl('get', 'listRemittanceReady', 'accounts'),
            {
                'page' : 1
                , 'max': 1000
            },
            function () {
                // 전송전 데이타 검증
                return true;
            },
            function (response) {
                // 전송후 결과 확인
                if (response.result == 'success') {
                    var totalAccount = response.data.totalAccount;
                    $('#devRemittanceReady').text(common.util.numberFormat(totalAccount));
                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    getBannerList: function () {
        common.ajax(common.util.getControllerUrl('getBannerList', 'main', 'store'),
            {
            },
            function () {
                // 전송전 데이타 검증
                return true;
            },

            function (response) {
                // 전송후 결과 확인
                if (response.result == 'success') {
                    if(response.data.addService.length > 0) {
                        var data = [];
                        var target = $('#devAddServiceTable');
                        $('#devAddServiceTable > tbody > *').remove();
                        for(var i in response.data.addService) {
                            var item = response.data.addService[i];

                            if(i == 0 || i % 2 == 0) {
                                data.push('<tr>');
                            }

                            data.push('<td>');
                            data.push('<a href="'+item.bd_link+'"> ');
                            data.push('<figure>');
                            //data.push(item.bbs_subject);
                            data.push('<img src="'+item.imgSrc+'" alt="'+item.bd_title+'"/>');
                            data.push('</figure>');
                            data.push('<span>');
                            data.push(item.bd_title);
                            data.push('</span>');
                            data.push('</a>');
                            data.push('</td>');

                            if(i % 2 == 1) {
                                data.push('</tr>');
                            }
                        }
                        target.append(data.join(''));
                    }

                    if(response.data.plugin.length > 0) {
                        var data = [];
                        var target = $('#devPluginTable');
                        $('#devPluginTable > tbody > *').remove();
                        for(var i in response.data.plugin) {
                            var item = response.data.plugin[i];

                            if(i == 0 || i % 2 == 0) {
                                data.push('<tr>');
                            }

                            data.push('<td>');
                            data.push('<a href="'+item.bd_link+'"> ');
                            data.push('<figure>');
                            //data.push(item.bbs_subject);
                            data.push('<img src="'+item.imgSrc+'" alt="'+item.bd_title+'"/>');
                            data.push('</figure>');
                            data.push('<span>');
                            data.push(item.bd_title);
                            data.push('</span>');
                            data.push('</a>');
                            data.push('</td>');

                            if(i % 2 == 1) {
                                data.push('</tr>');
                            }
                        }
                        target.append(data.join(''));
                    }

                    if(response.data.advertising1.length > 0) {
                        for(var i in response.data.advertising1) {
                            var data = [];
                            var item = response.data.advertising1[i];
                            var target = $('#devAdvertising1');

                            data.push('<div><img src="'+item.imgSrc+'" width="100%" title="'+item.bd_title+'"/></div>');

                            target.append(data.join(''));

                        }
                        if(i > 0){
                            bannerSlider(target);
                        }
                    }
                    if(response.data.advertising2.length > 0) {
                        for(var i in response.data.advertising2) {
                            var data = [];
                            var item = response.data.advertising2[i];
                            var target = $('#devAdvertising2');

                            data.push('<div><img src="'+item.imgSrc+'" width="100%" title="'+item.bd_title+'"/></div>');

                            target.append(data.join(''));
                        }
                        if(i > 0){
                            bannerSlider(target);
                        }
                    }
                    if(response.data.advertising3.length > 0) {
                        for(var i in response.data.advertising3) {
                            var data = [];
                            var item = response.data.advertising3[i];
                            var target = $('#devAdvertising3');

                            data.push('<div><img src="'+item.imgSrc+'" width="100%" title="'+item.bd_title+'"/></div>');

                            target.append(data.join(''));
                        }
                        if(i > 0){
                            bannerSlider(target);
                        }
                    }
                    if(response.data.advertising4.length > 0) {
                        for(var i in response.data.advertising4) {
                            var data = [];
                            var item = response.data.advertising4[i];
                            var target = $('#devAdvertising4');

                            data.push('<div><img src="'+item.imgSrc+'" width="100%" title="'+item.bd_title+'"/></div>');

                            target.append(data.join(''));
                        }
                        if(i > 0){
                            bannerSlider(target);
                        }
                    }

                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    diskUnitChk: function () {
        var freeSpace = parseInt(freeDiskSpace);

        if (freeSpace < 21) {
            common.noti.alert(common.lang.get('not.enough.free.space'));
        }
    },
    run: function () {
        var self = this;

        self.initEvent();
        // 그래프
        self.initChart();
        self.initLang();
        if(!demoUse) {
            //self.getLatestPackage();
        }
        self.initNotice();
        self.initUpdateNotice();

        if(devSellerPlugin) {
            self.getAccountReady();//정산예정
            self.getRemittanceReady();//송금대기
        }
        self.getBannerList();//배너가져오기
        self.diskUnitChk();
    }
}

$(function () {
    devStoreMainObj.run();
});