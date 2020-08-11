/**
* 获取当前时间
* @return {[type]} 年月日
*/
export function getNowFormatDate() {
  const date = new Date()
  const seperator1 = '.'
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  const currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}

/**
* 获取计算后的时间
* @param  {[type]} time 从此时间开始算
* @param  {[type]} day  天数
* @return {[type]}      [description]
*/
export function getComputFormatDate(time, day) {
  const lodalTimestamp = +new Date(time)
  const resTimestamp = lodalTimestamp + (day * 86400000)
  const seperator1 = '.'
  const year = new Date(resTimestamp).getFullYear()
  let month = new Date(resTimestamp).getMonth() + 1
  let strDate = new Date(resTimestamp).getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  const currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
