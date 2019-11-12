<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">
      <el-menu
        background-color="#323745"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="1" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:isCollapse?'65px':'200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="2-1">发布文章</el-menu-item>
          <el-menu-item index="2-2">内容列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="4" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">账户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="lt">
          <i
            :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
            @click="isCollapse=!isCollapse"
          ></i>
          <span style="margin-left:20px;">江苏传智播客教育科技股份有限公司</span>
        </div>
        <div class="rt">
          <el-tooltip effect="dark" content="搜索" placement="bottom">
            <el-input type="text" placeholder="请输入搜索文章内容" style="width:240px;">
              <i class="el-icon-search" slot="prefix"></i>
            </el-input>
          </el-tooltip>
          <el-tooltip effect="dark" content="消息" placement="bottom">
            <span style="margin:0 20px;">消息</span>
          </el-tooltip>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img :src="photo" alt />
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>git地址</el-dropdown-item>
              <el-dropdown-item>————</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    name () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  methods: {
    logout () {
      this.$confirm('是否退出登录？', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push({ name: 'login' })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-main {
    background-color: #f2f3f5;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .lt {
      height: 100%;
      width: 40%;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    .rt {
      height: 100%;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .el-input {
        font-size: 14px;
        line-height: 40px;
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      span {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
