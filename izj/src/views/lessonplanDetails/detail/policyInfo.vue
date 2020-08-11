<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-loading="loading">
    <div class="operationBtn">
      <el-button type="primary" @click="edit" v-if="strategiesDetails.status_name === '待提交' || strategiesDetails.status_name=== '已驳回'">编辑</el-button>
      <el-button type="danger" @click="deleteInfo" v-if="strategiesDetails.status_name === '待提交'">删除</el-button>
      <el-button type="info" plain @click="goBack">返回</el-button>
    </div>
    <div>
      <h4 style="display:inline-block">正式课设班单详情</h4>
      <span v-if="type"
        :class="{'orange':type === '2','blue':type === '1'}"
        style="display:inline-block;font-size: 12px;padding: 4px 7px;border-radius: 3px">
        <b v-if="type==='1'">正常排课</b>
        <b v-else>拓科</b>
      </span>
    </div>
    <el-row class="body">
      <ul class="body-row" v-if="strategiesDetails.strategy_no || strategiesDetails.status_name || strategiesDetails.emergency_degree_name">
        <li class="body-column width-20" v-if="strategiesDetails.strategy_no">
          <span class="label">正式课设班单编号</span>
          <span class="text">{{strategiesDetails.strategy_no}}</span>
        </li>
        <li class="body-column width-33" v-if="strategiesDetails.status_name">
          <span class="label">状态</span>
          <span class="text">{{strategiesDetails.status_name}}</span>
        </li>
        <li class="body-column width-other" v-if="strategiesDetails.emergency_degree_name">
          <span class="label">紧急度</span>
          <span class="text">{{strategiesDetails.emergency_degree_name}}</span>
        </li>
      </ul>

      <ul class="body-row" v-if="strategiesDetails.studentName || strategiesDetails.student_no || strategiesDetails.studentPhone">
        <li class="body-column width-20" v-if="strategiesDetails.studentName">
          <span class="label">学生姓名</span>
          <span class="text">{{strategiesDetails.studentName}}</span>
        </li>
        <li class="body-column width-33" v-if="strategiesDetails.student_no">
          <span class="label">学生编号</span>
          <span class="text">{{strategiesDetails.student_no}}</span>
        </li>
        <li class="body-column width-other" v-if="strategiesDetails.studentPhone">
          <span class="label">学生电话</span>
          <span class="text">{{strategiesDetails.studentPhone}}</span>
        </li>
      </ul>

      <ul class="body-row" v-if="strategiesDetails.contract_type_name || strategiesDetails.platoon_period">
        <li class="body-column width-20" v-if="strategiesDetails.contract_type_name">
          <span class="label">课时类型</span>
          <span class="text">{{strategiesDetails.contract_type_name}}</span>
        </li>
        <li class="body-column width-70" v-if="strategiesDetails.platoon_period">
          <span style="margin-right:30px">（创建设班单时）剩余可排课时</span>
          <span class="text">{{strategiesDetails.platoon_period}}</span>
        </li>
      </ul>

      <ul class="body-row" v-if="strategiesDetails.both_is_confirmed || strategiesDetails.is_appoint_teacher_name || strategiesDetails.teacher_name || strategiesDetails.recommendTeacherName">
        <li class="body-column width-20" v-if="strategiesDetails.both_is_confirmed">
          <span class="label">双方是否确认</span>
          <span class="text">{{strategiesDetails.both_is_confirmed}}</span>
        </li>
        <li class="body-column width-33" v-if="strategiesDetails.is_appoint_teacher_name">
          <span class="label">是否指定教师</span>
          <span class="text">{{strategiesDetails.is_appoint_teacher_name}}</span>
        </li>
        <li class="body-column width-other" v-if="strategiesDetails.teacher_name">
          <span class="label">指定教师</span>
          <span class="text" style="color:#0099FF;font-weight:bold">{{strategiesDetails.teacher_name}}</span>
        </li>
        <li class="body-column width-other" v-if="strategiesDetails.recommendTeacherName">
          <span class="label">推荐教师</span>
          <span class="text" style="color:#0099FF;font-weight:bold">{{strategiesDetails.recommendTeacherName}}</span>
        </li>
      </ul>
      
      <ul class="body-row" v-if="strategiesDetails.teacherSexName || strategiesDetails.instruction_type">
        <li class="body-column width-20" v-if="strategiesDetails.teacherSexName">
          <span class="label">性别要求</span>
          <span class="text">{{strategiesDetails.teacherSexName}}</span>
        </li>
        <li class="body-column width-70" v-if="strategiesDetails.instruction_type">
          <span class="label">授课风格</span>
          <span class="text">{{strategiesDetails.instruction_type}}</span>
        </li>
      </ul>

      <ul class="body-row" v-if="strategiesDetails.subject_name || strategiesDetails.curr_plan_name || strategiesDetails.version_name">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        <li class="body-column width-20" v-if="strategiesDetails.subject_name">
          <span class="label">申请学科</span>
          <span class="text">{{strategiesDetails.subject_name}}</span>
        </li>
        <li class="body-column width-33" v-if="strategiesDetails.curr_plan_name">
          <span class="label">课程名称</span>
          <span class="text">{{strategiesDetails.curr_plan_name}}</span>
        </li>
        <li class="body-column width-other" v-if="strategiesDetails.version_name">
          <span class="label">课程版本</span>
          <span class="text">{{strategiesDetails.version_name}}</span>
        </li>
      </ul>

      <div v-if="isOrderly">
        <ul class="body-row" v-if="strategiesDetails.is_sort_name || strategiesDetails.frequency_name || strategiesDetails.single_class_length">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
          <li class="body-column width-20" v-if="strategiesDetails.is_sort_name">
            <span class="label">是否有规律</span>
            <span class="text">{{strategiesDetails.is_sort_name}}</span>
          </li>
          <li class="body-column width-33" v-if="strategiesDetails.frequency_name">
            <span class="label">接受频次</span>
            <span class="text">{{strategiesDetails.frequency_name}}</span>
          </li>
          <li class="body-column width-other" v-if="strategiesDetails.single_class_length">
            <span class="label">单次时长</span>
            <span class="text">{{strategiesDetails.single_class_length}}</span>
          </li>
        </ul>
      </div>

      <ul class="body-row" v-if="isOrderly === false && strategiesDetails.is_sort_name">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        <li class="body-column width-100">
          <span class="label">是否有规律</span>
          <span class="text">{{strategiesDetails.is_sort_name}}</span>
        </li>
      </ul>

      <ul class="body-row" v-if="strategiesDetails.actual_period || strategiesDetails.lesson_start_time || strategiesDetails.lesson_end_time || strategiesDetails.first_lesson_time">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        <li class="body-column width-20" v-if="strategiesDetails.actual_period">
          <span class="label">实际申请课时</span>
          <span class="text">{{strategiesDetails.actual_period}}</span>
        </li>
        <li class="body-column width-33" v-if="strategiesDetails.lesson_start_time && strategiesDetails.lesson_end_time">
          <span class="label">排课日期</span>
          <span class="text">{{strategiesDetails.lesson_start_time.substring(0,10)}}</span>至
          <span class="text">{{strategiesDetails.lesson_end_time.substring(0,10)}}</span>
        </li>
        <li class="body-column width-other" v-if="strategiesDetails.first_lesson_time">
          <span class="label">排课首课时间</span>
          <span class="text">{{strategiesDetails.first_lesson_time}}</span>
        </li>
      </ul>

      <ul class="body-row" v-if="strategiesDetails.platoon_time && strategiesDetails.platoon_time.length !== 0">
        <li class="body-column width-100">
          <span class="label">可排时间</span>
          <span class="text" v-for = "(item,index) in strategiesDetails.platoon_time" :key="index" style="margin-right:20px">{{item}}</span>
        </li>
      </ul>

      <ul class="body-row" v-if="strategiesDetails.remark">
        <li class="body-column width-100">
          <span class="label">备注</span>
          <span class="text">{{strategiesDetails.remark}}</span>
        </li>
      </ul>

      <ul class="body-row" v-if="strategiesDetails.deal_user_name || strategiesDetails.last_deal_time">
        <li class="body-column width-20" v-if="strategiesDetails.deal_user_name">
          <span class="label">处理教务</span>
          <span class="text">{{strategiesDetails.deal_user_name}}</span>
        </li>
        <li class="body-column width-70" v-if="strategiesDetails.last_deal_time">
          <span class="label">处理日期</span>
          <span class="text">{{strategiesDetails.last_deal_time}}</span>
        </li>
      </ul>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'policyInfo',
    props: {
      isOrderly: {
        type: Boolean,
        required: false
      },
      strategyId: {
        required: true
      },
      type: {
        required: true
      }
    },
    data() {
      return {
        strategiesDetails: {},
        platoonTime: [],
        loading: true
      }
    },
    computed: {
    },
    filters: {
  
    },
    mounted() {
    },
    created() {
      this.getStrategiesInfo()
    },
    methods: {
      getStrategiesInfo() {
        this.$http.get('courseApplication_strategiesInfo', {
          params: {
            strategyId: this.strategyId
          }
        }).then((res) => {
          if (res.data) {
            this.strategiesDetails = res.data
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      }, // 获取信息
      goBack() {
        this.$router.push('/lessonplanorder/formal')
      }, // 返回
      edit() {
        let adress = ''
        this.type === '1' ? adress = '/newLesson/edit/' : adress = '/expandLesson/edit/'
        this.$router.push({ path: `${adress}${this.strategyId}`, query: {
          studentIntentionId: this.strategiesDetails.student_intention_id,
          studentName: this.strategiesDetails.studentName,
          studentNo: this.strategiesDetails.student_no
        }})
      }, // 编辑
      deleteInfo() {
        this.$confirm('删除后该设班单不存在，确认删除此设班单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('courseApplication_delStrategy', {
            strategyId: this.strategyId
          }).then(res => {
            if (res.data) {
              this.$message.success('操作成功')
              this.$router.replace('/lessonplanorder/formal')
              if (this.isOrderly === false && this.strategiesDetails.is_sort_name) {
                return this.$store.dispatch('delVisitedViews', { name: 'lessonplanDetailsunorderDetails', path: '/lessonplanDetails/unorderDetails' })
              } else {
                return this.$store.dispatch('delVisitedViews', { name: 'lessonplanDetailspolicyDetails', path: '/lessonplanDetails/policyDetails' })
              }
            }
          }).catch(console.log)
        }).catch(() => { return })
      } // 删除
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/lessonplanDetails/detail/policyInfo.sass'
</style>
