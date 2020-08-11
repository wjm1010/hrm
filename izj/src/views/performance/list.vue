<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl src="performance/list"></IframeTpl>        
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'performancelist',
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

  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="sass">

@import '../../styles/performance/list.sass'

</style>