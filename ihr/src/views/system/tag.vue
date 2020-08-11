<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="70px" inline>
        <el-form-item label="状态：">
          <el-select v-model="query.tagStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.key"
              :label="item.val"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="query.tagName" placeholder="关键词搜索" class="item-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="add">新增标签</el-button>
    </div>
    
    <expand-table
        :pagination="paging"
        @get-list="getList"
        :rows="rows"
        :loading="loading"
        :columns="columns"
        :slot-name-arr="slotNameArr">

        <template slot-scope="scope" slot="operating">
          <el-button type="text" size="small" class="actionItems" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '1')" v-if="scope.row['tagStatusName']==='有效'">设置为无效</el-button>
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '2')" v-if="scope.row['tagStatusName']==='无效'">设置为有效</el-button>
        </template>

    </expand-table>

    <div class="dialog">
      <el-dialog :title="dialog.title" :visible.sync="dialog.show" custom-class="el-dialog-sl" @close="close" :close-on-click-modal="false"
    :close-on-press-escape="false">
        <el-form label-width="40px">
          <el-form-item>
            <i style="color:red">*</i> 标签名称：
            <el-input v-model.trim="dialog.tagName" style="width: 200px"></el-input>
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
  name: 'tag',
  components: {
    expandTable
  },
  data() {
    return {
      loading: false,
      query: {
        tagName: '',
        tagStatus: '1'
      },
      options: {
        status: [
          { key: '0', val: '无效' },
          { key: '1', val: '有效' }
        ]
      },
      isCanSearch: true,
      slotNameArr: ['operating'],
      rows: [],
      columns: [
        { 'value': 'tagName', 'text': '标签名称' },
        { 'value': 'tagStatusName', 'text': '状态' },
        { 'value': 'operating', 'text': '操作' }
      ],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },
      dialog: {
        title: '',
        show: false,
        tagName: '',
        listObject: {}
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
      this.isCanSearch = false
      this.loading = true
      this.$http.post('public_getTag', this.query, { paging: this.paging }).then(res => {
        if (res.data) {
          if (res.data.data.length === 0 || !res.data.data) {
            this.rows = []
            this.paging.totalRows = '0'
            return false
          }
          this.paging.totalRows = res.data.count
          this.rows = res.data.data
        }
      }).catch(console.log).finally(() => {
        this.loading = false
        this.isCanSearch = true
      })
    }, // 列表
    close() {
      this.dialog.show = false
    }, // 关闭工作地点弹窗
    edit(row) {
      this.dialog.show = true
      this.dialog.listObject = row
      this.dialog.tagName = this.dialog.listObject.tagName
      this.dialog.title = '编辑标签'
    },
    add() {
      this.dialog.show = true
      this.dialog.title = '新增标签'
      this.dialog.tagName = ''
    },
    editWay(row, set) {
      if (set === '1') {
        var status = ''
        row.tagStatus === '1' ? status = '0' : status = '1'
      }
      this.$http.post('public_editTag', {
        tagId: set === '1' ? row.tagId : this.dialog.listObject.tagId,
        tagStatus: set === '1' ? status : '',
        tagName: set === '1' ? row.tagName : this.dialog.tagName
      }).then(res => {
        if (res.data) {
          this.$message.success(res.message)
          this.dialog.show = false
          this.getList()
        }
        return false
      }).catch(console.log).finally(() => {
        this.isCanSearch = true
      })
    }, // 编辑提交接口
    addWay() {
      this.$http.post('public_addTag', {
        tagName: this.dialog.tagName
      }).then(res => {
        if (res.data) {
          this.$message.success(res.message)
          this.getList()
        }
        return false
      }).catch(console.log).finally(() => {
        this.isCanSearch = true
        this.dialog.show = false
      })
    }, // 新增提交接口
    submit() {
      if (!this.dialog.tagName) {
        this.$message.error('请输入标签名称！')
        return false
      }
      this.isCanSearch = false
      if (this.dialog.title === '新增标签') {
        this.addWay()
      } else {
        this.editWay()
      }
    }, // 提交工作地点
    setStatus(row, num) {
      let statusText = ''
      num === '1' ? statusText = '无效' : statusText = '有效'
      this.$confirm(`是否确认设置为${statusText}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editWay(row, '1')
      }).catch(() => {})
    } // 设置有效或无效
  }
}
</script>
