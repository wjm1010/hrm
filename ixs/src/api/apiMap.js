export default {
  // SSO
  'post@sso_login': '/passport/ssoLogin', // SSO 三合一登录
  'post@sso_user': '/passport/ssoUser', // SSo 获取用户信息
  // 通用API
  'get@teacher_getDate': '/teacher/getDate', // 获取服务器当前时间
  'post@index_searchUser': '/index/searchUser', // 全局搜索
  'get@search_getLesson': '/search/getLesson', // 意向课程
  'post@search_getGroupMember': '/search/getGroupMember', // 获取组员
  'get@search_getMembers': '/search/getMembers', // 获取组
  'get@search_getSaleStage': '/search/getSaleStage', // 销售阶段
  /* ****** 沟通详情页 ****** */
  'get@student_getIntentionLesson': '/student/getIntentionLesson', // 意向课程
  'post@lesson_isHaveRole': '/lesson/isHaveRole', // 沟通详情权限判断  ***
  /* **通用信息** */
  'get@student_isBindWx': '/student/isBindWx',
  'get@student_getStudentInfo': '/student/getStudentInfo', // 学生基本信息
  'get@student_getStudentInformation': '/student/getStudentInformation', // 学生基本信息（更新）
  'post@teacher_addCommunicationRecord': '/teacher/addCommunicationRecord',
  /* **头像信息** */
  'get@student_getCommunicationTools': '/student/getCommunicationTools', // 通讯工具条
  /* **操作项** */
  'get@student_allowAttendClass': '/student/allowAttendClass',
  'get@student_attendClassList': '/student/attendClassList',
  'get@lesson_isCanLookOrder': '/lesson/isCanLookOrder', // 判断能否看成单登记
  'get@student_arrangeExperienceCourse': '/student/arrangeExperienceCourse',
  'get@student_getCommunicationSituation': '/student/getCommunicationSituation',
  'get@student_followUpSituation': '/student/followUpSituation',
  'get@student_getRefuseReason': '/student/getRefuseReason',
  'get@student_getTools': '/student/getTools',
  'post@student_addCommunicationRecord': '/student/addCommunicationRecord',
  'get@student_resetPwd': '/student/resetPwd', // 密码重置
  'post@passport_sendMsg': '/passport/sendMsg', // 忘记密码（发送短信获取验证码）
  'post@passport_verificationCode': '/passport/verificationCode', // 忘记密码（验证code）
  'post@passport_PasswordRecovery': '/passport/PasswordRecovery', // 忘记密码（重置密码）
  'post@student_completionStudentData': '/student/completionStudentData',
  'post@student_completionStudentInfo': '/student/completionStudentInfo', // 补全资料（跟新）
  'get@student_openClient': '/student/openClient', // 开通客户端
  'get@student_getConstellation': '/student/getConstellation', // 获取生肖信息
  'get@teacher_turnOverList': '/teacher/turnOverList',
  'get@student_getSubjectName': '/student/getSubjectName',
  'get@student_getArea': '/student/getArea',
  'get@student_getCity': '/student/getCity',
  'get@student_getListProvince': '/student/getListProvince',
  'get@student_getGrade': '/student/getGrade',
  'get@student_getExtractPhone': '/student/getExtractPhone',
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
  /* **学生流转** */
  'get@lesson_latelyFollower': '/lesson/latelyFollower',
  /* **学生日历***/
  'post@lesson_studentCalendarList': '/lesson/studentCalendarList', // 学生日历
  'post@lesson_studentCalendarAll': '/lesson/studentCalendarAll', // 学生日历
  'post@lesson_calendarStatistics': '/lesson/calendarStatistics', // 日历统计
  /* **沟通记录列表** */
  'post@lesson_communicationRecordList': '/lesson/communicationRecordList',

  /* **老师基本信息** */
  'get@student_getTeacherInfo': '/student/getTeacherInfo',
  /* **话术提醒** */
  'get@student_talk': '/student/talk',
  /* **剩余课时** */
  'get@student_periodShow': '/student/periodShow',
  /* **成单信息** */
  'get@student_getContractList': '/student/getContractList',
  /* **日历列表** */
  'get@teacher_studentCalendar': '/teacher/studentCalendar',
  'get@teacher_studentCalendarParam': '/teacher/studentCalendarParam',
  'post@lesson_cancelPlan': '/lesson/cancelPlan', // 废课
  'get@teacher_adjustmentTimeParam': '/teacher/adjustmentTimeParam',
  'get@teacher_adjustmentTime': '/teacher/adjustmentTime',
  'post@lesson_cancelExperienceclass': '/lesson/cancelExperienceclass', // 取消体验课
  'post@lesson_experienceclassTime': '/lesson/experienceclassTime', // 调整体验课
  /* **任务** */
  'get@teacher_isHaveTask': '/teacher/isHaveTask',
  // 登录相关
  'post@passport_login': '/passport/login',
  'get@passport_logout': '/passport/logout',
  'post@passport_passwordChange': '/passport/passwordChange', // 修改密码
  // 首页
  'get@index_summaryNum': '/index/summaryNum',
  'post@lesson_lessonStatistics': '/lesson/lessonStatistics',
  'post@lesson_saleFirstLesson': '/lesson/saleFirstLesson',
  'get@lesson_homePageLessonList': '/lesson/homePageLessonList',
  'post@lesson_studentCalendarParam': '/lesson/studentCalendarParam',
  'post@lesson_homePageCalendarOld': '/lesson/homePageCalendarOld',
  'get@student_todayCallDuration': '/student/todayCallDuration',
  'get@student_todayCallTotal': '/student/todayCallTotal',
  'get@users_getTrackUser': '/users/getTrackUser', // 内部推荐人数
  'get@users_getMyQrCode': '/users/getMyQrCode', // 内部推荐码
  // 名单跟进
  'post@follow_priorityToDo': '/follow/priorityToDo',
  'post@follow_newNameList': '/follow/newNameList',
  'post@follow_noAnswer': '/follow/noAnswer',
  'post@follow_now': '/follow/now',
  'post@users_index': '/users/index',
  'post@follow_addMark': '/follow/addMark',
  'post@follow_allotStudentApi': '/follow/allotStudentApi',
  'post@follow_cancelMark': '/follow/cancelMark',
  'get@follow_repeatThreadTotal': '/follow/repeatThreadTotal', // 重复进线名单总数
  'post@follow_repeatThread': '/follow/repeatThread', // 重复进线名单
  // 设班单
  'post@order_start': '/order/start',
  'post@order_reject': '/order/reject',
  'post@order_waitCommunicate': '/order/waitCommunicate',
  'post@order_waitFeedback': '/order/waitFeedback',
  'post@order_feedbackFollowUp': '/order/feedbackFollowUp',
  'post@order_cancel': '/order/cancel',
  // 合同管理
  'post@contract_signSubmit': '/contract/signSubmit',
  'post@contract_sign': '/contract/sign',
  'post@contract_signed': '/contract/signed',
  // 报名
  'get@course_searchApplyCourse': '/course/searchApplyCourse', // 报名-报名课程搜索
  'get@course_applyCourse': '/course/applyCourse', // 报名-报名课程列表
  'post@course_addApplyCourse': '/course/addApplyCourse', // 报名-添加报名课程
  // 查看手机号日志
  'post@student_phoneLog': '/student/phoneLog',
  // 发送短信
  'post@student_sendMessage': '/student/sendMessage',
  // 呼叫添加沟通记录
  'post@lesson_callAddCommunicate': '/lesson/callAddCommunicate',
  // OC获取名单
  'post@recycle_getOcName': '/recycle/getOcName',
  'get@recycle_auditionsLessonLog': '/recycle/auditionsLessonLog',
  'get@recycle_auditionsList': '/recycle/auditionsList', // oc页面获取沟通情况
  'get@recycle_isDistributionSale': '/recycle/isDistributionSale', // OC 名单添加沟通记录
  'get@student_getOcContractList': '/student/getOcContractList',
  'get@recycle_getMenus': '/recycle/getMenus',
  'get@recycle_newNameTotal': '/recycle/newNameTotal', // 当日获取新名单数量接口
  // 左侧菜单栏数字
  'get@sale_getTotalNum': '/menunumber/index',
  // 通时通次
  'get@call_communicationSearch': '/call/communicationSearch', // 搜索菜单
  'get@call_getGroupMember': '/call/getGroupMember', // 获取组员
  'get@call_communicationList': '/call/communicationList', // 列表数据
  // 通话录音
  'post@call_callRecordMediaList': '/call/callRecordMediaList', // 通话录音
  'get@call_getCallTypes': '/call/getCallTypes', // 获取呼叫类型
  'post@call_getRecordFile': '/call/getRecordFile', // 获取录音地址
  // 寻回名单
  'get@recycle_isCanReturn': '/recycle/isCanReturn',
  // 成单中
  'post@contract_order': '/contract/order', // 成单列表
  'get@contract_menu': '/contract/searchMenu', // 成单菜单
  // 呼叫
  'post@recycle_callOut': '/recycle/callOut', // oc外呼2018.11.15
  // 话术提醒
  'post@speech_getBdToken': '/speech/getBdToken',
  'post@speech_saveLog': '/speech/saveLog',
  /* **销售任务** */
  'get@task_phase': '/task/taskPhase',
  'get@task_taskList': '/task/taskList',
  'post@saleTask_buriedData': '/saleTask/buriedData', // 数据埋点
  // 试听课任务
  'get@saleTask_noticeParents': '/saleTask/noticeParents', // 添加沟通记录-通知家长
  'get@saleTask_auditionCancellationReason': '/saleTask/auditionCancellationReason', // 试听课取消原因
  'get@task_taskStudent': '/task/taskStudent', //  学生详情任务
  'post@saleTask_cancelAudition': '/saleTask/cancelAudition', //  取消试听课
  'post@saleTask_attendOptLog': '/saleTask/attendOptLog', //  学生试听课出席记录
  'post@saleTask_replaceLessonTime': '/saleTask/replaceLessonTime', //  更换试听课时间
  'post@saleTask_closeNoticeParents': '/saleTask/closeNoticeParents', //  沟通记录-处理通知家长通知
  'get@saleTask_lessonInfo': '/saleTask/lessonInfo', //  确认出席-试听课信息
  'post@saleTask_updateMatter': '/saleTask/updateMatter', //  确认出席-关闭出席确认事项和提示
  /* **补全资料** */
  'get@student_getStudentExamType': '/student/getStudentExamType', // 获取高考生类型
  /* **话术搜索** */
  'get@student_getKnowledge': '/student/getKnowledge', // 搜索
  'post@student_viewBehavior': '/student/viewBehavior', // 查看内容行为上报
  'get@student_getHotWords': '/student/getHotWords',
}
