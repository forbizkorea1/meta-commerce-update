<?php

namespace CustomScm\Controller\Statistics;

/**
 * 회원통계
 *
 * @author hoksi
 * @property \CustomScm\Model\Statistics $statisticsModel
 */
class MemberStatistics extends \ForbizAdminController
{

    public function __construct()
    {
        parent::__construct();
        $this->statisticsModel = $this->import('model.scm.statistics');
    }

    public function index($div=false)
    {
        // 타이틀 설정
        if($div == 'new'){
            $this->setTitle('신규회원 통계');
        }else{
            $this->setTitle('회원통계');
        }

        $startDate = date('Y-m-d', strtotime('-2 weeks'));
        $endDate = date('Y-m-d', strtotime('-1 day'));
        $this->setResponseData('startDate', $startDate);
        $this->setResponseData('endDate', $endDate);
        $this->setResponseData('basicDate', date('Y-m-d', strtotime('-1 day')));
        $this->define('devStatisticsTop', '/subConfig/devStatisticsTop');



        $this->setResponseData('typeArr',$this->statisticsModel->getStatisticsMemType());
        $this->setResponseData('stDiv',$div);
    }

    public function get()
    {
        if($this->input->post('st_div') == 'all'){
            $chkField = ['type','st_div'];
        }else if($this->input->post('st_div') == 'new'){
            $chkField = ['startDate','endDate','type','st_div'];
        }else{
            $chkField = ['startDate','endDate','st_div'];
        }


        if (form_validation($chkField)) {

            $div = $this->input->post('st_div');
            if($div == 'all'){
                $ret = $this->statisticsModel->getStatisticsMemListAll($this->input->post());
            }else if($div == 'drop'){
                $ret = $this->statisticsModel->getStatisticsMemListDrop($this->input->post());
            }else if($div == 'sleep'){
                $ret = $this->statisticsModel->getStatisticsMemListSleep($this->input->post());
            }else{
                $ret = $this->statisticsModel->getStatisticsMemList($this->input->post());
            }


            $this->setResponseResult('success')->setResponseData($ret);
        } else {
            $this->setResponseResult('fail')->setResponseData(validation_errors());
        }
    }


    public function dwnAsync()
    {
        // 입력 필수 항목
        if($this->input->post('st_div') == 'all'){
            $chkField = ['type','st_div'];
        }else if($this->input->post('st_div') == 'new'){
            $chkField = ['startDate','endDate','type','st_div'];
        }else{
            $chkField = ['startDate','endDate','st_div'];
        }
        // 필수 항목 점검
        if (form_validation($chkField)) {



            /* @var $excel \ForbizExcel */
            $excel = $this->import('lib.excel');


            // 엑셀파일명 설정 및 히스토리 기록
            $excelFileName = $this->import('model.scm.util.excelDwnHistory')->getExcelFileName();

            $asyncData = array(
                'pageName' => 'memberStatistics'
            ,'user_code' => $this->adminInfo->charger_ix
            ,'excelFileName' => $excelFileName
            );
            $asyncData = array_merge($asyncData,$this->input->post());

            $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('R',$excelFileName,$this->adminInfo->charger_ix);

            $excel->putAsyncExcelDown($asyncData);

        } else {
            show_error(validation_errors());
        }
    }

    public function dwn()
    {

        // 입력 필수 항목
        if($this->input->post('st_div') == 'all'){
            $chkField = ['type','st_div'];
        }else if($this->input->post('st_div') == 'new'){
            $chkField = ['startDate','endDate','type','st_div'];
        }else{
            $chkField = ['startDate','endDate','st_div'];
        }
        // 필수 항목 점검
        if (form_validation($chkField)) {
            /* @var $excel \ForbizExcel */
            $excel = $this->import('lib.excel');

            /* @var $excelDwnHistoryModel \CustomScm\Model\Util\excelDwnHistory */
            $excelDwnHistoryModel = $this->import('model.scm.util.excelDwnHistory');
            $excelDwnHistoryModel->setDownloadType('excel');

            $div = $this->input->post('st_div');
            if($div == 'all'){
                $data = $this->statisticsModel->getStatisticsMemListAll($this->input->post());
            }else if($div == 'drop'){
                $data = $this->statisticsModel->getStatisticsMemListDrop($this->input->post());
            }else if($div == 'sleep'){
                $data = $this->statisticsModel->getStatisticsMemListSleep($this->input->post());
            }else{
                $data = $this->statisticsModel->getStatisticsMemList($this->input->post());
            }

            $titleList = [];
            if($div == 'drop') {
                $titleList = [
                    'base_date' => '날짜'
                    , 'drop_cnt' => '탈퇴회원'
                ];
                $excelFileName = '탈퇴회원 통계_' . date('YmdHis') . '.xlsx';
            } else if ($div == 'sleep') {
                $titleList = [
                    'base_date' => '날짜'
                    , 'in_sleep' => '휴면회원'
                    , 'out_sleep' => '휴면해지회원'
                ];
                $excelFileName = '휴면회원 통계_' . date('YmdHis') . '.xlsx';
            } else {
                foreach ($data['addColumn'] as $key => $val) {
                    $titleList[$key] = $val;
                }
                $excelFileName = '신규회원 통계_'.date('YmdHis').'.xlsx';
            }

            //다운로드 이력 추가
            $excelDwnHistoryModel->addHistory(['file_type' => '통계 분석', 'file_name' => $excelFileName]);

            // Excel file download
            $excel->setTitle($titleList)
                ->setDownloadType('excel')
                ->setData($data['list'])
                ->download($excelFileName);
        } else {
            show_error(validation_errors());
        }
    }
}