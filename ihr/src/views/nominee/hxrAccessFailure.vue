<template>
  <div class="dashboard-container">
    <el-row>
      <Search
        :options="options"
        :secondChannel="secondChannel"
        :GRADE="GRADE"
        :SecondDirect="SecondDirect"
        :query="query"
        @changeRole="changeRole"
        @changeGrade="changeGrade"
        :isCanSearch="isCanSearch"
        @getList="getList"
        @changeSecondChannel="changeSecondChannel"
        :specialistSwitch="specialistSwitch">
      </Search>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="newCandidate">新增候选人</el-button>
      <el-button type="primary" @click="allotData" v-if="specialistSwitch">分配数据</el-button>
    </div>

    <expand-table
      can-check-all-box="yes"
      @selection-change-event="handleSelectionChange"
      @change-table-sort="changeTableSort"
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
        <el-button type="text" size="small" class="actionItems" @click="edit(scope.row)">编辑</el-button>
        <el-button type="text" size="small" class="actionItems" v-if="scope.row.resumeInfoAppendix">
          <a :href="scope.row.resumeInfoAppendix" target="_blank">下载简历</a>
        </el-button>
      </template>

    </expand-table>

    <msg-dialog
      v-if="dialogShow"
      @change-refresh-getlist="this.getList"
      :selectDataId="selectedDataId"
      @closeEv="dialogShow = false">
    </msg-dialog>
  </div>
</template>

<script>
import Search from './components/search'
import expandTable from '@/components/ExpandTable'
import MsgDialog from './components/dialog'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'hxrAccessFailure',
  components: {
    expandTable,
    MsgDialog,
    Search
  },
  data() {
    return {
      specialistSwitch: true,
      loading: false,
      query: {
        directList: '',
        resumeDirectorId: '',
        resumeFirstChannel: '',
        resumeSecondChannel: '',
        keywords: '',
        resumeGrade: '',
        resumeSubject: '',
        searchType: '1',
        resumeProperty: '',
        resumeTimeType: '',
        resumeSchoolProperty: [],
        time: [],
        resumeInterviewDate: '',
        isVideo: '',
        isResume: '',
        isGrade: '',
        resumeTags: '',
        isSenior: '',
        resumeStatus: '2',
      },
      options: {
        directList: [],
        propery: [],
        grade: [],
        firstChannel: [],
        primaryRequire: [],
        hightRequire: [],
        videoUpload: [],
        appendixUpload: [],
        tags: [],
        schoolType: [],
        searchTime: [],
        resumeTeachingDept: []
      },
      GRADE: [],
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
        { 'value': 'resumePhone', 'text': '手机号码' },
        { 'value': 'resumeInfoQQ', 'text': 'QQ号码' },
        { 'value': 'resumeSchool', 'text': '学校名称' },
        { 'value': 'resumeProperty', 'text': '岗位性质' },
        { 'value': 'resumeFirstChannelName', 'text': '一级渠道' },
        { 'value': 'resumeSecondChannelName', 'text': '二级渠道' },
        { 'value': 'userName', 'text': '跟进人' },
        { 'value': 'resumeInfoNextFlowTime', 'text': '下次沟通时间' },
        { 'value': 'resumeUpTime', 'text': '操作时间', sortable: 'custom' },
        { 'value': 'operating', 'text': '操作' }
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
    if (this.userRole === '2' && this.userLevel === '1') {
      this.specialistSwitch = false
    } else {
      this.specialistSwitch = true
    }
  },
  activated() {
    this.getList()
  },
  mounted() {
    this.lookResume2Option().then(() => { this.options = this.resume2Option })
  },
  computed: {
    ...mapGetters(['userId', 'userLevel', 'userRole', 'checkPhone', 'resume2Option', 'secondDirectOption', 'secondaryChannel'])
  },
  methods: {
    ...mapActions([
      'lookResume2Option',
      'lookSecondDirectOption',
      'lookSecondChannel',
      'lookPhone'
    ]),
    seePhone(row) {
      this.lookPhone({ resumeId: row.id }).then(res => {
        row.resumePhone = this.checkPhone
      }).catch(console.log)
    },
    changeSecondChannel() {
      this.query.resumeSecondChannel = ''
      if (this.query.resumeFirstChannel) {
        this.lookSecondChannel({ channelPid: this.query.resumeFirstChannel }).then(() => {
          this.secondChannel = this.secondaryChannel
        })
      } else {
        this.secondChannel = []
      }
    },
    changeRole() {
      this.query.resumeDirectorId = ''
      if (this.query.directList) {
        this.lookSecondDirectOption({ userPid: this.query.directList }).then(() => {
          this.SecondDirect = this.secondDirectOption
        })
      } else {
        this.SecondDirect = []
      }
    },
    changeGrade() {
      this.query.resumeSubject = ''
      if (this.query.resumeGrade) {
        this.GRADE = this.options.grade[this.query.resumeGrade]
      } else {
        this.GRADE = []
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
      _query.resumeSchoolProperty = _query.resumeSchoolProperty.toString()
      this.$delete(_query, 'time')
      this.$http.post('resume_candidateSearch', _query, { paging: this.paging }).then(res => {
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
    changeTableSort(prop, order) {
      this.query.sequence = prop
      this.query.sort = order
      this.getList()
    },
    edit(row) {
      this.$router.push(`/nominee/edit/${row.id}`)
    }, // 编辑
    newCandidate() {
      this.$router.push({ path: '/nominee/add', query: { backurl: this.$route.fullPath }})
    }, // 新增候选人
    handleSelectionChange(row) {
      this.selectedData = row
      const dataId = row.map(key => {
        return key.resumeId
      })
      this.selectedDataId = dataId.toString()
    }, // 保存选中数据
    allotData() {
      if (this.selectedData.length === 0) {
        this.$message.warning('请先选择您需要操作的数据！')
        return false
      }
      this.dialogShow = true
    } // 分配数据
  }
}
</script>
<style lang="sass" scoped>
.item-input
  width: 200px
</style>
