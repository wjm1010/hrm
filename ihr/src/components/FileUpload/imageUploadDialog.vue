<template>
  <el-dialog
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="el-dialog-sl"
    title="导入数据"
    @close="$emit('closeEv')">
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="src()"
      enctype="multipart/form-data"
      multiple
      :headers="myHeaders"
      name="resumefile"
      :limit="1"
      :on-exceed="handleExceed"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      :auto-upload="false">
      <el-button slot="trigger" size="small">上传文件</el-button><br><br><br>
      <a :href="href" target="_black">下载模板</a><br><br><br>
      <el-button size="small" type="primary" @click="submitUpload" :disabled="isCanSearch">导入</el-button>
    </el-upload>
  </el-dialog>
</template>
<script>
  import { getToken } from '@/utils/auth'
  export default{
    mounted() {
      this.dialogShow = true
    },
    data() {
      return {
        dialogShow: false,
        href: '',
        isCanSearch: false,
        fileList: [],
        ExcelHost: '',
        myHeaders: {
          'Auth-x': getToken('auth_x')
        }
      }
    },
    props: {

    },
    created() {
      this.config()
    },
    methods: {
      // 配置地址
      config() {
        this.ExcelHost = `${window.location.origin.replace(/(hrm-temp|hrm)/, 'hrmapi')}/resume/import/excelImport.html`
        this.href = `${window.location.origin.replace(/(hrm-temp|hrm)/, 'hrmapi')}/down/importTemple.xlsx`
      },
      src() {
        return this.ExcelHost
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      beforeAvatarUpload(file) {
        const isxlsx = file.name.includes('xlsx')
        const isccv = file.name.includes('ccv')
        const isxls = file.name.includes('xls')
        const isLtM = file.size / 1024 / 1024 < 10
        if (!isxls && !isxlsx && !isccv) {
          this.$message.error('上传的文件格式有误!')
          return false
        }
        if (!isLtM) {
          this.$message.error('上传文件大小不能超过 10MB!')
          return false
        }
        // 上传事件
        if ((isccv || isxls || isxlsx) && isLtM) {
          return true
        }
      },
      // 文件上传
      handleAvatarSuccess(res, file, fileList) {
        this.isCanSearch = true
        if (res.code === '0x000000') {
          if (res.data) {
            if (res.message === '全部导入成功') {
              this.$message.success(res.message)
              this.$emit('change-refresh-getlist')
              this.dialogShow = false
              this.isCanSearch = false
            } else {
              this.$alert(res.data.errorRecord.join('，'), res.message, {
                showConfirmButton: false,
                callback: action => { this.fileList = [] }
              })
              this.$emit('change-refresh-getlist')
              this.isCanSearch = false
            }
          }
        } else {
          this.$alert(res.data.msg, res.message, {
            showConfirmButton: false,
            callback: action => { this.fileList = [] }
          })
          this.isCanSearch = false
        }
      },
      // 上传文件超过限制
      handleExceed() {
        this.$message.warning('只能上传一个文件！')
      }
    }
  }
</script>
<style lang="sass" scoped>
  .upload-demo
    text-align: center
    a
      text-decoration: underline
      color: #3b8eda
</style>

