<template>
  <div class="main-bgColor">
    <p class="basic-font">基本信息</p>
    <div class="body-pos">
      <el-form
        :ref="refName"
        :model="query"
        inline
        :rules="rules"
        v-loading="loading">

        <p class="student-info">学生信息</p>
        <el-row>
          <el-col class="width-180">
            <el-form-item label="学生编号">
              <el-input placeholder="学生编号" v-model="query.student_no" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="学生姓名" prop="name">
              <el-input placeholder="姓名" v-model="query.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="出生日期">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="query.birthday"
                type="date"
                placeholder="请选择日期"
                class="date-width">
              </el-date-picker>
            </el-form-item>
            <span
              v-if="query.birthday&&yearConstellation.animal" class="birth-color">
              （{{yearConstellation.animal}} {{yearConstellation.signName}}）
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="width-180">
            <el-form-item label="学生性别" prop="sex">
              <el-select v-model="query.sex" placeholder="请选择">
                <el-option
                  v-for="(item, index) in options.sex"
                  :key="index"
                  :label="item.code"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="意向课程" prop="subject_name">
              <el-select v-model="query.subject_name" multiple collapse-tags placeholder="意向课程">
                <el-option
                  v-for="(item, index) in options.subject_name"
                  :key="index"
                  :label="item.subject_name"
                  :value="item.subject_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所在地区" prop="country_id">
              <el-select
                v-model="query.province_id"
                clearable
                placeholder="省"
                @change="materialProvinceChangeEvent"
                style="width: 140px">
                <el-option
                  v-for="(item, index) in options.provinceIds"
                  :key="index"
                  :label="item.area_name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select
                v-model="query.city_id"
                clearable
                @change="materialCityChangeEvent"
                placeholder="市"
                style="width: 140px">
                <el-option
                  v-for="(item, index) in options.cityIds"
                  :key="index"
                  :label="item.area_name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select
                v-model="query.country_id"
                clearable placeholder="区"
                style="width: 140px">
                <el-option
                  v-for="(item, index) in options.countyIds"
                  :key="index"
                  :label="item.area_name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="text" @click="policyPanoramic" :disabled="!canSearch">政策全景</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        
        <p class="student-info">联络信息
          <span class="message-font">（最多可添加4个）</span> 
        </p>
        <el-row>
          <el-button type="primary" round size="medium" @click="materialPhoneAddEvent" class="btn-addPhone">添加备份手机号</el-button>
          <el-col class="width-180">
            <el-form-item label="主要手机号">
              <el-input v-model="query.phone" placeholder="请输入手机号" v-if="showChangePhone" :disabled="showChangePhone"></el-input>
              <el-input v-model.trim="query.phoneCopy" placeholder="请输入手机号" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-button type="text" class="change-pos" @click="materialChangePhone" v-if="showChangePhone">修改</el-button>
          <el-button type="text" class="change-pos" @click="materiaBtnSavePhoneClick" v-else>保存</el-button>
          <el-col style="width: 130px">
            <el-form-item prop="number_personal" label="称呼">
              <el-select v-model="query.number_personal" clearable placeholder="号码所属人" class="belongTo-width">
                <el-option
                  v-for="(item, index) in options.belongTo"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item prop="parent_relationship" label="备注">
              <el-input v-model.trim="query.parent_relationship" clearable placeholder="手机备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="query.extra_phone.length">
          <el-form-item
            v-for="(item, index) in query.extra_phone"
            :key="index">
            <el-col class="width-180">
              <el-form-item
                label="备用手机号"
                :prop="'extra_phone.' + index"
                :rules="{
                  trigger: 'change' , validator: validatePhoneNumber
                }">
                <el-input
                  v-model.trim="item.extra_phone"
                  placeholder="添加备份手机号" clearable
                  :disabled="Boolean(item.student_extra_message_id)">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col style="width: 130px">
              <el-form-item
                label="称呼"
                :prop="'extra_phone.' + index + '.number_personal'"
                :rules="{
                  required: true, message: '请选择所属人', trigger: 'change'
                }">
                <el-select v-model="item.number_personal" clearable placeholder="号码所属人" class="belongTo-width">
                  <el-option
                    v-for="(item, index) in options.belongTo"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="width: 31%">
              <el-form-item 
              label="备注"
                :prop="'extra_phone.' + index + '.parent_relationship'"
                :rules="{
                  required: true, validator: remarkValidator
                }">
                <el-input
                  v-model.trim="item.parent_relationship"
                  placeholder="手机备注" clearable >
                </el-input>
              </el-form-item>
            </el-col>
            <img
              :src="deleteIcon" alt="" class="img-pos"
              @click="materialPhoneDeleteEvent(index)" v-if="!Boolean(item.student_extra_message_id)">
          </el-form-item><br>
        </el-row>

        <el-row>
          <el-col class="width-180">
            <el-form-item label="邮箱" prop="email">
              <el-input placeholder="请输入邮箱" v-model="query.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="QQ" prop="student_qq">
              <el-input placeholder="请输入QQ" v-model="query.student_qq"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <p class="student-info">其他信息</p>
        <el-row>
          <el-col class="width-180">
            <el-form-item label="上课设备">
              <el-select placeholder="请选择" v-model="query.device_id" clearable filterable>
                <el-option
                  v-for="item in options.getDevice"
                  :key="item.value"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="width-180" v-show="showType">
            <el-form-item 
              label="高考生类型"
              prop="studentExamId">
              <el-select
              v-model="query.studentExamId"
              placeholder="请选择">
                <el-option
                  v-for="(item) in options.studentExamTypes"
                  :key="item.id"
                  :label="item.val"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="推荐人">
              <el-input v-model="query.referral_parent" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="绑定情况">
              <el-input v-model="query.wxBind" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="课程顾问">
              <el-input v-model="query.trackName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="获取时间">
              <el-input v-model="query.trackTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <p class="student-info">目前就读信息
          <span class="message-font">（就读学校根据年级和所在地区显式下拉列表）</span>
        </p>

        <el-row>
          <el-col class="width-180">
            <el-form-item label="年级" prop="grade_id">
              <el-select
              v-model="query.grade_id"
              clearable
              placeholder="请选择"
              @change="examYearCale"
              @clear='clear'>
                <el-option
                  v-for="(item, index) in options.grade"
                  :key="item.index"
                  :label="item"
                  :value="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="高考年份">
              <el-input placeholder="高考年份" v-model="gradeTag" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col class="width-180">
            <el-form-item label="就读学校">
              <el-select
                :allow-create="true"
                v-model="query.present_school_id"
                @change="materialSchoolSituation"
                clearable
                filterable
                remote
                @clear='clearTag'
                @visible-change='visibleChange'
                placeholder="请选择">
                <el-option
                  v-for="(item, index) in options.presentSchool"
                  :key="index"
                  :label="item.school_name"
                  :value="item.school_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-button type="text" v-if="showSchoolSituation" @click="btnSchoolSituation" class="school-situation">学校情况</el-button>
          <span v-if="!showSchoolSituation && showTag" class='base-info-tag'>该学校名可能有误，建议从下拉框中选择。</span>
        </el-row>
      </el-form>
    </div>
    

    <WarningDialog
      v-if="dialog.changeMainPhone.warningMessageBody"
      :body-message="dialog.changeMainPhone.warningMessageBody"
      :is-show.sync="dialog.changeMainPhone.show"
      @yes-event="saveMainPhone">
    </WarningDialog>

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
import WarningDialog from '@/components/dialog/warningDialog.vue'
import { isvalidUsername } from '@/lib/validate'
import { mapGetters } from 'vuex'
import deleteIcon from '../icons/delete.png'
export default {
  components: {
    WarningDialog
  },
  props: {
    query: {
      required: true
    },
    rosterId: {
      required: true
    },
    options: {
      required: true
    },
    studentId: {
      required: true
    },
    gradeRules: {
      required: true
    }
  },
  data() {
    return {
      deleteIcon,
      showChangePhone: true,
      rules: {
        sex: { required: true, message: '请选择性别', trigger: 'change' },
        name: {
          required: true, validator: this.validateName
        },
        student_qq: {
          validator: this.validateQQNumber
        },
        studentExamId: {
          required: true, message: '请选择高考生类型', trigger: 'change'
        },
        email: {
          message: '请输入正确格式', trigger: 'change', type: 'email'
        },
        country_id: {
          required: true, message: '请选择省市区', trigger: 'change'
        },
        grade_id: {
          required: true, message: '请选择年级', trigger: 'change'
        },
        parent_relationship: {
          required: true, validator: this.remarkValidator
        },
        number_personal: {
          required: true, message: '请选择所属人', trigger: 'change'
        },
        subject_name: {
          required: true, message: '请选择意向课程', trigger: 'change'
        }
      },
      showSchoolSituation: false,
      loading: false,
      canSearch: true,
      yearConstellation: {},
      policyPanoramicData: '',
      refName: 'material',
      showTag: false,
      changeTagtext: '',
      presentSchool: [],
      dialog: {
        changeMainPhone: {
          show: false,
          newPhone: '',
          oldPhone: '',
          warningMessageBody: ''
        },
        chosePolicy: {
          show: false
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ]),
    gradeTag() {
      if (!String(this.query.grade_id)) return null

      return `${this.query.exam_year}年`
    },
    showType() {
      if (!String(this.query.grade_id)) return null
      const result = this.checkExamType()
      if (!this.query.studentExamId && result) {
        this.query.studentExamId = this.options.studentExamTypes[0].id || ''
      }
      this.rules.studentExamId.required = result
      return result
    }
  },
  async created() {
    this.query.birthday && this.showYearConstellation(this.query.birthday)
    if (!this.query.city_id) return
    await this.materialGetAreaSchool()
    this.presentSchool = this.options.presentSchool.map(item => item.school_id)
    this.materialSchoolSituation(this.query.present_school_id)
  },
  filters: {
  },
  watch: {
    'query.birthday'(val) {
      if (val) {
        this.showYearConstellation(val)
      }
    },
    'query.city_id'(val) {
      if (val && this.query.province_id !== '') {
        this.materialGetAreaSchool()
      }
    },
    'query.grade_id'(newVal, oldVal) {
      if (this.gradeRules[String(newVal)] !== this.gradeRules[String(oldVal)]) {
        this.changeTagtext = ''
        this.showTag = false
        this.query.present_school_id = ''
      }
    }
  },
  methods: {
    checkExamType() {
      return ['0', '1', '2'].indexOf(String(this.query.grade_id)) > -1
    },
    materialProvinceChangeEvent(id) {
      this.query.city_id = ''
      this.query.country_id = ''
      this.query.present_school_id = ''
      this.options.presentSchool = []
      this.options.cityIds = []
      this.options.countyIds = []
      this.materialSchoolSituation()
      if (id) {
        this.getOptionsOfCity(id)
      }
    },
    // 市
    getStudentGetCity(id) {
      return this.$http.get('student_getCity', {
        params: {
          province_id: id
        },
        isFilterUrl: true
      })
    },
    getOptionsOfCity(id) {
      return this.getStudentGetCity(id).then(res => {
        if (res.data) {
          this.options.cityIds = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('获取市信息失败')
      })
    },
    materialCityChangeEvent(id) {
      this.query.country_id = ''
      this.options.countyIds = []
      this.query.present_school_id = ''
      this.options.presentSchool = []
      this.materialSchoolSituation()
      if (id) {
        this.getOptionsOfArea(id)
      }
    },
    // 区
    getStudentGetArea(id) {
      return this.$http.get('student_getArea', {
        params: {
          city_id: id
        },
        isFilterUrl: true
      })
    },
    getOptionsOfArea(id) {
      return this.getStudentGetArea(id).then(res => {
        if (res.data) {
          this.options.countyIds = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('获取区信息失败')
      })
    },
    materialPhoneAddEvent() {
      if (this.query.extra_phone.length >= 4) {
        return
      }
      this.query.extra_phone.push({
        extra_phone: '', parent_relationship: ''
      })
    },
    // 备用电话验证
    validatePhoneNumber(rule, value, callback) {
      if (!value.student_extra_message_id) {
        if (isvalidUsername(value.extra_phone)) {
          callback()
        } else {
          callback(new Error('请输入正确手机号'))
        }
      } else {
        callback()
      }
    },
    materiaBtnSavePhoneClick() {
      if (!isvalidUsername(this.query.phoneCopy)) {
        return this.$message.error('手机格式错误')
      }
      this.dialog.changeMainPhone.show = true
      this.dialog.changeMainPhone.newPhone = this.query.phoneCopy
      this.dialog.changeMainPhone.warningMessageBody = `确定修改主号 ${this.dialog.changeMainPhone.oldPhone} 为 ${this.dialog.changeMainPhone.newPhone} 吗？`
    },
    // 保存主要手机号
    saveMainPhone() {
      this.$http.get('student_updateExtraPhone', {
        params: {
          studentIntentionId: this.rosterId,
          extraPhone: this.query.phoneCopy
        }
      }).then(res => {
        if (res.data) {
          this.isHaveChange = true
          this.showChangePhone = true
          this.query.phone = this.query.phoneCopy
          this.updateExtraPhone()
        }
      }).catch(console.log)
    },
    // 获取明文次要手机号
    getExtractPhone() {
      return this.$http.get('student_getExtractPhoneList', {
        params: {
          studentIntentionId: this.rosterId
        }
      })
    },
    // 局部更新次要手机号
    async updateExtraPhone() {
      try {
        const { data } = await this.getExtractPhone()
        if (!data) {
          return
        }
        this.query.extra_phone = data
      } catch (e) {
        console.log(e)
      }
    },
    materialChangePhone() {
      if (this.studentId) {
        return this.$message.warning('您已开通账号，不能修改主号')
      }
      if (this.query.extra_phone.length < 4) {
        this.dialog.changeMainPhone.oldPhone = this.query.phone
        this.query.phoneCopy = this.query.phone
        this.showChangePhone = false
      } else {
        this.$message.warning('备用手机号已经达到上限，不能修改主号')
      }
    },
    // 星座
    showYearConstellation(birthday) {
      return this.getYearConstellation(birthday).then(res => {
        if (res.data) {
          this.yearConstellation = res.data
        }
      }).catch(console.log)
    },
    getYearConstellation(birthday) {
      return this.$http.get('student_getConstellation', {
        params: {
          birthday
        }
      })
    },
    // 省市匹配学校
    materialGetAreaSchool() {
      return this.$http.get('student_getPresentSchool', {
        params: {
          provinceId: this.query.province_id,
          cityId: this.query.city_id
        },
        isFilterUrl: true
      }).then(res => {
        if (res.data) {
          this.options.presentSchool = res.data
        }
      }).catch(console.log)
    },
    // 姓名验证
    validateName(rule, value, callback) {
      const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
      const regCn = /[！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (regEn.test(value) || regCn.test(value)) {
        callback(new Error('姓名不可包含特殊符号'))
      } else if (value.length > 10) {
        callback(new Error('姓名过长'))
      } else if (value === '') {
        callback(new Error('请填写姓名'))
      } else {
        callback()
      }
    },
    // qq验证
    validateQQNumber(rule, value, callback) {
      if (value === '' || /^[1-9]\d{4,}$/g.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确QQ'))
      }
    },
    // 手机号备注验证
    remarkValidator(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入备注'))
      } else if (value.length > 45) {
        callback(new Error('最多不可超过45个字'))
      } else {
        callback()
      }
    },
    // 按钮操作
    materialSchoolSituation(val) {
      if (!val) this.showSchoolSituation = false
      if (!('' + this.query.grade_id) || !val) return
      this.getUrl()
    },
    getUrl() {
      var school_type = ''
      var school_name = ''
      if (this.query.grade_id <= 2) {
        school_type = 14
      } else if (this.query.grade_id <= 5) {
        school_type = 13
      } else {
        school_type = 12
      }
      const tF = this.options.presentSchool.some((val) => {
        if (val.school_id === this.query.present_school_id) {
          school_name = val.school_name
          return true
        }
        return false
      })
      if (!tF) {
        school_name = this.query.present_school_id
      }

      this.$http.post('student_getSchoolInfo', {
        provinceId: this.query.province_id,
        cityId: this.query.city_id,
        schoolType: school_type,
        schoolName: school_name
      }, { isFilterUrl: true }).then(res => {
        if (res.data && res.data.id) {
          this.showSchoolSituation = true
        } else {
          this.showSchoolSituation = false
        }
      }).catch(console.log)
    },
    policyPanoramic() {
      this.canSearch = false
      this.$http.get('student_getPolicyPanoramic', {
        params: {
          provinceId: this.query.province_id,
          cityId: this.query.city_id,
          gradeId: this.query.grade_id
        }
      }).then(res => {
        if (res.data && Object.keys(res.data).length) {
          if (Object.keys(res.data).length >= 2 && this.query.grade_id === 6) {
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
    materialPhoneDeleteEvent(index) {
      this.query.extra_phone.splice(index, 1)
    },
    // 埋点
    buriedPoint(info) {
      this.$http.post('student_policyBuried', {
        isBuried: '1',
        pageSourceType: '1',
        actionId: '1',
        studentIntentionId: this.rosterId,
        provinceId: this.query.province_id,
        cityId: this.query.city_id,
        regionId: this.query.country_id,
        innerDetailId: info
      }).catch(console.log)
    },
    btnSchoolSituation() {
      var school_type = ''
      var school_name = ''
      if (this.query.grade_id <= 2) {
        school_type = 14
      } else if (this.query.grade_id <= 5) {
        school_type = 13
      } else {
        school_type = 12
      }
      const tF = this.options.presentSchool.some((val) => {
        if (val.school_id === this.query.present_school_id) {
          school_name = val.school_name
          return true
        }
        return false
      })
      if (!tF) {
        school_name = this.query.present_school_id
      }
      this.$http.post('student_getSchoolInfo', {
        isBuried: '1',
        pageSourceType: '1',
        actionId: '2',
        studentIntentionId: this.rosterId,
        provinceId: this.query.province_id,
        cityId: this.query.city_id,
        regionId: this.query.country_id,
        schoolType: school_type,
        schoolName: school_name
      }, { isFilterUrl: true }).catch(console.log)
      this.$router.push({ path: `/schoolSituation/index/${this.rosterId}`, query: {
        isBuried: '1',
        pageSourceType: '1',
        actionId: '2',
        studentIntentionId: this.rosterId,
        provinceId: this.query.province_id,
        cityId: this.query.city_id,
        regionId: this.query.country_id,
        schoolType: school_type,
        schoolName: school_name
      }})
    },
    examYearCale(id) {
      this.showSchoolSituation = false
      if (id !== '') {
        this.$emit('changeGrage', { label: this.gradeRules[String(this.query.grade_id)] })
        this.$http.get('student_getExamYearByGrade', {
          params: {
            gradeId: id
          }
        }).then(res => {
          if (res.data) {
            this.query.exam_year = res.data.examYear
          } else {
            return
          }
        })
      } else {
        return
      }
      if (!this.query.present_school_id) return
    },
    sendDetails() {
      const info = {
        provinceId: this.query.province_id,
        cityId: this.query.city_id,
        gradeId: this.query.grade_id
      }
      return info
    },
    clear() {
      this.$emit('changeGrage', { label: '' })
    },
    clearTag() {
      this.showTag = false
    },
    visibleChange(val) {
      if (!val) {
        if (this.changeTagtext !== '' && !this.presentSchool.includes(this.changeTagtext)) {
          this.showTag = true
        } else {
          this.showTag = false
        }

        if (!this.presentSchool.includes(this.query.present_school_id)) {
          this.showTag = true
        } else {
          this.showTag = false
        }

        if (this.changeTagtext && !this.query.present_school_id) this.showTag = false
      }
    },
    remoteMethod(val) {
      this.changeTagtext = val
      this.showTag = true
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../styles/student/material/basicInfo.sass'
</style>
