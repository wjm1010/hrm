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
import EventBus from './eventBus'
import FullCalendar from 'vue-full-calendar'
import '@/directive/stretch.js'
import 'core-js/modules/es7.promise.finally'

import { watch } from '../config/default'
import Performance from 'web-report'

// import FullCalendar from 'vue-full-calendar'
// import 'fullcalendar/dist/fullcalendar.css'
// import 'fullcalendar/dist/locale/zh-cn'
// import eventMixin from './utils/eventMixin'
// Vue.use(FullCalendar)
Vue.use(EventBus)
Vue.use(FullCalendar)
Vue.prototype.$http = http
Vue.prototype.postMessages = postMessages
Vue.prototype.db = DB
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Vue.use(eventMixin)

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

Vue.config.productionTip = true
Vue.config.devtools = true
Vue.config.debug = true

const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
window.App = app
window._ISCATCHE_ = true
