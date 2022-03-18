<?php

/**
 * Description of PgForbizKcp
 * @author Hong
 */
class PgForbizKcp extends PgForbiz
{
    /**
     * ※ 주의 ※ BIN 절대 경로 입력 (bin전까지 설정)
     * @var
     */
    private $g_conf_home_dir;

    /**
     * Window 일때만 사용
     * pub.key 파일의 절대 경로 설정(파일명을 포함한 경로로 설정)
     * @var
     */
    private $g_conf_key_dir;

    /**
     * g_conf_log_dir 변수 설정
     * @var
     */
    private $g_conf_log_dir;

    /**
     * log 경로 지정
     * @var type
     */
    private $g_conf_log_path;

    /**
     * g_conf_gw_url
     * @var type
     */
    private $g_conf_gw_url;

    /**
     * g_conf_js_url
     * @var
     */
    private $g_conf_js_url;

    /**
     * 스마트폰 SOAP 통신 설정
     * @var
     */
    private $g_wsdl;

    /**
     * 사이트코드(site_cd)
     * @var
     */
    private $g_conf_site_cd;

    /**
     * 사이트키(site_key)
     * @var
     */
    private $g_conf_site_key;

    /**
     * g_conf_site_name 설정
     * @var
     */
    private $g_conf_site_name;

    /**
     * 복합과세 사용 여부
     * @var string
     */
    private $tax_use_yn;

    /**
     * 지불 데이터 셋업 (변경 불가)
     * @var
     */
    private $g_conf_log_level = "3";
    private $g_conf_gw_port = "8090";

    /**
     * kcp 라이브러리 클레스
     * @var bool
     */
    private $c_PayPlus = false;

    public function __construct($agentType)
    {
        parent::__construct($agentType);

        $this->g_conf_home_dir = __DIR__ . '/kcp/';
        $this->g_conf_key_dir = __DIR__ . '/kcp/bin/pub.key';
        $this->g_conf_site_name = ForbizConfig::getPaymentConfig('site_name', 'kcp');
        $this->tax_use_yn = ForbizConfig::getPaymentConfig('tax_use_yn', 'kcp');

        if (ForbizConfig::getPaymentConfig('service_type', 'kcp') == 'service') {
            $this->g_conf_gw_url = 'paygw.kcp.co.kr';
            $this->g_conf_js_url = 'https://pay.kcp.co.kr/plugin/payplus_web.jsp';
            $this->g_wsdl = $this->g_conf_home_dir . 'real_KCPPaymentService.wsdl';
            $this->g_conf_site_cd = ForbizConfig::getPaymentConfig('site_cd', 'kcp');
            $this->g_conf_site_key = ForbizConfig::getPaymentConfig('site_key', 'kcp');
        } else {
            $this->g_conf_gw_url = 'testpaygw.kcp.co.kr';
            $this->g_conf_js_url = 'https://testpay.kcp.co.kr/plugin/payplus_web.jsp';
            $this->g_wsdl = $this->g_conf_home_dir . 'KCPPaymentService.wsdl';
            $this->g_conf_site_cd = 'T0000';
            $this->g_conf_site_key = '3grptw1.zW0GSo4PQdaGvsF__';
        }
    }

    private function kakaopayChangeGconf()
    {
        //카카오 페이 테스트는 service_type 이 service 일때만 가능
//        $this->g_conf_site_cd = '';
//        $this->g_conf_site_key = '';
    }

