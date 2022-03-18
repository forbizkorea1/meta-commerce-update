<?php
// 도메인 변경이 필요할 때 설정함
// define('FORBIZ_BASEURL', 'localhost');

/*
 * Fobiz Framework Load
 */
require_once(__DIR__ . '/../../core/framework/ForbizScmCli.php');

/**
 * @property CustomMallCartModel $cartModel
 */
(new class extends ForbizCli {
    public function __construct()
    {
        parent::__construct();
        /* @var $cremaModel \CustomScm\Model\Crema */
        $this->cremaModel = $this->import('model.scm.crema');

        /* @var $memberModel \CustomScm\Model\Member\Member */
        $this->memberModel = $this->import('model.scm.member.member');

        /* @var $productModel \CustomScm\Model\Product\Product */
        $this->productModel = $this->import('model.scm.product.product');

        /* @var $orderListModel \CustomScm\Model\Order\OrderList */
        $this->orderListModel = $this->import('model.scm.order.orderList');

        /* @var $csModel \CustomScm\Model\Cscenter\CsBoard */
        $this->csModel = $this->import('model.scm.cscenter.csBoard');

        $this->startDate = date('Y-m-d H:00:00');
        $this->endDate = date('Y-m-d H:59:59');
    }

    public function index()
    {
        echo "-------사용법-------\n";
        echo "UserGrade: 회원등급 (createUserGrade: 회원등급 등록, updateUserGrade: 회원등급 업데이트)\n";
        echo "User: 회원 (createUser: 회원 등록)\n";
        echo "Category (getCategoryList: 카테고리 리스트, createCategory: 카테고리 등록/수정)\n";
        echo "Product: 상품 (createProduct: 상품 등록)\n";
        echo "Order: 주문 (createOrder: 주문 등록)\n";
        echo "SubOrder: 주문상세\n";
        //echo "UnpaidOrder: 등록된 미입금 무통장\n";
        echo "Review: 리뷰 \n";
        echo "Comment: 리뷰댓글 \n";
        //echo "Mileage: 적립금을 지급\n";
    }

    /**
     * 회원 등급 등록
     */
    public function createUserGrade()
    {
        // 등록
        $memberInfo = $this->memberModel->getCremaMemberGroup([], false);

        foreach ($memberInfo as $val) {
            $postData = [
                'name' => $val['gp_name']
            ];

            $gradesInfo = $this->cremaModel->manageUserGrades('post', $postData);

            // shop_groupinfo crema_id 업데이트
            $this->memberModel->updateCremaMemberGroup($gradesInfo['id'], $val['gp_ix']);
        }
    }

    /**
     * 회원 등급 업데이트
     */
    public function updateUserGrade()
    {
        /* @var $memberModel \CustomScm\Model\Member\Member */
        $memberModel = $this->import('model.scm.member.member');

        $memberInfo = $memberModel->getCremaMemberGroup([], true);

        foreach ($memberInfo as $val) {
            $postData = [
                'id' => $val['crema_id'],
                'name' => $val['gp_name']
            ];

            $this->cremaModel->manageUserGrades('patch', $postData);
        }
    }

    /**
     * 회원 등록/수정
     */
    public function createUser()
    {
        $memberInfo = $this->memberModel->getList();

        if (!empty($memberInfo)) {
            foreach ($memberInfo['list'] as $value) {
                $gpInfo = $this->memberModel->getCremaIdByGroup($value['gp_ix']);

                if (!empty($value['gp_ix']) && !empty($memberInfo)) {
                    $param = [
                        'user_id' => $value['id'],
                        'user_name' => $value['name'],
                        'allow_sms' => $value['sms'],
                        'allow_email' => $value['info'],
                        'user_email' => $value['mail'],
                        'user_grade_id' => $gpInfo[0]['crema_id']
                    ];
                } else {
                    $param = [
                        'user_id' => $value['id'],
                        'user_name' => $value['name'],
                        'allow_sms' => $value['sms'],
                        'allow_email' => $value['info'],
                        'user_email' => $value['mail']
                    ];
                }
               $this->cremaModel->manageUser('post', $param);
            }
        }
    }

    /**
     * 카테고리 리스트
     */
    public function getCategoryList()
    {
        $this->cremaModel->getCategoryDetail();
    }

    /**
     * 카테고리 등록/수정
     */
    public function createCategory()
    {
        /* @var $categoryModel \CustomScm\Model\Product\Category */
        $categoryModel = $this->import('model.scm.product.category');
        $categoryInfo = $categoryModel->getCremaCategoryInfo();

        if (!empty($categoryInfo)) {
            foreach ($categoryInfo as $value) {
                $param = [
                    'code' => $value['cid'],
                    'name' => $value['cname'],
                    'status' => ($value['category_use']=='1'?'visible':'hidden'),
                    'parent_category_code' => ($value['parent']=='0'? null:$value['parent'])
                ];
                $this->cremaModel->putCategory($param);
            }
        }
    }

    /**
     * 상품 등록/수정
     */
    public function createProduct()
    {
        $this->startDate = "2020-10-19 00:00:00";
        $productInfo = $this->productModel->getCremaProduct($this->startDate, $this->endDate, 'add');

        $productDivArray = array_chunk($productInfo, 1000);

        foreach ($productDivArray as $productArray) {
            $this->sendProductInfo($productArray);
            sleep(1);
        }
    }

    /**
     * product 등록 & 수정 데이터 가공
     * @param array $productArray
     */
    public function sendProductInfo($productArray)
    {
        foreach ($productArray as $key => $value) {
            $data = [
                'code' => $value['id']  // 상품코드
                , 'name' => $value['pname'] // 상품명
                , 'url' => MALL_DOMAIN . '/shop/goodsView/' . $value['id'] // 상품상세 URL
                , 'org_price' => $value['listprice'] // 원가
                , 'final_price' => $value['sellprice'] // 할인가
                , 'category_codes' => array_column($this->productModel->getCremaProductCategory($value['id']), 'cid') // 카테고리 ID
                , 'product_options' => $this->productModel->getCremaProductOption($value['id']) // 옵션
                , 'image_url' => get_product_images_src($value['id'], 'm') // 상품이미지 URL
                , 'shop_builder_created_at' => $value['regdate'] // 등록일
                , 'shop_builder_updated_at' => $value['editdate'] // 수정일
            ];

            fb_sys_log('cremaProductData', $data);
            $this->cremaModel->putProduct($data);

            // AccessToken은 최초 한번 발급
            $this->cremaModel->setAuthCallFlag(false);

            $addData = [
                'code' => $value['id']  //상품코드
                , 'sub_product_codes' => $value['pcode'] // 스타일코드 + 세트상품
            ];

            fb_sys_log('cremaAddProductData', $addData);

            $this->cremaModel->putAddProduct($addData);
        }
    }

    /**
     * 주문, 주문상세, 무통장주문 상세 등록/수정
     */
    public function createOrder()
    {
        /* @var $memberModel \CustomScm\Model\Member\Member */
        $memberModel = $this->import('model.scm.member.member');

        /* @var $orderListModel \CustomScm\Model\Order\OrderList */
        $orderListModel = $this->import('model.scm.order.orderList');

        $orderInfo = $orderListModel->getCremaCombineList(1, 100, ['startDate' => "startDate", 'endDate' => $this->endDate]);

        if (!empty($orderInfo)) {
            // https://dev.cre.ma/crema-api/order-status 주문상태 값 참고
            foreach ($orderInfo['list'] as $value) {
                switch($value['status']) {
                    case "IR": $status = "not_paid"; break;
                    case "IC": $status = "paid"; break;
                    case "IB": $status = "not_paid_cancelled_by_buyer"; break;
                    case "CA": $status = "refund_requested"; break;
                    case "FA": $status = "refund_deferred"; break;
                    case "FC": $status = "returned"; break;
                    case "CC": $status = "cancelled"; break;
                    case "DR": $status = "delivery_preparing"; break;
                    case "DI": $status = "delivery_started"; break;
                    case "DC": $status = "delivery_finished"; break;
                    case "EA": $status = "exchange_requested"; break;
                    case "EI": $status = "exchange_accepted"; break;
                    case "ET": $status = "exchange_received"; break;
                }

                if ($value['gp_ix'] == 0) {
                    $order = [
                        'code' => $value['oid'],
                        'created_at' => $value['order_date'],
                        'total_price' => $value['psprice'],
                        'user_code' => $value['user_code'],
                        'user_email' => $value['bmail'],
                        'order_device' => $value['paymentAgentTypeText'] == "PC" ? 'pc' : 'mobile'
                    ];
                } else {
                    $memberInfo = $memberModel->getCremaIdByGroup($value['gp_ix']);

                    $order = [
                        'code' => $value['oid'],
                        'created_at' => $value['order_date'],
                        'total_price' => $value['psprice'],
                        'user_code' => $value['user_code'],
                        'user_email' => $value['bmail'],
                        'user_grade_id' => $memberInfo[0]['crema_id'],
                        'order_device' => $value['paymentAgentTypeText'] == "PC" ? 'pc' : 'mobile'
                    ];
                }

                if ($value['di_date'] != NULL) {
                    $sub_order = [
                        'order_code' => $value['oid'],
                        'product_code' => $value['pid'],
                        'price' => $value['pt_dcprice'], // 상품가격 X 구매수량
                        'product_count' => $value['pcnt'], // 구매 수량
                        'delivery_started_at' => $value['di_date'], //배송 시작일
                        'status' => $status
                    ];
                } else {
                    $sub_order = [
                        'order_code' => $value['oid'],
                        'product_code' => $value['pid'],
                        'price' => $value['pt_dcprice'], // 상품가격 X 구매수량
                        'product_count' => $value['pcnt'], // 구매 수량
                        'status' => $status
                    ];
                }

                // 주문 등록
                $this->cremaModel->putOrder($order);

                // 주문상세 등록
                $this->cremaModel->putSubOrder($sub_order);
            }
        }
    }

    /**
     * 후기 등록/수정
     */
    public function createReview()
    {
        /* @var $csModel \CustomScm\Model\Cscenter\CsBoard */
        $csModel = $this->import('model.scm.cscenter.csBoard');

        $reviews = $csModel->getListAfter();

        if (!empty($reviews)) {
            foreach ($reviews['list'] as $value) {
                $review = [
                    'code' => $value['bbs_ix'],
                    'product_code' => $value['pid'],
                    'created_at' => $value['regdate'],
                    'message' => $value['bbs_contents'],
                    'score' => $value['valuation_goods'],
                    'user_code' => $value['bbs_id'],
                    'user_name' => $value['bbs_name']
                ];
                $this->cremaModel->putReview($review);
            }
        }
    }

    public function getReviewList()
    {
        $this->cremaModel->getReview();
    }

    /**
     * 후기댓글 등록/수정
     */
    public function createComment()
    {
        /* @var $csModel \CustomScm\Model\Cscenter\CsBoard */
        $csModel = $this->import('model.scm.cscenter.csBoard');
        $comments = $csModel->getAfterComentList();

        if (!empty($comments)) {
            foreach ($comments['list'] as $value) {
                $commment = [
                    'review_code' => $value['bbs_ix'],
                    'code' => $value['cmt_ix'],
                    'created_at' => $value['regdate'],
                    'message' => $value['cmt_contents'],
                    'user_code' => $value['id'],
                    'user_name' => $value['cmt_name']
                ];

                $this->cremaModel->putComment($commment);
            }
        }
    }

    public function deleteAllComment(){
        $comments = $this->csModel->getAfterComentList();

        if ($comments['total'] > 0) {
            foreach ($comments['list'] as $value) {
                $commment = [
                    'review_code' => $value['bbs_ix'],
                    'code' => $value['cmt_ix']
                ];

                $this->cremaModel->deleteComment($commment);
            }
        }
    }

    public function deleteAllReviews(){
        $reviews = $this->csModel->getListAfter();

        if (!empty($reviews)) {
            foreach ($reviews['list'] as $value) {
                $review = [
                    'code' => $value['bbs_ix'],
                ];
                $this->cremaModel->deleteReview($review);
            }
        }
    }

    public function deleteAllSubOrders(){
        $this->startDate = "2020-10-18 00:00:00";
        $orderInfo = $this->orderListModel->getCremaCombineList(1, 100, ['startDate' => "startDate", 'endDate' => $this->endDate]);

        if (!empty($orderInfo)) {
            foreach ($orderInfo['list'] as $value) {
                    $sub_order = [
                        'order_code' => $value['oid'],
                        'code' => $value['pid'],
                    ];

                // 주문상세 등록
                $this->cremaModel->deleteSubOrder($sub_order);

            }
        }
    }

    public function deleteAllOrders(){
        // get list of orders
        $orders = $this->cremaModel->manageOrder('get');

        if (!empty($orders)) {
            foreach ($orders as $value) {
                $order = [
                    'code' => $value['code']
                ];
                $this->cremaModel->deleteOrder($order);
            }
        }
    }

    public function deleteAllProducts(){
        // list of products
        $products = $this->cremaModel->getProduct();

        if (!empty($products)) {
            foreach ($products as $value) {
                $order = [
                    'code' => $value['code']
                ];
                $this->cremaModel->deleteProduct($order);
            }
        }
    }

    public function deleteAllCategories(){
        //get list of categories
        $catgories = $this->cremaModel->getCategoryDetail();

        if (!empty($catgories)) {
            foreach ($catgories as $value) {
                $category = [
                    'code' => $value['code']
                ];
                $this->cremaModel->delCategory($category);
            }
        }
    }

    public function deleteAllUserGrades(){
        // list of userGrade
        $userGrades = $this->cremaModel->manageUserGrades('get');

        if (!empty($userGrades)) {
            foreach ($userGrades as $value) {
                $userGrade = [
                  'id' => $value['id']
                ];
                $this->cremaModel->manageUserGrades('delete', $userGrade);
                $this->memberModel->updateCremaMemberGroupAfterDelete($value['id']);
            }
        }
    }

    public function deleteAllUsers(){
        // list of users
        $users = $this->cremaModel->manageUser('get');

        if (!empty($users)) {
            foreach ($users as $value) {
                $user = [
                    'id' => $value['id']
                ];
                $this->cremaModel->manageUser('delete', $user);
            }
        }
    }

})->run();