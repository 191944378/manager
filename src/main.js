
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

//引入moment插件
import moment from 'moment'
Vue.prototype.$moment = moment

//引入vue文本编辑器 quill
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)

// 引入富文本编辑器 Tinymce
import Editor from '@tinymce/tinymce-vue'
Vue.component('editor', Editor)


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
