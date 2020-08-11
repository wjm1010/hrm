<template>
  <div class="dashboard-container">
    <div v-loading="allLoading">
      <el-form :model="query" :rules="rules" ref="query" label-width="120px" inline>
        <el-form-item label="渠道名称：" prop="channelName">
          <el-input v-model="query.channelName"></el-input>
        </el-form-item><br>
        <el-form-item label="密码：" prop="channelPwd" ref="channelPwdName">
          <el-input v-model="query.channelPwd" type="password"></el-input>
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
  name: 'cooperationStairAdd',
  data() {
    return {
      isCancearch: false,
      userId: this.$route.path !== '/trench/cooperation/stairAdd' ? this.$route.params.userId : '',
      allLoading: false,
      query: {
        channelMan: '',
        channelName: '',
        channelPwd: 'hfjy'
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
      }
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
        this.$store.dispatch('delVisitedViews', { name: 'cooperationStairAdd', path: '/trench/cooperation/stairAdd' })
      }
      this.$router.replace('/trench/cooperation')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isCancearch = true
          const _query = Object.assign({}, this.query)
          this.$delete(_query, 'channelPid')
          this.$delete(_query, 'channelContact')
          this.$http.post('channel_firstAddUpdate', _query).then(res => {
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

