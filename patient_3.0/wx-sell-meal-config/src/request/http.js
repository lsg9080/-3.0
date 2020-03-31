/**
 * Created by zhl on 2019/8/21.
 */
import Axios from 'axios'
import qs from 'qs'
import storage from '../common/js/storage'
import store from '../store'
import Cube from 'cube-ui'

// 通过axios.defaults.timeout设置默认的请求超时时间。例如超过了10s，就会告知用户当前请求超时，请刷新等。
// axios.defaults.timeout = 10000;
let axios = Axios.create({
    // baseURL: process.env.API_ROOT,
    withCredentials: false,
    timeout: 30000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});


// 请求拦截器
axios.interceptors.request.use(
        config => {
            store.commit('changeLoadingType', true)
            return config;
        },
        error => {
            // if (error.code == 'ECONNABORTED' || error.message == 'Network Error' || error.message.includes('timeout')) {   // 判断请求异常信息中是否含有超时timeout字符串
            // 	console.log("错误回调", error);
            // 	store.commit('changeLoadingType', false)
            // 	alert("网络超时");
            // 	return Promise.reject(error);          // reject这个错误信息
            // }
            return Promise.reject(error);
        }
    )
    // 响应拦截
axios.interceptors.response.use(response => {
        console.log(response)

        store.commit('changeLoadingType', false)
            // setTimeout(function () { store.commit('changeLoadingType', false) }, 300);
        return response;
    },
    (error) => {
        // let res = error && error.response;
        // if (res) {
        // 	console.log(res['statusText']);
        // }
        // return Promise.reject(error)
        console.warn("request error: ", error)
        store.commit('changeLoadingType', false)
        let message = ''
        if (error.response && error.response.status >= 500 && error.response.status < 599) {
            message = "服务器异常"
        } else {
            if (error.message == 'Network Error') {
                message = "网络连接超时"
                alert(message)
            } else {
                //message = error.message == 'Network Error' ? '网络异常' : error.message
            }
        }

        // Cube.toast = Cube.$createToast({
        // 	txt: message,
        // 	type: 'txt'
        // })
        // Cube.toast.show()
        return Promise.reject(message)
    }
);

export default axios;