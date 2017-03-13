//引入css
require("../../lib/less/reset.css");
require("../../common/less/global.css");
require("../../common/less/grid.css");
require("../../common/less/common.less");
require("../index/index.less");

var folder_components = "../../components/";
var folder_common = "../../common/";

var oP = document.createElement('p');
oP.className = 'text';
oP.innerHTML = '这是由js生成的一句话。';
document.querySelector('.g-bd').appendChild(oP);

//增加事件
$('.btn').click(function() {
	//require([folder_components+'dialog/index.js'] 千万不要简写，会报错
	require(['../../components/dialog/index.js'], function(dialog) {
		dialog();
	});
});