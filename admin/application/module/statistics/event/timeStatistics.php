<?php
return function () {
    // TimeStatistics(시간대별 판매통계) 모듈 이벤트
    $this->event->setTarget('timeStatistics')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};