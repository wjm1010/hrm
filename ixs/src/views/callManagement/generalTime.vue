<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container generalTime">
    <el-row>
      <el-form inline label-width="107px" ref="form" :model="query" class="search">
        <el-date-picker
          v-model="query.submitTime"
          type="daterange"
          range-separator="至"
          start-placeholder="通话时间"
          value-format="yyyy-MM-dd"
          class="position-left">
        </el-date-picker>
        <el-form-item prop="deptTree" v-if="Number(options.status)">
          <el-select v-model="query.deptTree" clearable collapse-tags placeholder="组">
            <el-option
              v-for="item in options.deptTree"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="query.allUser" filterable clearable collapse-tags placeholder="姓名[工号]">
            <el-option
              v-for="item in options.allUser"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class='search'>
      <el-button type="primary" icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>
      <el-button icon="el-icon-delete" @click="resetFields">重置</el-button>
    </el-row>
    <el-row>
    <!-- 列表 -->
      <expand-table
        :rows="rows"
        :loading="loading"
        :columns="columns"
        :slot-name-arr="slotNameArr"
        :pagination="paging"
        @get-list="getList">
      </expand-table>
    </el-row>
  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'
  // import EventBus from '@/eventBus.js'
  export default {
    name: 'generalTime',
    components: { expandTable },
    data() {
      return {
        columns: [
          { 'value': 'showName', 'text': '坐席姓名' },
          { 'value': 'numbers', 'text': '总呼出次数' },
          { 'value': 'timeTotal', 'text': '呼出总时长' },
          { 'value': 'throughTotal', 'text': '呼出后接通总次数' },
          { 'value': 'throughTimeTotal', 'text': '呼出后接通总时长' },
          { 'value': 'childrenTotal', 'text': '呼叫学生/家长接通总次数', width: 100 },
          { 'value': 'childrenTimeTotal', 'text': '呼叫学生/家长接通总时长', width: 100 },
          { 'value': 'teacherTotal', 'text': '呼叫老师接通总次数' },
          { 'value': 'teacherTimeTotal', 'text': '呼叫老师接通总时长' },
          { 'value': 'otherTotal', 'text': '直接输号码拨打接通总次数', width: 90 },
          { 'value': 'otherTimeTotal', 'text': '直接输号码拨打接通总时长', width: 90 }
        ],
        slotNameArr: ['opertion'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '20', // 一页多少条
          totalRows: '0' // 一共多少条
        },
        options: {
          status: 1,
          deptTree: [],
          allUser: []
        },
        query: {
          deptTree: '',
          allUser: '',
          submitTime: ''
        },
        loading: false,
        isCanSearch: true
      }
    },
    computed: {},
    created() {
      this.getGroup()
      this.getList()
    },
    methods: {
      /**
       * 获取列表
       */
      getList() {
        this.loading = true
        this.isCanSearch = false
        const _query = Object.assign({}, this.query)
        if (_query.submitTime === null || _query.submitTime.length === 0) {
          _query.communicationStartTime = ''
          _query.communicationEndTime = ''
        } else {
          _query.communicationStartTime = _query.submitTime[0]
          _query.communicationEndTime = _query.submitTime[1]
        }
        this.$delete(_query, 'submitTime')
        this.$http.get('call_communicationList', { params: _query, paging: this.paging }).then(res => {
          if (res.data) {
            if (!res.data.list.length) {
              this.rows = []
              this.paging.totalRows = '0'
            } else {
              this.rows = [res.data.all].concat(res.data.list)
              this.paging.totalRows = res.data.paging.dataCount
            }
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
          this.isCanSearch = true
        })
      },
      /**
       * 获取组
       */
      getGroup() {
        this.$http.get('call_communicationSearch').then(res => {
          if (res.data) {
            this.options = res.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 重置
       */
      resetFields() {
        this.query.submitTime = ''
        this.query.deptTree = ''
        this.query.allUser = ''
      },
      /**
       * 获取姓名
       */
      getMember() {
        this.$http.get('call_getGroupMember', { params: { group: this.query.deptTree }}).then(res => {
          if (res.data) {
            this.options.allUser = res.data.allUser
          }
        }).catch(error => {
          console.log(error)
        })
      },
    },
    watch: {
      'query.deptTree'(val) {
        if (val.length !== 0) {
          this.query.allUser = ''
          this.getMember()
        } else {
          this.query.allUser = ''
          this.getGroup()
        }
      }
    },
  }
</script>
<style lang="sass">
  @import '../../styles/callManagement/generalTime.sass'
</style>
