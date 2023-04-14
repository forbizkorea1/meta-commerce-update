<?php
return function () {
    // PayMethodStatistics(결제수단별 판매통계) 모듈 이벤트
    $this->event->setTarget('payMethodStatistics')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};