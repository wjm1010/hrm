<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'rostermajorreport',
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
      this.rosterUrl = `roster/majorreport/student/${this.$route.params.rosterId}/${this.$route.params.studentId}/`
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/student/majorreport.sass'

</style>
