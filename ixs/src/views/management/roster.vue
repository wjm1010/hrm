<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <div class="main">
      <el-form label-position="right" ref="form" :model="query" inline>
        <el-form-item prop="level">
          <el-radio-group v-model="query.level">
            <el-radio :label="item" :key="key" v-for="(item, key) in options.level">
              <i v-if="options.level[key] >= 1" class="el-icon-star-on star"></i>
              <i v-if="options.level[key] >= 2" class="el-icon-star-on star"></i>
              <i v-if="options.level[key] >= 3" class="el-icon-star-on star"></i>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="parentReferral" style="margin: 4px 0 0 40px">
          <el-checkbox v-model="query.parentReferral">家长转介绍学生</el-checkbox>
        </el-form-item>
        <el-form-item prop="recommendStudent" style="margin: 4px 0 0 10px">
          <el-checkbox v-model="query.recommendStudent">我推荐的学生</el-checkbox>
        </el-form-item>
        <transition name="fade">
          <el-form-item v-show="!showPartQueryObj.showPartQuery" class="btnCanSearch">
            <el-button type="primary" icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetFields()">重置</el-button>
          </el-form-item>
        </transition><br>
        <transition name="fade">
          <div v-show="showPartQueryObj.showPartQuery">
            <el-form-item prop="create">
              <el-date-picker
                v-model="query.create"
                type="daterange"
                range-separator="至"
                start-placeholder="获取名单日期"
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
            <el-form-item prop="group">
              <el-select v-model="query.group" clearable collapse-tags placeholder="组" filterable>
                <el-option
                  v-for="item in options.group"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="member">
              <el-select v-model="query.member" clearable collapse-tags placeholder="人" filterable>
                <el-option
                  v-for="item in options.users"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="stages">
              <el-select v-model="query.stages" filterable collapse-tags placeholder="阶段">
                <el-option
                  v-for="item in options.stages"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" :disabled="!isCanSearch" @click="getList">查询</el-button>
              <el-button icon="el-icon-refresh" @click="resetFields()">重置</el-button>
            </el-form-item>
          </div>
        </transition>
      </el-form>
      <el-row>
        <el-col :span="23" class="border-top-1px">
          <el-button @click="hidePartQuery" type="primary">{{showPartQueryObj.btnText}}<i
            :class="showPartQueryObj.btnIcon"></i></el-button>
        </el-col>
      </el-row>
      <expandTable
        :loading="loading"
        :pagination="paging"
        @get-list="getList"

        :can-check-all-box="canCheckAllBox"
        @selection-change-event="handleSelectionChange"

        :rows="rows"
        :columns="columns"
        :tableExpandColumns="tableExpandColumns"

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
        <template slot-scope="scope" slot="content">
          <el-popover trigger="hover" placement="top" v-if="scope.row['content'] && scope.row['content'].length>10" width="500">
            <p>{{scope.row['content']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['content'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['content']}}</p>
        </template>
        <template slot-scope="scope" slot="operating">
          <el-button type="text" @click="changeTableViewSelect(scope.row)" class="actionItems">沟通详情</el-button>
        </template>
      </expandTable>
    </div>
    <div v-if="teacherWhite === '1'">
      <el-button type="primary" @click="allotTeacher">分配名单</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      @close="closeDialogEvent"
      title="分配名单"
      custom-class="el-dialog-md">
      <el-form :model="dialogQuery" ref="dialogQuery" :rules="dialogRules" label-width="120px" inline>
        <el-form-item prop="deptTree">
          <el-select
            v-model="dialogQuery.deptTree"
            placeholder="请选择组"
            filterable
            @change="dialogQueryDeptTreeChange"
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
        <el-form-item prop="allUser">
          <el-select v-model="dialogQuery.allUser" placeholder="请选择人员" filterable clearable >
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
  import expandTable from '@/components/ExpandTable'
  // import EventBus from '@/eventBus.js'
  export default {
    name: 'managementRoster',
    components: { expandTable },
    data() {
      return {
        canSearch: true,
        teacherWhite: '1',
        selectedData: [],
        dialogVisible: false,
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
        },
        columns: [
          { text: '标记', value: 'level' },
          { text: '学生姓名', value: 'name' },
          { text: '学生编号', value: 'studentNo' },
          { text: '电话号码', value: 'phone' },
          { text: '获取名单时间', value: 'intoPoolDate' },
          { text: '地区', value: 'areaName' },
          { text: '高考年份', value: 'examYear' },
          { text: '最后沟通时间', value: 'endTime' },
          { text: '最后沟通内容', value: 'content' },
          { text: '阶段', value: 'saleStage2' },
          { text: '跟进人', value: 'userName' },
          { text: '操作', value: 'operating' }
        ],
        tableExpandColumns: [
          { text: '下次沟通时间', value: 'nextCommunicationTime' },
          { text: '沟通数', value: 'communicationTotal' }
        ],
        slotNameArr: ['level', 'operating', 'content'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0'// 一共多少条
        },
        query: {
          create: [],
          lastCommunicationTime: [],
          group: '',
          member: '',
          stages: '', // 销售阶段
          level: '', // 标记
          parentReferral: '', // 家长转介绍学生
          recommendStudent: '' // 我推荐的学生
        },
        loading: false,
        isCanSearch: true,
        options: {
          group: [],
          users: [],
          stages: [],
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
      'canCheckAllBox'() {
        if (this.teacherWhite === '1') {
          return 'yes'
        }
        return ''
      }
    },
    created() {
      this.getGroup()
      this.getStages()
    },
    mounted() {
      this.getList()
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
      handleSelectionChange(row) {
        this.selectedData = row
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
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              this.canSearch = true
            })
          } else {
            this.$message.warning('提交失败')
            return false
          }
        })
      },
      postDialogForm() {
        const ids = []
        this.selectedData.forEach(value => {
          ids.push(value.studentIntentionId)
        })
        return this.$http.post('follow_allotStudentApi', {
          group: this.dialogQuery.deptTree,
          member: this.dialogQuery.allUser,
          studentIntentionId: ids.join()
        })
      },
      dialogQueryDeptTreeChange() {
        this.$set(this.dialogQuery, 'allUser', '')
        this.getDialogGroupMember()
      },
      getDialogGroupMember() {
        this.$http.post('search_getGroupMember', { group: this.dialogQuery.deptTree }).then(res => {
          if (res.data) {
            this.$set(this.dialogOptions, 'allUser', res.data.users)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取人员请求失败，请稍后重试！')
        })
      },
      allotTeacher() {
        if (this.selectedData.length === 0) {
          this.$message.warning('请选择要分配的名单，至少一条！')
        } else {
          this.getGroup()
          this.dialogVisible = true
        }
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
            this.dialogOptions = res.data
            this.dialogOptions.allUser = []
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
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
      // 销售阶段
      getStages() {
        this.$http.get('search_getSaleStage', {}, { cacheTime: 30000 }).then(res => {
          if (res.data) {
            this.options.stages = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // list
      postListData(query) {
        return this.$http.post('users_index', query, { paging: this.paging })
      },
      getList() {
        this.loading = true
        this.isCanSearch = false
        const _query = Object.assign({}, this.query)
        if (_query.create === null || _query.create.length === 0) {
          _query.createStart = ''
          _query.createEnd = ''
        } else {
          _query.createStart = _query.create[0]
          _query.createEnd = _query.create[1]
        }
        this.$delete(_query, 'create')

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
            if (!res.data.list || res.data.list.length === 0) {
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
      changeTableViewSelect(row) {
        if (row.studentIntentionId) {
          this.$eventBus.$emit('show-no-permission-dialog', row.studentIntentionId)
        } else {
          this.$message.error('系统错误！')
        }
      } // 沟通详情
    }
  }
</script>
<style lang="sass">
  .main
    padding: 10px
</style>
