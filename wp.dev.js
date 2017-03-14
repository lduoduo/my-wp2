'use strict';
const path = require('path');
const webpack = require('webpack');

//清空build目录
var CleanPlugin = require('clean-webpack-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** 引入工具 */
const tool = require('./utils.js');

/** 监听源文件的根目录 */
const srcPath = path.resolve(__dirname, "src/app");
/** 文件生成后存放的根目录 */
const distPath = path.resolve(__dirname, "dist");
/** 服务器上的静态资源公开目录 */
const publicPath = '/static/';
/** 生成脚本样式之后的文件存放的路径前缀 */
const preStatic = 'other';

console.info('\n *************************************打包开始************************************ \n');
//循环遍历所有文件，获取html和其他文件目录信息
const info = tool.getEntry('src/app/**/**/*.*', preStatic);

var config = {
    /**
     * 从context的文件夹里读取entry里面所有的文件进行解析,打包代码里面的依赖(import / require)
     * 将所有东西打包到output.path对应的文件夹里, 使用output.filename对应的命名模板来命名([name]被entry里的对象键值替代)
     */
    context: srcPath,
    // the environment in which the bundle should run
    // changes chunk loading behavior and available modules
    target: "web",
    entry: info['entry'],
    output: {
        path: distPath,
        filename: '[name].js',
        // filename: '[name]-[chunkhash].js',
        publicPath: publicPath,
        /**
         * 这样就会把打包结果绑定到一个 window.myClassName 实例上。所以使用这种命名作用域，就可以调用 entry 点里面的方法了
         * 参考: https://webpack.js.org/concepts/output/#output-library
         */
        library: 'dodo',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?importLoaders=1',
                }),
            },
            {
                test: /\.(sass|scss)$/,
                // use: ["style-loader", "css-loader", 'sass-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                /** html文件里面的图片处理 
                 * 一个很常见的场景，将 HTML 导出到 .html 文件中，直接访问它们，而不是使用 javascript 注入。
                 * http://www.css88.com/doc/webpack2/loaders/html-loader/
                */
                test: /\.html$/,
                // use: ['file-loader?name=[path][name].[ext]','extract-loader','html-loader']
                // use: [ 'file-loader?name=html/[path][name].[ext]','extract-loader','html-loader' ]
            },
            {
                /** 用于js/css中引入的图片处理 
                 * https://webpack.js.org/loaders/url-loader/
                */
                test: /\.(png|jpg|jpeg|gif)$/,
                use: ['url-loader?limit=8192&name=img/[name].[hash:8].[ext]']
            }
        ]
    },
    resolve: {
        /**
         * 首先指定了我们自己的源文件目录，然后是 node_modules。
         * 这样子 Webpack 解决起来就会处理得更好一些，按照那个顺序先找我们的源文件目录，
         * 然后是已安装的 Node Modules（分别用你自己的源码和 Node Modules 目录替换其中的 src 和 node_modules）。
         */
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
    plugins: [
        /**
         * 先清空build目录
         * https://github.com/johnagan/clean-webpack-plugin
         */
        new CleanPlugin(["./dist/*"], {
            "root": "",
            // Write logs to console.
            "verbose": true,
            // Use boolean "true" to test/emulate delete. (will not remove files).
            // (Default: "false", remove files)
            "dry": false
        }),
        /**
         * 在 output 的文件里，如果有任意模块加载了两次或更多（通过 minChunks 设置该值），
         * 它就会被打包进一个叫 commons.js 的文件里，后面你就可以在客户端缓存这个文件了。
         * 当然，这肯定会造成一次额外的请求，但是却避免了客户端多次下载相同库的问题。
         * 所以在很多场景下，这都是提升速度的举措。
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: preStatic ? preStatic + '/commons.js' : 'commons.js',
            minChunks: 2
        }),
        /**
         * 或许你正在处理渐进式增强的网站，又或许因为其他的原因你需要一个分离的 CSS 文件。
         * 我们可以简单地实现，只需要在配置里用 extract-text-webpack-plugin 替换掉 style-loader，
         * 而无需改变其他任何代码。
         * https://github.com/webpack-contrib/extract-text-webpack-plugin
         */
        new ExtractTextPlugin({
            filename: "[name].css",
            // filename: "[name]-[chunkhash].css",
            allChunks: true,
        }),

        // new HtmlWebpackPlugin()
        //下面这种写法报错
        // new HtmlWebpackPlugin({ template: './index.html' })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "src"),
        // true for index.html upon 404, object for multiple paths
        historyApiFallback: true,
        inline: true,
        // hot module replacement. Depends on HotModuleReplacementPlugin
        hot: true,
        port: 9000,
        headers: {
            "X-Custom-Foo": "webpack demo"
        }
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 1000, // in ms
        // aggregates multiple changes to a single rebuild
    },
}

module.exports = config;

//html入口打包
var pages = Object.keys(info['html']);
console.info('\n\n *************************************html入口打包************************************ \n');
pages.forEach(function (pathname) {
    console.log('path----->%s', pathname);
    // var destname = pathname.substring((pathname.lastIndexOf('/')), pathname.lastIndexOf('.'));
    var destname = pathname.substring(0, pathname.lastIndexOf('/'));
    var foldername = preStatic ? preStatic + '/' + destname : destname;
    console.log('destpath----->%s', destname);
    var conf = {
        //生成的html存放路径，相对于output.path
        filename: './html/' + destname + '.html',
        // chunks: ['commons', preStatic ? preStatic + '/' + destname : destname],

        /** 
         * 原始html模板路径
         * template一定要写明
         * 不写的后果: js注入生成的html文件是个空的html文件
         */
        template: srcPath + '/' + pathname + '.html',
        //js插入的位置，true/'head'/'body'/false
        inject: 'body',
        /**
         * As soon as you now set alwaysWriteToDisk to true the generated output of the HtmlWebpackPlugin will always be written to disk.
         * This is very useful if you want to pick up the output with another middleware.
         */
        alwaysWriteToDisk: true,
        /**
         * If you need to set the output path explicitly (for example when using with webpack-dev-server middleware) then pass in the outputPath option
         */
        outputPath: distPath,
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

    // console.log('foldername/config.entry ---- >%s -- %s',foldername,JSON.stringify(config.entry));
    if (foldername in config.entry) {
        console.log('1');
        conf.favicon = path.resolve(__dirname, 'src/img/myico.ico');
        //js插入的位置，true/'head'/'body'/false
        conf.inject = 'body';
        conf.chunks = ['commons', foldername];
        // conf.hash = true;
    }

    config.plugins.push(new HtmlWebpackPlugin(conf));

});