<template>
  <div class="forgotPwd">
    <section class="head">
      <div class="head-con">
        <div class="left">
          <div  class="logo"><img src="../../assets/login_images/logo.png" alt=""></div>
          <span>找回密码</span>
        </div>
        <span class="right" @click="$router.push('/login')">登录</span>
      </div>
    </section>
    <section class="progress">
      <ul class="progress-con">
        <li v-for='(i,index) in progress' :key='index' :class="index+1 <= progress.map((t,i)=>t.status?i+1:'').filter(t=>t)[0] ? 'act' : ''"><span>{{index+1}}</span>{{i.name}}</li>
      </ul>
    </section>
    <section class="first" v-show='progress[0].status'>
      <el-form class="form" status-icon autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h2 class="title">填写要找回的账号信息</h2>
        <el-form-item prop="phone" class='form-item' ref="phone">
          <div  class='item account'>
             <span>
              输入账号:
            </span>
            <el-input clearable class='input-item' name="phone" type="text" minlength="11" maxlength="11" v-model.trim="loginForm.phone" autoComplete="on" placeholder="输入您的手机号" />
          </div>
        </el-form-item>
        <el-form-item prop="code" class='form-item'>
          <div class='item code'>
           <span>
            输入验证码:
            </span>
            <el-input clearable class='input-item' name="code" type="text" minlength="6"  v-model.trim="loginForm.code" autoComplete="on" placeholder="输入验证码" />
            <el-button class='btn-code' :class="codeVisible?'dis':''" type="primary" :loading="code_btn_loading" @click.native.prevent="send_code">{{codeText}}</el-button>
          </div>
        </el-form-item>
        <el-button type="primary" class='submit' :loading="verification_code_loading" @click="verification_code()">下一步</el-button>
      </el-form>
    </section>
    <section class="second" v-show='progress[1].status'>
      <el-form class="form" autoComplete="on" :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-position="left">
        <h2 class="title">身份验证成功,请重新设置你的新密码</h2>
        <el-form-item prop="password" class='form-item'>
          <div  class='item '>
             <span>
              设置新密码:
            </span>
            <el-input class='input-item' name="password" :type="passwordType" minlength="11" maxlength="11" v-model.trim="passwordForm.password" autoComplete="on" placeholder="输入新密码" />
          </div>
        </el-form-item>
        <el-form-item prop="newpassword" class='form-item'>
          <div class='item '>
           <span>
            确认新密码:
            </span>
            <el-input class='input-item' name="newpassword" :type="passwordType" minlength="11" maxlength="11"  v-model.trim="passwordForm.newpassword" autoComplete="on" placeholder="再次输入新密码" />
          </div>
        </el-form-item>
        <el-button type="primary" class='submit' :loading="password_recovery_loading" @click="password_recovery()">下一步</el-button>
      </el-form>
    </section>
    <section class="end" v-show='progress[2].status'>
      <img src="../../assets/login_images/succ.png" alt="">
      <p>您已成功设置新密码，请使用新密码<span @click="$router.push('login')">登录</span></p>
    </section>
  </div>
</template>

