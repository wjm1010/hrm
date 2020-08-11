<template>
  <div class="main">
    <div class="top-all" v-if="aduitionList.length">
      <div 
        class="top-single"
        :style="borderColorChange(item)"
        v-for="(item, index) in aduitionList" 
        :key="index">
        <div 
          class="message-left"
          :style="messageLeftStyle(item)">
          <span 
            class="font-pos-msg"
            :style="fontLeftStyle(item)">
            {{item.title}}</span>
        </div>
        <div class="message-right">
          <span>{{item.content}}</span>
        </div>
        <i v-if="item.import"
          class="icon-pos el-icon-warning"></i>
        <div 
          class="hoverPress" 
          v-if="item.optUrl">
          <el-button 
            round 
            size="small" 
            class="jumpPos"
            @click="routerJump(item)">点击跳转 >></el-button>
        </div>
      </div>
    </div>
    <div v-else class="noMessage">暂无事项</div>

    <div class="divider">
    </div>
    <div class="footer">
      <div 
        v-for="(item, index) in taskDetail"
        :key="index"
        class="footer-left">
        <el-popover
          placement="top-start"
          width="350"
          trigger="hover"
          :disabled="!item.bubble">
          <p v-for="(itemTxt, index) in item.bubble"
            :key="index"
            v-text="itemTxt"></p>
            <div slot="reference" class="footer-popver">
              <span class="font-color">{{item.type}}</span>
              <span>{{item.state}}</span>
              <span class="task-detail">{{item.content}}</span>
            </div>
        </el-popover>
        
      </div>

      <div class="footer-right"> 
        <div 
          v-for="(item, index) in query.phase"
          :key="index"
          class="footer-right-pos">
          <span :style="progressColor(item.default)">{{item.name}}</span>
          <span class="line-medium" v-if="index < query.phase.length - 1"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    rosterId: {
      required: true
    }
  },
  data() {
    return {
      query: {},
      aduitionList: [],
      taskDetail: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    borderColorChange(item) {
      let borderColor = ''
      if (item.messageType === '3') {
        borderColor = 'border-color: #ffa863'
      } else if (item.messageType === '2') {
        borderColor = 'border-color: #98cc71'
      } else {
        borderColor = 'border-color: #4da5f7'
      }
      return borderColor
    },
    messageLeftStyle(item) { // 左侧提示信息背景颜色
      let bgColor = ''
      if (item.messageType === '3') {
        bgColor = 'background-color: #fbeddd'
      } else if (item.messageType === '2') {
        bgColor = 'background-color: #f2f8ec'
      } else {
        bgColor = 'background-color: #e8f1fb'
      }
      return bgColor
    },
    fontLeftStyle(item) { // 左侧提示信息定位
      let fontColor = ''
      if (item.messageType === '2') {
        fontColor = 'color: #98cc71;padding-top: 15px'
      } else if (item.messageType === '3') {
        fontColor = 'color: #ffa863'
      } else {
        fontColor = 'color: #4da5f7'
      }
      return fontColor
    },
    routerJump(item) { // 路由跳转
      this.$http.post('saleTask_buriedData', {
        studentIntentionId: this.rosterId,
        pageSourceType: '2',
        actionId: item.actionId
      }, { isFilterUrl: true })
      if (item.type === '10') {
        this.$emit('router-jump')
      } else {
        this.$router.push(item.optUrl)
      }
    },
    progressColor(index) { // 进度条颜色
      let color = ''
      if (index === '0') {
        color = 'color: #7a7b7f'
      } else if (index === '1') {
        color = 'color: #6363ff'
      } else {
        color = 'color: black'
      }
      return color
    },
    getList() { // 获取卡片列表
      this.$http.get('task_taskStudent', {
        params: {
          studentIntentionId: this.rosterId
        }
      }).then(res => {
        if (res.data) {
          this.query = res.data
          this.aduitionList = res.data.list
          if (res.data.infoExp) {
            this.query.infoExp.type = '体验课'
          }
          if (res.data.infoTrl) {
            this.query.infoTrl.type = '试听课'
          }
          this.taskDetail.push(res.data.infoExp, res.data.infoTrl)
        }
      }).catch(console.log)
    }
  }
}
</script>
<style lang="sass" scoped>
  @import '../../../styles/roster/detail/aduitionTask.sass'
</style>


