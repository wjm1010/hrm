<template>
  <div class="total-wrap">
    <div class="top">
      <p class="num">{{max}}</p>
      <p class="kind">{{kind}}</p>
    </div>
    <div class="bot">
      <div class="marks">
        <div class="mark-item" v-for="item in marks" :key="item.id">
          <i class="dot" :style="{backgroundColor: item.bgc}"/>
          <span class="desc">{{item.txt}}</span>
          <span class="nums" v-show="item.id == 1"> &nbsp;{{current}}</span>
          <span class="nums" v-show="item.id == 2"> &nbsp;&nbsp;&nbsp;&nbsp;{{ max - current}}</span>
        </div>
      </div>
      <el-tooltip effect="dark" :content="formatTooltip" placement="top">
        <div class="circle-wrap">
          <el-progress 
          type="circle" 
          width="120"
          class="circle"
          :percentage="rate" 
          :show-text="false"
          color="#0099FF"/>
          <div class="content">
            <span>{{rate}}%</span>
            <span class="consume">已消耗</span>
          </div>
        </div>     
      </el-tooltip>
      
    </div>
  </div>
</template>

<script>
import circleChart from '../circlechart'

export default {
  name: 'total-time',
  components: {
    circleChart
  },
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
      marks: [
        { id: 1, txt: '已消耗:', bgc: '#0099FF' },
        { id: 2, txt: '剩余:', bgc: '#e5e9f2' }
      ]
    }
  },
  computed: {
    rate() {
      return `${(this.current / this.max * 100).toFixed(2)}`
    }
  }
}
</script>

<style lang="sass" scoped>
  .total-wrap
    padding: 0 20px
    .circle-wrap
      position: relative
      .content
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
        display: flex
        flex-direction: column
        align-items: center
        font-size: 20px
        color: #333
        .consume
          font-size: 12px
          color: #86898F
          margin-top: 10px

    .bot
      display: flex
      justify-content: space-between
      .marks
        display: flex
        flex-direction: column
        justify-content: flex-end
      .mark-item
        margin-bottom: 18px
        .nums
          color: #0099FF
          font-weight: 600
        .desc
          font-size: 14px
          color: #86898F
        .dot
          display: inline-block
          margin-right: 4px
          height: 8px
          width: 8px
          border-radius: 50%
    .top
      font-size: 14px
      color: #333
     
      >p
        margin: 0
        padding: 0
      .num
        font-size: 40px
        color: #0099FF
</style>



