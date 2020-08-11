<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container order">
    <el-row :gutter="20">
      <el-form ref="query" :model="query" inline label-position="right" label-width="110px">
        <el-form-item prop="keyWord" label="学生">
          <el-input v-model="query.keyWord" class="input-width" placeholder="姓名/电话/学生编号" clearable></el-input>        
        </el-form-item>
        <el-form-item prop="emergencyDegree" label="紧急度">
          <el-select v-model="query.emergencyDegree" placeholder="请选择" class="input-width" clearable>
            <el-option
              v-for="(item, index) in options.emergencyDegree"
              :key="index"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="query.status" placeholder="请选择" class="input-width" clearable>
            <el-option
              v-for="(item, index) in options.status"
              :key="index"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item prop="subjectId" label="申请学科">
          <el-select v-model="query.subjectId" placeholder="请选择" class="input-width" clearable>
            <el-option
              v-for="(item, index) in options.subject"
              :key="index"
              :label="item.subject_name"
              :value="item.subject_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="bothIsConfirmed" label="双方是否确认">
          <el-select v-model="query.bothIsConfirmed" placeholder="请选择" class="input-width" clearable>
            <el-option
              v-for="(item, index) in options.bothIsConfirmed"
              :key="index"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isSort" label="排课规律">
          <el-select v-model="query.isSort" placeholder="请选择" class="input-width" clearable>
            <el-option
              v-for="(item, index) in options.isSort"
              :key="index"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item prop="contractType" label="课时类型">
          <el-select v-model="query.contractType" placeholder="请选择" class="input-width" clearable>
            <el-option
              v-for="(item, index) in options.contractType"
              :key="index"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="strategyNo" label="正式设班单编号">
          <el-input v-model="query.strategyNo" class="input-width" placeholder="编号" clearable></el-input>        
        </el-form-item>
        <el-form-item prop="deptTree" label="申请人"  v-if="jurisdiction">
          <el-select v-model="query.deptTree" clearable placeholder="请选择" class="input-width">
            <el-option
              v-for="(item, index) in options.deptTree"
              :key="index"
              :label="item.text"
              :value="item.id"
              :class="'level-'+item.level">
            </el-option>
          </el-select>
          <el-select v-model="query.userId" multiple clearable collapse-tags placeholder="请选择" class="input-width-more">
            <el-option
              v-for="(item, index) in options.allUser"
              :key="index"
              :label="item.text"
              :value="item.userid">
            </el-option>
          </el-select>
        </el-form-item><br>

        <el-form-item prop="type" label="设班类型">
          <el-select v-model="query.type" placeholder="请选择" class="input-width" clearable>
            <el-option
              v-for="item in options.type"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item><br>

        <el-form-item prop="lastTime" label="最后处理时间">
          <el-date-picker
            v-model="query.lastTime"
            type="daterange"
            range-separator="至"
            start-placeholder="年-月-日"
            end-placeholder="年-月-日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="subTime" label="提交日期">
          <el-date-picker
            v-model="query.subTime"
            type="daterange"
            range-separator="至"
            start-placeholder="年-月-日"
            end-placeholder="年-月-日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item><br>
        <el-button type="primary" icon="el-icon-search" :disabled="!canSearch" @click="getList">查询</el-button>
        <el-button type="primary" :disabled="!canSearch" class="reset" @click="resetForm('query')">重置</el-button>
      </el-form>
    </el-row>
    <ExpandTable
      :pagination="paging"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      @get-list="getList"
      :tableExpandColumns="tableExpandColumns"
      :slot-name-arr="slotNameArr"
      @change-table-sort="changeTableSort">
      <template slot-scope="scope" slot="type">
        <span :class="{'blue':scope.row.type === '1','orange':scope.row.type === '2'}">
          <b v-if="scope.row.type==='1'">正常排课</b>
          <b v-else>拓科</b>
        </span>
      </template>
      <template slot-scope="scope" slot="studentName">
        <span>{{scope.row.studentName}} ({{scope.row.studentNo}})</span><br>
        {{scope.row.phone}}
      </template>
      <template slot-scope="scope" slot="emergencyDegree">
        <span :class="{'veryUrgent':scope.row.emergencyDegree === '非常紧急','urgent':scope.row.emergencyDegree === '紧急'}">
          {{scope.row.emergencyDegree}}
        </span>
      </template>
      <template slot-scope="scope" slot="operating">
        <el-button class="actionItems" size="small" type="text" @click="changeTableViewSelect(scope.row)">沟通详情</el-button>
        <el-button class="actionItems" size="small" type="text" @click="look(scope.row)">查看</el-button>
        <el-button type="text" size="small" class="actionItems" @click="edit(scope.row)" v-if="scope.row['status'] === '待提交' || scope.row['status'] === '已驳回'">编辑</el-button>
        <el-button type="text" size="small" class="actionItems delete" @click="canRollback(scope.row)" v-if="scope.row['type'] === '2' && scope.row['canRollback'] === '撤回'">撤回</el-button>
        <el-button type="text" size="small" class="actionItems delete" @click="deleteInfo(scope.row)" v-if="scope.row['status'] === '待提交'">删除</el-button>
      </template>
    </ExpandTable>
  </div>
