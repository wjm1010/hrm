<template>
  <el-form
    :model="query"
    ref="form"
    label-position="left"
    label-width="120px"
    :rules="rules"
    v-loading="allLoading"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="申请学科" prop="subjectId">
          <el-select v-model="query.subjectId" clearable filterable @change="subjectChange">
            <el-option
              v-for="item in options.subjectIdOps"
              :key="item.subject_id"
              :label="item.subject_name"
              :value="item.subject_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="课程名称" prop="currPlanId">
          <el-select v-model="query.currPlanId" clearable filterable @change="courseChange">
            <el-option
              v-for="(value, key) in options.currPlanIdOps"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="课程版本" prop="currPlanPropertyId">
          <el-select v-model="query.currPlanPropertyId" clearable filterable>
            <el-option
              v-for="(value, key) in options.currPlanPropertyIdOps"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="双方是否确认" prop="bothIsConfirmed">
          <el-radio-group v-model="query.bothIsConfirmed" @change="bothConfirmChange">
            <el-radio label="2">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-if="query.bothIsConfirmed === '1'">
        <el-form-item label="是否指定老师" prop="isAppointTeacher">
          <el-radio-group
            v-model="query.isAppointTeacher"
            @change="assignTeacherChange">
            <el-radio label="2">是</el-radio>
            <el-radio label="1" :disabled="query.bothIsConfirmed === '2'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="query.bothIsConfirmed === '2' || query.isAppointTeacher === '2'">
        <el-form-item
          :label="teacherRemote.label"
          :rules="teacherRemote.rules"
          prop="teacherId"
          ref="noOrderTeacherId">
          <el-select
            v-model="query.teacherId"
            clearable
            filterable
            :loading="teacherNameLoading"
            :remote="teacherRemote.remote"
            :placeholder="teacherRemote.placeholder"
            :remote-method="teacherRemoteMethodDebounce"
            @change="teacherIdChange"
          >
            <el-option
              v-for="(value, key) in options.teacherIdOps"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
          <el-button type="text" v-if="this.query.teacherId" @click="lookTeacherCourse">查看教师课表</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="query.isAppointTeacher === '1'">
      <el-col :span="8">
        <el-form-item label="性别要求" prop="teacherSex">
          <el-radio-group v-model="query.teacherSex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="3">无性别要求</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="授课风格" prop="instructionType">
          <el-checkbox-group v-model="query.instructionType">
            <el-checkbox label="2">活泼</el-checkbox>
            <el-checkbox label="5">幽默</el-checkbox>
            <el-checkbox label="4">温柔</el-checkbox>
            <el-checkbox label="3">稳重</el-checkbox>
            <el-checkbox label="1">严厉</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="9">
        <el-form-item label="试听首课时间" prop="date">
          <el-date-picker
            v-model="query.date"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="4.5">
        <el-form-item prop="tryStartTime" label-width="0">
          <el-time-select
            placeholder="起始时间"
            @change="resetEndTime"
            v-model="query.tryStartTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:45'
            }">
          </el-time-select>
        </el-form-item>
      </el-col>

      <el-col :span="7">
        <el-form-item prop="tryEndTime" label-width="0">
          <el-time-select
            placeholder="结束时间"
            prop="tryEndTime"
            v-model="query.tryEndTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:45',
              minTime: query.tryStartTime
            }">
          </el-time-select>
        </el-form-item>
      </el-col>
    </el-row>

    <p style=" font-size: 14px; color: #666 ">正式课时间：</p>

    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有规律" prop="isSort">
          <el-radio-group v-model="query.isSort">
            <el-radio label="2">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import { debounce } from '@/lib/lodash.js'

  export default {
    name: 'publicForm',
    props: {
      query: {
        required: true,
        type: Object
      },
      studentIntentionId: {
        required: true
      },
      strategyId: { // 编辑传id
        default: ''
      },
      contractType: { // 合同类型
        required: true
      },
      isContractTypeChange: {
        required: true
      }
    },
    data() {
      return {
        teacherName: '',
        teacherNameLoading: false,
        allLoading: false,
        rules: {
          bothIsConfirmed: { required: true, message: '请选择' },
          isAppointTeacher: { required: true, message: '请选择' },
          teacherId: { required: true, message: '请选择' },
          subjectId: { required: true, message: '请选择' },
          currPlanId: { required: true, message: '请选择' },
          currPlanPropertyId: { required: true, message: '请选择' },
          isSort: { required: true, message: '请选择' },
          teacherSex: { required: true, message: '请选择' },
          instructionType: { required: true, message: '请选择' },
          date: { required: true, message: '请选择' },
          tryStartTime: { required: true, message: '请选择' },
          tryEndTime: { required: true, message: '请选择' }
        },
        options: {
          teacherIdOps: {},
          subjectIdOps: {},
          currPlanIdOps: {},
          currPlanPropertyIdOps: {}
        },
        teacherRemote: {
          label: '选择教师',
          placeholder: '请选择',
          remote: false,
          rules: { required: true, message: '请选择' }
        }
      }
    },
    created() {
      this.teacherRemoteMethodDebounce = debounce(this.teacherRemoteMethod, 1500)
      if (this.strategyId) {
        this.allLoading = true
        this.editInit()
      } else {
        // this.sexAndTypeInit()
        this.applySubjectData()
      }
    },
    methods: {
      // api
      getDefaultTeacherInfo() {
        return this.$http.get('subject_getExtendTeacher', {
          params: {
            studentIntentionId: this.studentIntentionId,
            type: 2
          }
        })
      },
      getDefaultTeacher() {
        let teacherId = this.query.teacherId
        if (this.query.bothIsConfirmed === '2') {
          teacherId = ''
        } else if (this.query.bothIsConfirmed === '1' && teacherId === '' && this.strategyId) {
          return { data: '' }
        }
        return this.$http.get('subject_getExtendTeacher', {
          params: {
            subjectId: this.query.subjectId,
            type: 2
          }
        })
      },
      getApplySubject() {
        return this.$http.get('subject_getExtendSubject', {
          params: {
            studentIntentionId: this.studentIntentionId,
            type: 2
          },
          isFilterUrl: true
        })
      },
      getCoursePacks() {
        return this.$http.get('courseApplication_getCoursePacks', {
          params: {
            subjectId: this.query.subjectId,
            contractType: this.contractType
          }
        })
      },
      getCourseVersion() {
        return this.$http.get('courseApplication_getCourseVersion', {
          params: {
            currPlanId: this.query.currPlanId
          }
        })
      },
      getTeacher(teacherInfo) {
        return this.$http.get('courseApplication_getTeacher', {
          params: {
            studentIntentionId: this.studentIntentionId,
            teacherInfo,
            subjectId: this.query.subjectId
          }
        })
      },
      // edit init
      async editInit() {
        await Promise.all([this.defaultTeacherData(), this.applySubjectData(), this.coursePacksData(), this.courseVersionData()])
        this.allLoading = false
      },
      async sexAndTypeInit() {
        try {
          const { data } = await this.getDefaultTeacherInfo()
          if (!data) {
            return
          }
          this.query.teacherSex = data.teacherSex
          this.query.instructionType = data.instructionType
        } catch (e) {
          console.log(e)
          this.$message.error('数据错误')
        }
      },
      // 远程搜索老师数据
      teacherData(teacherInfo) {
        this.teacherNameLoading = true
        return this.getTeacher(teacherInfo).then(res => {
          if (res.data) {
            this.options.teacherIdOps = res.data
          }
        }).catch(console.log).finally(() => {
          this.teacherNameLoading = false
        })
      },
      // 默认老师数据
      async defaultTeacherData() {
        try {
          const { data } = await this.getDefaultTeacher()
          if (!data) {
            return
          }
          this.options.teacherIdOps = data.teacher
        } catch (e) {
          console.log(e)
          this.$message.error('数据错误')
        }
      },
      // 申请学科数据
      applySubjectData() {
        return this.getApplySubject().then(res => {
          if (res.data) {
            this.options.subjectIdOps = res.data
          }
        })
      },
      // 课程名称数据
      coursePacksData() {
        return this.getCoursePacks().then(res => {
          if (res.data) {
            this.options.currPlanIdOps = res.data
          }
        })
      },
      // 课程版本数据
      courseVersionData() {
        return this.getCourseVersion().then(res => {
          if (res.data) {
            this.options.currPlanPropertyIdOps = res.data
          }
        })
      },
      /* event */
      // 双方是否确认 change
      bothConfirmChange(val) {
        if (val === '2') {
          this.query.isAppointTeacher = '2'
          // this.assignTeacherChange('2')
        }
      },
      // 是否指定老师 change
      assignTeacherChange(val) {
        this.query.teacherId = ''
        this.options.teacherIdOps = {}
        this.$refs['noOrderTeacherId'] && this.$refs['noOrderTeacherId'].clearValidate()
        this.teacherIdChange()

        if (val === '2') {
          this.defaultTeacherData()
        }
      },
      // 教师姓名 远程搜索
      teacherRemoteMethod(val) {
        if (val.trim()) {
          this.teacherData(val.trim())
        } else {
          this.options.teacherIdOps = {}
        }
      },
      // 教师姓名 change
      teacherIdChange(val) {
        if (val || this.query.isAppointTeacher === '1') {
          this.applySubjectData()
        }
      },
      // 申请学科 change
      subjectChange(val) {
        this.query.currPlanId = ''
        this.options.currPlanIdOps = {}
        this.query.teacherId = ''
        this.options.teacherIdOps = {}
        this.courseChange()
        this.query.subjectId && this.defaultTeacherData()
        val && this.coursePacksData()
      },
      // 课程名称 change
      courseChange(val) {
        this.query.currPlanPropertyId = ''
        this.options.currPlanPropertyIdOps = {}
        val && this.courseVersionData()
      },
      // 查看教师课表
      lookTeacherCourse() {
        for (var key in this.options.teacherIdOps) {
          if (key === this.query.teacherId) {
            this.teacherName = this.options.teacherIdOps[key]
            break
          }
        }
        this.$router.push({ path: `/lessonplanDetails/teacherSchedule/${this.query.teacherId}`, query: { teacherInfo: this.teacherName }})
      },
      resetEndTime() {
        this.query.tryEndTime = ''
      }
    },
    watch: {
      'isContractTypeChange'(val) {
        if (val) {
          this.subjectChange(this.query.subjectId)
          this.$emit('update:isContractTypeChange', false)
        }
      }
    }
  }
</script>
