<template>
  <el-dialog
    :visible="dialogVisible"
    :append-to-body="true"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="dialogCloseEvent"
    custom-class="el-dialog-md">
    <div class="telephone">
      <p class="telephoneTitle">
        <svg-icon icon-class="warning1"></svg-icon>
        <span>提示</span>
      </p>
      <p class="announcements">当前登录密码是弱密码，请前往个人中心修改密码。</p>
      <p class="btn-group">
        <el-button type="primary" @click="goToPersonalCenter">知道了</el-button>
      </p>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'weakPassword',
    props: {
      dialogVisible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      dialogCloseEvent() {
        this.$emit('update:dialogVisible', false)
      },
      goToPersonalCenter() {
        this.dialogCloseEvent()
        this.$router.push('/personalInfo/index')
      }
    }
  }
</script>

<style scoped lang="sass">
  .telephone
    .telephoneTitle
      font-weight: 700
      color: #4F607B
      text-align: center
      font-size: 24px
      margin: 0
      svg
        font-size: 40px
        margin-right: 15px
    .announcements
      background: #eaecee
      line-height: 85px
      text-align: center
      color: red
    .btn-group
      text-align: center
</style>
