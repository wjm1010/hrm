<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <IframeTpl :src="rosterUrl"></IframeTpl>
  </div>
</template>

<script>
import IframeTpl from '@/components/iframe'
export default {
  name: 'manageReadonly',
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
      this.rosterUrl = 'lessonplan/manage/' + this.$route.params.teacher_id + '/readonly?teacherName=' + this.$route.params.name
    }
  }
}
</script>
<style lang="sass">

@import '../../styles/student/manageReadonly.sass'

</style>
