<?php
return function () {
    // Seo(검색엔진 최적화(SEO)) 모듈 이벤트
    $this->event->setTarget('seo')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};