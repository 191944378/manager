# postman

软件， 用于数据测试



# json-server 

https://github.com/typicode/json-server

根据一个json文件, 开启一个接口服务器,并且提供假数据。

json示例：

```json
{
  "list": [
    {
      "name": "zs",
      "done": true,
      "id": 1
    },
    {
      "name": "ls",
      "done": false,
      "id": 2
    }
  ]
}
```

### 1. 安装

```
sudo npm i json-server -g
```

### 2. 运行

```
json-server data.json
```

- 可监控并修改

  ```
  json-server --watch data.json
  ```

- 修改端口（默认端口3000）

  ```
  json-server --port 3001  data.json
  ```

  

### 3. 报错：端口被占用

- 查询占用端口的PID

  ```
  sudo lsof -i:端口号
  ```

- 杀死PID

  ```
  sudo kill PID
  ```






# 真 · 数据接口

### 1. MAMP

​	确保和后端提供的接口域名 / port一致

### 2. Navicat

​	确保名称和提供的sql名称一致

### 3. 启动app.js

- 方法一：在项目文件夹下 (依赖 node.js )

  ```
  node app.js
  ```

- 方法二： 在项目文件夹执行 (以及依赖 Express 框架 )

  ```
  npm start
  ```

### 4. 报错

- 和预设不同
- 端口被占用





# axios

中文官网： http://www.axios-js.com/zh-cn/

### 1.安装

##### 方法1：下载

https://github.com/axios/axios/stargazers 

##### 方法2：cdn

```javascript
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

##### 方法3：npm

```
sudo npm install axios
```
### 2. 使用

- Js-vue示例：

```javascript
const vm = new Vue({
  
 //...
  
  created: function(){
    axios.get('http://localhost:3000/list').then(res => {
      console.log(res)
      this.list = res.data
    })
  }
})
```

- 用法（可以先用postman测试）

```
GET    /posts
GET    /posts/1
POST   /posts
PUT    /posts/1
PATCH  /posts/1
DELETE /posts/1
```

