"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devSystemManageAlimTalkObj = {
    payModalHtml : false,
    initLang: function () {
        // 알림톡 채널관리 언어셋 설정
        common.lang.load('initList.label.channel_name', '카카오톡 채널명');
        common.lang.load('initList.label.channel_id', '카카오톡 채널 아이디');
        common.lang.load('initList.label.state', '상태');
        common.lang.load('initList.label.failover_use', 'Failover 사용 여부');
        common.lang.load('initList.label.failover_call_number', 'Failover 발신번호');
        common.lang.load('initList.label.reg_date', '등록일');
        common.lang.load('initList.label.category', '사업자 카테고리');
        // 알림톡 템플릿관리 언어셋 설정
        common.lang.load('initList.label.teplate_code', '템플릿 코드');
        common.lang.load('initList.label.teplate_name', '템플릿 명');
        common.lang.load('initList.label.template_status', '템플릿상태');
        common.lang.load('initList.label.template_inspection_status', '검수상태');
        common.lang.load('grid.label.act', '관리');

        // 팝업 타이틀
        common.lang.load('initList.label.devDelete', '카카오톡 채널을 삭제하시겠습니까?');
        common.lang.load('initList.label.devRestore', '카카오톡 채널을 복원하시겠습니까?');
        common.lang.load('initList.label.permanentDel', '카카오톡 채널을 완전히 삭제 요청하시겠습니까?');

        // 팝업 그리드
        common.lang.load('initList.label.devBtntype', '버튼타입');
        common.lang.load('initList.label.devBtnName', '버튼명');
        common.lang.load('initList.label.devBtnLink', '버튼링크');

        //팝업
        common.lang.load('failover.no.number', '등록 된 발신자번호가 없어 failover 사용 불가능합니다.');

        common.lang.load('channel.validation.failover.fail', 'failover 사용시 발신자번호를 등록해야합니다.');
        common.lang.load('channel.del.no.channel', '선택 된 채널이 없습니다.');
        common.lang.load('channel.del.no.match', '입력한 채널명이 일치하지 않습니다.');
        common.lang.load('channel.put.success', '채널 등록 요청되었습니다.');

        common.lang.load('channel.remove.success', '채널 삭제 요청되었습니다.');
        common.lang.load('channel.restore.success', '채널 복원 요청되었습니다.');
        common.lang.load('channel.deleteCompletely.success', '채널 영구삭제 요청되었습니다.');

        common.lang.load('template.del.no.template', '선택 된 템플릿이 없습니다.');
        common.lang.load('template.put.success', '템플릿 등록 요청되었습니다.');
        common.lang.load('template.put.modify.success', '템플릿 수정 요청되었습니다.');
        common.lang.load('template.put.exist', '이미 존재하는 템플릿코드입니다.');
        common.lang.load('template.del.success', '템플릿 삭제 요청되었습니다.');
        common.lang.load('template.del.impossible', '검수상태가 반려일 때만 수정/삭제가 가능합니다.');
    },
    modalTpl: false,
    initEvent: function() {
        var self = devSystemManageAlimTalkObj;
        var regModalTpl = common.util.getHtml('#devRegModalTpl');
        var editModalTpl = common.util.getHtml('#devEidtModalTpl');
        var tplRegModalTpl = common.util.getHtml('#devTplRegModalTpl');
        var tplDelModalTpl = common.util.getHtml('#devTplDelModalTpl');
        $('#devReg').on('click', function () {
            common.util.modal.open(
                'html',
                '카카오톡 채널 등록',
                regModalTpl,
                '',
                function(){
                    $('#devFailoverNumber').hide();
                    $('#devFailOverYN').on('change', function() {
                       if($(this).val() == 'Y'){
                           if($('#devFailoverNumber > option').length < 2) {
                               common.noti.alert(common.lang.get('failover.no.number'));
                               $(this).val('N');
                               return false;
                           }
                           $('#devFailoverNumber').show();
                       } else {
                           $('#devFailoverNumber').hide();
                       }
                    });

                    $('#devRegSubmitBtn').on('click', function(){
                        common.ajax(common.util.getControllerUrl('putChannel', 'manageAlimTalk', 'system'),
                            {
                                channel_name: $('#devChannelName').val()
                                , channel_id: $('#devChannelId').val()
                                , admin_number: $('#devAdminNumber').val()
                                , category1: $('#devCategory1').val()
                                , category2: $('#devCategory2').val()
                                , category3: $('#devCategory3').val()
                                , failover_use_yn: $('#devFailOverYN').val()
                                , failover_number: $('#devFailoverNumber').val()
                            },
                            function () {
                                //failover 사용시 번호값체크
                                if($('#devFailOverYN').val() == 'Y'){
                                    if($('#devFailoverNumber').val() == ''){
                                        common.noti.alert(common.lang.get('channel.validation.failover.fail'));
                                        return false;
                                    }
                                }
                                return true;
                            },
                            function (response) {
                                // 전송후 결과 확인
                                if (response.result == 'success') {
                                    common.noti.alert(common.lang.get('channel.put.success'));
                                    self.channelGrid.reload();
                                    $('.fb-modal__bg').click();
                                } else {
                                    common.noti.alert(response.result);
                                }
                            }
                        );
                    });

                    $('#devRegCancleBtn').on('click', function() {
                        $('.fb-modal__bg').click();
                    });
                },
                {width: '800px', height: '330px'}
            );

            return false;
        });

        $('.devBtns').on('click', function () {
            var btnId = $(this).attr('id');
            var btnText = $(this).text();
            var title = '';
            var type = this.getAttribute("data-channel-grid-control");
            var row = self.channelGrid.getList("selected");

            if(row.length == 0) {
                common.noti.alert(common.lang.get('channel.del.no.channel'));
                return false;
            }

            common.util.modal.open(
                'html',
                '카카오톡 채널 '+btnText,
                editModalTpl,
                row,
                function(){
                    $('#devChannelName').text('@'+row[0].channel_name);
                    if (btnId == 'devDelete'){
                        //삭제
                        title = common.lang.get('initList.label.devDelete');
                    }else if (btnId == 'devRestore'){
                        //복원
                        title = common.lang.get('initList.label.devRestore');
                    }else if (btnId == 'permanentDel'){
                        //영구삭제

                        $('#devDeleteBtn').css('width','auto');  title = common.lang.get('initList.label.permanentDel');
                        $('.center-cont__title--sub.warning').show();
                        btnText = '내용을 이해했으며, 채널을 삭제합니다.';
                    }

                    $('.center-cont__info.'+btnId).show();
                    $('#event-text').text(title);
                    $('#devDeleteBtn').text(btnText);

                    $('#devDeleteBtn').on('click', function(){

                        if($('#devEditForm #devKakaoChannel').val() != row[0].channel_name.trim()) {
                            common.noti.alert(common.lang.get('channel.del.no.match'));
                            return false;
                        }

                        common.ajax(common.util.getControllerUrl('delChannel', 'manageAlimTalk', 'system'),
                            {
                                type : type,
                                kc_ix : row[0].kc_ix,
                                kakaoChannel : $('#devKakaoChannel').val(),
                                channelStatus : row[0].channel_status
                            },
                            function () {

                                return true;
                            },
                            function (response) {
                                // 전송후 결과 확인
                                if (response.result == 'success') {
                                    common.noti.alert(common.lang.get('channel.'+type+'.success'));
                                    self.channelGrid.reload();
                                    $('.fb-modal__bg').click();
                                } else {
                                    common.noti.alert(response.data);
                                }
                            }
                        );
                    });
                },
                {width: '800px', height: '450px'}
            );

            return false;
        });

        $('.devTplEdit').on('click', function () {
            var selector = $(this).attr('id');
            var btnText = $(this).text();
            var row = self.templateGrid.getList("selected");

            if(row.length == 0 && selector != 'devTplReg') {
                common.noti.alert(common.lang.get('template.del.no.template'));
                return false;
            }else {
                if(row.length > 0) {
                    if(row[0].template_inspection_status != 'REJECT') {
                        common.noti.alert(common.lang.get('template.del.impossible'));
                        return false;
                    }
                }
            }

            common.util.modal.open(
                'html',
                '템플릿 '+btnText,
                tplRegModalTpl,
                row,
                function () {
                    var requestType = 'I';
                    var msg = common.lang.get('template.put.success');
                    if(selector == 'devTplModified') {
                        //수정일경우
                        requestType = 'U';
                        common.form.dataBind($("#devTplEditForm"), row[0]);
                        //셀렉트 박스 readonly 처리
                        $('#devChannelId').attr('onFocus', 'this.initialSelect = this.selectedIndex').attr('onChange', 'this.selectedIndex = this.initialSelect');
                        $('#devTplCode').attr('readonly', true);



                        msg = common.lang.get('template.put.modify.success');

                        if(row[0].template_msg_type == '1') {
                            $('#devAddInfoBox').show();
                            $('#devAdvInfoBox').hide();
                        }else if(row[0].template_msg_type == '2') {
                            $('#devAddInfoBox').hide();
                            $('#devAdvInfoBox').show();
                        }else if(row[0].template_msg_type == '3') {
                            $('#devAddInfoBox').show();
                            $('#devAdvInfoBox').show();
                        }

                        if(row[0].template_emphasis_type == '2') {
                            $('#accentType01').show();
                            $('#accentType02').show();
                        }

                        var buttons = $.parseJSON(row[0].template_buttons);
                        for(var i =0; i < buttons.length; i++) {
                            var button = buttons[i];
                            $('#devBtnSetting').append(self.setButtonData(i, button.type, button.name, button.mobileLink, button.pcLink));
                        }
                    }

                    $("input[name=template_code]").keyup(function(event){
                        if (!(event.keyCode >=37 && event.keyCode<=40)) {
                            var inputVal = $(this).val();
                            $(this).val(inputVal.replace(/[^a-z0-9]/gi,''));
                        }
                    });

                    $('#devSubmitBtn').text(btnText);

                    $('.countTextarea').keyup(function (e){
                        var content = $(this).val();
                        var $countLength = $(this).attr('maxlength')
                        var $counter = $(this).closest('td').find('.counter');
                        $counter.html("("+content.length+" / 최대 "+$countLength+"자)");    //글자수 실시간 카운팅

                        if (content.length > $countLength){
                            alert("최대 "+$countLength+"자까지 입력 가능합니다.");
                            $(this).val(content.substring(0, $countLength));
                            $counter.html("("+$countLength+" / 최대 "+$countLength+"자)");
                        }
                    });

                    $('.selectType').on('change', function () {
                        var v = $(this).val();

                        if(v == ''){
                            $('#devAddInfoBox').hide();
                            $('#devAdvInfoBox').hide();
                        }else if(v == '1'){
                            $('#devAddInfoBox').show();
                            $('#devAdvInfoBox').hide();
                        }else if(v == '2'){
                            $('#devAddInfoBox').hide();
                            $('#devAdvInfoBox').show();
                        }else {
                            $('#devAddInfoBox').show();
                            $('#devAdvInfoBox').show();
                        }
                    });

                    $('#devEmphasisType').on('change', function () {
                        var v = $(this).val();

                        if(v == '1'){
                            $('#accentType01').hide();
                            $('#accentType02').hide();
                        }else if(v == '2'){
                            $('#accentType01').show();
                            $('#accentType02').show();
                        }
                    });

                    $('.select-btnType').on('change', function () {
                        var $val = $(this).val();
                        var btnName = $('.select-btnName');
                        var btnLink = $('.select-btnLink');
                        var btn01 = $('input[name=btnLink01]');
                        var btn02 = $('input[name=btnLink02]');

                        $('.btnLink-guide').hide();

                        if($val == ''){
                            btnName.hide();
                            btnLink.hide();
                        }else if($val == 'DS'){
                            btnName.show();
                            btnLink.hide();
                        }else if($val == 'WL'){
                            btnName.show();
                            btnLink.show();
                            btn01.attr('placeholder','Mobile');
                            btn02.attr('placeholder','PC');
                            $('.btnLink-guide').show();
                        }else if($val == 'AL'){
                            btnName.show();
                            btnLink.show();
                            btn01.attr('placeholder','Android');
                            btn02.attr('placeholder','IOS');
                        }else if($val == 'BK'){
                            btnName.show();
                            btnLink.hide();
                        }else if($val == 'MD'){
                            btnName.show();
                            btnLink.hide();
                        }
                    });

                    $('#devBtnAdd').on('click', function () {
                        var btnType = $('#devBtnType option:checked').val();
                        var btnName = $('#devBtnName').val();
                        var btnLink01 = $('#devBtnLink01').val();
                        var btnLink02 = $('#devBtnLink02').val();
                        var regex = /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?/;
                        var idx = $('#devBtnSetting > tr').length -1;

                        var btnSettingAdd = self.setButtonData(idx, btnType, btnName, btnLink01, btnLink02);

                        if(btnName.trim() == ''){
                            alert('버튼명을 입력해주세요.');
                            return false;
                        }else if($('#devBtnType').val() == 'WL' || $('#devBtnType').val() == 'AL'){
                            if(btnLink01.trim() == '' || btnLink02.trim() == ''){
                                alert('버튼링크를 입력해주세요.');
                                return false;
                            }else if(regex.test(btnLink01) == false || regex.test(btnLink02) == false){
                                alert('버튼링크는 http://, https://으로 시작해야 합니다.');
                                return false;
                            }
                        }

                        $('#devBtnSetting').append(btnSettingAdd);

                        $('#settingList'+idx).find('.select-btnType option').each(function () {
                            if($(this).val() == btnType){
                                $(this).attr('selected',true);
                            }
                        });

                    });

                    $(document).on('click', '.btnEdit', function () {
                        var editLine = $(this).closest('tr.btn-setting-list');
                        editLine.addClass('modify').removeClass('read-only');
                        editLine.find('input[type=text]').attr('readonly', false);
                        $(this).addClass('btnSave').removeClass('btnEdit').val('저장');
                        $(this).next('.btnDel').addClass('btnCancel').removeClass('btnDel').val('취소');
                    });

                    $(document).on('click', '.btnCancel', function () {
                        var editLine = $(this).closest('tr.btn-setting-list');
                        editLine.removeClass('modify').addClass('read-only');
                        editLine.find('input[type=text]').attr('readonly', true);
                        $(this).removeClass('btnCancel').addClass('btnDel').val('삭제');
                        $(this).prev('.btnSave').removeClass('btnSave').addClass('btnEdit').val('수정');
                    });

                    $(document).on('click', '.btnSave', function() {
                        var editLine = $(this).closest('tr.btn-setting-list');
                        editLine.removeClass('modify').addClass('read-only');
                        editLine.find('input[type=text]').attr('readonly', true);
                        $(this).removeClass('btnSave').addClass('btnEdit').val('수정');
                        $(this).prev('.btnSave').removeClass('btnSave').addClass('btnEdit').val('수정');
                    });

                    $(document).on('click', '.btnDel', function () {
                        var editLine = $(this).closest('tr.btn-setting-list');
                        editLine.remove();
                    });

                    $('devCancelBtn').on('click', function(){
                        $('.fb-modal__bg').click();
                    });

                    $('#devSubmitBtn').on('click', function(){
                        common.ajax(common.util.getControllerUrl('putTemplate', 'manageAlimTalk', 'system'),
                            {
                                channel_id: $('#devChannelId').val()
                                , template_code: $('#devTplCode').val()
                                , template_name: $('#devTplName').val()
                                , template_content: $('#devTplCont').val()
                                , template_msg_type: $('#devMsgType').val()
                                , template_add_info: $('#devAddInfo').val()
                                , template_adv_info: $('#devAdvInfo').val()
                                , template_emphasis_type: $('#devEmphasisType').val()
                                , template_emphasis_title: $('#devEmphasisTitle').val()
                                , template_emphasis_add_title: $('#devAddEmphasisTitle').val()
                                , template_security_yn: $('input[name=template_security_yn]:checked').val()
                                , template_buttons : self.getButtonData()
                                , requestType : requestType
                            },
                            function () {
                                //failover 사용시 번호값체크
                                // if($('#devFailOverYN').val() == 'Y'){
                                //     if($('#devFailoverNumber').val() == ''){
                                //         common.noti.alert(common.lang.get('channel.validation.failover.fail'));
                                //         return false;
                                //     }
                                // }
                                return true;
                            },
                            function (response) {
                                // 전송후 결과 확인
                                if (response.result == 'success') {
                                    common.noti.alert(msg);
                                    self.templateGrid.reload();
                                    $('.fb-modal__bg').click();
                                } else if(response.result == 'exist'){
                                    common.noti.alert(common.lang.get('template.put.exist'));
                                } else {
                                    common.noti.alert(response.result);
                                }
                            }
                        );
                    });
                },
                {width: '700px', height: '450px'}
            );

            return false;
        });

        $('#devTplDel').on('click', function () {
            var row = self.templateGrid.getList("selected");

            if(row.length == 0) {
                common.noti.alert(common.lang.get('template.del.no.template'));
                return false;
            }

            if(row[0].template_inspection_status != 'REJECT') {
                common.noti.alert(common.lang.get('template.del.impossible'));
                return false;
            }

            common.util.modal.open(
                'html',
                '템플릿 삭제',
                tplDelModalTpl,
                row,
                function() {
                    $('#devTempletName').val(row[0].template_name);

                    $('#devTemplateCancelBtn').on('click', function(){
                        $('.fb-modal__bg').click();
                    });

                    $('#devTemplateDeleteBtn').on('click', function() {
                        common.ajax(common.util.getControllerUrl('delTemplate', 'manageAlimTalk', 'system'),
                            {
                                channel_id : row[0].kc_ix
                                , kt_ix : row[0].kt_ix
                                , template_code : row[0].template_code
                            },
                            function () {

                                return true;
                            },
                            function (response) {
                                // 전송후 결과 확인
                                if (response.result == 'success') {
                                    common.noti.alert(common.lang.get('template.del.success'));
                                    self.templateGrid.reload();
                                    $('.fb-modal__bg').click();
                                } else {
                                    common.noti.alert(response.result);
                                }
                            }
                        );
                    });
                },
                {width: '800px', height: '370px'}
            );

            return false;
        });

        $(document).on('change', '.devCategory', function(){
            var parent_kcc_ix = $(this).val();
            var targetId = $(this).attr('id');
            var selectTarget =  $('#devCategory2');
            var depth = 2;

            if(targetId == 'devCategory2') {
                depth = 3;
                selectTarget = $('#devCategory3');
            }

            common.ajax(common.util.getControllerUrl('getCategory', 'manageAlimTalk', 'system'),
                {
                    parent_kcc_ix : parent_kcc_ix
                    , depth : depth
                },
                function () {
                    if(parent_kcc_ix == '') {
                        alert('대분류를 선택해주세요.');
                        return false;
                    }
                    return true;
                },
                function (response) {
                    var optionHtml = '';
                    var rows = response.data.data;
                    var total = response.data.data.length;

                    //초기화
                    selectTarget.find('option').remove();
                    
                    if(depth == 2) {
                        optionHtml += '<option value="">중분류</option>';
                        $('#devCategory3 > option').remove();
                        $('#devCategory3').append('<option value="">소분류</option>')
                    }else if(depth == 3) {
                        optionHtml += '<option value="">소분류</option>';
                    }

                    for(var i=0; i<total; i++) {
                        var row = rows[i];
                        optionHtml += '<option value="'+row.kcc_ix+'">'+row.category_name+'</option>';
                    }

                    selectTarget.append(optionHtml);
                }
            );

        });
    },
    setButtonData: function(idx, btnType, btnName, btnLink01, btnLink02) {
        var linkHtml = '';
        var selectOption = '';

        if(btnType == 'WL' || btnType == 'AL') {
            linkHtml = '<td>Mobile: <input type="text" class="fb-filter__text select-btnLink devBtnMobileLink" name="template_buttons[\'link\'][\'mobile\'][]" value="' + btnLink01 + '" readonly /><br />PC: <input type="text" class="fb-filter__text select-btnLink devBtnPcLink"  name="template_buttons[\'link\'][\'pc\'][]" value="' + btnLink02 + '" readonly /></td>';
        }else {
            linkHtml = '<td></td>';
        }

        if(btnType == 'DS') {
            selectOption = '<option value="DS">배송 조회</option>\n';
        }else if(btnType == 'WL'){
            selectOption = '<option value="WL">웹 링크</option>\n';
        }else if(btnType == 'AL'){
            selectOption = '<option value="AL">앱 링크</option>\n';
        }else if(btnType == 'BK'){
            selectOption = '<option value="BK">봇 키워드</option>\n';
        }else if(btnType == 'MD'){
            selectOption = '<option value="MD">메시지 전달</option>\n';

        }

        var btnSettingAdd = '' +
            '<tr class="btn-setting-list read-only devBtnList" id="settingList'+idx+'">\n' +
            '    <td class="setBtnType" style="text-align: center;">'+
            '       <div class="selectbox-wrap">'+
            '           <select name="template_buttons[\'type\'][]" class="fb-filter__select select-btnType devBtnType">\n' +
            selectOption +
            '           </select>'+
            '       </div>\n' +
            '   </td>\n' +
            '    <td class="setBtnName" style="text-align: center;"><input type="text" class="fb-filter__text select-btnName devBtnName" name="template_buttons[\'name\'][]" value="'+btnName+'" readonly /></td>\n' +
            linkHtml +
            '    <td class="" style="padding: 15px 0;">\n' +
            '        <input type="button" class="fb-filter__edit btnEdit" value="수정">\n' +
            '        <input type="button" class="fb-filter__delete--gray btnDel" value="삭제">\n' +
            '    </td>\n' +
            '</tr>';

        return btnSettingAdd;
    },
    getButtonData: function() {
        var buttons = new Array();

        $('.devBtnList').each(function(){
            buttons.push({
                'type': ($(this).find('.devBtnType').val() ? $(this).find('.devBtnType').val() : '')
                , 'name': ($(this).find('.devBtnName').val() ? $(this).find('.devBtnName').val() : '')
                , 'pcLink': ($(this).find('.devBtnPcLink').val() ? $(this).find('.devBtnPcLink').val() : '')
                , 'mobileLink': ($(this).find('.devBtnMobileLink').val() ? $(this).find('.devBtnMobileLink').val() : '')
            });
        });

        return JSON.stringify(buttons);
    },
    listGrid: false,
    templateGrid: false,
    channelGrid: false,
    initChannelManagement: function () {
        var self = devSystemManageAlimTalkObj;

        // 그리드 생성
        self.channelGrid = common.ui.grid();

        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: true,
            multipleSelect: false,
            columns: [
                {key: "channel_name", label: common.lang.get('initList.label.channel_name'), width: 200, align: 'center'},
                {key: "channel_id", label: common.lang.get('initList.label.channel_id'), width: 200, align: 'center'},
                {key: "channel_status_text", label: common.lang.get('initList.label.state'), width: 200, align: 'center'},
                {key: "failover_use_yn_text", label: common.lang.get('initList.label.failover_use'), width: 200, align: 'center'},
                {key: "failover_number", label: common.lang.get('initList.label.failover_call_number'), width: 200, align: 'center'},
                {key: "regdate", label: common.lang.get('initList.label.reg_date'), width: 150, align: 'center'}
            ]
        };

        // 그리드 연동
        self.channelGrid.setGrid($('#devChannelPagingGrid'), gridConfig)
            .setForm('#devChannelForm')
            .setPagination('#devChannelPageWrap')
            .setPageNum('#devChannelPageNum')
            .setUrl(common.util.getControllerUrl('getChannelList', 'manageAlimTalk', 'system'))
            .init(function (response) {
                $('#devChannelTotal').text(response.data.total);
                self.channelGrid.setContent(response.data.list, response.data.paging);
            });

        // 그리드 라인수 처리
        $('#devChannelMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.channelGrid.formObj.submit();
        });

        //초기화
        $('#devChannelFormReset').click(function (e) {
            common.form.reset($('#devChannelForm'));
        });

    },
    initTemplateManagement: function () {
        var self = devSystemManageAlimTalkObj;

        // 그리드 생성
        self.templateGrid = common.ui.grid();

        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: true,
            multipleSelect: false,
            columns: [
                {key: "channel_name", label: common.lang.get('initList.label.channel_name'), width: 200, align: 'center'},
                {key: "template_code", label: common.lang.get('initList.label.teplate_code'), width: 100, align: 'center'},
                {key: "template_name", label: common.lang.get('initList.label.teplate_name'), width: 200, align: 'center'},
                {key: "template_status_text", label: common.lang.get('initList.label.template_status'), width: 200, align: 'center'},
                {key: "template_inspection_status_text", label: common.lang.get('initList.label.template_inspection_status'), width: 200, align: 'center'}
            ]
        };

        // 그리드 연동
        self.templateGrid.setGrid($('#devTemplatePagingGrid'), gridConfig)
            .setForm('#devTemplateForm')
            .setPagination('#devTemplatePageWrap')
            .setPageNum('#devTemplatePageNum')
            .setUrl(common.util.getControllerUrl('getTemplateList', 'manageAlimTalk', 'system'))
            .init(function (response) {
                $('#devTemplateTotal').text(common.util.numberFormat(response.data.total));
                self.templateGrid.setContent(response.data.list, response.data.paging);
        });

        // 그리드 라인수 처리
        $('#devteplateMax').on('change', function () {
            $('[name="max"]').val($(this).val());
            self.templateGrid.formObj.submit();
        });

        //초기화
        $('#devTemplateFormReset').click(function (e) {
            common.form.reset($('#devTemplateForm'));
        });

        // 문의하기
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataInquery', function () {
            //window.location.href = '/display/manageMainDisplay/index/' + self.listGrid.getRow($(this).data('idx')).mg_ix;
            return false;
        });

        // 답변이력
        $('#devPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataAnswer', function () {

        });

    },
    initForm: function () {
        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
        });
        common.ui.quickDate('-', $('#devQuickBetweenDate'), {
            startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });


        //검색
        $('#devFormSubmit').click(function (e) {
            e.preventDefault();

            if ($('#devBetweenDatePickerStart').val() != '' || $('#devBetweenDatePickerEnd').val() != '') {
                if ($('select[name=dateType]').val() == '') {
                    alert('날짜검색타입을 선택해주세요.');
                    return false;
                }
            }

            $('#devListForm').submit();
        });
    },
    initTab: function () {
        var self = this;

        common.ui.tap($('#devTap'), function (selector) {

            if (selector == '#devTemplateManagement') {
                self.initTemplateManagement();
            }else {
                self.initChannelManagement();
            }

        });

        self.initChannelManagement();
    },

    run: function() {
        var self = this;
        self.initEvent();
        self.initForm();
        self.initLang();
        self.initTab();
    }
}

$(function(){
    devSystemManageAlimTalkObj.run();
});