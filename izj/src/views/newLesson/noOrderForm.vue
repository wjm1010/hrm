<template>
  <el-form
    :model="query"
    ref="form"
    label-position="left"
    label-width="120px"
    :rules="rules"
  >
    <el-form-item label="可排时间" prop="platoonTimeStrTextarea">
      <el-input
        type="textarea"
        v-model.trim="query.platoonTimeStrTextarea"
        :placeholder="templateTextarea"
        :rows="4">
      </el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        type="textarea"
        v-model.trim="query.remark"
        placeholder="最多500字"
        :maxlength="500"
        :rows="4">
      </el-input>
    </el-form-item>
    <el-row>
      <el-form-item label="实际课时" prop="actualPeriod" ref="noOrderFormActualPeriod">
        <span>{{query.actualPeriod}}</span>
        <el-button type="primary" @click="actualLessonTimeEvent" :disabled="!isCanCalculation">计算</el-button>
        <span v-if="query.actualPeriod">
          <span style="margin-left: 10px">排课日期</span>
          <span style="margin-left: 10px">{{query.lessonStartTime}}</span>
          至
          <span>{{query.lessonEndTime}}</span>
          <span style="margin-left: 10px">排课首课时间</span>
          <span>{{query.firstLessonTime}}</span>
        </span>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
  import { formatDate } from '@/lib/date.js'
  import { arrHaveIntersection } from '@/lib/date.js'

  export default {
    name: 'noOrderForm',
    props: {
      query: {
        required: true,
        type: Object
      },
      postCountCourseHour: {
        required: true,
        type: Function
      }
    },
    data() {
      return {
        isCanCalculation: true,
        rules: {
          platoonTimeStrTextarea: { required: true, validator: this.OrderTimeTextarea, trigger: 'blur' },
          actualPeriod: { required: true, message: '请计算' }
        },
        templateTextarea: `请严格按照以下模板输入，否则系统无法识别
2018/10/01-08:00-10:00
2018/10/02-16:00-18:00
2018/10/03-16:00-18:00`,
        lastOrderTime: this.query.platoonTimeStrTextarea
      }
    },
    methods: {
      OrderTimeTextarea(rule, value, callback) {
        if (!value) {
          return callback(new Error('请填写'))
        }
        let isNeedRest = true
        try {
          if (!/^[\d\/\s-:]+$/g.test(value)) { // 整体格式正确
            return callback('请按规则设置你的可排时间')
          }

          const timeRangeArr = value.split(/\s+/g) // 范围数组
          if (timeRangeArr.length !== new Set([...timeRangeArr]).size) {
            return callback('有重复')
          }

          for (const time of timeRangeArr) {
            if (!/^\d{4}\/\d{2}\/\d{2}-\d{2}:\d{2}-\d{2}:\d{2}$/g.test(time)) { // 格式错误
              return callback('请按规则设置你的可排时间')
            }

            // 单个时间格式判断
            const dateArr = time.split(/[\/-]/g)
            var [year, mouth, date, startTime, endTime] = dateArr
            let isCrossDay = false // 是否跨天
            if (dateArr.length !== 5 ||
              year.length !== 4 ||
              !(mouth >= '01' && mouth <= '12') ||
              !(date >= '01' && date <= '31') ||
              !(startTime.search(':') !== -1 && startTime >= '00:00' && startTime <= '23:59') ||
              !(endTime.search(':') !== -1 && endTime >= '00:00' && endTime <= '23:59')) {
              return callback('请按规则设置你的可排时间')
            }

            // 15刻度判断
            const [, startMinute] = startTime.split(':')
            const [, endMinute] = endTime.split(':')
            const allowMinuteArr = ['00', '15', '30', '45']
            if (!allowMinuteArr.includes(startMinute) || !allowMinuteArr.includes(endMinute)) {
              return callback('可排课时间要求以15分钟为节点')
            }

            // 跨天判断
            if (startTime > endTime) {
              startTime = [23 - startTime.split(':')[0], 60 - startTime.split(':')[1]].join(':')
              isCrossDay = true
            }

            const startDateArr = startTime.split(':')
            const endDateArr = endTime.split(':')
            const startDateNum = startDateArr[0] * 3600 * 1000 + startDateArr[1] * 60 * 1000
            const endDateNum = endDateArr[0] * 3600 * 1000 + endDateArr[1] * 60 * 1000

            let totalTime
            if (isCrossDay) {
              totalTime = startDateNum + endDateNum
            } else {
              totalTime = Math.abs(startDateNum - endDateNum)
            }

            const allowTimeArr = [0.75, 1, 1.5, 2, 3, 4, 5]
            if (!allowTimeArr.some(value => value * 60 * 60 * 1000 === totalTime)) {
              return callback(new Error('您的单课时长不符合规则，请按0.75、1、1.5、2、3、4、5小时 规则进行设置排课'))
            }
          }

          // this.query.firstLessonTime = `${timeRangeArr[0].slice(0, 10)}`.replace(/\//g, '-') + ` ${timeRangeArr[0].slice(11)}`
          // this.query.lessonStartTime = `${timeRangeArr[0].split('-')[0]}`.replace(/\//g, '-')
          // this.query.lessonEndTime = `${timeRangeArr[timeRangeArr.length - 1].split('-')[0]}`.replace(/\//g, '-')

          this.lastOrderTime = value
          isNeedRest = false
        } catch (e) {
          console.log(e)
          return callback('请按规则设置你的可排时间')
        } finally {
          if (isNeedRest) {
            this.lastOrderTime = ''
          }
        }

        callback()
      },
      actualLessonTimeEvent() {
        if (this.lastOrderTime) {
          const orderTimeArr = this.lastOrderTime.replace(/\//g, '-').split(/\s+/g)
          const timeList = []
          for (const item of orderTimeArr) {
            const dateArr = item.split(/[\/-]/g)
            var [year, mouth, date, startTime, endTime] = dateArr
            const start_time = `${year}-${mouth}-${date} ${startTime}`
            let end_time = `${year}-${mouth}-${date} ${endTime}`
            if (startTime > endTime) {
              const endTimeDate = +new Date(end_time) + 24 * 60 * 60 * 1000
              end_time = formatDate(endTimeDate, 'YYYY-MM-DD hh:mm')
            }
            timeList.push({ start_time, end_time })
          }

          // 判断是否有时间交叉
          if (arrHaveIntersection(timeList)) {
            return this.$message.warning('可排时间有交集')
          }

          // 计算
          this.isCanCalculation = false
          this.postCountCourseHour(JSON.stringify(timeList)).then(res => {
            if (res.data) {
              this.query.platoonTime = JSON.stringify(timeList)

              setTimeout(() => {
                const { actualPeriod, firstLessonTime, lessonStartTime, lessonEndTime } = res.data
                this.query.actualPeriod = actualPeriod
                this.query.firstLessonTime = firstLessonTime
                this.query.lessonStartTime = lessonStartTime
                this.query.lessonEndTime = lessonEndTime
                this.$refs['noOrderFormActualPeriod'].clearValidate()
              }, 0)
            }
          }).catch(console.log).finally(() => {
            this.isCanCalculation = true
          })
        } else {
          this.$message.warning('请填写可排时间')
        }
      }
    }
  }
</script>

<style scoped>

</style>
