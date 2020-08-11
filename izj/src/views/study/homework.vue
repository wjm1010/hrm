<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">

    <div style="margin-bottom: 10px">
      <span>学科：</span>
      <el-select
        v-model="query.subjectId"
        clearable
        filterable
      >
        <el-option
          v-for="item in option.subject"
          :key="item.subject_id"
          :label="item.subject_name"
          :value="item.subject_id"
        >
        </el-option>
      </el-select>
      <el-button type="primary" @click="getList">搜索</el-button>
    </div>

    <el-radio-group v-model="query.status" @change="getList">
      <el-radio-button label="all" :disabled="!isCanSearch">全部</el-radio-button>
      <el-radio-button label="0" :disabled="!isCanSearch">未完成</el-radio-button>
      <el-radio-button label="1" :disabled="!isCanSearch">已完成未批改</el-radio-button>
      <el-radio-button label="4" :disabled="!isCanSearch">批改中</el-radio-button>
      <el-radio-button label="2" :disabled="!isCanSearch">已批改</el-radio-button>
    </el-radio-group>

    <expand-table
      :pagination="paging"
      @get-list="getList"
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr"
    >
      <template slot-scope="scope" slot="status">
        <span>{{scope.row.status | statusFilter}}</span>
      </template>

      <template slot-scope="scope" slot="score">
        <span>{{scope.row.score | scoreFilter}}</span>
      </template>

      <template slot-scope="scope" slot="operating">
        <el-button type="primary" size="small" @click="handleLook(scope.row.homeWorkId,scope.row.status)">查看</el-button>
      </template>
    </expand-table>

    <homework-dialog
      v-if="dialogIsShow"
      :homeWorkId="homeWorkId"
      :status="status"
      :isShow.sync="dialogIsShow">
    </homework-dialog>
  </div>
</template>

<script>
  import homeworkDialog from './dialog/homeworkDialog'
  import ExpandTable from '@/components/ExpandTable'

  export default {
    name: 'studyhomework',
    components: {
      homeworkDialog,
      ExpandTable
    },
    filters: {
      scoreFilter(val) {
        if (!val) {
          return ''
        }
        const arr = ['一星', '二星', '三星', '四星', '五星']
        return arr[val - 1]
      },
      statusFilter(val) {
        let str = ''
        switch (val) {
          case '0':
            str = '未完成'
            break
          case '1':
          case '3':
            str = '已完成未批改'
            break
          case '4':
            str = '批改中'
            break
          case '2':
            str = '已批改'
            break
        }
        return str
      }
    },
    data() {
      return {
        loading: true,
        isCanSearch: true,
        dialogIsShow: false,
        studentIntentionId: this.$route.params.studentIntentionId,
        homeWorkId: '',
        status: '',
        query: {
          status: 'all',
          subjectId: ''
        },
        option: {
          subject: []
        },
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '40'
        },
        rows: [],
        columns: [
          { value: 'currPlanName', text: '作业课程名称' },
          { value: 'subjectName', text: '学科' },
          { value: 'teacherName', text: '教师' },
          { value: 'status', text: '状态' },
          { value: 'score', text: '评分' },
          { value: 'startTime', text: '布置时间' },
          { value: 'endTime', text: '截至时间' },
          { value: 'studentSubmitTime', text: '提交时间' },
          { value: 'operating', text: '操作' }
        ],
        slotNameArr: ['score', 'status', 'operating']
      }
    },
    created() {
      this.getList()
      this.getOption()
    },
    methods: {
      getSubjectName() {
        return this.$http.get('student_getSubjectName')
      },
      getOperationSituation() {
        return this.$http.get('evaluate_operationSituation', {
          params: { ...this.query, studentIntentionId: this.studentIntentionId },
          paging: this.paging
        })
      },
      handleLook(id, status) {
        this.status = status
        this.homeWorkId = id
        this.dialogIsShow = true
      },
      async getOption() {
        try {
          const { data } = await this.getSubjectName()
          if (!data) return
          this.option.subject = data
        } catch (e) {
          console.log(e)
        }
      },
      async getList() {
        try {
          this.loading = true
          this.isCanSearch = false
          const { data } = await this.getOperationSituation()
          if (!data) return
          if (data.list.length === 0) {
            this.rows = []
            this.paging.totalRows = '0'
            return
          }
          this.rows = data.list
          this.paging.totalRows = data.count
        } catch (e) {
          console.log(e)
        } finally {
          this.loading = false
          this.isCanSearch = true
        }
      }
    }
  }
</script>
<style lang="sass" scoped>

  @import '../../styles/study/homework.sass'

</style>
