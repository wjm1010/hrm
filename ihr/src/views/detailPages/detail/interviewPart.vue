<template>
  <div class="main-content">

    <h4>面试通知：</h4>
    <expand-table
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="['resumeIsSendMailName','resumeIsSendMsgName']">

      <template slot-scope="scope" slot="resumeIsSendMailName">
        <div v-if="addRecordShow">
          <p v-if="scope.row['resumeIsSendMail'] === '0'">
            <a @click="sendMail(scope.row,1)">发送</a>
          </p>
          <p v-if="scope.row['resumeIsSendMail'] === '2'">
            邮件：发送失败 <a @click="sendMail(scope.row,1)">重新发送</a>
          </p>
          <p v-if="scope.row['resumeIsSendMail'] === '1'">
            {{scope.row['resumeIsSendMailName']}}
          </p>
        </div>
        <div v-else>
          {{scope.row['resumeIsSendMailName']}}
        </div>
      </template>

      <template slot-scope="scope" slot="resumeIsSendMsgName">
        <div v-if="addRecordShow">
          <p v-if="scope.row['resumeIsSendMsg'] === '0'">
            <a @click="sendMail(scope.row,2)">发送</a>
            <a @click="lookMsg">(预览短信)</a>
          </p>
          <p v-if="scope.row['resumeIsSendMsg'] === '2'">
            发送失败 <a @click="sendMail(scope.row,2)">重新发送</a>
          </p>
          <p v-if="scope.row['resumeIsSendMsg'] === '1'">
            {{scope.row['resumeIsSendMsgName']}}
          </p>
        </div>
        <div v-else>
          {{scope.row['resumeIsSendMsgName']}}
        </div>
      </template>

    </expand-table>

    <div class="fr" v-if="addRecordShow" style="margin:20px 0">
      <el-button type="primary" @click="addRecord">+ 添加面试</el-button>
    </div>

    <h4>面试安排：</h4>
    <expand-table
      :rows="rows1"
      :loading="loading"
      :columns="columns1"
      :slot-name-arr="['resumeInterviewVideoLink']">
      <template slot-scope="scope" slot="resumeInterviewVideoLink" style="color: #409eff">
          <el-popover trigger="hover" placement="top" v-if="scope.row['resumeInterviewVideoLink'].length>30" width="500">
            <p>
              <a :href="scope.row['resumeInterviewVideoLink']" target="_blank">{{scope.row['resumeInterviewVideoLink']}}</a>
            </p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['resumeInterviewVideoLink'].slice(0,30)}}...</p>
            </div>
          </el-popover>
          <p v-else>
            <a :href="scope.row['resumeInterviewVideoLink']" target="_blank">{{scope.row['resumeInterviewVideoLink']}}</a>
          </p>
        </template>
    </expand-table>

    <h4>面试评价：</h4>
    <expand-table
      :rows="rows2"
      :loading="loading"
      :columns="columns2"
      :slot-name-arr="['note']">
        <template slot-scope="scope" slot="note">
          <el-popover trigger="hover" placement="top" v-if="scope.row['note'].length>10" width="500">
            <p>{{scope.row['note']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['note'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['note']}}</p>
        </template>
    </expand-table>


    <el-dialog
      title="添加面试"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="el-dialog-sl"
      :visible.sync="dialogVisible"
      @close="closeEv('query')">
        <el-form :model="query" :rules="rules" ref="query" label-width="120px" inline>
          <el-form-item >
            <div style='display: flex; width: 400px'>
              <span style="width: 72px;margin-left:38px;">视频地址：</span>
              <span style="width: 72%; word-wrap: break-word;"><a target="_blank" :href=query.resumeVideoLink>{{query.resumeVideoLink}}</a></span>
            </div>
          </el-form-item>
          <el-form-item label="面试学科：" prop="resumeInterviewSubject">
            <el-select v-model="query.resumeInterviewSubject" placeholder="请选择">
              <el-option
                v-for="item in options.resumeInterviewSubject"
                :key="item.teachingGroupName"
                :label="item.teachingGroupName"
                :value="item.teachingGroupName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEv('query')">取 消</el-button>
          <el-button type="primary" @click="save('query')" :disabled="isDisabled">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { dialog } from '@/mixins'
export default {
  name: 'offer',
  mixins: [dialog],
  data() {
    return {
      loading: false,
      addRecordShow: false,
      dialogVisible: false,
      rows: [],
      columns: [
        { 'value': 'resumeAddTime', 'text': '报名时间' },
        { 'value': 'resumeIsSendMailName', 'text': '邮件' },
        { 'value': 'resumeIsSendMsgName', 'text': '短信' }
      ],
      rows1: [],
      columns1: [
        { 'value': 'resumeInterviewAddTime', 'text': '添加时间' },
        { 'value': 'userName', 'text': '添加人' },
        { 'value': 'resumeInterviewSubject', 'text': '面试科目' },
        { 'value': 'resumeInterviewVideoLink', 'text': '视频地址' },
        { 'value': 'resumeInterviewUserName', 'text': '认领状态' }
      ],
      rows2: [],
      columns2: [
        { 'value': 'userName', 'text': '面试官' },
        { 'value': 'interviewerRecordResultName', 'text': '面试结果' },
        { 'value': 'note', 'text': '评价内容' },
        { 'value': 'interviewerRecordAddTime', 'text': '评价时间' }
      ],
      query: {
        resumeVideoLink: '',
        resumeInterviewSubject: ''
      },
      options: {
        resumeInterviewSubject: []
      },
      rules: {
        resumeInterviewSubject: [
          { required: true, message: '请选择面试学科', trigger: 'change' }
        ]
      },
      isDisabled: false
    }
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
    },
  },
  created() {
    this.getList()
  },
  mounted() {
    this.path.indexOf('look') > 0 ? this.addRecordShow = false : this.addRecordShow = true
  },
  methods: {
    closeEv(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    async getOption() {
      const res = await this.$http.post('subject_getPartTeachingGroup', {
        teachingGroupStatus: '1',
        resumeId: this.userId
      })
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.options.resumeInterviewSubject = res.data.data
      this.query.resumeVideoLink = res.data.videoLink
    },
    getList() {
      this.loading = true
      this.$http.post('resume_viewList', { resumeId: this.userId }).then(res => {
        if (res.data) {
          this.rows = res.data.applyData
          this.rows1 = res.data.interviewArrangeData.data
          this.rows2 = res.data.appraiseListData
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    }, // offer 记录 培训记录 连接
    sendMail(row, num) {
      if (!row.resumeInterviewTimeId) {
        this.$message.error('系统错误！')
        return false
      }
      const data = {
        resumeId: this.userId,
        resumeInterviewTimeId: row.resumeInterviewTimeId,
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
    addRecord() {
      this.$http.post('resume_checkPerfectMsg', { resumeId: this.userId }).then(res => {
        if (res.data) {
          this.dialogVisible = true
          this.getOption()
        } else {
          this.$message.warning(res.message)
        }
      })
    }, // 添加面试弹窗获取数据
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          this.$http.post('resume_insert',
            Object.assign({ resumeId: this.userId }, this.query)).then(res => {
            if (res.data) {
              this.$message.success(res.message)
              this.dialogVisible = false
              this.$emit('refresh-status')
              this.getList()
            }
          }).catch(console.log).finally(() => {
            this.isDisabled = false
          })
        }
      })
    }, // 添加面试
    lookMsg() {
      this.$alert(this.queryObject.resumeName + '老师您好，考核邀请及试讲资料已发到您的邮箱，请您查收，谢谢！【海风教育】'
        , '短信模板', {
          showConfirmButton: false,
          center: true,
          callback: action => { return }
        })
    }// 短信预览
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



