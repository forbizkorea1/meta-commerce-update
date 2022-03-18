<?php
return function () {
    // ChangePasswd(비밀번호 변경) 모듈 이벤트
    $this->event->setTarget('changePasswd')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};