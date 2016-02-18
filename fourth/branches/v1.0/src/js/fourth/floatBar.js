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
