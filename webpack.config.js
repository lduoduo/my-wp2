'use strict';
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    /**
     * 从context的文件夹里读取entry里面所有的文件进行解析,打包代码里面的依赖(import / require)
     * 将所有东西打包到output.path对应的文件夹里, 使用output.filename对应的命名模板来命名([name]被entry里的对象键值替代)
     */
    context: path.resolve(__dirname, "src"),
    // the environment in which the bundle should run
    // changes chunk loading behavior and available modules
    target: "web",
    entry: {
        app: './app.js',
        home: './home.js',
        test: './test.js'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name]-[chunkhash].js',
        publicPath: '/static',
        /**
         * 这样就会把打包结果绑定到一个 window.myClassName 实例上。所以使用这种命名作用域，就可以调用 entry 点里面的方法了
         * 参考: https://webpack.js.org/concepts/output/#output-library
         */
        // library: 'dodo',
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
            // {
            //     test: /\.css$/,
            //     use: ExtractTextPlugin.extract({
            //         loader: 'css-loader?importLoaders=1',
            //     }),
            // },
            {
                test: /\.(sass|scss)$/,
                use: ["style-loader", "css-loader", 'sass-loader']
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
         * 在 output 的文件里，如果有任意模块加载了两次或更多（通过 minChunks 设置该值），
         * 它就会被打包进一个叫 commons.js 的文件里，后面你就可以在客户端缓存这个文件了。
         * 当然，这肯定会造成一次额外的请求，但是却避免了客户端多次下载相同库的问题。
         * 所以在很多场景下，这都是提升速度的举措。
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.js',
            minChunks: 2
        }),
        /**
         * 或许你正在处理渐进式增强的网站，又或许因为其他的原因你需要一个分离的 CSS 文件。
         * 我们可以简单地实现，只需要在配置里用 extract-text-webpack-plugin 替换掉 style-loader，
         * 而无需改变其他任何代码。
         */
        // new ExtractTextPlugin({
        //     filename: "[name].css",
        //     allChunks: true,
        // }),
        
        new HtmlWebpackPlugin()
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