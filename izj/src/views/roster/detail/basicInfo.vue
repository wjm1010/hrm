<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <h3 style="color: #525E71">基本信息</h3>
    <el-row class="body">
      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">姓名：</span>
          <span class="text">
            {{studentInfo.name}}
          </span>
          <span class="label" style="margin-left: 20px">出生日期：</span>
          <span class="text" v-if="studentInfo.birthday !==''">
            {{studentInfo.birthday}}
          </span>
        </li>
        <li class="body-column width-33">
          <span class="label">学生性别：</span>
          <span class="text">
            {{studentInfo.sex | sexStr }}
          </span>
        </li>
        <li class="body-column width-other">
          <span class="label">意向课程：</span><span class="text">{{studentInfo.subject_name | subjectNameStr}}</span>
        </li>
      </ul>

      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">主要手机号：</span>
          <span class="text" v-if="studentInfo.phone">
            <span>{{studentInfo.number_personal}}</span>
            <span class="phone-hide" @click.once="lookphonelog" style="cursor: pointer">
              {{plaintextPhone}}
            </span>
            <span v-if="studentInfo.parent_relationship">
                （{{studentInfo.parent_relationship}}）
            </span>
            <CommitDetailDialog
              :studentInfo = "studentInfo"
              :indexInit="indexInit"
              :fixDialog="fixDialog"
              :serialNumber="studentInfo.serial_number"
              :studentIntentionId="studentInfo.student_intention_id"
              :phoneName="studentInfo.parent_relationship"
              :phone="studentInfo.phone"
              :showDialog="showDialog">
            </CommitDetailDialog>
          </span>
        </li>
        <li class="body-column width-33">
          <span class="label">次要手机号：</span>
          <span class="text">
            <span v-for="(item,index) in studentInfo.extra_phone" :key="index">
                <template v-if="item.extra_phone">
                  <span>{{item.number_personal}}</span>
                  <span class="phone-hide" @click.once="clookphonelog(item)">
                    {{item.extra_phone}}
                  </span>
                </template>
                <span v-if="item.parent_relationship">（{{item.parent_relationship}}）</span>
                <CommitDetailDialog
                  :studentInfo = "studentInfo"
                  :indexInit="indexInit"
                  :fixDialog="fixDialog"
                  :serialNumber="item.serial_number"
                  :studentIntentionId="studentInfo.student_intention_id"
                  :phoneName="item.parent_relationship"
                  :phone="item.extra_phone"
                  :showDialog="showDialog">
                </CommitDetailDialog>
              </span>
          </span>
        </li>
      </ul>

      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">QQ：</span><span class="text">{{studentInfo.student_qq}}</span>
        </li>
        <li class="body-column width-33">
          <span class="label">邮箱：</span><span class="text">{{studentInfo.email}}</span>
        </li>
        <li class="body-column width-other">
          <span class="label">上课设备：</span><span class="text">{{studentInfo.pc_action | pcAction}}</span>
        </li>
      </ul>

      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">在读年级(高考年份)：</span><span class="text">{{studentInfo.grade}}（{{studentInfo.exam_year}}）</span>
        </li>
        <li class="body-column width-33">
          <span class="label">所在地区：</span><span class="text">{{studentInfo.area_str}}</span>
          <el-button type="primary" class="margin-left" @click="policyPanoramic" :disabled="!canSearch">政策全景</el-button>
        </li>
         <li class="body-column width-other">
          <span class="label">就读学校：</span><el-button type="text" @click="btnSchoolView">{{studentInfo.present_school}}</el-button>
          <el-button class="margin-left" type="primary" plain @click="btnSchoolRecord">就读记录</el-button>
        </li>
      </ul>
      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">转介绍推荐人：</span><span class="text" style="cursor:pointer" @click="jumptoDetail">{{studentInfo.referral_parent}}</span>
        </li>
        <li class="body-column width-33 border-right-none">
          <span class="label">高考生类型：</span><span class="text">{{studentInfo.studentExamType}}</span>
        </li>
      </ul>
      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">“海风教育”绑定情况：</span>
          <span :class="{'gray': wxBind.educationStudentStatus === '0','text':wxBind.educationStudentStatus === '1'}">{{wxBind.educationStudentText}},</span>
          <span :class="{'gray': wxBind.educationParentStatus === '0','text':wxBind.educationParentStatus === '1'}">{{wxBind.educationParentText}}</span>
        </li>
        <li class="body-column width-33 border-right-none">
          <span class="label">“海风家委会”下载情况：</span>
          <span :class="{'gray': wxBind.committeeStatus === '0','text':wxBind.committeeStatus === '1'}">{{wxBind.committeeText}}</span>
        </li>
      </ul>
    </el-row>

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
  </div>
</template>

<script>
  import {
    mapGetters, mapActions
  } from 'vuex'
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'
  import ExpandTable from '@/components/ExpandTable'
  export default {
    name: 'detail-basic-info',
    components: {
      CommitDetailDialog,
      ExpandTable
    },
    props: {
      studentInfo: {
        required: true
      },
      rosterId: {
        required: true
      },
      showDialog: {
        required: true
      },
      wxBind: {
        required: true,
        type: Object,
      },
      indexInit: Function,
      fixDialog: Object
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
        policyPanoramicData: '',
        dialog: {
          chosePolicy: {
            show: false
          }
        }
      }
    },
    computed: {
      ...mapGetters(['userId', 'name', 'getPhone', 'studentId']),
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
          val.forEach(val => {
            str = `${str}${val.subject_name}；`
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
      jumptoDetail() {
        const { referralStudentIntentionId } = this.studentInfo
        if (referralStudentIntentionId) {
          this.$eventBus.$emit('show-no-permission-dialog', referralStudentIntentionId)
        }
      },
      studentInfos() {
        this.$set(this, 'plaintextPhone', this.studentInfo.phone)
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
        _query.studentIntentionId = this.$route.params.rosterId
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
          regionId: this.studentInfo.country_id,
          provinceId: this.studentInfo.province_id,
          cityId: this.studentInfo.city_id,
          schoolType: school_type,
          schoolName: this.studentInfo.present_school
        }, { isFilterUrl: true }).then(res => {
          if (res.data && res.data.id) {
            this.$router.push({ path: `/schoolSituation/index/${this.studentInfo.present_school}`,
              query: {
                isBuried: '1',
                pageSourceType: '2',
                actionId: '2',
                regionId: this.studentInfo.country_id,
                studentIntentionId: this.rosterId,
                provinceId: this.studentInfo.province_id,
                cityId: this.studentInfo.city_id,
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
            studentIntentionId: this.rosterId,
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
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/basicInfo.sass'
</style>
