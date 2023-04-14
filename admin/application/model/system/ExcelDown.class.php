<?php

namespace CustomScm\Model\System;

/**
 * 시스템 로그 관리 모델
 * 
 * @author hoksi
 */
class ExcelDown extends \ForbizScm\Model\System\ExcelDown
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getExcelDownRoadList($cur_page, $per_page, $search = [])
    {
        // 쿼리 캐시 시작
        $this->qb->startCache();


        $this->qb->where('user_code', $this->adminInfo->charger_ix);


        $this->qb
            ->from(TBL_SYSTEM_EXCEL_DWN_REQUEST);
        // 쿼리 캐시 끝
        $this->qb->stopCache();

        // total 산출
        $total = $this->qb->getCount();

        // 페이징 설정
        $paging = $this->qb
            ->setTotalRows($total)
            ->pagination($cur_page, $per_page);

        // limit 값 산출
        $limit  = $per_page;
        $offset = ($paging['offset'] ?? 0);

        $rows = $this->qb
            ->select('request_date')
            ->select('complete_date')
            ->select('status')
            ->select('path_url')
            ->orderBy('idx', 'desc')
            ->limit($limit, $offset)
            ->exec()
            ->getResultArray();

        $this->qb->flushCache();

        return [
            'total' => $total,
            'list' => $rows,
            'paging' => $paging
        ];
    }

    public function putExcelDownAsync($request)
    {

        switch ($request['pageName']) {
            case 'orderList':
                $this->orderListDwn($request);
                break;
            case 'memberStatistics':
                $this->memberStatisticsDwn($request);
                break;
            case 'salesStatistics':
                $this->salesStatisticsDwn($request);
                break;
            case 'salesStatisticsDetail':
                $this->salesStatisticsDetailDwn($request);
                break;

            default:
                break;
        }
    }

    private function orderListDwn($request)
    {

        /* @var $orderListModel \CustomScm\Model\Order\OrderList */
        $orderListModel = $this->import('model.scm.order.orderList');

        /* @var $excelTemplateModel \CustomScm\Model\Order\ExcelTemplate */
        $excelTemplateModel = $this->import('model.scm.order.excelTemplate');

        /* @var $excel \ForbizExcel */
        $excel = $this->import('lib.excel');

        $titleAndFormatData = $excelTemplateModel->getExcelTitleAndFormatData($request['excelTmpIx']);
        $excelTitleData = $titleAndFormatData['titleData'];
        $excelFormatData = $titleAndFormatData['formatData'];


        $data = $orderListModel->getExcelList(
            1, $excel->getMaxRow(), $request, $excelFormatData
        );

        // 엑셀파일명 설정 및 히스토리 기록
        $excelFileName = $request['excelFileName'];

        $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('W',$excelFileName,$request['user_code']);
        // Excel file download
        $pathUrl = $excel->setTitle($excelTitleData)
            ->setData($data['list'])
            ->downloadToSave($excelFileName);

        $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('C',$excelFileName,$request['user_code'],$pathUrl);
        $getToken = $this->getPushToken($request['user_code']);
        if($getToken){
            $message['title'] = $excelFileName;
            $message['body'] = '엑셀다운로드가 완료 되었습니다.';
            web_push_noti($getToken,$message);
        }
    }

    private function memberStatisticsDwn($request)
    {

        /* @var $statisticstModel \CustomScm\Model\Statistics */
        $statisticstModel = $this->import('model.scm.Statistics');


        /* @var $excel \ForbizExcel */
        $excel = $this->import('lib.excel');


        $data = $statisticstModel->getStatisticsMemList(
            $request
        );

        // 엑셀파일명 설정 및 히스토리 기록
        $excelFileName = $request['excelFileName'];

        $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('W',$excelFileName,$request['user_code']);
        // Excel file download

        $pathUrl = $excel->setTitle([
            'type_text' => '분류명'
            , 'sum_user_cnt' => '신규회원'
            , 'user_cnt_average' => '일평균 가입수'
            , 'sum_drop_cnt' => '탈퇴회원'
            , 'drop_cnt_average' => '일평균 탈퇴수'
            , 'sum_sleep_cnt' => '휴면회원'
            , 'sleep_cnt_average' => '일평균 휴면회원'
        ])
            ->setData($data['list'])
            ->downloadToSave($excelFileName);

        $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('C',$excelFileName,$request['user_code'],$pathUrl);
        $getToken = $this->getPushToken($request['user_code']);
        if($getToken){
            $message['title'] = $excelFileName;
            $message['body'] = '엑셀다운로드가 완료 되었습니다.';
            web_push_noti($getToken,$message);
        }
    }

    private function salesStatisticsDwn($request)
    {

        /* @var $statisticstModel \CustomScm\Model\Statistics */
        $statisticstModel = $this->import('model.scm.Statistics');


        /* @var $excel \ForbizExcel */
        $excel = $this->import('lib.excel');


        if($request['type'] == 'order_date'){
            $data = $statisticstModel->getStatisticsDateList($request);
            $type_text = "일자";
        }else{
            $data = $statisticstModel->getStatisticsList($request);
            $type_text = "분류명";
        }

        // 엑셀파일명 설정 및 히스토리 기록
        $excelFileName = $request['excelFileName'];

        $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('W',$excelFileName,$request['user_code']);
        // Excel file download

        $pathUrl = $excel->setTitle([
            'type_text' => $type_text
            , 'order_cnt' => '주문건수'
            , 'order_detail_cnt' => '주문상세건수'
            , 'list_price' => '판매가 합계'
            , 'dc_price' => '최종할인가 합계'
            , 'payment_price' => '결제 금액 합계'
            , 'product_price' => '상품 금액'
            , 'cancel_price' => '취소 금액'
            , 'return_price' => '반품 금액'
            , 'sales_price' => '매출액'
        ])
            ->setData($data['list'])
            ->downloadToSave($excelFileName);

        $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('C',$excelFileName,$request['user_code'],$pathUrl);
        $getToken = $this->getPushToken($request['user_code']);
        if($getToken){
            $message['title'] = $excelFileName;
            $message['body'] = '엑셀다운로드가 완료 되었습니다.';
            web_push_noti($getToken,$message);
        }
    }

    private function salesStatisticsDetailDwn($request)
    {

        /* @var $statisticstModel \CustomScm\Model\Statistics */
        $statisticstModel = $this->import('model.scm.Statistics');


        /* @var $excel \ForbizExcel */
        $excel = $this->import('lib.excel');

        $startDate = $request['startDate'];
        $endDate = $request['endDate'];
        $type = $request['type'];
        $type_value = $request['type_value'];
        $st_div = $request['st_div'];
        if($request['depth2']){
            $type_value = $request['depth2'];
        }
        if($request['depth3']){
            $type_value = $request['depth3'];
        }

        if($st_div == 'product'){
            $data = $statisticstModel->getStatisticsProductList($type,$type_value,$startDate,$endDate);
            $type_text = "상품코드";
        }else{
            $data = $statisticstModel->getStatisticsDetailList($type,$type_value,$st_div,$startDate,$endDate);
            $type_text = "일자";
        }

        // 엑셀파일명 설정 및 히스토리 기록
        $excelFileName = $request['excelFileName'];

        $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('W',$excelFileName,$request['user_code']);
        // Excel file download

        $pathUrl = $excel->setTitle([
            'type_text' => $type_text
            , 'order_cnt' => '주문건수'
            , 'order_detail_cnt' => '주문상세건수'
            , 'list_price' => '판매가 합계'
            , 'dc_price' => '최종할인가 합계'
            , 'payment_price' => '결제 금액 합계'
            , 'product_price' => '상품 금액'
            , 'cancel_price' => '취소 금액'
            , 'return_price' => '반품 금액'
            , 'sales_price' => '매출액'
        ])
            ->setData($data['list'])
            ->downloadToSave($excelFileName);

        $this->import('model.scm.util.excelDwnHistory')->putExcelDwnInfo('C',$excelFileName,$request['user_code'],$pathUrl);
        $getToken = $this->getPushToken($request['user_code']);
        if($getToken){
            $message['title'] = $excelFileName;
            $message['body'] = '엑셀다운로드가 완료 되었습니다.';
            web_push_noti($getToken,$message);
        }
    }

    public function putPushToken($data)
    {
        if($data['token']){

            $getToken = $this->getPushToken();
            if($getToken){
                if($getToken == $data['token']){

                }else{
                    $this->updatePushToken($data['token']);
                }
            }else{
                $this->insertPushToken($data['token']);
            }

            $message['title'] = '설정';
            $message['body'] = '알림설정이 완료 되었습니다.';
            web_push_noti($data['token'],$message);
        }
    }

    private function getPushToken($userCode=false)
    {
        if(!$userCode){
            $userCode = $this->adminInfo->charger_ix;
        }
        $data = $this->qb
            ->select('token')
            ->from(TBL_WEB_PUSH)
            ->where('user_code',$userCode)
            ->exec()
            ->getRowArray();
        return $data['token'] ?? '';
    }

    private function updatePushToken($token)
    {
        $this->qb
            ->set('token',$token)
            ->update(TBL_WEB_PUSH)
            ->where('user_code',$this->adminInfo->charger_ix)
            ->exec();
    }
    private function insertPushToken($token)
    {

        $this->qb
            ->set('user_code',$this->adminInfo->charger_ix)
            ->set('token',$token)
            ->insert(TBL_WEB_PUSH)
            ->exec();
    }
}