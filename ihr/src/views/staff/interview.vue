<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="120px" inline>
        <el-form-item label="教学部：">
          <el-select v-model="query.userEducationDept" clearable filterable placeholder="请选择" @change="changeGroup">
            <el-option
              v-for="item in options.teachingDept"
              :key="item.teachingDeptId"
              :label="item.teachingDeptName"
              :value="item.teachingDeptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教学组：">
          <el-select v-model="query.userGroup" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.teachingDeptGroupList"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="级别：">
          <el-select v-model="query.userLevel" clearable filterable placeholder="请选择" @change="changeRole">
            <el-option
              v-for="item in options.roleLevel"
              :key="item.levelDictId"
              :label="item.levelDictName"
              :value="item.levelDictId">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="身份：">
          <el-select v-model="query.userIdentity" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.teacherIdent"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面试类型：">
          <el-select v-model="query.userInterviewType" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.faceType"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="query.userStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="关键字：">
          <el-input v-model="query.keywords" placeholder="姓名/邮箱" class="item-input" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="权限名称：">
          <el-select v-model="query.userPoser" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.roleListNew"
              :key="item.roleAuthId"
              :label="item.roleAuthName"
              :value="item.roleAuthId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="add">新增面试官</el-button>
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
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '1')" v-if="scope.row['userStatus']==='0'">设置为有效</el-button>
          <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '0')" v-if="scope.row['userStatus']==='1'">设置为无效</el-button>
        </template>

    </expand-table>

  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'interview',
  components: {
    expandTable
  },
  data() {
    return {
      loading: false,
      query: {
        userEducationDept: '',
        userGroup: '',
        userInterviewType: '',
        userIdentity: '',
        userLevel: '',
        userStatus: '1',
        userPoser: '',
        keywords: ''
      },
      options: {
        teachingDept: [],
        teachingDeptGroupList: [],
        roleLevel: [],
        teacherIden: [],
        faceType: [],
        status: [],
        roleList: [],
        roleListNew: []
      },
      isCanSearch: true,
      slotNameArr: ['operating'],
      rows: [],
      columns: [
        { 'value': 'userId', 'text': '编号' },
        { 'value': 'userName', 'text': '姓名' },
        { 'value': 'levelDictName', 'text': '级别' },
        { 'value': 'teachingDeptName', 'text': '教学部' },
        { 'value': 'userGroup', 'text': '教学组' },
        { 'value': 'userInterviewTypeName', 'text': '面试类型' },
        { 'value': 'userStatusName', 'text': '状态' },
        { 'value': 'operating', 'text': '操作' }
      ],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    getOptions() {
      this.$http.post('auth_getInterviewerOption').then(res => {
        if (res.data) {
          this.options = res.data
        }
      }).catch(console.log)
    },
    changeGroup() {
      this.query.userGroup = ''
      if (this.query.userEducationDept) {
        this.options.teachingDeptGroupList = this.options.teachingDept[this.query.userEducationDept - 1].teachingDeptGroupList
      } else {
        this.options.teachingDeptGroupList = []
      }
    },
    changeRole() {
      this.query.userPoser = ''
      if (this.query.userLevel) {
        this.options.roleListNew = this.options.roleList[this.query.userLevel]
      } else {
        this.options.roleListNew = []
      }
    },
    getList() {
      this.isCanSearch = false
      this.loading = true
      this.$http.post('interview_getUserList', this.query, { paging: this.paging }).then(res => {
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
    setStatus(row, num) {
      let statusText = ''
      num === '1' ? statusText = '有效' : statusText = '无效'
      this.$confirm(`是否确认设置为${statusText}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('hr_userStatus', {
          userId: row.userId,
          status: num
        }).then(res => {
          if (res.data) {
            this.$message.success(res.message)
            this.getList()
          }
        }).catch(console.log)
      }).catch(() => {})
    }, // 设置有效或无效
    edit(row) {
      this.$router.push(`/staff/interview/edit/${row.userId}`)
    },
    add() {
      this.$router.push('/staff/interview/add')
    }
  }
}
</script>
