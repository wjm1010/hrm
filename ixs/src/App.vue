<template>
  <div id="app">
    <router-view></router-view>
    <no-permission-dialog :dialog-visible.sync="noPermissionDialogVisible"></no-permission-dialog>
    <!-- 话术提醒 -->
    <WordsRemind :refresh.sync="haveWordsRemind" v-if="haveWordsRemind && canUseSpeech==='1'"></WordsRemind>
  </div>
</template>
<script>
  import NoPermissionDialog from '@/components/NoPermissionDialog'
  import { getUserInfoByCallPhone, getTalkMessage } from '@/utils/getInfoMethods.js'
  import WordsRemind from '@/components/wordsRemind/index'
  import { mapActions, mapGetters } from 'vuex'
  import { setToken, setRoleType, getRoleType } from '@/utils/auth'
  export default {
    name: 'APP',
    components: {
      NoPermissionDialog,
      WordsRemind
    },
    data() {
      return {
        noPermissionDialogVisible: false,
        /* 呼叫挂断需求 */
        bodyCanClickCallId: 'call-phone-dialog',
        callSetTimeOutId: '',
        callPhoneMessage: {},
        setTimeFunNum: 1000,
        haveWordsRemind: false
      }
    },
    mounted() {
      this.$eventBus.$on('show-no-permission-dialog', this.getTeacherIsHaveRole) // 点击沟通详情前判断时候有权限
      // 呼叫监听
      this.$eventBus.$on('startCallSetTimeOut', this.startCallSetTimeOut)
      this.$eventBus.$on('clearCallSetTimeOut', this.clearCallSetTimeOut)
      this.$eventBus.$on('removeBodyDisabledClick', this.removeBodyDisabledClick)
      this.$eventBus.$on('beginToConnect', this.setHaveFindId)
      const userinfo = getUserInfoByCallPhone()
      if (userinfo && userinfo.unFinishCallId) {
        this.clearCallSetTimeOut()
        this.startCallSetTimeOut()
      }
      // 监听页面激活状态
      document.addEventListener('visibilitychange', this.handleVisibility)

      // 话术提醒
      this.setHaveFindId()
    },
    destroyed() {
      document.removeEventListener('visibilitychange', this.handleVisibility)
      this.clearCallSetTimeOut()
      this.removeBodyDisabledClick()
    },
    computed: {
      ...mapGetters(['canUseSpeech'])
    },
    methods: {
      ...mapActions([
        'getCallPhoneStatus'
      ]),
      // 监听页面
      handleVisibility() {
        console.warn('visible2')
        if (document.visibilityState === 'hidden') {
          return this.clearCallSetTimeOut()
        }
        this.removeBodyDisabledClick()
        const userInfo = getUserInfoByCallPhone()
        if (userInfo && userInfo.unFinishCallId) {
          this.clearCallSetTimeOut()
          this.startCallSetTimeOut()
        }
      },
      getTeacherIsHaveRole(studentIntentionId) {
        this.$http.post('lesson_isHaveRole', {
          studentIntentionId
        }).then(res => {
          if (res.data) {
            const { displayType } = res.data
            const jumpMap = {
              'new': 'student',
              'old': 'roster'
            }
            setRoleType('routerName', `/${jumpMap[displayType]}/detail/`)
            this.$router.push(`/${jumpMap[displayType]}/detail/${studentIntentionId}`)
          } else {
            this.noPermissionDialogVisible = true
          }
        }).catch(console.log)
      },
      /* 呼叫挂断需求 */
      // 有callId && 呼叫状态接口返回是已挂断 则绑定
      handleBodyDisabledClick() {
        document.body.addEventListener('click', this.bodyStopPropagationEvent, true)
      },
      // 提交沟通记录并且成功后解绑
      removeBodyDisabledClick() {
        document.body.removeEventListener('click', this.bodyStopPropagationEvent, true)
      },
      bodyStopPropagationEvent(event) {
        if (!this.canFindId(event)) {
          const userinfo = getUserInfoByCallPhone()
          const studentName = userinfo.studentName
          const studentNo = userinfo.studentNo
          this.$message.error(`您刚才对${studentName}（${studentNo}）的电话还未添加沟通记录，请填写并保存沟通记录后再继续其它操作`)
          event.preventDefault()
          return event.stopPropagation()
        }
      },
      // 挂断后可点击白名单
      canFindId(event) {
        return event.path.slice(0, -3).some((val) => {
          const targetCallId = val.getAttribute('callIdAttr')
          if (targetCallId === this.bodyCanClickCallId || (val.className && typeof val.className === 'string' && val.className.includes('el-date-picker'))) {
            return true
          }
        })
      },
      // 开始计时器
      startCallSetTimeOut() {
        this.callSetTimeOutId = setTimeout(async() => {
          try {
            this.setTimeFunNum += 100000000
            // if (this.setTimeFunNum > 5000) {
            //   this.setTimeFunNum = 1000
            // }
            const userinfo = getUserInfoByCallPhone()
            if (!userinfo || !userinfo.unFinishCallId) return
            const status = await this.getCallPhoneStatus(userinfo.unFinishCallId)
            if (this.isHangUpPhone(status)) {
              this.clearCallSetTimeOut()
              this.callPhoneMessage = {}
              const routeName = getRoleType('routerName')
              userinfo.unFinishCallId && this.handleBodyDisabledClick() // 防止未挂断已添加沟通记录情况
              userinfo.unFinishCallId && routeName && this.$router.push(`${routeName}${userinfo.unFinishCallStudentIntentionId}`) // 防止未挂断已添加沟通记录情况
              return
            }
            this.startCallSetTimeOut()
          } catch (e) {
            console.log(e)
            this.$message.error('呼叫状态轮询错误')
          }
        }, this.setTimeFunNum)
      },
      // 清除计时器
      clearCallSetTimeOut() {
        this.setTimeFunNum = 1000
        clearTimeout(this.callSetTimeOutId)
      },
      // 是否挂断电话
      isHangUpPhone(status) {
        if (!this.callPhoneMessage[status]) {
          this.callPhoneMessage[status] = true
          switch (status) {
            case '0':
              this.$message.success('等待对方接听，请稍候！')
              return false
            case '1':
              this.$message.success('对方已接通电话啦！')
              return false
            case '2':
              // 防止回到沟通详情页再次提醒 && 防止未挂断已添加沟通记录情况
              var userinfo = getUserInfoByCallPhone()
              userinfo.unFinishCallId && (this.$route.name === 'rosterdetail' || this.$route.name === 'studentdetail') && this.$message.warning('通话结束，请添加沟通记录！')
              return true
          }
        }
        return false
      },
      // 呼叫成功状态存储
      setHaveFindId(bool) {
        const talkMessage = getTalkMessage()
        if (!talkMessage || talkMessage.haveWordsRecommended) return

        if (bool) {
          setToken('antistop_content', '')
          this.haveWordsRemind = false
          return this.$nextTick(() => {
            this.haveWordsRemind = true
          })
        }

        this.haveWordsRemind = true
      }
    }
  }
</script>
<style lang="sass">

</style>

