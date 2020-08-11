<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="contractUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'check',
  components: {
    IframeTpl
  },
  data() {
    return {
      contractUrl: ''
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
      this.contractUrl = 'contract/detail/check/' + this.$route.params.contractId
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/student/contractCheck.sass'

</style>