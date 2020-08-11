<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <Panel
      title="课程安排"
      kind="lessonArrange"
    >
      <template slot="list">
        <el-form :model="query" ref="query" inline>
          <el-form-item>
            <el-date-picker
              v-model="queryTimeRange"
              :editable="false"
              type="daterange"
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
                :label="item.subjectName"
                :value="item.subjectId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="query.teacherId" clearable filterable placeholder="上课老师">
              <el-option
                v-for="(item,index) in options.teachers"
                :key="index"
                :label="item.name"
                :value="item.userId">
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
          @get-list="getList"

          cell-class-row-name="statusColorClass"

          :rows="rows"
          :loading="loading"
          :columns="columns"
          :slot-name-arr="slotNameArr">

          <template slot-scope="scope" slot="status">
            <span :class="{'color-green':scope.row['status']!== '已完成'}">{{scope.row['status']}}</span>
          </template>

          <template slot-scope="scope" slot="lessonDetail">
            <el-popover trigger="hover" placement="top" v-if="scope.row['knowledge_name'] && scope.row['knowledge_name'].length>15" width="500">
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

          <template slot-scope="scope" slot="phoneAndQQ">
            <div>
              <span class="box-flex" v-if="scope.row['phone']">
                <span>手机号：</span>
                <span class="phone-hide">
                  {{scope.row['phone']}}
                </span>
                <CommitDetailDialog
                  :fixDialog="fixDialog"
                  :studentInfo = "studentInfo"
                  :isStudent="isStudent"
                  :teacherId="(scope.row.teacherId)"
                  :phone="(scope.row.phone)">
                </CommitDetailDialog>
              </span>
              <span class="box-flex" v-if="scope.row['qq'] !== ''"><span>QQ：</span><span>{{scope.row['qq']}}</span></span>
            </div>
          </template>

          <template slot-scope="scope" slot="downloadUrl">
            <el-button 
              type="text"
              @click="jumpDownload(scope.row['downloadUrl'])"
              v-if="scope.row['downloadUrl'] && scope.row['downloadUrl'].length>15"
              >查看</el-button>
          </template>

          <template slot-scope="scope" slot="studentEvaluateStr">
            <el-popover trigger="hover" placement="top" v-if="scope.row['studentEvaluateStr'] && scope.row['studentEvaluateStr'].length>15" width="500">
              <span>{{scope.row['studentEvaluateStr']}}</span>
              <div slot="reference" class="name-wrapper">
                <span>{{scope.row['studentEvaluateStr'].slice(0,13)}}...</span>
              </div>
            </el-popover>
            <span v-else>{{scope.row['studentEvaluateStr']}}</span>
          </template>

          <template slot-scope="scope" slot="operating">
            <span v-if="scope.row['lessonTypeName'] === '试听课'">
              <el-button v-if="scope.row.orderId" type="text" @click="goSetClassView(scope.row)">设班单</el-button>
            </span>
            <span v-else>
              <template>
                <span v-if="scope.row['lessonTypeName'] === '体验课' && scope.row['trackName'] === name">
                  <el-button type="text" @click="adjustTime(scope.row)">调整时间</el-button>
                  <el-button type="text" @click="cancleTime(scope.row)">取消</el-button>
                </span>
              </template>
            </span>
          </template>
        </expand-table>

        <!-- 调整开课时间 -->
        <el-dialog
          :visible.sync="dialog.changeClassTime.show"
          custom-class="el-dialog-md"
          class="dialog-change-class">
          <p slot="title" class="dialog-title">
            <b>为学生<b class="color-blue"> {{studentInfo.name}} </b>调整体验课时间</b>
          </p>
          <el-form label-width="200px"
            :model="dialog.changeClassTime.query"
            :ref="dialog.changeClassTime.refName"
            :rules="dialog.changeClassTime.rules">
            <el-form-item label="讲师：">
              <el-input v-model="dialog.changeClassTime.query.teacherName" disabled class="width-70"></el-input>
            </el-form-item>
            <el-form-item label="原开课时间：">
              <el-date-picker
                v-model="dialog.changeClassTime.query.adjustStartTime"
                type="datetime"
                placeholder="选择日期时间"
                class="width-70"
                disabled>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="调整开课时间：" prop="planStartTime">
              <el-date-picker
                v-model="dialog.changeClassTime.query.planStartTime"
                popper-class="rightAway"
                type="datetime"
                placeholder="选择日期"
                :picker-options="dialog.changeClassTime.pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                class="width-70">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button
              @click="dialog.changeClassTime.submitEvent"
              type="primary">提交
            </el-button>
          </span>
        </el-dialog>

        <!-- 取消开课时间 -->
        <el-dialog
          :visible.sync="dialog.cancleClassTime.show"
          class="dialog-cancle-class"
          width="30%">
          <p slot="title" class="title" v-if="dialog.cancleClassTime.rightShow">
            <svg-icon icon-class="warning1" class="icon-size"></svg-icon>
            提示<br><br>
            <span class="text-size">确定取消 {{dialog.cancleClassTime.cancleTimeView}} 开始的体验课程吗？</span>
          </p>
          <p slot="title" class="title" v-else>
            <svg-icon icon-class="warning1" class="icon-size"></svg-icon>
            提示<br><br>
            <span class="text-size">过了开课时间不能取消该课程</span>
          </p>
          <span slot="footer">
            <el-button
              type="primary"
              class="dialog-submit" @click="dialog.cancleClassTime.show = false" v-if="dialog.cancleClassTime.rightShow">暂不取消
            </el-button>
            <el-button
              type="primary"
              class="dialog-submit"
              v-if="dialog.cancleClassTime.rightShow"
              @click="dialog.cancleClassTime.submitEvent">确定
            </el-button>
          </span>
        </el-dialog>
      </template>
    </Panel>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'
  import { mapGetters } from 'vuex'
  import Panel from '../components/component/panel.vue'

  export default {
    components: {
      ExpandTable,
      CommitDetailDialog,
      Panel
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
          lessonStatus: ''
        },
        options: {
          lessonType: [],
          subject: [],
          teachers: [],
          lessonStatus: []
        },
        rows: [],
        loading: false,
        slotNameArr: ['status', 'lessonDetail', 'lessonPlanTime', 'phoneAndQQ', 'downloadUrl', 'studentEvaluateStr', 'operating'],
        columns: [
          {
            value: 'status', text: '状态', fixed: 'left'
          },
          {
            value: 'lessonTypeName', text: '课程类型'
          },
          {
            value: 'subjectName', text: '科目'
          },
          {
            value: 'knowledgeName', text: '知识点'
          },
          {
            value: 'planDate', text: '上课日期'
          },
          {
            value: 'lessonPlanTime', text: '上课时间', width: 140
          },
          {
            value: 'teacherName', text: '上课老师'
          },
          {
            value: 'phoneAndQQ', text: '联系老师', width: 190
          },
          {
            value: 'studentEvaluateStr', text: '学生对老师的评价', width: 140
          },
          {
            value: 'downloadUrl', text: '诊断报告', fixed: 'right'
          },
          {
            value: 'operating', text: '操作', width: 120, fixed: 'right'
          }
        ],
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '5'
        },
        dialog: {
          changeClassTime: {
            show: false,
            title: '调整上课时间',
            refName: 'changeClassTime',
            submitEvent: this.changeClassTimeSubmitEvent,
            nowTime: new Date().getTime(),
            pickerOptions: {
              disabledDate: this.disabledDate
            },
            query: {
              teacherName: '',
              adjustStartTime: '',
              lessonPlanId: '',
              planStartTime: '',
              lessonType: '',
              trackId: ''
            },
            rules: {
              planStartTime: {
                required: true, trigger: 'change', validator: this.timePickerValidate
              }
            }
          },
          cancleClassTime: {
            show: false,
            rightShow: false,
            submitEvent: this.cancleClassSubmitEvent,
            cancleTimeView: '',
            query: {
              lessonPlanId: '',
              lessonType: '',
              trackId: ''
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
      },
      fixDialog: Object
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    created() {
      this.getList()
    },
    mounted() {
      this.getOptions()
      this.$eventBus.$on('change-class-plan', this.getList)
    },
    methods: {
      // get
      getTeacherStudentCalendar(params) {
        return this.$http.post('lesson_studentCalendarList', Object.assign(params, {
          studentId: this.studentId,
          studentIntentionId: this.rosterId
        }), { paging: this.paging, isFilterUrl: true })
      },
      getTeacherStudentCalendarParam() {
        return this.$http.post('lesson_studentCalendarParam', {
          studentIntentionId: this.rosterId,
          studentId: this.studentId
        })
      },
      getTeacherCancelPlan(params) {
        return this.$http.post('lesson_cancelPlan', params)
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
        this.getTeacherStudentCalendar(_query).then(res => {
          if (res.data) {
            if (res.data.result.length === 0) {
              this.rows = []
              this.paging.totalRows = '0'
              return false
            }
            this.rows = this.handleListData(res.data.result)
            this.paging.totalRows = res.data.count
          }
        }).catch(error => {
          console.log(error)
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

          let lessonCompleteStr = '老师授课内容满意度（'
          let commonuicateFluentStr = '教师交流互动满意度（'
          let teachQualityStr = '本次课程听懂程度（'
          switch (val.lessonComplete) {
            case '5':
              lessonCompleteStr += '非常满意）；'
              break
            case '3':
              lessonCompleteStr += '一般般）；'
              break
            case '1':
              lessonCompleteStr += '不满意）；'
              break
            default:
              lessonCompleteStr = ''
          }

          switch (val.commonuicateFluent) {
            case '5':
              commonuicateFluentStr += '非常满意）；'
              break
            case '3':
              commonuicateFluentStr += '一般般）；'
              break
            case '1':
              commonuicateFluentStr += '不满意）；'
              break
            default:
              commonuicateFluentStr = ''
          }

          switch (val.teachQuality) {
            case '5':
              teachQualityStr += '完全听懂）'
              break
            case '3':
              teachQualityStr += '部分听懂）'
              break
            case '1':
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
          }
        }).catch(error => {
          console.log(error)
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
      // 设班单详情
      goSetClassView(row) {
        if (this.rosterId && row.orderId) {
          this.$router.push(`/lessonplanorder/list_student/${row.orderId}`)
        } else {
          this.$message.error('网络连接异常')
          return
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
          }
        }).catch(error => {
          console.log(error)
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
      disabledDate(val) {
        const nowTime = this.dialog.changeClassTime.nowTime
        const valTime = new Date(val).getTime()
        if (valTime > (nowTime - 86400000)) {
          return false
        }
        return true
      },
      timePickerValidate(rule, value, callback) {
        if (!rule.required) {
          return callback()
        }
        if (!value) {
          callback(new Error('请选择时间'))
          return
        }
        const nowTime = new Date().getTime()
        if (nowTime > new Date(value).getTime()) {
          callback(new Error('开课时间不能为过去时间'))
          return
        }
        callback()
      },
      // 调整上课时间 弹窗
      adjustTime(data) {
        const nowTime = new Date().getTime()
        const cancleTime = data.planDate + ' ' + data.lessonPlanTime
        if (nowTime > new Date(cancleTime).getTime()) {
          this.$message.warning('过了开课时间不能调整')
        } else {
          const dialogData = this.dialog.changeClassTime.query
          dialogData.teacherName = data.teacherName
          dialogData.adjustStartTime = data.planDate + ' ' + data.lessonPlanTime
          dialogData.lessonPlanId = data.lessonPlanId
          dialogData.lessonType = data.lessonType
          dialogData.trackId = data.trackId
          this.dialog.changeClassTime.show = true
        }
      },
      // 调整体验课
      changeClassTimeSubmitEvent() {
        const _query = Object.assign({}, this.dialog.changeClassTime.query)
        this.$delete(_query, 'teacherName')
        this.$delete(_query, 'adjustStartTime')
        this.$http.post('lesson_experienceclassTime', _query).then(res => {
          if (res.data) {
            this.$message.success(res.message)
          }
        }).catch(console.log).finally(() => {
          this.dialog.changeClassTime.show = false
          this.getList()
        })
      },
      // 取消上课时间 弹窗
      cancleTime(data) {
        this.dialog.cancleClassTime.show = true
        const nowTime = new Date().getTime()
        const cancleTime = data.planDate + ' ' + data.lessonPlanTime
        if (nowTime > new Date(cancleTime).getTime()) {
          this.dialog.cancleClassTime.rightShow = false
        } else {
          this.dialog.cancleClassTime.cancleTimeView = cancleTime
          this.dialog.cancleClassTime.query.lessonPlanId = data.lessonPlanId
          this.dialog.cancleClassTime.query.trackId = data.trackId
          this.dialog.cancleClassTime.query.lessonType = data.lessonType
          this.dialog.cancleClassTime.rightShow = true
        }
      },
      // 取消上课时间
      cancleClassSubmitEvent() {
        const _query = Object.assign({}, this.dialog.cancleClassTime.query)
        this.$http.post('lesson_cancelExperienceclass', _query).then(res => {
          if (res.data) {
            this.$message.success(res.message)
          }
        }).catch(console.log).finally(() => {
          this.dialog.cancleClassTime.show = false
          this.getList()
        })
      },
      // 下载页面
      jumpDownload(url) {
        url && window.open(url)
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/student/detail/calendarTable.sass'
</style>
