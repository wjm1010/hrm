module.exports = {
  prod: {
    NODE_ENV: '"production"',
    ENV_CONFIG: '"prod"',
    BASE_API: '"http://hrm.hfjy.top/"'
  },
  hard: {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"hard"',
    BASE_API: '"https://t-hrmapi.hfjy.top/"'
  },
  mock: {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"mock"',
    BASE_API: '"http://dev-api.hfjy.top/mock/218"'
  },
  dev: {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"dev"',
    BASE_API: '"http://dev-hrmapi.hfjy.com"'
  },
  test: {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"test"',
    BASE_API: '"https://t-hrmapi.hfjy.top/"'
  },
  server: {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"hard"',
    BASE_API: '"/api"'
  },
  platform: 'hrm_platform',
  INDEXDB: {
    OPEN: false, // 是否开启indexdb
    DB: 'hfjy-at-Db', //数据库名称
    TABLE: {
      errorDate: '++id,url', // 表明 ：字段名称
      cacheDate:
        '++id,url,method,remote,disableTime,params,cacheTime,setTime,data'
    },
    ISCollection: false // 是否开启数据收集
  },
  remote: {
    hrm: {
      hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.top/mock/218' },
        { name: 'dev-', value: 'dev-hrmapi.hfjy.top' },
        { name: 'test-', value: 'i-hrm.hfjy.top' },
        { name: 'i-', value: 'offline-hrm.hfjy.top' },
        { name: 'hrm.', value: 'hrm.hfjy.top' }
      ], //环境
      redirect: '' //重定向
    },
    izj: {
      hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.top/mock/57' },
        { name: 'dev-', value: 'dev-izj.hfjy.top' },
        { name: 'test-', value: 'i-izj.hfjy.top' },
        { name: 'i-', value: 'offline-izj.hfjy.top' },
        { name: 'izj.', value: 'izj.hfjy.top' }
      ], //环境
      redirect: '/console' //重定向
    },
    ijx: {
      hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.top/mock/108' },
        { name: 'dev-', value: 'dev-ijx.hfjy.top' },
        { name: 'test-', value: 'test-ijx.hfjy.top' },
        { name: 'i-', value: 'i-ijx.hfjy.top' },
        { name: 'ijx.', value: 'ijx.hfjy.top' }
      ], // 环境
      redirect: '/education' // 重定向
    },
    ixs: {
      hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.top/mock/112' },
        { name: 'dev-', value: 'dev-ixs.hfjy.top' },
        { name: 'test-', value: 'test-ixs-new.hfjy.top' },
        { name: 'i-', value: 'offline-ixs.hfjy.top' },
        { name: 'ixs.', value: 'ixs-temp.hfjy.top' }
      ], //环境
      redirect: '/sale' //重定向
    },
    iCP: {
      hostName: [
        { name: 'localhost', value: 'dev-api.hfjy.top/mock/57' },
        { name: 'dev-', value: 'test-hjzx.hfjy.top' },
        { name: 'test-', value: 'test-hjzx.hfjy.top' },
        { name: 'offline-', value: 'offline-hjzx.hfjy.top' },
        { name: 'hjzx.', value: 'hjzx.hfjy.top' }
      ],
      redirect: '' //重定向
    }
  },
  oldLmsHost: ['i.hfjy.top', 'dev-lms.hfjy.top', 'i-lms.hfjy.top', 'offline-lms.hfjy.top'], // 线上，开发，测试，离线
  currentHost: ['t-hrm.hfjy', 'hrm.hfjy', 'temp', 'dev-hrm.hfjy'],
  ExcelHost: [
    't-hrmapi.hfjy.top',
    'hrmapi.hfjy.top',
    'hrmapi.hfjy.top',
    'dev-hrmapi.hfjy.com',
    'dev-api.hfjy.top/mock/218'
  ],
  currentProjectName: 'hrm'
}
