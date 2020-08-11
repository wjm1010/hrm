<template>
  <div class="main-content" v-loading="allLoading">
    <el-form :model="queryObject" :rules="rules" ref="queryObject" label-width="150px" inline>
      <el-form-item label="一级渠道：" prop="resumeFirstChannel">
        <el-select v-model="queryObject.resumeFirstChannel" placeholder="请选择" :disabled="disabledFirstChannel" clearable @change="$emit('changeSecondChannel')">
          <el-option
            v-for="item in options.firstChannel"
            :key="item.channelId"
            :label="item.channelName"
            :value="item.channelId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级渠道：" prop="resumeSecondChannel">
        <el-select v-model="queryObject.resumeSecondChannel" :disabled="disabledSecondChannel"  filterable placeholder="请选择" clearable @change="changeSecondChannel">
          <el-option
            v-for="item in secondChannel"
            :key="item.channelId"
            :label="item.channelName"
            :value="item.channelId">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="投递方式：" prop="resumeInfoDeliveryType" v-if="queryObject.resumeFirstChannel === '2'">
        <el-select v-model="queryObject.resumeInfoDeliveryType" filterable placeholder="请选择" clearable>
          <el-option
            v-for="item in options.resumeInfoDeliveryType"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐人：" prop="resumeInfoReferee" v-if="queryObject.resumeFirstChannel === '13'">
        <el-input v-model="queryObject.resumeInfoReferee"></el-input>
      </el-form-item>
      <el-form-item label="推荐人工号：" prop="resumeInfoRefereePhone" v-if="queryObject.resumeFirstChannel === '13'">
        <el-input v-model="queryObject.resumeInfoRefereePhone" placeholder="工号/教师编号"></el-input>
      </el-form-item><br>
      <el-form-item label="毕业学校：" prop="resumeSchool" class="resumeSchool">
        <el-select
          @change="dealTeacherLevel(1)"
          v-model="queryObject.resumeSchool"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="RemoteMethod"
          :loading="allLoading">
          <el-option
            v-for="item in schoolIdOps"
            :key="item.schoolName"
            :label="item.schoolName"
            :value="item.schoolName">
          </el-option>
        </el-select>

        <span v-if="queryObject.resumeSchoolPropertyName">
          <i :class="{'color985':queryObject.resumeSchoolPropertyName === '985',
              'color211':queryObject.resumeSchoolPropertyName === '211'}"
              v-if="queryObject.resumeSchoolPropertyName.length<4">
              {{queryObject.resumeSchoolPropertyName}}
          </i>
          <span v-else>
            <i :class="{'color985':queryObject.resumeSchoolPropertyName.substring(0,3) === '985','color211':queryObject.resumeSchoolPropertyName.substring(0,3) === '211'}">
              {{queryObject.resumeSchoolPropertyName.substring(0,3)}}
            </i>
            <i :class="{'color985':queryObject.resumeSchoolPropertyName.substring(queryObject.resumeSchoolPropertyName.length-3) === '985','color211':queryObject.resumeSchoolPropertyName.substring(queryObject.resumeSchoolPropertyName.length-3) === '211'}">
              {{queryObject.resumeSchoolPropertyName.substring(queryObject.resumeSchoolPropertyName.length-3)}}
            </i>
          </span>
        </span>
      </el-form-item>
      <el-form-item label="专业：" label-width="75px">
        <el-input v-model="queryObject.resumeInfoSpecialty"></el-input>
      </el-form-item><br>
      <el-form-item label="毕业年份：">
        <el-input v-model="queryObject.resumeInfoFromGrade"></el-input>
      </el-form-item>
      <el-form-item label="学历：" prop="resumeInfoEducation">
        <el-select v-model="queryObject.resumeInfoEducation" placeholder="请选择" clearable>
          <el-option
            v-for="item in options.education"
            :key="item.id"
            :label="item.resumeInfoEducation"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="目前身份：" prop="resumeTeacherIdent">
        <el-select v-model="queryObject.resumeTeacherIdent" placeholder="请选择" clearable>
          <el-option
            v-for="item in options.teacherIdent"
            :key="item.id"
            :label="item.resumeTeacherIdent"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教师职级：" prop="resumeTeacherLevel">
        <el-select v-model="queryObject.resumeTeacherLevel" placeholder="请选择" clearable>
          <el-option
            v-for="item in options.level"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="应聘年级：" prop="resumeGrade">
        <el-select v-model="queryObject.resumeGrade" placeholder="请选择" clearable @change="$emit('changeGrade')">
          <el-option
            v-for="(item,index) in options.grade"
            :key="index"
            :label="index"
            :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应聘学科：" prop="resumeSubject" >
        <el-select v-model="queryObject.resumeSubject" placeholder="请选择" clearable @change="$emit('changeSubject', {resumeSubject: queryObject.resumeSubject, resumeSchool: queryObject.resumeSchool})">
          <el-option
            v-for="item in GRADE"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="所属教学部：">
        <el-select v-model="queryObject.resumeTeachingDept" placeholder="请选择" clearable>
          <el-option
            v-for="item in options.teachingDept"
            :key="item.teachingDeptId"
            :label="item.teachingDeptName"
            :value="item.teachingDeptId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作地点：">
        <el-input v-model="queryObject.resumeInfoWorkPlace" placeholder="省份+市，如四川成都"></el-input>
        <!--<el-select v-model="queryObject.resumeInfoWorkPlace" placeholder="请选择" clearable filterable>-->
          <!--<el-option-->
            <!--v-for="item in options.workPlace"-->
            <!--:key="item"-->
            <!--:label="item"-->
            <!--:value="item">-->
          <!--</el-option>-->
        <!--</el-select>-->
      </el-form-item><br>
      <el-form-item label="合同类型：" prop="resumeInfoContractType">
        <el-select v-model="queryObject.resumeInfoContractType" placeholder="请选择" clearable>
          <el-option
            v-for="item in options.contract"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作方式：">
        <el-select v-model="queryObject.reumeInfoWorkStyle" placeholder="请选择" clearable>
          <el-option
            v-for="item in options.workStyle"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="教师资格证：" prop="resumeInfoTeacherCert">
        <el-select v-model="queryObject.resumeInfoTeacherCert" placeholder="请选择" clearable>
          <el-option
            v-for="item in options.teacherCert"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重复报名时间：" >
        <el-date-picker
          disabled
          v-model="queryObject.resumeRepeatRegistTime"
          type="datetime"
          placeholder="选择日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item><br>
      <el-form-item label="上传简历：">
        <image-upload
          @resumeAddress="resumeAddress"
          :userName="queryObject.resumeName"
          :resumeId="queryObject.resumeId">
        </image-upload>
        <span style="color:#999">支持扩展名：.png .jpeg .doc .docx .pdf .jpg</span>
      </el-form-item><br>
      <el-form-item label="标签：">
        <span v-if="queryObject.resumeTagsName">
          <el-button size="small" v-for="item in queryObject.resumeTagsName.split(',')" :key="item" style="margin-right:10px">
            {{item}}
          </el-button>
          <el-button type="info" icon="el-icon-edit" @click="edit">编辑</el-button>
        </span>
        <el-button type="info" icon="el-icon-plus" v-else @click="add">新增</el-button>
      </el-form-item><br>
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          placeholder="请输入沟通内容"
          :maxlength="200"
          class="textarea"
          v-model.trim="queryObject.resumeInfoNote">
        </el-input>
      </el-form-item><br>
      <el-form-item>
        <el-button type="primary" :disabled="isCancearch" @click="submitForm('queryObject')" class="btn">确认提交</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="el-dialog-sl"
      :visible.sync="dialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-checkbox-group v-model="resumeTagsName">
          <el-checkbox v-for='item in Tag' :label="item.tagName" :key='item.tagName'>
          </el-checkbox>
        </el-checkbox-group>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subBtn">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ImageUpload from '@/components/FileUpload/imageUpload'

