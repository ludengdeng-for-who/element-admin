<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        :closable="false"
        type="warning"
        show-icon
        center
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                  children: 'children',
                }"
                clearable
                @change="hanlerChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input :value="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="uploadHeaders"
              list-type="picture"
              :on-success="handlerSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button size="medium" type="primary" class="btn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%"
    >
   <div class="img">
      <img :src="previewPath" alt="">
   </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      uploadHeaders:{
        Authorization:sessionStorage.getItem('adminToken')
        },
      cateList: [],
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      manyTableData: [],
      onlyTableData: [],
      previewPath:'',
      dialogVisible:false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.cateList = data.data;
    },
    hanlerChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.showToast("请先选择商品分类", "error");
        return false;
      }
      return true;
    },
    async tabClick() {
      if (this.activeIndex === "1") {
        const { data } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );
        if (data.meta.status != 200)
          return this.showToast(data.meta.msg, "error");
        data.data.map(
          (v) =>
            (v.attr_vals =
              v.attr_vals.length !== 0 ? v.attr_vals.split(",") : [])
        );
        this.manyTableData = data.data;
      }
      if (this.activeIndex === "2") {
        const { data } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (data.meta.status != 200)
          return this.showToast(data.meta.msg, "error");
        // data.data.map((v) =>(v.attr_vals = v.attr_vals.length !== 0 ? v.attr_vals.split(",") : []));
        this.onlyTableData = data.data;
      }
    },
    //图片预览
    handlePreview(file){
      this.dialogVisible = true
      this.previewPath = file.response.data.url
    },
    //移除图片
    handleRemove(file){
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(v=>v.pic === filePath)
      (index);
      this.addForm.pics.splice(index,1)
      (this.addForm.pics);
      
    },
    handlerSuccess(response){
      const picInfo = {
        pic:response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
     addGoods(){
      this.$refs.ruleForm.validate(async (config)=>{
        if(!config) return this.showToast('请填写必要的表单项','error')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // (form);
        this.manyTableData.forEach((item)=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          form.attrs.push(newInfo)
        })
        this.onlyTableData.forEach((item)=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          form.attrs.push(newInfo)
        })
        const {data} = await this.$http.post('goods',form)
        if(data.meta.status != 201) return this.showToast(data.meta.msg,'error')
        this.showToast(data.meta.msg,'success')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.btn{
  margin-top: 15px;

}
.img{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
