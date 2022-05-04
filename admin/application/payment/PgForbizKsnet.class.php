<?php

/**
 * Description of PgForbizKsnet
 *
 * @author Kim
 * KSNETPay Standard 버전
 */
class PgForbizKsnet extends PgForbiz
{
    public function __construct($agentType)
    {
        parent::__construct($agentType);

        $this->homePath = __DIR__ . '/ksnet';

        if (ForbizConfig::getPaymentConfig('service_type', 'ksnet') == 'service') {
            $this->sndStoreid = ForbizConfig::getPaymentConfig('sndStoreid', 'ksnet');
            $this->sndEscrow = ForbizConfig::getPaymentConfig('sndEscrow', 'ksnet');
            $this->sndStorepasswd = ForbizConfig::getPaymentConfig('sndStorepasswd', 'ksnet');
            $this->payScriptUrl = 'https://kspay.ksnet.to/store/KSPayWebV1.4/js/kspay_web_ssl.js';

            // mobile
            $this->mobilePayScriptUrl ='http://kspay.ksnet.to/store/KSPayMobileV1.4/KSPayPWeb.jsp';    //리얼
        } else {
            $this->sndStoreid = ForbizConfig::getPaymentConfig('sndTestStoreid', 'ksnet'); //"2999199999";
            $this->sndEscrow = ForbizConfig::getPaymentConfig('sndEscrow', 'ksnet');
            $this->sndStorepasswd = ForbizConfig::getPaymentConfig('sndTestStorepasswd', 'ksnet');
            $this->payScriptUrl = 'https://kspay.ksnet.to/store/KSPayWebV1.4/js/kspay_web_ssl.js';
            //$this->payScriptUrl = 'https://kspay.ksnet.to/store/KSPayWebV1.4/js/kspay_web_test.js';

            // mobile
            $this->mobilePayScriptUrl = 'http://210.181.28.134/store/KSPayMobileV1.4/KSPayPWeb.jsp';  //테스트
        }
    }

