<template>
  <el-form
    :model="query"
    ref="form"
    label-position="left"
    label-width="120px"
    :rules="rules"
    v-loading="formLoading"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="接受频次" prop="frequency">
          <span>每</span>
          <el-select v-model="query.frequency" clearable filterable @change="acceptFrequencyChange">
            <el-option
              v-for="(value,key) in options.frequency"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="0px" prop="frequencyNum">
          <span>上</span>
          <el-input-number
            v-model="query.frequencyNum"
            clearable
            controls-position="right"
            :min="1"
            :precision="0"
          >
          </el-input-number>
          <span>次课</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-form-item label="单次时长" prop="singleClassLength">
          <el-select v-model="query.singleClassLength" clearable filterable @change="singleTimeChange">
            <el-option
              v-for="(value,key) in options.classLevel"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="排课日期" prop="lessonTime" clearable>
          <el-date-picker
            v-model="query.lessonTime"
            type="daterange"
            range-separator="到"
            :unlink-panels="true"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="lessonTimePickerOptions"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <template v-if="query.frequency !== '' && query.singleClassLength !== '' ">
      <el-row v-for="(item,index) in query.platoonTimeArrObj" :key="index">
        <el-form-item
          :label="index === 0 ? '可排时间' : '' "
          :prop="'platoonTimeArrObj.' + index"
          :rules="{
            type: 'object', validator: orderTimeValidator, required: true
          }"
        >
          <template v-if="query.frequency !== '6'">
            <el-select v-model="item.id" clearable filterable>
              <el-option
                v-for="(value,key) in options.frequencyInfoChoose"
                :key="key"
                :label="value"
                :value="key">
              </el-option>
            </el-select>
          </template>
          <el-time-select
            v-model="item.startTime"
            @change="orderTimeStartChange(item.startTime,index)"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:45'
            }"
          >
          </el-time-select>
          <span>至</span>
          <el-time-select
            :disabled="isBothConfirm === '2'"
            v-model="item.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:45'
            }"
          >
          </el-time-select>
          <el-button type="text" v-if="index !== 0" @click="orderTimeDelete(index)">删除</el-button>
        </el-form-item>
      </el-row>
      <el-form-item>
        <el-button @click="orderTimeAdd" type="text">添加</el-button>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
  import { startAddNumber } from '@/lib/date.js'

  export default {
    name: 'orderForm',
    props: {
      query: {
        required: true,
        type: Object
      },
      isBothConfirm: {
        required: true
      },
      strategyId: { // 编辑传id
        default: ''
      },
      studentIntentionId: {
        required: true
      }
    },
    data() {
      return {
        lessonTimePickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        },
        formLoading: true,
        rules: {
          frequency: { required: true, message: '请选择' },
          frequencyNum: { required: true, message: '请填写' },
          singleClassLength: { required: true, message: '请选择' },
          lessonTime: { required: true, message: '请选择' }
        },
        options: {
          frequency: {},
          classLevel: {},
          frequencyInfo: {},
          frequencyInfoChoose: {}
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      // api
      getOption() {
        return this.$http.get('courseApplication_getOption')
      },
      // init
      async init() {
        try {
          const option = await this.getOption()
          const { classLevel, frequency, frequencyInfo } = option.data
          this.options.frequency = frequency
          this.options.classLevel = classLevel
          this.options.frequencyInfo = frequencyInfo
          if (this.strategyId) {
            this.options.frequencyInfoChoose = this.options.frequencyInfo[this.query.frequency]
          }
          this.formLoading = false
        } catch (e) {
          console.log(e)
          this.$message.error('获取数据失败')
        }
      },
      // event
      orderTimeValidator(rule, value, callback) {
        if (this.query.frequency !== '6' && !value.id) {
          return callback(new Error('请填写完整'))
        }

        if (!value.startTime || !value.endTime) {
          return callback(new Error('请填写完整'))
        }

        let startTime = value.startTime
        const endTime = value.endTime
        let isCrossDay = false // 是否跨天

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

        if (this.isBothConfirm === '1' && totalTime < this.query.singleClassLength * 60 * 1000) {
          return callback(new Error('可排时间必须大于等于单次时长'))
        }

        if (this.isBothConfirm === '2' && totalTime !== this.query.singleClassLength * 60 * 1000) {
          return callback(new Error('可排时间必须等于单次时长'))
        }

        callback()
      },
      orderTimeDelete(index) {
        this.query.platoonTimeArrObj.splice(index, 1)
      },
      orderTimeAdd() {
        this.query.platoonTimeArrObj.push({ id: '', startTime: '', endTime: '' })
      },
      orderTimeStartChange(val, index) {
        if (this.isBothConfirm === '2' && val) {
          this.query.platoonTimeArrObj[index]['endTime'] = startAddNumber(val, this.query.singleClassLength)
        }
      },
      acceptFrequencyChange(val) {
        this.singleTimeChange()
        if (val && val !== '6') {
          this.options.frequencyInfoChoose = this.options.frequencyInfo[val]
        }
      },
      singleTimeChange() {
        this.query.platoonTimeArrObj = [{ id: '', startTime: '', endTime: '' }]
      }
    }
  }
</script>
