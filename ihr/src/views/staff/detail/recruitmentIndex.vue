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
        <el-form-item label="坐席：" prop="userPhone">
          <el-input v-model="query.userPhone"></el-input>
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
        <el-form-item label="所属上级：" prop="userPid" v-if="query.userLevel!=='4'">
          <el-select v-model="query.userPid" placeholder="请选择">
            <el-option
              v-for="item in userPid"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="工作地点：" prop="userWorkArea">
          <el-select v-model="query.userWorkArea" placeholder="请选择">
            <el-option
              v-for="item in options.workPlace"
              :key="item.workPlaceId"
              :label="item.workPlaceName"
              :value="item.workPlaceId">
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
        <el-form-item label="QQ：" prop="userQQ">
          <el-input v-model="query.userQQ"></el-input>
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
  name: 'recruitmentIndexAdd',
  data() {
    return {
      isCancearch: false,
      userId: this.$route.path !== '/staff/recruitment/add' ? this.$route.params.userId : '',
      allLoading: false,
      query: {
        userName: '',
        userPwd: 'hfjy123',
        userMail: '',
        userPhone: '',
        userLevel: '',
        userPid: '',
        userWorkArea: '',
        userQQ: '',
        userPoser: ''
      },
      options: {
        roleLevel: [],
        workPlace: [],
        roleListNew: [],
        roleList: []
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
        userLevel: [
          { required: true, message: '请选择级别', trigger: 'change' }
        ],
        userPid: [
          { required: true, message: '请选择所属上级', trigger: 'change' }
        ],
        userWorkArea: [
          { required: true, message: '请选择工作地点', trigger: 'change' }
        ],
        userPoser: [
          { required: true, message: '请选择权限名称', trigger: 'change' }
        ],
        userQQ: [
          { required: true, message: '请输入QQ', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    // api
    getInfo() {
      return this.$http.post('hr_hrListOne', {
        userId: this.userId
      })
    },
    getOptions() {
      return this.$http.post('auth_getHrOption')
    },
    getLeve() {
      return this.$http.post('auth_getRoleLevelPid', {
        levelId: this.query.userLevel,
        roleId: '2'
      })
    },
    /*   methods   */
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
          this.getLeves()
        }
      }).catch(console.log)
    }, // 编辑带入的值
    removeRouter(formName) {
      this.$router.replace('/staff/recruitment')
      if (!this.userId) {
        this.$refs[formName].resetFields()
        return this.$store.dispatch('delVisitedViews', { name: 'recruitmentIndexAdd', path: '/staff/recruitment/add' })
      }
    }, // 关闭编辑新增路由
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isCancearch = true
          if (this.query.userLevel === '4') {
            this.$delete(this.query, 'userPid')
          }
          if (this.userId) {
            this.$http.post('hr_hrUpdateOne', this.query).then(res => {
              if (res.data) {
                this.removeRouter(formName)
                this.$message.success(res.message)
              }
            }).catch(console.log).finally(() => {
              this.isCancearch = false
            })
          } else {
            this.$http.post('hr_roleInsert', this.query).then(res => {
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

