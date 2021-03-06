import Vue from 'vue'
// 引入axios
import axios from 'axios'

import JSONbig from 'json-bigint'
import router from '@/router'
// 配置请求根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 把axios通过原型继承方式配置给Vue成员，名称为$http(自定义的)，以后其他组件
// 就可以通过  this.$http  的方法获得axios对象了
Vue.prototype.$http = axios

// 设置请求拦截器
axios.interceptors.request.use(function (config) {
  let userinfo = window.sessionStorage.getItem('userinfo')
  //  useinfo 不是一直在的 登录的时候也需要发送请求，但是此时没有useinfo
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    // 给axios的请求头设置token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

// 配置响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (err) {
  // 判断响应状态码是否为401
  if (err.response.status === 401) {
    router.push({ name: 'login' })
  }
  return Promise.reject(err)
})
// 对服务器来的数据信息做处理，此时还是字符串
// axios配置数据转换器，在响应拦截器之前
axios.defaults.transformResponse = [function (data) {
  // 服务端返回的数据有两种类型
  // 字符串对象
  // 空字符串
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}]
