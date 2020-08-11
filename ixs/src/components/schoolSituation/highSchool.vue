<template>
	<div class="dashboard-container" style="padding-top: 0px">
    <div>
      <el-button type="primary" class="btn-downLoad" v-if="query.pdf_url !==''" @click="btnDownLoading">考纲文件</el-button>
      <p class="title">考情分析
        <span style="font-size: 15px; color: black; padding-left:25px">{{query.exam_name}}</span>
      </p>
      
      <ul class="font-body">
        <li v-if="query.exam_policy">
          <div class="float-left">
            <span>考试政策：</span>
          </div>				
          <div class="margin-left-75">
            <span>{{query.exam_policy}}</span>
          </div>				
        </li><br>
        <li v-if="query.enrolment_policy">
          <div class="float-left">
            <span>录取政策：</span>
          </div>				
          <div class="margin-left-75">
            <span>{{query.enrolment_policy}}</span>
          </div>
        </li><br>
        <li v-if="query.score">
          <div class="float-left">
            <span>分值：</span>
          </div>				
          <div class="margin-left-75">
            <span>{{query.score}}</span>
          </div>
        </li><br>
        <li v-if="query.exam_date">
          <div class="float-left">
            <span>考试时间：</span>
          </div>				
          <div class="margin-left-75">
            <span>{{query.exam_date}}</span>
						<span>{{query.exam_time_start}}</span>-
						<span>{{query.exam_time_end}}</span>
          </div>
        </li><br>
        <li v-if="query.bark">
          <div class="float-left">
            <span>备注：</span>
          </div>				
          <div class="margin-left-75">
            <span>{{query.bark}}</span>
          </div>
        </li>
      </ul>
    </div>
	</div>
</template>
<script>
export default {
  props: {
    query: {
      required: true
    },
    name: {
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    btnDownLoading() {
      this.$http.post('student_getTestInfo', {
        isBuried: this.$route.query.isBuried,
        pageSourceType: this.$route.query.pageSourceType,
        actionId: this.$route.query.actionId,
        actionBaseAttrId: this.$route.query.subjectId,
        studentIntentionId: this.$route.query.studentIntentionId,
        innerActionId: '1',
        provinceId: this.$route.query.provinceId,
        cityId: this.$route.query.cityId,
        regionId: this.$route.query.regionId,
        gradeId: this.$route.query.gradeId,
        subjectId: this.$route.query.subjectId
      }).catch(console.log)
      window.open(this.query.pdf_url)
    }
  }
}
</script>
<style lang="sass" scoped>
.dashboard-container
	.btn-downLoad
		float: right
	.title
		padding-bottom: 30px
		border-bottom: 1px solid #E6E6E6
		font-size: 20px
		font-weight: bold
		color: #7B7D93
	.font-body
		font-size: 15px
		color: #7B7D93
		list-style: none
		line-height: 25px
		li
			margin-bottom: 20px
			>span
				padding-left: 73px
			.float-left
				float: left
			.margin-left-75
				margin-left: 75px
</style>


