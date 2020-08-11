<template>
  <div>
    <el-dialog
      :visible="show"
      custom-class="el-dialog-md"
      :append-to-body="true"
      @close="closeDialog"
      class="dialog-material">
      <p slot="title" class="dialog-title">
        <b>编辑并完善<span class="color-blue">{{studentInfo.name}}</span>的基本资料</b>
      </p>
      <el-form
        :model="query"
        :ref="refName"
        :rules="rules"
        v-loading="loading"
        label-width="120px">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model.trim="query.name" class="width-70"></el-input>
          <el-radio-group v-model="query.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="主号：">
          <el-col :span="9">
            <el-form-item>
              <el-input v-model="query.phone" :disabled="showChangePhone" v-if="showChangePhone"></el-input>
              <el-input v-model.trim="query.phoneCopy" v-else></el-input>            
              <el-button type="text" v-if="showChangePhone" @click="materialChangePhone" class="change-pos">修改</el-button>
              <el-button type="text" v-else @click="materiaBtnSavePhoneClick" class="change-pos">保存</el-button>
            </el-form-item>             
          </el-col>
          <el-col class="width-25">
            <el-form-item prop="parent_relationship">
              <el-input v-model.trim="query.parent_relationship" clearable placeholder="手机备注"></el-input>
            </el-form-item>
          </el-col>        
          <el-col class="width-25">
            <el-form-item prop="number_personal">
              <el-select v-model="query.number_personal" clearable placeholder="号码所属人">
                <el-option
                  v-for="(item, index) in options.belongTo"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>            
        </el-form-item>

        <el-form-item label="年级：" prop="grade_id">
          <el-select v-model="query.grade_id" clearable filterable class="width-70">
            <el-option
              v-for="(item, index) in options.grade"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
          <div class="color-red warn-message" style="left: 212px">高考年份：{{query.exam_year}}</div>
        </el-form-item>
        <el-form-item label="意向课程：">
          <div
            v-for="(item, index) in query.subject_name"
            :key="index"
            :class="{'display-block':index !== 0}">
            <el-select
              v-model="item.subject_name"
              disabled
              class="course-select">
              <el-option
                v-for="(item2,index2) in options.subject_name"
                :key="index2"
                :label="item2.subject_name"
                :value="item2.subject_id">
              </el-option>
            </el-select>
            <el-button
              type="text"
              class="color-red"
              v-if="item.canChange === '1'"
              @click="materialCourseDeleteEvent(index)"><i class="el-icon-close"></i>删除
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="所在区域" prop="country_id">
          <el-select
            clearable
            filterable
            @change="materialProvinceChangeEvent"
            class="course-select-small"
            v-model="query.province_id"
            placeholder="省">
            <el-option
              v-for="(item,index) in options.provinceIds"
              :key="index"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            clearable
            filterable
            class="course-select-small"
            @change="materialCityChangeEvent"
            v-model="query.city_id"
            placeholder="市">
            <el-option
              v-for="(item,index) in options.cityIds"
              :key="index"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            clearable
            filterable
            class="course-select-small"
            v-model="query.country_id"
            placeholder="区">
            <el-option
              v-for="(item,index) in options.countyIds"
              :key="index"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="就读学校">
          <el-select
            :allow-create="true"
            clearable
            filterable
            class="width-35"
            v-model.trim="query.present_school_id"
            placeholder="选择就读学校">
            <el-option
              v-for="(item,index) in options.presentSchool"
              :key="index"
              :label="item.school_name"
              :value="item.school_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标学校">
          <el-select
            clearable
            filterable
            @change="materialGoalProvinceChangeEvent"
            class="course-select-small"
            v-model.trim="query.goal_province_id"
            placeholder="省">
            <el-option
              v-for="(item,index) in options.goalProvinceIds"
              :key="index"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            clearable
            filterable
            class="course-select-small"
            @change="materialGoalCityChangeEvent"
            v-model="query.goal_city_id"
            placeholder="市">
            <el-option
              v-for="(item,index) in options.goalCityIds"
              :key="index"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            clearable
            filterable
            class="course-select-small"
            v-model="query.goal_country_id"
            placeholder="区">
            <el-option
              v-for="(item,index) in options.goalCountyIds"
              :key="index"
              :label="item.area_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            :allow-create="true"
            clearable
            filterable
            class="width-35"
            v-model="query.goal_school_id"
            placeholder="学校名称">
            <el-option
              v-for="(item,index) in options.goalSchoolName"
              :key="index"
              :label="item.school_name"
              :value="item.school_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="student_qq" label="qq：">
          <el-input v-model.trim="query.student_qq" class="width-70" clearable></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input v-model.trim="query.email" class="width-70" clearable></el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in query.extra_phone"
          :key="index"
          :label="index ===0?'备用手机':''">
          <el-col :span="8">
            <el-form-item
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
          <el-col class="width-25">
            <el-form-item :prop="'extra_phone.' + index + '.parent_relationship'"
              :rules="{
                required: true, message: '备注不能为空', trigger: 'change'
              }">
              <el-input
                v-model.trim="item.parent_relationship"
                placeholder="手机备注" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="width-25">
            <el-form-item :prop="'extra_phone.' + index + '.number_personal'"
              :rules="{
                required: true, message: '请选择所属人', trigger: 'change'
              }">
              <el-select v-model="item.number_personal" clearable placeholder="号码所属人" >
                <el-option
                  v-for="(item, index) in options.belongTo"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>            

          <el-button
            type="text"
            class="color-red"
            @click="materialPhoneDeleteEvent(index)" v-if="!Boolean(item.student_extra_message_id)"><i
            class="el-icon-close"></i>删除
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="materialPhoneAddEvent"><i class="el-icon-circle-plus"></i>添加备份手机号
          </el-button>
          <div class="color-red warn-message">最多可添加4个</div>
        </el-form-item>
        <el-form-item prop="birthday" label="学生生日：">
          <el-date-picker
            v-model="query.birthday"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            :editable="false"
            class="width-70">
          </el-date-picker>
          <div class=" color-red warn-message"
               v-if="query.birthday&&yearConstellation.animal">
            {{yearConstellation.animal}}，{{yearConstellation.signName}}
          </div>
        </el-form-item>
        <el-form-item label="上课设备：">
          <el-select placeholder="请选择上课设备" v-model="query.device_id" class="width-35" clearable filterable>
            <el-option
              v-for="item in options.getDevice"
              :key="item.value"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="materialSubmitEvent" type="primary" class="dialog-submit" :disabled="!canSearch">提交
        </el-button>
      </div>
    </el-dialog>

    <WarningDialog
      v-if="dialog.changeMainPhone.warningMessageBody"
      :body-message="dialog.changeMainPhone.warningMessageBody"
      :is-show.sync="dialog.changeMainPhone.show"
      @yes-event="saveMainPhone">
    </WarningDialog>

  </div>
