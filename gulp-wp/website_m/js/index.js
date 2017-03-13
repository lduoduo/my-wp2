webpackJsonp([1],{

/***/ 0:
/*!*********************************!*\
  !*** ./src/page/index/index.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {//引入css
	__webpack_require__(/*! ../../lib/less/reset.css */ 2);
	__webpack_require__(/*! ../../common/less/global.css */ 6);
	__webpack_require__(/*! ../../common/less/grid.css */ 8);
	__webpack_require__(/*! ../../common/less/common.less */ 11);
	__webpack_require__(/*! ../index/index.less */ 12);
	
	var folder_components = "../../components/";
	var folder_common = "../../common/";
	
	var oP = document.createElement('p');
	oP.className = 'text';
	oP.innerHTML = '这是由js生成的一句话。';
	document.querySelector('.g-bd').appendChild(oP);
	
	//增加事件
	$('.btn').click(function() {
		__webpack_require__.e/* require */(2, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [!(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())]; (function(dialog) {
			dialog();
		}.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! zepto */ 1)))

/***/ },

/***/ 12:
/*!***********************************!*\
  !*** ./src/page/index/index.less ***!
  \***********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=index.js.map