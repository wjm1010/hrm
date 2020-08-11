<template>
  <el-dialog
    :visible="isShow"
    class="dialog-warning-class"
    :append-to-body="true"
    @close="closeEvent"
    width="50%">
    <p class="title">
      <svg-icon icon-class="warning3" class="icon"></svg-icon>
      <span>提示</span>
    </p>
    <p class="message-body">{{bodyMessage}}</p>
    <div class="footer">
          <el-button @click="closeEvent">取消</el-button>
          <el-button type="primary" :disabled="!canSearch" @click="determineEvent">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'warningDialog',
    props: {
      isShow: {
        type: Boolean,
        required: true
      },
      bodyMessage: {
        type: String,
        required: true
      },
      canSearch: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      closeEvent() {
        this.$emit('update:isShow', false)
      },
      determineEvent() {
        this.$emit('yes-event')
        this.closeEvent()
      }
    }
  }
</script>

<style scoped lang="sass">
  .dialog-warning-class
    .title
      text-align: center
      font-size: 24px
    .icon
      color: yellow
    .message-body
      text-align: center
      font-size: 17px
    .footer
      text-align: center
</style>
