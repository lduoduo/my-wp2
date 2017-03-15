/** 项目初始化
 * 新加项目目录时，启动此文件
 */
// const os = require('os');
const path = require("path");


const co = require('co');
const cmdio = require('./cmdio.js');
const tool = require('./utils.js');


/** 获取模板路径 */
var srcPath = path.join(__dirname, "./template/project");
/** 获取destPath前缀 */
var destPath = "./src/app/";
/** 获取系统类型 */
var sys = process.platform; //或者使用node API ： os.type();
/** 脚本命令 */
var ls = null;

co(init);

function* init(){
	var projectName = yield cmdio.input('请输入项目英文名称:');
	destPath = path.join(__dirname, destPath, projectName);

	var status = yield tool.checkDir(destPath);

	if (!status) {
		//拷贝文件
		if (/win32/gi.test(sys)) {

			yield tool.cmdFileCopy(srcPath, destPath);

		} else {

			yield tool.lsFileCopy(srcPath, destPath);

		}

		console.log(`项目初始化成功，请进入目录开始愉快的工作吧: ${destPath}`);

		cmdio.close();

	} else {

		console.log(status);

		yield *init;

	}
}