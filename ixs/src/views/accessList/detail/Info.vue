<template>
  <!-- 命令行生成的模板 -->
	<div class="main">
		<div class="main-body">
      <img v-if="someStudentInfo.head_image_url" :src="someStudentInfo.head_image_url"
           :class="['avatar',{'gray-img':someStudentInfo.career_status === '30'}]"
           alt="">
      <img v-else src="http://o061kmjss.qnssl.com/1526033556.3564.png"
           :class="['avatar',{'gray-img':someStudentInfo.career_status === '30'}]"
           alt="">
      <b class="name">{{someStudentInfo.name}}</b>

      <span v-if="someStudentInfo.track_userid === userId" class="student-no">{{studentInfo.student_no}}</span>
      <el-tag class="tag" v-if="someStudentInfo.track_userid === userId" type="danger">
        <div>阶段：{{someStudentInfo.guest_cycle}}</div>
        <div>跟进人：{{someStudentInfo.track_role}} {{someStudentInfo.track_name}}</div>
      </el-tag>

      <span class="skip el-tag--danger" v-if="typeView !== '3'">
        <span v-if="typeView === '1'">
          <span class="color-font-blue">进入倒计时</span>，系统在<span class="color-font-red">{{totalNum}}秒</span>后拨通电话号码，
          <span class="color-font-redLine" @click="jumpBackTime" style="cursor: pointer">跳过</span>
        </span>
        <span v-else style="padding-left: 100px">外呼倒计时已暂停</span>
		  </span>
      <div v-if="typeView !== '3'">
        <div v-if="pauseIconShow">
          <span class="pauseCall">
            <img :src="pause" class="pasue-icon" alt="" @click="btnPause">
            暂停外呼
          </span>
        </div>
        <div v-else>
          <span class="pauseCall">
            <img :src="start" class="pasue-icon" alt="" @click="btnPause">
          </span>
          <span class="pause-font">继续外呼</span>
        </div>
      </div>
      <el-button type="primary" plain @click="nextSingle">下一条</el-button>

      <div class="call-message" v-if="callObj.showTimeMessage && (phoneStatus === '0' || phoneStatus === '1')">
        <div class="call-message-body">
          <div class="call-message-body-left">
            <span class="top-phone">{{phoneStatusObj.phone}}</span><br/>
            <span>{{phoneStatusObj.phoneArea}}</span>
          </div>
          <div class="call-message-body-right" v-if="false">
            <span v-if="phoneStatus === '0'">正在呼叫中，请耐心等待···</span>
            <span v-if="phoneStatus === '1'" class="call-now">通话中 {{callObj.callTime | changeCallTime}}</span>
          </div>
        </div>
      </div>

    </div>

    <div class="body-time">
      <span>进线时间：{{studentInfo.create_time}}</span>
      <span style="margin-left: 20px"
            v-if="someStudentInfo.track_userid  === userId">获取名单时间：{{someStudentInfo.track_time}}</span>
    </div>

	</div>
</template>

<script>
import pause from './pause.png'
import start from './start.png'
import { mapGetters } from 'vuex'
import { getOcInfo } from '@/utils/getInfoMethods.js'

