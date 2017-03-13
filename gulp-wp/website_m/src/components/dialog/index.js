//加载模块css
require('./css/dialog.css');
//加载模板
var html = require('./tmpl/dialog.html');

module.exports = function() {
	var $dialog = $(html).clone();
	$dialog.find('.close').on('click', function() {
		$(this).closest('.v-dialog').remove();
	});
	$('body').append($dialog);
}