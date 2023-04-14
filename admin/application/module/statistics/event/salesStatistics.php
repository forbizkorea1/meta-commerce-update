<?php
return function () {
    // SalesStatistics(판매 통계) 모듈 이벤트
    $this->event->setTarget('salesStatistics')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};