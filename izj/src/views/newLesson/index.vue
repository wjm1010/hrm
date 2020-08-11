<template>
  <div class="dashboard-container">
    <div v-loading="allLoading">
      <div v-if="!strategyId || !allLoading">

        <base-info-form
          ref="baseInfoForm"
          :student-intention-id="studentIntentionId"
          :student-name="studentName"
          :student-no="studentNo"
          :query="baseInfoQuery"
        >
        </base-info-form>

        <public-form
          v-show="baseInfoQuery.contractUsable && baseInfoQuery.contractUsable !== '0'"
          ref="publicForm"
          :contract-type="baseInfoQuery.contractType"
          :is-contract-type-change.sync="isContractTypeChange"
          :strategy-id="strategyId"
          :student-intention-id="studentIntentionId"
          :query="publicQuery"
        >
        </public-form>

        <order-form
          ref="orderForm"
          :strategy-id="strategyId"
          :query="orderQuery"
          :student-intention-id="studentIntentionId"
          :is-both-confirm="publicQuery.bothIsConfirmed"
          v-if="publicQuery.bothIsConfirmed && publicQuery.isSort === '2'"
        >
        </order-form>

        <template v-if="publicQuery.bothIsConfirmed && publicQuery.isSort === '2'">
          <el-form
            :model="actualLessonQuery"
            ref="actualLessonForm"
            label-position="left"
            label-width="120px"
            :rules="actualLessonRules"
          >
            <el-form-item label="实际课时" prop="actualPeriod" ref="actualLessonFormActualPeriod">
              <span>{{actualLessonQuery.actualPeriod}}</span>
              <el-button type="primary" @click="actualLessonTimeEvent" :disabled="!isCanCalculation">计算</el-button>
              <span v-if="actualLessonQuery.actualPeriod">
                <span style="margin-left: 10px">排课首课时间</span>
                <span>{{actualLessonQuery.firstLessonTime}}</span>
              </span>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model.trim="actualLessonQuery.remark"
                placeholder="最多500字"
                :maxlength="500"
                :rows="4">
              </el-input>
            </el-form-item>
          </el-form>
        </template>

        <no-order-form
          ref="noOrderForm"
          :query="noOrderQuery"
          :post-count-course-hour="postCountCourseHour"
          v-if="publicQuery.bothIsConfirmed && publicQuery.isSort === '1'"
        >
        </no-order-form>
      </div>
    </div>

    <div style="float: right">
      <el-button @click="dialogSubmitEvent(true)" type="primary" :disabled="!isCanSubmit">保存</el-button>
      <el-button @click="dialogSubmitEvent(false)" type="primary" :disabled="!isCanSubmit">提交</el-button>
    </div>

    <error-dialog
      :is-show.sync="errorDialogVisible"
      :body-message="errorDialogBodyMessage"
    >
    </error-dialog>

    <bad-lesson-dialog
      :is-show.sync="isBadLessonDialogShow"
      :data="badLessonDialogData"
      :newStrategyId="newStrategyId"
      :strategyId="strategyId"
      :studentIntentionId="studentIntentionId"
      :studentName="studentName"
      :studentNo="studentNo"
      @submit-event="submitAndGoView">
    </bad-lesson-dialog>

  </div>
</template>

