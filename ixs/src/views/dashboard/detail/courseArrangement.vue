<template>
  <!-- 命令行生成的模板 -->
  <!-- 课程安排 -->
  <div>
    <div class="class-calendar">
      <h3>课程安排</h3>
      <el-form :model="query" ref="query" inline>
        <el-form-item>
          <el-date-picker
            v-model="queryTimeRange"
            :editable="false"
            type="daterange"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input
            placeholder="学生姓名"
            v-model.trim="query.keyword"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="group" v-if="jurisdiction">
          <el-select v-model="query.group" clearable filterable placeholder="组">
            <el-option
              v-for="(item,index) in options.deptTree"
              :key="index"
              :label="item.text"
              :value="item.id"
              :class="'level-'+item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="trackUserId" v-if="jurisdiction">
          <el-select v-model="query.trackUserId" clearable filterable placeholder="人">
            <el-option
              v-for="(item,index) in options.allUser"
              :key="index"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="subjectId">
          <el-select v-model="query.subjectId" clearable filterable placeholder="科目">
            <el-option
              v-for="(item,index) in options.subject"
              :key="index"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <expand-table
        :pagination="paging"
        @get-list="getList"

        :rows="rows"
        :loading="loading"
        :columns="columns"
        :slotNameArr="slotNameArr">

        <template slot-scope="scope" slot="status">
          <span :class="{'color-red':scope.row['status'] === '未用系统','color-green':scope.row['status'] === '备课中','color-blue':scope.row['status'] === '上课中'}">{{scope.row['status']}}</span>
        </template>

        <template slot-scope="scope" slot="downloadUrl">
          <el-popover trigger="hover" placement="top" v-if="scope.row['downloadUrl'] && scope.row['downloadUrl'].length>10" width="500">
            <p>{{scope.row['downloadUrl']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['downloadUrl'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['downloadUrl']}}</p>
        </template>

        <template slot-scope="scope" slot="teacherEvaluate">
          <el-popover trigger="hover" placement="top" v-if="scope.row['teacherEvaluate'] && scope.row['teacherEvaluate'].length>10" width="500">
            <p>{{scope.row['teacherEvaluate']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['teacherEvaluate'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['teacherEvaluate']}}</p>
        </template>

      </expand-table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ExpandTable from '@/components/ExpandTable'

  export default {
    name: 'courseArrangement',
    components: {
      ExpandTable
    },
    data() {
      return {
        isCanSearch: true,
        jurisdiction: false,
        loading: false,
        queryTimeRange: this.getQueryTimeRange(),
        query: {
          calendarStart: '',
          calendarEnd: '',
          group: '',
          trackUserId: '',
          subjectId: '',
          keyword: ''
        },
        options: {
          deptTree: [],
          allUser: [],
          subject: []
        },
        slotNameArr: ['status', 'downloadUrl', 'teacherEvaluate'],
        columns: [
          { 'value': 'status', 'text': '状态' },
          { 'value': 'studentName', 'text': '学生姓名' },
          { 'value': 'subjectName', 'text': '科目' },
          { 'value': 'lessonName', 'text': '课程' },
          { 'value': 'planStartTime', 'text': '课程时间' },
          { 'value': 'downloadUrl', 'text': '诊断报告' },
          { 'value': 'teacherEvaluate', 'text': '学生对老师的评价' },
          { 'value': 'trackUserName', 'text': '跟进人' }
        ],
        rows: [],
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '5'
        }
      }
    },
    computed: {
      ...mapGetters(['roleCode'])
    },
    created() {
      this.getList()
    },
    mounted() {
      this.formdata()
      this.subjects()
    },
    watch: {
      'query.group'(val) {
        if (val.length !== 0) {
          this.query.trackUserId = ''
          this.getGroupMember()
        } else {
          this.query.trackUserId = ''
          this.formdata()
        }
      }
    },
    methods: {
      getQueryTimeRange() {
        const date = new Date()
        const year = date.getFullYear()
        const mouth = date.getMonth() + 1
        const day = date.getDate()
        var _mouth
        if (mouth < 10) {
          _mouth = `0${mouth}`
        } else {
          _mouth = mouth
        }
        return [`${year}-${_mouth}-${day}`, `${year}-${_mouth}-${day}`]
      },
      subjects() {
        this.$http.post('lesson_studentCalendarParam', {
          studentIntentionId: '572015'
        }).then(res => {
          if (res.data) {
            this.$set(this.options, 'subject', res.data.subject)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getGroupMember() {
        this.$http.post('search_getGroupMember', { group: this.query.group }).then(res => {
          if (res.data) {
            this.$set(this.options, 'allUser', res.data.users)
          } else {
            this.$message.warning(res.message)
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      formdata() {
        this.$http.get('search_getMembers').then(res => {
          if (res.data) {
            this.options = res.data
          } else {
            this.$message.warning(res.message)
          }
        }).catch((res) => {
          console.log(res)
        })
        if (this.roleCode === 'XS-ZY') {
          this.jurisdiction = false
        } else {
          this.jurisdiction = true
        }
      },
      getList() {
        this.loading = true
        this.isCanSearch = false
        const _query = Object.assign({}, this.query)
        if (_query.calendarTime === null || this.queryTimeRange.length === 0) {
          _query.calendarStart = ''
          _query.calendarEnd = ''
        } else {
          _query.calendarStart = this.queryTimeRange[0]
          _query.calendarEnd = this.queryTimeRange[1]
        }
        this.$delete(_query, 'calendarTime')
        this.$http.get('lesson_homePageLessonList', {
          params: _query,
          paging: this.paging
        }).then(res => {
          if (res.data) {
            if (!res.data.result) {
              this.rows = []
              this.paging.totalRows = '0'
              return
            }
            this.rows = res.data.result
            this.paging.totalRows = res.data.count
          } else {
            this.$message.warning(res.message)
          }
        }).catch((res) => {
          console.log(res)
        }).finally(() => {
          this.loading = false
          this.isCanSearch = true
        })
      }
    }
  }
</script>
<style lang="sass">
  @import '../../../styles/dashboard/index.sass'

</style>
