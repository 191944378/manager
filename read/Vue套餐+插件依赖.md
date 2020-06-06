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







# vue-tinymce-editor -富文本编辑器插件

vue富文本编辑器插件

https://github.com/dyonir/vue-tinymce-editor/#readme







# @tinymce/tinymce-vue - 富文本编辑器插件

Tinymce富文本编辑器插件

https://www.tiny.cloud/docs/integrations/vue/#tinymcevuejsintegrationquickstartguide







# element-china-area-data -联级器地理位置插件

https://github.com/Plortinus/element-china-area-data#readme







# echarts -图表插件

https://echarts.apache.org/zh/index.html

主题编辑器: https://www.echartsjs.com/theme-builder/



1. 先参照官网，引入

```html
<div id="chart" style="width: 100%; height:500px;"></div>
```

```javascript
import echarts from 'echarts'
import reportsTheme from './theme.js'  //引入主题
```

2. 把 var option 改为 data() 中的对象数据

```javascript
data(){
  return {
    option: {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '直接访问',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {},
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    }
  }
},
```

3. 初始化写在 mouted 里 (echarts需要在DOM结构渲染完成后才能初始化)

```javascript
  mounted(){
    //  获取数据、渲染图标
    this.getChartData()
    //  根据窗口大小调整曲线大小 -重新初始化
    window.onresize = () => {
      let myChart = echarts.init(document.getElementById('chart'), 'theme');
      myChart.resize();
    };
  },
  methods: {
    async getChartData(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('chart'), 'reportsTheme');
      // 获取数据
      const {data: res} = await this.axios.get('reports/type/1')
      if(res.meta.status != 200) return this.$message.error(tes.meta.msg)
      this.option = Object.assign(this.option, res.data)   // 对象一级合并
      this.option.xAxis[0].type = 'category'   // 下级对象补充
      this.option.xAxis[0].boundaryGap = false
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.option)
      console.log('图表数据:', this.option)
    }
  }
```







# NProgress 页面加载进度条



1. Main.js 中引入

```javascript
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
```

2. 修改请求拦截器的配置

```javascript
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = localStorage.getItem('token')
  return config;
});
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
```

