/**
 * Created by 13092013 on 2014/5/8.
 * 宽窄屏判断,默认为宽屏。
 */
;
(function(win) {

    var screen = win.screen,
        docElement = win.document.documentElement;

    if (screen.width > 1200) {
        docElement.className += docElement.className.length ? ' root1200' : 'root1200';
    }

})(window);