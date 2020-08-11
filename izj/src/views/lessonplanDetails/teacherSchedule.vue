<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <div class="teacherInfo">
      教师姓名 {{teacherInfo}}
    </div>
    <div class="topCheckbox">
      <span class="spanPadding_one myself" v-for="(classify, index) in teacherClass" :key="index">
        <el-checkbox v-if="classify.color"
          v-model="checkedTeacher"
          :checked="true"
          :class="classify.color"
          :label="classify"
          :key="index"
          :disabled='true'>
          {{classify.name}}
        </el-checkbox>
      </span>
    </div>
    <teacherSchedule
      v-if="hackReset"
      ref='updateSuccess'
      @selection-changeTime="changeTime"
      :events="events">
    </teacherSchedule>
  </div>
</template>
<script>
import teacherSchedule from '@/components/fullCalendar/index.vue'
export default {
  name: 'lessonplanDetailsteacherSchedule',
  components: {
    teacherSchedule
  },
  data() {
    return {
      // 顶部的复选框
      checkedTeacher: [], // 顶部的复选框选中的值
      teacherInfo: this.$route.query.teacherInfo,
      // 教师查看
      isTeacher: false,
      // 排课
      courseTime: '',
      courseTimestamp: '',
      counTime: '',
      counTimeEnd: '',
      countime: '',
      counTimeisBetween: '',
      options: [{
        value: '0.75',
        label: '0.75 小时'
      }, {
        value: '1',
        label: '1 小时'
      }, {
        value: '1.5',
        label: '1.5 小时'
      }, {
        value: '2',
        label: '2 小时'
      }, {
        value: '3',
        label: '3 小时'
      }, {
        value: '4',
        label: '4 小时'
      },
      {
        value: '5',
        label: '5 小时'
      }],

      // 弹出框
      content: '',
      centerDialogVisible: false,
      courseDialogVisible: false,
      uncourseDialogVisible: false,
      // 复选框的默认值
      teacherClass: [
        { name: '', tone: 'red', color: false },
        { name: '正式课', color: 'blue', tone: 'rgba(116, 168, 251, 1)' },
        { name: '试听课', color: 'red', tone: 'rgba(245, 111, 101, 1)' },
        { name: '体验课', color: 'green', tone: 'rgba(126, 211, 33, 1)' },
        { name: '休息时间', color: 'black', tone: 'rgba(144, 147, 153, 1)' },
        { name: '未用系统', color: 'grey', tone: 'rgba(213, 216, 222, 1)' },
        { name: '预排正课', color: 'orange', tone: 'rgba(247, 186, 42, 1)' },
        { name: '预排试听', color: 'purple', tone: 'rgba(180, 104, 244, 1)' },
        { name: '', color: false, tone: 'rgba(159, 178, 199, 1)' }
      ],
      // 数据源
      events: [],
      mondayTime: '',
      mergeData: [],
      nuStudentCourseCopy: [],
      Course: [],
      teacherCourse: [],
      teacherCourseCopy: [],
      nuTeacherCourse: [],
      restTime: [],
      hackReset: true
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getData()
  },
  methods: {

    // 获取数据
    getData(foo) {
      this.$http.get('courseApplication_getTeacherSchedule', {
        params: {
          teacherId: this.$route.params.teacherId,
          mondayTime: this.mondayTime || ''
        }
      }).then(res => {
        this.restTime = this.getTeacherTime(res.data.restTime)
        this.Course = [...res.data.teacherCourse, ...res.data.studentCourse]
        this.teacherCourse = res.data.teacherCourse
        this.studentCourse = res.data.studentCourse
        this.joint()
        if (foo && foo.constructor === Function) {
          this.$nextTick(() => {
          })
        }
      })
    },

    // 处理休息时间
    getTeacherTime(itemList) {
      if (!itemList.length) {
        return []
      }
      const newLint = []
      let startIndex = 0
      let endIndex = 0
      itemList.forEach((ele, index) => {
        if (index + 1 === itemList.length) {
          newLint.push({
            plan_start_time: itemList[startIndex].plan_start_time,
            plan_end_time: itemList[endIndex].plan_end_time,
            type: '4'
          })
          return newLint
        }
        if (ele && ele.plan_end_time === itemList[index + 1].plan_start_time) {
          endIndex = index + 1
        } else {
          newLint.push({
            plan_start_time: itemList[startIndex].plan_start_time,
            plan_end_time: itemList[endIndex].plan_end_time,
            type: '4'
          })
          startIndex = index + 1
          endIndex = index + 1
        }
      })
      return newLint
    },

    // 拼接数据结构
    joint() {
      const arr = [...this.nuStudentCourseCopy, ...this.nuTeacherCourse, ...this.studentCourse, ...this.teacherCourse, ...this.restTime]
      arr.map(item => {
        item.className = []
        if (item.tick === '1') {
          item.className = ['success', 'fullsuccess']
        }
        if (item.type === '4') {
          item.title = '休息时间'
          item.className = 'res'
          item.start = item.plan_start_time
          item.end = item.plan_end_time
          item.backgroundColor = this.teacherClass[+item.type].tone
          item.borderColor = this.teacherClass[+item.type].tone
          item.tip = {
            title: [{ testClass: item.lessonTypeName, titleColor: '' }, { testClass: '' }, { testClass: '' }],
            teacher: '',
            Class: '',
            badlyTime: '',
            remark: '',
            timeQuantum: ''
          }
        } else {
          item.block = true
          item.title = item.studentName + '\r\n' + item.curr_plan_name + '\r\n'
          item.start = item.plan_start_time
          item.end = item.plan_end_time
          item.backgroundColor = this.teacherClass[+item.type].tone
          if (item.isCoincide === '1') {
            item.className.push('overlap')
            item.borderColor = this.teacherClass[+item.type].tone
          } else {
            item.borderColor = '#f8f8f800'
          }
          item.tip = {
            title: [{ testClass: item.lessonTypeName, titleColor: this.teacherClass[+item.type].tone }, { testClass: item.teacherName }, { testClass: item.studentName }, { testClass: item.curr_plan_name }],
            teacher: item.teacherName,
            Class: item.curr_plan_name,
            badlyTime: item.minuteTime,
            remark: item.lesson_detail,
            timeQuantum: item.planDate,
            weekDay: item.weekDay,
            startTime: item.startTime,
            endTime: item.endTime
          }
        }
      })
      this.events = [...arr]
    },

    // 日期选择
    changeTime(val, foo) {
      this.mondayTime = val
      this.getData(foo)
    },
    // sum Time
    sunTime(event, t) {
      const timeHour = event.plan_start_time.slice(11, 13)
      const mini = (6 + (t.offsetY / 25 * 15 / 60)).toString().split('.')[1] ? (6 + (t.offsetY / 25 * 15 / 60)).toString().split('.')[1] : '0'
      const min = Math.floor(mini[0])
      const mi = Math.floor(min * 10 * 3 / 5)
      let minute = ''
      let hour = 0
      if (mi > 30) {
        if (mi > 45) {
          minute = '45'
        } else {
          minute = '30'
        }
      } else {
        if (mi > 15) {
          minute = '15'
        } else {
          minute = '00'
        }
      }
      hour = Math.floor(+timeHour + (t.offsetY / 25 * 15 / 60)) + ''
      hour = hour.length >= 2 ? hour : '0' + hour
      return { hour, minute }
    }

  }
}
</script>
<style rel="stylesheet/sass" lang="sass" scoped>
@import '../../styles/lessonplanDetails/teacherSchedule.sass'
</style>
