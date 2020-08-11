<template>
  <div class="msg-wrap">
    <div class="item-msg" v-for="v in list" :key="v" :style="bdcolor(v.messageType)">
      <div class="news" :style="newsBg(v.messageType)">
        <span>{{ v.title }}</span>
      </div>
      <div class="content">
        <span>{{v.content}}</span>
      </div>
      <i class="el-icon-warning icon" v-show="v.import"></i>
      <div class="cover" v-if="v.optUrl">
        <el-button size="small" round @click="handleJump(v)"> 点击跳转 > </el-button>
      </div>
    </div>
  </div>
</template> 

<script>
export default {
  name: 'Msg',
  props: {
    list: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
    }
  },
  methods: {
    bdcolor(v) {
      const boderMap = {
        '1': this.changeColor('#c8e0f9'),
        '2': this.changeColor('#d7ebc8'),
        '3': this.changeColor('#f7ebd6')
      }
      return boderMap[v]
    },
    newsBg(v) {
      const colorMap = {
        '1': this.changeColor('#e8f1fb', '#4da5f7'),
        '2': this.changeColor('#f2f8ec', '#98cc71'),
        '3': this.changeColor('#fbeddd', '#ffa863')
      }

      return colorMap[v]
    },
    changeColor(bgc, fontColor) {
      if (arguments.length === 1) {
        return {
          borderColor: bgc
        }
      }
      return {
        backgroundColor: bgc,
        color: fontColor
      }
    },
    handleJump(v) {
      const { actionId, optUrl, type } = v
      if (!optUrl || actionId === '0') return
      this.$emit('handleBury', actionId)
      if (parseInt(type) === 10) {
        this.$router.push(`${optUrl}?isExperience=1`)
      } else {
        this.$router.push(`${optUrl}`)
      }
    }
  }

}
</script>

<style lang="sass" scoped>
  .msg-wrap
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    .item-msg
      position: relative;
      display: flex;
      width: 18%;
      height: 80px;
      margin-right: 2%;
      margin-bottom: 2%;
      font-size: 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      .news
        writing-mode: tb-rl;
        -webkit-writing-mode: vertical-rl;      
        writing-mode: vertical-rl;
        width: 30px;
        border-radius: 6px 0 0 6px;
        overflow: auto; 
        display: flex;
        justify-content: center;
        align-items: center;
      .content 
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 4px;
        line-height: 15px;
      .cover
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #83868d;
        opacity: 0.9;
        border-radius: 6px;
        justify-content: center;
        align-items: center;
      &:hover .cover
        display: flex;
    .icon 
      position: absolute;
      z-index: 11;
      right: -8px;
      top: -8px;
      font-size: 16px;
      color: red;
      border-radius: 50%;
</style>

