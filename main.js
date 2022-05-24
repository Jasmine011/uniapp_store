
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
//配置请求根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function (options) {
  //开启加载提示
  uni.showLoading({
    title:'数据加载中...'
  })
}
// 响应拦截器
$http.afterRequest = function () {
  //关闭加载提示
  uni.hideLoading()
}

//自定义一个showToast
uni.$showMsg = function(title='数据加载失败！',duration=1500){
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif