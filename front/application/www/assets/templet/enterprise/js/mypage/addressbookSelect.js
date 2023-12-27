"use strict";
/*--------------------------------------------------------------*
 * 공용변수 선언 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
$(".js__address__tab").on("click", function() {
    var $this = $(this);
    var _tab = $this.data("tab");

    if (!$this.hasClass("on")) {
        $this.addClass("on").siblings().removeClass("on");
        $(".addressPop__cont").removeClass("show");
        $("."+ _tab).addClass("show");
        if (_tab == 'addressInput' && devAddressBookPopObj.updateMode === false) {
            devAddressBookPopObj.resetAddress();
            console.log('reset');
        }
    }

    return false;
});

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devAddressBookPopObj = {
    updateMode: false,
    callbackSelect: false,
    basicAddress: false,
    addressBookList: common.ajaxList(),
    closeWindow: function () {
        top.window.close();
    },
    initLang: function () {
        common.lang.load('addressbook.popup.add.title', '배송지 추가');
        common.lang.load('addressbook.delete.confirm', '해당 배송지를 목록에서 삭제하시겠습니까?');
    },
    initAjaxList: function () {
        var self = this;

        self.addressBookList.setContent = function (list, paging) {
            this.removeContent();
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    row.isChecked = false;
                    if(ix == row.ix) {
                        row.isChecked = true;
                    } else if (row.default_yn == "Y") {
                        // 주문 이후 배송지 변경 팝업을 띄울 경우 디폴트 배송지를 체크하도록 함
                        row.isChecked = true;
                    }

                    $(this.container).append(this.listTpl(row));
                }

                if (paging) {
                    $(this.pagination).html(this.paginationTpl.getHtml(paging));
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }
        }

        // 배송지 리스트 설정
        self.addressBookList
            .setLoadingTpl('#devAddressBooKLoading')
            .setListTpl('#devAddressBooKList')
            .setEmptyTpl('#devAddressBooKEmpty')
            .setContainerType('ul')
            .setContainer('#devAddressBooKContent')
            .setPagination('#devPageWrap')
            .setPageNum('#devPage')
            .setForm('#devAddressBookForm')
            .setUseHash(true)
            .setController('addressBook', 'mypage')
            .init(function (data) {
                self.addressBookList.setContent(data.data.list, data.data.paging);
            });
    },
    getAddressInfo: function (ix) {
        var self = this;
        common.ajax(common.util.getControllerUrl('getAddressBook', 'order'),
            {deliveryIx: ix},
            function () {
                // 전송전 데이타 검증
                return true;
            },
            function (response) {
                // 전송후 결과 확인
                if (response.result == 'success') {
                    $('#devMode').val('update');
                   self.setAddress(response.data);
                } else {
                    common.noti.alert(response.result);
                }
            }
        );
    },
    setAddress: function (data) {
        self.updateMode = true;
        common.form.dataBind($('#devAddressBookAddForm'), data)

        if (data.default_yn == "Y") {
            self.basicAddress = true;
        } else {
            self.basicAddress = false;
        }

        $("#devDefaultYn").click(function(){
            if (self.basicAddress == true) {
                return false;
            }
        });
    },
    resetAddress: function () {
        self.updateMode = false;
        self.basicAddress = false;
        common.form.dataBind($('#devAddressBookAddForm'), {
            "ix": "",
            "recipient": "",
            "tel": "",
            "mobile": "",
            "shipping_name": "",
            "zipcode": "",
            "address1": "",
            "address2": "",
            "default_yn": "",
            "tel1": "",
            "tel2": "",
            "tel3": "",
            "pcs1": "",
            "pcs2": "",
            "pcs3": ""
        });
        $('#devMode').val('insert');
    },
    setAddressValidation: function() {
        common.validation.set($('#devRecipient'), {'required': true});
        common.validation.set($('#devZip'), {'required': true});
        common.validation.set($('#devAddress1'), {'required': true});
        common.validation.set($('#devAddress2'), {'required': true});
        common.validation.set($('#devPcs1, #devPcs2, #devPcs3'), {'required': true});

        common.inputFormat.set($('#devRecipient,#devShippingName,#devAddress2'), {'maxLength': 50});
        common.inputFormat.set($('#devPcs2, #devPcs3'), {'maxLength': 4});
    },
    initMemberEvent: function () {
        var self = this;

        self.setAddressValidation();

        // 페이징 버튼 이벤트 설정
        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            self.addressBookList.getPage($(this).data('page'));
        });

        // 배송지 추가 버튼 이벤트
        $('#devAddressBookAddBtn').on('click', function () {
            common.form.init(
                $('#devAddressBookAddForm'),
                common.util.getControllerUrl('addressBookReplace', 'mypage'),
                function (formObj) {
                    var isBool = true;
                    // 전송전 데이타 검증
                    if (!common.validation.check(formObj, 'alert', false)) {
                        isBool = false;
                    }
                    if($('#devPcs2').val().length < 3) {
                        common.noti.alert('휴대폰 번호 3자리 이상 입력해 주시기 바랍니다.');
                        isBool = false;
                    }
                    if($('#devPcs3').val().length < 4) {
                        common.noti.alert('휴대폰 번호 4자리 이상 입력해 주시기 바랍니다.');
                        isBool = false;
                    }

                    return isBool;
                },
                function (response) {
                    // 전송후 결과 확인
                    if (response.result == 'success') {
                        self.addressBookList.getPage(1);
                        $('[data-tab=addressList]').click();
                    } else {
                        common.noti.alert(response.result);
                    }
                }
            );

            $('#devAddressBookAddForm').submit();
        });

        // 선택버튼 이벤트
        $('#devAddressBooKContent').on('click', '.devAddressBookItemSelect', function () {
            if (self.callbackSelect) {
                self.callbackSelect($(this).data('ix'));
            } else {
                opener.runCallback($(this).data('ix'), $(this).data('oid'), '');
            }
            self.closeWindow();
        });

        // 창닫기 버튼
        $('#devAddressBookPopColseBtn').on('click', function () {
            self.closeWindow();
        });

        $('#devAddressBooKContent').on('click', '.devUpdateAddress', function () {
            var ix = $(this).data('ix');
            $('[data-tab=addressInput]').click();
            self.getAddressInfo(ix);
        });

        // 배송지 삭제
        $('#devAddressBooKContent').on('click', '.devAddressBookDelete', function () {
            if (confirm(common.lang.get('addressbook.delete.confirm'))) {
                common.ajax(
                    common.util.getControllerUrl('adreessBookDelete', 'mypage'),
                    {ix: $(this).data('ix')},
                    '',
                    function (data) {
                        if (data.result == 'success') {
                            self.addressBookList.reload();
                        } else {
                            console.log(data);
                        }
                    }
                );
            }
        });
    },
    initGuestEvent: function () {
        var self = this;

        //-----set input format
        common.inputFormat.set($('#devRecipient,#devShippingName,#devAddress2'), {'maxLength': 50});
        common.inputFormat.set($('#devPcs2,#devPcs3'), {'number': true, 'maxLength': 4});
        common.inputFormat.set($('#devTel2,#devTel3'), {'number': true, 'maxLength': 4});

        //-----set validation
        common.validation.set($('#devRecipient,#devZip,#devAddress1,#devAddress2,#devPcs1,#devPcs2,#devPcs3'), {'required': true});

        //주소 찾기
        $('#devZipPopupButton').on('click', function () {
            common.util.zipcode.popup(function (response) {
                $('#devZip').val(response.zipcode);
                $('#devAddress1').val(response.address1);
            });
        });

        // 배송지 변경
        $('#devAddressBookPopSaveBtn').on('click', function () {
            var chk = common.validation.check($('#devGuestAddressBookForm'), 'alert', false);

            if (chk) {
                opener.runCallback(false, $(this).data('oid'), {
                    recipient: $('#devRecipient').val(),
                    zip: $('#devZip').val(),
                    addr1: $('#devAddress1').val(),
                    addr2: $('#devAddress2').val(),
                    pcs1: $('#devPcs1').val(),
                    pcs2: $('#devPcs2').val(),
                    pcs3: $('#devPcs3').val(),
                    tel1: $('#devTel1').val(),
                    tel2: $('#devTel2').val(),
                    tel3: $('#devTel3').val()
                });
                self.closeWindow();
            }

        });

        // 창닫기 버튼
        $('#devAddressBookPopColseBtn').on('click', function () {
            self.closeWindow();
        });

    },
    initEvent : function() {
        var self = this;
        //주소 찾기
        $('#devZipPopupButton').on('click', function () {
            common.util.zipcode.popup(function (response) {
                $('#devZip').val(response.zipcode);
                $('#devAddress1').val(response.address1);
            });
        });

        $('#devAddressBookAddCancelBtn').on('click', function () {
            $('[data-tab=addressList]').click();
        });

        $('#devAddressBookSetCancelBtn').on('click', function () {
            self.closeWindow();
        });

        $('#devAddressBookSetBtn').on('click', function () {
            var ix2 = $('.devOrderAddressRadio:checked').val();

            opener.runCallback(ix2, ix);

            self.closeWindow();
        });
    },
    run: function () {
        var self = this;

        if (addressPopMode == 'guest') {
            self.initGuestEvent();
        } else {
            self.initLang();
            self.initAjaxList();
            self.initMemberEvent();
        }
        self.initEvent();
    }
}

function cbReload() {
    devAddressBookPopObj.addressBookList.reload();
}

$(function () {
    devAddressBookPopObj.run()
});
