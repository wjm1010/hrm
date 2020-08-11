<template>
  <el-dialog
    :visible="dialogVisible"
    :append-to-body="true"
    @close="dialogCloseEvent"
    custom-class="el-dialog-md">
    <div class="telephone">
      <p class="telephoneTitle">
        <span class="el-icon-warning"></span>
        <span>提示</span>
      </p>
      <p class="announcements">抱歉，你没有权限访问该页面！</p>
      <p class="btn-group">
        <el-button @click="dialogCloseEvent">取消</el-button>
        <el-button type="primary" @click="dialogCloseEvent">确定</el-button>
      </p>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'NoPermissionDialog',
    props: {
      dialogVisible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      dialogCloseEvent() {
        this.$emit('update:dialogVisible', false)
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
      .el-icon-warning
        color: #dfac60
    .announcements
      line-height: 85px
      text-align: center
      color: red
    .btn-group
      text-align: center
</style>
