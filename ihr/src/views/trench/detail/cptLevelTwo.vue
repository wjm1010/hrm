<template>
  <div class="dashboard-container">
    <div v-loading="allLoading">
      <el-form :model="query" :rules="rules" ref="query" label-width="120px" inline>
        <el-form-item label="渠道名称：" prop="channelName">
          <el-input v-model="query.channelName"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="channelPwd" ref="channelPwdName">
          <el-input v-model="query.channelPwd" type="password"></el-input>
        </el-form-item><br>
        <el-form-item label="联系方式：" prop="channelContact">
          <el-input v-model="query.channelContact"></el-input>
        </el-form-item>
        <el-form-item label="学校名称：" prop="channelSchool">
          <el-select
            v-model="query.channelSchool"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="RemoteMethod"
            :loading="allLoading">
            <el-option
              v-for="item in schoolIdOps"
              :key="item.schoolName"
              :label="item.schoolName"
              :value="item.schoolName">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="渠道跟进人：" prop="channelMan">
          <el-select v-model="query.channelMan" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in options.channelMan"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item>
          <el-button @click="resetForm('query')">取消</el-button>
          <el-button type="primary" @click="submitForm('query')" :disabled="isCancearch">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cooperationAccessAdd',
  data() {
    return {
      isCancearch: false,
      userId: this.$route.path !== '/trench/cooperation/accessAdd' ? this.$route.params.userId : '',
      allLoading: false,
      channelPid: this.$route.path === '/trench/cooperation/accessAdd' ? this.$route.query.channelPid : '',
      query: {
        channelMan: '',
        channelName: '',
        channelPwd: 'hfjy',
        channelSchool: '',
        channelContact: ''
      },
      options: {
        channelMan: []
      },
      rules: {
        channelName: [
          { required: true, message: '请输入渠道名称', trigger: 'change' }
        ],
        channelPwd: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      },
      schoolIdOps: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    // api
    getInfo() {
      return this.$http.post('channel_getChannelOne', {
        channelId: this.userId
      })
    },
    getOptions() {
      return this.$http.post('hr_getValidHR')
    },
    RemoteMethod(val) {
      if (val !== '') {
        this.allLoading = true
        setTimeout(() => {
          this.allLoading = false
          this.$http.post('public_schoolSearch', { schoolName: val }).then(res => {
            this.schoolIdOps = res.data
          }).catch(console.log)
        }, 200)
      } else {
        this.schoolIdOps = []
      }
    },
    async init() {
      const option = await this.getOptions()
      if (option.data) {
        this.options.channelMan = option.data
        if (this.userId) {
          this.getEditInfo()
          this.rules.channelPwd[0].required = false
          setTimeout(() => {
            if (this.$refs['channelPwdName']) {
              this.$refs['channelPwdName'].clearValidate()
            }
          }, 100)
        }
      } else {
        this.$router.replace('/401')
      }
    },
    getEditInfo() {
      this.allLoading = true
      this.getInfo().then(res => {
        if (res.data) {
          this.query = res.data
        }
      }).catch(console.log).finally(() => {
        this.allLoading = false
      })
    }, // 编辑带入的值
    removeRouter(formName) {
      if (!this.userId) {
        this.$refs[formName].resetFields()
        this.$store.dispatch('delVisitedViews', { name: 'cooperationAccessAdd', path: '/trench/cooperation/accessAdd' })
        this.$router.replace('/trench/cooperation')
      } else {
        this.$router.replace(`/trench/cooperationSub/${this.$route.query.id}`)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isCancearch = true
          this.$http.post('channel_secondAddUpdate', Object.assign({ channelPid: this.channelPid }, this.query)).then(res => {
            if (res.data) {
              this.removeRouter(formName)
              this.$message.success(res.message)
            }
          }).catch(console.log).finally(() => {
            this.isCancearch = false
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.removeRouter(formName)
    },
  }
}
</script>
<style lang="sass" scoped>
.el-input
  width: 200px
.el-button
  width: 150px
  margin: 30px
</style>

