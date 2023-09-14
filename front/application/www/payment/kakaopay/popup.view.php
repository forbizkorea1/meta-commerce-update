<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

// Load Forbiz View
$view = getForbizView(true);

redirect($view->input->get('checkoutPage'));