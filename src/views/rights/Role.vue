<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      >.
      <el-button type="primary" style="margin-bottom:10px;">添加角色</el-button>

      <el-table :data="rolesList" :border="true" style="width: 100%">
        <el-table-column type="expand" label="#" align="center">
          <template slot-scope="scope">
            <el-row
              :class="['bb', index === 0 ? 'bt' : '']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'bbt']"
                  v-for="(item2, index2) in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      class="tag"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="操作"
          align="center"
          width="400"
        >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
            @click="showBox"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="showBox"

              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRoleDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="分配权限"
        :visible.sync="roleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
      >
        <el-tree
          :data="rightsList"
          :props="props"
          show-checkbox
          node-key="id"
          :default-checked-keys="defkeys"
          ref="treeRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allowRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      roleDialogVisible: false,
      rightsList: [],

      props: {
        label: "authName",
        children: "children",
      },
      defkeys: [],
      roleId: "",
    };
  },
  created() {
    this.getrolesList();
  },
  methods: {
    //分配权限
    async allowRights() {
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      let rids = keys.join(",");
      const { data } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids,
      });
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");

      this.showToast(data.meta.msg, "success");
      this.roleDialogVisible = false;
      this.getrolesList();
    },
    //重置树形控件
    setRoleDialogClosed() {
      this.defkeys = [];
    },
    //展示对话框
    async showRoleDialog(role) {
      const { data } = await this.$http.get("rights/tree");
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.rightsList = data.data;
      this.roleId = role.id;
      this.getLeafKeys(role, this.defkeys);
      this.roleDialogVisible = true;
    },
    //移除权限
    async removeRightById(role, rightId) {
      this.open("是否要删除该权限", "info")
        .then(async () => {
          const { data } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (data.meta.status != 200)
            return this.showToast(data.meta.msg, "error");
          this.showToast(data.meta.msg, "success");
          //   this.getrolesList()
          role.children = data.data;
        })
        .catch(() => {
          this.showToast("取消删除", "info");
        });
    },
    async getrolesList() {
      const { data } = await this.$http.get("roles");
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.rolesList = data.data;
      this.showToast(data.meta.msg, "success");
    },
    //遍历id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    showBox(){
      this.showToast('暂未开通','info')
    }
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin: 20px;
  display: flex;
  align-items: center;
}
.bb {
  border-bottom: 1px solid #ccc;
}
.bt {
  border-top: 1px solid #ccc;
}
.bbt {
  margin: 0;
  padding: 20px;
  border-top: 1px solid #ccc;
}
.tag {
  margin: 10px;
}
</style>
