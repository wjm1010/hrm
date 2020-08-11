<template>
  <div class="status-main">
    <div class="title">
      <template class="status-bar" v-if="msgArr.length">
        <status-item
          v-for="(item, index) in statusArr "
          :key="index"
          :title="item.title"
          :color="item.color"
        />
      </template>
      <span class="current">{{stage}}</span>
    </div>
    <div class="msg-container" v-if="msgArr.length">
      <el-carousel 
        trigger="click" 
        height="80px" 
        :autoplay="false"
        indicator-position="none"
        >
        <el-carousel-item v-for="(v, i) in msgArr" :key="i">
          <el-row type="flex" :gutter="21" class="msg-row">
            <el-col :span="8" v-for="(item, index) in v" :key="index">
              <msg-item 
                :item="item"
                :rosterId="rosterId"
              />
            </el-col>
          </el-row>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="empty " v-if="!msgArr.length">
      <div class="img"></div>
      <div class="empty-desc">
        <span>您好,</span>
        <span>您目前暂无任务哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import statusItem from './component/statusItem'
import msgItem from './component/msgItem'

export default {
  name: 'student-status',
  components: {
    statusItem,
    msgItem
  },
  props: {
    list: {
      type: Array,
      required: true,
      default: []
    },
    phase: {
      type: Array,
      required: true,
      default: []
    },
    rosterId: {
      required: true
    }
  },
  data() {
    return {
      statusArr: [
        {
          title: '操作提示',
          color: 'bluedot'
        },
        {
          title: '待处理',
          color: 'greendot'
        },
        {
          title: '通知家长',
          color: 'yellowdot'
        }
      ],
    }
  },
  computed: {
    msgArr() {
      if (!this.list || (this.list && this.list.length === 0)) return []
      const result = []
      for (var i = 0; i < this.list.length; i += 3) {
        result.push(this.list.slice(i, i + 3))
      }

      return result
    },
    stage() {
      // 1为当前阶段
      if (!this.phase || (this.phase && this.phase.length === 0)) return ''
      const temp = this.phase.filter(v => parseInt(v.default) === 1)[0]
      return temp && `${temp.name}阶段`
    }
  }
}
</script>

<style lang="sass">
.status-main
  display: flex
  flex-direction: column
  font-size: 14px
  background-color: #fff
  .title, .status-bar
    display: flex
  .title
    justify-content: flex-end
    margin: 10px 28px 8px 28px
    .current
      margin-left: 30px
      font-size: 14px
  .empty
    display: flex
    width: 370px
    border-left: 1px solid #e4e4e4
    align-items: center
    .img
      height: 46px
      width: 48px
      margin: 0 20px 0 30px
      background: url('../icons/empty.png') no-repeat
    .empty-desc
      display: flex
      color: #86898F
      flex-direction: column
      >span
        margin-top: 10px
        font-size: 12px
  .msg-container
    width: 540px
    .el-carousel
      box-sizing: content-box
      padding: 0 30px
    .el-carousel__arrow
      height: 18px
      width: 18px
    .el-carousel__arrow--left
      left: -15px
    .el-carousel__arrow--right
      right: -15px
  .msg-row
    height: 100%
    width: 100%
@media screen and (max-width: 1380px)
  .msg-container
    .el-carousel__container,
    .el-carousel__item,
    .item-wrap
      height: 80px !important

</style>