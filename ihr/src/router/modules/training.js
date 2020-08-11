/* eslint-disable */
// 培训管理
export const training = {
  id: '8',
  path: '/training',
  title: 'training',
  icon: 'book',
  children: [{
    id: '8-1',
    path: 'attendance',
    component: 'training/attendance',
    title: 'attendance',
    icon: 'form'
  }, {
    id: '8-2',
    path: 'trainingSession',
    component: 'training/trainingSession',
    title: 'trainingSession',
    icon: 'form'
  }, {
    id: '8-3',
    path: 'subcultures',
    component: 'training/subcultures',
    title: 'subcultures',
    icon: 'form'
  }]
}
