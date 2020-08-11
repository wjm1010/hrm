<template>
  <div class="main-sec">
    <el-dialog
      :visible.sync="schoolRecord.show"
      custom-class="el-dialog-md"
      :append-to-body="true"
      width="50%">
      <p slot="title" style="border-bottom: 1px solid #666; padding-bottom: 5px; margin: 0">
        <b>就读记录</b>
      </p>
      <el-form inline>
        <el-form-item label="录入时间：" style="margin-left: 20px">
          <el-date-picker
            v-model="schoolRecord.enterTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" :disabled="!canSearch" @click="getList">搜索</el-button>
      </el-form>
      <expand-table
        :rows="rows"
        :loading="loading"
        :columns="columns">
      </expand-table>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.chosePolicy.show"
      width="30%"
      center>
      <span style="align: center">请选择具体阶段的 <span style="color: blue">政策全景</span></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jumpPolicy('1')">小升初</el-button>
        <el-button type="primary" @click="jumpPolicy('2')">中考</el-button>
      </span>
    </el-dialog>

     <div class="panel">
    <div class="panel-head border-bottom">
      <img src="../icons/icon-04.png">
      <span>基本信息</span>
    </div>
    <div class="panel-body">
      <div class="panel-item border-bottom">
        <p>学生信息</p>
        <el-row>
          <el-col :span="12" class="row">
            <div class="item-left">学生编号：</div>
            <div class="item-right">
              <span>{{studentInfo.student_no}}</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">性别：</div>
            <div class="item-right">
              <span>{{studentInfo.sex | sexStr }}</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">姓名：</div>
            <div class="item-right">
              <span>{{studentInfo.name }}</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">出生日期：</div>
            <div class="item-right">
              <span>{{studentInfo.birthday}}</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">所在地区：</div>
            <div class="item-right" v-if="studentInfo.area_str">
              <span>{{studentInfo.area_str}}</span>
              <span class="margin-left blue-btn" @click="policyPanoramic" :disabled="!canSearch">政策全景</span>
            </div>
            <div class="item-right" v-else>
              <span>暂无数据</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">意向课程：</div>
            <div class="item-right">
              <span>{{ studentInfo.subject_name | subjectNameStr}}</span>
            </div>
            <el-popover
              placement="top"
              title="意向课程"
              width="400"
              trigger="click">
              <span>{{studentInfo.subject_name | subjectNamePopver}}</span>
              <span v-if="studentInfo.subject_name.length > 0"  class="blue-btn" slot="reference" style="cursor: pointer">更多意向</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div class="panel-item border-bottom">
        <p>联络信息</p>
        <el-row>
          <el-col :span="17" class="row" style="display: flex">
            <div class="item-left">主要手机号：</div>
            <div class="item-right">
              <span class="text sub-phone" v-if="studentInfo.phone" style="display: flex">
                <span>{{studentInfo.number_personal}}</span>
                <span class="phone-hide" @click.once="lookphonelog" style="cursor: pointer">
                  {{plaintextPhone}}
                </span>
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover">
                  <span>{{studentInfo.parent_relationship}}</span>
                  <div slot="reference" v-if="studentInfo.parent_relationship">
                    <span v-if="studentInfo.parent_relationship.length > 8">（{{studentInfo.parent_relationship.slice(0,8)}}...）</span>
                    <span v-else>（{{studentInfo.parent_relationship}}）</span>
                  </div>
                </el-popover>
                <CommitDetailDialog
                  :studentInfo = "studentInfo"
                  :indexInit="indexInit"
                  :fixDialog="fixDialog"
                  :serialNumber="studentInfo.serial_number"
                  :studentIntentionId="studentInfo.student_intention_id"
                  :phoneName="studentInfo.parent_relationship"
                  :phone="studentInfo.phone"
                  :phoneIconStyle = "{height: '20px', width: '20px' }"
                  >
                </CommitDetailDialog>
              </span>
            </div>
          </el-col>
          <el-col :span="7" class="row">
            <div class="item-left">邮箱：</div>
            <div class="item-right">
              <span>{{studentInfo.email}}</span>
            </div>
          </el-col>
          <el-col :span="17" class="row" style="display: flex">
            <div class="item-left">次要手机号：</div>
            <div class="item-right" v-for="(item,index) in studentInfo.extra_phone" :key="index" style="display: flex">
              <span class="sub-phone" v-if="index < 1" style="display: flex">
                <template v-if="item.extra_phone">
                  <span>{{item.number_personal}}</span>
                  <span class="phone-hide" @click.once="clookphonelog(item)">
                    {{item.extra_phone}}
                  </span>
                </template>
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover">
                  <span>{{item.parent_relationship}}</span>
                  <div slot="reference" v-if="item.parent_relationship">
                    <span v-if="item.parent_relationship.length > 8">（{{item.parent_relationship.slice(0,8)}}...）</span>
                    <span v-else>（{{item.parent_relationship}}）</span>
                  </div>
                </el-popover>
                <CommitDetailDialog
                  :studentInfo = "studentInfo"
                  :indexInit="indexInit"
                  :fixDialog="fixDialog"
                  :serialNumber="item.serial_number"
                  :studentIntentionId="studentInfo.student_intention_id"
                  :phoneName="item.parent_relationship"
                  :phone="item.extra_phone"
                  :phoneIconStyle = "{height: '20px', width: '20px' }"
                  style="padding-top: 3px">
                </CommitDetailDialog>
              </span>
              <span v-if="studentInfo.extra_phone.length > 1 && index < 1" class="view-more blue-btn" @click="viewMorePhone">更多</span>
            </div>
          </el-col>
          <el-col :span="7" class="row">
            <div class="item-left">QQ：</div>
            <div class="item-right">
              <span>{{studentInfo.student_qq}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="panel-item border-bottom">
        <p>其他信息</p>
        <el-row>
          <el-col :span="12" class="row">
            <div class="item-left">上课设备：</div>
            <div class="item-right">
              <span>{{studentInfo.pc_action | pcAction}}</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">推荐人：</div>
            <div class="item-right">
              <span class="text" @click="jumptoDetail" >{{studentInfo.referral_parent}}</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">绑定情况：</div>
            <div class="item-right">
              <span>{{wxBind}}</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">报考类型：</div>
            <div class="item-right">
              <span>{{studentInfo.studentExamType}}</span>
            </div>
          </el-col>
          <el-col :span="12" class="row lightyellow">
            <div class="item-left">课程顾问：</div>
            <div class="item-right">
              <span>{{studentInfo.trackName}}</span>
              <span>{{ studentInfo.trackRole ? `( ${studentInfo.trackRole} )` : ""}}</span>
            </div>
          </el-col>
          
        </el-row>
      </div>
      <div class="panel-item">
        <p>目前就读信息</p>
        <el-row>
          <el-col :span="12" class="row">
            <div class="item-left">就读学校：</div>
            <div class="item-right">
              <span>{{studentInfo.present_school}}</span>
              <span class="blue-btn" type="primary" @click="btnSchoolView">学校信息</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">年级：</div>
            <div class="item-right">
              <span>{{studentInfo.grade}}</span>
              <span class="blue-btn" type="primary" @click="btnSchoolRecord">就读记录</span>
            </div>
          </el-col>
          <el-col :span="12" class="row">
            <div class="item-left">高考年份：</div>
            <div class="item-right">
              <span>{{studentInfo.exam_year}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <MorePhone
      v-if="showMorePhone"
      :studentInfo="studentInfo"
      :showView="showMorePhone"
      @close-expand="viewMorePhone"
      :indexInit="indexInit"
      :fixDialog="fixDialog">
    </MorePhone>
  </div>

  </div>
</template>

<script>
  import {
    mapGetters, mapActions
  } from 'vuex'
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'
  import ExpandTable from '@/components/ExpandTable'
  import MorePhone from '../dialog/phoneNum.vue'
  
  export default {
    name: 'detail-basic-info',
    components: {
      CommitDetailDialog,
      ExpandTable,
      MorePhone
    },
    props: {
      studentInfo: {
        required: true
      },
      rosterId: {
        required: true
      },
      indexInit: Function,
      fixDialog: Object,
      wxBind: {
        type: String
      }
    },
    data() {
      return {
        plaintextPhone: '',
        schoolRecord: {
          show: false,
          enterTime: []
        },
        canSearch: true,
        loading: false,
        columns: [
          { 'value': 'attendSchool', 'text': '学校名称' },
          { 'value': 'date', 'text': '录入时间' }
        ],
        rows: [],
        showMorePhone: false,
        policyPanoramicData: '',
        dialog: {
          chosePolicy: {
            show: false
          }
        }
      }
    },
    computed: {
      ...mapGetters(['userId', 'name', 'getPhone', 'studentId'])
    },
    filters: {
      sexStr(val) {
        if (val === '1') {
          return '男'
        } else if (val === '2') {
          return '女'
        }
      },
      getMonth(val) {
        return new Date(val).getMonth() + 1
      },
      getDate(val) {
        return new Date(val).getDate()
      },
      subjectNameStr(val) {
        var str = ''
        if (val.length) {
          val.forEach((val, index) => {
            if (index < 2) {
              str = `${str}${val.subject_name}; `
            }
          })
          return str
        }
        return ''
      },
      subjectNamePopver(val) {
        var str = ''
        if (val.length) {
          val.forEach((val, index) => {
            str = `${str}${val.subject_name}; `
          })
          return str
        }
        return ''
      },
      pcAction(num) {
        var str = ''
        switch (num) {
          case '0':
            str = '空'
            break
          case '1':
            str = '无设备'
            break
          case '2':
            str = '台式机'
            break
          case '3':
            str = '笔记本'
            break
          case '4':
            str = 'iPad'
            break
        }
        return str
      }
    },
    mounted() {
      this.studentInfos()
    },
    methods: {
      ...mapActions([
        'lookPhoneLog'
      ]),
      studentInfos() {
        this.$set(this, 'plaintextPhone', this.studentInfo.phone)
      },
      jumptoDetail() {
        const { referralStudentIntentionId } = this.studentInfo
        if (referralStudentIntentionId) {
          this.$eventBus.$emit('show-no-permission-dialog', referralStudentIntentionId)
        }
      },
      lookphonelog() {
        const userInfo = {
          'studentIntentionId': this.studentInfo.student_intention_id,
          'studentName': this.studentInfo.name,
          'userId': this.userId,
          'userName': this.name,
          'studentExtraMessageId': this.studentInfo.student_extra_message_id
        }
        this.lookPhoneLog(userInfo).then(() => {
          this.$set(this, 'plaintextPhone', this.getPhone)
        }).catch(console.log)
      },
      clookphonelog(item) {
        const userInfo = {
          'studentIntentionId': this.studentInfo.student_intention_id,
          'studentName': this.studentInfo.name,
          'userId': this.userId,
          'userName': this.name,
          'studentExtraMessageId': item.student_extra_message_id
        }
        this.lookPhoneLog(userInfo).then(() => {
          item.extra_phone = this.getPhone
        }).catch(console.log)
      },
      getList() {
        this.loading = true
        this.canSearch = false
        const _query = Object.assign({}, this.schoolRecord)
        if (_query.enterTime === null || _query.enterTime.length === 0) {
          _query.startTime = ''
          _query.endTime = ''
        } else {
          _query.startTime = _query.enterTime[0]
          _query.endTime = _query.enterTime[1]
        }
        _query.studentIntentionId = this.rosterId
        this.$delete(_query, 'enterTime')
        this.$delete(_query, 'show')
        this.$http.get('student_attendSchoolLog', {
          params: _query
        }).then(res => {
          if (res.data) {
            if (res.data.list.length === 0) {
              this.rows = []
              return
            }
            this.rows = res.data.list
          }
        }).catch(console.log).finally(() => {
          this.loading = false
          this.canSearch = true
        })
      },
      btnSchoolRecord() {
        this.schoolRecord.show = true
        this.getList()
      },
      btnSchoolView() {
        var school_type = ''
        if (this.studentInfo.grade_id <= 2) {
          school_type = 14
        } else if (this.studentInfo.grade_id <= 5) {
          school_type = 13
        } else {
          school_type = 12
        }
        this.$http.post('student_getSchoolInfo', {
          isBuried: '1',
          pageSourceType: '2',
          actionId: '2',
          studentIntentionId: this.rosterId,
          provinceId: this.studentInfo.province_id,
          cityId: this.studentInfo.city_id,
          regionId: this.studentInfo.country_id,
          schoolType: school_type,
          schoolName: this.studentInfo.present_school
        }, { isFilterUrl: true }).then(res => {
          if (res.data && res.data.length !== 0) {
            this.$router.push({ path: `/schoolSituation/index/${this.studentInfo.present_school}`,
              query: {
                isBuried: '1',
                pageSourceType: '2',
                actionId: '2',
                studentIntentionId: this.rosterId,
                provinceId: this.studentInfo.province_id,
                cityId: this.studentInfo.city_id,
                regionId: this.studentInfo.country_id,
                schoolType: school_type,
                schoolName: this.studentInfo.present_school
              }})
          } else {
            this.$message.warning('暂无信息')
          }
        }).catch(console.log)
      },
      policyPanoramic() {
        this.canSearch = false
        this.$http.get('student_getPolicyPanoramic', {
          params: {
            provinceId: this.studentInfo.province_id,
            cityId: this.studentInfo.city_id,
            gradeId: this.studentInfo.grade_id
          }
        }).then(res => {
          if (res.data && Object.keys(res.data).length) {
            if (Object.keys(res.data).length >= 2 && this.studentInfo.grade_id === '6') {
              this.policyPanoramicData = res.data
              this.dialog.chosePolicy.show = true
            } else {
              this.buriedPoint(Object.values(res.data)[0].id)
              window.open(Object.values(res.data)[0].pdf_url)
            }
          } else {
            const info = ''
            this.buriedPoint(info)
            this.$message.warning('暂无数据')
          }
        }).catch(console.log).finally(() => {
          this.canSearch = true
        })
      },
      jumpPolicy(index) {
        this.buriedPoint(this.policyPanoramicData[index].id)
        this.dialog.chosePolicy.show = false
        window.open(this.policyPanoramicData[index].pdf_url)
      },
      // 埋点
      buriedPoint(info) {
        this.$http.post('student_policyBuried', {
          isBuried: '1',
          pageSourceType: '2',
          actionId: '1',
          studentIntentionId: this.rosterId,
          provinceId: this.studentInfo.province_id,
          cityId: this.studentInfo.city_id,
          regionId: this.studentInfo.country_id,
          innerDetailId: info
        }).catch(console.log)
      },
      // 查看更多次要手机号
      viewMorePhone() {
        this.showMorePhone = !this.showMorePhone
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/student/detail/basicInfo.sass'
</style>
