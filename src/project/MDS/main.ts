// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import $ from 'jquery';
import store from '@/store';
import VueCookie from 'vue-cookie';
import { Notification } from 'element-ui';
import elementUi from './elementUi';
import install from '@/views/components/install';
import 'element-ui/lib/theme-chalk/index.css';
import httpProxy from '@/net/httpProxy';
import { isAuth } from '@/net/validate';
// import SentryUtil from '@/net/sentryUtil'
import 'common/scss/index.scss';

import App from './App.vue';

import useComponents from 'src/components/index';
// import 'script-loader!file-saver'
// funDebug
// import fundebugVue from 'fundebug-vue'
let version = 'dev';
if (process.env.NODE_ENV === 'production') {
    version = require('@/version');
    // let fundebug = require('fundebug-javascript')
    // fundebug.apikey = '208950dc06f14c77de3e8b9ee5dcaf107f7586d95d5340696aa96bfd59d4a1d4'
    // fundebugVue(fundebug, Vue)
    // require('fundebug-revideo')
}
Vue.use(useComponents);

elementUi();
// SentryUtil.init()
Vue.config.productionTip = false;
Vue.use(VueCookie);
// 自定义全局组件
Vue.use(install);

// 挂载全局
Vue.prototype.$http = httpProxy; // ajax请求方法
Vue.prototype.isAuth = isAuth; // 权限方法
Vue.prototype.$ = $; // jq
Vue.prototype.lodingStatus = false; // 加载遮罩
Vue.prototype.lodingState = false; // 加载遮罩
Vue.prototype.version = version; // 版本号
// 警告通知
Vue.prototype.$warningToast = str => {
    Notification({ title: '警告', message: str, type: 'warning' });
};
// 错误通知
Vue.prototype.$errorToast = str => {
    Notification({ title: '错误', message: str, type: 'error', duration: 0 });
};
// 成功通知
Vue.prototype.$successToast = str => {
    Notification({ title: '成功', message: str, type: 'success' });
};
// 提示
Vue.prototype.$infoToast = str => {
    Notification({ title: '提示', message: str, type: 'info' });
};

// 关闭弹窗清除表单
Vue.prototype.clearForm = function(form: any) {// eslint-disable-line
    this[form] = {};
};

// mock
// require('../mock/index');

// 生成uuid
Vue.prototype.uuid = function(len: number, radix: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid: Array<string> = [];
    let i: number;
    const radixWrap = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radixWrap)];
    } else {
        // rfc4122, version 4 form
        let r: number;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16);
                uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
};

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
