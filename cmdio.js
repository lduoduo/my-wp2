/** 获取命令行输入
 * https://github.com/chow-xiang/cocmdio
*/

'use strict';

var readline = require('readline');
/*process interface*/
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

exports.input = function (title) {
	return function(done){
		/*question*/
		rl.question(title || '', (answer) => {
	  		done(void 0, answer);
		});
	}
}

exports.close = function () {
	rl.close();
}