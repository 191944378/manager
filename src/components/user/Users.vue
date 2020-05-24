<template>
  <div class="container">
      <!-- 操作栏 -->
      <el-row :gutter="0" type="flex" justify="space-between" class="operabar">
        <!-- 操作 -->
          <el-button type="primary" icon="el-icon-plus" class="btn-filst" @click="addDialogVisible = true">添加用户</el-button>
        <!-- 搜索 -->
        <el-col :span="8">
            <el-input placeholder="搜索姓名" v-model="queryInfo.query" class="search-bg" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
        </el-col>
      </el-row>

    <!-- 用户列表卡片 -->
    <el-card shadow="always">
      <!-- 表格 -->
      <el-table class="user-table" :data="userTable" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="屏蔽 / 公开" prop="mg_state">
          <template v-slot:default="tabledata">
            <el-switch v-model="tabledata.row.mg_state" active-color="#2E669B" inactive-color="#eeeeee" @change="setState(tabledata.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="tableData">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button icon="iconfont icon-bianji" circle  class="table-btn" @click="showEditDialog(tableData.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button v-if="tableData.row.username != 'admin'" icon="iconfont icon-lajitong" circle  class="table-btn" @click="delBox(tableData.row.username, tableData.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="角色设置" placement="top">
              <el-button v-if="tableData.row.username != 'admin'" icon="iconfont icon-shezhi" circle  class="table-btn" @click="showSetDialog(tableData.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @current-change="CurrentPageChange"
        :current-page="getInfo.pagenum"
        :page-size="5"
        layout="total, prev, pager, next"
        :total="getInfo.total">
      </el-pagination>
    </el-card>

    
    <!-- 添加窗口 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="600px" :close-on-click-modal="false">
      <el-form :label-position="addLabelPosition" label-width="80px" :model="addUserForm" :rules="rules" ref="addUserFormRef" :status-icon="true" :hide-required-asterisk="true">
        <el-form-item label="用户名" prop="username" :inline-message="true">
          <el-input v-model="addUserForm.username" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :inline-message="true">
          <el-input v-model="addUserForm.password" type="password" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :inline-message="true">
          <el-input v-model="addUserForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" :inline-message="true">
          <el-input v-model="addUserForm.mobile" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 认</el-button>
      </span>
    </el-dialog>


    <!-- 修改窗口 -->
    <el-dialog :destroy-on-close="true" title="修改用户信息" :visible.sync="editDialogVisible" width="500px" :close-on-click-modal="false">
      <el-form label-width="70px" :model="editUserForm" :rules="rules" ref="editUserFormRef" :status-icon="true" :hide-required-asterisk="true">
        <el-form-item label="用户名" prop="username" :inline-message="true">
          <el-input v-model="editUserForm.username" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :inline-message="true">
          <el-input v-model="editUserForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" :inline-message="true">
          <el-input v-model="editUserForm.mobile" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="yesEdit">确 认</el-button>
      </span>
    </el-dialog>

    <!-- 设置弹窗 -->
    <el-dialog :destroy-on-close="true" @close="closeSet" title="设置角色" :visible.sync="setDialogVisible" width="500px" class="set-dialog">
      <el-form ref="setUserFormRef" :model="setUserForm" label-width="70px" :label-position="setLabelPosition" :rules="rules" :hide-required-asterisk="true">
        <el-form-item label="用户" class="form-info">
          <strong>{{setUserForm.username}}</strong>
        </el-form-item>
        <el-form-item label="当前角色" class="form-info">
          <strong>{{setUserForm.role}}</strong>
        </el-form-item>
        <div class="blank"></div>
        <el-form-item label="更换角色" class="select" prop="selectRole">
          <el-select v-model="setUserForm.selectRole" placeholder="请选择" class="select-role">
            <el-option v-for="item in setUserForm.options" :key="item.id" :label="item.roleName" :value="item.id">
              <span class="select-val" style="float: left">{{ item.roleName }}</span>
              <span class="select-des" style="float: right; color: #adb5bd; font-size: 13px">{{ item.roleDesc }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="yesSet">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)){
        callback()
      } else {
        callback(new Error('邮箱格式错误'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^([1][3,4,5,6,7,8,9])\d{9}$/
      if (regMobile.test(value)){
        callback()
      } else {
        callback(new Error('手机号格式错误'))
      }
    }
    return {
      userTable: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      getInfo: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      // 添加用户
      addDialogVisible: false,
      addLabelPosition: 'top',
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 修改
      editDialogVisible: false,
      editUserForm: {},
      // 设置
      setDialogVisible: false,
      setLabelPosition: 'right',
      setUserForm: {
        id: '',
        username: '',
        role: '',
        selectRole: '',
        options: []
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ],
        selectRole: [
          { required: true, message: '请选择新角色', trigger: 'change' }
        ],
      },
    }
  },

  created(){
    this.getUserList()
    this.getRoleList()
  },

  methods: {
    async getUserList(){
      const {data: res} = await this.axios.get('/users', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status == 200) {
        this.userTable = res.data.users
        this.getInfo.pagenum = res.data.pagenum
        this.getInfo.total = res.data.total
      } 
    },
    CurrentPageChange(curpage) {
      this.queryInfo.pagenum = curpage
      this.getUserList()
    },
    setState(data){
      this.axios.put(`/users/${data.id}/state/${data.mg_state}`).then(res => {
        if (res.data.meta.status == 200) {
          if (data.mg_state) {
            this.$message({
              message: '公开成功',
              type: 'success',
              center: true
            })
          } else {
            this.$message({
              message: '屏蔽成功',
              type: 'success',
              center: true
            })
          }
        } else {
            this.$message({
              message: res.data.meta.msg,
              type: 'error',
              center: true
            })
          }
      })
    },
    addUser(){
      this.$refs.addUserFormRef.validate((boolean, object) => {
        if(!boolean) return
        this.axios.post('/users', this.addUserForm).then(res => {
          if (res.data.meta.status == 201){
            this.$refs.addUserFormRef.resetFields()
            this.addDialogVisible = false
            this.$message({
              message: '用户添加成功',
              type: 'success',
              center: true
            })
            this.getUserList()
          }
        })
      })
    },
    showEditDialog(id){
      this.editDialogVisible = true
      this.axios.get(`/users/${id}`).then(res => {
        console.log(res)
        this.editUserForm = res.data.data
      })
    },
    yesEdit(){
      this.$refs.editUserFormRef.validate((boolean, object) => {
        if(!boolean) return false
        this.axios.put(`/users/${this.editUserForm.id}`, this.editUserForm).then(res => {
          if(res.data.meta.status !=200 ){
            this.$message({
              message: res.data.meta.msg,
              type: 'error',
              center: true
            })
          } else {
            this.$refs.editUserFormRef.resetFields()
            this.editDialogVisible = false
            this.$message({
              message: '修改成功',
              type: 'success',
              center: true
            })
            this.getUserList()
          }
        })

      })
    },
    delBox(username, id){
      this.$confirm(`确定删除用户 ${username} ?`, '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/users/${id}`).then(res => {
          if(res.data.meta.status != 200) return this.$message.error('删除失败')
          this.$message({
            message: '删除成功',
            type: 'success',
            center: true
          })
          this.getUserList()
        })
      }).catch(()=> {return})
    },
    showSetDialog(data){
      console.log(this.setUserForm)
      this.setDialogVisible = true
      this.setUserForm.username = data.username
      this.setUserForm.role = data.role_name
      this.setUserForm.id = data.id
    },
    async getRoleList(){
      const {data: res} = await this.axios.get('/roles')
      this.setUserForm.options = res.data
    },
    yesSet(){
      this.$refs.setUserFormRef.validate((boolean, object) => {
        if(!boolean) return false
        this.axios.put(`/users/${this.setUserForm['id']}/role`, {rid: this.setUserForm['selectRole']}).then(res => {
          console.log(res)
          if(res.data.meta.status != 200) return this.$message.error(`${res.data.meta.msg}`)
          this.setDialogVisible = false
          this.$message.success('角色更换成功')
          this.getUserList()
        })
      })

    },
    closeSet(){
      this.setUserForm.value = ''
      this.setUserForm.username = ''
      this.setUserForm.role = ''
      this.setUserForm.id = ''
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/css/rule.less";

  .search-bg{
    /deep/.el-input__inner{
      background-color: #ebedf5;
    }
  }

  .set-dialog{
    .el-form-item{
      &.form-info{
        margin: 0;
      }
    }
    .blank{
      height: 15px;
    }
    .select-role{
      width: 100%;
    }

  }


 


</style>
