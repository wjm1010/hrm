<template>
  <div
    class="call-phone"
    v-if="callStatus === '1' || callId"
  >
    <img :src="phoneIcon" @click="callPhone">
    <template v-if="isStudent">

      <el-dialog
        callIdAttr="call-phone-dialog"
        :visible.sync="callDialog.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
        :show-close="false"
        @open="callDialog.openEvent"
        custom-class="call-dialog">
        <el-form :model="callDialog.query" ref="callDialog.query"
                 :rules="callDialog.rules"
                 callIdAttr="call-phone-dialog"
                 v-loading="callDialog.loading"
                 label-width="130px" inline>
          <div class="recordTitle">
            为<i class="studentName">学生{{studentInfo.name}}</i>添加沟通记录
            <img :src="pickUp" alt="" class="pickUp" @click="hideDialog()" style="cursor: pointer">
          </div>
          <div class="infoTitle">
            <span>此次回访：{{currentPhoneName}}-{{currentPhone}}；回访工具：电话。</span>
          </div>
          <el-form-item label="选择回访任务：" prop="missionId" style="margin-right: 0;padding-right: 0">
            <el-select v-model="callDialog.query.missionId">
              <el-option
                callIdAttr="call-phone-dialog"
                v-for="(item,index) in callDialog.options.missionIds"
                :key="index"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select v-model="callDialog.query.status">
              <el-option
                callIdAttr="call-phone-dialog"
                v-for="item in callDialog.options.statuss"
                :key="item.label"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="content" label="沟通内容：">
            <el-input
              :autosize="{minRows: 5, maxRows: 10}"
              type="textarea"
              placeholder="请输入沟通内容，最多500字"
              :maxlength="500"
              v-model.trim="callDialog.query.content">
            </el-input>
          </el-form-item>
          <el-form-item label="回访时间：" prop="nextCmtDateTime" callIdAttr="call-phone-dialog">
            <el-date-picker
              v-model="callDialog.query.nextCmtDateTime"
              type="datetime"
              popper-class="rightAway"
              :editable="false"
              class="width-70"
              :picker-options="{disabledDate: pickerOptions}"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :defaultTime="callDialog.defaultTime"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-checkbox v-model="showDialog.canShow">继续填写"课后成绩变化反馈"</el-checkbox>
          <el-button
            @click="submitForm('callDialog.query',callDialog.query)"
            type="primary"
            class="dialogSubmit"
            :disabled="!canSearch">提交
          </el-button>
        </div>
      </el-dialog>
    </template>

    <!-- 呼叫失败 -->
    <el-dialog
      :visible.sync="fail"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="call-dialog">
      <div class="telephone">
        <p class="telephoneTitle">
          <svg-icon icon-class="warning1"></svg-icon>
          <span>拨号失败</span>
        </p>
        <p class="announcements">
          {{errorMessage}}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import phoneIcon from '@/assets/detail_images/phone.png'
  import pickUp from '@/assets/detail_images/pickUp.png'
  import { getToken, setToken } from '@/utils/auth'
  import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'
  export default {
    name: 'commitDetailDialog',
    props: {
      // 是否为学生
      isStudent: {
        type: Boolean,
        default: true
      },
      studentIntentionId: [String, Number],
      serialNumber: {
        type: [String, Number],
        default: '0'
      },
      teacherId: [String, Number],
      phone: {
        type: [String, Number],
        default: ''
      },
      showDialog: {
        required: true
      },
      indexInit: Function,
      phoneName: String,
      fixDialog: Object,
      studentInfo: Object,
      callId: String
    },
    data() {
      return {
        random: Math.random(),
        phoneIcon,
        pickUp,
        canSearch: true, // 提交按钮
        callBackId: this.callId, // 呼叫成功返回的id
        fail: false, // 呼叫失败
        currentPhoneName: this.phoneName ? this.phoneName : '主号',
        currentPhone: this.phone,
        currentExtraMessageId: this.serialNumber,
        errorMessage: '',
        callDialog: {
          loading: true,
          show: false,
          defaultTime: '18:30:00',
          options: {
            missionIds: [],
            statuss: []
          },
          query: localStorage.getItem('callPhoneDialogQuery') ? JSON.parse(localStorage.getItem('callPhoneDialogQuery')) : {
            missionId: '',
            status: '',
            content: '',
            nextCmtDateTime: ''
          },
          rules: {
            missionId: [
              { required: true, message: '请选择回访任务！', trigger: 'change' }
            ],
            status: [
              { required: true, message: '请选择处理情况!', trigger: 'change' }
            ],
            content: [
              { required: true, message: '请输入沟通内容！', trigger: 'change' }
            ],
            nextCmtDateTime: [
              { required: true, trigger: 'change', validator: this.timePickerValidate }
            ]
          },
          openEvent: this.communicationRecordsOpenEvent
        }, //  成单生 未接通 空错号 已接通
        initQuery: {
          missionId: '',
          status: '',
          content: '',
          nextCmtDateTime: ''
        }
      }
    },
    computed: {
      ...mapGetters(['userId', 'callStatus', 'departmentId', 'roleCode', 'roleId'])
    },
    methods: {
      ...mapMutations(['SET_PHONESTATUS']),
      /* api */
      postCallIndex() {
        if (this.currentExtraMessageId === this.serialNumber) {
          this.currentPhoneName = this.phoneName ? this.phoneName : '主号'
        }
        return this.$http.post('call_index', {
          businessUid: this.userId,
          departmentId: this.departmentId,
          roleCode: this.roleCode,
          roleId: this.roleId,
          studentIntentionId: this.studentIntentionId,
          serialNumber: this.currentExtraMessageId,
          teacherId: this.teacherId,
          callType: this.isStudent ? '1' : '2'
        }, { remote: 'iCP', disableTime: 5, isNoMessage: true })
      }, // 坐席外呼
      postCallTaskList() {
        return this.$http.post('call_taskList', {
          studentIntentionId: this.studentIntentionId
        }, { remote: 'iCP' })
      },
      postCall_recordSubmit(body) {
        return this.$http.post('call_recordSubmit', Object.assign({
          userId: this.userId,
          callId: this.callBackId,
          student_intention_id: this.studentIntentionId,
          clickState: 0
        }, body), { remote: 'iCP' })
      }, // 添加沟通记录
      // 设置下次回访时间格式
      pickerOptions(val) {
        const nowTime = new Date().getTime()
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
      /* 获取接口 */
      callPhone(islocal) {
        if (islocal === 'local') {
          this.hideDialog()
          return
        }
        const userinfo = getUserInfoByCallPhone()
        const studentName = this.studentInfo.name
        const studentNo = this.studentInfo.student_no
        if (userinfo && userinfo.unFinishCallStudentIntentionId) {
          return this.$message.error(`您刚才对${studentName}（${studentNo}）的电话还未添加沟通记录，请填写并保存沟通记录后再继续其它操作`)
        }
        this.callDialog.query = this.initQuery
        this.postCallIndex().then(res => {
          if (res.data) {
            this.$message.success('呼叫成功')
            if (this.isStudent) {
              const data = {
                unFinishCallStudentIntentionId: this.studentIntentionId,
                unFinishCallId: res.data.call_id,
                phoneName: this.phoneName,
                phone: this.phone,
                studentName,
                studentNo,
                serialNumber: this.currentExtraMessageId
              }
              setToken('user_info_local', JSON.stringify(data))
              // this.callDialog.show = true
              this.hideDialog()
              this.callBackId = res.data.call_id
              this.currentPhone = res.data.info[0].callPhone
              this.$eventBus.$emit('clearCallSetTimeOut')
              this.$eventBus.$emit('startCallSetTimeOut')
            }
          } else {
            this.errorMessage = res.message
            this.fail = true
          }
        }).catch(error => {
          console.log(error)
        })
      }, // 拨打电话号码
      communicationRecordsOpenEvent() {
        const _missionId = this.callDialog.query.missionId

        if (_missionId && _missionId === '0') {
          this.callDialog.options.statuss = [{ id: '0', label: '无' }]
        } else {
          this.callDialog.options.statuss = [{ id: '1', label: '已处理' }, { id: '0', label: '稍后处理' }]
        }

        this.postCallTaskList().then(res => {
          // visitType 回访类型：1:首呼回访；2:首课回访；3:首月回访；4:次月回访；5:日常回访;6:首课回访；7:阶段回访
          if (res.data) {
            const { list, nostart } = res.data
            let newList = []
            if (list && list.length) {
              newList = list.map(val => {
                const label = this.getVisitTypeStr(val.type, val.title)
                const timeLabel = this.updateValue(val)
                return { id: val.id, label: label + '-' + timeLabel.processingText }
              })
              newList.unshift({ id: '0', label: '仅回访，不处理任务' })
            } else {
              newList.unshift({ id: '0', label: '无回访任务' })
            }
            if (nostart && nostart.id) {
              this.callDialog.query.nextCmtDateTime = nostart.start_time
            }
            this.callDialog.options.missionIds = newList
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.callDialog.loading = false
        })
      }, // 接通了 弹框5 打开事件
      getVisitTypeStr(num, title) {
        var str = ''
        switch (num) {
          case '1':
            str = '首呼回访'
            break
          case '2':
            str = '首课回访'
            break
          case '3':
            str = '首月回访'
            break
          case '4':
            str = '次月回访'
            break
          case '6':
            str = '首课回访'
            break
          case '7':
            str = '阶段回访' + `-${title}`
            break
          case '8':
            str = '生日任务'
            break
          default:
            str = '日常回访'
        }
        return str
      }, // 回访type 1=>首呼回访
      updateValue(val) {
        const curDelEndTime = new Date() - Number(val.end_time)
        const curDelStartTime = new Date() - Number(val.start_time)

        const text = this.calculatingTime(Math.abs(curDelEndTime))
        if (curDelEndTime >= 0) { // 超时
          val.processingText = '已超时：' + text
          return val
        } else if (curDelStartTime <= 0) { // 未开始
          val.processingText = '未开始'
          return val
        }
        val.processingText = '倒计时：' + text
        return val
      }, // 字符串=> 倒计时1天2小时23分，未开始
      calculatingTime(curDelStartTime) {
        const day = Math.floor(curDelStartTime / 86400000)
        const dayText = day === 0 ? ' ' : day + '天'
        const hour = Math.floor((curDelStartTime - day * 86400000) / 3600000)
        const hourText = hour === 0 ? '00时' : hour + '时'
        const minute = Math.floor((curDelStartTime - day * 86400000 - hour * 3600000) / 60000)
        const minuteText = minute === 0 ? '00分' : minute + '分'
        return dayText + hourText + minuteText
      }, // 234234=>1天2小时23分
      submitForm(formName, body) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.canSearch = false
            this.postCall_recordSubmit(body).then(res => {
              if (res.data) {
                this.$eventBus.$emit('removeBodyDisabledClick')
                this.$eventBus.$emit('clearCallSetTimeOut')
                // this.$eventBus.$emit('restTimeObj')
                this.$message.success(res.message)
                setToken('user_info_local', '')
                this.SET_PHONESTATUS('')
                const user_info = JSON.parse(getToken('user_info'))
                delete user_info.sessionUser.call
                setToken('user_info', JSON.stringify(user_info))
                localStorage.setItem('callPhoneDialogQuery', JSON.stringify(this.initQuery))
                // 进步反馈
                if (this.showDialog.canShow) {
                  this.showDialog.show = true
                  this.showDialog.commtRecord = res.data.recordId
                } else {
                  this.indexInit(true)
                }
              }
            }).catch(error => {
              console.log(error)
              this.$message.error('系统错误')
            }).finally(() => {
              this.canSearch = true
            })
          } else {
            this.$message.warning('请完善内容！')
            this.canSearch = true
          }
        })
      }, // 所有弹框的提交操作
      hideDialog() {
        this.callDialog.show = false
        localStorage.setItem('callPhoneDialogQuery', JSON.stringify(this.callDialog.query))

        this.$eventBus.$off(this.random)
        this.$eventBus.$on(this.random, this.hideDialogEvent)
        this.fixDialog.parentRandom = this.random
      },
      hideDialogEvent() {
        this.callDialog.show = true
      }
    },
    watch: {
      'callDialog.query.missionId'(newVal) {
        if (!this.isStudent) {
          return
        }
        if (newVal === '0') {
          this.callDialog.options.statuss = [{ id: '0', label: '无' }]
        } else {
          this.callDialog.options.statuss = [{ id: '1', label: '已处理' }, { id: '0', label: '稍后处理' }]
        }
        this.callDialog.query.status = ''
      },
      'phone'(val) {
        this.currentPhone = val
      },
      'phoneName'(val) {
        this.currentPhoneName = val
      },
      'serialNumber'(val) {
        this.currentExtraMessageId = val
      }
    }
  }
