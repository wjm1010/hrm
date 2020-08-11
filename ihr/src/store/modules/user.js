import { loginByUsername, logout, getUserInfo } from '@/storeApi/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isMobile } from '../../storeApi/utils'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    xToken: getToken('auth_x'),
    name: '',
    phone: '',
    userId: '',
    userRole: '',
    userLevel: '',
    userMail: '',
    userChangePwd: '',
    oprate: '',
    avatar: '',
    introduction: '',
    roles: [],
    user_info: {},
    isMobile: isMobile(),
    channelUpdate: getToken('SET_CHANNEL_Update') ? getToken('SET_CHANNEL_Update') : 0,
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CHANNEL_Update: (state, data) => {
      state.channelUpdate = data
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERROLE: (state, userRole) => {
      state.userRole = userRole
    },
    SET_USERLEVEL: (state, userLevel) => {
      state.userLevel = userLevel
    },
    SET_OPRATE: (state, oprate) => {
      state.oprate = oprate
    },
    SET_USERMAIL: (state, userMail) => {
      state.userMail = userMail
    },
    SET_USERCHANGEPWD: (state, userChangePwd) => {
      state.userChangePwd = userChangePwd
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_INFO: (state, data) => {
      state.user_info = data
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password, userInfo.imageCode).then(response => {
          if (!response.data) {
            reject(response)
          } else {
            const data = response.data
            commit('SET_TOKEN', data.access_token)
            commit('SET_CHANNEL_Update', data.channelUpdate)
            setToken('SET_CHANNEL_Update', data.channelUpdate)
            commit('SET_USER_INFO', data)
            if (process.env.NODE_ENV === 'development' && process.env.ENV_CONFIG === 'hard') {
              // 走本地路由
              const routes = Object.values(require('@/router/modules'))
              commit('SET_ROUTERS', routes)
              setToken('routes', JSON.stringify(routes))
            } else {
              commit('SET_ROUTERS', data.menuList)
              setToken('routes', JSON.stringify(data.menuList))
            }
            setToken('user_info', JSON.stringify(data))
            setToken('access_token', response.data.access_token)
            setToken('auth_x', response.data.b_token)
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
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
          commit('SET_NAME', userInfoObj.userName)
          commit('SET_PHONE', userInfoObj.userPhone)
          commit('SET_USERID', userInfoObj.userId)
          commit('SET_USERROLE', userInfoObj.userRole)
          commit('SET_USERLEVEL', userInfoObj.userLevel)
          commit('SET_OPRATE', userInfoObj.oprate)
          commit('SET_USERMAIL', userInfoObj.userMail)
          commit('SET_USERCHANGEPWD', userInfoObj.userChangePwd)
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
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USERROLE', '')
          commit('SET_USERID', '')
          commit('SET_USERLEVEL', '')
          commit('SET_USERCHANGEPWD', '')
          commit('SET_OPRATE', '')
          commit('SET_NAME', '')
          removeToken()
          localStorage.clear()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_PHONE', '')
        commit('SET_USERID', '')
        commit('SET_USERROLE', '')
        commit('SET_USERLEVEL', '')
        commit('SET_OPRATE', '')
        commit('SET_USERMAIL', '')
        commit('SET_USERCHANGEPWD', '')
        removeToken()
        localStorage.clear()
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
    }
  }
}

export default user
