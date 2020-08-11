<template>
  <div class="main-content">
    <div class="fr" v-if="addRecordShow">
      <el-button type="primary" @click="dialogaddTraining = true">+ 添加培训</el-button>
    </div>
    <h4>offer/培训 记录</h4>
    <expand-table
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="['trainRecordIsMailName','trainRecordIsMsgName']">

      <template slot-scope="scope" slot="trainRecordIsMailName">
        <div v-if="addRecordShow">
          <p v-if="scope.row['trainRecordIsMail'] === '0'">
            <a @click="sendMail(1)">发送</a>
          </p>
          <p v-if="scope.row['trainRecordIsMail'] === '2'">
            发送失败 <a @click="sendMail(1)">重新发送</a>
          </p>
          <p v-if="scope.row['trainRecordIsMail'] === '1'">
            {{scope.row['trainRecordIsMailName']}}
          </p>
        </div>
        <div v-else>
          {{scope.row['trainRecordIsMailName']}}
        </div>
      </template>

      <template slot-scope="scope" slot="trainRecordIsMsgName">
        <div v-if="addRecordShow">
          <p v-if="scope.row['trainRecordIsMsg'] === '0'">
            <a @click="sendMail(2)">发送</a>
          </p>
          <p v-if="scope.row['trainRecordIsMsg'] === '2'">
            发送失败 <a @click="sendMail(2)">重新发送</a>
          </p>
          <p v-if="scope.row['trainRecordIsMsg'] === '1'">
            {{scope.row['trainRecordIsMsgName']}}
          </p>
        </div>
        <div v-else>
          {{scope.row['trainRecordIsMsgName']}}
        </div>
      </template>

    </expand-table>

    <h4>表单提交情况</h4>
    <expand-table
      :rows="rows1"
      :loading="loading"
      :columns="columns1"
      class="tableRowspan"
      :slot-name-arr="['link','isSubmit']">
      <template slot-scope="scope" slot="isSubmit">
        {{scope.row['isSubmit']}}
        <el-button type="text" size="small" class="actionItems" v-if="scope.row['isSubmit']==='已提交'" @click="lookResumeInfo">查看</el-button>
      </template>
      <template slot-scope="scope" slot="link">
        <el-popover trigger="hover" placement="top" v-if="scope.row['link'].length>40" width="500">
          <p><a :href="scope.row['link']" target="_blank">{{scope.row['link']}}</a></p>
          <div slot="reference" class="name-wrapper">
            <p>{{scope.row['link'].slice(0,40)}}...</p>
          </div>
        </el-popover>
        <p v-else><a :href="scope.row['link']" target="_blank">{{scope.row['link']}}</a></p>
      </template>
    </expand-table>

    <!-- 添加Offer -->
    <addTraining
      v-if="dialogaddTraining"
      :trainRecordResumeId="userId"
      :Name="queryObject.resumeName"
      @change-refresh-getlist="this.getList"
      dialogTitle="添加offer/培训"
      @closeEv="dialogaddTraining = false"></addTraining>

    <!-- 查看入培 -->
    <resumeInfo
      v-if="dialogResumeInfo"
      :resumeTrainAll="resumeTrainAll"
      :dialogTitleName="queryObject.resumeName"
      @closeEv="dialogResumeInfo = false"></resumeInfo>
  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
import resumeInfo from '../dialog/resumeInfo'
import addTraining from '../dialog/addTraining'
export default {
  name: 'offer',
  data() {
    return {
      loading: false,
      addRecordShow: false,
      // offer 记录
      rows: [],
      columns: [
        { 'value': 'trainRecordAddTime', 'text': '添加时间' },
        { 'value': 'userName', 'text': '添加人' },
        { 'value': 'trainManageTime', 'text': '培训场次' },
        { 'value': 'trainManageCode', 'text': 'QQ群号' },
        { 'value': 'trainRecordIsMailName', 'text': '邮件通知' },
        { 'value': 'trainRecordIsMsgName', 'text': '短信通知' },
        { 'value': 'offerRecordIsAgreeName', 'text': '是否接受offer' },
      ],
      // 表单提交情况
      rows1: [],
      columns1: [
        { 'value': 'link', 'text': '链接' },
        { 'value': 'content', 'text': '提交内容' },
        { 'value': 'isSubmit', 'text': '提交情况' }
      ],
      dialogResumeInfo: false,
      dialogaddTraining: false,
      resumeTrainAll: {}
    }
  },
  components: {
    expandTable,
    resumeInfo,
    addTraining
  },
  props: {
    path: {
      require: true
    },
    userId: {
      require: true
    },
    queryObject: {
      type: Object
    }
  },
  created() {
    this.getList()
    this.path.indexOf('look') > 0 ? this.addRecordShow = false : this.addRecordShow = true
  },
  mounted() {

  },
  methods: {
    sendMail(num) {
      const data = {
        resumeId: this.userId,
        trainRecordIsMail: num === 1 ? '1' : '',
        trainRecordIsMsg: num === 2 ? '1' : '',
        type: 'offer'
      }
      this.$http.post('resume_offerSendInform', data).then(res => {
        if (res.data) {
          this.$message.success(res.message)
          if (num === 1) {
            this.$emit('refresh-status')
          }
          this.getList()
        }
      }).catch(console.log)
    },
    getList() {
      this.loading = true
      this.$http.post('resume_trainList', { resumeId: this.userId }).then(res => {
        if (res.data) {
          this.rows = res.data.offerList
          this.rows1 = res.data.trainData
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    }, // offer 记录 培训记录 连接
    lookResumeInfo() {
      this.dialogResumeInfo = true
      this.$http.post('resume_trainAll', { resumeId: this.userId }).then(res => {
        if (res.data) {
          if (res.data.length === 0) {
            this.$message.warning('没有可以查看的内容！')
            return false
          }
          this.resumeTrainAll = res.data
        }
      }).catch(console.log)
    }// 查看入培信息
  }
}
</script>
<style lang="sass" scoped>
.history
  border: 1px solid #ccc
  margin-bottom: 40px
  ul
    color: #606266
    margin-left: 20vh
    li
      line-height: 35px
      list-style: none
</style>



