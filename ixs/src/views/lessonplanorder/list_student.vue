<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
        <IframeTpl :src="lessonplanorderUrl"></IframeTpl>
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
      lessonplanorderUrl: ''
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
      // 设班单详情页
      this.lessonplanorderUrl = `lessonplanorder/newdetail/view/${this.$route.params.rosterId}?flag=0`
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/lessonplanorder/list_student.sass'

</style>