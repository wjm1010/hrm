<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="rosterUrl"></IframeTpl>        
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'lessonplanorderqueryFeedback',
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
      this.rosterUrl = `lessonplan/feedback/${this.$route.query.orderId}`
    }
  }
}
</script>
<style lang="sass">

</style>