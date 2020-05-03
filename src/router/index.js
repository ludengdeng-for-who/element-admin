import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=>import("@/views/Login")
const Home = ()=>import("@/views/Home")
const Welcome = ()=>import("@/views/Welcome")
const User = ()=>import("@/views/user/User")
const Rights = ()=>import("@/views/rights/Rights")
const Roles = ()=>import("@/views/rights/Role")
const Categories = ()=>import("@/views/categories/Categories")
const Params = ()=>import("@/views/params/Params")
const GoodList = ()=>import("@/views/goodlist/GoodList")
const AddGoods = ()=>import("@/views/addgoods/AddGoods")
const Orders = ()=>import("@/views/orders/Orders")
const Report = ()=>import("@/views/report/Report")
Vue.use(VueRouter)

  const routes = [
    {
      path:"/",
      redirect:"/login"
    },
    {
      path:"/login",
      component:Login
    },
    {
      path:"/home",
      component:Home,
      redirect:'/welcome',
      children:[
        {
          path: '/welcome',
          component:Welcome
        },
        {
          path: '/users',
          component:User
        },
        {
          path: '/rights',
          component:Rights
        },
        {
          path: '/roles',
          component:Roles
        },
        {
          path: '/categories',
          component:Categories
        },
        {
          path: '/params',
          component:Params
        },
        {
          path: '/goods',
          component:GoodList
        },
        {
          path: '/goods/add',
          component:AddGoods
        },
        {
          path: '/orders',
          component:Orders
        },
        {
          path: '/reports',
          component:Report
        }
      ]
    }
]

const router = new VueRouter({
  routes,
  mode:'hash'
})
router.beforeEach((to,from,next)=>{
  if(to.path === '/login') {
    return next()
  }
  if(to.path !== '/login') {
    const token = sessionStorage.getItem("adminToken");
    if(!token){
      return next("/login")
    }
    next()
  }
})

export default router
