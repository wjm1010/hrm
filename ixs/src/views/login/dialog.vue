<template>
    <el-dialog
      :visible.sync="dingDialog.show"
      custom-class="el-dialog-md"
      style="display: flex"
      :append-to-body="true"
      width="30%">
      <iframe :src="dingDialog.url" class="body-pos"></iframe>
    </el-dialog>
</template>
<script>
export default {
  props: {
    dingDialog: {
      require: true
    }
  },
  data() {
    return {

    }
  }
}
</script>
<style lang = 'sass'>
.body-pos
  padding-left: 50px
  width: 350px
  height: 350px
  border: 0px  
</style>


