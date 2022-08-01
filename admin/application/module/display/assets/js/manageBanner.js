"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/
/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devDisplayManageBannerObj = {
    method: 'add',
    groupCode: 1,
    bannerIx: $('[name="banner_ix"]').val(),
    initLang: function () {
        common.lang.load('common.add.success.alert', '저장이 완료되었습니다.');
        common.lang.load('common.put.success.alert', '수정이 완료되었습니다.');

        common.lang.load('common.empty.category.alert', '카테고리를 선택해주세요.');
        common.lang.load('common.already.category.alert', '1개의 카테고리만 선택할 수 있습니다.');
        common.lang.load('common.not.category.alert', '하위 카테고리를 선택해 주세요.');
        common.lang.load('common.date.validation.alert', '노출기간 종료일이 시작일보다 이전 일 수 없습니다.');
    },
    initEvent: function () {
        var self = this;

        if (self.bannerIx) {
            self.method = 'put';
        }

        self.groupTpl = Handlebars.compile(common.util.getHtml('#devBasicGroupTpl'));

        if (self.method == 'add') {
            self.appendGroupTemplate({});
        } else {
            $.each(groupListData, function (k, data) {
                self.appendGroupTemplate(data); //상품그룹별 set 바인딩
            });
        }

        //상품그룹 추가
        $(document).on('click', '.devGroupAddBtn', function (e) {
            self.appendGroupTemplate({});
        });

        //상품그룹 삭제
        $(document).on('click', '.devGroupDelBtn', function (e) {
            $(this).closest('.devGroupSection').remove();
            self.groupCode--;
        });

        //저장
        $('#devTopMenuSaveBtn').on('click', function () {
            $('#devDisplayForm').submit();
            return false;
        });
    },
    groupTpl: false,
    appendGroupTemplate: function (data) {
        var self = this;

        var groupCode = self.groupCode++;
        data['group_code'] = groupCode;

        //삭제 버튼 노출 여부
        if (groupCode != 1) {
            data['delBtnBool'] = true;
        }

        //템플릿 추가
        var $targetGroup = $(self.groupTpl(data));
        $('#devGroupContents').append($targetGroup);

        //상품그룹 이미지
        common.ui.upload('.devGroupSection[groupCode=' + groupCode + '] .devFileupload')
        .init()
        .putFileBox('groupImage' + groupCode, $targetGroup.find('.devFileupload').data('imgSrc'));

        //그룹 폼 필수값 처리
        common.validation.set($targetGroup.find('[name=group_name]'), {'required': true});

        //form 데이터 바인드
        common.form.dataBind($targetGroup.find('.devGroupForm'), data);
    },
    initForm: function () {
        var self = this;

        common.ui.datePicker($('#devBetweenDatePickerStart'), {
            endTartget: $('#devBetweenDatePickerEnd')
            , timepicker: true
        });
        common.ui.datePicker($('#devBetweenDatePickerEnd'), {
            startTartget: $('#devBetweenDatePickerStart')
            , timepicker: true
        });
        common.ui.quickDate('+', $('#devQuickBetweenDate'), {
            timepicker: true
            , startTartget: $('#devBetweenDatePickerStart')
            , endTartget: $('#devBetweenDatePickerEnd')
        });

        common.validation.set($('[name="banner_page"]'), {'required': true});
        common.validation.set($('[name="banner_position"]'), {'required': true});
        common.validation.set($('[name="banner_name"]'), {'required': true});
        common.validation.set($('[name="use_sdate"]'), {'required': true});
        common.validation.set($('[name="use_edate"]'), {'required': true});
        common.validation.set($('[name="bd_title"]'), {'required': true});

        common.form.init($('#devDisplayForm'), common.util.getControllerUrl(self.method, 'manageBanner', 'display'), function (formData, $form) {
            //카테고리는 필수가 아님
            /*if ($('.devProductCategory').val() == null) {
                    common.noti.alert(common.lang.get('common.empty.category.alert'));
                    return false;
                }*/

                if (!common.validation.check($form, 'alert', false)) {
                    return false;
                }

                if($('#devBetweenDatePickerStart').val() > $('#devBetweenDatePickerEnd').val()){
                    common.noti.alert(common.lang.get('common.date.validation.alert'));
                    return false;
                }

                var groupValidationBool = true;
                var groupData = [];
                //그룹 for문 돌리기
                $('.devGroupForm').each(function () {
                    var $groupForm = $(this);
                    if (!common.validation.check($groupForm, 'alert', false)) {
                        groupValidationBool = false;
                        return false;
                    }
                    //그룹 데이터 생성
                    groupData.push(self.convertFormData($groupForm));
                    //이미지 데이터 formData 추가
                    formData.push(self.getImageData($groupForm));
                });
                //그룹 필수값 false 시 submit 안됨
                if (!groupValidationBool) {
                    return false;
                }
                //그룹 데이터 추가
                formData.push(common.form.makeData('groupData', groupData));
                return formData;
            },
            function (response) {
                if (response.result == 'success') {
                    if (self.method == 'add') {
                        common.noti.alert(common.lang.get('common.add.success.alert'));
                        document.location.href = '/display/manageBanner/' + response.data;
                    } else {
                        common.noti.alert(common.lang.get('common.put.success.alert'));
                        document.location.reload();
                    }
                } else {
                    common.noti.alert(response.result);
                }
            }, function () {
                console.log(this);
            });
    },
    convertFormData: function ($form) {
        var self = this;
        var dataArray = $form.serializeArray();
        var data = {};
        $.each(dataArray, function (k, v) {
            data[v.name] = v.value;
        });
        return data;
    },
    getImageData: function ($form) {
        var data = $form.formToArray().find(function (v) {
            return v.name.indexOf('groupImage') >= 0;
        });
        return data;
    },
    selectCategoryTpl: false,
    initSelectCategory: function () {
        var self = this;
        //카테고리 선택
        self.selectCategory = common.ui.selectCategory();
        self.selectCategory
        .setMode('multiple')
        .setChange(function (obj) {
            $('#devSelCategory').empty();
            var selCateHtml = [];
            $.each(self.selectCategory.getValue().path, function (k, v) {
                var sel = '';
                selCateHtml = [
                    '<li>',
                    sel + v,
                    '</li>'
                ];

                if (k > 0) {
                    sel = ' > ';
                }
                $('#devSelCategory').append($(selCateHtml.join('')));
            });
        })
        .init($('#devSelectCategory'));

        //카테고리 템플릿
        self.selectCategoryTpl = common.util.compileTpl('#devProductCategoryTemplate');
        if (categoryRelationData) {
            if (categoryRelationData.length > 0) {
                $.each(categoryRelationData, function () {
                    self.addSelectCategory(this);
                });
            }
        }
    },
    addSelectCategory: function (value) {
        var self = this;
        value.basic = true;
        $('#devProductCategoryList').append($(self.selectCategoryTpl(value)));
    },
    categoryEvent: function () {
        var self = this;

        $('#devCategoryTable').on('click', '.devProductCategoryDelete', function (e) {
            e.preventDefault();
            $(this).closest('.devProductCategory').remove();
        });

        //상품분류
        $('#devProductCategoryButton').click(function () {
            //등록하려는 카테고리의 data-children 이 true인지 체크
            var cid = self.selectCategory.getValue().cid;
            var children = $('#devDisplayForm').find("option[value='" + cid + "']")[0].dataset.children;
            if (children == 'true') {
                common.noti.alert(common.lang.get('common.not.category.alert'));
                return false;
            }

            //선택한 카테고리를 임시등록
            var value = self.selectCategory.getValue();
            if (value.cid.length > 0 && $('#devDisplayForm').find('.devProductCategory').length == 0) {
                var path = value.path.join(' > ');
                value['path'] = path;
                self.addSelectCategory(value);
            } else {
                if ($('.devProductCategory').val() == null) {
                    common.noti.alert(common.lang.get('common.empty.category.alert'));
                } else {
                    common.noti.alert(common.lang.get('common.already.category.alert'));
                }
            }
        });
    },
    initDivision: function(){
        common.ui.cascading('#devDivList', '#devPositionList', 'divListGroup')
            .setUrl(common.util.getControllerUrl('getPositionList', 'listBanner', 'display'))
            .on('change', function (obj) {
                console.log($(obj).val());
            })
            .init();
    },
    run: function () {
        var self = this;
        self.initLang();
        self.initEvent();
        self.initForm();
        self.categoryEvent();
        self.initSelectCategory();
        self.initDivision();
    }
}

$(function () {
    devDisplayManageBannerObj.run();
});