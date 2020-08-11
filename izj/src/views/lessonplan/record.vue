<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl src="lessonplan/record"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'lessonplanrecord',
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

@import '../../styles/lessonplan/record.sass'

</style>