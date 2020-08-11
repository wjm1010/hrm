<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="90px" inline>
        <el-form-item label="院校类型：">
          <el-select v-model="query.schoolType" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.schoolType"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="query.schoolTags">
            <el-checkbox v-for="item in options.schoolTags" :key="item.id" :label="item.id">
              {{item.value}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item><br>
        <el-form-item label="状态：">
          <el-select v-model="query.schoolStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model.trim="query.schoolName" placeholder="学校名称" class="item-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="add">新增院校</el-button>
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
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '1')" v-if="scope.row['schoolStatus'] === '1'">设置为无效</el-button>
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '2')" v-if="scope.row['schoolStatus'] === '0'">设置为有效</el-button>
        </template>

    </expand-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" custom-class="el-dialog-md" @close="close" :close-on-click-modal="false"
    :close-on-press-escape="false">
      <el-form :model="dialogQuery" :rules="dialogRules" ref="dialogQuery" label-width="120px" v-loading="loading">
        <el-form-item label="学校名称：" prop="schoolName">
          <el-input v-model.trim="dialogQuery.schoolName" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="院校类型：" prop="schoolType">
          <el-select v-model="dialogQuery.schoolType" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in dialogOptions.schoolType"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="schoolStatus">
          <el-select v-model="dialogQuery.schoolStatus" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dialogOptions.status"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="schoolTags">
          <el-checkbox-group v-model="dialogQuery.schoolTags">
            <el-checkbox v-for="item in dialogOptions.schoolTags" :key="item.id" :label="item.id">
              {{item.value}}
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
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'school',
  components: {
    expandTable
  },
  data() {
    return {
      loading: false,
      query: {
        schoolName: '',
        schoolStatus: '1',
        schoolTags: [],
        schoolType: ''
      },
      options: {
        status: [],
        schoolType: [],
        schoolTags: [],
      },
      isCanSearch: true,
      slotNameArr: ['operating'],
      rows: [],
      columns: [
        { 'value': 'schoolId', 'text': '编号' },
        { 'value': 'schoolName', 'text': '学校名称' },
        { 'value': 'schoolTypeName', 'text': '院校类型' },
        { 'value': 'schoolTagName', 'text': '院校标签' },
        { 'value': 'schoolStatusName', 'text': '状态' },
        { 'value': 'operating', 'text': '操作' }
      ],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },

      // 弹窗
      dialogShow: false,
      dialogQuery: {
        schoolName: '',
        schoolType: '',
        schoolStatus: '',
        schoolTags: []
      },
      dialogOptions: {
        status: [],
        schoolType: [],
        schoolTags: [],
      },
      dialogTitle: '',
      dialogId: '',
      dialogRules: {
        schoolName: [
          { required: true, message: '请输入学校名称！', trigger: 'change' }
        ],
        schoolStatus: [
          { required: true, message: '请选择状态！', trigger: 'change' }
        ],
        schoolType: [
          { required: true, message: '请选择院校类型！', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getOption()
  },
  methods: {
    getOption() {
      this.$http.post('auth_getSchoolOption').then(res => {
        if (res.data) {
          this.options = res.data
          this.dialogOptions = res.data
        }
      }).catch(console.log)
    },
    getList() {
      this.isCanSearch = false
      this.loading = true
      const _query = Object.assign({}, this.query)
      _query.schoolTags = this.query.schoolTags.toString()
      this.$http.post('public_getSchoolList', _query, { paging: this.paging }).then(res => {
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

    // 操作按钮
    add() {
      this.dialogShow = true
      this.dialogTitle = '新增院校'
      this.dialogQuery = {
        schoolName: '',
        schoolType: '',
        schoolStatus: '',
        schoolTags: []
      }
      if (this.$refs['dialogQuery']) {
        this.$refs['dialogQuery'].resetFields()
      }
    }, // 新增
    edit(row) {
      this.dialogShow = true
      this.dialogTitle = '编辑院校'
      this.dialogId = row.schoolId
      this.dialogQuery = {
        schoolName: row.schoolName,
        schoolType: row.schoolType,
        schoolStatus: row.schoolStatus,
        schoolTags: row.schoolTags.split(',')
      }
    }, // 编辑
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
    }, // 有效or无效

    // 弹窗操作
    close() {
      this.dialogShow = false
    },
    editWay(row, set) {
      if (set === '1') {
        var status = ''
        row.schoolStatus === '1' ? status = '0' : status = '1'
      }
      this.$http.post('public_editSchool', {
        schoolId: set === '1' ? row.schoolId : this.dialogId,
        schoolName: set === '1' ? row.schoolName : this.dialogQuery.schoolName,
        schoolTags: set === '1' ? row.schoolTags : this.dialogQuery.schoolTags.toString(),
        schoolStatus: set === '1' ? status : this.dialogQuery.schoolStatus,
        schoolType: set === '1' ? row.schoolType : this.dialogQuery.schoolType
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
      _dialogQuery.schoolTags = this.dialogQuery.schoolTags.toString()
      this.$http.post('public_addSchool', _dialogQuery).then(res => {
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
          if (this.dialogTitle === '新增院校') {
            this.addWay()
          } else {
            this.editWay()
          }
        }
      })
    } // 提交

  }
}
</script>
