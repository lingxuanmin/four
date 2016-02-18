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