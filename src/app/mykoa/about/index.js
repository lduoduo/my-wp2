import './index.scss';
require("html-loader!./index.html");

console.log('this is about index.js');

var img = new Image();
// img.src = "../../../img/bg.png";
img.onload = function(data){
    console.log(data);
}
this.a = function (params) {
    console.log('page about in mykoa');

}