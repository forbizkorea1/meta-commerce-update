<?php

class customApiBaseModel  extends \ForbizApiBaseModel
{
    public function __construct()
    {
        parent::__construct();
        $this->adminInfo = (object) $_SESSION["admininfo"];
    }
}