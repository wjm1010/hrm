import request from '@/utils/request'
import { getToken, setToken } from '@/utils/auth'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'passport_login',
    method: 'post',
    data
  })
}

export function ssoLogin(data) {
  return request({
    url: 'sso_login',
    method: 'post',
    data
  })
}

export function ssoUser(token) {
  return request({
    url: 'sso_user',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: 'passport_logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'user_info',
    method: 'get',
    params: { token }
  })
}

export function clearVuex(commit) {
  commit('SET_TOKEN', '')
  commit('SET_NAME', '')
  commit('SET_BINDPHONE', '')
  commit('SET_ISBIND', '')
  commit('SET_PHONE', '')
  commit('SET_USERID', '')
  commit('SET_DEPARTMENTID', '')
  commit('SET_ROLEID', '')
  commit('SET_ROLECODE', '')
  commit('SET_PASSWORDSTATE', '')
  commit('SET_CANUSESPEECH', '')
  commit('SET_PHONESTATUSOBJ', {})
  const remember_user = getToken('remember_user')
  const CALL_TALK_MESSAGE = localStorage.getItem('CALL_TALK_MESSAGE')
  localStorage.clear()
  remember_user && setToken('remember_user', remember_user)
  CALL_TALK_MESSAGE && localStorage.setItem('CALL_TALK_MESSAGE', CALL_TALK_MESSAGE)
}

