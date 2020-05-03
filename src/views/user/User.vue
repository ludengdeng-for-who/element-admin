<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryinfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            :clearable="true"
            @clear="getUserList"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addUserDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userinfo" :border="true" style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column prop="username" label="用户昵称" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="权限"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ccc"
              @change="changeState(scope.row)"
            >
              -->
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="操作"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              @click="showEidtDialog(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="allowRole(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      @close="addDialogClose"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editdialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="addRules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //角色分配 -->
    <el-dialog title="角色分配" :visible.sync="RoleVisible" width="50%">
      <div>
        <p>当前用户：{{ userSelectInfo.username }}</p>
        <p>当前用户角色：{{ userSelectInfo.role_name }}</p>
        <div>
          分配新角色：
          <el-select v-model="rolesValue" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesValue: "",
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 20,
      },
      userinfo: [],
      editdialogVisible: false,
      total: false,
      dialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      editForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      RoleVisible: false,
      roleList: [],
      userSelectInfo: {},
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async saveRoleInfo() {
      if (!this.rolesValue) return this.showToast("请选择角色", "error");
      const { data } = await this.$http.put(
        `users/${this.userSelectInfo.id}/role`,
        {
          rid: this.rolesValue,
        }
      );
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.showToast(data.meta.msg, "success");
      this.getUserList();
      this.RoleVisible = false;
    },
    //分配角色
    async allowRole(userinfo) {
      this.userSelectInfo = userinfo;
      const { data } = await this.$http.get("roles");
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.roleList = data.data;
      this.RoleVisible = true;
    },
    //删除用户
    removeUser(id) {
      this.open("是否永久删除该用户", "info")
        .then(async () => {
          const { data } = await this.$http.delete(`/users/${id}`);
          if (data.meta.status !== 200)
            return this.showToast(data.meta.msg, "error");
          this.showToast(data.meta.msg, "success");
          this.getUserList();
        })
        .catch(() => {
          this.showToast("已取消删除", "info");
        });
    },
    //编辑用户
    editUser() {
      this.$refs.editForm.validate(async (config) => {
        if (!config) return this.showToast("编辑失败", "warning");
        const { id, username, email, mobile } = this.editForm;
        const { data } = await this.$http.put(`/users/${id}`, {
          username,
          email,
          mobile,
        });
        (data);
        if (data.meta.status != 200)
          return this.showToast(data.meta.msg, "error");
        this.showToast(data.meta.msg, "success");
        this.getUserList();
        this.editdialogVisible = false;
      });
    },
    //编辑对话框
    async showEidtDialog(id) {
      const { data } = await this.$http.get(`users/${id}`);
      if (data.meta.status != 200)
        return this.showToast("获取数据失败", "warning");
      this.editForm = data.data;
      this.editdialogVisible = true;
    },
    // 添加
    addUser() {
      this.$refs.ruleForm.validate(async (config) => {
        if (!config) return;
        const { data } = await this.$http.post("users", this.addForm);
        (data);
        if (data.meta.status != "201")
          return this.showToast(data.meta.msg, "warning");
        this.showToast("添加成功", "success");
        this.getUserList();
        this.dialogVisible = false;
      });
    },
    //添加对话框关闭
    addDialogClose() {
      this.$refs.ruleForm.resetFields();
    },
    addUserDialog() {
      this.dialogVisible = true;
    },
    async getUserList() {
      const { data } = await this.$http.get("users", {
        params: this.queryinfo,
      });
      this.userinfo = data.data.users;
      this.total = data.data.total;
    },
    async changeState(userinfo) {
      const { data } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.m_state}`
      );
      if (data.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.showToast("设置失败", "warning");
      }
      return this.showToast("设置成功", "success");
    },
  },
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 10px;
}
</style>
