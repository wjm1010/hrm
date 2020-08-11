<template>
  <div class="dashboard-container">
    <el-row>
      <Search
        :config="config"
        :options="options"
        :query="query"
        :SecondDirect="SecondDirect"
        @changeRole="changeRole"
        :secondSubject="secondSubject"
        @changeSubject="changeSubject"
        :isCanSearch="isCanSearch"
        :secondChannel="secondChannel"
        @getList="getList"
        @changeSecondChannel="changeSecondChannel">
      </Search>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="$router.push('/resume/rckUpload')" v-if="oprate && oprate.indexOf('1')>-1">导入</el-button>
      <el-button type="primary" @click="allocation" v-if="oprate && oprate.indexOf('2')>-1">分配</el-button>
      <el-button type="primary" @click="revulsion" v-if="oprate && oprate.indexOf('3')>-1">抽回</el-button>
    </div>

    <expand-table
      :can-check-all-box="canCheckAllBox"
      @selection-change-event="handleSelectionChange"
      :pagination="paging"
      @get-list="getList"
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="resumePhone" >
        <span  style="color: #409EFF;cursor: pointer" @click="seePhone(scope.row)">{{scope.row.resumePhone}}</span>
      </template>
      <template slot-scope="scope" slot="operating">
        <el-button type="text" size="small" class="actionItems" @click="look(scope.row)">查看</el-button>
      </template>
    </expand-table>


    <image-upload
      v-if="dialogObjectImg.showDialog"
      @change-refresh-getlist="this.getList"
      @closeEv="dialogObjectImg.showDialog = false">
    </image-upload>

    <msg-dialog
      :selectDataId="selectedDataId"
      :dialogLabel="dialogObject.dialogLabel"
      v-if="dialogObject.showDialog"
      @change-refresh-getlist="this.getList"
      @closeEv="dialogObject.showDialog = false"
      :dialogTitle="dialogObject.dialogTitle">
    </msg-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import expandTable from '@/components/ExpandTable'
