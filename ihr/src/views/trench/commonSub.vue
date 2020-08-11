<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="120px" inline>
        <el-form-item label="渠道名称：">
          <span>{{$route.query.channelName}}</span>
        </el-form-item><br>
        <el-form-item label="状态：">
          <el-select v-model="query.channelStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.key"
              :label="item.val"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="query.keywords" placeholder="渠道名称搜索" class="item-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <expandTable :loading="loading"
                 ref="channelTable"
                 :pagination="paging"
                 @get-list="getList"
                 :rows="rows"
                 :columns="columns"
                 :rowKeyName="channelId"
                 :slotNameArr="['operating', 'level']"
                 tableExpandSlotName="secondTable"
                 class="channel-first-table"
                 @expandChange="keys => {this.expandRowKeys = keys}">
      <template slot-scope="scope" slot="operating">
        <el-button type="text" class="actionItems" @click="accessEdit(scope.row)">编辑</el-button>
        <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '1')" v-if="scope.row['channelStatus']==='0'">设置为有效</el-button>
        <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '0')" v-if="scope.row['channelStatus']==='1'">设置为无效</el-button>
      </template>

    </expandTable>

    <div class="dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogShow"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 custom-class="el-dialog-sl" @close="close">
        <el-form :model="dialog" ref="dialog" label-width="40px">
          <el-form-item prop="channelName">
            <i style="color:red">*</i> 渠道名称：
            <el-input v-model.trim="dialog.channelName" style="width: 200px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="submit" :disabled="!isCanSearch">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'
  export default {
    name: 'commonSub',
    components: {
      expandTable
    },
    data() {
      return {
        loading: false,
        query: {
          keywords: '',
          channelStatus: '1',
          channelType: '1',
          channelId: this.$route.params.channelId || '',
        },
        options: {
          status: [
            { key: '0', val: '无效' },
            { key: '1', val: '有效' }
          ]
        },
        isCanSearch: true,
        rows: [],
        channelId: 'channelId',
        columns: [
          { 'value': 'channelName', 'text': '二级渠道' },
          { 'value': 'channelStatusName', 'text': '状态' },
          { 'value': 'operating', 'text': '操作', width: 300 }
        ],
        paging: {
          page: '1', // 当前第几页
          pageSize: '20', // 一页多少条
          totalRows: '0' // 一共多少条
        },
        dialogTitle: '',
        dialogShow: false,
        dialog: {
          channelName: '',
          channelId: '',
          channelPid: ''
        }
      }
    },
    created() {
      this.getList()
    },
    mounted() {
    },
    methods: {
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
            this.rows.map(key => {
              key.level = '二级渠道'
            })
            this.paging.totalRows = res.data.count
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      },
      close() {
        this.dialogShow = false
      }, // 关闭工作地点弹窗

      accessEdit(row) {
        this.dialogTitle = '编辑二级渠道'
        this.dialogShow = true
        this.$http.post('channel_getChannelOne', {
          channelId: row.channelId
        }).then(res => {
          this.dialog = res.data
        }).catch(console.log)
      },
      /** *渠道提交 */
      submit() {
        if (!this.dialog.channelName) {
          this.$message.warning('请输入内容！')
          return false
        }
        if (this.dialogTitle === '编辑一级渠道' || this.dialogTitle === '新增一级渠道') {
          this.$http.post('channel_firstgeneralAddUpdate', { channelId: this.dialog.channelId ? this.dialog.channelId : '', channelName: this.dialog.channelName }).then(res => {
            if (res.data) {
              this.dialogShow = false
              this.$message.success(res.message)
              this.getList()
            }
            return false
          }).catch(console.log)
        } else {
          const _query = Object.assign({}, this.dialog)
          this.$delete(_query, 'channelMan')
          this.$delete(_query, 'channelContact')
          this.$delete(_query, 'channelSchool')
          this.$http.post('channel_secondGeneralAddUpdate', _query).then(res => {
            if (res.data) {
              this.dialogShow = false
              this.$message.success(res.message)
              this.getList()
            }
            return false
          }).catch(console.log)
        }
      },
      /** 设置有效无效 */
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
      }
    }
  }
</script>
