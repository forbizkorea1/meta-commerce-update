<?php
return function () {
    // ExcelDown(엑셀다운로드) 모듈 이벤트
    $this->event->setTarget('excelDown')->on('default', function($e){
        // 이벤트 발생시 처리할 내용
    });
};