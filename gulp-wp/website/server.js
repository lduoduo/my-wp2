//开发环境的服务器

'use strict';

var fs = require('fs');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var serverPort = 9999,
	devPort = 9099;
var exec = require('child_process').exec;
var cmdStr = 'PORT=' + serverPort + ' supervisor ./bin/www';
exec(cmdStr);

for (let i in config.entry) {
	config.entry[i].unshift('webpack-dev-server/client?http://localhost:' + devPort, 'webpack/hot/dev-server');
}
config.plugins.push(new webpack.HotModuleReplacementPlugin());

var proxy = {
	'*': 'http://localhost:' + serverPort
};

//启动服务
var app = new WebpackDevServer(webpack(config), {
	publicPath: '/static/',
	hot: true,
	proxy: proxy
});

app.listen(devPort, function() {
	console.log('dev server on port:' + devPort + '\n');
});