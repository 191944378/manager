<template>
  <div class="container">
    <!-- 操作栏 -->
    <el-row :gutter="0" type="flex" justify="end" class="operabar">
      <!-- 搜索 -->
      <el-col :span="8">
          <el-input placeholder="搜索订单" v-model="queryInfo.query" class="search-bg" clearable @clear="getOrderData">
            <el-button slot="append" icon="el-icon-search" @click="getOrderData"></el-button>
          </el-input>
      </el-col>
    </el-row>

    <!-- 用户列表卡片 -->
    <el-card shadow="always">
      <!-- 表格 -->
      <el-table :data="getInfo.goods" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" min-width="220"></el-table-column>
        <el-table-column label="价格 / 元" prop="order_price" align="center" min-width="80"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" align="center" min-width="100" v-slot="tableData">
          <el-tag v-if="tableData.row.order_pay == 0" type="warning">未支付</el-tag>
          <el-tag v-if="tableData.row.order_pay == 1">支付宝</el-tag>
          <el-tag v-if="tableData.row.order_pay == 2" type="success">微信</el-tag>
          <el-tag v-if="tableData.row.order_pay == 3" type="info">银行卡</el-tag>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" align="center" min-width="80" v-slot="tableData">
          <i v-if="tableData.row.is_send == '是'" class="el-icon-success icon-status-useful" style="color: #417cb4"></i>
          <i v-else class="el-icon-error icon-status-unuseful" style="color: #adb5bd"></i>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" :formatter="formatDate" min-width="150"></el-table-column>
        <el-table-column label="操作" min-width="120"  v-slot="tableData">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button icon="iconfont icon-bianji" circle  class="table-btn" @click="addressDialogVisible = true"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="物流跟踪" placement="top">
            <el-button v-if="tableData.row.order_pay != 0" icon="iconfont icon-dingwei1" circle  class="table-btn" @click="openLogiDialog(tableData.row.order_id)"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @current-change="CurrentPageChange"
        :current-page="getInfo.pagenum"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="getInfo.total">
      </el-pagination>
    </el-card>


    <!-- 物流窗口 -->
    <el-dialog title="物流跟踪" :visible.sync="logiDialogVisible" width="600px">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in timeline"
          :key="index"
          :icon="item.icon"
          :type="item.type"
          :color="item.color"
          :size="item.size"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="logiDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>


    <!-- 地址窗口 -->
    <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="600px">
      <el-form :model="addressForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" :hide-required-asterisk="true">
        <el-form-item label="省市区/县" prop="city">
          <el-cascader :options="addressForm.cityOptions" v-model="addressForm.selectedOptions" :props="{ expandTrigger: 'hover' }" style="width: 100%"></el-cascader>
        </el-form-item>
        <el-form-item label="省市区/县" prop="city">
          <el-cascader :options="options" v-model="selectedOptions" :props="{ expandTrigger: 'hover' }" style="width: 100%"></el-cascader>
        </el-form-item>
         <el-form-item label="详细地址" prop="detailed">
          <el-input v-model="addressForm.detailed"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button  @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 认</el-button>
      </span>
    </el-dialog>
    


  </div>

</template>


<script>
import cityOptions from '../../plugins/provinces-china-master/city_data2017_element.js'
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  data(){
    return {
      rules: {
        detailed: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 8, message: '应多于8个字', trigger: 'blur' }
        ],
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      getInfo: {
        pagenum: 1,
        total: 0,
        goods: []
      },
      // 物流弹窗
      logiDialogVisible: false,
      timeline: [{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46',
      }],
      // 地址弹窗
      addressDialogVisible : false,
      addressForm: {
        cityOptions: cityOptions,
        detailed: '',
        selectedOptions: ''
      },
      options: regionData,
      selectedOptions: []

    }

  },
  created() {
    this.getOrderData()
  },
  methods: {
    async getOrderData(){
      const {data: res} = await this.axios.get('/orders', {params: this.queryInfo})
      if(res.meta.status != 200) return this.$message.error(res.meta.smg)
      this.getInfo.pagenum = Number(res.data.pagenum) 
      this.getInfo.total = res.data.total
      this.getInfo.goods = res.data.goods
      console.log('订单列表数据', this.getInfo.goods)
    },
    CurrentPageChange(curpage){
      this.queryInfo.pagenum = curpage
      this.getOrderData()
    },
    formatDate(row, column, cellValue, index){
      let date = cellValue * 1000
      if (date === undefined) return ""
      return this.$moment(date).format("YYYY-DD-MM HH:mm")
    },
    // 获取物流跟踪数据
    async openLogiDialog(id){
      this.logiDialogVisible = true
      const {data: res} = await this.axios.get(`/kuaidi/1106975712662`)
      if (res.meta.status != 200 ) return this.$message.error(res.meta.msg)
      this.timeline = res.data
      this.timeline[0].size = 'large'
      this.timeline[0].type = 'primary'
      this.timeline[0].icon = 'el-icon-check'



      console.log(res)

      
    }
  }
}
</script>


<style lang="less" scoped>

</style>