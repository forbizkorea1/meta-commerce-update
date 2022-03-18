"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devCscenterListProductQnaObj = {
    grid: false,
    initLang: function () {
        common.lang.load('grid.label.bbs_div_text', '분류');
        common.lang.load('grid.label.pname', '상품명');
        common.lang.load('grid.label.bbs_subject', '제목');
        common.lang.load('grid.label.bbs_contents', '내용');
        common.lang.load('grid.label.bbs_name', '작성자');
        common.lang.load('grid.label.regdate', '등록일자');
        common.lang.load('grid.label.com_name', '셀러업체');
        common.lang.load('grid.label.bbs_re_cnt', '관리자답변여부');

        common.lang.load('grid.label.act', '사용관리');
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');
        common.lang.load('common.del.success.alert', '삭제가 완료되었습니다.');
        common.lang.load('common.del.confirm', '{title} 을/를 삭제하시겠습니까?');
    },
    initEvent: function () {
        //상품문의 게시판 설정 btn
        $("#devTopMenuSaveBtn").on("click", function () {
            common.util.getControllerUrl('index', 'manageProductQnaConfig', 'cscenter');
            document.location.href = '/cscenter/manageProductQnaConfig/';
        });

        $("#devBbsDivTextRadio").hide(); //문의분류 수정모드
        $("#devBbsHiddenRadio").hide(); //공개설정 수정모드
        $("#devPopSave").hide();
        //
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



        //본문 저장 클릭시
        $(document).on("click", "#devPopSave", function () {
            $("#devHideModePQ").val("update");

            var bbs_div = $('#devBbsDivTextRadio input:radio[name="bbs_div"]:checked').val();
            $("#hide_pq_bbs_div").val(bbs_div);

            var bbs_hidden = $('#devBbsHiddenRadio input:radio[name="bbs_hidden"]:checked').val();
            $("#hide_pq_bbs_hidden").val(bbs_hidden);

            $("#devHidePQ").submit();
        });

        //본문 삭제
        $(document).on("click", "#devPopDel", function () {
            $("#devHideModePQ").val("delete");
            $("#hide_pq_bbs_div").val("delete");
            $("#hide_pq_bbs_hidden").val("delete");
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: "해당 게시물"}))) {
                $("#devHidePQ").submit();
            }
        });

        $("#devBbsQnaDiv").hide();

        //리플 버튼 취소 저장은 기본적으로 숨겨져있음
        $(".devReCan").hide();
        $(".devReSave").hide();
        $(".devReplaySubTextArea").hide();

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
    },
    initForm: function () {
        var self = this;
        //상품문의 수정용
        common.form.init(
                $('#devHidePQ'),
                common.util.getControllerUrl('putProductQna', 'listProductQna', 'cscenter'),
                function (formData) {
                    return true;
                },
                function (response) {
                    if (response.result == 'success') {
                        if($("#devHideMode").val() == "delete"){
                            common.noti.alert(common.lang.get('common.del.success.alert'));
                        }else{
                            common.noti.alert(common.lang.get('common.put.success.alert'));
                        }
                        
                        common.util.modal.close();
                        self.grid.reload();
                    } else {
                        common.noti.alert(common.lang.get('common.put.error.alert'));
                    }
                }
        );

        $(document).on('click', "#devReAdd", function () {
            $("#devHideMode").val("insert");
            $("#hide_cmt_contents").val($("[name=reply]").val());
            $("#devHideCmt").submit();
        });

        $(document).on('click', ".devReSave", function () {
            $("#devHideMode").val("update");
            $("#devHideCmt").submit();
        });

        $(".devReDel").on('click', function () {
            $("#devHideMode").val("delete");
            $("#devHideCmt").submit();
        });

    },
    editor: false,
    modalFormHtml: false,
    initModalHtml: function () {
        var self = this;
        self.modalFormHtml = common.util.getHtml('#devBbsQnaDiv');
        // 에디터 설정

    },
    csProductQna : function (row, mode) {
       var self = this;
        common.util.modal.open(
            'html',
            '상품문의 ',
            self.modalFormHtml,
            '', '',
            {width: '780px', height: '520px'}
        );

        common.form.init(
            $('#devHideCmt'),
            common.util.getControllerUrl('put', 'listProductQna', 'cscenter'),
            function (formData) {
                return true;
            },
            function (response) {
                if (response.result == 'success') {
                    if ($("#devHideMode").val() == "insert") {
                        common.noti.alert(common.lang.get('common.add.success.alert'));
                        $("[name=reply]").val("");
                    } else if ($("#devHideMode").val() == "delete") {
                        common.noti.alert(common.lang.get('common.del.success.alert'));
                    } else {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                        $("[name=reply]").val("");
                    }

                    self.getAjaxComentList();
                    self.grid.reload();
                } else {
                    common.noti.alert(common.lang.get('common.put.error.alert'));
                }
            }
        );
        $("#devProductImg").attr("src", row.productImg);
        $("#devPname").text(row.pname);
        if(row.name == null) {
            $("#devName").text(row.bbs_name);
        }else {
            $("#devName").text(row.name);
        }
        $("#devRegdate").text(row.regdate);

        $("#devBbsDiv").text(row.bbs_div);
        $("#devBbsDivText").text(row.bbs_div_text);

        if (row.bbs_hidden == 0) {
            $("#devBbsHidden").text("공개");
        } else {
            $("#devBbsHidden").text("숨김");
        }

        $("#devBbsSubject").text(row.bbs_subject);
        $("#devBbsContents").text(row.bbs_contents);
        $("#hide_bbs_ix").val(row.bbs_ix);
        $("#hide_pq_bbs_ix").val(row.bbs_ix);

        self.bbs_ix = row.bbs_ix;
        self.getAjaxComentList();

        if(mode == 'mod') {
            $('#devPopModify').trigger('click');
        }


        $("#devBbsDivTextRadio input[name=bbs_div]:radio[value='" + row.bbs_div + "']").prop("checked", true);  //문의분류 체크
        $("#devBbsHiddenRadio input[name=bbs_hidden]:radio[value='" + row.bbs_hidden + "']").prop("checked", true); //공개설정 체크

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
            columns: [

                {key: "bbs_div_text", label: common.lang.get('grid.label.bbs_div_text'), width: 100, align: "center"},
                {key: "pname", label: common.lang.get('grid.label.pname'), width: 280, align: "left"},
                {
                    key: "bbs_subject",
                    label: common.lang.get('grid.label.bbs_subject'),
                    width: 250,
                    align: "left",
                    styleClass: 'fb__grid__edit--active',
                    formatter: function () {
                        return [
                            '<div class="devGridDataRead" data-idx="' + this.item.__index + '"><span>' + this.item.bbs_subject + '</span></div>'
                        ].join('');
                    }
                },
                {key: "bbs_contents", label: common.lang.get('grid.label.bbs_contents'), width: 350, align: "left"},
                {key: "bbs_name", label: common.lang.get('grid.label.bbs_name'), width: 100, align: "center"},
                {key: "regdate", label: common.lang.get('grid.label.regdate'), width: 150, align: "center"},

                {key: "com_name", label: common.lang.get('grid.label.com_name'), width: 100, align: "center"},
                {key: "bbs_re_cnt", label: common.lang.get('grid.label.bbs_re_cnt'), width: 120, align: "center", formatter: function () {
                        return (this.value >= 1 ? '답변완료' : '답변대기');
                    }
                },

                {key: "act", label: common.lang.get('grid.label.act'), align: "center", width: 180, formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />'
                            , '<input type="button" class="fb-filter__delete--gray  devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" />'

                        ].join('');
                    }
                }

            ]
        };
        // 그리드 연동
        self.grid.setGrid($('#devPagingGrid'), gridConfig)
            .setForm('#devGridForm')
            .setPagination('#devPageWrap')
            .setPageNum('#devPageNum')
            .setUseHash(false)
            .setUrl(common.util.getControllerUrl('getProductQnaList', 'listProductQna', 'cscenter'))
            .init(function (response) {
                $('#devTotal').text(common.util.numberFormat(response.data.total));
                self.grid.setContent(response.data.list, response.data.paging);
            });
        // 그리드 라인수 처리
        $('#devMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.grid.formObj.submit();
        });

        // 조회
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataRead', function () {
            var row = self.grid.getRow($(this).data('idx'));
            self.csProductQna(row,'read');
        });

        // 수정
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var row = self.grid.getRow($(this).data('idx'));
            self.csProductQna(row,'mod');
        });

        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.grid.getRow($(this).data('idx'));
            if (common.noti.confirm(common.lang.get('common.del.confirm', {title: row.pname}))) {
                common.ajax(common.util.getControllerUrl('delListProductQna', 'listProductQna', 'cscenter'),
                        {bbs_ix: row.bbs_ix},
                        function () {
                            // 전송전 데이타 검증
                            return true;
                        },
                        function (response) {
                            // 전송후 결과 확인
                            if (response.result == 'success') {
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
            self.grid.reload();
        });
    },
    bbs_ix: 0,
    getAjaxComentList: function () {
        var self = this;
        common.ajax(
                common.util.getControllerUrl('getProductQnaListComent', 'listProductQna', 'cscenter'),
                {
                    bbs_ix: self.bbs_ix
                },
                function () {
                    return true;
                },
                function (response) {

                    if (response.result == 'success') {
                        $("#devReContent > .devReply ").remove();
                        var html = "";
                        response.data.list.forEach(function (element) {
                            html = "";
                            $("#devCloneForm").find("[name=hide_cmt_ix]").val(element.cmt_ix);
                            $("#devCloneForm").find(".devReplaySubTitle").text(element.cmt_name + " (" + element.id + ") " + element.regdate);
                            $("#devCloneForm").find(".devReplaySubText").text(element.cmt_contents);
                            html = $("#devCloneForm > .devReply").clone();
                            $("#devReContent").append(html);
                        });
                    }
                }
        );
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
        self.initSearchForm();
        self.initPagingGrid();
        self.initModalHtml();
        self.initForm();
    }
}

$(function () {
    devCscenterListProductQnaObj.run();
});