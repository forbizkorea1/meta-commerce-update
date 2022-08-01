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

    /**
     * 가이드
     */
    public function index()
    {
        echo "-------사용법-------\n";
        echo "getOrderFromNpay: NaverPay 상품 주문 내역 수집\n";
        echo "getpurchaseReviewList: NaverPay 상품 평가 내역 수집\n";
        echo "getCustomerInquiryList: NaverPay 문의 내역 수집\n";

    }

    /**
     * NaverPay 상품 주문 내역 수집
     */
    public function getOrderFromNpay()
    {
        if (\ForbizConfig::getMallConfig('naverpay_other_pg_service_use') == 'Y') {
            /* @var $naverPayModel \ForbizScm\Model\Npay */
            $naverPayModel = $this->import('model.scm.npay');
            $sdate = date("Y-m-d H:i:00", strtotime("Now -10 minutes"));
            $edate = date("Y-m-d H:i:00", strtotime("Now"));
            $naverPayModel->getOrderNpay($sdate, $edate);
        }
    }

    /**
     * NaverPay 상품 평가 내역 수집
     */
    public function getPurchaseReviewList()
    {
        if (\ForbizConfig::getMallConfig('naverpay_other_pg_service_use') == 'Y') {
            /* @var $naverPayModel \ForbizScm\Model\Npay */
            $naverPayModel = $this->import('model.scm.npay');
            $naverPayModel->getReviewList();
        }
    }
    /**
     * NaverPay 문의 내역 수집
     */
    public function getCustomerInquiryList()
    {
        if (\ForbizConfig::getMallConfig('naverpay_other_pg_service_use') == 'Y') {
            /* @var $naverPayModel \ForbizScm\Model\Npay */
            $naverPayModel = $this->import('model.scm.npay');
            $naverPayModel->getCustomerInquiryList();
        }
    }


})->run();