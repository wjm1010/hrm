<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <template v-if="canGetStudentInfo">
      <template>
        <Info
          :indexInit="init"
          :roster-id="rosterId"
          :fixDialog="fixDialog"
          :student-info="studentInfo"
          :refresh.sync="refreshInfoTrackName">
        </Info>
        <Operating
          ref="operating"
          @show-communication-record-dialog="fixShowDialog"
          @change-refresh-info-track-name="changeRefreshInfoTrackName"

          :indexInit="init"
          :role-code="roleCode"
          :roster-id="rosterId"
          :student-id="studentId"
          :student-info="studentInfo"
          :operating-list-data="operatingListData">
        </Operating>

        <DetailModules :modules="modulesOrder">

          <AduitionTask
            v-if="dialog.communicationRecord.trackUserId === this.userId"
            :roster-id="rosterId"
            @router-jump="experienceClassEvent"
            slot="aduitionTask"
            class="aduition-task">
          </AduitionTask>
          <BasicInfo
            :roster-id="rosterId"
            :indexInit="init"
            slot="basicInfo"
            :fixDialog="fixDialog"
            :student-info="studentInfo"
            :wxBind="wxBind"
            class="basic-info-point"
          >
          </BasicInfo>

           <GoalSchool
            :indexInit="init"
            :roster-id="rosterId"
            slot="goalSchool"
            :student-info="studentInfo"
            class="goal-school-point">
          </GoalSchool>

          <LearnSituation
            :indexInit="init"
            :roster-id="rosterId"
            slot="learnSituation"
            :student-info="studentInfo"
            class="learn-situation-point">
          </LearnSituation>


          <StudentCirculation
            :roster-id="rosterId"
            slot="studentCirculation"
            class="student-circulation-point">
          </StudentCirculation>

          <Calendar
            slot="calendar"
            :roster-id="rosterId"
            :student-id="studentId"
            :student-info="studentInfo"
            class="calendar-point">
          </Calendar>

          <CommunicationDetails
            :roster-id="rosterId"
            :student-id="studentId"
            slot="communicationDetails"
            class="communication-details-point"
            :refresh.sync="refreshCommunicationDetails">
          </CommunicationDetails>

          <CalendarTable
            :fixDialog="fixDialog"
            :roster-id="rosterId"
            :student-id="studentId"
            :student-info="studentInfo"
            slot="calendarTable"
            class="calendar-table-point">
          </CalendarTable>

          <RestClass
            :roster-id="rosterId"
            slot="restClass"
            class="rest-class-point">
          </RestClass>

          <ClassTeacher
            :student-info="studentInfo"
            :indexInit="init"
            :fixDialog="fixDialog"
            :roster-id="rosterId"
            :student-id="studentId"
            slot="classTeacher"
            class="class-teacher-point">
          </ClassTeacher>

          <SingleMessage
            :roster-id="rosterId"
            slot="singleMessage"
            class="single-message-point">
          </SingleMessage>

        </DetailModules>
      </template>
      <CommitDetailDialog
        :indexInit="init"
        ref="commitDetailDialog"
        :fixDialog="fixDialog"
        :studentInfo = "studentInfo"
        :callId="showCommitDetailDialog.unFinishCallId"
        :serialNumber="showCommitDetailDialog.serialNumber"
        :studentIntentionId="showCommitDetailDialog.unFinishCallStudentIntentionId"
        :phoneName="showCommitDetailDialog.phoneName"
        :phone="showCommitDetailDialog.phone"
        v-show="false"
        v-if="showCommitDetailDialog.show">
      </CommitDetailDialog>
      <el-dialog
        :visible.sync="dialog.communicationRecord.show"
        @open="dialog.communicationRecord.openEvent"
        custom-class="el-dialog-md"
        class="dialog-communication-record">
        <p slot="title" class="dialog-title">
          <b>{{dialog.communicationRecord.title}}</b>
        </p>
        <el-form
          :model="dialog.communicationRecord.query"
          :ref="dialog.communicationRecord.refName"
          :rules="dialog.communicationRecord.rules"
          v-loading="loading">
          <el-form-item>
            <el-col :span="3">
              <span style="color:red">*</span> 沟通情况：
            </el-col>
            <el-col :span="4">
              <el-form-item prop="communicationSituation">
                <el-select v-model="dialog.communicationRecord.query.communicationSituation" clearable collapse-tags placeholder="请选择">
                  <el-option
                    v-for="item in dialog.communicationRecord.options.communicationSituation"
                    :key="item.key"
                    :label="item.val"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item v-if="dialog.communicationRecord.query.communicationSituation === '0'">
                <span class="sendTextMessage" @click="sendTextMessage">发送短信</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="dialog.communicationRecord.isReason">
              <el-form-item prop="refuseReason">
                <el-select v-model="dialog.communicationRecord.query.refuseReason" clearable collapse-tags placeholder="原因">
                  <el-option
                    v-for="item in dialog.communicationRecord.options.refuseReason"
                    :key="item.key"
                    :label="item.val"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item prop="communicationTools" label="沟通工具：" label-width="120px">
            <el-select v-model="dialog.communicationRecord.query.communicationTools" clearable filterable
                       class="width-70">
              <el-option
                v-for="(item, index) in dialog.communicationRecord.options.communicationTool"
                :key="index"
                :label="item.value"
                :value="item.code"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="通知家长："
            label-width="120px"
            v-if="notifyParentsShow">
            <div
              v-for="(item, index) in dialog.communicationRecord.notifyParents"
              :key="index"
              class="connect-task"
              :style="judgeDealStatus(item.isOk)"
              @click="changeTaskStatus(item)">
              <!-- <p class="font-pos-top">
                <span>推荐处理时间：{{item.start_time}}</span>
              </p> -->
              <p :class="judgeFontClass(item.isOk)" >{{item.type}}</p>
              <div class="icon-pos">
                <svg-icon icon-class="check" class="icon-width"></svg-icon><br>
                <span class="font-size" v-if="item.isOk">已沟通</span>
                <span class="font-size" v-else>未处理</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item prop="cmtContent" label="沟通内容：" label-width="120px" ref="communicationRecordCmtContent">
            <el-input
              :autosize='{minRows: 5, maxRows: 10}'
              type="textarea"
              class="width-70"
              v-model.trim="dialog.communicationRecord.query.cmtContent"
              placeholder="请输入沟通内容，最多500字"
              :maxlength="500"></el-input>
          </el-form-item>
          <el-form-item prop="nextCmtDateTime" label="下次沟通提醒：" label-width="120px">
            <el-date-picker
              v-model="dialog.communicationRecord.query.nextCmtDateTime"
              type="datetime"
              :defaultTime="dialog.communicationRecord.defaultTime"
              :editable="false"
              class="width-70"
              popper-class="rightAway"
              :picker-options="dialog.communicationRecord.pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer">
        <el-button
          @click="communicationRecordJudgeEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">提交
        </el-button>
      </span>
      </el-dialog>

      <el-dialog
        :visible.sync="msgdialog.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
        @open="openDialogEvent"
        @close="closeDialogEvent"
        custom-class="msgdialogdialogCall">
        <div>
          <p>
            将发送短信给 <span>{{studentInfo.phone}}</span>
          </p>
          <p>
            顾问手机
            <el-input
              type="text"
              placeholder="请输入手机号"
              :maxlength="11"
              v-model.trim="msgdialog.phone">
            </el-input>
          </p>
          <p>
            短信内容：
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【海风教育】尊敬的家长，您好！十分遗憾未能与您取得联系，我的电话是<span style="color: #409EFF">{{msgdialog.phone}}</span>，您可以随时与我<br>
            联系，我会优先为您的孩子安排试听课程，祝您生活愉快！更多课程介绍请关注「海风教育」公众号，或者
            直接<br>戳 <span @click="skip" style="color:#409EFF;cursor: pointer">www.hfjy.com</span>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialogEvent">取消</el-button>
          <el-button
            type="primary"
            class="dialogSubmit"
            @click="submitDialogEvent"
            :disabled="!canSearch">确定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="dialog.communicationChange.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
        :show-close="false"
        width="30%"
        class="communicationChange-change">
        <span>确认该名单为<span class="color-blue">{{dialog.communicationChange.content}}</span>？</span>
        <div slot="footer" class="margin-top">
          <el-button
            type="primary"
            class="dialog-submit"
            @click="cancleCommunicationChange">取消
          </el-button>
          <el-button
            type="primary"
            class="dialog-submit"
            @click="communicationRecordSubmitEvent">确定
          </el-button>
        </div>
      </el-dialog>
      <AnchorPoint :point-list="pointList"></AnchorPoint>
      <div callIdAttr="call-phone-dialog" class="communication-class" v-if="fixDialog.parentRandom" @click="fixShowDialog">沟通<br>记录</div>
    </template>
    <template v-if="!canGetStudentInfo">
      <div class="just-loading" v-loading="true"></div>
    </template>

  </div>