    public function doCancel(PgForbizCancelData $cancelData, PgForbizResponseData $responseData): PgForbizResponseData
    {
        //카카오 페이 설정
        if ($cancelData->method == ORDER_METHOD_INAPP_KAKAOPAY) {
            $this->kakaopayChangeGconf();
        }

        $this->g_conf_log_path = $cancelData->logPath;

        $this->loadPayPlus();

        $this->c_PayPlus->mf_set_modx_data("tno", $cancelData->tid);  // KCP 원거래 거래번호
        $this->c_PayPlus->mf_set_modx_data("mod_ip", $this->input->server("REMOTE_ADDR"));  // 변경 요청자 IP
        $this->c_PayPlus->mf_set_modx_data("mod_desc", $cancelData->message);  // 변경 사유

        //가상 계좌일때
        if ($cancelData->method == ORDER_METHOD_VBANK) {
            $this->c_PayPlus->mf_set_modx_data("mod_bankcode", $this->getBankCode($cancelData->bankCode));      // 환불 요청 은행 코드
            $this->c_PayPlus->mf_set_modx_data("mod_account", $cancelData->bankNumber);      // 환불 요청 계좌
            $this->c_PayPlus->mf_set_modx_data("mod_depositor", $cancelData->bankOwner);      // 환불 요청 계좌주명
            $this->c_PayPlus->mf_set_modx_data("mod_comp_type", 'MDCP01');      // 계좌인증 + 환불등록 – MDCP01, (계좌+실명)인증 + 환불등록 – MDCP02
//            if ($mod_comp_type == "MDCP02") {
//                $this->c_PayPlus->mf_set_modx_data("mod_socno", $mod_socno);      // 실명확인 주민번호
//                $this->c_PayPlus->mf_set_modx_data("mod_socname", $cancelData->bankOwner);      // 실명확인 성명
//            }

            if ($cancelData->isPartial) {
                $modeType = 'STPD';
                if ($this->tax_use_yn == 'Y') {
                    $this->c_PayPlus->mf_set_modx_data("mod_sub_type", "MDSC04");      // 변경 유형 - 복합과세 부분환불
                } else {
                    $this->c_PayPlus->mf_set_modx_data("mod_sub_type", "MDSC03");      // 변경 유형 - 부분환불
                }
            } else {
                $modeType = 'STHD';
                $this->c_PayPlus->mf_set_modx_data("mod_sub_type", "MDSC00");      // 변경 유형 - 전체환불
            }
        } else {
            if ($cancelData->isPartial) {
                $modeType = 'STPC';
            } else {
                $modeType = 'STSC';
            }
        }

        $this->c_PayPlus->mf_set_modx_data("mod_type", $modeType); // 전체취소 STSC / 부분취소 STPC / 가상계좌 전체 환불 STHD / 가상계좌 부분 환불 STPD

        if ($cancelData->isPartial) {
            $this->c_PayPlus->mf_set_modx_data("mod_mny", $cancelData->amt); // 취소요청 금액
            $this->c_PayPlus->mf_set_modx_data("rem_mny", ($cancelData->amt + $cancelData->expectedRestAmt)); // 부분취소 이전에 남은 금액
            if ($this->tax_use_yn == 'Y') {
                $this->c_PayPlus->mf_set_modx_data("tax_flag", "TG03");  // 복합과세 거래 구분 값입니다. (복합과세)

                $mod_tax_mny = round($cancelData->taxAmt / 1.1);
                $this->c_PayPlus->mf_set_modx_data("mod_tax_mny", (string)$mod_tax_mny);  // 공급가 부분취소 요청금액(복합과세)
                $this->c_PayPlus->mf_set_modx_data("mod_vat_mny", (string)($cancelData->taxAmt - $mod_tax_mny));  // 부가세 부분취소 요청금액 (복합과세)
                $this->c_PayPlus->mf_set_modx_data("mod_free_mny", (string)$cancelData->taxExAmt);  // 비과세 부분취소 요청금액 (복합과세)
            }
        }

        $this->odPayPlus("00200000", $cancelData->oid);

        if ($this->c_PayPlus->m_res_cd == '0000') {
            $responseData->result = true;
        } else {
            $responseData->result = false;
            $responseData->message = $this->c_PayPlus->m_res_msg;
        }
        return $responseData;
    }

    private function loadPayPlus()
    {
        if ($this->c_PayPlus === false) {
            if (is_windows()) {
                require_once __DIR__ . "/kcp/windows/pp_cli_hub_lib.php";
            } else {
                require_once __DIR__ . "/kcp/linux/pp_cli_hub_lib.php";
            }
            $this->c_PayPlus = new C_PP_CLI;
        }
        $this->c_PayPlus->mf_clear();
    }

    private function odPayPlus($tran_cd, $ordr_idxx)
    {
        if (is_windows()) {
            $this->c_PayPlus->mf_do_tx("", $this->g_conf_home_dir, $this->g_conf_site_cd, $this->g_conf_site_key, $tran_cd, "",
                $this->g_conf_gw_url, $this->g_conf_gw_port, "payplus_cli_slib", $ordr_idxx,
                $this->input->server("REMOTE_ADDR"), $this->g_conf_log_level, 0, 0, $this->g_conf_key_dir, $this->g_conf_log_path); // 응답 전문 처리
        } else {
            $this->c_PayPlus->mf_do_tx("", $this->g_conf_home_dir, $this->g_conf_site_cd, $this->g_conf_site_key, $tran_cd, "",
                $this->g_conf_gw_url, $this->g_conf_gw_port, "payplus_cli_slib", $ordr_idxx,
                $this->input->server("REMOTE_ADDR"), $this->g_conf_log_level, 0, 0, $this->g_conf_log_path); // 응답 전문 처리
        }

        //인코딩 변환
        foreach ($this->c_PayPlus->m_res_data as $key => $val) {
            $this->c_PayPlus->m_res_data[$key] = iconv('EUC-KR', 'UTF-8', $val);
        }
        //결과 값도 변경
        $this->c_PayPlus->m_res_cd = $this->c_PayPlus->m_res_data["res_cd"];
        $this->c_PayPlus->m_res_msg = $this->c_PayPlus->m_res_data["res_msg"];
    }

    private function getBankCode($bankCode)
    {
        $data = [
            "su" => "BK02", "ku" => "BK03", "km" => "BK04", "yh" => "BK81",
            "ss" => "BK07", "nh" => "BK11", "nh2" => "BK11", "ch" => "",
            "wr" => "BK20", "sh" => "BK88", "jh" => "BK88", "shjh" => "BK88",
            "sc" => "BK23", "hn" => "BK81", "hn2" => "BK81", "hc" => "BK27",
            "dk" => "BK31", "bs" => "BK32", "kj" => "BK34", "jj" => "BK35",
            "jb" => "BK37", "gw" => "", "kn" => "BK39", "bc" => "",
            "ct" => "BK27", "hks" => "", "po" => "BK71", "ph" => "BK20",
            "ssg" => "", "sl" => "BK64", "sk" => "BK45", "sn" => "BK48",
            "sj" => "", "hsbc" => "BK54"
        ];

        return $data[$bankCode] ?? '';
    }
}
