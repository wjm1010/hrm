<template>
  <div class="dashboard-container" v-loading="allLoading">
    <el-form :model="query" :rules="rules" ref="query" label-width="120px" inline>
      <el-form-item label="姓名：" prop="resumeName">
        <el-input v-model="query.resumeName"></el-input>
      </el-form-item>
      <el-form-item label="编号：" prop="resumeId">
        <el-input v-model="query.resumeId" disabled></el-input>
        <i v-if="query.resumeStatusName" class="box-talents">{{query.resumeStatusName}}</i>
      </el-form-item>
      <el-form-item label="岗位性质：" prop="resumeProperty">
        <el-select v-model="query.resumeProperty" placeholder="请选择" clearable  @change="changeResumeProperty">
          <el-option
            v-for="item in options.propery"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="电话：" prop="resumePhone">
        <el-input v-model="query.resumePhone" max="11" @change="checkPhone"></el-input>
      </el-form-item>
      <el-form-item label="QQ：" prop="resumeInfoQQ">
        <el-input v-model="query.resumeInfoQQ"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="resumeInfoEmail">
        <el-input v-model="query.resumeInfoEmail"></el-input>
      </el-form-item><br>
    </el-form>

    <div id="app" class="btn">
      <el-button @click="changeComp('basicInfor')" :autofocus="true">基础信息</el-button>
      <el-button @click="changeComp('RecordCommunication')">沟通记录</el-button>
      <el-button @click="changeComp('interviewPart')" v-if="this.query.resumeProperty==='兼职'">面试记录</el-button>
      <el-button @click="changeComp('Interview')" v-else>面试记录</el-button>
      <el-button @click="changeComp('OfferPart')" v-if="this.query.resumeProperty==='兼职'">offer/培训</el-button>
      <el-button @click="changeComp('Offer')" v-else>offer/培训</el-button>
      <el-button @click="changeComp('OperationLog')">操作日志</el-button>
    </div>


    <keep-alive>
      <component
        ref="childComponent"
        :disabledFirstChannel="!!userId && disabledFirstChannel"
        :disabledSecondChannel="!!userId && disabledSecondChannel"
        :is="currentView"
        :queryObject="query"
        :options="options"
        :userId="userId"
        :GRADE="GRADE"
        :secondChannel="secondChannel"
        @changeGrade="changeGrade"
        @refresh-status="init"
        @resumeId="changeResumeId"
        @changeSubject="changeSubject"
        @changeSecondChannel="changeSecondChannel"
        :path="path"></component>
    </keep-alive>

  </div>
</template>

