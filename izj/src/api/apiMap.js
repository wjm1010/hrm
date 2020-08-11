export default {
  // 通用API
  'get@teacher_getDate': '/teacher/getDate', // 获取服务器当前时间
  'post@visit_phoneLog': '/visit/phoneLog', // 获取服务器当前时间
  'post@index_searchUser': '/index/searchUser', // 全局搜索
  'post@visit_getGroupMember': '/visit/getGroupMember', // 获取班主任人员
  'get@course_search': '/course/search', // 表单搜索列表
  'get@teacher_isHaveRole': '/teacher/isHaveRole', // 沟通详情权限判断
  'post@passport_passwordChange': '/passport/passwordChange', // 重置密码
  // 登录相关
  'post@passport_login': '/passport/login',
  'get@passport_logout': '/passport/logout',
  'get@user_info': '/user/info',
  // 通话时长
  'get@student_todayCallDuration': '/student/todayCallDuration',
  'get@student_todayCallTotal': '/student/todayCallTotal',
  // 待回访列表
  'get@visit_searchParam': '/visit/searchParam',
  'get@visit_listCount': '/visit/visitListCount',
  'get@visit_visitList': '/visit/visitList',
  'get@visit_getTotal': '/visit/getTotal',
  'get@teacher_communicationTool': '/teacher/communicationTool',
  'post@teacher_batchAddRecord': '/teacher/batchAddRecord',
  'post@student_submitIntention': '/student/submitIntention',
  'get@student_getIntention': '/student/getIntention',
  'get@student_intentionMenu': '/student/intentionMenu',
  'get@users_myQrCode': '/users/myQrCode', // 内部推荐码

  'get@teacher_stageTaskSearchParam': '/teacher/stageTaskSearchParam',
  'post@lesson_getCity': '/lesson/getCity',
  'post@teacher_needAddStageTask': '/teacher/needAddStageTask',
  // 学员管理
  'get@users_allotStudent': '/users/allotStudent',
  'post@lesson_callHeadmaster': '/lesson/callHeadmaster',
  'get@teacher_teacherWhite': '/teacher/teacherWhite',
  'get@users_lists': '/users/lists',
  // 停课预警列表
  'get@course_stopWarn': '/course/stopWarn',
  // 结课预警列表
  'get@course_overWarn': '/course/overWarn',
  // 停课列表
  'post@course_reason': '/course/reason',
  'get@course_stop': '/course/stop',
  'get@teacher_stopLessonReason': '/teacher/stopLessonReason',
  'get@teacher_stopLessonReasonType': '/teacher/stopLessonReasonType',
  // 结课列表
  'get@course_over': '/course/over',
  // 报名
  'get@course_searchApplyCourse': '/course/searchApplyCourse',
  'get@course_applyCourse': '/course/applyCourse',
  'post@course_addApplyCourse': '/course/addApplyCourse',
  /* ****** 沟通详情页 ****** */
  /* **通用信息** */
  'get@student_isBindWx': '/student/isBindWx',
  'get@student_getStudentInfo': '/student/getStudentInfo',
  'get@student_getStudentInformation': '/student/getStudentInformation', // 学生基本信息（更新）
  'post@teacher_addCommunicationRecord': '/teacher/addCommunicationRecord',
  /* **头像信息** */
  'get@student_getCommunicationTools': '/student/getCommunicationTools',
  /* **操作项** */
  'get@teacher_allowAttendClass': '/teacher/allowAttendClass',
  'get@teacher_attendClassList': '/teacher/attendClassList',
  'get@teacher_arrangeExperienceCourse': '/teacher/arrangeExperienceCourse',
  'get@teacher_isCanLookOrder': '/teacher/isCanLookOrder', // 判断能否看成单登记
  'get@student_resetPwd': '/student/resetPwd',
  'post@student_completionStudentData': '/student/completionStudentData',
  'post@student_completionStudentInfo': '/student/completionStudentInfo', // 补全资料（跟新）
  'post@passport_sendMsg': '/passport/sendMsg', // 忘记密码（发送短信获取验证码）
  'post@passport_verificationCode': '/passport/verificationCode', // 忘记密码（验证code）
  'post@passport_PasswordRecovery': '/passport/PasswordRecovery', // 忘记密码（重置密码）
  'get@student_openClient': '/student/openClient',
  'get@student_getConstellation': '/student/getConstellation',
  'get@teacher_turnOverList': '/teacher/turnOverList',
  'get@student_getSubjectName': '/student/getSubjectName',
  'get@student_getArea': '/student/getArea',
  'get@student_getCity': '/student/getCity',
  'get@student_getListProvince': '/student/getListProvince',
  'get@student_getGrade': '/student/getGrade',
  'get@student_getExtractPhone': '/student/getExtractPhone', // 获取明文次要手机号
  'get@student_getExtractPhoneList': '/student/getExtractPhoneList', // 获取明文次要手机号,跟新版
  'get@student_getNumberPersonal': '/student/getNumberPersonal', // 获取所属人
  'get@student_getDevice': '/student/getDevice', // 获取设备
  'get@student_getPresentSchool': '/student/getPresentSchool', // 根据省市获取学校
  'get@student_updateExtraPhone': '/student/updateExtraPhone', // 修改主手机号码
  'get@student_getExamYearByGrade': '/student/getExamYearByGrade', // 计算高考年级
  'get@student_getPolicyPanoramic': '/student/getPolicyPanoramic', // 政策全景
  'post@student_getSchoolInfo': '/student/getSchoolInfo', // 学校情况
  'get@student_studyState': '/student/studyState', // 学习情况
  'get@student_getBookVersion': '/student/getBookVersion', // 教材版本
  'get@student_getNewSubject': '/student/getNewSubject', // 预选科目
  'get@student_getRank': '/student/getRank', // 班级/年级排名
  'get@student_targetSchool': '/student/targetSchool', // 目标院校
  'get@student_attendSchoolLog': '/student/attendSchoolLog', // 就读学校日志记录
  'get@student_targetSchoolLog': '/student/targetSchoolLog', // 目标院校日志记录
  'get@student_studyStateLog': '/student/studyStateLog', // 学习情况日志记录
  'get@student_targetSchoolEdit': '/student/targetSchoolEdit', // 目标院校编辑页面
  'get@student_getLearnInfo': '/student/getLearnInfo', // 学情分析
  'post@student_getTestInfo': '/student/getTestInfo', // 考情分析
  'get@student_getUniversityByArea': '/student/getUniversityByArea', // 生源地有招生计划的大学
  'post@student_policyBuried': '/student/policyBuried', // 政策全景-小升初&初中都有 数据埋点
  /* **进步反馈** */
  'get@scoreFeedback_formData': '/scoreFeedback/formData', // 30天在读课程
  'post@console_submitFormData': '/scoreFeedback/submitFormData', // 提交课后成绩反馈
  /* **学生流转** */
  'get@teacher_latelyFollower': '/teacher/latelyFollower',
  /* **学生日历***/
  'get@teacher_studentCalendarAll': '/teacher/studentCalendarAll',
  'get@talk_calendarStatistics': '/talk/calendarStatistics',
  /* **沟通记录列表** */
  'get@teacher_communicationRecordList': '/teacher/communicationRecordList',

  /* **课程老师** */
  'get@student_getTeacherInfo': '/student/getTeacherInfo',
  /* **话术提醒** */
  'get@talk_talk': '/talk/talk',
  /* **剩余课时** */
  'get@talk_periodShow': '/talk/periodShow',
  /* **成单信息** */
  'get@talk_contract': '/talk/contract',
  /* **日历列表** */
  'get@teacher_studentCalendar': '/teacher/studentCalendar',
  'get@teacher_studentCalendarParam': '/teacher/studentCalendarParam',
  'get@teacher_cancelPlan': '/teacher/cancelPlan',
  'get@teacher_adjustmentTimeParam': '/teacher/adjustmentTimeParam',
  'get@teacher_adjustmentTime': '/teacher/adjustmentTime',
  /* **新增策略** */
  'get@courseApplication_applySubject': '/courseApplication/applySubject',
  'get@courseApplication_getDefaultTeacherInfo': '/courseApplication/getDefaultTeacherInfo',
  'get@subject_getSubjectByTeacher': '/subject/getSubjectByTeacher',
  'get@courseApplication_getCoursePacks': '/courseApplication/getCoursePacks',
  'get@courseApplication_getCourseVersion': '/courseApplication/getCourseVersion',
  'get@courseApplication_getOption': '/courseApplication/getOption',
  'post@courseApplication_countCourseHour': '/courseApplication/countCourseHour',
  'post@courseApplication_getTimeList': '/courseApplication/getTimeList',
  'post@courseApplication_editStrategy': '/courseApplication/editStrategy',
  'get@courseApplication_getTeacher': '/courseApplication/getTeacher',
  'get@subject_getExtendTeacher': '/subject/getExtendTeacher',
  'get@subject_getOfficialTeacher': '/subject/getOfficialTeacher',
  'get@courseApplication_checkLessonTime': '/courseApplication/checkLessonTime',
  'post@courseApplication_submit': '/courseApplication/submit',
  'get@courseApplication_getDefaultTeacher': '/courseApplication/getDefaultTeacher',
  'get@courseApplication_strategiesDetails': '/courseApplication/strategiesDetails',
  'get@courseApplication_getTeacherBySubjectId': '/courseApplication/getTeacherBySubjectId',
  'get@subject_getExtendSubject': '/subject/getExtendSubject',
  /* **任务** */
  'get@teacher_isHaveTask': '/teacher/isHaveTask',

  /* **设班单管理** */
  'get@courseApplication_messageRecord': '/courseApplication/messageRecord', // 消息记录
  'get@courseApplication_curriculumArrangement': '/courseApplication/curriculumArrangement', // 排课情况
  'get@courseApplication_operationLog': '/courseApplication/operationLog', // 操作日志
  'get@courseApplication_getStudentInfo': '/courseApplication/getStudentInfo',
  'get@courseApplication_getContractType': '/courseApplication/getContractType',
  'get@courseApplication_isExistContract': '/courseApplication/isExistContract',
  'get@courseApplication_getContractUsable': '/courseApplication/getContractUsable',
  'get@courseApplication_getLearnDetail': '/courseApplication/getLearnDetail',
  'get@courseApplication_strategyList': '/courseApplication/strategyList',
  'get@courseApplication_strategiesInfo': '/courseApplication/strategiesInfo',
  'post@courseApplication_delStrategy': '/courseApplication/delStrategy',
  'post@courseApplication_rollbackStrategy': '/courseApplication/rollbackStrategy',
  'post@courseApplication_saveMessage': '/courseApplication/saveMessage', // 发送短信
  'post@courseApplication_saveStudyInfo': '/courseApplication/saveStudyInfo',
  'post@courseApplication_submitPlanOrder': '/courseApplication/submitPlanOrder',
  'get@distributionTeacher_listSearch': '/distributionTeacher/listSearch', // 正式设班单列表
  'get@distributionTeacher_conditionSearch': '/distributionTeacher/conditionSearch',
  'get@courseApplication_getLogWhere': '/courseApplication/getLogWhere', // 操作日志-操作人
  'get@courseApplication_getStudentStudyWhere': '/courseApplication/getStudentStudyWhere',
  'get@distributionTeacher_appliCant': '/scheduleList/appliCant', // 获取下属人员信息
  // 通时通次
  'get@call_communicationSearch': '/call/communicationSearch', // 搜索菜单
  'get@call_getGroupMember': '/call/getGroupMember', // 获取组员
  'get@call_communicationList': '/call/communicationList', // 列表数据
  // 通话录音
  'post@call_callRecordMediaList': '/call/callRecordMediaList', // 通话录音
  'get@call_getCallTypes': '/call/getCallTypes', // 获取呼叫类型
  'post@call_getRecordFile': '/call/getRecordFile', // 获取录音地址
  // 作业情况
  'get@evaluate_lookOperationSituation': '/evaluate/lookOperationSituation',
  'get@evaluate_operationSituation': '/evaluate/operationSituation',
  // 阶段性反馈
  'get@student_getStudentPeriodicFeedback': '/student/getStudentPeriodicFeedback',
  'get@student_getStudentReportSubject': '/student/getStudentReportSubject',
  'get@student_getViewReport': '/student/getViewReport',

  'get@scheduleList_listSearch': '/scheduleList/listSearch',
  'get@scheduleList_conditionSearch': '/scheduleList/conditionSearch',
  'get@courseApplication_getTeacherSchedule': '/courseApplication/getTeacherSchedule',

  // 考试试卷
  'get@exam_getList': '/exam/getList',
  'get@exam_detail': '/exam/detail',
  'get@exam_gradeList': '/exam/gradeList',
  'post@exam_add': '/exam/add',
  'post@exam_edit': '/exam/edit',
  'get@exam_getExamSubjects': '/exam/getExamSubjects',
  'get@exam_getExamTypes': '/exam/getExamTypes',
  // 作业及课后评价
  'post@lesson_feedbackList': '/lesson/feedbackList', // 课后反馈列表
  'get@lesson_feedbackComment': '/student/feedbackComment', // 反馈评价
  /* **补全资料** */
  'get@student_getStudentExamType': '/student/getStudentExamType', // 获取高考生类型
  /* **话术搜索** */
  'get@student_getKnowledge': '/student/getKnowledge', // 搜索
  'post@student_viewBehavior': '/student/viewBehavior', // 查看内容行为上报
  'get@student_getHotWords': '/student/getHotWords',
}
