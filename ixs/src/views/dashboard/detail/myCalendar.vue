<template>
  <!-- 命令行生成的模板 -->
  <!-- 我的日历 -->
  <div v-loading="loading">
    <div class="calendar">
      <h3>我的日历</h3>
      <div class="getTime">
        {{calendar.getFullYear}}年{{calendar.getMonth}}月
      </div>
      <div class="checkbox-group">
        <el-checkbox v-model="lesson.trialLesson">
          <i class="audition-lesson"></i>
          <span>试听课 </span>
          <i class="trial-lesson">{{calendar.actionBarOptions.trialLessonnum}} </i>节
        </el-checkbox>
        <el-checkbox v-model="lesson.formalLesson">
          <i class="official-lesson"></i>
          <span>体验课</span>
          <i class="formal-lesson">{{calendar.actionBarOptions.formalLessonnum}} </i>节
        </el-checkbox>
        <el-checkbox v-model="calendar.actionBarQuery.toCallPeople">
          <i class="el-icon-mobile-phone toCall-lesson"></i>
          <span>待呼叫</span>
          <i class="toCall-lesson">{{calendar.actionBarOptions.toCallPeoplenum}} </i>人
        </el-checkbox>
      </div>
      <div class="calendar-content">
        <ul class="weekList">
          <li v-for="(key, index) in calendar.dateObject" :key="index">
            <p class="weekday">{{key.weekday}}</p>
          </li>
        </ul>
        <ul class="dateList">
          <p class="knobnumday">今天<i class="knobnum">{{coursenumber}}</i><i style="color:#333">节</i></p>
          <li v-for="(key, index) in calendar.dateObject" :key="index">
            <span class="date">{{key.date}}</span>
          </li>
        </ul>
        <ul class="listinfor">
          <li v-for="(key, index) in calendar.information" :key="index" class="datetitle">
            <ul class="ulkeyList">
              <li v-for="(item, index) in key.list" :key="index" class="keyList">
                <el-popover
                  placement="right"
                  width="300"
                  trigger="hover">
                  <div style="cursor: pointer">
                    <span :class="{'auditionLesson':item.lessonTypeName === '试听课','officialLesson':item.lessonTypeName === '体验课'}"></span>
                    <span>{{item.lessonPlanTime}}</span>
                    <span @click="changeTableViewSelect(item)" class="studentName">{{item.studentName}}</span>
                    <span>{{item.subjectName}}</span>
                    <span :class="{'lessonST':item.lessonTypeName === '试听课','lessonZS':item.lessonTypeName === '体验课'}">{{item.teacherName}}</span>
                  </div>
                  <el-button slot="reference" class="suspension">
                    <div>
                      <i :class="{'auditionLesson':item.lessonTypeName === '试听课','officialLesson':item.lessonTypeName === '体验课'}"></i>
                      <span>{{item.lessonPlanTime}}</span>
                      <span @click="changeTableViewSelect(item)" class="studentName">{{item.studentName}}</span>
                      <span>{{item.subjectName}}</span>
                      <span :class="{'lessonST':item.lessonTypeName === '试听课','lessonZS':item.lessonTypeName === '体验课'}">{{item.teacherName}}</span>
                    </div>
                  </el-button>
                </el-popover>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="listinfor">
          <li v-for="(key, index) in calendar.communicate" :key="index" class="datetitle">
            <ul class="ulkeyList">
              <li v-for="(item, indexs) in key.list" :key="indexs" class="keyList">
                <el-popover
                  placement="right"
                  width="300"
                  trigger="hover">
                  <div style="cursor: pointer">
                    <i class="el-icon-mobile-phone toCall-lesson"></i>
                    <span>{{item.CommunicateTime}}</span>
                    <span @click="changeTableViewSelect(item)" class="studentName">{{item.name}}</span>
                    <span>{{item.phone}}</span>
                    <span>{{item.examYear}}</span>
                  </div>
                  <el-button slot="reference" class="suspension">
                    <div>
                      <i class="el-icon-mobile-phone toCall-lesson"></i>
                      <span>{{item.CommunicateTime}}</span>
                      <span class="studentName" @click="changeTableViewSelect(item)">{{item.name}}</span>
                      <span>{{item.phone}}</span>
                      <span>{{item.examYear}}</span>
                    </div>
                  </el-button>
                </el-popover>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myCalender',
  data() {
    return {
      isActive: this.getDay(0),
      loading: true,
      lesson: {
        trialLesson: true,
        formalLesson: true
      },
      tList: [],
      fList: [],
      coursenumber: '',
      calendar: {
        lessonType: '2,3',
        isCommunicate: '1',
        getFullYear: new Date().getFullYear(),
        getMonth: new Date().getMonth() + 1,
        actionBarOptions: {
          trialLessonnum: '',
          formalLessonnum: '',
          toCallPeoplenum: ''
        },
        actionBarQuery: {
          toCallPeople: true
        },
        dateObject: [
          { weekday: '', date: '', day: '' },
          { weekday: '', date: '', day: '' },
          { weekday: '', date: '', day: '' },
          { weekday: '', date: '', day: '' },
          { weekday: '', date: '', day: '' },
          { weekday: '', date: '', day: '' },
          { weekday: '', date: '', day: '' }
        ],
        information: [],
        communicate: []
      }
    }
  },
  computed: {

  },
  created() {
    this.homePageCalendarOld()
  },
  mounted() {
    this.lessonStatistics()
  },
  watch: {
    'lesson': {
      handler: function(val) {
        if (val.trialLesson === true && val.formalLesson === false) {
          this.calendar.lessonType = '2'
          this.homePageCalendarOld()
        } else if (val.trialLesson === false && val.formalLesson === true) {
          this.calendar.lessonType = '3'
          this.homePageCalendarOld()
        } else if (val.trialLesson === true && val.formalLesson === true) {
          this.calendar.lessonType = '2,3'
          this.homePageCalendarOld()
        } else if (val.trialLesson === false && val.formalLesson === false) {
          this.calendar.lessonType = ''
          this.homePageCalendarOld()
        }
      },
      deep: true
    }, // 试听课 体验课
    'calendar.actionBarQuery.toCallPeople'(val) {
      if (val === true) {
        this.calendar.isCommunicate = '1'
        this.homePageCalendarOld()
      } else {
        this.calendar.isCommunicate = ''
        this.homePageCalendarOld()
      }
    } // 待呼叫
  },
  methods: {
    changeTableViewSelect(item) {
      if (item.studentIntentionId) {
        this.$eventBus.$emit('show-no-permission-dialog', item.studentIntentionId)
      } else {
        this.$message.error('系统错误！')
      }
    }, // 沟通记录
    lessonStatistics() {
      this.calendar.dateObject.map((key, index) => {
        key.weekday = '日一二三四五六 '.charAt(new Date(this.getDay(index)).getDay())
        key.date = this.getDay(index).slice(8, 10)
        key.day = this.getDay(index)
      }) // 日历时间
      this.$http.post('lesson_lessonStatistics').then(res => {
        if (res.data) {
          this.calendar.actionBarOptions.trialLessonnum = res.data[2]
          this.calendar.actionBarOptions.formalLessonnum = res.data[3]
          this.calendar.actionBarOptions.toCallPeoplenum = res.data.communicateCount
        }
      }).catch(console.log)
    }, // 日历相关

    // 时间计算
    getDay(day) {
      var today = new Date()
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds)
      var tYear = today.getFullYear()
      var tMonth = today.getMonth()
      var tDate = today.getDate()
      tMonth = this.doHandleMonth(tMonth + 1)
      tDate = this.doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    },
    doHandleMonth(month) {
      var m = month
      if (month.toString().length === 1) {
        m = '0' + month
      }
      return m
    },
    homePageCalendarOld() {
      this.$http.post('lesson_homePageCalendarOld', {
        lessonType: this.calendar.lessonType,
        isCommunicate: this.calendar.isCommunicate
      }).then(res => {
        if (res.data) {
          this.calendar.information = []
          this.calendar.communicate = []
          const dd = this.getDay(0)
          this.calendar.dateObject.map((key, index) => {
            for (const item in res.data.calendar) {
              if (item === key.day) {
                if (dd === item) {
                  if (!res.data.calendar[item].list) {
                    this.coursenumber = 0
                  } else {
                    this.coursenumber = res.data.calendar[item].list.length
                  } // 判断今天的课程数
                }
                this.calendar.information.push(res.data.calendar[item]) // 试听课体验课数据
                break
              }
            }
            for (const elem in res.data.communicate) {
              if (elem === key.day) {
                this.calendar.communicate.push(res.data.communicate[elem]) // 待呼叫数据
                break
              }
            }
          })
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    } // 日历内容
  }
}
</script>
<style lang="sass">
  @import '../../../styles/dashboard/index.sass'

</style>
