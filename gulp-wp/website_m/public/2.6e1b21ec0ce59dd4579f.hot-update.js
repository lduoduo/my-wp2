webpackHotUpdate(2,{

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {//加载模块css
	__webpack_require__(14);
	//加载模板
	var html = __webpack_require__(16);

	module.exports = function() {
		var $dialog = $(html).clone();
		$dialog.find('.close').on('click', function() {
			$(this).closest('.v-dialog').remove();
		});
		$('body').append($dialog);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

})