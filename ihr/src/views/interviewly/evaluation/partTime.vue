<template>
  <div class="dashboard-container">
    <div class="fr">
      <el-button type="primary" @click="claim">认领</el-button>
      <el-button type="primary" @click="$router.push('/interviewly/evaluation')" plain>返回评价页</el-button>
    </div>
    <expand-table
      can-check-all-box="yes"
      @selection-change-event="handleSelectionChange"
      @change-table-sort="changeTableSort"
      @get-list="getList"
      :rows="list"
      :loading="loading"
      :pagination="paging"
      :columns="columns"
      :slot-name-arr="slotNameArr">
    </expand-table>
  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'interview-evaluation-partTime',
  components: {
    expandTable,
  },
  data() {
    return {
      loading: false,
      query: {},
      interviewArr: [],
      isCanSearch: true,
      slotNameArr: ['operating'],
      list: [],
      selectedData: [],
      columns: [
        { 'value': 'resumeId', 'text': '编号' },
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'resumeInterviewSubject', 'text': '面试科目' },
        { 'value': 'resumeGrade', 'text': '面试年级' },
        { 'value': 'resumeProperty', 'text': '岗位属性' },
        { 'value': 'resumeVideoLink', 'text': '视频地址', width: 300 },
        { 'value': 'userName', 'text': '跟进人' },
        { 'value': 'resumeVideoUpTime', 'text': '提交视频时间', sortable: true },
      ],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },
      dialogShow: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    /**
     * 获取列表
     * @return {[type]} [description]
     */
    async getList() {
      this.isCanSearch = false
      this.loading = true
      const res = await this.$http.post('interviewer_claimPartTimeList', this.query, { paging: this.paging, isFilterUrl: true })
      this.loading = false
      this.isCanSearch = true
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      if (!res.data.data.length) {
        this.$message.warning('没有符合条件的数据')
        this.paging.totalRows = '0'
        this.list = []
        return
      }
      this.list = res.data.data
      this.paging.totalRows = res.data.count
    },
    /**
     * 保存认领
     * @return {[type]} [description]
     */
    async saveClaimFullTime() {
      const resumeId = this.interviewArr.map(t => t.resumeId).toString()
      const res = await this.$http.post('interviewer_saveClaimFullTime', { resumeId })
      if (typeof res.data !== 'string') {
        this.$message.success(res.message)
      }
      this.interviewArr = []
      this.paging.page = 1
      this.getList()
    },
    /**
     * 排序
     * @param  {[type]} prop  [description]
     * @param  {[type]} order [description]
     * @return {[type]}       [description]
     */
    changeTableSort(prop, order) {
      this.query.sequence = prop
      this.query.sort = order
      this.getList()
    },
    /**
     * 认领
     * @return {[type]} [description]
     */
    claim() {
      if (!this.interviewArr.length) {
        this.$message.warning('请先勾选您需要认领的候选人')
        return
      }
      this.saveClaimFullTime()
    },
    /**
     * 勾选回调
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    handleSelectionChange(val) {
      this.interviewArr = [...this.interviewArr, ...val]
    },
  }
}
</script>
<style lang="sass" scoped>
.item-input
  width: 200px
.dialog-claim-title, .dialog-claim-tip
  text-align: center!important
</style>
