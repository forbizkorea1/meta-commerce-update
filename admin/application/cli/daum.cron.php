<?php
// 도메인 변경이 필요할 때 설정함
// define('FORBIZ_BASEURL', 'localhost');

/*
 * Fobiz Framework Load
 */
require_once(__DIR__ . '/../../core/framework/ForbizScmCli.php');

/**
 * @property CustomMallOrderModel $orderModel
 */
(new class extends ForbizCli
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 가이드
     */
    public function index()
    {
        echo "-------사용법-------\n";
        echo "daumEpAll: ep 전체 파일 생성\n";
        echo "daumEpSome: ep 요약 파일 생성\n";
    }

    /**
     * 전체ep [업데이트 주기 : 01시 (1일 1회), 품절이 아니면서 구매 가능한]
     */
    public function daumEpAll()
    {
        $this->setEp('all');
    }

    /**
     * 요약ep [업데이트 주기 : 08~20시 (일 최대25회, 2시간마다, 전일데이터는 모두 삭제), 신규/수정/품절된 상품만, 변경 없는 상품은 EP 구성 시 포함하지 않음]
     */
    public function daumEpSome()
    {
        $this->setEp('some');
    }

    /**
     * ep 생성
     * @param $type
     * @param $max
     */
    protected function setEp($type)
    {
        /* @var $daumEpModel \CustomScm\Model\Util\DaumEp */
        $daumEpModel = $this->import('model.scm.util.daumEp');

        $daumEpModel->setEp($type);
    }
})->run();