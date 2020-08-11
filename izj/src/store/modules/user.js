import { loginByUsername, logout, getUserInfo, clearVuex } from '@/storeApi/login'
import { getToken, setToken } from '@/utils/auth'
import { isMobile } from '../../storeApi/utils'

const user = {
  state: {
    token: getToken(),
    xToken: getToken('auth_x'),
    name: '',
    bindPhone: getToken('bindPhone'), // 绑定的座机或者手机号
    isBind: getToken('isBind'), // 判断是否弹出框 填写座机或者手机号
    sex: '',
    phone: '',
    userId: '',
    roleId: '',
    rosterId: '',
    departmentId: '',
    callStatus: getToken('callstatus'),
    passwordState: getToken('passwordState'),
    visitGetTotal: getToken('visitGetTotal') ? JSON.parse(getToken('visitGetTotal')) : {},
    roleCode: '',
    avatar: '',
    introduction: '',
    roles: [],
    isMobile: isMobile()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_BINDPHONE: (state, bindPhone) => {
      state.bindPhone = bindPhone
    },
    SET_ISBIND: (state, isBind) => {
      state.isBind = isBind
    },
    SET_SEX: (state, sex) => {
      state.sex = sex
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_USERID: (state, userId) => {
      state.userId = userId.toString()
    },
    SET_ROSTERID: (state, rosterId) => {
      state.rosterId = rosterId.toString()
    },
    SET_DEPARTMENTID: (state, departmentId) => {
      state.departmentId = departmentId.toString()
    },
    SET_VISITGETTOTAL: (state, visitGetTotal) => {
      state.visitGetTotal = visitGetTotal
    },
    SET_PASSWORDSTATE: (state, passwordState) => {
      state.passwordState = passwordState
    },
    SET_CALLSTATUS: (state, callStatus) => {
      state.callStatus = callStatus
    },
    SET_ROLEID: (state, roleId) => {
      state.roleId = roleId.toString()
    },
    SET_ROLECODE: (state, roleCode) => {
      state.roleCode = roleCode
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          if (!response.data) {
            return reject(response)
          } else {
            const data = response.data
            commit('SET_TOKEN', data.access_token)
            commit('SET_CALLSTATUS', data.callStatus)
            commit('SET_BINDPHONE', response.data.bindPhone)
            commit('SET_ISBIND', response.data.isBind)
            commit('SET_PASSWORDSTATE', data.sessionUser.passwordState)
            setToken('user_info', JSON.stringify(data))
            setToken('callstatus', response.data.callStatus)
            setToken('bindPhone', response.data.bindPhone ? response.data.bindPhone : '')
            setToken('isBind', response.data.isBind ? response.data.isBind : '')
            setToken('access_token', response.data.access_token)
            setToken('auth_x', response.data.b_token)
            setToken('passwordState', data.sessionUser.passwordState)
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise(resolve => {
        //
        const response = {
          data: {
            name: 'Super Admin',
            roles: ['admin'],
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          }
        }
        // const data = response.data
        const userInfo = getToken('user_info')
        if (userInfo) {
          const userInfoObj = JSON.parse(userInfo)
          commit('SET_NAME', userInfoObj.sessionUser.name)
          commit('SET_SEX', userInfoObj.sessionUser.sex)
          commit('SET_PHONE', userInfoObj.sessionUser.phone)
          commit('SET_USERID', userInfoObj.sessionUser.userId)
          commit('SET_DEPARTMENTID', userInfoObj.sessionUser.role.departmentId)
          commit('SET_ROLEID', userInfoObj.sessionUser.role.roleId)
          commit('SET_ROLECODE', userInfoObj.sessionUser.role.roleCode)
        }
        commit('SET_ROLES', ['admin'])
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_INTRODUCTION', '我是超级管理员')
        resolve(response)
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          clearVuex(commit)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        clearVuex(commit)
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    },

    // 设置rosterId
    setRosterId({ commit }, id) {
      commit('SET_ROSTERID', id)
    },

    setVisitGetTotal({ commit }, info) {
      setToken('visitGetTotal', JSON.stringify(info))
      commit('SET_VISITGETTOTAL', info)
    }
  }
}

export default user
