/* eslint-disable */
// 人才库
export const resume = {
  id: '4',
  path: '/resume',
  title: 'resume',
  icon: 'hat',
  children: [{
      id: '4-1',
      path: 'look/:userId',
      component: 'detailPages/lookIndex',
      title: 'detailPagesLookIndex',
      hidden: true
    },
    {
      id: '4-2',
      path: 'rckAllresume',
      component: 'resume/index',
      title: 'rckAllresume'
    },
    {
      id: '4-3',
      path: 'rckNewresume',
      component: 'resume/index',
      title: 'rckNewresume'
    },
    {
      id: '4-4',
      path: 'rckWithdrawData',
      component: 'resume/index',
      title: 'rckWithdrawData'
    },
    {
      id: '4-5',
      path: '/rckDataFollowUp',
      component: 'resume/index', // Parent router-view
      title: 'rckDataFollowUp',
      children: [{
          id: '4-5-1',
          path: 'rckAll',
          component: 'resume/index',
          title: 'rckAll'
        },
        {
          id: '4-5-2',
          path: 'rckPending',
          component: 'resume/index',
          title: 'rckPending'
        },
        {
          id: '4-5-3',
          path: 'rckKeepTouch',
          component: 'resume/index',
          title: 'rckKeepTouch'
        },
        {
          id: '4-5-4',
          path: 'rckAccessFailure',
          component: 'resume/index',
          title: 'rckAccessFailure'
        },
        {
          id: '4-5-5',
          path: 'rckInterviewProcess',
          component: 'resume/index',
          title: 'rckInterviewProcess'
        },
        {
          id: '4-5-6',
          path: 'rckInterviewArrangement',
          component: 'resume/index',
          title: 'rckInterviewArrangement'
        },
        {
          id: '4-5-7',
          path: 'rckPass',
          component: 'resume/index',
          title: 'rckPass'
        },
        {
          id: '4-5-8',
          path: 'rckReceiveOffer',
          component: 'resume/index',
          title: 'rckReceiveOffer'
        },
        {
          id: '4-5-9',
          path: 'rckHasBeenInto',
          component: 'resume/index',
          title: 'rckHasBeenInto'
        },
        {
          id: '4-5-10',
          path: 'rckOutOf',
          component: 'resume/index',
          title: 'rckOutOf'
        },
        {
          id: '4-5-11',
          path: 'rckWeekOut',
          component: 'resume/index',
          title: 'rckWeekOut'
        },
        {
          id: '4-5-12',
          path: 'rckTrainPass',
          component: 'resume/index',
          title: 'rckTrainPass'
        },
        {
          id: '4-5-13',
          path: 'rckTrainOut',
          component: 'resume/index',
          title: 'rckTrainOut'
        },
        {
          id: '4-5-14',
          path: 'rckTrainQuit',
          component: 'resume/index',
          title: 'rckTrainQuit'
        }
      ]
    },
    {
      id: '4-6',
      path: 'rckScrapData',
      component: 'resume/index', // Parent router-view
      title: 'rckScrapData'
    },
    {
      id: '4-7',
      path: 'rckUpload',
      component: 'resume/upload', // Parent router-view
      title: 'rckUpload',
      hidden: true
    }
  ]
}
