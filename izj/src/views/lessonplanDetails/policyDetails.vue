<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <policy-info 
      :isOrderly="isOrderly"
      :strategy-id="strategyId"
      :type="type">
    </policy-info>
    <message-record
      :strategy-id="strategyId">
    </message-record>
    <curriculum-situation
      :strategy-id="strategyId">
    </curriculum-situation>
    <operation-log
      :strategy-id="strategyId">
    </operation-log>
  </div>
</template>

<script>
  import PolicyInfo from './detail/policyInfo' // 基础信息
  import MessageRecord from './detail/messageRecord.vue' // 消息记录
  import CurriculumSituation from './detail/curriculumSituation.vue' // 排课情况
  import OperationLog from './detail/operationLog.vue' // 消息记录
  export default {
    name: 'lessonplanDetailspolicyDetails',
    components: {
      PolicyInfo,
      MessageRecord,
      CurriculumSituation,
      OperationLog
    },
    data() {
      return {
        isOrderly: true,
        strategyId: this.$route.query.strategyId,
        type: this.$route.query.type
      }
    },
    computed: {
    },
    watch: {
  
    },
    created() {
    },
    methods: {
  
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../styles/lessonplanDetails/policyDetails.sass'
</style>
