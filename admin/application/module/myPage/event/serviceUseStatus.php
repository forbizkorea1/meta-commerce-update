<?php
return function () {
    // ServiceUseStatus(서비스 이용 현황) 모듈 이벤트
    $this->event->setTarget('serviceUseStatus')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};