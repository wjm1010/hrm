<template>
  <div class="kind-wrap">
    <div class="tit">
      <i class="icon" :style="{ backgroundImage: `url(${bgImg})`}"></i>
      <span class="name">{{title}}</span>
    </div>
    <div class="list">
      <slot name="list"></slot>
    </div>
  </div>
</template>
<script>
import lessonIcon from '../../icons/icon-lessonArrange.png'
import orderInfoIcon from '../../icons/icon-orderInfo.png'
import teacherIcon from '../../icons/icon-teacher.png'
import timeIcon from '../../icons/icon-time.png'

export default {
  name: 'panel',
  props: {
    title: {
      type: String,
      default: ''
    },
    kind: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgImg() {
      const iconMap = {
        'lessonArrange': lessonIcon,
        'orderInfo': orderInfoIcon,
        'classTeacher': teacherIcon,
        'restTime': timeIcon
      }
      return iconMap[this.kind]
    }
  }

}
</script>

<style lang="sass" scoped>
  .kind-wrap
    background-color: #fff
    margin-bottom: 24px
    box-shadow: 0 2px 10px 0 #E4E4E4
    .list
      padding: 0 30px 10px 30px
    .tit
      height: 44px
      display: flex
      align-items: center
      padding-left: 18px
      margin-bottom: 16px
      border-bottom: 1px solid #E8EBF0
      .name
        font-size: 14px
        color: #0099ff
        font-weight: 600
        letter-spacing: 1px
      .icon
        display: inline-block
        height: 18px
        width: 19px
        margin-right: 8px
        background-size: cover
</style>

