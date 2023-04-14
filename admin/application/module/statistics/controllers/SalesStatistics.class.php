<?php

namespace CustomScm\Controller\Statistics;

/**
 * 판매 통계
 *
 * @author hoksi
 * @property \CustomScm\Model\Statistics $statisticsModel
 */
class SalesStatistics extends \ForbizAdminController
{

    public function __construct()
    {
        parent::__construct();

        $this->statisticsModel = $this->import('model.scm.statistics');
    }

    public function index($stDiv = false)
    {
        // 타이틀 설정
        if ($stDiv === false) {
            redirect('/statistics/salesStatistics/order');
            exit;
        }

        // 타이틀 설정
        if ($stDiv == 'order') {
            $this->setTitle('주문별 판매통계');
        } else if ($stDiv == 'orderDetail') {
            $this->setTitle('상품별 판매통계');
        } else {
            $this->setTitle('판매통계');
        }

        $this->define('devStatisticsTop', '/subConfig/devStatisticsTop');
        $this->define('devStatisticsOrderTotal', '/subConfig/devStatisticsOrderTotal');
        $this->define('devStatisticsOrderDetailTotal', '/subConfig/devStatisticsOrderDetailTotal');


        $statisticsSearchDate = $this->statisticsModel->getStatisticsSearchDate();
        if($statisticsSearchDate){
            $this->setResponseData('startDate', $statisticsSearchDate['sDate']);
            $this->setResponseData('endDate', $statisticsSearchDate['eDate']);
        }else{
            $startDate = date('Y-m-d', strtotime('-2 weeks'));
            $endDate = date('Y-m-d', strtotime('-1 day'));
            $this->setResponseData('startDate', $startDate);
            $this->setResponseData('endDate', $endDate);
            $this->statisticsModel->setStatisticsSearchDate($startDate,$endDate);
        }




        $this->setResponseData('basicDate', date('Y-m-d', strtotime('-1 day')));
        $this->setResponseData('stDiv', $stDiv);

        if($stDiv == 'order'){
            $this->setResponseData('typeArr',$this->statisticsModel->getStatisticsTypeOrder());
        }else{
            $this->setResponseData('typeArr',$this->statisticsModel->getStatisticsTypeOrderDetail());
        }


    }

    public function get()
    {
        $chkField = ['startDate', 'endDate','type','st_div'];

        if (form_validation($chkField)) {

            if($this->input->post('type') == 'order_date'){
                $ret = $this->statisticsModel->getStatisticsDateList($this->input->post());
            }else{
                $ret = $this->statisticsModel->getStatisticsList($this->input->post());
            }


            $this->setResponseResult('success')->setResponseData($ret);
        } else {
            $this->setResponseResult('fail')->setResponseData(validation_errors());
        }
    }

    public function putChangeSearchDate()
    {
        $chkField = ['startDate', 'endDate'];

        if (form_validation($chkField)) {


            $ret = $this->statisticsModel->setStatisticsSearchDate($this->input->post('startDate'),$this->input->post('endDate'));

            $this->setResponseResult('success')->setResponseData($ret);
        } else {
            $this->setResponseResult('fail')->setResponseData(validation_errors());
        }
    }

    public function dwn()
    {

        // 입력 필수 항목
        $chekField = [];
        // 필수 항목 점검
        if (form_validation($chekField)) {
            /* @var $excel \ForbizExcel */
            $excel = $this->import('lib.excel');
            $post = $this->input->post();

            /* @var $excelDwnHistoryModel \CustomScm\Model\Util\excelDwnHistory */
            $excelDwnHistoryModel = $this->import('model.scm.util.excelDwnHistory');
            $excelDwnHistoryModel->setDownloadType('excel');

            if($post['type'] == 'order_date'){
                $data = $this->statisticsModel->getStatisticsDateList($post);
                $type_text = "일자";
            }else{
                $data = $this->statisticsModel->getStatisticsList($post);
                $type_text = "분류명";
            }

            if($post['st_div'] == 'order'){
                $excelFileName = '주문별 판매통계_'.date('YmdHis').'.xlsx';

                $titleList = [
                    'type_text' => $type_text
                    , 'order_cnt' => '주문건수'
                    , 'order_detail_cnt' => '주문상세건수'
                    , 'payment_price' => '결제 금액 합계'
                    , 'product_price' => '상품 금액'
                    , 'cancel_price' => '취소 금액'
                    , 'return_price' => '반품 금액'
                    , 'sales_price' => '매출액'
                ];
            }else if($post['st_div'] == 'orderDetail' || $post['st_div'] == 'product'){
                if($post['st_div'] == 'orderDetail'){
                    $excelFileName = '주문상세별 판매통계_'.date('YmdHis').'.xlsx';
                }else{
                    $excelFileName = '상품별 판매통계_'.date('YmdHis').'.xlsx';
                }

                $titleList = [
                    'type_text' => $type_text
                    , 'order_detail_cnt' => '주문상세건수'
                    , 'list_price' => '판매가 합계'
                    , 'payment_price' => '최종할인가 합계'
                    , 'product_price' => '상품 금액'
                    , 'cancel_price' => '취소 금액'
                    , 'return_price' => '반품 금액'
                ];
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

    public function dwnAsync()
    {
        // 입력 필수 항목
        $chkField = ['startDate', 'endDate','type'];
        // 필수 항목 점검
        if (form_validation($chkField)) {



            /* @var $excel \ForbizExcel */
            $excel = $this->import('lib.excel');


            // 엑셀파일명 설정 및 히스토리 기록
            $excelFileName = $this->import('model.scm.util.excelDwnHistory')->getExcelFileName();

            $asyncData = array(
                'pageName' => 'salesStatistics'
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
}