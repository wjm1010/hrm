<template>
  <el-dialog
    :visible="isShow"
    append-to-body
    title="提示"
    @close="dialogCloseEvent"
    custom-class="el-dialog-md"
  >
    <div style="text-align: center;margin-bottom: 20px">{{bodyMessage}}</div>

    <template slot="footer">
      <el-button @click="dialogCloseEvent">取消</el-button>
      <el-button @click="dialogCloseEvent" type="primary">确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: 'errorDialog',
    props: {
      isShow: {
        required: true,
        type: Boolean
      },
      bodyMessage: {
        required: true,
        type: String
      }
    },
    methods: {
      dialogCloseEvent() {
        this.$emit('update:isShow', false)
      }
    }
  }
</script>
