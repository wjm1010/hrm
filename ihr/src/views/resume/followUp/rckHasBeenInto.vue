<template>
  <div class="dashboard-container">
    <el-row>
      <Search
        :options="options"
        :SecondDirect="SecondDirect"
        :query="query"
        :secondSubject="secondSubject"
        @changeRole="changeRole"
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
      <template slot-scope="scope" slot="resumePhone">
        <a @click.once="seePhone(scope.row)">{{scope.row['resumePhone']}}</a>
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
      v-if="dialogObject.showDialog"
      @change-refresh-getlist="this.getList"
      :selectDataId="selectedDataId"
      :dialogLabel="dialogObject.dialogLabel"
      @closeEv="dialogObject.showDialog = false"
      :dialogTitle="dialogObject.dialogTitle">
    </msg-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import expandTable from '@/components/ExpandTable'
import ImageUpload from '@/components/FileUpload/imageUploadDialog'
import MsgDialog from '../components/dialog'
import Search from '../components/search'
export default {
  name: 'rckHasBeenInto',
  components: {
    expandTable,
    ImageUpload,
    MsgDialog,
    Search
  },
  data() {
    return {
      loading: false,
      query: {
        resumeDirectorIdA: [],
        resumeDirectorIdB: [],
        resumeFirstChannel: '',
        resumeSecondChannel: '',
        keywords: '',
        resumeSubject: '',
        searchType: '1',
        resumeGrade: '',
        resumeProperty: '',
        resumeTimeType: '',
        resumeRecordUp: '',
        resumeRecordOff: '',
        time: [],
        resumeStatus: '12'
      },
      options: {
        timeType: [],
        propery: [],
        firstChannel: [],
        directList: [],
      },
      secondSubject: [],
      SecondDirect: [],
      secondChannel: [],
      isCanSearch: true,
      slotNameArr: ['operating', 'resumePhone'],
      rows: [],
      selectedData: [],
      selectedDataId: [],
      columns: [
        { 'value': 'resumeId', 'text': '编号' },
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'resumeProperty', 'text': '岗位性质' },
        { 'value': 'resumePhone', 'text': '手机号码' },
        { 'value': 'resumeInfoQQ', 'text': 'QQ号码' },
        { 'value': 'resumeSchool', 'text': '学校名称' },
        { 'value': 'resumeInterviewDate', 'text': '面试时间' },
        { 'value': 'userName', 'text': '跟进人' },
        { 'value': 'resumeStatusName', 'text': '跟进状态' },
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
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  mounted() {
    this.lookOption().then(() => { this.options = this.rckoptions })
  },
  computed: {
    'canCheckAllBox'() {
      return 'yes'
    },
    ...mapGetters(['oprate', 'checkPhone', 'rckoptions', 'secondaryChannel', 'secondDirectOption'])
  },
  methods: {
    ...mapActions([
      'lookOption',
      'lookSecondChannel',
      'lookSecondDirectOption',
      'lookPhone'
    ]),
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
    changeSubject() {
      this.query.resumeSubject = []
      if (this.query.resumeGrade) {
        this.secondSubject = this.options.grade[this.query.resumeGrade]
      } else {
        this.secondSubject = []
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
    into() {
      this.dialogObjectImg.showDialog = true
    }, // 导入
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
