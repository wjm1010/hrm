<template>
  <div class="login-container">
    <div><canvas id="canvas">你的浏览器不支持canvas</canvas></div>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>


      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item prop="imageCode" style="width:241px;display:inline-block" v-if="verificationCodeShow">
        <el-input
          name="password"
          type="text"
          v-model="loginForm.imageCode" placeholder="验证码" />
      </el-form-item>

      <el-form-item style="width:142px;display:inline-block;height:51px;margin-left: 60px;vertical-align: bottom;cursor: pointer" v-if="verificationCodeShow">
        <span @click="configSrc()">
          <img :src="src" alt="">
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin:30px 0;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
    </el-form>
  </div>
</template>


<script>
  import { mapGetters } from 'vuex'
  import { validateEmail, isNumberOrLetter } from '@/lib/validate'
  import md5 from 'md5'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validateEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!isNumberOrLetter(value)) {
          callback(new Error('密码至少为6位，且必须同时包含数字+字母'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: '',
          imageCode: ''
        },
        src: '',
        verificationCodeShow: false,
        loginRules: {
          username: [{ required: true, trigger: 'change', validator: validateUsername }],
          password: [{ required: true, trigger: 'change', validator: validatePassword }],
          imageCode: [{ required: true, trigger: 'change', message: '请输入验证码' }]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false
      }
    },
    computed: {
      ...mapGetters['xToken']
    },
    methods: {
      canvas() {
        var WINDOW_WIDTH = document.body.offsetWidth
        var WINDOW_HEIGHT = document.body.offsetHeight
        var canvas, context
        var num = 700
        var stars = []
        var rnd
        window.onload = function() {
          canvas = document.getElementById('canvas')
          canvas.width = WINDOW_WIDTH
          canvas.height = WINDOW_HEIGHT
          context = canvas.getContext('2d')
          addStar()
          setInterval(render, 33)
          liuxing()
        }
        function liuxing() {
          var time = Math.round(Math.random() * 1000 + 55)
          setTimeout(function() {
            rnd = Math.ceil(Math.random() * stars.length)
            liuxing()
          }, time)
        }
        function render() {
          context.fillStyle = 'rgba(0,0,0,0.1)'
          context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)
          for (var i = 0; i < num; i++) {
            var star = stars[i]
            if (i === rnd) {
              star.vx = -5
              star.vy = 20
              context.beginPath()
              context.strokeStyle = 'rgba(255,255,255,' + star.alpha + ')'
              context.lineWidth = star.r
              context.moveTo(star.x, star.y)
              context.lineTo(star.x + star.vx, star.y + star.vy)
              context.stroke()
              context.closePath()
            }
            star.alpha += star.ra
            if (star.alpha <= 0) {
              star.alpha = 0
              star.ra = -star.ra
              star.vx = Math.random() * 0.2 - 0.1
              star.vy = Math.random() * 0.2 - 0.1
            } else if (star.alpha > 1) {
              star.alpha = 1
              star.ra = -star.ra
            }
            star.x += star.vx
            if (star.x >= WINDOW_WIDTH) {
              star.x = 0
            } else if (star.x < 0) {
              star.x = WINDOW_WIDTH
              star.vx = Math.random() * 0.2 - 0.1
              star.vy = Math.random() * 0.2 - 0.1
            }
            star.y += star.vy
            if (star.y >= WINDOW_HEIGHT) {
              star.y = 0
              star.vy = Math.random() * 0.2 - 0.1
              star.vx = Math.random() * 0.2 - 0.1
            } else if (star.y < 0) {
              star.y = WINDOW_HEIGHT
            }
            context.beginPath()
            var bg = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r)
            bg.addColorStop(0, 'rgba(255,255,255,' + star.alpha + ')')
            bg.addColorStop(1, 'rgba(255,255,255,0)')
            context.fillStyle = bg
            context.arc(star.x, star.y, star.r, 0, Math.PI * 2, true)
            context.fill()
            context.closePath()
          }
        }

        function addStar() {
          for (var i = 0; i < num; i++) {
            var aStar = {
              x: Math.round(Math.random() * WINDOW_WIDTH),
              y: Math.round(Math.random() * WINDOW_HEIGHT),
              r: Math.random() * 1,
              ra: Math.random() * 0.05,
              alpha: Math.random(),
              vx: Math.random() * 0.2,
              vy: Math.random() * 0.2
            }
            stars.push(aStar)
          }
        }
      },
      configSrc() {
        this.verificationCodeShow = true
        this.src = `${window.location.origin.replace(/(hrm-temp|hrm)/, 'hrmapi')}/resume/public/getImgCode.html?userName=${this.loginForm.username}&rand=${Math.random()}`
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
              'password': md5(this.loginForm.password)
            })
            this.$store.dispatch('LoginByUsername', data).then(res => {
              if (res.data) {
                this.$message.success(res.message)
                this.loading = false
                this.$router.push({ path: '/' })
              }
            }).catch(res => {
              if (res.code === '0x101010') {
                this.configSrc()
              }
            }).finally(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    watch: {
      'loginForm.username'(val) {
        if (val) {
          this.verificationCodeShow = false
          this.loginForm.imageCode = ''
        }
      }
    },
    created() {
      this.canvas()
    }
  }
</script>

<style rel="stylesheet/sass" lang="sass">
  $bg: #2d3a4b
  $light_gray: #eee
  $bgc: #010101
  /* reset element-ui css */
  .login-container
    .el-input
      display: inline-block
      height: 47px
      width: 85%
      input
        background: transparent
        border: 0px
        -webkit-appearance: none
        border-radius: 0px
        padding: 12px 5px 12px 15px
        color: $light_gray
        height: 47px
        &:-webkit-autofill
          -webkit-box-shadow: 0 0 0px 1000px $bgc inset !important
          -webkit-text-fill-color: #fff !important
    .el-form-item
      border: 1px solid rgba(255, 255, 255, 0.4)
      background: rgba(0, 0, 0, 0.1)
      border-radius: 5px
      color: #454545

</style>

<style rel="stylesheet/sass" lang="sass" scoped>
  @import "src/styles/mixin.sass"
  $bg: #2d3a4b
  $bgc: #010101
  $dark_gray: #889aa4
  $light_gray: #eee

  #canvas
    position: fixed
    width: 100%
    height: 100%

  .login-container
    @include relative
    height: 100vh
    background-color: $bgc
    .login-form
      position: absolute
      width: 520px
      padding: 35px 35px 15px 35px
      margin: 200px auto 0
      /*top: 50%*/
      /*top: 0*/
      right: 0
      left: 0
      /*transform: translateY(-50%) translateX(-50%)*/
      border: 1px solid #3e3c3c
      box-shadow: #fff 0px 0px 10px -3px
    .tips
      font-size: 14px
      color: #fff
      margin-bottom: 10px
      span
        &:first-of-type
          margin-right: 16px

    .svg-container
      padding: 6px 5px 6px 15px
      color: $dark_gray
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
        color: $light_gray
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
      color: $dark_gray
      cursor: pointer
      user-select: none

    .thirdparty-button
      position: absolute
      right: 35px
      bottom: 28px

  @media screen and (max-width: 750px)
    .login-container
      .login-form
        width: 90%
        left: 5%
        padding: 0
        height: 300px
        top: 50%
        margin: 0
        margin-top: -150px
      .title-container .title
        font-size: 20px
        margin: 30px 0
      .el-form-item
        width: 90% !important
        margin-left: 5%
    .el-button--medium
      width: 90% !important
      margin-left: 5%
</style>
