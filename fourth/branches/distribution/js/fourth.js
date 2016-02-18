(function(win) {

    var screen = win.screen,
        docElement = win.document.documentElement;

    if (screen.width > 1200) {
        docElement.className += docElement.className.length ? ' root1200' : 'root1200';
    }

})(window);


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
                _icon.attr("class","tipIcon fl tipOK3");
                break;
            case 'info':
                _icon.attr("class","tipIcon fl tipInfo3");
                break;
            case 'false':
                _icon.attr("class","tipIcon fl tipFalse3");
                break;
            case 'help':
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


/**
 * Created by 13092013 on 2014/5/13.
 * 四级页组件主文件
 */

var iFourth = iFourth || {
    ie6: !window.XMLHttpRequest,
    win: $(window),
    body: $('body'),
    mask: $('#J-overlay')
};


/**
 * Created by 13092013 on 2014/8/15.
 */
iFourth.floatBar = function(){

    //默认参数
    var _d = {
        contents: null,             //滚动条的内容，可以是DOM字符或者jQuery对象
        align: "right",             //水平方向对齐
        vertical: "middle",         //垂直方向对齐
        zIndex: 7500,                //Z轴值
        css: null,                   //附加样式
        id: null,                    //包裹容器的id，必要时可以设置id用来操作DOM
        ieFixed: true               //IE6及更低版本是否模拟fixed效果
    };

    //检测某些垃圾浏览器版本，并保存至变量
    var _ie = ($.browser.msie) ? parseInt($.browser.version) : false;

    //检测并合并传递的参数
    if (arguments.length < 1 || !(arguments[0] instanceof Object)) {
        return $.error("ECode.floatBar: 参数必须为JSON对象");
    }
    $.extend(_d, arguments[0]);

    //挂载DOM
    var _hideCss = {
        position: "fixed",
        top: "-9999em",
        left: "-9999em"
    };
    if (_ie && _ie <= 6) {
        _hideCss.position = "absolute";
    }
    $('<div class="ECode-floatBar"></div>').css(_hideCss).appendTo("body");

    //修正位置
    var _bar = $("body").find(".ECode-floatBar:last");
    _bar.append(_d.contents);
    var _bw = _bar.width(),
        _bh = _bar.height(),
        _css = {zIndex: _d.zIndex};
    if (_d.id != null) {
        _bar.attr("id", _d.id);
    }
    switch (_d.align) {
        case 'right':
            _css.left = 'auto';
            _css.right = 0;
            break;
        case 'left':
            _css.right = 'auto';
            _css.left = 0;
            break;
        case 'center':
            _css.right = 'auto';
            _css.left = '50%';
            _css.marginLeft = -_bw / 2;
            break;
    }
    switch (_d.vertical) {
        case 'top':
            _css.top = 0;
            break;
        case 'bottom':
            _css.top = 'auto';
            _css.bottom = 0;
            break;
        case 'middle':
            _css.top = '50%';
            _css.marginTop = -_bh / 2;
            if (_ie && _ie <= 6) {
                _css.marginTop = 0;
            }
            break;
    }
    _bar.css($.extend(_css, _d.css));

    /*
     * 以下代码针对IE6及更古老的版本
     * 如果感觉不爽，可以将 _d.ieFixed 置为 false
     * 那么IE6下将不会随屏滚动，囧~~
     * */
    var fixIE6 = function () {
        var _topHide = $(document).scrollTop(),  //页面上部被卷去高度
            _winHeight = $(window).height(),  //可视区域高度
            _winWidth = $(document).width();  //可视区域宽度
        switch (_d.vertical) {
            case 'top':
                _bar.stop().animate({top: _topHide});
                break;
            case 'bottom':
                var _newTop = _winHeight + _topHide - _bh;
                if (_d.css.marginBottom != null) {
                    var _mb = parseInt(_d.css.marginBottom);
                    //若果IE6下出现 margin-bottom 为负值，则忽略掉，否则合并计算得出 top 值
                    if (_mb >= 0) {
                        _newTop -= _mb;
                    }
                }
                _bar.css({marginTop: 0}).stop().animate({top: _newTop});
                break;
            case 'middle':
                _bar.stop().animate({top: _winHeight / 2 + _topHide - _bh / 2});
                break;
        }
    };
    if (_d.ieFixed && _ie && _ie <= 6) {
        fixIE6();
        $(window).scroll(function () {
            fixIE6();
        });
        $(window).resize(function () {
            fixIE6();
        });
    }

    // 工具事件
    $(window).scroll(function(){
        var topHide = $(document).scrollTop(); //页面上部被卷去高度
        var gotop = $("#gotop");
        if(topHide>20){
            gotop.show();
        }else{
            gotop.hide();
        }
    });

    // 二维码
    var ewmTimer;
    $(".erweima").hover(function(){
        clearTimeout(ewmTimer);
        $("#ewmPic").show().find("img").attr("src", $("#ewmPic").show().find("img").attr("src3"));
    }, function(){
        clearTimeout(ewmTimer);
        ewmTimer = setTimeout(function(){$("#ewmPic").hide();}, 200);
    });
};

