const lessonplanorder = {
  state: {
    studentBasicInfo: {},
    restClassContent: []
  },

  mutations: {
    SET_RESTCLASSCONTENT: (state, restClassContent) => {
      state.restClassContent = restClassContent
    },
    SET_STUDENTBASICINFO: (state, studentBasicInfo) => {
      state.studentBasicInfo = studentBasicInfo
    }
  },

  actions: {

    // 获取剩余课时
    setRestClassContent({ commit }, data) {
      commit('SET_RESTCLASSCONTENT', data)
    },

    // 设置学生信息
    setStudentBasicInfo({ commit }, info) {
      commit('SET_STUDENTBASICINFO', info)
    }
  }
}

export default lessonplanorder
