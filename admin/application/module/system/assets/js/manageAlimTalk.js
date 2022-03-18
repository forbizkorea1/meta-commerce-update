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
        common.lang.load('initList.label.channel_use', '채널 사용 여부');
        common.lang.load('initList.label.failover_use', 'Failover 사용 여부');
        common.lang.load('initList.label.failover_call_number', 'Failover 발신번호');
        common.lang.load('initList.label.reg_date', '등록일자');
        common.lang.load('initList.label.category', '사업자 카테고리');
        // 알림톡 템플릿관리 언어셋 설정
        common.lang.load('initList.label.teplate_code', '템플릿 코드');
        common.lang.load('initList.label.teplate_name', '템플릿 명');
        common.lang.load('initList.label.template_status', '템플릿상태');
        common.lang.load('initList.label.template_inspection_status', '검수상태');
        common.lang.load('initList.label.create_date', '등록일자');
        common.lang.load('initList.label.edit_date', '수정일자');
        common.lang.load('grid.label.act', '관리');

        // 알림톡 템플릿 삭제
        common.lang.load('template.del.confirm', '해당 알림톡 템플릿을 삭제 하시겠습니까?');
        common.lang.load('template.delete.success', '알림톡 템플릿이 삭제 되었습니다');
        common.lang.load('template.delete.fail', '삭제가 불가한 알림톡 템플릿입니다.');
        common.lang.load('template.status.change', '검수상태가 변경되었습니다.다시 확인해 주세요.');

        // 카카오 알림톡 템플릿 검수이력 언어셋 설정
        common.lang.load('initList.label.tplHistory.division', '분류');
        common.lang.load('initList.label.tplHistory.contents', '내용');

        // 팝업 그리드
        common.lang.load('initList.label.devBtntype', '버튼타입');
        common.lang.load('initList.label.devBtnName', '버튼명');
        common.lang.load('initList.label.devBtnLink', '버튼링크');

        //팝업
        common.lang.load('failover.no.number', '등록 된 발신자번호가 없어 failover 사용 불가능합니다.');

        common.lang.load('channel.already.exist', '이미 등록된 카카오 채널이 있습니다.');
        common.lang.load('channel.not.exist', '등록된 채널이 없습니다.');
        common.lang.load('channel.status.not_active', '사용 할 수 없는 채널입니다. 채널을 확인해주세요.');
        common.lang.load('channel.message.send.success', '인증번호가 발송되었습니다!');
        common.lang.load('channel.message.number.empty', '인증번호를 입력해주세요.');
        common.lang.load('channel.message.number.certipy', '인증이 필요합니다.');
        common.lang.load('channel.message.number.success', '인증이 완료 되었습니다!');
        common.lang.load('channel.message.number.fail', '잘못된 인증번호 입니다. 인증번호를 확인한 다음 다시 입력해주세요!');
        common.lang.load('channel.message.category.match.fail', '잘못된 사업자 카테고리입니다. 다시 입력해주세요.');

        common.lang.load('channel.validation.failover.fail', 'failover 사용시 발신자번호를 등록해야합니다.');
        common.lang.load('channel.put.success', '채널 등록 요청되었습니다.');
        common.lang.load('channel.update.success', '채널 수정 요청되었습니다.');

        common.lang.load('channel.remove.success', '채널 삭제 요청되었습니다.');
        common.lang.load('channel.restore.success', '채널 복원 요청되었습니다.');
        common.lang.load('channel.deleteCompletely.success', '채널 영구삭제 요청되었습니다.');

        common.lang.load('template.del.no.template', '선택 된 템플릿이 없습니다.');
        common.lang.load('template.put.success', '템플릿 등록 요청되었습니다.');
        common.lang.load('template.put.modify.success', '템플릿 수정 요청되었습니다.');
        common.lang.load('template.put.status.no', '검수반려 상태만 템플릿 수정이 가능합니다.');
        common.lang.load('template.put.exist.code', '이미 존재하는 템플릿 코드 입니다.');
        common.lang.load('template.put.exist.name', '이미 존재하는 템플릿 명 입니다.');
        common.lang.load('template.del.success', '템플릿 삭제 요청되었습니다.');
        common.lang.load('template.del.impossible', '검수상태가 반려일 때만 수정/삭제가 가능합니다.');
        common.lang.load('template.putComment.success', '템플릿 문의 등록이 되었습니다.');
        common.lang.load('template.put.confirm', '저장 하시겠습니까?');
        common.lang.load('template.put.confirm.success', '저장 되었습니다.');

        common.lang.load('template.put.button.val.type', '버튼 타입을 선택해 주세요.');
        common.lang.load('template.put.button.val.name', '버튼명을 입력해 주세요.');
        common.lang.load('template.put.button.channel.add', '채널 추가버튼은 메세지 유형 광고 추가형 또는 복합형일 때만 등록이 가능합니다.');
        common.lang.load('template.put.button.channel.count', '채널 추가버튼은 최대 한개만 등록 가능합니다.');
        common.lang.load('template.put.button.delivery.count', '베송 조회버튼은 최대 한개만 등록 가능합니다.');
        common.lang.load('template.put.button.val.link', '버튼 링크를 입력해 주세요.');
        common.lang.load('template.put.button.val.link.format', 'http://, https:// 으로 시작해야 합니다.');
        common.lang.load('template.put.button.web.mobile.val.link.format', 'http:// 으로 시작해야 합니다.');

        common.lang.load('template.put.code.fail', '영문이나 숫자만 입력 가능하며, 2자 이상 10자 이하로 입력할 수 있습니다.');

    },
    channelModalTpl: false,
    initEvent: function() {
        var self = devSystemManageAlimTalkObj;

        $('#devTopMenuAddTplBtn').on('click', function() {
            location.href='/system/manageAlimTalk/tplForm';
        })

        $('#devTopMenuAddTplNotActiveBtn').on('click', function() {
            common.noti.alert(common.lang.get('channel.status.not_active'));
            return false;
        })

        $('#devTopMenuAddTplNotExistBtn').on('click', function() {
            common.noti.alert(common.lang.get('channel.not.exist'));
            return false;
        })

        $('#devTopMenuSaveChannelBtn').on('click', function () {
            self.channelModal();
            return false;
        });

        $('#devTopMenuSaveChannelNotAllowedBtn').on('click', function () {
            common.noti.alert(common.lang.get('channel.already.exist'));
            return false;
        })


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
    channelModal: function (type, data) {
        var self = devSystemManageAlimTalkObj;

        if (self.channelModalTpl === false) {
            self.channelModalTpl = common.util.getHtml('#channelModalTpl');
        }

        common.util.modal.open(
            'html',
            '카카오톡 채널 등록/수정',
            self.channelModalTpl,
            '',
            function(){
                if (type == 'edit') {
                    $('#devChannelName').val(data.channel_name).prop('disabled','disabled');
                    $('#devChannelId').val(data.channel_id).prop('disabled','disabled');
                    $('#devAdminNumber').val(data.admin_number).prop('disabled','disabled');
                    $('#devCategorys').text(data.category);

                    //$('input[name=failover_use_yn][value='+data.failover_use_yn+']').prop('checked', true);
                    if (data.failover_use_yn == 'Y'){
                        $('#devFailOverUseY').prop("checked", true);
                        $('#devFailoverNumber').val(data.failover_number).prop('selected','selected');
                    } else {
                        $('#devFailOverUseN').prop("checked", true);
                    }

                    if (data.channel_use_yn == 'Y'){
                        $('#devChannelUseYnY').prop("checked", true);
                    } else {
                        $('#devChannelUseYnN').prop("checked", true);
                    }
                    //$('input[name=channel_use_yn][value='+data.channel_use_yn+']').prop('checked', true);

                    $('.devEditHidden').remove();

                    $('#devRegSubmitBtn').on('click', function(){
                        common.ajax(common.util.getControllerUrl('putChannel', 'manageAlimTalk', 'system'),
                            {
                                channel_name: $('#devChannelName').val()
                                , channel_id: $('#devChannelId').val()
                                , failover_use_yn: $('input[name=failover_use_yn]:checked').val()
                                , failover_number: $('#devFailoverNumber').val()
                                , channel_use_yn: $('input[name=channel_use_yn]:checked').val()
                                , method: type
                            },
                            function () {
                                //failover 사용시 번호값체크
                                if($('#devFailoverNumber').val() == ''){
                                    common.noti.alert(common.lang.get('channel.validation.failover.fail'));
                                    return false;
                                }
                                return true;
                            },
                            function (response) {
                                // 전송후 결과 확인
                                if (response.result == 'success') {
                                    common.noti.alert(common.lang.get('channel.update.success'));
                                    self.channelGrid.reload();
                                    $('.fb-modal__bg').click();
                                } else {
                                    common.noti.alert(response.result);
                                }
                            }
                        );
                    });
                } else {
                    $('#devConfirmCertifyNumberHidden').hide();

                    $('#devSendCertifyNumber').on('click', function (){
                        common.validation.set($('[name=channel_name]'), {'required': true});
                        common.validation.set($('[name=channel_id]'), {'required': true});
                        common.validation.set($('#devCategory1'), {'required': true});
                        common.validation.set($('#devCategory2'), {'required': true});
                        common.validation.set($('#devCategory3'), {'required': true});
                        common.validation.set($('[name=admin_number]'), {'required': true});

                        common.ajax(common.util.getControllerUrl('putRegistChannel', 'manageAlimTalk', 'system'),
                            {
                                channel_name: $('#devChannelName').val()
                                , channel_id: $('#devChannelId').val()
                                , admin_number: $('#devAdminNumber').val()
                                , category1: $('#devCategory1').val()
                                , category2: $('#devCategory2').val()
                                , category3: $('#devCategory3').val()
                            },
                            function (formData){
                                if (common.validation.check($('#devRegForm'), 'alert', false)) {
                                    return formData;
                                } else {
                                    return false;
                                }
                            },
                            function (response) {
                                if (response.result == 'success') {
                                    common.noti.alert(common.lang.get('channel.message.send.success'));
                                    $('#devCertifyNumberWrap').show();
                                    $('#devConfirmCertifyNumber').on('click', function () {
                                        self.sendCertifyNum();
                                    });
                                    $('#devRegSubmitBtn').on('click', function(e){
                                        if($('#devCertifyNumber').val() == '') {
                                            e.preventDefault();
                                            common.noti.alert(common.lang.get('channel.message.number.certipy'));
                                            return false;
                                        }
                                    });
                                } else {
                                    common.noti.alert(response.data.msg);

                                    $('#devCertifyNumberWrap').hide();
                                    $('#devRegSubmitBtn').on('click', function(e){
                                        e.preventDefault();
                                        common.noti.alert(common.lang.get('channel.message.number.certipy'));
                                    });
                                }
                            });
                    });

                    $('#devRegSubmitBtn').on('click', function(){
                        self.regSubmit();
                    });
                }

                $('input[name=failover_use_yn]').on('click', function() {
                    if($(this).val() == 'Y'){
                        if($('#devFailoverNumber > option').length < 2) {
                            common.noti.alert(common.lang.get('failover.no.number'));
                            $(this).val('N');
                            return false;
                        }
                        $('#devFailoverNumber').prop('disabled', false);
                    } else {
                        $('#devFailoverNumber').prop('disabled', false);
                    }
                });

                $('#devRegCancleBtn').on('click', function() {
                    $('.fb-modal__bg').click();
                });
            },
            {width: '760px', height: '466px'}
        );
    },
    sendCertifyNum: function () {
        var self = devSystemManageAlimTalkObj;
        common.ajax(common.util.getControllerUrl('putRegistToken', 'manageAlimTalk', 'system'),
            {
                channel_name: $('#devChannelName').val()
                , channel_id: $('#devChannelId').val()
                , admin_number: $('#devAdminNumber').val()
                , category1: $('#devCategory1').val()
                , category2: $('#devCategory2').val()
                , category3: $('#devCategory3').val()
                , token: $('#devCertifyNumber').val()
            },
            function () {
                //인증번호 입력 확인
                if ($('input[name=certify_number]').val() == '') {
                    $('#devConfirmCertifyNumberHidden').text(common.lang.get('channel.message.number.empty'));
                    $('#devConfirmCertifyNumberHidden').show();
                    return false;
                }
            },
            function (response) {
                if (response.result == 'success') {
                    common.noti.alert(common.lang.get('channel.message.number.success'));
                    $('#devAdminNumber').prop('disabled', true);
                    $('#devSendCertifyNumber').prop('disabled', true);
                    $('[name=certify_number]').prop('disabled', true);
                    $('#devConfirmCertifyNumber').prop('disabled', true);
                    $('#devRegSubmitBtn').on('click', function(e){
                        e.preventDefault();
                        self.regSubmit(true);
                    });
                } else {

                    $('#devConfirmCertifyNumberHidden').text(common.lang.get('channel.message.number.fail'));

                    if (response.data.errorCode == '400') {
                        $('#devConfirmCertifyNumberHidden').text(common.lang.get('channel.message.category.match.fail'));
                        alert(response.data.msg);
                    }

                    $('#devConfirmCertifyNumberHidden').show();

                    $('#devRegSubmitBtn').on('click', function(e){
                        e.preventDefault();
                        common.noti.alert(common.lang.get('channel.message.number.certipy'));
                    });
                }
            });
    },
    regSubmit: function(certifyUse=false) {
        if(!certifyUse) {
            common.validation.set($('[name=channel_name]'), {'required': true});
            common.validation.set($('[name=channel_id]'), {'required': true});
            common.validation.set($('#devCategory1'), {'required': true});
            common.validation.set($('#devCategory2'), {'required': true});
            common.validation.set($('#devCategory3'), {'required': true});
            common.validation.set($('[name=admin_number]'), {'required': true});
            if (common.validation.check($('#devRegForm'), 'alert', false)) {
                return true;
            } else {
                return false;
            }
            return false;
        }
        common.ajax(common.util.getControllerUrl('putChannel', 'manageAlimTalk', 'system'),
            {
                channel_name: $('#devChannelName').val()
                , channel_id: $('#devChannelId').val()
                , admin_number: $('#devAdminNumber').val()
                , category1: $('#devCategory1').val()
                , category2: $('#devCategory2').val()
                , category3: $('#devCategory3').val()
                , failover_use_yn: $('input[name=failover_use_yn]:checked').val()
                , failover_number: $('#devFailoverNumber').val()
                , channel_use_yn: $('input[name=channel_use_yn]:checked').val()
                , method: "add"
            },
            function () {
                if ($('input[name=failover_use_yn]:checked').val() == 'Y') {
                    //failover 사용시 번호값체크
                    if ($('#devFailoverNumber').val() == '') {
                        common.noti.alert(common.lang.get('channel.validation.failover.fail'));
                        return false;
                    }
                }
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
    },
    setButtonData: function(idx) {
        var btnSettingAdd = '' +
            '<tr class="btn-setting-list devBtnList" id="settingList'+idx+'">\n' +
            '    <td class="setBtnType" style="text-align: center;">'+
            '       <div class="selectbox-wrap">'+
            '           <select name="template_buttons[\'type\'][]" class="fb-filter__select select-btnType devBtnType">\n' +
            '               <option value="">타입선택</option>\n' +
            '               <option value="DS">배송 조회</option>\n' +
            '               <option value="WL">웹 링크</option>\n' +
            '               <option value="AL">앱 링크</option>\n' +
            '               <option value="BK">봇 키워드</option>\n' +
            '               <option value="MD">메시지 전달</option>\n' +
            '               <option value="AC">채널 추가</option>\n' +
            '           </select>'+
            '       </div>\n' +
            '   </td>\n' +
            '    <td class="setBtnName"></td>\n' +
            '   <td class="setBtnLink"></td>\n' +
            '    <td class="" style="padding: 15px 0;">\n' +
            '        <input type="button" class="fb-filter__delete--gray btnDel" value="삭제">\n' +
            '    </td>\n' +
            '</tr>';

        return btnSettingAdd;
    },
    getButtonData: function() {
        var buttons = new Array();

        $('.devBtnList').each(function(index){
            buttons.push({
                'type': ($(this).find('.devBtnType').val() ? $(this).find('.devBtnType').val() : '')
                , 'name': ($(this).find('.devBtnName').val() ? $(this).find('.devBtnName').val() : '')
                , 'linkPc': ($(this).find('.devBtnPcLink').val() ? $(this).find('.devBtnPcLink').val() : '')
                , 'linkMobile': ($(this).find('.devBtnMobileLink').val() ? $(this).find('.devBtnMobileLink').val() : '')
                , 'schemeAndroid': ($(this).find('.devBtnPcLink').val() ? $(this).find('.devBtnMobileLink').val() : '')
                , 'schemeIos': ($(this).find('.devBtnPcLink').val() ? $(this).find('.devBtnPcLink').val() : '')
                , 'order': index+1
            });
        });

        return JSON.stringify(buttons);
    },
    checkButtonValidation: function() {
        var ipValidate = true;
        let countChannel = 0;
        let countDeli = 0;

        $('.devBtnList').each(function(index){
            if ($(this).find('.devBtnType').val() == '') {
                // 버튼 타입 선택
                common.noti.alert(common.lang.get('template.put.button.val.type'));
                ipValidate = false;

                return false;
            } else if ($(this).find('.devBtnName').val() == '') {
                // 버튼명 입력
                common.noti.alert(common.lang.get('template.put.button.val.name'));
                ipValidate = false;

                return false;
            } else if ($(this).find('.devBtnType').val() == 'AC') {
                countChannel++;
                // 채널 추가는 메세지유형이 광고 추가형 & 복합형일떄만 등록 가능
                if ($('#devMsgType').val() == '' || $('#devMsgType').val() == '1') {
                    common.noti.alert(common.lang.get('template.put.button.channel.add'));
                    ipValidate = false;
                    return false;
                }

            } else if ($(this).find('.devBtnType').val() == 'DS') {
                countDeli++;

            } else if ($(this).find('.devBtnType').val() == 'WL' || $(this).find('.devBtnType').val() == 'AL') {
                var regexFormat = /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?/;
                var regexMobileFormat = /^(((http)\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?/;
                var pcLink = $(this).find('.devBtnPcLink').val();
                var mLink = $(this).find('.devBtnMobileLink').val();

                if ($(this).find('.devBtnPcLink').val() == '' || $(this).find('.devBtnMobileLink').val() == '') {
                    // 버튼 링크 입력
                    common.noti.alert(common.lang.get('template.put.button.val.link'));
                    ipValidate = false;

                    return false;
                } else {
                    if ($(this).find('.devBtnType').val() == 'WL') {
                        if (!regexFormat.test(pcLink)) {
                            common.noti.alert(common.lang.get('template.put.button.val.link.format'));
                            ipValidate = false;

                            return false;
                        } else if (!regexMobileFormat.test(mLink)) {
                            common.noti.alert(common.lang.get('template.put.button.web.mobile.val.link.format'));
                            ipValidate = false;

                            return false;
                        }
                    }
                }
            }
        });

        if (countChannel > 1) {
            common.noti.alert(common.lang.get('template.put.button.channel.count'));
            return false;

        } else if (countDeli > 1) {
            common.noti.alert(common.lang.get('template.put.button.delivery.count'));
            return false;

        }

        return ipValidate;
    },
    isTplCodeLength: false, // 템플릿 코드 갯수 체크
    setTpl: function () {
        var self = devSystemManageAlimTalkObj;
        var requestType = 'I';
        var msg = common.lang.get('template.put.success');

        var temNameFormat = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣A-Za-z0-9!#&?\(\)_+,.-]*$/;
        var textFormat = /[#{]/;


        $("input[name=template_name]").keyup(function(){
            var inputVal = $(this).val();
            if (!temNameFormat.test(inputVal)) {
                $(this).val(inputVal.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣A-Za-z0-9!#&?\(\)_+,.-]/gi,''));
            }
        });

        $("input[name=template_code]").keyup(function(event){
            if (!(event.keyCode >=37 && event.keyCode<=40)) {
                self.isTplCodeLength = false;
                var inputVal = $(this).val();
                $(this).val(inputVal.replace(/[^a-z0-9]/gi, ''));
                if (inputVal.length > 1) {
                    self.isTplCodeLength = true;
                    $('#devTplCodeMsg').hide();
                } else {
                    self.isTplCodeLength = false;
                    $('#devTplCodeMsg').show();
                }
            }
        });

        $('.countTextarea').keyup(function (){
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

        $('.countTextareaForm').keyup(function (){
            var content = $(this).val();
            var $countLength = $(this).attr('maxlength')
            var $counter = $(this).closest('td').find('.counter');
            $counter.html("("+content.length+" / 최대 "+$countLength+"자)");    //글자수 실시간 카운팅

            if (textFormat.test(content)) {
                $(this).val(content.replace(content,content.slice(0,-1)));
            }

            if (content.length > $countLength){
                alert("최대 "+$countLength+"자까지 입력 가능합니다.");
                $(this).val(content.substring(0, $countLength));
                $counter.html("("+$countLength+" / 최대 "+$countLength+"자)");
            }
        });


        $("input[name=template_emphasis_title]").keyup(function(){
            var inputVal = $(this).val();
            if (textFormat.test(inputVal)) {
                $(this).val(inputVal.replace(inputVal,inputVal.slice(0,-1)));
            }
        });

        $("input[name=template_emphasis_add_title]").keyup(function(){
            var inputVal = $(this).val();
            if (textFormat.test(inputVal)) {
                $(this).val(inputVal.replace(inputVal,inputVal.slice(0,-1)));
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

        $(document).on('change','.select-btnType', function () {
            var $val = $(this).val();
            var setBtnName = $(this).closest('tr').find('.setBtnName');
            var setBtnLink = $(this).closest('tr').find('.setBtnLink');
            var linkHtml = '';
            var nameHtml = '<input type="text" class="fb-filter__text select-btnName devBtnName" name="template_buttons[\'name\'][]" value="" title="버튼명" maxlength="14"/>';

            if($val == ''){
                nameHtml = '';
            } else if($val == 'WL'){
                linkHtml = '<div style="text-align: left;">Mobile: <input type="text" class="fb-filter__text floatNo select-btnLink devBtnMobileLink" name="template_buttons[\'link\'][\'mobile\'][]" placeholder="Ex. http:// 만 사용 가능" title="Mobile 버튼링크" /><br /><br />PC: <input type="text" class="fb-filter__text floatNo select-btnLink devBtnPcLink"  name="template_buttons[\'link\'][\'pc\'][]" placeholder="Ex. http://, https//" title="PC 버튼링크" /><p class="btnLink-guide" style="display: none;">http://, https://으로 시작해야 합니다.</p></div>';
            }else if($val == 'AL'){
                linkHtml = '<div style="text-align: left;">Android: <input type="text" class="fb-filter__text select-btnLink floatNo devBtnMobileLink" name="template_buttons[\'link\'][\'android\'][]" title="Android 버튼링크" /><br /><br />IOS: <input type="text" class="fb-filter__text select-btnLink floatNo devBtnPcLink" name="template_buttons[\'link\'][\'ios\'][]" title="IOS 버튼링크" /></div>';
            }else if($val == 'AC'){
                nameHtml = '<input type="text" class="fb-filter__text select-btnName devBtnName" name="template_buttons[\'name\'][]" value="채널 추가" title="버튼명" maxlength="14" disabled/>';
            }

            setBtnName.html(nameHtml);
            setBtnLink.html(linkHtml);
        });

        $(document).on('keyup','.devBtnMobileLink, .devBtnPcLink', function (e){
            var regex = /^((http|https):\/\/)/;
            var v = $(this).val();

            if (!regex.test(v)) {
                $('.btnLink-guide').show();
                $(this).focus();
            } else {
                $('.btnLink-guide').hide();
            }
        });

        $('#devBtnAdd').on('click', function () {

            var idx = $('#devBtnSetting > tr').length -1;

            var btnSettingAdd = self.setButtonData(idx);
            if ($('.devBtnList').length > 4){
                alert('최대 5개까지 추가 할 수 있습니다.');
                return false;
            }

            $('#devBtnSetting').append(btnSettingAdd);
            common.validation.set($('.devBtnList input'), {'required': true});

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

        $('#devTopMenuSaveTplNotActiveBtn').on('click', function(){
            common.noti.alert(common.lang.get('channel.status.not_active'));
            return false;
        });

        $('#devTopMenuSaveTplNotExistBtn').on('click', function(){
            common.noti.alert(common.lang.get('channel.not.exist'));
            return false;
        });

        $('#devTopMenuSaveTplBtn').on('click', function(){
            var mode = $('input[name=mode]').val();
            var inspec_status = $('input[name=template_status]').val();

            if (mode == "add") {
                var nameMethod = 'addTemplate';
            } else if (mode == "get") {
                common.noti.alert(common.lang.get('template.put.status.no'));
                return false;
            } else {
                if (inspec_status == "available") {
                    var nameMethod = 'putTemplate';
                } else {
                    common.noti.alert(common.lang.get('template.put.status.no'));
                    return false;
                }
            }

            if (self.checkButtonValidation() == false) {
                return false;
            }

            common.validation.set($('#devTplCode'), {'required': true});
            common.validation.set($('#devTplName'), {'required': true});
            common.validation.set($('#devTplCont'), {'required': true});



            if ($('#devMsgType').val() != null) {
                if ($('#devMsgType').val() == 1) {
                    common.validation.set($('#devAddInfo'), {'required': true});
                } else if ($('#devMsgType').val() == 2) {
                    common.validation.set($('#devAdvInfo'), {'required': true});
                } else if ($('#devMsgType').val() == 3) {
                    common.validation.set($('#devAddInfo'), {'required': true});
                    common.validation.set($('#devAdvInfo'), {'required': true});
                }
            }

            if ($('#devEmphasisType').val() == 2) {
                common.validation.set($('#devEmphasisTitle'), {'required': true});
                common.validation.set($('#devAddEmphasisTitle'), {'required': true});
            }



            common.ajax(common.util.getControllerUrl(nameMethod, 'manageAlimTalk', 'system'),
                {
                    channel_id: $('input[name=channel_id]').val()
                    , channel_id_pkg: $('input[name=channel_id_pkg]').val()
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
                    , template_buttons: self.getButtonData()
                    , requestType: requestType
                },
                function (formData) {
                    if (common.validation.check($('#devTplEditForm, #devTplBtnForm'), 'alert', false)) {
                        if ($('#devTplCode').val().length < 2) {
                            common.noti.alert(common.lang.get('template.put.code.fail'));
                            $('#devTplCode').focus();
                            return false;
                        }
                        if (common.noti.confirm(common.lang.get('template.put.confirm'))) {
                            return formData;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                },
                function (response) {
                    // 전송후 결과 확인
                    if (response.result == 'success') {
                        common.noti.alert(common.lang.get('template.put.confirm.success'));
                        window.location.href = '/system/manageAlimTalk/tplList';
                    } else if (response.result == 'exist_code') {
                        common.noti.alert(common.lang.get('template.put.exist.code'));
                    } else if (response.result == 'exist_name') {
                        common.noti.alert(common.lang.get('template.put.exist.name'));
                    } else {
                        common.noti.alert(response.result);
                    }
                }
            );

        });
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
            showRowSelector: false,
            multipleSelect: false,
            columns: [
                {key: "channel_name", label: common.lang.get('initList.label.channel_name'), width: 200, align: 'center'},
                {key: "channel_id", label: common.lang.get('initList.label.channel_id'), width: 200, align: 'center'},
                {key: "failover_use_yn_text", label: common.lang.get('initList.label.failover_use'), width: 200, align: 'center'},
                {key: "channel_use_yn_text", label: common.lang.get('initList.label.channel_use'), width: 200, align: 'center'},
                {key: "regdate", label: common.lang.get('initList.label.reg_date'), width: 150, align: 'center'},
                {key: "grid.label.act", label: common.lang.get('grid.label.act'), width: 150, align: 'center', formatter: function () {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />'
                        ].join('');
                    }
                }
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

        // 수정하기
        $('#devChannelPagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            var data = self.channelGrid.getRow($(this).data('idx'));
            self.channelModal('edit', data);

            return false;
        });

    },
    initTemplateManagement: function () {
        var self = devSystemManageAlimTalkObj;

        // 그리드 생성
        self.templateGrid = common.ui.grid();

        // 그리드 설정
        var gridConfig = {
            showLineNumber: true,
            showRowSelector: false,
            multipleSelect: false,
            columns: [
                {key: "template_name", label: common.lang.get('initList.label.teplate_name'), width: 150, align: 'center'},
                {key: "template_code", label: common.lang.get('initList.label.teplate_code'), width: 150, align: 'center'},
                {key: "template_inspection_status_text", label: common.lang.get('initList.label.template_inspection_status'), width: 200, align: 'center'},
                {key: "template_status_text", label: common.lang.get('initList.label.template_status'), width: 200, align: 'center'},
                {key: "template_regdate", label: common.lang.get('initList.label.create_date'), width: 150, align: 'center'},
                {key: "template_update_regdate", label: common.lang.get('initList.label.edit_date'), width: 200, align: 'center', formatter: function () {
                        if (this.item.template_update_regdate != null) {
                            return this.item.template_update_regdate;
                        } else {
                            return "-";
                        }
                    }},
                {key: "grid.label.act", label: common.lang.get('grid.label.act'), width: 300, align: 'center', formatter: function () {
                    var inspection_status = this.item.template_inspection_status;
                    var template_status = this.item.template_status;

                    if (inspection_status == 'REJECT' && template_status == 'READY') {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> ',
                            '<input type="button" class="fb-filter__edit devGridDataHistory" data-idx="' + this.item.__index + '" value="검수이력" /> '
                        ].join('');
                    } else if (inspection_status == 'ACCEPT' && template_status == 'READY') {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDel" data-idx="' + this.item.__index + '" value="삭제" /> ',
                            '<input type="button" class="fb-filter__edit devGridDataHistory" data-idx="' + this.item.__index + '" value="검수이력" /> '
                        ].join('');
                    } else {
                        return [
                            '<input type="button" class="fb-filter__edit devGridDataModify" data-idx="' + this.item.__index + '" value="수정" />',
                            '<input type="button" class="fb-filter__delete--gray devGridDataDelN" data-idx="' + this.item.__index + '" value="삭제" /> ',
                            '<input type="button" class="fb-filter__edit devGridDataHistory" data-idx="' + this.item.__index + '" value="검수이력" /> '
                        ].join('');
                    }
                    }
                }
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

        // 삭제하기
        $('#devTemplatePagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDel', function () {
            var row = self.templateGrid.getRow($(this).data('idx'));

            if (common.noti.confirm(common.lang.get('template.del.confirm', {template: row.template_code}))) {
                common.ajax(common.util.getControllerUrl('delTemplate', 'manageAlimTalk', 'system'),
                    {
                        channel_id: row.channel_id
                        , kt_ix: row.kt_ix
                        , kc_ix: row.kc_ix
                        , template_code: row.template_code
                    },
                    function () {
                        return true;
                    }, function (response) {
                        if (response.result == 'success') {
                            alert(common.lang.get('template.delete.success'));
                            document.location.reload();
                        } else {
                            if (response.result == 'not_exist' || response.result == 'register') {
                                alert(common.lang.get('template.status.change'));
                                document.location.reload();
                            } else {
                                alert(common.lang.get('template.delete.fail'));
                            }
                        }
                    }
                );
            }
            return false;
        });

        // 삭제하기 2
        $('#devTemplatePagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataDelN', function () {
            alert(common.lang.get('template.delete.fail'));
            return false;
        });

        // 검수이력
        var historyModalTpl = Handlebars.compile(common.util.getHtml('#devHistoryModalTpl'));
        $('#devTemplatePagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataHistory', function () {
            var row = self.templateGrid.getRow($(this).data('idx'));

            common.ajax(common.util.getControllerUrl('getTemplateHistory', 'manageAlimTalk', 'system'),
                {kt_ix: row.kt_ix
                , channel_id: row.channel_id
                , template_code: row.template_code},
                function () {
                    return true;
                }, function (response) {
                    common.util.modal.open(
                        'html',
                        '카카오 알림톡 템플릿 검수이력',
                        historyModalTpl({
                            history: response.data.history.data,
                            comments: response.data.comments.data
                        }),
                        '',
                        self.devDataHistoryGrid,
                        {width: '600px', height: '500px'}
                    );
                    $('#devModalclose').on('click', function() {
                        common.util.modal.close();
                    });
                }
            );


            return false;
        });

        // 수정하기
        $('#devTemplatePagingGrid [data-ax5grid-panel="body"]').on('click', '.devGridDataModify', function () {
            console.log(self.templateGrid.getRow($(this).data('idx')));
            window.location.href = '/system/manageAlimTalk/tplForm/' + self.templateGrid.getRow($(this).data('idx')).kt_ix;

            return false;
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
    initList: function () {
        var self = this;

        if ($('#devTemplateManagement').length > 0) {
            self.initTemplateManagement();
        }else if($('#devChannelManagement').length > 0){
            self.initChannelManagement();
        } else {
            return true;
        }
    },

    run: function() {
        var self = this;
        self.initEvent();
        self.initForm();
        self.initLang();
        self.initList();
        self.setTpl();
    }
}

$(function(){
    devSystemManageAlimTalkObj.run();
});