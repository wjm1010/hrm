<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <div class="go-back">
      <img :src="goBack" alt="" @click="$router.go(-1)">
      <b class="title">个人中心</b>
    </div>
    <div class="account-message">
      <h4 class="title">账号信息</h4>
      <el-form
        :model="info"
        label-width="120px">
        <el-form-item label="姓名：">
          <el-input class="width-400" v-model="info.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input class="width-400" v-model="info.phone" disabled></el-input>
          <el-button type="text" @click="changePassword.isShow=true">密码修改</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-message">
      <h4 class="title">基本信息</h4>
      <el-form
        label-width="120px">
        <el-form-item label="组别：">
          <el-input class="width-400" v-model="info.deptName" disabled></el-input>
        </el-form-item>
        <el-form-item label="岗位：">
          <el-input class="width-400" v-model="info.roleName" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="sign-message" callIdAttr="call-phone-dialog">
      <!--<h4 class="title">登录信息</h4>-->
      <!--<p class="time">最近登录：{{info.time}}</p>-->
      <div>
        <el-button class="winth-520" @click="reset">清除缓存</el-button>
      </div>
      <div class="logout">
        <el-button type="primary" class="winth-520" @click="logout">退出登录</el-button>
      </div>
    </div>

    <el-dialog
      :visible="changePassword.isShow"
      :append-to-body="true"
      @close="dialogCloseEvent"
      custom-class="el-dialog-md"
      class="change-password-dialog">
      <p slot="title" class="dialog-title">
        <b>{{changePassword.title}}</b>
      </p>
      <el-form
        :ref="changePassword.ref"
        :model="changePassword.query"
        :rules="changePassword.rules"
        label-width="120px">
        <el-form-item prop="oldPassword" label="旧密码：">
          <el-input type="password" v-model="changePassword.query.oldPassword" placeholder="请输入旧密码" class="width-70"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码：">
          <el-input type="password" v-model="changePassword.query.newPassword" placeholder="请输入新密码" class="width-70"></el-input>
        </el-form-item>
        <el-form-item prop="newConfirmPassword" label="确认新密码：">
          <el-input type="password" v-model="changePassword.query.newConfirmPassword" placeholder="请确认新密码" class="width-70"></el-input>
        </el-form-item>
      </el-form>
      <p class="message">新密码至少为8位，且必须同时包含数字+字母</p>
      <span slot="footer">
        <el-button
          @click="changePassword.submitEvent"
          type="primary"
          :disabled="!changePassword.canSearch">提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import goBack from './go-back.png'
  import { isNumberOrLetter } from '@/lib/validate.js'
  import { get } from '@/utils/storage.js'

  export default {
    name: 'personalInfo',
    data() {
      return {
        goBack,
        info: {
          name: '',
          phone: '',
          deptName: '',
          roleName: ''
        },
        changePassword: {
          isShow: false,
          canSearch: true,
          title: '修改登录密码',
          ref: 'changePassword',
          query: {
            oldPassword: '',
            newPassword: '',
            newConfirmPassword: ''
          },
          submitEvent: this.changePasswordSubmitEvent,
          rules: {
            oldPassword: {
              required: true, message: '旧密码错误'
            },
            newPassword: {
              required: true, validator: this.newPasswordValidate
            },
            newConfirmPassword: {
              required: true, validator: this.newAgainPasswordValidate
            }
          }
        }
      }
    },
    computed: {},
    created() {
      this.init()
    },
    methods: {
      postNewPassword() {
        return this.$http.post('passport_passwordChange', this.changePassword.query)
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      },
      init() {
        const userInfo = get('user_info').sessionUser
        const { name, phone } = userInfo
        const { roleName, deptName } = userInfo.role
        console.log(userInfo)
        this.info = { name, phone, roleName, deptName }
      },
      reset() {
        location.replace(location.pathname + '?_' + Math.random() + location.hash)
      },
      dialogCloseEvent() {
        this.$refs['changePassword'].resetFields()
        this.changePassword.isShow = false
      },
      changePasswordSubmitEvent() {
        this.$refs['changePassword'].validate(valid => {
          if (valid) {
            this.changePassword.canSearch = false
            this.postNewPassword().then(res => {
              if (res.data) {
                this.$message.success('修改成功，请重新登录')
                this.changePassword.isShow = false
                setTimeout(this.logout, 1500)
              } else {
                this.changePassword.query.oldPassword = ''
              }
            }).catch(console.log).finally(() => {
              this.changePassword.canSearch = true
            })
          } else {
            this.$message.warning('提交失败')
          }
        })
      },
      newPasswordValidate(rule, value, callback) {
        if (!value) {
          callback(new Error('请填写新密码'))
          return
        }
        if (value === this.changePassword.query.oldPassword) {
          callback(new Error('新密码不能与旧密码相同'))
        }
        if (!isNumberOrLetter(value)) {
          callback(new Error('新密码格式错误'))
        }
        callback()
      },
      newAgainPasswordValidate(rule, value, callback) {
        if (!value) {
          callback(new Error('请填写确认新密码'))
          return
        }
        if (value !== this.changePassword.query.newPassword) {
          callback(new Error('2次输入密码不一致'))
          return
        }
        callback()
      }
    }
  }
</script>
<style lang="sass">

  @import '../../styles/personalInfo/index.sass'

</style>
