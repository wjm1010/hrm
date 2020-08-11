import router from '@/router'
import { detailAllRoute } from '@/router/dealRoutes'

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      if (router) {
        router.addRoutes(detailAllRoute(routers))
      }
      state.addRouters = routers
      state.routers = routers
    }

  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        resolve()
      })
    }
  }
}

export default permission
