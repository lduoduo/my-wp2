'use strict';

var webpack = require("webpack");
var glob = require('glob');
var path = require("path");

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
//该插件可以将样式提取到单独的css文件里，不会被打包到js文件里
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//webpack中生成html的插件，查看https://www.npmjs.com/package/html-webpack-plugin
var HtmlWebpackPlugin = require("html-webpack-plugin");


const debug = process.env.NODE_ENV !== 'production';

var entries = getEntry('src/page/*/*.js');
var chunks = Object.keys(entries);
console.log("entries:" + JSON.stringify(entries));
console.log("__dirname:" + __dirname);
var config = {
    entry: entries,
    output: {
        path: path.join(__dirname, "public"), //输出目录配置, 模板，样式，脚本，图片等资源路径配置都相对于它
        publicPath: "..", //模板，样式，脚本，图片资源对应的server上的路径
        filename: "js/[name].js", //每个页面对应的主js的生成配置,公共访问路径，替换CDN
        chunkFilename: "/scripts/[id].chunk.js?[chunkhash]" //异步加载时需要被打包的文件名
    },
    module: {
        loaders: [{
            test: /\.css$/,
            //配置css的抽取器和加载器
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }, {
            test: /\.less$/,
            //配置less的抽取器、加载器。中间!有必要解释一下，
            //根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
            //你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
            loader: ExtractTextPlugin.extract("style-loader!css-loader!autoprefixer-loader!less-loader")
        }, {
            test: /\.html$/,
            //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
            //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
            loader: "html?-minimize"
        }, {
            //文件加载器
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?name=./fonts/[name].[ext]"
        }, {
            //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            //如下配置，将小于8192byte的图片转成base64码
            test: /\.(png|jpg|gif)$/,
            loader: "url-loader?limit=8192&name=/img/[hash].[ext]"
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({ //加载zepto
            $: "zepto"
        }),
        new CommonsChunkPlugin({
            name: "vendors", //将公共模块提取，生成名为"vendors" 的chunk
            chunks: chunks, //提取哪些模块共有的部分
            minChunks: chunks.length //提取至少3个模块共有的部分
        }),
        new ExtractTextPlugin("./css/[name].css"), //单独使用link标签加载css并设置路径，相对于output配置中的publicPath
        //模板生成相关的配置，每个对于一个页面的配置，有几个写几个, 根据模板插入css/js等生成最终HTML
        new webpack.HotModuleReplacementPlugin(), //热加载
        debug ? function() {} : new UglifyJsPlugin({ //压缩代码
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require'] //排除关键字
        })
    ],
    watch: true,
    keepalive: true,
    // lessLoader: {
    //     lessPlugins: [
    //         new LessPluginAutoPrefix()
    //     ]
    // },
    //使用webpack-dev-server，提高开发效率
    devServer: {
        contentBase: "./",
        host: "localhost",
        port: 9090, //默认8080
        inline: true, //可以监控js变化
        hot: true //热启动
    }
}

module.exports = config;

var pages = Object.keys(getEntry('src/page/**/*.html'));
pages.forEach(function(pathname) {
    console.log('path:' + pathname);
    var destname = pathname.substring((pathname.lastIndexOf('/')), pathname.lastIndexOf('.'));
    var foldername = destname.replace('/', '');
    console.log('destpath:' + destname);
    var conf = {
        filename: './html' + destname + '.html', //生成的html存放路径，相对于path
        template: './src/page' + pathname + '.html', //html模板路径
        inject: 'body', //js插入的位置，true/'head'/'body'/false
        /*
         * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
         * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
         * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
         * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
         */
        // minify: { //压缩HTML文件
        // 	removeComments: true, //移除HTML中的注释
        // 	collapseWhitespace: false //删除空白符与换行符
        // }
    };
    if (foldername in config.entry) {
        console.log('1');
        conf.favicon = path.resolve(__dirname, 'src/img/favicon.ico');
        conf.inject = 'body';
        conf.chunks = ['vendors', foldername];
        conf.hash = true;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

function getEntry(url) {
    console.log("url:" + url);
    var entry = {};
    glob.sync(url).forEach(function(name) {

        /*
        循环所有文件，对文件名做处理，并放入entry数组中，返回entry
         */
        var n = "";
        // n = name.substring((name.lastIndexOf('/') + 1), name.lastIndexOf('.'));
        if (name.indexOf('html') != -1) {
            //是html页面
            n = name.substring(8, name.lastIndexOf('.'));
            // console.log("n_html:"+n);
        } else {
            //不是html页面  这里实际上只有js页面需要处理
            n = name.substring((name.lastIndexOf('/') + 1), name.lastIndexOf('.'));
            // console.log("n_js:"+n);
        }
        // name = name.replace(/\//gi, "/");
        console.log("file:" + name);
        name = __dirname + "\\" + name;
        name = name.replace(/\\/gi, "/");
        if (n.indexOf(".") != 0) {
            entry[n] = name;
        }
    });
    return entry;
};
