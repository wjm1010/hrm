<template>
  <div class="main-content">
    <div class="fr" v-if="addRecordShow">
      <el-button type="primary" @click="addRecord">+ 添加培训</el-button>
    </div>
    <h4>offer 记录</h4>
    <expand-table
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="['offerRecordIsMailName','offerRecordIsMsgName']">

      <template slot-scope="scope" slot="offerRecordIsMailName">
        <div>
          <p v-if="scope.row['offerRecordIsMail'] === '0'">
            <a @click="sendMail(1,1)" v-if="addRecordShow">设置为已发送</a>
            <span v-else>设置为已发送</span>
          </p>
          <p v-if="scope.row['offerRecordIsMail'] === '2'">
            设置失败 <a @click="sendMail(1,1)" v-if="addRecordShow">重新设置</a>
          </p>
          <p v-if="scope.row['offerRecordIsMail'] === '1'">
            {{scope.row['offerRecordIsMailName']}}
          </p>
        </div>
      </template>

      <template slot-scope="scope" slot="offerRecordIsMsgName">
        <div>
          <p v-if="scope.row['offerRecordIsMsg'] === '0'">
            <a @click="sendMail(2,1)" v-if="addRecordShow">发送</a>
            <span v-else>发送</span>
          </p>
          <p v-if="scope.row['offerRecordIsMsg'] === '2'">
            发送失败 <a @click="sendMail(2,1)" v-if="addRecordShow">重新发送</a>
          </p>
          <p v-if="scope.row['offerRecordIsMsg'] === '1'">
            {{scope.row['offerRecordIsMsgName']}}
          </p>
        </div>
      </template>

    </expand-table>

    <h4>表单提交情况</h4>
    <expand-table
      :rows="rows1"
      :loading="loading"
      :columns="columns1"
      class="tableRowspan"
      :slot-name-arr="['link']">
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

    <h4>培训记录</h4>
    <expand-table
      :rows="rows2"
      :loading="loading"
      :columns="columns2"
      :slot-name-arr="['trainRecordIsMailName','trainRecordIsMsgName']">
        <template slot-scope="scope" slot="trainRecordIsMailName">
          <div v-if="addRecordShow">
            <p v-if="scope.row['trainRecordIsMail'] === '0'">
              <a @click="sendMail(1,2)">发送</a>
            </p>
            <p v-if="scope.row['trainRecordIsMail'] === '2'">
              发送失败 <a @click="sendMail(1,2)">重新发送</a>
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
              <a @click="sendMail(2,2)">发送</a>
            </p>
            <p v-if="scope.row['trainRecordIsMsg'] === '2'">
              发送失败 <a @click="sendMail(2,2)">重新发送</a>
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

    <!-- 添加Offer -->
    <addTraining
      v-if="dialogaddTraining"
      :trainRecordResumeId="userId"
      :Name="queryObject.resumeName"
      dialogTitle="添加培训"
      @change-refresh-getlist="this.getList"
      @closeEv="dialogaddTraining = false"></addTraining>

  </div>
</template>

<script>
import addTraining from '../dialog/addTraining'
import expandTable from '@/components/ExpandTable'
export default {
  name: 'offer',
  data() {
    return {
      loading: false,
      addRecordShow: false,
      dialogaddTraining: false,
      // offer 记录
      rows: [],
      columns: [
        { 'value': 'offerRecordAddTime', 'text': '添加时间' },
        { 'value': 'userName', 'text': '添加人' },
        { 'value': 'workPlaceName', 'text': '工作地点' },
        { 'value': 'offerRecordIsMailName', 'text': '邮件通知' },
        { 'value': 'offerRecordIsMsgName', 'text': '短信通知' }
      ],
      // 表单提交情况
      rows1: [],
      columns1: [
        { 'value': 'link', 'text': '链接' },
        { 'value': 'content', 'text': '提交内容' },
        { 'value': 'isSubmit', 'text': '提交情况' }
      ],
      // 审批记录
      rows2: [],
      columns2: [
        { 'value': 'trainRecordAddTime', 'text': '添加时间' },
        { 'value': 'userName', 'text': '添加人' },
        { 'value': 'trainRecordTime', 'text': '培训日期' },
        { 'value': 'trainRecordIsMailName', 'text': '邮件通知' },
        { 'value': 'trainRecordIsMsgName', 'text': '短信通知' }
      ],
    }
  },
  components: {
    expandTable,
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
    sendMail(num, type) {
      const data = {
        resumeId: this.userId,
        trainRecordIsMail: num === 1 ? '1' : '',
        trainRecordIsMsg: num === 2 ? '1' : '',
        type: type === 1 ? 'offer' : 'train'
      }
      this.$http.post('resume_offerSendInform', data).then(res => {
        if (res.data) {
          this.$message.success(res.message)
          if (num === 1 && type === 1) {
            this.$emit('refresh-status')
          }
          this.getList()
        }
      }).catch(console.log)
    },
    getList() {
      this.loading = true
      this.$http.post('resume_recordList', { resumeId: this.userId }).then(res => {
        if (res.data) {
          this.rows = res.data.offerList
          this.rows1 = res.data.trainData
          this.rows2 = res.data.trainList
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    }, // offer 记录 培训记录 连接
    addRecord() {
      this.dialogaddTraining = true
    } // 添加面试弹窗获取数据
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



