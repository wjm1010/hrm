<template>
  <div class="dashboard-container interview-evaluation">
    <search-from :list='searchList' :selectOptions='searchOptions' @click='getList' dateFormat='yyyy-MM-dd' />
    <div class="fr">
      <el-button type="primary" @click="allPartTime()" v-if="userInterviewType == '0' || userInterviewType == '2'">批量评价兼职</el-button>
      <el-button type="primary" @click="$router.push('fullTime')" v-if="userInterviewType == '0' || userInterviewType == '1'">认领全职</el-button>
      <el-button type="primary" @click="$router.push('partTime')" v-if="userInterviewType == '0' || userInterviewType == '2'">认领兼职</el-button>
      <el-button @click="resumeBack" plain>退回</el-button>
    </div>
    <expand-table @selection-change-event="val=>selectedData = val" can-check-all-box="yes" :pagination="paging" @get-list="getList" :rows="list" :loading="loading" :columns="columns" :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="resumeVideoLink">
        {{scope.row.resumeVideoLink || scope.row.resumeInterviewDate}}
      </template>
      <template slot-scope="scope" slot="operating">
        <el-button type="text" size="small" class="actionItems" @click="toggleIsAssess(scope.row)">{{+scope.row.resumeIsAssess ? '已评价' : '评价'}}</el-button>
        <el-button type="text" size="small" class="actionItems" @click="$router.push(`/resume/look/${scope.row.id}`)">详情</el-button>
        <el-button type="text" size="small" class="actionItems"> <a :href="scope.row.resumeInfoAppendix" target="_blank" download>下载简历</a> </el-button>
      </template>
    </expand-table>
    <!-- 全职评价弹框 -->
    <dialog-from v-if='visible.fullTime' lableWidth='150px' :title='fullTimeTitle' btnTitle='添加评价' @click='saveFullTimeRecord' :list='dialogFullList' :selectOptions='dialogOptions' @close='closeFullTime' :groupDefalt='fullGroupDefalt'>
      <div class="dialog-result flex evenly" slot='head'>
        <el-button size="medium" @click='fullTimeDialogResChange(1)' :type="dialogFullParams.interviewerRecordResult ? 'success' : ''" plain icon="el-icon-success" :class="dialogFullParams.interviewerRecordResult ? 'act' : ''" class='btn-succ'>面试通过</el-button>
        <el-button size="medium" @click='fullTimeDialogResChange(0)' :type="!dialogFullParams.interviewerRecordResult ? 'success' : ''" plain icon="el-icon-error" :class="!dialogFullParams.interviewerRecordResult ? 'act' : ''" class='btn-reject'>面试不通过</el-button>
      </div>
    </dialog-from>
    <!-- 兼职评价弹框 -->
    <dialog-from v-if='visible.partTime' lableWidth='150px' title='兼职评价' btnTitle='添加评价' @click='savePartTimeRecord' @change='partTimeDialogResChange' :list='dialogPartList' :selectOptions='dialogOptions' @close='closePartTime' :groupDefalt='partGroupDefalt' :groupRule='groupRule' />
  </div>
