<template>
  <div class="main-content">
    <div class="fr" v-if="addRecordShow">
      <el-button type="primary" @click="addinterviewbtn">+添加面试</el-button>
    </div>
    <h4>面试安排：</h4>
    <expand-table
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="['resumeInterviewMailName','resumeInterviewMsgName']">

      <template slot-scope="scope" slot="resumeInterviewMailName">
        <div v-if="addRecordShow">
          <p v-if="scope.row['resumeInterviewMail'] === '0'">
            <a @click="sendMail(scope.row,1)">发送</a>
          </p>
          <p v-if="scope.row['resumeInterviewMail'] === '2'">
            发送失败 <a @click="sendMail(scope.row,1)">重新发送</a>
          </p>
          <p v-if="scope.row['resumeInterviewMail'] === '1'">
            {{scope.row['resumeInterviewMailName']}}
          </p>
        </div>
        <div v-else>
          {{scope.row['resumeInterviewMailName']}}
        </div>
      </template>

      <template slot-scope="scope" slot="resumeInterviewMsgName">
        <div v-if="addRecordShow">
          <p v-if="scope.row['resumeInterviewMsg'] === '0'">
            <a @click="sendMail(scope.row,2)">发送</a>
          </p>
          <p v-if="scope.row['resumeInterviewMsg'] === '2'">
            发送失败 <a @click="sendMail(scope.row,2)">重新发送</a>
          </p>
          <p v-if="scope.row['resumeInterviewMsg'] === '1'">
            {{scope.row['resumeInterviewMsgName']}}
          </p>
        </div>
        <div v-else>
          {{scope.row['resumeInterviewMsgName']}}
        </div>
      </template>

    </expand-table>

    <h4>面试评价：</h4>
    <expand-table
      :rows="rowsEvaluate"
      :loading="loading"
      :columns="columnsEvaluate"
      :slot-name-arr="['note']">
        <template slot-scope="scope" slot="note">
          <el-popover trigger="hover" placement="top" v-if="scope.row['note'].length>15" width="500">
            <p>{{scope.row['note']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['note'].slice(0,15)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['note']}}</p>
        </template>
    </expand-table>

    <div class="history" v-loading="loading" v-for="(item,index) in auditData" :key="index" v-if="auditData.length>0">
      <h4>审批记录：</h4>
      <ul>
        <li>
          <i>一审审批官：</i>{{item.firstAudit.userName}} &nbsp;&nbsp;&nbsp; {{item.firstAudit.firstInstanceAddTime}}
        </li>
        <li>
          <i>是否同意面试结果：</i>{{item.firstAudit.firstInstanceAgreeName}}
        </li>
        <li>
          <i>面试结果调整为：</i>{{item.firstAudit.firstInstanceResultName}}
        </li>
        <li>
          <i>调整理由：</i>{{item.firstAudit.firstInstanceReason}}
        </li>
      </ul>
      <hr>
      <ul>
        <li>
          <i>二审审批官：</i>{{item.secondAudit.userName}} &nbsp;&nbsp;&nbsp; {{item.secondAudit.secondInstanceAddTime}}
        </li>
        <li>
          <i>是否通过审批：</i>{{item.secondAudit.secondInstanceResultName}}
        </li>
        <li>
          <i>保底薪酬：</i>{{item.secondAudit.secondInstanceSalary}}
        </li>
        <li>
          <i>职级调整为：</i>{{item.secondAudit.secondInstanceLevel}}
        </li>
      </ul>
    </div>
    <!-- 添加面试 -->
    <addinterview
      v-if="dialogaddinterview"
      :resumeId="userId"
      :Name="queryObject.resumeName"
      :resumeProperty="queryObject.resumeProperty"
      @change-refresh-getlist="changeRefreshGetlist"
      :resumeTeachingDept="queryObject.resumeTeachingDept"
      @closeEv="dialogaddinterview = false">
    </addinterview>
  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
import addinterview from '../dialog/addinterview'
export default {
  name: 'interview',
  data() {
    return {
      loading: false,
      // 面试安排
      rows: [],
      columns: [
        { 'value': 'resumeInterviewAddTime', 'text': '添加时间' },
        { 'value': 'userName', 'text': '添加人' },
        { 'value': 'resumeInterviewSubject', 'text': '面试科目' },
        { 'value': 'resumeInterviewDate', 'text': '面试时间' },
        { 'value': 'resumeInterviewUser', 'text': '面试官' },
        { 'value': 'resumeInterviewMailName', 'text': '邮件通知' },
        { 'value': 'resumeInterviewMsgName', 'text': '短信发送' },
        { 'value': 'resumeInterviewAgreeName', 'text': '是否接受面试' }
      ],

      addRecordShow: false,
      // 面试评价
      rowsEvaluate: [],
      columnsEvaluate: [
        { 'value': 'userName', 'text': '面试官' },
        { 'value': 'interviewTime', 'text': '面试时间' },
        { 'value': 'interviewerRecordResultName', 'text': '面试结果' },
        { 'value': 'note', 'text': '评价内容' },
        { 'value': 'interviewerRecordAddTime', 'text': '评价时间' }
      ],
      // 审批记录
      auditData: [],
      dialogaddinterview: false
    }
  },
  components: {
    expandTable,
    addinterview
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
    getList() {
      this.loading = true
      this.$http.post('resume_interviewList', { resumeId: this.userId }).then(res => {
        if (res.data) {
          this.rows = res.data.interviewArrangeData.data
          this.rowsEvaluate = res.data.appraiseListData
          this.auditData = res.data.auditData
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    },
    sendMail(row, num) {
      if (!row.resumeInterviewTimeId || !row.resumeInterviewId) {
        this.$message.error('系统错误！')
        return false
      }
      const data = {
        resumeId: this.userId,
        resumeInterviewTimeId: row.resumeInterviewTimeId,
        resumeInterviewId: row.resumeInterviewId,
        resumeInterviewMail: num === 1 ? '1' : '',
        resumeInterviewMsg: num === 2 ? '1' : ''
      }
      this.$http.post('resume_sendInform', data).then(res => {
        if (res.data) {
          this.$message.success(res.message)
          this.getList()
        }
      }).catch(console.log)
    },
    addinterviewbtn() {
      if (!this.queryObject.resumeInfoAppendix) {
        this.$message.warning('请先上传简历，才可以进行面试安排~')
        return false
      }
      if (!this.queryObject.resumeTeachingDept) {
        this.$message.warning('请先去基础信息完善所属教学部，在进行添加面试！')
        return false
      }
      this.dialogaddinterview = true
    },
    changeRefreshGetlist() {
      this.$emit('refresh-status')
      this.getList()
    }// 添加面试刷新列表
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
    i
      display: inline-block
      width: 150px
    li
      line-height: 35px
      list-style: none
</style>



