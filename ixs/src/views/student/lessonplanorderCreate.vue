<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
  import IframeTpl from '@/components/iframe'
  export default {
    name: 'studentlessonplanorderCreate',
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
        this.rosterUrl = `lessonplanorder/create/2/student/${this.$route.params.rosterId}/`
      }
    }
  }
</script>
<style lang="sass">

  @import '../../styles/student/lessonplanorderCreate.sass'

</style>
