<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-if="noHidden">
    <div class="main-body">
      <img v-if="someStudentInfo.head_image_url" :src="someStudentInfo.head_image_url"
           :class="['avatar',{'gray-img':someStudentInfo.career_status === '30'}]"
           alt="">
      <img v-else src="http://o061kmjss.qnssl.com/1526033556.3564.png"
           :class="['avatar',{'gray-img':someStudentInfo.career_status === '30'}]"
           alt="">
      <b class="name">{{someStudentInfo.name}}</b>
      <span class="school">
      {{someStudentInfo.grade}}<br>
      {{studentInfo.student_no}}
      </span>

      <el-tag class="tag" type="danger">
        阶段：{{someStudentInfo.guest_cycle}}<br>
        跟进人：{{someStudentInfo.track_role}} {{someStudentInfo.track_name}}
      </el-tag>

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


      <CommitDetailDialog
        :studentInfo = "studentInfo"
        :indexInit="indexInit"
        :fixDialog="fixDialog"
        :studentIntentionId="studentInfo.student_intention_id"
        :phone="studentInfo.phone">
      </CommitDetailDialog>
    </div>

    <div class="body-time">
      <span>进线时间：{{studentInfo.create_time}}</span>
      <span style="margin-left: 20px">获取名单时间：{{someStudentInfo.track_time}}</span>
    </div>

  </div>
</template>

<script>
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'
  import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'detail-info',
    components: {
      CommitDetailDialog
    },
    props: {
      refresh: Boolean,
      rosterId: {
        required: true
      },
      studentInfo: {
        required: true
      },
      fixDialog: Object,
      indexInit: Function
    },
    data() {
      return {
        noHidden: false,
        callObj: {
          callTime: '',
          showTimeMessage: false
        },
        someStudentInfo: {}
      }
    },
    computed: {
      ...mapGetters(['phoneStatus', 'phoneStatusObj'])
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
                  path: `/roster/detail/${this.rosterId}`,
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
            path: `/roster/detail/${this.rosterId}`,
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
  @import '../../../styles/roster/detail/info'
</style>
