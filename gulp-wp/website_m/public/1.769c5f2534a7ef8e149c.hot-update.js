webpackHotUpdate(1,[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {//引入css
	__webpack_require__(2);
	__webpack_require__(6);
	__webpack_require__(8);
	__webpack_require__(11);
	__webpack_require__(12);

	var folder_components = "../../components/";
	var folder_common = "../../common/";

	var oP = document.createElement('p');
	oP.className = 'text';
	oP.innerHTML = '这是由js生成的一句话。';
	document.querySelector('.g-bd').appendChild(oP);

	//增加事件
	$('.btn').click(function() {
		//require([folder_components+'dialog/index.js'] 千万不要简写，会报错
		__webpack_require__.e/* require */(2, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(14)]; (function(dialog) {
			dialog();
		}.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
])