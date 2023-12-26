<?php

namespace CustomScm\Controller\Member;

class ListMember extends \ForbizScm\Controller\Member\ListMember
{

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 엑셀다운로드
     */
    public function dwn()
    {
        /* @var $memberModel \CustomScm\Model\Member\Member */
        $memberModel = $this->import('model.scm.member.member');

        /* @var $excel \ForbizExcel */
        $excel = $this->import('lib.excel');

        if($this->input->post('password')){
            $excel->setPassword($this->input->post('password'));
        }

        $data = $memberModel->getList(
            1, $excel->getMaxRow(), $this->input->post()
        );

        // 엑셀파일명 설정 및 히스토리 기록
        $excelFileName = $this->import('model.scm.util.excelDwnHistory')->setMessage($this->input->post('message'))->getExcelFileName();

        // Excel file download
        $excel->setTitle([
            'memTypeTextDiv' => '회원구분(타입)'
            , 'gp_name' => '회원그룹'
            , 'authorized' => '승인여부'
            , 'name' => '이름'
            , 'id' => '아이디'
            , 'mail' => '이메일'
            , 'last' => '최근방문일'
            , 'visit' => '로그인 횟수'
            , 'mileage' => '마일리지'
        ])
            ->setData($data['list'])
            ->download($excelFileName);
    }
}