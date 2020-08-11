<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
  import IframeTpl from '@/components/iframe'
  export default {
    name: 'studentcontractCreate',
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
        this.rosterUrl = `contract/create/${this.$route.params.rosterId}/`
      }
    }
  }
</script>
<style lang="sass">

  @import '../../styles/student/contractCreate.sass'

</style>
