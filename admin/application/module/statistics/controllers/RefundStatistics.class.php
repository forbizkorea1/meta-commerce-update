<?php

namespace CustomScm\Controller\Statistics;

/**
 * 환불통계
 *
 * @author hoksi
 * @property \CustomScm\Model\Statistics $statisticsModel
 */
class RefundStatistics extends \ForbizAdminController
{

    public function __construct()
    {
        parent::__construct();
        $this->statisticsModel = $this->import('model.scm.statistics');
    }

    public function index($stDiv)
    {
        // 타이틀 설정
        if ($stDiv == 'order') {
            $this->setTitle('주문별 환불통계');
        } else if ($stDiv == 'orderDetail') {
            $this->setTitle('상품별 환불통계');
            $stDiv = 'orderDetail';
        } else {
            $this->setTitle('환불통계');
        }

        $this->define('devStatisticsTop', '/subConfig/devStatisticsTop'); //사업자 정보


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
            $this->setResponseData('typeArr',$this->statisticsModel->getReplaceRefundStatistics());
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
                $ret = $this->statisticsModel->getStatisticsList($this->input->post(),'refund');
            }


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
                $data = $this->statisticsModel->getStatisticsList($post, 'refund');
                $type_text = "분류명";
            }

            if($post['st_div'] == 'order'){
                $excelFileName = '주문별 환불통계_'.date('YmdHis').'.xlsx';
            }else if($post['st_div'] == 'orderDetail'){
                $excelFileName = '주문상세별 환불통계_'.date('YmdHis').'.xlsx';
            }else if($post['st_div'] == 'product'){
                $excelFileName = '상품별 환불통계_'.date('YmdHis').'.xlsx';
            }

            $titleList = [
                'type_text' => $type_text
                , 'cancel_cnt' => '취소완료/환불완료 건수'
                , 'cancel_price' => '취소완료/환불완료 금액 합계'
                , 'return_cnt' => '반품완료/환불완료 건수'
                , 'return_price' => '반품완료/환불완료 금액 합계'
                , 'refund_price' => '환불금액 합계'
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

    public function dwnAsync()
    {
        // 입력 필수 항목
        $chkField = ['startDate', 'endDate','type'];
        // 필수 항목 점검
        if (form_validation($chkField)) {



            /* @var $excel \ForbizExcel */
            $excel = $this->import('lib.excel');


            // 엑셀파일명 설정 및 히스토리 기록
            $excelFileName = str_replace('/','',$this->import('model.scm.util.excelDwnHistory')->getExcelFileName());

            $asyncData = array(
                'pageName' => 'refundStatistics'
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