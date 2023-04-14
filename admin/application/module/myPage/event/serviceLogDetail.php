<?php
return function () {
    // ServiceLogDetail(서비스 로그 상세) 모듈 이벤트
    $this->event->setTarget('serviceLogDetail')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};