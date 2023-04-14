<?php
return function () {
    // RefundStatisticsDetail(환불통계 상세) 모듈 이벤트
    $this->event->setTarget('refundStatisticsDetail')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};