export default {
  name: 'detail-info',
  props: ['phoneStatus', 'phoneStatusObj', 'callId'],
  data() {
    return {
      pause,
      start,
      someStudentInfo: {},
      totalNum: 10,
      backCale: null, // 计时器
      typeView: '1', // 倒计时显示（1:倒计时。2:倒计时结束。0:暂停外呼.3：隐藏）
      pauseIconShow: true,
      callObj: {
        callTime: '',
        showTimeMessage: false
      }
    }
  },
  computed: {
    ...mapGetters(['rosterId', 'studentInfo', 'userId', 'departmentId', 'roleId', 'roleCode'])
  },
  filters: {
    changeCallTime(val) {
      const hour = `0${new Date(val).getUTCHours()}`.slice(-2)
      const minutes = `0${new Date(val).getMinutes()}`.slice(-2)
      const seconds = `0${new Date(val).getSeconds()}`.slice(-2)
      return `${hour}:${minutes}:${seconds}`
    }
  },
  created() {
    this.init()
  },
  activated() {
    if (this.typeView === '1') {
      this.countDown()
    }
  },
  deactivated() {
    window.clearTimeout(this.backCale)
  },
  destroyed() {
    window.clearTimeout(this.backCale)
    this.intervalId && clearInterval(this.intervalId)
    this.$eventBus.$off('restTimeObj')
  },
  mounted() {
    this.callInit()
    this.$eventBus.$on('changeOcTypeView', val => {
      this.typeView = val
    })
    this.$eventBus.$on('restTimeObj', () => {
      this.intervalId && clearInterval(this.intervalId)
      this.callObj = {
        callTime: '',
        showTimeMessage: false
      }
    })
  },
  methods: {
    // 坐席外呼
    callInit() {
      const ocInfo = getOcInfo()
      const callId = this.$route.query.callRecordId || (ocInfo && ocInfo.ocCallId)
      if (callId && callId !== '0') {
        // 轮询
        this.typeView = '3'
        this.$eventBus.$emit('ocStartCallSetTimeOut')
        return
      }
      if (this.$route.query.hasCommunicationRecord === '1') {
        this.typeView = '3'
        this.$eventBus.$emit('start-callPhone', true)
        return
      }
      this.countDown()
    },
    postCallIndex() {
      this.$http.post('recycle_callOut', {
        businessUid: this.userId,
        departmentId: this.departmentId,
        roleCode: this.roleCode,
        roleId: this.roleId,
        studentIntentionId: this.rosterId,
        serialNumber: this.studentInfo.serial_number,
        callType: '1'
      }, { disableTime: 5 }).then(({ data, code } = {}) => {
        if (!data) return (this.$eventBus.$emit('start-callPhone', true))
        this.$emit('show-dialogCommunicationRecord', data)

        const talkData = {
          cno: data.cno,
          callId: data.call_id,
          studentIntentionId: this.rosterId,
          haveWordsRecommended: false
        }
        localStorage.setItem('CALL_TALK_MESSAGE', JSON.stringify(talkData))
        this.$eventBus.$emit('beginToConnect', true)
      }).catch(console.log)
    },
    specialCode() {
      this.$http.get('recycle_isDistributionSale', {
        params: {
          communicationSituation: 6,
          cmtContent: '号码错误',
          nextTime: true,
          repeat: false,
          communicationTools: '1',
          knowOrigin: this.studentInfo.know_origin,
          coilIn: this.studentInfo.coil_in,
          studentIntentionId: this.rosterId,
          callId: '0',
          departmentId: this.departmentId,
          relateUserId: this.userId
        },
        isNoMessage: true
      })
    },
    getStudentBasicInfo() {
      return this.$http.get('student_getCommunicationTools', {
        params: {
          studentIntentionId: this.rosterId
        }
      })
    },
    init() {
      this.getStudentBasicInfo().then(res => {
        if (res.data) {
          this.someStudentInfo = res.data.info
        }
      }).catch(console.log)
    },
    countDown() {
      if (this.$route.query.callRecordId && this.$route.query.callRecordId !== '0') {
        this.totalNum = 0
        this.typeView = '2'
      } else {
        this.backCale = window.setTimeout(this.timeoutFun, 1000)
      }
    },
    timeoutFun() {
      this.totalNum -= 1
      if (this.totalNum === 0) {
        this.typeView = '2'
        this.$eventBus.$emit('start-callPhone', false)
        this.postCallIndex()
        return
      }
      this.countDown()
    },
    // 暂停开启外呼
    btnPause() {
      if (this.typeView !== '2') { // 倒计时结束不能暂停外呼
        if (this.pauseIconShow) {
          this.typeView = '0'
          window.clearTimeout(this.backCale)
          this.$eventBus.$emit('start-callPhone', true)
        } else { // 开启外呼
          this.typeView = '1'
          this.$eventBus.$emit('start-callPhone', false)
          this.countDown(this.totalNum)
        }
        this.pauseIconShow = !this.pauseIconShow
      }
    },
    // 下一条
    nextSingle() {
      this.$emit('show-next-single')
    },
    // 跳过倒计时
    jumpBackTime() {
      this.typeView = '2'
      window.clearTimeout(this.backCale)
      this.totalNum = 0
      this.postCallIndex()
      this.$eventBus.$emit('start-callPhone', false)
    }
  },
  watch: {
    'phoneStatus': {
      handler(val) {
        const ocInfo = getOcInfo()
        const callId = this.callId || (ocInfo && ocInfo.ocCallId)
        if (val === '2' && callId) {
          this.$emit('btnCommunication')
        }
        if (val && val !== '2' && !this.callObj.callTime) {
          this.callObj.callTime = new Date(this.phoneStatusObj.serverTime) - new Date(this.phoneStatusObj.startTime)
          this.callObj.showTimeMessage = true
          this.intervalId && clearInterval(this.intervalId)
          this.intervalId = window.setInterval(() => {
            this.callObj.callTime += 1000
          }, 1000)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="sass" scoped>
  @import '../../../styles/accessList/detail/info.sass'
</style>
