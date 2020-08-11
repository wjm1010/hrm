<template>
  <div class="dashboard-container approval-secondApproval">
    <!-- 搜索部分 -->
    <search-from :list='searchList' :selectOptions='searchOptions' @click='getList' dateFormat='yyyy-MM-dd'></search-from>
    <!-- 功能按钮部分 -->
    <div class="fr">
      <el-button type="primary" @click="approvalAll">批量审批</el-button>
    </div>
    <!-- 表格部分 -->
    <expand-table @selection-change-event="val=>selectedData = val" can-check-all-box="yes" :pagination="paging" @get-list="getList" :rows="list" :loading="loading" :columns="columns" :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="firstInstanceResult">
        {{+scope.row.firstInstanceResult ? '通过' : '不通过'}}
      </template>
      <template slot-scope="scope" slot="interviewerRecordNote">
        <el-popover trigger="hover" placement="top" v-if="scope.row.interviewerRecordNote.length>10" width="500">
          <p>{{scope.row.interviewerRecordNote}}</p>
          <div slot="reference" class="name-wrapper">
            <p>{{scope.row.interviewerRecordNote.slice(0,10)}}...</p>
          </div>
        </el-popover>
        <p v-else>{{scope.row.interviewerRecordNote}}</p>
      </template>
      <template slot-scope="scope" slot="operating">
        <el-button type="text" size="small" class="actionItems" @click="approval(scope.row)" v-if='scope.row.secondInstanceIdstatus != "2"'>{{['审批', '已审批'][+scope.row.secondInstanceIdstatus]}}</el-button>
        <el-button type="text" size="small" class="actionItems" @click="$router.push(`/resume/look/${scope.row.id}`)">详情</el-button>
        <el-button type="text" size="small" class="actionItems"><a :href="scope.row.resumeInfoAppendix" target="_blank" download>下载简历</a></el-button>
      </template>
    </expand-table>
    <!-- 弹出层部分 -->
    <dialog-from v-if='dialogVisible' lableWidth='150px' title='总经理审批' btnTitle='确认提交' @click='save' :list='dialogList' :selectOptions='dialogOptions' groupDefalt='a' :groupRule='groupRule' />
  </div>
</template>
<script>
import { searchTable, dialog } from '@/mixins'
export default {
  name: 'approval-secondApproval',
  mixins: [searchTable, dialog],
  data() {
    return {
      searchApi: 'examine_getSecondInstance',
      listApi: 'examine_secondInstance',
      dialogApi: 'examine_getGeneralManager',
      // 搜索列表选项
      searchList: [{
        title: '教学部',
        type: 'select',
        modelKey: 'teachingPart',
        optionkey: 'teaching',
      }, {
        title: '面试结果',
        type: 'select',
        model: '1',
        modelKey: 'interviewResults',
        warp: true
      }, {
        title: '所属学科',
        type: 'select',
        modelKey: 'resumeSubject'
      }, {
        title: '授课年级',
        type: 'select',
        modelKey: 'resumeGrade',
        warp: true
      }, {
        title: '是否已审批',
        type: 'select',
        model: '0',
        modelKey: 'examine',
      }, {
        title: '面试日期',
        type: 'datePicker',
        startModel: 'beginTime',
        endModel: 'endTime',
        warp: true
      }, {
        title: '关键字',
        type: 'input',
        placeholder: '输入姓名',
        modelKey: 'keywords',
      }, {
        title: '搜索',
        type: 'btn',
      }],
      // 弹出层保存参数
      dialogParams: {
        secondInstanceResult: '1', // 默认通过
        secondInstanceFirstId: '',
        secondInstanceSalary: '',
        secondInstanceReason: ''
      },
      // 弹出层列表选项
      dialogList: [{
        title: '是否通过审批',
        type: 'select',
        group: ['a', 'b'],
        modelKey: 'secondInstanceResult'
      }, {
        title: '保底薪酬',
        type: 'input',
        group: 'a',
        modelKey: 'secondInstanceSalary'
      }, {
        title: '淘汰理由',
        group: 'b',
        modelKey: 'secondInstanceReason',
        type: 'textarea',
      }, {
        title: '确认提交',
        type: 'btn',
      }],
      groupRule: [{
        req: {
          secondInstanceResult: '0'
        },
        res: 'b'
      }, {
        req: {
          secondInstanceResult: '1'
        },
        res: 'a'
      }],
      dialogListData: [],
      secondInstanceFirstId: '',
      // 弹出框开关
      dialogVisible: false,
      slotNameArr: ['interviewerRecordNote', 'firstInstanceResult', 'interviewerRecordNote', 'operating'],
      columns: [
        { 'value': 'resumeId', 'text': 'ID' },
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'teachingDeptName', 'text': '教学部' },
        { 'value': 'resumeSchool', 'text': '学校名称' },
        { 'value': 'resumeProperty', 'text': '岗位性质' },
        { 'value': 'resumeGrade', 'text': '授课年级' },
        { 'value': 'resumeSubject', 'text': '所属学科' },
        { 'value': 'userName', 'text': '跟进HR' },
        { 'value': 'resumeInterviewUserName', 'text': '面试官' },
        { 'value': 'firstInstanceResult', 'text': '面试结果' },
        { 'value': 'firstInstanceLevel', 'text': '职级' },
        { 'value': 'interviewerRecordFaceDate', 'text': '面试日期' },
        { 'value': 'interviewerRecordNote', 'text': '综合评价', width: 150 },
        { 'value': 'operating', 'text': '操作', width: 200 }
      ],
    }
  },
  methods: {
    /**
     * 提交审批
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    async save(params) {
      if (this.selectedData.length) {
        this.saveAll(params)
        return
      }
      const paramsBack = {}
      if (params.secondInstanceResult === '1') {
        paramsBack.secondInstanceResult = params.secondInstanceResult
        paramsBack.secondInstanceSalary = params.secondInstanceSalary
      } else {
        paramsBack.secondInstanceResult = params.secondInstanceResult
        paramsBack.secondInstanceReason = params.secondInstanceReason
      }
      paramsBack.secondInstanceFirstId = this.secondInstanceFirstId
      const res = await this.$http.post('examine_twoAudit', paramsBack)
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.getList()
    },
    /**
     * 保存批量审批
     * @return {[type]} [description]
     */
    async saveAll(params) {
      const paramsBack = {}
      if (params.secondInstanceResult === '1') {
        paramsBack.secondInstanceResult = params.secondInstanceResult
        paramsBack.secondInstanceSalary = params.secondInstanceSalary
      } else {
        paramsBack.secondInstanceResult = params.secondInstanceResult
        paramsBack.secondInstanceReason = params.secondInstanceReason
      }
      paramsBack.secondInstanceFirstId = this.secondInstanceFirstId
      const res = await this.$http.post('examine_secondTrialBatch', paramsBack)
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.getList()
    },
    /**
     * 审批按钮
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    approval(item) {
      this.secondInstanceFirstId = item.firstInstanceId
      if (+item.secondInstanceIdstatus) return
      this.dialogVisible = true
    },
    /**
     * 批量审批
     */
    approvalAll() {
      if (!this.selectedData.length) {
        this.$message.warning('请先勾选您需要审批的数据')
        return
      }
      if (this.selectedData.find(t => +t.secondInstanceIdstatus)) {
        this.$message.error('已审批的无需再次审批，请重新勾选')
        return
      }
      this.dialogVisible = true
      this.secondInstanceFirstId = this.selectedData.map(t => t.firstInstanceId).toString()
    },
  }
}

</script>
