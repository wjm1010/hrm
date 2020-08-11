import { isMobile } from '../../storeApi/utils'

const app = {
  state: {
    sidebar: {
      opened: !isMobile()
    },
    isPageChange: false,
    language: 'zh'
  },
  mutations: {
    PAGE_CHANGE: state => {
      state.isPageChange = !state.isPageChange
    },
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    }
  }
}

export default app
