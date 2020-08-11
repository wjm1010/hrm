<template>
  <div class="dashboard-container">
  <el-row :gutter="20">
    <el-form ref="query" :model="query" inline>
      <el-form-item prop="deptTree" v-if="jurisdiction">
        <el-col :span="4">
          <el-form-item prop="deptTree">
            <el-select v-model="query.deptTree" placeholder="请选择部门" clearable filterable>
              <el-option
                v-for="item in options.deptTree"
                :key="item.id"
                :label="item.text"
                :value="item.id"
                :class="'level-'+item.level">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="allUser">
            <el-select v-model="query.allUser" placeholder="请选择人员" clearable filterable>
              <el-option
                v-for="item in options.allUser"
                :key="item.id"
                :label="item.text"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item><br>
      <el-form-item prop="keyWord">
        <el-col :span="4">
          <el-form-item prop="keyWord">
            <el-input
              placeholder="学生编号/姓名/手机号"
              v-model="query.keyWord"
              clearable>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="areaId">
            <el-select v-model="query.areaId" clearable filterable placeholder="请选择地区">
              <el-option
                v-for="item in options.areas"
                :key="item.id"
                :label="item.area_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="subjectId">
            <el-select v-model="query.subjectId" clearable filterable placeholder="请选择课程类型">
              <el-option
                v-for="item in options.subjects"
                :key="item.subject_id"
                :label="item.subject_name"
                :value="item.subject_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="examYear">
            <el-select v-model="query.examYear" clearable filterable placeholder="请选择高考年份">
              <el-option
                v-for="item in options.years"
                :key="item.year_id"
                :label="item.year_value"
                :value="item.year_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item><br>
      <el-form-item prop="lastCommunicationTime">
        <el-date-picker
          v-model="query.lastCommunicationTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          >
        </el-date-picker>
      </el-form-item><br>
      <el-form-item>
        <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!canSearch">查询</el-button>
        <el-button @click="resetForm('query')" icon="el-icon-delete" class="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-col :span="24">
      <expand-table

        :pagination="paging"
        @get-list="getList"
        :rows="rows"
        :loading="loading"
        :columns="columns"
        :slot-name-arr="slotNameArr">

        <template slot-scope="scope" slot="content">
            <el-popover trigger="hover" placement="top" v-if="scope.row['content'].length>10" width="500">
              <p>{{scope.row['content']}}</p>
              <div slot="reference" class="name-wrapper">
                <p>{{scope.row['content'].slice(0,10)}}...</p>
              </div>
            </el-popover>
            <p v-else>{{scope.row['content']}}</p>
        </template>

        <template slot-scope="scope" slot="curr_plan_name">
        <el-popover trigger="hover" placement="top" v-if="scope.row['curr_plan_name'].length>10" width="500">
          <p>{{scope.row['curr_plan_name']}}</p>
          <div slot="reference" class="name-wrapper">
            <p>{{scope.row['curr_plan_name'].slice(0,10)}}...</p>
          </div>
        </el-popover>
        <p v-else>{{scope.row['curr_plan_name']}}</p>
        </template>

        <template slot-scope="scope" slot="remainTime1">
          <span>{{scope.row.remainTime[1]}}</span>
        </template>

        <template slot-scope="scope" slot="remainTime2">
          <span>{{scope.row.remainTime[2]}}</span>
        </template>

        <template slot-scope="scope" slot="operating">
          <el-button type="text" size="small" @click="changeTableViewSelect(scope.row)" class="actionItems">
            沟通详情
          </el-button>
        </template>

      </expand-table>
    </el-col>

  </el-row>
  </div>
</template>

<script>
import ExpandTable from '@/components/ExpandTable'

import { mapGetters } from 'vuex'
export default {
  name: 'lessonWarningindex',
  components: {
    ExpandTable
  },
  data() {
    return {
      jurisdiction: false,
      options: {
        deptTree: [],
        allUser: [],
        subjects: [],
        areas: [],
        years: []
      },
      keyWord: '',
      columns: [
        { 'value': 'student_no', 'text': '学生编号' },
        { 'value': 'name', 'text': '学生姓名' },
        { 'value': 'area_name', 'text': '所在地区' },
        { 'value': 'exam_year', 'text': '高考年份' },
        { 'value': 'curr_plan_name', 'text': '报名课程' },
        { 'value': 'remainTime1', 'text': '剩余常规课时' },
        { 'value': 'remainTime2', 'text': '剩余五星课时' },
        { 'value': 'teacher_name', 'text': '班主任' },
        { 'value': 'content', 'text': '最后沟通内容' },
        { 'value': 'end_time', 'text': '最后沟通时间' },
        { 'value': 'operating', 'text': '查看' }
      ],
      rows: [],
      loading: true,
      canSearch: true,
      slotNameArr: ['operating', 'content', 'curr_plan_name', 'remainTime1', 'remainTime2'],
      paging: {
        totalRows: '0',
        page: '1',
        pageSize: '10'
      },
      query: {
        lastCommunicationTime: [],
        deptTree: '',
        allUser: '',
        lastCommunicationTimeStart: '',
        lastCommunicationTimeEnd: '',
        subjectId: '',
        areaId: '',
        examYear: '',
        keyWord: ''
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
  },
  watch: {
    'query.deptTree'(newVal) {
      this.$set(this.query, 'allUser', '')
      if (newVal.length) {
        this.getGroupMember()
      } else {
        this.options.allUser = ''
      }
    }
  },
  methods: {
    changeTableViewSelect(row) {
      if (row.rosterId) {
        this.$eventBus.$emit('show-no-permission-dialog', row.rosterId)
      } else {
        this.$message.error('系统错误！')
      }
    }, // 沟通详情
    getGroupMember() { // 获取班主任人员
      this.$http.post('visit_getGroupMember', { group: this.query.deptTree }).then(res => {
        if (res.data) {
          this.$set(this.options, 'allUser', res.data.users)
        }
      }).catch(console.log)
    },
    formdata() {
      this.$http.get('course_search').then(res => {
        if (res.data) {
          this.options = res.data
          this.options.allUser = []
        }
      }).catch(console.log)
      if (this.roleCode === 'ZJ-ZY') {
        this.jurisdiction = false
      } else {
        this.jurisdiction = true
      }
    },
    handleData(data) { // 处理表格数据
      this.rows = []
      data.map(item => {
        var listArray = []
        if (item['curriculums']) {
          item['curriculums'].forEach((item, index) => {
            listArray.push(item['curr_plan_name'])
          })
          item['curr_plan_name'] = listArray.join('/')
        }
        this.rows.push(item)
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getList() {
      this.loading = true
      this.canSearch = false
      const _query = Object.assign({}, this.query)
      if (_query.lastCommunicationTime === null || _query.lastCommunicationTime.length === 0) {
        _query.lastCommunicationTimeStart = ''
        _query.lastCommunicationTimeEnd = ''
      } else {
        _query.lastCommunicationTimeStart = _query.lastCommunicationTime[0]
        _query.lastCommunicationTimeEnd = _query.lastCommunicationTime[1]
      }
      this.$delete(_query, 'lastCommunicationTime')
      this.$http.get('course_overWarn', {
        params: _query,
        paging: this.paging
      }).then(res => {
        if (res.data) {
          if (res.data.list.length === 0) {
            this.rows = []
            this.paging.totalRows = '0'
            return
          }
          this.handleData(res.data.list)
          this.paging.totalRows = res.data.paging.dataCount
        }
      }).catch(console.log).finally(() => {
        this.loading = false
        this.canSearch = true
      })
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/lessonWarning/index.sass'

</style>
