<template>
  <div class="try-task" v-show="tryTasks">
    <div class="serach">
      <div class="try">
        <p>试听任务</p>
        <el-radio-group 
          v-model="phaseChecked" 
          @change="handleChange"
          class="btns">
          <el-radio 
            :label="v.id" 
            v-for="v in tryTasks" 
            :key="v.id"
          >{{v.name}}</el-radio>
        </el-radio-group>
      </div>
      <div class="fast">
        <p>快速筛选</p>
        <el-checkbox 
          class="btns" 
          v-model="today"
          >只看今天新获取的名单
        </el-checkbox>
        <el-checkbox v-model="parentReferral">家长转介绍学生</el-checkbox>
        <el-checkbox v-model="recommendStudent">我推荐的学生</el-checkbox>
        <el-checkbox 
          class="btns" 
          v-model="hide"
          >隐藏无事项学生
        </el-checkbox>
      </div>
      <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <div class="right">
      <div class="ad">
        <a href="http://help.hfjy.com/helper/#g=1&p=%E7%9B%AE%E5%BD%95" target="_blank">
          <el-button type="primary" plain size="small">查看帮助</el-button>
        </a>
      </div>
      <div class="refresh">
        <el-button
          type="primary"
          icon="el-icon-refresh" 
          size="small"  
          class="resBtn"
          @click="handleSearch"
        >刷新</el-button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'filterTask',
  data() {
    return {
      tryTasks: [],
      phaseChecked: '',
      today: false,
      parentReferral: false,
      recommendStudent: false,
      hide: true,
    }
  },
  created() {
    this.getPhase()
  },
  methods: {
    handleSearch() {
      this.$emit('getList', 'search')
    },
    async getPhase() {
      try {
        this.getReferralStatus()
        const res = await this.getPhasesApi()
        if (res.data) {
          this.tryTasks = res.data
          this.phaseChecked = res.data.filter(v => v.checked)[0].id
          this.$emit('getList')
        }
      } catch (e) {
        console.error(e)
      }
    },
    getPhasesApi() {
      return this.$http.get('task_phase')
    },
    /*
    销售首页内部推荐跳转至任务列表内部推荐状态为true
    */
    getReferralStatus() {
      if (!this.$route.query.status) return
      this.parentReferral = true
      this.recommendStudent = true
    }
  }
}
</script>
<style lang="sass" scoped>
  .try-task
    display: flex;
    width: 100%;
    position: absolute;
    padding-top: 10px;
    padding-right: 40px;
    top: 0;
    align-items: center;
    justify-content: space-between;
    .right
      display: flex;
      flex-direction: column;
      .refresh
        margin-top: 20px;
        .resBtn
          margin-left: 30px;
      .ad
        text-align: right
  .try, .fast
    display: flex;
    align-items: center;
    p
      font-size: 14px;
      color: #333;
    .btns
      margin-left: 30px;
</style>

