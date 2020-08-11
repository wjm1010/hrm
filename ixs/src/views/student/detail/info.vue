<template>
 <div class="main-sec">
    <div class="head-portrait">
      <img v-if="someStudentInfo.head_image_url" :src="someStudentInfo.head_image_url"
          :class="['avatar',{'gray-img':someStudentInfo.career_status === '30'}]"
          alt="">
      <img v-else src="http://o061kmjss.qnssl.com/1526033556.3564.png"
          :class="['avatar',{'gray-img':someStudentInfo.career_status === '30'}]"
          alt="">
    </div>
    <div class="head-body">
      <div class="info-name-icon">
        <CommitDetailDialog
          :studentInfo = "studentInfo"
          :indexInit="indexInit"
          :fixDialog="fixDialog"
          :studentIntentionId="studentInfo.student_intention_id"
          :phone="studentInfo.phone">
        </CommitDetailDialog>
        <span class="student-name">{{someStudentInfo.name}}</span>
        <span class="student-num">学生编号： <span class="blue" @click="copy(studentInfo.student_no)">复制</span></span>
      </div>
      <div>
        <p class="text">阶段：{{someStudentInfo.guest_cycle}} |  获取名单时间：{{studentInfo.trackTime}}</p>
        <div style="display: flex" class="formclass" v-if="tasks">
          <el-popover
            placement="top-start"
            width="300"
            trigger="hover"
            :disabled="!tasks.infoExp.bubble">
            <p v-for="(itemTxt, index) in tasks.infoExp.bubble"
              :key="index"
              v-text="itemTxt"
              class="popover-font">
            </p>
            <div slot="reference">
              <p class="label">
                体验课：{{tasks.infoExp.state}} 
                <i v-if="showIcon" class="icon" :style="{ backgroundImage: `url(${icon})`}" /> | 
              </p>
            </div>
          </el-popover>
          <el-popover
            placement="top-start"
            width="300"
            trigger="hover"
            :disabled="!tasks.infoTrl.bubble">
            <p v-for="(itemTxt, index) in tasks.infoTrl.bubble"
              :key="index"
              v-text="itemTxt"
              class="popover-font">
            </p>
            <div slot="reference">
              <p class="label margin" :class="{'label-margin': showIcon}">
                试听课：{{tasks.infoTrl.state}}
                <i v-if="showIcons" class="icon icon-margin" :style="{ backgroundImage: `url(${icon})`}" />
              </p>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
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
    <div class="right fr">
      <status-process 
        v-if="checkIdresult"
        :rosterId="rosterId"
        :list=" tasks && tasks.list"
        :phase="tasks && tasks.phase"
      />
    </div>
  </div>
</template>

<script>
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'
  import statusProcess from '../components/studentStatus.vue'
  import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'
  import { clipboardCopy } from '@/utils/http/utils'
  import { mapGetters, mapMutations } from 'vuex'
  import icon from '../icons/icon-18.png'

  export default {
    name: 'detail-info',
    components: {
      CommitDetailDialog,
      statusProcess
    },
    props: {
      tasks: {
        type: Object,
        default: null,
        required: true
      },
      refresh: Boolean,
      rosterId: {
        required: true
      },
      studentInfo: {
        required: true
      },
      fixDialog: Object,
      indexInit: Function,
      checkIdresult: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        noHidden: false,
        icon: icon,
        infoExp: ['已排课', '已完成'],
        infoTrl: ['已驳回', '已排课', '已完成', '已取消', '已撤回', '已试听', '跳票'],
        callObj: {
          callTime: '',
          showTimeMessage: false
        },
        someStudentInfo: {}
      }
    },
    computed: {
      ...mapGetters(['phoneStatus', 'phoneStatusObj']),
      showIcon() {
        if (this.tasks && this.infoExp.includes(this.tasks.infoExp.state)) return true
        return false
      },
      showIcons() {
        if (this.tasks && this.infoTrl.includes(this.tasks.infoTrl.state)) return true
        return false
      }
    },
    filters: {
      changeCallTime(val) {
        const hour = `0${new Date(val).getUTCHours()}`.slice(-2)
        const minutes = `0${new Date(val).getMinutes()}`.slice(-2)
        const seconds = `0${new Date(val).getSeconds()}`.slice(-2)
        return `${hour}:${minutes}:${seconds}`
      }
    },
    watch: {
      'refresh'(val) {
        if (val) {
          this.init()
          this.$emit('update:refresh', false)
        }
      },
      'phoneStatus': {
        handler(val) {
          if (!val) return
          const userInfo = getUserInfoByCallPhone()
          document.removeEventListener('visibilitychange', this.handleVisibility)
          document.addEventListener('visibilitychange', this.handleVisibility)
          if (val === '2') {
            this.$nextTick(() => {
              if (!this.fixDialog.parentRandom || !userInfo.unFinishCallId) {
                this.$eventBus.$emit('removeBodyDisabledClick')
                this.$eventBus.$emit('restTimeObj')
                this.SET_PHONESTATUS('')
                return this.$router.replace({
                  path: `/student/detail/${this.rosterId}`,
                  query: {
                    random: Math.random()
                  }
                })
              }
              this.$eventBus.$emit('restTimeObj')
              this.$eventBus.$emit(this.fixDialog.parentRandom)
            })
            return
          }
          if (userInfo.unFinishCallStudentIntentionId === this.$route.params.rosterId && val !== '2' && !this.callObj.callTime) {
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
    },
    created() {
      this.init()
    },
    mounted() {
      this.$eventBus.$on('restTimeObj', () => {
        this.intervalId && clearInterval(this.intervalId)
        this.callObj = {
          callTime: '',
          showTimeMessage: false
        }
      })
    },
    destroyed() {
      this.intervalId && clearInterval(this.intervalId)
      this.$eventBus.$off('restTimeObj')
      document.removeEventListener('visibilitychange', this.handleVisibility)
    },
    methods: {
      ...mapMutations(['SET_PHONESTATUS']),
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
            this.noHidden = true
            this.someStudentInfo = res.data.info
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取用户信息失败')
        })
      },
      copy(text) {
        const res = clipboardCopy(text)
        if (res) {
          this.$message.success('复制成功')
        } else {
          this.$message.error('复制失败')
        }
      },
      handleVisibility() {
        const userInfo = getUserInfoByCallPhone()
        console.warn('visible1')
        console.warn(userInfo)
        // console.warn(userInfo.unFinishCallStudentIntentionId)
        console.warn(this.rosterId)
        console.warn('visible1')
        if (document.visibilityState === 'visible' && this.fixDialog.parentRandom && (!userInfo || userInfo.unFinishCallStudentIntentionId !== this.rosterId)) {
          console.warn('visible1-if')
          this.$eventBus.$emit('removeBodyDisabledClick')
          this.$eventBus.$emit('restTimeObj')
          this.SET_PHONESTATUS('')
          this.$router.replace({
            path: `/student/detail/${this.rosterId}`,
            query: {
              random: Math.random()
            }
          })
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/student/detail/info'
  .formclass
    align-items: center
  .info-name-icon
    display: flex
    align-items: center
    .call-phone
      position: relative
      left: 0
      top: 0
      .phone-icon
        height: 20px
        width: 20px
</style>
