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