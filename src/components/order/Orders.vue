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
        <el-table-column label="订单编号" prop="order_number" width="240"></el-table-column>
        <el-table-column label="价格 / 元" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" align="center"></el-table-column>
        <el-table-column label="是否发货" prop="is_send" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" :formatter="formatDate"></el-table-column>
        <el-table-column label="操作">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button icon="iconfont icon-bianji" circle  class="table-btn"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="物流跟踪" placement="top">
            <el-button icon="iconfont icon-dingwei1" circle  class="table-btn"></el-button>
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
  </div>

</template>


<script>
export default {
  data(){
    return {
      tableDate: [],
      queryInfo: {
        query: 'mmm',
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
      }
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
      return this.$moment(date).format("YYYY-DD-MM HH:mm:ss")
    }
  }
}
</script>


<style lang="less" scoped>

</style>