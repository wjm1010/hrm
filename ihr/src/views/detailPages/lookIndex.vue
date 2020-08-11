<template>
  <div class="dashboard-container">
    <div>
      <span class="width-30">姓名：{{talents.resumeName}}</span>
      <span class="width-30">编号：{{talents.resumeId}} 
        <i v-if="talents.resumeStatusName" class="box-talents">{{talents.resumeStatusName}}</i>
      </span>
      <span class="width-30">岗位性质：{{talents.resumeProperty}}</span>
    </div>
    <div>
      <span class="width-30">电话：{{talents.resumePhone}}</span>
      <span class="width-30">QQ：{{talents.resumeInfoQQ}} </span>
      <span class="width-30">邮箱：{{talents.resumeInfoEmail}}</span>
    </div>

    <div id="app" class="btn">
      <el-button @click="changeComp('LookBasicInfo')" :autofocus="true">基础信息</el-button>
      <el-button @click="changeComp('RecordCommunication')">沟通记录</el-button>
      <el-button @click="changeComp('interviewPart')" v-if="talents.resumeProperty==='兼职'">面试记录</el-button>
      <el-button @click="changeComp('Interview')" v-else>面试记录</el-button>
      <el-button @click="changeComp('OfferPart')" v-if="talents.resumeProperty==='兼职'">offer/培训</el-button>
      <el-button @click="changeComp('Offer')" v-else>offer/培训</el-button>
      <el-button @click="changeComp('OperationLog')">操作日志</el-button>
    </div>

    <keep-alive>
      <component
        :is="currentView"
        :talents="talents"
        :userId="userId"
        :path="path"></component>
    </keep-alive>

  </div>
</template>

<script>
import LookBasicInfo from './detail/lookBasicInfo' // 基础信息
import RecordCommunication from './detail/recordCommunication' // 沟通记录
import Interview from './detail/interview' // 面试-全职/实习
import interviewPart from './detail/interviewPart' // 面试-兼职
import OfferPart from './detail/offerPart' // offer-兼职
import Offer from './detail/offer' // offer-全职/实习
import OperationLog from './detail/operationLog' // 操作日志
export default {
  name: 'detailPagesLookIndex',
  data() {
    return {
      activeName: 'first',
      currentView: 'LookBasicInfo',
      talents: {},
      userId: this.$route.params.userId,
      path: this.$route.path
    }
  },
  components: {
    LookBasicInfo,
    RecordCommunication,
    Interview,
    interviewPart,
    OfferPart,
    Offer,
    OperationLog
  },
  created() {
    this.getTalents()
  },
  mounted() {

  },
  methods: {
    changeComp(name) {
      this.currentView = name
    },
    getTalents() {
      this.$http.post('resume_getOneResume', { resumeId: this.userId }).then(res => {
        if (res.data) {
          this.talents = res.data
        }
      }).catch(console.log)
    }
  }
}
</script>
<style lang="sass" scoped>
div
  font-size: 14px
  color: #606266
i
  font-style: normal
.width-30
  display: inline-block
  width: 33%
  line-height: 35px
  padding-left: 5%
.box-talents
  display: inline-block
  background: #ff9900
  border-radius: 4px
  font-size: 12px
  padding: 0 7px
  line-height: 25px
  color: #fff
.btn
  margin-top: 20px
  font-size: 0
  margin-left: 20px
  .el-button
    border-radius: 0
    width: 120px
    padding: 9px 0
    border-left: 0
  .el-button:first-child
    border-left: 1px solid #dcdfe6
</style>

