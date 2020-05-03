<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            :clearable="true"
            @clear="getOrdersList"
          >
            <el-button
              @click="getOrdersList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border>
        <el-table-column
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          align="center"
          label="订单编号"
          prop="order_number"
        ></el-table-column>
        <el-table-column
          align="center"
          width="100px"
          label="订单价格"
          prop="order_price"
        ></el-table-column>
        <el-table-column
          align="center"
          width="100px"
          label="是否付款"
          prop="pay_status"
        >
          <template align="center" slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="100px"
          label="是否发货"
          prop="is_send"
        ></el-table-column>
        <el-table-column align="center" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template align="center" >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-s-tools"
              size="mini"
              @click="showBox"

            ></el-button>
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
      orderList: [],
      total: 0,
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { data } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (data.meta.status != 200)
        return this.showToast(data.meta.msg, "error");
      this.showToast(data.meta.msg, "success");
      this.orderList = data.data.goods;
      this.total = data.data.total;
      (this.orderList);
    },
    async handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getOrdersList()
    },
    async handleCurrentChange(newPageNum){
         this.queryInfo.pagenum = newPageNum
        this.getOrdersList()
    },
    showBox(){
      this.showToast('暂未开通','info')
    }
    
  },
};
</script>

<style lang="less" scoped>
.el-pagination{
  margin-top: 15px;
}
.el-row{
  margin-bottom: 15px;
}
</style>
