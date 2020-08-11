const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userIdentity: state => state.user.userIdentity,
  xToken: state => state.user.xToken,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  phone: state => state.user.phone,
  isMobile: state => state.user.isMobile,
  userId: state => state.user.userId,
  userRole: state => state.user.userRole,
  userMail: state => state.user.userMail,
  userLevel: state => state.user.userLevel,
  userChangePwd: state => state.user.userChangePwd,
  oprate: state => state.user.oprate,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  rckoptions: state => state.getOptions.rckoptions,
  secondDirectOption: state => state.getOptions.secondDirectOption,
  resume2Option: state => state.getOptions.resume2Option,
  checkPhone: state => state.getOptions.checkPhone,
  secondaryChannel: state => state.getOptions.secondaryChannel,
  channelUpdate: state => state.user.channelUpdate
}
export default getters
