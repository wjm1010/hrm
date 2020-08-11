<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-form ref="query" :model="query" label-width="120px" inline>
        <el-form-item prop="deptTree" v-if="jurisdiction">
          <el-select v-model="query.deptTree" placeholder="请选择部门" clearable filterable>
            <el-option
              v-for="item in options.deptTree"
              :key="item.id"
              :label="item.text"
              :value="item.id"
              :class="'level-'+item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="allUser" v-if="jurisdiction">
          <el-select v-model="query.allUser" placeholder="请选择人员" clearable filterable>
            <el-option
              v-for="item in options.allUser"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="parentReferral" class="present-referral">
          <el-checkbox v-model="query.parentReferral">家长转介绍学生</el-checkbox>
        </el-form-item>
        <el-form-item prop="recommendStudent">
          <el-checkbox v-model="query.recommendStudent">我推荐的学生</el-checkbox>
        </el-form-item>
        <br>
        <el-form-item prop="keyWord">
          <el-input
            style="width:200px"
            placeholder="学生姓名/编号/手机号"
            v-model.trim="query.keyWord"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="areaId">
          <el-select v-model="query.areaId" clearable filterable placeholder="请选择地区">
            <el-option
              v-for="item in options.areas"
              :key="item.id"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="examYear">
          <el-select v-model="query.examYear" clearable filterable placeholder="请选择高考年份">
            <el-option
              v-for="item in options.years"
              :key="item.year_id"
              :label="item.year_value"
              :value="item.year_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="curriculumStatus">
          <el-select v-model="query.curriculumStatus" clearable filterable placeholder="请选择结课状态">
            <el-option
              v-for="(item,index) in options.overStatus"
              :key="index"
              :label="item"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item prop="submitProp">
          <el-select v-model="query.submitProp" clearable filterable placeholder="请选择提交属性">
            <el-option
              v-for="(item,index) in options.submitAttr"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="query.type" filterable placeholder="请选择沟通时间">
            <el-option
              v-for="(item,index) in options.typeList"
              :key="index"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="nextCommunicationTime">
          <el-date-picker
            v-model="query.nextCommunicationTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item> <br>
        <el-form-item prop="intention">
          <el-select v-model="query.intention" clearable filterable placeholder="请选择续费意向">
            <el-option
              v-for="(item,index) in options.intentions"
              :key="index"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!canSearch">查询</el-button>
          <el-button @click="resetForm('query')" icon="el-icon-delete" class="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom:20px" v-if="teacherWhite==='0'">
        <el-button type="primary" @click="allotTeacher">分配班主任</el-button>
      </div>
      <el-col :span="24">
        <expand-table
          :can-check-all-box="canCheckAllBox"
          @selection-change-event="handleSelectionChange"
          @change-table-sort="changeTableSort"
          :pagination="paging"
          @get-list="getList"
          :rows="rows"
          :loading="loading"
          :columns="columns"
          :slot-name-arr="slotNameArr">
          <template slot-scope="scope" slot="content">
              <el-popover trigger="hover" placement="top" v-if="scope.row['content'].length>10" width="500">
                <p>{{scope.row['content']}}</p>
                <div slot="reference">
                  <p class="name-wrapper">{{scope.row['content']}}</p>
                </div>
              </el-popover>
              <p v-else class="name-wrapper">{{scope.row['content']}}</p>
          </template>
          <template slot-scope="scope" slot="phone">
            <p>{{scope.row['name']}}</p>
            <p>{{scope.row['phone']}}</p>
          </template>

          <template slot-scope="scope" slot="curr_plan_name">
          <el-popover trigger="hover" placement="top" v-if="scope.row['curr_plan_name'].length>10" width="500">
            <p>{{scope.row['curr_plan_name']}}</p>
            <div slot="reference" class="name-wrapper">
              <p class="name-wrapper">{{scope.row['curr_plan_name'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else class="name-wrapper">{{scope.row['curr_plan_name']}}</p>
          </template>

          <template slot-scope="scope" slot="operating">
            <el-button type="text" size="small" @click="changeTableViewSelect(scope.row)" class="actionItems">
              沟通详情
            </el-button>
            <el-button type="text" size="small" @click="addOrder(scope.row)" class="actionItems">
              新建正式设班单
            </el-button>
          </template>

        </expand-table>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      @close="closeDialogEvent"
      custom-class="el-dialog-md">
      <el-form :model="dialogQuery" ref="dialogQuery" :rules="dialogRules" label-width="120px">
        <el-form-item prop="deptTree" label="部门：">
          <el-select
            v-model="dialogQuery.deptTree"
            placeholder="请选择部门"
            @change="dialogQueryDeptTreeChange"
            multiple
            filterable
            collapse-tags
            clearable>
            <el-option
              v-for="item in dialogOptions.deptTree"
              :key="item.id"
              :label="item.text"
              :value="item.id"
              :class="'level-'+item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="allUser" label="班主任：">
          <el-select v-model="dialogQuery.allUser" placeholder="请选择班主任" filterable clearable >
            <el-option
              v-for="item in dialogOptions.allUser"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeDialogEvent">取消</el-button>
        <el-button @click="dialogSubmit" type="primary" :disabled="!canSearch">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import { mapGetters } from 'vuex'
  export default {
    name: 'studentindex',
    data() {
      return {
        jurisdiction: false,
        query: {
          type: '',
          nextCommunicationTime: [],
          examYear: '',
          areaId: '',
          curriculumStatus: '',
          timeStatus: '',
          submitProp: '',
          deptTree: '',
          allUser: '',
          keyWord: '',
          sequence: '',
          sort: '',
          intention: '',
          parentReferral: false,
          recommendStudent: false
        },
        options: {
          typeList: [],
          years: [],
          areas: [],
          overStatus: [],
          timeStatus: [],
          submitAttr: [],
          deptTree: [],
          allUser: [],
          sortState: [],
          intentions: []
        },
        dialogOptions: {
          deptTree: [],
          allUser: []
        },
        dialogQuery: {
          deptTree: '',
          allUser: ''
        },
        dialogRules: {
          allUser: [
            {
              required: true, message: '请选择人员', trigger: 'change'
            }
          ]
        }, // 弹框form验证
        selectedData: [],
        rows: [],
        loading: true,
        teacherWhite: '1',
        dialogVisible: false, // 弹框 显示/隐藏
        columns: [
          {
            'value': 'student_no', 'text': '学生编号'
          },
          {
            'value': 'phone', 'text': '学生姓名 首要号码', width: 80, 'defineWidth': 'define-width'
          },
          {
            'value': 'intention_name', 'text': '续费意向'
          },
          {
            'value': 'area_name', 'text': '所在地区'
          },
          {
            'value': 'exam_year', 'text': '高考年份', width: 60
          },
          {
            'value': 'curr_plan_name', 'text': '报名课程'
          },
          {
            'value': 'next_lesson_time', 'text': '下次上课时间', 'sortable': true, width: 80
          },
          {
            'value': 'last_lesson_time', 'text': '最后上课时间', 'sortable': true, width: 80
          },
          {
            'value': 'teacher_name', 'text': '班主任', width: 60
          },
          {
            'value': 'saler_name', 'text': '销售', width: 60
          },
          {
            'value': 'curriculum_status_name', 'text': '结课状态', width: 60
          },
          {
            'value': 'submit_prop', 'text': '提交属性'
          },
          {
            'value': 'content', 'text': '最后沟通内容', width: 80
          },
          {
            'value': 'end_time', 'text': '最后沟通时间', 'sortable': true, width: 80
          },
          {
            'value': 'operating', 'text': '查看'
          }
        ],
        slotNameArr: ['operating', 'content', 'curr_plan_name', 'phone'],
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '10'
        },
        canSearch: true
      }
    },
    components: {
      ExpandTable
    },
    computed: {
      ...mapGetters(['roleCode']),
      'canCheckAllBox'() {
        if (this.teacherWhite === '0') {
          return 'yes'
        }
        return ''
      }
    },
    created() {
      this.getTeacherWhite()
      this.getList()
    },
    mounted() {
      this.getOptions()
    },
    watch: {
      'query.deptTree'(newVal) {
        this.$set(this.query, 'allUser', '')
        if (newVal.length) {
          this.getGroupMember()
        } else {
          this.options.allUser = ''
        }
      }
    },
    methods: {
      changeTableSort(sequence, sort) {
        this.query.sequence = sequence
        this.query.sort = sort
        this.getList()
      },
      getGroupMember() {
        this.$http.post('visit_getGroupMember', { group: this.query.deptTree }).then(res => {
          if (res.data) {
            this.$set(this.options, 'allUser', res.data.users)
          }
        }).catch(console.log)
      },
      getTeacherWhite() {
        this.$http.get('teacher_teacherWhite').then(res => {
          if (res.data) {
            this.teacherWhite = res.data.op
          }
        }).catch(console.log)
      },
      getDialogGroupMember() {
        this.$http.post('visit_getGroupMember', { group: this.dialogQuery.deptTree }).then(res => {
          if (res.data) {
            this.$set(this.dialogOptions, 'allUser', res.data.users)
          }
        }).catch(console.log)
      },
      getOptions() {
        this.$http.get('course_search', {
          params: {
            stuType: '1'
          }
        }).then(res => {
          if (res.data) {
            this.options = res.data
            this.options.allUser = []
            this.options.intentions = [
              {
                id: 1,
                text: '高意向'
              },
              {
                id: 2,
                text: '无意向'
              },
              {
                id: 3,
                text: '意向模糊'
              },
              {
                id: 4,
                text: '未知'
              }
            ]
            this.query.type = '0'
          }
        }).catch(console.log)
        if (this.roleCode === 'ZJ-ZY') {
          this.jurisdiction = false
        } else {
          this.jurisdiction = true
        }
      },
      getDialogOptions() {
        this.$http.get('users_allotStudent').then(res => {
          if (res.data) {
            this.dialogOptions = res.data
            this.dialogOptions.allUser = []
          }
        }).catch(console.log)
      },
      postDialogForm() {
        const ids = []
        this.selectedData.forEach(value => {
          ids.push(value.student_intention_id)
        })
        return this.$http.post('lesson_callHeadmaster', {
          byAssistant: this.dialogQuery.allUser,
          studentIntentionId: ids.join()
        })
      }, // 弹框表格提交接口
      handleData(data) { // 处理表格数据
        this.rows = []
        data.map(item => {
          var listArray = []
          if (item['curriculums']) {
            item['curriculums'].forEach((item, index) => {
              listArray.push(item['curr_plan_name'])
            })
            item['curr_plan_name'] = listArray.join('/')
          }
          this.rows.push(item)
        })
      },
      getList() {
        this.loading = true
        this.canSearch = false
        const _query = Object.assign({}, this.query)
        if (_query.nextCommunicationTime === null || _query.nextCommunicationTime.length === 0) {
          _query.nextCommunicationTimeStart = ''
          _query.nextCommunicationTimeEnd = ''
        } else {
          _query.nextCommunicationTimeStart = _query.nextCommunicationTime[0]
          _query.nextCommunicationTimeEnd = _query.nextCommunicationTime[1]
        }
        this.$delete(_query, 'nextCommunicationTime')
        if (_query.curriculumStatus === '') {
          _query.curriculumStatus = '-1'
        }
        if (_query.submitProp === '') {
          _query.submitProp = '-1'
        }
        this.$http.get('users_lists', {
          params: _query,
          paging: this.paging
        }).then(res => {
          if (res.data) {
            if (res.data.list.length === 0) {
              this.rows = []
              this.paging.totalRows = '0'
              return false
            }
            this.paging.totalRows = res.data.paging.dataCount
            this.handleData(res.data.list)
          }
        }).catch(console.log).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.$set(this.query, 'remainingTimeEnd', '')
        this.query.type = '0'
      },
      closeDialogEvent() {
        this.dialogVisible = false
        this.$refs['dialogQuery'].resetFields()
      },
      dialogSubmit() {
        this.$refs['dialogQuery'].validate((valid) => {
          if (valid) {
            this.canSearch = false
            this.postDialogForm().then(res => {
              if (res.data) {
                this.$message.success(res.message)
                this.dialogVisible = false
                this.getList()
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
      dialogQueryDeptTreeChange() {
        this.$set(this.dialogQuery, 'allUser', '')
        this.getDialogGroupMember()
      },
      handleSelectionChange(row) {
        this.selectedData = row
      },
      allotTeacher() {
        if (this.selectedData.length === 0) {
          this.$message.warning('请选择要分配的名单，至少一条！')
        } else {
          this.getDialogOptions()
          this.dialogVisible = true
        }
      }, // 分配班主任
      changeTableViewSelect(row) {
        if (row.rosterId) {
          this.$eventBus.$emit('show-no-permission-dialog', row.rosterId)
        } else {
          this.$message.error('系统错误！')
        }
      }, // 沟通详情
      addOrder(row) {
        this.$router.push({ path: '/newLesson/add',
          query: {
            studentIntentionId: row.student_intention_id, studentNo: row.student_no, studentName: row.name
          }
        })
      } // 新建设班单
    }
  }
</script>
<style rel="stylesheet/sass" lang="sass" scoped>
  @import '../../styles/student/index.sass'
</style>
