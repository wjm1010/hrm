<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <template v-if="canGetStudentInfo">
      <template>
        <Info
          :indexInit="init"
          :fixDialog="fixDialog"
          :roster-id="rosterId"
          :student-info="studentInfo"
          :refresh.sync="refreshInfoTrackName"
          :showDialog="dialog.progressFeedback">
        </Info>
        <Operating
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
          <BasicInfo
            :roster-id="rosterId"
            :indexInit="init"
            :fixDialog="fixDialog"
            slot="basicInfo"
            :student-info="studentInfo"
            :wxBind="wxBind"
            class="basic-info-point"
            :showDialog="dialog.progressFeedback">

          </BasicInfo>

          <TestScore
            :roster-id="rosterId"
            slot="testScore"
            class="test-score-point">
          </TestScore>

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
            slot="communicationDetails"
            class="communication-details-point"
            :refresh.sync="refreshCommunicationDetails">
          </CommunicationDetails>

          <RestClass
            :roster-id="rosterId"
            slot="restClass"
            class="rest-class-point">
          </RestClass>

          <ClassTeacher
            :indexInit="init"
            :fixDialog="fixDialog"
            :roster-id="rosterId"
            :student-id="studentId"
            :student-info="studentInfo"
            slot="classTeacher"
            class="class-teacher-point"
            :showDialog="dialog.progressFeedback">
          </ClassTeacher>

          <SingleMessage
            :roster-id="rosterId"
            slot="singleMessage"
            class="single-message-point">
          </SingleMessage>

          <WordsRemind
            :roster-id="rosterId"
            slot="wordsRemind"
            class="words-remind-point">
          </WordsRemind>

          <Dashboard
            :roster-id="rosterId"
            :fixDialog="fixDialog"
            :student-info="studentInfo"
            :indexInit="init"
            slot="dashboard"
            class="dashboard-point"
            @change-refresh-communication-details="changeRefreshCommunicationDetails"
            :showDialog="dialog.progressFeedback">
          </Dashboard>
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
        v-if="showCommitDetailDialog.show"
        :showDialog="dialog.progressFeedback">
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
          v-loading="loading"
          label-width="120px">
          <el-form-item prop="communicationTool" label="沟通工具：">
            <el-select v-model="dialog.communicationRecord.query.communicationTool" clearable filterable
                       class="width-70">
              <el-option
                v-for="(item, index) in dialog.communicationRecord.options.communicationTool"
                :key="index"
                :label="item.value"
                :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="communicationContent" label="沟通内容：">
            <el-input
              :autosize="{minRows: 5, maxRows: 10}"
              type="textarea"
              class="width-70"
              autosizeautosize
              v-model.trim="dialog.communicationRecord.query.communicationContent"
              placeholder="请输入沟通内容，最多500字"
              :maxlength="500"></el-input>
          </el-form-item>
          <el-form-item prop="nextTime" label="下次沟通提醒：">
            <el-date-picker
              v-model="dialog.communicationRecord.query.nextTime"
              type="datetime"
              :editable="false"
              class="width-70"
              popper-class="rightAway"
              :picker-options="dialog.communicationRecord.pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              :defaultTime="dialog.communicationRecord.defaultTime"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer">
        <el-checkbox v-model="dialog.progressFeedback.canShow">继续填写"课后成绩变化反馈"</el-checkbox>
        <el-button
          @click="dialog.communicationRecord.submitEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">提交
        </el-button>
      </span>
      </el-dialog>

      <ProgressFeedback
        v-if="dialog.progressFeedback.show"
        :showDialog="dialog.progressFeedback"
        :indexInit="init"
        :roster-id="rosterId">
      </ProgressFeedback>
      <AnchorPoint :point-list="pointList"></AnchorPoint>

      <div callIdAttr="call-phone-dialog" class="communication-class" v-if="fixDialog.parentRandom" @click="fixShowDialog">沟通<br>记录</div>

    </template>
    <template v-if="!canGetStudentInfo">
      <div class="just-loading" v-loading="true"></div>
    </template>
  </div>
</template>

