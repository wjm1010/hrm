<template>
  <div class="item-wrap">
    <div 
      :class="['content', color, isJump ]" 
      @click="handleJump(item)">
      <i class="el-icon-warning icon" v-show="item.import"></i>
      <span class="todo-txt">{{item.content}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'msg-item',
  data() {
    return {

    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    rosterId: {
      required: true
    }
  },
  computed: {
    color() {
      const typeMap = {
        '1': 'bluemsg',
        '2': 'greenmsg',
        '3': 'yellowmsg'
      }
      return typeMap[this.item.messageType]
    },
    isJump() {
      return this.item.optUrl ? 'jump' : ''
    }

  },
  methods: {
    handleJump(item) {
      this.$http.post('saleTask_buriedData', {
        studentIntentionId: this.rosterId,
        pageSourceType: '2',
        actionId: item.actionId
      }, { isFilterUrl: true })

      if (parseInt(item.type) === 10) {
        this.$eventBus.$emit('experience-jump')
      } else {
        this.$router.push(item.optUrl)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.item-wrap
  height: 100%
  width: 100%
  padding: 10px
  .content
    height: 100%
    width: 100%
    display: flex
    position: relative
    justify-content: center
    align-items: center
    border-radius: 4px
    padding: 4px
    word-break: break-all
    line-height: 14px
    border: 1px solid #ccc
    &.bluemsg
      border-color:#0099FF
      color:#0099FF
    &.greenmsg
      border-color:#67C23A
      color: #67C23A
    &.yellowmsg
      border-color:#FF9900
      color: #FF9900
    &.jump
      cursor: pointer
    .todo-txt
      font-size: 12px
.icon 
  position: absolute;
  z-index: 11;
  right: -8px;
  top: -8px;
  font-size: 16px;
  color: red;
  border-radius: 50%;


</style>

