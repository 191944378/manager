import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Desktop from '../components/Desktop.vue'
import Home from '../components/Home.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/commodity/Cate.vue'

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
      {path: '/categories', component: Cate}
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
