import request from '@/utils/request'

export function getRckOption() {
  return request({
    url: 'auth_getResumeOption',
    method: 'post'
  })
} // 人才库下拉框删选

export function getSecondChannel(data) {
  return request({
    url: 'auth_getSecondChannel',
    method: 'post',
    data
  })
} // 二级渠道获取接口

export function getSecondDirectOption(data) {
  return request({
    url: 'auth_getSecondDirectOption',
    method: 'post',
    data
  })
} // 二级人员获取接口

export function getResume2Option() {
  return request({
    url: 'auth_getResume2Option',
    method: 'post'
  })
} // 候选人获取接口

export function getPhone(data) {
  return request({
    url: 'resume_getPhone',
    method: 'post', // 查看手机号
    data
  })
} // 候选人获取接口

export function isMobile() {
  if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
    if (window.location.href.indexOf('?mobile') < 0) {
      try {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          return true
        } else if (/iPad/i.test(navigator.userAgent)) {
          return true
        } else {
          return true
        }
      } catch (e) {
        console.log('判断错误')
      }
    }
  }
  return false
}
