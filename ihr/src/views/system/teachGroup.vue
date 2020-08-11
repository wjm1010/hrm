<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="70px" inline>
        <el-form-item label="状态：">
          <el-select v-model="query.teachingGroupStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.key"
              :label="item.val"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model.trim="query.teachingGroupName" placeholder="教学组搜索" class="item-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="add">新增教学组</el-button>
    </div>

    <expand-table
        :pagination="paging"
        @get-list="getList"
        :rows="rows"
        :loading="loading"
        :columns="columns"
        :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="teachingGroupGradeSubjectName">
        <p style="text-align: center" v-html="scope.row.teachingGroupGradeSubjectName.replace(new RegExp('\n','g'),'<br>')"></p>
      </template>
        <template slot-scope="scope" slot="operating">
          <el-button type="text" size="small" class="actionItems" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '1')" v-if="scope.row['teachingGroupStatus']==='1'">设置为无效</el-button>
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '2')" v-if="scope.row['teachingGroupStatus']==='0'">设置为有效</el-button>
        </template>

    </expand-table>

    <div class="dialog">
      <el-dialog :title="dialog.title" :visible.sync="dialog.show" custom-class="el-dialog-sl" @close="close" :close-on-click-modal="false"
    :close-on-press-escape="false">
        <el-form :model="dialog" ref="dialog" label-width="40px">
          <el-form-item prop="teachName">
            <i style="color:red">*</i> 教学组：
            <el-input v-model.trim="dialog.teachName" style="width: 194px"></el-input>
          </el-form-item>
          <el-form-item v-for="(i, index) in teachingGroupGradeSubjectLen" :key = index>
            <i style="color:red;margin-left: -8px"></i> 年级学科：
            <el-cascader
              clearable
              :options="options.teachingGroupGradeSubject"
              v-model="dialog.teachingGroupGradeSubject[index]">
            </el-cascader>
            <el-button icon="el-icon-plus" circle @click="teachingGroupGradeSubjectLen++" v-if="!index"></el-button>
            <el-button icon="el-icon-minus" circle @click="teachingGroupGradeSubjectLen-- && dialog.teachingGroupGradeSubject.splice(index, 1)" v-if="index && teachingGroupGradeSubjectLen>1"></el-button>
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
  name: 'teachGroup',
  components: {
    expandTable
  },
  data() {
    return {
      teachingGroupGradeSubjectLen: 1,
      loading: false,
      query: {
        teachingGroupName: '',
        teachingGroupStatus: '1'
      },
      options: {
        teachingGroupGradeSubject: [],
        status: [
          { key: '0', val: '无效' },
          { key: '1', val: '有效' }
        ]
      },
      isCanSearch: true,
      slotNameArr: ['operating', 'teachingGroupGradeSubjectName'],
      rows: [],
      columns: [
        { 'value': 'teachingGroupName', 'text': '教学组' },
        { 'value': 'teachingGroupStatusName', 'text': '状态' },
        { 'value': 'teachingGroupGradeSubjectName', 'text': '年级学科' },
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
        teachName: '',
        teachingGroup: {},
        teachingGroupGradeSubject: []
      }
    }
  },
  created() {
    this.getList()
    this.getGradeSubject()
  },
  methods: {
    getGradeSubject() {
      this.$http.post('subject_getGradeSubject').then(res => {
        if (res.data) {
          this.options.teachingGroupGradeSubject = res.data.teachingGroupGradeSubject
        }
      })
    },
    getList() {
      this.isCanSearch = false
      this.loading = true
      this.$http.post('subject_getTeachingGroup', this.query, { paging: this.paging }).then(res => {
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
      this.teachingGroupGradeSubjectLen = 1
      this.dialog.teachingGroupGradeSubject = []
      this.dialog.show = false
    }, // 关闭教学组弹窗
    edit(row) {
      this.teachingGroupGradeSubjectLen = row.teachingGroupGradeSubject.length > 0 ? row.teachingGroupGradeSubject.length : 1
      this.dialog.teachingGroupGradeSubject = JSON.parse(JSON.stringify(row.teachingGroupGradeSubject))
      this.dialog.show = true
      this.dialog.teachingGroup = row
      this.dialog.teachName = this.dialog.teachingGroup.teachingGroupName
      this.dialog.title = '编辑教学组'
    },
    add() {
      this.dialog.show = true
      this.dialog.title = '新增教学组'
      this.dialog.teachName = ''
    },
    editWay(row, set) {
      if (set === '1') {
        var status = ''
        row.teachingGroupStatus === '1' ? status = '0' : status = '1'
      }
      this.$http.post('subject_editTeachingGroup', {
        teachingGroupId: set === '1' ? row.teachingGroupId : this.dialog.teachingGroup.teachingGroupId,
        teachingGroupName: set === '1' ? row.teachingGroupName : this.dialog.teachName,
        teachingGroupStatus: set === '1' ? status : '',
        teachingGroupGradeSubject: set === '1' ? row.teachingGroupGradeSubject : this.dialog.teachingGroupGradeSubject
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
      this.$http.post('subject_addTeachingGroup', {
        teachingGroupName: this.dialog.teachName,
        teachingGroupGradeSubject: this.dialog.teachingGroupGradeSubject
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
    }, // 新增提交接口
    submit() {
      if (!this.dialog.teachName) {
        this.$message.error('请输入教学组！')
        return false
      }
      this.isCanSearch = false
      if (this.dialog.title === '新增教学组') {
        this.addWay()
      } else {
        this.editWay()
      }
    }, // 提交教学组
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
