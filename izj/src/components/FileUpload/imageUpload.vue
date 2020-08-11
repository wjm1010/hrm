<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <el-upload
      class="upload-demo"
      :action='src()'
      enctype="multipart/form-data"
      name="picture"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="limitNumber"
      :on-exceed="handleExceed"
      :multiple="isMultiple"
      :file-list="fileList"
      :disabled='isDisabled'>
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

  </div>
</template>

<script>
  import config from '@/../config/default.js'
  export default {
    name: 'imageUpload',
    data() {
      return {
        fileList: [],
        isDisabled: false,
        isMultiple: true,
        fileArray: [],
        oldIPCHost: ''
      }
    },
    props: {
      limitNumber: {
        type: Number,
        default: 30
      }, // 最大数量
      isFileListInfo: Boolean // 弹窗关闭清空数据
    },
    computed: {
    },
    filters: {
  
    },
    watch: {
      'isFileListInfo'(val) {
        if (val === false) {
          this.fileList = []
          this.fileArray = []
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
        if (window.location.host === 'izj.hfjy.top') {
          this.oldIPCHost = config.oldIPCHost[0]
        } else {
          this.oldIPCHost = config.oldIPCHost[1]
        }
      },
      src() {
        return this.oldIPCHost
      },
      // 文件上传之前
      beforeAvatarUpload(file) {
        const isJPEG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isJPG = file.type === 'image/jpg'
        const isLtM = file.size / 1024 / 1024 < 20
        if (!isJPG && !isJPEG && !isPNG) {
          this.$message.error('上传的图片格式有误，允许上传的图片格式为png、jpg、jpeg!')
          return false
        }
        if (!isLtM) {
          this.$message.error('上传图片大小不能超过 20MB!')
          return false
        }
        // 上传事件
        if ((isPNG || isJPG || isJPEG) && isLtM) {
          return true
        }
      },
      // 删除文件
      beforeRemove(file, fileList) {
        return this.$confirm(`确定删除 ${file.name}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { return })
          .catch(() => { return })
      },
      removeByValue(arr, val) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === val) {
            arr.splice(i, 1)
            break
          }
        }
      },
      handleRemove(file, fileList) {
        if (file.status !== 'ready') {
          this.removeByValue(this.fileArray, file.response.data.url)
          this.$emit('file-list', this.fileArray)
        }
      },
      // 上传文件超过限制
      handleExceed() {
        this.$message.warning('图片最多不可超过30个！')
      },
      // 文件上传
      handleAvatarSuccess(res, file, fileList) {
        if (res.code === '0x000000') {
          if (res.data) {
            this.$message.success('文件上传成功！')
            this.fileArray.push(res.data.url)
            this.$emit('file-list', this.fileArray)
          }
        } else {
          this.$message.error('文件上传失败，请重新上传！')
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
.upload-demo
  width: 300px
</style>
