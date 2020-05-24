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
              <el-tag type="" closable @close="delTag(tableData.row, item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row :gutter="20" v-for="(item2, idx2) in item1.children" :key="item2.id" class="row-valign">
                <el-col :span="6">
                  <el-tag closable type="" @close="delTag(tableData.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag closable type="success" v-for="(item3, idx3) in item2.children" :key="item3.id" @close="delTag(tableData.row, item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" v-slot="tableData">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button icon="iconfont icon-bianji" circle  class="table-btn"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button icon="iconfont icon-lajitong" circle  class="table-btn"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button icon="iconfont icon-shezhi" circle  class="table-btn" @click="openSetDialog(tableData.row)"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限设置弹窗 -->
    <el-dialog title="提示" :visible.sync="setDialogVisible" width="660px" @close="closeSetDialog">
      <el-row class="dialog-right-content">
        <div class="content">
          <el-tabs :tab-position="setTabPosition">
            <el-tab-pane :label="item1.authName" v-for="(item1, idx1) in rightData" :key="item1.id">
              <div class="checkbox-item" v-for="(item2, idx2) in item1.children">
                <el-checkbox class="checkbox-title" v-model="checkAll[item2.id].state"  @change="handleCheckAllChange(item1.id, item2.id)" :key="item2.id">{{item2.authName}}</el-checkbox>
                <el-checkbox-group v-model="checkedRights" @change="boxChange(item1.id, item2.id)">
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
        <el-button type="primary" @click="subSetDialog">确 定</el-button>
      </span>
    </el-dialog>





  </div>
</template>


<script>
export default {
  data(){
    return {
      roleTable: [],  // 全部角色请求数据
      // 权限设置弹窗
        setDialogVisible: false,  
        setTabPosition: 'left',
        rightProps: {
          label: 'authName',
          children: 'children'
        },
        rightData: [],  //全部权限树
        checkAll: {}, // 全部权限树的id和二级目录状态
        checkedRights: [],  //选中的id
        curRoleId: ''  // 执行操作的角色
        }
  },
  created(){
    this.getRoleTable()  //加载角色表格数据
    this.getRoleData()   //加载权限设置弹窗数据
  },
  methods: {
    //获取角色表格数据
    async getRoleTable(){
      const {data: res} = await this.axios.get('/roles')
      this.roleTable = res.data
    },
    // 删除标签
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
    // 获取权限设置弹窗数据
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
    // 点击全选
    handleCheckAllChange(id1, id2) {
      let arr1 = this.checkedRights
      let arr2 = this.checkAll[id2].children
      if (this.checkAll[id2].state) {
        this.checkedRights = Array.from(new Set([...arr1, ...arr2, id2, id1]))
      } else {
        // set方法
        let set1 = new Set(arr1)
        arr2.forEach(v => set1.delete(v))
        this.checkedRights = Array.from(set1)
        // 过滤器方法
        // this.checkedRights = Array.from(new Set(arr1.filter(v => !new Set(arr2).has(v))))
      }
        // console.log(this.checkedRights)

    },
    // 点击子多选框
    childrenChecked(id2){
      let arr1 = this.checkedRights
      let arr2 = this.checkAll[id2].children
      let set1 = new Set(arr1)
      let flag = true
      arr2.forEach(v => {
        if(!set1.has(v)) return flag = false
      })
      this.checkAll[id2].state = flag
    },
    // 状态改变时
    boxChange(id1, id2){
      console.log(id1, id2)
      if(this.checkAll[id2].children.length != 0 ){
        this.checkedRights.push(id1, id2)
      }
      console.log(this.checkedRights)
    },
    // 打开权限设置弹窗
    openSetDialog(data){
      console.log(data)
      data['children'].forEach(item1 => {
        this.checkedRights.push(item1.id)
        item1.children.forEach(item2 => {
          this.checkedRights.push(item2.id)
          if(item2.children.length == this.checkAll[item2.id].children.length){
            this.checkAll[item2.id].state = true
          }
          item2.children.forEach(item3 => {
            this.checkedRights.push(item3.id)
          })
        })
      })
      this.setDialogVisible = true
      this.curRoleId = data.id
    },
    // 提交角色授权
    async subSetDialog(){
      this.checkedRights = [...new Set(this.checkedRights)]
      const ridsStr = this.checkedRights.sort().join(',')
      console.log(ridsStr)
      const {data: res} = await this.axios.post(`roles/${this.curRoleId}/rights`, {rids: ridsStr})
      if(res.meta.status == 200){
        this.setDialogVisible = false
        this.$message.success('权限更新成功')
        this.getRoleTable()
      } else {
        this.$message.error('权限更新失败')
      }

    },
    // 关闭窗口，清空数据
    closeSetDialog(){
      this.checkedRights = []
      this.curRoleId = ''
      for(let key in this.checkAll){
        this.checkAll[key].state = false
      }
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
      height: 320px;
      overflow: auto;

      .checkbox-item{
        padding: 10px;
        .el-checkbox{
          width: 25%;
          padding: 5px;
          &.checkbox-title{
            width: 100%;
            background-color: #f0f2fa;
            color: #6c757d;
            margin-bottom: 10px;
          }
        }
      }
      
    }
  }


</style>