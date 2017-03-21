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
	var distPath = path.join(__dirname, destPath, projectName);

	var status = yield tool.checkDir(distPath);

	if (!status) {
		//拷贝文件
		if (/win32/gi.test(sys)) {

			yield tool.cmdFileCopy(srcPath, distPath);

		} else {

			yield tool.lsFileCopy(srcPath, distPath);

		}

		console.log(`\n项目初始化成功，项目目录: ${distPath}\n运行命令 npm run app进行热监听!`);

		cmdio.close();

	} else {

		console.log(status);

		yield* init();

	}
}