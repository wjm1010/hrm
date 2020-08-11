<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <div class="header">
      <img class="icon" src="../icons/icon-03.png">
      <span class="title">沟通记录</span>
    </div>
    <div class="body">
      <el-form :model="query" ref="query" inline>
      <el-form-item>
        <el-date-picker
          v-model="queryTimeRange"
          :editable="false"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.role" clearable filterable placeholder="请选择沟通角色">
          <el-option
            v-for="(item,index) in options.roles"
            :key="index"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="query.mine" true-label="1">我添加的</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="query.trackUserId" true-label="1">当前跟进人添加</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" :disabled="!canSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <ul class="statistics">
      <li><span>总沟通数 </span><span class="color-green">{{communicationNumber.sumRecord}}</span></li>
      <li><span>有效沟通数 </span><span class="color-green">{{communicationNumber.validRecord}}</span></li>
      <li><span>无效沟通数 </span><span class="color-green">{{communicationNumber.invalidRecord}}</span></li>
    </ul>
    <expand-table
      :pagination="paging"
      @get-list="getList"

      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">

      <template slot-scope="scope" slot="content">
        <el-popover trigger="hover" placement="top" v-if="scope.row['content'].length>30" width="500">
          <span>{{scope.row['content']}}</span>
          <div slot="reference" class="name-wrapper">
            <span>{{scope.row['content'].slice(0,30)}}...</span>
          </div>
        </el-popover>
        <span v-else>{{scope.row['content']}}</span>
      </template>
      <template slot-scope="scope" slot="record">
        <el-button v-if="scope.row['isHaveFile'] === '1'" type="text" size="small" @click="openRecord(scope.row)">
          播放/下载
        </el-button>
        <span v-else>
          暂无
        </span>
      </template>
    </expand-table>
    </div>
    
    <el-dialog
      title="沟通记录录音详情"
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
        <el-button type="warning" @click="closeRecord">关闭(将会停止播放录音)</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ExpandTable
    },
    name: 'detail-communication-details',
    props: {
      refresh: Boolean,
      rosterId: {
        required: true
      },
      studentId: {
        required: true
      }
    },
    watch: {
      'refresh'(bool) {
        if (bool) {
          this.$emit('update:refresh', false)
          this.getList()
        }
      }
    },
    data() {
      return {
        slotNameArr: ['content', 'record'],
        canSearch: true,
        queryTimeRange: [],
        options: {
          roles: [
            {
              value: '销售', code: '1'
            },
            {
              value: '客服', code: '2'
            },
            {
              value: '班主任', code: '3'
            }
          ]
        },
        query: {
          studentIntentionId: '',
          startTime: '',
          endTime: '',
          role: '',
          mine: '',
          trackUserId: ''
        },
        rows: [],
        loading: false,
        columns: [
          {
            value: 'endTime', text: '沟通时间', fixed: 'left'
          },
          {
            value: 'name', text: '沟通人'
          },
          {
            value: 'roleName', text: '沟通人角色'
          },
          {
            value: 'jobNumber', text: '沟通人编号'
          },
          {
            value: 'content', text: '沟通内容'
          },
          {
            value: 'toolName', text: '沟通工具'
          },
          {
            value: 'ComBridgeTime', text: '通话开始时间'
          },
          {
            value: 'ComEndTime', text: '通话结束时间'
          },
          {
            value: 'diffTime', text: '通话时长'
          },
          {
            value: 'nextCommunicationTime', text: '下次沟通提醒'
          },
          {
            value: 'record', text: '操作', fixed: 'right'
          }
        ],
        recordVisible: false,
        playURL: null,
        hasRecord: true,
        communicationNumber: {
          sumRecord: '',
          validRecord: '',
          invalidRecord: ''
        },
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '20'
        }
      }
    },
    computed: {
      ...mapGetters(['userId'])
    },
    created() {
      this.getList()
    },
    methods: {
      openRecord(row) {
        this.recordVisible = true
        this.$http.post('call_getRecordFile', {
          businessUid: this.userId,
          recordFile: row.recordFile
        }, { remote: 'iCP' }).then(data => {
          if (data.data.url) {
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
      closeRecord(row) {
        this.recordVisible = false
        this.$refs.audios.pause()
      },
      getTalkCalendarStatistics(calendarStart, calendarEnd) {
        return this.$http.post('lesson_calendarStatistics', {
          studentId: this.studentId,
          studentIntentionId: this.rosterId,
          calendarStart,
          calendarEnd
        }, {
          isFilterUrl: true
        })
      },
      getTeacherCommunicationRecordList(params) {
        return this.$http.post('lesson_communicationRecordList', Object.assign(params, {
          studentIntentionId: this.rosterId
        }), { paging: this.paging })
      },
      getTotal(calendarStart, calendarEnd) {
        this.getTalkCalendarStatistics(calendarStart, calendarEnd).then(res => {
          if (res.data) {
            this.communicationNumber = res.data
          }
        }).catch(console.log)
      },
      getList() {
        this.canSearch = false
        this.loading = true
        const _query = Object.assign({}, this.query)
        if (this.queryTimeRange === null || this.queryTimeRange.length === 0) {
          _query.startTime = ''
          _query.endTime = ''
        } else {
          _query.startTime = this.queryTimeRange[0]
          _query.endTime = this.queryTimeRange[1]
        }

        this.getTotal(_query.startTime, _query.endTime)

        this.getTeacherCommunicationRecordList(_query).then(res => {
          if (res.data) {
            if (res.data.data.length === 0) {
              this.rows = []
              this.paging.totalRows = '0'
              return false
            }
            this.rows = res.data.data
            this.paging.totalRows = res.data.count
          }
        }).catch(console.log).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/student/detail/communicationDetails'
</style>