<script>
  import BaseInfoForm from './baseInfoForm'
  import OrderForm from './orderForm'
  import NoOrderForm from './noOrderForm'
  import PublicForm from './publicForm'
  import ErrorDialog from './errorDialog'
  import BadLessonDialog from './badLessonDialog'
  import { mapGetters } from 'vuex'
  import { arrHaveIntersection } from '@/lib/date.js'

  export default {
    name: 'newLessonAdd',
    components: {
      BaseInfoForm,
      PublicForm,
      OrderForm,
      NoOrderForm,
      ErrorDialog,
      BadLessonDialog
    },
    computed: {
      ...mapGetters([
        'userId',
        'name'
      ])
    },
    data() {
      return {
        allLoading: true,
        isCanSubmit: true,
        isCanCalculation: true,
        isSaveSubmit: true,
        isBadLessonDialogShow: false,
        /* query */
        strategyId: this.$route.path !== '/newLesson/add' ? this.$route.params.strategyId : '', // 编辑传id
        studentIntentionId: this.$route.query.studentIntentionId,
        studentName: this.$route.query.studentName,
        studentNo: this.$route.query.studentNo,
        /* query */
        baseInfoQuery: {
          contractType: this.$route.path !== '/newLesson/add' ? '' : '1',
          contractUsable: ''
        },
        isContractTypeChange: false,
        publicQuery: {
          bothIsConfirmed: '',
          isAppointTeacher: '',
          teacherId: '', // 根据isAppointTeacher改变字段名称 recommendTeacherId
          teacherSex: '', // 根据isAppointTeacher 是否删除
          instructionType: [], // 根据isAppointTeacher 是否删除
          subjectId: '',
          currPlanId: '',
          currPlanPropertyId: '',
          isSort: ''
        },
        orderQuery: {
          frequency: '',
          frequencyNum: '',
          singleClassLength: '',
          lessonTime: [], // 删除
          platoonTimeArrObj: [{ id: '', startTime: '', endTime: '' }], // 删除
          platoonTime: ''
        },
        noOrderQuery: {
          platoonTimeStrTextarea: '', // 删除
          platoonTime: '',
          remark: '',
          firstLessonTime: '',
          lessonStartTime: '', // 删除
          lessonEndTime: '', // 删除
          actualPeriod: ''
        },
        actualLessonQuery: {
          actualPeriod: '',
          firstLessonTime: '', // 删除
          remark: ''
        },
        copyOrderQuery: {},
        copyNoOrderQuery: {},
        copyActualLessonQuery: {},
        actualLessonRules: {
          actualPeriod: { required: true, message: '请计算' }
        },
        errorDialogVisible: false,
        errorDialogBodyMessage: '',
        badLessonDialogData: [],
        newStrategyId: '',
        newIsSort: ''
      }
    },
    created() {
      this.copyOrderQuery = JSON.parse(JSON.stringify(this.orderQuery))
      this.copyNoOrderQuery = JSON.parse(JSON.stringify(this.noOrderQuery))
      this.copyActualLessonQuery = JSON.parse(JSON.stringify(this.actualLessonQuery))
      if (this.strategyId) {
        return this.init()
      }
      this.allLoading = false
    },
    methods: {
      // api
      postCountCourseHour(platoonTime, singleClassLength) {
        return this.$http.post('courseApplication_countCourseHour', {
          studentIntentionId: this.studentIntentionId,
          contractType: this.baseInfoQuery.contractType,
          platoonTime,
          bothIsConfirmed: this.publicQuery.bothIsConfirmed,
          isSort: this.publicQuery.isSort,
          singleClassLength, // 有序传，无序不传
          frequency: this.orderQuery.frequency,
          frequencyNum: this.orderQuery.frequencyNum,
          lessonStartTime: this.orderQuery.lessonTime[0],
          lessonEndTime: this.orderQuery.lessonTime[1]
        })
      },
      postTimeList(platoonTime) {
        return this.$http.post('courseApplication_getTimeList', {
          bothIsConfirmed: this.publicQuery.bothIsConfirmed,
          frequency: this.orderQuery.frequency,
          frequencyNum: this.orderQuery.frequencyNum,
          singleClassLength: this.orderQuery.singleClassLength,
          lessonStartTime: this.orderQuery.lessonTime[0],
          lessonEndTime: this.orderQuery.lessonTime[1],
          platoonTime // 需要处理 字符串
        })
      },
      postEditStrategy(body) {
        return this.$http.post('courseApplication_editStrategy', Object.assign(body, {
          userId: this.userId,
          userName: this.name,
          strategyId: this.strategyId,
          studentIntentionId: this.studentIntentionId,
          contractType: this.baseInfoQuery.contractType,
          type: '1'
        }))
      },
      getStrategiesDetails() {
        return this.$http.get('courseApplication_strategiesDetails', {
          params: {
            strategyId: this.strategyId
          }
        })
      },
      getCheckLessonTime() {
        return this.$http.get('courseApplication_checkLessonTime', {
          params: {
            strategyId: this.newStrategyId
          }
        })
      },
      postSubmitAPi() {
        return this.$http.post('courseApplication_submit', {
          strategyId: this.newStrategyId,
          userId: this.userId,
          userName: this.name,
          type: '1'
        })
      },
      // init
      init() {
        this.getStrategiesDetails().then(res => {
          if (res.data) {
            // public
            const {
              both_is_confirmed: bothIsConfirmed,
              is_appoint_teacher: isAppointTeacher,
              teacher_id: teacher_id,
              subject_id: subjectId,
              curr_plan_id: currPlanId,
              curr_plan_property_id: currPlanPropertyId,
              is_sort: isSort,
              recommend_teacher_id,
              instruction_type,
              teacher_sex
            } = res.data

            this.publicQuery = {
              ...this.publicQuery,
              bothIsConfirmed,
              isAppointTeacher,
              subjectId,
              currPlanId,
              currPlanPropertyId,
              isSort
            }

            if (isAppointTeacher === '2') {
              this.publicQuery.teacherId = teacher_id
            } else if (isAppointTeacher === '1') {
              this.publicQuery.teacherId = recommend_teacher_id === '0' ? '' : recommend_teacher_id
            }

            this.publicQuery.instructionType = instruction_type ? instruction_type.split(',') : []
            this.publicQuery.teacherSex = teacher_sex || ''

            // baseInfo
            const {
              contract_type: contractType
            } = res.data

            this.baseInfoQuery.contractType = contractType

            // 有序
            if (isSort === '2') {
              this.orderInit(res)
            } else if (isSort === '1') {
              this.noOrderInit(res)
            }
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('数据错误')
        }).finally(() => {
          this.allLoading = false
        })
      },
      orderInit(res) {
        const {
          frequency,
          frequency_num: frequencyNum,
          single_class_length: singleClassLength,
          platoon_time: platoonTime,
          remark
        } = res.data

        const lessonTime = [res.data.lesson_start_time, res.data.lesson_end_time]
        const platoonTimeObj = JSON.parse(res.data.platoon_time)
        const platoonTimeArrObj = []
        for (const key of Object.keys(platoonTimeObj)) {
          for (const obj of platoonTimeObj[key]) {
            const onePlatoonTime = {}
            onePlatoonTime.id = key
            onePlatoonTime.startTime = obj.start_time
            onePlatoonTime.endTime = obj.end_time
            platoonTimeArrObj.push(onePlatoonTime)
          }
        }

        this.orderQuery = {
          ...this.orderQuery,
          frequency,
          frequencyNum,
          singleClassLength,
          platoonTime,
          lessonTime,
          platoonTimeArrObj
        }

        this.actualLessonQuery = {
          ...this.actualLessonQuery,
          remark
        }
      },
      noOrderInit(res) {
        const {
          remark,
          first_lesson_time: firstLessonTime,
          platoon_time: platoonTime
        } = res.data
        const platoonTimeArr = JSON.parse(platoonTime)
        const platoonTimeStrTextareaArr = []
        for (const item of platoonTimeArr) {
          const startTime = item.start_time.replace(/-/g, '/').replace(/\s+/g, '-').slice(0, 16)
          const endTime = item.end_time.substr(11, 5)
          platoonTimeStrTextareaArr.push(`${startTime}-${endTime}`)
        }
        const platoonTimeStrTextarea = platoonTimeStrTextareaArr.join('\r\n')
        this.noOrderQuery = {
          ...this.noOrderQuery,
          platoonTimeStrTextarea,
          platoonTime,
          remark,
          firstLessonTime
        }
      },
      dialogSubmitEvent(isSaveSubmit) {
        this.isSaveSubmit = isSaveSubmit
        let i = 0
        this.$refs['baseInfoForm'].$refs['form'].validate(valid => valid && i++)
        this.$refs['publicForm'] && this.$refs['publicForm'].$refs['form'].validate(valid => valid && i++)
        this.$refs['changeClassForm'] && this.$refs['changeClassForm'].$refs['form'].validate(valid => valid && i++)
        this.$refs['orderForm'] && this.$refs['orderForm'].$refs['form'].validate(valid => valid && i++)
        this.$refs['actualLessonForm'] && this.$refs['actualLessonForm'].validate(valid => valid && i++)
        this.$refs['noOrderForm'] && this.$refs['noOrderForm'].$refs['form'].validate(valid => valid && i++)

        /* 逻辑判断 */
        let orderForm_i = 4
        let noOrderForm_i = 3
        // 是否是调课新增
        if (this.isChangeClassAdd) {
          orderForm_i++
          noOrderForm_i++
        }

        // 有序
        if (this.publicQuery.isSort === '2' && orderForm_i === i) {
          if (this.actualLessonQuery.actualPeriod <= 0) {
            return this.$message.warning('你的当前排课策略中无有效排课，请仔细检查你的排课信息！')
          }
          return this.orderFormSubmit()
        }
        // 无序
        if (this.publicQuery.isSort === '1' && noOrderForm_i === i) {
          if (this.noOrderQuery.actualPeriod <= 0) {
            return this.$message.warning('你的当前排课策略中无有效排课，请仔细检查你的排课信息！')
          }
          return this.noOrderFormSubmit()
        }
      },
      // 有序
      orderFormSubmit() {
        const postBody = Object.assign({}, this.publicQuery, this.orderQuery, this.actualLessonQuery)
        postBody.lessonStartTime = this.orderQuery.lessonTime[0]
        postBody.lessonEndTime = this.orderQuery.lessonTime[1]
        delete postBody.lessonTime
        delete postBody.platoonTimeArrObj
        this.deletePublicQuery(postBody)

        this.postSubmit(postBody)
      },
      // 有序 计算时间
      actualLessonTimeEvent() {
        this.$refs['orderForm'].$refs['form'].validate(async valid => {
          if (valid) {
            // 双方已确认 接口频次的课数 必须等于可排时间的长度
            if (this.publicQuery.bothIsConfirmed === '2' && this.orderQuery.frequencyNum !== this.orderQuery.platoonTimeArrObj.length) {
              this.errorDialogBodyMessage = '对不起，可排时间次数不等于上课频次，请重新排课'
              this.errorDialogVisible = true
              return
            }
            if (this.publicQuery.bothIsConfirmed === '1' && this.orderQuery.frequencyNum > this.orderQuery.platoonTimeArrObj.length) {
              this.errorDialogBodyMessage = '对不起，可排时间次数小于上课频次，请重新排课'
              this.errorDialogVisible = true
              return
            }

            // 时间转化
            const platoonTime = {}
            if (this.orderQuery.frequency === '6') {
              platoonTime[0] = []
              for (const item of this.orderQuery.platoonTimeArrObj) {
                const obj = {}
                obj.start_time = item.startTime
                obj.end_time = item.endTime
                platoonTime[0].push(obj)
              }
            }

            if (this.orderQuery.frequency !== '6') {
              for (const item of this.orderQuery.platoonTimeArrObj) {
                const obj = {}
                if (!platoonTime[item.id]) {
                  platoonTime[item.id] = []
                }
                obj.start_time = item.startTime
                obj.end_time = item.endTime
                platoonTime[item.id].push(obj)
              }
            }

            try {
              this.isCanCalculation = false

              // 判断是否有时间交叉
              const timeListData = await this.postTimeList(JSON.stringify(platoonTime))
              if (!timeListData.data) {
                return
              }
              if (arrHaveIntersection(timeListData.data)) {
                return this.$message.warning('可排时间有交集')
              }

              const actualPeriodData = await this.postCountCourseHour(JSON.stringify(platoonTime), this.orderQuery.singleClassLength)
              if (actualPeriodData.data) {
                // 获取 实际课时后 赋值可排时间字符串
                this.orderQuery.platoonTime = JSON.stringify(platoonTime)

                setTimeout(() => {
                  this.actualLessonQuery.actualPeriod = actualPeriodData.data.actualPeriod
                  this.actualLessonQuery.firstLessonTime = actualPeriodData.data.firstLessonTime
                  this.$refs['actualLessonFormActualPeriod'].clearValidate()
                }, 0)
              }
            } catch (e) {
              console.log(e)
              this.$message.error('数据错误')
            } finally {
              this.isCanCalculation = true
            }
          }
        })
      },
      // 无序
      noOrderFormSubmit() {
        const postBody = Object.assign({}, this.publicQuery, this.noOrderQuery)
        this.deletePublicQuery(postBody)
        delete postBody.platoonTimeStrTextarea
        this.postSubmit(postBody)
      },
      // 保存/提交
      async postSubmit(postBody) {
        this.isCanSubmit = false
        try {
          const { data: saveData } = await this.postEditStrategy(postBody)
          if (!saveData) {
            return
          }
          if (saveData.length === 0) {
            this.newStrategyId = this.strategyId
          } else {
            this.newStrategyId = saveData.strategyId
          }
          this.newIsSort = postBody.isSort
          // 保存
          if (this.isSaveSubmit) {
            return this.goDetailView()
          }

          // 是否有冲突 && 提交
          const { data: badList } = await this.getCheckLessonTime()
          if (!badList) {
            return
          }
          if (badList.length) {
            this.badLessonDialogData = badList
            this.isBadLessonDialogShow = true
          } else if (badList.length === 0) {
            await this.submitAndGoView()
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.isCanSubmit = true
        }
      },
      // 页面跳转
      goDetailView() {
        this.newIsSort === '2' ? this.$router.replace({
          path: '/lessonplanDetails/policyDetails',
          query: { strategyId: this.newStrategyId, type: '1' }
        }) : this.$router.replace({
          path: '/lessonplanDetails/unorderDetails',
          query: { strategyId: this.newStrategyId, type: '1' }
        })
        if (this.strategyId) {
          return this.$store.dispatch('delVisitedViews', { name: 'newLessonEdit', path: '/newLesson/edit' })
        } else {
          return this.$store.dispatch('delVisitedViews', { name: 'newLessonAdd', path: '/newLesson/add' })
        }
      },
      // 提交
      async submitAndGoView(obj = {}) {
        const { data: submitData } = await this.postSubmitAPi()
        if (!submitData) {
          obj.isCanSearch = true
          this.goEditView()
          return
        }
        this.goDetailView()
      },
      // 删除多余数据
      deletePublicQuery(postBody) {
        if (postBody.isAppointTeacher === '1') {
          postBody.recommendTeacherId = postBody.teacherId
          postBody.instructionType = postBody.instructionType.join()
          delete postBody.teacherId
        } else if (postBody.isAppointTeacher === '2') {
          delete postBody.teacherSex
          delete postBody.instructionType
        }
      },
      allRest() {
        this.orderQuery = JSON.parse(JSON.stringify(this.copyOrderQuery))
        this.noOrderQuery = JSON.parse(JSON.stringify(this.copyNoOrderQuery))
        this.actualLessonQuery = JSON.parse(JSON.stringify(this.copyActualLessonQuery))
        this.$nextTick(() => {
          this.$refs['orderForm'] && this.$refs['orderForm'].$refs['form'].clearValidate()
          this.$refs['noOrderForm'] && this.$refs['noOrderForm'].$refs['form'].clearValidate()
          this.$refs['actualLessonForm'] && this.$refs['actualLessonForm'].clearValidate()
        })
      },
      goEditView() {
        this.$router.replace({
          path: `/newLesson/edit/${this.newStrategyId}`, query: {
            studentIntentionId: this.studentIntentionId,
            studentName: this.studentName,
            studentNo: this.studentNo,
            type: '1'
          }
        })
        return this.$store.dispatch('delVisitedViews', { name: 'newLessonAdd', path: '/newLesson/add' })
      }
    },
    watch: {
      'orderQuery': {
        handler() {
          this.actualLessonQuery.actualPeriod = ''
          this.actualLessonQuery.firstLessonTime = ''
        },
        deep: true
      },
      'publicQuery.bothIsConfirmed'() {
        if (this.strategyId) {
          if (!this.first) {
            this.first = true
            return
          }
          this.allRest()
        } else {
          this.allRest()
        }
      },
      'noOrderQuery.platoonTimeStrTextarea'() {
        this.noOrderQuery.actualPeriod = ''
        this.noOrderQuery.firstLessonTime = ''
      },
      'baseInfoQuery.contractType'(val) {
        if (this.strategyId && !this.firstContractType) {
          this.firstContractType = true
          return
        }
        this.actualLessonQuery.actualPeriod = ''
        this.actualLessonQuery.firstLessonTime = ''
        this.noOrderQuery.actualPeriod = ''
        this.noOrderQuery.firstLessonTime = ''
        if (val) {
          this.isContractTypeChange = true
        }
      }
    }
  }
</script>
