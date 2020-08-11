<template>
  <div>    
    <el-form
      ref="query"
      :model="query"
      inline
      :rules="rules"
      label-width="100px">
      <ul style="border: 1px solid #D1D5DE;padding: 10px  0">        
        <el-row>
        <el-button type="palin" style="position: absolute; top: -11px;right: 0%" @click="showDialog(index)">删除</el-button>
        <el-col :span="12">
          <el-form-item label="科目：" prop="subjectId">
            <el-select
              v-model="query.subjectId" 
              @change="changeSubjectEvent"
              clearable
              placeholder="请选择"
              :disabled="query.id && query.subjectId !== ''">
              <el-option
                v-for="(item, index) in options.subject"
                :key="index"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="btnExamination(query)">考情分析</el-button>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="教材版本：" prop="versionId">
            <el-select v-model="query.versionId" clearable :disabled="query.id && query.versionId !== ''" placeholder="请选择">
              <el-option
                v-for="(item, index) in version"
                :key="index"
                :label="item.version_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="learningAnalysis(query)">学情分析</el-button>
        </el-col>                   
      </el-row>      
      <el-row>
        <el-col :span="12">
          <el-form-item label="考试分数：" prop="scoresTotal">
            <el-input v-model="query.scores" placeholder="分数" style="width: 95px"></el-input>
            <span>/</span>
            <el-input v-model="query.scoresTotal" placeholder="总分" style="width: 95px"></el-input>
          </el-form-item>          
        </el-col>
        <el-col :span="12">
          <el-form-item label="班级排名：">
            <el-select v-model="query.classRank" clearable placeholder="请选择">
              <el-option
                v-for="(item, index) in options.classRank"
                :key="index"
                :label="item.val"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>    
        </el-col>
      </el-row>  
      <el-row>    
        <el-col :span="8">
          <el-form-item label="年级排名：">
            <el-select v-model="query.gradeRank" clearable placeholder="请选择">
              <el-option
                v-for="(item, index) in options.gradeRank"
                :key="index"
                :label="item.val"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>    
        </el-col>
      </el-row>
      </ul>                       
    </el-form>

    <centerDialog
      v-if="dialogRetrieveList.show"
      :body-message="dialogRetrieveList.messageBody"
      :is-show.sync="dialogRetrieveList.show"
      @yes-event="deleteEvent">
    </centerDialog>
  </div>    
</template>
<script>
import centerDialog from '@/components/dialog/centerDialog.vue'
export default {
  components: {
    centerDialog
  },
  props: {
    query: {
      required: true
    },
    studentInfo: {
      required: true
    },
    options: {
      required: true
    },
    index: {
      required: true
    },
    learnSituation: {
      required: true
    },
    rosterId: {
      required: true
    }

  },
  data() {
    return {
      dialogRetrieveList: {
        messageBody: `是否要删除？`,
        show: false
      },
      version: [],
      rules: {
        subjectId: {
          required: true, message: '请选择科目', trigger: 'change'
        },
        versionId: {
          required: true, message: '请选择教材版本', trigger: 'change'
        },
        scoresTotal: {
          validator: this.totalScoreValidate
        }
      },
    }
  },
  watch: {
    'studentInfo.province_id'(val) {
      if (val) {
        if (!this.query.id) { // 新增的学习情况才会触发
          this.query.versionId = ''
          this.version = []
          this.getValueOfVersion()
        }
      }
    },
    'studentInfo.city_id'(val) {
      if (val) {
        if (!this.query.id) { // 新增的学习情况才会触发
          this.query.versionId = ''
          this.version = []
          this.getValueOfVersion()
        }
      }
    },
    'studentInfo.grade_id'(val) {
      if (val) {
        if (!this.query.id) { // 新增的学习情况才会触发
          this.query.versionId = ''
          this.version = []
          this.getValueOfVersion()
        }
      }
    }
  },
  computed: {

  },
  mounted() {
  },
  created() {
    this.getValueOfVersion()
  },
  methods: {
    showDialog(index) {
      this.clickIndex = index
      this.dialogRetrieveList.show = true
    },
    changeSubjectEvent(val) {
      this.query.versionId = ''
      this.version = []
      if (val) {
        this.getValueOfVersion(val)
      }
      var index = 0
      this.studentInfo.studyState.forEach(obj => {
        if (obj.subjectId === this.query.subjectId) {
          index++
        }
      })
      if (index >= 2) {
        this.$message.warning('学科不能重复')
      }
    },
    getValueOfVersion(val) {
      if (this.query.subjectId !== '' && this.studentInfo.province_id !== '' && this.studentInfo.city_id !== '' && this.studentInfo.grade_id !== '') {
        this.getVersion(val)
      }
    },
    getVersion(val) {
      if (this.query.subjectId === undefined) { return }
      this.$http.get('student_getBookVersion', {
        params: {
          provinceId: this.studentInfo.province_id,
          cityId: this.studentInfo.city_id,
          gradeId: this.studentInfo.grade_id,
          subjectId: this.query.subjectId,
        }, isFilterUrl: true
      }).then(res => {
        if (res.data) {
          this.version = res.data
          if (val) {
            this.query.versionId = res.data[0].id
          }
        } else {
          return
        }
      }).catch(console.log)
    },
    deleteEvent() {
      this.learnSituation.splice(this.clickIndex, 1)
    },
    learningAnalysis(item) {
      this.canSearch = false
      this.$http.get('student_getLearnInfo', {
        params: {
          isBuried: '1',
          pageSourceType: '1',
          actionId: '7',
          provinceId: this.studentInfo.province_id,
          cityId: this.studentInfo.city_id,
          regionId: this.studentInfo.country_id,
          actionBaseAttrId: item.versionId,
          studentIntentionId: this.rosterId,
          bookVersionId: item.versionId,
          gradeId: this.studentInfo.grade_id,
          subjectId: item.subjectId
        }
      }).then(res => {
        if (res.data && res.data.length) {
          window.open(res.data[0].pdf_url)
        } else {
          this.$message.warning('暂无数据')
        }
      }).catch(console.log).finally(() => {
        this.canSearch = true
      })
    },
    btnExamination(item) {
      this.canSearch = false
      this.$http.post('student_getTestInfo', {
        isBuried: '1',
        pageSourceType: '1',
        actionId: '6',
        actionBaseAttrId: item.subjectId,
        studentIntentionId: this.rosterId,
        provinceId: this.studentInfo.province_id,
        gradeId: this.studentInfo.grade_id,
        subjectId: item.subjectId,
        cityId: this.studentInfo.city_id,
        regionId: this.studentInfo.country_id,
      }).then(res => {
        if (res.data && res.data.id) {
          this.$router.push({ path: `/schoolSituation/examination/${this.rosterId}`, query: {
            isBuried: '1',
            pageSourceType: '1',
            actionId: '6',
            actionBaseAttrId: item.subjectId,
            studentIntentionId: this.rosterId,
            provinceId: this.studentInfo.province_id,
            gradeId: this.studentInfo.grade_id,
            subjectId: item.subjectId,
            cityId: this.studentInfo.city_id,
            regionId: this.studentInfo.country_id,
          }})
        } else {
          this.$message.warning('暂无数据')
        }
      }).catch(console.log).finally(() => {
        this.canSearch = true
      })
    },
    // 分数验证
    totalScoreValidate(rule, value, callback) {
      if (+value >= +this.query.scores) {
        callback()
      } else {
        callback(new Error('总分不得小于分数'))
      }
    }
  }
}
</script>
<style lang="sass" scoped>

</style>


