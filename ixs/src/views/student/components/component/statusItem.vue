<template>
  <div class="status-item">
    <i :class="['dot', color]"></i>
    <span>{{title}}</span>
  </div>
</template>

<script>
export default {
  name: 'status-item',
  props: {
    title: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },

}
</script>

<style lang="sass" scoped>
  .status-item
    display: flex
    align-items: center
    margin-left: 8px
    color: #86898F
    font-size: 12px
    .dot
      display: inline-block
      height: 6px
      width: 6px
      border-radius: 50%
      margin-right: 4px
      &.bluedot
        background-color:#0099FF
      &.greendot
        background-color:#67C23A
      &.yellowdot
        background-color:#FF9900
</style>