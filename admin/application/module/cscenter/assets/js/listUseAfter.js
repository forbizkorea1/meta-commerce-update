"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devCscenterListUseAfterObj = {
    initLang: function () {
        common.lang.load('grid.label.bbs_div', '분류');
        common.lang.load('grid.label.pimg', '상품이미지');
        common.lang.load('grid.label.pname', '상품명');
        common.lang.load('grid.label.avg_fav', '평균평점');
        common.lang.load('grid.label.after_img', '후기이미지');
        common.lang.load('grid.label.bbs_contents', '내용');
        common.lang.load('grid.label.bbs_re_cnt', '관리자댓글여부');
        common.lang.load('grid.label.name', '작성자');
        common.lang.load('grid.label.regdate', '등록일');
        common.lang.load('grid.label.act', '관리');

        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '관리자 댓글이 등록되었습니다.');
        common.lang.load('common.del.success.alert', '삭제가 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
        common.lang.load('after.form.error.emptyComment.alert', '댓글을 입력해주세요.');

    },
    initEvent: function () {
        $(document).on("click", "#devFormCansle", function () {
            common.util.modal.close();
        });
        //상품문의 게시판 설정 btn
        $("#devTopMenuSaveBtn").on("click", function () {
            common.util.getControllerUrl('index', 'manageUseAfterConfig', 'cscenter');
            document.location.href = '/cscenter/manageUseAfterConfig/';
        });


        //본문 수정
        $(document).on("click", "#devPopModify", function () {
            $(".devAdminReply").hide(); //댓글 정보 숨기고..

            $("#devBbsDivTextRadio").show(); //문의분류 수정모드
            $("#devBbsHiddenRadio").show(); //공개설정 수정모드
            $("#devPopSave").show(); //저장버튼 오픈

            $("#devBbsDivText").hide(); //텍스트숨김
            $("#devBbsHidden").hide();  //텍스트숨김
            $("#devPopModify").hide();
            $("#devPopDel").hide();
        });

        //리플 수정 클릭
        $(document).on("click", ".devReMod", function () {
            $(this).parent().find(" .devReCan ").show();
            $(this).parent().find(" .devReSave").show();
            $(this).parent().find(" .devReDel").hide();
            $(this).parent().find(" .devReMod").hide();
            $(this).parent().find(".devReplaySubTextArea").show();
            $(this).parent().find(".devReplaySubText").hide();
            $("#hide_cmt_ix").val($(this).parent().find("[name=hide_cmt_ix]").val());//코멘트 id

            var tx = $(this).parent().find(" .devReplaySubText ").text();
            $(this).parent().find(" [name=replay_sub] ").val(tx);
        });

        //리플 취소 클릭
        $(document).on("click", ".devReCan", function () {
            $(this).parent().find(" .devReCan ").hide();
            $(this).parent().find(" .devReSave").hide();
            $(this).parent().find(" .devReDel").show();
            $(this).parent().find(" .devReMod").show();

            $(this).parent().find(".devReplaySubTextArea").hide();
            $(this).parent().find(".devReplaySubText").show();
        });

        // 리플 등록
        $(document).on('click', ".devReAdd", function () {
            $("#devHideMode").val("insert");
            $("#hide_cmt_contents").val($("[name=reply]").val());
            $("#devHideCmt").submit();
        });

        //리플 저장
        $(document).on("click", ".devReSave", function () {
            $("#devHideMode").val("update");
            $("#hide_cmt_contents").val($(this).parent().find(" [name=replay_sub] ").val());
            $("#devHideCmt").submit();
        });

        //리플 삭제
        $(document).on("click", ".devReDel", function () {
            $("#devHideMode").val("delete");
            $("#hide_cmt_ix").val($(this).parent().find("[name=hide_cmt_ix]").val());//코멘트 id
            $("#devHideCmt").submit();
        });

        var prev_val;

        $('.selectValuation').focus(function() {
            prev_val = $(this).val();
        }).change(function(){
            var selectS_val = $("select[name='valuation_s']").val();
            var selectE_val = $("select[name='valuation_e']").val();

            console.log(selectS_val, selectE_val);
            if(selectS_val > selectE_val){
                $(this).val(prev_val);
                alert('평균평점 검색 조건이 올바르지 않습니다.');
                return false;
            }

        });

    },
    modalTpl: false,
    openModalHtml: function () {
        var self = this;
        self.modalTpl = Handlebars.compile(common.util.getHtml('#devAfterEditTpl'));
    },
    modalComentTpl: false,
    openComentModalHtml: function () {
        var self = this;
        self.modalComentTpl = Handlebars.compile(common.util.getHtml('#devAfterComentTpl'));
    },
    comentBbsIx: false,
    openComentModal: function (item) {
        var self = this;
        common.util.modal.open(
                'html',
                '상품후기 댓글',
                self.modalComentTpl(item),
                '', '',
                {width: '780px', height: '800px'}
        );
        self.editor = common.ui.editor('devEditor')
                .setSubType('test')
                .setHeight('200px')
                .init();
        common.form.init(
                $('#devHideCmt'),
                common.util.getControllerUrl('putComent', 'listUseAfter', 'cscenter'),
                function (formData) {
                    var flag = true
                    $(formData).each(function (i, obj) {
                        if(obj.name == 'cmt_contents') {
                            if(obj.value == '') {
                                common.noti.alert(common.lang.get('after.form.error.emptyComment.alert'));
                                flag = false;
                            }
                        }

                    })
                    return flag;
                },
                function (response) {
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                        $("#devReContent > .devReply ").remove();
                        var html = "";
                        response.data.list.forEach(function (element) {
                            html = "";
                            $("#devCloneForm").find("[name=hide_cmt_ix]").val(element.cmt_ix);
                            $("#devCloneForm").find(".devReplaySubTitle").text("고객센터" + element.regdate);
                            $("#devCloneForm").find(".devReplaySubText").html(element.cmt_contents);
                            html = $("#devCloneForm > .devReply").clone();
                            $("#devReContent").append(html);
                            $(".devReCan").hide();
                            $(".devReSave").hide();
                            $(".devReplaySubTextArea").hide();
                        });
                        self.grid.reload();

                    }
                }
        );

        common.ajax(common.util.getControllerUrl('getAfterComentList', 'listUseAfter', 'cscenter'),
                {bbs_ix: self.comentBbsIx},
                function () {
                    // 전송전 데이타 검증
                    return true;
                },
                function (response) {
                    // 전송후 결과 확인                    
                    if (response.result == 'success') {
                        $("#devReContent > .devReply ").remove();
                        var html = "";
                        response.data.list.forEach(function (element) {
                            html = "";
                            $("#devCloneForm").find("[name=hide_cmt_ix]").val(element.cmt_ix);
                            $("#devCloneForm").find(".devReplaySubTitle").text("고객센터" + element.regdate);
                            $("#devCloneForm").find(".devReplaySubText").html(element.cmt_contents);
                            html = $("#devCloneForm > .devReply").clone();
                            $("#devReContent").append(html);
                            $(".devReCan").hide();
                            $(".devReSave").hide();
                            $(".devReplaySubTextArea").hide();
                        });
                    } else {
                        common.noti.alert(response.result);
                    }
                }
        );


    },
    initPagingGrid: function () {
        var self = this;
        // 그리드 객체 생성
        self.grid = common.ui.grid();
        // 그리드 설정

        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            frozenColumnIndex: false, //열고정
            multiLine: true,
            columns: [

                {key: "bbs_div", label: common.lang.get('grid.label.bbs_div'), width: 100, align: "center", formatter: function () {
                        return (this.value == 2 ? '일반후기' : '프리미엄후기');
                    }
                },
                {key: "pimg", label: common.lang.get('grid.label.pimg'), width: 80, align: "center", formatter: function () {
                        return '<div class="fb-piz"><img class="fb-piz__img" src="' + this.value + '" data-src="' + this.item.pimg + '" height="30" /></div>';
                    }
                },

                {key: "pname", label: common.lang.get('grid.label.pname'), width: 250, height: 20, align: "left", formatter: function () {
                        if (this.item.option_name) {
                            return '<div style="line-height: 25px;">' + this.value + '<br>' + this.item.option_name + '</div>';
                        } else {
                            return  '<div style="line-height: 25px;">' + this.value + '</div>';
                        }

                    }
                },
                {key: "avg_fav", label: common.lang.get('grid.label.avg_fav'), width: 80, align: "center"},
                {
                    key: "bbs_contents",
                    label: common.lang.get('grid.label.bbs_contents'),
                    width: 330,
                    align: "left",
                    styleClass: 'fb__grid__edit--active'
                },
                {
                    key: "after_img_1",
                    label: common.lang.get('grid.label.after_img'),
                    width: 80,
                    align: "center",
                    formatter: function () {
                        if (this.value) {
                            return '<div class="fb-piz">' +
                                '<img class="fb-piz__img" src="' + this.item.bbs_file_1 + '" data-src="' + this.item.bbs_file_1 + '" height="30" />' +
                                '</div>';
                        }
                    }
                },                
                {key: "bbs_re_cnt", label: common.lang.get('grid.label.bbs_re_cnt'), width: 100, align: "center", formatter: function () {
                        return     (this.value >= 1 ? '답변완료' : '답변대기');
                    }
                },
                {key: "name", label: common.lang.get('grid.label.name'), width: 100, align: "center"},
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 150, align: "center"},
                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 180, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray  devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" />'

                        ].join('');
                    }
                }

            ],
            body: {
                columnHeight: 60
            }
        };
        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
                .on("click", function (data) {
                    if (data.column.key == 'bbs_contents') {
                        self.comentBbsIx = data.item.bbs_ix;
                        self.openComentModal(data.item);
                    }
                })
                .setForm('#devGridForm')
                .setPagination('#devPageWrap')
                .setPageNum('#devPageNum')
                .setUseHash(false)
                .setUrl(common.util.getControllerUrl('get', 'listUseAfter', 'cscenter'))
                .init(function (response) {
                    $('#devTotal').text(common.util.numberFormat(response.data.total));
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
            common.util.modal.open(
                    'html',
                    '상품후기수정',
                    self.modalTpl(row),
                    '', '',
                    {width: '780px', height: '800px'}
            );
            common.form.dataBind($("#devAfterEditForm"), row);

            common.form.init(
                    $('#devAfterEditForm'),
                    common.util.getControllerUrl('putContent', 'listUseAfter', 'cscenter'),
                    function (formData) {
                        return true;
                    },
                    function (response) {
                        if (response.result == 'success') {
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                            self.grid.reload();
                            common.util.modal.close();
                        }
                    }
            );
        });


        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.pname}))) {
                common.ajax(common.util.getControllerUrl('delListUseAfter', 'listUseAfter', 'cscenter'),
                        {bbs_ix: row.bbs_ix},
                        function () {
                            // 전송전 데이타 검증
                            return true;
                        },
                        function (response) {
                            // 전송후 결과 확인
                            if (response.result == 'success') {
                                common.noti.alert(common.lang.get('common.del.success.alert'));
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
            common.form.reset($('#devGridForm'));
        });
    },
    initSearchForm: function () {
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: false
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
            , timepicker: false
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            timepicker: false
            , startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });
    },

    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.openModalHtml();
        self.openComentModalHtml();
        self.initPagingGrid();
        self.initSearchForm();

    }
}

$(function () {
    devCscenterListUseAfterObj.run();
});