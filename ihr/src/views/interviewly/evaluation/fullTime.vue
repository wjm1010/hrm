<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="130px" inline>
        <el-form-item label="关键字：">
          <el-input v-model.trim="query.keyword" placeholder="搜索姓名/候选人编号" clearable ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="primary" @click="$router.push('/interviewly/evaluation')" plain>返回评价页</el-button>
      </div>
    </el-row>
    <expand-table
      can-check-all-box="yes"
      @get-list="getList"
      :rows="list"
      :pagination="paging"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="operating">
        <el-button type="text" size="small" class="actionItems" @click="claim(scope.row)">认领</el-button>
      </template>
    </expand-table>
    <el-dialog
      center
      custom-class="el-dialog-mi"
      :visible.sync="dialogConfirmVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <h2 class="dialog-claim-title" >是否确认认领</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click='dialogConfirmVisible=false'>取消</el-button>
        <el-button type="primary" @click="saveClaimFullTime">确认认领</el-button>
      </div>
    </el-dialog>
    <el-dialog
      center
      custom-class="el-dialog-mi"
      :visible.sync="dialogClaim.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <h2 class="dialog-claim-title" >{{dialogClaim.isClaim ? '认领成功' : '认领失败'}}</h2>
      <p class="dialog-claim-tip" v-if='!dialogClaim.isClaim'>可能已经被其他老师领走啦~</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click='dialogClaim.visible=!dialogClaim.visible'>继续认领</el-button>
        <el-button type="primary" @click="$router.push('/interviewly/evaluation')">返回评价</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'interview-evaluation-fullTime',
  components: {
    expandTable,
  },
  data() {
    return {
      loading: false,
      query: {},
      dialogConfirmVisible: false,
      dialogClaim: {
        visible: false,
        isClaim: false,
      },
      isCanSearch: true,
      slotNameArr: ['operating'],
      list: [],
      selectedData: [],
      columns: [
        { 'value': 'resumeId', 'text': '编号' },
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'resumePhone', 'text': '手机号码' },
        { 'value': 'resumeInterviewSubject', 'text': '面试科目' },
        { 'value': 'resumeGrade', 'text': '面试年级' },
        { 'value': 'interviewerName', 'text': '面试官' },
        { 'value': 'resumeInterviewDate', 'text': '面试时间' },
        { 'value': 'userName', 'text': 'HR跟进人' },
        { 'value': 'operating', 'text': '操作' }
      ],
      resumeId: '',
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },
      dialogShow: false
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    search() {
      if (!this.query.keyword) {
        this.$message.warning('请输入关键词')
        return
      }
      this.getList()
    },
    /**
     * 获取列表
     * @return {[type]} [description]
     */
    async getList() {
      this.isCanSearch = false
      this.loading = true
      const res = await this.$http.post('interviewer_claimFullTimeList', this.query, { paging: this.paging })
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
      const res = await this.$http.post('interviewer_saveClaimFullTime', { resumeId: this.resumeId })
      this.$message[res.data ? 'success' : 'error'](res.message)
      this.dialogConfirmVisible = false
      this.dialogClaim.isClaim = true
      this.dialogClaim.visible = true
      this.paging.page = 1
      this.getList()
    },
    /**
     * 认领
     * @return {[type]} [description]
     */
    claim(data) {
      this.resumeId = data.resumeId
      this.dialogConfirmVisible = true
    }
  }
}
</script>
<style lang="sass" scoped>
.dialog-claim-title, .dialog-claim-tip
  text-align: center!important
</style>