</template>

<script>
  import { isvalidUsername } from '@/lib/validate'
  import WarningDialog from '@/components/dialog/warningDialog.vue'

  export default {
    name: 'changeInfoDialog',
    components: {
      WarningDialog
    },
    props: {
      studentId: {
        required: true
      },
      rosterId: {
        required: true
      },
      show: {
        required: true,
        type: Boolean
      },
      studentInfo: {
        required: true
      },
      indexInit: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        isHaveChange: false,
        canSearch: true,
        loading: true,
        title: '补全资料',
        showChangePhone: true,
        query: {
          name: '',
          sex: '',
          phone: '',
          parent_relationship: '',
          phoneCopy: '',
          grade_id: '',
          subject_name: [],
          student_qq: '',
          email: '',
          extra_phone: [],
          exam_year: '',
          birthday: '',
          province_id: '',
          city_id: '',
          country_id: '',
          present_school: '',
          present_school_id: '',
          number_personal: '',
          device_id: '',
          goal_school_name: '',
          goal_school_id: '',
          goal_province_id: '',
          goal_city_id: '',
          goal_country_id: ''
        },
        rules: {
          name: {
            required: true, message: '请输入姓名', trigger: 'change'
          },
          student_qq: {
            validator: this.validateQQNumber
          },
          email: {
            message: '请输入正确格式', trigger: 'change', type: 'email'
          },
          country_id: {
            required: true, message: '请输入省市区', trigger: 'change'
          },
          grade_id: {
            required: true, message: '请输入年级', trigger: 'change'
          },
          parent_relationship: {
            required: true, message: '请输入手机备注', trigger: 'change'
          },
          number_personal: {
            required: true, message: '请选择所属人', trigger: 'change'
          }
        },
        yearConstellation: {},
        options: {
          grade: [],
          subject_name: [],
          provinceIds: [],
          cityIds: [],
          countyIds: [],
          belongTo: [],
          getDevice: [],
          presentSchool: [],
          goalSchoolName: [],
          goalProvinceIds: [],
          goalCityIds: [],
          goalCountyIds: []
        },
        refName: 'material',
        dialog: {
          changeMainPhone: {
            show: false,
            newPhone: '',
            oldPhone: '',
            warningMessageBody: ''
          }
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      // api
      studentInfoApi() {
        return this.$http.get('student_getStudentInformation', {
          params: {
            student_intention_id: this.rosterId
          },
          isFilterUrl: true
        })
      },
      postStudentCompletionStudentData(body) {
        return this.$http.post('student_completionStudentInfo', body)
      },
      getYearConstellation(birthday) {
        return this.$http.get('student_getConstellation', {
          params: {
            birthday
          }
        })
      },
      getStudentGetListProvince() {
        return this.$http.get('student_getListProvince', { isFilterUrl: true })
      },
      getStudentGetCity(id) {
        return this.$http.get('student_getCity', {
          params: {
            province_id: id
          },
          isFilterUrl: true
        })
      },
      getStudentGetArea(id) {
        return this.$http.get('student_getArea', {
          params: {
            city_id: id
          },
          isFilterUrl: true
        })
      },
      getStudentGetGrade() {
        return this.$http.get('student_getGrade')
      },
      getStudentBelongTo() {
        return this.$http.get('student_getNumberPersonal')
      },
      getStudentDevice() {
        return this.$http.get('student_getDevice')
      },
      async init() {
        this.loading = true
        this.canSearch = false
        try {
          const [infoApi, getListProvince, getGrade, getbelongto, getdevice] = await Promise.all([this.studentInfoApi(), this.getStudentGetListProvince(), this.getStudentGetGrade(), this.getStudentBelongTo(), this.getStudentDevice()])
          if (!infoApi.data || !getListProvince.data || !getGrade.data || !getbelongto.data || !getdevice.data) {
            return this.$message.error('获取学生信息失败')
          }
          const _item = this.materialChangeDate(infoApi.data.info)
          if (!_item.goal_school_id) {
            _item.goal_school_id = _item.goal_school_name
            _item.goal_school_name = ''
          }
          if (!_item.present_school_id) {
            _item.present_school_id = _item.present_school
            _item.present_school = ''
          }
          this.query = {
            ...this.query,
            ..._item
          }
          this.options.provinceIds = getListProvince.data
          this.options.goalProvinceIds = getListProvince.data
          this.options.grade = getGrade.data
          this.options.belongTo = getbelongto.data
          this.options.getDevice = getdevice.data
          let yearPromise, cityPromise, areaPromise, goalCityPromise, goalAreaPromise
          const {
            province_id, city_id, goal_province_id, goal_city_id
          } = infoApi.data.info
          if (province_id) { // 有省获取市
            cityPromise = this.getOptionsOfCity(province_id)
          }
          if (city_id) { // 有市获取区
            areaPromise = this.getOptionsOfArea(city_id)
          }
          if (goal_province_id) { // 有省获取市
            goalCityPromise = this.getGoalOptionsOfCity(goal_province_id)
          }
          if (goal_city_id) { // 有市获取区
            goalAreaPromise = this.getGoalOptionsOfArea(goal_city_id)
          }
          await Promise.all([yearPromise, cityPromise, areaPromise, goalCityPromise, goalAreaPromise])
        } catch (e) {
          console.log(e)
          this.$message.error('获取学生信息失败')
        } finally {
          this.loading = false
          this.canSearch = true
        }
      },
      closeDialog() {
        this.$emit('update:show', false)
        if (this.isHaveChange) {
          this.indexInit(true)
        }
      },
      // 获取明文次要手机号
      getExtractPhone() {
        return this.$http.get('student_getExtractPhoneList', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      materiaBtnSavePhoneClick() {
        if (!isvalidUsername(this.query.phoneCopy)) {
          return this.$message.error('手机格式错误')
        }
        this.dialog.changeMainPhone.show = true
        this.dialog.changeMainPhone.newPhone = this.query.phoneCopy
        this.dialog.changeMainPhone.warningMessageBody = `确定修改主号 ${this.dialog.changeMainPhone.oldPhone} 为 ${this.dialog.changeMainPhone.newPhone} 吗？`
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
      // qq验证
      validateQQNumber(rule, value, callback) {
        if (value === '' || /^[1-9]\d{4,}$/g.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确QQ'))
        }
      },
      // // 省市匹配学校
      materialGetAreaSchool() {
        this.$http.get('student_getPresentSchool', {
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
      materialGetGoalSchool() {
        this.$http.get('student_getPresentSchool', {
          params: {
            provinceId: this.query.goal_province_id,
            cityId: this.query.goal_city_id
          },
          isFilterUrl: true
        }).then(res => {
          if (res.data) {
            this.options.goalSchoolName = res.data
          }
        }).catch(console.log)
      },
      materialChangeDate(item) {
        item.sex = +item.sex
        item.grade_id = item.grade_id === '' ? '' : +item.grade_id
        return item
      },
      materialCourseDeleteEvent(index) {
        this.query.subject_name.splice(index, 1)
      },
      materialPhoneDeleteEvent(index) {
        this.query.extra_phone.splice(index, 1)
      },
      materialPhoneAddEvent() {
        if (this.query.extra_phone.length >= 4) {
          return
        }
        this.query.extra_phone.push({
          extra_phone: '', parent_relationship: ''
        })
      },
      materialSubmitEvent() {
        this.$refs[this.refName].validate(valid => {
          if (valid) {
            this.canSearch = false
            const copyObj = JSON.parse(JSON.stringify(this.query))
            if (copyObj.country_id) {
              copyObj.area_id = copyObj.country_id
            } else if (copyObj.city_id) {
              copyObj.area_id = copyObj.city_id
            } else if (copyObj.province_id) {
              copyObj.area_id = copyObj.province_id
            } else {
              copyObj.area_id = ''
            }
            if (copyObj.goal_country_id) {
              copyObj.goal_area_id = copyObj.goal_country_id
            } else if (copyObj.goal_city_id) {
              copyObj.goal_area_id = copyObj.goal_city_id
            } else if (copyObj.goal_province_id) {
              copyObj.goal_area_id = copyObj.goal_province_id
            } else {
              copyObj.goal_area_id = ''
            }
            const tF = this.options.presentSchool.some((val) => {
              if (val.school_id === copyObj.present_school_id) {
                copyObj.present_school = val.school_name
                return true
              }
              return false
            })
            if (!tF) {
              copyObj.present_school = copyObj.present_school_id
              copyObj.present_school_id = ''
            }
            const tM = this.options.goalSchoolName.some((val) => {
              if (val.school_id === copyObj.goal_school_id) {
                copyObj.goal_school_name = val.school_name
                return true
              }
              return false
            })
            if (!tM) {
              copyObj.goal_school_name = copyObj.goal_school_id
              copyObj.goal_school_id = ''
            }
            this.postStudentCompletionStudentData(copyObj).then(res => {
              if (res.data) {
                this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: '<p class="message-body-color">资料越全，转化更快</p>'
                })

                this.isHaveChange = true
                this.closeDialog()
              } else {
                this.$message.error({
                  dangerouslyUseHTMLString: true,
                  message: `<p class="message-title-color">提交失败</p><p class="message-body-color">${res.message}</p>`
                })
              }
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              this.canSearch = true
            })
          }
        })
      },
      materialProvinceChangeEvent(id) {
        this.query.city_id = ''
        this.query.country_id = ''
        this.query.present_school_id = ''
        this.options.presentSchool = []
        this.options.cityIds = []
        this.options.countyIds = []
        if (id) {
          this.getOptionsOfCity(id)
        }
      },
      materialCityChangeEvent(id) {
        this.query.country_id = ''
        this.options.countyIds = []
        this.query.present_school_id = ''
        this.options.presentSchool = []
        if (id) {
          this.getOptionsOfArea(id)
        }
      },
      materialGoalProvinceChangeEvent(id) {
        this.query.goal_city_id = ''
        this.query.goal_country_id = ''
        this.query.goal_school_id = ''
        this.options.goalSchoolName = []
        this.options.goalCityIds = []
        this.options.goalCountyIds = []
        if (id) {
          this.getGoalOptionsOfCity(id)
        }
      },
      materialGoalCityChangeEvent(id) {
        this.query.goal_country_id = ''
        this.options.goalCountyIds = []
        this.query.goal_school_id = ''
        this.options.goalSchoolName = []
        if (id) {
          this.getGoalOptionsOfArea(id)
        }
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
      // 市
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
      getGoalOptionsOfCity(id) {
        return this.getStudentGetCity(id).then(res => {
          if (res.data) {
            this.options.goalCityIds = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取市信息失败')
        })
      },
      // 区
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
      getGoalOptionsOfArea(id) {
        return this.getStudentGetArea(id).then(res => {
          if (res.data) {
            this.options.goalCountyIds = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取区信息失败')
        })
      },
      // 星座
      showYearConstellation(birthday) {
        return this.getYearConstellation(birthday).then(res => {
          if (res.data) {
            this.yearConstellation = res.data
          }
        }).catch(console.log)
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
      }
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
      'query.goal_city_id'(val) {
        if (val && this.query.goal_province_id !== '') {
          this.materialGetGoalSchool()
        }
      }
    }
  }
</script>

<style scoped lang="sass">
  .dialog-material
    .course-select
      width: 30% !important
    .course-select-small
      width: 21.66%
      display: inline-block
      float: left
    .display-block
      display: block
      margin-top: 10px
    .color-red
      color: red
    .warn-message
      font-size: 12px
      height: 20px
      line-height: 20px
      position: absolute

    .change-pos
      position: absolute
      left: 120px
      top: 0

  .width-70
      width: 70% !important
  .width-35
    width: 35% !important
  .width-25
    width: 25% !important
  .dialog-title
    border-bottom: 3px solid #666
    padding-bottom: 5px
    margin: 0

  .color-blue
    color: #409EFF
</style>
