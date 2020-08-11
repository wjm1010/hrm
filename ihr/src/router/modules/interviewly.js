/* eslint-disable */
// 面试管理
export const interviewly = {
  id: '6',
  path: '/interviewly',
  title: 'interviewly',
  icon: 'book',
  children: [{
    id: '6-1',
    path: 'evaluation',
    component: 'interviewly/evaluation/index',
    title: 'evaluation',
    icon: 'form'
  }, {
    id: '6-2',
    path: 'fullTime',
    component: 'interviewly/evaluation/fullTime',
    hidden: true,
    title: 'fullTime',
    icon: 'form'
  }, {
    id: '6-3',
    path: 'partTime',
    component: 'interviewly/evaluation/partTime',
    hidden: true,
    title: 'partTime',
    icon: 'form'
  }, {
    id: '6-4',
    path: 'scheduling',
    component: 'interviewly/scheduling/index',
    title: 'scheduling',
    icon: 'form'
  }, {
    id: '6-5',
    path: 'schedulingDetail/:userId',
    component: 'interviewly/scheduling/detail',
    hidden: true,
    title: 'schedulingDetail',
    icon: 'form'
  }]
}
