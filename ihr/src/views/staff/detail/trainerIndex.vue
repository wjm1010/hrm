<template>
  <div class="dashboard-container">
    <div v-loading="allLoading">
      <el-form :model="query" :rules="rules" ref="query" label-width="120px" inline>
        <el-form-item label="姓名：" prop="userName">
          <el-input v-model="query.userName"></el-input>
        </el-form-item><br>
        <el-form-item label="密码：" prop="userPwd" ref="userPwdName">
          <el-input v-model="query.userPwd" type="password"></el-input>
        </el-form-item><br>
        <el-form-item label="邮箱：" prop="userMail">
          <el-input v-model="query.userMail"></el-input>
        </el-form-item><br>
        <el-form-item label="状态：" prop="userStatus">
          <el-select v-model="query.userStatus" placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="权限名称：" prop="userPoser">
          <el-select v-model="query.userPoser" placeholder="请选择">
            <el-option
              v-for="item in options.roleList"
              :key="item.roleAuthId"
              :label="item.roleAuthName"
              :value="item.roleAuthId">
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
  name: 'trainerIndexAdd',
  data() {
    return {
      isCancearch: false,
      userId: this.$route.path !== '/staff/trainer/add' ? this.$route.params.userId : '',
      allLoading: false,
      query: {
        userName: '',
        userPwd: 'hfjy123',
        userMail: '',
        userStatus: '',
        userPoser: ''
      },
      options: {
        status: [],
        roleList: []
      },
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        userMail: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        userStatus: [
          { required: true, message: '请选择教学部', trigger: 'change' }
        ],
        userPoser: [
          { required: true, message: '请选择权限名称', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // api
    getInfo() {
      return this.$http.post('trainer_dataListOne', {
        userId: this.userId
      })
    },
    getOptions() {
      return this.$http.post('auth_getTrainerOption')
    },
    async init() {
      const option = await this.getOptions()
      if (option.data) {
        this.options.status = option.data.status
        this.options.roleList = option.data.roleList[8]
        if (this.userId) {
          this.getEditInfo()
          this.rules.userPwd[0].required = false
          setTimeout(() => {
            if (this.$refs['userPwdName']) {
              this.$refs['userPwdName'].clearValidate()
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
      this.$router.replace('/staff/trainer')
      if (!this.userId) {
        this.$refs[formName].resetFields()
        return this.$store.dispatch('delVisitedViews', { name: 'trainerIndexAdd', path: '/staff/trainer/add' })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isCancearch = true
          if (this.userId) {
            this.$http.post('trainer_dataUpdateOne', Object.assign({ userId: this.userId }, this.query)).then(res => {
              if (res.data) {
                this.removeRouter(formName)
                this.$message.success(res.message)
              }
            }).catch(console.log).finally(() => {
              this.isCancearch = false
            })
          } else {
            this.$http.post('trainer_roleInsert', this.query).then(res => {
              if (res.data) {
                this.removeRouter(formName)
                this.$message.success(res.message)
              }
            }).catch(console.log).finally(() => {
              this.isCancearch = false
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.removeRouter(formName)
    }
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

