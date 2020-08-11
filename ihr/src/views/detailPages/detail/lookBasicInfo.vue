<template>
  <div class="main-content">
    <div>
      <span class="width-30">
        <i class="lable">一级渠道：</i>{{talents.resumeFirstChannelName}}
      </span>
      <span class="width-30">
        <i class="lable">二级渠道：</i>{{talents.resumeSecondChannelName}}
      </span>
      <span class="width-30" v-if="talents.resumeInfoDeliveryTypeName">
        <i class="lable">投递方式：</i>{{talents.resumeInfoDeliveryTypeName}}
      </span>
      <span class="width-30">
        <i class="lable">毕业学校：</i>{{talents.resumeSchool}}
        <span v-if="talents.resumeSchoolPropertyName">
          <i :class="{'color985':talents.resumeSchoolPropertyName === '985',
              'color211':talents.resumeSchoolPropertyName === '211'}"
              v-if="talents.resumeSchoolPropertyName.length<4">
              {{talents.resumeSchoolPropertyName}}
          </i>
          <span v-else>
            <i :class="{'color985':talents.resumeSchoolPropertyName.substring(0,3) === '985','color211':talents.resumeSchoolPropertyName.substring(0,3) === '211'}">
              {{talents.resumeSchoolPropertyName.substring(0,3)}}
            </i>
            <i :class="{'color985':talents.resumeSchoolPropertyName.substring(talents.resumeSchoolPropertyName.length-3) === '985','color211':talents.resumeSchoolPropertyName.substring(talents.resumeSchoolPropertyName.length-3) === '211'}">
              {{talents.resumeSchoolPropertyName.substring(talents.resumeSchoolPropertyName.length-3)}}
            </i>
          </span>
        </span>
      </span>
    </div>
    <div>
      <span class="width-30" v-if="talents.resumeInfoReferee">
        <i class="lable">推荐人：</i>{{talents.resumeInfoReferee}}
      </span>
      <span class="width-30" v-if="talents.resumeInfoRefereePhone">
        <i class="lable">推荐人工号：</i>{{talents.resumeInfoRefereePhone}}
      </span>
    </div>
    <div>
      <span class="width-30">
        <i class="lable">专业：</i>{{talents.resumeInfoSpecialty}}
      </span>
      <span class="width-30">
        <i class="lable">毕业年份：</i>{{talents.resumeInfoFromGrade}}
      </span>
      <span class="width-30">
        <i class="lable">学历：</i>{{talents.resumeInfoEducationName}}
      </span>
    </div>
    <div>
      <span class="width-30">
        <i class="lable">目前身份：</i>{{talents.resumeTeacherIdent}}
      </span>
      <span class="width-30">
        <i class="lable">教师职级：</i>{{talents.resumeTeacherLevel}}
        </span>
      <span class="width-30">
        <i class="lable">应聘年级：</i>{{talents.resumeGrade}}
      </span>
    </div>
    <div>
      <span class="width-30">
        <i class="lable">应聘学科：</i>{{talents.resumeSubject}}
      </span>
      <span class="width-30">
        <i class="lable">所属教学部：</i>{{talents.resumeTeachingDeptName}}
      </span>
      <span class="width-30">
        <i class="lable">工作地点：</i>{{talents.resumeInfoWorkPlace}}
      </span>
    </div>
    <div>
      <span class="width-30">
        <i class="lable">合同类型：</i>{{talents.resumeInfoContractTypeName}}
      </span>
      <span class="width-30">
        <i class="lable">教师资格证：</i>{{talents.resumeInfoTeacherCertName}}
      </span>
      <span class="width-30">
        <i class="lable">工作方式：</i>{{talents.reumeInfoWorkStyleName}}
      </span><br>
    </div>
    <div class="width-70">
      <i class="lable">标签：</i>
      <span v-if="talents.resumeTagsName"
        style="margin-right:10px">
        <el-button size="small" v-for="item in talents.resumeTagsName.split(',')" :key="item" style="margin-right:10px">
          {{item}}
        </el-button>
      </span>
    </div>
    <div style="padding-left: 1%;line-height: 50px">
      <i class="lable">备注：</i>{{talents.resumeInfoNote}}
    </div>
    <div class="width-30" >
        <i class="lable" style="width: 100px">重复报名时间：</i>{{talents.resumeRepeatRegistTime}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'lookBasicInfo',
  data() {
    return {
      resumeTags: []
    }
  },
  props: {
    talents: {
      type: Object,
      require: true
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {

  }
}
</script>
<style lang="sass" scoped>
div
  font-size: 14px
  color: #606266
.main-content
  padding-top: 20px

.width-30
  display: inline-block
  width: 33%
  line-height: 50px
  padding-left: 1%
.width-70
  display: inline-block
  width: 66%
  line-height: 50px
  padding-left: 1%
.lable
  display: inline-block
  width: 85px
.color985,.color211
  display: inline-block
  padding: 5px
  line-height: 10px
  font-size: 12px
.color985
  border: 1px solid #0099CC
  color: #0099CC
.color211
  border: 1px solid #FF6600
  color: #FF6600
</style>

