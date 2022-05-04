<?php
///////////////////////////////////////////////////
// RabbitMQ 설정 상수
///////////////////////////////////////////////////
define('RABBITMQ_USE', false);

if(defined('DB_CONNECTION_DIV') && DB_CONNECTION_DIV == 'development') {
    define('RABBITMQ_HOST', '');
    define('RABBITMQ_PORT', 5672);
    define('RABBITMQ_USER', '');
    define('RABBITMQ_PASSWORD', '');
    define('RABBITMQ_VHOST', '');
} else if(defined('DB_CONNECTION_DIV') && DB_CONNECTION_DIV == 'testing') {
    define('RABBITMQ_HOST', '');
    define('RABBITMQ_PORT', 5672);
    define('RABBITMQ_USER', '');
    define('RABBITMQ_PASSWORD', '');
    define('RABBITMQ_VHOST', '');
} else if(defined('DB_CONNECTION_DIV') && DB_CONNECTION_DIV == 'production') {
    define('RABBITMQ_HOST', '');
    define('RABBITMQ_PORT', 5672);
    define('RABBITMQ_USER', '');
    define('RABBITMQ_PASSWORD', '');
    define('RABBITMQ_VHOST', '');
}
// 사용자 MQ 설정
define('QUEUE_SELLERTOOL', 'sellerTool');