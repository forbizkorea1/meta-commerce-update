"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
function starRate(elm, index, target) {
    var parentDOM = $(elm).parents('.star-links');
    parentDOM.next('.rating-img').attr('src', '/assets/mobile_templet/mobile_enterprise/images/mypage/icon-review-star-big-'+ index +'.png');
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
    initForm: function () {
        common.validation.set($('#devValuationGoods'), {'required': true});
        common.validation.set($('#devValuationDelivery'), {'required': true});
        //common.validation.set($('#devBbsSubject'), {'required': true});
        //common.validation.set($('#devBbsContents'), {'required': true});

        common.form.init(this.reviewForm,
                common.util.getControllerUrl('registerReview', 'customer'),
                function ($form) {
                    var mode = $('#mode').val();
                    if(mode == 'modify'){
                        var inputMsg = 'write.customer.review.modify.confirm';
                    }else{
                        var inputMsg = 'write.customer.review.regist.confirm';
                    }
                    if (common.noti.confirm(common.lang.get(inputMsg))) {
                        var textLength = $('#devBbsContents').val().length;
                        if(textLength < 30) {
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
                    if(data.result == 'success') {
                        // 빅인스크립트 이벤트 추가
                        if ((typeof use_biginsight_yn != "undefined") && use_biginsight_yn === true) {
                            bigin.event('review');
                        }

                        common.noti.alert(common.lang.get(outputMsg));
                        location.reload(true);
                        window.close();
                    } else if(data.result == 'notLogin') {
                        opener.top.location.href = '/member/login';
                        window.close();
                    } else if(data.result == 'spam') {
                        common.noti.alert(common.lang.get('bbs.spam.text'));
                    } else if(data.result == 'existsReview') {
                        common.noti.alert(common.lang.get('write.customer.review.exists'));
                        window.close();
                    } else if(data.result == 'notExistsOrder') {
                        opener.top.location.href = '/mypage';
                        window.close();
                    } else {
                        console.log(data.data);
                    }
                });
    },
    getFile: function () {
        if (devAppType == 'iOS') {
            //아이폰용
            try {
                webkit.messageHandlers.showAuthority.postMessage("");
            } catch (err) {
                console.log(err);
            }
        } else if (devAppType == 'Android') {
            //안드로이드용
        }
    },
    initEvent: function () {
        var self = this;

        $('#devReviewSubmit').on('click', function () {
            //포토후기일때 파일첨부 체크
            var photoCheck = false;
            if($(":input:radio[name=type]:checked").val() == 1){
                $("input[type=file]").each(function() {
                    if($(this)[0].files.length > 0){
                        photoCheck = true;
                    }
                });
                if(photoCheck == false){
                    alert("이미지를 1개 이상 첨부해야 합니다.");
                    return false;
                }
            }
        });

        $('#nor_type').on('click', function () {
            $('#devPhotoUpload').hide();
        });

        $('#pri_type').on('click', function () {
            $('#devPhotoUpload').show();
        });
        
        $('#devReviewCancel').on('click', function () {
            if(confirm('취소하시겠습니까?')) {
                // history.back();
                //window.close();
                $(".fb__popup-layout .close").trigger("click");
            }
        })

        $("span[id^='devFileDeleteButton']").click(function (e) {
            e.preventDefault();
            var split_num = (e.target.id).split('devFileDeleteButton');
            var num = split_num[1];
            self.deleteConfirmOk(num);
        });

        function setShowAuthority(type1, type2) { // type1 : 카메라, type2 : 사진
            return {'type1' : type1, 'type2' : type2};
        }

        $("input[id^='devBbsFile']").click(function (e) {
            if(devAppType == 'iOS'){
                devMyProductReviewPopObj.getFile();
                var check = setShowAuthority();
                if(check.type1 == 'N' && check.type2 == 'N'){
                    return false;
                }
            }
        });

        $("input[id^='devBbsFile']").change(function (e) {
            e.preventDefault();
            var split_num = (e.target.id).split('devBbsFile');
            var num = split_num[1];
            var allowExt = ['jpg','jpeg','png','gif'];
            var ckSize = 1024 * 1024 * 10; // 10MB

            // $("input[type=file]").each(function(){
            // if($(this)[0].files.length > 0) {
            var filesize = $(this)[0].files[0].size;
            var ext = (this.value).split(".");
            var rs = jQuery.inArray(ext['1'], allowExt);

            if (this.value != '' && rs == -1) {
                common.noti.alert(common.lang.get('write.customer.file.type.check'));
                $('#devFileWrap'+num).show();
                $('#devFileImageWrap'+num).hide();
                $('#devFileImage'+num).attr('src', '');
                return false;
            }else if(this.value != '' && filesize > ckSize) {
                common.noti.alert(common.lang.get('write.customer.file.size.check'));
                $('#devFileWrap'+num).show();
                $('#devFileImageWrap'+num).hide();
                $('#devFileImage'+num).attr('src', '');
                return false;
            }else{
                self.FileChangeEvent(num);
            }
            //}
            //});
        });

        if(bbsFile1){
            $('#devFileImage1').attr('src', bbsFile1);
            self.FileChangeEvent(1);
        }else{
            $('#devFileImageWrap1').hide();
        }
        if(bbsFile2){
            $('#devFileImage2').attr('src', bbsFile2);
            self.FileChangeEvent(2);
        }else{
            $('#devFileImageWrap2').hide();
        }
        if(bbsFile3){
            $('#devFileImage3').attr('src', bbsFile3);
            self.FileChangeEvent(3);
        }else{
            $('#devFileImageWrap3').hide();
        }
        if(bbsFile4){
            $('#devFileImage4').attr('src', bbsFile4);
            self.FileChangeEvent(4);
        }else{
            $('#devFileImageWrap4').hide();
        }
        if(bbsFile5){
            $('#devFileImage5').attr('src', bbsFile5);
            self.FileChangeEvent(5);
        }else{
            $('#devFileImageWrap5').hide();
        }
    },
    deleteConfirmOk: function (num) {
        var mode = $('input[name=mode]').val();
        var bbsIx = $('input[name=bbsIx]').val();

        if(mode == 'modify'){
            $('.devFileDelete'+num).val(1);
        }

        $('#devFileWrap'+num).show();
        $('#devFileImageWrap'+num).hide();
        $('#devFileImage'+num).attr('src', '');
        $('#devBbsFile' + num).val('');
    },
    FileChangeEvent: function(num) {
        if ($('#devBbsFile' + num).val() != "") {
            $('#devFileWrap' + num).hide();
            $('#devFileImageWrap' + num).show();
            common.util.previewFile($('#devBbsFile' + num), $('#devFileImage' + num));
        } else if($('#devFileImage'+num).attr('src') != ''){
            $('#devFileWrap' + num).hide();
            $('#devFileImageWrap' + num).show();
            common.util.previewFile($('#devBbsFile' + num), $('#devFileImage' + num));
        }
    },
    run: function () {
        this.initEvent();
        this.initForm();
        countTextLength();
    }
}

$(function () {
    devMyProductReviewPopObj.run();
});