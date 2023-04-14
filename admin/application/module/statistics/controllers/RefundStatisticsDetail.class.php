<?php

namespace CustomScm\Controller\Statistics;

/**
 * 환불통계 상세
 *
 * @author hoksi
 * @property \CustomScm\Model\Statistics $statisticsModel
 */
class RefundStatisticsDetail extends \ForbizAdminController
{

    public function __construct()
    {
        parent::__construct();
        $this->statisticsModel = $this->import('model.scm.statistics');
    }

    public function index()
    {
        // 타이틀 설정
        $this->setTitle('환불통계 상세');
        $this->setLayout('layout_modal');

        $type = $this->input->post('type');
        $type_value = $this->input->post('type_value');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $stDiv = $this->input->post('stDiv');

        $this->setResponseData('type', $type);
        $this->setResponseData('type_value', $type_value);
        $this->setResponseData('startDate', $startDate);
        $this->setResponseData('endDate', $endDate);
        $this->setResponseData('stDiv', $stDiv);

        if($type == 'cid'){
            /* @var $categoryModel \CustomScm\Model\Product\Category */
            $categoryModel = $this->import('model.scm.product.category');
            $pathData = $categoryModel->getCategoryPath($type_value, 0);
            if(!empty($pathData)){
                $subCid = $pathData[0]['cid'];
                $cname =  $pathData[0]['cname'];
                $subCidData = $categoryModel->getSubList($subCid);

                $this->setResponseData('cname', $cname);
                $this->setResponseData('subCidData', $subCidData);
//            $pathData = $categoryModel->getCategoryPath($type_value, 2);
//            $pathData = $categoryModel->getCategoryPath($type_value, 3);
            }

        }
    }
    public function get()
    {
        $chkField = ['startDate', 'endDate','type'];

        if (form_validation($chkField)) {
            $startDate = $this->input->post('startDate');
            $endDate = $this->input->post('endDate');
            $type = $this->input->post('type');
            $type_value = $this->input->post('type_value');
            $st_div = $this->input->post('st_div');
            if($this->input->post('depth2')){
                $type_value = $this->input->post('depth2');
            }
            if($this->input->post('depth3')){
                $type_value = $this->input->post('depth3');
            }

            if($st_div == 'product'){
                $ret = $this->statisticsModel->getStatisticsProductList($type,$type_value,$startDate,$endDate,'refund');
            }else{
                $ret = $this->statisticsModel->getStatisticsDetailList($type,$type_value,$st_div,$startDate,$endDate,'refund');
            }


            $this->setResponseResult('success')->setResponseData($ret);
        } else {
            $this->setResponseResult('fail')->setResponseData(validation_errors());
        }
    }

    public function getSubCategory()
    {

        $chekField = ['selData'];
        $selData = $this->input->post('selData');
        // 필수 항목 점검
        if (form_validation($chekField)) {
            /* @var $categoryModel \CustomScm\Model\Product\Category */
            $categoryModel = $this->import('model.scm.product.category');
            $subCidData = $categoryModel->getSubList($selData);


            $list[] = [
                'val' => ''
                , 'text' => '선택해주세요'
                , 'cascading' => false
                , 'isBool' => false
            ];
            if(is_array($subCidData)){
                foreach($subCidData as $val){
                    $list[] = [
                        'val' => $val['cid']
                        , 'text' => $val['cname']
                        , 'cascading' => false
                        , 'isBool' => false
                    ];
                }
            }
            $this->setResponseResult('success')->setResponseData($list);
        } else {
            $this->setResponseResult('fail')->setResponseData(validation_errors());
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
                'pageName' => 'refundStatisticsDetail'
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