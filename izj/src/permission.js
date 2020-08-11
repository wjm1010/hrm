import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'
NProgress.configure({ showSpinner: false })// NProgress Configuration

const { Message } = ELEMENT
// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect', '/forgotPwd']// no redirect whitelist
const whiteListDetail = ['/roster/lessonplanorderCreate', '/roster/contractCreate'] // 沟通详情白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            try {
              if (whiteListDetail.some(t => to.path.includes(t))) {
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                return
              }
              const userinfo = getUserInfoByCallPhone()
              if (userinfo && userinfo.unFinishCallStudentIntentionId) {
                next({ path: `/roster/detail/${userinfo.unFinishCallStudentIntentionId}`, replace: true })
              } else {
                throw new Error('noId')
              }
            } catch (e) {
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            }
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('Verification failed, please login again')
            next({ path: '/login' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          if (!to.path.includes('roster/detail')) {
            return next()
          }

          const userinfo = getUserInfoByCallPhone()
          if (userinfo && userinfo.unFinishCallStudentIntentionId && (userinfo.unFinishCallStudentIntentionId !== to.params.rosterId)) {
            window.App.$message.error(`您刚才对${userinfo.studentName}（${userinfo.studentNo}）的电话还未添加沟通记录，请填写并保存沟通记录后再继续其它操作`)
            NProgress.done()
            next(false)
          } else {
            next()
          }
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
