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
 * Created by 13092013 on 2014/7/23.
 */
iFourth.bookConNav = function() {
    var win = iFourth.win,
        bookcon = $('.bookcon'),
        booknav = $('.bookcon-side');

    // 区域最小高度控制
    var bookconHeight = bookcon.height(),
        booknavHeight = booknav.height();
    if (booknavHeight > bookconHeight) {
        bookcon.attr('style', 'min-height:' + booknavHeight + 'px;_height:' + booknavHeight + 'px');
    }

    bookcon.on('click', '.bookcon-side ul li', function() {
        var li = $(this),
            top = $(li.attr('rel')).offset().top - 45;

        li.addClass('current').siblings().removeClass('current');
        win.scrollTop(top);
    });

    win.scroll(function() {
        if (booknav.is(':visible')) {
            var sTop = win.scrollTop(),
                conTop = bookcon.offset().top,
                start = conTop - 36,
                end = bookcon[0].scrollHeight + conTop - 400;

            if (sTop > start && sTop < end) {
                booknav.css('top', sTop - conTop + 36 + 'px');
            }
            else if (sTop >= end) {
                booknav.css('top', end - conTop + 'px');
            }
            else {
                booknav.css('top','0');
            }
        }
        else {
            booknav.css('top','0');
        }
    });
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
 * Created by 13092013 on 2014/5/21.
 * 一些静态的页面效果初始化
 */

iFourth.init = function() {
    // 放大镜
    var zoom = new iFourth.Zoom('#imgZoom');
    // 面包屑
    iFourth.breadcrumb();
    // 数量选择
    iFourth.buyNum();
    // 商品属性选择
    iFourth.attrChoose();
    // 服务标签
    iFourth.servLabel();
    // 通子码效果
    iFourth.TZM.init();
    // 右侧栏zIndex控制
    iFourth.proSideIndex();
    // 右侧商家列表评价信息交互效果
    iFourth.showRating.start();
    // 右侧更多推荐
    iFourth.sideRec();
    // 分享按钮
    iFourth.shareBtn();
    // 倒计时开始
    iFourth.countdown(function(remain) {
        /* 倒计时回调函数，每隔1秒钟执行一次，参数为当前剩余的毫秒数 */
    });

    iFourth.showQRCode();

    iFourth.presell();

    iFourth.cuxiaoShow();
    iFourth.cuxiaoBtn();
    // 赠品
    // iFourth.zengpin();
    // S码绑定提示
    iFourth.scodeHelp();

    // 网友推荐
    iFourth.listloop({
        wrap: '#J-slide1',
        loopBox: '.proinfo-rec-list ul'
    });
    //无货推荐
    iFourth.listloop({
        wrap: '#J-slide2',
        loopBox: '.nopro-rec-list ul',
        step: { wide: 5, narrow: 4},
        scrollWidth: { wide: 775, narrow: 580}
    });
    iFourth.listloop({
        wrap: '#J-slide3',
        loopBox: '.nopro-rec-list ul',
        step: { wide: 5, narrow: 4},
        scrollWidth: { wide: 775, narrow: 580}
    });
    // 价格反馈
    iFourth.priceFeedbackDialog();
    // 自提弹窗
    iFourth.zitiPop();

    // 门店服务
    iFourth.o2oPop.init(function() {
        // 回调
    });

    //左边移入，增加z-index
    iFourth.leftZindex();

    // 任性付
    iFourth.renxingfu();

    // 合约机
    iFourth.heyueji(function(obj) {
        console.log(obj);
    });

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
        lazyelem.detect();
    });
    // 懒请求
    var lazyElems = iFourth.lazyAjax('.lazy-ajax', function(obj, url, data) {
        /**
         * 参数同Tab组件
         */
    });
    lazyElems['appraise'].handle = iFourth.appraise;
    lazyElems['consult'].handle = iFourth.consult;
    //参数及包装
    iFourth.wrapParam();
    // 套餐搭配
    iFourth.tiein();
    
    // 下面3句后期需要放到ajax回调中
    iFourth.tieInRec();
    iFourth.setMeal();
    ////// 精选搭配
    iFourth.tieInRec2.init();
    // 分类数据更新后刷新翻页效果  iFourth.tieInRec2.update();
    // 分类数据更新后切换显示分类  iFourth.tieInRec2.showType(type);
    // 所有精选搭配商品ID数组      iFourth.tieInRec2.existent
    iFourth.tieInTZM.init(function(obj) {
        // 在此处取数据，拼dom
        obj.find('.tiein-list-tzm').html($('#dom_tieinTZM').html());
        // 下面这句放到ajax回调里面
        iFourth.tieInTZM.show(obj);

        var pop = $('.tiein-tzm-pop');

        pop.on('click', '.btn-ok', function() {
            iFourth.tieInTZM.select();
        });
    });


    // 纠错按钮
    iFourth.putRight(function(btn) {
        // btn为当前被点击的纠错按钮
        console && console.log(btn);
    });

    // 历史记录
    iFourth.listloop({
        wrap: '#J-historyList',
        loopBox: '.scroll-box ul',
        step: { wide: 5, narrow: 4},
        scrollWidth: { wide: 900, narrow: 720},
        labelObj: $('#J-historyList-pager'),
        delay:3000
    });
    iFourth.listloop({
        wrap: '#J-historyRec',
        loopBox: '.scroll-box ul',
        step: { wide: 5, narrow: 4},
        scrollWidth: { wide: 900, narrow: 720},
        labelObj: $('#J-historyRec-pager'),
        delay:3000
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

    lazyelem.listen();

    // 右侧浮条
    iFourth.floatBar({zIndex:11000, contents : $("#snSideTools"),align :"right",vertical:"bottom",css:{"right":60,marginBottom:260}});//左悬浮

    //加入购物车弹窗示例，开发知晓后请删除
    iFourth.addCartPop.init();
    $('.btn-addcart').click(function() {
        iFourth.addCartPop.show();
    });

    // 图书四级
    if ($('.bookcon').size() > 0) {
        iFourth.bookConNav();
    }

    // 海外购
    iFourth.overseDeliver();

    $('#btn_jsd').unbind().bind("click", function() {
        $.mDialog({
            title: '温馨提示',
            message:$('#win_jsd'),
            css:{
                width:'460px'
            },
            overlay: true,
            overlayCss: {
                background: 'black',
                opacity:'0.3'
            },
            overlayClick:false
        });
    });
    //合约机弹框
    iFourth.hyjDialog.clickFun();
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
//        if(_step){
//            for(var j = 0; j < _step; j++){
//                moveBoxLi.eq(liLen-j-1).remove();
//            }
//        }
        len = Math.ceil(moveBoxLi.length/step);
        len = len == 0 ? 1 : len;
        liLen = moveBoxLi.length - _step;
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

/*单个切换*/
iFourth.singleloop = function(opt){
    var _opt = {
        wrap: '',
        loopBox: '',
        triggerLeft: '.prev',
        triggerRight: '.next',
        curCount: '.cur-count',
        totalCount: '.total-count',
        loopWidth:180,
        prePageWide:5,
        prePageNarrow:4,
        isLoop : false
    };
    $.extend(_opt,opt);
    var box = $(_opt.wrap),
        loopBox = box.find(_opt.loopBox),
        leftCtrl = box.find(_opt.triggerLeft),
        rightCtrl = box.find(_opt.triggerRight),
        isLoop = _opt.isLoop,
        totalCount = box.find(_opt.totalCount),
        curCount = box.find(_opt.curCount),
        prePage;

        if(screen.width >= 1200){
            prePage = _opt.prePageWide;
        }else{
            prePage = _opt.prePageNarrow;
        }

    //初始化当前页和总页数
    totalCount.text(box.find("li").size())
    curCount.text("1");

    if (box.find("li").size()<=_opt.prePageWide) {
        leftCtrl.hide();
        rightCtrl.hide();
    }
    //左翻
    function prev(box){
        var moveLen = "+="+_opt.loopWidth+"px";
        moveTo(moveLen,-1,box);
 
    };
    //右翻
    function next(box){
       
        moveTo("-="+_opt.loopWidth+"px",1,box);
    };
    //移动
    function moveTo(len,step,box){
        
         //更新当前数
        var current = parseInt(curCount.html()),
            total = parseInt(totalCount.html()),
            now = current +step;
        if(parseInt(curCount.html()) <= 1){
            leftCtrl.addClass("ctr-disabled");
            rightCtrl.removeClass("ctr-disabled");
        }
        //正在执行动画是不执行新动画
        if(loopBox.is(":animated")|| box.is(".ctr-disabled")){
            return false;
        }
        //ul移动
        loopBox.stop().animate({left:len});
       
        curCount.text(now);

        if(!isLoop){
            if(total - now < prePage){
                rightCtrl.addClass("ctr-disabled");
                leftCtrl.removeClass("ctr-disabled");
            }else{
                leftCtrl.removeClass("ctr-disabled");
                rightCtrl.removeClass("ctr-disabled");
            }
        }
        if(now <= 1){
            leftCtrl.addClass("ctr-disabled");
        }
    }
    //左翻
    leftCtrl.unbind().click(function(){
        prev($(this));
    });
    //右翻
    rightCtrl.unbind().click(function(){
        next($(this));
    });

    
};
/**
 * Created by 13092013 on 2014/5/27.
 * 面包屑导航下拉菜单
 */
iFourth.breadcrumb = function() {
    var body = iFourth.body;

    if (iFourth.ie6) {
        // 修复IE6下下拉框自适应的问题
        $('.breadcrumb .dropdown').each(function() {
            var obj = $(this);
            obj.css('width', obj.width());
        });
    }
    $('.breadcrumb .dropdown-text a').click(function(e) {
        e.stopPropagation();
    });
    body.off('click.breadcrumb').on('click.breadcrumb', '.breadcrumb .dropdown', function(e) {
        if ($(this).find('.dropdown-option').size() == 0) {
            return false;
        }
        $(this).toggleClass('dropdown-active').siblings().removeClass('dropdown-active');
        e.stopPropagation();
    });
    body.click(function() {
        $('.breadcrumb .dropdown').removeClass('dropdown-active');
    });
};
iFourth.breadcrumbSize = function(obj) {
    // 下拉框宽度设置
    var len = obj.children().size();

    len = len > 6 ? 6 : len;
    obj.width(len * 80);
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
    input.unbind().on('keyup paste click drop', function(e){
        var n = parseInt(input.val());
        n = n ? n : 1;
        n = n > max ? max : n;

        if (e.type == 'drop') {
            setTimeout(function() {
                input.val(num = n);
                status();
            }, 100);
        }
        else {
            input.val(num = n);
            status();
        }
    });
    status();
};

/**
 * Created by 13092013 on 2014/5/27.
 * 服务标签部分效果
 */
iFourth.servLabel = function() {
    var timer;
    $('.mainbtns a[tooltip]').hover(function(e) {
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

    $('.proinfo-serv span[data-tip]').hover(function(e) {
        //if (e.target.className == 'tooltip') return false;
        var obj = $(this),
            tip = obj.attr('data-tip'),
            link = obj.attr('data-link');

        obj.siblings().find(".tooltip").remove();

        clearTimeout(timer);
        if (tip && obj.find('.tooltip').size() == 0) {
            timer = setTimeout(function () {

                var dom = '<div class="tooltip"><i class="lion"></i><i class="arr"></i>' + tip;
                    // name = obj.attr("data-name");

                // if(obj.attr("data-link") != '' || obj.attr("data-link") != undefined){
                //     dom += ' <a href="'+ link +'" target="_blank" class="b" name="'+ name +'">查看详情</a>';
                // }

                dom += '</div>';

                var pop = $(dom)
                    .appendTo(obj).fadeIn(100);

                pop.css('left', -(pop.outerWidth()-obj.outerWidth())/2)

            }, 100);
        }
    }, function() {
        clearTimeout(timer);
        var that = $(this);

        timer = setTimeout(function() {
            that.find('.tooltip').fadeOut(100, function() {
                $(this).remove();
            });
        },300);
        
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
//        var r = '';
//        $('.proattr-radio li.selected, .proattr-check li.selected').each(function() {
//            r += '"' + $(this).attr('title') + '" ';
//        });
//        $('.proinfo-bangke input:checked').each(function() {
//            r += '"' + $(this).next('label').text() + '" ';
//        });
//        result.text(r);
//        (r == '' && $('#phonedl li.selected').size() == 0) && resultBox.hide() || resultBox.show();
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
        $('.tzm').css("z-index","3");

    },
    hide: function() {
        this.border.hide();
        this.btnClose.hide();
        $('.tzm').css("z-index","2");
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
            side.animate({width: 0}, 300, function() {
                side.removeClass('proinfo-side-show');
            });
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
            h = sideHeight < 520 ? 520 : sideHeight;
            main.height(h - 40);
            side.height(h);
        }
        else {
            h = mainHeight < 520 ? 520 : mainHeight;
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


/* 右侧栏更多推荐 */
iFourth.sideRec = function() {
    var obj = $('#J-sideRec'),
        btn = obj.find('.more'),
        listitems = obj.find('.si-rec-list li'),
        pageCount = Math.ceil(listitems.size() / 2),
        page = 1;

    btn.click(function() {
        page = page == pageCount ? 1 : page + 1;

        var startItem = listitems.hide().eq((page - 1) * 2);
        startItem.add(startItem.next().get(0)).show().find('img[src3]').each(function() {
            var o = $(this);
            o.attr('src', o.attr('src3')).removeAttr('src3');
        });
    });
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
            barCon.children().appendTo(origin).find('.proinfo-mini').hide();
            bar.hide();
            status = 0;
        }
    });
};

/* 分享按钮 */
iFourth.shareBtn = function() {
    var box = $('.share');

    box.click(function(e) {
        box.toggleClass('share-active');
        e.stopPropagation();
    });
    iFourth.body.click(function() {
        box.removeClass('share-active');
    });
};

/* 预约倒计时 */
iFourth.countdown = function(cb) {
    var box = $('.proinfo-cd'),
        r = box.find('.countdown'),
        d = box.find('.d'),
        h = box.find('.h'),
        m = box.find('.m'),
        s = box.find('.s'),
        flag = 0;


    remain = parseInt(box.find('input:hidden').val());

    Time1 = parseInt(remain/3600/24);


    if(Time1 > 99){
        $(".proinfo-cd .d").addClass("d-three");
        flag = 1;
    }

    function down() {
        if (remain >= 1) {
            remain--;

            var theTime = remain;
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            var theTime3 = 0;// 天

            theTime3 = parseInt(remain/3600/24);
            theTime2 = parseInt(remain/3600%24);
            theTime1 = parseInt(remain/60%60);
            theTime = parseInt(remain%60);

            theTime = theTime<10 ? '0'+theTime : theTime.toString();
            theTime1 = theTime1<10 ? '0'+theTime1 : theTime1.toString();
            theTime2 = theTime2<10 ? '0'+theTime2 : theTime2.toString();
            if(theTime3>=10 && flag == 1){
                theTime3 = theTime3<100 ? '0'+theTime3 : theTime3.toString();
            }else if(theTime3 >=10 && flag == 0){
                theTime3 = theTime3;
            }
            else if(theTime3 <10 && flag == 1){
                theTime3 = '00'+theTime3;
            }else{
                theTime3 = '0'+theTime3;
            }
            
            d.text(theTime3);
            h.text(theTime2);
            m.text(theTime1);
            s.text(theTime);

            cb(remain);
        }
        setTimeout(arguments.callee, 1000);
    }
    down();
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

/* 自提弹窗 */
iFourth.zitiPop = function() {
    $('.btn-ziti').click(function() {
        $.mDialog({
            title: '现货门店列表',
            message:$('#win_ziti'),
            css:{
                width:'460px'
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

// /* 赠品 */
// iFourth.zengpin = function() {
//     var pop = $('#zengpin-popimg'), timer;

//     $('.zengpin li').hover(function() {
//         clearTimeout(timer);

//         var obj = $(this).find('img'),
//             src = obj.attr('src-large'),
//             pos = obj.position();

//         timer = setTimeout(function() {
//             if (pop.size()== 0) {
//                 pop = $('<img style="position:absolute; width:200px; height:200px; border:solid 1px #EEE; z-index:6;" />')
//                     .css({
//                         left: pos.left - 205,
//                         top: pos.top - 105
//                     })
//                     .appendTo('.proinfo-main');
//             }

//             pop.attr('src', src).show().animate({
//                 left: pos.left - 205
//             }, 200);

//             $('.proinfo-main').css('z-index', 6);
//         }, 200);

//     }, function() {
//         clearTimeout(timer);
//         timer = setTimeout(function() {
//             pop.hide();
//             $('.proinfo-main').css('z-index', 4);
//         }, 200);
//     });
// };

/* S码绑定提示 */
iFourth.scodeHelp = function() {
    var area = $('.proinfo-main'), timer;

    $('.scode-help-icon').hover(function() {
        var obj = $(this);

        clearTimeout(timer);

        timer = setTimeout(function() {
            var tip = $('<div class="scode-help-tip"><i></i>'+ obj.attr('data-tip') +'</div>'),
                pos = obj.position(),
                left = pos.left - 50,
                areaWidth = 587;

            if (left + 250 > areaWidth) {
                left = areaWidth - 250;
            }

            tip.css({
                position: 'absolute',
                top: pos.top + 25,
                left: left
            }).find('i').css('left', pos.left - left);

            area.append(tip);
        }, 100);
    }, function() {
        clearTimeout(timer);

        timer = setTimeout(function() {
            $('.scode-help-tip').remove();
        }, 100);
    });
};


/* 海外购配送 */
iFourth.overseDeliver = function() {
    var timer;

    if (iFourth.ie6) {
        $('.proinfo-deliver-oversea .process .bg').width($('.proinfo-deliver-oversea .process').outerWidth());
    }

    $('.proinfo-deliver-oversea').find('.process, .process-dropdown').hover(function() {
        clearTimeout(timer);

        var o = $(this);

        timer = setTimeout(function() {
            o.parents('.proinfo-deliver-oversea').addClass('proinfo-deliver-oversea-unfold');
        }, 100);
    }, function() {
        clearTimeout(timer);

        var o = $(this);

        timer = setTimeout(function() {
            o.parents('.proinfo-deliver-oversea').removeClass('proinfo-deliver-oversea-unfold');
        }, 100);
    });
};


/* 门店服务弹窗 */
iFourth.o2oPop = {
    init: function(callback) {
        var that = this,
            box = $('#win_o2o');

        // 弹窗入口
        $('.proinfo-serv .xianhuo, .proinfo-serv .yangji, .proinfo-serv .vgou, .proinfo-serv .tiemo').live('click', function() {
            var obj = $(this).closest('li'),
                title = box.find('.title h3');

            // 弹窗标题
            if (obj.hasClass('item6')) {
                title.text('体验店');
                box.addClass('tiyandian');
            }
            else {
                title.text('门店服务');
                box.removeClass('tiyandian');
        }

            that.show();
            callback(this);
        });
        iFourth.mask.click(function() {
            that.hide();
        });

        // 关闭按钮
        box.on('click', '.close', function() {
            that.hide();
            iFourth.mask.animate({opacity:0}, 200, function() {
                $(this).hide();
            });
        });

        // 更多
        box.on('click', '.areas .more', function() {
            $(this).parent().toggleClass('unfold');
        });

        // hover效果
        box.on('mouseenter mouseleave', '.o2o-service-main li', function(e) {
            if (e.type == 'mouseenter') {
                $(this).addClass('hover');
            }
            if (e.type == 'mouseleave') {
                $(this).removeClass('hover');
            }
        });
    },
    show: function() {
        var box = $('#win_o2o'),
            h = box.outerHeight();

        box.fadeIn(200);
        iFourth.mask.show().animate({opacity:0.3},200);

        // 初始化弹框位置
        if (iFourth.ie6) {
            box.css('top', iFourth.win.scrollTop() + (iFourth.win.height() - box.outerHeight()) / 2 - 20);
        }
        else {
            box.css('margin-top', - h / 2 - 20);
        }
    },
    hide: function() {
        $('#win_o2o').fadeOut(200);
    },
    updateFilter: function() {
        var areaHeight = $('#win_o2o .areas dd ul')[0].clientHeight;

        if (iFourth.ie6) {
            if (areaHeight > 50) {
                $('#win_o2o .areas dd').height(46);
            }
        }

        if (areaHeight > 50) {
            $('#win_o2o .more').show();
        }
        else {
            $('#win_o2o .more').hide();
        }
    },
    updateContent: function() {
        var i = $('#win_o2o .o2o-service-main li').size();

        if (i < 5) {
            $('#win_o2o .watermark').height((5-i) * 62);
        }
    }
};


/* 显示主二维码 */
iFourth.showQRCode = function() {
    // 下拉事件
    var btn = $('.qrcode-main'),
        timer = null;

    // btn.click(function(e) {
    //     btn.toggleClass('qrcode-main-unfold');

    //     e.stopPropagation();
    // });

    // $('body').click(function() {
    //     btn.removeClass('qrcode-main-unfold');
    // });

    btn.hover(function() {

        timer = setTimeout(function() {
            btn.addClass('qrcode-main-unfold');
        },200);

    },function() {
        clearTimeout(timer);
        btn.removeClass('qrcode-main-unfold');
    });

};


/* 任性付 */
iFourth.renxingfu = function(cb) {
    $('.renxf-list li').click(function() {
        var li = $(this);

        if (li.parent().is('.renxf-list-disable')) {
            return false;
        }

        li.toggleClass('current').siblings().removeClass('current');

        // 隐藏边框
        $('.renxf-box .tzm-border').hide();

        cb(li);
    });

//    $('.renxf-btn .btn-fenqi').click(function() {
//        if ($('.renxf-list').find('.current').size() == 0) {
//            $('.renxf-box .tzm-border').show();
//            return false;
//        }
//    });
};

/* 合约机 */
iFourth.heyueji = function(cb) {
    $('.proinfo-hyj dd li').click(function() {
        var li = $(this),
            index = li.index(),
            rel = $('.proinfo-hyj-rel'),
            luoji_tip = $('.luoji-tip');

        rel.find('li.selected').removeClass('selected');
        if (index == 0) {
            rel.hide();
            luoji_tip.show();
            cb(this);
        }
        else {
            luoji_tip.hide();
            rel.show().find('dd ul').hide().eq(index - 1).show().children('li:first').click();
        }

        showResult();
        //计算商家列表高度
        iFourth.mainHeight();
    });
    $('.proinfo-hyj-rel dd li').click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        cb(this);
        //计算商家列表高度
        iFourth.mainHeight();
    });

    function showResult() {
        var resultBox = $('.proattr-result'),
            result = resultBox.find('dd .result-text');

        var r = '';
        $('.proattr-radio li.selected, .proattr-check li.selected').each(function() {
            r += '"' + $(this).attr('title') + '" ';
        });
        $('.proinfo-bangke input:checked').each(function() {
            r += '"' + $(this).next('label').text() + '" ';
        });
        result.text(r);
        (r == '' && $('#phonedl li.selected').size() == 0) && resultBox.hide() || resultBox.show();
    }
};

/* 预订 */
iFourth.presell = function() {
    $('.presell-rule').unbind('click').click(function(e) {
        $(this).find('.content').toggle(100);
        e.stopPropagation();
    });
    $('body').unbind('click.presell').bind('click.presell', function() {
        $('.presell-rule .content').hide(100);
    });
};

//左边移入，增加z-index

iFourth.leftZindex = function() {

    var timer = null;

    $(".imgzoom-main").hover(function() {
        clearTimeout(timer);
        $(".proinfo-left").css("z-index","12");
    },function() {
        timer = setTimeout(function() {
            $(".proinfo-left").css("z-index","1");
        },200);
    });
};

//正在促销展示
iFourth.cuxiaoShow = function() {

    var list = $(".proinfo-promo ul .cuxiao-list"),
        length = list.size(),
        btn = $(".showBtn");

    btn.html("共"+length+"个促销<i></i>");

    if(length <= 2){
        list.show();
        return false;
    }

    btn.show();
    for( var i = 0; i < length; i++){
        if(i<2){
            list.eq(i).show(); 
        }else{
            list.eq(i).hide();
        }
        
    }
    iFourth.mainHeight();
};

iFourth.cuxiaoBtn = function() {

   
    var btn = $(".showBtn");

    btn.toggle(function() {

        var list = $(".proinfo-promo ul .cuxiao-list"),
            length = list.size();

        for(var j = 2; j < length; j++){
            list.eq(j).show();
            btn.addClass("open");
        }
        iFourth.mainHeight();

    },function() {

        var list = $(".proinfo-promo ul .cuxiao-list"),
            length = list.size();

        for(var j = 2; j < length; j++){
            list.eq(j).hide();
            btn.removeClass("open");
        }
        iFourth.mainHeight();
    });
};
//合约机弹框

iFourth.hyjDialog = {

    obj:"",

    callbackFun : function(data) {
        var html = data.html;
            obj.find('.content').html(html);
        $(".m-dialog").css("top","20%");
    },

    clickFun : function() {

        $(".g-hyj-btn").click(function(){
            $.mDialog({
                css:{
                    width:'608px'
                },
                http:function(element,opts){
                    obj = element;
                    $.ajax({
                        url:'http://hyjpre.cnsuning.com/fourPageLook/goLook.hs?phoneSku=121307256&provinceId=100&contractTypeCode=2&operatorId=2&busiType=2&cityId=9173',
                        cache:true,
                        dataType:'jsonp',
                        jsonpCallback: "iFourth.hyjDialog.callbackFun",
                        async:false,   // 必须设置为同步,如果需要异步请，设置css的高度。
                        success:function(data){
                            //element.find('.content').html(data);
                        }
                    });
                },
                closeFn:function(){
                    
                },
                title:'中国移动购机赠费业务办理',
                overlayClick:true,
                fadeIn:300,
                fadeOut:500

            })
        });
    }
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

        cb && cb(rel);

    });
}
/**
 * Created by 13092013 on 2014/5/29.
 * 套餐搭配效果
 */

iFourth.tiein = function() {
    var tiein = $('.tiein');

    tiein.on('mouseenter', '.tiein-list li', function() {
        $(this).addClass('hover');
    });
    tiein.on('mouseleave', '.tiein-list li', function() {
        $(this).removeClass('hover');
    });
};

/*参数及包装*/
iFourth.wrapParam = function(){
    //设置外层的width 为了居中显示
    var silideElement = $(".hover-liner"),
        lis = $(".prods-param-list li"),
        ul = $(".prods-param-list"),
        selectedLi = $(".prods-param-list .on"),
        selIndex = selectedLi.index(),
        hoverIndex = selIndex,
        width = liSize * 180,
        liSize = lis.size(),
        distance,timer;
    
    //选中和hover的li样式
    function _slide(distance){
        silideElement.stop().animate({left: distance},200);
    }

    function _countDistance(index,pIndex){
        //获取liner原来的位置
        var current = $(".hover-liner").offset().left,
            //目标位置
            target = $(".prods-param-list li").eq(index).offset().left;
        var slideDistance = target - current;
        if(slideDistance>0){
            slideDistance="+="+slideDistance+"px";
        }else{
            slideDistance="-="+(-slideDistance)+"px";
        }
        return slideDistance;
    }


    lis.hover(function() {
        silideElement.show();
        var _this=$(this),
        timer = setTimeout(function(){
            var index=_this.index();
            distance=_countDistance(index,hoverIndex);
            _slide(distance);
            hoverIndex = index;
        },200);
    }, function() {
        clearTimeout(timer);
    });
    
    ul.mouseleave(function() {
        //回到选中项上
        var selectedIndex = selectedLi.offset().left,
            firstIndex = $(".list-wrapper").offset().left;

        silideElement.stop().animate({left: selectedIndex-firstIndex},200,function(){
            silideElement.hide();
        });

        hoverIndex = selectedLi.index();
        
    });

    //获取焦点
    lis.click(function(){
        $(this).siblings().removeClass("on");
        $(this).addClass("on");
        selectedLi = $(this);
        var selectedIndex = selectedLi.offset().left,
            firstIndex = $(".list-wrapper").offset().left;
        hoverIndex = selectedLi.index();
        silideElement.stop().animate({left: selectedIndex-firstIndex},200);

        // 切换内容
        var index = $(this).index();
        $('.prods-show-rel').hide().eq(index).show();
    }).first().click();
    
    silideElement.css("left", selIndex*180+30+"px");

    //宽屏
    if(screen.width>=1200){
        if(liSize <= 5){
            $(".list-wrapper").css({width:width});
            //不显示 pre next
            $(".prods-show .prev").hide();
            $(".prods-show .next").hide();
        } 
    }else{
        if(liSize <= 4){
            //不显示 pre next
            $(".prods-show .prev").hide();
            $(".prods-show .next").hide();
        }
    }
    $(".prods-show .prev").addClass("ctr-disabled");
    //图片左右切换
    iFourth.singleloop({
        wrap: ".prods-show",
        loopBox: ".prods-param-list",
        triggerLeft: '.prev',
        triggerRight: '.next',
        loopWidth: 180,
        prePageWide:5,
        prePageNarrow:4,
        isLoop:false
        });
};

iFourth.tieInRec = function() {

    iFourth.listloop({
        wrap: '#J-slide-tieIn',
        loopBox: '.tiein-list ul',
        step: { wide: 4, narrow: 3},
        scrollWidth: { wide: 768, narrow: 561}
    });

    var box = $('#J-tieIn'),
        navitem = box.find('.tiein-nav a'),
        list = box.find('.tiein-list ul'),
        listitem = list.children('li'),
        checkbox = listitem.find('.check'),
        btn = box.find('.btn-addcart-mini'),
        $count = box.find('.tiein-count .count em'),
        $total = box.find('.price-total'),
        $diff = box.find('.price-diff'),
        $diffbox = $diff.parents('dl');

    box.find('.btn-dir').click(function() {
        iFourth.tieInTZM.close();
    });

    function clear() {
        checkbox.filter(':checked').prop('checked', false).click().removeAttr('checked');
    }

    navitem.click(function() {
        var obj = $(this),
            type = obj.attr('data-type');

        if (obj.is('.current')) {
            return false;
        }

        // clear();
        obj.addClass('current').siblings('a').removeClass('current');

        if (parseInt(type)) {
            listitem.addClass('hide').filter('[data-type="'+type+'"]').removeClass('hide');
        }
        else {
            listitem.removeClass('hide');
        }

        list.css('left', 0);
        box.find('.next, .prev').unbind();
        iFourth.listloop({
            wrap: '#J-slide-tieIn',
            loopBox: '.tiein-list ul',
            step: { wide: 4, narrow: 3},
            scrollWidth: { wide: 768, narrow: 561}
        });
    });

    checkbox.click(function() {
        if ($('.tiein-tzm-pop').is(':visible')) {
            return false;
        }

        var obj = $(this),
            li = obj.parents('li'),
            high = parseFloat(li.find('.high').val()),
            low = parseFloat(li.find('.low').val()),
            index = li.index(),
            img = li.find('img'),
            coord = img.offset();


        var item = obj.parents('li'),
            content = item.find('.tiein-list-tzm'),
            can = true;

        // 判断是否通子码
        if (iFourth.tieInTZM.enable && li.find('.handle').size() > 0) {
            if (content.attr('loaded')) {
                content.find('dl').each(function() {
                    if ($(this).find('li.selected').size() == 0) can = false;
                });

                if (!can) {
                    iFourth.tieInTZM.addCart = true;
                    iFourth.tieInTZM.pop(item);
                    return false;
                }
            }
            else {
                iFourth.tieInTZM.addCart = true;
                iFourth.tieInTZM.loadData(item);
                return false;
            }

        }


        var checked = obj.is(':checked');
        li[checked ? 'addClass' : 'removeClass']('selected');

        // 加入购物车动画效果
        var coordDest = btn.offset();
        coordDest.top = coordDest.top - 30;
        coordDest.left = coordDest.left + 37;

        if(checked) {
            $count.text(parseInt($count.text()) + 1);
            $total.text((parseFloat($total.text()) + low).toFixed(2));
            $diff.text((parseFloat($diff.text()) + high - low).toFixed(2));

            // 已优惠区域展示
            parseFloat($diff.text()) > 0 && $diffbox.show() || $diffbox.hide();

            //创建动画
            var animateObj = $('<div><img src="' + img.attr('src') + '" /></div>')
                .attr({
                    'id': 'animateObj' + index,
                    'class': 'add-cart-animateObj'
                })
                .css({
                    'top': coord.top,
                    'left': coord.left
                })
                .appendTo('body');

            animateObj.animate({ top: btn.offset().top - 30, left: coordDest.left, width:30, height:30, opacity:1}, 600, function () {
                animateObj.animate({ top: '+=30px', height: 0}, 400, function () {
                    animateObj.remove();
                    var iconPlus = $('<span class="icon-plusone"></span>').appendTo(btn);
                    iconPlus.animate({ bottom: '+=10px', opacity: 0}, 600, function () {
                        iconPlus.remove();
                    });
                });
            });
        }
        else {
            $count.text(parseInt($count.text()) - 1);
            $total.text((parseFloat($total.text()) - low).toFixed(2));
            $diff.text((parseFloat($diff.text()) - high + low).toFixed(2));
            // 移除动画
            var animateObj = $('#animateObj' + index);
            animateObj.stop().fadeOut(500, function() {
                animateObj.remove();
            });

            parseFloat($diff.text()) > 0 && $diffbox.show() || $diffbox.hide();
        }
    });
    box.find('.reset').click(function() {
        clear();
    });

    // 选择规格按钮
    listitem.find('.handle a').click(function() {
        var obj = $(this).parents('li'),
            chk = obj.find('.check');

        if (chk.is(':checked')) {
            chk.prop('checked', false).click().removeAttr('checked')
        }

        iFourth.tieInTZM.pop(obj);
    });
};

iFourth.tieInRec2 = {
    init: function() {

        iFourth.listloop({
            wrap: '#J-slide-tieIn2',
            loopBox: '.tiein-list ul',
            step: { wide: 4, narrow: 3},
            scrollWidth: { wide: 768, narrow: 561}
        });

        var box = $('#J-tieIn2'),
            navitem = box.find('.tiein-nav a'),
            list = box.find('.tiein-list ul'),
            listitem = list.children('li'),
            checkbox = listitem.find('.check'),
            btn = box.find('.btn-addcart-mini'),
            $count = box.find('.tiein-count .count em'),
            $total = box.find('.price-total'),
            $diff = box.find('.price-diff'),
            $diffbox = $diff.parents('dl');

        box.find('.btn-dir').click(function() {
            iFourth.tieInTZM.close();
        });

        // 挂属性
        this.box = box;
        this.list = list;

        function clear() {
            box.find('.tiein-list li :checked').prop('checked', false).click().removeAttr('checked');
        }

        // 储存已有商品ID
        var existent = [];
        listitem.each(function() {
            existent.push($(this).attr('data-id'));
        });
        this.existent = existent;

        navitem.click(function() {
            var obj = $(this),
                type = obj.attr('data-type');

            if (obj.is('.current')) {
                return false;
            }

            // clear();
            obj.addClass('current').siblings('a').removeClass('current');

            $('.tiein-main-empty').hide();
            // 精选搭配
            if (!type) {
                list.children('li').addClass('hide').filter('[data-rec]').removeClass('hide');
                iFourth.tieInRec2.update();
            }
            // 分类
            else if (obj.attr('loaded')) {
                iFourth.tieInRec2.showType(type);
                iFourth.tieInRec2.update();
            }
            else {
                list.children('li').addClass('hide');
            }
        });
        box.on('click', '.check', function() {
            if ($('.tiein-tzm-pop').is(':visible')) {
                return false;
            }

            var obj = $(this),
                checked = obj.is(':checked'),
                li = obj.parents('li'),
                high = parseFloat(li.find('.high').val()),
                low = parseFloat(li.find('.low').val()),
                index = li.index(),
                img = li.find('img'),
                coord = img.offset();

            var item = obj.parents('li'),
                content = item.find('.tiein-list-tzm'),
                can = true;

            // 判断是否通子码
            if (iFourth.tieInTZM.enable && li.find('.handle').size() > 0) {
                if (content.attr('loaded')) {
                    content.find('dl').each(function() {
                        if ($(this).find('li.selected').size() == 0) can = false;
                    });

                    if (!can) {
                        iFourth.tieInTZM.addCart = true;
                        iFourth.tieInTZM.pop(item);
                        return false;
                    }
                }
                else {
                    iFourth.tieInTZM.addCart = true;
                    iFourth.tieInTZM.loadData(item);
                    return false;
                }

            }


            var checked = obj.is(':checked');
            li[checked ? 'addClass' : 'removeClass']('selected');

            // 加入购物车动画效果
            var coordDest = btn.offset();
            coordDest.top = coordDest.top - 30;
            coordDest.left = coordDest.left + 37;

            if(checked) {
                $count.text(parseInt($count.text()) + 1);
                $total.text((parseFloat($total.text()) + low).toFixed(2));
                $diff.text((parseFloat($diff.text()) + high - low).toFixed(2));

                // 已优惠区域展示
                parseFloat($diff.text()) > 0 && $diffbox.show() || $diffbox.hide();

                //创建动画
                var animateObj = $('<div><img src="' + img.attr('src') + '" /></div>')
                    .attr({
                        'id': 'animateObj' + index,
                        'class': 'add-cart-animateObj'
                    })
                    .css({
                        'top': coord.top,
                        'left': coord.left
                    })
                    .appendTo('body');

                animateObj.animate({ top: btn.offset().top - 30, left: coordDest.left, width:30, height:30, opacity:1}, 600, function () {
                    animateObj.animate({ top: '+=30px', height: 0}, 400, function () {
                        animateObj.remove();
                        var iconPlus = $('<span class="icon-plusone"></span>').appendTo(btn);
                        iconPlus.animate({ bottom: '+=10px', opacity: 0}, 600, function () {
                            iconPlus.remove();
                        });
                    });
                });
            }
            else {
                $count.text(parseInt($count.text()) - 1);
                $total.text((parseFloat($total.text()) - low).toFixed(2));
                $diff.text((parseFloat($diff.text()) - high + low).toFixed(2));
                // 移除动画
                var animateObj = $('#animateObj' + index);
                animateObj.stop().fadeOut(500, function() {
                    animateObj.remove();
                });

                parseFloat($diff.text()) > 0 && $diffbox.show() || $diffbox.hide();
            }
        });
        box.find('.reset').click(function() {
            clear();
        });

        // 选择规格按钮
        listitem.find('.handle a').click(function() {
            var obj = $(this).parents('li'),
                chk = obj.find('.check');

            if (chk.is(':checked')) {
                chk.prop('checked', false).click().removeAttr('checked')
            }

            iFourth.tieInTZM.pop(obj);
        });
    },

    update: function() {
        this.list.css('left', 0);
        this.box.find('.next, .prev').unbind();
        iFourth.listloop({
            wrap: '#J-slide-tieIn2',
            loopBox: '.tiein-list ul',
            step: { wide: 4, narrow: 3},
            scrollWidth: { wide: 768, narrow: 561}
        });
    },

    showType: function(type) {
        var selection = this.list.children('li').addClass('hide').filter('[data-type="'+type+'"]').removeClass('hide');

        if (selection.size() == 0) {
            $('.tiein-main-empty').show();
        }
    }
};

//套餐
iFourth.setMeal = function() {

    iFourth.listloop({
        wrap: '#J-slide-setMeal',
        loopBox: '.tiein-list ul:not(.hide)',
        step: { wide: 4, narrow: 3},
        scrollWidth: { wide: 768, narrow: 561}
    });

    //套餐清单
    iFourth.listloop({
        wrap: '#J-setMeal-list',
        loopBox: '.meal-list',
        triggerLeft: '.prev',
        triggerRight: '.next',
        step: { wide: 4, narrow: 3},
        scrollWidth: { wide: 880, narrow: 660}
        });


    //套餐清单pre next的隐藏
    var liSize = $(".meal-list li").size();
    if(screen.width >= 1200){
        if(liSize <= 4){
            $(".meal-wrapper .prev").hide();
            $(".meal-wrapper .next").hide();
        }
    }else{
        if(liSize <= 3){
            $(".meal-wrapper .prev").hide();
            $(".meal-wrapper .next").hide();
        }
    }
    $(".meal-wrapper .prev").addClass("ctr-disabled");
    //end
    var box = $('#J-setMeal'),
        navitem = box.find('.tiein-nav a'),
        list = box.find('.tiein-list ul'),
        listitem = list.children('li');

    navitem.click(function() {
        var obj = $(this),
            group = obj.attr('data-group');

        if (obj.is('.current')) {
            return false;
        }

        obj.addClass('current').siblings('a').removeClass('current');
        box.find('.tiein-list ul').addClass('hide').filter('[data-group="'+group+'"]').removeClass('hide');

        box.find('.next, .prev').unbind();
        list.css('left', 0);
        iFourth.listloop({
            wrap: '#J-slide-setMeal',
            loopBox: '.tiein-list ul:not(.hide)',
            step: { wide: 4, narrow: 3},
            scrollWidth: { wide: 768, narrow: 561}
        });
    });

};


// 通子码
iFourth.tieInTZM = {
    enable: false,
    addCart: false,

    currentItem: null,
    loadData: null,

    init: function(fn) {
        var that = this,
            pop = $('.tiein-tzm-pop');

        that.enable = true;
        that.loadData = fn;

        // 选择事件
        var obj = $(this),
            li = obj.find('li:not(.disabled,.c-disabled)'),
            input = obj.find('input:hidden');

        pop.on('click', '.main dl dd li:not(.disabled,.c-disabled)', function() {
            var o = $(this);
            o.addClass('selected').siblings().removeClass('selected');
            // 显示选择结果
            var text = '已选择：', r = [];
            pop.find('.main dl li.selected').each(function() {
                r.push($(this).attr('title'));
            });
            text += r.join('，');
            pop.find('.tip .normal').text(text).siblings().text('');
        });

        // 关闭事件
        pop.on('click', '.close,.btn-cancel', function() {
            that.close();
        });
    },

    pop: function(obj) {
        if (obj[0] == this.currentItem) {
            return;
        }

        var content = obj.find('.tiein-list-tzm');

        if (content.attr('loaded')) {
            iFourth.tieInTZM.show(obj);
        }
        else {
            iFourth.tieInTZM.loadData(obj);
        }
    },

    show: function(obj) {
        var content = obj.find('.tiein-list-tzm'),
            contentHtml = content.html(),
            pop = $('.tiein-tzm-pop');

        // 更改对象状态
        content.attr('loaded', 'loaded');
        this.currentItem = obj[0];

        // 定位弹框
        var itemLeft = obj.offset().left,
            boxLeft = $('.tiein-box').offset().left;

        pop.css('left', itemLeft - boxLeft + 120).show()
            .find('.main').html(contentHtml);
        // 显示选择结果
        var text = '已选择：', r = [];
        pop.find('.main dl li.selected').each(function() {
            r.push($(this).attr('title'));
        });
        if (r.length > 0) {
            text += r.join('，');
            pop.find('.tip .normal').text(text).siblings().text('');
        }
    },

    close: function() {
        this.currentItem = null;
        this.addCart = false;
        $('.tiein-tzm-pop').hide().find('.tip span').text('');
    },

    select: function() {
        var that = this,
            pop = $('.tiein-tzm-pop'),
            colorOK = true, typeOK = true,
            colorDL = pop.find('.tiein-tzm-color'),
            typeDL = pop.find('.tiein-tzm-buytype'),
            errtip = pop.find('.tip .error');

        if (colorDL.size() > 0 && colorDL.find('li.selected').size() == 0) {
            colorOK = false;
        }
        if (typeDL.size() > 0 && typeDL.find('li.selected').size() == 0) {
            typeOK = false;
        }
        if (!colorOK || !typeOK) {
            errtip.text('请选择颜色和尺码');
            if (colorOK) {
                errtip.text('请选尺码');
            }
            if (typeOK) {
                errtip.text('请选择颜色');
            }

            errtip.siblings().text('');
            return;
        }


        var current = $(that.currentItem);
        current.find('.tiein-list-tzm').html(pop.find('.main').html());

        // 加入购物车并关闭弹框
        if (that.addCart) {
            iFourth.tieInTZM.close();
            current.find('input.check').prop('checked', true).click().prop('checked', true);
        }
        else {
            iFourth.tieInTZM.close();
        }
    }
};
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
                that.popArea.stop(true,true).fadeIn(200);
                that.shot.stop(true,true).animate({opacity: '.5'}, 200);
            }, 100);
        }, function() {
            clearTimeout(timer);
            that.mainArea.unbind('mousemove');
            that.popArea.stop(true,true).fadeOut(200);
            that.shot.stop(true,true).animate({opacity: '0'}, 200);
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
            box.fadeIn(300).find('img[src3]').each(function() {
                $(this).attr('src', $(this).attr('src3')).removeAttr('src3');
            });
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