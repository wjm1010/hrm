<template>
  <!-- 命令行生成的模板 -->
  <!-- 我的通话 -->
  <div v-loading="loading">
    <div class="prompt">
      <h3>我的通话</h3>
      <ul class="phone-duration">
        <li>
          我的通话时长：   
          <span>
            <i class="time">{{min}}</i> min
          </span>
          <span>
            <i class="time">{{sec}}</i> s
          </span>
        </li>
        <li>
          我的今日通话次数：   
          <span>
            <i class="time">{{total}}</i> 次
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'myPhone',
    data() {
      return {
        min: '',
        sec: '',
        total: '',
        loading: true
      }
    },
    computed: {
    },
    created() {
      this.official()
    },
    mounted() {
    },
    watch: {
    },
    methods: {
      getTodayCallDuration() {
        return this.$http.get('student_todayCallDuration')
      },
      getTodayCallTotal() {
        return this.$http.get('student_todayCallTotal')
      },
      official() {
        Promise.all([this.getTodayCallDuration(), this.getTodayCallTotal()]).then(async([duration, callTotal]) => {
          if (duration.data && callTotal.data) {
            this.min = duration.data.min
            this.sec = duration.data.sec
            this.total = callTotal.data[0].total
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="sass">
  @import '../../../styles/dashboard/index.sass'

</style>