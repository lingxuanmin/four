/* Modernizr 2.8.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-cssanimations-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-video-localstorage-websqldatabase-svg-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.0',

        Modernizr = {},


        docElement = document.documentElement,

        mod = 'modernizr',
        modElem = document.createElement(mod),
        mStyle = modElem.style,

        inputElem  ,


        toString = {}.toString,

        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



        omPrefixes = 'Webkit Moz O ms',

        cssomPrefixes = omPrefixes.split(' '),

        domPrefixes = omPrefixes.toLowerCase().split(' '),

        ns = {'svg': 'http://www.w3.org/2000/svg'},

        tests = {},
        inputs = {},
        attrs = {},

        classes = [],

        slice = classes.slice,

        featureName,


        injectElementWithStyles = function( rule, callback, nodes, testnames ) {

            var style, ret, node, docOverflow,
                div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

            if ( parseInt(nodes, 10) ) {
                while ( nodes-- ) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }

            style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }

            ret = callback(div, rule);
            if ( !body ) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;

        },



        isEventSupported = (function() {

            var TAGNAMES = {
                'select': 'input', 'change': 'input',
                'submit': 'form', 'reset': 'form',
                'error': 'img', 'load': 'img', 'abort': 'img'
            };

            function isEventSupported( eventName, element ) {

                element = element || document.createElement(TAGNAMES[eventName] || 'div');
                eventName = 'on' + eventName;

                var isSupported = eventName in element;

                if ( !isSupported ) {
                    if ( !element.setAttribute ) {
                        element = document.createElement('div');
                    }
                    if ( element.setAttribute && element.removeAttribute ) {
                        element.setAttribute(eventName, '');
                        isSupported = is(element[eventName], 'function');

                        if ( !is(element[eventName], 'undefined') ) {
                            element[eventName] = undefined;
                        }
                        element.removeAttribute(eventName);
                    }
                }

                element = null;
                return isSupported;
            }
            return isEventSupported;
        })(),


        _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
        hasOwnProp = function (object, property) {
            return _hasOwnProperty.call(object, property);
        };
    }
    else {
        hasOwnProp = function (object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }


    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
                bound = function () {

                    if (this instanceof bound) {

                        var F = function(){};
                        F.prototype = target.prototype;
                        var self = new F();

                        var result = target.apply(
                            self,
                            args.concat(slice.call(arguments))
                        );
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;

                    } else {

                        return target.apply(
                            that,
                            args.concat(slice.call(arguments))
                        );

                    }

                };

            return bound;
        };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                if (elem === false) return props[i];

                if (is(item, 'function')){
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        if(is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);

        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }



    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };


    tests['websqldatabase'] = function() {
        return !!window.openDatabase;
    };


    tests['hashchange'] = function() {
        return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    tests['history'] = function() {
        return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };



    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        if ( ret && 'webkitPerspective' in docElement.style ) {

            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };



    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };
    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



    Modernizr.addTest = function ( feature, test ) {
        if ( typeof feature == 'object' ) {
            for ( var key in feature ) {
                if ( hasOwnProp( feature, key ) ) {
                    Modernizr.addTest( key, feature[ key ] );
                }
            }
        } else {

            feature = feature.toLowerCase();

            if ( Modernizr[feature] !== undefined ) {
                return Modernizr;
            }

            test = typeof test == 'function' ? test() : test;

            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;

        }

        return Modernizr;
    };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;
    return Modernizr;

})(this, this.document);
;
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
/**
 * Created by 13092013 on 2014/5/9.
 * 工具类
 */
