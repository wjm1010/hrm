<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <h3 style="color: #525E71">课程日历</h3>
    <el-form :model="query" ref="query" inline>
      <el-form-item>
        <el-date-picker
          v-model="queryTimeRange"
          :editable="false"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.lessonType" clearable filterable placeholder="课程类型">
          <el-option
            v-for="(item,index) in options.lessonType"
            :key="index"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.subjectId" clearable filterable placeholder="科目">
          <el-option
            v-for="(item,index) in options.subject"
            :key="index"
            :label="item.subject_name"
            :value="item.subject_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.teacherId" clearable filterable placeholder="上课老师">
          <el-option
            v-for="(item,index) in options.teachers"
            :key="index"
            :label="item.name"
            :value="item.user_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.lessonStatus" clearable filterable placeholder="课程状态">
          <el-option
            v-for="(item,index) in options.lessonStatus"
            :key="index"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!canSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <expand-table
      :pagination="paging"
      @page-size-change="pageSizeChange"
      @page-current-change="pageCurrentChange"

      cell-class-row-name="statusColorClass"

      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">

      <template slot-scope="scope" slot="status">
        <span :class="{'color-green':scope.row['status']!== '已完成'}">{{scope.row['status']}}</span>
      </template>

      <template slot-scope="scope" slot="lessonDetail">
        <el-popover trigger="hover" placement="top" v-if="scope.row['knowledge_name'].length>15" width="500">
          <span>{{scope.row['knowledge_name']}}</span>
          <div slot="reference" class="name-wrapper">
            <span>{{scope.row['knowledge_name'].slice(0,13)}}...</span>
          </div>
        </el-popover>
        <span v-else>{{scope.row['knowledge_name']}}</span>
      </template>

      <template slot-scope="scope" slot="lessonPlanTime">
        <span>{{scope.row['lessonPlanTime']}} -- {{scope.row['endTime']}}</span>
      </template>

      <!-- 课程老师 点击老师打开服务中心老师课表 -->
      <template slot-scope="scope" slot="teacherName">
        <el-button type="text"
          @click="changeTableViewSelect(scope.row)">
          {{scope.row['teacherName']}}
        </el-button>
      </template>

      <template slot-scope="scope" slot="phoneAndQQ">
        <span>
          <span class="box-flex" v-if="scope.row['phone']">
            <span>手机号：</span>
            <span class="phone-hide" v-if="scope.row['isHidePhone']" @click="$set(scope.row,'isHidePhone',false)">
              {{scope.row['phone'].slice(0,3)}}****{{scope.row['phone'].slice(-4)}}
            </span>
            <span v-if="!scope.row['isHidePhone']">{{scope.row['phone']}}</span>
            <CommitDetailDialog
              :isStudent="isStudent"
              :studentInfo = "studentInfo"
              :phone="(scope.row.phone)"
              :showDialog="showDialog">
            </CommitDetailDialog>
          </span>
          <span class="box-flex" v-if="scope.row['qq'] !== ''"><span>QQ：</span><span>{{scope.row['qq']}}</span></span>
        </span>
      </template>

      <template slot-scope="scope" slot="teacherEvaluateAndCore">
        <el-popover trigger="hover" placement="top" v-if="scope.row['teacherEvaluateAndCoreStr'].length>15" width="500">
          <span>{{scope.row['teacherEvaluateAndCoreStr']}}</span>
          <div slot="reference" class="name-wrapper">
            <span>{{scope.row['teacherEvaluateAndCoreStr'].slice(0,13)}}...</span>
          </div>
        </el-popover>
        <span v-else>{{scope.row['teacherEvaluateAndCoreStr']}}</span>
      </template>

      <template slot-scope="scope" slot="studentEvaluate">
        <el-popover trigger="hover" placement="top" v-if="scope.row['studentEvaluateStr'].length>15" width="500">
          <span>{{scope.row['studentEvaluateStr']}}</span>
          <div slot="reference" class="name-wrapper">
            <span>{{scope.row['studentEvaluateStr'].slice(0,13)}}...</span>
          </div>
        </el-popover>
        <span v-else>{{scope.row['studentEvaluateStr']}}</span>
      </template>

      <template slot-scope="scope" slot="operating">
        <span v-if="scope.row['lessonTypeName'] === '试听课'">
          <el-button type="text" @click="goSetClassView">设班单</el-button>
        </span>
        <span v-else-if="scope.row['lessonTypeName'] === '正式课'">
          <template>
            <span v-if="scope.row['status'] === '备课中' || scope.row['status'] === '已备课'">
              <el-button type="text" @click="changeClassTimeBtnEvent(scope.row)">调整时间</el-button>
              <el-button type="text" @click="wasteClassBtnEvent(scope.row)">废课</el-button>
            </span>
            <span v-else>无</span>
          </template>
        </span>
        <span v-else>
          <template>
            <!--<span v-if="scope.row['status'] === '备课中' || scope.row['status'] === '已备课'">-->
            <!--<el-button type="text" @click="wasteClassBtnEvent(scope.row)">废课</el-button>-->
            <!--</span>-->
            <!--<span v-else>无</span>-->
            <span>无</span>
          </template>
        </span>
      </template>

    </expand-table>

    <el-dialog
      :visible.sync="dialog.wasteClass.show"
      custom-class="el-dialog-md"
      class="dialog-waste-class">
      <p slot="title" class="dialog-title">
        <b>注意：
          <b class="color-blue">
            {{studentInfo.name}} {{dialog.wasteClass.data.planDate}}
            {{dialog.wasteClass.data.lessonPlanTime}} {{dialog.wasteClass.data.lessonTypeName}}
            {{dialog.wasteClass.data.subject_name}}
          </b>
          <span>课程被废除</span>
        </b>
      </p>
      <div class="content">
        <p>* 取消原因：</p>
        <el-radio-group v-model="dialog.wasteClass.query.cancelType" class="radio-group">
          <el-radio label="调课">调课</el-radio>
          <el-radio label="请假">请假</el-radio>
          <el-radio label="换老师">换老师</el-radio>
          <el-radio label="退费">退费</el-radio>
          <el-radio label="其他">其他</el-radio>
        </el-radio-group>
        <el-input
          class="cancel-reason"
          v-model.trim="dialog.wasteClass.cancelReason"
          placeholder="请输入原因"
          clearable></el-input>
      </div>
      <div slot="footer">
        <el-button
          @click="dialog.wasteClass.yesEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">确认
        </el-button>
        <el-button
          @click="dialog.wasteClass.noEvent"
          type="info"
          class="dialog-submit">取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.changeClassTime.show"
      v-loading="loading"
      custom-class="el-dialog-md"
      class="dialog-change-class">
      <p slot="title" class="dialog-title">
        <b>为学生<b class="color-blue"> {{studentInfo.name}} </b>调整上课时间</b>
      </p>
      <div class="content">
        <p class="message">
          <i :class="['yellow-round',{
          'trial-lesson':dialog.changeClassTime.data.lessonTypeName ==='体验课',
          'formal-lesson':dialog.changeClassTime.data.lessonTypeName ==='正式课'
          }]"></i>
          {{dialog.changeClassTime.data.planDate}}
          {{dialog.changeClassTime.data.lessonPlanTime}}
          {{dialog.changeClassTime.data.lessonTypeName}}
          {{dialog.changeClassTime.data.lessonName}}
          {{dialog.changeClassTime.data.teacherName}}
        </p>
        <el-form
          :model="dialog.changeClassTime.query"
          :ref="dialog.changeClassTime.refName"
          :rules="dialog.changeClassTime.rules"
          label-width="120px">
          <el-form-item prop="planLength" label="单课时长：">
            <el-select v-model="dialog.changeClassTime.query.planLength" clearable filterable class="width-70">
              <el-option v-for="(item, index) in dialog.changeClassTime.options.planLengths"
                         :key="index"
                         :label="item.value"
                         :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="planStartDate" label="上课时间：">
            <el-date-picker
              class="width-70"
              v-model="dialog.changeClassTime.query.planStartDate"
              :picker-options="dialog.changeClassTime.planStartDateOptions"
              :editable="false"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="planStartHour">
            <el-time-select
              v-model="dialog.changeClassTime.query.planStartHour"
              class="width-70"
              :editable="false"
              clearable
              :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '23:55'
                }"
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          @click="dialog.changeClassTime.submitEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'

  export default {
    components: {
      ExpandTable,
      CommitDetailDialog
    },
    name: 'calendar-table',
    data() {
      return {
        isStudent: false,
        queryTimeRange: this.getQueryTimeRange(),
        query: {
          studentId: '',
          calendarEnd: '',
          calendarStart: '',
          lessonType: '',
          subjectId: '',
          teacherId: '',
          lessonStatus: '',
          page: 1,
          pageSize: 5
        },
        options: {
          lessonType: [],
          subject: [],
          teachers: [],
          lessonStatus: []
        },
        rows: [],
        loading: false,
        slotNameArr: ['status', 'lessonDetail', 'lessonPlanTime', 'teacherName', 'phoneAndQQ', 'teacherEvaluateAndCore', 'studentEvaluate', 'operating'],
        columns: [
          {
            value: 'status', text: '状态'
          },
          {
            value: 'lessonTypeName', text: '课程类型'
          },
          {
            value: 'subject_name', text: '科目'
          },
          {
            value: 'lessonDetail', text: '知识点'
          },
          {
            value: 'planDate', text: '上课日期'
          },
          {
            value: 'lessonPlanTime', text: '上课时间'
          },
          {
            value: 'teacherName', text: '上课老师'
          },
          {
            value: 'phoneAndQQ', text: '联系老师'
          },
          {
            value: 'teacherEvaluateAndCore', text: '老师评价'
          },
          {
            value: 'studentEvaluate', text: '学生评价'
          },
          {
            value: 'operating', text: '操作'
          }
        ],
        paging: {
          totalRows: 0,
          page: 1,
          pageSize: 5
        },
        dialog: {
          wasteClass: {
            show: false,
            title: '废课提醒',
            yesEvent: this.wasteClassYesEvent,
            noEvent: this.wasteClassNoEvent,
            data: {
              planDate: '',
              lessonPlanTime: '',
              lessonTypeName: '',
              subject_name: ''
            },
            query: {
              cancelType: '',
              lessonPlanId: ''
            },
            cancelReason: ''
          },
          changeClassTime: {
            show: false,
            title: '调整上课时间',
            refName: 'changeClassTime',
            submitEvent: this.changeClassTimeSubmitEvent,
            data: {
              planDate: '',
              lessonPlanTime: '',
              lessonTypeName: '',
              lessonName: '',
              teacherName: ''
            },
            query: {
              lessonPlanId: '',
              planStartDate: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)}-${new Date().getDate()}`,
              planStartHour: '13:00',
              planLength: 2
            },
            planStartDateOptions: {
              disabledDate: this.changeClassTimeDisabledDate
            },
            options: {
              planLengths: []
            },
            rules: {
              planLength: {
                required: true, message: '请选择', trigger: 'change'
              },
              planStartDate: {
                required: true, trigger: 'change', validator: this.changeClassTimeDatePickerValidate
              },
              planStartHour: {
                required: true, trigger: 'change', validator: this.changeClassTimeHourPickerValidate
              }
            }
          }
        },
        canSearch: true
      }
    },
    props: {
      rosterId: {
        required: true
      },
      studentId: {
        required: true
      },
      studentInfo: {
        required: true
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      this.getOptions()
    },
    methods: {
      // get
      getTeacherStudentCalendar(params) {
        return this.$http.get('teacher_studentCalendar', {
          params: Object.assign(params, {
            studentId: this.studentId
          })
        })
      },
      getTeacherStudentCalendarParam() {
        return this.$http.get('teacher_studentCalendarParam', {
          params: {
            studentIntentionId: this.rosterId,
            studentId: this.studentId
          }
        })
      },
      getTeacherCancelPlan(params) {
        return this.$http.get('teacher_cancelPlan', {
          params: params
        })
      },
      getTeacherAdjustmentTimeParam(id) {
        return this.$http.get('teacher_adjustmentTimeParam', {
          params: {
            lessonPlanId: id
          }
        })
      },
      getTeacherAdjustmentTime(params) {
        return this.$http.get('teacher_adjustmentTime', {
          params
        })
      },
      // page
      pageSizeChange(val) {
        this.$set(this.paging, 'pageSize', val)
        this.getList()
      },
      pageCurrentChange(val) {
        this.$set(this.paging, 'page', val)
        this.getList()
      },
      // data
      getList() {
        this.canSearch = false
        this.loading = true
        const _query = Object.assign({}, this.query)
        if (this.queryTimeRange === null || this.queryTimeRange.length === 0) {
          _query.calendarStart = ''
          _query.calendarEnd = ''
        } else {
          _query.calendarStart = this.queryTimeRange[0]
          _query.calendarEnd = this.queryTimeRange[1]
        }
        _query.page = this.paging.page
        _query.pageSize = this.paging.pageSize
        this.getTeacherStudentCalendar(_query).then(res => {
          if (res.data) {
            if (res.data.result.length === 0) {
              this.rows = []
              this.paging.totalRows = '0'
              return false
            }
            this.rows = this.handleListData(res.data.result)
            this.paging.totalRows = res.data.count
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('操作失败，请稍后重试！')
        }).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      handleListData(data) {
        data.forEach((val, index) => {
          if (val.status === '已完成') {
            val.statusColorClass = 'eee-row'
          } else if (val.status === '上课中') {
            val.statusColorClass = 'warning-row'
          } else {
            val.statusColorClass = ''
          }

          let teacherEvaluateAdvantageStr = '优点及薄弱项：'
          let teacherEvaluateNextLessonContent = '下节课预习内容：'
          if (val.student_weak_point) {
            teacherEvaluateAdvantageStr = teacherEvaluateAdvantageStr + val.student_weak_point + '；'
          } else {
            teacherEvaluateAdvantageStr = ''
          }
          if (val.student_preview_content) {
            teacherEvaluateNextLessonContent = teacherEvaluateNextLessonContent + val.student_preview_content + '；'
          } else {
            teacherEvaluateNextLessonContent = ''
          }
          val.teacherEvaluateAndCoreStr = teacherEvaluateAdvantageStr + teacherEvaluateNextLessonContent

          let lessonCompleteStr = '老师授课内容满意度（'
          let commonuicateFluentStr = '教师交流互动满意度（'
          let teachQualityStr = '本次课程听懂程度（'
          switch (val.lesson_complete) {
            case 5:
              lessonCompleteStr += '非常满意）；'
              break
            case 3:
              lessonCompleteStr += '一般般）；'
              break
            case 1:
              lessonCompleteStr += '不满意）；'
              break
            default:
              lessonCompleteStr = ''
          }

          switch (val.commonuicate_fluent) {
            case 5:
              commonuicateFluentStr += '非常满意）；'
              break
            case 3:
              commonuicateFluentStr += '一般般）；'
              break
            case 1:
              commonuicateFluentStr += '不满意）；'
              break
            default:
              commonuicateFluentStr = ''
          }

          switch (val.teach_quality) {
            case 5:
              teachQualityStr += '完全听懂）'
              break
            case 3:
              teachQualityStr += '部分听懂）'
              break
            case 1:
              teachQualityStr += '完全不懂）'
              break
            default:
              teachQualityStr = ''
          }
          val.studentEvaluateStr = lessonCompleteStr + commonuicateFluentStr + teachQualityStr

          // 手机号码隐藏
          val.isHidePhone = true
          val.index = index
        })
        return data
      },
      getOptions() {
        this.getTeacherStudentCalendarParam().then(res => {
          if (res.data) {
            this.options = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取学生日历筛选条件失败')
        })
      },
      getQueryTimeRange() {
        const date = new Date()
        const year = date.getFullYear()
        const mouth = date.getMonth() + 1
        const day = new Date(year, mouth, 0).getDate()
        var _mouth
        if (mouth < 10) {
          _mouth = `0${mouth}`
        } else {
          _mouth = mouth
        }
        return [`${year}-${_mouth}-01`, `${year}-${_mouth}-${day}`]
      },
      // 设班单
      goSetClassView() {
        if (this.rosterId) {
          this.$router.push(`/lessonplanorder/list_student/${this.rosterId}`)
        } else {
          this.$message.error('没有rosterId')
        }
      },
      // 查看服务中心老师课表
      changeTableViewSelect(row) {
        if (row.teacherName && row.teacherId) {
          this.$router.push(`/lessonplan/manageReadonly/${row.teacherId}/${row.teacherName}`)
        }
      },
      // 废课
      wasteClassYesEvent() {
        var _query = Object.assign({}, this.dialog.wasteClass.query)
        if (!this.dialog.wasteClass.query.cancelType) {
          this.$message.warning('请选择取消原因')
          return
        }
        if (this.dialog.wasteClass.query.cancelType === '其他') {
          if (this.dialog.wasteClass.cancelReason === '') {
            this.$message.warning('请填写取消原因')
            return
          } else {
            _query.cancelType = this.dialog.wasteClass.cancelReason
          }
        }
        this.canSearch = false
        this.getTeacherCancelPlan(_query).then(res => {
          if (res.data) {
            this.dialog.wasteClass.show = false
            this.$message.success(res.message)
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('废课失败')
        }).finally(() => {
          this.canSearch = true
        })
      },
      wasteClassNoEvent() {
        this.dialog.wasteClass.show = false
      },
      wasteClassBtnEvent(row) {
        this.dialog.wasteClass.data = row
        this.dialog.wasteClass.query.lessonPlanId = row.lessonPlanId
        this.dialog.wasteClass.show = true
      },
      // 调整上课时间
      changeClassTimeSubmitEvent() {
        this.$refs[this.dialog.changeClassTime.refName].validate(valid => {
          if (valid) {
            this.canSearch = false
            const copyObj = Object.assign({}, this.dialog.changeClassTime.query)
            var _query = {
              lessonPlanId: copyObj.lessonPlanId,
              planStartTime: copyObj.planStartDate + ' ' + copyObj.planStartHour,
              planLength: copyObj.planLength
            }

            this.getTeacherAdjustmentTime(_query).then(res => {
              if (res.data) {
                this.$message.success('排课成功')
                this.dialog.changeClassTime.show = false
                this.getList()
              } else {
                this.$message.error(res.message)
              }
            }).catch(error => {
              console.log(error)
              this.$message.error('排课失败')
            }).finally(() => {
              this.canSearch = true
            })
          } else {
            this.$message.warning('提交失败')
          }
        })
      },
      changeClassTimeBtnEvent(row) {
        this.loading = true
        this.canSearch = false
        this.getTeacherAdjustmentTimeParam(row.lessonPlanId).then(res => {
          if (res.data) {
            this.dialog.changeClassTime.data = row
            this.dialog.changeClassTime.query.lessonPlanId = row.lessonPlanId
            this.dialog.changeClassTime.options.planLengths = res.data
            this.dialog.changeClassTime.show = true
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取时间数据失败')
        }).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      changeClassTimeDatePickerValidate(rule, value, callback) {
        if (!value) {
          callback(new Error('请选择日期'))
          return
        }
        callback()
      },
      changeClassTimeHourPickerValidate(rule, value, callback) {
        if (!value) {
          callback(new Error('请选择时间'))
        } else if (!this.dialog.changeClassTime.query.planStartDate) {
          callback(new Error('请先选择日期'))
        } else if (!this.dialog.changeClassTime.query.planLength) {
          callback(new Error('请先选择单科时长'))
        }
        const nowTime = new Date().getTime()
        const chooseTime = new Date(`${this.dialog.changeClassTime.query.planStartDate} ${value}`).getTime()
        const hourTimeArr = value.split(':') // '08:40'==>[08,40]
        const hourTimeNum = hourTimeArr[0] * 3600000 + hourTimeArr[1] * 60000
        if (nowTime > chooseTime) {
          callback(new Error('上课时间不能小于当前时间'))
        // } else if (tomorrowTime < chooseTime + planLengthTime) {
        //   callback(new Error('此节课已跨天，请重新选择调课后时间'))
        } else if ((hourTimeNum >= 34200000 && hourTimeNum <= 36000000) || (hourTimeNum >= 52200000 && hourTimeNum <= 55800000) && this.dialog.changeClassTime.query.planLength === 2) {
          // 在[9:30,10:00]或者[14:30,15:30] 单节时长不能等于2h
          callback(new Error('在 9:30至10:00 或者 14:30至15:30 单课时长不能为2h'))
        } else {
          callback()
        }
      },
      changeClassTimeDisabledDate(val) {
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
  @import '../../../styles/roster/detail/calendarTable.sass'
</style>
