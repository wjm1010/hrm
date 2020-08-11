<template>
  <div>
    <el-dialog
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="el-dialog-lg"
      :loading="loading"
      title="添加面试"
      @close="$emit('closeEv')">
        <el-form :rules="rules" :model="query" ref="query" label-width="140px" inline>
          <el-form-item label="面试日期：" prop="resumeInterviewDate">
            <el-date-picker
              v-model="query.resumeInterviewDate"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item><br>
          <el-form-item label="面试学科：" prop="resumeInterviewSubject">
            <el-select v-model="query.resumeInterviewSubject" @change="changeUser">
              <el-option
                v-for="item in options.userSubject"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面试官：" prop="resumeInterviewUser">
            <el-select v-model="query.resumeInterviewUser" @change="changeTime">
              <el-option
                v-for="item in options.subjectInterview"
                :key="item.userName"
                :label="item.userName"
                :value="item.userName">
              </el-option>
            </el-select>
          </el-form-item><br>
          <el-form-item class="TimeSchedule">
            <div class="title">
              <span>时间段</span>
              <span>总数（剩余可约）</span>
            </div>
            <div>
              <p class="TimeContent" v-for="(item,index) in options.timeList" :key="index">
                <span>{{item.interviewerSchedulerStartTime}}-{{item.interviewerSchedulerEndTime}}</span>
                <span v-if="item.interviewerSchedulerCount==='0'" style="color:#fff;background: #f90">已约满</span>
                <el-radio-group v-model="selectBtn" v-else @change="SelectButton(item)">
                  <el-radio-button :label="index">
                    {{item.interviewerSchedulerNum}}（{{item.interviewerSchedulerCount}}）
                  </el-radio-button>
                </el-radio-group>
              </p>
            </div>
          </el-form-item><br>
          <el-form-item label-width="52px">
            <el-checkbox v-model="query.resumeInterviewMail" true-label="1">邮件通知候选人</el-checkbox>
            <a @click="lookEmail">预览邮件</a>
          </el-form-item><br>
          <el-form-item label-width="52px">
            <el-checkbox v-model="query.resumeInterviewMsg" true-label="1">短信通知候选人</el-checkbox>
            <a @click="lookMsg">预览短信</a>
          </el-form-item><br>
          <el-form-item class="fr">
            <el-button @click="$emit('closeEv')">取消</el-button>
            <el-button type="primary" :disabled="!isCanSearch" @click="submit('query')">确定</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="el-dialog-md"
      :loading="loading"
      @close="dialogVisible === false">
      <div v-html="message"></div>
    </el-dialog>
  </div>
