/**
 * Created by Tives on 2014/5/27 0027.
 */

iFourth.showRating = {

	/* 设置弹出框的位置 */
	setPosition : function(conf2){
		conf2.ele.stop().animate({
			top:conf2.val
		},400)
	},
	/* 设置弹出框的值 */
	setVal : function(conf){
		conf.ele1.stop().animate({
			width:conf.val
		},300);
		conf.ele2.text(conf.val);
	},

	start : function(){
		var that = this;
		var siWrap = $('.store-more'),
			moreInfo = siWrap.find('.more-info'),
			starVal = moreInfo.find('.star-val'),
			goodVal = moreInfo.find('.good-val');
		siWrap.on('mouseenter','.si-main ul li',function(){
			var _this = $(this),
				rating = _this.attr('rating'),
				top = _this.position().top;
			moreInfo.show();
			_this.addClass('hover');
			var conf = {
				'ele1':starVal,
				'ele2':goodVal,
				'val':rating
			};
			var conf2 = {
				'ele':moreInfo,
				'val':top
			};
			that.setVal(conf);
			that.setPosition(conf2);
		});
		siWrap.on('mouseleave','.si-main ul li',function(){
			var _this = $(this);
			_this.removeClass('hover');
			moreInfo.hide();
		});
	}
}
