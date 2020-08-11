<template>
  <div class="dashboard-container interview-scheduling-detail">
  	<section class="head">
  		<p><span>姓名：{{userInfo.userName}}</span><span>学科：{{userInfo.userSubject}}</span><span>教学部：{{userInfo.teachingDeptName}}</span><span>邮箱：{{userInfo.userMail}}</span></p>
  	</section>
    <section class="option">
    	<el-checkbox v-model="checkedAll" @change='checkedAllFn'>全部选中</el-checkbox>
	    <div class="fr">
	      <el-button type="primary" @click="update(1)">启用</el-button>
	      <el-button type="primary" @click="update(2)">禁用</el-button>
	      <el-button type="success" @click="update()" >调整人数</el-button>
	    </div>
    </section>
   	<section class="list">
   		<table
       v-loading="loading"
      >
   			<thead>
   				<tr>
   					<td>总数（已安排人数）</td>
   					<td>周一</td>
   					<td>周二</td>
   					<td>周三</td>
   					<td>周四</td>
   					<td>周五</td>
   					<td>周六</td>
   					<td>周日</td>
   				</tr>
   			</thead>
   			<tbody>
				<tr v-for='(i, index) in list'>
	   				<td>
	   					<span>{{i.interviewerSchedulerKey}}</span>
	   				</td>
	   				<td v-for='j in 7' :class=" !!i[`act${j}`] ? 'act' : (!+i[`interviewerSchedulerStatus${j}`] ? 'dis' : '') " @click='choose(i, index, j)' ref='item'>
	   					<span v-if='i[`interviewerSchedulerCount${j}`] && +i[`interviewerSchedulerStatus${j}`]'>{{i[`interviewerSchedulerNum${j}`]}}（{{i[`interviewerSchedulerCount${j}`]}}）</span>
              <span v-if='!+i[`interviewerSchedulerStatus${j}`]'>已禁用</span>
	   				</td>
            <!-- <td :class="+i.interviewerSchedulerStatus1 ? 'dis' : (!!i.act1 ? 'act' : '')" @click='choose(i, index, 1)'>
              <span v-if='i.interviewerSchedulerCount1 && !+i.interviewerSchedulerStatus1'>{{i.interviewerSchedulerCount1}}（{{i.interviewerSchedulerNum1}}）</span>
              <span v-if='+i.interviewerSchedulerStatus1'>已禁用</span>
            </td>
	   				<td :class="+i.interviewerSchedulerStatus2 ? 'dis' : (!!i.act2 ? 'act' : '')" @click='choose(i, index, 2)'>
	   					<span v-if='i.interviewerSchedulerCount2 && !+i.interviewerSchedulerStatus2'>{{i.interviewerSchedulerCount2}}（{{i.interviewerSchedulerNum2}}）</span>
              <span v-if='+i.interviewerSchedulerStatus2'>已禁用</span>
	   				</td>
	   				<td :class="+i.interviewerSchedulerStatus3 ? 'dis' : (!!i.act3 ? 'act' : '')" @click='choose(i, index, 3)'>
	   					<span v-if='i.interviewerSchedulerCount3 && !+i.interviewerSchedulerStatus3'>{{i.interviewerSchedulerCount3}}（{{i.interviewerSchedulerNum3}}）</span>
              <span v-if='+i.interviewerSchedulerStatus3'>已禁用</span>
	   				</td>
	   				<td :class="+i.interviewerSchedulerStatus4 ? 'dis' : (!!i.act4 ? 'act' : '')" @click='choose(i, index, 4)'>
	   					<span v-if='i.interviewerSchedulerCount4 && !+i.interviewerSchedulerStatus4'>{{i.interviewerSchedulerCount4}}（{{i.interviewerSchedulerNum4}}）</span>
              <span v-if='+i.interviewerSchedulerStatus4'>已禁用</span>
	   				</td>
	   				<td :class="+i.interviewerSchedulerStatus5 ? 'dis' : (!!i.act5 ? 'act' : '')" @click='choose(i, index, 5)'>
	   					<span v-if='i.interviewerSchedulerCount5 && !+i.interviewerSchedulerStatus5'>{{i.interviewerSchedulerCount5}}（{{i.interviewerSchedulerNum5}}）</span>
              <span v-if='+i.interviewerSchedulerStatus5'>已禁用</span>
	   				</td>
	   				<td :class="+i.interviewerSchedulerStatus6 ? 'dis' : (!!i.act6 ? 'act' : '')" @click='choose(i, index, 6)'>
	   					<span v-if='i.interviewerSchedulerCount6 && !+i.interviewerSchedulerStatus6'>{{i.interviewerSchedulerCount6}}（{{i.interviewerSchedulerNum6}}）</span>
              <span v-if='+i.interviewerSchedulerStatus6'>已禁用</span>
	   				</td>
	   				<td :class="+i.interviewerSchedulerStatus7 ? 'dis' : (!!i.act7 ? 'act' : '')" @click='choose(i, index, 7)'>
	   					<span v-if='i.interviewerSchedulerCount7 && !+i.interviewerSchedulerStatus7'>{{i.interviewerSchedulerCount7}}（{{i.interviewerSchedulerNum7}}）</span>
              <span v-if='+i.interviewerSchedulerStatus7'>已禁用</span>
	   				</td> -->
	   			</tr>
   			</tbody>
   		</table>
   	</section>
    <el-dialog
      center
      custom-class="el-dialog-mi"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div slot="footer" class="dialog-footer">
        <h2>最大面试人数调整为</h2>
        <el-select v-model="updateQuery.interviewerSchedulerNum" clearable filterable placeholder="请选择调整" class='dialog-select'>
          <el-option
            v-for="i in 10" :key="i" :label="i" :value="i">
          </el-option>
        </el-select>
        <div class="dialog-footer">
          <el-button @click='dialogVisible=!dialogVisible'>取消</el-button>
          <el-button type="primary" @click="update(3)">确认修改</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { arrUpdate } from '@/lib/array'
