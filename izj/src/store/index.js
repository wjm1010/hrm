import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'
import utils from './modules/utils'
import phoneLog from './modules/phoneLog'
import lessonplanorder from './modules/lessonplanorder'

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    utils,
    phoneLog,
    lessonplanorder
  },
  getters
})

export default store
