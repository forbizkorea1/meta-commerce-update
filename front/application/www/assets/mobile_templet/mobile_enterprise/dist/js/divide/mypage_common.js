/**
 * Created by forbiz on 2019-02-11.
 */

const mypage_common = () => {
    const $document = $(document);

    const mypage_seacharea = () => {
        $document
            .on("click", ".day-radio a", function(){
                //라디오
                const $this = $(this);
                $this.addClass("day-radio--active").siblings().removeClass("day-radio--active");
                $('#devSdate').val($this.data('sdate'));
                $('#devEdate').val($this.data('edate'));

                return false;
            })
            .on("click", "#devSearchInitBtn ", function(){
                const $this = $(this);
                //검색조건 초기화
                $('.devDateBtn').removeClass('day-radio--active');
                $('#devDateDefault').addClass('day-radio--active');
                $('#devSdate').val($this.data('sdate'));
                $('#devEdate').val($this.data('edate'));
                $('#devStatus').val('all');
                $('#devPname').val('');
            })
            .on("click", "#devBtnReset", function(){
                //검색조건 초기화(체크박스)
                $("#devSdate").val($("#sDateDef").val());
                $("#devEDate").val($("#eDateDef").val());
                $(".devDateBtn").removeClass("day-radio--active");
                $("#devDateDefault").addClass("day-radio--active");
                $("input:checkbox[name^=s]").prop("checked", true);
                $("#devBbsDiv").val("");

                return false;
            });
    }

    const mypage_datepicker = (dateFormat = 'yy.mm.dd') => {
 
        $("#devSdate").datepicker({
            // monthNames: ['년 1월', '년 2월', '년 3월', '년 4월', '년 5월', '년 6월', '년 7월', '년 8월', '년 9월', '년 10월', '년 11월', '년 12월'],
            // dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            showMonthAfterYear: true,
            dateFormat: dateFormat,
            buttonImageOnly: true,
            buttonText: '달력',
            onSelect: function (dateText) {
                if ($('#devEdate').val() != '' && $('#devEdate').val() < dateText) {
                    $('#devSdate').val($('#sDateDef').val());
                    $('#devEdate').val($('#eDateDef').val());
                    common.noti.tailMsg('devEmailId', common.lang.get("joinInput.common.validation.email.doubleCheck"));
                    alert('시작일은 종료일 보다 이후일 수 없습니다.');
                }
            }
        });

        $('#devEdate').datepicker({
            // monthNames: ['년 1월', '년 2월', '년 3월', '년 4월', '년 5월', '년 6월', '년 7월', '년 8월', '년 9월', '년 10월', '년 11월', '년 12월'],
            // dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            showMonthAfterYear: true,
            dateFormat: dateFormat,
            buttonImageOnly: true,
            buttonText: '달력',
            onSelect: function (dateText) {
                if ($('#devSdate').val() != '' && $('#devSdate').val() > dateText) {
                    $('#devSdate').val($('#sDateDef').val());
                    $('#devEdate').val($('#eDateDef').val());
                    common.noti.tailMsg('devEmailId', common.lang.get("joinInput.common.validation.email.doubleCheck"));
                    alert('종료일은 시작일 보다 이전일 수 없습니다.');
                }
            }
        });
    }

    const mypage_all_select = () => {
 
        const $all_checkbox = $("#all-check");

        const allcheck = () => {
            $document.on("click", "#all-check", function(){
                const $each_checkbox = $document.find(".item-check");
                if ( $all_checkbox.is(":checked") ) {
                    $each_checkbox.prop("checked",true);
                } else {
                    $each_checkbox.prop("checked",false);
                }
            });
        }

        const itemcheck = () => {
            $document.on("click", ".item-check", function(){
                const $item_checkbox = $(".item-check");
                const _all_box_num = $document.find(".item-check").length;
                const _item_checked = $item_checkbox.filter(":checked").length;

                if ( _all_box_num == _item_checked ) {
                    $all_checkbox.prop("checked",true);
                } else {
                    $all_checkbox.prop("checked",false);
                }
            });
        }

        const select_init = () => {
            allcheck();
            itemcheck();
        }
        select_init();
    }

    // 마이페이지>나의상품후기 포토리뷰 슬라이드
    const reviewImgSlider = () => {        
        new Swiper('.review-img-area .swiper-container', {
            width: 150,
            spaceBetween: 20,
        }); 
    }

    //교환상품보기
    const showToggleBtn = () => {
        $document.on("click", ".js__exchange__toggle", function () {
            const $this = $(this);
            const _oid = $this.data('oitemid');

            $this.toggleClass("on");
            $('.' + _oid).toggle();
        })
    }

    const init = () => {
        window.reviewImgSlider = reviewImgSlider;

        mypage_seacharea();
        mypage_datepicker();
        mypage_all_select();
        showToggleBtn();
    }

    init();
}

export default mypage_common;