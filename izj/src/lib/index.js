export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deleteEmptyProperty(object, url) {
  for (var i in object) {
    let value = object[i]
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          delete object[i]
          continue
        }
      }
      deleteEmptyProperty(value)
      if (isEmpty(value)) {
        delete object[i]
      }
    } else {
      if (value === '' || value === null || value === undefined) {
        delete object[i]
      } else {
        if (value.constructor === String) {
          value = value.replace(/(^\s*)|(\s*$)/g, '')
        }
      }
    }
  }
}

export function isEmpty(object) {
  for (var name in object) {
    return false
  }
  return true
}
