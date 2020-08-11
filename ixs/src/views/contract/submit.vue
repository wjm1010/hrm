<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <el-row>
      <el-form inline ref="form" :model="query">
        <el-form-item prop="contractStatus">
          <el-select v-model="query.contractStatus" placeholder="成单状态">
            <el-option
              v-for="(item,index) in options.contractType"
              :key="index"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<transition name="fade">-->
          <!--<el-form-item v-show="!showPartQueryObj.showPartQuery" class="btnCanSearch">-->
            <!--<el-button type="primary"  icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>-->
            <!--<el-button icon="el-icon-delete" @click="resetFields">重置</el-button>-->
          <!--</el-form-item>-->
        <!--</transition><br>-->
        <transition name="fade">
          <el-form-item  prop="submitTime" >
            <el-date-picker
              v-model="query.submitTime"
              type="daterange"
              range-separator="至"
              start-placeholder="成单生成日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </transition>
        <transition name="fade">
          <el-form-item  prop="student">
            <el-input v-model="query.student" placeholder="学生姓名"></el-input>
          </el-form-item>
        </transition>
        <transition name="fade">
          <el-form-item  prop="contractId">
            <el-input v-model="query.contractId" placeholder="成单编号"></el-input>
          </el-form-item>
        </transition>
        <transition name="fade">
          <el-form-item  prop="bigTypeId">
            <el-select v-model="query.bigTypeId" placeholder="课程类型">
              <el-option
                v-for="(item,index) in options.bigTypeIdType"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </transition><br>
        <transition name="fade">
          <el-form-item  prop="orderPay">
            <el-radio-group v-model="query.orderPay">
              <el-radio v-for="(item,index) in options.orderPayType" :key="index" :label="item.key">{{item.value}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </transition><br>
        <transition name="fade">
          <el-form-item >
            <el-button type="primary"  icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>
            <el-button icon="el-icon-delete" @click="resetFields">重置</el-button>
          </el-form-item>
        </transition>
      </el-form>
    </el-row>
    <!--<el-row>-->
      <!--<el-col :span="24" class="border-top-1px">-->
        <!--<el-button type="primary" @click="showPart">{{showPartQueryObj.btnText}}<i :class="showPartQueryObj.btnIcon"></i></el-button>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <!-- 列表 -->
    <expand-table
      :rows="rows"
      :loading="loading"
      :columns="columns"

      :slot-name-arr="slotNameArr"
      @change-table-sort="changeTableSort"

      :pagination="paging"
      @get-list="getList">

      <template slot-scope="scope" slot="opertion">
        <el-button type="text" @click="changeTableViewSelect(scope.row)" class="actionItems">沟通详情</el-button>
        <el-button type="text" @click="routerJump(scope.row)" class="actionItems">成单信息</el-button>
      </template>
    </expand-table>
  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'
  // import EventBus from '@/eventBus.js'
  export default {
    name: 'contractSubmit',
    components: { expandTable },
    data() {
      return {
        columns: [
          { 'value': 'studentName', 'text': '学生姓名' },
          { 'value': 'studentNo', 'text': '学生编号' },
          { 'value': 'contractId', 'text': '成单编号' },
          { 'value': 'sum', 'text': '成单金额' },
          { 'value': 'submitTime', 'text': '登记时间', sortable: 'custom' },
          { 'value': 'contractStatusName', 'text': '状态' },
          { 'value': 'submitUserName', 'text': '申请人' },
          { 'value': 'opertion', 'text': '操作' }
        ],
        slotNameArr: ['opertion'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0' // 一共多少条
        },
        query: {
          submitTime: [],
          student: '',
          contractId: '',
          contractStatus: '',
          orderPay: '',
          bigTypeId: '',
          sequence: '',
          sort: ''
        },
        loading: false,
        isCanSearch: true,
        showPartQueryObj: {
          btnText: '展开',
          btnIcon: 'el-icon-caret-top',
          showPartQuery: false
        },
        options: {
          contractType: [
            {
              'key': '-1',
              'value': '全部'
            }, {
              'key': '1',
              'value': '创建'
            }, {
              'key': '2',
              'value': '审核'
            }, {
              'key': '3',
              'value': '确认'
            }, {
              'key': '4',
              'value': '生效'
            }, {
              'key': '5',
              'value': '执行'
            }, {
              'key': '6',
              'value': '暂停'
            }, {
              'key': '7',
              'value': '终止'
            }
          ],
          bigTypeIdType: [
            {
              'key': '-1',
              'value': '全部'
            }, {
              'key': '1',
              'value': '学科辅导'
            }, {
              'key': '2',
              'value': '升学辅导'
            }
          ],
          orderPayType: [
            {
              'key': '2',
              'value': '总额未到账'
            }, {
              'key': '3',
              'value': '付款未完成'
            }
          ]
        }
      }
    },
    computed: {},
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        this.isCanSearch = false
        const _query = Object.assign({}, this.query)
        if (_query.submitTime === null || _query.submitTime.length === 0) {
          _query.submitTimeStart = ''
          _query.submitTimeEnd = ''
        } else {
          _query.submitTimeStart = _query.submitTime[0]
          _query.submitTimeEnd = _query.submitTime[1]
        }
        this.$delete(_query, 'submitTime')
        this.$http.post('contract_signSubmit', _query, { paging: this.paging }).then(res => {
          if (res.data) {
            if (res.data.list.length === 0) {
              this.rows = []
              this.$message.warning('没有符合条件的数据')
              this.paging.totalRows = '0'
              return false
            }
            this.rows = res.data.list
            this.paging.totalRows = res.data.paging.dataCount
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
          this.isCanSearch = true
        })
      },
      resetFields() {
        this.$refs['form'].resetFields()
        this.submitTime = []
      },
      showPart() {
        if (this.showPartQueryObj.btnText === '展开') {
          this.showPartQueryObj.showPartQuery = true
          this.showPartQueryObj.btnText = '收缩'
          this.showPartQueryObj.btnIcon = 'el-icon-caret-bottom'
        } else {
          this.showPartQueryObj.showPartQuery = false
          this.showPartQueryObj.btnText = '展开'
          this.showPartQueryObj.btnIcon = 'el-icon-caret-top'
        }
      },
      routerJump(row) {
        if (row.studentIntentionId) {
          this.$router.push(`/contract/student_list/${row.studentIntentionId}`)
        } else {
          this.$message.error('系统错误！')
          return
        }
      },
      changeTableViewSelect(row) {
        if (row.studentIntentionId) {
          this.$eventBus.$emit('show-no-permission-dialog', row.studentIntentionId)
        } else {
          this.$message.error('系统错误！')
        }
      },
      changeTableSort(prop, order) {
        this.query.sequence = prop
        this.query.sort = order
        this.getList()
      }
    }
  }
</script>
<style lang="sass">
  @import '../../styles/contract/submit.sass'
</style>
