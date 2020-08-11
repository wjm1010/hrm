<template>
	<el-form
    ref="query"
    :model="query"
    inline
    v-loading="loading">
    <el-row>
      <el-col :span="9">
        <el-form-item :label="judgeLabel(index)" prop="provinceId">
          <el-select v-model="query.provinceId" clearable @change="provinceChangeEvent" placeholder="省" class="width-120">
            <el-option
              v-for="item in options.provinceIds"
              :key="item.value"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="query.cityId" clearable @change="cityChangeEvent" placeholder="市" prop="cityId" class="width-120">
            <el-option
              v-for="item in cityIds"
              :key="item.value"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="query.countryId" clearable placeholder="区" prop="countryId" class="width-120">
            <el-option
              v-for="item in countyIds"
              :key="item.value"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item prop="targetSchoolId" label="学校">
          <el-select
            v-model="query.targetSchoolId"
            clearable filterable
            :allow-create="true"
            @change="materialSchoolSituation"
            placeholder="目标院校">
            <el-option
              v-for="item in presentSchool"
              :key="item.value"
              :label="item.school_name"
              :value="item.school_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <div class="btn-pos">
        <el-button type="text" @click="schoolSituation(query)" v-if="showSchoolSituation">学校信息</el-button>
        <el-button type="text" @click="restFileds">清空</el-button>
      </div>
    </el-row>
	</el-form>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    rosterId: {
      required: true
    },
    studentInfo: {
      required: true
    },
    index: {
      required: true
    },
    query: {
      required: true
    },
    options: {
      required: true
    }
  },
  data() {
    return {
      showSchoolSituation: false,
      presentSchool: [],
      cityIds: [],
      countyIds: [],
      loading: true
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'studentId',
      'userId'
    ])
  },
  created() {
    this.initGoalSchool()
  },
  methods: {
    async initGoalSchool() {
      if (!this.query.targetSchoolId && this.query.targetSchoolName) {
        this.query.targetSchoolId = this.query.targetSchoolName
        this.query.targetSchoolName = ''
      }
      if (this.query.provinceId !== '') {
        this.getOptionsOfCity(this.query.provinceId)
      }
      if (this.query.cityId !== '') {
        this.getOptionsOfArea(this.query.cityId)
      }
      if (this.query.provinceId !== '' && this.query.cityId !== '') {
        await this.getAreaSchool()
      }
      if (this.query.targetSchoolId) {
        await this.materialSchoolSituation(this.query.targetSchoolId)
      }
      this.loading = false
    },
    materialSchoolSituation(val) {
      if (!val) {
        this.showSchoolSituation = false
      } else {
        var school_type = ''
        var school_name = ''
        if (this.studentInfo.grade_id <= 2) {
          school_type = 1
        } else if (this.studentInfo.grade_id <= 5) {
          school_type = 14
        } else {
          school_type = 13
        }

        const tF = this.presentSchool.some((val) => {
          if (val.school_id === this.query.targetSchoolId) {
            school_name = val.school_name
            return true
          }
          return false
        })
        if (!tF) {
          school_name = this.query.targetSchoolId
        }
        this.$http.post('student_getSchoolInfo', {
          provinceId: this.query.provinceId,
          cityId: this.query.cityId,
          schoolType: school_type,
          schoolName: school_name
        }, { isFilterUrl: true }).then(res => {
          if (res.data && res.data.id) {
            this.showSchoolSituation = true
          } else {
            this.showSchoolSituation = false
          }
        }).catch(console.log)
      }
    },

    provinceChangeEvent(id) {
      this.query.cityId = ''
      this.query.countryId = ''
      this.query.targetSchoolId = ''
      this.presentSchool = []
      this.cityIds = []
      this.countyIds = []
      if (id) {
        this.getOptionsOfCity(id)
      }
    },
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
          this.cityIds = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('获取市信息失败')
      })
    },
    cityChangeEvent(id) {
      this.query.countryId = ''
      this.countyIds = []
      this.query.targetSchoolId = ''
      this.presentSchool = []
      if (id) {
        this.getOptionsOfArea(id)
        this.getAreaSchool()
      }
    },
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
          this.countyIds = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('获取区信息失败')
      })
    },
    // 省市匹配学校
    getAreaSchool() {
      return this.$http.get('student_getPresentSchool', {
        params: {
          provinceId: this.query.provinceId,
          cityId: this.query.cityId
        },
        isFilterUrl: true
      }).then(res => {
        if (res.data) {
          this.presentSchool = res.data
        }
      }).catch(console.log)
    },
    restFileds() {
      this.showSchoolSituation = false
      this.query.targetSchoolName = ''
      this.query.provinceId = ''
      this.query.id = ''
      this.query.cityId = ''
      this.query.countryId = ''
      this.query.targetSchoolId = ''
      this.presentSchool = []
      this.cityIds = []
      this.countyIds = []
    },
    schoolSituation(item) {
      var school_type = ''
      var school_name = ''
      var actionIdD = ''
      if (this.studentInfo.grade_id <= 2) {
        school_type = 1
      } else if (this.studentInfo.grade_id <= 5) {
        school_type = 14
      } else {
        school_type = 13
      }
      if (item.serialNumber === '1') {
        actionIdD = '3'
      } else if (item.serialNumber === '2') {
        actionIdD = '4'
      } else if (item.serialNumber === '3') {
        actionIdD = '5'
      }
      const tF = this.presentSchool.some((val) => {
        if (val.school_id === this.query.targetSchoolId) {
          school_name = val.school_name
          return true
        }
        return false
      })
      if (!tF) {
        school_name = this.query.targetSchoolId
      }
      this.$http.post('student_getSchoolInfo', {
        isBuried: '1',
        pageSourceType: '1',
        actionId: actionIdD,
        studentIntentionId: this.rosterId,
        regionId: item.countryId,
        provinceId: item.provinceId,
        cityId: item.cityId,
        schoolType: school_type,
        schoolName: school_name

      }, { isFilterUrl: true }).then(res => {
        if (res.data && res.data.id) {
          this.$router.push({ path: `/schoolSituation/index/${this.rosterId}`, query: {
            isBuried: '1',
            pageSourceType: '1',
            actionId: actionIdD,
            regionId: item.countryId,
            studentIntentionId: this.rosterId,
            provinceId: item.provinceId,
            cityId: item.cityId,
            schoolType: school_type,
            schoolName: school_name
          }})
        }
      }).catch(console.log)
    },
    judgeLabel(index) {
      if (index === 0) {
        return '一志愿所在地区'
      }
      if (index === 1) {
        return '二志愿所在地区'
      }
      if (index === 2) {
        return '三志愿所在地区'
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../../../styles/student/material/component/goalSchool/index'
</style>



