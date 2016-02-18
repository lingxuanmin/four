/**
 * Created by 13092013 on 2014/5/21.
 * 一些静态的页面效果初始化
 */

iFourth.init = function() {
    // 放大镜
    var zoom = new iFourth.Zoom('#imgZoom');
    // 面包屑
    iFourth.breadcrumb();
    // 数量选择
    iFourth.buyNum();
    // 商品属性选择
    iFourth.attrChoose();
    // 服务标签
    iFourth.servLabel();
    // 通子码效果
    iFourth.TZM.init();
    // 右侧栏zIndex控制
    iFourth.proSideIndex();
    // 右侧商家列表评价信息交互效果
    iFourth.showRating.start();
    // 右侧更多推荐
    iFourth.sideRec();
    // 分享按钮
    iFourth.shareBtn();
    // 倒计时开始
    iFourth.countdown(function(remain) {
        /* 倒计时回调函数，每隔1秒钟执行一次，参数为当前剩余的毫秒数 */
    });

    iFourth.showQRCode();

    iFourth.presell();

    iFourth.cuxiaoShow();
    iFourth.cuxiaoBtn();
    // 赠品
    // iFourth.zengpin();
    // S码绑定提示
    iFourth.scodeHelp();

    // 网友推荐
    iFourth.listloop({
        wrap: '#J-slide1',
        loopBox: '.proinfo-rec-list ul'
    });
    //无货推荐
    iFourth.listloop({
        wrap: '#J-slide2',
        loopBox: '.nopro-rec-list ul',
        step: { wide: 5, narrow: 4},
        scrollWidth: { wide: 775, narrow: 580}
    });
    iFourth.listloop({
        wrap: '#J-slide3',
        loopBox: '.nopro-rec-list ul',
        step: { wide: 5, narrow: 4},
        scrollWidth: { wide: 775, narrow: 580}
    });
    // 价格反馈
    iFourth.priceFeedbackDialog();
    // 自提弹窗
    iFourth.zitiPop();

    // 门店服务
    iFourth.o2oPop.init(function() {
        // 回调
    });

    //左边移入，增加z-index
    iFourth.leftZindex();

    // 任性付
    iFourth.renxingfu();

    // 合约机
    iFourth.heyueji(function(obj) {
        console.log(obj);
    });

    // 置顶工具条
    iFourth.procon();

    // 涉及懒加载的组件调用，后期需放到开发代码中
    // 左侧栏Tab
    iFourth.Tab('.toppro-tab', '.toppro-list' , function(obj, url, data) { });
    // 搭配Tab
    iFourth.Tab('.tiein-box .tabarea-items', '.tiein-box .tabarea-content' , function(obj, url, data) { });
    // 主内容Tab
    iFourth.Tab('.procon .tabarea-items', '.procon .tabarea-content' , function(obj, url, data) {
        /**
         * Tab组件的使用
         * 在需要加载异步内容的LI标签上绑定属性
         * data-url：请求地址
         * data-type：返回的数据类型，默认为json，可以设置为html
         *
         * 回调函数参数说明
         * @param {jQuery Object} obj tab内容的容器
         * @param {String} url 请求地址
         * @param {Object} data 返回的数据
         */
        lazyelem.detect();
    });
    // 懒请求
    var lazyElems = iFourth.lazyAjax('.lazy-ajax', function(obj, url, data) {
        /**
         * 参数同Tab组件
         */
    });
    lazyElems['appraise'].handle = iFourth.appraise;
    lazyElems['consult'].handle = iFourth.consult;
    //参数及包装
    iFourth.wrapParam();
    // 套餐搭配
    iFourth.tiein();
    
    // 下面3句后期需要放到ajax回调中
    iFourth.tieInRec();
    iFourth.setMeal();
    ////// 精选搭配
    iFourth.tieInRec2.init();
    // 分类数据更新后刷新翻页效果  iFourth.tieInRec2.update();
    // 分类数据更新后切换显示分类  iFourth.tieInRec2.showType(type);
    // 所有精选搭配商品ID数组      iFourth.tieInRec2.existent
    iFourth.tieInTZM.init(function(obj) {
        // 在此处取数据，拼dom
        obj.find('.tiein-list-tzm').html($('#dom_tieinTZM').html());
        // 下面这句放到ajax回调里面
        iFourth.tieInTZM.show(obj);

        var pop = $('.tiein-tzm-pop');

        pop.on('click', '.btn-ok', function() {
            iFourth.tieInTZM.select();
        });
    });


    // 纠错按钮
    iFourth.putRight(function(btn) {
        // btn为当前被点击的纠错按钮
        console && console.log(btn);
    });

    // 历史记录
    iFourth.listloop({
        wrap: '#J-historyList',
        loopBox: '.scroll-box ul',
        step: { wide: 5, narrow: 4},
        scrollWidth: { wide: 900, narrow: 720},
        labelObj: $('#J-historyList-pager'),
        delay:3000
    });
    iFourth.listloop({
        wrap: '#J-historyRec',
        loopBox: '.scroll-box ul',
        step: { wide: 5, narrow: 4},
        scrollWidth: { wide: 900, narrow: 720},
        labelObj: $('#J-historyRec-pager'),
        delay:3000
    });

    // 地址控件
    $('#sncity').mCity({
        used:true,
        cityCb: function(data){
            //console.log(data);
        },
        distCb:function(data){
            //console.log(data);
        }
    });

    // 懒加载组件调用
    $("img[src2]").Jlazyload({type: "image", placeholderClass: "err-product"});

    lazyelem.listen();

    // 右侧浮条
    iFourth.floatBar({zIndex:11000, contents : $("#snSideTools"),align :"right",vertical:"bottom",css:{"right":60,marginBottom:260}});//左悬浮

    //加入购物车弹窗示例，开发知晓后请删除
    iFourth.addCartPop.init();
    $('.btn-addcart').click(function() {
        iFourth.addCartPop.show();
    });

    // 图书四级
    if ($('.bookcon').size() > 0) {
        iFourth.bookConNav();
    }

    // 海外购
    iFourth.overseDeliver();

    $('#btn_jsd').unbind().bind("click", function() {
        $.mDialog({
            title: '温馨提示',
            message:$('#win_jsd'),
            css:{
                width:'460px'
            },
            overlay: true,
            overlayCss: {
                background: 'black',
                opacity:'0.3'
            },
            overlayClick:false
        });
    });
    //合约机弹框
    iFourth.hyjDialog.clickFun();
};