<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

// Load Forbiz View
$view = getForbizView(true);

if (!empty($view->input->get('pg_token'))) {
    ?>
    <script>
        opener.location.href = '/payment/kakaopay/result?<?=http_build_query($view->input->get());?>';
        self.close();
    </script>
    <?php
} else {
    ?>
    <script>
        alert('결제 오류 : 결제 승인 실패');
        self.close();
    </script>
    <?php
}