iFourth.gotop = function(){
    $("html,body").scrollTop(0);
};


/**
 * Created by 13092013 on 2014/6/4.
 * 异步加载请求
 */

iFourth.lazyAjax = function(selector, cb) {

    var elems = {}, flag = true, timer, i,
        win = iFourth.win;

    $(selector).each(function() {
        var o = $(this);

        elems[o.attr('id')] = {
            obj: o,
            url: o.attr('data-url'),
            type: o.attr('data-type'),
            handle: null,
            enable: true
        };
    });

    win.scroll(function() {
        if (flag) {
            for (i in elems) {
                (function() {
                    var ele = elems[i],
                        obj = ele.obj,
                        url = ele.url,
                        type = ele.type || 'json',
                        enable = ele.enable,
                        trigger = (win.scrollTop() + win.height()) > (obj.offset().top - 50);

                    if (!enable || !trigger) {
                        return false;
                    }

                    if (url) {
                        type == 'jsonp'
                        && $.ajax({
                            url: url,
                            dataType: 'jsonp',
                            jsonp: 'jsonpcallback',
                            error: function(xhr, textStatus) {
                                cb(obj, url, {
                                    error: textStatus ? textStatus : 'unknown'
                                });
                            }
                        })
                        || $.ajax({
                            url: url,
                            type: 'get',
                            success: function(res) {
                                type == 'json' && cb(obj, url, res);
                                type == 'html' && obj.html(res);
                            },
                            error: function(xhr, textStatus) {
                                cb(obj, url, {
                                    error: textStatus ? textStatus : 'unknown'
                                });
                            }
                        });

                        elems[i].enable = false;
                    }

                    if (type == 'function' && ele.handle) {
                        ele.handle();
                        elems[i].enable = false;
                    }
                })();
            }

            flag = false;

            setTimeout(function() {
                flag = true;
            }, 200);
        }
    });

    // 先触发一次滚动事件
    win.scroll();

    return elems;
};

iFourth.appraise = function() {
    document.domain = 'cnsuning.com';
    $.getScript('http://zonedev.cnsuning.com:8080/review/project/zone/newFourthPage/js/getreview.js', function() {
        if (window.review) {
            review.getContent($('#appraise'));
        }
    });
};
iFourth.consult = function() {
    document.domain = 'cnsuning.com';
    $.getScript('http://zonedev.cnsuning.com:8080/review/project/zone/newFourthPage/js/getconsultation.js', function() {
        if (window.consultation) {
            consultation.getContent($('#consult'));
        }
    });
};
/**
 * Created by 13092013 on 2014/5/27.
 * 循环滚动
 */

