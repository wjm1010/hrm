<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
        <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'reportcallrecordlist',
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

  },
  mounted() {

  },
  methods: {
    getProps() {
      this.rosterUrl = `report/callrecordlist/${this.$route.params.rosterId}/${this.$route.params.studentId}`
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/report/callrecordlist.sass'

</style>