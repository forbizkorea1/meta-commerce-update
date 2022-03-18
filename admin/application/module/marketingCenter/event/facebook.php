<?php
return function () {
    // Facebook(패이스북 마케팅) 모듈 이벤트
    $this->event->setTarget('facebook')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};