iFourth.listloop = function(opt){
    /**
     * [ description by 12050231]
     * @param  {[type]} wrap [最外层DOM元素id或class]
     * @param  {[type]} loopBox [循环滚动的DOM元素]
     * @param  {[type]} triggerLeft [控制左移的按钮]
     * @param  {[type]} triggerRight [控制右移的按钮]
     * @param  {[Object]} step [滚动的元素数量]
     * @param  {[Object]} scrollWidth [滚动的宽度]
     * @param  {[type]} isLazyLoad [是否需要图片懒加载]
     * @param  {[type]} hasCount [是否有图片计数]
     * @param  {[type]} isLoop [是否循环]
     * @return {[type]}     [description]
     */
    var _opt = {
        wrap: '',
        loopBox: '',
        triggerLeft: '.prev',
        triggerRight: '.next',
        curCount: '.cur-count',
        totalCount: '.total-count',
        step: {
            wide: 4,
            narrow: 4
        },
        scrollWidth: {
            wide: 580,
            narrow: 580
        },
        hasCount: true,
        isLoop: true,
        isLazyLoad: true,
        delay: 0,
        hasLabel: false,
        labelObj: null,
        vertical: false
    };
    $.extend(_opt, opt);
    var box = $(_opt.wrap),
        leftCtrl = box.find(_opt.triggerLeft),
        rightCtrl = box.find(_opt.triggerRight),
        moveBox = box.find(_opt.loopBox),
        moveBoxLi = moveBox.find("li:not(.hide)"),
        step = _opt.step.wide,
        scrollWidth = _opt.scrollWidth.wide,
        len = Math.ceil(moveBoxLi.length/step),
        liLen = moveBoxLi.length,
        curCount = box.find(_opt.curCount),
        totalCount = box.find(_opt.totalCount),
        i = 0;
    if(screen.width < 1280){
        step = _opt.step.narrow;
        scrollWidth = _opt.scrollWidth.narrow;
        var _step = moveBoxLi.length%step;
    }
    _opt.hasCount && totalCount.html(len);
    leftCtrl.unbind().click(function(){
        prev();
    });
    rightCtrl.unbind().click(function(){
        next();
    });

    curCount.text('1');

    if (!_opt.isLoop) {
        leftCtrl.addClass('prev-disable');
    }
    if (len == 1) {
        rightCtrl.addClass('next-disable');
    }

    var pager = opt.labelObj, pagerDom = '', pageri;
    if (pager) {
        if (len <= 1) {
            pager.hide();
        }

        pager.find('.prev').unbind().click(function() {
            prev();
        });
        pager.find('.next').unbind().click(function() {
            next();
        })

        for (pageri = 0; pageri < len; pageri++) {
            pagerDom += '<li></li>';
        }
        pager.find('ul').html(pagerDom).find('li').click(function() {
            i = $(this).index();
            move(false, i);
        }).first().addClass('current');
    }

    function next() {
        if(len == 1 || moveBox.is(":animated")){return false;}
        if(!_opt.isLoop){
            i++;
            if(i >= len){i = len-1}
            move(function() {
                if (i==len-1) {
                    rightCtrl.addClass('next-disable');
                }
                leftCtrl.removeClass('prev-disable');
            },i);
            return;
        }
        if(i == len-1){
            for(var j = 0; j < step; j++){
                if (_opt.vertical) {
                    moveBoxLi.eq(j).css({"position": "relative", "top": len * scrollWidth + "px"});
                }
                else {
                    moveBoxLi.eq(j).css({"position": "relative", "left": len * scrollWidth + "px"});
                }
            }
        }
        i++;
        move(function(){
            if(i==len){
                i = 0;
                moveBoxLi.removeAttr("style");
                if (_opt.vertical) {
                    moveBox.css("top", i * scrollWidth);
                }
                else {
                    moveBox.css("left", i * scrollWidth);
                }
            }
        },i);
    }
    function prev() {
        if(len == 1 || moveBox.is(":animated")){return false;}
        if(!_opt.isLoop){
            i--;
            if(i <= 0){i = 0;}
            move(function() {
                if (i==0) {
                    leftCtrl.addClass('prev-disable');
                }
                rightCtrl.removeClass('next-disable');
            },i);
            return;
        }
        if(i==0){
            for(var j = 1; j <= step; j++){
                if (_opt.vertical) {
                    moveBoxLi.eq(liLen - j).css({"position": "relative", "top": -len * scrollWidth + "px"});
                }
                else {
                    moveBoxLi.eq(liLen - j).css({"position": "relative", "left": -len * scrollWidth + "px"});
                }
            }
        }
        i--;
        move(function(){
            if(i==-1){
                i = len-1;
                moveBoxLi.removeAttr("style");
                if (_opt.vertical) {
                    moveBox.css("top",-i*scrollWidth);
                }
                else {
                    moveBox.css("left",-i*scrollWidth);
                }
            }
        },i);
    }

    function move(callback, _index){
        lazyImg();
        if(_opt.hasCount){
            if(_index > len - 1){
                _index = 0
            }
            if(_index < 0){
                _index = len - 1
            }
            curCount.html(_index + 1);
        }
        if (!callback) {callback = function(){}};
        if (_opt.vertical) {
            moveBox.stop().animate({top:-i*scrollWidth},300,callback);
        }
        else {
            moveBox.stop().animate({left:-i*scrollWidth},300,callback);
        }
        // 同步分页标签
        chooseLabel(i==len ? 0 : i);
        if (pager) {
           pager.find('li').removeClass('current').eq(i==len ? 0 : i).addClass('current');
        }
    }
    function lazyImg(){
        if(!_opt.isLazyLoad){return;}
        for(var j = 0; j < step; j++){
            var _thisImg = moveBoxLi.eq(i*step + j).find('img');
            if(_thisImg.attr('src3')){
                _thisImg.attr('src', _thisImg.attr('src3')).removeAttr('src3').addClass('err-product');
            }
        }
    }

    // 项目扩展
    // 创建分页标签
    function creatLabel() {
        var dom = [], j, timer;
        dom.push('<ul class="pager">');
        for (j = 1; j <= len; j++) {
            dom.push('<li' + (j==1?' class="current"':'') + '>' + j + '</li>');
        }
        dom.push('</ul>');
        var pager = $(dom.join('')).appendTo(box);

        // 分页部分行为
        pager.find('li').hover(function() {
            var index = $(this).index();

            timer = setTimeout(function() {
                moveBox.find('li').eq((index+1)*step).prevAll().andSelf().find('img[src3]').each(function() {
                    var img = $(this);
                    img.attr('src', img.attr('src3')).removeAttr('src3').addClass('err-product');
                });
                moveBox.stop().animate({left:-index*scrollWidth},300);
                chooseLabel(index);
                i = index;
            }, 100);
        }, function() {
            clearTimeout(timer);
        });
    }
    function chooseLabel(i) {
        box.find('.pager li').removeClass('current').eq(i).addClass('current');
    }
    if (_opt.hasLabel) {
        creatLabel();
    }

    if (_opt.delay) {
        var auto = setInterval(function() {
            next();
        }, _opt.delay);

        box.hover(function() {
            clearInterval(auto);
        }, function() {
            auto = setInterval(function() {
                next();
            }, _opt.delay);
        });
    }
};


