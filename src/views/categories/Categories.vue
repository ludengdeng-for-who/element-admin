<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success"></i>
          <i v-else class="el-icon-error"></i>
        </template>

        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
          @click="showBox"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="showBox"

            >删除</el-button
          >
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

    </el-card>

    <el-dialog
      title="添加商品"
      :visible.sync="CateVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCaterules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm" 
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="addCateValue"
            :options="parentCateList"
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
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="CateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCateForm: {
        cat_name: "",
        //父类id，如果一级，为0
        cat_id: 0,
        //等级
        cat_level: 0,
      },
      CateVisible: false,
      cateList: [],
      parentCateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      addCateValue: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    showBox(){
      this.showToast('暂未开通','info')
    },
    //pagesize改变
    async handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    async handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getCateList()

    },
    addDialogClosed() {
      this.$refs.ruleForm.resetFields();
      this.addCateForm.cat_id = 0;
      this.addCateForm.cat_level = 0;
    },
    openAddDialog() {
      this.getParentCateList();
      this.CateVisible = true;
    },
    async getCateList() {
      const { data } = await this.$http.get(`categories`, {
        params: this.queryInfo,
      });
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");

      this.cateList = data.data.result;
      this.total = data.data.total;
    },
    //获取父级分类
    async getParentCateList() {
      const { data } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.parentCateList = data.data;
    },
    handleChange() {
      //this.addCateValue长度0，就是创建一级分类
      //大于0，不是一级分类
      if (this.addCateValue.length > 0) {
        this.addCateForm.cat_id = this.addCateValue[
          this.addCateValue.length - 1
        ];
        this.addCateForm.cat_level = this.addCateValue.length;
      } else {
        this.addCateForm.cat_id = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.ruleForm.validate(async (config) => {
        if (!config) return this.showToast("添加失败", "error");
        const { data } = await this.$http.post("categories", this.addCateForm);
        if (data.meta.status != 201) this.showToast(data.meta.msg, "error");
        this.showToast(data.meta.msg, "success");
        this.CateVisible = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-icon-success,
.el-icon-error {
  font-size: 18px;
}
.el-row {
  margin-bottom: 10px;
}
.el-pagination{
  margin-top: 10px;
}
</style>
