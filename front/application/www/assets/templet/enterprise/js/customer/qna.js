"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/

var devCustomerQnaObj = {
    bbsForm: $('#devBbsForm'),
    getBbsEmail: function () {
        return $('#devBbsEmail').val().trim();
    },
    getBbsDivSelect: function () {
        return $('#devBbsDiv').val().trim();
    },
    getBbsMobile: function () {
        return $('#devBbsHp1').val().trim() + '-' + $('#devBbsHp2').val().trim() + '-' + $('#devBbsHp3').val().trim();
    },
    deleteConfirmOk: function (no) {
        $("#devBbsFile" + no).val('');
        var fname = $("#devBbsFile" + no).val();
        if (fname != "" && fname != "undefined" && no > 0) {
            $('#devBbsFileText' + no).val(fname);
            $('#devBbsFileButton' + no).text(common.lang.get('write.customer.file.change'));
            $('#devBbsFileDeleteButton' + no).show();
        } else {
            $('#devBbsFileText' + no).val('');
            $('#devBbsFileButton' + no).text(common.lang.get('write.customer.file.find'));
            $('#devBbsFileDeleteButton' + no).hide();
        }
    },
    initLang: function () {
        common.lang.load('write.customer.register', "1:1 문의를 등록하시겠습니까?"); // Confirm_04
        common.lang.load('write.customer.cancel', "1:1 문의 작성을 취소하시겠습니까?"); // Confirm_03
        common.lang.load('write.customer.cancel.inquiry', "1:1 문의내역으로 이동 시 입력중인 내용은 삭제됩니다. 그래도 이동하시겠습니까?"); // Confirm_32
        common.lang.load('bbs.spam.text','스팸정책에 의해 등록할 수 없습니다.');

        common.lang.load('write.customer.fail', "다시 입력해 주세요.");
        common.lang.load('write.customer.loginFail', "로그인을 해주세요.");
        common.lang.load('write.customer.success', "1:1 문의가 등록되었습니다. \n문의 상세 내역은 마이페이지 > 1:1 문의내역에서 확인하실 수 있습니다."); // Alert_77
        common.lang.load('write.customer.bbsdev.fail', "분류항목을 선택해 주세요.");
        common.lang.load('write.customer.file.find', "파일찾기");
        common.lang.load('write.customer.file.change', "파일변경");
        common.lang.load('write.customer.file.confirm.delete', "파일을 삭제하시겠습니까?");
        common.lang.load('write.customer.file.type.check', "파일 형식이 올바르지 않습니다. \n다시 첨부해주세요.");
        common.lang.load('write.customer.file.size.check', "파일 용량이 최대 10MB를 초과했습니다. \n다시 첨부해주세요.");
    },
    initValidation: function () {
        common.validation.set($('#devBbsDiv'), {required: true, getValueFunction: 'devCustomerQnaObj.getBbsDivSelect'});
        common.validation.set($('#devBbsEmail'), {required: true, dataFormat: 'email', getValueFunction: 'devCustomerQnaObj.getBbsEmail'});
        common.validation.set($('#devBbsHp1, #devBbsHp2, #devBbsHp3'), {required: true, dataFormat: 'mobile', getValueFunction: 'devCustomerQnaObj.getBbsMobile'});
        common.validation.set($('#devBbsSubject'), {required: true});
        common.validation.set($('#devBbsContents'), {required: true});
    },
    initEvent: function () {
        var self = devCustomerQnaObj;

        $('#devBbsRegCancel').click(function (e) {
            e.preventDefault();
            common.noti.confirm(common.lang.get('write.customer.cancel'), function () {
                document.location.href = '/customer';
            });
        });

        $('#devBbsRegSubmit').click(function (e) {
            self.bbsForm.submit();
        });

        $('#devBbsEmailHostSelect').change(function (e) {
            var selectValue = $(this).val();
            var $bbsEmailHost = $('#devBbsEmailHost');

            e.preventDefault();

            $bbsEmailHost.val(selectValue);
            if (selectValue != '') {
                $bbsEmailHost.attr('readonly', true);
            } else {
                $bbsEmailHost.attr('readonly', false);
            }
        });

        $("button[id^='devBbsFileButton']").click(function (e) {
            e.preventDefault();
            var selectBtn = (this.id).split("Button");
            var inputFile = $("#" + selectBtn['0'] + selectBtn['1']);
            inputFile.trigger('click');
        });

        $("input[id^='devBbsFile']").change(function (e) {
            var sNo = (this.id).split("devBbsFile");
            var fname = $("#devBbsFile" + sNo['1']).val();
            if (fname != "" && fname != "undefined" && sNo['1'] > 0) {
                $('#devBbsFileText' + sNo['1']).val(fname);
                $('#devBbsFileButton' + sNo['1']).text(common.lang.get('write.customer.file.change'));
                $('#devBbsFileDeleteButton' + sNo['1']).show();
            } else {
                $('#devBbsFileText' + sNo['1']).val('')
                $('#devBbsFileButton' + sNo['1']).text(common.lang.get('write.customer.file.find'));
                $('#devBbsFileDeleteButton' + sNo['1']).hide();
            }
        });

        $("button[id^='devBbsFileDeleteButton']").click(function (e) {
            e.preventDefault();
            var sNo = (this.id).split("devBbsFileDeleteButton");
            if (common.noti.confirm(common.lang.get('write.customer.file.confirm.delete'))) {
                self.deleteConfirmOk(sNo['1']);
            } else {
                return false;
            }
        });

        $("#devBbsForm :input").change(function () {
            $("#devBbsForm").data("changed", true);
        });

        $('#devGoMyInquiry').click(function (e) {
            if ($("#devBbsForm").data("changed")) {
                if (!common.noti.confirm(common.lang.get('write.customer.cancel.inquiry'))) {
                    return false;
                }
            }
            document.location.href = '/mypage/myInquiry';
        });

        $('#devBtnOrderQuery').click(function (e) {
            common.util.modal.open('ajax', '주문번호 조회', '/popup/orderList', '', function () {
                self.orderListAjax = common.ajaxList();
                self.orderListAjax
                    .setLoadingTpl('#devListLoading')
                    .setListTpl('#devListDetail')
                    .setEmptyTpl('#devListEmpty')
                    .setContainerType('tr')
                    .setContainer('#devListContents')
                    .setPagination('#devPageWrap')
                    .setPageNum('#devPage')
                    .setForm('#devListForm')
                    .setUseHash(true)
                    .setController('orderHistory', 'mypage')
                    .init(function (response) {
                        self.orderListAjax.setContent(response.data.list, response.data.paging);
                        if(response.data.list.length > 0){
                            $('#devListHeader').addClass('show');
                        }
                    });

                $('#devPageWrap').on('click', '.devPageBtnCls', function () { // 페이징 버튼 이벤트 설정
                    self.orderListAjax.getPage($(this).data('page'));
                });
            }, 'order_search');
        });

        $('#devBtnOrderdel').click(function (e) {
            $("#devOid").val("");
        });

        $(document).on("click", ".btn-orderlayer-close", function () {
            $(this).parents(".js__modal__layer").find(".close").trigger("click");
            return false;
        });

        $('#devModalContent').on('click', '.btn-xs', function () {
            $("#devOid").val($(this).attr('devselectoid'));
            $('.js__modal__close').trigger('click');
        });

        $("input[id^='devBbsFile']").change(function (e) {
            e.preventDefault();
            var allowExt = ['jpg', 'jpeg', 'png', 'gif'];
            var ckExt = false;
            var ckSize = 1024 * 1024 * 10; // 10MB

            //$("input[type=file]").each(function(){
            var filesize = $(this)[0].files[0].size;
            var ext = (this.value).split(".");
            var rs = jQuery.inArray(ext['1'].toLowerCase(), allowExt);

            if (this.value != '' && rs == -1) {
                common.noti.alert(common.lang.get('write.customer.file.type.check'));
                ckExt = false;
                var sNo = (this.id).split("devBbsFile");
                self.deleteConfirmOk(sNo['1']);
                return false;
            } else if (this.value != '' && filesize > ckSize) {
                common.noti.alert(common.lang.get('write.customer.file.size.check'));
                ckExt = false;
                var sNo = (this.id).split("devBbsFile");
                self.deleteConfirmOk(sNo['1']);
                return false;
            } else {
                var sNo = (this.id).split("devBbsFile");
                var fname = $("#devBbsFile" + sNo['1']).val();
                if (fname != "" && fname != "undefined" && sNo['1'] > 0) {
                    $('#devBbsFileText' + sNo['1']).val(fname);
                    $('#devBbsFileButton' + sNo['1']).text(common.lang.get('write.customer.file.change'));
                    $('#devBbsFileDeleteButton' + sNo['1']).show();
                } else {
                    $('#devBbsFileText' + sNo['1']).val('')
                    $('#devBbsFileButton' + sNo['1']).text(common.lang.get('write.customer.file.find'));
                    $('#devBbsFileDeleteButton' + sNo['1']).hide();
                }
            }
            //});
        });

        $('#devBbsDiv').on('change',function(){
            var divIx = $(this).val();
            common.ajax(common.util.getControllerUrl('getSubBbsDiv', 'customer'),
                {
                    divIx : divIx
                },
                function() {

                },
                function(res){
                    if(res.result == 'success' && res.data.length > 0) {
                        var str = [];
                        for (var i = 0; i < res.data.length; i++) {
                            str.push('<option value="' + res.data[i].div_ix + '" >'+ res.data[i].div_name + '</option>');
                        }
                        $('#devSubBbsDiv option[value!=""]').remove();
                        $('#devSubBbsDiv').show();
                        $('#devSubBbsDiv').append(str);
                    }else{
                        $('#devSubBbsDiv').hide();
                        $('#devSubBbsDiv option[value!=""]').remove();
                    }
                });
        });
    },
    initForm: function () {
        var self = devCustomerQnaObj;

        common.inputFormat.set($('#devBbsHp2, #devBbsHp3'), {number: true, maxLength: 4});
        common.inputFormat.set($('#devBbsEmail'), {maxLength: 50});

        // 나의 문의 등록
        common.form.init(self.bbsForm, common.util.getControllerUrl('registerArticle', 'customer'), function (form) {
            if (common.validation.check(form, 'alert', false)) {
                if (common.noti.confirm(common.lang.get('write.customer.register'))) {
                    return true;
                }
            }
            return false;
        }, function (response) {
            if (response.result == "success") {
                common.noti.alert(common.lang.get("write.customer.success"));
                location.href = response.data.url;
            } else if(response.result == 'spam') {
                common.noti.alert(common.lang.get('bbs.spam.text'));
            } else if(response.result == 'loginFail') {
                common.noti.alert(common.lang.get('write.customer.loginFail'));
                document.location.href = '/member/login?url=' + encodeURI('/customer/qna');
            } else {
                common.noti.alert(common.lang.get("write.customer.fail"));
            }
        });
    },
    run: function () {
        var self = devCustomerQnaObj;

        self.initLang();
        self.initValidation();
        self.initEvent();
        self.initForm();
    }
};

$(function () {
    devCustomerQnaObj.run();
});
