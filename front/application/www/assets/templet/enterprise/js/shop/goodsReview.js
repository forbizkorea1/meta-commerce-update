"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
function starRate(elm, index, target) {
    var parentDOM = $(elm).parents('.star-links');
    parentDOM.next('.rating-img').attr('src', '/assets/templet/enterprise/images/common/star_s_' + index + '.png');
    parentDOM.prev('.input-radio').val(index);
    $(target).val(index);
}

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
common.lang.load('write.customer.file.find', "파일찾기");
common.lang.load('write.customer.file.change', "파일변경");
common.lang.load('write.customer.file.confirm.delete', "파일을 삭제하시겠습니까?");
common.lang.load('write.customer.review.regist.confirm', "등록하시겠습니까?");
common.lang.load('write.customer.review.success', "등록되었습니다.");
common.lang.load('write.customer.review.modify.confirm', "수정하시겠습니까?");
common.lang.load('write.customer.review.modify.success', "수정되었습니다.");
common.lang.load('write.customer.review.exists', "이미 상품후기가 등록된 상품입니다.");
common.lang.load('write.customer.file.type.check', "파일 형식이 올바르지 않습니다. \n다시 첨부해주세요.");
common.lang.load('write.customer.file.size.check', "파일 용량이 최대 10MB를 초과했습니다. \n다시 첨부해주세요.");
common.lang.load('write.customer.file.content.check', "상품 후기 내용은 최소 30자 이상 작성해주세요.");
common.lang.load('bbs.spam.text','스팸정책에 의해 등록할 수 없습니다.');

