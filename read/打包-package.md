# Package

上线打包工具



### 1. 安装

- 目录下生成package.json文件

  ```
  npm init -y
  ```

- 目录下下载安装包(开发版) 

  ```
  npm i webpack webpack-cli -D
  ```



### 2. 配置

##### js配置：

- 修改引入方式

  将在html中的js插件的标签引入，改为在js文件中用es6引入(浏览器不支持es6，无法查看实际效果)

  ```javascript
  import $ from 'juqery.js'
  ```

##### 脚本配置：

- 修改 package.json 中的 "script" 为

  ```json
  "build": "webpack main.js"
  ```

  [^main.js ]: 打包的js文件的相对路径

- 修改出口路径

  默认出口路径为  "./dist/ 原文件名"

  ```javascript
  "build": "webpack main.js --output ./dist/app.js"
  ```

- 打包压缩模式有 production(发布) / development(开发) 两种，默认为发布模式执行压缩,

  如果希望不压缩，脚本命令为：

  ```json
  "build": "webpack main.js --mode development"
  ```

##### 拓展 - webpack配置命令

可以更省劲得配置和执行

- 新建 webpack.config.js 文件，写入：

  ```javascript
  //引入path模块
  const path = require('path')
  
  module.exports = {
  
    //入口
    entry: path.join(__dirname, './src/main.js'),
  
    //出口
    output: {
      //出口目录
      path: path.join(__dirname, './dist'),
      //出口文件
      filename: 'app.js'
    },
  
    //模式
    mode: 'development'
  }
  ```

- 修改 package.json 中的 "script" 为

  ```json
  "build": "webpack"
  ```

### 3. 运行

```
npm run build
```

### 4. 重新引入

找到disk中新的js文件位置，在html中重新引入（使用 html-webpack-plugin 可自动引入）







# html-webpack-plugin

打包html的package插件，用于**上线阶段**



### 1. 安装

node_modules 文件夹中已有的文件不用安装

```
npm i html-webpack-plugin -D
```

### 2. 配置

- webpack.config.js 中引入 并 配置

  ```javascript
  const htmlWebpackPlugin = require('html-webpack-plugin')
  ```

  ```javascript
  module.exports = {
  
  	//...
  
    //插件
    plugins: [
      
      //配置 html-webpack-plugin 插件
      new htmlWebpackPlugin({
        template: path.join(__dirname, './src/index.html')
      })
    ]
  }
  ```

- 删除 html 中引入js文件的代码 （配置中写好了引入，webpack可以自动引入）

### 3. 运行

```
npm run build
```







# Webpack-dev-server

package插件，为打包提供一个服务环境，自动化提高效率，用于**开发阶段** 



### 1. 安装

```
npm i webpack-dev-server -D
```

### 2. 配置

修改 package.json 中的 "script" 为

```json
"dev": "webpack-dev-server"
```

- 自动打开浏览器

  ```json
  "dev": "webpack-dev-server --open"
  ```

- 修改端口 *【端口被占用问题查看 "制造假数据接口.md"】*

  ```javascript
  "dev": "webpack-dev-server --port 3001"
  ```

### 3. 运行

```
npm run dev
```

http://localhost:8080/

 





# Css-loader & style-loader & less-loader & url-loader & file-loader & babel

package插件，处理 css \ less \ 图片 \ 字体文字 \ ES6语法



### 1. 安装

##### 安装 css-loader & style-loader：

```
sudo npm i style-loader css-loader -D
```

##### 安装 less-loader

```
sudo npm i less-loader less -D
```

##### 安装 url-loader & file-loader

```
sudo npm i url-loader file-loader -D
```

##### 安装  babel 相关

```
sudo npm i -D babel-core babel-loader@7 babel-preset-env babel-preset-stage-2
```



### 2. 配置

- webpack.config.js 中配置

  ```javascript
  module.exports = {
  
  	//...
  	
   	//配置 loader 加载器
    module: {
      rules: [
        // 1. 处理 css 规则
        // 后缀名为‘.css’的文件通过后面的插件处理，
        // 插件书写顺序不能反
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        // 2. 处理 less 规则
        { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
        // 3. 处理 图片 规则,
        // limit 设置图片大小限制，限制内采用base64编码，超出使用md5路径编码，下例限制为100kb
        { test: /\.(jpg|jpeg|gif|png)$/, use: ['url-loader？limit=100000'] },
        //处理 字体图标 规则
        { test: /\.(eot|svg|ttf|woff|woff2)$/, use: ['url-loader'] },
        //处理 ES6 规则
        { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ }
      ]
    }
  }
  ```

- 删除 html 中引入 css \ js 文件的代码，采用在js中引入 （配置中写好了引入，webpack可以自动引入）

  ```javascript
  import './assets/base.css'
  import './assets/index.less'
  ```

- 新建文件 ".babelrc"，配置：

  ```
  {
    "presets": ["env", "stage-2"]
  }
  ```

### 3. 运行

```
npm run build / dev
```







# 配置统汇

### 1. package.json

```json
"scripts": {
  "dev": "webpack-dev-server",
  "build": "webpack",
  "build1": "webpack main.js"
},
```

### 2. webpack.config.js

```javascript

//引入 path 模块
const path = require('path')
//引入 html-webpack-plugin 插件
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

  //入口
  entry: path.join(__dirname, './src/main.js'),

  //出口
  output: {
    //出口目录
    path: path.join(__dirname, './dist'),
    //出口文件
    filename: 'app.js'
  },

  //模式
  mode: 'development',

  //插件
  plugins: [
    
    //配置 html-webpack-plugin 插件， 指向原html位置
    new htmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html')
    })
  ],

  //配置 loader 加载器
  module: {
    rules: [
      //处理 css 规则 
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      //处理 less 规则
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      //处理 图片 规则
      { test: /\.(jpg|jpeg|gif|png)$/, use: ['url-loader?limit=100000'] },
      //处理 字体图标 规则
      { test: /\.(eot|svg|ttf|woff|woff2)$/, use: ['url-loader'] },
      //处理 ES6 规则
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ }
    ]
  }
}
```

### 3. .babelrc

```
{
  "presets": ["env", "stage-2"]
}
```

