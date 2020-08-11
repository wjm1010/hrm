
<template>
	<div class="dashboard-container">
    <template v-if="canGetStudentInfo">
      <Info
        :callId="callId"
        :phoneStatus="callStatus"
        :phoneStatusObj="phoneStatusObj"
        @btnCommunication="btnCommunication"
        @show-dialogCommunicationRecord="showDialogCommunicationRecord"
        @show-next-single="showNextSingle">
      </Info>

      <operating :indexInit="init"></operating>

      <basic-info @show-dialogCommunicationRecord="showDialogCommunicationRecord"></basic-info>

      <GoalSchool :indexInit="init" :roster-id="rosterId" slot="goalSchool" :student-info="studentInfo" class="goal-school-point"></GoalSchool>

      <LearnSituation :indexInit="init" :roster-id="rosterId" slot="learnSituation" :student-info="studentInfo" class="learn-situation-point"></LearnSituation>

      <orderInformation></orderInformation>

      <communication-record ref="record"></communication-record>

      <!-- 添加沟通记录 -->
      <div v-show="dialog.communicationRecord.showDialogView">
        <el-dialog
          :visible.sync="dialog.communicationRecord.show"
          :modal="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          custom-class="el-dialog-md el-dialog-headjl"
          @close="communicationRecordCloseEvent">
          <el-form :model="dialog.communicationRecord.query"
            :ref="dialog.communicationRecord.refName"
            :rules="dialog.communicationRecord.rules"
            inline
            label-width="120px">
            <img :src="pickUp" alt="" class="pickUp" @click="communicationRecordPickUp" style="cursor: pointer">
            <div class="recordTitle">
              为<i class="studentName">学生{{studentInfo.name}}</i>添加沟通记录
            </div>
            <el-form-item label="沟通情况:" prop="communicationSituation">
              <el-select v-model="dialog.communicationRecord.query.communicationSituation" placeholder="请选择">
                <el-option v-for="(item, index) in dialog.communicationRecord.options.situation"
                  :key="index"
                  class="input-width"
                  :value="item.key"
                  :label="item.val">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="refuseReason" v-if="dialog.communicationRecord.isReason">
              <el-select v-model="dialog.communicationRecord.query.refuseReason" clearable filterable>
                <el-option
                  v-for="(item, index) in dialog.communicationRecord.options.rejectIds"
                  :key="index"
                  :label="item.val"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="cmtContent" label="沟通内容：">
              <el-input
                class="width-70"
                type="textarea"
                placeholder="请输入详细原因，最多500字"
                :maxlength="500"
                :autosize="{ minRows: 5, maxRows: 10}"
                v-model.trim="dialog.communicationRecord.query.cmtContent">
              </el-input>
            </el-form-item>
            <el-form-item label="下次沟通日期：" prop="nextCmtDateTime">
              <el-date-picker
                v-model="dialog.communicationRecord.query.nextCmtDateTime"
                popper-class="rightAway"
                type="datetime"
                placeholder="选择日期"
                :defaultTime="dialog.communicationRecord.defaultTime"
                :picker-options="dialog.communicationRecord.pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              class="dialogSubmit"
              @click="sumbitCommunication"
              :disabled="!canSearch">保存
            </el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="提示"
          width="35%"
          :visible.sync="dialog.nextSingle.show"
          :append-to-body="true"
          :close-on-click-modal="false">
          <span class="dialg-font-pos">
            即将获取新名单，您是否已做好准备？<br>
            <span class="font-color-red">(请确保已经添加沟通记录)</span>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="getNextSingle">确 定</el-button>
            <el-button @click="dialog.nextSingle.show = false">取 消</el-button>
          </span>
        </el-dialog>

      </div>
      <div class="to-top">
        <div class="open-list-btn" @click="btnCommunication">沟通<br>记录</div>
      </div>
    </template>
	</div>
</template>

<script>
import Info from './detail/Info' // 基础信息
import Operating from './detail/operating' // 操作
import BasicInfo from './detail/basicInfo' // 基础信息
import GoalSchool from '../roster/detail/goalSchool' // 目标院校
import LearnSituation from '../roster/detail/learnSituation' // 学习情况
import CommunicationRecord from './detail/communicationRecord' // 沟通记录
import orderInformation from './detail/orderInformation.vue' // 成单信息
import pickUp from '@/assets/detail_images/pickUp.png'
import { getOcInfo } from '@/utils/getInfoMethods.js'

