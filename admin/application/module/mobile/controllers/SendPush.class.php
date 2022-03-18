<?php

namespace CustomScm\Controller\Mobile;

class SendPush extends \ForbizScm\Controller\Mobile\SendPush
{

    public function __construct()
    {
        parent::__construct();
    }

    public function add()
    {
        $chkField = ['send_type', 'device_type', 'title', 'push_title', 'contents', 'link'];

        if (form_validation($chkField)) {
            $sendType = $this->input->post('send_type');

            $postData = $this->input->post();
            $postData['image_link'] = '';
            if(!empty($_FILES)) {
                $uploadResult = $this->appPushModel->imageUpload($_FILES);
                $uploadImageUrl = $uploadResult['pushImage']['url'];
                $postData['image_link'] = $uploadImageUrl;
            }

            if ($sendType == 'R') {
                //예약
                $this->appPushModel->reservation($this->input->post('device_type'), $postData);
            } else {
                //즉시 발송
                $this->appPushModel->sendRequest($this->input->post('device_type'), $postData);
            }
            $this->setResponseData('send_type', $sendType);
        } else {
            $this->setResponseResult('fail')->setResponseData(validation_errors());
        }
    }
}