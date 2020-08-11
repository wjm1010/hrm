<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <h3 style="color: #525E71">基本信息</h3>
    <el-row class="body">
      <ul class="body-row">
        <li class="body-column width-25">
          <span class="label">出生日期：</span>
          <span class="text">
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
        <li class="body-column width-25">
          <span class="label">主要手机号：</span>
          <span class="text" v-if="studentInfo.phone">
            <span class="phone-hide" @click.once="lookphonelog">
              {{plaintextPhone}}
            </span>
            <span v-if="studentInfo.relationship">
                （{{studentInfo.relationship}}）
            </span>
            <el-button
              circle
              @click="postCallIndex(studentInfo.phone, studentInfo.serial_number)"
              style="border: 0; padding: 0"
              :disabled="!canClickImg">
              <img :src="phoneIcon" alt="">
            </el-button>
          </span>
        </li>
        <li class="body-column width-80">
          <span class="label">次要手机号：</span>
          <span class="text">
            <span v-for="(item,index) in studentInfo.extra_phone" :key="index">
              <template v-if="item.extra_phone">
                <span class="phone-hide" @click.once="clookphonelog(item)">
                  {{item.extra_phone}}
                </span>
              </template>
              <span v-if="item.parent_relationship">（{{item.parent_relationship}}）</span>
                <el-button
                  circle
                  @click="postCallIndex(item.extra_phone, item.serial_number)"
                  style="border: 0; padding: 0"
                  :disabled="!canClickImg">
                  <img :src="phoneIcon" alt="">
                </el-button>
                &nbsp;&nbsp;&nbsp;&nbsp;
              </span>
          </span>
        </li>
      </ul>

      <ul class="body-row">
        <li class="body-column width-25">
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
        <li class="body-column width-25">
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
        <li class="body-column width-25">
          <span class="label">重复进线：</span><span class="text">{{studentInfo.submit_prop}}</span>
        </li>
        <li class="body-column width-33">
          <span class="label">是否试听课：</span>
          <span class="text" v-if="studentInfo.isHaveAuditionsLesson === '0'">否</span>
          <span class="text" v-else>是
            <i style="font-style: normal;cursor: pointer;font-weight: normal;margin-left:50px" @click="btnHistory">历史试听记录>></i>
          </span>
        </li>
        <li class="body-column width-other">
          <span class="label">学生状态：</span>
          <span class="text" :class="{'color-red':studentInfo.curriculum_status_name === '已结课'}">
            <span>{{studentInfo.career_status_name}}</span>
            <span v-if="studentInfo.curriculum_status_name">，{{studentInfo.curriculum_status_name}}</span>
          </span>
        </li>
      </ul>
    </el-row>
