<template>
  <div class="dashboard-container">
    <div v-loading="allLoading">
      <el-form :model="query" :rules="rules" ref="query" label-width="120px" inline>
        <el-form-item label="姓名：" prop="userName">
          <el-input v-model="query.userName"></el-input>
        </el-form-item><br>
        <el-form-item label="邮箱：" prop="userMail">
          <el-input v-model="query.userMail"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="userPwd" ref="userPwdName">
          <el-input v-model="query.userPwd" type="password"></el-input>
        </el-form-item><br>
        <el-form-item label="教学部：" prop="userEducationDept">
          <el-select v-model="query.userEducationDept" placeholder="请选择"  @change="changeGroup">
            <el-option
              v-for="item in options.teachingDept"
              :key="item.teachingDeptId"
              :label="item.teachingDeptName"
              :value="item.teachingDeptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教学组：" prop="userGroup">
          <el-select v-model="query.userGroup" placeholder="请选择" multiple collapse-tags>
            <el-option
              v-for="item in options.teachingDeptGroupList"
              :key="item.id"
              :label="item.value"
              :value="item.id">
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
        <el-form-item label="身份：" prop="userIdentity" v-if="query.userLevel==='1'">
          <el-select v-model="query.userIdentity" placeholder="请选择">
            <el-option
              v-for="item in options.teacherIdent"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="所属上级：" prop="userPid" v-if="query.userLevel==='1'">
          <el-select v-model="query.userPid" placeholder="请选择">
            <el-option
              v-for="item in userPid"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面试类型：" prop="userInterviewType">
          <el-select v-model="query.userInterviewType" placeholder="请选择">
            <el-option
              v-for="item in options.faceType"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item><br>
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
  name: 'interviewIndexAdd',
  data() {
    return {
      isCancearch: false,
      userId: this.$route.path !== '/staff/interview/add' ? this.$route.params.userId : '',
      allLoading: false,
      query: {
        userName: '',
        userPwd: 'hfjy123',
        userMail: '',
        userLevel: '',
        userGroup: [],
        userIdentity: '',
        userEducationDept: '',
        userPid: '',
        userPoser: '',
        userInterviewType: ''
      },
      options: {
        teachingDept: [],
        teachingDeptGroupList: [],
        roleLevel: [],
        teacherIden: [],
        faceType: [],
        roleList: [],
        roleListNew: []
      },
      userPid: [],
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
        userIdentity: [
          { required: true, message: '请选择身份', trigger: 'change' }
        ],
        userLevel: [
          { required: true, message: '请选择级别', trigger: 'change' }
        ],
        userPid: [
          { required: true, message: '请选择所属上级', trigger: 'change' }
        ],
        userEducationDept: [
          { required: true, message: '请选择教学部', trigger: 'change' }
        ],
        userGroup: [
          { required: true, message: '请选择教学组', trigger: 'change' }
        ],
        userInterviewType: [
          { required: true, message: '请选择面试类型', trigger: 'change' }
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
      return this.$http.post('interview_dataListOne', {
        userId: this.userId
      })
    },
    getOptions() {
      return this.$http.post('auth_getInterviewerOption')
    },
    getLeve() {
      return this.$http.post('auth_getRoleLevelPid', {
        levelId: this.query.userLevel,
        roleId: '4'
      })
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
    changeGroup() {
      this.query.userGroup = []
      if (this.query.userEducationDept) {
        this.options.teachingDeptGroupList = this.options.teachingDept.filter(t => t.teachingDeptId === this.query.userEducationDept)[0].teachingDeptGroupList
      } else {
        this.options.teachingDeptGroupList = []
      }
    },
    changeRole() {
      this.query.userPid = ''
      this.query.userPoser = ''
      this.getLeves()
    },
    getLeves() {
      this.allLoading = true
      if (this.query.userLevel) {
        this.getLeve().then(res => {
          if (res.data) {
            this.userPid = res.data
          }
        }).catch(console.log).finally(() => {
          this.allLoading = false
        })
        this.options.roleListNew = this.options.roleList[this.query.userLevel]
      }
    }, // 级别权限上级名称二级联动
    getEditInfo() {
      this.getInfo().then(res => {
        if (res.data) {
          this.query = res.data
          this.query.userGroup = res.data.userGroup.split(',')
          this.getLeves()
          if (this.query.userEducationDept) {
            this.options.teachingDeptGroupList = this.options.teachingDept.filter(t => t.teachingDeptId === this.query.userEducationDept)[0].teachingDeptGroupList
          }
        }
      }).catch(console.log)
    }, // 编辑带入的值
    removeRouter(formName) {
      this.$router.replace('/staff/interview')
      if (!this.userId) {
        this.$refs[formName].resetFields()
        return this.$store.dispatch('delVisitedViews', { name: 'interviewIndexAdd', path: '/staff/interview/add' })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isCancearch = true
          if (this.query.userLevel === '2') {
            this.$delete(this.query, 'userIdentity')
            this.$delete(this.query, 'userPid')
          }
          const _query = Object.assign({}, this.query)
          _query.userGroup = this.query.userGroup.toString()
          _query.userId = this.userId
          if (this.userId) {
            this.$http.post('interview_dataUpdateOne', _query).then(res => {
              if (res.data) {
                this.removeRouter(formName)
                this.$message.success(res.message)
              }
            }).catch(console.log).finally(() => {
              this.isCancearch = false
            })
          } else {
            this.$http.post('interview_roleInsert', _query).then(res => {
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

