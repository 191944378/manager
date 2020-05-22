<template>
  <div class="container">
    <!-- 操作栏 -->
    <el-row :gutter="0" type="flex" justify="space-between" class="operabar">
        <el-button type="primary" icon="el-icon-plus" class="btn-filst">添加角色</el-button>
    </el-row>

    <!-- 表格 -->
    <el-card shadow="always">
      <el-table :data="roleTable" style="width: 100%" class="roles-table">
        <el-table-column type="expand" v-slot="tableData">
          <el-row :gutter="20" v-for="(item1, idx1) in tableData.row.children" :key="item1.id" class="row-valign">
            <el-col :span="5" >
              <el-tag closable type="" @close="delTag(tableData.row, item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row :gutter="20" v-for="(item2, idx2) in item1.children" :key="item2.id" class="row-valign">
                <el-col :span="6">
                  <el-tag closable type="" @close="delTag(tableData.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag closable type="success" v-for="(item3, idx3) in item2.children" @close="delTag(tableData.row, item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button icon="iconfont icon-bianji" circle  class="table-btn"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button icon="iconfont icon-lajitong" circle  class="table-btn"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button icon="iconfont icon-shezhi" circle  class="table-btn" @click="setDialogVisible = true"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限设置弹窗 -->
    <el-dialog title="提示" :visible.sync="setDialogVisible" width="600px" >
      <el-row class="dialog-right-content">
        <div class="content">
          <el-tabs :tab-position="setTabPosition">
            <el-tab-pane :label="item1.authName" v-for="(item1, idx1) in rightData" :key="item1.id">
              <div class="checkbox-item" v-for="(item2, idx2) in item1.children">
                <el-checkbox class="checkbox-title" v-model="checkAll[item2.id].state"  @change="handleCheckAllChange(item2.id)" :key="item2.id">{{item2.authName}}</el-checkbox>
                <el-checkbox-group v-model="checkedRights">
                  <el-checkbox v-for="(item3, idx3) in item2.children" :label="item3.id" :key="item3.id" @change="childrenChecked(item2.id)">{{item3.authName}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>





  </div>
</template>


<script>
export default {
  data(){
    return {
      roleTable: [],
      // 权限设置弹窗
      setDialogVisible: false,
      setTabPosition: 'left',
      rightData: [],
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      checkAll: {},
      checkedRights: [122, 123],
      // changeId2: '', //改变的三级目录所在的二级目录
      }
  },
  created(){
    this.getRightTable()
    this.getRoleData()
  },
  methods: {
    async getRightTable(){
      const {data: res} = await this.axios.get('/roles')
      this.roleTable = res.data
    },
    delTag(role, rightId){
      this.$confirm('删除不可恢复，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/roles/${role.id}/rights/${rightId}`).then(res => {
          if(res.data.meta.status != 200) return this.$message.error('删除失败')
          this.$message.success('删除成功')
          role.children = res.data.data
        })
      }).catch(error => error)
    },
    async getRoleData(){
      const {data: res} = await this.axios.get('/rights/tree')
      console.log(res)
      this.rightData = res.data
      this.rightData.forEach((item, idx) => {
        item.children.forEach((item2, idx2) => {
          this.checkAll[item2.id] = {}
          this.checkAll[item2.id].children = []
          this.checkAll[item2.id].state = false
          item2.children.forEach((item3, idx3) => {
            this.checkAll[item2.id].children.push(item3.id)
          })
        })
      })
    },
    handleCheckAllChange(id) {
      console.log(id)
      let arr1 = this.checkedRights
      let arr2 = this.checkAll[id].children
      if (this.checkAll[id].state) {
        this.checkedRights = Array.from(new Set([...arr1, ...arr2]))
      } else {
        // set方法
        let set1 = new Set(arr1)
        arr2.forEach(v => set1.delete(v))
        this.checkedRights = Array.from(set1)

        // 过滤器方法
        // this.checkedRights = Array.from(new Set(arr1.filter(v => !new Set(arr2).has(v))))
      }
    },

    childrenChecked(id2){
      let arr1 = this.checkedRights
      let arr2 = this.checkAll[id2].children
      console.log(arr1,arr2)
      let set1 = new Set(arr1)
      let flag = true
      arr2.forEach(v => {
        if(!set1.has(v)) return flag = false
      })
      this.checkAll[id2].state = flag
    }
  }
}

</script>


<style lang="less" scoped>

  @import "../../assets/css/rule.less";

  .roles-table{
    .el-row{
      border-bottom: 1px solid #eee;
      // padding: 10px;
      &:last-child{
        border-bottom: none;
      }
      .el-tag{
        margin: 10px;
      }
      &.row-valign{
        display: flex;
        align-items: center;
      }
    }
  }

  .dialog-right-content{
    .content{
      height: 460px;
      overflow: auto;

      .checkbox-item{
        padding: 10px;
        .el-checkbox{
          width: 25%;
          padding: 5px;
          &.checkbox-title{
            width: 100%;
            background-color: #F5F7FA;
            color: #6c757d;
          }
        }
      }
      
    }
  }


</style>