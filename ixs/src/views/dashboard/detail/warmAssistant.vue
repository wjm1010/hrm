<template>
  <!-- 命令行生成的模板 -->
  <!-- 温馨小助理 -->
  <div v-loading="loading">
    <div class="prompt">
      <h3>温馨小助理</h3>
      <ul class="prompt-content">
        <li @click="officialStudent">
          <span>正式首课生</span>
          <el-button type="primary">{{student}}人</el-button>
        </li>
        <li @click="$router.push('/dashboard/repeatStudent')">
          <span>重复进线名单</span>
          <el-button type="primary">{{repeatStudent}}人</el-button>
        </li>
        <li>
          <span>转介绍学生</span>
          <el-button type="primary" class="referral-code" @click="closeReferral">我的内部推荐码</el-button>
          <el-button type="primary" @click="jumpToTaskList">{{referralNum}}人</el-button>
        </li>
      </ul>
    </div>

    <referral-dialog
      v-if="showReferral"
      :showReferral="showReferral" 
      @close-referral-dialog="closeReferral">
    </referral-dialog>
  </div>
</template>

<script>
  import ReferralDialog from './referral/referralDialog.vue'
  export default {
    name: 'warmAssistant',
    components: {
      ReferralDialog
    },
    data() {
      return {
        referralNum: '',
        showReferral: false,
        student: '',
        repeatStudent: '',
        loading: true
      }
    },
    computed: {
    },
    created() {
      this.getReferralTotal()
    },
    mounted() {
      this.official()
      this.getRepeatThreadTotal()
    },
    watch: {
    },
    methods: {
      officialStudent() {
        this.$router.push('/dashboard/assistant')
      },
      official() {
        this.$http.post('lesson_saleFirstLesson').then(res => {
          if (res.data) {
            this.student = res.data.count
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      },
      getRepeatThreadTotal() {
        this.$http.get('follow_repeatThreadTotal').then(res => {
          if (res.data) {
            this.repeatStudent = res.data.total
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      },
      /*
      内部推荐码
      */
      // 获取内部推荐人数
      getReferralTotal() {
        this.$http.get('users_getTrackUser').then(res => {
          if (res.data) {
            this.referralNum = res.data.count
          }
        })
      },
      closeReferral() {
        this.showReferral = !this.showReferral
      },
      // 路由跳转任务列表
      jumpToTaskList() {
        this.$router.push({ path: '/tasklist/index', query: {
          status: 'dashboard'
        }})
      }
    }
  }
</script>
<style lang="sass">
.referral-code
  background-color: #9cb79d
  border: 1px solid #9cb79d
.referral-code:hover
    text-shadow: 0.1em 0.1em 0.1em #600
    border: 1px solid #9cb79d
    color: white
    background-color: #9cb79d
</style>