import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Desktop from '../components/Desktop.vue'
// import Home from '../components/Home.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/commodity/Cate.vue'
// import Params from '../components/commodity/Params.vue'
// import Goods from '../components/commodity/Goods.vue'
// import Orders from '../components/order/Orders.vue'
// import Reports from '../components/reports/Reports.vue'

const Login = () => import(/* webpackChunkName: "login-desktop-home" */ '../components/Login.vue')
const Desktop = () => import(/* webpackChunkName: "login-desktop-home" */ '../components/Desktop.vue')
const Home = () => import(/* webpackChunkName: "login-desktop-home" */ '../components/Home.vue')

const Users = () => import(/* webpackChunkName: "users" */ '../components/user/Users.vue')

const Rights = () => import(/* webpackChunkName: "rights-roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "rights-roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "cate-params-goods" */ '../components/commodity/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate-params-goods" */ '../components/commodity/Params.vue')
const Goods = () => import(/* webpackChunkName: "cate-params-goods" */ '../components/commodity/Goods.vue')

const Orders = () => import(/* webpackChunkName: "orders" */ '../components/order/Orders.vue')

const Reports = () => import(/* webpackChunkName: "reports" */ '../components/reports/Reports.vue')




Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/desktop' },
    { path: '/login', component: Login },
    { path: '/desktop', redirect: '/home', component: Desktop, children: [
      {path: '/home', component: Home},
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/categories', component: Cate},
      {path: '/params', component: Params},
      {path: '/goods', component: Goods},
      {path: '/orders', component: Orders},
      {path: '/reports', component: Reports},
    ] },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    if (!localStorage.token) {
      next()
    } else {
      next('/desktop')
    }
  } else {
    if (!localStorage.token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
