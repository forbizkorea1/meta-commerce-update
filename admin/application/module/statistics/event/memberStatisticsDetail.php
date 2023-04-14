<?php
return function () {
    // MemberStatisticsDetail(회원통계 상세) 모듈 이벤트
    $this->event->setTarget('memberStatisticsDetail')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};