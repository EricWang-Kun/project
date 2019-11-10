<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header>
  <div id="lt">
    <i class="el-icon-s-fold"></i>
    <span>江苏传智播客教育科技股份有限公司</span>
  </div>
  <div id="rt">
    <el-input type="text" placeholder="请输入搜索的文章内容" style="width:300px;">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <span style="margin:0 10px;">消息</span>
    <el-dropdown>
      <span class="el-dropdown-link">
        <img :src="photo" alt width="40" height="40">
        {{name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人信息</el-dropdown-item>
        <el-dropdown-item>github地址</el-dropdown-item>
        <el-button @click="logout()">退出</el-button>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
        </el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
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
      this.$confirm('确定要提出系统?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }).catch(() => { })
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height:100%;
  .el-aside {
    background-color: #323745;
  }
  .el-main{
    background-color: #f2f3f5;
  }
}
.el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-header {
    background-color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 10px 0 9px;
    min-width: 950px;
    #lt {
      height: 100%;
      width: 40%;
      background-color: white;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    #rt {
      height: 100%;
      width: 50%;
      background-color: white;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
