import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式控制文件
import '@/assets/css/global.css'

// 引入组件库模块
import ElementUI from 'element-ui'

// 引入axios
import axios from 'axios'
// 配置请求根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 把axios通过原型继承方式配置给Vue成员，名称为$http(自定义的)，以后其他组件
// 就可以通过  this.$http  的方法获得axios对象了
Vue.prototype.$http = axios

// 注册
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
