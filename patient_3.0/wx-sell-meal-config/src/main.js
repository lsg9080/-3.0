// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import Cube from 'cube-ui'
import App from './App'
import router from './router'
import store from './store'
import 'common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'
import 'lib-flexible/flexible'
import md5 from 'js-md5';
import axios from './request/http'
import qs from 'qs'
//自定义提示框
import Toast from 'common/js/toast'
import storage from 'common/js/storage'
import { urlParse } from 'common/js/util'
// 调试工具
import vConsole from 'vconsole'

Vue.use(Toast); //启用新的提示组件

Vue.use(Cube)
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/images/timg.jpg'), //请求失败后显示的图片
    loading: require('@/assets/images/timg.jpg'), //加载的loading过渡图片
    attempt: 1 // 加载图片数量
})

Vue.config.productionTip = false
Vue.prototype.$md5 = md5;
Vue.prototype.$ajax = axios
Vue.prototype.qs = qs


import getConfigSetApi from './request/api'

// 请求文件内容及创建实例
async function main() {
    // 获取配置文件设置api接口地址
    await getConfigSetApi();
    // 当配置文件中vConsole=true时，可打开调试工具
    if (Vue.prototype.vConsole) {
        Vue.prototype.$vConsole = new vConsole()
    }
    // 创建实例
    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app')
}
// 方法初始执行
main();


router.beforeEach((to, form, next) => {
    //debugger
    if (to.name == 'orderFood' || to.name == 'orderList') {
        // debugger
        let openid = storage.getItem('openId')
        let userStatus = storage.getItem('userStatus')
        if (!openid || !userStatus || userStatus != true) {
            storage.setItem('callbackUrl', to.fullPath)
            next({
                path: '/choice', // 未登录则跳转至choice页面
                // query: {redirect: to.fullPath} // 登陆成功后回到当前页面，这里传值给login页面，to.fullPath为当前点击的页面
            });
            return
        }
    }
    window.document.title = to.meta.title == undefined ? '营养订餐' : to.meta.title
    next()
})