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
import shop_infoInput from './divide/shop_infoInput';
import shop_search from './divide/shop_search';

import event_eventDetail from './divide/event_detail';

import member_searchId from './divide/member_searchId';
import member_searchPw from './divide/member_searchPw';

import mypage_common from './divide/mypage_common';
import mypage_mileage from './divide/mypage_mileage';
import mypage_receiptPrint from './divide/mypage_receiptPrint';
import mypage_myGoodsReview from './divide/mypage_myGoodsReview';

window.$ = window.jquery = window.jQuery = require('jquery');

import 'jquery-form';
import 'jquery-ui';
import 'jquery-datetimepicker';
import datepickerFactory from 'jquery-datepicker';
datepickerFactory($);

/** 
 * jquery-datepicker 언어팩 설정 ( html 태그 lang 기준 )
 */
const htmlLang = $('html').attr('lang');
let datepickerJAFactory;
let lang = $.datepicker.regional[ htmlLang ];

if (!lang || htmlLang !== 'en') {
    try {
        datepickerJAFactory = require(`jquery-datepicker/i18n/jquery.ui.datepicker-${htmlLang}`);
    }
    catch (e) {
        console.error(e);
        datepickerJAFactory = function() {
            $.datepicker.setDefaults( $.datepicker.regional[ '' ] );
        };
    }
}
else {
    datepickerJAFactory = function() {
        $.datepicker.setDefaults( $.datepicker.regional[ 'en' ] );
    };
}
datepickerJAFactory(jQuery);

import 'jstree';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/autocomplete';


// datepicker default 옵션세팅
$.datepicker.setDefaults({
    yearRange: "c-100:c+10"
});


import Swiper from 'swiper/dist/js/swiper';
window.Swiper = Swiper;

require('jquery-lazy');

window.CryptoJS = require("crypto-js");
window.Handlebars = require("handlebars/dist/handlebars.js");

import html2canvas from 'html2canvas';
window.html2canvas = html2canvas;


const appMethods = {
    layout,
    main,
    
    shop_goodsReview,
    shop_goodsList,
    shop_goodsView,
    shop_infoInput,
    shop_search,

    event_eventDetail,

    member_searchId,
    member_searchPw,
    
    mypage_mileage,
    mypage_receiptPrint,
    mypage_myGoodsReview,
};

//페이지별 공통
const pageCommonMethod = {
    "mypage": mypage_common,
    "customer": customer_common,
}

const appInit = () => {
    const appName = $('body').attr('id');

    if (appName) { 
        [common, layout, appMethods[appName]].forEach(method  => {
            if (method) method();
        });

        for (let [page, method] of Object.entries(pageCommonMethod)) {
            if (appName.indexOf(page)!= -1) {
                method();
            }
        }
    }
};
document.addEventListener('DOMContentLoaded', () => {
    appInit();
});