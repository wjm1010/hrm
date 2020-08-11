import { getRckOption, getSecondChannel, getSecondDirectOption, getResume2Option, getPhone } from '@/storeApi/utils'
const options = {
  state: {
    rckoptions: {},
    secondaryChannel: {},
    secondDirectOption: {},
    resume2Option: {},
    checkPhone: ''
  },
  mutations: {
    SET_RCKOPTION: (state, info) => {
      state.rckoptions = info
    },
    SET_SECONDCHANNEL: (state, info) => {
      state.secondaryChannel = info
    },
    SET_SECONDIRECT: (state, info) => {
      state.secondDirectOption = info
    },
    SET_RESUME2OPTION: (state, info) => {
      state.resume2Option = info
    },
    SET_PHONE: (state, info) => {
      state.checkPhone = info
    }
  },
  actions: {
    lookOption({ commit }) {
      return getRckOption().then(res => {
        if (res.data) {
          commit('SET_RCKOPTION', res.data)
        }
      }).catch(console.log)
    },
    lookSecondChannel({ commit }, data) {
      return getSecondChannel(data).then(res => {
        if (res.data) {
          commit('SET_SECONDCHANNEL', res.data.secondChannel)
        }
      }).catch(console.log)
    },
    lookSecondDirectOption({ commit }, data) {
      return getSecondDirectOption(data).then(res => {
        if (res.data) {
          commit('SET_SECONDIRECT', res.data.directList)
        }
      }).catch(console.log)
    },
    lookResume2Option({ commit }) {
      return getResume2Option().then(res => {
        if (res.data) {
          commit('SET_RESUME2OPTION', res.data)
        }
      }).catch(console.log)
    },
    lookPhone({ commit }, data) {
      return getPhone(data).then(res => {
        if (res.data) {
          commit('SET_PHONE', res.data.resumePhone)
        }
      }).catch(console.log)
    }
  }
}

export default options
