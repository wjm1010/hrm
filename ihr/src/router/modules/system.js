/* eslint-disable */
// 系统管理
export const system = {
  id: '1',
  path: '/system',
  title: 'system',
  icon: 'component',
  children: [{
      id: '1-1',
      path: 'permission',
      component: 'system/permission',
      title: 'permission',
      noCache: true
    },
    {
      id: '1-2',
      path: 'permission/add',
      component: 'system/detail/permissionIndex',
      title: 'permissionIndexAdd',
      hidden: true
    },
    {
      id: '1-3',
      path: 'permission/edit/:userId',
      component: 'system/detail/permissionIndex',
      title: 'permissionIndexEdit',
      noCache: true,
      hidden: true
    },
    {
      id: '1-4',
      path: 'workPlace',
      component: 'system/workPlace',
      title: 'workPlace'
    },
    {
      id: '1-5',
      path: 'teachGroup',
      component: 'system/teachGroup',
      title: 'teachGroup'
    },
    {
      id: '1-6',
      path: 'teachSection',
      component: 'system/teachSection',
      title: 'teachSection'
    },
    {
      id: '1-7',
      path: 'school',
      component: 'system/school',
      title: 'school'
    },
    {
      id: '1-8',
      path: 'tag',
      component: 'system/tag',
      title: 'tag'
    },
    
  ]
}
