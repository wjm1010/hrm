/* eslint-disable */
// 人员管理
export const staff = {
  id: '2',
  path: '/staff',
  title: 'staff',
  icon: 'people',
  children: [{
      id: '2-1',
      path: 'recruitment',
      component: 'staff/recruitment',
      title: 'recruitment',
      noCache: true
    },
    {
      id: '2-2',
      path: 'recruitment/add',
      component: 'staff/detail/recruitmentIndex',
      title: 'recruitmentIndexAdd',
      hidden: true
    },
    {
      id: '2-3',
      path: 'recruitment/edit/:userId',
      component: 'staff/detail/recruitmentIndex',
      title: 'recruitmentIndexEdit',
      noCache: true,
      hidden: true
    },
    {
      id: '2-4',
      path: 'dataOfficer',
      component: 'staff/dataOfficer',
      title: 'dataOfficer',
      noCache: true
    },
    {
      id: '2-5',
      path: 'dataOfficer/add',
      component: 'staff/detail/dataOfficerIndex',
      title: 'dataOfficerIndexAdd',
      hidden: true
    },
    {
      id: '2-6',
      path: 'dataOfficer/edit/:userId',
      component: 'staff/detail/dataOfficerIndex',
      title: 'dataOfficerIndexEdit',
      noCache: true,
      hidden: true
    },
    {
      id: '2-7',
      path: 'interview',
      component: 'staff/interview',
      title: 'interview',
      noCache: true
    },
    {
      id: '2-8',
      path: 'interview/add',
      component: 'staff/detail/interviewIndex',
      title: 'interviewIndexAdd',
      hidden: true
    },
    {
      id: '2-9',
      path: 'interview/edit/:userId',
      component: 'staff/detail/interviewIndex',
      title: 'interviewIndexEdit',
      noCache: true,
      hidden: true
    },
    {
      id: '2-10',
      path: 'approval',
      component: 'staff/approval',
      title: 'approval',
      noCache: true
    },
    {
      id: '2-11',
      path: 'approval/add',
      component: 'staff/detail/approvalIndex',
      title: 'approvalIndexAdd',
      hidden: true
    },
    {
      id: '2-12',
      path: 'approval/edit/:userId',
      component: 'staff/detail/approvalIndex',
      title: 'approvalIndexEdit',
      noCache: true,
      hidden: true
    },
    {
      id: '2-13',
      path: 'trainer',
      component: 'staff/trainer',
      title: 'trainer',
      noCache: true
    },
    {
      id: '2-14',
      path: 'trainer/add',
      component: 'staff/detail/trainerIndex',
      title: 'trainerIndexAdd',
      hidden: true
    },
    {
      id: '2-15',
      path: 'trainer/edit/:userId',
      component: 'staff/detail/trainerIndex',
      title: 'trainerIndexEdit',
      noCache: true,
      hidden: true
    },
    {
      id: '2-16',
      path: 'admin',
      component: 'staff/admin',
      title: 'admin',
      noCache: true
    },
    {
      id: '2-17',
      path: 'admin/add',
      component: 'staff/detail/adminIndex',
      title: 'adminIndexAdd',
      hidden: true
    },
    {
      id: '2-18',
      path: 'admin/edit/:userId',
      component: 'staff/detail/adminIndex',
      title: 'adminIndexEdit',
      noCache: true,
      hidden: true
    }
  ]
}
