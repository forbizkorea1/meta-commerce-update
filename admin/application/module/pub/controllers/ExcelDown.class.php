<?php

namespace CustomScm\Controller\Pub;

/**
 * 엑셀다운로드
 *
 * @author hoksi
 */
class ExcelDown extends \ForbizAdminController
{

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        // 타이틀 설정
        $this->setTitle('엑셀다운로드');
        $this->setLayout('layout_modal');
    }
}