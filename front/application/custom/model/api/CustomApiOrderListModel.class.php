<?php

/**
 * ForbizApiOrderListModel
 *
 * @property \ForbizApiOrderStatusModel $status
 * @property \ForbizApiSiteModel $siteModel
 * @property \ForbizApiOrderModel $order
 */
class CustomApiOrderListModel extends \ForbizApiOrderListModel
{

    public function __construct()
    {
        parent::__construct();

        $this->statusModel = $this->import('model.api.orderStatus');
        $this->siteModel = $this->import('model.api.site');
        $this->orderModel = $this->import('model.api.order');
    }

}