;
var Util = {

    printf: function(temp) {
        var args = arguments,
            i = 1;

        return temp.replace(/%s/g, function(){
            return args[i] ? args[i++] : '';
        });
    },

    toClockStr: function(t) {
        var h = Math.floor((t % (24 * 3600)) / 3600).toString(),
            m = Math.floor((t % 3600) / (60)).toString(),
            s = Math.floor(t % 60).toString();

        h = h.length === 1 ? "0" + h : h;
        m = m.length === 1 ? "0" + m : m;
        s = s.length === 1 ? "0" + s : s;

        return h + ":" + m + ":" + s;
    },

    checkkey: function(_this, e){
        //先把非数字的都替换掉，除了数字和.
        _this.value = _this.value.replace(/[^\d.]/g,"");
        //必须保证第一个为数字而不是.
        _this.value = _this.value.replace(/^\./g,"");
        //保证只有出现一个.而没有多个.
        _this.value = _this.value.replace(/\.{2,}/g,".");
        _this.value = _this.value.replace(/^\d{1,10}\.\d{3}?$/g,_this.value.substr(0, _this.value.length -1));
        //保证.只出现一次，而不能出现两次以上
        _this.value = _this.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    },

    /* 老四级部分方法 */
    lazyload: function(box){
        $(window).scroll(function(){
            $(box).find("img").each(function(){
                if($(window).scrollTop() > $(this).offset().top - $(window).height() && $(this).attr("src2")){
                    $(this).attr("src", $(this).attr("src2")).removeAttr("src2");
                }
            });
        })
    },
    alertBox : function(options){
        var defaults = {
            id : "proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            hasMask : true,
            submitRemove: false,
            iconType : "info",
            msg : ""
        };
        $("#attrWrongInfo").html("");
        var opts = $.extend({},defaults,options);
        var box = document.getElementById(opts.id);
        var winH = document.documentElement.scrollHeight;
        var winW = document.body.clientWidth;
        var isIE=!!window.ActiveXObject;
        var isIE6=isIE&&!window.XMLHttpRequest;
        var _hasMask = opts.hasMask ? 0.7 : 0;
        if($("#mask").length>0){
            $("#mask").remove();
        };
        var mask = document.createElement("div");
        mask.id = "mask";
        box.style.display = "block";
        var boxL = winW / 2 - box.clientWidth / 2;
        var boxT =  (document.body.scrollTop || document.documentElement.scrollTop) + window.screen.height/2 - box.clientHeight / 2 - 100;
        mask.style.cssText = "position:absolute;top:0;left:0;background:#333;height:" + winH + "px;width:" + winW + "px;z-index:10010;opacity:" + _hasMask + ";filter:alpha(opacity=" + _hasMask * 100 + ");";
        document.body.appendChild(mask);
        if(isIE6){
            var iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.top = 0;
            iframe.style.left = 0;
            iframe.style.zIndex = "10010";
            iframe.style.height = winH + "px";
            iframe.style.width = winW - 10 + "px";
            iframe.style.filter = "alpha(opacity=0)";
            document.body.appendChild(iframe);
        }
        box.style.zIndex = "10011";
        box.style.cssText = " ;display:block;left:" + boxL + "px;top:" + boxT + "px;z-index:10011;";
        document.getElementById(opts.closeId).onclick = removeBox;
        if(document.getElementById(opts.submit)){
            document.getElementById(opts.submit).onclick = function(){
                if(opts.submitRemove){
                    if($("#proPop").find(".msg").html().indexOf("此商品库存不足") != -1 || $("#proPop").find(".msg").html().indexOf("您购买的数量超过库存上限") != -1){
                        window.location.reload();
                    }
                    removeBox();
                }
                if(submitCorrectParam()){
                    removeBox();
                }
            }
        };
        function removeBox(){
            $("#attrWrongInfo").html("");
            box.style.display = "none";
            mask.parentNode.removeChild(mask);
            if(isIE6){
                iframe.parentNode.removeChild(iframe);
            }
        }
        var _icon = $(box).find(".tipIcon");
        switch(opts.iconType)
        {
            case 'ok':
//_icon.addClass("tipOK3");
                _icon.attr("class","tipIcon fl tipOK3");
                break;
            case 'info':
//_icon.addClass("tipInfo3");
                _icon.attr("class","tipIcon fl tipInfo3");
                break;
            case 'false':
//_icon.addClass("tipFalse3");
                _icon.attr("class","tipIcon fl tipFalse3");
                break;
            case 'help':
//_icon.addClass("tipHelp3");
                _icon.attr("class","tipIcon fl tipHelp3");
                break;
        };
        if(opts.msg){
            $(box).find(".msg").html(opts.msg);
        }
    },
    alertBoxForClose: function(msg){
        this.alertBox({
            id :"proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            iconType : "help",
            submitRemove: true,
            msg : msg
        });
        sn.status = false;
        if(sn.vendorCode == ""){
            initProductPrice(sn.cityId);
        }else{
            initCShopPrice(sn.cityId);
        }
    },

    //弹出框 错误信息
    alertErrorBox: function(msg){
        this.alertBox({
            id :"proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            iconType : "false",
            submitRemove: true,
            msg : msg
        });
    },

    //弹出框 帮助信息
    alertHelpBox: function(msg){
        this.alertBox({
            id :"proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            iconType : "help",
            submitRemove: true,
            msg : msg
        });
    },

    //弹出框 成功
    alertOkBox: function(msg){
        this.alertBox({
            id :"proPop",
            closeId : "proPopCloseBtn",
            submit : "proPopSubmit",
            iconType : "ok",
            submitRemove: true,
            msg : msg
        });
    }

};