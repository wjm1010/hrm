<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <el-row>
      <el-form inline ref="form" :model="query">
        <el-form-item prop="parentReferral">
          <el-checkbox v-model="query.parentReferral">家长转介绍学生</el-checkbox>
        </el-form-item>
        <el-form-item prop="recommendStudent">
          <el-checkbox v-model="query.recommendStudent">我推荐的学生</el-checkbox>
        </el-form-item><br>
        <transition name="fade">
          <el-form-item prop="keyword">
            <el-input v-model="query.keyword" placeholder="学生姓名/学生编号/手机号" class = 'student'></el-input>
          </el-form-item>
        </transition>
        <el-form-item prop="contractStatus">
          <el-select v-model="query.contractStatus" multiple placeholder="成单状态">
            <el-option
              v-for="(item,index) in options.contractStatus"
              :key="index"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <transition name="fade">
          <el-form-item  prop="submitTime" >
            <el-date-picker
              v-model="query.submitTime"
              type="daterange"
              range-separator="至"
              start-placeholder="成单生成日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </transition>
        <el-form-item prop="contractType">
          <el-select v-model="query.contractType" placeholder="成单阶段">
            <el-option
              v-for="(item,index) in options.contractType"
              :key="index"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item prop="group" v-if="jurisdiction">
          <el-select v-model="query.group" placeholder="组">
            <el-option
              v-for="(item,index) in options.group"
              :key="index"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="member" v-if="jurisdiction">
          <el-select v-model="query.member" placeholder="人">
            <el-option
              v-for="(item,index) in options.member"
              :key="index"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <transition name="fade">
          <el-form-item >
            <el-button type="primary"  icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>
            <el-button icon="el-icon-delete" @click="resetFields">重置</el-button>
          </el-form-item>
        </transition>
      </el-form>
    </el-row>
    <expand-table
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr"
      @change-table-sort="changeTableSort"
      :pagination="paging"
      @get-list="getList">
      <template slot-scope="scope" slot="phone">
        <span>{{scope.row.phone | phoneDesensitization}}</span>
      </template>
      <template slot-scope="scope" slot="contractId">
        <span class="blue"
          @click="linkto(scope.row.contractId, '/contract/detail/check/')" >{{scope.row.contractId}}
        </span>
      </template>
      <template slot-scope="scope" slot="content">
        <el-popover trigger="hover" placement="top" v-if="scope.row.content && scope.row.content.length>15" width="500">
          <p>{{scope.row.content}}</p>
          <div slot="reference" class="name-wrapper">
            <p>{{scope.row.content.slice(0,15)}}...</p>
          </div>
        </el-popover>
        <p v-else>{{scope.row.content}}</p>
      </template>
      <template slot-scope="scope" slot="stepSubmitComment">
        <el-popover trigger="hover" placement="top" v-if="scope.row.stepSubmitComment && scope.row.stepSubmitComment.length>15" width="500">
          <p>{{scope.row.stepSubmitComment}}</p>
          <div slot="reference" class="name-wrapper">
            <p>{{scope.row.stepSubmitComment.slice(0,15)}}...</p>
          </div>
        </el-popover>
        <p v-else>{{scope.row.stepSubmitComment}}</p>
      </template>
      <template slot-scope="scope" slot="opertion">
        <el-button type="text" 
          @click="linkto(scope.row.studentIntentionId, '/roster/detail/')" class="actionItems">沟通详情
        </el-button>
        <el-button type="text"
          @click="linkto(scope.row.studentIntentionId, '/lessonplanorder/list/')" class="actionItems">设班单
        </el-button>
      </template>
    </expand-table>
  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'
  import { mapGetters } from 'vuex'
  export default {
    name: 'contractIng',
    components: { expandTable },
    data() {
      return {
        jurisdiction: false,
        columns: [
          { 'value': 'studentName', 'text': '学生姓名' },
          { 'value': 'studentNo', 'text': '学生编号' },
          { 'value': 'phone', 'text': '手机号' },
          { 'value': 'contractId', 'text': '成单编号', width: 150 },
          { 'value': 'contractSum', 'text': '成单金额' },
          { 'value': 'submitTime', 'text': '成单登记时间', sortable: true },
          { 'value': 'statusName', 'text': '状态' },
          { 'value': 'saleStageName', 'text': '成单阶段' },
          { 'value': 'stepSubmitComment', 'text': '驳回原因' },
          { 'value': 'submitUserName', 'text': '提交人' },
          { 'value': 'endTime', 'text': '最后沟通时间', 'sortable': true },
          { 'value': 'content', 'text': '最后沟通内容' },
          { 'value': 'opertion', 'text': '操作' }
        ],
        slotNameArr: ['contractId', 'content', 'phone', 'stepSubmitComment', 'opertion'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0' // 一共多少条
        },
        query: {
          keyword: '',
          submitTime: [],
          student: '',
          contractId: '',
          contractStage: '',
          contractStatus: '',
          group: '',
          member: '',
          orderPay: '',
          bigTypeId: '',
          sequence: '',
          sort: '',
          parentReferral: '', // 家长转介绍学生
          recommendStudent: '' // 我推荐的学生
        },
        loading: false,
        isCanSearch: true,
        options: {
          contractStatus: [],
          contractType: [],
          group: [],
          member: [],
          status: []
        }
      }
    },
    created() {
      this.init()
      if (this.roleCode === 'XS-ZY') {
        this.jurisdiction = false
      } else {
        this.jurisdiction = true
      }
    },
    computed: {
      ...mapGetters(['roleCode'])
    },
    methods: {
      /**
       * 初始化
       * @return {[type]} [description]
       */
      init() {
        Promise.all([this.getMenu(), this.getGroup(), this.getList()])
      },
      /**
       * 获取搜索菜单
       * @return {[type]} [description]
       */
      async getMenu() {
        const res = await this.$http.get('contract_menu')
        if (res.data) {
          this.options = res.data
        }
      },
      /**
       * 获取列表数据
       * @return {[type]} [description]
       */
      async getList() {
        this.loading = true
        this.isCanSearch = false
        const _query = Object.assign({}, this.query)
        const time = _query.submitTime && _query.submitTime.length
        _query.submitTimeStart = time ? _query.submitTime[0] : ''
        _query.submitTimeEnd = time ? _query.submitTime[1] : ''
        delete _query.submitTime
        const res = await this.$http.post('contract_order', _query, { paging: this.paging })
        this.loading = false
        this.isCanSearch = true
        if (!res.data) {
          this.$message.error(res.message)
          return
        }
        if (!res.data.list.length) {
          this.$message.warning('没有符合条件的数据')
          this.paging.totalRows = '0'
          this.rows = []
          return
        }
        this.rows = res.data.list
        this.paging.totalRows = res.data.paging.dataCount
      },
      /**
       * 获取组
       * @return {[type]} [description]
       */
      async getGroup() {
        const res = await this.$http.get('search_getMembers')
        if (!res.data) {
          this.$message.error(res.message)
          return
        }
        this.options.group = res.data.deptTree
        this.options.member = res.data.allUser
      },
      /**
       * 获取人
       * @return {[type]} [description]
       */
      async getMember() {
        const res = await this.$http.post('search_getGroupMember', { group: this.query.group })
        if (!res.data) {
          this.$message.error(res.message)
          return
        }
        this.options.member = res.data.users
      },
      /**
       * 重置
       * @return {[type]} [description]
       */
      resetFields() {
        this.query.sort = ''
        this.query.sequence = ''
        this.$refs['form'].resetFields()
        this.submitTime = []
      },
      /**
       * 跳转
       * @return {[string]} url 路径
       */
      linkto(studentIntentionId, url) {
        if (!studentIntentionId) {
          this.$message.error('系统错误！')
          return
        }
        if (url === '/roster/detail/') {
          this.$eventBus.$emit('show-no-permission-dialog', studentIntentionId)
        } else {
          this.$router.push(`${url}${studentIntentionId}`)
        }
      },
      /**
       * 表头排序
       * @param  {[type]} sequence [description]
       * @param  {[type]} sort     [description]
       * @return {[type]}          [description]
       */
      changeTableSort(sequence, sort) {
        this.query.sequence = sequence
        this.query.sort = sort
        this.getList()
      },
    },
    watch: {
      'query.group'(val) {
        this.query.member = ''
        if (val.length) {
          this.getMember()
          return
        }
        this.getGroup()
      }
    },
  }
</script>
<style>
  .student{
    width: 200px; 
  }
  .blue{
    color: #2C7EFF
  }
</style>
