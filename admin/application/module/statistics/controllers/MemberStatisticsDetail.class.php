<?php

namespace CustomScm\Controller\Statistics;

/**
 * 회원통계 상세
 *
 * @author hoksi
 * @property \CustomScm\Model\Statistics $statisticsModel
 */
class MemberStatisticsDetail extends \ForbizAdminController
{

    public function __construct()
    {
        parent::__construct();
        $this->statisticsModel = $this->import('model.scm.statistics');
    }

    public function index()
    {
        // 타이틀 설정
        $this->setTitle('회원통계 상세');
        $this->setLayout('layout_modal');

        $this->setResponseData('type', $this->input->post('type'));
        $this->setResponseData('type_value', $this->input->post('type_value'));
        $this->setResponseData('startDate', $this->input->post('startDate'));
        $this->setResponseData('endDate', $this->input->post('endDate'));
    }

    public function get()
    {
        $chkField = ['startDate', 'endDate','type'];

        if (form_validation($chkField)) {


            $ret = $this->statisticsModel->getStatisticsMemDetailList($this->input->post());

            $this->setResponseResult('success')->setResponseData($ret);
        } else {
            $this->setResponseResult('fail')->setResponseData(validation_errors());
        }
    }
}