<script>
import basicInfor from './detail/basicInfor' // 基础信息
import RecordCommunication from './detail/recordCommunication' // 沟通记录
import Interview from './detail/interview' // 面试-全职/实习
import interviewPart from './detail/interviewPart' // 面试-兼职
import Offer from './detail/offer' // offer-全职/实习
import OfferPart from './detail/offerPart' // offer-兼职
import OperationLog from './detail/operationLog' // 操作日志
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'detailPagesIndexAdd',
  data() {
    return {
      disabledFirstChannel: true,
      disabledSecondChannel: true,
      activeName: 'first',
      currentView: 'basicInfor',
      allLoading: false,
      userId: this.$route.path !== '/nominee/add' ? this.$route.params.userId : '',
      path: this.$route.path,
      query: {
        resumeId: '',
        resumeName: '',
        resumeProperty: '',
        resumePhone: '',
        resumeInfoQQ: '',
        resumeInfoEmail: '',
        resumeFirstChannel: '',
        resumeSecondChannel: '',
        resumeSchool: '',
        resumeInfoSpecialty: '',
        resumeInfoFromGrade: '',
        resumeInfoEducation: '',
        resumeTeacherIdent: '',
        resumeTeacherLevel: '',
        resumeGrade: '',
        resumeSubject: '',
        resumeTeachingDept: '',
        resumeInfoWorkPlace: '',
        resumeInfoContractType: '1',
        reumeInfoWorkStyle: '',
      },
      rules: {
        resumeName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        resumeId: [
          { required: true, message: '请输入编号', trigger: 'change' }
        ],
        resumeProperty: [
          { required: true, message: '请选择岗位性质', trigger: 'change' }
        ],
        resumePhone: [
          { required: true, message: '请输入电话', trigger: 'change' }
        ],
        resumeInfoQQ: [
          { required: true, message: '请输入QQ', trigger: 'change' }
        ],
        resumeInfoEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      options: {
        propery: [],
        firstChannel: [],
        education: [],
        teacherIdent: [],
        grade: [],
        teachingDept: [],
        workStyle: [],
        contract: [],
      },
      GRADE: [],
      secondChannel: []
    }
  },
  components: {
    basicInfor,
    RecordCommunication,
    Interview,
    interviewPart,
    OfferPart,
    Offer,
    OperationLog
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['secondaryChannel', 'channelUpdate'])
  },
  methods: {
    ...mapActions([
      'lookSecondChannel'
    ]),
    /**
     * api
    */
    getInfo() {
      return this.$http.post('resume_getOneResume', {
        resumeId: this.userId
      })
    },
    getOptions() {
      return this.$http.post('auth_baseInfoOption')
    },
    /**
     * methods
     */
    changeResumeId(resumeId) {
      this.userId = resumeId
      this.query.resumeId = resumeId
    }, // 获取人员ID
    changeComp(name) {
      if (!this.userId) {
        this.$message.warning('请先完善基础信息！')
        return false
      }
      this.currentView = name
    },
    changeResumeProperty() {
      const obj = {
        '全职': 'fullTime',
        '兼职': 'partTime',
        '实习': 'practTime'
      }
      this.options.level = this.options[obj[this.query.resumeProperty]]
      if (this.currentView === 'basicInfor') {
        this.$refs.childComponent.dealTeacherLevel && this.$refs.childComponent.dealTeacherLevel()
      }
    },
    async changeSubject(params, isFrist) {
      const option = await this.$http.post('auth_setDefaultOption', params, { isFilterUrl: true })
      if (option.data) {
        this.options.teachingDept = option.data
        if (!isFrist) {
          this.query.resumeTeachingDept = option.data[0].teachingDeptId
        }
      }
    },
    async init() {
      const option = await this.getOptions()
      if (option.data) {
        this.options = option.data
        if (this.userId) {
          this.getEditInfo()
        }
      } else {
        this.$router.replace('/401')
      }
    },
    changeSecondChannel() {
      this.query.resumeSecondChannel = ''
      if (this.query.resumeFirstChannel) {
        this.lookSecondChannel({ channelPid: this.query.resumeFirstChannel }).then(() => {
          this.secondChannel = this.secondaryChannel
        })
      } else {
        this.secondChannel = []
      }
    }, // 二级渠道
    changeGrade() {
      this.query.resumeSubject = ''
      if (this.query.resumeGrade) {
        this.GRADE = this.options.grade[this.query.resumeGrade]
      } else {
        this.GRADE = []
      }
    }, // 学科
    getEditInfo() {
      this.allLoading = true
      this.getInfo().then(res => {
        if (res.data) {
          this.query = res.data
          if (this.query.resumeGrade || this.query.resumeFirstChannel) {
            this.GRADE = this.options.grade[this.query.resumeGrade]
            this.lookSecondChannel({ channelPid: this.query.resumeFirstChannel }).then(() => {
              this.secondChannel = this.secondaryChannel
            })
          }
          if (this.query.resumeSubject && this.query.resumeSchool) {
            this.changeSubject({ resumeSubject: this.query.resumeSubject, resumeSchool: this.query.resumeSchool }, 1)
          }
          this.changeResumeProperty()
          if (this.userId) {
            this.disabledFirstChannel = !!this.userId && !!this.query.resumeFirstChannel
            this.disabledSecondChannel = !!this.userId && !!this.query.resumeSecondChannel
            if (this.disabledSecondChannel && !this.disabledFirstChannel) {
              this.disabledFirstChannel = false
              this.disabledSecondChannel = false
            }
          }
          if (+this.channelUpdate) {
            this.disabledFirstChannel = false
            this.disabledSecondChannel = false
          }
          this.query.resumeInfoContractType = this.query.resumeInfoContractType || '1'
        }
      }).catch(console.log).finally(() => {
        this.allLoading = false
      })
    }, // 编辑带入的值
    async checkPhone() {
      if (this.query.resumePhone.length === 11) {
        const res = await this.$http.post('resume_checkPhone', { resumeId: this.query.resumeId, resumePhone: this.query.resumePhone })
        if (res.code === '0x000113') {
          this.$message.error(res.message)
          this.query.resumePhone = ''
        }
      }
    }
  },
}
</script>
<style lang="sass" scoped>
div
  font-size: 14px
  color: #606266
i
  font-style: normal
.el-input
  width: 200px
.width-30
  display: inline-block
  width: 33%
  line-height: 35px
  padding-left: 5%
.box-talents
  display: inline-block
  background: #ff9900
  border-radius: 4px
  font-size: 12px
  padding: 0 7px
  line-height: 25px
  color: #fff
.btn
  margin-top: 20px
  font-size: 0
  margin-left: 20px
  .el-button
    border-radius: 0
    width: 120px
    padding: 9px 0
    border-left: 0
  .el-button:first-child
    border-left: 1px solid #dcdfe6
</style>

