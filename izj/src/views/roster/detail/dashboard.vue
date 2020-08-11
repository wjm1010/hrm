<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <el-row>
      <el-col :span='8'>
        <div style='position: relative'>
          <h3 class="border-bottom">续费意向</h3>
          <div class='tig' @click="addIntention">
            <i class="el-icon-circle-plus add"></i>
            <span>增加意向</span>
          </div>
          <p v-if="!intention.length" class="no-task">未知（可通过“增加意向”补充该信息）</p>
          <template v-else>
            <p v-if="intention[0].intention !== '4'" class='high-title'>
              <span>{{intention[0].createTime}}</span>
              <span
                class='margin-left'
                :class="{'hight-color': intention[0].intention === '1'}"
              >
                {{intention[0].intentionName}}
              </span>
            </p>
            <p v-if="intention[0].intention === '4'" class="no-task">未知（可通过“增加意向”补充该信息）</p>
            <ul v-if="intention.length > 1" class='clear intention'>
              <li class='intention-li' v-for='(item) in intention.slice(1)' :key='item.create_time'>
                <span>{{item.createTime}}</span>
                <span class='margin-left'>{{item.intentionName}}</span>
              </li>
            </ul>
          </template>
        </div>
      </el-col>
      <el-col :span='16'>
        <h3 class="border-bottom">待回访任务</h3>
        <p v-if="!isShow" class="no-task">暂无任务</p>
        <el-row class="body" v-if="isShow">
          <el-col
            :span="10"
            v-for="(item,index) in list"
            :key="index">
            <div class="grid-content">
              <span class="text">{{index | tastStr}}</span>
              <div class="icon-group">
                <CommitDetailDialog
                  :studentInfo = "studentInfo"
                  :fixDialog="fixDialog"
                  :indexInit="indexInit"
                  :studentIntentionId="studentInfo.student_intention_id"
                  :phone="studentInfo.phone"
                  :showDialog="showDialog">
                </CommitDetailDialog>
                <img :src="xuanxiang" @click="showProcessResult(index,item)" class="img">
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="dialog.dashboard.show"
      @close="dialog.dashboard.closeEvent"
      custom-class="el-dialog-md"
      >
      <p slot="title" class="dialog-title">
        <b>对学生<span class="color-blue">{{studentInfo.name}}</span>的回访处理结果</b>
      </p>
      <el-form
        :model="dialog.dashboard.query"
        :ref="dialog.dashboard.refName"
        :rules="dialog.dashboard.rules"
        v-loading="loading"
        label-width="120px"
        >
        <el-form-item prop="status" label="回访结果：">
          <el-select v-model="dialog.dashboard.query.status">
            <el-option
              v-for="(item, index) in dialog.dashboard.options.status"
              :key="index"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="communicationSituation" label="沟通情况：">
          <el-select v-model="dialog.dashboard.query.communicationSituation">
            <el-option
              v-for="(item,index) in dialog.dashboard.options.situation"
              :key="index"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="communicationTool" label="沟通工具：">
          <el-select v-model="dialog.dashboard.query.communicationTool">
            <el-option
              v-for="(item,index) in dialog.dashboard.options.tool"
              :key="index"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="communicationContent" label="沟通内容：">
          <el-input
            :autosize="{minRows: 5, maxRows: 10}"
            type="textarea"
            v-model.trim="dialog.dashboard.query.communicationContent"
            placeholder="请输入沟通内容，最多500字"
            class="padding-right-20"
            :maxlength="500">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.dashboard.submitEvent" type="primary" class="dialog-submit"
                   :disabled="!canSearch">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.dashboard.intentionShow"
      @close="dialog.dashboard.closeIntention"
      custom-class="el-dialog-md"
      >
      <p slot="title" class="dialog-title">
        <b>学员<span class="color-blue">{{studentInfo.name}}</span>的续费意向</b>
      </p>
      <el-form
        :model="dialog.dashboard.intentionValue"
        :ref="dialog.dashboard.refName"
        :rules="dialog.dashboard.rules"
        v-loading="loading"
        label-width="120px">
        <el-form-item prop="radio" label="续费意向">
          <el-radio-group v-model="dialog.dashboard.intentionValue.radio">
            <el-radio label="1">高意向</el-radio>
            <el-radio label="2">无意向</el-radio>
            <el-radio label="3">意向模糊</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="dateValue" label="失效日期">
          <el-date-picker
            v-model="dialog.dashboard.intentionValue.dateValue"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <p class='label'>到期仍未更新，续费意向将自动更新为“未知”。</p>
      <span slot="footer">
        <el-button
          @click="dialog.dashboard.intentionEvent"
          type="primary"
          class="dialog-submit"
          >
            提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import xuanxiang from '@/assets/detail_images/option.png'
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'

  export default {
    name: 'detail-dashboard',
    data() {
      return {
        list: [],
        intention: [],
        xuanxiang,
        isShow: false,
        isShowIntention: false,
        loading: false,
        canSearch: true,
        dialog: {
          dashboard: {
            title: '处理回访',
            show: false,
            intentionShow: false,
            refName: 'dashboard',
            closeEvent: this.dashboardCloseEvent,
            submitEvent: this.dashboardSubmitEvent,
            closeIntention: this.dashboardClose,
            intentionEvent: this.dashboardIntention,
            query: {
              status: '',
              communicationSituation: '',
              communicationTool: '',
              communicationContent: '',
              revisitMissionId: ''
            },
            intentionValue: {
              radio: '',
              dateValue: '',
            },
            options: {
              status: [],
              situation: [],
              tool: []
            },
            rules: {
              status: [
                {
                  required: true, message: '请选择回访结果', trigger: 'change'
                }
              ],
              communicationSituation: [
                {
                  required: true, message: '请选择沟通情况', trigger: 'change'
                }
              ],
              communicationTool: [
                {
                  required: true, message: '请选择沟通工具', trigger: 'change'
                }
              ],
              communicationContent: [
                {
                  required: true, message: '请填写沟通内容', trigger: 'change'
                }
              ],
              radio: [
                {
                  required: true, message: '请选择续费意向', trigger: 'change'
                }
              ],
              dateValue: [
                {
                  required: true, message: '请选择失效时间', trigger: 'change'
                }
              ],
            },

          }
        }
      }
    },
    props: {
      rosterId: {
        required: true
      },
      studentInfo: {
        required: true
      },
      showDialog: {
        required: true
      },
      indexInit: Function,
      fixDialog: Object
    },
    filters: {
      'tastStr'(val) {
        var str = ''
        switch (val) {
          case '1':
            str = '首呼'
            break
          case '2':
            str = '生涯首课'
            break
          case '5':
            str = '常规任务'
            break
          case '6':
            str = '科目首课'
            break
          case '8':
            str = '生日任务'
            break
        }
        return str
      }
    },
    components: {
      CommitDetailDialog
    },
    created() {
      this.init()
    },
    methods: {
      getDialogOptions() {
        return this.$http.get('teacher_communicationTool')
      },
      getTeacherIsHaveTask() {
        return this.$http.get('teacher_isHaveTask', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      getIntention() {
        const params = {
          studentIntentionId: this.studentInfo.student_intention_id
        }

        const response = this.$http.get('student_getIntention', { params })
        response.then((res) => {
          if (res.code === '0x000000') {
            this.intention = res.data
          }
        })
      },
      postDialogForm(obj) {
        return this.$http.post('teacher_batchAddRecord', obj)
      },
      postIntention(args) {
        return this.$http.post('student_submitIntention', args)
      },
      getIntentionMenu() {
        const response = this.$http.get('student_intentionMenu')
        response.then((res) => {
          if (res.code === '0x000000') {
            const { failTime } = res.data
            this.dialog.dashboard.intentionValue.dateValue = failTime
          } else {
            this.$message.warning('提交失败')
          }
        })
      },
      init() {
        this.getIntention()
        this.getTeacherIsHaveTask().then(res => {
          if (Object.keys(res.data).length) {
            this.list = res.data
            this.isShow = true
          }
        }).catch(console.log)
      },
      showProcessResult(index, item) {
        this.loading = true
        this.canSearch = false
        this.dialog.dashboard.show = true
        this.getDialogOptions().then(res => {
          if (res.data) {
            this.dialog.dashboard.options = res.data
            this.dialog.dashboard.query.revisitMissionId = item[0].id
          }
        }).catch(console.log).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      dashboardCloseEvent() {
        this.$refs[this.dialog.dashboard.refName].resetFields()
      },
      dashboardClose() {
        this.$refs[this.dialog.dashboard.refName].resetFields()
      },
      dashboardSubmitEvent() {
        this.$refs[this.dialog.dashboard.refName].validate(valid => {
          if (valid) {
            this.canSearch = false
            var copyObj = Object.assign({}, this.dialog.dashboard.query)
            this.postDialogForm(copyObj).then(res => {
              if (res.data) {
                this.$message.success(res.message)
                this.$emit('change-refresh-communication-details')
                this.dialog.dashboard.show = false
                this.init()
              }
            }).catch(console.log).finally(() => {
              this.canSearch = true
            })
          } else {
            this.$message.warning('提交失败')
          }
        })
      },
      dashboardIntention() {
        this.$refs[this.dialog.dashboard.refName].validate(valid => {
          if (!valid) return this.$message.warning('提交失败')

          const { radio, dateValue } = this.dialog.dashboard.intentionValue
          const params = {
            studentIntentionId: this.studentInfo.student_intention_id,
            intention: radio,
            failDate: dateValue,
          }

          const response = this.postIntention(params)
          response.then((res) => {
            if (res.code === '0x000000') {
              this.$message.success(res.message)
              this.getIntention()
              this.dialog.dashboard.intentionShow = false
            } else {
              this.$message.warning('提交失败')
            }
          })
        })
      },
      addIntention() {
        this.dialog.dashboard.intentionShow = true
        this.getIntentionMenu()
      },
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/dashboard.sass'
</style>
