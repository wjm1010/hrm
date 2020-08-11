<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl src="contract/list"></IframeTpl>    
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'contractlist',
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

@import '../../styles/contract/list.sass'

</style>