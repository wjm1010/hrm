<template>
  <div class="normal-container">
    <div class="top">
      <p class="num">{{max}}</p>
      <p class="kind">{{kind}}</p>
    </div>
    <div class="classTime">
      <el-slider
        v-model="current"
        :max="max"
        disabled
        :format-tooltip="formatTooltip"
        :tooltip-class="tooltipClass"
      >
      </el-slider>
    </div>  
    <div class="bot">
      <div class="bot-item">
        <span class="num">{{current}}</span>
        <span class="desc">已消耗</span>
      </div>
      <div class="bot-item">
        <span class="num">{{rest}}</span>
        <span class="desc">剩余</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'normal-time',
  props: {
    current: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    formatTooltip: {
      type: String,
      default: ''
    },
    kind: {
      type: String,
      default: ''
    },
    tooltipClass: {
      type: String,
      default: ''
    }

  },
  data() {
    return {

    }
  },
  computed: {
    rest() {
      return (this.max - this.current).toFixed(2)
    }
  },

}
</script>

<style lang="sass" scoped>
  .normal-container
    padding: 0 20px
    .classTime
      .el-slider
        width: 100%
    .top
      font-size: 14px
      color: #333
      margin-bottom: 60px
      >p
        margin: 0
        padding: 0
      .num
        font-size: 40px
        color: #0099FF
  .bot
    display: flex
    justify-content: space-between
    .bot-item
      display: flex
      align-items: center
      flex-direction: column
      font-size: 14px
      color: #0099FF
      .desc
        color: #86898F
        margin-top: 4px
</style>




