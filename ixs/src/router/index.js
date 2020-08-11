const _import = require('./_import_' + process.env.NODE_ENV)

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
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }, {
      path: 'dashboard/assistant',
      component: _import('dashboard/assistant'),
      name: 'assistant',
      meta: { title: 'assistant', icon: 'dashboard' }
    }, {
      path: 'dashboard/repeatStudent',
      component: _import('dashboard/repeatStudent'),
      name: 'repeatStudent',
      meta: { title: 'repeatStudent', icon: 'dashboard' }
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
    path: '/tasklist',
    component: Layout,
    hidden: false,
    meta: { title: 'tasklist', icon: 'component' },
    children: [{
      path: 'index',
      component: _import('tasklist/index'),
      name: 'tasklistIndex',
      meta: { title: 'tasklist', icon: 'component', noCache: true }
    }]
  },
  {
    path: '/tasks',
    component: Layout,
    hidden: false,
    meta: { title: 'tasks', icon: 'component' },
    children: [{
      path: 'priorityTasks',
      component: _import('tasks/priorityTasks'),
      name: 'priorityTasks',
      meta: { title: 'priorityTasks', icon: 'documentation' }
    }, {
      path: 'newTasks',
      component: _import('tasks/newTasks'),
      name: 'newTasks',
      meta: { title: 'newTasks', icon: 'documentation' }
    }, {
      path: 'notContactedTasks',
      component: _import('tasks/notContactedTasks'),
      name: 'notContactedTasks',
      meta: { title: 'notContactedTasks', icon: 'documentation' }
    }, {
      path: 'followingUpTasks',
      component: _import('tasks/followingUpTasks'),
      name: 'followingUpTasks',
      meta: { title: 'followingUpTasks', icon: 'documentation' }
    }]
  },
  {
    path: '/audition',
    component: Layout,
    hideden: false,
    meta: { title: 'audition', icon: 'component' },
    children: [{
      path: 'sendLesson',
      component: _import('audition/sendLesson'),
      name: 'sendLesson',
      meta: { title: 'sendLesson', icon: 'documentation' }
    }, {
      path: 'rejectLesson',
      component: _import('audition/rejectLesson'),
      name: 'rejectLesson',
      meta: { title: 'rejectLesson', icon: 'documentation' }
    }, {
      path: 'waitCommunicated',
      component: _import('audition/waitCommunicated'),
      name: 'waitCommunicated',
      meta: { title: 'waitCommunicated', icon: 'documentation' }
    }, {
      path: 'waitFeedback',
      component: _import('audition/waitFeedback'),
      name: 'waitFeedback',
      meta: { title: 'waitFeedback', icon: 'documentation' }
    }, {
      path: 'feedbacking',
      component: _import('audition/feedbacking'),
      name: 'feedbacking',
      meta: { title: 'feedbacking', icon: 'documentation' }
    }, {
      path: 'cancelled',
      component: _import('audition/cancelled'),
      name: 'cancelled',
      meta: { title: 'cancelled', icon: 'documentation' }
    }]
  },
  {
    path: '/roster',
    component: Layout,
    redirect: 'detail',
    hidden: true,
    children: [
      {
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
        path: 'material/:rosterId/:judge',
        component: _import('roster/material'),
        name: 'rostermaterial',
        meta: { title: 'rostermaterial', icon: 'form' }
      },
      {
        path: 'knowledge',
        component: _import('roster/knowledge'),
        name: 'rosterknowledge',
        meta: { title: 'rosterknowledge', icon: 'form' }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: 'detail',
    hidden: true,
    children: [
      {
        path: 'detail/:rosterId',
        component: _import('student/detail'),
        name: 'studentdetail',
        meta: { title: 'studentdetail', icon: 'form', noCache: true }
      },
      {
        path: 'manage',
        component: _import('student/manage'),
        name: 'rostermanage',
        meta: { title: 'rostermanage', icon: 'form' }
      },
      {
        path: 'majorreport/:rosterId/:studentId',
        component: _import('student/majorreport'),
        name: 'rostermajorreport',
        meta: { title: 'rostermajorreport', icon: 'form' }
      },
      {
        path: 'lessonplanorderCreate/:rosterId',
        component: _import('student/lessonplanorderCreate'),
        name: 'studentlessonplanorderCreate',
        meta: { title: 'studentlessonplanorderCreate', icon: 'form' }
      },
      {
        path: 'contractCreate/:rosterId',
        component: _import('student/contractCreate'),
        name: 'studentcontractCreate',
        meta: { title: 'studentcontractCreate', icon: 'form' }
      },
      {
        path: 'signup/:studentId',
        component: _import('student/signup'),
        name: 'studentsignup',
        meta: { title: 'studentsignup', icon: 'form' }
      },
      {
        path: 'material/:rosterId/:judge',
        component: _import('student/material'),
        name: 'studentmaterial',
        meta: { title: 'studentmaterial', icon: 'form' }
      }
    ]
  },
  {
    path: '/contract',
    component: Layout,
    hidden: false,
    meta: { title: 'contract', icon: 'form' },
    children: [{
      path: 'contractIng',
      component: _import('contract/contractIng'),
      name: 'contractIng',
      meta: { title: 'contractIng', icon: 'form' }
    }]
  },
  {
    path: '/management',
    component: Layout,
    redirect: 'roster',
    hidden: false,
    children: [{
      path: 'roster',
      component: _import('management/roster'),
      name: 'managementRoster',
      meta: { title: 'managementRoster', icon: 'example', roles: ['XS-JL', 'XS-ZZ'] }
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
        component: _import('roster/contractCheck'),
        name: 'check',
        meta: { title: 'check', icon: 'form' }
      }, {
        path: 'detail/:rosterId',
        component: _import('contract/detail'),
        name: 'contractdetail',
        meta: { title: 'contractdetail', icon: 'form' }
      }]
  },
  {
    path: '/contract',
    component: Layout,
    redirect: 'student_List',
    hidden: true,
    children: [{
      path: 'student_list/:rosterId',
      component: _import('contract/list'),
      name: 'contractstudent_List',
      meta: { title: 'contractStudentList', icon: 'form' }
    }
    ]
  },
  {
    path: '/lessonplanorder',
    component: Layout,
    redirect: 'list_student',
    hidden: true,
    children: [{
      path: 'list/:rosterId',
      component: _import('lessonplanorder/list'),
      name: 'list',
      meta: { title: 'lessonplanorderList', icon: 'form' }
    }, {
      path: 'list_student/:rosterId',
      component: _import('lessonplanorder/list_student'),
      name: 'lessonplanorderlist_student',
      meta: { title: 'lessonplanorderlist_student', icon: 'form' }
    },
    {
      path: 'editPage',
      component: _import('lessonplanorder/editPage'),
      name: 'lessonplanordereditPage',
      meta: { title: 'lessonplanordereditPage', icon: 'form' }
    },
    {
      path: 'queryFeedback',
      component: _import('lessonplanorder/queryFeedback'),
      name: 'lessonplanorderqueryFeedback',
      meta: { title: 'lessonplanorderqueryFeedback', icon: 'form' }
    }
    ]
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
    }]
  },
  {
    path: '/lessonplan',
    component: Layout,
    redirect: 'teacher',
    hidden: true,
    children: [{
      path: 'teacher',
      component: _import('lessonplan/teacher'),
      name: 'lessonplanteacher',
      meta: { title: 'lessonplanteacher', icon: 'people', roles: ['ZJ-JL'] }
    }]
  },
  {
    path: '/lessonplan',
    component: Layout,
    redirect: 'manageReadonly',
    hidden: true,
    children: [{
      path: 'manageReadonly/:teacher_id/:name',
      component: _import('roster/manageReadonly'),
      name: 'manageReadonly',
      meta: { title: 'manageReadonly', icon: 'people' }
    }]
  },
  {
    path: '/personalInfo',
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      component: _import('personalInfo/index'),
      name: 'personalInfoindex',
      meta: { title: 'personalInfoindex', icon: 'form' }
    }]
  },
  {
    path: '/accessList',
    component: Layout,
    redirect: 'detail',
    hidden: true,
    children: [{
      path: 'detail',
      component: _import('accessList/detail'),
      name: 'accessListDetail',
      meta: { title: 'accessListDetail', icon: 'form', noCache: true }
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
    path: '/help',
    component: Layout,
    redirect: 'index',
    hidden: true,
    children: [{
      path: 'index',
      component: _import('help/index'),
      name: 'helpindex',
      meta: { title: 'helpindex', icon: 'form' }
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
    path: '/attend',
    component: Layout,
    redirect: 'index',
    hidden: true,
    children: [{
      path: 'index/:rosterId',
      component: _import('attend/index'),
      name: 'attend',
      meta: { title: 'attend' }
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

