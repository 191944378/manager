<template>
  <el-container class="container">

    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '75px' : '240px'">
      <!-- 导航 -->
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo aside-menu"
        active-text-color="#417cb4"
        background-color="#f8f9fd"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true">
        <!-- logo -->
        <div class="aside-logo" @click="toHome">
          <img v-if="!isCollapse" src="../assets/img/aside-logo.png">
          <img v-else src="../assets/img/aside-minlogo.png">
        </div>
        <!-- 伸缩按钮 -->
        <div class="menu-stretch">
          <a href="" class="iconfont icon-RectangleCopy57" @click.prevent="isCollapse = !isCollapse"></a>
        </div>
        <!-- 主页 -->
        <el-menu-item index="home" @click="saveIndex('home')">
          <i class="iconfont icon-RectangleCopy33"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <!-- 请求项 -->
        <el-submenu :index="item.id+''" :key="item.id" v-for="item in menulist">
          <template slot="title">
            <i :class="'iconfont'+ ' ' + menuicon[item.id]"></i>
            <span slot="title">{{item.authName}}</span>
          </template>
          <el-menu-item :index="child.path" :key="child.id" v-for="child in item.children" @click="saveIndex(child.path)">
            <span class="secondmenu">{{child.authName}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>


    <el-container>

      <!-- 头部 -->
      <el-header>
        <el-button icon="el-icon-switch-button" circle @click="loginOut"></el-button>
      </el-header>


      <!-- 内容 -->
      <el-main> 

        <!-- 标题 -->
        <div class="main-nav-box">
          <div class="nav-title">{{curPageName}}</div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>


        <!-- 主体 -->
        <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data(){
    return {
      isCollapse: false,
      activeIndex: '',
      menulist: [],
      menuicon: {
        125: 'icon-RectangleCopy4',
        103: 'icon-RectangleCopy39',
        101: 'icon-RectangleCopy60',
        102: 'icon-RectangleCopy89',
        145: 'icon-RectangleCopy42',
      },
      curPageName: ''
    }
  },

  created(){
    this.getMenueList()
  },
  updated(){
    // this.activeIndex = sessionStorage.activeIndex
  },
  
  watch: {
    activeIndex: function(){
      this.curPageName = document.querySelector('.el-menu-item.is-active').lastChild.innerText
    }
  },

  methods: {
    async getMenueList(){
      const { data: res } = await this.axios.get('/menus')
      if(res.meta.status == 200) return this.menulist = res.data
      console.log('左侧菜单请求失败')
    },
    loginOut(){
      localStorage.removeItem('token')
      sessionStorage.removeItem('activeIndex')
      this.$router.push('/login')
    },
    toHome(){
      sessionStorage.setItem('activeIndex', 'home')
      this.activeIndex = 'home'
      this.$router.push('/home')
    },
    saveIndex(index){
      sessionStorage.setItem('activeIndex', index)
    }
  },
}
</script>


<style lang="less" scoped>
  @import "../assets/css/rule.less";

  .container{
    height: 100%;
    background-color: #f8f9fd;
  }

  .el-aside {
    z-index: 1;

    .aside-menu{
      border: none;

      .aside-logo{
        height: 70px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        img{
          height: 38px * 0.7;
        }
      }

      .menu-stretch{
        width: 100%;
        height: 30px;
        border-top: 1px solid rgb(238, 239, 246);
        border-bottom: 1px solid rgb(238, 239, 246);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666;

        a{
          font-weight: 600;
          margin-right: 0;
          color: rgb(194, 203, 211);
          &:hover{
            color: @checkfont
          }
        }
      }

      /deep/.el-submenu__title:hover{
        color: @checkfont;
        background-color: #f8f9fd !important;
        .iconfont{
          color: @checkfont;
        }
      }
      /deep/.el-menu-item:hover{
        color: @checkfont;
        background-color: rgb(255, 255, 255) !important;
        .iconfont{
          color: @checkfont;
        }
      }

      .el-menu-item.is-active{
        z-index: 3;
        background-color: #fff !important;
        box-shadow: -30px 18px 18px -8px rgba(19, 29, 121, 0.109);
        border-left: 5px solid rgb(58, 85, 133);
        border-radius: 0 14px 14px 0;
        transform: translateX(10px);
        transition: transform 0.25s;
      }

      span{
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0.05em;
      }

      /deep/.iconfont{
        font-size: 20px;
        font-weight: 600;
        margin-right: 15px;
      }

      .secondmenu{
        margin-left: 15px;
        font-size: 14.5px;
      }
    }
  }

  .el-header{
    z-index: 2;
    height: 70px !important;
    box-shadow: 0 14px 10px rgba(19, 29, 121, 0.123);
    background-color: rgb(58, 85, 133);
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .el-main{
    .main-nav-box{
      height: 40px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .nav-title {
        color: @primary;
        font-size: 18px;
        text-indent: 0.5em;
        font-weight: 600;
        line-height: 50px;
        letter-spacing: 0.1em;
      }

      /deep/.el-breadcrumb__inner{
        font-weight: 400;

      }
      
    }
    
  }
  
  
  
 
  

  

</style>