export default {
  name: 'basicInfor',
  data() {
    return {
      changeSelectResume: false,
      allLoading: false,
      isCancearch: false,
      rules: {
        resumeFirstChannel: [
          { required: true, message: '请选择一级渠道', trigger: 'change' }
        ],
        resumeSecondChannel: [
          { required: true, message: '请选择二级渠道', trigger: 'change' }
        ],
        resumeInfoDeliveryType: [
          { required: true, message: '请选择投递方式', trigger: 'change' }
        ],
        resumeSchool: [
          { required: true, message: '请输入毕业学校', trigger: 'change' }
        ],
        resumeInfoEducation: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ],
        resumeTeacherIdent: [
          { required: true, message: '请选择目前身份', trigger: 'change' }
        ],
        resumeGrade: [
          { required: true, message: '请选择应聘年级', trigger: 'change' }
        ],
        resumeSubject: [
          { required: true, message: '请选择应聘学科', trigger: 'change' }
        ],
        resumeInfoReferee: [
          { required: true, message: '请输入推荐人', trigger: 'change' }
        ],
        resumeInfoRefereePhone: [
          { required: false, message: '请输入推荐人手机号', trigger: 'change' }
        ],
        resumeInfoContractType: [
          { required: true, message: '请选择合同类型', trigger: 'change' }
        ],
        resumeInfoTeacherCert: [
          { required: true, message: '请选择教师资格证', trigger: 'change' }
        ]
      },
      Tag: [],
      dialogVisible: false,
      title: '',
      resumeTags: [],
      resumeTagsName: [],
      schoolIdOps: []
    }
  },
  props: {
    disabledFirstChannel: Boolean,
    disabledSecondChannel: Boolean,
    userId: String,
    queryObject: Object,
    options: {
      type: Object,
      required: true
    },
    GRADE: Array,
    secondChannel: Array
  },
  components: {
    ImageUpload
  },
  created() {
    if (this.userId) {
      this.rules.resumeTeacherLevel = [
        { required: true, message: '请选择教师职级', trigger: 'change' }
      ]
    }
    this.getTags()
  },
  methods: {
    changeSecondChannel() {
      this.rules.resumeInfoRefereePhone[0].required = false
      if (this.queryObject.resumeSecondChannel === '231') {
        this.rules.resumeInfoRefereePhone[0].required = true
      }
    },
    dealTeacherLevel() {
      this.queryObject.resumeTeacherLevel = ''
      const school = ['清华大学', '北京大学']
      if (this.queryObject.resumeProperty === '兼职' && school.includes(this.queryObject.resumeSchool)) {
        this.queryObject.resumeTeacherLevel = 'S3'
      }
    },
    RemoteMethod(val) {
      if (val !== '') {
        this.allLoading = true
        setTimeout(() => {
          this.allLoading = false
          this.$http.post('public_schoolSearch', { schoolName: val }).then(res => {
            this.schoolIdOps = res.data
          }).catch(console.log)
        }, 200)
      } else {
        this.schoolIdOps = []
      }
    },
    resumeAddress(val) {
      this.queryObject.resumeInfoAppendix = val
    }, // 上传简历的地址
    edit() {
      this.title = '编辑标签'
      this.dialogVisible = true
      this.resumeTagsName = this.queryObject.resumeTagsName.split(',')
    },
    add() {
      this.title = '新增标签'
      this.dialogVisible = true
    },
    subBtn() {
      this.dialogVisible = false
      this.queryObject.resumeTagsName = this.resumeTagsName.toString()
      for (var item in this.Tag) {
        this.resumeTagsName.map(key => {
          if (key === this.Tag[item].tagName) {
            this.resumeTags.push(this.Tag[item].tagId)
          }
        })
      }
    },
    getTags() {
      this.$http.post('public_getTag', { tagStatus: '1' }).then(res => {
        if (res.data) {
          this.Tag = res.data.data
        }
      }).catch(console.log)
    },
    submitForm(formName, isCheck = false) {
      if (!this.queryObject.resumeName || !this.queryObject.resumeProperty || !this.queryObject.resumePhone || !this.queryObject.resumeInfoQQ || !this.queryObject.resumeInfoEmail) {
        this.$message.warning('请完善基础信息！')
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isCancearch = true
          if (this.queryObject.resumeFirstChannel !== '2') {
            this.queryObject.resumeInfoDeliveryType = ''
          }
          const _query = Object.assign({}, this.queryObject)
          if (this.resumeTags.length > 0) {
            _query.resumeTags = this.resumeTags.toString()
          }
          this.$delete(_query, 'resumeTagsName')
          this.$delete(_query, 'resumeFirstChannelName')
          this.$delete(_query, 'resumeInfoContractTypeName')
          this.$delete(_query, 'resumeInfoEducationName')
          this.$delete(_query, 'resumeSchoolPropertyName')
          this.$delete(_query, 'resumeTeachingDeptName')
          this.$delete(_query, 'resumeSecondChannelName')
          this.$delete(_query, 'reumeInfoWorkStyleName')
          this.$delete(_query, 'resumeStatus')
          this.$delete(_query, 'resumeStatusName')
          this.$delete(_query, 'resumeSchoolProperty')
          this.$http.post('resume_ResumeAddUpdate', _query).then(res => {
            if (res.data) {
              this.$message.success(res.message)
              this.$emit('resumeId', res.data[0])
              this.$emit('refresh-status')
              this.$eventBus.$emit('refresh-sidebar')
              if (this.userId) return // 编辑不用跳转
              this.$store.dispatch('delVisitedViews', this.$route).then(() => {
                this.$router.push(this.$route.query.backurl)
              })
            }
          }).catch(console.log).finally(() => {
            this.isCancearch = false
          })
        } else {
          this.$message.warning('请完善基础信息！')
          return false
        }
      })
    }
  },
  watch: {
    // 内部推荐-内部推荐渠道：推荐人&手机号都必填。内部推荐-其他二级渠道：手机号不必填
    'queryObject.resumeSecondChannel'(val) {
      if (val === '231') {
        this.rules.resumeInfoRefereePhone[0].required = true
      }
    }
  }

}
</script>
<style lang="sass" scoped>
.color985,.color211
  display: inline-block
  padding: 5px
  line-height: 10px
  font-size: 12px
.color985
  border: 1px solid #0099CC
  color: #0099CC
.color211
  border: 1px solid #FF6600
  color: #FF6600
.el-input
  width: 200px
.btn
  width: 150px
  margin: 30px
.el-checkbox-group
  .el-checkbox
    line-height: 30px
    margin: 0
    text-align: left
    width: 50%
.resumeSchool
  width: 421px
</style>
<style lang="sass">
.textarea
  .el-textarea__inner
    height: 100px !important
    width: 550px
</style>

