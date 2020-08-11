<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <div class="main">
      <el-form label-position="right" label-width="120px" ref="form" :model="query" inline>
        <el-form-item prop="level">
          <el-radio-group v-model="query.level">
            <el-radio :label="item" :key="key" v-for="(item, key) in options.level">
              <i v-if="options.level[key] >= 1" class="el-icon-star-on star"></i>
              <i v-if="options.level[key] >= 2" class="el-icon-star-on star"></i>
              <i v-if="options.level[key] >= 3" class="el-icon-star-on star"></i>
            </el-radio>
          </el-radio-group>
        </el-form-item>
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
        </el-form-item>
        <!--<transition name="fade">-->
          <!--<el-form-item v-show="!showPartQueryObj.showPartQuery">-->
            <!--<el-button type="primary" icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>-->
            <!--<el-button icon="el-icon-refresh" @click="resetFields()">重置</el-button>-->
          <!--</el-form-item>-->
        <!--</transition>-->
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
            <el-form-item prop="intentionBigType">
              <el-select v-model="query.intentionBigType" filterable collapse-tags placeholder="意向课程" clearable>
                <el-option
                  v-for="item in options.intentionBigTypes"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="communicationTimesBegin">
              <el-input
                class="el-input-reset"
                size="small"
                clearable
                placeholder="沟通数下限"
                suffix-icon="el-icon-number"
                v-model="query.communicationTimesBegin">
              </el-input>
            </el-form-item>
            <span style="line-height: 30px; margin-right: 6px">-</span>
            <el-form-item prop="communicationTimesEnd">
              <el-input
                class="el-input-reset"
                size="small"
                clearable
                placeholder="沟通数上限"
                suffix-icon="el-icon-number"
                v-model="query.communicationTimesEnd">
              </el-input>
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
      <el-button type="primary" round @click="clearCheckStar" class="clear-mark">清空星标</el-button>
      <expandTable
        :loading="loading"
        :pagination="paging"
        @get-list="getList"
        @change-table-sort="changeTableSort"

        checkboxValidateRowName="allowMark"
        :can-check-all-box="canCheckAllBox"
        @selection-change-event="handleSelectionChange"

        :rows="rows"
        :columns="columns"
        :slotNameArr="slotNameArr">
        <template slot-scope="scope" slot="level">
          <el-rate
            v-model="scope.row['level']"
            text-color="#ff9900"
            :max="3"
            :disabled="scope.row['allowMark']"
            @change="changeLevel(scope.row)"
            score-template="{value}">
          </el-rate>
        </template>
        <template slot-scope="scope" slot="operating">
          <el-button type="text" @click="changeTableViewSelect(scope.row)" class="actionItems">沟通详情</el-button>
        </template>
        <template slot-scope="scope" slot="content">
          <el-popover trigger="hover" placement="top" v-if="scope.row['content'] && scope.row['content'].length>10" width="500">
            <p>{{scope.row['content']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['content'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['content']}}</p>
        </template>
      </expandTable>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import expandTable from '@/components/ExpandTable'
  // import EventBus from '@/eventBus.js'
  export default {
    name: 'followingUpTasks',
    components: { expandTable },
    data() {
      return {
        jurisdiction: false,
        columns: [
          { text: '标记', value: 'level' },
          { text: '学生姓名', value: 'name' },
          { text: '学生编号', value: 'studentNo' },
          { text: '电话号码', value: 'phone' },
          { text: '意向课程', value: 'versionName' },
          { text: '地区', value: 'areaName' },
          { text: '高考年份', value: 'examYear' },
          { text: '沟通数', value: 'communicationTotal' },
          { text: '最后沟通内容', value: 'content' },
          { text: '最后沟通时间', value: 'endTime', sortable: 'custom' },
          { text: '下次沟通时间', value: 'nextCommunicationTime', sortable: 'custom' },
          { text: '跟进人', value: 'userName' },
          { text: '操作', value: 'operating' }
        ],
        slotNameArr: ['operating', 'level', 'content'],
        rows: [],
        canCheckAllBox: 'yes', // 全选框
        selectedData: [], // 选中框数组
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0'// 一共多少条
        },
        query: {
          nextCommunicationTime: [],
          lastCommunicationTime: [],
          communicationTimesBegin: '',
          communicationTimesEnd: '',
          group: '',
          member: '',
          opt: '',
          intentionBigType: '', // 意向课程
          level: '', // 标记
          sequence: '',
          sort: '',
          parentReferral: '', // 家长转介绍学生
          recommendStudent: '', // 我推荐的学生
        },
        loading: false,
        isCanSearch: true,
        options: {
          group: [],
          users: [],
          opt: [
            { key: 'todayToDo', value: '今日待跟进' },
            { key: 'yesterdayToDo', value: '已约未跟进' },
            { key: 'threedayToDo', value: '3日未跟进' }
          ],
          intentionBigTypes: [],
          level: ['3', '2', '1']
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
      this.getLesson()
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
      // 小星星
      changeLevel(row) {
        this.$http.post('follow_addMark', {
          studentIntentionId: row.studentIntentionId,
          level: row.level.toString()
        }).then(res => {
          if (!res.data) {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 沟通详情
      changeTableViewSelect(row) {
        if (row.studentIntentionId) {
          this.$eventBus.$emit('show-no-permission-dialog', row.studentIntentionId)
        } else {
          this.$message.error('系统错误！')
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
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 意向课程
      getLesson() {
        this.$http.get('search_getLesson', {}, { cacheTime: 30000 }).then(res => {
          if (res.data) {
            this.options.intentionBigTypes = res.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // list
      postListData(query) {
        return this.$http.post('follow_now', query, { paging: this.paging })
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
              this.paging.totalRows = '0'
              return false
            }
            this.paging.totalRows = res.data.paging.dataCount
            this.rows = res.data.list.map(function(val) {
              val.level = +val.level
              return val
            })
            res.data.list.forEach(val => {
              if (val.allowMark === '1') {
                val.allowMark = false
              } else {
                val.allowMark = true
              }
            })
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
          this.isCanSearch = true
        })
      },
      handleSelectionChange(row) {
        this.selectedData = row
      },
      // 清空选中星星
      clearCheckStar() {
        if (this.selectedData.length === 0) {
          this.$message.warning('请选择要清空的标记，至少一条')
        } else {
          const idArray = []
          this.selectedData.map(val => {
            if (val.allowMark === false) {
              val.level = 0
              idArray.push(val.studentIntentionId)
            }
          })
          this.$http.post('follow_cancelMark', {
            studentIntentionIds: idArray
          }).catch(console.log)
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
<style lang="sass" scoped>
@import '../../styles/tasks/followingUpTasks.sass'
</style>
