<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <h4>学习情况</h4>
    <div class="learningStatus">
      <el-button type="text" @click="showDialogFormVisible">新增学习状况</el-button>
    </div>
    <el-row class="body" v-for="(item,index) in learningCondition" :key="index">
      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">学科</span>
          <span class="text">{{item.subject_name}}</span>
        </li>
        <li class="body-column width-33">
          <span class="label">学科所属年级</span>
          <span class="text">{{item.grade_name}}</span>
        </li>
        <li class="body-column width-other">
          <span class="label">所有教材版本</span>
          <span class="text">{{item.text_bookVersion_name}}</span>
        </li>
      </ul>

      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">学科最近分数</span>
          <span class="text">{{item.score}}</span>
        </li>
        <li class="body-column width-70" style="display:block !important">
          <span class="label">学科试卷截图</span>
          <span class="text" v-for="(key,index) in item.url" :key="index" @click="skip(key)" style="color: #409EFF;
      cursor: pointer">{{key}}</span>
        </li>
      </ul>

      <ul class="body-row">
        <li class="body-column width-100">
          <span class="label">学科学习情况</span>
          <span class="text">{{item.remark}}</span>
        </li>
      </ul>
    </el-row>

    <div class="dialog">
      <el-dialog
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        custom-class="el-dialog-lg"
        title="学习状况"
        @close="closeDialogEvent">
        <el-form
          :model="query"
          ref="query"
          :rules="rules"
          class="ClassFrom"
          v-loading="loading"
          label-width="120px"
          label-position="left"
          inline>
          <el-form-item prop="subjectId" label="学科">
            <el-select v-model="query.subjectId" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in options.subject"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gradeId" label="学科所属年级" class="interval">
            <el-select v-model="query.gradeId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in options.grade"
                :key="item.code"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item><br>
          <el-form-item prop="score" label="学科最近分数">
            <el-input
              style="width:251px"
              v-model.trim="query.score"
              placeholder="分数不超过3位整数，1位小数"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item prop="bookVersionId" label="学科教材版本" class="interval" style="margin:0">
            <el-select v-model="query.bookVersionId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in options.version"
                :key="item.code"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item><br>
          <el-form-item prop="remark" label="学科学习情况" class="intervalContent">
            <el-input
              style="width:200px"
              type="textarea"
              placeholder="最多输入500字"
              :maxlength="500"
              v-model.trim="query.remark"
              clearable>
            </el-input>
          </el-form-item><br>
          <el-form-item label="科学试卷截图" style="position: relative">
            <image-upload
              @file-list="fileList"
              :isFileListInfo.sync="isFileListInfo">
            </image-upload>
            <span style="color:red;position: absolute;left: 100px;top: 12px;width: 500px">图片类型为png、jpg、jpeg，图片大小不超过20M，图片最多不超过30张</span>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialogEvent">取消</el-button>
          <el-button type="primary" @click="saveGoBtn" :disabled="!canSearch">保存并继续</el-button>
          <el-button type="primary" @click="saveBtn" :disabled="!canSearch">保存</el-button>
        </div>

      </el-dialog>
    </div>


  </div>
</template>

<script>
  import ImageUpload from '@/components/FileUpload/imageUpload'
  export default {
    name: 'unorderInfo',
    components: {
      ImageUpload
    },
    props: {
      rosterId: {
        required: true
      }
    },
    data() {
      return {
        learningCondition: [],
        dialogFormVisible: false,
        canSearch: true,
        loading: true,
        isFileListInfo: true,
        filePic: [],
        options: {
          grade: [],
          subject: [],
          version: []
        },
        query: {
          'gradeId': '',
          'subjectId': '',
          'score': '',
          'bookVersionId': '',
          'remark': ''
        },
        rules: {
          gradeId: [
            {
              required: true, message: '请选择学科！', trigger: 'change'
            }
          ],
          subjectId: [
            {
              required: true, message: '请选择学科所属年级！', trigger: 'change'
            }
          ],
          score: [
            {
              required: true, trigger: 'change', validator: this.checkScore
            }
          ],
          bookVersionId: [
            {
              required: true, message: '请选择学科教材版本！', trigger: 'change'
            }
          ],
          remark: [
            {
              required: true, message: '请输入学科学习情况！', trigger: 'change'
            }
          ]
        }
      }
    },
    computed: {
    },
    filters: {

    },
    mounted() {
    },
    created() {
      this.getInfo()
    },
    methods: {
      skip(key) {
        window.open(key, '_blank')
      },
      checkScore(rule, value, callback) {
        if (!value) {
          return callback(new Error('请输入学科最近分数！'))
        }
        var reg1 = /(^[0-9]{1,3}$)|(^[0-9]{1,3}[\.]{1}[0-9]$)/
        if (reg1.test(value) === false || value < 0) {
          callback(new Error('分数输入格式不正确！'))
        }
        callback()
      },
      getInfo() {
        this.$http.get('courseApplication_getLearnDetail', {
          params: {
            studentIntentionId: this.rosterId
          }
        }).then((res) => {
          if (res.data) {
            this.learningCondition = res.data
          }
        }).catch(console.log)
      },
      fileList(msg) {
        this.filePic = msg
      },
      showDialogFormVisible() {
        this.dialogFormVisible = true
        this.loading = true
        this.$set(this, 'isFileListInfo', true)
        this.$http.get('courseApplication_getStudentStudyWhere').then(res => {
          if (res.data) {
            this.options = res.data
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      },
      closeDialogEvent() {
        this.dialogFormVisible = false
        this.$refs['query'].resetFields()
        this.$set(this, 'isFileListInfo', false)
        this.filePic = []
      },
      saveGoBtn() {
        this.$refs['query'].validate((valid) => {
          if (valid) {
            this.canSearch = false
            const _query = Object.assign({}, this.query)
            _query.studentIntentionId = this.rosterId
            _query.url = this.filePic
            this.$http.post('courseApplication_saveStudyInfo', _query).then(res => {
              if (res.data) {
                this.getInfo()
                this.$refs['query'].resetFields()
                this.filePic = []
                this.$set(this, 'isFileListInfo', false)
                this.$message.success('添加学习状况成功')
              }
            }).catch(console.log).finally(() => {
              this.canSearch = true
            })
          } else {
            this.$message.warning('提交失败')
            return false
          }
        })
      },
      saveBtn() {
        this.$refs['query'].validate((valid) => {
          if (valid) {
            this.canSearch = false
            const _query = Object.assign({}, this.query)
            _query.studentIntentionId = this.rosterId
            _query.url = this.filePic
            this.$http.post('courseApplication_saveStudyInfo', _query).then(res => {
              if (res.data) {
                this.getInfo()
                this.$message.success('添加学习状况成功')
              }
            }).catch(console.log).finally(() => {
              this.canSearch = true
              this.dialogFormVisible = false
            })
          } else {
            this.$message.warning('提交失败')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/lessonplanDetails/detail/learning.sass'
</style>
