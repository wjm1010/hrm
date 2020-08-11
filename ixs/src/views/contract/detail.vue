<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="contractUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'contractdetail',
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
      this.contractUrl = 'contract/detail/' + this.$route.params.rosterId
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/contract/detail.sass'

</style>