</template>
<script>
export default{
  mounted() {
    this.dialogShow = true
  },
  data() {
    return {
      dialogShow: false,
      dialogVisible: false,
      isCanSearch: true,
      loading: false,
      selectBtn: '',
      message: '',
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      query: {
        resumeInterviewDate: '',
        resumeInterviewSubject: '',
        resumeInterviewUser: '',
        resumeInterviewUserId: '',
        resumeInterviewMail: '',
        resumeInterviewMsg: '',
        resumeInterviewTimeId: '',
        resumeId: this.resumeId
      },
      options: {
        userSubject: [],
        subjectInterview: [],
        timeList: []
      },
      allOptions: {},
      rules: {
        resumeInterviewDate: [
          { required: true, message: '请选择面试日期', trigger: 'change' }
        ],
        resumeInterviewSubject: [
          { required: true, message: '请选择面试学科', trigger: 'change' }
        ],
        resumeInterviewUser: [
          { required: true, message: '请选择面试官', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    Name: {
      type: String
    },
    resumeId: {
      type: String,
      require: false
    },
    resumeTeachingDept: String,
    resumeProperty: {
      type: String
    }
  },
  created() {
  },
  watch: {
    'query.resumeInterviewDate'(val) {
      if (val) {
        this.query.resumeInterviewSubject = ''
        this.query.resumeInterviewUser = ''
        this.query.resumeInterviewTimeId = ''
        this.selectBtn = ''
        this.options = {}
        this.getOption()
      }
    },
    'query.resumeInterviewSubject'(val) {
      if (val) {
        this.query.resumeInterviewUser = ''
        this.query.resumeInterviewTimeId = ''
        this.selectBtn = ''
        this.getOption()
      }
    },
    'query.resumeInterviewUser'(val) {
      if (val) {
        this.selectBtn = ''
        this.query.resumeInterviewTimeId = ''
      }
    }
  },
  methods: {
    disabledDate(val) {
      const nowTime = new Date().getTime()
      const valTime = new Date(val).getTime()
      if (valTime > (nowTime - 86400000)) {
        return false
      }
      return true
    }, // 日期限制
    getOption() {
      this.loading = true
      this.$http.post('resume_getInterviewTime', {
        resumeInterviewDate: this.query.resumeInterviewDate,
        educationDeptId: this.resumeTeachingDept,
        resumeProperty: this.resumeProperty
      }).then(res => {
        if (res.data) {
          this.allOptions = res.data
          this.options.userSubject = res.data.userSubject
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    },
    changeUser() {
      this.options.subjectInterview = this.allOptions.subjectInterview[this.query.resumeInterviewSubject]
    }, // 选择面试官
    changeTime() {
      this.options.timeList = this.allOptions.timeList[this.query.resumeInterviewUser]
    }, // 选择时间段
    SelectButton(item) {
      this.query.resumeInterviewTimeId = item.interviewerSchedulerId
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.options.subjectInterview.map(key => {
            if (key.userName === this.query.resumeInterviewUser) {
              this.query.resumeInterviewUserId = key.userId
            }
          })
          this.isCanSearch = false
          this.$http.post('resume_addInterview', this.query).then(res => {
            if (res.data) {
              this.$message.success(res.message)
              this.$emit('change-refresh-getlist')
              this.dialogShow = false
            }
          }).catch(console.log).finally(() => {
            this.isCanSearch = true
          })
        }
        return false
      })
    },
    lookEmail() {
      if (!this.query.resumeInterviewTimeId) {
        this.$message.warning('请先选择时间段，在预览邮件！')
        return false
      }
      this.$http.post('resume_previewMail', {
        resumeId: this.resumeId,
        resumeInterviewTimeId: this.query.resumeInterviewTimeId,
        resumeInterviewSubject: this.query.resumeInterviewSubject,
        resumeInterviewDate: this.query.resumeInterviewDate
      }).then(res => {
        if (res.data) {
          this.dialogVisible = true
          this.message = res.data[0]
        }
      }).catch(console.log)
    }, // 预览邮件
    lookMsg() {
      this.$alert(this.Name + '老师您好，考核邀请及试讲资料已发到您的邮箱，请您查收，谢谢！【海风教育】'
        , '短信模板', {
          showConfirmButton: false,
          center: true,
          callback: action => { return }
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.active
  background: #a9d4ff
.el-input
  width: 200px
.TimeSchedule
  text-align: center
  width: 100%
  .title
    font-size: 0px
    span
      background: #ff9
      font-size: 14px
      width: 250px
      border: 1px solid #ccc
      display: inline-block
    span:last-child
      border-left: 0
  .TimeContent
    font-size: 0px
    margin-top: -5px
    .el-radio-group
      margin-top: -10px
    .el-radio-button
      width: 100% !important
      margin-top: 2px
    .el-radio-button:last-child .el-radio-button__inner
      border-radius: 0 !important
      width: 100% !important
    span,.el-radio-group
      font-size: 14px
      cursor: pointer
      width: 250px
      border: 1px solid #ccc
      display: inline-block
      border-top: 0
    span:last-child,.el-radio-group:last-child
      border-left: 0
      border-top: 0
</style>
<style lang="sass">
.TimeContent
  .el-radio-button:first-child:last-child .el-radio-button__inner
    border-radius: 0 !important
    width: 100% !important
    transition: all 0s cubic-bezier(.645,.045,.355,1)
    border: none
    outline: none
    -webkit-tap-highlight-color: #000000
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
</style>


