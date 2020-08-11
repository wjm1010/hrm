<template>
  <div class="dashboard-container approval-firstApproval">
    <search-from :list='searchList' :selectOptions='searchOptions' @click='getList' dateFormat='yyyy-MM-dd'/>
    <div class="fr">
      <el-button type="primary" @click="exporter">导出</el-button>
      <el-button type="primary" @click="exporterAll">全部导出</el-button>
    </div>
    <expand-table @selection-change-event="val=>selectedData = val" can-check-all-box="yes" :pagination="paging" @get-list="getList" :rows="list" :loading="loading" :columns="columns">
    </expand-table>
  </div>
</template>
<script>
import { searchTable } from '@/mixins'
export default {
  name: 'training-trainingSession',
  mixins: [searchTable],
  data() {
    return {
      searchApi: 'train_fullsearch',
      listApi: 'train_signList',
      searchList: [{
        title: '签到时间',
        type: 'datePicker',
        modelKey: 'resumeInfoSignDate',
        warp: true
      }, {
        title: '培训时间',
        type: 'datePicker',
        modelKey: 'resumeInfoTrainDate',
        warp: true
      }, {
        title: '教学部',
        type: 'select',
        modelKey: 'resumeTeachingDept',
        warp: true
      }, {
        title: '关键字',
        type: 'input',
        placeholder: '输入姓名',
        modelKey: 'keywords'
      }],
      selectedData: [],
      columns: [
        { 'value': 'resumeId', 'text': '编号' },
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'resumeTeachingDeptName', 'text': '教学部' },
        { 'value': 'resumeInterviewSubject', 'text': '学科' },
        { 'value': 'resumeGrade', 'text': '年级' },
        { 'value': 'resumeProperty', 'text': '职位' },
        { 'value': 'resumeSchool', 'text': '毕业院校' },
        { 'value': 'userName', 'text': '跟进HR' },
        { 'value': 'resumeInfoTrainDate', 'text': '培训日期' },
        { 'value': 'resumeInfoSignDate', 'text': '签到日期' },
      ],
    }
  },
  methods: {
    /**
     * 全部导出
     **/
    async exporterAll() {
      if (!Object.values(this.searchParams).some(t => !!t)) {
        this.$message.warning('搜索条件不能为空')
        return
      }
      const res = await this.$http.post('train_exportDataExecl', this.searchParams)
      if (!res) {
        this.$message.error(res.message)
        return
      }
      try {
        if (res.code === '0x000113') return
        window.open(res)
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 导出
     * @return {[type]} [description]
     */
    async exporter() {
      if (!this.selectedData.length) {
        this.$message.warning('请先勾选您需要导出的数据')
        return
      }
      const res = await this.$http.post('train_exportDataExecl', {
        idList: this.selectedData.map(t => t.resumeId).toString()
      })
      if (!res) {
        this.$message.error(res.message)
        return
      }
      try {
        if (res.code === '0x000113') return
        window.open(res)
      } catch (e) {
        console.log(e)
      }
    },
  }
}

</script>
