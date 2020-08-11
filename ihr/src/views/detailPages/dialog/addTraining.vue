<template>
  <div>
    <el-dialog
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="el-dialog-md"
      :title="dialogTitle"
      @close="$emit('closeEv')">
        <el-form :rules="rules" :model="query" ref="query" label-width="120px">
          <el-form-item label="培训场次：" prop="trainRecordTimeId">
            <el-select v-model="query.trainRecordTimeId" style="width:300px" @change="changetrainManage">
              <el-option
                v-for="item in List"
                :key="item.trainManageId"
                :label="item.trainManageTrainStartTime"
                :value="item.trainManageId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="45px">
            QQ群号: <i style="margin-left:20px">{{query.trainManageQQ}}</i>
          </el-form-item>
          <el-form-item label-width="38px">
            预约人数: <i style="margin-left:20px">{{query.trainManageNum}}</i>
          </el-form-item>
          <el-form-item label-width="52px">
            <el-checkbox v-model="query.trainRecordIsMail" true-label="1">邮件通知候选人</el-checkbox>
            <a @click="lookEmail">预览邮件</a>
          </el-form-item>
          <el-form-item label-width="52px">
            <el-checkbox v-model="query.trainRecordIsMsg" true-label="1">短信通知候选人</el-checkbox>
            <a @click="lookMsg">预览短信</a>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="!isCanSearch" @click="submit('query')">确认提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="el-dialog-md"
      :loading="loading"
      @close="dialogVisible === false">
      <div v-html="message"></div>
    </el-dialog>
  </div>
</template>
<script>
export default{
  mounted() {
    this.dialogShow = true
  },
  data() {
    return {
      dialogShow: false,
      dialogVisible: false,
      isCanSearch: true,
      query: {
        trainRecordTimeId: '',
        trainManageCode: '',
        trainRecordIsMail: '',
        trainRecordIsMsg: '',
        trainManageQQ: '',
        trainManageNum: ''
      },
      loading: false,
      message: '',
      List: [],
      trainManageTime: '',
      rules: {
        trainRecordTimeId: [
          { required: true, message: '请选择培训场次', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    dialogTitle: {
      type: String,
      require: true
    },
    Name: {
      type: String
    },
    trainRecordResumeId: {
      type: String,
      require: true
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    getOption() {
      this.loading = true
      this.$http.post('resume_getTrainList', {
        resumeId: this.trainRecordResumeId
      }).then(res => {
        if (res.data) {
          this.List = res.data
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    },
    changetrainManage() {
      this.List.map(key => {
        if (key.trainManageId === this.query.trainRecordTimeId) {
          this.query.trainManageCode = key.trainManageCode
          this.query.trainManageQQ = key.trainManageQQ
          this.query.trainManageNum = key.trainManageNum
          this.trainManageTrainStartTime = key.trainManageTrainStartTime
        }
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isCanSearch = false
          const _query = Object.assign({ trainRecordResumeId: this.trainRecordResumeId }, this.query)
          if (this.dialogTitle === '添加培训') {
            this.$http.post('resume_addTrain', _query).then(res => {
              if (res.data) {
                this.$message.success(res.message)
                this.$emit('change-refresh-getlist')
                this.dialogShow = false
              }
            }).catch(console.log).finally(() => {
              this.isCanSearch = true
            })
          } else {
            this.$http.post('resume_addOfferTrain', _query).then(res => {
              if (res.data) {
                this.$message.success(res.message)
                this.$emit('change-refresh-getlist')
                this.dialogShow = false
              }
            }).catch(console.log).finally(() => {
              this.isCanSearch = true
            })
          }
        }
        return false
      })
    },
    lookEmail() {
      if (!this.query.trainRecordTimeId) {
        this.$message.warning('请先选择培训场次！')
        return false
      }
      this.$http.post('resume_offerpreviewMail', {
        resumeId: this.trainRecordResumeId,
        trainManageId: this.query.trainRecordTimeId,
        trainManageQQ: this.query.trainManageQQ ? this.query.trainManageQQ : '',
        trainManageNum: this.query.trainManageNum ? this.query.trainManageNum : '',
        trainManageCode: this.query.trainManageCode ? this.query.trainManageCode : ''
      }).then(res => {
        if (res.data) {
          this.dialogVisible = true
          this.message = res.data[0]
        }
      }).catch(console.log)
    }, // 预览邮件
    lookMsg() {
      if (!this.query.trainRecordTimeId) {
        this.$message.warning('请先选择培训场次，在预览短信！')
        return false
      }
      this.$alert(this.Name + '老师您好，恭喜您通过我司的考核，您将于' +
      this.trainManageTrainStartTime + '参加我司的培训，具体详情已发送到您的邮箱，请注意查收，谢谢！【海风教育】'
        , '短信模板', {
        showConfirmButton: false,
        center: true,
        callback: action => { return }
      })
    }
  }
}
</script>
