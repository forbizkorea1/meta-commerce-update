<?php
// 도메인 변경이 필요할 때 설정함
// define('FORBIZ_BASEURL', 'localhost');

/*
 * Fobiz Framework Load
 */
require_once(__DIR__ . '/../../core/framework/ForbizScmCli.php');

(new class extends ForbizCli
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        echo "-------통계 정보 수집--------------\n";
        echo "fbStatisticsAll: 통계 정보 수집\n";
        echo "-------타이별 통계 정보 수집-------\n";
        echo "fbStatisticsSales: 일별 주문 통계\n";
        echo "fbStatisticsMember: 회원 통계\n";
        echo "fbStatisticsPayMethod: 결제 통계\n";
        echo "fbStatisticsOrderTime: 시간대별 주문 통계 \n";
    }

    /**
     * 통게 정보 수집
     */
    public function fbStatisticsAll()
    {
        $this->fbStatisticsSales();
        $this->fbStatisticsMember();
        $this->fbStatisticsPayMethod();
        $this->fbStatisticsOrderTime();
    }

    /**
     * 일별 주문 통계
     */
    public function fbStatisticsSales()
    {
        /* @var $statisticsModel \CustomScm\Model\Statistics */
        $statisticsModel = $this->import('model.scm.statistics');

        $now = date('Y-m-d');
        $date = date("Y-m-d", strtotime($now." -1 day"));
        $statisticsModel->setStatisticsDate($date);
        $statisticsModel->cronFbStatistics('order');
        $statisticsModel->cronFbStatistics('orderDetail');
        $statisticsModel->cronFbStatistics('product');
    }

    /**
     * 회원 통계 집계
     */
    public function fbStatisticsMember()
    {
        /* @var $statisticsModel \CustomScm\Model\Statistics */
        $statisticsModel = $this->import('model.scm.statistics');

        $now = date('Y-m-d');
        $date = date("Y-m-d", strtotime($now." -1 day"));
        $statisticsModel->setStatisticsDate($date);
        $statisticsModel->cronFbStatisticsMember();
        $statisticsModel->cronFbStatisticsMemberAll();
        $statisticsModel->cronFbStatisticsMemberSleep();
    }

    public function fbStatisticsPayMethod()
    {
        /* @var $statisticsModel \CustomScm\Model\Statistics */
        $statisticsModel = $this->import('model.scm.statistics');
        $now = date('Y-m-d');
        $date = date("Y-m-d", strtotime($now." -1 day"));
        $statisticsModel->setStatisticsDate($date);
        $statisticsModel->cronFbStatisticsPayMethod();
    }

    public function fbStatisticsOrderTime()
    {
        /* @var $statisticsModel \CustomScm\Model\Statistics */
        $statisticsModel = $this->import('model.scm.statistics');

        $now = date('Y-m-d');
        $date = date("Y-m-d", strtotime($now." -1 day"));
        $statisticsModel->setStatisticsDate($date);
        $statisticsModel->cronFbStatisticsOrderTime();
    }

})->run();