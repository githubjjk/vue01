// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import md5 from 'js-md5'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import 'font-awesome/css/font-awesome.min.css'
import 'animate.css'
import VueAMap from 'vue-amap'
import VueCookie from 'vue-cookie'
import store from '@/store'
import { checkBtnPer } from './utils/permission'

axios.create({
  baseURL: 'http://127.0.0.1:8082/api', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});
Vue.use(VueCookie)
Vue.use(ElementUI)
Vue.use(VueAMap)
Vue.prototype.$ajax = axios
Vue.prototype.$md5 = md5
Vue.prototype.checkBtnPer = checkBtnPer
Vue.config.productionTip = false
VueAMap.initAMapApiLoader({
  key: 'your amap key',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
// request interceptor
axios.interceptors.request.use(
  config => {
    // do something before request is sent
    if (true) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['AccessToken'] = VueCookie.get("AccessToken");
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
axios.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.state !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res;
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400: Message({
          message: '请求错误',
          type: 'error',
          duration: 2 * 1000
        }); break
        case 401: Message({
          message: '未授权，请登录',
          type: 'error',
          duration: 2 * 1000
        });
          VueCookie.delete("AccessToken");
          router.replace({
            name: "login"
          });
          break
        case 403: Message({
          message: '拒绝访问',
          type: 'error',
          duration: 2 * 1000
        }); break
        case 404: Message({
          message: `请求地址出错: ${error.response.config.url}`,
          type: 'error',
          duration: 2 * 1000
        }); break
        case 408: Message({
          message: '请求超时',
          type: 'error',
          duration: 2 * 1000
        }); break
        case 500: Message({
          message: '服务器内部错误',
          type: 'error',
          duration: 2 * 1000
        }); break
        case 501: Message({
          message: '服务未实现',
          type: 'error',
          duration: 2 * 1000
        }); break
        case 502: Message({
          message: '网关错误',
          type: 'error',
          duration: 2 * 1000
        }); break
        case 503: Message({
          message: '服务不可用',
          type: 'error',
          duration: 2 * 1000
        }); break
        case 504: Message({
          message: '网关超时',
          type: 'error',
          duration: 2 * 1000
        }); break
        case 505: Message({
          message: 'HTTP版本不受支持',
          type: 'error',
          duration: 2 * 1000
        }); break
        default: break
      }
    }
    return Promise.reject(error)
  }
)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
