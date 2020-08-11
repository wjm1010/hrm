<template>
  <div>
    <el-button style="float: right" type="primary" class="el-icon-plus" @click="situationAddEvent">新增</el-button>
    <h4 style='display: inline-block'>学习情况</h4>
    <span class='base-info-tag'>教材信息库已于2018年12月13日更新，建议重新选择教材版本。</span>
    <Situations
      v-for="(item, index) in learnSituation"
      :key="index"
      v-loading="loading"
      :query="item"
      :options="options"
      :studentInfo="studentInfo"
      :index="index"
      :learnSituation="learnSituation"
      :rosterId="rosterId"
      ref="situation">
    </Situations>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Situations from '../../../components/learnSituation/index'
export default {
  components: {
    Situations
  },
  props: {
    rosterId: {
      required: true
    },
    studentInfo: {
      required: true
    },
    learnSituation: {
      required: true
    }
  },
  data() {
    return {
      options: {
        subject: [],
        classRank: [],
        gradeRank: []
      },
      loading: false,
      query: {}
    }
  },
  computed: {
    ...mapGetters(['gradeId', 'provinceId', 'cityId'])
  },
  mounted() {
    this.$eventBus.$on('save-material-refresh', this.init)
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getNewSubject()
      this.getRank()
    },
    getNewSubject() {
      this.$http.get('student_getNewSubject', { isFilterUrl: true }).then(res => {
        if (res.data) {
          this.options.subject = res.data
        } else {
          return
        }
      }).catch(console.log)
    },
    getRank() {
      this.$http.get('student_getRank', { isFilterUrl: true }).then(res => {
        if (res.data) {
          this.options.classRank = res.data
          this.options.gradeRank = res.data
        } else {
          return
        }
      }).catch(console.log)
    },
    situationAddEvent() {
      this.learnSituation.push({
        classRank: '', gradeRank: '', versionId: '', scores: '', scoresTotal: '', subjectName: '', versionName: ''
      })
    }
  }
}
</script>
<style lang="sass" scoped>
  .base-info-tag
    color: #999
    font-size: 10px
    margin-left: 10px
</style>