var devMyProductReviewPopObj = {
    reviewForm: $('#devReviewForm'),
    deleteConfirmOk: function (no) {
        $("#devBbsFile" + no).val('');
        var fname = $("#devBbsFile" + no).val();
        if (fname != "" && fname != "undefined" && no > 0) {
            $('#devBbsFileText' + no).val(fname);
            $('#devBbsFileButton' + no).text(common.lang.get('write.customer.file.change'));
            $('#devBbsFileDeleteButton' + no).show();
        } else {
            $('#devBbsFileText' + no).val('')
            $('#devBbsFileButton' + no).text(common.lang.get('write.customer.file.find'));
            $('#devBbsFileDeleteButton' + no).hide();
        }
    },
    videoBool: false,
    initForm: function () {
        var self = this;
        common.validation.set($('#devValuationGoods'), {'required': true});
        common.validation.set($('#devValuationDelivery'), {'required': true});
        //common.validation.set($('#devBbsSubject'), {'required': true});
        //common.validation.set($('#devBbsContents'), {'required': true});

        common.form.init(this.reviewForm,
            common.util.getControllerUrl('registerReview', 'customer'),
            function ($form) {
                var reveiewType = $('input[name=type]:checked').val();
                var videoCategory = $('input[name=video_category]:checked').val();
                var mode = $('#mode').val();
                if(reveiewType == 3){ //동영상 타입일때
                    if(videoCategory == 'Y'){
                        if(!self.videoBool){
                            common.noti.alert('영상정보를 등록 해주시기 바랍니다.')
                            return false;
                        }
                    }else if(videoCategory == 'S'){
                        if(!$('input[name=video_file]').val()){
                            common.noti.alert('영상파일을 등록 해주시기 바랍니다.')
                            return false;
                        }
                    }

                }
                if(mode == 'modify'){
                    var inputMsg = 'write.customer.review.modify.confirm';
                }else{
                    var inputMsg = 'write.customer.review.regist.confirm';
                }
                if (common.noti.confirm(common.lang.get(inputMsg))) {
                    var textLength = $('#devBbsContents').val().length;
                    if (textLength < 30) {
                        common.noti.alert(common.lang.get('write.customer.file.content.check'));
                        return false;
                    }
                    return common.validation.check($form, 'alert', false);
                } else {
                    return false;
                }
            },
            function (data) {
                var mode = $('#mode').val();
                if(mode == 'modify'){
                    var outputMsg = 'write.customer.review.modify.success';
                }else{
                    var outputMsg = 'write.customer.review.success';
                }
                if (data.result == 'success') {
                    // 빅인스크립트 이벤트 추가
                    if ((typeof use_biginsight_yn != "undefined") && use_biginsight_yn === true) {
                        bigin.event('review');
                    }

                    common.noti.alert(common.lang.get(outputMsg));
                    opener.top.location.reload();
                    window.close();
                } else if (data.result == 'notLogin') {
                    opener.top.location.href = '/member/login';
                    window.close();
                } else if(data.result == 'spam') {
                    common.noti.alert(common.lang.get('bbs.spam.text'));
                } else if (data.result == 'existsReview') {
                    common.noti.alert(common.lang.get('write.customer.review.exists'));
                    window.close();
                } else if (data.result == 'notExistsOrder') {
                    opener.top.location.href = '/mypage';
                    window.close();
                } else {
                    console.log(data.data);
                }
            });
    },
    initEvent: function () {
        var self = this;

        $('#devReviewCancel').on('click', function () {
            if (confirm('취소하시겠습니까?')) {
                window.close();
            }
        })

        $("span[id^='devFileDeleteButton']").click(function (e) {
            e.preventDefault();
            var split_num = (e.target.id).split('devFileDeleteButton');
            var num = split_num[1];
            deleteConfirmOk(num);
        });

        $("input[id^='devBbsFile']").change(function (e) {
            e.preventDefault();
            var split_num = (e.target.id).split('devBbsFile');
            var num = split_num[1];
            var allowExt = ['jpg', 'jpeg', 'png', 'gif'];
            var ckSize = 1024 * 1024 * 10; // 10MB

            var filesize = $(this)[0].files[0].size;

            var ext = (this.value).split(".");
            var rs = jQuery.inArray(ext['1'].toLowerCase(), allowExt);
            if (this.value != '' && rs == -1) {
                common.noti.alert(common.lang.get('write.customer.file.type.check'));
                $('#devFileWrap' + num).show();
                $('#devFileImageWrap' + num).hide();
                $('#devFileImage' + num).attr('src', '');
                return false;
            } else if (this.value != '' && filesize > ckSize) {
                common.noti.alert(common.lang.get('write.customer.file.size.check'));
                $('#devFileWrap' + num).show();
                $('#devFileImageWrap' + num).hide();
                $('#devFileImage' + num).attr('src', '');
                return false;
            } else {
                FileChangeEvent(num);
            }
            //}
            //});
        });

        var deleteConfirmOk = function (num) {
            var bbsIx = $('input[name=bbsIx]').val();
            var mode = $('input[name=mode]').val();

            if(mode == 'modify'){
                $('.devFileDelete'+num).val(1);
            }

            $('#devFileWrap' + num).show();
            $('#devFileImageWrap' + num).hide();
            $('#devFileImage' + num).attr('src', '');
            $('#devBbsFile' + num).val('');
        }

        function FileChangeEvent(num) {
            if ($('#devBbsFile' + num).val() != "") {
                $('#devFileWrap' + num).hide();
                $('#devFileImageWrap' + num).show();
                common.util.previewFile($('#devBbsFile' + num), $('#devFileImage' + num));
            } else if($('#devFileImage'+num).attr('src') != ''){
                $('#devFileWrap' + num).hide();
                $('#devFileImageWrap' + num).show();
                common.util.previewFile($('#devBbsFile' + num), $('#devFileImage' + num));
            }else {
                //$('#devFileWrap'+num).show();
                //$('#devFileImageWrap'+num).hide();
                //$('#devFileImage'+num).attr('src', '');
            }
        }

        if(bbsFile1){
            $('#devFileImage1').attr('src', bbsFile1);
            FileChangeEvent(1);
        }else{
            $('#devFileImageWrap1').hide();
        }
        if(bbsFile2){
            $('#devFileImage2').attr('src', bbsFile2);
            FileChangeEvent(2);
        }else{
            $('#devFileImageWrap2').hide();
        }
        if(bbsFile3){
            $('#devFileImage3').attr('src', bbsFile3);
            FileChangeEvent(3);
        }else{
            $('#devFileImageWrap3').hide();
        }
        if(bbsFile4){
            $('#devFileImage4').attr('src', bbsFile4);
            FileChangeEvent(4);
        }else{
            $('#devFileImageWrap4').hide();
        }
        if(bbsFile5){
            $('#devFileImage5').attr('src', bbsFile5);
            FileChangeEvent(5);
        }else{
            $('#devFileImageWrap5').hide();
        }

        $('#devYouTube').on('click', function () {
            var youtube_id = $('input[name=youtube_id]').val();
            common.ajax(
                common.util.getControllerUrl('getYoutubeInfo', 'video'),
                {youtube_id:youtube_id},
                function () {
                    if(youtube_id){
                        return true;
                    }else{
                        return false;
                    }

                },
                function (response) {

                    if(response.result == 'success'){
                        $('#devYoutubeInfo').find('img').attr('src',response.data.thumbnail_url);
                        $('#devYoutubeInfo').find('#devYoutubeTitle').html(response.data.video_title);
                        $('.write__video__detail').addClass('write__video__detail--show');
                        self.videoBool = true;
                    }else if(response.result == 'loginFail'){
                        self.videoBool = false;
                        alert("로그인 후 이용 바랍니다.");
                        return false;
                    }else{
                        self.videoBool = false;
                        alert("영상정보를 가져올 수 없습니다.");
                        return false;
                    }
                });
        });
    },
    setLikes: function(likeType, pid, bbsIx) {
        if (forbizCsrf.isLogin) {
            common.ajax(common.util.getControllerUrl('updateLikes', 'review'), {'pid': pid, 'likeType' : likeType, 'bbs_ix' : bbsIx}, "",
                function (response) {
                    return {
                        upDown : response.data.upDown,
                        upCnt : response.data.upCnt,
                        downCnt : response.data.downCnt
                    };
                });
        } else {
            common.noti.confirm(common.lang.get('product.noMember.productReview.confirm'), function () {
                document.location.href = '/member/login?url=' + encodeURI('/shop/goodsView/' + pid);
            });
        }
    },
    run: function () {
        var self = this;
        window.setLikes = self.setLikes;
        self.initEvent();
        self.initForm();
    }
}