/**
 * Created by 13092013 on 2014/5/25.
 * 数量选择组件
 */
iFourth.buyNum = function() {
    var box = $('.proinfo-num'),
        btnMinus = box.find('.minus'),
        btnPlus = box.find('.plus'),
        input = box.find('input:text'),
        max = parseInt(input.attr('max') || 99),
        num = parseInt(input.val()) || 1;

    // 控制最大不超过99
    max = max > 99 ? 99 : max;

    function status() {
        num == 1 && btnMinus.addClass('minus-disable') || btnMinus.removeClass('minus-disable');
        num == max && btnPlus.addClass('plus-disable') || btnPlus.removeClass('plus-disable');
    }

    btnMinus.unbind().click(function() {
        !$(this).is('.minus-disable') && input.val(--num), status();
    });
    btnPlus.unbind().click(function() {
        !$(this).is('.plus-disable') && input.val(++num), status();
    });
    input.unbind().keyup(function() {
        var n = parseInt(input.val());
        n = n ? n : 1;
        n = n > max ? max : n;

        input.val(num = n);
        status();
    });
    status();
};

/**
 * Created by 13092013 on 2014/5/27.
 * 服务标签部分效果
 */
iFourth.servLabel = function() {
    var timer;

    $('.proinfo-serv span[tooltip], .mainbtns a[tooltip]').hover(function(e) {
        if (e.target.className == 'tooltip') return false;

        var obj = $(this),
            tip = obj.attr('tooltip');

        if (tip) {
            timer = setTimeout(function () {
                $('<div class="tooltip"><i></i>' + tip + '</div>').appendTo(obj).fadeIn(100);
            }, 100);
        }
    }, function() {
        clearTimeout(timer);
        $(this).find('.tooltip').fadeOut(100, function() {
            $(this).remove();
        });
    });
};

/**
 * Created by 13092013 on 2014/5/25.
 * 商品属性选择
 */

iFourth.attrChoose = function() {
    var resultBox = $('.proattr-result'),
        result = resultBox.find('dd .result-text');

    function showResult() {
        var r = '';
        $('.proattr-radio:not(#phonedl) li.selected, .proattr-check li.selected').each(function() {
            r += '"' + $(this).attr('title') + '" ';
        });
        $('.proinfo-bangke input:checked').each(function() {
            r += '"' + $(this).next('label').text() + '" ';
        });
        result.text(r);
        (r == '' && $('#phonedl li.selected').size() == 0) && resultBox.hide() || resultBox.show();
        iFourth.mainHeight();
    }

    function displayTZM() {
        var flag = true;
        $('#J-TZM dl:visible dd input:hidden').each(function() {
            if ($(this).val() == '') {
                flag = false;
            }
        });
        flag && iFourth.TZM.hide();
    }

    $('.proattr-radio').each(function() {
        var obj = $(this),
            li = obj.find('li:not(.disabled,.c-disabled)'),
            input = obj.find('input:hidden');

        li.click(function() {
            var o = $(this);
            o.addClass('selected').siblings().removeClass('selected');
            input.val(o.attr('data-id'));
            showResult();
            displayTZM();
        });
    });
    $('.proattr-check').each(function() {
        var obj = $(this),
            li = obj.find('li:not(.disabled)'),
            input = obj.find('input:hidden');

        li.click(function() {
            var o = $(this), v = [];
            o.toggleClass('selected');

            obj.find('li.selected').each(function() {
                v.push($(this).attr('data-id'));
            });
            input.val(v.join('|'));
            showResult();
            displayTZM();
        });
    });
    $('.proinfo-bangke input').change(function() {
        showResult();
    });

    showResult();
};

/**
 * 通子码效果
 */
iFourth.TZM = {
    init: function() {
        var that = this,
            obj = $('.tzm');

        this.border = obj.find('.tzm-border');
        this.btnClose = obj.find('.close');

        this.btnClose.click(function() {
            that.hide();
        });
    },
    show: function() {
        this.border.show();
        this.btnClose.show();
        if ($.browser.msie && $.browser.version == '7.0') {
            this.border.css('zoom', '1');
        }
    },
    hide: function() {
        this.border.hide();
        this.btnClose.hide();
    }
};

/**
 * 右侧栏控制
 */
