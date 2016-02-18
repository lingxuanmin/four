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