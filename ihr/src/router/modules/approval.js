/* eslint-disable */
// 审批管理
export const approval = {
  id: '7',
  path: '/approval',
  title: 'approvaly',
  icon: 'book',
  children: [{
    id: '7-1',
    path: 'firstApproval',
    component: 'approval/firstApproval',
    title: 'firstApproval',
    icon: 'form'
  }, {
    id: '7-2',
    path: 'secondApproval',
    component: 'approval/secondApproval',
    title: 'secondApproval',
    icon: 'form'
  }]
}
