import '@/styles/index.sass' // global css
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import http from './utils/request'
import postMessages from './utils/postMessage'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import * as filters from './filters' // global filters
import DB from '@/utils/db/db'
import '@/mixins/globalRouterCache.js'
import EventBus from './eventBus'
import '@/directive/drag.js'
import 'core-js/modules/es7.promise.finally'

import { watch } from '../config/default'
import Performance from 'web-report'

Vue.use(EventBus)

Vue.prototype.$http = http
Vue.prototype.postMessages = postMessages
Vue.prototype.db = DB

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Vue.use(eventMixin)

Vue.config.productionTip = false
Vue.config.debug = true
Vue.config.devtools = true

// 前端监控
try {
  watch.report.map((item, index) => {
    if (window.location.host === item.name) {
      Performance({
        domain: watch.reportUrl,
        add: { appId: item.appId }
      })
    }
  })
} catch (error) {
  console.log(error)
}

const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
window.App = app
