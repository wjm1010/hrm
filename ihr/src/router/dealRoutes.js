import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export function detailRoute(json) {
  try {
    const { path, component, hidden = false, title, icon = 'from', children = [], name, count = '', noCache = true, ...params } = json
    const _component = component ? deailOneComponentRouter(component, path) : Layout
    const res = {
      name: name || path,
      path,
      component: _component,
      hidden: +hidden,
      children,
      count,
      meta: {
        keepAlive: !+noCache,
        title,
        icon,
        noCache,
        ...params
      }
    }
    if (children && children.length) {
      res.children = children.map(t => detailRoute(t))
    }
    return res
  } catch (e) {
    localStorage.clear()
    sessionStorage.clear()
  }
}

export function detailAllRoute(routes) {
  return routes.map(t => detailRoute(t))
}

// 如果是候选人用require方式并且要深拷贝动态改变name值，不然keeplive不起作用
function deailOneComponentRouter(component, path) {
  if (component === 'nominee/index') {
    let oneComponentRouter = require('@/views/' + component + '.vue').default
    oneComponentRouter = deepCopy(oneComponentRouter)
    oneComponentRouter.name = path
    return oneComponentRouter
  }
  return _import(component)
}

function deepCopy(obj) {
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]) // 递归复制
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}
