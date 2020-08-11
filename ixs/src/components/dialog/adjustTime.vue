
<template>
  <el-dialog
    width="65%"
    :visible.sync="dialogShow"
    @close="cancle"
    :append-to-body="true"
    title="更换时间"
    :show-close="false"
    class="changeTime-dialog">
    <div class="top-pos">
      <p>
        更换的课程：
        <span>{{info.currPlanName}}</span>
      </p>
      <p style="padding-left: 14px">
        课程时长：
        <span>1</span>
      </p>
      <div class="radio-padding">
        <span>双方已确认：</span>
        <el-radio v-model="query.radio" label="1">是</el-radio>
        <el-radio v-model="query.radio" label="2">否</el-radio>
      </div>

      <div class="content-margin" v-if="query.radio === '1'">
        <el-date-picker 
          v-model="query.date" 
          :picker-options="{disabledDate: pickerOptions}"
          type="date" placeholder="选择日期" 
          format="yyyy 年 MM 月 dd 日" 
          value-format="yyyy-MM-dd"></el-date-picker>
        <el-time-select
            placeholder="开始时间"
            v-model="query.startTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:55',
              minTime: startTime
            }">
          </el-time-select>至
          <el-time-select
            placeholder="结束时间"
            v-model="query.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:55',
              minTime: startTime
            }">
          </el-time-select>
      </div>

      <div class="content-margin" v-if="query.radio === '2'">
        <p>可试听时间：</p>
        <div v-for="(item, index) in listenList" :key="index" class="padding-bottom">
          <el-date-picker 
            v-model="item.date" 
            :picker-options="{disabledDate: pickerOptions}"
            type="date" placeholder="日期" 
            format="yyyy 年 MM 月 dd 日" 
            value-format="yyyy-MM-dd"></el-date-picker>
          <el-time-select
            placeholder="开始时间"
            v-model="item.startTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:55',
              minTime: startTime
            }">
          </el-time-select>至
          <el-time-select
            placeholder="结束时间"
            v-model="item.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:55',
              minTime: startTime
            }">
          </el-time-select>
          <el-button type="text" @click="addList()">添加</el-button>
          <el-button type="text" v-if="index !== 0" @click="deleteList(index)">删除</el-button>
        </div>
        <p>备注：</p>
        <el-input 
          v-model="query.mark"
          placeholder="请输入内容，最多300字"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          maxlength=300
          class="mark-width">
        </el-input>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { arrHaveIntersection } from '@/lib/date.js'
export default {
  props: {
    dialogShow: {
      required: true,
      type: Boolean,
      default: false
    },
    info: {
      required: true,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      query: {
        radio: '',
        date: '',
        time: '',
        mark: ''
      },
      listenList: [
        {
          date: '',
          startTime: '',
          endTime: ''
        }
      ]
    }
  },
  methods: {
    addList(index) { // 添加
      if (this.listenList.length > 4) return
      const obj = { date: '', time: '' }
      this.listenList.push(obj)
    },
    deleteList(index) { // 删除
      this.listenList.splice(index, 1)
    },
    confirm() { // 确认提交
      if (!this.query.radio) {
        this.$message.warning('请选择')
        return
      }
      let dateBool = false // 可调整时间段判断
      const _query = {}
      const objInfo = this.info
      _query.orderId = objInfo.orderId
      _query.lessonPlanId = objInfo.lessonPlanId
      _query.isConfirmed = this.query.radio
      _query.teacher = objInfo.teacherName
      _query.phone = objInfo.phone
      _query.qq = objInfo.qq
      _query.note = this.query.mark
      if (this.query.radio === '1') {
        _query.startTime = this.query.date + ' ' + this.query.startTime + ':00'
        _query.endTime = this.query.date + ' ' + this.query.endTime + ':00'
      } else {
        _query.changeTime = this.listenList.map((val, index) => {
          let { date, startTime, endTime } = val
          const second = ':00'
          date = date || ''
          startTime = startTime ? `${date} ${startTime}${second}` : ''
          endTime = endTime ? `${date} ${endTime}${second}` : ''
          return {
            date,
            startTime,
            endTime
          }
        })
        if (arrHaveIntersection(_query.changeTime)) {
          dateBool = true
        }
      }
      const bool = this.timePickerValidate(_query, this.query.radio)
      if (!bool) return
      if (dateBool) {
        this.$message.warning('可排时间有交集')
        return
      }
      this.$http.post('saleTask_replaceLessonTime', {
        ..._query
      }).catch(console.log).finally(() => {
        this.cancle()
      })
      this.cancle()
      this.$store.dispatch('delVisitedViews', { path: `/attend/index/${this.$route.params.rosterId}` }) // 删除路由标签
      this.$router.go(-1)
    },
    cancle() {
      this.$emit('cancle')
    },
    timePickerValidate(query, radio) { // 时间格式验证
      let judgeBool = false
      if (radio === '1') {
        const nowTime = new Date().getTime()
        const start = new Date(query.startTime).getTime()
        const end = new Date(query.endTime).getTime()
        const distance = end - start
        if (!this.query.startTime || !this.query.endTime || !this.query.date || start >= end) {
          this.$message.warning('请选择目标可试听时间')
          judgeBool = false
        } else if (distance !== 3600000) {
          this.$message.warning('排课时间差必须是1小时')
          judgeBool = false
        } else if (nowTime > start) {
          this.$message.warning('你所排的课必须大于系统时间')
          judgeBool = false
        } else {
          judgeBool = true
        }
      } else {
        const bool = query.changeTime.every(val => {
          const nowTime = new Date().getTime()
          const start = new Date(val.startTime).getTime()
          const end = new Date(val.endTime).getTime()
          if (!val.startTime || !val.endTime || !val.date || start >= end) {
            this.$message.warning('请选择目标可试听时间')
            return false
          } else if (nowTime > start) {
            this.$message.warning('你所排的课必须大于系统时间')
            return false
          } else {
            return true
          }
        })
        judgeBool = bool
      }
      return judgeBool
    },
    pickerOptions(val) {
      const nowTime = new Date().getTime()
      const valTime = new Date(val).getTime()
      if (valTime > (nowTime - 86400000)) {
        return false
      }
      return true
    }
  }
}
</script>
<style lang="sass" scoped>
.changeTime-dialog
  position: fixed
  top: -20px
  .top-pos
    margin-left: 30px
    .head-font-size
      font-size: 20px
      margin-bottom: 40px
    .content-margin
      margin: 30px 0 40px 0
      .padding-bottom
        padding-bottom: 10px
      .mark-width
        width: 70%
</style>


