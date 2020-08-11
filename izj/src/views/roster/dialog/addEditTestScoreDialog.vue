<template>
  <el-dialog
    :visible="isShow"
    custom-class="el-dialog-md"
    :append-to-body="true"
    @close="closeDialog"
    class="dialog-test-score">

    <div slot="title"><span v-if="isEdit">编辑</span><span v-else>新增</span>试卷信息</div>

    <el-form
      :model="query"
      ref="formRef"
      :rules="rules"
      v-loading="loading"
      label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="科目：" prop="subjectId">
            <el-select v-model="query.subjectId" clearable filterable class="width-80">
              <el-option
                v-for="(item) in options.subjects"
                :key="item.code"
                :label="item.value"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考试类型：" prop="typeId">
            <el-select v-model="query.typeId" clearable filterable class="width-80">
              <el-option
                v-for="(item) in options.types"
                :key="item.code"
                :label="item.value"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="examDate" label="考试日期：">
            <el-date-picker
              class="width-80"
              v-model="query.examDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              clearable
              type="date"
              :editable="false">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="remark" label="备注：">
            <el-input class="width-80" v-model="query.remark" clearable :maxlength="10" placeholder="限10字以内"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="score" label="考试得分：" ref="form-score">
            <el-input class="width-80" v-model="query.score" clearable
                      placeholder="请填写实际得分"></el-input>
            分
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="scoreTotal" label="总分：">
            <el-input class="width-80" v-model="query.scoreTotal" clearable
                      placeholder="请填写实际总分"></el-input>
            分
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="等级评分：" prop="grade">
            <el-select v-model="query.grade" clearable filterable class="width-80"
                       @change="handleGradeChange"
                       placeholder="请选择等级评分">
              <el-option
                v-for="(item) in options.grades"
                :key="item.code"
                :label="item.value"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="classRank" label="班级班名：">
            <el-input
              clearable
              class="width-80"
              v-model="query.classRank"
              type="number"
              placeholder="限4字以内">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="gradeRank" label="年级排名：">
            <el-input
              clearable
              class="width-80"
              v-model="query.gradeRank"
              type="number"
              placeholder="限4字以内">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否进步：" prop="progress">
            <el-radio v-model="query.progress" label="1">是</el-radio>
            <el-radio v-model="query.progress" label="2">否</el-radio>
            <el-radio v-model="query.progress" label="3">无变化</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="overflow: hidden">
      <p>试卷照片上传：</p>
      <el-upload
        id="upload"
        :action='src()'
        :http-request="uploadRequest"
        name="file"
        enctype="multipart/form-data"
        :file-list="fileList"
        :limit="20"
        multiple
        list-type="picture"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload">
        <el-button size="small" type="primary">点击上传</el-button>
        <span style="color: red; font-size: 11px; padding-left:10px">温馨提示：最多上传20张，单张图片最大不能超过5M，本页面数据保存后将实时同步至学生、家长、老师，请谨慎操作！</span>
      </el-upload>
    </div>


    <div slot="footer" class="dialog-footer">
      <el-button
        @click="submitForm"
        type="primary"
        class="dialogSubmit"
        :disabled="!isCanSearch">保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import config from '@/../config/default.js'
  import $ from 'jquery'
  import axios from 'axios'

  export default {
    name: 'addEditTestScoreDialog',
    props: ['isShow', 'isEdit', 'rosterId', 'examId', 'obtainInfo'],
    data() {
      return {
        loading: true,
        isCanSearch: true,
        fileList: [],
        query: {
          examId: '',
          subjectId: '',
          typeId: '',
          examDate: '',
          score: '',
          grade: '',
          scoreTotal: '',
          classRank: '',
          gradeRank: '',
          remark: '',
          progress: ''
        },
        options: {
          subjects: [],
          types: [],
          grades: []
        },
        rules: {
          typeId: { required: true, message: '请选择', trigger: 'change' },
          subjectId: { required: true, message: '请选择', trigger: 'change' },
          score: { trigger: 'change', validator: this.scoreValidator },
          scoreTotal: { trigger: 'change', validator: this.scoreTotalValidator },
          examDate: { required: true, message: '请选择', trigger: 'change' },
          classRank: { trigger: 'change', validator: this.numValidator },
          gradeRank: { trigger: 'change', validator: this.numValidator },
          progress: { required: true, message: '请选择', trigger: 'change' }
        }
      }
    },
    created() {
      this.config()
      if (this.isEdit) {
        return this.EditInit()
      }
      this.AddInit()
    },
    mounted() {
      this.$nextTick(() => {
        const dom = $('#upload')
        dom.on('dragstart', '.el-upload-list__item', this.startDrag)
        dom.on('dragover', '.el-upload-list__item', this.overdrag)
        dom.on('drop', '.el-upload-list__item', this.drop)
      })
    },
    destroyed() {
      const dom = $('#upload')
      dom.off('dragstart', '.el-upload-list__item', this.startDrag)
      dom.off('dragover', '.el-upload-list__item', this.overdrag)
      dom.off('drop', '.el-upload-list__item', this.drop)
    },
    methods: {
      getExamSubjects() {
        return this.$http.get('exam_getExamSubjects')
      },
      getExamTypes() {
        return this.$http.get('exam_getExamTypes')
      },
      getGradeList() {
        return this.$http.get('exam_gradeList')
      },
      examDetail() {
        return this.$http.get('exam_detail', {
          params: {
            studentIntentionId: this.rosterId,
            examId: this.examId
          }
        })
      },
      examAdd(copyQuery) {
        return this.$http.post('exam_add', {
          ...copyQuery,
          examPhoto: this.fileList,
          studentIntentionId: this.rosterId
        })
      },
      examEdit(copyQuery) {
        return this.$http.post('exam_edit', {
          ...copyQuery,
          examPhoto: this.fileList,
          studentIntentionId: this.rosterId,
          examId: this.examId
        })
      },
      async EditInit() {
        try {
          const [data, subject, type, grades] = await Promise.all([this.examDetail(), this.getExamSubjects(), this.getExamTypes(), this.getGradeList()])
          if (!data.data || !subject.data || !type.data) return
          this.fileList = data.data.examPhotos.map(val => {
            return { url: val }
          })
          if (data.data.scoreType === '2') {
            data.data.grade = data.data.score
            data.data.score = ''
          }
          this.query = data.data
          this.options.subjects = subject.data
          this.options.types = type.data
          this.options.grades = grades.data
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      },
      async AddInit() {
        try {
          const [subject, type, grades] = await Promise.all([this.getExamSubjects(), this.getExamTypes(), this.getGradeList()])
          if (!subject.data || !type.data) return
          this.options.subjects = subject.data
          this.options.types = type.data
          this.options.grades = grades.data
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      },
      submitForm() {
        this.$refs['formRef'].validate(async(valid) => {
          if (valid) {
            this.isCanSearch = false
            const copyQuery = JSON.parse(JSON.stringify(this.query))
            if (!copyQuery.score && copyQuery.grade) {
              copyQuery.score = copyQuery.grade
              delete copyQuery.grade
            }
            let res
            try {
              if (this.isEdit) {
                res = await this.examEdit(copyQuery)
              } else {
                res = await this.examAdd(copyQuery)
              }
              if (!res.data) return
              this.$message.success(res.message)
              this.closeDialog()
              this.obtainInfo()
            } catch (e) {
              console.error(e)
            } finally {
              this.isCanSearch = true
            }
          } else {
            this.$message.warning('请完善内容！')
          }
        })
      },
      scoreValidator(rule, value, callback) {
        if (!this.query.grade && !value) return callback(new Error('考试得分或等级评分必填一项'))
        if (value && !/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) return callback(new Error('仅允许输入数字，且数字最多2位小数'))
        callback()
      },
      scoreTotalValidator(rule, value, callback) {
        if (value && !/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) return callback(new Error('仅允许输入数字，且数字最多2位小数'))
        callback()
      },
      numValidator(rule, value, callback) {
        if (value && !/^\d{0,4}$/g.test(value) || value === '0') {
          callback(new Error('最多4位且大于0'))
          return
        }
        callback()
      },
      handleGradeChange(value) {
        if (value) {
          this.$refs['form-score'].clearValidate()
        }
      },
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
      closeDialog() {
        this.$emit('update:isShow', false)
      },
      handleRemove(file) {
        if (file.status !== 'ready') {
          if (file.response) {
            this.removeByValue(this.fileList, file.response.data.url)
          } else {
            this.removeByValue(this.fileList, file.url)
          }
        }
      },
      removeByValue(arr, val) {
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i].url === val) {
            arr.splice(i, 1)
            break
          }
        }
      },
      handleExceed() {
        this.$message.warning('最多20张')
      },
      beforeAvatarUpload(file) {
        const isJPEG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isJPG = file.type === 'image/jpg'
        const isGIF = file.type === 'image/gif'
        const isBMP = file.type === 'image/bmp'
        const isLtM = file.size / 1024 / 1024 < 5
        if (!isJPG && !isJPEG && !isPNG && !isGIF && !isBMP) {
          this.$message.error('上传的图片格式有误，允许上传的图片格式为JPG,JPEG,PNG,GIF,BMP!')
          return false
        }
        if (!isLtM) {
          this.$message.error('上传图片大小不能超过 5MB!')
          return false
        }
        return true
      },
      // 拖拽
      startDrag(e) {
        e.originalEvent.dataTransfer.setData('Text', e.target.getAttribute('src'))
      },
      overdrag(e) {
        e.preventDefault()
      },
      drop(e) {
        e.preventDefault()
        const preId = e.originalEvent.dataTransfer.getData('Text')
        const curId = e.target.getAttribute('src')
        let preIndex, curIndex
        if (preId && curId) {
          this.fileList.forEach((val, index) => {
            if (val.url === preId) {
              preIndex = index
            }

            if (val.url === curId) {
              curIndex = index
            }
          })
        }
        if (preIndex !== undefined && curIndex !== undefined) {
          if (preIndex > curIndex) {
            [preIndex, curIndex] = [curIndex, preIndex]
          }
          this.fileList.splice(preIndex, 1, ...this.fileList.splice(curIndex, 1, this.fileList[preIndex]))// 交换数组2个位置
        }
      },
      uploadRequest(param) {
        const fileObj = param.file
        const form = new FormData()
        form.append('file', fileObj)
        axios.post(this.oldIPCHost, form, {
          process: function(event) {
            param.file.percent = event.loaded / event.total * 100
            param.onprogress(param.file)
          }
        }).then(res => {
          if (res.data.code === '0x000000') {
            if (res.data.data) {
              this.$message.success('文件上传成功！')
              this.fileList.push({ url: res.data.data.url })
            }
          } else {
            this.$message.error('文件上传失败，请重新上传！')
          }
        }).catch(res => {
          console.log(res)
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  .width-80
    width: 80%
</style>
<style lang="sass">
  .dialog-test-score
    .el-dialog-md
      width: 900px

    #upload
      .el-upload-list__item
        width: 100px
        float: left
        margin-right: 2%
      img
        cursor: all-scroll
      .el-icon-close-tip
        display: none
</style>
