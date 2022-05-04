"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devCompanyListDeliveryTemplateObj = {
    initLang: function () {
        // 글로벌 언어셋 설정
        common.lang.load('grid.label.companyName', '업체명');
        common.lang.load('grid.label.traceUrl', '배송정보추적 URL');
        common.lang.load('grid.label.httpMethod', '전송방법');
        common.lang.load('grid.label.httpPrams', '송장번호 파라미터');
        common.lang.load('grid.label.isUse', '사용유무');
        common.lang.load('grid.label.act', '관리');
        // validation 메시지
        common.lang.load('validation.codeName.alert');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
        common.lang.load('validation.rep.check', '배송정책 템플릿 선택 해주세요.');
        common.lang.load('validation.rep.length.check', '배송정책을 2개 이상 선택해주세요.');
        common.lang.load('validation.rep.nec.check', '대표 배송정책을 선택해주세요.');

        // 에러메시지
        common.lang.load('existsCodeName.alert', '등록된 업체입니다.');
        common.lang.load('deleteCompany.confirm', '택배업체({code_name})를 삭제 하시겠습니까?');
        common.lang.load('common.dup.fail.alert', '다른 그룹에 등록되어 있는 템플릿이 포함되어 있습니다.');
        common.lang.load('common.del.fail.alert', '해당 배송정책이 설정된 상품이 있어 삭제할 수 없습니다.');


        //배송정책 템플릿 리스트
        common.lang.load('grid.label.template_name', '배송 정책명');
        common.lang.load('grid.label.delivery_company', '배송업체');
        common.lang.load('grid.label.com_name', '셀러명');
        common.lang.load('grid.label.product_sell_type', '소매/도매');
        common.lang.load('grid.label.delivery_basic_policy', '배송비 결제수단');
        common.lang.load('grid.label.delivery_package', '배송방식');
        //common.lang.load('grid.label.delivery_relation', '묶음배송 그룹여부');
        common.lang.load('grid.label.delivery_policy', '배송비 조건');

        //묶음 배송
        common.lang.load('grid.label.group_name', '묶음배송 그룹명');
        common.lang.load('grid.label.group_state', '사용여부');
        common.lang.load('grid.label.group_contents', '배송정책 템플릿');

        //교환반품 처리 리스트
        common.lang.load('grid.label.code', '코드');
        common.lang.load('grid.label.addr_name', '주소명');
        common.lang.load('grid.label.person_name', '담당자명');
        common.lang.load('grid.label.addr_phone', '전화번호');
        common.lang.load('grid.label.addr_mobile', '핸드폰번호');
        common.lang.load('grid.label.address', '상세주소');
        common.lang.load('grid.label.zip_code', '우편번호');
        common.lang.load('grid.label.basic_addr_use', '기본주소여부');



    },
    initTab: function () {
        var self = this;
        common.ui.tap($('#devTap'));
        common.ui.tap($('#devTap'), function (selector) {
            if (selector == "#devDeliveryGroup") {
                self.tapGroupDeliveryGrid();
                self.devTap = "#devDeliveryGroupForm";
                self.method = "putGroupDeliveryContents";
            } else if (selector == "#devExchangeInfo") {
                self.devTap = "#devExchangeInfoForm";
                self.method = "putExchangeInfo";
            } else if(selector == "#devShipPlaceInfo") {
                self.devTap = "#devShipPlaceInfoForm";
                self.method = "putPlaceInfo";
            }
        });

        //$('#devDeliveryList').hide();
        $('#devDeliveryGroup').hide();
        $('#devExchangeInfo').hide();
        $('#devShipPlaceInfo').hide();
    },
    devTap: "#devDeliveryGroupForm",
    method: 'putGroupDeliveryContents',
    checkValidation: function () {
        var self = this;
        if (self.devTap == "#devExchangeInfoForm" || self.devTap == "#devShipPlaceInfoForm") {
            common.validation.set($('[name=addr_name]'), {'required': true});
            common.validation.set($('[name=addr_phone_1]'), {'required': true});
            common.validation.set($('[name=addr_phone_2]'), {'required': true});
            common.validation.set($('[name=addr_phone_3]'), {'required': true});
            common.validation.set($('[name=com_zip]'), {'required': true});
            common.validation.set($('[name=com_addr1]'), {'required': true});
            common.validation.set($('[name=com_addr2]'), {'required': true});
        }else if(self.devTap == "#devDeliveryGroupForm"){
            common.validation.set($('[name=group_name]'), {'required': true});
            common.validation.set($('[name=state]'), {'required': true});
        }
    },
    initForm: function () {
        var self = this;
        $(".devSave").on('click', function () {
            common.form.init(
                    $(self.devTap),
                    common.util.getControllerUrl(self.method, 'listDeliveryTemplate', 'company'),
                    function (formData) {
                        self.checkValidation();

                        //묶음배송 그룹정책 체크
                        if(self.devTap == "#devDeliveryGroupForm"){
                            //배송정책 미선택
                            if($('input[name=rep]').length < 2) {
                                common.noti.alert(common.lang.get('validation.rep.length.check'));
                                return false;
                            }
                            //대표 배송정책 체크
                            if(typeof $('input[name=rep]:checked').val() == "undefined") {
                                common.noti.alert(common.lang.get('validation.rep.nec.check'));
                                return false;
                            }
                        }

                        if (common.validation.check($(self.devTap), 'alert', false)) {
                            return formData;
                        } else {
                            return false;
                        }
                    },
                    function (response) {
                        if (response.result == 'success') {
                            if (!$("[name=g_ix]").val() || $("[name=g_ix]").val() == 0) {
                                common.noti.alert(common.lang.get('common.add.success.alert'));
                            } else {
                                common.noti.alert(common.lang.get('common.put.success.alert'));
                            }

                            if (self.devTap == "#devDeliveryGroupForm") {
                                common.form.reset($(self.devTap));
                                $(".addTemplateBody").remove();
                                $("[name=g_ix]").val("");
                                self.groupDeliveryGrid.reload();
                            }
                        } else {
                            if (self.devTap == "#devDeliveryGroupForm" && response.data.error == 'duplaction dt ix') {
                                common.noti.alert(common.lang.get('common.dup.fail.alert'));
                            } else {
                                common.noti.alert(response.result);
                            }
                        }
                    }
            );

            $(self.devTap).submit();
        });
    },

    grid: false,
    initListDeliveryTemplateGrid: function () {
        var self = this;
        self.grid = common.ui.grid();
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [
                {key: "template_name", label: common.lang.get('grid.label.template_name'), width: 330, align: "left"},
                {key: "product_sell_type", label: common.lang.get('grid.label.product_sell_type'), width: 100, align: "center"},
                {key: "code_name", label: common.lang.get('grid.label.delivery_company'), width: 150, align: "center"},
                {key: "delivery_basic_policy", label: common.lang.get('grid.label.delivery_basic_policy'), width: 100, align: "center"},
                //{key: "delivery_relation", label: common.lang.get('grid.label.delivery_relation'), width: 120, align: "center"},
                {key: "delivery_policy", label: common.lang.get('grid.label.delivery_policy'), width: 300, align: "left"},
                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" />'
                        ].join('');
                    }
                }

            ]
        };
        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
                .setForm('#devGridForm')
                .setPagination('#devPageWrapTamplate')
                .setPageNum('#devPageNum')
                .setUseHash(false)
                .setUrl(common.util.getControllerUrl('get', 'listDeliveryTemplate', 'company'))
                .init(function (response) {
                    $('#devTotalTemplate').text(common.util.numberFormat(response.data.total));
                    self.grid.setContent(response.data.list, response.data.paging);
                });
        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.grid.getRow($(this).data('idx'));
            //  /company/manageDeliveryTemplate/
            common.util.getControllerUrl('index', 'manageDeliveryTemplate', 'company');
            document.location.href = '/company/manageDeliveryTemplate/' + row.dt_ix;
        });

        // 삭제
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.template_name}))) {
                common.ajax(common.util.getControllerUrl('delTemplate', 'listDeliveryTemplate', 'seller'),
                    {dt_ix: row.dt_ix},
                    function () {
                        // 전송전 데이타 검증
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        if (response.data.status == 'existsProduct') {
                            common.noti.alert(common.lang.get('common.del.fail.alert'));
                        } else if (response.result == 'success') {
                            self.grid.reload();
                        } else {
                            common.noti.alert(response.result);
                        }
                    }
                );
            }

        });

        //초기화
        $('#devFormReset').click(function (e) {
            common.form.reset($('#devManagePolicyForm'));
        });
    },
    groupDeliveryGrid: false,
    tapGroupDeliveryGrid: function () {
        var self = this;
        self.groupDeliveryGrid = common.ui.grid();
        var gridConfigGroup = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            columns: [
                {key: "name", label: common.lang.get('grid.label.group_name'), width: 300, align: "left"},
                {key: "group_contents", label: common.lang.get('grid.label.group_contents'), width: 300, align: "left", headerStyleClass: 'grid-multiline-column'},
                {key: "state", label: common.lang.get('grid.label.group_state'), width: 150, align: 'center', formatter: function () {
                        return (this.value == 1 ? '사용' : '미사용');
                    }
                },
                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 150, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" />'
                        ].join('');
                    }
                }

            ]
        };

        // 그리드 연동
        self.groupDeliveryGrid.setGrid($('#devPagingGorupGrid'), gridConfigGroup)
                .setForm('#devGridGroupForm')
                .setPagination('#devPageWrapTamplateGroup')
                .setPageNum('#devGroupPage')
                .setUseHash(false)
                .setUrl(common.util.getControllerUrl('getGroupDelivery', 'listDeliveryTemplate', 'company'))
                .init(function (response) {
                    self.groupDeliveryGrid.setContent(response.data.list, response.data.paging);
                });
        // 그리드 라인수 처리
        $('#devGroupMax').on('change', function () {
            $('#devGroupMax').val($(this).val());
            self.groupDeliveryGrid.formObj.submit();
        });

        $('#devPagingGorupGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.groupDeliveryGrid.getRow($(this).data('idx'));
            $("input[name=g_ix]").val(row.g_ix);
            $("input[name=group_name]").val(row.name);
            $(".addTemplateBody").remove();

            common.ajax(
                    common.util.getControllerUrl('getGroupContensList', 'listDeliveryTemplate', 'company')
                    , {g_ix: row.g_ix}, false
                    , function (response) {
                        if (response.result == 'success') {
                            self.ajaxAddTemplate(response);
                            common.form.reset($(self.devTap));
                            self.groupDeliveryGrid.reload();
                            $("input[name=group_name]").val(row.name);
                            if(response.data[0]['state'] == '1'){
                                $('#state_1').prop("checked", true);
                            }else if(response.data[0]['state'] == '0'){
                                $('#state_0').prop("checked", true);
                            }
                        } else {
                            console.log(response);
                        }
                    }
            );

        });
        $('#devPagingGorupGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.groupDeliveryGrid.getRow($(this).data('idx'));
            var $form = $('#devDeliveryGroupForm');
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.name}))) {
                common.ajax(common.util.getControllerUrl('delGroupList', 'listDeliveryTemplate', 'company'),
                        {g_ix: row.g_ix,
                            company_id: $("#devGridGroupForm [name=company_id]").val()
                        },
                        function () {
                            // 전송전 데이타 검증
                            return true;
                        },
                        function (response) {
                            // 전송후 결과 확인
                            if (response.result == 'success') {
                                common.form.reset($form);
                                $(".addTemplateBody").remove();
                                self.groupDeliveryGrid.reload();
                            } else {
                                common.noti.alert(response.result);
                            }
                        }
                );
            }
        });
    },
    //배송 정책 템플릿 선택
    initAddTemplate: function () {
        var devSelectTemplate = $("#devSelectTemplate option");
        var html = "";
        devSelectTemplate.on('click', function () {
            var values = $(this).val();
            var name = $(this).attr("name");
            var makeflag = 0;

            if ($(".addTemplateDiv input:radio").length == 0) {
                makeflag = 0;
            }

            $(".addTemplateDiv input:radio").each(function (k, v) {
                if (v.value == values) {
                    makeflag++;
                }
            });
            if (makeflag <= 0) {
                html = '<tr class="fb__menusubmit addTemplateBody"> ' +
                        '<td><div class="fb-filter__radio"><label><input type="radio" name="rep" value="' + values + '"><span></span></label></div></td>' +
                        '<td>' + name + '<input type="hidden" name="dt_ix[]" value="' + values + '"/></td>' +
                        '<td><a href="javascript:;" item="' + values + '" class="fb__menusubmit-del delTemplate">삭제</a></td>' +
                        '</tr>';
                $(".addTemplateDiv").append(html);
            }
        });

        $(document).on('click', ".delTemplate", function () {
            $(this).parent().parent().remove();
        });
    },
    ajaxAddTemplate: function (obj) {
        $.each(obj.data, function (key, val) {
            var makeflag = 0;
            var html = "";
            var radioCheck = "";

            if ($(".addTemplateDiv input:radio").length == 0) {
                makeflag = 0;
            }

            $(".addTemplateDiv input:radio").each(function (k, v) {
                if (v.value == val.dt_ix) {
                    makeflag++;
                }
            });
            if (makeflag <= 0) {
                if (val.rep == 'Y')
                    radioCheck = 'checked';
                html = '<tr class="fb__menusubmit addTemplateBody"> ' +
                        '<td><div class="fb-filter__radio"><label><input type="radio" name="rep" value="' + val.dt_ix + '" ' + radioCheck + ' ><span></span></label></div></td>' +
                        '<td>' + val.template_name + '<input type="hidden" name="dt_ix[]" value="' + val.dt_ix + '"/></td>' +
                        '<td><a href="javascript:;" item="' + val.dt_ix + '" class="fb__menusubmit-del delTemplate">삭제</a></td>' +
                        '</tr>';                
                $(".addTemplateDiv").append(html);
            }
        });
    },
    initPub: function () {
        //주소
        $('.devSearchAddressPopup1').click(function () {
            common.pub.open('searchAddress', function (data) {
                $("#devShiAddress1").val(data.zipcode);
                $("#devShiAddress2").val(data.address1);
            });
        });
        $('.devSearchAddressPopup2').click(function () {
            common.pub.open('searchAddress', function (data) {
                $("#devExiAddress1").val(data.zipcode);
                $("#devExiAddress2").val(data.address1);
            });
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initTab();
        self.initListDeliveryTemplateGrid();
        self.initAddTemplate();
        self.initPub();
        self.initForm();

    }
}

$(function () {
    devCompanyListDeliveryTemplateObj.run();
});

