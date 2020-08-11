<template>
  <div class="dashboard-container">
    <div class="nav-wrap" :class="{'no-sidebar-navbar-width':!sidebar.opened}">
      <filterTask
        @getList="getList"
        ref='searchTask'
      />
    </div>
    <div 
      class="content-wrap" 
      v-if="tasklist"
      v-loading="loading" 
      element-loading-text="拼命加载中"
    >
      <contentTask 
        v-for="v in tasklist"
        :key="v.studentIntentionId"
        :data="v"
        @handleBury="handleBury"
      />
    </div>
    <p class="empty" v-show="showEmpty">暂无数据</p>
    <div @click="handleTop" v-show="showTopicon">
      <svg-icon icon-class="toTop" class="icon-top" ></svg-icon>
    </div> 
    <p 
      class="addMore" 
      @click="handleMorelist"
      v-show="showMore">点击加载更多 <svg-icon icon-class="downArrows" class="icon-arr"></svg-icon>
      </p>
  </div>
</template>

<script>
import filterTask from './search/filterTask'
import contentTask from './content/index'
import { mapGetters } from 'vuex'

export default {
  name: 'tasklistIndex',
  components: {
    filterTask,
    contentTask
  },
  computed: {
    ...mapGetters(['sidebar']),
    showEmpty() {
      return this.tasklist.length === 0 && !this.loading
    }
  },
  data() {
    return {
      name: '任务列表',
      distance: 50,
      haveMore: false,
      showMore: false,
      loading: true,
      showTopicon: false,
      tasklist: [],
      page: 1,
    }
  },
  created() {
  },
  mounted() {
    window.addEventListener('scroll', this.scrollList)
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollList)
  },
  methods: {
    handleTop() {
      window.scrollTo(0, 0)
    },
    finalGap() {
      const windowHight = document.body.clientHeight || document.documentElement.clientHeight
      const bodyScrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight
      const ScrollY = document.body.scrollTop || document.documentElement.scrollTop
      const gap = bodyScrollHeight - windowHight - ScrollY

      this.showTopicon = ScrollY > 100

      return gap
    },
    scrollList() {
      if (this.haveMore && !this.loading && (this.finalGap() - this.distance <= 0)) {
        this.showMore = true
      } else {
        this.showMore = false
      }
    },
    checkQuery(v) {
      const { hide, today, recommendStudent, parentReferral, phaseChecked: phase } = this.$refs['searchTask']
      const query = { hide, today, recommendStudent, parentReferral, phase }
      if (v) {
        this.page = 1
      }

      return query
    },
    async getList(v) {
      this.loading = true
      const params = this.checkQuery(v)
      try {
        const res = await this.getListApi(params)
        this.loading = false
        const { data } = res
        if (!data) {
          this.showMore = false
          return
        }
        const { list, pageNext } = data
        this.haveMore = pageNext

        if (parseInt(this.page) === 1) {
          this.tasklist = list
        } else if (this.page > 1) {
          this.tasklist = [...this.tasklist, ...list]
        }

        this.$nextTick(() => {
          this.scrollList()
        })
      } catch (e) {
        this.loading = false
        this.showMore = false
        console.error(e)
      }
    },
    getListApi(query) {
      return this.$http.get('task_taskList', {
        params: {
          ...query,
          page: this.page
        },
        isFilterUrl: true
      })
    },
    handleMorelist() {
      if (!this.haveMore || this.loading) return

      this.page += 1

      this.getList()
    }

  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container{
    position: relative;
    .nav-wrap{
      position: fixed;
      height: 130px;
      z-index: 269;
      background-color: #f2f2f2;
      width: calc(100% - 180px);
      top:80px;
    }
    .no-sidebar-navbar-width {
      width: calc(100% - 54px);
    }
    .content-wrap{
      margin-top: 130px; 
    }
    .addMore{
      position: fixed;
      bottom: 10px;
      right: 45%;
      text-align: center;
      font-size: 14px;
      color: #409EFF;
      font-weight: 600;
      cursor: pointer;
    }
    .icon-top {
      position: fixed;
      bottom: 10px;
      right: 20px;
      color: #c5c5c5;
      height: 50px;
      width: 50px;
    }
    .empty{
      text-align: center;
      color: #b5b5b5
    }

  }
</style>

