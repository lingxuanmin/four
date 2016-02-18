/**
 * Created by 13092013 on 2014/5/9.
 * 工具类
 */
;
var Util = {

    printf: function(temp) {
        var args = arguments,
            i = 1;

        return temp.replace(/%s/g, function(){
            return args[i] ? args[i++] : '';
        });
    },

    toClockStr: function(t) {
        var h = Math.floor((t % (24 * 3600)) / 3600).toString(),
            m = Math.floor((t % 3600) / (60)).toString(),
            s = Math.floor(t % 60).toString();

        h = h.length === 1 ? "0" + h : h;
        m = m.length === 1 ? "0" + m : m;
        s = s.length === 1 ? "0" + s : s;

        return h + ":" + m + ":" + s;
    },

    checkkey: function(_this, e){
        //先把非数字的都替换掉，除了数字和.
        _this.value = _this.value.replace(/[^\d.]/g,"");
        //必须保证第一个为数字而不是.
        _this.value = _this.value.replace(/^\./g,"");
        //保证只有出现一个.而没有多个.
        _this.value = _this.value.replace(/\.{2,}/g,".");
        _this.value = _this.value.replace(/^\d{1,10}\.\d{3}?$/g,_this.value.substr(0, _this.value.length -1));
        //保证.只出现一次，而不能出现两次以上
        _this.value = _this.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    },

    /* 老四级部分方法 */
    lazyload: function(box){
        $(window).scroll(function(){
            $(box).find("img").each(function(){
                if($(window).scrollTop() > $(this).offset().top - $(window).height() && $(this).attr("src2")){
                    $(this).attr("src", $(this).attr("src2")).removeAttr("src2");
                }
            });
        })
    },
    alertBox : function(options){
        var defaults = {
            id : "proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            hasMask : true,
            submitRemove: false,
            iconType : "info",
            msg : ""
        };
        $("#attrWrongInfo").html("");
        var opts = $.extend({},defaults,options);
        var box = document.getElementById(opts.id);
        var winH = document.documentElement.scrollHeight;
        var winW = document.body.clientWidth;
        var isIE=!!window.ActiveXObject;
        var isIE6=isIE&&!window.XMLHttpRequest;
        var _hasMask = opts.hasMask ? 0.7 : 0;
        if($("#mask").length>0){
            $("#mask").remove();
        };
        var mask = document.createElement("div");
        mask.id = "mask";
        box.style.display = "block";
        var boxL = winW / 2 - box.clientWidth / 2;
        var boxT =  (document.body.scrollTop || document.documentElement.scrollTop) + window.screen.height/2 - box.clientHeight / 2 - 100;
        mask.style.cssText = "position:absolute;top:0;left:0;background:#333;height:" + winH + "px;width:" + winW + "px;z-index:10010;opacity:" + _hasMask + ";filter:alpha(opacity=" + _hasMask * 100 + ");";
        document.body.appendChild(mask);
        if(isIE6){
            var iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.top = 0;
            iframe.style.left = 0;
            iframe.style.zIndex = "10010";
            iframe.style.height = winH + "px";
            iframe.style.width = winW - 10 + "px";
            iframe.style.filter = "alpha(opacity=0)";
            document.body.appendChild(iframe);
        }
        box.style.zIndex = "10011";
        box.style.cssText = " ;display:block;left:" + boxL + "px;top:" + boxT + "px;z-index:10011;";
        document.getElementById(opts.closeId).onclick = removeBox;
        if(document.getElementById(opts.submit)){
            document.getElementById(opts.submit).onclick = function(){
                if(opts.submitRemove){
                    if($("#proPop").find(".msg").html().indexOf("此商品库存不足") != -1 || $("#proPop").find(".msg").html().indexOf("您购买的数量超过库存上限") != -1){
                        window.location.reload();
                    }
                    removeBox();
                }
                if(submitCorrectParam()){
                    removeBox();
                }
            }
        };
        function removeBox(){
            $("#attrWrongInfo").html("");
            box.style.display = "none";
            mask.parentNode.removeChild(mask);
            if(isIE6){
                iframe.parentNode.removeChild(iframe);
            }
        }
        var _icon = $(box).find(".tipIcon");
        switch(opts.iconType)
        {
            case 'ok':
//_icon.addClass("tipOK3");
                _icon.attr("class","tipIcon fl tipOK3");
                break;
            case 'info':
//_icon.addClass("tipInfo3");
                _icon.attr("class","tipIcon fl tipInfo3");
                break;
            case 'false':
//_icon.addClass("tipFalse3");
                _icon.attr("class","tipIcon fl tipFalse3");
                break;
            case 'help':
//_icon.addClass("tipHelp3");
                _icon.attr("class","tipIcon fl tipHelp3");
                break;
        };
        if(opts.msg){
            $(box).find(".msg").html(opts.msg);
        }
    },
    alertBoxForClose: function(msg){
        this.alertBox({
            id :"proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            iconType : "help",
            submitRemove: true,
            msg : msg
        });
        sn.status = false;
        if(sn.vendorCode == ""){
            initProductPrice(sn.cityId);
        }else{
            initCShopPrice(sn.cityId);
        }
    },

    //弹出框 错误信息
    alertErrorBox: function(msg){
        this.alertBox({
            id :"proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            iconType : "false",
            submitRemove: true,
            msg : msg
        });
    },

    //弹出框 帮助信息
    alertHelpBox: function(msg){
        this.alertBox({
            id :"proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            iconType : "help",
            submitRemove: true,
            msg : msg
        });
    },

    //弹出框 成功
    alertOkBox: function(msg){
        this.alertBox({
            id :"proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            iconType : "ok",
            submitRemove: true,
            msg : msg
        });
    }

};