import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'accessListDetail',
  components: {
    Info,
    Operating,
    BasicInfo,
    GoalSchool,
    LearnSituation,
    CommunicationRecord,
    orderInformation
  },
  data() {
    return {
      // 呼叫
      callStatus: '',
      phoneStatusObj: {},
      ocCallSetTimeOutId: '',
      ocCallPhoneMessage: {},
      setTimeFunNum: 1000,
      // 呼叫
      pickUp,
      dialog: {
        // 添加沟通记录
        communicationRecord: {
          showDialogView: false,
          show: false,
          isReason: false,
          query: {
            communicationSituation: '',
            refuseReason: '',
            cmtContent: '',
            nextCmtDateTime: '',
          },
          options: {
            situation: [],
            rejectIds: []
          },
          nowTime: new Date().getTime(),
          defaultTime: '18:30:00',
          pickerOptions: {
            disabledDate: this.disabledDate
          },
          refName: 'communicationRecordRef',
          rules: {
            communicationSituation: {
              required: true, message: '请选择沟通情况！', trigger: 'change'
            },
            cmtContent: {
              required: true, message: '请输入沟通内容！', trigger: 'change'
            },
            nextCmtDateTime: {
              required: true, trigger: 'change', validator: this.timePickerValidate
            },
            situation: {
              required: true, message: '请选择处理情况!', trigger: 'change'
            },
            refuseReason: { required: true, message: '请选择拒绝原因！', trigger: 'change' }
          }
        },
        // 获取下一条
        nextSingle: {
          show: false
        }
      },
      canSearch: true,
      loading: false,
      canGetStudentInfo: false,
      callId: this.$route.query.callRecordId, // 呼叫ID
      saveData: {}
    }
  },
  computed: {
    ...mapGetters(['rosterId', 'studentId', 'studentInfo', 'departmentId', 'userId', 'roleCode', 'roleId'])
  },
  created() {
    this.init()
    this.unwatch = this.$watch('$route', this.watchRouter)

    this.$eventBus.$on('ocStartCallSetTimeOut', this.ocStartCallSetTimeOut)
  },
  destroyed() {
    this.unwatch && this.unwatch()
    this.unwatch = null
  },
  activated() {
    if (!this.unwatch) {
      this.unwatch = this.$watch('$route', this.watchRouter)
    }
  },
  deactivated() {
    this.unwatch && this.unwatch()
    this.unwatch = null
  },
  watch: {
    'dialog.communicationRecord.query.communicationSituation'(val) {
      if (val) {
        this.dialog.communicationRecord.query.refuseReason = ''
        this.getRefuseReason(val)
      }

      if (val === '1' || val === '0') {
        this.dialog.communicationRecord.isReason = false
      } else {
        this.dialog.communicationRecord.isReason = true
      }

      if (val === '0' || val === '3' || val === '6') {
        this.dialog.communicationRecord.rules.nextCmtDateTime.required = false
      } else {
        this.dialog.communicationRecord.rules.nextCmtDateTime.required = true
      }
    }
  },
  methods: {
    ...mapActions([
      'setRosterId',
      'setStudentId',
      'setStudentInfo'
    ]),
    async init(bool) {
      try {
        if (bool) {
          this.canGetStudentInfo = false
        }
        this.setRosterId(this.$route.query.accessListDetailRosterId)
        this.getStudentInfo()
      } catch (e) {
        console.log(e)
      }
    },
    getStudentInfo() {
      this.studentInfoApi().then(res => {
        if (res.data) {
          this.setStudentInfo(res.data.info)
          this.setStudentId(res.data.info.student_id)
          this.canGetStudentInfo = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    studentInfoApi() {
      return this.$http.get('student_getStudentInformation', {
        params: {
          studentIntentionId: this.rosterId
        }
      })
    },
    // 获取沟通记录下拉
    getStudentGetRefuseReason(communicationSituation) {
      return this.$http.get('student_getRefuseReason', {
        params: {
          communicationSituation
        }
      })
    }, // 跟进=》拒绝原因
    getRefuseReason(val) {
      this.getStudentGetRefuseReason(val).then(res => {
        if (res.data) {
          this.dialog.communicationRecord.options.rejectIds = res.data
        }
      }).catch(console.log)
    },
    getOptionsOfCommunication() {
      this.$http.get('recycle_auditionsList', {
        params: {
          studentIntentionId: this.rosterId
        }
      }).then(res => {
        if (res.data) {
          this.canSearch = false
          if (res.data.length === 0) {
            this.dialog.communicationRecord.options.situation = []
            return
          }
          this.dialog.communicationRecord.options.situation = res.data
        }
      }).catch(console.log).finally(() => {
        this.canSearch = true
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
    // 添加沟通记录
    addCommunication(copyData) {
      const ocInfo = getOcInfo()
      const callId = this.callId || (ocInfo && ocInfo.ocCallId)
      return this.$http.get('recycle_isDistributionSale', {
        params: Object.assign(copyData, {
          nextTime: true,
          repeat: false,
          communicationTools: '1',
          knowOrigin: this.studentInfo.know_origin,
          coilIn: this.studentInfo.coil_in,
          studentIntentionId: this.rosterId,
          callId,
          departmentId: this.departmentId,
          relateUserId: this.userId
        })
      })
    },
    communicationRecordCloseEvent() {
      this.$refs[this.dialog.communicationRecord.refName].resetFields()
    },
    // 沟通记录收起show
    communicationRecordPickUp() {
      this.dialog.communicationRecord.showDialogView = false
    },
    // 沟通记录弹出if
    showDialogCommunicationRecord(data) {
      window.localStorage.setItem('OC_Call_Obj', JSON.stringify({
        ocCallId: data.call_id
      }))
      this.$eventBus.$emit('changeOcTypeView', '3')
      this.$eventBus.$emit('start-callPhone', false)
      this.callId = data.call_id
      this.ocClearCallSetTimeOut()
      this.ocStartCallSetTimeOut()
      this.getOptionsOfCommunication()
    },
    // 沟通记录保存
    sumbitCommunication() {
      this.$refs[this.dialog.communicationRecord.refName].validate(valid => {
        if (valid) {
          this.canSearch = false
          this.addCommunication(this.dialog.communicationRecord.query).then(res => {
            if (res.data) {
              this.$eventBus.$emit('start-callPhone', true)
              this.$eventBus.$emit('restTimeObj')
              this.ocClearCallSetTimeOut()
              this.$message.success(res.message)
              localStorage.setItem('OC_Call_Obj', '')

              this.$router.replace({
                path: '/accessList/detail',
                query: {
                  accessListDetailRosterId: this.rosterId,
                  hasCommunicationRecord: '1',
                  random: Math.random()
                }
              })
              return this.$store.dispatch('delVisitedViews', { name: 'accessListDetail', path: '/accessList/detail' })
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('保存失败')
          }).finally(() => {
            this.canSearch = true
          })
        } else {
          this.$message.warning('提交失败')
        }
      })
    },
    // 沟通记录悬浮
    btnCommunication() {
      const ocInfo = getOcInfo()
      const callId = this.callId || (ocInfo && ocInfo.ocCallId)
      if (callId) {
        this.dialog.communicationRecord.showDialogView = true
        this.dialog.communicationRecord.show = true
        this.getOptionsOfCommunication()
      } else {
        this.$message.warning({
          dangerouslyUseHTMLString: true,
          message: '电话呼叫此名单后，才允许添加沟通记录，<br>如果无法正常呼出请直接点击下一条！'
        })
      }
    },
    // 下一条弹窗
    showNextSingle() {
      this.dialog.nextSingle.show = true
    },
    // 获取下一条名单
    getNextSingle() {
      this.$http.post('recycle_getOcName', { action: 'next' }).then(res => {
        this.$eventBus.$emit('get-newName-total')
        if (res.data) {
          this.$eventBus.$emit('start-callPhone', true)
          this.$eventBus.$emit('restTimeObj')
          this.ocClearCallSetTimeOut()
          localStorage.setItem('OC_Call_Obj', '')

          const { studentIntentionId: accessListDetailRosterId, hasCommunicationRecord } = res.data
          this.$router.replace({
            path: '/accessList/detail',
            query: { accessListDetailRosterId, hasCommunicationRecord }
          })
          this.dialog.nextSingle.show = false
          return this.$store.dispatch('delVisitedViews', { name: 'accessListDetail', path: '/accessList/detail' })
        }
      }).catch(console.log)
    },
    // watch router
    watchRouter() {
      if (!this.$route.query.accessListDetailRosterId || this.$route.query.accessListDetailRosterId === this.rosterId) {
        return
      }
      this.canGetStudentInfo = false
      this.init()
    },
    /*  呼叫轮询  */
    // 开始计时器
    getCallPhoneStatusApi(callId) {
      return this.$http.get('call_callStatus', {
        params: { callId },
        remote: 'iCP',
        isFilterUrl: true
      })
    },
    getCallPhoneStatus(callId) {
      return this.getCallPhoneStatusApi(callId).then(res => {
        if (!res.data) throw new Error('系统错误call status')
        this.callStatus = res.data.callStatus
        if (res.data.callStatus !== '2') {
          this.phoneStatusObj = res.data.callData
        }
        return res.data.callStatus
      })
    },
    ocStartCallSetTimeOut() {
      this.ocCallSetTimeOutId = setTimeout(async() => {
        try {
          this.setTimeFunNum += 100000000
          const ocInfo = getOcInfo()
          const callId = this.callId || (ocInfo && ocInfo.ocCallId)
          if (!callId) return
          const status = await this.getCallPhoneStatus(callId)
          if (this.ocIsHangUpPhone(status)) {
            this.ocClearCallSetTimeOut()
            this.ocCallPhoneMessage = {}
            return
          }
          this.ocStartCallSetTimeOut()
        } catch (e) {
          console.log(e)
          this.$message.error('呼叫状态轮询错误')
        }
      }, this.setTimeFunNum)
    },
    // 清除计时器
    ocClearCallSetTimeOut() {
      this.setTimeFunNum = 1000
      clearTimeout(this.ocCallSetTimeOutId)
    },
    // 是否挂断电话
    ocIsHangUpPhone(status) {
      if (!this.ocCallPhoneMessage[status]) {
        this.ocCallPhoneMessage[status] = true
        switch (status) {
          case '0':
            this.$message.success('等待对方接听，请稍候！')
            return false
          case '1':
            this.$message.success('对方已接通电话啦！')
            return false
          case '2':
            this.$message.warning('通话结束，请添加沟通记录！')
            return true
        }
      }
      return false
    }
  }
}
</script>
<style lang="sass" scoped>
  @import '../../styles/accessList/detail.sass'
</style>



