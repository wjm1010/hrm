<template>
  <el-menu class="navbar" mode="horizontal" :class="{'no-sidebar-navbar-width':!sidebar.opened}">
    <hamburger :class="['hamburger-container',{'small-width':!sidebar.opened}]" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <div class="right-menu">
      <div class="searchContent">

        <div class="name">{{name}}</div>
        
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
              <svg-icon icon-class="boy" class="user-avatar"></svg-icon>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="changeLoginPassword">修改登录密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided v-if="userRole==='2'">
              <span @click="changeEamilPassword">修改邮箱密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="reset" style="display:block;color:red;">清除缓存</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
     
    </div>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :close-on-press-escape="false"
      custom-class="el-dialog-sl"
      @close="resetForm('ruleForm')">
      <el-form :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="新密码：" prop="pass" class="fshowPwd">
          <el-input v-model="ruleForm.pass" :type="passwordType"></el-input>
          <span class="showPwd" @click="showPwd">
            <svg-icon :icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item label="重复新密码：" prop="checkPass" class="fshowcheckPwd">
          <el-input v-model="ruleForm.checkPass" :type="checkPasswordType"></el-input>
          <span class="showcheckPwd" @click="showcheckPwd">
          <svg-icon :icon-class="checkeye" />
        </span>
        </el-form-item>
        <p style="color:red;fong-size:12px;margin:10px 0 20px 10px" v-if="dialog.logintipShow">注：新密码至少为6位数，且必须同时包含数字+字母</p>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">下次再说</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isDisabled">确 定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import { isNumberOrLetter } from '@/lib/validate'

export default {
  components: {
    Hamburger,
    Screenfull
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.dialog.title === '修改邮箱密码') {
        if (!value) {
          callback(new Error('请输入邮箱密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      } else {
        if (!isNumberOrLetter(value)) {
          callback(new Error('密码至少为6位，且必须同时包含数字+字母'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入的新密码不一致，请重新确认修改!'))
      } else {
        callback()
      }
    }
    return {
      dialog: {
        show: false,
        logintipShow: false,
        title: ''
      },
      isDisabled: false,
      passwordType: 'password',
      checkPasswordType: 'password',
      eye: 'eye',
      checkeye: 'eye',
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: ['blur', 'change'] }
        ],
        checkPass: [
          { validator: validatePass2, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted() {
    if (this.userChangePwd === '0') {
      this.changeLoginPassword()
    }
  },
  destroyed() {
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'userRole',
      'userId',
      'userChangePwd'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    reset() {
      location.replace(location.pathname + '?_' + Math.random() + location.hash)
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
        this.eye = 'lighteye'
      } else {
        this.passwordType = 'password'
        this.eye = 'eye'
      }
    },
    showcheckPwd() {
      if (this.checkPasswordType === 'password') {
        this.checkPasswordType = ''
        this.checkeye = 'lighteye'
      } else {
        this.checkPasswordType = 'password'
        this.checkeye = 'eye'
      }
    },
    changeLoginPassword() {
      this.dialog = {
        show: true,
        title: '修改登录密码',
        logintipShow: true
      }
    },
    changeEamilPassword() {
      this.dialog = {
        show: true,
        title: '修改邮箱密码',
        logintipShow: false
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          if (this.dialog.title === '修改登录密码') {
            this.$http.post('workersSet_changeUserPwd', {
              userId: this.userId,
              userNewPwd: this.ruleForm.pass,
              userReptPwd: this.ruleForm.checkPass,
            }).then(res => {
              this.$message.success(res.message)
              this.dialog.show = false
              this.logout()
            }).finally(() => {
              this.isDisabled = false
            })
          } else {
            this.$http.post('workersSet_changeUserMailPwd', {
              userId: this.userId,
              userMailPwd: this.ruleForm.pass,
              userReptPwd: this.ruleForm.checkPass,
            }).then(res => {
              this.$message.success(res.message)
              this.dialog.show = false
            }).finally(() => {
              this.isDisabled = false
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialog.show = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;
    padding: 0;
    margin: 0 auto;
    left: 0;
    width: 100%;
    z-index: 1002;
    position: fixed;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
      width: 180px;
      text-align: center;
      margin-top: 7px;
      transition: .38s;
    }
    .right-menu {
      height: 100%;
      text-align: right;
      position: absolute;
      right: 20px;
      &:focus{
        outline: none;
      }
      .searchContent{
        .input-with-select{
          position: relative;
          left: -30px;
          top: 0;
          width:250px!important;
        }
        .name{
          position: relative;
          top: 0;
          line-height: 50px;
          display: inline-block;
          padding: 0 20px;
        }
      }
      .avatar-container {
        height: 50px;
        .avatar-wrapper {
          cursor: pointer;
          position: relative;
          .user-avatar {
            width: 2em;
            display: inline-block;
            text-align: center;
            position: relative;
            height: 2em;
            top: 5px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }

      .color-pink{
        background-color: pink!important;
      }
    }
  }

  .small-width{
    width: 54px!important;
  }

  .fshowPwd,.fshowcheckPwd{
    position: relative;
    .showPwd,.showcheckPwd{
      position: absolute;
      right: 30px;
      top: 1px;
      cursor: pointer;
    }
  }
</style>
