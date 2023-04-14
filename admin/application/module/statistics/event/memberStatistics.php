<?php
return function () {
    // MemberStatistics(회원통계) 모듈 이벤트
    $this->event->setTarget('memberStatistics')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};