    public function doCancel(PgForbizCancelData $cancelData, PgForbizResponseData $responseData): PgForbizResponseData
    {
        if ($cancelData->isPartial) { // 부분취소일경우 (신용카드, 실시간 계좌이체)
            $canc_type = '3';
            $canc_amt = $cancelData->amt;
            $canc_seq = $cancelData->claimGroup; // 거래번호, 취소금액, 일련번호 다 같으면 취소거절됩니다. (1~99)
            
        } else if ($cancelData->isPartial && $cancelData->method == ORDER_METHOD_PHONE) { // 휴대폰은 전체취소만 있습니다
            $responseData->result = false;
            $responseData->message = "휴대폰 부분취소는 자동 환불처리가 안됩니다.";
            return $responseData;

        } else {
            $canc_type = '1'; // 전체취소
        }

        include __DIR__ . '/ksnet/libs/KSPayApprovalCancel.php';

        // storeid 상점아이디
        $storeid = $this->sndStoreid;

        // storepasswd 상점 비밀번호
        $storepasswd = $this->sndStorepasswd;

        // trno 거래번호
        $trno = $cancelData->tid;

        // authty 결제수단
        $authty = "";
        if ($cancelData->method == ORDER_METHOD_CARD
            || $cancelData->method == ORDER_METHOD_INAPP_PAYCO
            || $cancelData->method == ORDER_METHOD_INAPP_KAKAOPAY
            || $cancelData->method == ORDER_METHOD_INAPP_NAVERPAY
            || $cancelData->method == ORDER_METHOD_INAPP_SSGPAY) {

            // 신용카드
            $authty = "1010";
            $Version = "0210";  // 전문버전
        } else if ($cancelData->method == ORDER_METHOD_VBANK) {
            // 가상계좌
            $authty = "6010";
            $Version = "0603";  // 전문버전
        } else if ($cancelData->method == ORDER_METHOD_ICHE) {
            $Version = "0603";  // 전문버전

            /* @var $orderModel \CustomScm\Model\Order\Order */
            $orderModel = $this->import('model.scm.order.order');
            $order = $orderModel->getOrderFromDetailByOid($cancelData->oid);
            $ic_date = $order->ic_date;

            if (date('Y-m-d') == date('Y-m-d', strtotime($ic_date))) {
                $authty = "2010"; // 계좌이체 취소(2010)는 당일에 한해서만 가능합니다.
            } else {
                $authty = "2030"; // 당일이지난 취소는 환불(2030) 나중에 조건문 추가
            }
        } else if ($cancelData->method == ORDER_METHOD_PHONE) {
            // 휴대폰
            $authty = "M110";
            $Version = "0603";  // 전문버전
        }

        ///////////////////////////////// ksnet 취소 시작 ////////////////////////
        // Default-------------------------------------------------------
        $EncType = "2";     // 0: 암화안함, 1:openssl, 2: seed
        $VersionType = "00";    // 구분
        $Resend = "0";     // 전송구분 : 0 : 처음,  2: 재전송

        $RequestDate =           // 요청일자 : yyyymmddhhmmss
            SetZero(strftime("%Y"), 4) .
            SetZero(strftime("%m"), 2) .
            SetZero(strftime("%d"), 2) .
            SetZero(strftime("%H"), 2) .
            SetZero(strftime("%M"), 2) .
            SetZero(strftime("%S"), 2);
        $KeyInType = "K";   // KeyInType 여부 : S : Swap, K: KeyInType
        $LineType = "1";   // lineType 0 : offline, 1:internet, 2:Mobile
        $ApprovalCount = "1";   // 복합승인갯수
        $GoodType = "0";   // 제품구분 0 : 실물, 1 : 디지털
        $HeadFiller = "";   // 예비
        //-------------------------------------------------------------------------------

        // Header (입력값 (*) 필수항목)--------------------------------------------------
        $StoreId = $storeid;    // *상점아이디
        $OrderNumber = "";                            // *주문번호
        $UserName = "";                            // *주문자명
        $IdNum = "";                            // 주민번호 or 사업자번호
        $Email = "";                            // *email
        $GoodName = "";                            // *제품명
        $PhoneNo = "";                            // *휴대폰번호
        // Header end -------------------------------------------------------------------

        // Data Default(수정항목이 아님)-------------------------------------------------
        $ApprovalType = $authty;    // 승인구분
        $TransactionNo = $trno;        // 거래번호
        // Data Default end -------------------------------------------------------------

        if ($cancelData->method == ORDER_METHOD_CARD
            || $cancelData->method == ORDER_METHOD_INAPP_PAYCO
            || $cancelData->method == ORDER_METHOD_INAPP_KAKAOPAY
            || $cancelData->method == ORDER_METHOD_INAPP_NAVERPAY
            || $cancelData->method == ORDER_METHOD_INAPP_SSGPAY) {

            // Server로 부터 응답이 없을시 자체응답
            $rApprovalType = "1011";
            $rTransactionNo = "";              // 거래번호
            $rStatus = "X";             // 상태 O : 승인, X : 거절
            $rTradeDate = "";              // 거래일자
            $rTradeTime = "";              // 거래시간
            $rIssCode = "00";            // 발급사코드
            $rAquCode = "00";            // 매입사코드
            $rAuthNo = "9999";          // 승인번호 or 거절시 오류코드
            $rMessage1 = "취소거절";      // 메시지1
            $rMessage2 = "C잠시후재시도"; // 메시지2
            $rCardNo = "";              // 카드번호
            $rExpDate = "";              // 유효기간
            $rInstallment = "";              // 할부
            $rAmount = "";              // 금액
            $rMerchantNo = "";              // 가맹점번호
            $rAuthSendType = "N";             // 전송구분
            $rApprovalSendType = "N";             // 전송구분(0 : 거절, 1 : 승인, 2: 원카드)
            $rPoint1 = "000000000000";  // Point1
            $rPoint2 = "000000000000";  // Point2
            $rPoint3 = "000000000000";  // Point3
            $rPoint4 = "000000000000";  // Point4
            $rVanTransactionNo = "";
            $rFiller = "";              // 예비
            $rAuthType = "";              // ISP : ISP거래, MP1, MP2 : MPI거래, SPACE : 일반거래
            $rMPIPositionType = "";              // K : KSNET, R : Remote, C : 제3기관, SPACE : 일반거래
            $rMPIReUseType = "";              // Y : 재사용, N : 재사용아님
            $rEncData = "";              // MPI, ISP 데이터
            // --------------------------------------------------------------------------------
        } else if ($cancelData->method == ORDER_METHOD_VBANK) {
            $rVATransactionNo		= "";						// 거래번호
            $rStatus				= "X";						// 상태 O : 승인, X : 거절
            $rVATradeDate			= "";						// 거래일자
            $rVATradeTime			= "";						// 거래시간
            $rVABankCode			= "";
            $rVAName				= "";
            $VACloseDate			= "";						//마감일
            $VACloseTime			= "";						//마감시간
            $VARespCode 			= "9999";					//응답코드
            $rVAMessage1			= "취소거절";				// 메시지1
            $rVAMessage2			= "C잠시후재시도";			// 메시지2
            $rVAFiller				= "";						// 예비
        } else if ($cancelData->method == ORDER_METHOD_ICHE) {
            $rApprovalType    		= "2011";							// 승인구분
            $rACTransactionNo    	= $TransactionNo;					// 거래번호
            $rStatus           	    = "X";								// 오류구분 :승인 X:거절
            $rStatus           	    = "X";								// 오류구분 :승인 X:거절
            $rACTradeDate        	= "";								// 거래 개시 일자(YYYYMMDD)
            $rACTradeTime        	= "";								// 거래 개시 시간(HHMMSS)
            $rACAcctSele         	= "";								// 계좌이체 구분 -	1:Dacom, 2:Pop Banking,	3:실시간계좌이체 4: 승인형계좌이체
            $rACFeeSele          	= "";								// 선/후불제구분 -	1:선불,	2:후불
            $rACInjaName         	= "";								// 인자명(통장인쇄메세지-상점명)
            $rACPareBankCode     	= "";								// 입금모계좌코드
            $rACPareAcctNo       	= "";								// 입금모계좌번호
            $rACCustBankCode     	= "";								// 출금모계좌코드
            $rACCustAcctNo       	= "";								// 출금모계좌번호
            $rACAmount	       		= "";								// 금액	(결제대상금액)
            $rACBankTransactionNo	= "";								// 은행거래번호
            $rACIpgumNm          	= "";								// 입금자명
            $rACBankFee          	= "0";								// 계좌이체 수수료
            $rACBankAmount       	= "";								// 총결제금액(결제대상금액+ 수수료
            $rACBankRespCode     	= "9999";							// 오류코드
            $rACMessage1         	= "취소거절";						// 오류 message 1
            $rACMessage2         	= "C잠시후재시도";					// 오류 message 2
            $rACFiller           	= "";								// 예비
        } else if ($cancelData->method == ORDER_METHOD_PHONE) {
            $rApprovalType  = "M111";
            $rTransactionNo = "";                        // 거래번호
            $rStatus        = "X";                       // 상태 O : 승인, X : 거절
            $rTradeDate     = "";                        // 거래일자
            $rTradeTime     = "";                        // 거래시간
            $rRespCode      = "";                        // 응답코드
            $rRespMsg       = "C취소거절";               // 응답메시지
        }

        KSPayApprovalCancel('localhost', 29991);

        HeadMessage(
            $EncType,                  // 0: 암화안함, 1:openssl, 2: seed
            $Version,                  // 전문버전
            $VersionType,                  // 구분
            $Resend,                  // 전송구분 : 0 : 처음,  2: 재전송
            $RequestDate,                  // 재사용구분
            $StoreId,                  // 상점아이디
            $OrderNumber,                  // 주문번호
            $UserName,                  // 주문자명
            $IdNum,                  // 주민번호 or 사업자번호
            $Email,                  // email
            $GoodType,                  // 제품구분 0 : 실물, 1 : 디지털
            $GoodName,                  // 제품명
            $KeyInType,                  // KeyInType 여부 : S : Swap, K: KeyInType
            $LineType,                  // lineType 0 : offline, 1:internet, 2:Mobile
            $PhoneNo,                  // 휴대폰번호
            $ApprovalCount,                  // 복합승인갯수
            $HeadFiller                 // 예비
        );

        // ------------------------------------------------------------------------------
        if ($canc_type == '3') {
            if ($cancelData->method == ORDER_METHOD_ICHE) {
                $ApprovalType = "2030";
            }
            CancelDataMessage($ApprovalType, $canc_type, $TransactionNo,"",	"", SetZero($canc_amt,9).SetZero($canc_seq,2),	"", "");
        } else {
            CancelDataMessage($ApprovalType, "0", $TransactionNo, "", "", "", "", "");
        }

        if ($cancelData->method == ORDER_METHOD_CARD
            || $cancelData->method == ORDER_METHOD_INAPP_PAYCO
            || $cancelData->method == ORDER_METHOD_INAPP_KAKAOPAY
            || $cancelData->method == ORDER_METHOD_INAPP_NAVERPAY
            || $cancelData->method == ORDER_METHOD_INAPP_SSGPAY){

            if (SendSocket("1")) {
                $rApprovalType = $GLOBALS["ApprovalType"];
                $rTransactionNo = $GLOBALS["TransactionNo"];    // 거래번호
                $rStatus = $GLOBALS["Status"];    // 상태 O : 승인, X : 거절
                $rTradeDate = $GLOBALS["TradeDate"];    // 거래일자
                $rTradeTime = $GLOBALS["TradeTime"];    // 거래시간
                $rIssCode = $GLOBALS["IssCode"];    // 발급사코드
                $rAquCode = $GLOBALS["AquCode"];    // 매입사코드
                $rAuthNo = $GLOBALS["AuthNo"];    // 승인번호 or 거절시 오류코드
                $authNoUtf8 = trim($GLOBALS["AuthNo"]);
                $rMessage1 = trim($GLOBALS["Message1"]);    // 메시지1
                $rMessage2 = trim($GLOBALS["Message2"]);    // 메시지2
                $message1Utf8 = iconv("CP949", "UTF-8", $rMessage1);
                $message2Utf8 = iconv("CP949", "UTF-8", $rMessage2);
                $rCardNo = $GLOBALS["CardNo"];    // 카드번호
                $rExpDate = $GLOBALS["ExpDate"];    // 유효기간
                $rInstallment = $GLOBALS["Installment"];    // 할부
                $rAmount = $GLOBALS["Amount"];    // 금액
                $rMerchantNo = $GLOBALS["MerchantNo"];    // 가맹점번호
                $rAuthSendType = $GLOBALS["AuthSendType"];    // 전송구분= new String(this.read(2))
                $rApprovalSendType = $GLOBALS["ApprovalSendType"];    // 전송구분(0 : 거절, 1 : 승인, 2: 원카드)
                $rPoint1 = $GLOBALS["Point1"];    // Point1
                $rPoint2 = $GLOBALS["Point2"];    // Point2
                $rPoint3 = $GLOBALS["Point3"];    // Point3
                $rPoint4 = $GLOBALS["Point4"];    // Point4
                $rVanTransactionNo = $GLOBALS["VanTransactionNo"];   // Van거래번호
                $rFiller = $GLOBALS["Filler"];    // 예비
                $rAuthType = $GLOBALS["AuthType"];    // ISP : ISP거래, MP1, MP2 : MPI거래, SPACE : 일반거래
                $rMPIPositionType = $GLOBALS["MPIPositionType"];    // K : KSNET, R : Remote, C : 제3기관, SPACE : 일반거래
                $rMPIReUseType = $GLOBALS["MPIReUseType"];    // Y : 재사용, N : 재사용아님
                $rEncData = $GLOBALS["EncData"];    // MPI, ISP 데이터
            }
        } else if ($cancelData->method == ORDER_METHOD_VBANK) {
            if (SendSocket("1")) {
                $rVATransactionNo	= $GLOBALS["VATransactionNo"];  	// 거래번호
                $rStatus			= $GLOBALS["VAStatus"];	// 상태 O : 승인, X : 거절
                $rVATradeDate		= $GLOBALS["VATradeDate"]; 	// 거래일자
                $rVATradeTime		= $GLOBALS["VATradeTime"];  	// 거래시간
                $rVABankCode		= $GLOBALS["VABankCode"];	// 발급사코드
                $rVAVirAcctNo 		= $GLOBALS["VAVirAcctNo"];	// 매입사코드
                $rVAName			= $GLOBALS["VAName"];	// 승인번호 or 거절시 오류코드
                $rVACloseDate		= $GLOBALS["VACloseDate"];   // 마감일
                $rVACloseTime		= $GLOBALS["VACloseTime"];   // 마감시간
                $rVARespCode 		= $GLOBALS["VARespCode"];	// 응답코드

                $rVAMessage1		= trim($GLOBALS["VAMessage1"]);	// 메시지1
                $rVAMessage2		= trim($GLOBALS["VAMessage2"]);	// 메시지2
                $rVAFiller			= $GLOBALS["VAFiller"];	// 예비

                $authNoUtf8 = trim($GLOBALS["VAName"]);
                $message1Utf8 = iconv("CP949", "UTF-8", $rVAMessage1);
                $message2Utf8 = iconv("CP949", "UTF-8", $rVAMessage2);

            }
        } else if ($cancelData->method == ORDER_METHOD_ICHE) {
            if (SendSocket("1")) {
                $rApprovalType			=	$GLOBALS["ApprovalType"];
                $rACTransactionNo	    =	$GLOBALS["ACTransactionNo"]	;   // 거래번호
                $rStatus				=	$GLOBALS["ACStatus"];   // 오류구분 :승인 X:거절
                $rACTradeDate		    =	$GLOBALS["ACTradeDate"];   // 거래 개시 일자(YYYYMMDD)
                $rACTradeTime		    =	$GLOBALS["ACTradeTime"];   // 거래 개시 시간(HHMMSS)
                $rACAcctSele		   	=	$GLOBALS["ACAcctSele"];   // 계좌이체 구분 -	1:Dacom, 2:Pop Banking,	3:Scrapping 계좌이체, 4:승인형계좌이체, 5:금결원계좌이체
                $rACFeeSele				=	$GLOBALS["ACFeeSele"];   // 선/후불제구분 -	1:선불,	2:후불
                $rACInjaName		   	=	$GLOBALS["ACInjaName"];   // 인자명(통장인쇄메세지-상점명)
                $rACPareBankCode	   	=	$GLOBALS["ACPareBankCode"];   // 입금모계좌코드
                $rACPareAcctNo			=	$GLOBALS["ACPareAcctNo"];   // 입금모계좌번호
                $rACCustBankCode	    =	$GLOBALS["ACCustBankCode"];   // 출금모계좌코드
                $rACCustAcctNo			=	$GLOBALS["ACCustAcctNo"]; // 출금모계좌번호
                $rACAmount				=	$GLOBALS["ACAmount"];   // 금액	(결제대상금액)
                $rACBankTransactionNo  	=	$GLOBALS["ACBankTransactionNo"]; // 은행거래번호
                $rACIpgumNm				=	$GLOBALS["ACIpgumNm"];   // 입금자명
                $rACBankFee				=	$GLOBALS["ACBankFee"];   // 계좌이체 수수료
                $rACBankAmount			=	$GLOBALS["ACBankAmount"];   // 총결제금액(결제대상금액+ 수수료)
                $rACBankRespCode	    =	$GLOBALS["ACBankRespCode"];   // 오류코드
                $rACMessage1		    =	trim($GLOBALS["ACMessage1"]);   // 오류 message 1
                $rACMessage2		    =	trim($GLOBALS["ACMessage2"]);   // 오류 message 2
                $rACFiller				=	$GLOBALS["ACFiller"];   // 예비

                $authNoUtf8 = trim($GLOBALS["ACBankRespCode"]);
                $message1Utf8 = iconv("CP949", "UTF-8", $rACMessage1);
                $message2Utf8 = iconv("CP949", "UTF-8", $rACMessage2);
            }
        } else if ($cancelData->method == ORDER_METHOD_PHONE) {
            if (SendSocket("1")) {
                $rApprovalType  = $GLOBALS["ApprovalType"];
                $rTransactionNo = $GLOBALS["MTransactionNo"];  // 거래번호
                $rStatus		= $GLOBALS["MStatus"];		  		// 상태 O : 승인, X : 거절
                $rTradeDate		= $GLOBALS["MTradeDate"];      // 거래일자
                $rTradeTime		= $GLOBALS["MTradeTime"];      // 거래시간
                $rRespCode		= $GLOBALS["MRespCode"];       // 응답코드
                $rRespMsg		= trim($GLOBALS["MRespMsg"]);        // 응답메시지

                $authNoUtf8 = trim($GLOBALS["MRespCode"]);
                $message1Utf8 = iconv("CP949", "UTF-8", $rRespMsg);
                $message2Utf8 = '';
            }
        }

        ///////////////////////////////// ksnet 취소 끝 ////////////////////////
        if ($rStatus !== "X") {
            $responseData->result = true;
        } else {
            $responseData->result = false;
            $responseData->message = sprintf("취소거절(오류코드: %s, %s | %s)", $authNoUtf8, $message1Utf8, $message2Utf8);
        }

        return $responseData;
    }
}