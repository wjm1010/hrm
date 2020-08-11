import request from '@/utils/request'

export function loginByUsername(username, password, imageCode) {
  const data = {
    username,
    password,
    imageCode
  }
  return request({
    url: 'passport_login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'passport_logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'user_info',
    method: 'get',
    params: { token }
  })
}
