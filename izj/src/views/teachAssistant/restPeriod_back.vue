<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container generalTime">
    <el-row>
      <el-form inline label-width="107px" ref="form" :model="query" class="search">
        <el-form-item prop="deptTree" v-if="Number(options.status)">
          <el-select v-model="query.deptTree" clearable collapse-tags placeholder="结课状态">
            <el-option
              v-for="item in options.deptTree"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="keyWord" class="searchName">
          <el-input
            placeholder="学生剩余课时"
            v-model.trim="query.keyWord"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="keyWord" class="searchName">
          <el-input
            placeholder="最小单位0.5小时"
            v-model.trim="query.keyWord"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="deptTree" v-if="Number(options.status)">
          <el-select v-model="query.deptTree" clearable collapse-tags placeholder="选择部门">
            <el-option
              v-for="item in options.deptTree"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="query.allUser" filterable clearable collapse-tags placeholder="选择人员">
            <el-option
              v-for="item in options.allUser"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="keyWord" class="searchName">
          <el-input
            placeholder="学员编号/姓名/手机号"
            v-model.trim="query.keyWord"
            clearable>
          </el-input>
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
    name: 'teachAssistantrestPeriod',
    components: { expandTable },
    data() {
      return {
        columns: [
          { 'value': 'showName', 'text': '学生编号' },
          { 'value': 'numbers', 'text': '学生姓名' },
          { 'value': 'timeTotal', 'text': '手机号' },
          { 'value': 'throughTotal', 'text': '地区' },
          { 'value': 'throughTimeTotal', 'text': '报名课程' },
          { 'value': 'childrenTotal', 'text': '报名时间' },
          { 'value': 'childrenTimeTotal', 'text': '学员剩余课时' },
          { 'value': 'teacherTotal', 'text': '常规剩余课时' },
          { 'value': 'teacherTimeTotal', 'text': '五星剩余课时' },
          { 'value': 'otherTotal', 'text': '成单数量' },
          { 'value': 'otherTimeTotal', 'text': '结课状态' },
          { 'value': 'otherTotal', 'text': '班主任' }
        ],
        slotNameArr: ['opertion'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
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
      this.initSearch()
      this.getGroup()
      this.getList()
    },
    mounted() {

    },
    methods: {
      initSearch() {
        this.$http.get('course_search').then(res => {
          if (res.data) {
            this.options = res.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
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
  @import '../../styles/teachAssistant/restPeriod.sass'
</style>
