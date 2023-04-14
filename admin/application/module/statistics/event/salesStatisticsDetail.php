<?php
return function () {
    // SalesStatisticsDetail(판매 통계 상세) 모듈 이벤트
    $this->event->setTarget('salesStatisticsDetail')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};