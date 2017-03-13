'use strict';

var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';

var entries = getEntry('src/js/page/**/*.js', 'src/js/page/');
var chunks = Object.keys(entries);

var config = {
	entry: entries,
	output: {
		path: path.join(__dirname, 'public'),
		publicPath: '/static/',
		filename: 'js/[name].js',
		chunkFilename: 'js/[id].chunk.js?[chunkhash]'
	},
	module: {
		loaders: [{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract('style', 'css')
		}, {
			test: /\.less$/,
			loader: ExtractTextPlugin.extract('css!less')
		}, {
			test: /\.html$/,
			loader: 'html?-minimize' //避免压缩html,https://github.com/webpack/html-loader/issues/50
		}, {
			test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: 'file-loader?name=fonts/[name].[ext]'
		}, {
			test: /\.(png|jpe?g|gif)$/,
			loader: 'url-loader?limit=8192&name=/img/[name]-[hash].[ext]'
		}]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'zepto'
		}),
		new CommonsChunkPlugin({
			name: 'vendors', //提取公共模块，生成名为'vendors'的chunk
			chunks: chunks,
			minChunks: chunks.length //提取所有entry共同依赖的模块
		}),
		new ExtractTextPlugin('css/[name].css'),
		debug ? function() {} : new UglifyJsPlugin({
			compress: {
				warning: true
			},
			except: ['$super', '$', 'exprts', 'require'] //排除关键字
		}),
	]
};

var pages = Object.keys(getEntry('src/views/**/*.html', 'src/views'));
pages.forEach(function(pathname) {
	var conf = {
		filename: '../views/' + pathname + '.html',
		template: 'src/views/' + pathname + '.html',
		inject: false, //js插入文档的位置,true为header, false为body
		/*
		 * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
		 * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
		 * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
		 * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
		 */
		// minify: { //压缩HTML文件
		//     removeComments: true, //移除HTML中的注释
		//     collapseWhitespace: false //删除空白符与换行符
		// }
	};
	if (pathname in config.entry) {
		conf.favicon = 'src/img/favicon.ico';
		conf.inject = 'body';
		conf.chunks = ['vendors', pathname];
		conf.hash = true;
	}
	config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;

function getEntry(globPath, pathDir) {
	var files = glob.sync(globPath);
	var entries = {},
		entry, dirname, basename, pathname, extname;
	for (let item of files) {
		dirname = path.dirname(item);
		extname = path.extname(item);
		basename = path.basename(item, extname);
		pathname = path.join(dirname, basename);
		pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
		entries[pathname] = ['./' + item];
	}
	return entries;
}