import Vue from 'vue'
import App from './App'
import './css/common.scss'

Vue.config.productionTip = false
App.mpType = 'app'

//引入store
import store from './store/index'
//把store挂载到全局
Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()

// 这个是我们约定的额外的配置
export default {
  config: {
    usingComponents: {
      'i-card': '../../../static/iview/card/index'
    }
  }
}
