<?php

namespace CustomScm\Model;

/**
 * 크리마 관련 모델
 *
 * @author sammy
 */
class Crema extends \ForbizScm\Model\Crema
{
    const CREMA_APP_ID = '';
    const CREMA_SECRET = '';

    public function __construct($config = [])
    {
        parent::__construct();
    }

    /**
     * 인증 엑세스
     * @return type
     */
    public function getAccessToken()
    {
        $data = [
            'grant_type' => 'client_credentials',
            'client_id' => self::CREMA_APP_ID,
            'client_secret' =>  self::CREMA_SECRET,
        ];
        return $this->call($this->endPoint['oauth'], 'post', __FUNCTION__, $data);
    }
}