<!-- 就读记录 -->
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
<!-- 政策全景 -->
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
<!-- 试听记录 -->
    <el-dialog
      :visible.sync="historyShow"
      custom-class="el-dialog-md"
      :append-to-body="true"
      width="50%">
      <p slot="title" style="border-bottom: 1px solid #666; padding-bottom: 5px; margin: 0">
        <b>试听记录</b>
      </p>
      <expand-table
        :rows="historyRows"
        :loading="loading"
        :columns="historyColumns"
        :slotNameArr="['operating']">
          <template slot-scope="scope" slot="operating">
            <el-button type="text" class="actionItems" v-if="scope.row.download_url">
              <a :href="scope.row.download_url" target="_blank">查看</a>
            </el-button>
            <el-button type="text" v-else>
              <span style="color: #979090;">暂无</span>
            </el-button>
          </template>
      </expand-table>
    </el-dialog>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import phoneIcon from '@/assets/detail_images/phone.png'
  import ExpandTable from '@/components/ExpandTable'
  export default {
    name: 'detail-basic-info',
    data() {
      return {
        phoneIcon,
        plaintextPhone: '',
        canClickImg: false,
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
        historyRows: [],
        historyColumns: [
          { 'value': 'realStartTime', 'text': '试听时间' },
          { 'value': 'subjectName', 'text': '试听学科' },
          { 'value': 'teacherName', 'text': '上课老师' },
          { 'value': 'status', 'text': '课程状态' },
          { 'value': 'operating', 'text': '试听诊断报告' }
        ],
        historyShow: false,
        policyPanoramicData: '',
        dialog: {
          chosePolicy: {
            show: false
          }
        }
      }
    },
    components: {
      ExpandTable
    },
    computed: {
      ...mapGetters(['studentInfo', 'userId', 'rosterId', 'departmentId', 'roleId', 'roleCode', 'name', 'getPhone'])
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
        if (val && val.length) {
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
    created() {
      this.$eventBus.$on('start-callPhone', val => {
        this.canClickImg = val
      })
    },
    methods: {
      ...mapActions([
        'lookPhoneLog'
      ]),
      // 坐席外呼
      postCallIndex(phoneNum, serialNumberData) {
        this.$http.post('recycle_callOut', {
          businessUid: this.userId,
          departmentId: this.departmentId,
          roleCode: this.roleCode,
          roleId: this.roleId,
          studentIntentionId: this.rosterId ? this.rosterId : '',
          serialNumber: serialNumberData,
          teacherId: '',
          callType: '1'
        }, { disableTime: 5 }).then(({ data, code } = {}) => {
          if (!data) return (this.$eventBus.$emit('start-callPhone', true))
  
          const talkData = {
            cno: data.cno,
            callId: data.call_id,
            studentIntentionId: this.rosterId,
            haveWordsRecommended: false
          }
          localStorage.setItem('CALL_TALK_MESSAGE', JSON.stringify(talkData))
          this.$eventBus.$emit('beginToConnect', true)
  
          this.$emit('show-dialogCommunicationRecord', data)
        }).catch(console.log)
      },
      specialCode() {
        this.$http.get('recycle_isDistributionSale', {
          params: {
            communicationSituation: 6,
            cmtContent: '号码错误',
            nextTime: true,
            repeat: false,
            communicationTools: '1',
            knowOrigin: this.studentInfo.know_origin,
            coilIn: this.studentInfo.coil_in,
            studentIntentionId: this.rosterId,
            callId: '0',
            departmentId: this.departmentId,
            relateUserId: this.userId
          },
          isNoMessage: true
        })
      },
      studentInfos() {
        this.plaintextPhone = this.studentInfo.phone
      },
      lookphonelog() {
        if (!(this.studentInfo.track_userid === this.userId)) {
          return
        }
        const userInfo = {
          'studentIntentionId': this.rosterId,
          'studentName': this.studentInfo.name,
          'userId': this.userId,
          'userName': this.name,
          'studentExtraMessageId': this.studentInfo.student_extra_message_id
        }
        this.lookPhoneLog(userInfo).then(() => {
          this.plaintextPhone = this.getPhone
        }).catch(console.log)
      },
      clookphonelog(item) {
        if (!(this.studentInfo.track_userid === this.userId)) {
          return
        }
        const userInfo = {
          'studentIntentionId': this.rosterId,
          'studentName': this.studentInfo.name,
          'userId': this.userId,
          'userName': this.name,
          'studentExtraMessageId': item.student_extra_message_id
        }
        this.lookPhoneLog(userInfo).then(() => {
          item.extra_phone = this.getPhone
        }).catch(console.log)
      },
      // 点击就读学校
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
      // 就读记录
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
      // 历史试听记录
      btnHistory() {
        this.historyShow = true
        this.loading = true
        this.$http.get('recycle_auditionsLessonLog', {
          params: { studentIntentionId: this.rosterId }
        }).then(res => {
          if (res.data) {
            if (res.data.length === 0) {
              this.historyRows = []
              return
            }
            this.historyRows = res.data
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      },
      // 政策全景
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
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/accessList/detail/basicInfo.sass'
</style>
