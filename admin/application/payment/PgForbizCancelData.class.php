<?php

/**
 * Description of PgForbizCancelData
 *
 * @author Hong
 */
class PgForbizCancelData
{
    /**
     * 취소 요청자 A:관리자, M:회원
     * @var string
     */
    public $cancelRequester = 'A';

    /**
     * 주문번호
     * @var string
     */
    public $oid;

    /**
     * 에스크로 결제 여부
     * @var boolean
     */
    public $isEscrow;

    /**
     * 부분취소 여부 (false: 전체 취소, true:부분취소)
     * 최초 금액 (originAmt) 에서 취소 금액을 비교해서 넘김
     * 최초 결제 10000원에서 5000원 최초 부분 취소시 true
     * 남은 금액 5000원에서 5000원 두번째 취소시 true
     * @var boolean
     */
    public $isPartial;

    /**
     * 결제 수단
     * @var string
     */
    public $method;

    /**
     * 구매자 Email
     * @var
     */
    public $buyerEmail;

    /**
     * 거래번호
     * @var string
     */
    public $tid;

    /**
     * 최초 결제 금액 (원 승인 거래 금액)
     * @var type
     */
    public $originAmt;

    /**
     * 취소금액
     * @var type
     */
    public $amt;

    /**
     * 취소 금액 - 과세
     * @var int
     */
    public $taxAmt;

    /**
     * 취소 금액 - 비과세
     * @var int
     */
    public $taxExAmt;

    /**
     * 취소 후 남을 예상 금액
     * @var int
     */
    public $expectedRestAmt;

    /**
     * 취소 사유
     * @var type
     */
    public $message;

    /**
     * 로그 경로
     * @var string
     */
    public $logPath;

    /**
     * 환불 은행코드
     * @var string
     */
    public $bankCode;

    /**
     * 환불 계좌번호
     * @var string
     */
    public $bankNumber;

    /**
     * 환불 예금주
     * @var string
     */
    public $bankOwner;

    /**
     * 환불계좌 핸드폰번호(가상계좌)
     * @var string
     */
    public $phoneNumber;

    /**
     * 캔슬 타입
     * @var string
     */
    public $cancelType;

    /**
     * 클레임 그룹
     * @var int
     */
    public $claimGroup;
}
