export default {
  // 通用API
  // 登录相关 修改密码
  'post@passport_login': '/passport/user/login.html',
  'post@passport_logout': '/passport/user/logout.html',
  'post@workersSet_changeUserPwd': '/workersSet/hr/changeUserPwd.html',
  'post@workersSet_changeUserMailPwd': '/workersSet/hr/changeUserMailPwd.html',
  'post@resume_getImgCode': '/resume/public/getImgCode.html',

  // 公共接口
  'post@public_getWorkPlace': '/public/getWorkPlace.html', // 获取工作地点
  'post@public_addWorkPlace': '/public/addWorkPlace.html', // 添加工作地点
  'post@public_editWorkPlace': '/public/editWorkPlace.html', // 修改工作地点信息
  'post@public_getSchoolList': '/public/getSchoolList.html', // 获取学校列表
  'post@public_addSchool': '/public/addSchool.html', // 添加学校
  'post@public_editSchool': '/public/editSchool.html', // 修改学校
  'post@public_addTag': '/public/addTag.html', // 添加标签
  'post@public_editTag': '/public/editTag.html', // 修改标签
  'post@public_getTag': '/public/getTag.html', // 获取标签列表
  'post@public_schoolSearch': '/public/schoolSearch.html',
  'post@public_getTelentPoolCountList': '/resume/allot/getTelentPoolCountList.html', // 人才库候选人查看手机号码

  // 学科相关
  'post@subject_addTeachingGroup': '/subject/addTeachingGroup.html', // 添加教学组
  'post@subject_editTeachingGroup': '/subject/editTeachingGroup.html', // 修改教学组
  'post@subject_getTeachingDept': '/subject/getTeachingDept.html', // 获取教学部
  'post@subject_addTeachingDept': '/subject/addTeachingDept.html', // 添加教学部
  'post@subject_editTeachingDept': '/subject/editTeachingDept.html', // 修改教学部
  'post@subject_getTeachingGroup': '/subject/getTeachingGroup.html', // 获取教学组
  'post@subject_getGradeSubject': '/subject/getGradeSubject.html', // 教学组的年级学科

  // 系统管理
  'post@auth_superProInsert': '/auth/superProInsert.html', // 角色权限的添加、修改
  'post@auth_proList': '/auth/proList.html', // 角色权限的列表和搜索
  'post@auth_roleAuthlist': '/auth/roleAuthlist.html', // 权限名称（id）（下拉框用）列表
  'post@auth_authorityList': '/auth/authorityList.html', // 权限菜单列表
  'post@auth_authorityListOne': '/auth/authorityListOne.html', // 权限 获取一条权限信息
  'post@auth_roleLevel': '/auth/roleLevel.html', // 角色对应的级别
  'post@auth_getDeptId': '/auth/getDeptId.html', // 获取部门列表（添加权限）
  'post@auth_userStatus': '/auth/userStatus.html', // 修改权限状态
  'post@auth_getSchoolOption': '/auth/getSchoolOption.html', // 获取院校管理搜索
  'post@subject_getTeachinOpion': '/subject/getTeachinOpion.html',
  'post@auth_getRoleLevelOption': '/auth/getRoleLevelOption.html',
  'post@auth_getModules': '/auth/getModules.html',

  // 人员设置
  'post@auth_getRoleLevelPid': '/auth/getRoleLevelPid.html', // 通过 级别+角色 获取 上级
  'post@hr_userStatus': '/workersSet/hr/userStatus.html', // 设置账号有效无效
  // hr相关
  'post@auth_getHrOption': '/auth/getHrOption.html', // 搜索项
  'post@hr_roleInsert': '/workersSet/hr/roleInsert.html', // 添加（新建）HR管理员
  'post@hr_hrUpdateOne': '/workersSet/hr/hrUpdateOne.html', // 修改HR管理员的账号信息
  'post@hr_hrListOne': '/workersSet/hr/hrListOne.html', // 获取HR管理员单一账号信息
  'post@hr_getUserList': '/workersSet/hr/getUserList.html', // 查询（搜索）HR管理员的账号信息
  // 数据员相关
  'post@auth_getDataerOption': '/auth/getDataerOption.html',
  'post@dataMember_roleInsert': '/workersSet/dataMember/roleInsert.html', // 数据员（新建）账号
  'post@dataMember_dataUpdateOne': '/workersSet/dataMember/dataUpdateOne.html', // 数据员（修改）账号信息
  'post@dataMember_dataListOne': '/workersSet/dataMember/dataListOne.html', // 数据员（获取单一账号信息）
  'post@dataMember_getUserList': '/workersSet/dataMember/getUserList.html', // 数据员（搜索数据信息）
  // 面试官相关
  'post@auth_getInterviewerOption': '/auth/getInterviewerOption.html',
  'post@interview_roleInsert': '/workersSet/interview/roleInsert.html', // 面试官 新建账号
  'post@interview_dataUpdateOne': '/workersSet/interview/dataUpdateOne.html', // 面试官 修改账号信息
  'post@interview_dataListOne': '/workersSet/interview/dataListOne.html', // 面试官（获取单一账号信息）
  'post@interview_getUserList': '/workersSet/interview/getUserList.html', // 面试官（搜索）账号信息
  'post@interview_getAllChoose': '/workersSet/interview/getAllChoose.html', // 面试官添加页面获取所有下拉框列表
  // 培训师相关
  'post@trainer_roleInsert': '/workersSet/trainer/roleInsert.html', // 培训师（新建）账号
  'post@auth_getTrainerOption': '/auth/getTrainerOption.html',
  'post@trainer_dataUpdateOne': '/workersSet/trainer/dataUpdateOne.html', // 培训师（修改）账号
  'post@trainer_dataListOne': '/workersSet/trainer/dataListOne.html', // 培训师（获取单一账号信息）
  'post@trainer_getUserList': '/workersSet/trainer/getUserList.html', // 培训师（搜索数据信息列表）
  // 审批官相关
  'post@approval_roleInsert': '/workersSet/approval/roleInsert.html', // 审批官（新建）账号
  'post@auth_getApprovalOption': '/auth/getApprovalOption.html',
  'post@approval_dataUpdateOne': '/workersSet/approval/dataUpdateOne.html', // 审批官（修改）账号信息
  'post@approval_dataListOne': '/workersSet/approval/dataListOne.html', // 审批官（获取单一账号信息）
  'post@approval_getUserList': '/workersSet/approval/getUserList.html', // 审批官（搜索数据信息列表）
  // 系统管理员相关
  'post@auth_getAdminOption': '/auth/getAdminOption.html',
  'post@systemMan_roleInsert': '/workersSet/systemMan/roleInsert.html', // 系统管理员（新建）账号
  'post@systemMan_dataUpdateOne': '/workersSet/systemMan/dataUpdateOne.html', // 系统管理员（修改）账号
  'post@systemMan_dataListOne': '/workersSet/systemMan/dataListOne.html', // 系统管理员（获取单一账号信息）
  'post@systemMan_getUserList': '/workersSet/systemMan/getUserList.html', // 系统管理员（搜索数据信息列表）

  // 渠道管理
  'post@hr_getValidHR': '/workersSet/hr/getValidHR.html', // 获取HR对应的账号列表
  'post@channel_getSelect': '/channel/cooperation/getSelect.html',
  'post@channel_search': '/channel/cooperation/search.html', // 渠道搜索
  'post@channel_setStatus': '/channel/cooperation/setStatus.html', // 设置渠道状态
  'post@channel_getChannelOne': '/channel/cooperation/getChannelOne.html', // 获取渠道信息（修改前）
  'post@channel_firstAddUpdate': '/channel/cooperation/firstAddUpdate.html', // 一级合作渠道 修改，添加
  'post@channel_secondAddUpdate': '/channel/cooperation/secondAddUpdate.html', // 二级合作渠道添加，修改
  'post@channel_firstgeneralAddUpdate': '/channel/cooperation/firstgeneralAddUpdate.html', // 一级普通渠道添加，修改
  'post@channel_secondGeneralAddUpdate': '/channel/cooperation/secondGeneralAddUpdate.html', // 二级普通渠道添加，修改
  'post@channel_getNotice': '/channel/cooperation/getNotice.html', // 获取公告列表
  'post@channel_addNotice': '/channel/cooperation/addNotice.html', // 添加公告
  'post@channel_editNotice': '/channel/cooperation/editNotice.html', // 编辑公告
  'post@channel_getNoticeOption': '/channel/cooperation/getNoticeOption.html', // 获取公告搜索项

  // 人才库|候选人管理
  'post@resume_excelImport': '/resume/import/excelImport.html', // 导入
  'post@resume_ResumeAddUpdate': '/resume/resume/ResumeAddUpdate.html', // 新建|修改
  'post@resume_getConst': '/resume/resume/getConst.html', // 获取候选人添加时所有下拉框数据
  'post@resume_candidateSearch': '/resume/resume/candidateSearch.html', // 候选人搜索
  'get@resume_downResume': '/down/importTemple.xlsx', // 下载简历
  'post@resume_getCountList': '/resume/allot/getCountList.html', // 候选人列表左侧菜单的值
  'post@resume_getPhone': '/resume/resume/getPhone.html', // 获取手机号
  'post@resume_TelentPoolSearch': '/resume/resume/TelentPoolSearch.html',
  'post@resume_checkPhone': '/resume/resume/checkPhone.html', // 手机号校验
  'post@resume_checkMail': '/resume/resume/checkMail.html', // 邮箱校验
  'post@auth_setDefaultOption': '/auth/setDefaultOption.html', // 根据学科和学校获取教学部

  // 详情页
  'post@resume_getOneResume': '/resume/resume/getOneResume.html',
  'post@resume_Addlinkup': '/resume/linkup/Addlinkup.html',
  'post@resume_getLinkUp': '/resume/linkup/getLinkUp.html',
  'post@resume_getResumeOne': '/resume/linkup/getResumeOne.html',
  'post@resume_interviewList': '/resume/interview/interviewList.html',
  'post@auth_baseInfoOption': '/auth/baseInfoOption.html',
  'post@resume_getOperateLog': '/resume/resume/getOperateLog.html',
  'post@resume_recordList': '/resume/offer/recordList.html',
  'post@resume_viewList': '/resume/partInterview/viewList.html',
  'post@public_getSubject': '/public/getSubject.html',
  'post@resume_insert': '/resume/partInterview/insert.html',
  'post@resume_sendInform': '/resume/interview/sendInform.html',
  'post@resume_offerSendInform': '/resume/offer/sendInform.html',
  'post@resume_trainList': '/resume/partOffer/trainList.html',
  'post@resume_trainAll': '/resume/partOffer/trainAll.html',
  'post@resume_getTrainList': '/resume/partOffer/getTrainList.html',
  'post@resume_addTrain': '/resume/offer/addTrain.html',
  'post@subject_getPartTeachingGroup': '/subject/getPartTeachingGroup.html',
  'post@resume_addOfferTrain': '/resume/partOffer/addOfferTrain.html',
  'post@resume_previewMail': '/resume/interview/previewMail.html',
  'post@resume_offerpreviewMail': '/resume/offer/perviewOfferMail.html',
  'post@resume_getInterviewTime': '/resume/interview/getInterviewTime.html',
  'post@resume_addInterview': '/resume/interview/addInterview.html',
  'post@resume_checkPerfectMsg': '/resume/partInterview/checkPerfectMsg.html',

  // 面试管理
  'post@interviewer_record': '/interviewer/record/index.html', // 获取面试官评价列表
  'post@interviewer_claimPartTimeList': '/interviewer/record/claimPartTimeList.html', // 获取认领兼职列表
  'post@interviewer_claimFullTimeList': '/interviewer/record/claimFullTimeList.html', // 获取认领兼职列表
  'post@interviewer_getRecordOption': '/interviewer/record/getRecordOption.html', // 获取认领兼职列表
  'post@interviewer_getOptionRecordOption': '/interviewer/record/recordOption.html', // 获取认领兼职列表
  'post@interviewer_saveClaimFullTime': '/interviewer/record/claimFullTime.html', // 确认认领
  'post@interviewer_resumeBack': '/interviewer/record/resumeBack.html', // 退回
  'post@interviewer_savePartTimeRecord': '/interviewer/record/partTimeRecord.html', // 兼职评价接口
  'post@interviewer_saveFullTimeRecord': '/interviewer/record/fullTimeRecord.html', // 全职评价接口
  'post@interviewer_scheduler': '/interviewer/scheduler/index.html', // 面试官排版管理列表
  'post@interviewer_getInterviewerScheduler': '/interviewer/scheduler/getInterviewerScheduler.html', // 面试官排版详情列表
  'post@interviewer_changeInterviewerScheduler': '/interviewer/scheduler/changeInterviewerScheduler.html', // 更新排班接口
  // 审批管理
  'post@examine_examineList': '/examine/list/examineList.html', // 一审首页列表接口
  'post@examine_getExamine': '/auth/getExamine.html', // 一审搜索项
  'post@examine_getManager': '/auth/getManager.html', // 一审经理审批下拉选项
  'post@examine_examineAdd': '/examine/list/examineAdd.html', // 一审审批添加
  'post@examine_auditMultiple': '/examine/list/auditMultiple.html', // 一审批量审批
  'post@examine_secondInstance': '/examine/list/secondInstance.html', // 二审列表
  'post@examine_getSecondInstance': '/auth/getSecondInstance.html', // 二审搜索项
  'post@examine_getGeneralManager': '/auth/getGeneralManager.html', // 二审审批选项
  'post@examine_twoAudit': '/examine/list/twoAudit.html', // 二审审批添加
  'post@examine_secondTrialBatch': '/examine/list/secondTrialBatch.html', // 二审批量审批
  // 培训管理
  'post@train_trainList': '/train/trainManage/trainList.html', // 培训场次管理列表
  'post@train_addTrain': '/train/trainManage/addTrain.html', // 培训场次新增
  'post@train_addQRcode': '/train/trainManage/addQRcode.html', // 培训场次添加二维码
  'post@train_allsearch': '/train/trainManage/allsearch.html', // 培训场次搜索下拉
  'post@train_fullsearch': '/train/trainManage/fullsearch.html', // 签到管理搜索下拉
  'post@train_exportDataExecl': '/train/trainManage/exportDataExecl.html', // 签到管理导出
  'post@train_signList': '/train/trainManage/signList.html', // 签到管理列表
  'post@train_setStatus': '/train/trainManage/setStatus.html', // 培训场次设置状态
  'post@train_trainManageOne': '/train/trainManage/trainManageOne.html', // 培训场次编辑
  'post@train_updateTrain': '/resume/updateTrain/index.html', // 导入状态修改
  // 分配部分
  'post@resume_allot': '/resume/allot/index.html', // 分配
  'post@resume_updateStatus': '/resume/allot/updateStatus.html',
  'post@resume_revulsion': '/resume/allot/revulsion.html',
  'post@auth_getResumeOption': '/auth/getResumeOption.html',
  'post@auth_getSecondChannel': '/auth/getSecondChannel.html',
  'post@auth_getSecondDirectOption': '/auth/getSecondDirectOption.html',
  'post@auth_getResumeHandleOption': '/auth/getResumeHandleOption.html',
  'post@auth_getResume2Option': '/auth/getResume2Option.html'
}
