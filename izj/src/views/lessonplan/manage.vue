<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
        <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'lessonplanmanage',
  components: {
    IframeTpl
  },
  data() {
    return {
      rosterUrl: ''
    }
  },
  computed: {

  },
  created() {
    this.getProps()
  },
  mounted() {

  },
  methods: {
    getProps() {
      this.rosterUrl = `lessonplan/manage/${this.$route.params.studentId}/0_3/1?studentName=${this.$route.params.studentName}&from=rosterdetail&f2=`
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/lessonplan/manage.sass'

</style>
