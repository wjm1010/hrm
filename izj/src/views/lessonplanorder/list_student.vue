<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
        <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'lessonplanorderlist_student',
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
      this.rosterUrl = 'lessonplanorder/list_student/student/' + this.$route.params.rosterId + '/?nav=zj'
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/lessonplanorder/list_student.sass'

</style>