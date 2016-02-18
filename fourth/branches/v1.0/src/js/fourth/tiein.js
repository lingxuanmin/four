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