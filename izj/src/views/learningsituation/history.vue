<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'learningsituationhistory',
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
      this.rosterUrl = 'learningsituation/history/student/' + this.$route.params.rosterId
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/learningsituation/history.sass'

</style>