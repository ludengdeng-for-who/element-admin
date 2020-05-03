import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Axios from 'axios'
import("./assets/css/goabal.less")
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.component('tree-table',ZkTable)
Vue.use(ElementUI)

Vue.prototype.$http = Axios.create({
  baseURL:"http://timemeetyou.com:8889/api/private/v1/",
})
//加入token
Vue.prototype.$http.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem("adminToken")
  Nprogress.start()
  return config
})
Vue.prototype.$http.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
//全局过滤器
Vue.filter('dateFormat',(values)=>{
 let date = new Date(values)
 let y = date.getFullYear()
 let m = date.getMonth() + 1
 let d= date.getDate()

 let hh = date.getHours()
 let mm = date.getMinutes()
 let ss = date.getSeconds()
 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false
Vue.mixin({
  methods:{
    /**
     * 
     * @param {String} message 提示信息
     * @param {String} type 提示类型
     */
    showToast(message,type){
      this.$message({
          message,
          type
        });
    },
    open(message,type) {
      return new Promise((reslove,reject)=>{
       this.$confirm(message, '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: type
       }).then(() => {
         reslove()
       }).catch(() => {    
         reject()
       });
      })
     }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
