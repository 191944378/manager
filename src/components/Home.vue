<template>
  <el-container class="container">
    <el-aside width="200px">Aside</el-aside>

    <el-container>
      <el-header>
        <el-button icon="el-icon-switch-button" circle @click="loginOut"></el-button>
      </el-header>
        
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  methods: {
    loginOut(){
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
}
</script>


<style lang="less" scoped>

 .container{
    height: 100%;
    background-color: #f8f9fd;
  }

  .el-header{
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  
  .el-aside {
    background-color: #fefefe;
  }
  
  .el-main {
  }
  

  

</style>