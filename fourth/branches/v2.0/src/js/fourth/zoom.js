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