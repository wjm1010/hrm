<template>
<div>
  <h4 style='display: inline-block'>目标院校</h4>
  <span class='base-info-tag'>{{gradeTag}}</span>
  <div v-loading="loading">
    <div v-if="showGoalSchool">
      <school-item
        ref="schools"
        v-for="(item, index) in goalSchools"
        :key="index"
        :student-info="studentInfo"
        :query="item"
        :index="index"
        :options="options"
        :rosterId="rosterId">
      </school-item>
    </div>

    <div v-else>
      <unversity-school
        ref="unversity"
        v-for="(item, index) in goalSchools"
        :key="index"
        :student-info="studentInfo"
        :query="item"
        :index="index"
        :options="options"
        :rosterId="rosterId">
      </unversity-school>
    </div>
  </div>
</div>
</template>
<script>
import SchoolItem from '../../../components/goalSchool/index'
import UnversitySchool from '../../../components/goalSchool/unversitySchool'
import { mapGetters } from 'vuex'
export default {
  components: {
    SchoolItem,
    UnversitySchool
  },
  props: {
    rosterId: {
      required: true
    },
    studentInfo: {
      required: true
    },
    options: {
      required: true
    },
    goalSchools: {
      required: true
    },
    learningPeriod: {
      require: true,
      type: String,
      default: '小学'
    }
  },
  data() {
    return {
      loading: false,
      canSearch: true,
      showGoalSchool: true,
      initGoalSchools: [],
      initGrade: '',
      newArr: []
    }
  },
  watch: {
    'studentInfo.grade_id'(val) {
      if (val !== '') {
        this.init()
      }
    }
  },
  computed: {
    ...mapGetters([
      'studentId',
      'userId'
    ]),
    gradeTag() {
      const period = {
        '小学': '学员正处于小学阶段，目标院校限‘初中',
        '初中': '学员正处于初中阶段，目标院校限‘高中’。',
        '高中': '学员正处于高中阶段，目标院校限‘大学’。当前系统仅收录985、211院校。'
      }

      return period[this.learningPeriod] || ''
    },
  },
  mounted() {
    this.$eventBus.$on('save-material-refresh', this.init)
  },
  created() {
    // this.saveData()
    this.saveData2()
    this.init2()
  },
  methods: {
    init2() {
      if (this.studentInfo.grade_id === 0 || this.studentInfo.grade_id === 1 || this.studentInfo.grade_id === 2) {
        this.showGoalSchool = false
        this.initGrade = 'gao'
      } else {
        this.showGoalSchool = true
        this.initGrade = 'di'
      }
    },
    init() {
      if (this.studentInfo.grade_id === 0 || this.studentInfo.grade_id === 1 || this.studentInfo.grade_id === 2) {
        this.studentInfo.targetSchool.forEach((obj, index) => {
          if (this.initGrade === 'gao') {
            this.$set(this.studentInfo.targetSchool, index, Object.assign({}, this.newArr[index]))
          } else {
            obj.targetSchoolId = ''
            obj.targetSchoolName = ''
          }
        })
        this.showGoalSchool = false
      } else {
        this.studentInfo.targetSchool.forEach((obj, index) => {
          if (this.initGrade === 'di') {
            this.$set(this.studentInfo.targetSchool, index, Object.assign({}, this.newArr[index]))
          } else {
            obj.targetSchoolId = ''
            obj.targetSchoolName = ''
          }
        })
        this.showGoalSchool = true
      }
    },
    saveData() {
      if (this.studentInfo.grade_id === 0 || this.studentInfo.grade_id === 1 || this.studentInfo.grade_id === 2) {
        this.initGrade = false
      } else {
        this.initGrade = true
      }
      this.initGoalSchools = this.studentInfo.targetSchool
    },
    // 清空目标院校
    saveData2() {
      this.studentInfo.targetSchool.forEach((obj) => {
        this.newArr.push(Object.assign({}, obj))
      })
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../styles/roster/material/goalSchool.sass'
</style>
