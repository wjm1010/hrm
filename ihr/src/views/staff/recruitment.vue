<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="120px" inline>
        <el-form-item label="级别：">
          <el-select v-model="query.userLevel" clearable filterable placeholder="请选择" @change="chooseRole">
            <el-option
              v-for="item in options.roleLevel"
              :key="item.levelDictId"
              :label="item.levelDictName"
              :value="item.levelDictId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称：">
          <el-select v-model="query.userPoser" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.roleListnew"
              :key="item.roleAuthId"
              :label="item.roleAuthName"
              :value="item.roleAuthId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作地点：">
          <el-select v-model="query.userWorkArea" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.workPlace"
              :key="item.workPlaceId"
              :label="item.workPlaceName"
              :value="item.workPlaceId">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="状态：">
          <el-select v-model="query.userStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="query.keywords" placeholder="姓名/邮箱" class="item-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="add">新增HR</el-button>
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
  name: 'recruitment',
  components: {
    expandTable
  },
  data() {
    return {
      loading: false,
      query: {
        userLevel: '',
        userPoser: '',
        userWorkArea: '',
        userStatus: '1',
        keywords: ''
      },
      options: {
        roleLevel: [],
        roleList: [],
        roleListnew: [],
        workPlace: [],
        status: []
      },
      isCanSearch: true,
      slotNameArr: ['operating'],
      rows: [],
      columns: [
        { 'value': 'userId', 'text': '编号' },
        { 'value': 'userName', 'text': '姓名' },
        { 'value': 'levelDictName', 'text': '级别' },
        { 'value': 'workPlaceName', 'text': '工作地点' },
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
      this.$http.post('auth_getHrOption').then(res => {
        if (res.data) {
          this.options = res.data
        }
      }).catch(console.log)
    },
    chooseRole() {
      this.query.userPoser = ''
      if (this.query.userLevel) {
        this.options.roleListnew = this.options.roleList[this.query.userLevel]
      } else {
        this.options.roleListnew = []
      }
    },
    getList() {
      this.isCanSearch = false
      this.loading = true
      this.$http.post('hr_getUserList', this.query, { paging: this.paging }).then(res => {
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
      this.$router.push(`/staff/recruitment/edit/${row.userId}`)
    },
    add() {
      this.$router.push('/staff/recruitment/add')
    }
  }
}
</script>
