// ==UserScript==
// @name         ZF助手
// @version      0.1.2
// @author       idragonet
// @match        https://c.dinpay.com/inpourAccountMain
// @run-at       document-end
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==

(function() {
    //x上限，y下限
    var totalCount = 15;//标签个数
    var x = 1995;
    var y = 1999;
    var rand = parseInt(Math.random() * (x - y + 1) + y);
    var rand2 = parseInt(Math.random() * (9 - 1 + 1) + 1)/10;

    var tabsCount = sessionStorage.getItem('tabsCount');
    if(!tabsCount){
        sessionStorage.setItem('tabsCount',0);
        tabsCount = 0;
    }
    if(tabsCount < totalCount){
        setTimeout(function(){
            if(document.getElementById('amount') && document.getElementById('btnConfirm')){
                document.getElementById("amount").value = rand+rand2;
                $("#btnConfirm").click();
                sessionStorage.setItem('tabsCount',+tabsCount+1);
            }
        },300);
        setTimeout(function(){
            window.location.reload();
        },3000);
    }
})();