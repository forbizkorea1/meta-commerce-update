/*
 * Created by Forbiz on 2019-05-31.
 */

const shop_infoInput = () => {
    const $document = $(document);

    const fixedScroll = () => {
        sideScrollFix($(".js__stickyNav"), $(".js__sticky__start"), $(".js__sticky__finish"));
    };

    const coupon_popup_select = () => {
        $document
            .on("change", '[devcouponselect]', function() {

                const $this = $(this);
                if ($this.val()) {
                    $this.parents("tr").find(".coupon-box__choice-cancel")
                        .addClass('coupon-box__choice-cancel--active');
                } else {
                    $this.parents("tr").find(".coupon-box__choice-cancel")
                        .removeClass('coupon-box__choice-cancel--active');
                }
            })
    };

    const coupon_popup_cancel = () => {
        $document
            .on("click", '.coupon-box__choice-cancel a', function() {
                const $this = $(this);
                $this.parents("tr").find('select[devCouponSelect]').val('').trigger("change");
                return false;
            })
    };

    const delivery_tab = () => {
        $document.on("click", ".tab-link .tab-menu a", function() {
            const $this = $(this);
            const $tab_list = $this.parent('li');
            const $currunt_val = $this.attr('href');

            $('.tab-control ' + $currunt_val).show().siblings().hide();
            $tab_list.addClass('active').siblings('li').removeClass('active');
        })
    };

    const termModalOpen = () => {
        $document.on("click", ".term-content", function () {
            var title = $("input[name='" + this.name + "']").attr('title');
            var id = $("input[name='" + this.name + "']").attr('name');
            var content = $("#" + id);
    
            var target = "";
            var $modalContent = $('#devModalContent');
    
            $modalContent.attr("data-visible", !!target)
    
            if (target) {
                $modalContent.attr("data-target", target)
            }
    
            common.util.modal.open('html', title, content, fbModal.addClassToModal("fb__modal__agree"));
        });
    };

    const infoInput_init = () => {
        fixedScroll();

        coupon_popup_select();
        coupon_popup_cancel();
        delivery_tab();
        termModalOpen();
    };

    infoInput_init();
};

export default shop_infoInput;
