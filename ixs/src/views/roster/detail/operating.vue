<template>
  <!-- 命令行生成的模板 -->
  <div class="main" :class="{'back-color-blue':roleCode === '1'}">
    <div>
      <ul class="left-list">
        <li
          v-for="(item,index) in listData"
          :key="index"
          @click="item.clickEvent"
          :class="{'border-right-1px':item.text === '移交别人'}"
          v-bind="{'callIdAttr':item.text === '添加沟通记录' ? 'call-phone-dialog':''}"
        >
          <template v-if="item.iconFont">
            <i :class="item.iconFont" class="icon-gray"></i>
          </template>
          <template v-else>
            <svg-icon :icon-class="item.svg" class="icon-gray"></svg-icon>
          </template>
          <br/>
          <span v-if="index===0" class="height-color">{{item.text}}</span>
          <span v-else>{{item.text}}</span>
        </li>
      </ul>
    </div>

    <div class="retrieve-list" @click="dialogRetrieveList.show = true" v-if="isHaveRetrieveList">寻回<br>名单</div>
    <centerDialog
      v-if="dialogRetrieveList.show"
      :body-message="dialogRetrieveList.messageBody"
      :is-show.sync="dialogRetrieveList.show"
      @yes-event="handleRetrieveList">

    </centerDialog>

    <el-dialog
      :visible.sync="dialog.resetPassword.show"
      :append-to-body="true"
      custom-class="el-dialog-md"
      class="dialog-reset-password">
      <h2 class="title"><i class="el-icon-warning"></i>注意</h2>
      <div class="content" v-loading="loading">
        <b class="color-blue">学生{{studentInfo.name}}</b>
        <span>的账号</span>
        <b class="color-blue">{{studentInfo.phone}}</b>
        <span>密码将被重置，请先跟学生沟通，再执行操作。</span>
      </div>
      <div slot="footer">
        <el-button
          @click="dialog.resetPassword.yesEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">重置密码
        </el-button>
        <el-button
          @click="dialog.resetPassword.noEvent">取消，先沟通
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.successResetPassword.show"
      :append-to-body="true"
      custom-class="el-dialog-md"
      class="dialog-success-rest-password">
      <h2 class="title"><i class="color-blue el-icon-circle-check"></i>重置成功</h2>
      <div class="content">
        <span>系统已将临时密码发送到手机</span>
        <b class="color-blue">{{studentInfo.phone}}</b>
        <span>，请提醒学生在24小时内登录并重新设置密码。</span>
      </div>
      <div slot="footer">
        <el-button
          @click="dialog.successResetPassword.knowEvent"
          type="primary"
          class="dialog-submit">知道了
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.experienceClass.show"
      @close="dialog.experienceClass.closeEvent"
      :append-to-body="true"
      @open="dialog.experienceClass.openEvent"
      custom-class="el-dialog-md"
      class="dialog-experience-class">
      <p slot="title" class="dialog-title">
        <b>为学生<span class="color-blue">{{studentInfo.name}}</span>排体验课</b>
      </p>
      <el-form
        :model="dialog.experienceClass.query"
        :ref="dialog.experienceClass.refName"
        :rules="dialog.experienceClass.rules"
        v-loading="loading"
        label-width="120px">
        <el-form-item prop="currPlanPropertyId" label="体验课程：">
          <el-select v-model="dialog.experienceClass.query.currPlanPropertyId" class="width-70" disabled>
            <el-option v-for="(item, index) in dialog.experienceClass.options.planNames"
                       :key="index"
                       :label="item.name"
                       :value="item.currPlanPropertyId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="teacherId" label="上课老师：">
          <el-select v-model="dialog.experienceClass.query.teacherId" clearable filterable class="width-70" remote :remote-method="experienceClassGetTeacherList" :loading="loading">
            <el-option
              v-for="(item, index) in dialog.experienceClass.options.teachers"
              :key="index"
              :label="item.name"
              :value="item.user_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="planStartTime" label="开课时间：">
          <el-date-picker
            v-model="dialog.experienceClass.query.planStartTime"
            type="datetime"
            popper-class="rightAway"
            :editable="false"
            class="width-70"
            :picker-options="dialog.experienceClass.pickerOptions"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            placeholder="设置时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          @click="dialog.experienceClass.submitEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">提交
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.transferStudent.show"
      @close="dialog.transferStudent.closeEvent"
      :append-to-body="true"
      custom-class="el-dialog-md"
      class="dialog-transfer-student-class">
      <p slot="title" class="dialog-title">
        <b>移交学生<span class="color-blue">{{studentInfo.name}}</span></b>
      </p>
      <el-form
        :model="dialog.transferStudent.query"
        :ref="dialog.transferStudent.refName"
        :rules="dialog.transferStudent.rules"
        v-loading="loading"
        label-width="120px" inline>
        <el-form-item>
          <span class="starlitter">*</span> 跟进人：
        </el-form-item>
        <el-form-item prop="group">
          <el-select v-model="dialog.transferStudent.query.group" clearable collapse-tags placeholder="组">
            <el-option
              v-for="item in dialog.transferStudent.options.deptTree"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="member">
          <el-select v-model="dialog.transferStudent.query.member" clearable collapse-tags placeholder="人">
            <el-option
              v-for="item in dialog.transferStudent.options.allUser"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          @click="dialog.transferStudent.submitEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">提交
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.addClients.show"
      :append-to-body="true"
      custom-class="el-dialog-md"
      class="dialog-add-clients">
      <h2 class="title"><i class="el-icon-warning"></i>注意</h2>
      <div class="content" v-loading="loading">
        <b class="color-blue">学生{{studentInfo.name}}</b>
        <span>的号码</span>
        <b class="color-blue">{{studentInfo.phone}}</b>
        <span>将开通海风智学中心账号。</span>
        <div style="color: #FF0000">密码默认为hfjy+手机号后四位</div>
      </div>
      <div slot="footer">
        <el-button
          @click="dialog.addClients.submitEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">确定
        </el-button>
        <el-button
          @click="dialog.addClients.show=false">取消，先沟通
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="attentionQrCodeShow"
      :append-to-body="true"
      custom-class="el-dialog-sl"
      @close="attentionQrCodeShow = false">
      <div style="text-align:center">
        <img src="../../../assets/detail_images/qrcode.png"><br>
        <span>扫一扫上面的二维码，关注“海风教育”微信公众</span><br>
        <span>号，及时获取活动通知、课程提醒</span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import centerDialog from '@/components/dialog/centerDialog.vue'
  export default {
    components: {
      centerDialog
    },
    name: 'detail-operating',
    props: {
      roleCode: String,
      operatingListData: Array,
      indexInit: {
        type: Function,
        required: true
      },
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
    watch: {
      'operatingListData'(arr) {
        this.listData = arr.map(val => {
          return this.leftList[val - 1]
        })
      },
      'dialog.transferStudent.query.group'(val) {
        if (val.length !== 0) {
          this.dialog.transferStudent.query.member = ''
          this.getMember()
        }
      }
    },
    data() {
      return {
        leftList: [
          {
            iconFont: 'el-icon-phone', text: '添加沟通记录', clickEvent: this.communicationRecordBtnEvent
          },
          {
            iconFont: 'el-icon-edit-outline', text: '补全资料', clickEvent: this.materialBtnEvent
          },
          {
            svg: 'addClients', text: '开通客户端', clickEvent: this.openClientBtnEvent
          },
          {
            svg: 'password', text: '密码重置', clickEvent: this.resetPasswordBtnEvent
          },
          {
            svg: 'computer', text: '上体验课', clickEvent: this.experienceClassBtnEvent
          },
          {
            svg: 'book', text: '申请试听课', clickEvent: this.trialLessonBtnEvent
          },
          {
            svg: 'user', text: '报名', clickEvent: this.signUpBtnEvent
          },
          {
            svg: 'dollar', text: '成单登记', clickEvent: this.singleRegistrationBtnEvent
          },
          {
            svg: 'hat', text: '移交别人', clickEvent: this.transferStudentBtnEvent
          },
          {
            svg: 'qrCode', text: '关注“海风教育”', clickEvent: this.attentionQrCode
          },
          {
            iconFont: 'el-icon-search', text: '知识库搜索', clickEvent: this.knowledgeSearch
          },
        ],
        listData: [],
        isHaveRetrieveList: false,
        dialogRetrieveList: {
          messageBody: `确定将${this.studentInfo.name}（${this.studentInfo.student_no}）寻回吗？`,
          show: false
        },
        canSearch: true,
        dialog: {
          resetPassword: {
            title: '重置密码',
            show: false,
            yesEvent: this.resetPasswordYesEvent,
            noEvent: this.resetPasswordNoEvent
          },
          successResetPassword: {
            title: '重置成功',
            show: false,
            knowEvent: this.successResetPasswordKnowEvent
          },
          experienceClass: {
            title: '排体验课',
            refName: 'experienceClass',
            nowTime: new Date().getTime(),
            show: false,
            query: {
              teacherId: '',
              teacherName: '',
              studentId: '',
              studentName: '',
              currPlanPropertyId: '',
              planName: '',
              planStartTime: '',
              userId: ''
            },
            options: {
              teachers: [],
              planNames: []
            },
            pickerOptions: {
              disabledDate: this.experienceClassDisabledDate
            },
            closeEvent: this.experienceClassCloseEvent,
            openEvent: this.experienceClassOpenEvent,
            submitEvent: this.experienceClassSubmitEvent,
            rules: {
              currPlanPropertyId: {
                required: true, message: '请选择', trigger: 'change'
              },
              teacherId: {
                required: true, message: '请选择', trigger: 'change'
              },
              planStartTime: {
                required: true, trigger: 'change', validator: this.experienceClassTimePickerValidate
              }
            }
          },
          transferStudent: {
            title: '移交学生',
            show: false,
            refName: 'transferStudent',
            query: {
              group: '',
              member: '',
              studentIntentionId: ''
            },
            options: {
              deptTree: [],
              allUser: []
            },
            rules: {
              group: {
                required: true, message: '请选择部门', trigger: 'blur'
              },
              member: {
                required: true, message: '请选择人员', trigger: 'blur'
              }
            },
            closeEvent: this.transferStudentCloseEvent,
            submitEvent: this.transferStudentSubmitEvent
          },
          addClients: {
            title: '开通客户通',
            show: false,
            submitEvent: this.addClientsSubmitEvent
          }
        },
        attentionQrCodeShow: false,
        loading: false
      }
    },
    mounted() {
    },
    computed: {
      ...mapGetters(['userId', 'name'])
    },
    created() {
      this.init()
      this.initIsHaveRetrieveList()
      this.$route.query.isExperience && this.experienceClassBtnEvent()
    },
    methods: {
      ...mapActions(['editVisitedView']),
      /* 接口 */
      // get
      getAllowAttendClass(id) {
        return this.$http.get('student_allowAttendClass', {
          params: {
            'currPlanPropertyId': '353',
            'keyword': id
          },
          isFilterUrl: true
        })
      },
      getAttendClassList() {
        return this.$http.get('student_attendClassList', { isFilterUrl: true })
      },
      getArrangeExperienceCourse(params) {
        return this.$http.get('student_arrangeExperienceCourse', {
          params: Object.assign(params, {
            userId: this.userId,
            studentId: this.studentId,
            studentName: this.studentInfo.name
          })
        })
      },
      getResetPwd() {
        return this.$http.get('student_resetPwd', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      getStudentOpenClient() {
        return this.$http.get('student_openClient', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      getTeacherTurnOverList() {
        return this.$http.get('search_getMembers')
      },
      getRecycleIsCanReturn(type = 1) {
        return this.$http.get('recycle_isCanReturn', {
          params: {
            studentIntentionId: this.rosterId,
            type
          },
          isNoMessage: type === 1
        })
      },
      // post
      postLessonCallHeadmaster(body) {
        return this.$http.post('follow_allotStudentApi', Object.assign(body, {
          studentIntentionId: this.rosterId
        }))
      },
      init() {
        const arr = this.operatingListData.map(val => {
          return this.leftList[val - 1]
        })
        this.listData = arr
      },
      /* 按钮 */
      communicationRecordBtnEvent() {
        this.$emit('show-communication-record-dialog')
      },
      materialBtnEvent() {
        const judge = '1'
        this.$router.push(`/roster/material/${this.rosterId}/${judge}`)
      },
      knowledgeSearch() {
        this.$router.push(`/roster/knowledge`)
      },
      resetPasswordBtnEvent() {
        this.dialog.resetPassword.show = true
      },
      // 开通客户端
      openClientBtnEvent() {
        this.dialog.addClients.show = true
      },
      addClientsSubmitEvent() {
        if (this.canSearch) {
          this.canSearch = false
          this.loading = true
          this.getStudentOpenClient().then(res => {
            if (res.data) {
              this.$message.success('开通成功')
              this.dialog.addClients.show = false
              this.indexInit()
            }
          }).catch(error => {
            console.log(error)
          }).finally(() => {
            this.canSearch = true
            this.loading = false
          })
        } else {
          this.$message.warning('操作频繁')
        }
      },
      // 体验课
      experienceClassBtnEvent() {
        this.loading = true
        this.canSearch = false
        this.dialog.experienceClass.show = true
        this.getAttendClassList().then(async res => {
          if (res.data) {
            await this.experienceClassGetTeacherList()
            this.dialog.experienceClass.options.planNames = res.data
            this.dialog.experienceClass.query.currPlanPropertyId = res.data[0].currPlanPropertyId
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      // 申请试听课
      trialLessonBtnEvent() {
        if (this.rosterId) {
          if (!this.studentInfo.sex) {
            this.$message.warning('请完善学生性别')
            return
          }
          if (!this.studentInfo.country_id || !this.studentInfo.city_id || !this.studentInfo.province_id) {
            this.$message.warning('学生的所在区域必须精确到区/县，请完善')
            return
          }
          window.open(`${window.location.origin}#/roster/lessonplanorderCreate/${this.rosterId}`)
        } else {
          this.$message.error('没有rosterId')
        }
      },
      // 成单登记
      singleRegistrationBtnEvent() {
        this.$http.get('lesson_isCanLookOrder', {
          params: {
            studentIntentionId: this.rosterId
          }
        }).then(res => {
          if (res.code !== '0x000000') {
            this.$message.error('高考年份错误')
            return false
          } else {
            if (this.rosterId) {
              if (this.studentInfo.exam_year && this.studentInfo.exam_year >= new Date().getFullYear()) {
                window.open(`${window.location.origin}#/roster/contractCreate/${this.rosterId}`)
              } else {
                this.$alert('学生年级不正常，请先在“补全资料”中修改。', '学生无法成单', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
              }
            } else {
              this.$message.error('没有rosterId')
            }
          }
        }).catch(console.log)
      },
      // 报名
      signUpBtnEvent() {
        if (this.studentId) {
          this.$router.push(`/roster/signup/${this.studentId}`)
        } else {
          this.$message.error('没有studentId')
        }
      },
      // 关注海风教育
      attentionQrCode() {
        this.attentionQrCodeShow = true
      },
      // 移交别人
      transferStudentBtnEvent() {
        this.dialog.transferStudent.show = true
        this.loading = true
        this.canSearch = false
        this.getTeacherTurnOverList().then(res => {
          if (res.data) {
            this.dialog.transferStudent.options = res.data
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      getMember() {
        this.$http.post('search_getGroupMember', { group: this.dialog.transferStudent.query.group }).then(res => {
          if (res.data) {
            this.dialog.transferStudent.options.allUser = res.data.users
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 修改密码事件
      resetPasswordYesEvent() {
        if (this.canSearch) {
          this.canSearch = false
          this.loading = true
          this.getResetPwd().then(res => {
            if (res.data) {
              this.dialog.resetPassword.show = false
              this.dialog.successResetPassword.show = true
            } else {
              this.message.error(res.message)
            }
          }).catch(error => {
            console.log(error)
          }).finally(() => {
            this.canSearch = true
            this.loading = false
          })
        }
      },
      resetPasswordNoEvent() {
        this.dialog.resetPassword.show = false
      },
      successResetPasswordKnowEvent() {
        this.dialog.successResetPassword.show = false
      },
      // 排体验课事件
      experienceClassOpenEvent() {
        this.dialog.experienceClass.nowTime = new Date().getTime()
      },
      handleResetRoute() {
        const { isExperience } = this.$route.query
        isExperience && this.$router.replace(`${this.$route.path}`)
        isExperience && this.editVisitedView(this.$route.path)
      },
      experienceClassCloseEvent() {
        this.$refs[this.dialog.experienceClass.refName].resetFields()
        this.handleResetRoute()
      },
      experienceClassSubmitEvent() {
        this.$refs[this.dialog.experienceClass.refName].validate(valid => {
          if (valid) {
            this.canSearch = false
            const copyObj = Object.assign({}, this.dialog.experienceClass.query)
            for (const value of this.dialog.experienceClass.options.teachers) {
              if (value.user_id === copyObj.teacherId) {
                copyObj.teacherName = value.name
                break
              }
            }
            for (const value of this.dialog.experienceClass.options.planNames) {
              if (value.currPlanPropertyId === copyObj.currPlanPropertyId) {
                copyObj.planName = value.name
                break
              }
            }
            this.getArrangeExperienceCourse(copyObj).then(res => {
              if (res.data) {
                this.dialog.experienceClass.show = false
                this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: `<p class='message-title-color'>排课成功</p><p class='message-body-color'>${this.dialog.experienceClass.query.planStartTime}，请为学生${this.studentInfo.name}上体验课</p>`
                })
                this.$eventBus.$emit('change-class-plan')
              } else {
                this.$message.error({
                  dangerouslyUseHTMLString: true,
                  message: `<p class='message-title-color'>排课失败</p><p class='message-body-color'>${res.message}</p>`
                })
              }
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              this.canSearch = true
              this.handleResetRoute()
            })
          }
        })
      },
      experienceClassDisabledDate(val) {
        const nowTime = this.dialog.experienceClass.nowTime
        const valTime = new Date(val).getTime()
        if (valTime > (nowTime - 86400000) && valTime < (nowTime + 7 * 86400000)) {
          return false
        }
        return true
      },
      experienceClassTimePickerValidate(rule, value, callback) {
        if (!value) {
          callback(new Error('请选择时间'))
          return
        }
        const nowTime = new Date().getTime()
        if (nowTime > new Date(value).getTime()) {
          callback(new Error('不能小于当前时间'))
          return
        }
        callback()
      },
      experienceClassGetTeacherList(id) {
        return this.getAllowAttendClass(id).then(res => {
          if (res.data) {
            this.loading = true
            // 判断登入人在不在接口返回的老师列表里 , 没有则添加进去
            const haveUserId = res.data.some(val => {
              return val.user_id === this.userId
            })
            if (haveUserId) {
              res.data.unshift({ user_id: this.userId, name: this.name })
              this.dialog.experienceClass.query.teacherId = this.userId
            }
            this.dialog.experienceClass.options.teachers = res.data
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
        })
      },
      // 寻回名单
      async handleRetrieveList() {
        const { data, message } = await this.getRecycleIsCanReturn(2)
        if (!data) return
        this.$message.success(message)
        this.indexInit(true)
      },
      async initIsHaveRetrieveList() {
        const { data } = await this.getRecycleIsCanReturn()
        if (!data) return
        this.isHaveRetrieveList = true
      },
      // 移交别人
      transferStudentCloseEvent() {
        this.$refs[this.dialog.transferStudent.refName].resetFields()
      },
      transferStudentSubmitEvent() {
        this.$refs[this.dialog.transferStudent.refName].validate(valid => {
          if (valid) {
            this.canSearch = false
            const copyObj = Object.assign({}, this.dialog.transferStudent.query)
            this.postLessonCallHeadmaster(copyObj).then(res => {
              if (res.data) {
                this.$message.success('操作成功')
                this.dialog.transferStudent.show = false
                this.indexInit(true)
              }
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              this.canSearch = true
            })
          }
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/operating'
</style>
