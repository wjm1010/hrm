module.exports= {
  prod:{
    NODE_ENV: '"production"',
    ENV_CONFIG: '"prod"',
    BASE_API: '""',
  },
  dev: {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"dev"',
    BASE_API: '"http://dev-api.hfjy.com/mock/57"',// dev-api的地址
  },
  platform: 'izj_platform',
  INDEXDB: {
		OPEN: true,// 是否开启indexdb
		DB: 'hfjy-zj-Db',//数据库名称
		TABLE: {
      errorDate: '++id,url', // 表明 ：字段名称
      cacheDate: '++id,url,method,remote,disableTime,params,cacheTime,setTime,data'
    },
		ISCollection: false,// 是否开启数据收集
	},
	remote: {
		izj: {
			hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.com/mock/57'},
        { name: 'dev-', value: 'dev-izj.hfjy.com'},
        { name: 'i-', value: 'i-izj.hfjy.com' },
        { name: 'test-', value: 'test-izj.hfjy.com' },
        { name: 'offline-', value: 'offline-izj.hfjy.com' },
        { name: 'izj.', value: 'izj.hfjy.com'}
        ],//环境
      redirect: '/console',//重定向
		},
    ijx: {
      hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.com/mock/108' },
        { name: 'dev-', value: 'dev-ijx.hfjy.com' },
        { name: 'test-', value: 'test-ijx.hfjy.com' },
        { name: 'offline-', value: 'offline-ijx.hfjy.com' },
        { name: 'ijx.', value: 'ijx.hfjy.com' }
      ], // 环境
      redirect: '/education' // 重定向
    },
		ixs: {
			hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.com/mock/112'},
        { name: 'dev-', value: 'dev-ixs.hfjy.com'},
        { name: 'i-', value: 'i-ixs.hfjy.com' },
        { name: 'test-', value: 'test-ixs.hfjy.com'},
        { name: 'offline-', value: 'offline-ixs.hfjy.com' },
        { name: 'ixs-', value: 'ixs.hfjy.com'}
        ],//环境
			redirect: '/sale',//重定向
		},
    iCP: {
      hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.com/mock/57'},
        { name: 'dev-', value: 'test-hjzx.hfjy.com'},
        { name: 'i-', value: 'test-hjzx.hfjy.com'},
        { name: 'test-', value: 'test-hjzx.hfjy.com'},
        { name: 'offline-', value: 'offline-hjzx.hfjy.com'},
        { name: 'hjzx.', value: 'hjzx.hfjy.com'}
      ],
      redirect: '',//重定向
    }
	},
  oldLmsHost: ['i.hfjy.com', 'dev-lms.hfjy.com', 'i-lms.hfjy.com', 't-ifwzx.hfjy.com', 'offline-lms.hfjy.com'], // 线上，开发，测试，离线
  oldIPCHost: ['https://lms-upload.hfjy.com/file', 'https://test-lms-upload.hfjy.com/file'],
  currentHost: ['izj.', 'dev-', 'i-', 'test-', 'offline-'],
  currentProjectName: 'izj',
   // 前端监控
   watch: {
    reportUrl: 'https://web-monitor.hfjy.red/api/v1/report/web',
    report: [{ appId: '94B25476AA7663BFB6B4BA73518400DB', name: 'dev-izj.hfjy.top' }, { appId: '0704D72E1D229DD2148172FA8441042B', name: 'test-izj.hfjy.top' }]
  }
}
