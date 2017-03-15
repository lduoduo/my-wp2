import './_pageA.less';
require('../../../common/js/A.js');

console.log('pageA');

var imgUrl = require('../../../img/bg.jpg'),
    imgTempl = '<img src="'+imgUrl+'" />';
document.body.innerHTML = imgTempl;