<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="120px" inline>
        <el-form-item label="渠道名称：">
          <span>{{channelName}}</span>
        </el-form-item><br>
        <el-form-item label="跟进人：">
          <el-select v-model="query.channelMan" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.hrData"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="query.channelStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间: ">
          <el-date-picker v-model="query.channelAddTime"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item><br>
        <el-form-item label="关键字：">
          <el-input v-model="query.keywords" placeholder="渠道名称搜索" class="item-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <expandTable
      :loading="loading" ref="channelTable" :pagination="paging" @get-list="getList"
      :rows="rows"
      :columns="columns"
      :rowKeyName="channelId"
      :slotNameArr="['operating', 'channelPidName']"
      tableExpandSlotName="secondTable"
      class="channel-first-table">

      <template slot-scope="scope" slot="operating">
          <el-button type="text" class="actionItems" @click="accessEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '1')" v-if="scope.row['channelStatus']==='0'">设置为有效</el-button>
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '0')" v-if="scope.row['channelStatus']==='1'">设置为无效</el-button>
      </template>

    </expandTable>

  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'cooperationSub',
  components: {
    expandTable
  },
  data() {
    return {
      name: '',
      loading: false,
      channelName: '',
      query: {
        level: '',
        channelMan: '',
        channelStatus: '1',
        keywords: '',
        channelType: '2',
        channelId: this.$route.params.channelId || '',
        channelAddTime: []
      },
      options: {
        hrData: [],
        channelLevel: [],
        status: []
      },
      channelId: 'channelId',
      isCanSearch: true,
      rows: [],
      expandRowKeys: [],
      columns: [
        { 'value': 'channelId', 'text': '编号' },
        { 'value': 'channelName', 'text': '渠道名称' },
        { 'value': 'userName', 'text': '渠道跟进人' },
        { 'value': 'channelAddTime', 'text': '添加时间' },
        { 'value': 'channelNumber', 'text': '推荐人数' },
        { 'value': 'channelStatusName', 'text': '状态' },
        { 'value': 'operating', 'text': '操作', width: 280 }
      ],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      }
    }
  },
  created() {
    sessionStorage.channelName = this.$route.query.channelName ? this.$route.query.channelName : sessionStorage.channelName
    this.channelName = sessionStorage.channelName
    this.getList()
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    setStatus(row, num) {
      let statusText = ''
      num === '1' ? statusText = '有效' : statusText = '无效'
      this.$confirm(`是否确认设置为${statusText}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('channel_setStatus', { channelId: row.channelId, status: num }).then(res => {
          if (res.data) {
            this.$message.success(res.message)
            this.getList()
          }
          return false
        }).catch(console.log)
      }).catch(() => {})
    },
    getOptions() {
      this.$http.post('channel_getSelect').then(res => {
        if (res.data) {
          this.options = res.data
        }
      }).catch(console.log)
    },
    getList() {
      this.loading = true
      this.$http.post('channel_search', this.query, { paging: this.paging, isFilterUrl: true }).then(res => {
        if (res.data) {
          if (res.data.length === 0 || !res.data.data) {
            this.rows = []
            this.paging.totalRows = '0'
            return false
          }
          this.rows = res.data.data
          this.paging.totalRows = res.data.count
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    },
    accessEdit(row) {
      this.$router.push({ path: `/trench/cooperation/accessEdit/${row.channelId}`, query: { id: this.$route.params.channelId || '' }})
    }, // 二级渠道编辑
  }
}
</script>
