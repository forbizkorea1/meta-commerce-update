<?php

namespace CustomScm\Model\Util;

/**
 * 엑셀 다운로드 이력관리 모델
 * 
 * @author hoksi
 */
class ExcelDwnHistory extends \ForbizScm\Model\Util\ExcelDwnHistory
{
    protected $message = "";

    public function __construct()
    {
        parent::__construct();
    }

    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * 엑셀 다운로드 히스토리 추가
     * @param array $data
     * @return array
     */
    public function addHistory($data)
    {
        $data = $this->qb->allowedFields($data, ['file_type', 'file_name']);

        $data['company_id'] = $this->adminInfo->company_id;
        $data['mem_type'] = $this->adminInfo->mem_type;
        $data['mem_div']  = $this->adminInfo->mem_div;
        $data['mem_name'] = $this->adminInfo->charger;
        $data['mem_id']   = $this->adminInfo->charger_id;
        $data['message']   = $this->message;
        $data['dwn_date'] = date('Y-m-d H:i:s');
        $data['dwn_ip']   = $this->input->ip_address();

        $this->insertHistory($data);

        return $this->getResult();
    }
}