var iframeAPI = {
    run:function(){
        var Main_iframe = document.getElementById('devVideo');
        if(!!Main_iframe) {
            var contents = Main_iframe.contentWindow || Main_iframe.contentDocument;

            iframeAPI = new smIframeAPI(contents);

            iframeAPI.onEvent(smIframeEvent.PLAY , function(){
                // 영상 재생 시 실행
                console.log('play1');
            });

            iframeAPI.onEvent(smIframeEvent.PAUSE , function(){
                // 영상 일지정지 이벤트
                console.log('pause1');
            });
            iframeAPI.onEvent (smIframeEvent.COMPLETE, function(){
                // 영상 재생완료 이벤트
                console.log('complete1');
            });
        }

    }
}

var reviewCommentList = {
    ajaxVideoReviewComment: false,
    initVideoCommentList: function(){
        var self = this;
        self.ajaxVideoReviewComment = common.ajaxList();
        self.ajaxVideoReviewComment
            .setContainerType('div')
            .setLoadingTpl('#devVideoCommentLoading')
            .setListTpl('#devVideoCommentList')
            .setEmptyTpl('#devVideoCommentEmpty')
            .setContainer('#devVideoCommentContent')
            .setPagination('#devVideoCommentPageWrap')
            .setPageNum('#devVideoCommentPage')
            .setForm('#devVideoCommentForm')
            .setController('getVideoCommentData', 'video')
            .setUseHash(false)
            .init(function (data) {
                self.ajaxVideoReviewComment.setContent(data.data.list, data.data.paging);
                $('.devVideoCommentModifyBtn[devModify=false]').remove();
            });

        $('#devVideoCommentPageWrap').on('click', '.devPageBtnCls', function () { // 페이징 버튼 이벤트 설정
            self.ajaxVideoReviewComment.getPage($(this).data('page'));
        });

        var commentModifyBool = false;
        $('#devVideoCommentContent').on('click','.devCommentModifyBtn',function(e){

            e.preventDefault();
            if(commentModifyBool){
                alert('등록중 입니다.');
            } else {
                commentModifyBool = true;

                var $area = $(this).closest('form');

                var comment = $area.find('.devCommentModify').val();
                var comment_idx = $(this).data('comment-idx');
                var video_idx = $(this).data('video_idx');

                common.ajax(common.util.getControllerUrl('viewTvInputModifyComment', 'Viewtv'), {
                    comment_idx: comment_idx,
                    video_idx: video_idx,
                    comment: comment
                }, '', function () {
                    //성공일때 처리
                    commentModifyBool = false;
                    self.ajaxVideoReviewComment.reload();
                });
            }
        });
    },
    initEvent: function (){
        var self = this;

        $('#devPageWrap').on('click', '.devPageBtnCls', function () {
            var pageNum = $(this).data('page');
            self.ajaxVideoReviewComment.getPage(pageNum);
        });

        $('.devCommentButton').on('click',function(){
            const $target = $(this).siblings(".review-detail__user-comment");

            if(!$target.hasClass("review-detail__user-comment--show")) {
                $target.addClass("review-detail__user-comment--show");
                self.ajaxVideoReviewComment.reload();
                $('#devVideoCommentPageWrap').show();

            } else {
                $target.removeClass("review-detail__user-comment--show");
                $('#devVideoCommentPageWrap').hide();
            }

        });

    },
    run: function(){
        var self = this;
        self.initEvent();
        self.initVideoCommentList();
    }
}

$(function () {
    devMyProductReviewPopObj.run();
    iframeAPI.run();
    var Main_iframe = document.getElementById('devVideo');
    if(!!Main_iframe) {
        reviewCommentList.run();
    }
});