/* eslint-disable */
// 渠道管理
export const trench = {
  id: '3',
  path: '/trench',
  title: 'trench',
  icon: 'example',
  children: [{
      id: '3-1',
      path: 'cooperation',
      component: 'trench/cooperation',
      title: 'cooperation',
      noCache: true
    },
    {
      id: '3-2',
      path: 'cooperation/stairAdd',
      component: 'trench/detail/cptLevelOne',
      title: 'cooperationStairAdd',
      hidden: true
    },
    {
      id: '3-3',
      path: 'cooperation/stairEdit/:userId',
      component: 'trench/detail/cptLevelOne',
      title: 'cooperationStairEdit',
      noCache: true,
      hidden: true
    },
    {
      id: '3-4',
      path: 'cooperation/accessAdd',
      component: 'trench/detail/cptLevelTwo',
      title: 'cooperationAccessAdd',
      hidden: true
    },
    {
      id: '3-5',
      path: 'cooperation/accessEdit/:userId',
      component: 'trench/detail/cptLevelTwo',
      title: 'cooperationAccessEdit',
      noCache: true,
      hidden: true
    },
    {
      id: '3-6',
      path: 'common',
      component: 'trench/common',
      title: 'common',
      noCache: true
    },
    {
      id: '3-7',
      path: 'commonSub/:channelId',
      component: 'trench/commonSub',
      title: 'commonSub',
      noCache: true,
      hidden: true
    },
    {
      id: '3-8',
      path: 'cooperationSub/:channelId',
      component: 'trench/cooperationSub',
      title: 'cooperationSub',
      noCache: true,
      hidden: true
    },
    {
      id: '3-9',
      path: 'notice',
      component: 'trench/notice',
      title: 'notice',
      noCache: true
    }
  ]
}
