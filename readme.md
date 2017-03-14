## wp2 ---> webpack2 demo

### done part
+ multiple entries and auto inject js file into each html
+ auto gzip and inject pics in js / css / html
    > already made explaination in the code

### inprogress part
+ use templates
+ issues with webpack-dev-server
    > when start webpack-dev-server, access url: ip:port/app/projectName/page/index.html

    > inline / hot not work now

### QA
+ how to generate tree?
+ what is inline mode?

### source dir
- src
    - app `具体项目的业务文件夹`
        - projectA
            - pageA
                - A.html
                - A.js
                - A.scss
            - pageB
                - B.html
                - B.js
                - B.scss
        - projectB
            - pageA
                - A.html
                - A.js
                - A.less
    - common `项目通用的公共文件`
        - js
            - a.js
        - less
            - a.less
        - scss
            - a.scss
    - module `组件模块化`
        - moduleA
            - A.js
            - A.less
        - moduleB
            - B.js
            - B.scss
    - img `公用图片`
        - a.jpg

### dest dir
- dist
    - html `生成的html文件夹，存放所有html文件`
        - projectA
            - pageA.html
            - pageB.html
    - other `生成js/css文件，按项目存放所有js/css文件，抽出的公共js直接存放`
        - chunks.js
        - projectA
            - pageA.js
            - pageA.css
            - pageB.js
            - pageB.css
    - img `处理过的图片存放路径`
    - xxx.ico `如果有设置图标，一律在根目录`


