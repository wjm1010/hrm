<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
        <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'lessonplanorderSearch',
  components: {
    IframeTpl
  },
  data() {
    return {

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
      this.rosterUrl = 'lessonplanorder/list_student/search/' + this.$route.params.rosterId
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/lessonplanorder/search.sass'

</style>