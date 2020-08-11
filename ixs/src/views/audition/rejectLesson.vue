<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <div class="main">
      <el-form label-position="right" label-width="120px" ref="form" :model="query" inline>
        <el-form-item prop="opt">
          <el-radio-group v-model="query.opt" >
            <el-radio v-for="(item,index) in options.opt" :key="index" :label="item.key">{{item.value}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="parentReferral">
          <el-checkbox v-model="query.parentReferral">家长转介绍学生</el-checkbox>
        </el-form-item>
        <el-form-item prop="recommendStudent">
          <el-checkbox v-model="query.recommendStudent">我推荐的学生</el-checkbox>
        </el-form-item><br>
        <!--<el-form-item v-show="!showPartQueryObj.showPartQuery">-->
          <!--<el-button type="primary" icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>-->
          <!--<el-button icon="el-icon-refresh" @click="resetFields()">重置</el-button>-->
        <!--</el-form-item>-->
        <!--<br>-->
        <transition name="fade">
          <div>
            <el-form-item prop="nextCommunicationTime">
              <el-date-picker
                v-model="query.nextCommunicationTime"
                type="daterange"
                range-separator="至"
                start-placeholder="下次沟通日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="lastCommunicationTime">
              <el-date-picker
                v-model="query.lastCommunicationTime"
                type="daterange"
                range-separator="至"
                start-placeholder="最后沟通日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="group" v-if="jurisdiction">
              <el-select v-model="query.group" clearable collapse-tags placeholder="组" filterable>
                <el-option
                  v-for="item in options.group"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="member" v-if="jurisdiction">
              <el-select v-model="query.member" clearable collapse-tags placeholder="人" filterable>
                <el-option
                  v-for="item in options.users"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="applyTime">
              <el-date-picker
                v-model="query.applyTime"
                type="daterange"
                range-separator="至"
                start-placeholder="申请日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>
              <el-button icon="el-icon-refresh" @click="resetFields()">重置</el-button>
            </el-form-item>
          </div>
        </transition>
      </el-form>
      <!--<el-row>-->
        <!--<el-col :span="23" class="border-top-1px">-->
          <!--<el-button @click="hidePartQuery" type="primary">{{showPartQueryObj.btnText}}<i-->
            <!--:class="showPartQueryObj.btnIcon"></i></el-button>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <expandTable
        :loading="loading"
        :pagination="paging"
        @get-list="getList"
        @change-table-sort="changeTableSort"

        :rows="rows"
        :columns="columns"
        :slotNameArr="slotNameArr">

        <template slot-scope="scope" slot="suggestion">
          <el-popover trigger="hover" placement="top" v-if="scope.row['suggestion'] && scope.row['suggestion'].length>10" width="500">
            <p>{{scope.row['suggestion']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['suggestion'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['suggestion']}}</p>
        </template>

        <template slot-scope="scope" slot="operating">
          <el-button type="text" @click="changeTableViewSelect(scope.row)" class="actionItems">沟通详情</el-button>
          <el-button type="text" @click="singleClass(scope.row)" class="actionItems">设班单信息</el-button>
        </template>
      </expandTable>
    </div>
  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'
  import { mapGetters } from 'vuex'
  // import EventBus from '@/eventBus.js'
  export default {
    name: 'rejectLesson',
    components: { expandTable },
    data() {
      return {
        jurisdiction: false,
        columns: [
          { text: '学生姓名', value: 'name' },
          { text: '学生编号', value: 'studentNo' },
          { text: '试听学科', value: 'subjectName' },
          { text: '年级', value: 'subjectGrade', width: 60 },
          { text: '地区', value: 'areaName', width: 70 },
          { text: '当前状态', value: 'statusName' },
          { text: '驳回原因', value: 'suggestion' },
          { text: '处理时间', value: 'operateTime', sortable: 'custom' },
          { text: '申请时间', value: 'applyTime', sortable: 'custom' },
          { text: '下次沟通时间', value: 'nextCommunicationTime', sortable: 'custom', width: 140 },
          { text: '申请人', value: 'applyUser' },
          { text: '处理人', value: 'dealUser' },
          { text: '操作', value: 'operating', width: 115 }
        ],
        slotNameArr: ['suggestion', 'operating'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0'// 一共多少条
        },
        query: {
          applyTime: [],
          nextCommunicationTime: [],
          lastCommunicationTime: [],
          group: '',
          member: '',
          opt: '',
          sequence: '',
          sort: '',
          parentReferral: '', // 家长转介绍学生
          recommendStudent: '' // 我推荐的学生
        },
        loading: false,
        isCanSearch: true,
        options: {
          group: [],
          users: [],
          opt: [
            { key: 'todayTodo', value: '今日待跟进' }
          ]
        },
        showPartQueryObj: {
          btnText: '展开',
          btnIcon: 'el-icon-arrow-down',
          showPartQuery: false
        } // 收缩
      }
    },
    computed: {
      ...mapGetters(['roleCode'])
    },
    created() {
      this.getList()
      this.getGroup()
    },
    watch: {
      'query.group'(val) {
        if (val.length !== 0) {
          this.query.member = ''
          this.getMember()
        } else {
          this.query.member = ''
          this.getGroup()
        }
      }
    },
    methods: {
      // 沟通详情
      changeTableViewSelect(row) {
        if (row.studentIntentionId) {
          this.$eventBus.$emit('show-no-permission-dialog', row.studentIntentionId)
        } else {
          this.$message.error('系统错误！')
        }
      },
      // 设班单信息
      singleClass(row) {
        if (row.studentIntentionId) {
          this.$router.push(`/lessonplanorder/list/${row.studentIntentionId}`)
        } else {
          this.$message.error('系统错误！')
          return
        }
      },
      // 伸缩展开事件
      hidePartQuery() {
        if (this.showPartQueryObj.btnText === '收缩') {
          this.showPartQueryObj.btnText = '展开'
          this.showPartQueryObj.btnIcon = 'el-icon-arrow-down'
        } else {
          this.showPartQueryObj.btnText = '收缩'
          this.showPartQueryObj.btnIcon = 'el-icon-arrow-up'
        }

        this.showPartQueryObj.showPartQuery = !this.showPartQueryObj.showPartQuery
      },
      resetFields() {
        this.$refs['form'].resetFields()
      },
      // group
      getGroup() {
        this.$http.get('search_getMembers').then(res => {
          if (res.data) {
            this.options.group = res.data.deptTree
            this.options.users = res.data.allUser
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
        if (this.roleCode === 'XS-ZY') {
          this.jurisdiction = false
        } else {
          this.jurisdiction = true
        }
      },
      // merber
      getMember() {
        this.$http.post('search_getGroupMember', { group: this.query.group }).then(res => {
          if (res.data) {
            this.options.users = res.data.users
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // list
      postListData(query) {
        return this.$http.post('order_reject', query, { paging: this.paging })
      },
      getList() {
        this.loading = true
        this.isCanSearch = false
        const _query = Object.assign({}, this.query)
        if (_query.nextCommunicationTime === null || _query.nextCommunicationTime.length === 0) {
          _query.nextCommunicationTimeStart = ''
          _query.nextCommunicationTimeEnd = ''
        } else {
          _query.nextCommunicationTimeStart = _query.nextCommunicationTime[0]
          _query.nextCommunicationTimeEnd = _query.nextCommunicationTime[1]
        }
        this.$delete(_query, 'nextCommunicationTime')

        if (_query.applyTime === null || _query.applyTime.length === 0) {
          _query.applyTimeStart = ''
          _query.applyTimeEnd = ''
        } else {
          _query.applyTimeStart = _query.applyTime[0]
          _query.applyTimeEnd = _query.applyTime[1]
        }
        this.$delete(_query, 'applyTime')
        if (_query.lastCommunicationTime === null || _query.lastCommunicationTime.length === 0) {
          _query.lastCommunicationTimeStart = ''
          _query.lastCommunicationTimeEnd = ''
        } else {
          _query.lastCommunicationTimeStart = _query.lastCommunicationTime[0]
          _query.lastCommunicationTimeEnd = _query.lastCommunicationTime[1]
        }
        this.$delete(_query, 'lastCommunicationTime')
        this.postListData(_query).then(res => {
          if (res.data) {
            if (res.data.list.length === 0) {
              this.rows = []
              this.$message.warning('没有符合条件的数据！')
              this.paging.totalRows = '0'
              return false
            }
            this.paging.totalRows = res.data.paging.dataCount
            this.rows = res.data.list
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
          this.isCanSearch = true
        })
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
  .main
    padding: 10px
  .el-radio-group
    vertical-align: initial
    margin-right: 50px
</style>
