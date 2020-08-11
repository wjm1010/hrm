<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <CommonOperations></CommonOperations>
    <!--<MyPhone></MyPhone>-->
    <WarmAssistant></WarmAssistant>
    <MyCalender></MyCalender>
    <CourseArrangement></CourseArrangement>
    <weak-password-dialog :dialog-visible.sync="weakPasswordDialogVisible"></weak-password-dialog>
  </div>
</template>

<script>
  import CommonOperations from './detail/commonOperations' // 常规操作
  import MyPhone from './detail/myPhone' // 常规操作
  import WarmAssistant from './detail/warmAssistant' // 温馨小助理
  import MyCalender from './detail/myCalendar' // 我的日历
  import CourseArrangement from './detail/courseArrangement' // 课程安排
  import weakPasswordDialog from '@/components/weakPasswordDialog'
  import { mapGetters } from 'vuex'

export default {
    name: 'dashboard',
    components: {
      CommonOperations,
      WarmAssistant,
      MyPhone,
      MyCalender,
      CourseArrangement,
      weakPasswordDialog
    },
    data() {
      return {
        weakPasswordDialogVisible: false
      }
    },
    computed: {
      ...mapGetters(['passwordState'])
    },
    created() {
      if (this.passwordState === '0') {
        this.weakPasswordDialogVisible = true
      }
    },
    mounted() {

    },
    methods: {
    },
    watch: {
    }
  }
</script>
<style lang="sass">
  @import '../../styles/dashboard/index.sass'

</style>
