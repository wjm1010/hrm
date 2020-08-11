<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <h3 style="color: #525E71">话术提醒</h3>
    <el-row type="flex" :gutter="20" class="body">
      <el-col :span="5">
        <ul>
          <li>● 建议回访时间：<i>{{returnTime}}</i> 。</li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'detail-wordsRemind',
    data() {
      return {
        returnTime: ''
      }
    },
    props: {
      rosterId: {
        required: true
      }
    },
    created() {
      this.talk()
    },
    mounted() {
    },
    methods: {
      talk() {
        this.$http.get('talk_talk', {
          params: {
            studentIntentionId: this.rosterId
          }
        }).then(res => {
          if (res.data) {
            this.returnTime = res.data.returnTime
          }
        }).catch(console.log)
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/wordsRemind'
</style>
