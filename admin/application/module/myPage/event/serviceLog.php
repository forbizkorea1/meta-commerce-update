<?php
return function () {
    // ServiceLog(서비스 로그) 모듈 이벤트
    $this->event->setTarget('serviceLog')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};