/**
 * Created by forbiz on 2019-02-11.
 */

import common from './divide/common';
import layout from './divide/layout';
import main from './divide/main';

import customer_common from './divide/customer_common';

import shop_goodsList from './divide/shop_goodsList';
import shop_goodsView from './divide/shop_goodsView';
import shop_goodsReview from './divide/shop_goodsReview';
import shop_cart from './divide/shop_cart';
import shop_infoInput from './divide/shop_infoInput';

import member_login from './divide/member_login';
import member_joinInput from './divide/member_joinInput';
import member_searchId from './divide/member_searchId';
import member_searchPw from './divide/member_searchPw';

import event_eventList from './divide/event_eventList';
import event_eventDetail from './divide/event_detail';
import exhibition_exhibitionDetail from './divide/exhibition_exhibitionDetail';

import mypage_common from './divide/mypage_common';
import mypage_mileage from './divide/mypage_mileage';
import mypage_coupon from './divide/mypage_coupon';
import mypage_orderCancel from './divide/mypage_orderCancel';

import fat from './divide/fat';
import 'jquery-form';
import 'jquery-ui';
import 'jquery-datetimepicker';
import datepickerFactory from 'jquery-datepicker';
import datepickerJAFactory from 'jquery-datepicker/i18n/jquery.ui.datepicker-ko';
datepickerFactory($);
datepickerJAFactory($);


import 'jstree';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/autocomplete';
window.$ = window.jquery = window.jQuery = require('jquery');

// datepicker default 옵션세팅
$.datepicker.setDefaults({
    yearRange: "c-100:c+10"
});

require('jquery-lazy');
require('jquery.scrollbar'); 
window.CryptoJS = require("crypto-js");
window.Handlebars = require("handlebars/dist/handlebars.js");

import Swiper from 'swiper/dist/js/swiper';
window.Swiper = Swiper;


const appMethods = {
    layout,
    main,

    shop_goodsList,
    shop_goodsView,
    shop_goodsReview,
    shop_infoInput,
    shop_cart,
    
    event_eventList,
    event_eventDetail,
    exhibition_exhibitionDetail,

    member_login,
    member_joinInput,
    member_searchId,
    member_searchPw,
    
    mypage_mileage,
    mypage_coupon,
    mypage_orderCancel,
};

//페이지별 공통
const pageCommonMethod = {
    "mypage": mypage_common,
    "customer": customer_common,
}

const appInit = () => {
    const appName = $('body').attr('id');
    
    if (appName) {
        [common, layout, appMethods[appName]].forEach(method => {
            if(method) method();
        });

        for (let [page, method] of Object.entries(pageCommonMethod)) {
            if (appName.indexOf(page)!= -1) {
                method();
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    appInit();

    if(window.common.fat && window.common.fat.useFat) window.dev_fat = await fat();
});