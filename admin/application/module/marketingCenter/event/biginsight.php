<?php
return function () {
    // Biginsight(빅인사이트) 모듈 이벤트
    $this->event->setTarget('biginsight')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};