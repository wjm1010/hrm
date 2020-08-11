import { detailRoute } from '@/router/dealRoutes'
import { getToken } from '@/utils/auth' // getToken from cookie
import store from '@/store'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(VueRouter)
/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
// 默认菜单
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  // router-auto不能删除
  { path: '*', redirect: '/404', hidden: true }
]

function routesRes() {
  if (getToken('routes')) {
    const routes = JSON.parse(getToken('routes'))
    store.commit('SET_ROUTERS', routes)
    routes.forEach(t => {
      constantRouterMap.push(detailRoute(t))
    })
  }
  return constantRouterMap
}
export default new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: routesRes()
})
