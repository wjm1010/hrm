<template>
  <div class="dashboard-container">
    <el-row>
      <el-form label-width="130px" inline>
        <el-form-item label="教学部：">
          <el-select v-model="query.userEducationDept" clearable filterable placeholder="请选择" @change='teachingDeptChange' >
            <el-option
              v-for="item in searchOptions.teachingDept"
              :key="item.teachingDeptId"
              :label="item.teachingDeptName"
              :value="item.teachingDeptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科：">
          <el-select v-model="query.userSubject" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in searchOptions.userSubject"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="级别：">
          <el-select v-model="query.userLevel" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in searchOptions.roleLevel"
              :key="item.levelDictId"
              :label="item.levelDictName"
              :value="item.levelDictId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份：">
          <el-select v-model="query.userIdentity" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in searchOptions.teacherIdent"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="面试类型：">
          <el-select v-model="query.userInterviewType" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in searchOptions.faceType"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model.trim="query.keyword" placeholder="搜索面试官姓名/邮箱" class="item-input" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <expand-table
      can-check-all-box="yes"
      :pagination="paging"
      @get-list="getList"
      :rows="list"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="operating">
        <el-button type="text" size="small" class="actionItems" @click="$router.push(`/interviewly/schedulingDetail/${scope.row.userId}`)">排班</el-button>
      </template>

    </expand-table>
  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'interview-scheduling',
  components: {
    expandTable,
  },
  data() {
    return {
      loading: false,
      query: {},
      searchOptions: {},
      isCanSearch: true,
      slotNameArr: ['operating'],
      list: [],
      columns: [
        { 'value': 'userId', 'text': '编号' },
        { 'value': 'userName', 'text': '姓名' },
        { 'value': 'leftRecord', 'text': '待评价' },
        { 'value': 'userSubject', 'text': '学科' },
        { 'value': 'teachingDeptName', 'text': '教学部' },
        { 'value': 'userInterviewTypeName', 'text': '面试类型' },
        { 'value': 'levelDictName', 'text': '级别' },
        { 'value': 'userIdentityName', 'text': '身份' },
        { 'value': 'operating', 'text': '操作' }
      ],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },
    }
  },
  created() {
    this.getRecordOption()
    this.getList()
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    /**
     * 获取列表
     * @return {[type]} [description]
     */
    async getList() {
      this.isCanSearch = false
      this.loading = true
      const res = await this.$http.post('interviewer_scheduler', this.query, { paging: this.paging })
      this.loading = false
      this.isCanSearch = true
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      if (!res.data.data.length) {
        this.$message.warning('没有符合条件的数据')
        this.paging.totalRows = '0'
        this.list = []
        return
      }
      this.list = res.data.data
      this.paging.totalRows = res.data.count
    },
    /**
     * 获取搜索条件
     * @return {[type]} [description]
     */
    async getRecordOption() {
      const res = await this.$http.post('auth_getInterviewerOption')
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.searchOptions = res.data
    },
    /**
     * 教学部选项切换回调
     * @return {[type]} 学科的搜索条件
     */
    teachingDeptChange(val) {
      delete this.query.userSubject
      this.searchOptions.userSubject = val
        ? this.searchOptions.teachingDept.filter(t => t.teachingDeptId === val)[0].teachingDeptGroupList
        : []
    }
  }
}
</script>
<style lang="sass" scoped>
.item-input
  width: 200px
</style>
