## v3.182.10-release
* 此版本详情页新增作业情况和课后反馈栏目
* 新增页面study>homework作业情况
* 新增页面study>feedback课后反馈

## node 版本 7.9 （10.x>只支持>7.x）

#### api先注册后使用，不在区分get和post请求

### 组件封装要就解耦性强，复用性高,业务性要抽离

## 常用命令

* npm i 安装npm包
* npm run dev 开发环境调试
* npm run build:prod 项目打包
* npm run lint 代码校验
* npm run cli 创建路由导航  (1.请输入router的Url: demo/index  2.请输入菜单名称(如果不出现在菜单请写 hide):  教师列表（或者hide)

---------------------------------------

## 目录结构

```
├── index.html
├── build                   # webpack 配置文件
├── config                  # 环境变量
├── script                  # cli 创建router
└── src
    ├── main.js             # 入口文件
    ├── components          # 自定义组件
    ├── directive           # 自定义指令
    ├── filters             # 自定义过滤器
    ├── icons               # 图片
    ├── lang                # 字典
    ├── router              # 路由
    ├── store               # vuex
    ├── styles              # 样式
    ├── views               # 视图文件
    └── utils
        ├── api             # 接口api
        ├── collection      # 事件监听
        ├── db              # indexedDB
        ├── http            # 接口拦截
        └── validate.js     # 常用校验
```

##

前端监控必须在 http://web-monitor.hfjy.red 进行注册 获取APPID 及config default.js 配置
