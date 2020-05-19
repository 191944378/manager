<template>
  <div class="container">

    <!-- 用户列表卡片 -->
    <el-card shadow="always">

      <!-- 操作栏 -->
      <el-row :gutter="0" type="flex" justify="space-between">
        
        <!-- 操作 -->
          <el-button type="primary" icon="el-icon-plus">添加用户</el-button>
        <!-- 搜索 -->
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="input2">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>





    </el-card>

  </div>

</template>

<script>
export default {
  data() {
    return {
      input2: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],

      queryInfo: {
        pagenum: 1,
        pagesize: 3
      }
    }
  },

  created(){
    this.getUserList()
  },

  methods: {
    async getUserList(){
      await this.axios.get('/users', {userdata: this.queryInfo}).then(res => {
        console.log(res)
        if (res.data.meta.status == 200) return this.tableData = res.data.data
        console.log(res.data.meta.msg)
          
        
        
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }



</style>
