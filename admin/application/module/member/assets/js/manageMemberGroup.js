"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devMemberManageMemberGroupObj = {
    initLang: function () {
        common.lang.load('grid.label.gp_level', '그룹등급');
        common.lang.load('grid.label.gp_name', '그룹명');
        common.lang.load('grid.label.basic', '기본그룹여부');
        common.lang.load('grid.label.organization_img', '그룹 이미지');
        common.lang.load('grid.label.selling_type_text', '소매/도매');
        common.lang.load('grid.label.dc_standard_price_text', '판매가설정');
        common.lang.load('grid.label.use_discount_type_text', '할인율 적용');
        common.lang.load('grid.label.use_coupon_yn_text', '쿠폰');
        common.lang.load('grid.label.use_reserve_yn_text', '마일리지');
        common.lang.load('grid.label.disp_text', '사용여부');

        common.lang.load('grid.label.gp_type_text', '산정기간');
        common.lang.load('grid.label.all_disp_text', '자동 회원 그룹 변경 여부');
        common.lang.load('grid.label.order_price_text', '주문금액 시작');
        common.lang.load('grid.label.ed_order_price_text', '주문금액 끝');

        common.lang.load('grid.label.act', '관리');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
        common.lang.load('common.del.fail.isBasicGroup', '기본 회원그룹은 삭제할 수 없습니다.');
        common.lang.load('common.del.fail.existUser', '해당그룹의 회원이 존재하여 삭제할 수 없습니다.');
    },
    modalTpl: false,
    modal: function (data) {
        var self = this;
        common.util.modal.open('html', '그룹 ' + (data.gp_ix > 0 ? '수정' : '추가'), self.modalTpl(), '', function () {

            //set validation
            common.validation.set($('#devForm').find('[name=gp_name],[name=gp_level]'), {'required': true});

            //set inputFormat
            common.inputFormat.set($('#devForm').find('[name=gp_level],[name=retail_dc],[name=order_price],[name=ed_order_price]'), {number: true});

            var $form = $('#devForm');
            //form 정의
            common.form.init(
                $form,
                common.util.getControllerUrl('put', 'manageMemberGroup', 'member'),
                function (formData) {
                    if (common.validation.check($('#devForm'), 'alert', false)) {
                        return formData;
                    } else {
                        return false;
                    }
                },
                function (response) {
                    if (response.result == 'success') {
                        if (data.gp_ix > 0) {
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                        } else {
                            common.noti.alert(common.lang.get('common.add.success.alert'));
                        }
                        common.util.modal.close();
                        self.grid.reload();
                    } else {
                        common.noti.alert(response.result);
                    }
                }
            );

            //이미지
            var upload = common.ui.upload('#devOrganizationImg').init();
            if (data.organization_img_src != '') {
                upload.putFileBox('organization_img', data.organization_img_src);
            } else {
                upload.addFileBox('organization_img');
            }

            //데이터 바인드
            common.form.dataBind($('#devForm'), data);

            $('#devFormSubmitButton').click(function () {
                $form.submit();
            });

        }, {width: '1000px', height: '660px'});
    },
    initEvent: function () {
        var self = this;

        $("#devTopMenuSaveBtn").on("click", function (e) {
            self.modal({});
            return false;
        });
    },
    initTpl: function () {
        var self = this;
        self.modalTpl = Handlebars.compile(common.util.getHtml('#devMemberGroupTpl'));
    },
    grid: false,
    initGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.grid = common.ui.grid();

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: 2, //열고정
            columns: [
                {key: "gp_level", label: common.lang.get('grid.label.gp_level'), width: 80, align: "center"},
                {key: "gp_name", label: common.lang.get('grid.label.gp_name'), width: 150, align: "left"},
                {key: "basic_text", label: common.lang.get('grid.label.basic'), width: 100, align: "center"},
                {
                    key: "organization_img_src",
                    label: common.lang.get('grid.label.organization_img'),
                    width: 100,
                    align: "center",
                    formatter: function () {
                        return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.organization_img_src + '" height="30" /></div>';
                    }
                },

                {
                    key: "dc_standard_price_text",
                    label: common.lang.get('grid.label.dc_standard_price_text'),
                    width: 100,
                    align: "center"
                },
                {
                    key: "use_discount_type_text",
                    label: common.lang.get('grid.label.use_discount_type_text'),
                    width: 100,
                    align: "center"
                },
                {
                    key: "use_coupon_yn_text",
                    label: common.lang.get('grid.label.use_coupon_yn_text'),
                    width: 150,
                    align: "center"
                },
                {
                    key: "use_reserve_yn_text",
                    label: common.lang.get('grid.label.use_reserve_yn_text'),
                    width: 150,
                    align: "center"
                },
                {key: "disp_text", label: common.lang.get('grid.label.disp_text'), width: 100, align: "center"},

                {key: "gp_type_text", label: common.lang.get('grid.label.gp_type_text'), width: 100, align: "center"},
                {key: "all_disp_text", label: common.lang.get('grid.label.all_disp_text'), width: 150, align: "center"},
                {
                    key: "order_price_text",
                    label: common.lang.get('grid.label.order_price_text'),
                    width: 100,
                    align: "right"
                },
                {
                    key: "ed_order_price_text",
                    label: common.lang.get('grid.label.ed_order_price_text'),
                    width: 100,
                    align: "right"
                },

                {
                    key: "act",
                    label: common.lang.get('grid.label.act'),
                    align: "center",
                    width: 150,
                    formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />'+
                            '<input type="button" class="fb-filter__edit devGridDataDelete" data-idx="' + this.item.__index + '" value="삭제" />'
                        ].join('');
                    }
                }
            ]
        };

        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('get', 'manageMemberGroup', 'member'))
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
            });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.grid.getRow($(this).data('idx'));
            self.modal(row);
        });

        // 삭제
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDelete', function () {
            var row = self.grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.gp_name+' 그룹'}))) {
                common.ajax(common.util.getControllerUrl('del', 'manageMemberGroup', 'member'),
                    {gp_ix: row.gp_ix},
                    function () {
                        // 전송전 데이타 검증
                        return true;
                    },
                    function (response) {
                        // 전송후 결과 확인
                        if (response.result == 'success') {
                            self.grid.reload();
                        } else {
                            if(response.data == 'isBasicGroup'){
                                common.noti.alert(common.lang.get('common.del.fail.isBasicGroup'));
                                return false;
                            }else if(response.data == 'existUser'){
                                common.noti.alert(common.lang.get('common.del.fail.existUser'));
                                return false;
                            }

                        }
                    }
                );
            }
        });
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initGrid();
        self.initEvent();
        self.initTpl();
    }
}

$(function () {
    devMemberManageMemberGroupObj.run();
});