iFourth.proSideIndex = function() {
    var side = $('.proinfo-side'),
        main = $('.proinfo-main'),
        sideHeight = side.height(),
        mainHeight = main.height();

    // 高度
    iFourth.mainHeight();

    // zIndex
    side.hover(function() {
        $(this).addClass('proinfo-side-hover');
    }, function() {
        $(this).removeClass('proinfo-side-hover');
    });

    // 宽窄屏
    $('.proinfo-side-switch').click(function() {
        var btn = $(this),
            icon = btn.find('p');

        if (side.is('.proinfo-side-show')) {
            icon.html('&lt;');
            side.removeClass('proinfo-side-show').animate({width: 0}, 300);
            btn.removeClass('proinfo-side-switch-unfold').animate({right: 0}, 300);
        }
        else {
            icon.html('&gt;');
            side.addClass('proinfo-side-show').animate({width: 199}, 300);
            btn.addClass('proinfo-side-switch-unfold').animate({right: 198}, 300);
        }
    });

    // 在窄屏下放一个白色块，把阴影遮住 ……
    if (!$('html').is('.root1200')) {
        side.append('<div class="temp-blank"></div>');
    }
};
iFourth.mainHeight = function() {
    var side = $('.proinfo-side').css('height', 'auto'),
        main = $('.proinfo-main').css('height', 'auto');

    if (side[0] && main[0]) {
        var sideHeight = side[0].scrollHeight,
            mainHeight = main[0].scrollHeight,
            h = 0;

        // 高度
        if (mainHeight < sideHeight) {
            h = sideHeight < 430 ? 430 : sideHeight;
            main.height(h - 40);
            side.height(h);
        }
        else {
            h = mainHeight < 430 ? 430 : mainHeight;
            main.height(h - 40);
            side.height(h);
        }
    }
};

/**
 * 价格反馈
 */
iFourth.priceFeedbackDialog = function() {
    // 打开价格反馈弹窗
    $('.btn-price-feedback').click(function() {
        $.mDialog({
            title: '请告诉我们更低的价格？',
            message:$('#win_priceFeedback'),
            css:{
                width:'480px'
            },
            overlay: true,
            overlayCss: {
                background: 'black',
                opacity:'0.3'
            },
            overlayClick:true
        });

        // 文本框placeholder
        $('.price-feedback-text').each(function() {
            var obj = $(this),
                defaultValue = obj.attr('default');

            obj.val(defaultValue);

            obj.focus(function() {
                var o = $(this);
                if (o.val() == defaultValue) {
                    o.val('');
                    o.addClass('price-feedback-text-dark');
                }
            });
            obj.blur(function() {
                var o = $(this);
                if (o.val() == '') {
                    o.val(defaultValue);
                    o.removeClass('price-feedback-text-dark');
                }
            });
        });

        $('#foundDate').click(function() {
            $('#J-calendar').click();
            return false;
        });

        // 初始化日历
        ECode.calendar({
            inputBox:"#J-calendar",
            showbox: '#foundDate',
            pos: {right:0, top:-230},
            range: { mindate: null,maxdate: new Date()},
            notdate: [],
            isWeek: false
        });
    });

    // 发现方式切换
    $('input[name=priceplace]').live('click', function() {
        var index = parseInt($(this).val());
        $('.price-feedback-form-item').hide().eq(index).show();
    });

    // 提交反馈
    $('.price-feedback-button .btn-submit').live('click', function() {
        $.unmDialog();
        $.mDialog({
            title: '温馨提示',
            message:$('#win_success'),
            css:{
                width:'480px'
            },
            overlay: true,
            overlayCss: {
                background: 'black',
                opacity:'0.3'
            },
            overlayClick:true
        });
    });
};

/* 加入购物车弹窗 */
iFourth.addCartPop = {
    elem: $('#addCartPop'),
    init: function() {
        var that = this,
            pop = this.elem;

        // 关闭按钮
        pop.find('.close').click(function() {
            that.hide();
        });
    },
    hide: function() {
        this.elem.hide();
        iFourth.mask.hide();
    },
    show: function() {
        var that = this,
            pop = this.elem,
            mask = this.mask,
            win = $(window);

        pop.css({
            marginTop: (win.height() - pop.outerHeight()) / 2,
            marginLeft: (win.width() - pop.outerWidth()) / 2
        }).show();

        //遮罩处理
        iFourth.mask.show();
    }
};


