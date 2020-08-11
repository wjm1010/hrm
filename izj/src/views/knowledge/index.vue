<template>
  <div class="dashboard-container">
    <el-container style="margin-top: 10px">
      <el-header style="height: 80px">
        <div class="header-border">
          <i class="el-icon-search search" @click="search"></i>
          <input
            placeholder="请输入关键词，例如初一数学、学习不用心、如何保证学习效果、注意力不集中等"
            @keyup.enter="search"
            v-model="word">
        </div>
      </el-header>
      <div class="hot-section" v-if="hotSearchList.length">
        <p class="hot-world">热词推荐:</p>
        <div>
          <el-button
            v-for="item in hotSearchList"
            :key="item"
            style="margin: 0 10px 10px 0"
            @click="searchHot(item)"
            type="info"
            plain
          >{{item}}</el-button>
        </div>
      </div>
      <el-container>
        <el-aside width="300px">
          <ul>
            <p v-if="result" style="text-align: center">{{result}}</p>
            <li
              v-for="item in content.knowledges"
              :key="item.id"
              @click="viewBehavior(item)"
              :class="{blue:item.id===current}"
            >{{item.question}}</li>
          </ul>
        </el-aside>
        <el-main>
          <p v-html="answer" v-loading="loading">{{answer}}</p>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'knowledge',
  data() {
    return {
      current: 0,
      word: '',
      hotSearchList: [],
      result: '暂无内容',
      content: {},
      answer: '',
      loading: false,
    }
  },
  created() {
    this.getSearchHotList()
  },
  methods: {
    search() {
      this.answer = ''
      this.content = {}
      const optimize = { params: { word: this.word, role: '7yYFpc36' }}

      this.$http
        .get('student_getKnowledge', optimize)
        .then(res => {
          if (res.data) {
            if (!res.data.knowledges.length) {
              this.result = '抱歉，暂无搜索结果，我们会尽快添加！'
              return
            }
            this.result = ''
            this.content = res.data
          }
        })
        .catch(console.log)
    },
    viewBehavior(item) {
      const params = {
        searchId: this.content.searchId,
        knowledgeId: item.id
      }
      this.loading = true
      this.$http
        .post('student_viewBehavior', params)
        .then(() => {
          this.current = item.id
          setTimeout(() => {
            this.loading = false
            this.answer = item.answer.replace(/(\\\\n)/g, '<br>')
          }, 500)
        })
        .catch(console.log)
    },
    getSearchHotList() {
      this.$http.get('student_getHotWords').then(res => {
        const { code, data } = res
        if (code === '0x000000' && data) {
          const list = data.length > 20 ? data.slice(0, 20) : data
          this.hotSearchList = list
        }
      })
    },
    searchHot(item) {
      if (item === this.word) return
      this.word = item
      this.search(item)
    }
  }
}
</script>
<style lang="sass" scoped>
.el-header
  background-color: #ffffff
  color: #333
  padding: 0
  .search
    width: 20px
    font-size: 22px
    font-weight: bold
    color: #c9c9c9
    cursor: pointer
  input
    width: 90%
    border: 0
    padding: 0px 16px
    outline: none
    font-weight: 500
    font-size: 18px
    color: #5a5a5a
    height: 58px
    
.header-border
  height: 60px
  margin: 10px 20px
  padding-left: 30px
  border: 1px solid #ccc
  border-radius: 5px
.el-aside
  border-right: 2px solid rgba(228, 231, 237, 1)
  
.el-aside,.el-main 
  background-color: #ffffff
  color: #333
  text-align: center
  height: 70vh
  overflow-y: scroll

ul
  padding: 0
  height: 100%
  margin: 0
  li
    list-style: none
    text-align: center
    cursor: pointer
    line-height: 40px
    font-size: 14px
    color: #606266
.blue
  background: #e2e1e1

.hot-section
  background-color: #fff
  padding: 0 0 20px 10px
  margin-bottom: 10px

.hot-world
  margin: 0
  font-size: 16px
  color: red
p
  line-height: 40px
  font-size: 14px
  text-align: left
  color: #606266
  /*滚动条 start*/  
::-webkit-scrollbar
  width: 8px
  height: 5px
  background-color: #F5F5F5
 
/*定义滚动条轨道 内阴影+圆角*/  
::-webkit-scrollbar-track
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
  background: #fff 
 
/*定义滑块 内阴影+圆角*/  
::-webkit-scrollbar-thumb
  border-radius: 3px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color:rgba(7, 170, 247, 0.7)
 
::-webkit-scrollbar-thumb:hover
  border-radius: 3px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color:rgba(7, 170, 247, 1)
</style>
