## wp2 ---> webpack2 demo

### done part
+ multiple entries and auto inject js file into each html

### inprogress part
+ auto gzip and inject pics in js / css / html
+ use templates
+ issues with webpack-dev-server

### QA
+ how to generate tree?

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


