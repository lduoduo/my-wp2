## wp2 ---> webpack2 demo
> multiple entry and inject js file into html

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
    - js `生成js文件，按项目存放所有js文件，抽出的公共js直接存放`
        - chunks.js
        - projectA
            - pageA.js
            - pageB.js