<script>
  import { isvalidUsername, isNumberOrLetter } from '@/lib/validate'

  let time = null
  let num = 60
  export default {

    name: 'forgotPwd',

    data() {
      /**
       * 验证用户名
       */
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('你输入的手机号码不符合规范，请重新输入！'))
        } else {
          callback()
        }
      }
      /**
       * 验证验证码
       */
      return {
        codeVisible: false, //  发送验证码按钮是否可点击
        codeText: '获取验证码',
        progress: [{ // 步骤条
          name: '账号确认',
          status: true
        }, {
          name: '重置密码',
          status: false
        }, {
          name: '完成',
          status: false
        }],
        loginForm: {
          phone: '',
          code: ''
        },
        passwordForm: {
          phone: '',
          password: '',
          newpassword: '',
          code: ''
        },
        loginRules: {
          phone: [{ required: true, trigger: 'blur', validator: validateUsername }]
        },
        passwordRules: {
          password: [{ required: true, trigger: 'blur', validator: this.newPasswordValidate }],
          newpassword: [{ required: true, trigger: 'blur', validator: this.newAgainPasswordValidate }]
        },
        passwordType: 'password',
        code_btn_loading: false, // 发送验证码按钮loading
        verification_code_loading: false, // 验证code码loadding
        password_recovery_loading: false, // 重置密码loadding
      }
    },
    methods: {
      /**
       * 密码查看
       */
      showPwd() {
        this.passwordType = this.passwordType === 'password' ? '' : 'password'
      },
      /**
       * 设置定时器
       */
      set_code_interval() {
        if (this.codeVisible) return
        this.codeVisible = !this.codeVisible
        time = setInterval(() => {
          if (num <= 0) {
            this.codeText = '获取验证码'
            this.codeVisible = !this.codeVisible
            num = 59
            clearInterval(time)
          } else {
            this.codeText = `${num}s后请重新获取验证码`
            num--
          }
        }, 1000)
      },
      /**
       * 发送验证码
       */
      send_code() {
        if (!isvalidUsername(this.loginForm.phone)) {
          this.$message.error('请输入正确的用户名!')
          return
        }
        this.$http.post('passport_sendMsg', { phone: this.loginForm.phone }, { isNoMessage: true }).then(res => {
          if (res.code !== '0x0000000') {
            this.$message.error(res.message)
            return
          }
          this.$message.success('验证码发送成功!')
          this.set_code_interval()
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 切换步骤
       * @param type 1为重置密码，2为完成
       */
      switch_progress(type) {
        const index = type === 'code' ? 1 : 2
        this.progress.forEach(t => (t.status = false))
        this.progress[index].status = true
      },
      /**
       * 验证验证码
       */
      verification_code() {
        this.$refs.loginForm.validate(res => {
          if (!res) return
          this.verification_code_loading = true
          this.$http.post('passport_verificationCode', this.loginForm, { isNoMessage: true }).then(res => {
            this.passwordForm.code = this.loginForm.code
            this.verification_code_loading = false
            if (res.code !== '0x0000000') {
              this.$message.error(res.message)
              return
            }
            this.switch_progress('code')
          }).catch(error => {
            this.verification_code_loading = false
            console.log(error)
          })
        })
      },
      /**
       * 修改密码
       */
      password_recovery() {
        this.passwordForm.phone = this.loginForm.phone
        this.$refs.passwordForm.validate(res => {
          if (!res) return
          this.verification_code_loading = true
          this.$http.post('passport_PasswordRecovery', this.passwordForm, { isNoMessage: true }).then(res => {
            this.password_recovery_loading = false
            if (res.code !== '0x0000000') {
              this.$message.error(res.message)
              return
            }
            this.switch_progress('reset')
          }).catch(error => {
            this.password_recovery_loading = false
            console.log(error)
          })
        })
      },
      newPasswordValidate(rule, value, callback) {
        if (!isNumberOrLetter(value)) {
          callback(new Error('密码至少为8位，且必须同时包含数字+字母'))
        }
        callback()
      },
      newAgainPasswordValidate(rule, value, callback) {
        if (value !== this.passwordForm.password) {
          callback(new Error('两次输入的密码不一致，请重新输入'))
          return
        }
        callback()
      }
    },
  }
</script>

<style lang="scss" scoped>
  .forgotPwd{
    .head{
      line-height: 60px;
      font-size: 16px;
      color: #fff;
      background: #0082fb;
      .head-con{
        width: 980px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        .left{
          display: flex;
          align-items: center;
          .logo{
            display: flex;
            align-items: center;
            padding-right: 25px;
            border-right: 1px solid #fff;
          }
          span{
            margin-left: 25px;
          }
        }
        .right{
          cursor: pointer;
        }
      }
    }
    .progress{
      font-weight: 600;
      background: #f5f7fa;
      .progress-con{
        width: 900px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        li{
          flex: 1;
          display: flex;
          align-items: center;
          list-style: none;
          font-size: 14px;
          color: #909399;
          position: relative;
          &.act{
            color: #2C7EFF;
            height: 60px;
            span{
              border: 1px solid #2C7EFF;
            }
            &:not(:last-child):after{
              border-top: 2px solid #2C7EFF;
              border-right: 2px solid #2C7EFF;
            }
          }
          span{
            margin-right: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #909399;
            font-size: 16px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
          &:not(:last-child):after{
            display: inline-block;
            content: '';
            position: absolute;
            right: 100px;
            font-size: 30px;
            width: 14px;
            height: 14px;
            border-top: 2px solid #909399;
            border-right: 2px solid #909399;
            transform: rotate(45deg);
          }
        }
      }
    }
    .form{
      width: 550px;
      margin: 84px auto 0;
      .title{
        margin-bottom: 30px;
        font-size: 16px;
        color: #4B4D51;
      }
      .form-item{
        margin-left: 100px;
      }
      .item{
        margin-top: 16px;
        color: #4B4D51;
        display: flex;
        position: relative;
        span{
          position: absolute;
          left: -100px;
          width: 100px;
        }
        .input-item{
          width: 240px;
        }
        .btn-code{
          &.dis{
            pointer-events: none;
            background: #B1B4B9;
            border-color: #B1B4B9;
          }
          margin-left: 20px
        }
      }
      .submit{
        width: 240px;
        margin-left: 100px;
        margin-top: 50px;
      }
    }
    .end{
      text-align: center;
      img{
        margin: 95px auto 35px;
      }
      span{
        cursor: pointer;
        text-decoration: underline;
        color: #0082fb
      }
    }
  }
</style>
