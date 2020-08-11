<template>
  <div class="upload">
    <el-upload
      :http-request="upload"
      auto-upload
      action="string"
      :show-file-list="false"
      list-type="picture">
    <el-button size="small" type="primary" slot="trigger" :disabled="disabled">上传名单</el-button>
      <a :href="`${baseURL}/down/importTemple.xlsx`" target="_blank">上传模板，点击下载</a>
    </el-upload>
    <p v-if="res.count">{{res.count}}</p>
    <p v-if="res.message">{{res.message}}</p>
    <expand-table
      v-if="res.data"
      :rows='res.data'
      :loading='loading'
      :columns='columns'>
    </expand-table>
  </div>
</template>
<script>
  import instance from '@/utils/http/instance'
  export default {
    name: 'upload',
    data: () => ({
      baseURL: instance.baseURL,
      res: {
        message: '',
        count: '',
        data: ''
      },
      disabled: false,
      loading: false,
      columns: [
        { 'value': 'resumeName', 'text': '姓名' },
        { 'value': 'resumePhone', 'text': '联系方式' },
        { 'value': 'cause', 'text': '失败原因' }
      ]
    }),
    methods: {
      async upload(e) {
        this.disabled = false
        const res = await this.$http.post('resume_excelImport', { resumefile: e.file }, { hasFile: true, alertMessage: true })
        this.$message.info(res.message)
        if (!res) return
        this.res = res.data
        this.refs.upload.clearFiles()
        this.disabled = true
        this.$emit('change-refresh-getlist')
      }
    },
  }
</script>
<style scoped>
.upload{
  padding-top: 100px;
  padding-left: 20px;
}
</style>
