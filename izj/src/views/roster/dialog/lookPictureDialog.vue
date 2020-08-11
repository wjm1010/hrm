<template>
  <el-dialog
    :visible="isShow"
    custom-class="el-dialog-md"
    :append-to-body="true"
    @close="closeDialog"
    class="dialog-material no-indicators">

    <div slot="title">{{query.examDate}} {{query.subjectName}} {{query.typeName}} {{query.remark}}</div>

    <el-carousel trigger="click" height="350px" @change="clickChange" :autoplay="false" :indicator-position="false">
      <el-carousel-item v-for="(item,index) in arr" :key="index">
        <img :src="item" v-if="item" width="auto" height="350px" @click="zoomDialog(item)" style="cursor: zoom-in">
      </el-carousel-item>
    </el-carousel>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" custom-class="el-dialog-md" class="zoom-img">
      <img width="100%" height="auto" :src="dialogImageUrl" alt="" @click="zoomClose" style="cursor: zoom-out">
    </el-dialog>
    <div style="text-align: center">{{index}}/{{arr.length}}</div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'lookPictureDialog',
    props: ['isShow', 'rosterId', 'examId'],
    data() {
      return {
        index: '1',
        arr: [],
        dialogVisible: false,
        dialogImageUrl: '',
        query: {}
      }
    },
    created() {
      this.init()
    },
    methods: {
      examDetail() {
        return this.$http.get('exam_detail', {
          params: {
            studentIntentionId: this.rosterId,
            examId: this.examId
          }
        })
      },
      async init() {
        try {
          const { data } = await this.examDetail()
          if (!data) return
          this.arr = data.examPhotos
          this.query = data
        } catch (e) {
          console.error(e)
        }
      },
      zoomDialog(url) {
        this.dialogImageUrl = url
        this.dialogVisible = true
      },
      zoomClose() {
        this.dialogVisible = false
        this.dialogImageUrl = ''
      },
      closeDialog() {
        this.$emit('update:isShow', false)
      },
      clickChange(index) {
        this.index = index + 1
      }
    }
  }
</script>

<style>
.zoom-img .el-dialog-md{
  width: 100%;
}
.no-indicators .el-carousel__indicators {
  display: none;
}
</style>