import ImageUpload from '@/components/FileUpload/imageUploadDialog'
import MsgDialog from './components/dialog'
import Search from './components/search'
// resumeTypeName: 数据状态, resumeStatusName: 跟进状态, userName: 跟进人, resumeInterviewDate: 面试时间, resumeDiscardIdName: 废弃原因, resumeRevulsionIdName: 抽回原因
const config = {
  rckAllresume: { searchType: '1', resumeType: '', resumeStatus: '', resumeTypeName: true, searchNoDirectList: true }, // 全部数据
  rckNewresume: { searchType: '1', resumeType: '1', resumeStatus: '', searchNoDirectList: true }, // 新数据
  rckWithdrawData: { searchType: '1', resumeType: '2', resumeStatus: '', resumeRevulsionIdName: true, searchWithdrawReason: true, searchNoDirectList: true }, // 抽回数据
  rckScrapData: { searchType: '1', resumeType: '4', resumeStatus: '', resumeDiscardIdName: true, searchScrapReason: true, searchNoDirectList: true }, // 废弃数据
  rckAll: { searchType: '1', resumeType: '3', resumeStatusName: true, userName: true }, // 全部跟进中
  rckPending: { searchType: '1', resumeType: '', resumeStatus: '1', resumeStatusName: true, userName: true }, // 待处理
  rckKeepTouch: { searchType: '1', resumeType: '', resumeStatus: '-2', resumeStatusName: true, userName: true }, // 再联系
  rckAccessFailure: { searchType: '1', resumeType: '', resumeStatus: '2', resumeStatusName: true, userName: true }, // 未接通
  rckInterviewProcess: { searchType: '1', resumeType: '', resumeStatus: '6', resumeStatusName: true, userName: true }, // 面试流程中
  rckInterviewArrangement: { searchType: '1', resumeType: '', resumeStatus: '4', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 面试安排
  rckPass: { searchType: '1', resumeType: '', resumeStatus: '7', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 通过
  rckReceiveOffer: { searchType: '1', resumeType: '', resumeStatus: '8', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 已发offer
  rckHasBeenInto: { searchType: '1', resumeType: '', resumeStatus: '12', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 已入培
  rckTrainPass: { searchType: '1', resumeType: '', resumeStatus: '15', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 通培通过
  rckTrainOut: { searchType: '1', resumeType: '', resumeStatus: '16', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 通培淘汰
  rckTrainQuit: { searchType: '1', resumeType: '', resumeStatus: '17', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 主动退出
  rckOutOf: { searchType: '1', resumeType: '', resumeStatus: '13', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 已出培
  rckWeekOut: { searchType: '1', resumeType: '', resumeStatus: '5', resumeStatusName: true, userName: true, resumeInterviewDate: true }, // 淘汰
}
export default {
  name: 'resume',
  components: {
    expandTable,
    ImageUpload,
    MsgDialog,
    Search
  },
  data() {
    return {
      config: config,
      loading: false,
      query: {
        resumeFirstChannel: '',
        resumeSecondChannel: [],
        keywords: '',
        resumeSubject: '',
        searchType: config[this.$route.name].searchType,
        resumeType: config[this.$route.name].resumeType,
        resumeStatus: config[this.$route.name].resumeStatus,
        resumeProperty: '',
        resumeTimeType: '',
        resumeRecordUp: '',
        resumeRecordOff: '',
        resumeGrade: '',
        time: [],
        resumeTeachingDept: [],
        workPlace: [],
        resumeInfoTeacherCert: '',
        resumeInfoContractType: ''
      },
      options: {
        timeType: [],
        propery: [],
        firstChannel: [],
        resumeTeachingDept: []
      },
      SecondDirect: [],
      secondSubject: [],
      secondChannel: [],
      isCanSearch: true,
      slotNameArr: ['operating', 'resumePhone', 'scope'],
      rows: [],
      selectedData: [],
      selectedDataId: '',
      columns: [
        { 'value': 'resumeId', 'text': '编号' },
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'resumeProperty', 'text': '岗位性质' },
        { 'value': 'resumePhone', 'text': '手机号码' },
        { 'value': 'resumeInfoQQ', 'text': 'QQ号码' },
        { 'value': 'resumeSchool', 'text': '学校名称' },
        { 'value': 'resumeAddTime', 'text': '首次添加时间' },
        { 'value': 'resumeInfoNextFlowTime', 'text': '下次沟通时间' },
        { 'value': 'resumeUpTime', 'text': '操作时间' },
        { 'value': 'operating', 'text': '操作' }
      ],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },

      dialogObject: {
        dialogLabel: '',
        showDialog: false,
        dialogTitle: '',
      },

      dialogObjectImg: {
        showDialog: false
      }
    }
  },
  computed: {
    'canCheckAllBox'() {
      return 'yes'
    },
    ...mapGetters(['oprate', 'checkPhone', 'rckoptions', 'secondaryChannel', 'secondDirectOption'])
  },
  mounted() {
    this.lookOption().then(() => { this.options = this.rckoptions })
  },
  activated() {
    this.getList()
  },
  created() {
    this.init()
    this.getList()
  },
  methods: {
    ...mapActions([
      'lookOption',
      'lookSecondDirectOption',
      'lookSecondChannel',
      'lookPhone'
    ]),
    init() {
      [{ resumeTypeName: '数据状态' },
        { resumeStatusName: '跟进状态' },
        { userName: '跟进人' },
        { resumeInterviewDate: '面试时间' },
        { resumeDiscardIdName: '废弃原因' },
        { resumeRevulsionIdName: '抽回原因' }]
        .forEach(t => {
          const k = Object.keys(t)[0]
          const v = Object.values(t)[0]
          this.config[this.$route.name][k] && this.columns.splice(6, 0, { 'value': k, 'text': v })
        })
    },
    seePhone(row) {
      this.lookPhone({ resumeId: row.id }).then(res => {
        row.resumePhone = this.checkPhone
      }).catch(console.log)
    },
    changeSecondChannel() {
      this.query.resumeSecondChannel = []
      if (this.query.resumeFirstChannel) {
        this.lookSecondChannel({ channelPid: this.query.resumeFirstChannel }).then(() => {
          this.secondChannel = this.secondaryChannel
        })
      } else {
        this.secondChannel = []
      }
    },
    changeRole() {
      this.query.resumeDirectorIdB = []
      if (this.query.resumeDirectorIdA) {
        this.lookSecondDirectOption({ userPid: this.query.resumeDirectorIdA }).then(() => {
          this.SecondDirect = this.secondDirectOption
        })
      } else {
        this.SecondDirect = []
      }
    },
    changeSubject() {
      this.query.resumeSubject = []
      if (this.query.resumeGrade) {
        this.secondSubject = this.options.grade[this.query.resumeGrade]
      } else {
        this.secondSubject = []
      }
    },
    getList() {
      this.isCanSearch = false
      this.loading = true
      const _query = Object.assign({}, this.query)
      if (_query.time === null || _query.time.length === 0) {
        _query.startTime = ''
        _query.endTime = ''
      } else {
        _query.startTime = _query.time[0]
        _query.endTime = _query.time[1]
      }
      this.$delete(_query, 'time')
      this.$http.post('resume_TelentPoolSearch', _query, { paging: this.paging }).then(res => {
        if (res.data) {
          if (res.data.data.length === 0 || !res.data.data) {
            this.rows = []
            this.paging.totalRows = '0'
            return false
          }
          this.paging.totalRows = res.data.count
          this.rows = res.data.data
          if (res.sideCount) {
            this.$eventBus.$emit('change-sidebar', res.sideCount)
          }
        }
      }).catch(console.log).finally(() => {
        this.loading = false
        this.isCanSearch = true
      })
    },
    look(row) {
      this.$router.push(`/resume/look/${row.id}`)
    }, // 查看
    handleSelectionChange(row) {
      this.selectedData = row
      const dataId = row.map(key => {
        return key.resumeId
      })
      this.selectedDataId = dataId.toString()
    }, // 保存选中数据
    allocation() {
      if (this.selectedData.length === 0) {
        this.$message.warning('请先选择您需要操作的数据！')
        return false
      }
      this.dialogObject = {
        dialogLabel: '请选择分配后的跟进人：',
        showDialog: true,
        dialogTitle: '分配数据',
      }
    }, // 分配
    revulsion() {
      if (this.selectedData.length === 0) {
        this.$message.warning('请先选择您需要操作的数据！')
        return false
      }
      this.dialogObject = {
        dialogLabel: '请选择抽回原因：',
        showDialog: true,
        dialogTitle: '抽回数据',
      }
    }, // 抽回
    changeStatus() {
      if (this.selectedData.length === 0) {
        this.$message.warning('请先选择您需要操作的数据！')
        return false
      }
      this.dialogObject = {
        dialogLabel: '状态更改为：',
        showDialog: true,
        dialogTitle: '更改状态',
      }
    } // 更改状态
  }
}
</script>
<style lang="sass" scoped>
.item-input
  width: 200px
</style>
