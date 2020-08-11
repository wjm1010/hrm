<template>
	<div class="dashboard-container">
    <div v-if="judge">
      <HighSchool
      :query="query"
      :name="name">
      </HighSchool>
    </div>
    <div v-else>
     <unversity
     :query="query"
     :name="name"> 
    </unversity>
    </div>
	</div>
</template>
<script>
import HighSchool from './highSchool'
import unversity from './unversity'
export default {
  components: {
    HighSchool,
    unversity
  },
  data() {
    return {
      query: {
      },
      judge: false,
      loading: true,
      name: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.$http.post('student_getTestInfo', {
        provinceId: this.$route.query.provinceId,
        gradeId: this.$route.query.gradeId,
        subjectId: this.$route.query.subjectId,
        cityId: this.$route.query.cityId
      }).then(res => {
        if (res.data) {
          if (this.$route.query.gradeId < 3) {
            this.judge = false
          } else {
            this.judge = true
          }
          this.query = res.data
        } else {
          this.$message.error('无效数据')
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
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