</script>

<style lang="sass">
  .call-dialog
    width: 640px !important
    top: 50% !important
    left: 50% !important
    transform: translate(-50%,-50%) !important
    margin: auto !important
    position: absolute !important
    max-height: 95% !important
    overflow: auto !important
    padding: 0
    padding-bottom: 40px
    .recordTitle
      color: #4F607B
      font-size: 24px
      font-weight: 700
      padding-bottom: 15px
      margin: 10px
      border-bottom: 1px solid #cccccc
      margin-bottom: 20px
      .studentName
        font-style: normal
        color: #00A0E9
    .telephone
      .telephoneTitle
        font-weight: 700
        color: #4F607B
        text-align: center
        font-size: 24px
        margin: 0
        svg
          font-size: 40px
          margin-right: 15px
      ul
        font-size: 0
        padding: 0 70px
        margin-top: 20px
        li
          cursor: pointer
          list-style: none
          padding-top: 13px
          font-size: 18px
          display: inline-block
          width: 150px
          height: 152px
          text-align: center
          background: #eaecee
          font-weight: 700
          margin-right: 25px
          svg,i
            font-size: 50px
        li:first-child
          color: #4F607B
        li:nth-child(2)
          color: #66CC00
        li:last-child
          margin-right: 0px
          color: #F55D54
      .announcements
        background: #eaecee
        line-height: 85px
        text-align: center
        color: #4f607b
      .backup
        display: inline-block
        margin-left: 200px
        margin-top: 26px
        vertical-align: top
      .backupNumber
        color: #4f607b
        display: inline-block
        padding-left: 0
        li
          list-style-type: none
          line-height: 40px
    .infoTitle
      background: #eaecee
      line-height: 50px
      text-align: center
      margin-bottom: 20px
    .selectPercent
      width: 207px !important
    .el-form-item,.el-dialog__footer
      padding-right: 20px
    .el-select,.el-date-editor,.el-cascader
      width: 100%
    .el-textarea
      width: 402px
      height: 100px
    .el-textarea__inner
      height: 100px !important
    .templateMsg
      background: #eaecee
      padding: 10px
      margin-bottom: 20px
      p
        margin: 0
        margin-left: 30px
  .pickUp
    width: 20px
    height: 20px
    float: right
</style>
