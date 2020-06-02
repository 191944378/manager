# Vue

https://cn.vuejs.org/





# Vue Router -路由

https://router.vuejs.org/zh/





# Vue CLI -脚手架

https://cli.vuejs.org/zh/guide/installation.html



### 1. 安装

```
sudo npm i vue-cli -g
```

### 2. 初始化项目

cd 指定文件夹下

```
vue init webpack 项目名
```





# moment.js -时间插件

时间格式插件

https://momentjs.com/



### 1. 下载

在vue ui 依赖中下载

### 2. 安装

全局引入: main.js 挂载 

局部引入只要第一行

```javascript
 import moment from 'moment'//导入文件 
 Vue.prototype.$moment = moment;//赋值使用
```

### 3. 使用

格式:

```javascript
this.$moment('时间戳').format("YYYY-DD-MM")
this.$moment('2018-09-19T05:54:32.767Z').format("YYYY-DD-MM")
```

Template:

```html
<el-table-column label="创建日期" prop="add_time" fixed="right" :formatter="formatDate"></el-table-column> 
```

methods:

```javascript
formatDate(row, column, cellValue, index){
  let date = cellValue * 1000
  if (date === undefined) return ""
  return this.$moment(date).format("YYYY-DD-MM HH:mm:ss")
}
```







# vue-tinymce-editor -编辑器插件

vue富文本编辑器插件

https://github.com/dyonir/vue-tinymce-editor/#readme







# @tinymce/tinymce-vue - 编辑器插件

Tinymce富文本编辑器插件

https://www.tiny.cloud/docs/integrations/vue/#tinymcevuejsintegrationquickstartguide