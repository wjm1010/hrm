<template>
  <div class="content-task">
    <svg-icon icon-class="new" class="icon-new" v-show="data.new"></svg-icon>
    <div class="up">
      <div class="person">
        <p>{{data.name}}</p>
        <p class="desc">
          <span v-for="v in data.tag" :key="v">{{v}}</span>
        </p>
      </div>
      <div class="line"></div>
      <div class="msg">
        <Msg
          :list="data.list"
          @handleBury="handleBury"
        />
      </div>
    </div>
    <div class="bot">
      <Lessons 
        :infoExp="data.infoExp"
        :infoTrl="data.infoTrl"
      />
      <div class="status">
        <staus-bar 
          :phase="data.phase"
          />
        <el-button 
          type='primary'
          plain
          size='small' 
          class="btn" 
          @click="jumpDtail">沟通详情</el-button>
        <el-button 
          type='primary' 
          size='small'
          :disabled="!isCanCallPhone"
          :class="btn" 
          @click="callPhone">打电话</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'
import { setToken } from '@/utils/auth'

import stausBar from './component/statusBar'
import Msg from './component/Msg'
import Lessons from './component/Lessons'

export default {
  name: 'contentTask',
  components: {
    stausBar,
    Msg,
    Lessons
  },
  props: ['data'],
  data() {
    return {
      isCanCallPhone: true
    }
  },
  computed: {
    ...mapGetters([
      'callStatus',
      'userId',
      'departmentId',
      'roleCode',
      'roleId'
    ])
  },
  methods: {
    callPhone() {
      const userinfo = getUserInfoByCallPhone()
      if (userinfo && userinfo.unFinishCallStudentIntentionId) {
        this.$message.error(`您刚才对${userinfo.studentName}（${userinfo.studentNo}）的电话还未添加沟通记录，请填写并保存沟通记录后再继续其它操作`)
        return false
      }
      this.isCanCallPhone = false
      this.handleBury('11')

      this.$http.post('call_index', {
        businessUid: this.userId,
        departmentId: this.departmentId,
        roleCode: this.roleCode,
        roleId: this.roleId,
        studentIntentionId: this.data.studentIntentionId,
        serialNumber: '0', // 主号
        callType: '1', // 呼叫学生
      }, { remote: 'iCP', disableTime: 5 }).then(({ data } = {}) => {
        if (!data) return
        this.$message.success('呼叫成功')

        const unFinishCallStudentIntentionId = this.data.studentIntentionId
        const userInfo = {
          unFinishCallStudentIntentionId,
          unFinishCallId: data.call_id,
          phoneName: this.data.parentRelationShip,
          phone: this.data.phone,
          studentName: this.data.name,
          studentNo: this.data.studentNo,
          serialNumber: '0'
        }
        setToken('user_info_local', JSON.stringify(userInfo))

        const talkData = {
          cno: data.cno,
          callId: data.call_id,
          studentIntentionId: unFinishCallStudentIntentionId,
          haveWordsRecommended: false
        }
        localStorage.setItem('CALL_TALK_MESSAGE', JSON.stringify(talkData))
        this.$eventBus.$emit('beginToConnect', true)

        this.$eventBus.$emit('clearCallSetTimeOut')
        this.$eventBus.$emit('startCallSetTimeOut')
        this.$eventBus.$emit('show-no-permission-dialog', unFinishCallStudentIntentionId)
        this.$eventBus.$emit(`${unFinishCallStudentIntentionId}callLocal`)
      }).catch(console.log).finally(() => {
        this.isCanCallPhone = true
      })
    },
    jumpDtail() {
      this.handleBury('10')
      this.$eventBus.$emit('show-no-permission-dialog', this.data.studentIntentionId)
    },
    async handleBury(id) {
      if (!id) return
      const query = {
        studentIntentionId: this.data.studentIntentionId,
        pageSourceType: '1',
        actionId: id
      }
      try {
        this.buriedDataApi(query)
      } catch (e) {
        console.error(e)
      }
    },
    buriedDataApi(query) {
      return this.$http.post('saleTask_buriedData', {
        ...query,
      }, { isFilterUrl: true })
    },

  },
}
</script>
<style lang="sass" scoped>
  .content-task
    position: relative;
    background-color: #fff;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .icon-new
      position: absolute;
      top: 0;
      left: 0;
      height: 30px;
      width: 30px;
      color: rgb(64, 158, 255);
    .up
      display: flex;
      padding: 15px;
      border-bottom: 1px solid #ddd;
      .person
        margin-top: 10px;
        width: 20%;
      .desc
        font-size: 12px;
        span
          display: inline-block;
          padding: 4px;
          margin-right: 4px;
          border-radius: 4px;
          background-color: #f2f2f2;
          margin-bottom: 6px;
      .line
        width: 1px;
        background-color: #ddd;
      .msg
        width: 100%;
        padding-left: 15px;
    .bot
      display: flex;
      padding: 10px 15px;
      align-items: center;
      justify-content: space-between;
      .status
        display: flex;
        .btn
          margin-left: 15px;
</style>

