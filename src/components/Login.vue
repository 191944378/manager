<template>
  <div class="container">
    <!-- 登录介绍 -->
    <div id="introduce-section">
      <div>· 全局开发</div>
      <div>· 极速上手</div>
      <div>· 全新体验</div>
    </div>
    <!-- 登录 -->
    <div id="login-section">
      <div class="login-box">
        <!-- 头像 -->
        <div class="login-avatar">
          <img src="../assets/img/logo.png">
        </div>
        <!-- 表单 -->
        <div class="login-form">
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" prefix-icon="iconfont icon-RectangleCopy4" placeholder="用户名 / 邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" prefix-icon="iconfont icon-RectangleCopy28" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item class="form-buttons">
             <el-button type="primary" @click="login">登录</el-button>
             <el-button plain @click="resetLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ], 
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(boolean => {
        if (!boolean) return
          this.axios.post('/login', this.loginForm).then(res => {
          if(res.data.meta.status == 200){
            this.$message({
              message: '登录成功',
              type: 'success',
              center: true
            })
            localStorage.setItem('token', res.data.data.token)
            this.$router.push('./home')
          } else {
            this.$message({
              message: '用户名或密码错误',
              type: 'error',
              center: true
            })
          }
        })
      })

    }
  }
}
</script>

<style lang="less" scoped>

  .container{
    width: 100%;
    height: 100%;
    background-color: rgb(59, 73, 97);
    display: flex;

    #introduce-section{
      flex: 2;
      background-color: rgb(48, 57, 74);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      div{
        margin: 10px 0;
        letter-spacing: 3px;
        color: rgb(223, 220, 192);
        font-size: 24px;
        font-weight: 200;
      }
    }

    #login-section{
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: center;

      .login-box{
        width: 340px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 15px 15px -5px rgba(21, 35, 58, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;

        .login-avatar{
          width: 100px;
          height: 100px;
          transform: translateY(-50px);
          border: 6px solid #fff;
          box-shadow: 0 8px 8px rgba(208, 212, 218, 0.365);
          border-radius: 100%;
          overflow: hidden;
          background-color: rgb(235, 235, 235);

          img{
            width: 100%;
            height: 100%;
          }
        }

        .login-form{
          transform: translateY(-20px);
          width: 100%;
          padding: 0 20px;
          box-sizing: border-box;

           /deep/.iconfont{
            font-size: 20px;
          }

          .form-buttons{
            display: flex;
            justify-content: flex-end; 
          }


        }
      }
    }
  }
</style>