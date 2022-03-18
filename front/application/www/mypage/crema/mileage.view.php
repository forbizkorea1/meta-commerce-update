<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

$view = getForbizView(true);
$data = $view->input->post();

fb_sys_log('callback Crema URL parameters', $data);

echo json_encode([
   'code' => 0,
   'message' => 'success'
]);