<script>
  import Info from './detail/info' // 基础信息
  import Operating from './detail/operating' // 操作
  import BasicInfo from './detail/basicInfo' // 基础信息
  import GoalSchool from './detail/goalSchool' // 目标院校
  import LearnSituation from './detail/learnSituation' // 目标院校
  import StudentCirculation from './detail/studentCirculation' // 学生流转
  import ClassTeacher from './detail/classTeacher' // 课程老师
  import WordsRemind from './detail/wordsRemind' // 话术提醒
  import RestClass from './detail/restClass' // 剩余课时
  import SingleMessage from './detail/singleMessage' // 成单信息
  import CommunicationDetails from './detail/communicationDetails' // 沟通记录
  import Calendar from './detail/calendar' // 学生日历
  import Dashboard from './detail/dashboard' // 待回访列表
  import CommitDetailDialog from './dialog/commitDetailDialog'
  import ProgressFeedback from './dialog/progressFeedback.vue' // 进步反馈
  import TestScore from './detail/testScore'

  import DetailModules from '@/components/detailModules'
  import AnchorPoint from '@/components/anchorPoint'
  import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'
  export default {
    name: 'rosterdetail',
    components: {
      Info,
      Operating,
      BasicInfo,
      GoalSchool,
      LearnSituation,
      StudentCirculation,
      CommunicationDetails,
      CommitDetailDialog,
      ClassTeacher,
      WordsRemind,
      RestClass,
      SingleMessage,
      Calendar,
      Dashboard,
      DetailModules,
      AnchorPoint,
      TestScore,
      ProgressFeedback
    },
    data() {
      return {
        wxBind: {},
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
          communicationRecord: {
            title: '添加沟通记录',
            show: false,
            query: {
              studentIntentionId: '',
              communicationTool: '',
              communicationContent: '',
              nextTime: ''
            },
            options: {
              communicationTool: []
            },
            refName: 'communicationRecordRef',
            rules: {
              communicationTool: {
                required: true, message: '请选择', trigger: 'change'
              },
              communicationContent: {
                required: true, message: '请填写内容', trigger: 'change'
              },
              nextTime: {
                required: true, trigger: 'change', validator: this.timePickerValidate
              }
            },
            nowTime: new Date().getTime(),
            defaultTime: '18:30:00',
            pickerOptions: {
              disabledDate: this.disabledDate
            },
            submitEvent: this.communicationRecordSubmitEvent,
            openEvent: this.communicationRecordOpenEvent
          },
          progressFeedback: {
            canShow: false,
            show: false,
            commtRecord: ''
          }
        },
        canSearch: true,
        loading: false,
        canGetStudentInfo: false,
        roleCode: '',
        pointList: [
          {
            text: '任务<br/>提醒',
            hrefId: '.dashboard-point'
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
            text: '教材<br/>信息',
            hrefId: '.learn-situation-point'
          },
          {
            text: '考试<br/>成绩',
            hrefId: '.test-score-point'
          },
          {
            text: '剩余<br/>课时',
            hrefId: '.rest-class-point'
          },
          {
            text: '学生<br/>日历',
            hrefId: '.calendar-point'
          },
          {
            text: '沟通<br/>记录',
            hrefId: '.communication-details-point'
          },
          {
            text: '成单<br/>信息',
            hrefId: '.single-message-point'
          },
          {
            text: '课程<br/>老师',
            hrefId: '.class-teacher-point'
          },
          {
            text: '话术<br/>提醒',
            hrefId: '.words-remind-point'
          },
          {
            text: '学生<br/>流转',
            hrefId: '.student-circulation-point'
          }
        ],
        operatingListData: [],
        refreshCommunicationDetails: false,
        refreshInfoTrackName: false,
        modulesOrder: ['dashboard', 'basicInfo', 'goalSchool', 'learnSituation', 'testScore', 'restClass', 'calendar', 'communicationDetails', 'singleMessage',
          'classTeacher', 'wordsRemind', 'studentCirculation']
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
        return this.$http.get('teacher_isHaveRole', {
          params: {
            studentIntentionId: this.rosterId
          }, isFilterUrl: true
        })
      },
      studentInfoApi() {
        return this.$http.get('student_getStudentInformation', {
          params: {
            student_intention_id: this.rosterId
          }, isFilterUrl: true
        })
      },
      wxbindApi() {
        return this.$http.get('student_isBindWx', {
          params: {
            studentIntentionId: this.rosterId
          }, isFilterUrl: true
        })
      },
      communicationTool() {
        return this.$http.get('teacher_communicationTool')
      },
      // post
      teacherAddCommunicationRecord(body) {
        return this.$http.post('teacher_addCommunicationRecord', Object.assign(body, {
          studentIntentionId: this.rosterId
        }))
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
          this.$message.error('获取学生信息失败')
        })
      },
      // 获取微信绑定情况
      async getWxbind() {
        const res = await this.wxbindApi()
        if (res.data) {
          this.wxBind = res.data
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
            this.dialog.communicationRecord.options.communicationTool = res.data.tool
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取沟通工具失败')
        }).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      communicationRecordOpenEvent() {
        this.dialog.communicationRecord.nowTime = new Date().getTime()
      },
      communicationRecordSubmitEvent() {
        this.$refs[this.dialog.communicationRecord.refName].validate(valid => {
          if (valid) {
            this.canSearch = false
            this.teacherAddCommunicationRecord(this.dialog.communicationRecord.query).then(res => {
              if (res.data) {
                this.$message.success(res.message)
                this.$refs[this.dialog.communicationRecord.refName].resetFields()
                this.dialog.communicationRecord.show = false
                // 进步反馈
                if (this.dialog.progressFeedback.canShow) {
                  this.dialog.progressFeedback.show = true
                  this.dialog.progressFeedback.commtRecord = res.data.recordId
                } else {
                  this.init(true)
                }
              } else {
                this.$message.error(res.message)
              }
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              this.canSearch = true
            })
          }
        })
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
      // 刷新沟通记录
      changeRefreshCommunicationDetails() {
        this.refreshCommunicationDetails = true
      },
      // 刷新跟进人信息
      changeRefreshInfoTrackName() {
        this.refreshInfoTrackName = true
        this.getStudentInfo()
        this.getWxbind()
      },
      // 浮窗沟通记录
      fixShowDialog() {
        if (!this.fixDialog.parentRandom) {
          return this.showCommunicationRecordDialog()
        }

        this.$eventBus.$emit(this.fixDialog.parentRandom)
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../styles/roster/detail.sass'
</style>
