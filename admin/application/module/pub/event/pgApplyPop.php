<?php
return function () {
    // PgApplyPop(PG 신청 내역) 모듈 이벤트
    $this->event->setTarget('pgApplyPop')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};