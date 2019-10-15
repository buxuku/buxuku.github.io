// ==UserScript==
// @name         迷你付助手
// @version      0.1.1
// @description  自动点击迷你付选项
// @author       idragonet
// @match        https://cashier.95516.com/b2c*


// @run-at       document-end
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==

(function() {


    setTimeout(function(){
        if(document.getElementById('icpay-id')){
            console.info("点击支付");
            $("#icpay-id")[0].click();
        }


        if(document.getElementById('btnIcPay')){

            $("#btnIcPay").click();

        }

    },300);


})();