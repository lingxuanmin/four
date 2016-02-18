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