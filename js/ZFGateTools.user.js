// ==UserScript==
// @name         智付网关自动选择银联/任意点提交/超时自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pay.dinpay.com/gateway?input_charset=UTF-8
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    Show("10_UPOP_ORG_Y_1568216");// 自动选择银联
    $(document).click(function(){
        submitForm('bank_pay'); // 页面任意位置点击提交
    });
    setTimeout(function(){
        window.location.reload(); // 超时自动刷新
    },900000);
    // Your code here...
})();