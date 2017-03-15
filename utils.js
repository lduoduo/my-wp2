/** webpack中会使用到的工具方法集合 */
var glob = require('glob');

module.exports = {
    /** 根据路径获取路径下的所有文件
     * return: {
     *  html:[],
     *  js:[]
     * }
     */
    getEntry(url, preStatic) {
        console.log("url----->%s", url);
        var entry = {
            html: {},
            entry: {}
        };
        glob.sync(url).forEach(function (name) {
            console.log('name----->%s', name);
            /*
            循环所有文件，对文件名做处理，并放入entry数组中，返回entry
             */
            var n = "", type = "";
            // n = name.substring((name.lastIndexOf('/') + 1), name.lastIndexOf('.'));
            if (/\.html$/.test(name)) {
                //是html页面
                type = "html";
                n = name.substring(8, name.lastIndexOf('.'));
                // console.log("n_html:"+n);
            } else if (/\.js$/.test(name) && !/^_/.test(name)) {
                //不是html页面  这里实际上只有js页面需要处理
                type = "entry";
                n = name.substring(8, name.lastIndexOf('.'));
                n = n.substring(0, n.lastIndexOf('/'));
                // n = name.substring((name.lastIndexOf('/') + 1), name.lastIndexOf('.'));
                
                //为脚本样式添加统一前缀
                n = preStatic ? preStatic + '/' + n : n;
            }
            // name = name.replace(/\//gi, "/");
            console.log("file----->%s", name);
            name = __dirname + "\\" + name;
            name = name.replace(/\\/gi, "/");
            if (n) {
                entry[type][n] = name;
            }
        });
        console.log('entry----->%s', JSON.stringify(entry));
        return entry;
    }
}
