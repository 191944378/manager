<template>
  <div class="container">
    <!-- 操作栏 -->
    <el-row :gutter="0" type="flex" justify="space-between" class="operabar">
        <el-button type="primary" icon="el-icon-plus" class="btn-filst" @click="addDialogVisible = true">添加角色</el-button>
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
            <el-button icon="iconfont icon-bianji" circle  class="table-btn" @click="editRole(tableData.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button icon="iconfont icon-lajitong" circle  class="table-btn" @click="delRole(tableData.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button icon="iconfont icon-shezhi" circle  class="table-btn" @click="openSetDialog(tableData.row)"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 添加窗口 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="600px" :close-on-click-modal="false" class="add-dialog" @close="closeAddDialog">
      <el-steps :active="addStepActive" finish-status="success" simple class="add-step">
        <el-step title="创建角色" ></el-step>
        <el-step title="设置权限" ></el-step>
      </el-steps>
      <el-form v-if="addStepActive == 1" :label-position="addLabelPosition" label-width="80px" :model="addRoleForm" :rules="rules" ref="addRoleFormRef" :status-icon="true" :hide-required-asterisk="true">
        <el-form-item label="角色名称" prop="rolename" :inline-message="true">
          <el-input v-model="addRoleForm.rolename" placeholder="必填" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :inline-message="true">
          <el-input v-model="addRoleForm.describe" placeholder="选填"></el-input>
        </el-form-item>
      </el-form>
      <el-row v-if="addStepActive == 2" class="dialog-right-content">
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
        <el-button v-if="addStepActive == 1" @click="addDialogVisible = false">取 消</el-button>
        <el-button v-if="addStepActive == 2" @click="addDialogVisible = false">暂不设置</el-button>
        <el-button v-if="addStepActive == 1" type="primary" @click="yesAddRole">确 认</el-button>
        <el-button v-if="addStepActive == 2" type="primary" @click="subSetDialog">确 认</el-button>
      </span>
    </el-dialog>


    <!-- 修改窗口 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="500px" :close-on-click-modal="false" class="edit-dialog">
      <el-form label-width="80px" :model="editRoleForm" ref="editRoleFormRef" :rules="rules" :status-icon="true" @close="closeEditDialog" :hide-required-asterisk="true">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="editRoleForm.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.describe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="yesEditRole">确 认</el-button>
      </span>
    </el-dialog>


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
      // 添加角色弹窗
        addDialogVisible: false,
        addLabelPosition: 'top',
        addStepActive: 1,
        addRoleForm: {
          rolename: '',
          describe: '',
        },
      // 权限修改弹窗
        editDialogVisible: false,  
        editRoleId: '',
        editRoleForm: {
          rolename: '',
          describe: ''
        },
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
        curRoleId: '',  // 执行操作的角色
      // 表单规则
      rules: {
        rolename: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
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
      console.log(res)
    },
    // 添加角色
    yesAddRole(){
      this.$refs.addRoleFormRef.validate((boolean, object) => {
        if(!boolean) return false
        this.axios.post('/roles', {roleName: this.addRoleForm['rolename'], roleDesc: this.addRoleForm['describe']}).then(res => {
          if(res.data.meta.status != 201) return this.$message.error('角色添加失败')
          this.$message.success('角色添加成功！')
          this.addStepActive = 2
          //获取新添加的角色的id
          this.axios.get('/roles').then(res =>{
            this.roleTable = res.data.data
            console.log(this.roleTable)
            const curItem = this.roleTable.filter((item, idx) => item.roleName == this.addRoleForm.rolename)
            this.curRoleId = curItem[0].id
          })
        })
      })

    },
    // 删除角色
    delRole(id){
      this.$confirm('删除后不可恢复, 是否继续?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: res} = await this.axios.delete(`/roles/${id}`)
        if(res.meta.status != 200){ return this.$message.error(res.meta.msg)}
        this.$message.success('角色删除成功')
        this.getRoleTable()
      }).catch(() => {})
    },
    // 编辑角色
    editRole(data){
      console.log(data)
      this.editDialogVisible = true
      this.editRoleId = data.id
      this.editRoleForm.rolename = data.roleName
      this.editRoleForm.describe = data.roleDesc
    },
    yesEditRole(){
      this.$refs.editRoleFormRef.validate((boolean, object) => {
        if(!boolean) return false
        this.axios.put(`roles/${this.editRoleId}`, {roleName: this.editRoleForm['rolename'], roleDesc: this.editRoleForm['describe']}).then(res => {
          if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
          this.$message.success('修改成功！')
          this.getRoleTable()
          this.editDialogVisible = false
        })
      })
      
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
        this.addDialogVisible = false
        this.$message.success('权限设置成功')
        this.getRoleTable()
      } else {
        this.$message.error('权限更新失败')
        console.log(ridsStr, this.curRoleId)
      }
    },
    // 关闭设置窗口，清空数据
    closeSetDialog(){
      this.checkedRights = []
      this.curRoleId = ''
      for(let key in this.checkAll){
        this.checkAll[key].state = false
      }
    },
    // 关闭添加窗口，清空数据
    closeAddDialog(){
      this.curRoleId = ''
      this.checkedRights = []
      this.addRoleForm.rolename = ''
      this.addRoleForm.describe = ''
      this.addStepActive = 1
    },
    // 关闭修改窗口，清空数据
    closeEditDialog(){
      this.editRoleId = ''
      this.editRoleForm.rolename = ''
      this.editRoleForm.describe = ''
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

  .add-dialog{
    .add-step{
      margin-bottom: 20px;
    }
  }


</style>