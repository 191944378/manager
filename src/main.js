import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/element-variables.scss'
import './assets/font/iconfont.css'
import './assets/css/base.css'

// 配置 axious 全局默认值
import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.use(VueAxios, axios)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 添加请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = localStorage.getItem('token')
  return config;
});

// 配置 ElementUI  --整体引入
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI) 

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