</template>

<script>
import ExpandTable from '@/components/ExpandTable'

import { mapGetters } from 'vuex'
export default {
  name: 'lessonPlanManageformal',
  components: {
    ExpandTable
  },
  data() {
    return {
      jurisdiction: false,
      query: {
        keyWord: '',
        emergencyDegree: '',
        status: '',
        subjectId: '',
        type: '',
        bothIsConfirmed: '',
        isSort: '',
        contractType: '',
        deptTree: '',
        strategyNo: '',
        userId: [],
        lastTime: [],
        subTime: [],
        sequence: '',
        sort: ''
      },
      options: {
        emergencyDegree: [],
        status: [],
        subject: [],
        contractType: [],
        deptTree: [],
        bothIsConfirmed: [],
        isSort: [],
        allUser: []
      },
      rows: [],
      columns: [
        { 'value': 'type', 'text': '设班类型', width: 60 },
        { 'value': 'strategyNo', 'text': '正式设班单编号', 'width': 100 },
        { 'value': 'studentName', 'text': '学生' },
        { 'value': 'subjectName', 'text': '申请学科' },
        { 'value': 'contractType', 'text': '课时类型' },
        { 'value': 'actualPeriod', 'text': '排课课时数' },
        { 'value': 'status', 'text': '状态' },
        { 'value': 'emergencyDegree', 'text': '紧急度' },
        { 'value': 'dealuserName', 'text': '处理人' },
        { 'value': 'lastdealTime', 'text': '最后处理时间', 'sortable': 'custom', 'width': 130 },
        { 'value': 'applyUserName', 'text': '申请人' },
        { 'value': 'operating', 'text': '操作', 'width': 150 }
      ],
      tableExpandColumns: [
        { text: '排课规律', value: 'isSort' },
        { text: '双方是否确认', value: 'bothIsConfirmed' },
        { text: '提交时间', value: 'submitTime' }
      ],
      loading: false,
      canSearch: true,
      slotNameArr: ['operating', 'studentName', 'emergencyDegree', 'type'],
      paging: {
        totalRows: '0',
        page: '1',
        pageSize: '20'
      }
    }
  },
  computed: {
    ...mapGetters(['roleCode'])
  },
  created() {
    this.getList(true)
    this.formdata()
  },
  mounted() {
  },
  watch: {
    'query.deptTree'(newVal) {
      this.$set(this.query, 'userId', [])
      if (newVal.length) {
        this.getGroupMember()
      } else {
        this.options.allUser = []
      }
    }
  },
  activated() {
    this.getList()
  },
  methods: {
    changeTableViewSelect(row) {
      if (row.studentIntentionId) {
        this.$eventBus.$emit('show-no-permission-dialog', row.studentIntentionId)
      } else {
        this.$message.error('系统错误！')
      }
    }, // 沟通详情 检测 跳转
    checkDetails(row) {
      if (row.studentIntentionId) {
        this.$router.push(`/lessonplanDetails/detail/${row.studentIntentionId}`)
      } else {
        this.$message.error('系统错误！')
      }
    }, // 查看详情
    getList(msg) {
      this.loading = true
      this.canSearch = false
      const _query = Object.assign({}, this.query)
      if (_query.lastTime === null || _query.lastTime.length === 0) {
        _query.lastStartTime = ''
        _query.lastEndTime = ''
      } else {
        _query.lastStartTime = _query.lastTime[0]
        _query.lastEndTime = _query.lastTime[1]
      }
      if (_query.subTime === null || _query.subTime.length === 0) {
        _query.subStartTime = ''
        _query.subEndTime = ''
      } else {
        _query.subStartTime = _query.subTime[0]
        _query.subEndTime = _query.subTime[1]
      }
      if (this.$route.query.studentNo && msg === true) {
        _query.keyWord = this.$route.query.studentNo
        this.query.keyWord = this.$route.query.studentNo
      } else {
        _query.keyWord = _query.keyWord
      }

      this.$delete(_query, 'subTime')
      this.$delete(_query, 'lastTime')
      this.$delete(_query, 'deptTree')
      _query.userId = this.query.userId.join(',')
      this.$http.get('scheduleList_listSearch', {
        params: _query,
        paging: this.paging,
        isFilterUrl: true
      }).then(res => {
        if (res.data) {
          if (res.data.list.length === 0) {
            this.rows = []
            this.paging.totalRows = '0'
            return
          }
          this.rows = res.data.list
          this.paging.totalRows = res.data.paging.dataCount
        }
      }).catch(console.log).finally(() => {
        this.loading = false
        this.canSearch = true
      })
    }, // 获取列表
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.query.keyWord = ''
    }, // 重置
    changeTableSort(prop, order) {
      this.query.sequence = prop
      this.query.sort = order
      this.getList()
    }, // 排序
    formdata() {
      this.$http.get('scheduleList_conditionSearch').then(res => {
        if (res.data) {
          this.options = res.data
          this.options.allUser = []
        }
      }).catch(console.log)
      if (this.roleCode === 'ZJ-ZY') {
        this.jurisdiction = false
      } else {
        this.jurisdiction = true
      }
    }, // 下拉选项
    getGroupMember() {
      this.$http.get('distributionTeacher_appliCant', {
        params: {
          departmentId: this.query.deptTree
        }
      }).then(res => {
        if (res.data) {
          this.$set(this.options, 'allUser', res.data.users)
        }
      }).catch(console.log)
    }, // 获取人员
    deleteInfo(row) {
      this.$confirm('删除后该设班单不存在，确认删除此设班单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('courseApplication_delStrategy', {
          strategyId: row.strategyId
        }).then(res => {
          if (res.data) {
            this.$message.success('操作成功')
            this.getList()
          }
        }).catch(console.log)
      }).catch(() => { return })
    }, // 删除
    // 撤销设班单
    canRollback(row) {
      this.$confirm('确认撤回此拓科设班单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('courseApplication_rollbackStrategy', {
          strategyId: row.strategyId
        }).then(res => {
          if (res.code === '0x000000') {
            this.$message.success(res.message)
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        }).catch(console.log)
      }).catch(() => { return })
    },
    edit(row) {
      if (row.type === '1') {
        this.$router.push({ path: `/newLesson/edit/${row.strategyId}`, query: {
          studentIntentionId: row.studentIntentionId,
          studentName: row.studentName,
          studentNo: row.studentNo
        }})
      } else {
        this.$router.push({ path: `/expandLesson/edit/${row.strategyId}`, query: {
          studentIntentionId: row.studentIntentionId,
          studentName: row.studentName,
          studentNo: row.studentNo
        }})
      }
    }, // 编辑
    look(row) {
      if (row.isSort === '有规律') {
        this.$router.push({ path: '/lessonplanDetails/policyDetails', query: {
          strategyId: row.strategyId,
          type: row.type
        }})
      } else if (row.isSort === '无规律') {
        this.$router.push({ path: '/lessonplanDetails/unorderDetails', query: {
          strategyId: row.strategyId,
          type: row.type
        }})
      }
    } // 查看
  }
}
</script>
<style lang="sass">
@import '../../styles/lessonplanorder/formal.sass'
</style>