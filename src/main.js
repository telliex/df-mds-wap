// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import VueCookie from 'vue-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import httpProxy from '@/net/httpProxy'
import { isAuth } from '@/net/validate'
import '@/assets/scss/index.scss'
import $ from 'jquery'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookie)

// 挂载全局
Vue.prototype.$http = httpProxy // ajax请求方法
Vue.prototype.isAuth = isAuth// 权限方法
Vue.prototype.$ = $// 权限方法
Vue.prototype.lodingStatus = false// 加载遮罩

// 关闭弹窗清除表单
Vue.prototype.clearForm = function (form) {
  this[form] = {}
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
