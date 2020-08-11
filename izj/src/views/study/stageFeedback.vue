<template>
  <div class="dashboard-container">
    <el-form ref="query" :model="query" inline>
      <el-form-item prop="reportTime" label="报告时间：">
        <el-date-picker
          v-model="query.reportTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="subjectId" label="学科名称：">
        <el-select v-model="query.subjectId" clearable filterable placeholder="请选择">
          <el-option
            v-for="(item,key) in options.subjects"
            :key="key"
            :label="item"
            :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!canSearch">查询</el-button>
        <el-button @click="resetForm('query')" icon="el-icon-delete" class="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <expand-table
      :pagination="paging"
      :rows="rows"
      @get-list="getList"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="operating">
        <el-button size="small" @click="lookReport(scope.row)" type="primary">
          查看报告
        </el-button>
      </template>
    </expand-table>
    <stageFeedbackDialog
      v-if="reportDialogShow"
      :isShow.sync="reportDialogShow"
      :stageId="dialogStageId"
      :studentIntentionId="studentIntentionId"
    ></stageFeedbackDialog>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import stageFeedbackDialog from './dialog/stageFeedbackDialog.vue'

  export default {
    name: 'stageFeedback',
    components: {
      ExpandTable,
      stageFeedbackDialog
    },
    data() {
      return {
        options: {
          subjects: {}
        },
        columns: [
          { 'value': 'plantime', 'text': '报告时间' },
          { 'value': 'subjectName', 'text': '学科名称' },
          { 'value': 'operating', 'text': '' }
        ],
        rows: [],
        loading: true,
        canSearch: true,
        slotNameArr: ['operating'],
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '40'
        },
        query: {
          reportTime: [],
          subjectId: ''
        },
        reportDialogShow: false,
        dialogStageId: '',
        studentIntentionId: this.$route.params.studentIntentionId
      }
    },
    created() {
      this.init()
      this.getList()
    },
    methods: {
      getStudentReportSubject() {
        return this.$http.get('student_getStudentReportSubject', {
          params: {
            studentIntentionId: this.$route.params.studentIntentionId
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      async init() {
        try {
          const { data } = await this.getStudentReportSubject()
          if (!data) return
          this.options.subjects = data
        } catch (e) {
          console.error(e)
        }
      },
      getList() {
        this.loading = true
        this.canSearch = false
        const _query = Object.assign({}, this.query)
        if (_query.reportTime === null || _query.reportTime.length === 0) {
          _query.startTime = ''
          _query.endTime = ''
        } else {
          _query.startTime = _query.reportTime[0]
          _query.endTime = _query.reportTime[1]
        }
        this.$delete(_query, 'reportTime')
        this.$http.get('student_getStudentPeriodicFeedback', {
          params: Object.assign({}, _query, { studentIntentionId: this.$route.params.studentIntentionId }),
          paging: this.paging
        }).then(({ data } = {}) => {
          if (!data) return
          this.rows = data.data
          this.paging.totalRows = data.paging.dataCount
        }).catch(console.error()).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      lookReport(row) {
        this.dialogStageId = row.stageId
        this.reportDialogShow = true
      }
    }
  }
</script>

