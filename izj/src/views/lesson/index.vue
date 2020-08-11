<template>
  <div class="dashboard-container">
  <el-row :gutter="20">
    <el-form ref="query" :model="query" label-width="120px" inline class="elForm">
      <el-form-item prop="deptTree" v-if="jurisdiction">
        <el-select v-model="query.deptTree" placeholder="请选择部门" clearable filterable>
          <el-option
            v-for="item in options.deptTree"
            :key="item.id"
            :label="item.text"
            :value="item.id"
            :class="'level-'+item.level">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="allUser" v-if="jurisdiction">
        <el-select v-model="query.allUser" placeholder="请选择人员" clearable filterable>
          <el-option
            v-for="item in options.allUser"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item prop="keyWord">
        <el-input
          style="width:200px"
          placeholder="学生编号/姓名/手机号"
          v-model="query.keyWord"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item prop="areaId">
        <el-select v-model="query.areaId" clearable filterable placeholder="请选择地区">
          <el-option
            v-for="item in options.areas"
            :key="item.id"
            :label="item.area_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="subjectId">
        <el-select v-model="query.subjectId" clearable filterable placeholder="请选择课程类型">
          <el-option
            v-for="item in options.subjects"
            :key="item.subject_id"
            :label="item.subject_name"
            :value="item.subject_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="examYear">
        <el-select v-model="query.examYear" clearable filterable placeholder="请选择高考年份">
          <el-option
            v-for="item in options.years"
            :key="item.year_id"
            :label="item.year_value"
            :value="item.year_id">
          </el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item prop="numTimes">
        <el-select v-model="query.numTimes" clearable filterable placeholder="是否提交反馈">
          <el-option
            v-for="item in options.followCount"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="lastCommunicationTime">
        <el-date-picker
          v-model="query.lastCommunicationTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item><br>
      <el-form-item>
        <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!canSearch">查询</el-button>
        <el-button @click="resetForm('query')" icon="el-icon-delete" class="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-col :span="24">
      <expand-table

        :pagination="paging"
        @get-list="getList"
        :rows="rows"
        :loading="loading"
        :columns="columns"
        :slot-name-arr="slotNameArr">

        <template slot-scope="scope" slot="content">
          <el-popover trigger="hover" placement="top" v-if="scope.row['content'].length>10" width="500">
            <p>{{scope.row['content']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['content'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['content']}}</p>
        </template>

        <template slot-scope="scope" slot="curr_plan_name">
          <el-popover trigger="hover" placement="top" v-if="scope.row['curr_plan_name'].length>10" width="500">
            <p>{{scope.row['curr_plan_name']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['curr_plan_name'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['curr_plan_name']}}</p>
        </template>

        <template slot-scope="scope" slot="remainTime1">
          <span>{{scope.row.remainTime[1]}}</span>
        </template>
        <template slot-scope="scope" slot="remainTime2">
          <span>{{scope.row.remainTime[2]}}</span>
        </template>

        <template slot-scope="scope" slot="operating">
          <el-button type="text" size="small" @click="addCauseRow(scope.row)" class="actionItems">提交反馈</el-button>
        </template>

        <template slot-scope="scope" slot="reasonStopping">
          <el-button type="text" size="small" @click="changeTableViewSelect(scope.row)" class="actionItems">
            沟通详情
          </el-button>
        </template>

      </expand-table>
    </el-col>

  </el-row>

  <div class="dialog">
    <el-dialog
      :visible.sync="dialogFormVisible"
      custom-class="el-dialog-md"
      @close="closeDialogEvent">
      <div style="text-align:center;font-size:20px;margin-bottom:30px">跟进情况反馈</div>
      <el-form :model="dialogQuery" ref="dialogQuery" :rules="dialogRules" class="ClassFrom" v-loading="loading">
        <el-form-item prop="tools" label="沟通工具：" label-width="120px">
          <el-select v-model="dialogQuery.tools" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in dialogOptions.tools"
              :key="item.code"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-form-item class="el-col-3"><i class="vereist">&nbsp;*</i>停结课原因：</el-form-item>
          <el-form-item class="el-col-3" prop="reasonType">
            <el-select v-model="dialogQuery.reasonType" filterable>
              <el-option
                v-for="(item,index) in dialogOptions.reasonType"
                :key="index"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="reason" class="el-col-4">
            <el-select v-model="dialogQuery.reason" clearable filterable>
              <el-option
                v-for="(item,index) in dialogOptions.reason"
                :key="index"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item class="el-col-3"><i class="vereist">&nbsp;&nbsp;&nbsp;*</i>是否激活：</el-form-item>
          <el-form-item class="el-col-3">
            <el-select v-model="dialogQuery.active" filterable>
              <el-option
                v-for="(item,index) in activation"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="activeOption" class="el-col-4" ref="activeoption">
            <el-select v-model="dialogQuery.activeOption" clearable filterable :disabled='nodisabled'>
              <el-option
                v-for="(item,index) in dialogOptions.activeOption"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <div class="verifyContent" v-if="verifyCon">{{verifyContent}}</div>
        <el-form-item label="备注：" prop="remarks" label-width="120px" ref="remark">
          <el-input
            type="textarea"
            :placeholder="textareaContent"
            :maxlength="500"
            v-model.trim="dialogQuery.remarks">
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogEvent">取消</el-button>
        <el-button type="primary" @click="addContractBtn" :disabled="!canSearch">提交</el-button>
      </div>
    </el-dialog>
  </div>

  </div>
</template>

<script>
import ExpandTable from '@/components/ExpandTable'
import { mapGetters } from 'vuex'

export default {
  name: 'lessonindex',
  components: {
    ExpandTable
  },
  data() {
    return {
      textareaContent: '请输入沟通内容，最多500字',
      options: {
        deptTree: [],
        allUser: [],
        subjects: [],
        areas: [],
        years: [],
        followCount: []
      },
      nodisabled: true,
      columns: [
        { 'value': 'student_no', 'text': '学生编号' },
        { 'value': 'name', 'text': '学生姓名' },
        { 'value': 'area_name', 'text': '所在地区' },
        { 'value': 'exam_year', 'text': '高考年份' },
        { 'value': 'curr_plan_name', 'text': '报名课程' },
        { 'value': 'remainTime1', 'text': '剩余常规课时' },
        { 'value': 'remainTime2', 'text': '剩余五星课时' },
        { 'value': 'teacher_name', 'text': '班主任' },
        { 'value': 'end_time', 'text': '最后沟通时间' },
        { 'value': 'content', 'text': '最后沟通内容' },
        { 'value': 'reasonStopping', 'text': '查看' },
        { 'value': 'operating', 'text': '操作' }
      ],
      rows: [],
      slotNameArr: ['operating', 'content', 'curr_plan_name', 'remainTime1', 'remainTime2', 'reasonStopping'],
      paging: {
        totalRows: '0',
        page: '1',
        pageSize: '10'
      },
      activation: [
        {
          key: '0',
          value: '否'
        }, {
          key: '1',
          value: '是'
        }
      ],
      verifyCon: false,
      verifyContent: '没有可选择的具体原因吗？',
      dialogOptions: {
        reasonType: [],
        activeOption: [],
        tools: [],
        reason: []
      },
      dialogQuery: {
        curId: '',
        studentIntentionId: '',
        reason: '',
        activeOption: '',
        active: '0',
        remarks: '',
        tools: '',
        reasonType: ''
      },
      dialogRules: {
        tools: [
          {
            required: true, message: '请选择沟通工具！', trigger: 'change'
          }
        ],
        activeOption: [
          {}
        ],
        remarks: [
          { required: true, trigger: 'change', validator: this.verRemarks }
        ],
        reason: [
          {
            required: true, message: '请选择停结课原因！', trigger: 'change'
          }
        ],
        reasonType: [
          {
            required: true, message: '请选择！', trigger: 'change'
          }
        ]
      },
      loading: true,
      dialogFormVisible: false,
      vereist: false,
      canSearch: true,
      jurisdiction: false,
      query: {
        lastCommunicationTime: [],
        deptTree: '',
        allUser: '',
        lastCommunicationTimeStart: '',
        lastCommunicationTimeEnd: '',
        subjectId: '',
        areaId: '',
        examYear: '',
        keyWord: '',
        numTimes: ''
      }
    }
  },
  computed: {
    ...mapGetters(['roleCode'])
  },
  created() {
    this.getList()
  },
  mounted() {
    this.formdata()
    this.activatedstate()
  },
  watch: {
    'query.deptTree'(newVal) {
      this.$set(this.query, 'allUser', '')
      if (newVal.length) {
        this.getGroupMember()
      } else {
        this.options.allUser = ''
      }
    },
    'dialogQuery.reasonType'(val) {
      this.$set(this.dialogQuery, 'reason', '')
      if (val.length) {
        this.getLessonReason()
      } else {
        this.dialogQuery.reason = ''
      }
    },
    'dialogQuery': {
      handler(val) {
        // 是否激活
        if (val.active === '1') {
          this.nodisabled = false
          this.$set(this.dialogRules.activeOption, 0, { required: true, trigger: 'change', message: '请选择激活项！' })
        } else {
          this.$set(this.dialogRules.activeOption, 0, {})
          if (this.$refs['activeoption']) {
            this.$refs['activeoption'].clearValidate()
          }
          this.$set(this.dialogQuery, 'activeOption', '')
          this.nodisabled = true
        }
        // 监听停结课原因
        if (val.reasonType === '其他' && val.reason === '其他') {
          this.verifyCon = true
          this.textareaContent = '请在此详细说明具体原因，字数在20-500字之间'
          this.$set(this.dialogRules.remarks, 0, { required: true, trigger: 'change', validator: this.verRemarks })
        } else {
          this.verifyCon = false
          this.textareaContent = '请输入沟通内容，最多500字'
          this.$set(this.dialogRules.remarks, 0, {})
          if (this.$refs['remark']) {
            this.$refs['remark'].clearValidate()
          }
        }
      },
      deep: true
    }
  },
  methods: {
    changeTableViewSelect(row) {
      if (row.rosterId) {
        this.$eventBus.$emit('show-no-permission-dialog', row.rosterId)
      } else {
        this.$message.error('系统错误！')
      }
    }, // 沟通详情
    getGroupMember() { // 获取班主任人员
      this.$http.post('visit_getGroupMember', { group: this.query.deptTree }).then(res => {
        if (res.data) {
          this.$set(this.options, 'allUser', res.data.users)
        }
      }).catch((error) => {
        console.log(error)
        this.$message.error('获取人员请求失败，请稍后重试！')
      })
    },
    activatedstate() {
      this.dialogQuery.active = this.activation[0].key
    },
    formdata() {
      this.$http.get('course_search').then(res => {
        if (res.data) {
          this.options = res.data
          this.dialogOptions.activeOption = res.data.activeOption
          this.dialogOptions.tools = res.data.tools
          this.options.allUser = []
        }
      }).catch(console.log)
      if (this.roleCode === 'ZJ-ZY') {
        this.jurisdiction = false
      } else {
        this.jurisdiction = true
      }
    },
    handleData(data) { // 处理表格数据
      this.rows = []
      data.map(item => {
        var listArray = []
        if (item['curriculums']) {
          item['curriculums'].forEach((item, index) => {
            listArray.push(item['curr_plan_name'])
          })
          item['curr_plan_name'] = listArray.join('/')
        }
        this.rows.push(item)
      })
    },
    resetForm(formName) { // 重置表单
      this.$refs[formName].resetFields()
    },
    addCauseRow(row) { // 停结课原因【添加】弹窗清空
      this.dialogFormVisible = true
      this.$set(this.dialogQuery, 'curId', row.cur_status_id)
      this.$set(this.dialogQuery, 'studentIntentionId', row.rosterId)
      this.loading = true
      this.canSearch = false
      this.formdata()
      this.$http.get('teacher_stopLessonReasonType').then(res => {
        if (res.data) {
          this.dialogOptions.reasonType = res.data
        }
      }).catch(console.log).finally(() => {
        this.loading = false
        this.canSearch = true
      })
    },
    getLessonReason() {
      this.$http.get('teacher_stopLessonReason', {
        params: {
          type: this.dialogQuery.reasonType
        }
      }).then(res => {
        if (res.data) {
          this.dialogOptions.reason = res.data
        }
      }).catch(console.log)
    },
    closeDialogEvent() {
      this.dialogFormVisible = false
      this.dialogQuery.active = '0'
      this.verifyCon = false
      this.$refs['dialogQuery'].resetFields()
    },
    verRemarks(rule, value, callback) {
      if (!value) {
        callback(new Error('请备注说明详细的停结课原因'))
        return
      }
      if (value.length < 20) {
        callback(new Error('备注原因少于20字，请补充'))
        return
      }
      callback()
    },
    addContractBtn() { // 停结课原因【添加】
      if (this.dialogQuery.reasonType === '其他' && this.dialogQuery.reason === '其他') {
        this.verifyCon = true
      } else {
        this.verifyCon = false
      }
      this.$refs['dialogQuery'].validate((valid) => {
        if (valid) {
          this.canSearch = false
          this.$http.post('course_reason', this.dialogQuery).then(res => {
            if (res.data) {
              this.getList()
            }
          }).catch(console.log).finally(() => {
            this.dialogFormVisible = false
            this.canSearch = true
          })
        } else {
          this.$message.warning('提交失败')
          return false
        }
      })
    },
    getList() {
      this.loading = true
      this.canSearch = false
      const _query = Object.assign({}, this.query)
      if (_query.lastCommunicationTime === null || _query.lastCommunicationTime.length === 0) {
        _query.lastCommunicationTimeStart = ''
        _query.lastCommunicationTimeEnd = ''
      } else {
        _query.lastCommunicationTimeStart = _query.lastCommunicationTime[0]
        _query.lastCommunicationTimeEnd = _query.lastCommunicationTime[1]
      }
      this.$delete(_query, 'lastCommunicationTime')
      this.$http.get('course_over', {
        params: _query,
        paging: this.paging
      }).then(res => {
        if (res.data) {
          if (res.data.list.length === 0) {
            this.rows = []
            this.paging.totalRows = '0'
            return
          }
          this.handleData(res.data.list)
          this.paging.totalRows = res.data.paging.dataCount
        }
      }).catch(console.log).finally(() => {
        this.loading = false
        this.canSearch = true
      })
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/lesson/index.sass'

</style>
