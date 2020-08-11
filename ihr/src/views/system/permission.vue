<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="70px" inline>
        <el-form-item label="角色：">
          <el-select v-model="query.roleId" clearable filterable placeholder="请选择" @change="changeRole">
            <el-option
              v-for="item in options.roleLevel"
              :key="item.roleDictId"
              :label="item.roleDictName"
              :value="item.roleDictId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="级别：">
          <el-select v-model="query.levelId" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.roleListnew"
              :key="item.levelDictId"
              :label="item.levelDictName"
              :value="item.levelDictId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="query.roleAuthStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div class="fr">
      <el-button type="primary" @click="add">新增权限</el-button>
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
          <span v-if="scope.row['roleAuthStatus']==='有效'">
            <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '1')">设置为无效</el-button>
          </span>
          <span v-if="scope.row['roleAuthStatus']==='无效'">
            <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row, '2')">设置为有效</el-button>
          </span>
        </template>

    </expand-table>
  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'permission',
  components: {
    expandTable
  },
  data() {
    return {
      loading: false,
      query: {
        roleId: '',
        levelId: '',
        roleAuthStatus: '1'
      },
      options: {
        roleLevel: [],
        roleList: [],
        roleListnew: [],
        status: []
      },
      isCanSearch: true,
      slotNameArr: ['operating'],
      rows: [],
      columns: [
        { 'value': 'roleDictName', 'text': '角色' },
        { 'value': 'levelDictName', 'text': '级别' },
        { 'value': 'roleAuthName', 'text': '权限名称' },
        { 'value': 'roleAuthStatus', 'text': '状态' },
        { 'value': 'operating', 'text': '编辑', width: 200 }
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
      this.$http.post('auth_getRoleLevelOption').then(res => {
        if (res.data) {
          this.options = res.data
        }
      }).catch(console.log)
    },
    changeRole() {
      this.query.levelId = ''
      if (this.query.roleId) {
        this.options.roleListnew = this.options.roleList[this.query.roleId]
      } else {
        this.options.roleListnew = []
      }
    },
    getList() {
      this.isCanSearch = false
      this.loading = true
      this.$http.post('auth_proList', this.query, { paging: this.paging }).then(res => {
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
    },
    add() {
      this.$router.push('/system/permission/add')
    },
    edit(row) {
      this.$router.push(`/system/permission/edit/${row.roleAuthId}`)
    },
    setStatus(row, num) {
      let statusText = ''
      num === '1' ? statusText = '无效' : statusText = '有效'
      this.$confirm(`是否确认设置为${statusText}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let number = ''
        row.roleAuthStatus === '有效' ? number = '0' : number = '1'
        this.$http.post('auth_userStatus', {
          roleAuthId: row.roleAuthId,
          status: number
        }).then(res => {
          if (res.data) {
            this.$message.success(res.message)
            this.getList()
          }
          return false
        }).catch(console.log)
      }).catch(() => {})
    } // 设置有效或无效
  }
}
</script>
<style lang="sass">

@import '../../styles/system/permission.sass'

</style>