/* 详细信息Tab */
iFourth.procon = function() {
    var box = $('.procon'),
        origin = $('.procon-toolbar'),
        bar = $('#J-fixBar'),
        barCon = bar.find('.area'),
        proInfoMini = box.find('.proinfo-mini'),
        win = iFourth.win,
        status = 0;

    box.find('.tabarea-items li').click(function() {
        var ot = box.offset().top;
        if (win.scrollTop() > ot) {
            win.scrollTop(ot);
        }
    });

    box.find('.handle').hover(function() {
        proInfoMini.stop().show(200);
    }, function() {
        proInfoMini.stop().hide(200);
    });

    win.scroll(function() {
        var wt = win.scrollTop(),
            ot = box.offset().top;

        if (wt >= ot && status == 0) {
            origin.children().appendTo(barCon);
            bar.show();
            status = 1;
        }
        if (wt < ot && status == 1) {
            barCon.children().appendTo(origin);
            bar.hide();
            status = 0;
        }
    });
};


/* 参数纠错按钮 */
iFourth.putRight = function(callback) {
    $('#J-procon-param').on('mouseenter', 'tr', function() {
        $(this).find('.err').addClass('hover');
    }).on('mouseleave', 'tr', function() {
        $(this).find('.err').removeClass('hover');
    });

    // 弹框
    $('#J-procon-param').on('click', '.err a', function() {
        $.mDialog({
            title: '参数纠错',
            message:$('#paramWrongPop'),
            css:{
                width:'420px'
            },
            overlay: true,
            overlayCss: {
                background: 'black',
                opacity:'0.3'
            },
            overlayClick:true
        });

        callback && callback($(this));
    });

    // 提示
    $('#J-procon-param').on('click', '.pro-para-help', function() {
        $('.pro-para-tip').hide();
        $('.pro-para-tbl .name-inner').removeAttr('style');

        $(this).siblings('.pro-para-tip').show()
            .parent().css('z-index', '11');
    });
    $('#J-procon-param').on('click', '.pro-para-tip .close', function() {
        $(this).parent().hide()
            .parent().removeAttr('style');
    });
};


/**
 * Created by Tives on 2014/5/27 0027.
 */

iFourth.showRating = {

	/* 设置弹出框的位置 */
	setPosition : function(conf2){
		conf2.ele.stop().animate({
			top:conf2.val
		},400)
	},
	/* 设置弹出框的值 */
	setVal : function(conf){
		conf.ele1.stop().animate({
			width:conf.val
		},300);
		conf.ele2.text(conf.val);
	},

	start : function(){
		var that = this;
		var siWrap = $('.store-more'),
			moreInfo = siWrap.find('.more-info'),
			starVal = moreInfo.find('.star-val'),
			goodVal = moreInfo.find('.good-val');
		siWrap.on('mouseenter','.si-main ul li',function(){
			var _this = $(this),
				rating = _this.attr('rating'),
				top = _this.position().top;
			moreInfo.show();
			_this.addClass('hover');
			var conf = {
				'ele1':starVal,
				'ele2':goodVal,
				'val':rating
			};
			var conf2 = {
				'ele':moreInfo,
				'val':top
			};
			that.setVal(conf);
			that.setPosition(conf2);
		});
		siWrap.on('mouseleave','.si-main ul li',function(){
			var _this = $(this);
			_this.removeClass('hover');
			moreInfo.hide();
		});
	}
}

/**
 * Created by 13092013 on 2014/5/26.
 * Tab控件
 */

iFourth.Tab = function(tab, content, cb) {
    $(tab).children('li').click(function() {
        var li = $(this),
            rel = $(li.attr('rel')),
            url = li.attr('data-url'),
            type = li.attr('data-type') || 'json';

        if (li.is('.current')) {
            return false;
        }

        // 标签样式切换
        li.addClass('current').siblings().removeClass('current');

        // 内容切换
        rel.siblings(content).hide();
        rel.show().find('img[src3]').each(function() {
            var img = $(this);
            img.attr('src', img.attr('src3')).removeAttr('src3');
        });

        // 加载异步内容
        if (url && !li.attr('loaded')) {
            type == 'jsonp'
            && $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonp: 'jsonpcallback'
            })
            || $.get(url, function(res) {
                type == 'json' && cb(rel, url, res);
                type == 'html' && rel.html(res);
            });

            li.attr('loaded', 'loaded');
        }

        if (type == 'function') {
            cb(rel);
        }

    });
}



/**
 * Created by 13092013 on 2014/5/13.
 * 放大镜组件
 */

iFourth.Zoom = function(selector) {
    var box = $(selector);

    this.box = box;
    this.mainArea = box.find('.imgzoom-main');
    this.popArea = box.find('.imgzoom-pop');
    this.shot = box.find('.imgzoom-shot');
    this.mainImg = this.mainArea.children('img');
    this.largeImg = this.popArea.children('img');
    this.thumbList = box.find('.imgzoom-thumb-main ul');
    this.thumbItems = this.thumbList.children('li');
    this.btnPrev = box.find('.prev');
    this.btnNext = box.find('.next');
    this.count = this.thumbItems.size();
    this.page = 1;
    this.pageCount = this.count - 4;
    this.index = 0;
    this.srcMedium = '';
    this.srcLarge = '';

    this._init();
};

