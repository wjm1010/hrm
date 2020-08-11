<template>
  <div class="call-phone" v-if="callStatus === '1' || callId">
    <img class="phone-icon" :style="phoneIconStyle" :src="phoneIcon" @click="callPhone">
    <template v-if="isStudent">
      <el-dialog
        callIdAttr="call-phone-dialog"
        :visible.sync="callDialog.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :append-to-body="true"
        @open="callDialog.openEvent"
        custom-class="call-dialog">
        <el-form
          callIdAttr="call-phone-dialog"
          :model="callDialog.query"
          ref="callDialog.query"
          :rules="callDialog.rules"
          v-loading="callDialog.loading"
          label-width="140px" inline>
          <div class="recordTitle">
            为<i class="studentName">学生{{studentInfo.name}}</i>添加沟通记录
            <img :src="pickUp" class="pickUp" @click="hideDialog()" style="cursor: pointer">
          </div>
          <div class="infoTitle">
            <span>此次回访：{{currentPhoneName}}-{{currentPhone}}；回访工具：电话。</span>
          </div>
          <el-form-item prop="communicationSituation" label="跟进情况：" style="margin-right: 0;padding-right: 0">
            <el-select v-model="callDialog.query.communicationSituation" @change="getNotifyParents" clearable filterable>
              <el-option
                callIdAttr="call-phone-dialog"
                v-for="(item, index) in callDialog.options.intentionIds"
                :key="index"
                :label="item.val"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="callDialog.query.communicationSituation === '0'" callIdAttr="call-phone-dialog">
            <span class="sendTextMessage" @click="sendTextMessage">发送短信</span>
          </el-form-item>
          <el-form-item prop="refuseReason" v-if="callDialog.isReason">
            <el-select v-model="callDialog.query.refuseReason" clearable filterable>
              <el-option
                callIdAttr="call-phone-dialog"
                v-for="(item, index) in callDialog.options.rejectIds"
                :key="index"
                :label="item.val"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item><br>

          <el-form-item
            label="通知家长："
            label-width="140px"
            v-if="notifyParentsShow">
            <div
              v-for="(item, index) in callDialog.notifyParents"
              :key="index"
              class="cmt-connect-task"
              :style="judgeDealStatus(item.isOk)"
              @click="changeTaskStatus(item)">
              <p :class="judgeFontClass(item.isOk)" >{{item.type}}</p>
              <div class="cmt-icon-pos">
                <svg-icon icon-class="check" class="cmt-icon-width"></svg-icon><br>
                <span class="cmt-font-size" v-if="item.isOk">已沟通</span>
                <span class="cmt-font-size" v-else>未处理</span>
              </div>
            </div>
          </el-form-item>


          <el-form-item prop="cmtContent" label="沟通内容：" ref="abandonedCallCmtContent">
            <el-input
              :autosize="{minRows: 5, maxRows: 10}"
              type="textarea"
              placeholder="请输入沟通内容，最多500字"
              :maxlength="500"
              v-model.trim="callDialog.query.cmtContent">
            </el-input>
          </el-form-item>
          <el-form-item label="下次沟通时间：" prop="nextCmtDateTime" ref="NextCmtDateTime" callIdAttr="call-phone-dialog">
            <el-date-picker
              v-model="callDialog.query.nextCmtDateTime"
              type="datetime"
              :defaultTime="callDialog.defaultTime"
              clearable
              popper-class="rightAway"
              :editable="false"
              :picker-options="{disabledDate: pickerOptions}"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="communicationRecordJudgeEvent('callDialog.query',callDialog.query)"
            type="primary"
            class="dialogSubmit"
            :disabled="!canSearch">提交
          </el-button>
        </div>
      </el-dialog>
    </template>
    <!-- 发送短信 -->
    <el-dialog
      :visible.sync="msgdialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      @open="openDialogEvent"
      @close="closeDialogEvent"
      custom-class="msgdialogdialogCall">
      <div callIdAttr="call-phone-dialog">
        <p>
          将发送短信给 <span>{{currentPhone}}</span>
        </p>
        <p>
          顾问手机
          <el-input
            type="text"
            :maxlength="11"
            placeholder="请输入手机号"
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
      <div slot="footer" class="dialog-footer" callIdAttr="call-phone-dialog">
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
        :visible.sync="communicationChange.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
        :show-close="false"
        width="30%"
        class="communicationChange-change">
        <span>确认该名单为<span class="color-blue">{{communicationChange.content}}</span>？</span>
        <div slot="footer" class="margin-top" callIdAttr="call-phone-dialog">
          <el-button
            type="primary"
            class="dialog-submit"
            @click="cancleCommunicationChange">取消
          </el-button>
          <el-button
            type="primary"
            class="dialog-submit"
            @click="submitForm('callDialog.query',callDialog.query)">确定
          </el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import { isvalidUsername } from '@/lib/validate'
  import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'
  import { mapGetters, mapMutations } from 'vuex'
  import { get } from '@/utils/storage.js'
  import phoneIcon from '../icons/icon-phone.png'
  import pickUp from '@/assets/detail_images/pickUp.png'
  import { getToken, setToken } from '@/utils/auth' // getToken from cookie

  export default {
    name: 'commitDetailDialog',
    props: {
      // 是否为学生
      isStudent: {
        type: Boolean,
        default: true
      },
      phoneIconStyle: {
        type: Object,
        default: {}
      },
      studentIntentionId: [String, Number],
      phone: {
        type: [String, Number],
        default: ''
      },
      serialNumber: {
        type: [String, Number],
        default: '0'
      },
      teacherId: [String, Number],
      phoneName: String,
      fixDialog: Object,
      indexInit: Function,
      studentInfo: Object,
      callId: String
    },
    data() {
      return {
        random: Math.random(),
        pickUp,
        phoneIcon,
        canSearch: true,
        callBackId: this.callId, // 呼叫成功返回的id
        currentPhoneName: this.phoneName ? this.phoneName : '主号',
        currentPhone: this.phone,
        currentExtraMessageId: this.serialNumber,
        callDialog: {
          show: false,
          isReason: true,
          loading: true,
          defaultTime: '18:30:00',
          query: localStorage.getItem('callPhoneDialogQuery') ? JSON.parse(localStorage.getItem('callPhoneDialogQuery')) : {
            nextCmtDateTime: '',
            cmtContent: '',
            communicationSituation: '',
            refuseReason: ''
          },
          openEvent: this.abandonedCallOpenEvent,
          options: {
            intentionIds: [],
            rejectIds: []
          },
          notifyParents: [], // 通知家长
          trackUserId: '',
          rules: {
            cmtContent: { required: true, message: '请输入沟通内容！', trigger: 'change' },
            nextCmtDateTime: { required: true, trigger: 'change', validator: this.timePickerValidate },
            communicationSituation: { required: true, message: '请选择跟进情况！', trigger: 'change' },
            refuseReason: { required: true, message: '请选择拒绝原因！', trigger: 'change' }
          }
        }, // 未接通 添加沟通记录
        initQuery: {
          nextCmtDateTime: '',
          cmtContent: '',
          communicationSituation: '',
          refuseReason: ''
        },
        communicationChange: {
          show: false,
          content: ''
        },
        msgdialog: {
          show: false,
          phone: ''
        },
      }
    },
    computed: {
      notifyParentsShow: function() {
        return this.callDialog.query.communicationSituation === '1' && this.callDialog.notifyParents.length && this.callDialog.trackUserId === this.userId
      },
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
        }, { remote: 'iCP', disableTime: 5 })
      }, // 坐席外呼
      getAbandonedCall() {
        return this.$http.get('student_getCommunicationSituation', {
          params: {
            saleStage2: this.studentInfo.sale_stage2
          }
        })
      }, // 获取跟进情况
      getStudentGetRefuseReason(communicationSituation) {
        return this.$http.get('student_getRefuseReason', {
          params: {
            communicationSituation
          }
        })
      }, // 跟进=》拒绝原因
      postCall_recordSubmit(body) {
        return this.$http.post('lesson_callAddCommunicate', Object.assign({
          callId: this.callBackId,
          studentIntentionId: this.studentIntentionId,
          clickState: 0,
          coilIn: this.studentInfo.coil_in,
          knowOrigin: this.studentInfo.know_origin,
          nextTime: true,
          repeat: false,
          communicationTools: '1'
        }, body), { isNoMessage: true })
      }, // 添加沟通记录
      pickerOptions(val) {
        const nowTime = new Date().getTime()
        const valTime = new Date(val).getTime()
        if (valTime > (nowTime - 86400000) && valTime < (nowTime + 6 * 86400000)) {
          return false
        }
        return true
      }, // 设置下次回访时间格式

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
        if (bool) className = 'cmt-font-color-bottom'
        else className = 'cmt-font-pos-bottom'
        return className
      },
      // 关联任务状态改变
      changeTaskStatus(data) {
        data.isOk = !data.isOk
      },
      getNotifyParents(val) { // 通知家长
        if (val !== '1') return
        this.$http.get('saleTask_noticeParents', {
          params: {
            studentIntentionId: this.studentIntentionId
          }
        }).then(res => {
          if (res.data) {
            this.callDialog.notifyParents = res.data.list
            this.callDialog.trackUserId = res.data.trackUserId
          }
        }).catch(console.log)
      },
      callPhone(local) {
        if (local === 'local') {
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

              const talkData = {
                cno: res.data.cno,
                callId: res.data.call_id,
                studentIntentionId: this.studentIntentionId,
                haveWordsRecommended: false
              }
              localStorage.setItem('CALL_TALK_MESSAGE', JSON.stringify(talkData))
              this.$eventBus.$emit('beginToConnect', true)
              this.$eventBus.$emit('clearCallSetTimeOut')
              this.$eventBus.$emit('startCallSetTimeOut')
            }
          }
        }).catch(console.log)
      }, // 拨打电话号码
      abandonedCallOpenEvent() {
        const _communicationSituation = this.callDialog.query.communicationSituation
        if (_communicationSituation) {
          this.getRefuseReason(_communicationSituation)
        }

        if (_communicationSituation === '3' || _communicationSituation === '6') {
          this.callDialog.rules.nextCmtDateTime.required = false
        } else {
          this.callDialog.rules.nextCmtDateTime.required = true
        }

        if (_communicationSituation === '1' || _communicationSituation === '0') {
          this.callDialog.isReason = false
        } else {
          this.callDialog.isReason = true
        }

        this.getAbandonedCall().then(res => {
          if (res.data) {
            this.callDialog.options.intentionIds = res.data
          }
        }).catch(console.log).finally(() => {
          this.callDialog.loading = false
        })
      },
      getRefuseReason(val) {
        this.getStudentGetRefuseReason(val).then(res => {
          if (res.data) {
            this.callDialog.options.rejectIds = res.data
          }
        }).catch(console.log)
      },
      communicationRecordJudgeEvent(formName, body) {
        const data = this.callDialog.query
        if (data.communicationSituation === '6' && data.refuseReason !== '') {
          this.callDialog.options.rejectIds.map(val => {
            if (val.key === data.refuseReason) {
              this.communicationChange.content = val.val
            }
          })
          this.communicationChange.show = true
        } else {
          this.submitForm(formName, body)
        }
      },
      cancleCommunicationChange(bool) {
        if (bool) {
          this.communicationChange.show = false
        } else {
          this.callDialog.query.refuseReason = ''
          this.communicationChange.show = false
        }
      },
      submitForm(formName, body) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.canSearch = false
            this.postCall_recordSubmit(body).then(res => {
              if (res.code === '0x057000') {
                this.$confirm('学生的试听课未取消，请先去设班单取消并且通知老师喔！', '注意', {
                  confirmButtonText: '前往取消试听课',
                  cancelButtonText: '暂不取消',
                  type: 'warning',
                  center: true
                }).then(() => {
                  this.$router.push(`/lessonplanorder/list/${this.studentIntentionId}`)
                }).catch(() => { return })
              }
              if (res.data) {
                this.$eventBus.$emit('removeBodyDisabledClick')
                this.$eventBus.$emit('clearCallSetTimeOut')
                // this.$eventBus.$emit('restTimeObj')
                this.$message.success(res.message)
                setToken('user_info_local', '')
                const user_info = JSON.parse(getToken('user_info'))
                delete user_info.sessionUser.call
                setToken('user_info', JSON.stringify(user_info))
                this.SET_PHONESTATUS('')
                localStorage.setItem('callPhoneDialogQuery', JSON.stringify(this.initQuery))
                this.callDialog.show = false
                this.indexInit(true)
              } else {
                this.$message.error(res.message)
              }
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              this.canSearch = true
            })
            if (this.callDialog.notifyParents) {
              this.detalNoticeParents()
            }
          } else {
            this.$message.warning('请完善内容！')
          }
        })
        this.communicationChange.show = false
      }, // 所有弹框的提交操作
      detalNoticeParents() { // 处理通知家长
        const data = []
        const dealObj = {}
        this.callDialog.notifyParents.forEach(val => {
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
        if (hourMinute < '08:00' || hourMinute > '22:00') return callback(new Error('时间必须大于等于08:00并且小于等于22:00'))

        callback()
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
          studentIntentionId: this.studentIntentionId,
          serialNo: this.currentExtraMessageId,
          contactPhone: this.msgdialog.phone
        }).then(res => {
          this.$message.success('发送成功')
        }).finally(() => {
          this.msgdialog.show = false
          this.canSearch = true
        })
      },
      skip() {
        window.open('http://www.hfjy.com', '_blank')
      },
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
      'callDialog.query.communicationSituation'(newVal) {
        if (!this.isStudent) {
          return
        }
        if (newVal) {
          this.callDialog.query.refuseReason = ''
          this.getRefuseReason(newVal)
        }
        if (newVal === '3' || newVal === '6') {
          this.callDialog.rules.nextCmtDateTime.required = false
        } else {
          this.callDialog.rules.nextCmtDateTime.required = true
        }

        if (newVal === '1' || newVal === '0') {
          this.callDialog.isReason = false
        } else {
          this.callDialog.isReason = true
        }

        if (newVal === '6') {
          this.callDialog.query.refuseReason = '8'
        } else {
          this.callDialog.query.refuseReason = ''
        }

        if (newVal === '0') {
          this.callDialog.query.cmtContent = '电话未接通'
        } else {
          this.callDialog.query.cmtContent = ''
          this.$refs['abandonedCallCmtContent'] && this.$refs['abandonedCallCmtContent'].clearValidate()
        }
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
    .phone-icon
      width: 24px
      height: 24px
    .sendTextMessage
      color: #409EFF
      margin-left: 20px
      cursor: pointer
    .call-dialog,.msgdialogdialogCall
      width: 640px !important
      top: 50% !important
      left: 50% !important
      transform: translate(-50%, -50%) !important
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
            svg, i
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
          margin-top: 25px
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
      .el-form-item, .el-dialog__footer
        padding-right: 20px
      .el-select, .el-date-editor, .el-cascader
        width: 100%
      .el-textarea__inner
        height: 100px
      .templateMsg
        background: #eaecee
        padding: 10px
        margin-bottom: 20px
        p
          margin: 0
          margin-left: 30px
    .msgdialogdialogCall
      width: 810px !important
      padding: 10px
      p
        margin-left: 20px
      p:nth-child(1)
        margin-left: 0
        font-size: 18px
        color: #000
        span
          color: #409EFF
      p:nth-child(2)
        .el-input
          width: 30%
          margin-left: 20px
      p:nth-child(4)
        line-height: 25px
    .expandTabledialogCall
      height: 500px
      .el-dialog__body
        height: 415px
        overflow-y: scroll
    .pickUp
      width: 20px
      height: 20px
      float: right

    .communicationChange-change
      .color-blue
        color: #409EFF
      .margin-top
        margin-top: 20px


    .cmt-connect-task
      display: flex
      width: 300px
      border: 1px solid #e0e6f7
      border-radius: 4px
      margin-bottom: 10px
      padding-right: 5px
      cursor: pointer
      align-items: center
      .cmt-icon-pos
        margin-left: 50px
        line-height: 20px
        .cmt-icon-width
          width: 30px
          height: 30px
          margin-left: 7px
        .cmt-font-size
          font-size: 15px
      .cmt-font-pos-bottom
        width: 60%
        margin-left: 10px
        line-height: 25px
      .cmt-font-color-bottom
        width: 60%
        line-height: 25px
        margin-left: 10px
        color: black
</style>
