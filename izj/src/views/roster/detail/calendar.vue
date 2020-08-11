<template>
  <div class="main" v-if="noHidden">
    <div class="checkbox-group">
      <el-checkbox v-model="trialLesson"><span class="trial-lesson">试听课</span></el-checkbox>
      <el-checkbox v-model="formalLesson"><span class="formal-lesson">正式课</span></el-checkbox>
      <span class="calendar-title">学生日历</span>
      <!--<el-checkbox v-model="query.isCommunicate" :true-label="1">沟通记录</el-checkbox>-->
    </div>
    <ul class="calendar-statistics">
      <li><span>试听课：</span><b>{{this.calendar1.statistics.data.trial}}</b></li>
      <li><span>正式课：</span><b>{{this.calendar1.statistics.data.formal}}</b></li>
      <li><span>待回访：</span><b class="color-green">{{this.calendar1.statistics.data.revisit}}</b></li>
      <li><span>总沟通数：</span><b class="color-green">{{this.calendar1.statistics.data.sumRecord}}</b></li>
      <li><span>有效沟通数：</span><b class="color-green">{{this.calendar1.statistics.data.validRecord}}</b></li>
      <li><span>无效沟通数：</span><b class="color-green">{{this.calendar1.statistics.data.invalidRecord}}</b></li>
    </ul>
    <div class="flexs" v-loading="loading">
      <calendar
        ref="calendar1"
        :events="calendar1.events"
        :lunar="calendar1.lunar"
        :value="calendar1.value"
        :begin="calendar1.begin"
        :end="calendar1.end"
        :weeks="calendar1.weeks"
        :months="calendar1.months"
        :birthday="studentInfo.birthday.slice(5)"
        @select="calendar1.select"
        @selectMonth="calendar1.selectMonth"
        @selectYear="calendar1.selectYear">
      </calendar>
    </div>
  </div>
</template>
<script>
  import calendar from '@/components/calendar/index.vue'

  export default {
    name: 'app',
    props: {
      rosterId: {
        required: true
      },
      studentId: {
        required: true
      },
      studentInfo: {
        required: true
      },
    },
    components: {
      calendar
    },
    created() {
      Promise.all([
        this.getCalendar(),
        this.getStatistics()
      ])
    },
    watch: {
      'query.isCommunicate'() {
        this.getCalendar()
      },
      'trialLesson'() {
        this.getCalendar()
      },
      'formalLesson'() {
        this.getCalendar()
      }
    },
    data() {
      return {
        calendar1: {
          value: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()], // 默认日期
          lunar: true, // 显示农历
          zero: true,
          events: {},
          select(value) {
            console.log(value.toString())
          },
          selectYear: this.selectYear,
          selectMonth: this.selectMonth,
          timestamp: Date.now(),
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          statistics: {
            query: {
              dateTime: '',
              studentId: '',
              studentIntentionId: '',
              dealUserId: ''
            },
            data: {}
          }
        },
        noHidden: false,
        loading: false,
        query: {
          studentId: '',
          queryTime: '',
          lessonType: '3',
          studentIntentionId: '',
          isCommunicate: '',
          byAssistant: ''
        },
        trialLesson: true,
        formalLesson: true
      }
    },
    methods: {
      // get
      getTeacherStudentCalendarAll(params) {
        return this.$http.get('teacher_studentCalendarAll', {
          params: Object.assign(params, {
            studentId: this.studentId,
            studentIntentionId: this.rosterId,
            dealUserId: this.studentInfo.by_assistant
          })
        })
      },
      getTalkCalendarStatistics(params) {
        return this.$http.get('talk_calendarStatistics', {
          params: Object.assign(params, {
            studentId: this.studentId,
            studentIntentionId: this.rosterId,
            byAssistant: this.studentInfo.by_assistant
          })
        })
      },
      // data
      getCalendar() {
        this.loading = true
        var _query = Object.assign({}, this.query)
        if (this.trialLesson && this.formalLesson) {
          _query.lessonType = '3'
        } else if (this.trialLesson) {
          _query.lessonType = '2'
        } else if (this.formalLesson) {
          _query.lessonType = '1'
        } else {
          _query.lessonType = ''
        }
        if (this.calendar1.month < 10) {
          this.calendar1.month = '0' + Number(this.calendar1.month)
        }
        _query.queryTime = `${this.calendar1.year}-${this.calendar1.month}`
        this.getTeacherStudentCalendarAll(_query).then(res => {
          if (res.data) {
            this.noHidden = true
            this.calendar1.events = res.data.calendar
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      },
      getStatistics() {
        var _query = Object.assign({}, this.calendar1.statistics.query)
        if (this.calendar1.month < 10) {
          this.calendar1.month = '0' + Number(this.calendar1.month)
        }
        _query.dateTime = `${this.calendar1.year}-${this.calendar1.month}`
        this.getTalkCalendarStatistics(_query).then(res => {
          if (res.data) {
            this.calendar1.statistics.data = res.data
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取日历统计数据失败')
        })
      },
      selectMonth(month, year) {
        if (month < 10) {
          month = '0' + month
        }
        this.calendar1.year = year
        this.calendar1.month = month
        this.getCalendar()
        this.getStatistics()
      },
      selectYear(year) {
        this.calendar1.year = year
        this.getCalendar()
        this.getStatistics()
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/calendar.sass'
</style>