</template>
<script>
import { searchTable, dialog } from '@/mixins'
import { getToken } from '@/utils/auth'
export default {
  name: 'interview-evaluation',
  mixins: [searchTable, dialog],
  data() {
    return {
      searchApi: 'interviewer_getRecordOption',
      listApi: 'interviewer_record',
      dialogApi: 'interviewer_getOptionRecordOption',
      // 搜索框列表
      searchList: [{
        title: '岗位类型',
        type: 'select',
        modelKey: 'resumeProperty',
        optionkey: 'propery'
      }, {
        title: '是否评价',
        type: 'select',
        modelKey: 'resumeIsAssess',
        optionkey: 'assess',
        model: '0',
        warp: true
      }, {
        title: '面试时间',
        type: 'date',
        modelKey: 'resumeInterviewDate'
      }, {
        title: '面试结果',
        type: 'select',
        modelKey: 'resumeResult',
        optionkey: 'result',
        warp: true
      }, {
        title: '关键字',
        type: 'input',
        placeholder: '搜索姓名/候选人编号',
        modelKey: 'keyword'
      }, {
        title: '搜索',
        type: 'btn',
      }],
      // 全职弹出层全部列表选项
      dialogFullList: [{
        title: '是否可以再次面试',
        type: 'radio',
        modelKey: 'interviewerRecordRetry',
        group: 'b',
        optionkey: 'retry'
      }, {
        title: '学术能力得分',
        type: 'select',
        modelKey: 'interviewerRecordScienceScore',
        group: ['a', 'b'],
        optionkey: 'score'
      }, {
        title: '授课能力得分',
        type: 'select',
        modelKey: 'interviewerRecordTeachingScore',
        group: ['a', 'b'],
        optionkey: 'score'
      }, {
        title: '逻辑表达能力得分',
        type: 'select',
        modelKey: 'interviewerRecordLogicScore',
        group: ['a', 'b'],
        optionkey: 'score'
      }, {
        title: '互动得分',
        type: 'select',
        modelKey: 'interviewerRecordInteractScore',
        group: ['a', 'b'],
        optionkey: 'score'
      }, {
        title: '应变得分',
        type: 'select',
        modelKey: 'interviewerRecordReactionScore',
        group: ['a', 'b'],
        optionkey: 'score'
      }, {
        title: '淘汰原因',
        type: 'select',
        modelKey: 'interviewerRecordOutReason',
        group: 'b',
        optionkey: 'qzReason'
      }, {
        required: false,
        title: '备注',
        modelKey: 'interviewerRecordNote',
        group: ['a', 'b'],
        type: 'textarea'
      }],
      fullGroupDefalt: 'a',
      partGroupDefalt: 'a',
      // 全职评价参数
      dialogFullParams: {
        interviewerRecordResult: '1',
        interviewerRecordResumeId: '',
        interviewerRecordFaceDate: '',
        interviewerRecordScienceScore: '',
        interviewerRecordTeachingScore: '',
        interviewerRecordLogicScore: '',
        interviewerRecordInteractScore: '',
        interviewerRecordReactionScore: '',
        interviewerRecordNote: '',
        interviewerRecordRetry: '',
        interviewerRecordOutReason: '',
        interviewerRecordPropery: ''
      },
      // 全职列表备份
      dialogFullListBack: [],
      // 全职参数备份
      dialogFullParamsBack: {},
      // 兼职弹框出传入列表
      dialogPartTimeList: [],
      // 兼职弹出层全部列表选项
      dialogPartList: [{
        title: '面试结果',
        type: 'radio',
        modelKey: 'interviewerRecordResult',
        group: ['a', 'b'],
        optionkey: 'pass'
      }, {
        title: '自我介绍得分',
        type: 'select',
        modelKey: 'interviewerRecordSelfScore',
        group: ['a', 'b'],
        optionkey: 'score'
      }, {
        title: '语言表达得分',
        type: 'select',
        modelKey: 'interviewerRecordLanguageScore',
        group: ['a', 'b'],
        optionkey: 'score'
      }, {
        title: '授课逻辑得分',
        type: 'select',
        modelKey: 'interviewerRecordLogicScore',
        group: ['a', 'b'],
        optionkey: 'score'
      }, {
        title: '淘汰原因',
        type: 'select',
        modelKey: 'interviewerRecordOutReason',
        group: 'b',
        optionkey: 'otherReason'
      }, {
        title: '重新录制周期',
        type: 'radio',
        modelKey: 'interviewerRecordRecording',
        group: 'b',
        optionkey: 'recording'
      }, {
        title: '视频包含',
        type: 'checkbox',
        modelKey: 'interviewerRecordInclude',
        group: ['a', 'b'],
        optionkey: 'include'
      }, {
        required: false,
        title: '备注',
        modelKey: 'interviewerRecordNote',
        group: ['a', 'b'],
        type: 'textarea'
      }],
      groupRule: [{
        req: {
          interviewerRecordResult: '0'
        },
        res: 'b'
      }, {
        req: {
          interviewerRecordResult: '1'
        },
        res: 'a'
      }],
      dialogPartListBack: [],
      dialogPartParamsBack: {},
      // 兼职评价参数
      dialogPartParams: {
        interviewerRecordResult: '1',
        interviewerRecordSelfScore: '',
        interviewerRecordLanguageScore: '',
        interviewerRecordLogicScore: '',
        interviewerRecordInclude: '',
        interviewerRecordResumeId: '',
        interviewerRecordFaceDate: '',
        interviewerRecordOutReason: '',
        interviewerRecordRetry: '',
        interviewerRecordRecording: '',
        interviewerRecordNote: ''
      },
      userInterviewType: getToken('user_info') && JSON.parse(getToken('user_info')).userInterviewType,
      visible: {
        fullTime: false,
        partTime: false
      },
      resumeId: [],
      slotNameArr: ['resumeVideoLink', 'operating'],
      columns: [
        { 'value': 'resumeId', 'text': '编号' },
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'resumeInterviewSubject', 'text': '面试科目' },
        { 'value': 'resumeGrade', 'text': '面试年级' },
        { 'value': 'resumeProperty', 'text': '岗位性质' },
        { 'value': 'resumeVideoLink', 'text': '面试时间/视频地址', width: 300 },
        { 'value': 'userName', 'text': '跟进人' },
        { 'value': 'operating', 'text': '操作', width: 200 }
      ]
    }
  },
  created() {
    this.backParams()
  },
  methods: {
    /**
     * 退回
     * @return {[type]} [description]
     */
    async resumeBack() {
      if (!this.selectedData.length) {
        this.$message.warning('请先勾选您需要退回的数据')
        return
      }
      const res = await this.$http.post('interviewer_resumeBack', { resumeId: this.selectedData.map(t => t.resumeId).toString() })
      this.$message[res.data ? 'success' : 'error'](res.message)
      this.paging.page = 1
      this.getList()
    },
    /**
     * 保存全职评价
     */
    async saveFullTimeRecord(params) {
      Object.assign(this.dialogFullParams, params)
      const res = await this.$http.post('interviewer_saveFullTimeRecord', this.dialogFullParams)
      this.$message[res.data ? 'success' : 'error'](res.message)
      this.paging.page = 1
      this.getList()
    },
    /**
     * 保存兼职评价
     */
    async savePartTimeRecord(params) {
      Object.assign(this.dialogPartParams, params)
      this.dialogPartParams.interviewerRecordInclude = this.dialogPartParams.interviewerRecordInclude.toString()
      const res = await this.$http.post('interviewer_savePartTimeRecord', this.dialogPartParams)
      this.$message[res.data ? 'success' : 'error'](res.message)
      this.paging.page = 1
      this.getList()
    },
    /**
     * 获取弹出层的回调
     * @return {[type]} [description]
     */
    getOptionRecordOptionCb() {
      // 多加个通过选项,后台没有返回
      this.dialogOptions.pass = [{ 'id': '1', 'value': '通过' }, { 'id': '0', 'value': '不通过' }]
    },
    /**
     * 全职弹框判断，返回不同的选择框
     * @param  {[type]} bool []
     * @return {[type]}      [description]
     */
    fullTimeDialogResChange(bool) {
      this.dialogFullParams.interviewerRecordResult = bool
      this.fullGroupDefalt = bool ? 'a' : 'b'
    },
    /**
     * 兼职弹框判断，返回不同的选择框
     * @param  {[type]} bool []
     * @return {[type]}      [description]
     */
    partTimeDialogResChange(val) {
      if (typeof val !== 'string') {
        Object.assign(this.dialogPartParams, val)
      }
    },
    /**
     * 全部评价兼职
     **/
    allPartTime() {
      if (!this.list.length) {
        this.$message.info('暂无待评价的兼职候选人')
        return
      }
      this.visible.partTime = true
      this.fullTimeTitle = '兼职评价'
      this.dialogPartParams.interviewerRecordResumeId = 'all'
    },
    /**
     * 已评价与未评价
     * @param  {boole} item 行内信息
     **/
    toggleIsAssess(item) {
      if (+item.resumeIsAssess) {
        this.$message.warning('已评价，无需再评')
        return
      }
      const isFullTime = item.resumeProperty === '全职'
      const isShixi = item.resumeProperty === '实习'
      this.visible[(isFullTime || isShixi) ? 'fullTime' : 'partTime'] = true
      if (isFullTime || isShixi) {
        this.fullTimeTitle = isFullTime ? '全职评价' : '实习评价'
        this.dialogFullParams.interviewerRecordPropery = item.resumeProperty
        this.dialogFullParams.interviewerRecordResumeId = item.resumeId
        this.dialogFullParams.interviewerRecordFaceDate = item.resumeInterviewDate
        this.fullTimeDialogResChange(1)
        return
      }
      this.dialogPartParams.interviewerRecordPropery = item.resumeProperty
      this.dialogPartParams.interviewerRecordResumeId = item.resumeId
      this.dialogPartParams.interviewerRecordFaceDate = item.resumeInterviewDate
      this.partTimeDialogResChange('1')
    },
    /**
     * 备份参数
     * @return {[type]} [description]
     */
    backParams() {
      this.dialogFullListBack = this.$cloneParams(this.dialogFullList)
      this.dialogPartListBack = this.$cloneParams(this.dialogPartList)
      this.dialogFullParamsBack = this.$cloneParams(this.dialogFullParams)
      this.dialogPartParamsBack = this.$cloneParams(this.dialogPartParams)
    },
    /**
     * 清楚全职参数
     * @return {[type]} [description]
     */
    closeFullTime() {
      this.dialogFullList = this.$cloneParams(this.dialogFullListBack)
      this.dialogFullParams = this.$cloneParams(this.dialogFullParamsBack)
      this.visible.fullTime = false
    },
    /**
     * 清楚兼职参数
     * @return {[type]} [description]
     */
    closePartTime() {
      this.dialogPartList = this.$cloneParams(this.dialogPartListBack)
      this.dialogPartParams = this.$cloneParams(this.dialogPartParamsBack)
      this.visible.partTime = false
    }
  }
}

</script>
<style scoped>
.dialog-result {
  margin-bottom: 20px
}

.btn-reject {
  background: #fff;
  border: none;
  background: #f2f2f2;
  color: #8a8a8a;
}

.btn-succ {
  background: #fff;
  border: none;
  background: #f2f2f2;
  color: #00fa52;
}

.btn-reject:hover,
.btn-reject:active,
.btn-reject:focus {
  color: #fff;
  background: #8a8a8a;
}

.btn-succ:hover,
.btn-succ:active,
.btn-succ:focus {
  color: #fff;
  background: #00fa52;
}

.btn-reject.act {
  border: 1px solid #8a8a8a;
}

.btn-succ.act {
  border: 1px solid #00fa52;
}

</style>
