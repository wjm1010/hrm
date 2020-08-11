<template>
	<div class="dashboard-container">
    <div v-if="showMaterial">
      <basic-info
      :studentId="studentId"
      ref="basicInfo"
      :query="query"
      :rosterId="rosterId"
      :options="options"
      :gradeRules="gradeRules"
      @changeGrage='changeGrage'
      v-loading="loading">
		</basic-info>
		<goal-school
      ref="goalSchool"
      :student-info="query"
      :rosterId="rosterId"
      :options="options"
      :learningPeriod='learningPeriod'
      :goalSchools="query.targetSchool">
    </goal-school>
		<learn-situation
      ref="learnSituation"
      :student-info="query"
      :rosterId="rosterId"
      :learnSituation="query.studyState"
      :allOptions="options">
    </learn-situation>
    <div class="pos-margin">
      <el-button type="primary" plain @click="materialCancleEvent">取消</el-button>
      <el-button type="primary" class="margin-left" @click="materialSubmitEvent">保存</el-button>
    </div>
    </div>
	</div>
</template>
<script>
import BasicInfo from './material/basicInfo.vue'
import GoalSchool from './material/goalSchool'
import LearnSituation from './material/learnSituation'
export default {
  name: 'rostermaterial',
  components: {
    BasicInfo,
    GoalSchool,
    LearnSituation
  },
  data() {
    return {
      query: {
        name: '',
        date: '',
        sex: '',
        subject_name: '',
        birthday: '',
        phone: '',
        parent_relationship: '',
        number_personal: '',
        extra_phone: [],
        student_qq: '',
        email: '',
        grade_id: '',
        studentExamId: '',
        present_school: '',
        present_school_id: '',
        province_id: '',
        city_id: '',
        country_id: '',
        targetSchool: [],
        studyState: []
      },
      options: {
        subject_name: [],
        belongTo: [],
        getDevice: [],
        provinceIds: [],
        cityIds: [],
        countyIds: [],
        grade: [],
        studentExamTypes: [],
        presentSchool: [],
        goalSchools: [],
        studyState: [],
        version: []
      },
      studentId: '',
      rosterId: '',
      loading: '',
      canSearch: '',
      showMaterial: false,
      learningPeriod: '',
      gradeRules: {
        '0': '高中',
        '1': '高中',
        '2': '高中',
        '3': '初中',
        '4': '初中',
        '5': '初中',
        '6': '小学',
        '7': '小学',
        '8': '小学',
        '9': '小学',
        '10': '小学',
        '11': '小学',
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    studentInfoApi() {
      return this.$http.get('student_getStudentInformation', {
        params: {
          student_intention_id: this.rosterId
        },
        isFilterUrl: true
      })
    },
    async init() {
      this.loading = true
      this.canSearch = false
      this.rosterId = this.$route.params.rosterId
      try {
        const [infoApi, getListProvince, getGrade, getbelongto, getdevice, getSchools, getLearnSituation, getExamType] = await Promise.all([this.studentInfoApi(), this.getStudentGetListProvince(), this.getStudentGetGrade(), this.getStudentBelongTo(), this.getStudentDevice(), this.getSchools(), this.getLearnSituation(), this.getExamTypeApi()])
        if (!infoApi.data || !getListProvince.data || !getGrade.data || !getbelongto.data || !getSchools.data || !getdevice.data || !getLearnSituation.data || !getExamType.data) {
          return this.$message.error('获取学生信息失败')
        }
        const _item = this.materialChangeDate(infoApi.data.info)
        this.studentId = infoApi.data.info.student_id
        if (!_item.present_school_id) {
          _item.present_school_id = _item.present_school
          _item.present_school = ''
        }

        this.query = {
          ...this.query,
          ..._item
        }

        this.query.targetSchool = getSchools.data.list
        this.query.studyState = getLearnSituation.data.list
        if (this.query.studyState.length === 0) {
          this.situationAddEvent()
        }

        this.options.provinceIds = getListProvince.data
        this.options.grade = getGrade.data
        this.options.belongTo = getbelongto.data
        this.options.getDevice = getdevice.data
        this.options.studentExamTypes = getExamType.data
        this.learningPeriod = this.gradeRules[String(this.query.grade_id)]

        let yearPromise, cityPromise, areaPromise
        const {
          province_id, city_id
        } = infoApi.data.info
        if (province_id) { // 有省获取市
          cityPromise = this.getOptionsOfCity(province_id)
        }
        if (city_id) { // 有市获取区
          areaPromise = this.getOptionsOfArea(city_id)
        }
        await Promise.all([yearPromise, cityPromise, areaPromise])
      } catch (e) {
        console.log(e)
        this.$message.error('获取学生信息失败')
      } finally {
        this.showMaterial = true
        this.loading = false
        this.canSearch = true
      }
    },
    materialChangeDate(item) {
      item.grade_id = item.grade_id === '' ? '' : +item.grade_id
      return item
    },
    // 省
    getStudentGetListProvince() {
      return this.$http.get('student_getListProvince', { isFilterUrl: true })
    },
    getStudentGetGrade() {
      return this.$http.get('student_getGrade')
    },
    getStudentBelongTo() {
      return this.$http.get('student_getNumberPersonal')
    },
    getStudentDevice() {
      return this.$http.get('student_getDevice')
    },
    getExamTypeApi() {
      return this.$http.get('student_getStudentExamType', {
        isFilterUrl: true
      })
    },
    // 市
    getStudentGetCity(id) {
      return this.$http.get('student_getCity', {
        params: {
          province_id: id
        },
        isFilterUrl: true
      })
    },
    getOptionsOfCity(id) {
      return this.getStudentGetCity(id).then(res => {
        if (res.data) {
          this.options.cityIds = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('获取市信息失败')
      })
    },
    // 区
    getStudentGetArea(id) {
      return this.$http.get('student_getArea', {
        params: {
          city_id: id
        },
        isFilterUrl: true
      })
    },
    getOptionsOfArea(id) {
      return this.getStudentGetArea(id).then(res => {
        if (res.data) {
          this.options.countyIds = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('获取区信息失败')
      })
    },
    getSchools() {
      return this.$http.get('student_targetSchoolEdit', {
        params: {
          studentIntentionId: this.rosterId
        }
      })
    },
    getLearnSituation() {
      return this.$http.get('student_studyState', {
        params: {
          studentIntentionId: this.rosterId
        }
      })
    },
    situationAddEvent() {
      this.query.studyState.push({
        classRank: '', gradeRank: '', versionId: '', scores: '', scoresTotal: '', subjectName: '', versionName: ''
      })
    },
    checkExamType(obj) {
      const temp = { ...obj }
      const { grade_id } = temp
      const result = ['0', '1', '2'].indexOf(String(grade_id)) > -1
      delete temp.studentExamType
      !result && delete temp.studentExamId
      return temp
    },
    materialSubmitEvent() {
      this.$refs['basicInfo'].$refs['material'].validate(valid => {
        if (valid) {
          let i = 0
          let j = 0
          this.$refs['learnSituation'].$refs['situation'].forEach(val => {
            j++
            val.$refs['query'].validate(valid => valid && i++)
          })
          if (i === j) {
            this.canSearch = false
            const copyObj = JSON.parse(JSON.stringify(this.query))
            if (copyObj.country_id) {
              copyObj.area_id = copyObj.country_id
            } else if (copyObj.city_id) {
              copyObj.area_id = copyObj.city_id
            } else if (copyObj.province_id) {
              copyObj.area_id = copyObj.province_id
            } else {
              copyObj.area_id = ''
            }

            if (copyObj.grade_id === 0 || copyObj.grade_id === 1 || copyObj.grade_id === 2) {
              copyObj.targetSchool.forEach((obj, index) => {
                if (obj.targetSchoolId === '') {
                  obj.provinceId = ''
                  obj.cityId = ''
                  obj.countryId = ''
                  obj.targetSchoolId = ''
                  obj.targetSchoolName = ''
                  obj.id = ''
                  obj.serialNumber = ''
                  return
                }

                obj.targetSchoolName = obj.targetSchoolId
                const bool = this.$refs['goalSchool'].$refs['unversity'][index].goalSchools.some((val) => {
                  if (obj.targetSchoolId === val.id) {
                    obj.targetSchoolName = val.schoolName
                    return true
                  }
                })
                !bool && (obj.targetSchoolId = '')
              })
            } else {
              copyObj.targetSchool.forEach((obj, index) => {
                if (obj.targetSchoolId === '') {
                  obj.provinceId = ''
                  obj.cityId = ''
                  obj.countryId = ''
                  obj.targetSchoolId = ''
                  obj.targetSchoolName = ''
                  obj.id = ''
                  obj.serialNumber = ''
                  return
                }

                obj.targetSchoolName = obj.targetSchoolId
                const bool = this.$refs['goalSchool'].$refs['schools'][index].presentSchool.some((val) => {
                  if (obj.targetSchoolId === val.school_id) {
                    obj.targetSchoolName = val.school_name
                    return true
                  }
                })
                !bool && (obj.targetSchoolId = '')
                if (obj.countryId) {
                  obj.targetAreaId = obj.countryId
                } else if (obj.cityId) {
                  obj.targetAreaId = obj.cityId
                } else if (obj.provinceId) {
                  obj.targetAreaId = obj.provinceId
                } else {
                  obj.targetAreaId = ''
                }
              })
            }

            copyObj.studyState.forEach(obj => {
              this.$refs['learnSituation'].$refs['situation'].forEach(ref => {
                ref.version.some(val => {
                  if (val.id === obj.versionId) {
                    obj.versionName = val.version_name
                  }
                })
                ref.options.subject.some(val => {
                  if (val.code === obj.subjectId) {
                    obj.subjectName = val.value
                  }
                })
              })
            })

            const tF = this.options.presentSchool.some((val) => {
              if (val.school_id === copyObj.present_school_id) {
                copyObj.present_school = val.school_name
                return true
              }
              return false
            })
            if (!tF) {
              copyObj.present_school = copyObj.present_school_id
              copyObj.present_school_id = ''
            }
            // 根据学校名称判断目标院校是否无无用数据
            copyObj.targetSchool.forEach(val => {
              if (val.targetSchoolName && val.targetSchoolName !== '') {
                return
              } else {
                val.serialNumber = ''
              }
            })

            const filterCopyObj = this.checkExamType(copyObj)

            this.postMaterialStudentData(filterCopyObj).then(res => {
              if (res.data) {
                this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: '<p class="message-body-color">资料越全，转化更快</p>'
                })
                this.$router.replace({
                  path: `/roster/material/${this.rosterId}`, query: {
                    random: +new Date()
                  }
                })
                return this.$store.dispatch('delVisitedViews', { name: 'rostermaterial', path: `/roster/material/${this.rosterId}` })
              } else {
                this.$message.error({
                  dangerouslyUseHTMLString: true,
                  message: `<p class="message-title-color">提交失败</p><p class="message-body-color">${res.message}</p>`
                })
              }
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              this.canSearch = true
            })
          } else {
            this.$message.warning('您有必填项未添加')
          }
        } else {
          this.$message.warning('您有必填项未添加')
        }
      })
    },
    postMaterialStudentData(body) {
      return this.$http.post('student_completionStudentInfo', body)
    },
    materialCancleEvent() {
      this.$router.push(`/roster/detail/${this.rosterId}`)
    },
    changeGrage(args) {
      this.learningPeriod = args.label
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../styles/roster/material.sass'
</style>
