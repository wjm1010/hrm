<template>
  <div class="dashboard-container">
    <el-row>
      <el-form ref="query" :model="query" inline>
        <el-form-item prop="todoType" class="backlog">
          <el-radio-group v-model="query.todoType" @change="resetAfterQuery">
            <el-radio v-for="(item,index) in options.todoType" :key="index" :label="item.code">{{item.value}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="parentReferral" class="present-referral">
          <el-checkbox v-model="query.parentReferral">家长转介绍学生</el-checkbox>
        </el-form-item>
        <el-form-item prop="recommendStudent">
          <el-checkbox v-model="query.recommendStudent">我推荐的学生</el-checkbox>
        </el-form-item>
        <el-form-item class="float-right" v-if="showBatchOperation">
          <el-button type="primary" @click="periodicVisit">创建阶段性回访</el-button>
        </el-form-item>
        <el-form-item class="float-right">
          <el-button type="primary" @click="closeReferral" class="referral-code">我的内部推荐码</el-button>
        </el-form-item>
        <br>
        <transition name="fade">
          <el-form-item prop="visitStatus" class="searchTerms">
            <el-select v-model="query.visitStatus" clearable filterable placeholder="任务状态">
              <el-option
                v-for="(item,index) in options.visitStatus"
                :key="index"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </transition>
        <transition name="fade">
          <el-form-item prop="visitType" class="searchTerms">
            <el-select v-model="query.visitType" clearable filterable placeholder="任务类型">
              <el-option
                v-for="(item,index) in options.visitType"
                :key="index"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </transition>
        <transition name="fade">
          <el-form-item prop="keyWord" class="searchName">
            <el-input
              placeholder="学生编号/学生姓名/手机号"
              v-model.trim="query.keyWord"
              clearable>
            </el-input>
          </el-form-item>
        </transition>
        <transition name="fade" v-if="showBatchOperation">
          <el-form-item prop="deptTree" class="searchTerms">
            <el-select v-model="query.deptTree" clearable filterable placeholder="请选择部门">
              <el-option
                v-for="(item,index) in options.deptTree"
                :key="index"
                :label="item.text"
                :value="item.id"
                :class="'level-'+item.level">
              </el-option>
            </el-select>
          </el-form-item>
        </transition>
        <transition name="fade" v-if="showBatchOperation">
          <el-form-item prop="allUser" class="searchTerms">
            <el-select v-model="query.allUser" clearable filterable placeholder="请选择人员">
              <el-option
                v-for="(item,index) in options.allUser"
                :key="index"
                :label="item.text"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </transition>
        <el-form-item class="bTn">
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!canSearch">查询</el-button>
          <el-button @click="resetForm('query')" icon="el-icon-delete" class="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="15" class="border-top-1px">
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <ul class="remind">
          <li>今日任务</li>
          <li v-for="(item,key) in remind" :key="key">
            <span>{{item.message}}</span>
            <b :class="item.taskcolor">{{item.num}}</b>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row v-if="showBatchOperation" class="bulkOperation">
      <el-select v-model="checkProcessingStatus" placeholder="请选择">
        <el-option
          v-for="(item,index) in options.batchProcessType"
          :key="index"
          :label="item.value"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button type="text" @click="showProcessResult('more')">批量操作</el-button>
    </el-row>
    <el-row>
      <expand-table
        table-ref-name="tableRef"
        ref="multipleTable"
        cell-class-row-name="statusColorClass"

        :can-check-all-box="canCheckAllBox"
        checkbox-validate-row-name="cantClickCheckbox"
        @selection-change-event="handleSelectionChange"

        :pagination="paging"
        @get-list="getList"

        :rows="rows"
        :loading="loading"
        :columns="columns"
        :slot-name-arr="slotNameArr">

        <template slot-scope="scope" slot="visitTypeStr">
          <el-popover trigger="hover" placement="top" v-if="scope.row['visitTypeStr'].length>10" width="500">
            <p>{{scope.row['visitTypeStr']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['visitTypeStr'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['visitTypeStr']}}</p>
        </template>

        <template slot-scope="scope" slot="processingText">
          <span :class="{'color-red':scope.row.statusColor === '-1','color-green':scope.row.statusColor === '-3'}">{{scope.row.processingText}}</span>
        </template>

        <template slot-scope="scope" slot="content">
          <el-popover trigger="hover" placement="top" v-if="scope.row['content'].length>30" width="500">
            <p>{{scope.row['content']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['content'].slice(0,30)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['content']}}</p>
        </template>

        <template slot-scope="scope" slot="lookView">
          <el-button type="text" class="actionItems" size="small" @click="changeTableViewSelect(scope.row)">
            沟通详情
          </el-button>
        </template>

        <template slot-scope="scope" slot="operating">
          <template v-if="scope.row.cantClickCheckbox!==true">
            <el-button type="text" class="actionItems" size="small" @click="showProcessResult('one',scope.row)">任务处理</el-button>
          </template>
        </template>

      </expand-table>
    </el-row>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="closeDialogEvent"
      custom-class="el-dialog-md">
      <p slot="title" class="dialog-title">
        <b>
          对
          <span v-if="dialogTitleOne===true">
            学生<span class="color-blue">{{dialogTitle}}</span>
          </span>
          <span v-else class="color-blue">
            {{dialogTitle}}
          </span>
          的回访处理结果
        </b>
      </p>
      <el-form :model="dialogQuery" ref="dialogQuery" :rules="dialogRules" label-width="140px">
        <el-form-item prop="status" label="回访结果：">
          <el-select v-model="dialogQuery.status" :disabled="dialogStatusDisabled">
            <el-option
              v-for="(item, index) in dialogOptions.status"
              v-if="!(item.code==='0'&&!dialogTitleOne)"
              :key="index"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="communicationSituation" label="沟通情况：">
          <el-select v-model="dialogQuery.communicationSituation">
            <el-option
              v-for="(item,index) in dialogOptions.situation"
              :key="index"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="communicationTool" label="沟通工具：">
          <el-select v-model="dialogQuery.communicationTool">
            <el-option
              v-for="(item,index) in dialogOptions.tool"
              :key="index"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="success" label="是否拓科成功：" v-if="dialogRioSecco">
          <el-select v-model="dialogQuery.success">
            <el-option
              v-for="item in dialogOptions.success"
              :key="item.code"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="communicationContent" label="沟通内容：">
          <el-input
            :autosize="{minRows: 5, maxRows: 10}"
            type="textarea"
            v-model.trim="dialogQuery.communicationContent"
            placeholder="请输入沟通内容，最多500字"
            class="padding-right-20"
            :maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogSubmit" type="primary" class="dialog-submit" :disabled="!canSearch">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-for="(item,key) in browserTimeValidate"
      :key="key"
      :visible.sync="item.showDialog"
      custom-class="el-dialog-sl el-dialog-font">
      <p>
        <span class="el-icon-warning"></span>
        <span>{{item.message}}</span>
      </p>
      <span slot="footer">
        <el-button @click="item.showDialog = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

      <el-dialog
        :visible.sync="phaseVisit"
        @close="bouncedClear"
        custom-class="el-dialog-lg el-dialog-scroll">
        <p slot="title" class="dialog-title">
          <b>
            创建阶段回访任务
          </b>
        </p>
        <el-form :model="phaseVisitQuery" ref="phaseVisitQuery" :rules="phaseVisitRules" label-width="120px">
          <div class="portion firstportion">
            <div>
              <i class="el-icon-circle-check"></i>
              <b>任务设置</b>
            </div>
            <div class="taskSet">
              <el-form-item prop="title" label="回访主题：">
                <el-input placeholder="" v-model.trim="phaseVisitQuery.title" clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="任务周期：" prop="stageStart">
                <el-col :span="4">
                  <el-form-item prop="stageStart">
                    <el-date-picker
                      v-model="phaseVisitQuery.stageStart"
                      type="datetime"
                      :editable="false"
                      class="width-70"
                      :picker-options="{disabledDate: pickerOptions}"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      popper-class="rightAway"
                      placeholder="选择开始时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="stageEnd">
                    <el-date-picker
                      v-model="phaseVisitQuery.stageEnd"
                      type="datetime"
                      :editable="false"
                      class="width-70"
                      :picker-options="{disabledDate: pickerOptions}"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      popper-class="rightAway"
                      placeholder="选择结束时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </div>
          </div>
          <div class="portion">
            <div>
              <i class="el-icon-circle-check"></i>
              <b>需要回访的学生</b>
            </div>
            <div class="studentStatus">
              <el-form-item prop="studentStatus">
                <el-checkbox-group v-model="phaseVisitQuery.studentStatus">
                  <el-checkbox v-for="(item,index) in phaseVisitOptions.studentStatus" :key="index" :label="item.key">{{item.value}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="studentsVisit">
              <el-form-item prop="condition">
                <el-radio-group v-model="phaseVisitQuery.condition">
                  <el-radio v-for="(item,index) in condition" :key="index" :label="item.key">{{item.value}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="eligibleStudents" class="operatingcon">
                <el-form-item label="下次上课时间：" prop="nextLessonTime">
                  <el-date-picker
                    v-model="phaseVisitQuery.nextLessonTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="最后沟通时间：" prop="lastCommunicateTime">
                  <el-date-picker
                    v-model="phaseVisitQuery.lastCommunicateTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="高考年份:" prop="examYear">
                  <el-select v-model="phaseVisitQuery.examYear" clearable filterable placeholder="请选择高考年份">
                    <el-option
                      v-for="item in phaseVisitOptions.years"
                      :key="item.year_id"
                      :label="item.year_value"
                      :value="item.year_id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在地区:" prop="ProvinceId">
                  <el-col :span="4">
                    <el-form-item prop="ProvinceId">
                      <el-select v-model="phaseVisitQuery.ProvinceId" clearable filterable placeholder="省">
                        <el-option
                          v-for="(item,index) in phaseVisitOptions.provinceList"
                          :key="index"
                          :label="item.area_name"
                          :value="item.id"
                          :class="'level-'+item.level">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item prop="cityId">
                      <el-select v-model="phaseVisitQuery.cityId" clearable filterable placeholder="市">
                        <el-option
                          v-for="(item,index) in phaseVisitOptions.city"
                          :key="index"
                          :label="item.area_name"
                          :value="item.id"
                          :class="'level-'+item.level">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="portion">
            <div>
              <i class="el-icon-circle-check"></i>
              <b>需要回访的班主任</b>
            </div>
            <div class="studentsVisit">
              <el-form-item prop="teamMembers">
                <el-radio-group v-model="phaseVisitQuery.teamMembers">
                  <el-radio v-for="(item,index) in teamMembers" :key="index" :label="item.key">{{item.value}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="operatingcon" v-if="teacherVisit">
                <el-form-item label="选择组员:" prop="group">
                  <el-col :span="4">
                    <el-form-item prop="group">
                      <el-select v-model="phaseVisitQuery.group" clearable filterable placeholder="组别">
                        <el-option
                          v-for="(item,index) in phaseVisitOptions.departmentList.deptTree"
                          :key="index"
                          :label="item.text"
                          :value="item.id"
                          :class="'level-'+item.level">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item prop="byAssistant">
                      <el-select v-model="phaseVisitQuery.byAssistant" clearable filterable placeholder="组员">
                        <el-option
                          v-for="(item,index) in phaseVisitOptions.departmentList.allUser"
                          :key="index"
                          :label="item.text"
                          :value="item.id"
                          :class="'level-'+item.level">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <span slot="footer">
          <el-button @click="phaseVisitSubmit" type="primary" class="dialog-submit" :disabled="!canSearch">提交</el-button>
        </span>
      </el-dialog>

    <weak-password-dialog :dialog-visible.sync="weakPasswordDialogVisible"></weak-password-dialog>
    <referral-dialog
      v-if="showReferral"
      :showReferral="showReferral"
      @close-referral-dialog="closeReferral">
    </referral-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import ExpandTable from '@/components/ExpandTable'
  import ReferralDialog from './referralDialog.vue'
  import weakPasswordDialog from '@/components/weakPasswordDialog'

  export default {
    name: 'dashboard',
    data() {
      return {
        radio: '1',
        showReferral: false,
        weakPasswordDialogVisible: false,
        query: {
          todoType: '1',
          visitStatus: '',
          visitType: '',
          keyWord: '',
          deptTree: '',
          allUser: '',
          parentReferral: false,
          recommendStudent: false
        },
        options: {
          todoType: [],
          visitStatus: [],
          visitType: [],
          batchProcessType: [],
          deptTree: [],
          allUser: []
        },
        remind: {
          total: {
            message: '总数：',
            num: '',
            taskcolor: 'totalcolor'
          },
          firstCallTotal: {
            message: '首呼：',
            num: '',
            taskcolor: 'firstCallcolor'
          },
          firstLessonTotal: {
            message: '首课：',
            num: '',
            taskcolor: 'firstLessoncolor'
          },
          timeOutTotal: {
            message: '已超时：',
            num: '',
            taskcolor: 'timeOutcolor'
          },
          laterProcessTotal: {
            message: '稍后处理：',
            num: '',
            taskcolor: 'laterProcesscolor'
          }
        },
        showBatchOperation: false, // 权限判断
        rows: [],
        loading: true,
        canSearch: true,
        columns: [
          {
            'value': 'processingText', 'text': '任务状态', 'sortable': true
          },
          {
            'value': 'end_time', 'text': '回访时间'
          },
          {
            'value': 'visitTypeStr', 'text': '任务类型'
          },
          {
            'value': 'student_no', 'text': '学生编号'
          },
          {
            'value': 'studentName', 'text': '学生姓名'
          },
          {
            'value': 'phone', 'text': '手机号'
          },
          {
            'value': 'content', 'text': '备注'
          },
          {
            'value': 'exam_year', 'text': '高考年份'
          },
          {
            'value': 'teacherName', 'text': '班主任'
          },
          {
            'value': 'department_name', 'text': '组别'
          },
          {
            'value': 'lookView',
            'text': '查看'
          },
          {
            'value': 'operating',
            'text': '操作'
          }
        ], // 表格表头
        slotNameArr: ['processingText', 'lookView', 'operating', 'content', 'visitTypeStr'],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0' // 一共多少条
        },
        multipleSelection: [], // check选择的数组对象
        checkBoxIdArr: [], // check 选择的id数组
        dialogVisible: false,
        dialogTitle: '', // 弹框的标题
        dialogTitleOne: true, // 是从行点击还是右上角确定点击
        dialogRioSecco: false,
        roleType: '',
        dialogQuery: {
          status: '',
          communicationSituation: '',
          communicationTool: '',
          communicationContent: '',
          success: '',
          revisitMissionId: '' // 任务id "1,2,3"
        },
        dialogOptions: {
          status: [],
          situation: [],
          tool: [],
          success: []
        },
        dialogRules: {
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
          success: [
            {
              required: true, message: '请选择是否拓科成功', trigger: 'change'
            }
          ],
          communicationContent: [
            {
              required: true, message: '请填写沟通内容', trigger: 'change'
            }
          ]
        }, // 弹框form验证
        checkProcessingStatus: '1', // 右上角选中的value
        setIntervalId: '', // 计时器id
        dialogStatusDisabled: false, // 弹框回访状态是否可选
        browserTimeValidate: {
          browser: {
            showDialog: false,
            isTrue: false,
            message: '请使用谷歌浏览器！'
          },
          browserVersion: {
            showDialog: false,
            isTrue: false,
            message: '请升级谷歌浏览器版本到60以上！'
          },
          time: {
            showDialog: false,
            isTrue: false,
            message: '请调整系统时间到准确时间！'
          }
        },
        // 创建阶段回访任务
        phaseVisit: false,
        eligibleStudents: false,
        teacherVisit: false,
        phaseVisitQuery: {
          title: '',
          stageStart: '',
          stageEnd: '',
          condition: '1',
          studentStatus: [],
          nextLessonTime: [],
          lastCommunicateTime: [],
          ProvinceId: '',
          cityId: '',
          examYear: '',
          teamMembers: '1',
          group: '',
          byAssistant: ''
        },
        condition: [
          { key: '1', value: '不精细筛选，直接创建' },
          { key: '2', value: '符合条件的学生' }
        ],
        teamMembers: [
          { key: '1', value: '我名下所有组员' },
          { key: '2', value: '我名下符合条件的组员' }
        ],
        phaseVisitOptions: {
          studentStatus: [],
          provinceList: [],
          years: [],
          city: [],
          departmentList: {
            deptTree: [],
            allUser: []
          }
        },
        nowTime: new Date().getTime(),
        phaseVisitRules: {
          title: [
            {
              required: true, message: '请填写回访主题', trigger: 'change'
            }
          ],
          stageStart: [
            {
              required: true, trigger: 'change', validator: this.timePickerValidate
            }
          ],
          stageEnd: [
            {
              required: true, trigger: 'change', validator: this.timestageEnd
            }
          ]
        }
      }
    },
    components: {
      ExpandTable,
      weakPasswordDialog,
      ReferralDialog
    },
    computed: {
      ...mapGetters(['getTime', 'name', 'isMobile', 'visitGetTotal', 'userId', 'passwordState']),
      'canCheckAllBox'() {
        if (this.showBatchOperation) {
          return 'no'
        }
        return ''
      }
    },
    created() {
      if (this.passwordState === '0') {
        this.weakPasswordDialogVisible = true
      }
      this.getList()
      this.getData()
    },
    deactivated() {
      this.setIntervalId && clearInterval(this.setIntervalId)
    },
    beforeDestroy() {
      this.setIntervalId && clearInterval(this.setIntervalId)
    }, // 销毁时 清除计时器
    mounted() {
      this.getOptions()
      this.getDialogOptions()
      this.getphaseVisitOptions()
    },
    methods: {
      ...mapActions([
        'getNowTime',
        'setVisitGetTotal'
      ]),
      getOptions() {
        this.$http.get('visit_searchParam').then(res => {
          if (res.data) {
            this.options = res.data
            this.options.allUser = []
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('搜索数据请求失败，请稍后重试！')
        })
      },
      getDialogOptions() {
        this.$http.get('teacher_communicationTool').then(res => {
          if (res.data) {
            this.dialogOptions = res.data
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('弹框数据请求失败，请稍后重试！')
        })
      },
      getData() {
        this.$http.get('visit_getTotal').then(res => {
          if (res.data) {
            this.setVisitGetTotal(res.data)
            for (const key in this.remind) {
              this.remind[key].num = this.visitGetTotal[key]
            }
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('数据请求失败，请稍后重试！')
        })
      },
      getList() {
        this.loading = true
        this.canSearch = false
        if (this.query.todoType) {
          if (this.query.visitStatus || this.query.visitType || this.query.keyWord || this.query.deptTree || this.query.allUser) {
            this.$set(this.query, 'todoType', '')
          }
        }
        const _query = Object.assign({}, this.query)
        this.$http.get('visit_visitList', {
          params: _query,
          paging: this.paging
        }).then(res => {
          if (res.data) {
            if (res.data.list.length === 0) {
              this.rows = []
              this.paging.totalRows = '0'
              return false
            }
            this.rows = res.data.list.map(val => {
              val.visitTypeStr = this.getVisitTypeStr(val.visitType, val.title)
              return val
            })
  
            this.paging.totalRows = res.data.total
            this.showBatchOperation = res.data.showBatchOperation
          }
        }).then(async() => {
          // 计时器
          if (!this.setIntervalId) {
            if (!this.isMobile) {
              const isTrue = await this.browserValidate()
              if (isTrue) {
                const isTrue = await this.browserVersionValidate()
                isTrue || (this.browserTimeValidate.browserVersion.showDialog = true)
              } else {
                this.browserTimeValidate.browser.showDialog = true
              }
            }
            this.setIntervalId = setInterval(this.getTableProcessingText, 60000)
          }
          this.getTableProcessingText()
        }).catch(console.log).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      getGroupMember() {
        this.$http.post('visit_getGroupMember', { group: this.query.deptTree }).then(res => {
          if (res.data) {
            this.$set(this.options, 'allUser', res.data.users)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取人员请求失败，请稍后重试！')
        })
      },
      getVisitTypeStr(num, title) {
        var str = ''
        switch (num) {
          case '1':
            str = '首呼回访'
            break
          case '2':
            str = '首课回访'
            break
          case '3':
            str = '首月回访'
            break
          case '4':
            str = '次月回访'
            break
          case '6':
            str = '首课回访'
            break
          case '7':
            str = '阶段回访' + `-${title}`
            break
          case '8':
            str = '生日任务'
            break
          case '9':
            str = '拓科任务'
            break
          default:
            str = '日常回访'
        }
        return str
      }, // 回访type 1=>首呼回访
      postDialogForm(obj) {
        return this.$http.post('teacher_batchAddRecord', obj)
      }, // 弹框表格提交接口
      resetAfterQuery(newVal) {
        if (newVal !== '') {
          for (const key in this.query) {
            if (key === 'todoType' || key === 'parentReferral' || key === 'recommendStudent') {
              continue
            } else {
              this.$set(this.query, key, '')
            }
          }
          this.getList()
        }
      }, // 改变待办类型清空搜索
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }, // 重置搜索条件
      handleSelectionChange(val) {
        this.multipleSelection = val
      }, // checkbox change 事件
      showProcessResult(type, row) {
        this.checkBoxIdArr = []
        this.roleType = ''
        if (type === 'one') { // 从列表点击
          this.dialogStatusDisabled = false
          this.dialogTitle = row.studentName
          this.dialogQuery.revisitMissionId = row.revisitMissionId.toString()
          this.checkBoxIdArr.push(row.revisitMissionId)
          this.dialogTitleOne = true
          this.dialogVisible = true
          this.roleType = row.visitType
          return
        } else if (type === 'more') { // 批量处理确定
          if (this.multipleSelection.length === 0) {
            this.$message.warning('请批量选择待办项')
            return
          } else if (this.multipleSelection.length === 1) { // 批量处理长度=1
            this.dialogTitle = this.multipleSelection[0].studentName
            this.dialogQuery.revisitMissionId = this.multipleSelection[0].revisitMissionId.toString()
            this.checkBoxIdArr.push(this.multipleSelection[0].revisitMissionId)
            this.dialogTitleOne = true
          } else {
            this.dialogTitle = this.multipleSelection.length + '个学生'
            this.checkBoxIdArr = this.multipleSelection.map(val => {
              return val.revisitMissionId
            })
            const visitTypes = this.multipleSelection.map(val => {
              return val.visitType
            })
            if (visitTypes.includes('9')) {
              this.$message.warning('该批量处理中包含拓客回访，不允许批量操作！')
              return
            }
            this.dialogQuery.revisitMissionId = this.checkBoxIdArr.join()
            this.dialogTitleOne = false
          }
        }
        this.dialogQuery.status = this.checkProcessingStatus
        this.dialogStatusDisabled = true
        this.dialogVisible = true
      }, // 点击处理结果 或 多选之后确认 => 显示弹框,title文字等
      closeDialogEvent() {
        this.resetForm('dialogQuery')
      }, // 关闭弹框的事件
      dialogSubmit() {
        this.$refs['dialogQuery'].validate((valid) => {
          if (valid) {
            this.canSearch = false
            var copyObj = Object.assign({}, this.dialogQuery)
            if (this.dialogStatusDisabled) {
              copyObj.communicationContent = this.name + '批处理：' + copyObj.communicationContent
            }
            this.postDialogForm(copyObj).then(res => {
              if (res.data) {
                this.$message.success(res.message)
                this.dialogVisible = false
                this.dialogSubmitStatusEvent()
                this.getData()
              } else {
                this.$message.warning(res.message)
              }
            }).catch(console.log).finally(() => {
              this.canSearch = true
            })
          } else {
            this.$message.warning('提交失败')
            return false
          }
        })
      }, // 弹框提交按钮
      dialogSubmitStatusEvent() {
        this.getList()
        this.$refs.multipleTable.$refs['tableRef'].clearSelection()
      }, // 判断弹框提交时的处理状态
      getTableProcessingText() {
        this.getNowTime().then(async() => {
          await this.timeValidate() || (this.browserTimeValidate.time.showDialog = true)
          const data = this.rows
          if (data) {
            data.forEach((val, index) => {
              val.index = index
              this.$set(this.rows, index, this.updateValue(val))
            })
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取服务器时间失败')
          this.loading = false
        })
      }, // 更新table里的处理状态
      updateValue(val) {
        const curDelEndTime = this.getTime - Number(val.unixEndTime)
        const curDelStartTime = this.getTime - Number(val.unixStartTime)
        const text = this.calculatingTime(Math.abs(curDelEndTime))
        if (curDelEndTime >= 0) { // 超时
          val.processingText = '已超时：' + text
          val.statusColor = '-1' // 判断行是否有颜色 statusColor -1 黄色颜色 -2 灰色 -3 绿色
          return val
        } else if (curDelStartTime <= 0) { // 未开始
          val.processingText = '未开始'
          val.cantClickCheckbox = true
          return val
        } else if (curDelEndTime < 0 && curDelEndTime >= -60000 * 30) { // 倒计时半小时内
          val.statusColor = '-1'
        } else {
          val.statusColor = '-3'
          val.statusColorClass = ''
        }
        val.processingText = '倒计时：' + text
        return val
      }, // 字符串=> 倒计时1天2小时23分，未开始
      calculatingTime(curDelStartTime) {
        const day = Math.floor(curDelStartTime / 86400000)
        const dayText = day === 0 ? ' ' : day + '天'
        const hour = Math.floor((curDelStartTime - day * 86400000) / 3600000)
        const hourText = hour === 0 ? '00时' : hour + '时'
        const minute = Math.floor((curDelStartTime - day * 86400000 - hour * 3600000) / 60000)
        const minuteText = minute === 0 ? '00分' : minute + '分'
        return dayText + hourText + minuteText
      }, // 234234=>1天2小时23分
      changeTableViewSelect(row) {
        if (row.rosterId) {
          this.$eventBus.$emit('show-no-permission-dialog', row.rosterId)
        } else {
          this.$message.error('系统错误！')
        }
      }, // 沟通详情
      browserValidate() {
        if (window.navigator.userAgent.indexOf('Chrome') !== -1) {
          this.browserTimeValidate.browser.isTrue = true
          return true
        }
        this.browserTimeValidate.browser.isTrue = false
        return false
      }, // 判断浏览器
      browserVersionValidate() {
        function getChromeVersion() {
          const arr = navigator.userAgent.split(' ')
          var chromeVersion = ''
          for (let i = 0; i < arr.length; i++) {
            if (/chrome/i.test(arr[i])) {
              chromeVersion = arr[i]
            }
          }
          if (chromeVersion) {
            return Number(chromeVersion.split('/')[1].split('.')[0])
          } else {
            return 0
          }
        }

        const version = getChromeVersion()
        if (version >= 60) {
          this.browserTimeValidate.browser.isTrue = true
          return true
        }
        this.browserTimeValidate.browser.isTrue = false
        return false
      }, // 判断浏览器版本号
      timeValidate() {
        if (Math.abs(new Date().getTime() - this.getTime) < 3600000 * 2) {
          this.browserTimeValidate.time.isTrue = true
          return true
        }
        this.browserTimeValidate.time.isTrue = false
        return false
      }, // 判断时差时候超过1小时
      // 创建阶段性回访
      periodicVisit() {
        this.phaseVisit = true
      },
      // 内部推荐码
      referralCode() {

      },
      timePickerValidate(rule, value, callback) {
        if (!value) {
          callback(new Error('请选择开始时间'))
          return
        }
        const nowDate = new Date().getDate()
        const newDate = new Date(this.phaseVisitQuery.stageStart).getDate()
        if (nowDate === newDate === true) {
          callback(new Error('请从第二天开始选择'))
          return
        }
        callback()
      },
      timestageEnd(rule, value, callback) {
        if (!value) {
          callback(new Error('请选择结束时间'))
          return
        }
        const nowTime = new Date(this.phaseVisitQuery.stageEnd).getTime()
        const newTime = new Date(this.phaseVisitQuery.stageStart).getTime() + 3600000
        if (nowTime > newTime === false) {
          callback(new Error('不能小于开始时间一个小时'))
          return
        }
        callback()
      },
      pickerOptions(val) {
        const nowTime = this.nowTime
        const valTime = new Date(val).getTime()
        if (valTime > (nowTime) && valTime < (nowTime + 30 * 86400000)) {
          return false
        }
        return true
      },
      phaseVisitSubmit() {
        this.$refs['phaseVisitQuery'].validate((valid) => {
          if (valid) {
            this.canSearch = false
            var _visitQuery = Object.assign({}, this.phaseVisitQuery)
            if (_visitQuery.nextLessonTime.length === 0) {
              _visitQuery.nextLessonTimeStart = ''
              _visitQuery.nextLessonTimeEnd = ''
            } else {
              _visitQuery.nextLessonTimeStart = _visitQuery.nextLessonTime[0]
              _visitQuery.nextLessonTimeEnd = _visitQuery.nextLessonTime[1]
            }
            if (_visitQuery.lastCommunicateTime.length === 0) {
              _visitQuery.lastCommunicateTimeStart = ''
              _visitQuery.lastCommunicateTimeEnd = ''
            } else {
              _visitQuery.lastCommunicateTimeStart = _visitQuery.lastCommunicateTime[0]
              _visitQuery.lastCommunicateTimeEnd = _visitQuery.lastCommunicateTime[1]
            }
            _visitQuery.studentStatus = _visitQuery.studentStatus.toString()
            this.$delete(_visitQuery, 'nextLessonTime')
            this.$delete(_visitQuery, 'lastCommunicateTime')
            this.$http.post('teacher_needAddStageTask', _visitQuery).then(res => {
              if (res.data) {
                this.$message.success(res.message)
                this.phaseVisit = false
              } else {
                this.$message.warning(res.message)
              }
            }).catch(error => {
              console.log(error)
              this.$message.error('提交失败，请稍后重试！')
            }).finally(() => {
              this.canSearch = true
            })
          } else {
            setTimeout(() => {
              this.$message.warning('请完善任务设置！')
            }, 1000)
            this.canSearch = true
            return false
          }
        })
      },
      getphaseVisitOptions() {
        this.$http.get('teacher_stageTaskSearchParam').then(res => {
          if (res.data) {
            this.phaseVisitOptions = res.data
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('弹框数据请求失败，请稍后重试！')
        })
      },
      getCity() {
        this.$http.post('lesson_getCity', { provinceId: this.phaseVisitQuery.ProvinceId }).then(res => {
          if (res.data) {
            this.$set(this.phaseVisitOptions, 'city', res.data.city)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取城市请求失败，请稍后重试！')
        })
      },
      getMember() {
        this.$http.post('visit_getGroupMember', { group: this.phaseVisitQuery.group }).then(res => {
          if (res.data) {
            this.$set(this.phaseVisitOptions.departmentList, 'allUser', res.data.users)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取人员请求失败，请稍后重试！')
        })
      },
      bouncedClear() {
        this.resetForm('phaseVisitQuery')
      },
      /*
      内部推荐码
      */
      closeReferral() {
        this.showReferral = !this.showReferral
      }
    },
    watch: {
      'query.deptTree'(newVal) {
        this.$set(this.query, 'allUser', '')
        if (newVal) {
          this.getGroupMember()
        } else {
          this.options.allUser = []
        }
      },
      'dialogQuery.status'(val) {
        if (val === '0') {
          this.dialogRioSecco = false
          this.dialogQuery.success = ''
        } else {
          this.dialogRioSecco = this.roleType === '9'
        }
      },
      'phaseVisitQuery.condition'(newVal) {
        if (newVal === '2') {
          this.eligibleStudents = true
        } else {
          this.eligibleStudents = false
          this.$set(this.phaseVisitQuery, 'nextLessonTime', [])
          this.$set(this.phaseVisitQuery, 'lastCommunicateTime', [])
          this.$set(this.phaseVisitQuery, 'examYear', '')
          this.$set(this.phaseVisitQuery, 'ProvinceId', '')
          this.$set(this.phaseVisitQuery, 'cityId', '')
        }
      },
      'phaseVisitQuery.teamMembers'(newVal) {
        if (newVal === '2') {
          this.teacherVisit = true
        } else {
          this.teacherVisit = false
          this.$set(this.phaseVisitQuery, 'group', '')
          this.$set(this.phaseVisitQuery, 'byAssistant', '')
        }
      },
      'phaseVisitQuery.group'(newVal) {
        this.$set(this.phaseVisitQuery, 'byAssistant', '')
        if (newVal) {
          this.getMember()
        } else {
          this.phaseVisitOptions.departmentList.allUser = []
        }
      },
      'phaseVisitQuery.ProvinceId'(newVal) {
        this.$set(this.phaseVisitQuery, 'cityId', '')
        if (newVal) {
          this.getCity()
        } else {
          this.phaseVisitOptions.city = []
        }
      }
    }
  }
</script>
<style lang="sass" scoped>
  @import '../../styles/dashboard/index.sass'
</style>
