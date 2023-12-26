/**
 * Created by Forbiz on 2019-05-31.
 */

const shop_infoInput = () => {
    const $window = $(window);
    const $document = $(document);

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

            $tab_list.addClass('active').siblings('li').removeClass('active');
            $('.wrap-tab-cont ' + $currunt_val).show().siblings().hide();
            $($currunt_val).addClass('active');
        })


    };

    // 결제수단 선택
    const paymentMethod = () => {
        const paymentDefault = () => {
            const $payment = $(".js__paymentTab").find(".payment-mehtod__list").eq(0);
            if (!$payment.length) return ;

            const _paymentType = $payment.attr("devPaymentMethod");

            $payment.eq(0).addClass("on");
            $("[devPaymentDescription]").removeClass("show");
            $("[devPaymentDescription='"+ _paymentType +"']").addClass("show");
        }

        const paymentChange = () => {
            $(".js__paymentTab .payment-mehtod__list").on("click", function(e) {
                const $this = $(this);
                const _paymentType = $this.attr("devPaymentMethod");

                if (!$this.hasClass("on")) {
                    $this.addClass("on").siblings().removeClass("on");
                    $("[devPaymentDescription]").removeClass("show");
                    $("[devPaymentDescription='"+ _paymentType +"']").addClass("show");
                }

                e.preventDefault();
            });
        }

        const paymentInit = () => {
            paymentDefault();
            paymentChange();
        }

        paymentInit();
    };

    // 약관보기 레이어팝업
    const termsPopup = () => {
        const $termsLayer = $(".fb__terms-layer-pop");
        let _st = 0;

        const termsPopupOpen = () => {
            $('.js__termsLayer--open').on("click", function() {
                const $this = $(this);
                const _name = $this.attr("name");
                const title = $this.data("title");
                const id = $("input[name='"+ _name+"']").attr("name");

                _st = $window.scrollTop();
    
                $("body").css({
                    "overflow": "hidden",
                    "position": "fixed",
                    "marginTop": -$window.scrollTop(),
                });
    
                $("#agree_title").text(title);
                $(".pop-cont-detail").hide();
                $("#"+ id).show();
                $termsLayer.addClass('show');
            });
        };

        const termsPopupClose = () => {
            $(".fb__terms-layer-pop .close").on("click", function() {
                $termsLayer.removeClass('show');
                $("body").css({
                    "overflow": "",
                    "position": "",
                    "marginTop": "",
                });

                $window.scrollTop(_st);
            });
        };

        const termsPopupInit = () => {
            termsPopupOpen();
            termsPopupClose();
        };

        termsPopupInit();
        

    };

    const infoInput_init = () => {
        coupon_popup_cancel();
        delivery_tab();

        paymentMethod();
        termsPopup();
    };

    infoInput_init();
};

export default shop_infoInput;
