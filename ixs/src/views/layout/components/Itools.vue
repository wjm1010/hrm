<template>
<!-- 命令行生成的模板 -->
  <div class="round"
  draggable= "true"
  ref="tools"
  @mousedown="mousedownStart"
  ></div>
</template>

<script>
export default {
  name: 'itool',
  props: {
  },
  components: {
  },
  data() {
    return {
      nowX: '',
      nowY: '',
      oldX: '',
      oldY: ''
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
  },
  methods: {
    mousedownStart(e) {
      e.preventDefault()
      const X = document.documentElement.clientWidth || document.body.clientWidth
      const Y = document.documentElement.clientHeight || document.body.clientHeight
      this.oldX = e.pageX
      this.oldY = e.pageY
      // console.log(this.oldX, this.oldY, X, Y)
      document.onmousemove = function(event) {
        event.preventDefault()
        if (event.pageX < 20) {
          e.target.style.left = '2px'
        } else if (event.pageY < 20) {
          e.target.style.top = '2px'
        } else if (event.pageX > X - 30) {
          e.target.style.left = X - 50 + 'px'
        } else if (event.clientY > Y - 50) {
          e.target.style.top = (Y - 50) + 'px'
        } else {
          e.target.style.left = (event.pageX - 20) + 'px'
          e.target.style.top = (event.clientY - 20) + 'px'
        }
        // console.log(event.pageX, event.pageY)
      }
      document.onmouseup = function() {
        // console.log('当前宽度' + event.pageX, '当前高度' + event.pageY, '窗口宽度' + X, '窗口高度' + Y)
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.round
  position: fixed
  z-index: 99999
  width: 35px
  height: 35px
  background: #409EFF
  border-radius: 40px
  cursor: pointer
  // transition: all .5s
  &:hover
    cursor: pointer
    transform: scale(1.3)
</style>