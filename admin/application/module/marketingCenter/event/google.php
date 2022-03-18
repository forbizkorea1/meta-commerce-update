<?php
return function () {
    // Google(구글 마케팅) 모듈 이벤트
    $this->event->setTarget('google')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};