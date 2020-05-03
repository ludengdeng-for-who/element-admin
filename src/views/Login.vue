<template>
  <div>
    <div class="container" :style="{'background-image':`url(${imgs[Math.floor(Math.random()*10)]})`}">
      <el-card class="box-card">
        <div class="avatar">
          <img src="./logo.png" alt="" />
        </div>
        <el-form class="form" ref="form" :model="form"> 
          <el-form-item>
            <el-input v-model="form.username" prefix-icon="el-icon-s-custom"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.password"
              prefix-icon="el-icon-key"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import img1 from './images/1-min.jpg'
import img2 from './images/2-min.jpg'
import img3 from './images/3-min.jpg'
import img4 from './images/4-min.jpg'
import img5 from './images/5-min.jpg'
import img6 from './images/6-min.jpg'
import img7 from './images/7-min.jpg'
import img8 from './images/8-min.jpg'
import img9 from './images/9-min.jpg'
import img10 from './images/10-min.jpg'
export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
        imgs:[img1,img2,img3,img4,img5,img6,img7,img8,img9,img10]
    };
  },
  created(){
    
  },
  methods: {
    reset() {
      (this.form.username = ""),(this.form.password = "")
    },
     async login(){
      const {data} = await this.$http.post("login",this.form);
      (data);
      if(data.meta.status!="200"){
        //showToast混入方法
        this.showToast("登录失败","error")
      }else{
        sessionStorage.setItem("adminToken",data.data.token)
        this.showToast("登录成功","success")
        this.$router.push("/home")
      }
    }
  },
};
</script>

<style lang="less" scoped>
.el-card {
  background-color: rgba(0, 0, 0, .2);
  border: none;
  box-shadow: none;
}
.container {
  // background-image: url(./images/6.jpg);
  background-size: 100% 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .box-card {
    width: 480px;
    margin: 0 auto;
    .avatar {
      display: flex;
      justify-content: center;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      animation: scale 2s infinite linear alternate;
      margin-bottom: 30px;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    @keyframes scale {
      from {
        transform: scale(1);
        box-shadow: 0 0 10px 16px #fff;
      }
      to {
        transform: scale(1.1);
        box-shadow: 0 0 10px 2px transparent;
      }
    }
    .btns {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
