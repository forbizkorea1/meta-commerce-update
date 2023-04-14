<?php
return function () {
    // RefundStatistics(환불통계) 모듈 이벤트
    $this->event->setTarget('refundStatistics')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};