<template>
  <div class="main" v-if="noHidden">
    <div class="checkbox-group">
      <div class="pos-title">
        <img :src="sptiteIcon" alt="" class="pos-img">
        <span class="calendar-title">学生日历</span>
      </div>
    </div>
    <div class="body-pos">
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
      <div class="right-content">
        <div class="pos-flex">
          <div class="pos-margin-left">
            <span class="font-color">{{this.calendar1.statistics.data.trial}}</span><br>
            <span class="font-size">试听课</span>
          </div>
          <div class="pos-margin-left">
            <span class="font-color">{{this.calendar1.statistics.data.sumRecord}}</span><br>
            <span class="font-size">总沟通数</span>
          </div>
        </div>
        <div class="pos-flex pos-margin-top">
          <div class="pos-margin-left">
            <span class="font-color">{{this.calendar1.statistics.data.formal}}</span><br>
            <span class="font-size">正试课</span>
          </div>
          <div class="pos-margin-left">
            <span class="font-color">{{this.calendar1.statistics.data.validRecord}}</span><br>
            <span class="font-size">有效沟通数</span>
          </div>
        </div>
        <div class="pos-flex pos-margin-top">
          <!-- <div class="pos-margin-left">
            <span class="font-color">{{this.calendar1.statistics.data.sumRecord}}</span><br>
            <span class="font-size">待回访</span>
          </div> -->
          <div class="pos-margin-left">
            <span class="font-color">{{this.calendar1.statistics.data.invalidRecord}}</span><br>
            <span class="font-size">无效沟通数</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import calendar from './component/calendar/index.vue'
  import sptiteIcon from '../icons/calendar.png'

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
      'trialLesson'() {
        this.getCalendar()
      },
      'formalLesson'() {
        this.getCalendar()
      }
    },
    data() {
      return {
        sptiteIcon,
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
              studentId: '',
              studentIntentionId: '',
              calendarStart: '',
              calendarEnd: ''
            },
            data: {}
          }
        },
        noHidden: false,
        loading: false,
        query: {
          studentId: '',
          studentIntentionId: '',
          calendarStart: '',
          calendarEnd: '',
          lessonType: '1,2'
        },
        trialLesson: true,
        formalLesson: true
      }
    },
    methods: {
      // get
      getTeacherStudentCalendarAll(params) {
        return this.$http.post('lesson_studentCalendarAll', Object.assign(params, {
          studentId: this.studentId,
          studentIntentionId: this.rosterId
        }))
      },
      getTalkCalendarStatistics(params) {
        return this.$http.post('lesson_calendarStatistics', Object.assign(params, {
          studentId: this.studentId,
          studentIntentionId: this.rosterId
        }), {
          isFilterUrl: true
        })
      },
      // data
      getCalendar() {
        this.loading = true
        var _query = Object.assign({}, this.query)
        if (this.trialLesson && this.formalLesson) {
          _query.lessonType = '1,2'
        } else if (this.trialLesson) {
          _query.lessonType = '2'
        } else if (this.formalLesson) {
          _query.lessonType = '1'
        } else {
          _query.lessonType = ''
        }
        this.calendar1.month = `${'0' + Number(this.calendar1.month)}`.slice(-2)
        const _year = this.calendar1.year
        const _mouth = this.calendar1.month
        const _day = new Date(_year, _mouth, 0).getDate()
        _query.calendarStart = `${_year}-${_mouth}-01`
        _query.calendarEnd = `${_year}-${_mouth}-${_day}`
        this.getTeacherStudentCalendarAll(_query).then(res => {
          if (res.data) {
            this.noHidden = true
            this.calendar1.events = res.data.calendar
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
        })
      },
      getStatistics() {
        var _query = Object.assign({}, this.calendar1.statistics.query)
        this.calendar1.month = `${'0' + Number(this.calendar1.month)}`.slice(-2)
        const _year = this.calendar1.year
        const _mouth = this.calendar1.month
        const _day = new Date(_year, _mouth, 0).getDate()
        _query.calendarStart = `${_year}-${_mouth}-01`
        _query.calendarEnd = `${_year}-${_mouth}-${_day}`
        this.getTalkCalendarStatistics(_query).then(res => {
          if (res.data) {
            this.calendar1.statistics.data = res.data
          }
        }).catch(error => {
          console.log(error)
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
  @import '../../../styles/student/detail/calendar.sass'
</style>
