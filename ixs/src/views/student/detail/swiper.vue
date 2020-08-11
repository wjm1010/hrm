<template>
  <div class="swiper-container">
    <div class="screen">
      <div class="panel-body" :style = {transform:transform} :class="{list_num:num===0}">
        <slot name="slide"></slot>
      </div>
        <slot></slot>
    </div>
      <i 
        v-if="showUp"
        class="icon up el-icon-arrow-up" 
        @click="up"/>
      <i 
        v-if="showDown"
        class="icon down el-icon-arrow-down" 
        @click="down" />
    </div>
</template>
 
<script>

export default {
  props: {
    height: {
      default: 111,
      type: Number
    },
    list: {
      default: [],
      type: Array
    },
  },
  data() {
    return {
      num: 0
    }
  },
  computed: {
    transform() {
      return 'translateY(-' + (this.num) * (this.height + 20) + 'px)'
    },
    showUp() {
      if (!this.list || (this.list && this.list.length <= 2)) {
        return false
      }
      if (this.num < 2) {
        return false
      }

      return true
    },
    showDown() {
      if (!this.list || (this.list && this.list.length <= 2)) {
        return false
      }
      if (this.list.length > 2 && (this.num + 2 >= this.list.length)) {
        return false
      }

      return true
    }
  },
  methods: {
    up() {
      this.num -= 2
      if (this.num <= 2) return
    },
    down() {
      this.num += 2
      if (this.num >= this.list.length) return
    }
  }
}
</script>

<style lang="sass" scoped>
.swiper-container 
  height: 295px

.screen
  margin-top: 10px
  height: 262px
  position:relative
  overflow: hidden
  display: inline-block

.panel-body
  padding: 0px 20px
  width: 360px
  margin: 0 auto
  overflow: hidden

.list
  transition: 1s linear

.list_num
  transition: none

.icon
  color: #999
  border-radius: 50%
  background-size: cover
  cursor: pointer

.up
  position: absolute
  top: 28px
  left: 48%
.down
  position: absolute
  bottom: 12px
  left: 48%

.blue
  color: #409EFF

.yellow
  color: #E6A23C !important

.name
  font-size: 15px
  color: #333

.button-group
  display: flex
  justify-content: space-around
  height: 20px
  line-height: 20px

.button
  display: inline-block
  color: #409EFF
  cursor: pointer
</style>