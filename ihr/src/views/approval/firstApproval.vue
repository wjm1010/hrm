<template>
  <div class="dashboard-container approval-firstApproval">
    <search-from :list='searchList' :selectOptions='searchOptions' @click='getList' dateFormat='yyyy-MM-dd' />
    <div class="fr">
      <el-button type="primary" @click="approvalAll">批量审批</el-button>
    </div>
    <expand-table @selection-change-event="val=>selectedData = val" can-check-all-box="yes" :pagination="paging" @get-list="getList" :rows="list" :loading="loading" :columns="columns" :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="interviewerRecordResult">
        {{+scope.row.interviewerRecordResult ? '通过' : '不通过'}}
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
        <el-button type="text" size="small" class="actionItems" @click="approval(scope.row)">{{+scope.row.firstInstanceRecordIdstatus ? '已审批' : '审批'}}</el-button>
        <el-button type="text" size="small" class="actionItems" @click="$router.push(`/resume/look/${scope.row.id}`)">详情</el-button>
        <el-button type="text" size="small" class="actionItems"><a :href="scope.row.resumeInfoAppendix" target="_blank" download>下载简历</a></el-button>
      </template>
    </expand-table>
    <dialog-from v-if='dialogVisible' ref="dialogRef" lableWidth='150px' title='经理审批' btnTitle='确认提交' @click='save' :list='dialogList' :selectOptions='dialogOptions' :groupRule='groupRule' groupDefalt='a' />
  </div>
</template>
<script>
import { searchTable, dialog } from '@/mixins'
export default {
  name: 'approval-firstApproval',
  mixins: [searchTable, dialog],
  data() {
    return {
      searchApi: 'examine_getExamine',
      listApi: 'examine_examineList',
      dialogApi: 'examine_getManager',
      searchList: [{
        title: '面试结果',
        type: 'select',
        modelKey: 'interviewerRecordResult',
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
        modelKey: 'examine'
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
        firstInstanceAgree: 0, // 默认通过
        firstInstanceRecordId: '',
        firstInstanceResult: '',
        firstInstanceReason: ''
      },
      // 弹出层列表选项
      dialogList: [{
        title: '是否同意面试结果',
        type: 'select',
        modelKey: 'firstInstanceAgree',
        group: ['a', 'b']
      }, {
        title: '面试结果调整',
        type: 'select',
        modelKey: 'firstInstanceResult',
        group: 'b'
      }, {
        title: '调整理由',
        modelKey: 'firstInstanceReason',
        type: 'textarea',
        group: 'b'
      }],
      groupRule: [{
        req: {
          firstInstanceAgree: '0'
        },
        res: 'b'
      }, {
        req: {
          firstInstanceAgree: '1'
        },
        res: 'a'
      }],
      firstInstanceRecordId: '',
      dialogVisible: false,
      slotNameArr: ['interviewerRecordNote', 'interviewerRecordResult', 'interviewerRecordNote', 'operating'],
      columns: [
        { 'value': 'resumeId', 'text': 'ID' },
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'resumeProperty', 'text': '岗位性质' },
        { 'value': 'resumeGrade', 'text': '授课年级' },
        { 'value': 'resumeSubject', 'text': '所属学科' },
        { 'value': 'userName', 'text': '跟进HR' },
        { 'value': 'InterviewerName', 'text': '面试官' },
        { 'value': 'interviewerRecordResult', 'text': '面试结果' },
        { 'value': 'resumeTeacherLevel', 'text': '职级' },
        { 'value': 'interviewerRecordFaceDate', 'text': '面试日期' },
        { 'value': 'interviewerRecordNote', 'text': '综合评价', width: 200 },
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
      if (params.firstInstanceAgree === '1') {
        paramsBack.firstInstanceAgree = params.firstInstanceAgree
        paramsBack.firstInstanceRecordId = this.firstInstanceRecordId
      }
      params.firstInstanceRecordId = this.firstInstanceRecordId
      const res = await this.$http.post('examine_examineAdd', Object.keys(paramsBack).length ? paramsBack : params)
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.firstInstanceRecordId = ''
      this.getList()
    },
    /**
     * 保存批量审批
     * @return {[type]} [description]
     */
    async saveAll(params) {
      const paramsBack = {}
      if (params.firstInstanceAgree === '1') {
        paramsBack.firstInstanceAgree = params.firstInstanceAgree
        paramsBack.firstInstanceRecordId = this.firstInstanceRecordId
      }
      params.firstInstanceRecordId = this.firstInstanceRecordId
      const res = await this.$http.post('examine_auditMultiple', Object.keys(paramsBack).length ? paramsBack : params)
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.firstInstanceRecordId = ''
      this.getList()
    },
    /**
     * 审批按钮
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    approval(item) {
      this.firstInstanceRecordId = item.interviewerRecordId
      if (+item.firstInstanceRecordIdstatus) return
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
      if (this.selectedData.find(t => +t.firstInstanceRecordIdstatus)) {
        this.$message.error('已审批的无需再次审批，请重新勾选')
        return
      }
      this.dialogVisible = true
      this.firstInstanceRecordId = this.selectedData.map(t => t.interviewerRecordId).toString()
    },
  }
}

</script>
