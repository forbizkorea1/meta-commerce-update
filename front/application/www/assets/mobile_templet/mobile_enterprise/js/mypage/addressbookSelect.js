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

function closeFramePop()
{
    $('.popup-frame-layout .close').trigger('click');
}

function setAddress(data)
{
    var form = $('#devAddressBookAddForm');

    form.find('input[name=zipcode]').val(data.zipcode);
    form.find('input[name=address1]').val(data.address1);
}

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devAddressBookPopObj = {
    updateMode: false,
    callbackSelect: false,
    addressBookList: common.ajaxList(),
    closeWindow: function () {
        $('.popup-layout .close').trigger('click');
    },
    initLang: function () {
        common.lang.load('addressbook.popup.add.title', '배송지 추가');
        common.lang.load('addressbook.delete.confirm', '해당 배송지를 목록에서 삭제하시겠습니까?');
    },
    initAjaxList: function () {
        var self = devAddressBookPopObj;

        self.addressBookList.setContent = function (list, paging) {
            var self = this;
            //마지막 페이지 또는 page가 1일때 숨김
            if (this.remove === false && paging && (paging.cur_page == paging.last_page || paging.page_list.length <= 1)) {
                this.hidePagination();
            } else {
                this.sowPagination();
            }
            //삭제옵션, 페이지 검색시 1페이지, paging 정보 없을때
            if (this.remove === true || !paging || paging.cur_page == 1) {
                this.removeContent();
                self.setHistoryState('response', null);
            }
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    row.isChecked = false;
                    if(ix == row.ix) {
                        row.isChecked = true;
                    }
                    $(this.container).append(this.listTpl(row));
                }

                if (paging) {
                    $(this.pagination).html(this.paginationTpl.getHtml(paging));
                }

                //history 정보에 sate 정보 set
                var currentState = this.getHistoryState('response');
                if (currentState != null && this.remove === false) {
                    //list data의 키 찾기
                    var listKeyName = self.getResponseListKeyName(list);
                    self.response.data[listKeyName] = currentState.data[listKeyName].concat(list);
                }
            } else {
                $(this.container).append(this.emptyTpl());
            }
            this.setHistoryState('response', this.response);
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
            .setUseHash(false)
            .setRemoveContent(false)
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
    resetAddress: function () {
        self.updateMode = false;
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
    setAddress: function (data) {
        self.updateMode = true;
        common.form.dataBind($('#devAddressBookAddForm'), data);
    },
    zipResponse: function (response) {
        $('#devZip').val(response.zipcode);
        $('#devAddress1').val(response.address1);
    },
    setAddressValidation: function() {
        common.validation.set($('#devRecipient'), {'required': true});
        common.validation.set($('#devZip'), {'required': true});
        common.validation.set($('#devAddress1'), {'required': true});
        common.validation.set($('#devPcs1, #devPcs2, #devPcs3'), {'required': true});

        common.inputFormat.set($('#devPcs2, #devPcs3'), {'maxLength': 4});
    },
    initEvent: function () {
        var self = this;

        self.setAddressValidation();

        // 페이징 버튼 이벤트 설정
        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            self.addressBookList.getPage($(this).data('page'));
        });

        //주소 찾기
        $('#devZipPopupButton').click(function (e) {
            e.preventDefault();
            common.util.zipcode.framePopup(self.zipResponse);
        });

        // 배송지 추가 버튼 이벤트
        $('#devAddressBookAddBtn').on('click', function () {
            common.form.init(
                $('#devAddressBookAddForm'),
                common.util.getControllerUrl('addressBookReplace', 'mypage'),
                function (formObj) {
                    // 전송전 데이타 검증
                    if (!common.validation.check(formObj, 'alert', false)) {
                        return false;
                    }

                    return true;
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

        $('#devAddressBooKContent').on('click', '.devUpdateAddress', function () {
            var ix = $(this).data('ix');
            $('[data-tab=addressInput]').click();
            self.getAddressInfo(ix);
        });

        $('#devAddressBookSetBtn').on('click', function () {
            var ix = $('#devAddressBooKContent .devOrderAddressRadio:checked').val();
            self.callbackSelect(ix);
            self.closeWindow();
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
    run: function () {
        var self = this;
        self.initLang();
        if (addressPopMode == 'member') {
            self.initAjaxList();
        }
        self.initEvent();
    }
}
$(function () {
    devAddressBookPopObj.run()
});
