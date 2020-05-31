# Node+npm

基于 Chrome V8 引擎的 JavaScript 运行环境



### 1. 安装

https://nodejs.org/en/download/

##### 检查安装：

```
node -v
```

```
npm -v
```

### 2. 更改下载源

```
npm config set registry http://registry.npm.taobao.org/
```





# Http-server

模拟本地服务器，将任意目录模拟为本地服务器目录

https://www.npmjs.com/package/http-server



### 1. 安装

```
sudo npm install http-server -g
```

### 2. 运行

**cd + 空格 + 文件夹拖入终端**

进入目标文件并执行： *【端口被占用问题查看 "制造假数据接口.md"】*

```
http-server
```

- 修改端口号（-p / --port）

  ```
  http-server -p 3001
  ```

- 设置缓存时间（可适时修改）/  在Network中勾选Disable cache

  ```
  http-server -c-1
  ```

### 3. 结果

```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8081
  http://192.168.1.102:8081
  http://192.168.2.1:8080
Hit CTRL-C to stop the server
```

地址1：本机

地址2：局域网，同网手机查看

地址3：电脑wifi，手机热点查看

### 4. 停止

control + C