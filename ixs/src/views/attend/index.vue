<template>
  <div class="dashboard-container">
    <p class="attend-font-size">确认客户能否出席</p>
    <div class="top-border">
      <div class="content-height">
        <p class="font-pos">{{studentInfo.planStartTime}} {{studentInfo.teacherName}}老师的{{studentInfo.currPlanName}},{{studentInfo.studentName}}同学及家长能否出席？</p>
        <el-radio-group v-model="query.attend" @change="radioChange">
          <el-radio label="1" class="radio-padding">可以出席</el-radio><br>
          <el-radio label="2" class="radio-padding">需要调整试听课时间</el-radio><br>
          <el-radio label="3" class="radio-padding">需要取消试听课</el-radio><br>
        </el-radio-group>
        <div v-if="query.attend === '3'">
          <el-form :model="query" :rules="rules" ref="ruleForm">
            <el-form-item prop="reason">
              <el-select v-model="query.reason" clearable placeholder="请选择原因">
                <el-option
                  v-for="item in options.reason"
                  :key="item.key"
                  :label="item.val"
                  :value="item.val">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="mark">
              <el-input 
                v-model="query.mark"
                placeholder="请输入内容，最多300字"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5}"
                maxlength=300
                class="mark-width"></el-input>
            </el-form-item>
          </el-form>
        </div>   
      </div>

      <div class="footer-btn">
        <el-button @click="btnCancle">稍后确认</el-button>
        <el-button :type="query.btnType" class="btn-pos" @click="validateAttend">{{query.btnLabel}}</el-button>
      </div>
    </div>

    <DialogAdjustTime
      v-if="dialogShow"
      :dialogShow="dialogShow"
      :info='studentInfo'
      @cancle="changeDialogStatus">
    </DialogAdjustTime>    
  </div>
</template>
<script>
import DialogAdjustTime from '../../components/dialog/adjustTime'
import { mapGetters } from 'vuex'
export default {
  name: 'attend',
  components: {
    DialogAdjustTime
  },
  data() {
    return {
      query: {
        attend: '1',
        mark: '',
        btnLabel: '确认提交',
        btnType: 'primary',
        reason: ''
      },
      studentInfo: {},
      rosterId: '',
      options: {
        reason: [], // 取消试听课原因
      },
      dialogShow: false, // 调整时间弹窗
      rules: {
        reason: { required: true, message: '请选择取消原因', trigger: 'change' }
      }
    }
  },
  created() {
    this.getInfo()
    this.getReason()
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  methods: {
    getInfo() { // 获取基本信息
      this.rosterId = this.$route.params.rosterId
      this.$http.get('saleTask_lessonInfo', {
        params: {
          studentIntentionId: this.rosterId
        }
      }).then(res => {
        this.studentInfo = res.data
      }).catch(console.log)
    },
    getReason() { // 获取试听课取消原因
      this.$http.get('saleTask_auditionCancellationReason').then(res => {
        if (res.data) {
          this.options.reason = res.data
        }
      }).catch(console.log)
    },
    radioChange(val) {
      if (val === '3') {
        this.query.btnLabel = '确认取消试听课'
        this.query.btnType = 'danger'
      } else if (val === '2') {
        this.query.btnLabel = '跳转至更换时间页面'
        this.query.btnType = 'primary'
      } else {
        this.query.btnLabel = '确认提交'
        this.query.btnType = 'primary'
      }
    },
    btnCancle() { // 稍后确认
      this.$store.dispatch('delVisitedViews', { path: `/attend/index/${this.$route.params.rosterId}` }) // 删除路由标签
      this.$router.go(-1)
    },
    changeDialogStatus() {
      this.dialogShow = false
    },
    validateAttend() { // 三种状态点击确认触发不同提交事件
      const attend = this.query.attend
      if (!attend) return
      if (attend === '1') {
        this.confirmAttend()
        this.sumbit()
      } else if (attend === '2') {
        this.dialogShow = !this.dialogShow
      } else {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.cancleTask()
          }
        })
      }
    },
    cancleTask() { // 取消试听课
      this.$http.post('saleTask_cancelAudition', {
        lessonPlanId: this.studentInfo.lessonPlanId,
        orderId: this.studentInfo.orderId,
        contents: this.query.reason,
        note: this.query.mark
      }).catch(console.log).finally(() => {
        this.btnCancle()
      })
    },
    sumbit() { // 确认提交
      this.$http.post('saleTask_attendOptLog', {
        studentIntentionId: this.rosterId,
        type: '1',
        planStartTime: this.studentInfo.planStartTime,
        planEndTime: this.studentInfo.planEndTime,
        teacher: this.studentInfo.teacherId,
        curriculumPlanId: this.studentInfo.currPlanId,
        optUserId: this.userId
      }).catch(console.log).finally(() => {
        this.btnCancle()
      })
    },
    confirmAttend() { // 关闭出席确认事项和提示
      this.$http.post('saleTask_updateMatter', {
        studentIntentionId: this.rosterId
      }).catch(console.log)
    }
  }
}
</script>
<style lang="sass" scoped>
  @import '../../styles/attend/index'
</style>


