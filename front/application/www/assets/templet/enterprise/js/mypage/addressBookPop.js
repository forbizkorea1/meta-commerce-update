"use strict";
/*--------------------------------------------------------------*
 * 공용변수 선언 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devAddressBookPopObj = {
    callbackSelect: false,
    addressBookList: common.ajaxList(),
    clsoeWindow: function () {
        top.window.close();
    },
    initLang: function () {
        common.lang.load('addressbook.popup.add.title', '배송지 추가');
    },
    initAjaxList: function () {
        var self = this;

        // 배송지 리스트 설정
        self.addressBookList
                .setLoadingTpl('#devAddressBooKLoading')
                .setListTpl('#devAddressBooKList')
                .setEmptyTpl('#devAddressBooKEmpty')
                .setContainerType('table')
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
    initMemberEvent: function () {
        var self = this;

        // 페이징 버튼 이벤트 설정
        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            self.addressBookList.getPage($(this).data('page'));
        });

        // 배송지 추가 버튼 이벤트
        $('#devAddressBookAddBtn').on('click', function () {
            var popWindow = common.util.popup('/mypage/addressBookAddPop', 580, 700, common.lang.get('addressbook.popup.add.title'));
            $(popWindow).on('load', function () {
                popWindow.devAddressBookAddPopObj.callbackAdd = function () {
                    self.addressBookList.getPage(1);
                };
            });
        });

        // 선택버튼 이벤트
        $('#devAddressBooKContent').on('click', '.devAddressBookItemSelect', function () {
            self.callbackSelect($(this).data('ix'), $(this).data('oid'), false);
            self.clsoeWindow();
        });

        // 창닫기 버튼
        $('#devAddressBookPopColseBtn').on('click', function () {
            self.clsoeWindow();
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
                self.callbackSelect(false, $(this).data('oid'), {
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
                self.clsoeWindow();
            }

        });

        // 창닫기 버튼
        $('#devAddressBookPopColseBtn').on('click', function () {
            self.clsoeWindow();
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
    }
}
$(function () {
    devAddressBookPopObj.run()
});