iFourth.Zoom.prototype = {
    _init: function() {
        var that = this, timer,
            firstItem = this.thumbItems.find('img').first();

        // 初始化对象属性
        this.srcMedium = firstItem.attr('src-medium');
        this.srcLarge = firstItem.attr('src-large');

        // 初始化显示状态
        this.thumbList.css('left', 0);
        this.btnPrev.addClass('prev-disable');
        if (this.thumbItems.size() <= 5) {
            this.btnNext.addClass('next-disable');
        }
        else {
            this.btnNext.removeClass('next-disable');
        }
        // 缩略图列表交互
        this.thumbItems.hover(function() {
            var li = $(this);
            timer = setTimeout(function() {
                that.choose(li.index());
            }, 100);
        }, function() {
            clearTimeout(timer);
        });
        this.btnPrev.unbind().click(function() {
            !$(this).is('.prev-disable') && that._paging(0);
        });
        this.btnNext.unbind().click(function() {
            !$(this).is('.next-disable') && that._paging(1);
        });

        // 放大效果
        this._zoom();
        // 视频操作
        this._video();
        // 弹框
        this._popInit();
        // 选中第一个
        this.choose(0);
    },
    _paging: function(type) {
        if (type) {
            this.thumbList.animate({left: '-=67px'}, 200);
            this.page++;
        }
        else {
            this.thumbList.animate({left: '+=67px'}, 200);
            this.page--;
        }
        if (this.page == this.pageCount) {
            this.btnNext.addClass('next-disable');
        }
        else {
            this.btnNext.removeClass('next-disable');
        }
        if (this.page == 1) {
            this.btnPrev.addClass('prev-disable');
        }
        else {
            this.btnPrev.removeClass('prev-disable');
        }
        // lazyload
        var img = this.thumbItems.eq(this.page + 3).find('img[src3]');
        img.attr('src', img.attr('src3'));
    },
    _zoom: function() {
        var that = this, timer;

        this.mainArea.hover(function(e) {
            // 没有大图的情况
            if (!that.srcLarge) return false;

            // 鼠标移动事件
            that.mainArea.mousemove(function(e) {
                that._shotPosition(e.pageX, e.pageY);
            });

            timer = setTimeout(function() {
                that.largeImg.attr('src', that.srcLarge);
                that.popArea.fadeIn(200);
                that.shot.animate({opacity: '.5'}, 200);
            }, 100);
        }, function() {
            clearTimeout(timer);
            that.mainArea.unbind('mousemove');
            that.popArea.fadeOut(200);
            that.shot.animate({opacity: '0'}, 200);
        });
    },
    _shotPosition: function(ex, ey) {
        var mainOffset = this.mainArea.offset(),
            shot = this.shot;

        var x = ex - mainOffset.left, y = ey - mainOffset.top,
            l = x - 101, t = y - 101;

        if (x - 101 <= 0) {
            l = 0;
        }
        if (x + 101 >= 400) {
            l = 198;
        }
        if (y - 101 <= 0) {
            t = 0;
        }
        if (y + 101 >= 400) {
            t = 198;
        }
        shot.css({left: l, top: t});

        // 大图位置
        this.largeImg.css({
            top: - t / 400 * 800,
            left: - l / 400 * 800
        });

    },
    _video: function() {
        var container = $('.imgzoom-video'),
            html = $('#videoHtml').html();

        $('.imgzoom-video-play').unbind().click(function() {
            container.append(html).show();
        });
        container.find('.close').unbind().click(function() {
            $(this).next().remove();
            container.hide();
        });
    },
    choose: function(index) {
        var li = this.thumbItems.eq(index),
            mainImg = this.box.find('.imgzoom-main img'),
            thumbImg = li.find('img');

        // 更新对象属性
        this.srcMedium = thumbImg.attr('src-medium');
        this.srcLarge = thumbImg.attr('src-large');
        this.index = index;

        // 切换选中样式
        li.addClass('current').siblings().removeClass('current');
        // 切换大图
        mainImg.attr('src', this.srcMedium);
    },

    _popInit: function() {
        var that = this,
            box = $('.imgview'),
            mainImg = box.find('.imgview-main img'),
            btnPrev = box.find('.mask-l'),
            btnNext = box.find('.mask-r'),
            countTotal = box.find('.imgview-count span'),
            countCurrent = box.find('.imgview-count em'),
            thumbListBox = box.find('.imgview-thumb-main'),
            thumbList = thumbListBox.children('ul'),
            thumbItems = thumbList.children('li'),
            pagePrev = box.find('.imgview-thumb .prev'),
            pageNext = box.find('.imgview-thumb .next'),
            btnClose = box.find('a.close'),
            page = 1,
            pageSize = 6,
            pageCount = Math.ceil(thumbItems.size() / 6);

        function select(i) {
            var item = thumbItems.removeClass('current').eq(i).addClass('current');
            mainImg.attr('src', item.find('img').attr('src-large'));
            that.index = i;
            // 跳转到相应页码
            to(Math.ceil((i+1)/6));
            countCurrent.text(that.index + 1);
        }
        function close() {
            that.choose(that.index);
            box.fadeOut(300);
            iFourth.mask.animate({opacity:0},300, function() {
                $(this).hide();
            });

        }
        function to(i) {
            if (i == page) return false;
            thumbList.animate({top: -(i-1) * 552}, 300);
            page = i;
        }

        // 缩略图翻页按钮
        if (pageCount > 1) {
            $('.imgview-thumb').removeClass('imgview-thumb-single');
        }
        else {
            $('.imgview-thumb').addClass('imgview-thumb-single');
        }

        thumbList.css('top', 0);

        // 展示统计
        countCurrent.text(that.index + 1);
        countTotal.text(that.count);

        // 显示隐藏
        this.mainArea.unbind('click').click(function() {
            // 没有大图的情况
            if (!that.srcLarge) return false;

            select(that.index);
            // 屏幕小的情况
            if (box.height() > iFourth.win.height()) {
                box.css({'position':'absolute', 'top':iFourth.win.scrollTop()+10+'px', 'margin-top':'0'});
            }
            box.fadeIn(300);
            iFourth.mask.show().animate({opacity:0.5},300);
        });
        btnClose.unbind().click(function() {
            close();
        });
        iFourth.mask.click(function() {
            close();
        });

        // 选择
        thumbItems.click(function() {
            select($(this).index());
        });
        btnPrev.unbind().click(function() {
            var total = that.thumbItems.size(),
                i = that.index == 0 ? (total - 1) : (that.index - 1);

            select(i);
        });
        btnNext.unbind().click(function() {
            var total = that.thumbItems.size(),
                i = that.index == (total - 1) ? 0 : (that.index + 1);

            select(i);
        });

        // 翻页
        pagePrev.unbind().click(function() {
            if (thumbList.is(':animated')) return false;
            to(page == 1 ? pageCount : page-1);
        });
        pageNext.unbind().click(function() {
            if (thumbList.is(':animated')) return false;
            to(page == pageCount ? 1 : page+1);
        });
    }
};




