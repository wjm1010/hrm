<template>
  <el-dialog
    :visible="isShow"
    custom-class="el-dialog-md"
    :append-to-body="true"
    @close="closeDialog"
  >
    <div v-loading="loading">
      <iframe v-if="iframeUrl" :src="iframeUrl" frameborder="0" scrolling="yes" style="width:100%;height: 800px"></iframe>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'stageFeedbackDialog',
    props: ['isShow', 'stageId', 'studentIntentionId'],
    data() {
      return {
        loading: true,
        iframeUrl: ''
      }
    },
    created() {
      this.init()
    },
    methods: {
      getViewReport() {
        return this.$http.get('student_getViewReport', {
          params: {
            stageId: this.stageId,
            studentIntentionId: this.studentIntentionId
          }
        })
      },
      closeDialog() {
        this.$emit('update:isShow', false)
      },
      async init() {
        try {
          const { data } = await this.getViewReport()
          if (!data) return
          this.iframeUrl = data.url
        } catch (e) {
          console.error(e)
          this.$message.error('系统错误')
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
