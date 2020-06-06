<template>
  <div class="container">
    <el-card shadow="always">
      <div id="chart" style="width: 100%; height:500px;"></div>
    </el-card>
  </div>

</template>


<script>
import echarts from 'echarts'
import reportsTheme from './reportsTheme.js'
export default {
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
          left: '0%',
          right: '0%',
          bottom: '0%',
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
  created(){
  }, 
  mounted(){
    //  获取数据、渲染图标
    this.getChartData()
    //  根据窗口大小调整曲线大小 -重新初始化
    window.onresize = () => {
      let myChart = echarts.init(document.getElementById('chart'), 'reportsTheme');
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
}
</script>


<style lang="less" scoped>

</style>