<template>
  <div class="circle-map" :style="wrapClass">
    <div class="in">
      <span :style="rateClass">
        {{rate}}
      </span>
      <span class="consume" :style="descClass">
        {{desc}}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'circlechart',
  props: {
    rateClass: {
      type: Object,
      default: {}
    },
    rate: {
      type: String,
      default: ''
    },
    wrapClass: {
      type: Object,
      default: {}
    },
    descClass: {
      type: Object,
      default: null
    },
    desc: {
      type: String,
      default: '已消耗'
    }
  },
}
</script>

<style lang="sass" scoped>

.circle-map
  height: 120px
  width: 120px
  border-radius: 50%
  display: flex
  justify-content: center
  align-items: center
  .in
    height: 110px
    width: 110px
    display: flex
    flex-direction: column 
    justify-content: center
    align-items: center
    border-radius: 50%
    background-color: #fff
    text-align: center
    .consume
      font-size: 12px
      color: #86898F
      margin-top: 10px
</style>

