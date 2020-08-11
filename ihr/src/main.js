import '@/styles/index.sass' // global css
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import http from './utils/request'
import cloneParams from './utils/cloneParams'
import postMessages from './utils/postMessage'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import * as filters from './filters' // global filters
import DB from '@/utils/db/db'
import '@/components'
import '@/router/dealRoutes'
import eventBus from '@/utils/eventbus'

require('promise.prototype.finally').shim()
require('es6-promise').polyfill()
Vue.prototype.$eventBus = eventBus
Vue.prototype.$http = http
Vue.prototype.$cloneParams = cloneParams
Vue.prototype.postMessages = postMessages
Vue.prototype.db = DB
// register global utility filtersdf.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
  Vue.config.debug = true
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.store = store
  }
  window.log = console.log
}
Vue.config.productionTip = false
Vue.config.debug = true
Vue.config.devtools = true

const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
window.App = app
