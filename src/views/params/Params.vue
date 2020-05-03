<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="只允许第三分级商品设置参数"
        :closable="false"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-row>
        <el-col :span="2">请选择分类：</el-col>
        <el-col :span="10">
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="clickChange">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isDisabled"
            class="add-btn"
            @click="addVisible = true"
            >添加参数
          </el-button>
          <el-table :data="manyTableData" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"> 
                  {{item}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="remove(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="addVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"> 
                  {{item}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="remove(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addVisible"
      width="50%"
    >
      <el-form :model="addForm" label-width="100px">
        <el-form-item :label="titleText">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //修改 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editVisible"
      width="50%"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item :label="titleText">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editVisible: false,
      editForm: {
        attr_name: "",
      },
      addForm: {
        attr_name: "",
      },
      cateList: [],
      selectedKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addVisible: false,
    };
  },
  computed: {
    isDisabled() {
      return this.selectedKeys.length !== 3;
    },
    //三级分类的id
    cateId() {
      return this.selectedKeys.length === 3 && this.selectedKeys[2];
      return null;
    },
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
  created() {
    this.getCateList();
  },
  methods: {
    //移除
    async remove(attr_id) {
      this.open("是否确认删除", "info")
        .then(async () => {
          const { data } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attr_id}`
          );
          if (data.meta.status != 200)
            return this.showToast(data.meta.msg, "error");
          this.showToast(data.meta.msg, "success");
          this.getParamsData();
        })
        .catch(() => {
          this.showToast("取消删除", "info");
        });
    },
    //编辑
    async edit(attr_id) {
      const { data } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        }
      );
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.showToast(data.meta.msg, "success");
      this.getParamsData();
      this.editVisible = false;
    },
    async openEditDialog(attr_id) {
      //查询当前的参数信息
      const { data } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      this.editForm = data.data;
      this.editVisible = true;
    },
    async add() {
      const { data } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
      );
      if (data.meta.status != 201)
        return this.showToast(data.meta.msg, "error");
      this.showToast(data.meta.msg, "success");
      this.addVisible = false;
      this.getParamsData();
    },
    async getCateList() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.cateList = data.data;
    },
    handleChange() {
      this.getParamsData();
    },
    clickChange() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        return;
      }
      const { data } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      data.data.map(v=>v.attr_vals = v.attr_vals!==''?v.attr_vals.split(' '):[])
      if (this.activeName === "many") {
        this.manyTableData = data.data;
      } else {
        this.onlyTableData = data.data;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.add-btn {
  margin-bottom: 10px;
}
.el-tag{
  margin: 6px;
}
</style>
