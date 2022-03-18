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
        echo "autoCancel: 입금예정 -> 입금전취소\n";
        echo "deliveryComplete: 배송중 -> 배송완료\n";
        echo "buyFinalized: 배송완료 -> 구매확정\n";
    }

    /**
     * 자동 입금전취소
     */
    public function autoCancel()
    {
        /* @var $orderModel \CustomScm\Model\Order */
        $orderModel = $this->import('model.scm.order');
        $orderModel->cronAutoCancel();
    }

    /**
     * 자동 배송완료 (특정 주문의 상태가 배송중이고 n일 초과시 자동으로 배송완료로 변경)
     */
    public function deliveryComplete()
    {
        /* @var $orderModel \CustomScm\Model\Order */
        $orderModel = $this->import('model.scm.order');
        $orderModel->cronDeliveryComplete();
    }


    /**
     * 자동 구매확정
     */
    public function buyFinalized()
    {
        /* @var $orderModel \CustomScm\Model\Order */
        $orderModel = $this->import('model.scm.order');
        $orderModel->cronBuyFinalized();
    }

    /**
     * 주문 상담내역 파기 기간
     */
    public function qnaAutoDelete()
    {
        /* @var $orderModel \CustomScm\Model\Order */
        $orderModel = $this->import('model.scm.order');
        $orderModel->cronQnaAutoDelete();
    }

    /**
     * 주문 내역 파기 기간
     */
    public function orderAutoDelete()
    {
        /* @var $orderModel \CustomScm\Model\Order */
        $orderModel = $this->import('model.scm.order');
        $orderModel->cronOrderAutoDelete();
    }
})->run();