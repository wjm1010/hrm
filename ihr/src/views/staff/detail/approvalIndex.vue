<template>
  <div class="dashboard-container">
    <div v-loading="allLoading">
      <el-form :model="query" :rules="rules" ref="query" label-width="120px" inline>
        <el-form-item label="姓名：" prop="userName">
          <el-input v-model="query.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="userPwd" ref="userPwdName">
          <el-input v-model="query.userPwd" type="password"></el-input>
        </el-form-item><br>
        <el-form-item label="邮箱：" prop="userMail">
          <el-input v-model="query.userMail"></el-input>
        </el-form-item>
        <el-form-item label="教学部：" prop="userEducationDept">
          <el-select v-model="query.userEducationDept" placeholder="请选择">
            <el-option
              v-for="item in options.teachingDept"
              :key="item.teachingDeptId"
              :label="item.teachingDeptName"
              :value="item.teachingDeptId">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="级别：" prop="userLevel">
          <el-select v-model="query.userLevel" placeholder="请选择" @change="changeRole">
            <el-option
              v-for="item in options.roleLevel"
              :key="item.levelDictId"
              :label="item.levelDictName"
              :value="item.levelDictId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称：" prop="userPoser">
          <el-select v-model="query.userPoser" placeholder="请选择">
            <el-option
              v-for="item in options.roleListNew"
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
  name: 'approvalIndexAdd',
  data() {
    return {
      isCancearch: false,
      userId: this.$route.path !== '/staff/approval/add' ? this.$route.params.userId : '',
      allLoading: false,
      query: {
        userName: '',
        userPwd: 'hfjy123',
        userMail: '',
        userLevel: '',
        userEducationDept: '',
        userPoser: ''
      },
      options: {
        roleList: [],
        roleLevel: [],
        roleListNew: [],
        teachingDept: []
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
        userLevel: [
          { required: true, message: '请选择级别', trigger: 'change' }
        ],
        userEducationDept: [
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
      return this.$http.post('approval_dataListOne', {
        userId: this.userId
      })
    },
    getOptions() {
      return this.$http.post('auth_getApprovalOption')
    },
    async init() {
      const option = await this.getOptions()
      if (option.data) {
        this.options = option.data
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
    changeRole() {
      this.query.userPoser = ''
      if (this.query.userLevel) {
        this.options.roleListNew = this.options.roleList[this.query.userLevel]
      } else {
        this.options.roleListNew = []
      }
    },
    getEditInfo() {
      this.allLoading = true
      this.getInfo().then(res => {
        if (res.data) {
          this.query = res.data
          if (this.query.userLevel) {
            this.options.roleListNew = this.options.roleList[this.query.userLevel]
          }
        }
      }).catch(console.log).finally(() => {
        this.allLoading = false
      })
    }, // 编辑带入的值
    removeRouter(formName) {
      this.$router.replace('/staff/approval')
      if (!this.userId) {
        this.$refs[formName].resetFields()
        return this.$store.dispatch('delVisitedViews', { name: 'approvalIndexAdd', path: '/staff/approval/add' })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isCancearch = true
          if (this.userId) {
            this.$http.post('approval_dataUpdateOne', Object.assign({ userId: this.userId }, this.query)).then(res => {
              if (res.data) {
                this.removeRouter(formName)
                this.$message.success(res.message)
              }
            }).catch(console.log).finally(() => {
              this.isCancearch = false
            })
          } else {
            this.$http.post('approval_roleInsert', this.query).then(res => {
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

