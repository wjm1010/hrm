<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="rosterUrl"></IframeTpl>        
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'list',
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
      this.rosterUrl = `lessonplanorder/list?multiStatus[]=2&multiStatus[]=3&multiStatus[]=5&multiStatus[]=6&multiStatus[]=7&multiStatus[]=8&multiStatus[]=11&multiStatus[]=12&multiStatus[]=13&multiStatus[]=14&multiStatus[]=15&multiStatus[]=16&multiStatus[]=17&studentIntentionId=${this.$route.params.rosterId}`
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/lessonplanorder/list.sass'

</style>