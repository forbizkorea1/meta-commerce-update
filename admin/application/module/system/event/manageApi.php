<?php
return function () {
    // ManageApi(API인증키 관리) 모듈 이벤트
    $this->event->setTarget('manageApi')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};