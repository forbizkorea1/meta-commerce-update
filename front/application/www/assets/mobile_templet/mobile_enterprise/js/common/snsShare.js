"use strict";

var snsShare = new function() {
    //속성값 세팅
    this.schema = "";
    this.kakaoKey = '';
    this.kakaoInit = false;
    this.title = document.head.querySelector("meta[property='og:title']").getAttribute('content');
    this.url = document.head.querySelector("meta[property='og:url']").getAttribute('content');
    this.image = document.head.querySelector("meta[property='og:image']").getAttribute('content');

    this.snsUrl = {};
    this.snsUrl['naver'] = "http://share.naver.com/web/shareView.nhn?url=" + encodeURIComponent(this.url) + "&title=" + encodeURIComponent(this.title);
    this.snsUrl['twitter'] = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.title) + ' ' + encodeURIComponent(this.url);
    this.snsUrl['facebook'] = "http://www.facebook.com/share.php?u=" + encodeURIComponent(this.url);
    this.snsUrl['pinterest'] = "http://www.pinterest.com/pin/create/button/?url=" + encodeURIComponent(this.url) + "&media="+ this.image +"&description=" + encodeURIComponent(this.title);
    this.snsUrl['band'] = "http://band.us/plugin/share?body=" + encodeURIComponent(this.title) + "  " + encodeURIComponent(this.url) + "&route=" + encodeURIComponent(this.url);
    this.snsUrl['line'] = "http://line.me/R/msg/text/?" + encodeURIComponent(this.title + "\n" + this.url);
    this.snsUrl['google'] = "https://plus.google.com/share?url=" + encodeURIComponent(this.url) + "&t=" + encodeURIComponent(this.title);

    this.appData = {};
    this.appData['pname'] = this.title;
    this.appData['url'] = this.url;
    this.appData['shotinfo'] = this.description;
    this.appData['img'] = this.image;
    this.appData['sendtype'] = "";

    //SNS 공유 스크립트!
    this.toSNS = function (sns,appType){
        if(appType !=""){
            this.toSNSApp(sns,appType);
        }else{
            this.toSNSWeb(sns);
        }
    }

    //SNS 공유 <웹>
    this.toSNSWeb = function (sns){

        if (sns == "kakaotalk") {
            if (!this.kakaoInit) {
                this.setKakaoInit();
            }
            this.kakaoTalkShare();
        }
        else if (sns == "kakaostory") {
            if (!this.kakaoInit) {
                this.setKakaoInit();
            }
            this.kakaoStoryShare();
        }
        else if (sns == "url-copy") {
            let link = document.location.href;
            let copyText = document.getElementById("Url");
            copyText.value = link;
            alert("URL 복사가 되었습니다.");
            copyText.setAttribute("type", "text");
            copyText.select();
            document.execCommand("Copy");
            // this.copyClip();
            // return false;
        }
        else {
            window.open(this.snsUrl[sns], 'pop', 'menubar=no, status=no, scrollbars=yes, resizable=yes, width=500, height=300, top=50, left=50');
        }
    }

    //SNS 공유 <APP>
    this.toSNSApp = function (sns,appType){
        if(sns == 'kakaotalk') {
            if(appType=='I'){
                document.location.href= this.schema+'://app_type=kakaotalk&app_link='+ encodeURIComponent(this.url) +'&pname='+this.title+ '&img_url=' +encodeURIComponent(this.image);
            }else if(appType=='A'){
                window.JavascriptBridge.setSocialData( this.getAppData(appType) );
                return false;
            }
        }else{
            document.location.href=this.schema+'://share_link_url='+ encodeURIComponent(this.snsUrl[sns]);
        }
    }

    //App 데이터 생성
    this.getAppData = function( appType ){
        this.appData['sendtype'] = appType;
        return JSON.stringify(this.appData);
    }

    //카카오 세팅
    this.setKakaoInit = function (){
        // 사용할 앱의 JavaScript 키를 설정해 주세요
        Kakao.init(this.kakaoKey);
        this.kakaoInit = true;
    }

    // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
    this.kakaoTalkShare = function () {
        Kakao.Link.sendScrap({
            requestUrl: this.url
        });
    }

    //카카오 스토리 공유
    this.kakaoStoryShare = function () {
        Kakao.Story.share({
            url: this.url,
            text: this.title
        });
    }

    //URL 복사
    this.copyClip = function () {
        var IE = (document.all) ? true : false;
        if (IE) {
            window.clipboardData.setData("Text", this.url);
            alert("이 글의 단축url이 클립보드에 복사되었습니다.");
        } else {
            var temp = prompt("이 글의 단축url입니다. Ctrl+C를 눌러 클립보드로 복사하세요", this.url);
        }
    }
};

document.addEventListener("DOMContentLoaded", function(){
    const snsBtn = document.querySelectorAll('button[devSnsShare]');

    for (var i = 0; i < snsBtn.length; i++) {
        snsBtn[i].addEventListener('click', function (event) {
            var snsType = this.getAttribute('devSnsShare');
            var appType = '';

            snsShare.toSNS(snsType, appType);
        });
    }
});
