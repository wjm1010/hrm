<template>
  <div class="login-container">
    <div class="login-img">
      <img src="../../assets/login_images/login.png" alt="">
    </div>
    <div class="login-air">
      <img src="../../assets/login_images/air.png" alt="">
    </div>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="login-title">
        <span>Hello!</span>
        <span>欢迎登录</span>
        <span>班主任工作台</span>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <img src="../../assets/login_images/user.png" alt="">
        </span>
        <el-input name="username" type="text" minlength="11" maxlength="11" v-model.trim="loginForm.username" autoComplete="on" placeholder="用户名" @change="changeInput"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <img src="../../assets/login_images/password.png" alt="">
        </span>
        <el-input name="password" :type="passwordType" minlength="6" @keyup.enter.native="handleLogin" v-model.trim="loginForm.password" autoComplete="on" placeholder="密码" @change="changeInput"/>
      </el-form-item>
      <div class="login-pwd">
        <el-checkbox class="login-pwd-remember" v-model="rememberPwd" @click='rememberPwd = !rememberPwd'>记住密码</el-checkbox>
        <span class="login-pwd-forgot" @click="$router.push('/forgotPwd')">忘记密码?</span>
      </div>
      <el-button type="primary" size="medium" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
    </el-form>
  </div>
</template>

<script>
  import { isvalidUsername } from '@/lib/validate'
  import { removeToken, setToken, getToken } from '@/utils/auth'
  import md5 from 'md5'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入正确的密码'))
        } else {
          callback()
        }
      }
      return {
        remenberUser: false, // stroge中的信息
        rememberPwd: true, // 记住密码
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false
      }
    },
    methods: {
      changeInput() {
        this.remenberUser = false
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            const data = Object.assign({}, this.loginForm, {
              // 监听文本框变动是否采用加密还是储存的密码
              'password': this.remenberUser ? this.loginForm.password : md5(md5(this.loginForm.username) + md5(this.loginForm.password))
            })
            this.$store.dispatch('LoginByUsername', data).then(res => {
              if (res.data) {
                this.rememberPwd
                  ? setToken('remember_user', `${this.loginForm.username}-${data.password}`)
                  : removeToken('remember_user')
                this.$message.success(res.message)
                this.$router.push({ path: '/' })
              }
            }).catch(console.log).finally(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    mounted() {
      // 获取storge中记住密码的信息
      this.remenberUser = getToken('remember_user')
      if (this.remenberUser) { // 赋值到登录框
        this.loginForm.username = this.remenberUser.split('-')[0]
        this.loginForm.password = this.remenberUser.split('-')[1]
      }
    },
    created() {
      this.$eventBus.$emit('removeBodyDisabledClick')
      this.$eventBus.$emit('clearCallSetTimeOut')
    },
    destroyed() {
    }
  }
</script>

<style rel="stylesheet/sass" lang="sass">
  .login-container
    .el-input
      input
        border: 0px
        -webkit-appearance: none
        &:-webkit-autofill
          background: #fff !important
          font-family: SimHei
          font-size: 18px
          box-shadow: 0 0 0 30px #fff inset

    .el-input__inner
      background: #fff !important
      font-family: SimHei
      font-size: 18px

</style>

<style rel="stylesheet/sass" lang="sass" scoped>
  .login-container
    background-image: url(../../assets/login_images/loginbg.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    position: relative
    overflow: hidden
    width: 100%
    height: 100%
    .login-img
      position: fixed
      top: 23px
      left: 215px
    .login-title
      margin-bottom: 45px
      span:nth-child(1)
        font-size: 38px
        color: #2d2d2d
        font-family: Arial
      span:nth-child(2)
        font-size: 20px
        color: #aaaaaa
      span:nth-child(3)
        font-size: 20px
        color: #2672ff
        font-family: PingFang SC
        font-weight: bolder
    .login-form
      position: absolute
      width: 500px
      height: 300px
      top: 40%
      left: 50%
      margin-left: -250px
      margin-top: -150px
      .login-pwd
        cursor: pointer
        color: #2672ff
        display: flex
        justify-content: space-between
        margin: 0 50px 50px
        .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner
          background-color: #fff!important

          &::after
            border-color: #2672ff!important
        .login-pwd-forgot
          font-size: 14px
    .tips
      font-size: 14px
      color: #fff
      margin-bottom: 10px
      span
        &:first-of-type
          margin-right: 16px
    .svg-container
      padding: 6px 5px 6px 15px
      vertical-align: middle
      width: 30px
      display: inline-block
      &_login
        font-size: 20px
    .title-container
      position: relative
      .title
        font-size: 26px
        font-weight: 400
        margin: 0px auto 40px auto
        text-align: center
        font-weight: bold
      .set-language
        color: #fff
        position: absolute
        top: 5px
        right: 0px
    .show-pwd
      position: absolute
      right: 10px
      top: 7px
      font-size: 16px
      cursor: pointer
      user-select: none
    .thirdparty-button
      position: absolute
      right: 35px
      bottom: 28px
    .el-input
      display: inline-block
      height: 47px
      width: 85%
      line-height: 47px
    .el-button--medium
      padding: 0
      border-radius: 4px
      width: 160px
      margin-left: 170px
      background: #2672ff
      line-height: 42px
      font-family: SimHei
      font-size: 20px
    .el-input__inner
      background: #fff !important
      font-family: SimHei
      font-size: 18px
      border: 0 !important
    .el-form-item
      background: #fff
      border-radius: 5px
      color: #444444
      padding: 2px
      border: 1px solid #b8b9b9
      width: 400px
      margin-left: 50px
      height: 55px
      line-height: 55px
      box-shadow: 3px 1px 3px #cacaca
  @keyframes mymove
    from
      top: 40vh
      -webkit-transform: translate(0, 0)
        transform: translate(0, 0)
    to
      top: 0vh
      -webkit-transform: translate(1000px, -378px)
        transform: translate(1000px, -378px)

  @-webkit-keyframes mymove
    from
      top: 40vh
      -webkit-transform: translate(0, 0)
        transform: translate(0, 0)
    to
      top: 0vh
      -webkit-transform: translate(1000px, -378px)
        transform: translate(1000px, -378px)
  .login-air
    position: absolute
    left: 20px
    animation: mymove 20s infinite
    -webkit-animation: mymove 20s infinite
</style>

