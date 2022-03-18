<?php
/*****************************************************************************/
/* FILE NAME : KSPayApprovalCancel.php
/*  AUTHOR : kspay@ksnet.co.kr
/*  DATE : 2005-09-01]
/*  Version : V1.1
/*                                                         http://www.kspay.co.kr
/*                                                         http://www.ksnet.co.kr
/*                                  Copyright 2003 KSNET, Co. All rights reserved
/*****************************************************************************/
/*****************************************************************************/
/* 자리수 맞추는 함수               */
/* $TSTR : 입력 스트링               */
/* $TLEN : 길이                */
/* $TAG  : 스페이스로 대치 할건지 (프로그램시 화면에서 단지 보기위함 )   */
/*****************************************************************************/
function format_string($TSTR,$TLEN,$TAG)
{
    if ( !isset($TSTR) ) {
        for ( $i=0 ; $i < $TLEN ; $i++ ) {
            if( $TAG == 'Y' ) {
                $TSTR = $TSTR.chr(32);
            } else {
                $TSTR = $TSTR.'+';
            }
        }
    }
    $TSTR = trim($TSTR);
    $TSTR = stripslashes($TSTR);
    // 입력자료가 길이보다 긴 경우 자르고 한글처리
    if ( strlen($TSTR) > $TLEN ) {
        // $flag == 1 이면 그 바이트는 한글의 시작 바이트 이라서 거기까지 자르게 되면
        // 한글이 깨지게 되는 현상이 발생합니다.
        $flag = 0;
        for($i=0 ; $i< $TLEN ; $i++) {
            $j = ord($TSTR[$i]); // 문자의 ASCII 값을 구합니다.
            // 구한 ASCII값이 127보다 크면 그 바이트가 한글의 시작바이트이거나 끝바이트(?)라는 뜻이죠.
            if($j > 127) {
                if( $flag ) $flag = 0; // $flag 값이 존재한다는 것은 이번 문자는 한글의 끝바이트이기 때문에
                // $flag 를 0으로 해줍니다.
                else $flag = 1; // 값이 존재하지 않으면 한글의 시작바이트이죠. 그러므로 $flag 는 1!
            } else $flag = 0; // 다른 숫자나 영문일때는 그냥 넘어가면 되겠죠.
        }
        if( $flag ) {
            // 이렇게 해서 마지막 문자까지의 $flag를 계산해서 $flag가 존재하면
            $TSTR = substr($TSTR, 0, $TLEN - 1);
            if( $TAG == 'Y' ) {
                $TSTR = $TSTR.chr(32);
            } else {
                $TSTR = $TSTR.'+';
            }
        } else {
            // 한바이트를 더해서 자르던지 빼서 자르던지 해야겠죠.
            $TSTR = substr($TSTR, 0, $TLEN); // 아님 말구....
        }
        return $TSTR; // 이제 결정된 스트링을 반환합니다.
        // 입력자료가 길이보다 작은 경우 SPACE로 채운다
    } else if ( strlen($TSTR) < $TLEN ) {
        $TLENGTH = strlen($TSTR);
        for ( $i=0 ; $i < $TLEN - $TLENGTH; $i++ ) {
            if( $TAG == 'Y' ) {
                $TSTR = $TSTR.chr(32);
            } else {
                $TSTR = $TSTR.'+';
            }
        }
        return ($TSTR);
        // 입력자료가 길이와 같은경우
    } else if ( strlen($TSTR) == $TLEN ) {
        return ($TSTR);
    }
}

function SetZero($str, $len)
{
    $strBuf = "";

    for ( $i = 0 ; $i < ( $len - strlen($str) ) ; $i++ ) $strBuf .='0';
    return $strBuf.$str;
}

function SetLogMsg($str)
{
    $strBuf = "";

    for ($i = 0; $i < strlen($str); $i++)
    {
        if(substr($str,$i,1) == " ")
            $strBuf .= "_";
        else
            $strBuf .= substr($str,$i,1);
    }
    return $strBuf;
}
?>
<?php
global $PGIPAddr  ;
global $PGPort    ;

global $HeadMsg   ;
global $DataMsg   ;
global $SendMsg   ;
global $ReceiveMsg;
global $port     ;
global $SendURL   ;
global $SendURLMsg;

