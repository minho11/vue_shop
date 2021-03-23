<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/aoaoLogo.jpeg" alt="" />
        <span>嗷嗷电商管理系统</span>
      </div>

      <el-button type="info" @click="loginOut">退出 </el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="isCollapse? '64px':'200px'">
        <el-menu
          background-color="#40686a"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="linkPath"
        >
          <!-- 折叠栏 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
              ><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view> </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon036-love',
        "103": "iconfont icon024-reading",
        "101": "iconfont icon016-painter",
        "102": "iconfont icon025-money",
        "145": "iconfont icon022-computer"
      },
      isCollapse: false,
      linkPath: ''
    }
  },

  created() {
    this.getMenuList();
    this.linkPath = window.sessionStorage.getItem('linkPath');
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push('/login');

    },
    // 获取菜单项
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data;
    },
    // 折叠事件
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 获得链接地址并激活
    saveNavState(linkPath) {
      window.sessionStorage.setItem("linkPath", linkPath)
      this.linkPath = linkPath;

    }

  }

}
</script>
<style Lang="Less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  padding-left: 0;
  background-color: #915c4c;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header div {
  display: flex;
}
.el-header div span {
  display: flex;
  align-items: center;
  margin-left: 15px;
  color: #fff;
  font-size: 20px;
}

.el-header div img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.el-aside {
  background-color: #40686a;
}
.el-main {
  background-color: #eaedfc;
}

.el-submenu {
  width: 100%;
}
.el-menu .toggle-button {
  /* width: 200px; */
  height: 24px;
  background-color: #40686a;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 5px;
  cursor: pointer;
}

/* .el-menu i {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
} */
</style>