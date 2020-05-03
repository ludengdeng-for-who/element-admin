<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20"> 
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
            <el-button icon="el-icon-search" slot="append" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品名称"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          align="center"
          width="120px"
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          align="center"
          width="120px"
          label="商品重量"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column align="center" width="160px" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="240px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
            @click="showBox"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="remove(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    showBox(){
      this.showToast('暂未开通','info')
    },
    async getGoodList() {
      const { data } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      this.goodsList = data.data.goods;
      this.total = data.data.total;
      (this.goodsList);
    },
    async handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getGoodList()
    },
    async handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getGoodList()

    },
    remove(goods_id){ 
        this.open('是否删除该商品','info')
        .then(async ()=>{
            const {data} = await this.$http.delete(`goods/${goods_id}`)
            if(data.meta.status !=200) return this.showToast(data.meta.msg,'error')
            this.showToast(data.meta.msg,'success')
            this.getGoodList()
        })
        .catch(()=>{
            this.showToast('已取消删除','info')
        })
      }
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 10px;
}
</style>
