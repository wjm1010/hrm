<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="70px" inline>
        <el-form-item label="状态：">
          <el-select v-model="query.teachingDeptStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.key"
              :label="item.val"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="query.teachingDeptName" placeholder="教学部搜索" class="item-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="add">新增教学部</el-button>
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
          <span v-if="scope.row['teachingDeptStatusName']==='有效'">
            <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '1')">设置为无效</el-button>
          </span>
          <span v-if="scope.row['teachingDeptStatusName']==='无效'">
            <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '2')">设置为有效</el-button>
          </span>
        </template>

    </expand-table>

    <div class="dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogShow" custom-class="el-dialog-md" @close="close" :close-on-click-modal="false"
    :close-on-press-escape="false">
        <el-form :model="dialogQuery" :rules="dialogRules" ref="dialogQuery" label-width="120px">
          <el-form-item label="教学部：" prop="teachingDeptName">
            <el-input v-model="dialogQuery.teachingDeptName" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item prop="teachingDeptPlace" label="工作地点：">
            <el-radio-group v-model="dialogQuery.teachingDeptPlace">
              <el-radio v-for="item in dialogOptions.workPlace" :key="item.workPlaceId" :label="item.workPlaceId">
                {{item.workPlaceName}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="teachingDeptGroup" label="教学组：">
            <el-checkbox-group v-model="dialogQuery.teachingDeptGroup">
              <el-checkbox v-for="item in dialogOptions.teachingGroup" :key="item.teachingGroupId" :label="item.teachingGroupId">
                {{item.teachingGroupName}}
              </el-checkbox>
            </el-checkbox-group>
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
  name: 'teachSection',
  components: {
    expandTable
  },
  data() {
    return {
      loading: false,
      query: {
        teachingDeptName: '',
        teachingDeptStatus: '1'
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
        { 'value': 'teachingDeptName', 'text': '教学部' },
        { 'value': 'workPlaceName', 'text': '工作地点' },
        { 'value': 'teachingDeptGroupName', 'text': '教学组' },
        { 'value': 'teachingDeptStatusName', 'text': '状态' },
        { 'value': 'operating', 'text': '操作' }
      ],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },

      dialogTitle: '',
      dialogShow: false,
      dialogId: '',
      dialogQuery: {
        teachingDeptName: '',
        teachingDeptPlace: '',
        teachingDeptGroup: []
      },
      dialogOptions: {
        workPlace: [],
        teachingGroup: [],
      },
      dialogRules: {
        teachingDeptName: [
          { required: true, trigger: 'change', message: '请输入教学部！' }
        ],
        teachingDeptPlace: [
          { required: true, message: '请选择工作地点！', trigger: 'change' }
        ],
        teachingDeptGroup: [
          { type: 'array', required: true, message: '请至少选择一个教学组！', trigger: 'change' }
        ],
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
      this.$http.post('subject_getTeachingDept', this.query, { paging: this.paging }).then(res => {
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
      this.dialogShow = false
    }, // 关闭工作地点弹窗
    edit(row) {
      this.dialogShow = true
      this.dialogId = row.teachingDeptId
      this.dialogQuery = {
        teachingDeptName: row.teachingDeptName,
        teachingDeptPlace: row.teachingDeptPlace,
        teachingDeptGroup: row.teachingDeptGroup.split(',')
      }
      this.dialogTitle = '编辑教学部'
      this.getDialogOption()
    },
    add() {
      this.dialogShow = true
      this.getDialogOption()
      this.dialogTitle = '新增教学部'
      this.dialogQuery = {
        teachingDeptName: '',
        teachingDeptPlace: '',
        teachingDeptGroup: []
      }
      if (this.$refs['dialogQuery']) {
        this.$refs['dialogQuery'].resetFields()
      }
    },
    getDialogOption() {
      this.$http.post('subject_getTeachinOpion').then(res => {
        this.dialogOptions = res.data
      }).catch(console.log)
    },
    editWay(row, set) {
      if (set === '1') {
        var status = ''
        row.teachingDeptStatus === '1' ? status = '0' : status = '1'
      }
      this.$http.post('subject_editTeachingDept', {
        teachingDeptId: set === '1' ? row.teachingDeptId : this.dialogId,
        teachingDeptPlace: set === '1' ? row.teachingDeptPlace : this.dialogQuery.teachingDeptPlace,
        teachingDeptGroup: set === '1' ? row.teachingDeptGroup : this.dialogQuery.teachingDeptGroup.toString(),
        teachingDeptStatus: set === '1' ? status : '',
        teachingDeptName: set === '1' ? row.teachingDeptName : this.dialogQuery.teachingDeptName
      }).then(res => {
        if (res.data) {
          this.$message.success(res.message)
          this.dialogShow = false
          this.getList()
        }
        return false
      }).catch(console.log).finally(() => {
        this.isCanSearch = true
      })
    }, // 编辑提交接口
    addWay() {
      const _dialogQuery = Object.assign({}, this.dialogQuery)
      _dialogQuery.teachingDeptGroup = this.dialogQuery.teachingDeptGroup.toString()
      this.$http.post('subject_addTeachingDept', _dialogQuery).then(res => {
        if (res.data) {
          this.$message.success(res.message)
          this.dialogShow = false
          this.getList()
        }
        return false
      }).catch(console.log).finally(() => {
        this.isCanSearch = true
      })
    }, // 新增提交接口
    submit() {
      this.$refs['dialogQuery'].validate((valid) => {
        if (valid) {
          this.isCanSearch = false
          if (this.dialogTitle === '新增教学部') {
            this.addWay()
          } else {
            this.editWay()
          }
        }
      })
    }, // 提交表单

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
<style lang="sass" scoped>
.el-checkbox+.el-checkbox,
.el-checkbox:first-child,
.el-radio+.el-radio,.el-radio:first-child
  margin-left: 20px
.el-radio
 line-height: 30px
</style>

