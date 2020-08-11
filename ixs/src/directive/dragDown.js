import Vue from 'vue'

// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dragDown', {
  bind(el, binding, vnode, oldVnode) {
    var dragDom = el.querySelector('.el-drag')
    var posX = 0
    var posY = 0
    var posLeft = 0
    var posTop = 0
    var isDown = false // 鼠标按下
    dragDom.onmousedown = (e) => {
      // 获取x轴与y轴
      posX = e.clientX
      posY = e.clientY

      posLeft = dragDom.offsetLeft
      posTop = dragDom.offsetTop

      isDown = true

      dragDom.style.cursor = 'move'
    }

    window.onmousemove = (e) => {
      if (!isDown) return

      const nowPosX = e.clientX
      const nowPosY = e.clientY

      const nowPosLeft = nowPosX - (posX - posLeft)
      const nowPosTop = nowPosY - (posY - posTop)

      dragDom.style.left = nowPosLeft + 'px'
      dragDom.style.top = nowPosTop + 'px'
    }

    dragDom.onmouseup = (e) => {
      isDown = false
      dragDom.style.cursor = 'default'
    }
  }
})
