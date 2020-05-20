<template>
  <div class="container">
      <!-- 操作栏 -->
      <el-row :gutter="0" type="flex" justify="space-between">
        <!-- 操作 -->
          <el-button type="primary" icon="el-icon-plus" class="bt-adduser" @click="addDialogVisible = true">添加用户</el-button>
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
              <el-button icon="iconfont icon-lajitong" circle  class="table-btn" @click="showDelDialog(tableData.row.username, tableData.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置" placement="top">
              <el-button icon="iconfont icon-shezhi" circle  class="table-btn"></el-button>
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="600px">
      <el-form :label-position="labelPosition" label-width="80px" :model="addUserForm" :rules="rules" ref="addUserFormRef" :status-icon="true" :hide-required-asterisk="true">
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
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="600px" :close-on-click-modal="false">
      <el-form :label-position="labelPosition" label-width="80px" :model="editUserForm" :rules="rules" ref="editUserFormRef" :status-icon="true" :hide-required-asterisk="true">
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
        <el-button type="primary" @click="editUser">确 认</el-button>
      </span>
    </el-dialog>

    <!-- 删除确认窗口 -->
    <el-dialog title="删除用户" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除用户 </span>
      <strong>{{delUserName}}?</strong>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUser">确 定</el-button>
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
      labelPosition: 'top',
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改
      editDialogVisible: false,
      editUserForm: {},
      // 删除
      delDialogVisible: false,
      delUserName: '',
      delUserId: '',
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
        ]
      },
      

    }
  },

  created(){
    this.getUserList()
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
    editUser(){
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
    showDelDialog(username, id){
      this.delDialogVisible = true
      this.delUserName = username
      this.delUserId = id
    },
    delUser(){
      this.axios.delete(`/users/${this.delUserId}`).then(res => {
        if(res.data.meta.status != 200) return this.$message.error('删除失败')
        this.delDialogVisible = false
        this.$message({
          message: '删除成功',
          type: 'success',
          center: true
        })
        this.getUserList()
      })
    }

  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/css/rule.less";

  .bt-adduser{
    box-shadow: 0 8px 10px -4px rgba(19, 29, 121, 0.3);
  }

  .search-bg{
    /deep/.el-input__inner{
      background-color: #ebedf5;
    }
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  /deep/.user-table{
    font-size: 15px;
    color: @nomalfont;
    margin-bottom: 16px;
     
    tr{
      td,th{
        padding: 15px 0;

        .table-btn{
          margin-left: 0;
          margin-right: 15px;
          border: none;
          background: none;
          font-size: 16px;
          padding: 0;
        }
      }


    }
  }


</style>
