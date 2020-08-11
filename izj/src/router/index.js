
// import store from '@/store'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

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
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
// 默认菜单
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/forgotPwd', component: _import('forgotPwd/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    // hidden: store.getters.roles[0] !== 'ZJ-ZY',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      // meta: { title: 'dashboard', icon: 'dashboard', noCache: true, roles: ['ZJ-JL'] }
      meta: { title: 'dashboard', icon: 'dashboard' }
    }]
  }
]

export default new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
// 无角色菜单列表（普通组员菜单)
export const asyncRouterMap = [
  {
    path: '/lessonList',
    component: Layout,
    redirect: 'closedWarningindex',
    hidden: false,
    name: 'closedWarnings',
    meta: {
      title: 'lessonList',
      icon: 'component'
    },
    children: [{
      path: 'closedWarningindex',
      component: _import('closedWarning/index'),
      name: 'closedWarningindex',
      meta: { title: 'closedWarningindex', icon: 'documentation' }
    },
    {
      path: 'lessonWarningindex',
      component: _import('lessonWarning/index'),
      name: 'lessonWarningindex',
      meta: { title: 'lessonWarningindex', icon: 'documentation' }
    },
    {
      path: 'closedindex',
      component: _import('closed/index'),
      name: 'closedindex',
      meta: { title: 'closedindex', icon: 'documentation' }
    },
    {
      path: 'lessonindex',
      component: _import('lesson/index'),
      name: 'lessonindex',
      meta: { title: 'lessonindex', icon: 'documentation' }
    }
    ]
  },
  {
    path: '/lessonPlanManage',
    component: Layout,
    redirect: 'record',
    hidden: false,
    meta: {
      title: 'lessonPlanManage',
      icon: 'component'
    },
    children: [
      {
        path: 'lessonplan',
        component: _import('lessonplan/teacher'),
        name: 'lessonplanteacher',
        meta: { title: 'lessonplanteacher', icon: 'people', roles: ['ZJ-JL', 'ZJ-ZZ'] }
      },
      {
        path: 'record',
        component: _import('lessonplan/record'),
        name: 'lessonplanrecord',
        meta: { title: 'lessonplanrecord', icon: 'message' }
      },
      {
        path: 'list',
        component: _import('contract/list'),
        name: 'contractlist',
        meta: { title: 'contractlist', icon: 'star' }
      },
      {
        path: 'restPeriod',
        component: _import('teachAssistant/restPeriod'),
        name: 'teachAssistantrestPeriod',
        meta: { title: 'teachAssistantrestPeriod', icon: 'star' }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: 'index',
    hidden: false,
    children: [{
      path: 'index',
      component: _import('student/index'),
      name: 'studentindex',
      meta: { title: 'studentindex', icon: 'form' }
    }]
  },
  {
    path: '/lessonplanorder',
    component: Layout,
    redirect: 'list',
    hidden: false,
    meta: {
      title: 'lessonplanorder',
      icon: 'component'
    },
    children: [
      {
        path: 'list',
        component: _import('lessonplanorder/list'),
        name: 'lessonplanorderlist',
        meta: { title: 'lessonplanorderlist', icon: 'example' }
      },
      {
        path: 'formal',
        component: _import('lessonplanorder/formal'),
        name: 'lessonPlanManageformal',
        meta: { title: 'lessonPlanManageformal', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/performance',
    component: Layout,
    redirect: 'list',
    hidden: true,
    children: [{
      path: 'list',
      component: _import('performance/list'),
      name: 'performancelist',
      meta: { title: 'performancelist', icon: 'form' }
    }]
  },
  {
    path: '/roster',
    component: Layout,
    redirect: 'detail',
    hidden: true,
    children: [{
      path: 'detail/:rosterId',
      component: _import('roster/detail'),
      name: 'rosterdetail',
      meta: { title: 'rosterdetail', icon: 'form', noCache: true }
    },
    {
      path: 'manage',
      component: _import('roster/manage'),
      name: 'rostermanage',
      meta: { title: 'rostermanage', icon: 'form' }
    },
    {
      path: 'majorreport/:rosterId/:studentId',
      component: _import('roster/majorreport'),
      name: 'rostermajorreport',
      meta: { title: 'rostermajorreport', icon: 'form' }
    },
    {
      path: 'lessonplanorderCreate/:rosterId',
      component: _import('roster/lessonplanorderCreate'),
      name: 'rosterlessonplanorderCreate',
      meta: { title: 'rosterlessonplanorderCreate', icon: 'form' }
    },
    {
      path: 'contractCreate/:rosterId',
      component: _import('roster/contractCreate'),
      name: 'rostercontractCreate',
      meta: { title: 'rostercontractCreate', icon: 'form' }
    },
    {
      path: 'signup/:studentId',
      component: _import('roster/signup'),
      name: 'rostersignup',
      meta: { title: 'rostersignup', icon: 'form' }
    },
    {
      path: 'material/:rosterId',
      component: _import('roster/material'),
      name: 'rostermaterial',
      meta: { title: 'rostermaterial', icon: 'form' }
    }]
  },
  {
    path: '/contract',
    component: Layout,
    redirect: 'detail',
    hidden: true,
    children: [
      {
        path: 'detail/check/:contractId',
        component: _import('contract/check'),
        name: 'check',
        meta: { title: 'check', icon: 'form' }
      },
      {
        path: 'detail/:rosterId',
        component: _import('contract/detail'),
        name: 'contractdetail',
        meta: { title: 'contractdetail', icon: 'form' }
      }]
  },
  {
    path: '/learningsituation',
    component: Layout,
    redirect: 'history',
    hidden: true,
    children: [{
      path: 'history/:rosterId',
      component: _import('learningsituation/history'),
      name: 'learningsituationhistory',
      meta: { title: 'learningsituationhistory', icon: 'form' }
    }]
  },
  {
    path: '/report',
    component: Layout,
    redirect: 'callrecordlist',
    hidden: true,
    children: [{
      path: 'callrecordlist/:rosterId/:studentId',
      component: _import('report/callrecordlist'),
      name: 'reportcallrecordlist',
      meta: { title: 'reportcallrecordlist', icon: 'form' }
    }]
  },
  {
    path: '/lessonplanorder',
    component: Layout,
    redirect: 'list_student',
    hidden: true,
    children: [{
      path: 'list_student/:rosterId',
      component: _import('lessonplanorder/list_student'),
      name: 'lessonplanorderlist_student',
      meta: { title: 'lessonplanorderlist_student', icon: 'form' }
    }]
  },
  {
    path: '/lessonplan',
    component: Layout,
    redirect: 'manage',
    hidden: true,
    children: [{
      path: 'manage/:studentId/:studentName',
      component: _import('lessonplan/manage'),
      name: 'lessonplanmanage',
      meta: { title: 'lessonplanmanage', icon: 'form' }
    },
    {
      path: 'manageReadonly/:teacher_id/:name',
      component: _import('lessonplan/lessonteacher'),
      name: 'lessonteacher',
      meta: { title: 'lessonteacher', icon: 'form' }
    }]
  },
  {
    path: '/newLesson',
    component: Layout,
    hidden: true,
    children: [{
      path: 'add',
      component: _import('newLesson/index'),
      name: 'newLessonAdd',
      meta: { title: 'newLessonAdd', icon: 'people' }
    }, {
      path: 'edit/:strategyId',
      component: _import('newLesson/index'),
      name: 'newLessonEdit',
      meta: { title: 'newLessonEdit', icon: 'people', noCache: true }
    }]
  },
  {
    path: '/expandLesson',
    component: Layout,
    hidden: true,
    children: [{
      path: 'add',
      component: _import('expandLesson/index'),
      name: 'expandLessonAdd',
      meta: { title: 'expandLessonAdd', icon: 'people' }
    }, {
      path: 'edit/:strategyId',
      component: _import('expandLesson/index'),
      name: 'expandLessonEdit',
      meta: { title: 'expandLessonEdit', icon: 'people', noCache: true }
    }]
  },
  {
    path: '/personalInfo',
    component: Layout,
    redirect: 'index',
    hidden: true,
    children: [{
      path: 'index',
      component: _import('personalInfo/index'),
      name: 'personalInfoindex',
      meta: { title: 'personalInfoindex', icon: 'form' }
    }]
  },
  {
    path: '/lessonplanDetails',
    component: Layout,
    redirect: 'policyDetails',
    hidden: true,
    children: [
      {
        path: 'policyDetails',
        component: _import('lessonplanDetails/policyDetails'),
        name: 'lessonplanDetailspolicyDetails',
        meta: { title: 'lessonplanDetailspolicyDetails', icon: 'form', noCache: true }
      },
      {
        path: 'teacherSchedule/:teacherId',
        component: _import('lessonplanDetails/teacherSchedule'),
        name: 'lessonplanDetailsteacherSchedule',
        meta: { title: 'lessonplanDetailsteacherSchedule', icon: 'form' }
      }, {
        path: 'unorderDetails',
        component: _import('lessonplanDetails/unorderDetails'),
        name: 'lessonplanDetailsunorderDetails',
        meta: { title: 'lessonplanDetailsunorderDetails', icon: 'form', noCache: true }
      }]
  },

  {
    path: '/callManagement',
    component: Layout,
    redirect: 'generalTime',
    hidden: false,
    meta: {
      title: 'callManagement',
      icon: 'example'
    },
    children: [
      {
        path: 'generalTime',
        component: _import('callManagement/generalTime'),
        name: 'callManagementgeneralTime',
        meta: { title: 'callManagementgeneralTime', icon: 'form' }
      },
      {
        path: 'callRecording',
        component: _import('callManagement/callRecording'),
        name: 'callManagementcallRecording',
        meta: { title: 'callManagementcallRecording', icon: 'star' }
      }
    ]
  },
  {
    path: '/study',
    component: Layout,
    redirect: 'homework',
    hidden: false,
    children: [{
      path: 'homework/:studentIntentionId',
      component: _import('study/homework'),
      name: 'studyhomework',
      meta: { title: 'studyhomework' }
    }, {
      path: 'feedback/:studentIntentionId',
      component: _import('study/feedback'),
      name: 'studyfeedback',
      meta: { title: 'studyfeedback' }
    }, {
      path: 'stageFeedback/:studentIntentionId',
      component: _import('study/stageFeedback'),
      name: 'stageFeedback',
      meta: { title: 'stageFeedback' }
    }]
  },
  {
    path: '/schoolSituation',
    component: Layout,
    redirect: 'index',
    hidden: true,
    children: [
      {
        path: 'index/:schoolId',
        component: _import('schoolSituation/index'),
        name: 'schoolSituationIndex',
        meta: { title: 'schoolSituationIndex', icon: 'form' }
      },
      {
        path: 'examination/:rosterId',
        component: _import('schoolSituation/examination'),
        name: 'examination',
        meta: { title: 'examination', icon: 'form' }
      }
    ]
  },
  {
    path: '/knowledge',
    component: Layout,
    redirect: 'index',
    children: [{
      path: 'index',
      component: _import('knowledge/index'),
      name: 'knowledge',
      meta: { title: 'knowledge', icon: 'search' }
    }]
  },
  // router-auto不能删除
  { path: '*', redirect: '/404', hidden: true }
]
// 组长角色的路由
export const asyncRouterMap_ZZ = []
// 经理角色的路由
export const asyncRouterMap_JL = [

]

