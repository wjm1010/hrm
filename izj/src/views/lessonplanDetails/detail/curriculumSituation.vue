<template>
	<div v-if="noHidden">
		<h4>排课情况</h4>
		<ExpandTable
		:rows="rows"
		:columns="columns"
    :slot-name-arr="slotNameArr">
    <template slot-scope="scope" slot="end_time">
        <span v-if="scope.row['status_name'] === '冲突'" class="color-red">{{scope.row['start_time']}} - {{scope.row['end_time']}}</span>
        <span v-else>{{scope.row['start_time']}} - {{scope.row['end_time']}}</span>
      </template>
		</ExpandTable>
	</div>
</template>
<script>
import ExpandTable from '@/components/ExpandTable'
export default {
  name: 'curriculumSituation',
  components: {
    ExpandTable
  },
  props: {
    strategyId: {
      required: true
    }
  },
  data() {
    return {
      columns: [
        { 'value': 'end_time', 'text': '上课时间' },
        { 'value': 'lesson_period', 'text': '课时' },
        { 'value': 'teacher_name', 'text': '教师' },
        { 'value': 'status_name', 'text': '状态' }
      ],
      noHidden: true,
      slotNameArr: ['end_time'],
      rows: [],
      loading: false
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$http.get('courseApplication_curriculumArrangement', {
        params: {
          strategyId: this.strategyId
        }
      }).then(res => {
        if (res.data) {
          if (res.data.length === 0) {
            this.noHidden = false
          } else {
            this.noHidden = true
          }
          this.rows = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../styles/lessonplanDetails/detail/curriculumSituation.sass'
</style>