</template>
<script>
  import AduitionTask from './detail/aduitionTask' // 试听任务
  import Info from './detail/info' // 基础信息
  import Operating from './detail/operating' // 操作
  import BasicInfo from './detail/basicInfo' // 基础信息
  import GoalSchool from './detail/goalSchool' // 目标院校
  import LearnSituation from './detail/learnSituation' // 目标院校
  import StudentCirculation from './detail/studentCirculation' // 学生流转
  import ClassTeacher from './detail/classTeacher' // 课程老师
  import RestClass from './detail/restClass' // 剩余课时
  import SingleMessage from './detail/singleMessage' // 成单信息
  import CommunicationDetails from './detail/communicationDetails' // 沟通记录
  import Calendar from './detail/calendar' // 学生日历
  import CalendarTable from './detail/calendarTable' // 学生日历
  import DetailModules from '@/components/detailModules'
  import AnchorPoint from '@/components/anchorPoint'
  import CommitDetailDialog from './dialog/commitDetailDialog'

  import { get } from '@/utils/storage.js'
  import { mapGetters } from 'vuex'
  import { isvalidUsername } from '@/lib/validate'
  import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'

  export default {
    name: 'rosterdetail',
    components: {
      AduitionTask,
      Info,
      Operating,
      BasicInfo,
      GoalSchool,
      LearnSituation,
      StudentCirculation,
      CommunicationDetails,
      ClassTeacher,
      RestClass,
      SingleMessage,
      Calendar,
      CalendarTable,
      DetailModules,
      AnchorPoint,
      CommitDetailDialog
    },
    data() {
      return {
        wxBind: '',
        showCommitDetailDialog: {
          serialNumber: '',
          studentIntentionId: '',
          phoneName: '',
          phone: '',
          show: false,
          callId: ''
        },
        fixDialog: {
          parentRandom: ''
        },
        rosterId: '',
        studentId: '',
        studentInfo: {},
        dialog: {
          commitDetailDialog: {
            visible: false,
          },
          communicationRecord: {
            title: '添加沟通记录',
            show: false,
            isReason: true,
            query: {
              refuseReason: '',
              studentIntentionId: '',
              communicationSituation: '',
              communicationTools: '',
              nextCmtDateTime: '',
              cmtContent: '',
              nextTime: true,
              repeat: false
            },
            notifyParents: [], // 关联任务
            trackUserId: '',
            options: {
              communicationTool: [],
              communicationSituation: [],
              refuseReason: []
            },
            refName: 'communicationRecordRef',
            rules: {
              refuseReason: {
                required: true, message: '请选择拒绝原因', trigger: 'change'
              },
              cmtContent: {
                required: true, message: '请填写内容', trigger: 'change'
              },
              nextCmtDateTime: {
                required: true, trigger: 'change', validator: this.timePickerValidate
              },
              communicationTools: {
                required: true, message: '请选择沟通工具', trigger: 'change'
              },
              communicationSituation: {
                required: true, message: '请选择沟通情况', trigger: 'change'
              }
            },
            nowTime: new Date().getTime(),
            defaultTime: '18:30:00',
            pickerOptions: {
              disabledDate: this.disabledDate
            },
            openEvent: this.communicationRecordOpenEvent
          },
          communicationChange: {
            show: false,
            content: ''
          }
        },
        msgdialog: {
          show: false,
          phone: ''
        },
        canSearch: true,
        loading: false,
        canGetStudentInfo: false,
        roleCode: '',
        pointList: [
          {
            text: '试听<br/>任务',
            hrefId: '.aduition-task'
          },
          {
            text: '基本<br/>信息',
            hrefId: '.basic-info-point'
          },
          {
            text: '目标<br/>院校',
            hrefId: '.goal-school-point'
          },
          {
            text: '学习<br/>情况',
            hrefId: '.goal-school-point'
          },
          {
            text: '沟通<br/>记录',
            hrefId: '.communication-details-point'
          },
          {
            text: '课程<br/>安排',
            hrefId: '.calendar-table-point'
          },
          {
            text: '课程<br/>老师',
            hrefId: '.class-teacher-point'
          },
          {
            text: '成单<br/>信息',
            hrefId: '.single-message-point'
          },
          {
            text: '学生<br/>日历',
            hrefId: '.calendar-point'
          },
          {
            text: '剩余<br/>课时',
            hrefId: '.rest-class-point'
          },
          {
            text: '学生<br/>流转',
            hrefId: '.student-circulation-point'
          }
        ],
        operatingListData: [],
        refreshCommunicationDetails: false,
        refreshInfoTrackName: false,
        modulesOrder: ['aduitionTask', 'basicInfo', 'goalSchool', 'learnSituation', 'communicationDetails', 'calendarTable', 'classTeacher', 'singleMessage', 'calendar', 'restClass', 'studentCirculation']
      }
    },
    computed: {
      notifyParentsShow: function() {
        return this.dialog.communicationRecord.query.communicationSituation === '1' && this.dialog.communicationRecord.notifyParents.length && this.dialog.communicationRecord.trackUserId === this.userId
      },
      ...mapGetters(['userId', 'callStatus', 'departmentId', 'roleId'])
    },
    watch: {
      'dialog.material.query.birthday'(val) {
        if (val) {
          this.showYearConstellation(val)
        }
      },
      'dialog.communicationRecord.query.communicationSituation'(newVal) {
        if (newVal) {
          this.dialog.communicationRecord.query.refuseReason = ''
          this.refuseReasons()
        }

        if (newVal === '3' || newVal === '6') {
          this.dialog.communicationRecord.rules.nextCmtDateTime.required = false
        } else {
          this.dialog.communicationRecord.rules.nextCmtDateTime.required = true
        }

        if (newVal === '1' || newVal === '0') {
          this.dialog.communicationRecord.isReason = false
        } else {
          this.dialog.communicationRecord.isReason = true
        }
        if (newVal === '6') {
          this.dialog.communicationRecord.query.refuseReason = '8'
        } else {
          this.dialog.communicationRecord.query.refuseReason = ''
        }
        if (newVal === '0') {
          this.dialog.communicationRecord.query.cmtContent = '电话未接通'
        } else {
          this.$refs['communicationRecordCmtContent'].resetField()
        }
      }
    },
    created() {
      this.init()
      this.$eventBus.$on(`${this.rosterId}callLocal`, this.callPhoneLocal)
    },
    destroyed() {
      this.$eventBus.$off(`${this.rosterId}callLocal`, this.callPhoneLocal)
    },
    methods: {
      /* api */
      // get
      getTeacherIsHaveRole() {
        return this.$http.post('lesson_isHaveRole', {
          studentIntentionId: this.rosterId
        })
      },
      wxbindApi() {
        return this.$http.get('student_isBindWx', {
          params: {
            student_intention_id: this.rosterId
          },
          isFilterUrl: true
        })
      },
      studentInfoApi() {
        return this.$http.get('student_getStudentInformation', {
          params: {
            studentIntentionId: this.rosterId
          },
          isFilterUrl: true
        })
      },
      communicationTool() {
        return this.$http.get('student_getTools')
      },
      getCommunicationSituation() {
        return this.$http.get('student_getCommunicationSituation', {
          params: {
            saleStage2: this.studentInfo.sale_stage2
          }
        })
      },
      refuseReasons() {
        this.$http.get('student_getRefuseReason', {
          params: {
            communicationSituation: this.dialog.communicationRecord.query.communicationSituation
          }
        }).then(res => {
          if (res.data) {
            this.$set(this.dialog.communicationRecord.options, 'refuseReason', res.data)
          }
        }).catch(console.log)
      },
      getNotifyParents() { // 通知家长
        this.$http.get('saleTask_noticeParents', {
          params: {
            studentIntentionId: this.rosterId
          }
        }).then(res => {
          if (res.data) {
            this.dialog.communicationRecord.notifyParents = res.data.list
            this.dialog.communicationRecord.trackUserId = res.data.trackUserId
          }
        }).catch(console.log)
      },
      // post
      teacherAddCommunicationRecord(body) {
        return this.$http.post('student_addCommunicationRecord', Object.assign(body, {
          studentIntentionId: this.rosterId,
          knowOrigin: this.studentInfo.know_origin,
          coilIn: this.studentInfo.coil_in
        }), { isNoMessage: true })
      },
      /* 获取接口 */
      getStudentInfo() {
        this.studentInfoApi().then(res => {
          if (res.data) {
            this.studentId = res.data.info.student_id
            this.studentInfo = res.data.info
            this.canGetStudentInfo = true

            const userinfo = getUserInfoByCallPhone()
            if (userinfo && userinfo.unFinishCallStudentIntentionId) {
              this.$eventBus.$emit('clearCallSetTimeOut')
              this.$eventBus.$emit('startCallSetTimeOut')
              this.callPhoneLocal()
            }
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取微信绑定情况
      async getWxbind() {
        try {
          const res = await this.wxbindApi()
          if (res.data) {
            this.wxBind = res.data.wxBind
          }
        } catch (e) {
          console.error(e)
        }
      },
      callPhoneLocal() {
        const userinfo = getUserInfoByCallPhone()
        this.showCommitDetailDialog = userinfo
        this.showCommitDetailDialog.show = true
        this.$nextTick(() => {
          this.$refs.commitDetailDialog.callPhone('local')
        })
      },
      async init(bool) {
        try {
          if (bool) {
            this.fixDialog = {
              parentRandom: ''
            }
            this.canGetStudentInfo = false
          }
          this.rosterId = this.$route.params.rosterId
          const res = await this.getTeacherIsHaveRole()
          if (res.data) {
            this.roleCode = res.data.op
            this.operatingListData = res.data.data
            this.getStudentInfo()
            this.getWxbind()
          } else {
            this.$router.replace('/401')
          }
          this.getNotifyParents()
        } catch (e) {
          console.log(e)
        }
      },
      /* 沟通记录 */
      showCommunicationRecordDialog() {
        this.dialog.communicationRecord.show = true
        this.loading = true
        this.canSearch = false
        this.communicationTool().then(res => {
          if (res.data) {
            this.dialog.communicationRecord.options.communicationTool = res.data
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
          this.canSearch = true
        })
        this.getCommunicationSituation().then(res => {
          if (res.data) {
            this.dialog.communicationRecord.options.communicationSituation = res.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      communicationRecordOpenEvent() {
        this.dialog.communicationRecord.nowTime = new Date().getTime()
      },
      communicationRecordCloseEvent() {
        this.$refs[this.dialog.communicationRecord.refName].resetFields()
      },
      communicationRecordSubmitEvent() {
        this.$refs[this.dialog.communicationRecord.refName].validate(valid => {
          if (valid) {
            this.canSearch = false
            const copyObj = Object.assign({}, this.dialog.communicationRecord.query)
            this.teacherAddCommunicationRecord(copyObj).then(res => {
              if (res.code === '0x057000') {
                this.$confirm('学生的试听课未取消，请先去设班单取消并且通知老师喔！', '注意', {
                  confirmButtonText: '前往取消试听课',
                  cancelButtonText: '暂不取消',
                  type: 'warning',
                  center: true
                }).then(() => {
                  this.$router.push(`/lessonplanorder/list/${this.rosterId}`)
                }).catch(() => { return })
              }
              if (res.data) {
                this.dialog.communicationRecord.show = false
                this.communicationRecordCloseEvent()
                this.init(true)
                this.$message.success(res.message)
              }
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              this.canSearch = true
            })
            if (this.dialog.communicationRecord.notifyParents) {
              this.detalNoticeParents()
            }
          }
          this.dialog.communicationChange.show = false
        })
      },
      communicationRecordJudgeEvent() {
        const data = this.dialog.communicationRecord.query
        if (data.communicationSituation === '6' && data.refuseReason !== '') {
          this.dialog.communicationRecord.options.refuseReason.map(val => {
            if (val.key === data.refuseReason) {
              this.dialog.communicationChange.content = val.val
            }
          })
          this.dialog.communicationChange.show = true
        } else {
          this.communicationRecordSubmitEvent()
        }
      },
      detalNoticeParents() { // 处理通知家长
        const data = []
        const dealObj = {}
        this.dialog.communicationRecord.notifyParents.forEach(val => {
          if (val.isOk) {
            dealObj.id = val.id
            dealObj.end_time = val.end_time
            data.push(dealObj)
          }
        })
        if (!data.length) return
        this.$http.post('saleTask_closeNoticeParents', {
          data
        }).catch(console.log)
      },
      disabledDate(val) {
        const nowTime = this.dialog.communicationRecord.nowTime
        const valTime = new Date(val).getTime()
        if (valTime > (nowTime - 86400000) && valTime < (nowTime + 6 * 86400000)) {
          return false
        }
        return true
      },
      timePickerValidate(rule, value, callback) {
        if (!rule.required) {
          return callback()
        }
        if (!value) {
          return callback(new Error('请选择时间'))
        }
        const nowTime = new Date().getTime()
        if (nowTime > new Date(value).getTime()) {
          return callback(new Error('不能小于当前时间'))
        }
        const hourMinute = value.split(/\s/g)[1]
        if (hourMinute < '08:00:00' || hourMinute > '22:00:00') return callback(new Error('时间必须大于等于08:00并且小于等于22:00'))

        callback()
      },
      // 刷新跟进人信息
      changeRefreshInfoTrackName(bool) {
        this.refreshInfoTrackName = bool
        if (bool) {
          this.getStudentInfo()
          this.getWxbind()
        }
      },
      // 发送短信
      sendTextMessage() {
        this.msgdialog.show = true
      },
      openDialogEvent() {
        this.$set(this.msgdialog, 'phone', get('user_info').sessionUser.phone)
      },
      closeDialogEvent() {
        this.msgdialog.show = false
      },
      submitDialogEvent() {
        if (!isvalidUsername(this.msgdialog.phone)) {
          this.$message.warning('请输入正确的手机号！')
          return
        }
        this.canSearch = false
        this.$http.post('student_sendMessage', {
          studentIntentionId: this.rosterId,
          serialNo: '0',
          contactPhone: this.msgdialog.phone
        }).then(res => {
          this.$message.success('发送成功')
        }).finally(() => {
          this.msgdialog.show = false
          this.canSearch = true
        })
      },
      // 判断关联任务状态 高亮显示任务
      judgeDealStatus(bool) {
        let styles = ''
        if (bool) {
          styles = 'color: #4a9bb7;border: 1px solid #67c23a'
        } else {
          styles = ''
        }
        return styles
      },
      // 任务提示字体
      judgeFontClass(bool) {
        let className = ''
        if (bool) className = 'font-color-bottom'
        else className = 'font-pos-bottom'
        return className
      },
      // 关联任务状态改变
      changeTaskStatus(item) {
        item.isOk = !item.isOk
      },
      skip() {
        window.open('http://www.hfjy.com', '_blank')
      },
      cancleCommunicationChange() {
        this.dialog.communicationRecord.query.refuseReason = ''
        this.dialog.communicationChange.show = false
      },
      // 浮窗沟通记录
      fixShowDialog() {
        if (!this.fixDialog.parentRandom) {
          return this.showCommunicationRecordDialog()
        }

        this.$eventBus.$emit(this.fixDialog.parentRandom)
      },
      experienceClassEvent() { // 任务卡片跳转，体验课弹窗开启
        this.$refs['operating'].experienceClassBtnEvent()
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../styles/roster/detail.sass'
</style>