export default {
  name: 'interview-scheduling-detail',
  data() {
    return {
      checkedAll: false,
      userInfo: {},
      isFullTime: false,
      visible: {
        fullTime: false,
        partTime: false
      },
      partTime: {
        pass: false,
        study: '',
        class: '',
        logic: '',
        lv: '',
        reason: '',
        time: '',
        checkList: [],
        remarks: ''
      },
      pass: false,
      fullTime: {
        result: true,
        hasChange: true,
        study: '',
        class: '',
      },
      dialogVisible: false,
      loading: false,
      cellMaxLength: 0,
      disCellList: 0,
      query: {
        interviewerId: this.$route.params.userId || '',
      },
      updateQuery: {
        interviewerId: this.$route.params.userId || '',
        interviewerSchedulerId: [],
        interviewerSchedulerType: '',
        interviewerSchedulerNum: ''
      },
      options: {
        propery: [],
        assess: [],
        result: []
      },
      isCanSearch: true,
      list: [],
      selectedData: [],
      dialogOptions: {},
      dialogShow: false
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    /**
     * 获取列表
     * @return {[type]} [description]
     */
    async getList() {
      this.isCanSearch = false
      this.loading = true
      const res = await this.$http.post('interviewer_getInterviewerScheduler', this.query, { paging: this.paging, isFilterUrl: true })
      this.loading = false
      this.isCanSearch = true
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      if (!res.data.timeList.length) {
        this.$message.warning('没有符合条件的数据')
        this.list = []
        return
      }
      this.list = res.data.timeList.map(t => {
        let i = 8
        while (i--) {
          // 默认单元格没有高亮
          t[`act${i}`] = false
          // 算可点击单元格总数
          // if (+t[`interviewerSchedulerStatus${i}`]) {
          //   this.cellMaxLength++
          // }
        }
        return t
      })
      this.cellMaxLength = this.list.length * 7
      this.userInfo = res.data.userInfo
    },
    /**
     * 启用、禁用和调整人数
     * @param  {[string]} type 1: 启用，2禁用，3调整人数 无类型表示调整人数
     * @return {[type]}      [description]
     */
    async update(type) {
      if (!this.updateQuery.interviewerSchedulerId.length && this.updateQuery.interviewerSchedulerId !== 'all') {
        this.$message.error('请先选择相应的时间段')
        return
      }
      // 有禁用的选项不可调整
      if (this.disCellList && !type) {
        this.$message.error('已禁用的不可调整，请重新选择')
        return
      }
      // 没有类型显示调整人数
      if (!type) {
        this.dialogVisible = true
        return
      }
      this.updateQuery.interviewerSchedulerType = type
      this.updateQuery.interviewerSchedulerId = this.updateQuery.interviewerSchedulerId.toString()
      if (!this.updateQuery.interviewerSchedulerNum && type === 3) {
        this.$message.error('请调整最大面试人数')
        return
      }
      const res = await this.$http.post('interviewer_changeInterviewerScheduler', this.updateQuery, { isFilterUrl: true })
      this.$message[res.data ? 'success' : 'error'](res.message)
      // 重置数据
      this.dialogVisible = false
      this.checkedAll = false
      this.checkedAllFn(false)
      this.updateQuery.interviewerSchedulerId = []
      this.updateQuery.interviewerSchedulerNum = ''
      this.cellMaxLength = 0
      this.disCellList = 0
      this.getList()
    },
    /**
     * 选择单元格
     * @param  {[type]} item  单元格数据
     * @param  {[type]} index 当前行
     * @param  {[type]} col   当前列
     * @return {[type]}       [description]
     */
    choose(item, index, col) {
      this.$nextTick(() => {
        const dom = this.$refs.item[index * 7 + col - 1]
        const domeclass = Array.from(dom.classList)
        if (!+item[`interviewerSchedulerStatus${col}`] && domeclass.includes('act')) {
          this.disCellList--
          dom.setAttribute('class', 'dis')
        }
        if (!+item[`interviewerSchedulerStatus${col}`] && domeclass.includes('dis')) {
          this.disCellList++
          dom.setAttribute('class', 'act')
        }
        // 如果已经全选过了，重新开始洗牌
        if (typeof this.updateQuery.interviewerSchedulerId === 'string') {
          this.updateQuery.interviewerSchedulerId = []
          this.checkedAll = false
          this.checkedAllFn(false)
        }
        // 更新高亮显示和数组
        this.list[index]['act' + col] = !this.list[index]['act' + col]
        arrUpdate(this.updateQuery.interviewerSchedulerId, item[`interviewerSchedulerId${col}`])
        // 相当于全选做全选的逻辑
        if (this.updateQuery.interviewerSchedulerId.length === this.cellMaxLength) {
          this.checkedAll = true
          this.checkedAllFn(true)
        }
      })
    },
    /**
     * 全选
     * @return {[type]} [description]
     */
    checkedAllFn(bool) {
      this.updateQuery.interviewerSchedulerId = bool ? 'all' : []
      this.list.forEach(t => { t.act1 = t.act2 = t.act3 = t.act4 = t.act5 = t.act6 = t.act7 = bool })
    }
  },
}
</script>
<style type="text/css">
  .interview-scheduling-detail tr:nth-child(4){
      border-bottom: 50px solid #ccc
  }
  .interview-scheduling-detail tr td{
    cursor: pointer
  }
</style>
<style lang="sass" scoped>
.dialog-claim-title, .dialog-claim-tip
  text-align: center!important
.dialog-select
  margin-bottom: 50px
.interview-scheduling-detail
	.head
		padding-bottom: 30px
		span
			margin-right: 50px
	.option
		background: #fff
		height: 50px
		padding: 30px 20px 60px
	table
		width: 100%
		border: 1px solid #ccc
		background: #fff
		border-spacing: 0
		thead
			td
				border-top: none
				background: #fffe9f
				&:first-child
					background: none
		tr
			display: flex
		td
			flex: 1
      cursor: pointer
			display: flex
			height: 50px
			line-height: 50px
			border-top: 1px solid #ccc
			border-left: 1px solid #ccc
			justify-content: center
			&.act
				background: #d0e7fe!important
			&.dis
        color: #fff
        background: #ccc
			&::first-child
				border-left: none
</style>
