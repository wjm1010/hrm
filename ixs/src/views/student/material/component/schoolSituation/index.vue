<template>
	<div class="dashboard-container">
		<p class="title">学校情况</p>
		<ul class="font-body">
			<li>
				<span>校名：</span>
				<el-button type="text" @click="btnSchoolDetails">{{query.school_name}} 
					<span v-if="query.school_nature_text">（{{query.school_nature_text}}）</span>						
				</el-button>
				<span v-if='query.school_length_text'>学制：{{query.school_length_text}}</span>
				<span v-if='query.provice_rank'>省排名：{{query.provice_rank}}</span>
				<span v-if='query.city_rank'>市排名：{{query.city_rank}}</span>
				<span v-if='query.area_rank'>区排名：{{query.area_rank}}</span>
			</li>
			<li v-if="query.brief_introduction && query.brief_introduction !== ''">
				<div class="float-left">
					<span>学校简介：</span>
				</div>				
				<div class="margin-left-75">
					<span>{{query.brief_introduction}}</span>
				</div>				
			</li>
			<li v-if="query.achievements && query.achievements !== ''">
				<div class="float-left">
					<span>教学成果：</span>
				</div>				
				<div class="margin-left-75">
					<span>{{query.achievements}}</span>
				</div>
			</li>
			<li v-if="query.characteristic && query.characteristic !== ''">
				<div class="float-left">
					<span>办学特色：</span>
				</div>				
				<div class="margin-left-75">
					<span>{{query.characteristic}}</span>
				</div>
			</li>
			<li v-if="query.team && query.team !== ''">
				<div class="float-left">
					<span>师资队伍：</span>
				</div>				
				<div class="margin-left-75">
					<span>{{query.team}}</span>
				</div>
			</li>
			<li v-if="query.admission_policy && query.admission_policy !== ''">
				<div class="float-left">
					<span>招生政策：</span>
				</div>				
				<div class="margin-left-75">
					<span>{{query.admission_policy}}</span>
				</div>
			</li>
			<li v-if="query.enrollment_mark && query.enrollment_mark !== ''">
				<div class="float-left">
					<span>录取分数线：{{query.enrollment_mark}}</span>
				</div>
				<div>
					<span v-if='query.counterpart_middle_school' style="padding-left: 80px">对口中学：{{query.counterpart_middle_school}}</span>
				</div>				
			</li>
			<li v-if="query.bark && query.bark !== ''">
				<div class="float-left">
					<span>备注：</span>
				</div>				
				<div class="margin-left-75">
					<span>{{query.bark}}</span>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
  data() {
    return {
      query: {
        school_name: '',
        eductional: '',
        provinceRanked: '',
        cityRanked: '',
        areaRanked: '',
        schoolDetails: '',
        teachResults: '',
        schoolCharacteristics: '',
        teachersTroop: '',
        policy: '',
        admitMark: '',
        bridgeSchool: '',
        remarks: '',
        schoolNameUrl: ''
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    btnSchoolDetails() {
      if (this.query.school_name_url && this.query.school_name_url !== '') {
        window.open(this.query.school_name_url)
      } else {
        this.$message.warning('暂无数据')
      }
    },
    init() {
      this.$http.post('student_getSchoolInfo', {
        provinceId: this.$route.query.provinceId,
        cityId: this.$route.query.cityId,
        schoolType: this.$route.query.schoolType,
        schoolName: this.$route.query.schoolName

      }, { isFilterUrl: true }).then(res => {
        if (res.data) {
          this.query = res.data
        }
        return
      }).catch(console.log)
    }
  }
}
</script>
<style lang="sass" scoped>
.dashboard-container
	.btn-downLoad
		margin-top: 25px
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


