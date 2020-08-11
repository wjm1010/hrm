<template>
  <el-dialog
    title="提示"
    class="dialog-center-class"
    :append-to-body="true"
    :visible="isShow"
    @close="closeEvent"
    width="30%"
    center>
    <div class="body">{{bodyMessage}}</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEvent">取消</el-button>
      <el-button type="primary" :disabled="!isCanSearch" @click="determineEvent">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'centerDialog',
    props: {
      isShow: {
        type: Boolean,
        required: true
      },
      bodyMessage: {
        type: String,
        required: true
      },
      isCanSearch: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      closeEvent() {
        console.log(123123)
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
  .dialog-center-class
    .body
      text-align: center
</style>
