<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container callRecording">
    <el-row>
      <el-form inline label-width="107px" ref="form" :model="query" class="search">
        <el-form-item label="通话日期：">
          <el-date-picker
            v-model="query.submitTime"
            type="daterange"
            range-separator="至"
            start-placeholder="通话日期"
            value-format="yyyy-MM-dd"
            class="position-left">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="deptTree" label="呼叫类型：">
          <el-select v-model="query.callType" clearable collapse-tags placeholder="呼叫学生/家长">
            <el-option
              v-for="item in optionsCallType.callType"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model="query.keywords" placeholder="电话/姓名/学生编号" class="item-input"></el-input>
        </el-form-item><br>
        <el-form-item prop="deptTree" v-if="Number(options.status)" label="外呼坐席：">
          <el-select v-model="query.deptTree" clearable collapse-tags placeholder="组">
            <el-option
              v-for="item in options.deptTree"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="query.allUser" filterable clearable collapse-tags placeholder="姓名[坐席]">
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
      <el-button type="primary" icon="el-icon-search" :disabled="!isCanSearch" @click="callDateValide">查询</el-button>
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
        <template slot-scope="scope" slot="record">
          <div v-if="scope.row.recordFile">
            <img src="../../assets/homePageImg/play.png" alt="" @click="openRecord(scope.row)" class="play">
            <img src="../../assets/homePageImg/download.png" alt="" class="download" @click="openRecord(scope.row, 1)" >
          </div>
          <span v-else>暂无</span>
        </template>
      </expand-table>
    </el-row>
    <el-dialog
      title="沟通记录录音详情"
      @close="closeEvent"
      :visible.sync="recordVisible"
      width="70%"
      center>

      <div v-loading="hasRecord">
        <audio ref="audios" controls autoplay style="width:100%">
          <!-- <source :src="playURL" type="audio/ogg">
          <source :src="playURL" type="audio/mp3">
          <source :src="playURL" type="audio/mpeg">
          <source :src="playURL" type="audio/wav"> -->
        </audio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" class="blue" @click="closeRecord">继续播放并查看学生信息</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'
  // import EventBus from '@/eventBus.js'
  import { mapGetters } from 'vuex'
  import { formatDate } from '@/lib/date.js'
  export default {
    name: 'callRecording',
    components: { expandTable },
    data() {
      return {
        columns: [
          { 'value': 'callType', 'text': '呼叫类型' },
          { 'value': 'callPhone', 'text': '被叫号码/呼入号码', width: 160 },
          { 'value': 'studentName', 'text': '被叫人/呼入人' },
          { 'value': 'sellerName', 'text': '坐席姓名', width: 140 },
          { 'value': 'callTime', 'text': '呼出时间/呼入时间', width: 150 },
          { 'value': 'bridgeTime', 'text': '接听时间', width: 150 },
          { 'value': 'endTime', 'text': '结束时间', width: 150 },
          { 'value': 'callCalcTime', 'text': '通话时长' },
          { 'value': 'record', 'text': '录音' }
        ],
        slotNameArr: ['record'],
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
        optionsCallType: {
          callType: []
        },
        query: {
          callType: '1',
          keywords: '',
          deptTree: '',
          allUser: '',
          submitTime: [formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'YYYY-MM-DD'), formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'YYYY-MM-DD')],
        },
        recordVisible: false,
        loading: false,
        isCanSearch: true,
        hasRecord: false,
      }
    },
    computed: {
      ...mapGetters(['roleCode'])
    },
    created() {
      this.getGroup()
      this.getCallTypes()
    },
    methods: {
      callDateValide() {
        const _query = Object.assign({}, this.query, this.paging)
        if (_query.submitTime === null || _query.submitTime.length === 0) {
          this.$message.warning('请选择通话日期')
        } else if (this.roleCode !== 'XS-ZY' && this.query.allUser === '') {
          this.$message.warning('请选择外呼坐席人员')
        } else {
          _query.callStartTime = _query.submitTime[0]
          _query.callEndTime = _query.submitTime[1]
          if (new Date(_query.callEndTime).getMonth() > new Date(_query.callStartTime).getMonth()) {
            this.$message.warning('通话日期不能跨月')
          } else {
            this.getList()
          }
        }
      },
      /**
       * 获取列表
       */
      getList() {
        this.loading = true
        this.isCanSearch = false
        this.query.group = this.query.deptTree
        this.query.member = this.query.allUser
        const _query = Object.assign({}, this.query, this.paging)
        if (_query.submitTime === null || _query.submitTime.length === 0) {
          _query.callStartTime = ''
          _query.callEndTime = ''
        } else {
          _query.callStartTime = _query.submitTime[0]
          _query.callEndTime = _query.submitTime[1]
        }
        this.$delete(_query, 'submitTime')
        this.$http.post('call_callRecordMediaList', _query).then(res => {
          if (res.data) {
            if (!res.data.list.length) {
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
       * 获取呼叫类型
       */
      getCallTypes() {
        this.$http.get('call_getCallTypes').then(res => {
          if (res.data) {
            this.optionsCallType.callType = res.data
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
        this.query.callType = ''
        this.query.keywords = ''
      },
      /**
       * 播放
       */
      openRecord(row, arg) {
        !arg && (this.recordVisible = true)
        this.$http.post('call_getRecordFile', {
          businessUid: row.businessUid,
          recordFile: row.recordFile
        }, { remote: 'iCP' }).then(data => {
          if (data.data.url) {
            if (arg) {
              window.open(data.data.url)
              return
            }
            this.hasRecord = false
            if (this.$refs.audios.src === data.data.url) {
              return
            } else {
              this.$refs.audios.src = data.data.url
            }
            this.$refs.audios.play()
          }
        }).catch(err => {
          this.$message.error('获取录音失败！')
          throw new Error(err)
        })
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
      closeEvent() {
        this.recordVisible = false
        if (this.isNotStopViedeo) {
          this.isNotStopViedeo = false
          return
        }
        this.$refs.audios.pause()
      },
      closeRecord() {
        this.recordVisible = false
        this.isNotStopViedeo = true
      }
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
  @import '../../styles/callManagement/callRecording.sass'
</style>
