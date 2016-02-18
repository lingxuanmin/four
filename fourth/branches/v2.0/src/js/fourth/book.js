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