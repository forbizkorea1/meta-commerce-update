<?php

namespace CustomScm\Controller\Statistics;

/**
 * 시간대별 판매통계
 *
 * @author hoksi
 * @property \CustomScm\Model\Statistics $statisticsModel
 */
class TimeStatistics extends \ForbizAdminController
{

    public function __construct()
    {
        parent::__construct();
        $this->statisticsModel = $this->import('model.scm.statistics');
    }

    public function index()
    {
        // 타이틀 설정
        $this->setTitle('시간대별 판매통계');
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


            $ret = $this->statisticsModel->getStatisticsTimeList($this->input->post());

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
                'pageName' => 'timeStatistics'
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

            $data = $this->statisticsModel->getStatisticsTimeList($this->input->post());

            $excelFileName = '시간대별 판매통계_'.date('YmdHis').'.xlsx';

            $titleList = [
                'type_text' => '시간대'
                , 'order_cnt' => '주문건수'
                , 'order_detail_cnt' => '주문상세건수'
                , 'payment_price' => '결제 금액 합계'
                , 'product_price' => '상품 금액'
                , 'cancel_price' => '취소 금액'
                , 'return_price' => '반품 금액'
                , 'sales_price' => '매출액'
            ];

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