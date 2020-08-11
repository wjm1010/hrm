<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container feedback">
    <el-row>
      <span>学科：</span>
      <el-select allow-create filterable v-model="query.subjectId" clearable placeholder="请选择">
        <el-option
          v-for="item in options.subject"
          :key="item.subject_id"
          :label="item.subject_name"
          :value="item.subject_id">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
    </el-row>
    <el-row>
      <!-- 列表 -->
      <expand-table
        :rows="rows"
        :loading="loading"
        @get-list="getData"
        :columns="columns"
        :slot-name-arr="slotNameArr"
        :pagination="paging">
        <template slot-scope="scope" slot="commit">
          <el-button type="primary" @click='openCommit(scope.row)'>查看评价</el-button>
        </template>
      </expand-table>
    </el-row>
    <!-- 弹框部分 -->
      <el-dialog
      custom-class="el-dialog-md"
      @close="closeCommit"
      :visible.sync="commitVisible"
      width="50%"
      center>
      <!-- 菜单 -->
      <nav>
        <ul class="nav">
          <li
            class="nav-item"
            :class="commitActIndex === index ? 'act' : ''"
            v-for="(i, index) in nav"
          @click= "changeCommitAct(index)"
          :key="index">{{i}}</li>
        </ul>
      </nav>
     <!-- 评价内容 -->
      <section class="con">
        <!-- 学生评价内容 -->
        <div class="con-student" v-show='!commitActIndex'>
          <div style="text-align: center" v-if="!iframeUrl.student">
            <img src="./no_student_evaluation.png" >
            <h1>暂无评价</h1>
          </div>
          <iframe v-else :src="iframeUrl.student" frameborder="0" scrolling="yes" style="width:100%;height: 1000px"></iframe>
        </div>
        <!-- 老师评价内容 -->
        <div class="con-teacher" v-show='commitActIndex'>
          <iframe :src="iframeUrl.teacher" frameborder="0" scrolling="yes" style="width:100%;height: 1000px"></iframe>
        </div>
      </section>
    </el-dialog>
  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'studyfeedback',
  data() {
    return {
      paging: {
        page: '1', // 当前第几页
        pageSize: '40', // 一页多少条
        totalRows: '0' // 一共多少条
      },
      rows: [],
      columns: [
        { 'value': 'lessonName', 'text': '课程名称' },
        { 'value': 'subjectName', 'text': '学科' },
        { 'value': 'teacherName', 'text': '教师' },
        { 'value': 'lessonTypeName', 'text': '课程类型' },
        { 'value': 'isSystem', 'text': '是否系统' },
        { 'value': 'isNormal', 'text': '是否正常' },
        { 'value': 'planStartTime', 'text': '课程开始时间', width: 140 },
        { 'value': 'planEndTime', 'text': '课程结束时间', width: 140 },
        { 'value': 'studentStartTime', 'text': '学生上课时间', width: 140 },
        { 'value': 'commit', 'text': '操作' },
      ],
      slotNameArr: ['commit'],
      nav: ['学生评价', '老师评价'],
      iframeUrl: {
        student: '',
        teacher: ''
      },
      haveGetIframeUrl: {
        student: false,
        teacher: false
      },
      query: {
        studentIntentionId: this.$route.params.studentIntentionId,
        subjectId: ''
      },
      queryFeedbackComment: {
        studentId: this.$route.params.studentIntentionId,
        lessonPlanId: '',
        type: '',
        subjectId: ''
      },
      options: {
        subject: ''
      },
      commitActIndex: 0, // 弹出层tab页高亮索引值
      commitVisible: false, // 弹出层开关
      loading: false,
    }
  },
  components: { expandTable },
  created() {
    this.getSubjectName()
    this.getData()
  },
  methods: {
    /**
     * 获取学科下拉框内容
     * @return {[type]} [description]
     */
    getSubjectName() {
      this.$http.get('student_getSubjectName').then(res => {
        if (res.data) {
          this.options.subject = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /**
     * 获取列表内容
     * @return {[type]} [description]
     */
    getData() {
      this.loading = true
      this.$http.post('lesson_feedbackList', this.query, {
        paging: this.paging
      }).then(res => {
        if (res.data) {
          if (!res.data.list.length) {
            this.rows = []
            this.paging.totalRows = '0'
          } else {
            this.rows = res.data.list
            this.paging.totalRows = res.data.paging.dataCount
          }
        }
      }).catch(console.error).finally(() => {
        this.loading = false
      })
    },
    /**
     * 获取反馈评价
     * @return {[type]} [description]
     */
    feedbackComment() {
      this.queryFeedbackComment.type = !this.commitActIndex ? 'student' : 'teacher'
      if (this.haveGetIframeUrl[this.queryFeedbackComment.type]) return

      this.$http.get('lesson_feedbackComment', { params: this.queryFeedbackComment }).then(({ data } = {}) => {
        if (!data) return
        if (data.url) {
          this.iframeUrl[this.queryFeedbackComment.type] = data.url
        }
        this.haveGetIframeUrl[this.queryFeedbackComment.type] = true
      }).catch(error => {
        console.error(error)
        this.$message.error('系统错误')
      })
    },
    /**
     * 切换tab页
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    changeCommitAct(index) {
      this.commitActIndex = index
      this.feedbackComment()
    },
    /**
     * 打开弹出层
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    openCommit(data) {
      this.commitVisible = true
      this.queryFeedbackComment.lessonPlanId = data.lessonPlanId
      this.queryFeedbackComment.subjectId = data.subjectId
      this.feedbackComment()
    },
    /**
     * 关闭弹出层
     * @return {[type]} [description]
     */
    closeCommit() {
      this.commitVisible = false
      this.iframeUrl = {
        student: '',
        teacher: ''
      }
      this.haveGetIframeUrl = {
        student: false,
        teacher: false
      }
      this.commitActIndex = 0
    },
  }
}
</script>
<style lang="sass" scoped>

@import '../../styles/study/feedback.sass'

</style>