iFourth.init = function() {
    // 放大镜
    var zoom = new iFourth.Zoom('#imgZoom');
    // 数量选择
    iFourth.buyNum();
    // 商品属性选择
    iFourth.attrChoose();
    // 右侧栏zIndex控制
    iFourth.proSideIndex();
    // 右侧商家列表评价信息交互效果
    iFourth.showRating.start();
    // 价格反馈
    iFourth.priceFeedbackDialog();

    // 置顶工具条
    iFourth.procon();

    // 涉及懒加载的组件调用，后期需放到开发代码中
    // 左侧栏Tab
    iFourth.Tab('.toppro-tab', '.toppro-list' , function(obj, url, data) { });
    // 搭配Tab
    iFourth.Tab('.tiein-box .tabarea-items', '.tiein-box .tabarea-content' , function(obj, url, data) { });
    // 主内容Tab
    iFourth.Tab('.procon .tabarea-items', '.procon .tabarea-content' , function(obj, url, data) {
        /**
         * Tab组件的使用
         * 在需要加载异步内容的LI标签上绑定属性
         * data-url：请求地址
         * data-type：返回的数据类型，默认为json，可以设置为html
         *
         * 回调函数参数说明
         * @param {jQuery Object} obj tab内容的容器
         * @param {String} url 请求地址
         * @param {Object} data 返回的数据
         */
    });
    // 懒请求
    var lazyElems = iFourth.lazyAjax('.lazy-ajax', function(obj, url, data) {
        /**
         * 参数同Tab组件
         */
    });
    lazyElems['appraise'].handle = iFourth.appraise;
    lazyElems['consult'].handle = iFourth.consult;


    // 纠错按钮
    iFourth.putRight(function(btn) {
        // btn为当前被点击的纠错按钮
        console && console.log(btn);
    });

    // 地址控件
    $('#sncity').mCity({
        used:true,
        cityCb: function(data){
            //console.log(data);
        },
        distCb:function(data){
            //console.log(data);
        }
    });

    // 懒加载组件调用
    $("img[src2]").Jlazyload({type: "image", placeholderClass: "err-product"});

    // 右侧浮条
    iFourth.floatBar({zIndex:11000, contents : $("#snSideTools"),align :"right",vertical:"bottom",css:{"right":60,marginBottom:260}});//左悬浮

    //加入购物车弹窗示例，开发知晓后请删除
    iFourth.addCartPop.init();
    $('.btn-addcart').click(function() {
        iFourth.addCartPop.show();
    });
};

$(function() {
    iFourth.init();
});