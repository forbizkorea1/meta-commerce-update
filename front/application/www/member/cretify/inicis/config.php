<?php
$memberRule = ForbizConfig::getSharedMemory('member_reg_rule');
return [
    'siteMid' => $memberRule['mall_sso_mid'] // 이니시스로부터 부여받은 MID
    , 'siteApiKey' => $memberRule['mall_sso_apikey'] // 이니시스로부터 부여받은 API KEY
];