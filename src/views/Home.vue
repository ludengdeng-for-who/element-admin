<template>
  <div>
    <el-container style="height: 100vh;">
      <el-header style="background-color: #373d41" class="header">
        <div>
          <img src="./logo.png" alt="" />
          <span class="big-title">电商后台管理系统</span>
        </div>
        <div>
          <el-button type="info" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-container style="height: calc(100vh - 60px);">
        <el-aside
          :width="isCollapse ? '64px' : '200px'"
          style="background-color: #333744"
        >
          <div class="toggle" @click="toggle">
            <i v-if="left" class="el-icon-caret-left"></i>
            <i v-else class="el-icon-caret-right"></i>
          </div>
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in list"
              :key="item.id"
            >
              <!-- 一级菜单模板 -->
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->

              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container style="background-color: #eaedf1">
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: false,
      iconList: [
        "el-icon-user-solid",
        "el-icon-s-help",
        "el-icon-s-goods",
        "el-icon-s-order",
        "el-icon-document",
      ],
      left: true,
      isCollapse: false,
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    toggle() {
      this.left = !this.left;
      this.isCollapse = !this.isCollapse;
    },
    logout() {
      this.open("确定退出吗", "warning").then(
        () => {
          sessionStorage.clear();
          this.$router.push("/login");
          this.showToast("退出成功", "success");
        },
        () => {
          this.showToast("已取消", "success");
        }
      );
    },
    async getMenuList() {
      const { data } = await this.$http.get("menus");
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.list = data.data;
      for (const key in this.list) {
        this.list[key].icon = this.iconList[key];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }
  .big-title {
    margin-left: 10px;
    color: #eee;
    font-size: 22px;
  }
}
.toggle {
  background-color: #4a5064;
  text-align: center;
  padding: 4px 0;
  color: #fff;
  cursor: pointer;
}
</style>
