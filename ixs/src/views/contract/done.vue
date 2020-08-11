<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <div class="position">
      <el-date-picker
        v-model="query.submitTime"
        type="daterange"
        range-separator="至"
        start-placeholder="登记时间"
        value-format="yyyy-MM-dd"
        class="position-left">
      </el-date-picker>
      <div class="position-right">
        <el-button type="primary" icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>
        <el-button icon="el-icon-delete" @click="resetFields">重置</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <expand-table
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr"

      @change-table-sort="changeTableSort"
      :pagination="paging"
      @get-list="getList">

      <template slot-scope="scope" slot="opertion">
        <el-button type="text" @click="changeTableViewSelect(scope.row)" class="actionItems">沟通详情</el-button>
        <el-button type="text" @click="routerJump(scope.row)" class="actionItems">成单信息</el-button>
      </template>
    </expand-table>
  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'
  // import EventBus from '@/eventBus.js'
  export default {
    name: 'contractDone',
    components: { expandTable },
    data() {
      return {
        columns: [
          { 'value': 'studentName', 'text': '学生姓名' },
          { 'value': 'studentNo', 'text': '学生编号' },
          { 'value': 'contractId', 'text': '成单编号' },
          { 'value': 'sum', 'text': '成单金额' },
          { 'value': 'submitTime', 'text': '登记时间', sortable: 'custom' },
          { 'value': 'contractStatusName', 'text': '状态' },
          { 'value': 'submitUserName', 'text': '申请人' },
          { 'value': 'opertion', 'text': '操作' }
        ],
        slotNameArr: ['opertion'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0' // 一共多少条
        },
        query: {
          submitTime: '',
          sequence: '',
          sort: ''
        },
        loading: false,
        isCanSearch: true
      }
    },
    computed: {},
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        this.isCanSearch = false
        const _query = Object.assign({}, this.query)
        if (_query.submitTime === null || _query.submitTime.length === 0) {
          _query.submitTimeStart = ''
          _query.submitTimeEnd = ''
        } else {
          _query.submitTimeStart = _query.submitTime[0]
          _query.submitTimeEnd = _query.submitTime[1]
        }
        this.$delete(_query, 'submitTime')
        this.$http.post('contract_signed', _query, { paging: this.paging }).then(res => {
          if (res.data) {
            if (res.data.list.length === 0) {
              this.rows = []
              this.paging.totalRows = '0'
            } else {
              this.rows = res.data.list
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
      resetFields() {
        this.query.submitTime = []
      },
      showPart() {
        if (this.showPartQueryObj.btnText === '展开') {
          this.showPartQueryObj.showPartQuery = true
          this.showPartQueryObj.btnText = '收缩'
          this.showPartQueryObj.btnIcon = 'el-icon-caret-bottom'
        } else {
          this.showPartQueryObj.showPartQuery = false
          this.showPartQueryObj.btnText = '展开'
          this.showPartQueryObj.btnIcon = 'el-icon-caret-top'
        }
      },
      routerJump(row) {
        if (row.studentIntentionId) {
          this.$router.push(`/contract/student_list/${row.studentIntentionId}`)
        } else {
          this.$message.error('系统错误！')
          return
        }
      },
      changeTableViewSelect(row) {
        if (row.studentIntentionId) {
          this.$eventBus.$emit('show-no-permission-dialog', row.studentIntentionId)
        } else {
          this.$message.error('系统错误！')
        }
      },
      changeTableSort(prop, order) {
        this.query.sequence = prop
        this.query.sort = order
        this.getList()
      }
    }
  }
</script>
<style lang="sass">
  @import '../../styles/contract/sign.sass'
</style>