global $SendCount;
$SendCount = 0;
global $ReceiveCount;
$ReceiveCount = 0;

	// Haeder
	global $EncType 		;	// 0: 암화안함, 1:openssl, 2: seed
	global $Version 		;	// 전문버전
	global $VersionType 	;	// 구분
	global $Resend 		;	// 전송구분 : 0 : 처음,  2: 재전송
	global $RequestDate 	;	// 요청일자 : yyyymmddhhmmss
	global $StoreId 		;	// 상점아이디
	global $OrderNumber 	;	// 주문번호
	global $UserName 		;	// 주문자명
	global $IdNum 			;	// 주민번호 or 사업자번호
	global $Email 			;	// email
	global $GoodType 		;	// 제품구분 1 : 실물, 2 : 디지털
	global $GoodName 		;	// 제품명
	global $KeyInType 		;	// KeyInType 여부 : S : Swap, K: KeyInType
	global $LineType 		;	// lineType 0 : offline, 1:internet, 2:Mobile
	global $PhoneNo 		;	// 휴대폰번호
	global $ApprovalCount	;	// 복합결제건수
	global $HaedFiller		;	// 예비

 	// 신용카드승인결과
	global $ApprovalType    ;	// 승인구분
	global $TransactionNo   ;	// 거래번호
	global $Status          ;	// 상태 O : 승인 , X : 거절
	global $TradeDate       ;	// 거래일자
	global $TradeTime       ;	// 거래시간
	global $IssCode         ;	// 발급사코드
	global $AquCode         ;	// 매입사코드
	global $AuthNo          ;	// 승인번호 or 거절시 오류코드
	global $Message1        ;	// 메시지1
	global $Message2        ;	// 메시지2
	global $CardNo          ;	// 카드번호
	global $ExpDate         ;	// 유효기간
	global $Installment     ;	// 할부
	global $Amount          ;	// 금액
	global $MerchantNo      ;	// 가맹점번호
	global $AuthSendType    ;	// 전송구분
	global $ApprovalSendType;	// 전송구분(0 : 거절, 1 : 승인, 2: 원카드)
	global $Point1			 ;  //
	global $Point2			 ;  //
	global $Point3			 ;  //
	global $Point4			 ;  //
	global $VanTransactionNo;	// Van 거래번호
	global $Filler          ;	// 예비
	global $AuthType		 ;  // ISP : ISP거래, MP1, MP2 : MPI거래, SPACE : 일반거래
	global $MPIPositionType ;	// K : KSNET, R : Remote, C : 제3기관, SPACE : 일반거래
	global $MPIReUseType    ;	// Y : 재사용, N : 재사용아님
	global $EncData		 ;	// MPI, ISP 데이터

	// 가상계좌승인결과
	global $VATransactionNo;   //거래번호
	global $VAStatus	    ;   //상태
	global $VATradeDate    ;   //거래일자
	global $VATradeTime    ;   //거래시간
	global $VABankCode	    ;   //은행코드
	global $VAVirAcctNo    ;   //가상계좌번호
	global $VAName		    ;   //예금주명
	global $VACloseDate	;   //마감일
	global $VACloseTime	;   //마감시간
	global $VARespCode     ;	//응답코드
	global $VAMessage1	    ;   //메시지1
	global $VAMessage2	    ;   //메시지2
	global $VAFiller	    ;   //

	// 현금영수증승인결과
	global $HTransactionNo;			// 거래번호
	global $HStatus;			// 오류구분 O:정상 X:거절
	global $HCashTransactionNo;		// 현금영수증 거래번호
	global $HIncomeType;			// 0: 소득      1: 비소득
	global $HTradeDate;			// 거래 개시 일자
	global $HTradeTime;			// 거래 개시 시간
	global $HMessage1;			// 응답 message1
	global $HMessage2;			// 응답 message2
	global $HCashMessage1;			// 국세청 메시지 1
	global $HCashMessage2;			// 국세청 메시지 2
	global $HFiller;			// 예비

	// 휴대폰결제결과
	global $MTransactionNo;			// 거래번호
	global $MStatus;			// 오류구분 O:정상 X:거절
	global $MTradeDate;			// 거래 일자
	global $MTradeTime;			// 거래 시간
	global $MBalAmount;			// 잔액
	global $MRespCode;			// 응답코드
	global $MRespMsg;			// 거래 개시 시간
	global $MBypassMsg;			// Echo항목
	global $MCompCode;			// 업체코드
	global $MTid;				// 서비스제공업체 승인번호
	global $MCommSele;			// SKT,KTF,LGT
	global $MMobileNo;			// 휴대폰번호
	global $MApprAmt;			// 승인금액
	global $MCpId;					// 업체등록코드
	global $MFiller;			// 예비

	// 계좌이체승인결과
	global $ACTransactionNo	;	//  거래번호
	global $ACStatus           	;	//  오류구분 :승인 X:거절
	global $ACTradeDate        	;	//  거래 개시 일자(YYYYMMDD)
	global $ACTradeTime        	;	//  거래 개시 시간(HHMMSS)
	global $ACAcctSele         	;	//  계좌이체 구분 -	1:Dacom, 2:Pop Banking,	3:실시간계좌이체 4: 승인형계좌이체
	global $ACFeeSele          	;	//  선/후불제구분 -	1:선불,	2:후불
	global $ACInjaName         	;	//  인자명(통장인쇄메세지-상점명)
	global $ACPareBankCode     	;	//  입금모계좌코드
	global $ACPareAcctNo       	;	//  입금모계좌번호
	global $ACCustBankCode     	;	//  출금모계좌코드
	global $ACCustAcctNo       	;	//  출금모계좌번호
	global $ACAmount	        ;	//  금액	(결제대상금액)
	global $ACBankTransactionNo	;	//  은행거래번호
	global $ACIpgumNm          	;	//  입금자명
	global $ACBankFee          	;	//  계좌이체 수수료
	global $ACBankAmount       	;	//  총결제금액(결제대상금액+ 수수료
	global $ACBankRespCode     	;	//  오류코드
	global $ACMessage1         	;	//  오류 message 1
	global $ACMessage2         	;	//  오류 message 2
	global $ACFiller           	;	//  예비

	function KSPayApprovalCancel($addr, $port)
    {
        $GLOBALS["PGIPAddr"] = $addr;
        $GLOBALS["PGPort"]   = $port;

        $GLOBALS["SendCount"] = 0;
        $GLOBALS["ReceiveCount"] = 0;
        $GLOBALS["SendMsg"] = "";

        return true;
    }

	function HeadMessage (
        $EncType,               // EncType		 : 0: 암화안함, 1:openssl, 2: seed
        $Version,               // Version		 : 전문버전
        $VersionType,           // VersionType	 : 구분
        $Resend,                // Resend		 : 전송구분 : 0 : 처음,  2: 재전송
        $RequestDate,           // RequestDate	 : 요청일자 : yyyymmddhhmmss
        $StoreId,               // StoreId		 : 상점아이디
        $OrderNumber,           // OrderNumber	 : 주문번호
        $UserName,              // UserName		 : 주문자명
        $IdNum,                 // IdNum		 : 주민번호 or 사업자번호
        $Email,                 // Email		 : email
        $GoodType,              // GoodType		 : 제품구분 0 : 실물, 1 : 디지털
        $GoodName,              // GoodName		 : 제품명
        $KeyInType,             // KeyInType	 : KeyInType 여부 : S : Swap, K: KeyInType
        $LineType,              // LineType		 : lineType 0 : offline, 1:internet, 2:Mobile
        $PhoneNo,               // PhoneNo		 : 휴대폰번호
        $ApprovalCount,         // ApprovalCount : 복합승인갯수
        $Filler)                // Filler 		 : 예비
    {
        $TmpHeadMsg = "";

        $EncType       = format_string($EncType,        1, "Y");
        $Version       = format_string($Version,        4, "Y");
        $VersionType   = format_string($VersionType,    2, "Y");
        $Resend        = format_string($Resend,         1, "Y");
        $RequestDate   = format_string($RequestDate,   14, "Y");
        $StoreId       = format_string($StoreId,       10, "Y");
        $OrderNumber   = format_string($OrderNumber,   50, "Y");
        $UserName      = format_string($UserName,      50, "Y");
        $IdNum         = format_string($IdNum,         13, "Y");
        $Email         = format_string($Email,         50, "Y");
        $GoodType      = format_string($GoodType,       1, "Y");
        $GoodName      = format_string($GoodName,      50, "Y");
        $KeyInType     = format_string($KeyInType,      1, "Y");
        $LineType      = format_string($LineType,       1, "Y");
        $PhoneNo       = format_string($PhoneNo,   12, "Y"); //format_string("0"+$PhoneNo,   12, "Y");
        $ApprovalCount = format_string($ApprovalCount,  1, "Y");
        $Filler        = format_string($Filler,       35, "Y");

        $TmpHeadMsg = 	$EncType       .
            $Version       .
            $VersionType   .
            $Resend        .
            $RequestDate   .
            $StoreId       .
            $OrderNumber   .
            $UserName      .
            $IdNum         .
            $Email         .
            $GoodType      .
            $GoodName      .
            $KeyInType     .
            $LineType      .
            $PhoneNo       .
            $ApprovalCount .
            $Filler        ;

        $GLOBALS["HeadMsg"]  = $TmpHeadMsg;

        return true;
    }

	// 신용카드승인요청 Body 1
	function CreditDataMessage(
        $ApprovalType,        // ApprovalType	 : 승인구분
        $InterestType,        // InterestType    : 일반/무이자구분 1:일반 2:무이자
        $TrackII,             // TrackII		 : 카드번호=유효기간  or 거래번호
        $Installment,         // Installment	 : 할부  00일시불
        $Amount,              // Amount			 : 금액
        $Passwd,              // Passwd			 : 비밀번호 앞2자리
        $IdNum,               // IdNum		     : 주민번호  뒤7자리, 사업자번호10
        $CurrencyType,        // CurrencyType	 : 통화구분 0:원화 1: 미화
        $BatchUseType,        // BatchUseType	 : 거래번호배치사용구분  0:미사용 1:사용
        $CardSendType,        // CardSendType	 : 카드정보전송 0:미정송 1:카드번호,유효기간,할부,금액,가맹점번호 2:카드번호앞14자리 + "XXXX",유효기간,할부,금액,가맹점번호
        $VisaAuthYn,          // VisaAuthYn		 : 비자인증유무 0:사용안함,7:SSL,9:비자인증
        $Domain,              // Domain			 : 도메인 자체가맹점(PG업체용)
        $IpAddr,              // IpAddr			 : IP ADDRESS 자체가맹점(PG업체용)
        $BusinessNumber,      // BusinessNumber   : 사업자 번호 자체가맹점(PG업체용)
        $Filler,              // Filler		     : 예비
        $AuthType,            // AuthType		 : ISP : ISP거래, MP1, MP2 : MPI거래, SPACE : 일반거래
        $MPIPositionType,     // MPIPositionType  : K : KSNET, R : Remote, C : 제3기관, SPACE : 일반거래
        $MPIReUseType,        // MPIReUseType   	 : Y :  재사용, N : 재사용아님
        $EncData)             // EndData          : MPI, ISP 데이터
    {
        $TmpSendMsg = "";

        $ApprovalType	 = format_string($ApprovalType         ,   4, "Y");
        $InterestType	 = format_string($InterestType         ,   1, "Y");
        $TrackII		 = format_string($TrackII              ,  40, "Y");
        $Installment	 = format_string(SetZero($Installment,2),   2, "Y");
        $Amount			 = format_string(SetZero($Amount,9)    ,   9, "Y");
        $Passwd			 = format_string($Passwd               ,   2, "Y");
        $IdNum			 = format_string($IdNum                ,  10, "Y");
        $CurrencyType	 = format_string($CurrencyType         ,   1, "Y");
        $BatchUseType	 = format_string($BatchUseType         ,   1, "Y");
        $CardSendType	 = format_string($CardSendType         ,   1, "Y");
        $VisaAuthYn		 = format_string($VisaAuthYn           ,   1, "Y");
        $Domain			 = format_string($Domain               ,  40, "Y");
        $IpAddr			 = format_string($IpAddr               ,  20, "Y");
        $BusinessNumber	 = format_string($BusinessNumber       ,  10, "Y");
        $Filler			 = format_string($Filler               , 135, "Y");
        $AuthType		 = format_string($AuthType             ,   1, "Y");
        $MPIPositionType = format_string($MPIPositionType      ,   1, "Y");
        $MPIReUseType    = format_string($MPIReUseType         ,   1, "Y");

        $TmpSendMsg   = $ApprovalType	  .
            $InterestType	  .
            $TrackII		  .
            $Installment	  .
            $Amount		 	  .
            $Passwd		 	  .
            $IdNum			  .
            $CurrencyType	  .
            $BatchUseType	  .
            $CardSendType	  .
            $VisaAuthYn	 	  .
            $Domain		 	  .
            $IpAddr		 	  .
            $BusinessNumber   .
            $Filler		 	  .
            $AuthType		  .
            $MPIPositionType  .
            $MPIReUseType     .
            $EncData          ;

        $GLOBALS["SendMsg"] .=  $TmpSendMsg;

        $GLOBALS["SendCount"] .=  1;

        return true;
    }

		// 가상계좌
	function VirtualAccountDataMessage(
        $ApprovalType,         // ApprovalType      : 승인구분
        $BankCode,             // BankCode          : 은행코드
        $Amount,               // Amount            : 금액
        $CloseDate,            // CloseDate         : 마감일자
        $CloseTime,            // CloseTime         : 마감시간
        $EscrowSele,           // EscrowSele        : 에스크로적용구분: 0:적용안함, 1:적용, 2:강제적용
        $VirFixSele,           // VirFixSele        : 발급원거래 재사용구분
        $OrgVirAcctNo,         // OrgVirAcctNo      : 발급원거래 계좌번호
        $OrgTransactionNo,     // OrgTransactionNo  : 발급원거래 거래번호
        $Filler)       // Filler       : 예비
    {
        $TmpSendMsg = "";

        $ApprovalType		= format_string($ApprovalType    ,  4, "Y");
        $BankCode			= format_string($BankCode        ,  6, "Y");
        $Amount				= format_string(SetZero($Amount, 9),9, "Y");
        $CloseDate      	= format_string($CloseDate      	,  8, "Y");
        $CloseTime      	= format_string($CloseTime      	,  6, "Y");
        $EscrowSele   		= format_string($EscrowSele   		,  1, "Y");
        $VirFixSele     	= format_string($VirFixSele     	,  1, "Y");
        $OrgVirAcctNo   	= format_string($OrgVirAcctNo   	,  15, "Y");
        $OrgTransactionNo	= format_string($OrgTransactionNo	,  12, "Y");
        $Filler	            = format_string($Filler	            , 52, "Y");

        $TmpSendMsg  	= $ApprovalType 	 .
            $BankCode     	 .
            $Amount       	 .
            $CloseDate      	 .
            $CloseTime      	 .
            $EscrowSele   	 .
            $VirFixSele     	 .
            $OrgVirAcctNo   	 .
            $OrgTransactionNo	 .
            $Filler        ;

        $GLOBALS["SendMsg"] .=  $TmpSendMsg;
        $GLOBALS["SendCount"] .= 1;
        return true;
    }

	// 현금영수증
	function CashBillDataMessage(
        $ApprovalType  ,//H000:일반발급, H200:계좌이체, H600:가상계좌
        $TransactionNo ,//입금완료된 계좌이체, 가상계좌 거래번호
        $IssuSele      ,//0:일반발급(PG원거래번호 중복체크), 1:단독발급(주문번호 중복체크 : PG원거래 없음), 2:강제발급(중복체크 안함)
        $UserInfoSele  ,//0:주민등록번호, 1:사업자번호, 2:카드번호, 3:휴대폰번호, 4:기타
        $UserInfo      ,//주민등록번호, 사업자번호, 카드번호, 휴대폰번호, 기타
        $TranSele      ,//0: 개인, 1: 사업자
        $CallCode      ,//통화코드  (0: 원화, 1: 미화)
        $SupplyAmt     ,//공급가액
        $TaxAmt        ,//세금
        $SvcAmt        ,//봉사료
        $TotAmt        ,//현금영수증 발급금액
        $Filler)		  //예비
    {
        $ApprovalType	= format_string($ApprovalType           ,      4, "Y");
        $TransactionNo	= format_string($TransactionNo          ,     12, "Y");
        $IssuSele		= format_string($IssuSele               ,      1, "Y");
        $UserInfoSele	= format_string($UserInfoSele           ,      1, "Y");
        $UserInfo		= format_string($UserInfo               ,     37, "Y");
        $TranSele		= format_string($TranSele               ,      1, "Y");
        $CallCode		= format_string($CallCode               ,      1, "Y");
        $SupplyAmt		= format_string(SetZero($SupplyAmt ,9)  ,      9, "Y");
        $TaxAmt			= format_string(SetZero($TaxAmt    ,9)  ,      9, "Y");
        $SvcAmt			= format_string(SetZero($SvcAmt    ,9)  ,      9, "Y");
        $TotAmt			= format_string(SetZero($TotAmt    ,9)  ,      9, "Y");
        $Filler			= format_string($Filler                 ,    147, "Y");

        $TmpSendMsg     = $ApprovalType	.
            $TransactionNo.
            $IssuSele		.
            $UserInfoSele	.
            $UserInfo		.
            $TranSele		.
            $CallCode		.
            $SupplyAmt	.
            $TaxAmt		.
            $SvcAmt		.
            $TotAmt		.
            $Filler		;

        $GLOBALS["SendMsg"] .=  $TmpSendMsg;
        $GLOBALS["SendCount"] .= 1;

        return true;
    }
	//휴대폰결제
	function MobileDataMessage(
        $ApprovalType, 		// 구분코드
        $TransactionNo,   // 거래번호
        $CommSele,
        //  통신사구분
        $MobileNo,
        //  휴대폰번호
        $Amount,
        //  승인금액
        $Compsele,
        //  업체코드
        $Authkey,
        //  사용자고유key
        $MobilId,
        //  사용자고유key
        $BypassMsg,
        //  BypassMsg
        $Filler)
    {
        $ApprovalType  = format_string($ApprovalType        ,    4, "Y");
        $TransactionNo = format_string($TransactionNo       ,  	12, "Y");
        $CommSele			 = format_string($CommSele            ,  	 3, "Y");
        $MobileNo			 = format_string($MobileNo           ,  	12, "Y");
        $Amount				 = format_string(SetZero($Amount , 9) ,  	 9, "Y");
        $Compsele			 = format_string($Compsele				    ,  	 1, "Y");
        $Authkey			 = format_string($Authkey             ,  128, "Y");
        $MobilId			 = format_string($MobilId             ,  	20, "Y");
        $BypassMsg		 = format_string($BypassMsg           ,  100, "Y");
        $Filler				 = format_string($Filler					    ,  111, "Y");

        $TmpSendMsg	 = 	$ApprovalType	.
            $TransactionNo	.
            $CommSele .
            $MobileNo .
            $Amount .
            $Compsele .
            $Authkey .
            $MobilId .
            $BypassMsg .
            $Filler;

        $GLOBALS["SendMsg"] .=  $TmpSendMsg;
        $GLOBALS["SendCount"] .= 1;

        return true;

    }
		// 계좌이체 시작요청전문 생성(send)
	function AcctRequest_send(
        $ApprovalType,		// ApprovalType	: 승인구분
        $AcctSele, 		// AcctSele	: 계좌이체유형구문
        $FeeSele, 		// FeeSele 	: 선/후불제구분
        $PareBankCode, 		// PareBankCode	: 모계좌은행코드
        $PareAcctNo, 		// PareAcctNo	: 모계좌번호
        $CustBankCode,		// CustBankCode	: 고객계좌은행코드
        $Amount,		// Amount	: 금액
        $InjaName,		// InjaName	: 인자명(상점명)
        $Filler)		// Filler	: 기타
    {
        $ApprovalType	= format_string($ApprovalType,		4, "Y");
        $AcctSele	= format_string($AcctSele,		1, "Y");
        $FeeSele 	= format_string($FeeSele, 		1, "Y");
        $PareBankCode	= format_string($PareBankCode,		6, "Y");
        $PareAcctNo	= format_string($PareAcctNo,	       15, "Y");
        $CustBankCode	= format_string($CustBankCode,		6, "Y");
        $Amount		= format_string(SetZero($Amount,13),   13, "Y");
        $InjaName	= format_string($InjaName,	       16, "Y");
        $Filler		= format_string($Filler,	       38, "Y");

        $TmpSendMsg	= $ApprovalType		.
            $AcctSele	.
            $FeeSele 	.
            $PareBankCode	.
            $PareAcctNo	.
            $CustBankCode	.
            $Amount		.
            $InjaName	.
            $Filler		;

        $GLOBALS["SendMsg"] .=  $TmpSendMsg;
        $GLOBALS["SendCount"] .= 1;
        return true;
    }
	// 계좌이체 인증승인 요청전문 생성
	function AcctRequest_iappr(
        $ApprovalType,		// ApprovalType 	: 승인구분 코드
        $AcctSele, 		// AcctSele            	: 계좌이체 구분 -1:Dacom, 2:Pop Banking,3:Scrapping 계좌이체, 4:승인형계좌이체, 5:금결원계좌이체
        $FeeSele, 		// FeeSele             	: 계좌이체 구분 -선/후불제구분 -1:선불,	2:후불
        $TransactionNo, 	// TransactionNo 	: 거래번호
        $BankCode, 		// BankCode        	: 입금모계좌코드
        $Amount, 		// Amount              	: 금액	(결제대상금액)
        $CustBankInja, 		// CustBankInja        	: 출금모계좌코드
        $BankTransactionNo, 	// BankTransactionNo   	: 은행거래번호
        $Filler, 		// Filler 		:
        $CertData) 		// CertData		: 인증정보
    {
        $ApprovalType 	   = format_string($ApprovalType,          4, "Y");
        $AcctSele          = format_string($AcctSele,	           1, "Y");
        $FeeSele           = format_string($FeeSele,	           1, "Y");
        $TransactionNo 	   = format_string($TransactionNo,        12, "Y");
        $BankCode          = format_string($BankCode,		   6, "Y");
        $Amount            = format_string(SetZero($Amount,13),   13, "Y");
        $CustBankInja      = format_string($CustBankInja,	  30, "Y");
        $BankTransactionNo = format_string($BankTransactionNo,	  30, "Y");
        $Filler            = format_string($Filler,		  53, "Y");

        $TmpSendMsg	   = $ApprovalType	  .
            $AcctSele         .
            $FeeSele          .
            $TransactionNo 	  .
            $BankCode         .
            $Amount           .
            $CustBankInja     .
            $BankTransactionNo.
            $Filler           .
            $CertData	  ;

        $GLOBALS["SendMsg"] .=  $TmpSendMsg;
        $GLOBALS["SendCount"] .= 1;
        return true;
    }

	function CancelDataMessage(
        $ApprovalType,     // ApprovalType,	: 승인구분
        $CancelType,       // CancelType,	: 취소처리구분 1:거래번호, 2:주문번호
        $TransactionNo,    // TransactionNo,: 거래번호
        $TradeDate,        // TradeDate,	: 거래일자
        $OrderNumber,      // OrderNumber,	: 주문번호
        $CancelData,      // 취소데이터(차후추가)
        $Refundcheck,      // 현금영수증 취소여부 (1.거래취소, 2.오류발급취소, 3.기타)
        $Filler)           // Filler : 예비
    {
        $ApprovalType   = format_string($ApprovalType,   4,  "Y");
        $CancelType	    = format_string($CancelType,     1,  "Y");
        $TransactionNo  = format_string($TransactionNo, 12,  "Y");
        $TradeDate      = format_string($TradeDate,	     8,  "Y");
        $OrderNumber    = format_string($OrderNumber,   50,  "Y");
        $CancelData			= format_string($CancelData,   42,  "Y");
        $Refundcheck		= format_string($Refundcheck,    1,  "Y"); // 현금영수증 취소여부 (1.거래취소, 2.오류발급취소, 3.기타)
        $Filler         = format_string($Filler,        32,  "Y");

        $TmpSendMsg =	$ApprovalType  .
            $CancelType    .
            $TransactionNo .
            $TradeDate     .
            $OrderNumber   .
            $CancelData     .
            $Refundcheck   .
            $Filler        ;

        $GLOBALS["SendMsg"] .=  $TmpSendMsg;
        $GLOBALS["SendCount"] .=  1;
        return true;
    }

	function SendSocket($Flag)
    {
        $pDataLen = format_string(SetZero(strlen($GLOBALS["HeadMsg"] . $GLOBALS["SendMsg"]), 4), 4, "Y");
        //echo("SendMessage=[".SetLogMsg($pDataLen . $GLOBALS["HeadMsg"] . $GLOBALS["SendMsg"])."]<br>");
        return ProcessRequest($GLOBALS["PGIPAddr"], $GLOBALS["PGPort"], $Flag, ($pDataLen . $GLOBALS["HeadMsg"] . $GLOBALS["SendMsg"]));
    }

	function ProcessRequest(
        $addr,
        $port,
        $ServiceType,
        $SendMsg)
    {
        $ret = false;

        $fp = fsockopen($addr, $port, $errno, $errstr, 60);
        if($fp) {
            fputs($fp,$SendMsg);
            while(!feof($fp)) {
                $GLOBALS["ReceiveMsg"] .= fgets($fp, 1024);
            }
        }
        //fclose($fp);
        //echo("ReceiveMessage=[".SetLogMsg($GLOBALS["ReceiveMsg"])."]<br>");

        $ret = ReceiveMessage();

        if ($ret == true) {
        }

        return $ret;
    }

	function ReceiveMessage()
    {
        $TmpReceiveMsg = "";
        $ipos = 0;

        if ($GLOBALS["ReceiveMsg"] == null || $GLOBALS["ReceiveMsg"] == "")
        {
            return false;
        }
        else
        {
            $GLOBALS["RecvLen"      ] = substr($GLOBALS["ReceiveMsg"], $ipos,  4); $ipos +=  4;
            $GLOBALS["EncType"      ] = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // 0: 암화안함, 1:openssl, 2: seed
            $GLOBALS["Version"      ] = substr($GLOBALS["ReceiveMsg"], $ipos,  4); $ipos +=  4; // 전문버전
            $GLOBALS["VersionType"  ] = substr($GLOBALS["ReceiveMsg"], $ipos,  2); $ipos +=  2; // 구분
            $GLOBALS["Resend"       ] = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // 전송구분 : 0 : 처음,  2: 재전송
            $GLOBALS["RequestDate"  ] = substr($GLOBALS["ReceiveMsg"], $ipos, 14); $ipos += 14; // 요청일자 : yyyymmddhhmmss
            $GLOBALS["StoreId"      ] = substr($GLOBALS["ReceiveMsg"], $ipos, 10); $ipos += 10; // 상점아이디
            $GLOBALS["OrderNumber"  ] = substr($GLOBALS["ReceiveMsg"], $ipos, 50); $ipos += 50; // 주문번호
            $GLOBALS["UserName"     ] = substr($GLOBALS["ReceiveMsg"], $ipos, 50); $ipos += 50; // 주문자명
            $GLOBALS["IdNum"        ] = substr($GLOBALS["ReceiveMsg"], $ipos, 13); $ipos += 13; // 주민번호 or 사업자번호
            $GLOBALS["Email"        ] = substr($GLOBALS["ReceiveMsg"], $ipos, 50); $ipos += 50; // email
            $GLOBALS["GoodType"     ] = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // 제품구분 0 : 실물, 1 : 디지털
            $GLOBALS["GoodName"     ] = substr($GLOBALS["ReceiveMsg"], $ipos, 50); $ipos += 50; // 제품명
            $GLOBALS["KeyInType"    ] = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // KeyInType 여부 : 1 : Swap, 2: KeyIn
            $GLOBALS["LineType"     ] = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // lineType 0 : offline, 1:internet, 2:Mobile
            $GLOBALS["PhoneNo"      ] = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12; // 휴대폰번호
            $GLOBALS["ApprovalCount"] = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // 승인갯수
            $GLOBALS["HaedFiller"   ] = substr($GLOBALS["ReceiveMsg"], $ipos, 35); $ipos += 35; // 예비

            $TmpReceiveMsg = $GLOBALS["RecvLen"      ] .
                $GLOBALS["EncType"      ] .
                $GLOBALS["Version"      ] .
                $GLOBALS["VersionType"  ] .
                $GLOBALS["Resend"       ] .
                $GLOBALS["RequestDate"  ] .
                $GLOBALS["StoreId"      ] .
                $GLOBALS["OrderNumber"  ] .
                $GLOBALS["UserName"     ] .
                $GLOBALS["IdNum"        ] .
                $GLOBALS["Email"        ] .
                $GLOBALS["GoodType"     ] .
                $GLOBALS["GoodName"     ] .
                $GLOBALS["KeyInType"    ] .
                $GLOBALS["LineType"     ] .
                $GLOBALS["PhoneNo"      ] .
                $GLOBALS["ApprovalCount"] .
                $GLOBALS["HaedFiller"   ] ;

            $ReceiveCount =  $GLOBALS["ApprovalCount"];
            return ReceiveDataMessage($ReceiveCount, $ipos);
        }
    }

	function ReceiveDataMessage($iCnt, $ipos)
    {
        $iCreidtCnt  = 0;
        $iVirAcctCnt = 0;
        $iPhoneCnt   = 0;

        for ($i = 0; $i < $iCnt; $i++)
        {
            $GLOBALS["ApprovalType"] = substr($GLOBALS["ReceiveMsg"], $ipos,  4); $ipos += 4;		// 승인구분

            // 신용카드
            if (substr($GLOBALS["ApprovalType"],0,1) == "1" || substr($GLOBALS["ApprovalType"],0,1) == "I")
            {
                //카드BinCheck
                if(substr($GLOBALS["ApprovalType"],1,1) == "5")
                {
                    $GLOBALS["TransactionNo"]	= substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12 ;
                    $GLOBALS["Status"]			= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1;
                    $GLOBALS["TradeDate"]		= substr($GLOBALS["ReceiveMsg"], $ipos,  8); $ipos +=  8;
                    $GLOBALS["TradeTime"]		= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                    $GLOBALS["IssCode"]		= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                    $GLOBALS["Message1"]		= substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos += 16;
                    $GLOBALS["Message2"]		= substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos += 16;

                    $TmpReceiveMsg = $GLOBALS["ApprovalType"].
                        $GLOBALS["TransactionNo"].
                        $GLOBALS["Status"].
                        $GLOBALS["TradeDate"].
                        $GLOBALS["TradeTime"].
                        $GLOBALS["IssCode"].
                        $GLOBALS["Message1"].
                        $GLOBALS["Message2"] ;
                }
                //신용카드거래
                else
                {
                    $GLOBALS["TransactionNo"   ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12; // 거래번호
                    $GLOBALS["Status"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // 상태 O : 승인, X : 거절
                    $GLOBALS["TradeDate"       ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  8); $ipos +=  8; // 거래일자
                    $GLOBALS["TradeTime"       ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6; // 거래시간
                    $GLOBALS["IssCode"         ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6; // 발급사코드
                    $GLOBALS["AquCode"         ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6; // 매입사코드
                    $GLOBALS["AuthNo"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12; // 승인번호 or 거절시 오류코드
                    $GLOBALS["Message1"        ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos += 16; // 메시지1
                    $GLOBALS["Message2"        ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos += 16; // 메시지2
                    $GLOBALS["CardNo"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos += 16; // 카드번호
                    $GLOBALS["ExpDate"         ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  4); $ipos +=  4; // 유효기간
                    $GLOBALS["Installment"     ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  2); $ipos +=  2; // 할부
                    $GLOBALS["Amount"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  9); $ipos +=  9; // 금액
                    $GLOBALS["MerchantNo"      ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 15); $ipos += 15; // 가맹점번호
                    $GLOBALS["AuthSendType"    ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // 전송구분= new String(read(2));
                    $GLOBALS["ApprovalSendType"]  = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // 전송구분(0 : 거절, 1 : 승인, 2: 원카드)
                    $GLOBALS["Point1"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12; // Point1
                    $GLOBALS["Point2"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12; // Point2
                    $GLOBALS["Point3"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12; // Point3
                    $GLOBALS["Point4"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12; // Point4
                    $GLOBALS["VanTransactionNo"]  = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12; // Point4
                    $GLOBALS["Filler"          ]  = substr($GLOBALS["ReceiveMsg"], $ipos, 82); $ipos += 82; // 예비
                    $GLOBALS["AuthType"        ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // I : ISP거래, M : MPI거래, SPACE : 일반거래
                    $GLOBALS["MPIPositionType" ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // K : KSNET, R : Remote, C : 제3기관, SPACE : 일반거래
                    $GLOBALS["MPIReUseType"    ]  = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1; // Y : 재사용, N : 재사용아님
                    $EncLen = substr($GLOBALS["ReceiveMsg"], $ipos,  5); $ipos +=  5;

                    if  ($EncLen == "")
                        $EncData   = "";
                    else
                        $GLOBALS["EncData"] = substr($GLOBALS["ReceiveMsg"], $ipos,  $EncLen);	// MPI, ISP 데이터

                    $TmpReceiveMsg = $GLOBALS["ApprovalType"    ].
                        $GLOBALS["TransactionNo"   ].
                        $GLOBALS["Status"          ].
                        $GLOBALS["TradeDate"       ].
                        $GLOBALS["TradeTime"       ].
                        $GLOBALS["IssCode"         ].
                        $GLOBALS["AquCode"         ].
                        $GLOBALS["AuthNo"          ].
                        $GLOBALS["Message1"        ].
                        $GLOBALS["Message2"        ].
                        $GLOBALS["CardNo"          ].
                        $GLOBALS["ExpDate"         ].
                        $GLOBALS["Installment"     ].
                        $GLOBALS["Amount"          ].
                        $GLOBALS["MerchantNo"      ].
                        $GLOBALS["AuthSendType"    ].
                        $GLOBALS["ApprovalSendType"].
                        $GLOBALS["Point1"          ].
                        $GLOBALS["Point2"          ].
                        $GLOBALS["Point3"          ].
                        $GLOBALS["Point4"          ].
                        $GLOBALS["VanTransactionNo"].
                        $GLOBALS["Filler"          ].
                        $GLOBALS["AuthType"        ].
                        $GLOBALS["MPIPositionType" ].
                        $GLOBALS["MPIReUseType"    ].
                        $GLOBALS["EncData"         ];
                }
            }
            //계좌이체시작요청결과
            elseif ( substr($GLOBALS["ApprovalType"],0,3) == "210" || substr($GLOBALS["ApprovalType"],0,3) == "240")
            {
                $GLOBALS["ACTransactionNo"] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos +=  12;	// 거래번호
                $GLOBALS["ACStatus"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=   1;	// 오류구분:- O:승인 X:거절
                $GLOBALS["ACTradeDate"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  8); $ipos +=   8;	// 거래 개시 일자(YYYYMMDD)
                $GLOBALS["ACTradeTime"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=   6;	// 거래 개시 시간(HHMMSS)
                $GLOBALS["ACAcctSele"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=   1;	// 계좌이체 구분 -1:Dacom, 2:Pop Banking,	3:실시간계좌이체, 4:X
                $GLOBALS["ACFeeSele"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=   1;	// 선/후불제구분 -1:선불,2:후불
                $GLOBALS["ACPareBankCode" ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=   6;	// 입금모계좌은행코드
                $GLOBALS["ACPareAcctNo"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 15); $ipos +=  15;	// 입금모계좌 번호
                $GLOBALS["ACCustBankCode" ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=   6;	// 출급은행코드
                $GLOBALS["ACAmount"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 13); $ipos +=  13;	// 금액
                $GLOBALS["ACInjaName"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos +=  16;	// 인자명(상점명)
                $GLOBALS["ACMessage1"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos +=  16;	// 응답 message1
                $GLOBALS["ACMessage2"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos +=  16;	// 응답 message2
                $GLOBALS["ACEntrNumb"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 10); $ipos +=  10;	// 사업자번호
                $GLOBALS["ACShopPhone"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 20); $ipos +=  20;	// 전화번호
                $GLOBALS["ACFiller"	  ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 49); $ipos +=  49;	// 예비

                $TmpReceiveMsg = $GLOBALS["ApprovalType"   ].
                    $GLOBALS["ACTransactionNo"].
                    $GLOBALS["ACStatus"	  ].
                    $GLOBALS["ACTradeDate"	  ].
                    $GLOBALS["ACTradeTime"	  ].
                    $GLOBALS["ACAcctSele"	  ].
                    $GLOBALS["ACFeeSele"	  ].
                    $GLOBALS["ACPareBankCode" ].
                    $GLOBALS["ACPareAcctNo"	  ].
                    $GLOBALS["ACCustBankCode" ].
                    $GLOBALS["ACAmount"	  ].
                    $GLOBALS["ACInjaName"	  ].
                    $GLOBALS["ACMessage1"	  ].
                    $GLOBALS["ACMessage2"	  ].
                    $GLOBALS["ACEntrNumb"	  ].
                    $GLOBALS["ACShopPhone"	  ].
                    $GLOBALS["ACFiller"	  ];
            }
            //계좌이체결과반영요청 , 계좌이체승인요청
            elseif  ( substr($GLOBALS["ApprovalType"],0,2) == "22" || substr($GLOBALS["ApprovalType"],0,2) == "23" || substr($GLOBALS["ApprovalType"],0,3) == "242" || ( substr($GLOBALS["ApprovalType"],0,1)=="2" && substr($GLOBALS["ApprovalType"],2,1) == "1" ) )
            {
                $GLOBALS["ACTransactionNo"	] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 12); $ipos +=  12;	// 거래번호
                $GLOBALS["ACStatus"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  1); $ipos +=   1;	// 오류구분 :승인 X:거절
                $GLOBALS["ACTradeDate"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  8); $ipos +=   8;	// 거래 개시 일자(YYYYMMDD)
                $GLOBALS["ACTradeTime"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  6); $ipos +=   6;	// 거래 개시 시간(HHMMSS)
                $GLOBALS["ACAcctSele"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  1); $ipos +=   1;	// 계좌이체 구분 - 1:Dacom, 2:Pop Banking,	3:실시간계좌이체 4: 승인형계좌이체
                $GLOBALS["ACFeeSele"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  1); $ipos +=   1;	// 선/후불제구분 - 1:선불,2:후불
                $GLOBALS["ACInjaName"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 16); $ipos +=  16;	// 인자명(통장인쇄메세지-상점명)
                $GLOBALS["ACPareBankCode"	] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  6); $ipos +=   6;	// 입금모계좌코드
                $GLOBALS["ACPareAcctNo"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 15); $ipos +=  15;	// 입금모계좌번호
                $GLOBALS["ACCustBankCode"	] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  6); $ipos +=   6;	// 출금모계좌코드
                $GLOBALS["ACCustAcctNo"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 15); $ipos +=  15;	// 출금모계좌번호
                $GLOBALS["ACAmount"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 13); $ipos +=  13;	// 금액	(결제대상금액)
                $GLOBALS["ACBankTransactionNo"	] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 30); $ipos +=  30;	// 은행거래번호
                $GLOBALS["ACIpgumNm"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 20); $ipos +=  20;	// 입금자명
                $GLOBALS["ACBankFee"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 13); $ipos +=  13;	// 계좌이체 수수료
                $GLOBALS["ACBankAmount"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 13); $ipos +=  13;	// 총결제금액(결제대상금액+ 수수료
                $GLOBALS["ACBankRespCode"	] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  4); $ipos +=   4;	// 오류코드
                $GLOBALS["ACMessage1"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 16); $ipos +=  16;	// 오류 message 1
                $GLOBALS["ACMessage2"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	 16); $ipos +=  16;	// 오류 message 2
                $GLOBALS["ACCavvSele"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	  1); $ipos +=   1;	// 암호화데이터응답여부
                $GLOBALS["ACFiller"		] 	= substr($GLOBALS["ReceiveMsg"], $ipos,	183); $ipos += 183;	// 예비
                $EncLen = substr($GLOBALS["ReceiveMsg"], $ipos,  5); $ipos +=  5;

                if  ($EncLen == "")
                    $EncData   = "";
                elseif (substr($GLOBALS["$ACCavvSele"],0,1) == "1")
                    $GLOBALS["$ACEncData"] = substr($GLOBALS["ReceiveMsg"], $ipos,  $EncLen);

                $TmpReceiveMsg = $GLOBALS["ApprovalType"   ].
                    $GLOBALS["ACTransactionNo"      ].
                    $GLOBALS["ACStatus"		].
                    $GLOBALS["ACTradeDate"		].
                    $GLOBALS["ACTradeTime"		].
                    $GLOBALS["ACAcctSele"		].
                    $GLOBALS["ACFeeSele"		].
                    $GLOBALS["ACInjaName"		].
                    $GLOBALS["ACPareBankCode"	].
                    $GLOBALS["ACPareAcctNo"		].
                    $GLOBALS["ACCustBankCode"	].
                    $GLOBALS["ACCustAcctNo"		].
                    $GLOBALS["ACAmount"		].
                    $GLOBALS["ACBankTransactionNo"  ].
                    $GLOBALS["ACIpgumNm"		].
                    $GLOBALS["ACBankFee"		].
                    $GLOBALS["ACBankAmount"		].
                    $GLOBALS["ACBankRespCode"	].
                    $GLOBALS["ACMessage1"		].
                    $GLOBALS["ACMessage2"		].
                    $GLOBALS["ACFiller"		];


                if( strlen($EncLen) == 5 )
                    $TmpReceiveMsg = $GLOBALS["ACEncData"];
            }
            // 가상계좌
            elseif (substr($GLOBALS["ApprovalType"],0,1) == "6")
            {

                $GLOBALS["VATransactionNo"] = substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12;
                $GLOBALS["VAStatus"       ] = substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1;
                $GLOBALS["VATradeDate"    ] = substr($GLOBALS["ReceiveMsg"], $ipos,  8); $ipos +=  8;
                $GLOBALS["VATradeTime"    ] = substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                $GLOBALS["VABankCode"     ] = substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                $GLOBALS["VAVirAcctNo"    ] = substr($GLOBALS["ReceiveMsg"], $ipos, 15); $ipos += 15;
                $GLOBALS["VAName"         ] = substr($GLOBALS["ReceiveMsg"], $ipos, 30); $ipos += 30;

                $GLOBALS["VACloseDate"    ] = substr($GLOBALS["ReceiveMsg"], $ipos,  8); $ipos +=  8;
                $GLOBALS["VACloseTime"    ] = substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                $GLOBALS["VARespCode"     ] = substr($GLOBALS["ReceiveMsg"], $ipos,  4); $ipos +=  4;

                $GLOBALS["VAMessage1"     ] = substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos += 16;
                $GLOBALS["VAMessage2"     ] = substr($GLOBALS["ReceiveMsg"], $ipos, 16); $ipos += 16;
                $GLOBALS["VAFiller"       ] = substr($GLOBALS["ReceiveMsg"], $ipos, 36); $ipos += 36;

                $TmpReceiveMsg = $GLOBALS["ApprovalType"   ].
                    $GLOBALS["VATransactionNo"].
                    $GLOBALS["VAStatus"       ].
                    $GLOBALS["VATradeDate"    ].
                    $GLOBALS["VATradeTime"    ].
                    $GLOBALS["VABankCode"     ].
                    $GLOBALS["VAVirAcctNo"    ].
                    $GLOBALS["VAName"         ].

                    $GLOBALS["VACloseDate"    ].
                    $GLOBALS["VACloseTime"    ].
                    $GLOBALS["VARespCode"     ].

                    $GLOBALS["VAMessage1"     ].
                    $GLOBALS["VAMessage2"     ].
                    $GLOBALS["VAFiller"       ];
            }
            // 현금영수증
            elseif (substr($GLOBALS["ApprovalType"],0,1) == "H")
            {
                $GLOBALS["HTransactionNo"] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12;
                $GLOBALS["HStatus"       ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1;
                $GLOBALS["HCashTransactionNo"] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  12); $ipos +=  12;
                $GLOBALS["HIncomeType"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1;
                $GLOBALS["HTradeDate"] 		= substr($GLOBALS["ReceiveMsg"], $ipos, 8); $ipos += 8;
                $GLOBALS["HTradeTime"       ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                $GLOBALS["HMessage1"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  16); $ipos +=  16;
                $GLOBALS["HMessage2"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  16); $ipos +=  16;
                $GLOBALS["HCashMessage2"] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  20); $ipos += 20;
                $GLOBALS["HCashMessage1"] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  20); $ipos +=  20;
                $GLOBALS["HFiller"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  150); $ipos += 150;


                $TmpReceiveMsg = $GLOBALS["ApprovalType"   ].
                    $GLOBALS["HTransactionNo"].
                    $GLOBALS["HStatus"       ].
                    $GLOBALS["HCashTransactionNo"    ].
                    $GLOBALS["HIncomeType"    ].
                    $GLOBALS["HTradeDate"      ].
                    $GLOBALS["HTradeTime"       ].
                    $GLOBALS["HMessage1"].
                    $GLOBALS["HMessage2"  ].
                    $GLOBALS["HCashMessage1"     ].
                    $GLOBALS["HCashMessage2"     ].
                    $GLOBALS["HFiller"       ];
            }
            // 휴대폰결제
            elseif (substr($GLOBALS["ApprovalType"],0,1) == "M")
            {
                if (substr($GLOBALS["ApprovalType"],0,3) == "M10")	// 결제응답
                {

                    $GLOBALS["MTransactionNo"] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12;
                    $GLOBALS["MStatus"       ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1;
                    $GLOBALS["MTradeDate"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  8); $ipos +=  8;
                    $GLOBALS["MTradeTime"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                    $GLOBALS["MBalAmount"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  9); $ipos +=  9;
                    $GLOBALS["MTid"       ] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 20); $ipos += 20;
                    $GLOBALS["MRespCode"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  4); $ipos +=  4;
                    $GLOBALS["MRespMsg"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  200); $ipos +=  200;
                    $GLOBALS["MBypassMsg"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  100); $ipos += 100;
                    $GLOBALS["MCompCode"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                    $GLOBALS["MCommSele"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  3); $ipos +=  3;
                    $GLOBALS["MMobileNo"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  12); $ipos += 12;
                    $GLOBALS["MApprAmt"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  9); $ipos +=  9;
                    $GLOBALS["MCpId"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  40); $ipos +=  40;
                    $GLOBALS["MFiller"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  66); $ipos += 66;

                    $TmpReceiveMsg = $GLOBALS["ApprovalType"   ].
                        $GLOBALS["MTransactionNo"].
                        $GLOBALS["MStatus"       ].
                        $GLOBALS["MTradeDate"    ].
                        $GLOBALS["MTradeTime"    ].
                        $GLOBALS["MBalAmount"      ].
                        $GLOBALS["MTid"       ].
                        $GLOBALS["MRespCode"].
                        $GLOBALS["MRespMsg"  ].
                        $GLOBALS["MBypassMsg"     ].
                        $GLOBALS["MCompCode"     ].
                        $GLOBALS["MCommSele"  ].
                        $GLOBALS["MMobileNo"     ].
                        $GLOBALS["MApprAmt"     ].
                        $GLOBALS["MCpId"     ].
                        $GLOBALS["MFiller"       ];
                }
                else // 취소
                {

                    $GLOBALS["MTransactionNo"] 	= substr($GLOBALS["ReceiveMsg"], $ipos, 12); $ipos += 12;
                    $GLOBALS["MStatus"       ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1;
                    $GLOBALS["MTradeDate"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  8); $ipos +=  8;
                    $GLOBALS["MTradeTime"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                    $GLOBALS["MBalAmount"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  9); $ipos +=  9;
                    $GLOBALS["MRespCode"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  4); $ipos +=  4;
                    $GLOBALS["MRespMsg"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  200); $ipos +=  200;
                    $GLOBALS["MBypassMsg"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  100); $ipos += 100;
                    $GLOBALS["MCompCode"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  6); $ipos +=  6;
                    $GLOBALS["MAnsimFlag"] 		= substr($GLOBALS["ReceiveMsg"], $ipos,  1); $ipos +=  1;
                    $GLOBALS["MFiller"    ] 	= substr($GLOBALS["ReceiveMsg"], $ipos,  149); $ipos += 149;

                    $TmpReceiveMsg = $GLOBALS["ApprovalType"   ].
                        $GLOBALS["MTransactionNo"].
                        $GLOBALS["MStatus"       ].
                        $GLOBALS["MTradeDate"    ].
                        $GLOBALS["MTradeTime"    ].
                        $GLOBALS["MBalAmount"      ].
                        $GLOBALS["MRespCode"].
                        $GLOBALS["MRespMsg"  ].
                        $GLOBALS["MBypassMsg"     ].
                        $GLOBALS["MCompCode"     ].
                        $GLOBALS["MAnsimFlag"     ].
                        $GLOBALS["MFiller"       ];
                }

            }
        }
        return true;
    }
?>

