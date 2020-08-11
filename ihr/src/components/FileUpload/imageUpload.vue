<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <el-upload
      class="upload-demo"
      :action='src()'
      :headers="myHeaders"
      enctype="multipart/form-data"
      :name="name"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :limit="limitNumber"
      :on-exceed="handleExceed"
      :multiple="isMultiple"
      :file-list="fileList"
      :disabled='isDisabled'>
      <el-button icon="el-icon-upload2">点击上传</el-button>
    </el-upload>

  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  export default {
    name: 'imageUpload',
    data() {
      return {
        fileList: [],
        isDisabled: false,
        ExcelHost: '',
        myHeaders: {
          'Auth-x': getToken('auth_x')
        }
      }
    },
    props: {
      limitNumber: {
        type: Number,
        default: 1
      }, // 上传数量
      name: {
        type: String,
        default: 'resumeInfoAppendix'
      }, // 上传文件名称
      isMultiple: {
        type: Boolean,
        default: true
      }, // 是否单选
      userName: {
        type: String
      }, // 用户姓名
      resumeId: {
        type: String
      }, // 用户姓名
    },
    computed: {

    },
    filters: {

    },
    watch: {
      'userName'(val) {
        if (val) {
          this.$nextTick(() => {
            this.config()
          })
        }
      }
    },
    mounted() {
    },
    created() {
      this.config()
    },
    methods: {
      // 配置地址
      config() {
        this.ExcelHost = `${window.location.origin.replace(/(hrm-temp|hrm)/, 'hrmapi')}/resume/resume/uploadingFile.html?resumeName=${this.userName}&&resumeId=${this.resumeId}`
      },
      src() {
        return this.ExcelHost
      },
      // 文件上传之前
      beforeAvatarUpload(file) {
        const isdoc = file.name.includes('.doc')
        const isdocx = file.name.includes('.docx')
        const ispdf = file.name.includes('.pdf')
        const isJPEG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isJPG = file.type === 'image/jpg'
        const isLtM = file.size / 1024 / 1024 < 10
        if (!isJPG && !isJPEG && !isPNG && !isdoc && !isdocx && !ispdf) {
          this.$message.error('上传的文件格式有误！')
          return false
        }
        if (!isLtM) {
          this.$message.error('上传文件大小不能超过 10MB!')
          return false
        }
        // 上传事件
        if ((isPNG || isJPG || isJPEG || ispdf || isdocx || isdoc) && isLtM) {
          return true
        }
      },
      // 上传文件超过限制
      handleExceed() {
        this.$message.warning('上传的文件数量超过限制！')
      },
      // 文件上传
      handleAvatarSuccess(res, file, fileList) {
        this.isDisabled = true
        if (res.code === '0x000000') {
          if (res.data) {
            this.$message.success(res.message)
            this.$emit('resumeAddress', res.data[0])
            this.isDisabled = false
          }
        } else {
          this.$message.error(res.message)
          this.fileList = []
          this.isDisabled = false
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  .upload-demo
    width: 300px
</style>
