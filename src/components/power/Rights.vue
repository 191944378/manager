<template>
  <div class="container">
    
    <el-card shadow="always">
      <el-table :data="rightTable" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级" v-slot="tableData">
          <el-tag v-if="tableData.row.level==0">一级</el-tag>
          <el-tag v-if="tableData.row.level==1" type="success">二级</el-tag>
          <el-tag v-if="tableData.row.level==2" type="warning">三级</el-tag>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>


<script>
export default {
  data(){
    return {
      rightTable: []
    }
  },
  created(){
    this.getRightTable()
  },
  methods: {
    async getRightTable(){
      const {data: res} = await this.axios.get('/rights/list')
      console.log(res)
      this.rightTable = res.data
    }
  }
}
</script>


<style lang="less" scoped>
  @import "../../assets/css/rule.less";

</style>