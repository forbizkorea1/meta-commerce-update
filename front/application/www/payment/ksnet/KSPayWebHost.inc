<?php
function write_log ($strLogMsg)
{
    $LOG_HOME_DIR	= APPLICATION_ROOT . "/logs/ksnet/"; // 로그 경로 지정 (ex. C:/log/) ('/'로 끝나야 함)

    if (is_dir($LOG_HOME_DIR) === false) {
        mkdir($LOG_HOME_DIR, 0777, true);
    }

    if (empty($LOG_HOME_DIR) || "/" != substr($LOG_HOME_DIR,(strlen($LOG_HOME_DIR)-1))) return;

    $curr_time_14 = strftime("%Y%m%d%H:%M:%S");

    $strLogFile = $LOG_HOME_DIR. "kspay_" . substr($curr_time_14,0,8) . ".log";

    $strRecord = ("[" . substr($curr_time_14,8) . "]" . $strLogMsg . "\n");

    $fp	= fopen($strLogFile, "a");
    fwrite($fp,	$strRecord);
    fclose($fp);
}

class KSPayWebHost
{
    var $payKey		;
    var $rparams	;
    var $mtype		;

    var $rnames		= array();
    var $rvalues	= array();

    var $DEFAULT_DELIM = "`";
    var $DEFAULT_RPARAMS	= "authyn`trno`trddt`trdtm`amt`authno`msg1`msg2`ordno`isscd`aqucd`result`halbu`cbtrno`cbauthno";
    // authyn : O/X 상태
    // trno   : KSNET거래번호(영수증 및 취소 등 결제데이터용 KEY
    // trddt  : 거래일자(YYYYMMDD)
    // trdtm  : 거래시간(hhmmss)
    // amt    : 금액
    // authno : 승인번호(신용카드:결제성공시), 에러코드(신용카드:승인거절시), 은행코드(가상계좌,계좌이체)
    // ordno  : 주문번호
    // isscd  : 발급사코드(신용카드), 가상계좌번호(가상계좌) ,기타결제수단의 경우 의미없음
    // aqucd  : 매입사코드(신용카드)
    // result : 승인구분

    public function __construct($_payKey, $_rparams)
    {
        $this->payKey		= $_payKey;

        if (empty($_rparams) || false === strpos($_rparams,$this->DEFAULT_DELIM))
        {
            $this->rparams	= $this->DEFAULT_RPARAMS;
        }else
        {
            $this->rparams	= $_rparams;
        }

        $this->rnames	= explode($this->DEFAULT_DELIM, $this->rparams);
    }

    public function kspay_get_value($pname)
    {
        if (empty($pname) || !is_array($this->rnames) || !is_array($this->rvalues) || count($this->rnames) != count($this->rvalues)) return null;

        return $this->rvalues[$pname];
    }

    public function kspay_send_msg($_mtype)
    {
        $this->mtype = $_mtype;
        $rmsg = $this->send_url();

        if (false === strpos($rmsg,$this->DEFAULT_DELIM)) return false;

        $tmpvals = explode($this->DEFAULT_DELIM, $rmsg);

        if (count($this->rnames) < count($tmpvals))
        {
            for($i=0; $i<count($this->rnames); $i++)
            {
                $this->rvalues[$this->rnames[$i]] = $tmpvals[$i+1];
            }
            return true;
        }
    }

    var $KSPAY_WEBHOST_URI	= "/store/KSPayWebV1.4/web_host/recv_post.jsp";
    var $KSPAY_WEBHOST_HOST	= "kspay.ksnet.to";
    var $KSPAY_WEBHOST_IP	= "210.181.28.137";

    function send_url()
    {
        $rpy_msg = "";
        $post_msg = "sndCommConId=" . $this->payKey . "&sndActionType=" . $this->mtype . "&sndRpyParams=" . urlencode($this->rparams);

        $req_msg = "";
        $req_msg .= "Host: " . $this->KSPAY_WEBHOST_HOST . "\r\n";
        $req_msg .= "Accept-Language: ko\r\n";
        $req_msg .= "User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)\r\n";
        $req_msg .= "Content-type: application/x-www-form-urlencoded\r\n";
        $req_msg .= "Content-length: ".strlen($post_msg)."\r\n";
        $req_msg .= "Connection: close\r\n";

        $kspay_ipaddr = gethostbyname($this->KSPAY_WEBHOST_HOST);
        $kspay_port   = 80;

        if ($kspay_ipaddr == $this->KSPAY_WEBHOST_HOST)
        {
            $kspay_ipaddr = $this->KSPAY_WEBHOST_IP;
            write_log("CHECK: gethostbyname(" . $this->KSPAY_WEBHOST_HOST . "):X DEFALUT IP=[".$this->KSPAY_WEBHOST_IP."]");
        }

        $useSocket = true;

        if ($useSocket)
        {
            // [1. Use Http with socket interface]
            $req_msg  = ("POST " . $this->KSPAY_WEBHOST_URI . " HTTP/1.0\r\n") . $req_msg;
            $req_msg .= "\r\n";
            $req_msg .= $post_msg;
            $fp_socket = fsockopen($kspay_ipaddr, $kspay_port, $errno, $errstr, 60);
            if($fp_socket) {
                fwrite($fp_socket,$req_msg, strlen($req_msg));
                fflush($fp_socket);
                write_log("send_url(socket):send(" . $this->payKey . ",".$kspay_ipaddr.",".$kspay_port.")=[".$post_msg."]");
                while(!feof($fp_socket)) {
                    $rpy_msg .= fread($fp_socket, 8192);
                }
            }
            fclose($fp_socket);

            $rpos = strpos($rpy_msg,"\r\n\r\n");

            if ($rpos !== false) $rtn_msg = substr($rpy_msg, $rpos+4);
        }
        else
        {
            // [2. Use CURL php extension]
            // Extension Setting... (Windows IIS)
            // 1) File [php.ini] change ";extension=curl" to "extension=php_curl.dll" and
            // 	                        ";extension_dir=" to "extension_dir={php_install_dir}/ext"
            // 2) Restart apache server
            //
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $this->KSPAY_WEBHOST_HOST . $this->KSPAY_WEBHOST_URI);
            curl_setopt($ch, CURLOPT_HEADER, $req_msg);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_msg);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // get server response

            $rtn_msg = "";
            $rtn_msg = curl_exec($ch);
            write_log("send_url(curl):send(" . $this->payKey . ",".$kspay_ipaddr.",".$kspay_port.")=[".$post_msg."]");
            curl_close($ch);
        }

        write_log("send_url:recv(" . $this->payKey . ",".$kspay_ipaddr.",".$kspay_port.")=[".$rtn_msg."]");

        return $rtn_msg;
    }
}
?>