<?php

namespace CustomScm\Controller\Statistics;

/**
 * 결제수단별 판매통계
 *
 * @author hoksi
 * @property \CustomScm\Model\Statistics $statisticsModel
 */
class PayMethodStatistics extends \ForbizAdminController
{

    public function __construct()
    {
        parent::__construct();
        $this->statisticsModel = $this->import('model.scm.statistics');
    }

    public function index()
    {
        // 타이틀 설정
        $this->setTitle('결제수단별 판매통계');

        $startDate = date('Y-m-d', strtotime('-2 weeks'));
        $endDate = date('Y-m-d', strtotime('-1 day'));
        $this->setResponseData('startDate', $startDate);
        $this->setResponseData('endDate', $endDate);
        $this->setResponseData('basicDate', date('Y-m-d', strtotime('-1 day')));
        $this->define('devStatisticsTop', '/subConfig/devStatisticsTop');
    }

    public function get()
    {
        $chkField = ['startDate', 'endDate'];

        if (form_validation($chkField)) {


            $ret = $this->statisticsModel->getStatisticsPayMethodList($this->input->post());

            $this->setResponseResult('success')->setResponseData($ret);
        } else {
            $this->setResponseResult('fail')->setResponseData(validation_errors());
        }
    }

    public function dwnAsync()
    {
        // 입력 필수 항목
        $chkField = ['startDate', 'endDate'];
        // 필수 항목 점검
        if (form_validation($chkField)) {



            /* @var $excel \ForbizExcel */
            $excel = $this->import('lib.excel');


            // 엑셀파일명 설정 및 히스토리 기록
            $excelFileName = $this->import('model.scm.util.excelDwnHistory')->getExcelFileName();

            $asyncData = array(
                'pageName' => 'payMethodStatistics'
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
        $chkField = ['startDate', 'endDate'];
        // 필수 항목 점검
        if (form_validation($chkField)) {
            /* @var $excel \ForbizExcel */
            $excel = $this->import('lib.excel');

            /* @var $excelDwnHistoryModel \CustomScm\Model\Util\excelDwnHistory */
            $excelDwnHistoryModel = $this->import('model.scm.util.excelDwnHistory');
            $excelDwnHistoryModel->setDownloadType('excel');

            $data = $this->statisticsModel->getStatisticsPayMethodList($this->input->post());

            $excelFileName = '결제수단별 판매통계_'.date('YmdHis').'.xlsx';

            $titleList = [
                'base_date' => '일자'
                , 'method_1' => '신용카드'
                , 'method_4' => '가상계좌'
                , 'method_5' => '실시간 계좌이체'
            ];
            foreach ($data['addColumn'] as $key => $val) {
                $titleList[$key] = $val;
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