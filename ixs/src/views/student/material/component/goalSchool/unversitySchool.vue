<template>
    <el-form inline>
      <el-row>
        <el-col :span="4">
          <el-form-item :label="judgeLabel(index)">
            <el-select
              v-model.trim="query.targetSchoolId"
              clearable
              filterable
              :allow-create="true"
              @change="materialSchoolSituation"
              placeholder="请选择">
              <el-option
                v-for="item in goalSchools"
                :key="item.value"
                :label="item.schoolName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <div class="btn-pos">
          <el-button type="text" @click="searchGoalSchool(query)" :disabled="!canSearch">搜索</el-button>
          <el-button type="text" @click="schoolSituation(query)" :disabled="!canSearch" v-if="showSchoolSituation">学校情况</el-button>
        </div>
      </el-row>
  </el-form>
</template>
<script>
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
      canSearch: true,
      showSchoolSituation: false,
      goalSchools: []
    }
  },
  watch: {
    'studentInfo.province_id'(val) {
      this.query.targetSchoolId = ''
      this.goalSchools = []
      this.getGoalSchool()
    }
  },
  async created() {
    await this.getGoalSchool()
    this.initUnversity()
    this.initSchoolSituation()
  },
  methods: {
    initSchoolSituation() {
      if (!this.query.targetSchoolId) {
        this.showSchoolSituation = false
      } else {
        var school_name = ''
        const tF = this.goalSchools.some((val) => {
          if (val.id === this.query.targetSchoolId) {
            school_name = val.schoolName
            return true
          }
          return false
        })
        if (!tF) {
          school_name = this.query.targetSchoolId
        }
        this.$http.post('student_getSchoolInfo', {
          provinceId: this.studentInfo.province_id,
          cityId: this.studentInfo.city_id,
          schoolType: 1,
          schoolName: school_name
        }, { isFilterUrl: true }).then(res => {
          if (res.data && res.data.pdf_url) {
            this.showSchoolSituation = true
          } else {
            this.showSchoolSituation = false
          }
        }).catch(console.log)
      }
    },
    initUnversity() {
      if (!this.query.targetSchoolId) {
        this.query.targetSchoolId = this.query.targetSchoolName
      }
    },
    schoolSituation(item) {
      var school_name = ''
      var actionIdD = ''
      const tF = this.goalSchools.some((val) => {
        if (val.id === this.query.targetSchoolId) {
          school_name = val.schoolName
          return true
        }
        return false
      })
      if (!tF) {
        school_name = this.query.targetSchoolId
      }
      if (item.serialNumber === '1') {
        actionIdD = '3'
      } else if (item.serialNumber === '2') {
        actionIdD = '4'
      } else if (item.serialNumber === '3') {
        actionIdD = '5'
      }
      this.$http.post('student_getSchoolInfo', {
        isBuried: '1',
        pageSourceType: '1',
        actionId: actionIdD,
        studentIntentionId: this.rosterId,
        provinceId: this.studentInfo.province_id,
        cityId: this.studentInfo.city_id,
        regionId: this.studentInfo.country_id,
        schoolType: 1,
        schoolName: school_name
      }, { isFilterUrl: true }).then(res => {
        if (res.data && res.data.pdf_url) {
          window.open(res.data.pdf_url)
        } else {
          this.$message.warning('暂无数据')
        }
      }).catch(console.log)
    },
    getGoalSchool() {
      this.canSearch = false
      return this.$http.get('student_getUniversityByArea', {
        params: {
          provinceId: this.studentInfo.province_id,
        }, isFilterUrl: true
      }).then(res => {
        if (res.data) {
          this.goalSchools = res.data
        } else {
          return
        }
      }).catch(console.log).finally(() => {
        this.canSearch = true
      })
    },
    searchGoalSchool(item) {
      const copyObj = JSON.parse(JSON.stringify(item))
      const tM = this.goalSchools.some((val) => {
        if (val.id === copyObj.targetSchoolId) {
          copyObj.targetSchoolName = val.schoolName
          return true
        }
        return false
      })
      if (!tM) {
        copyObj.targetSchoolName = copyObj.targetSchoolId
        copyObj.targetSchoolId = ''
      }
      this.canSearch = false
      this.$http.get('student_getUniversityByArea', {
        params: {
          provinceId: this.studentInfo.province_id,
          schoolName: copyObj.targetSchoolName
        }, isFilterUrl: true
      }).then(res => {
        if (res.data) {
          this.goalSchools = res.data
        } else {
          return
        }
      }).catch(console.log).finally(() => {
        this.canSearch = true
      })
    },
    materialSchoolSituation(val) {
      if (!this.query.targetSchoolId) {
        this.showSchoolSituation = false
      } else {
        var school_name = ''
        const tF = this.goalSchools.some((val) => {
          if (val.id === this.query.targetSchoolId) {
            school_name = val.schoolName
            return true
          }
          return false
        })
        if (!tF) {
          school_name = this.query.targetSchoolId
        }
        this.$http.post('student_getSchoolInfo', {
          provinceId: this.studentInfo.province_id,
          cityId: this.studentInfo.city_id,
          schoolType: 1,
          schoolName: school_name

        }, { isFilterUrl: true }).then(res => {
          if (res.data && res.data.pdf_url) {
            this.showSchoolSituation = true
          } else {
            this.showSchoolSituation = false
          }
        }).catch(console.log)
      }
    },
    judgeLabel(index) {
      if (index === 0) {
        return '第一志愿'
      }
      if (index === 1) {
        return '第二志愿'
      }
      if (index === 2) {
        return '第三志愿'
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../../../styles/student/material/component/goalSchool/unversitySchool'
</style>


