<template>
  <div class="tags-view-container" :class="{'no-sidebar-navbar-width':!sidebar.opened}">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''"
                   v-for="tag in Array.from(visitedViews)"
                   :to="tag" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        {{generateTitle(tag.title)}}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">{{$t('tagsView.close')}}</li>
      <li @click="closeOthersTags">{{$t('tagsView.closeOthers')}}</li>
      <li @click="closeAllTags">{{$t('tagsView.closeAll')}}</li>
    </ul>
    <!-- <p class="tip">左侧菜单数字提示会有5~10分钟延迟，请耐心等待，不要急喔！</p> -->
  </div>
</template>

<script>
  import ScrollPane from '@/components/ScrollPane'
  import { generateTitle } from '@/utils/i18n'
  import { mapGetters } from 'vuex'
  import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'

  export default {
    components: { ScrollPane },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {}
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    watch: {
      $route() {
        this.addViewTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.addViewTags()
      this.notice()
    },
    destroyed() {
    },
    methods: {
      notice() {
        this.$message({
          message: '左侧菜单数字提示会有5~10分钟延迟，请耐心等待，不要急喔！',
          type: 'warning',
          duration: 3000
        })
      },
      generateTitle, // generateTitle by vue-i18n
      generateRoute() {
        if (this.$route.name) {
          return this.$route
        }
        return false
      },
      isActive(route) {
        return decodeURI(route.path) === this.$route.path
      },
      addViewTags() {
        const route = this.generateRoute()
        if (!route) {
          return false
        }
        this.$store.dispatch('addVisitedViews', route)
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el)
              break
            }
          }
        })
      },
      hasUserInfo() {
        const userinfo = getUserInfoByCallPhone()
        if (userinfo && userinfo.unFinishCallStudentIntentionId) {
          this.$message.error(`您刚才对${userinfo.studentName}（${userinfo.studentNo}）的电话还未添加沟通记录，请填写并保存沟通记录后再继续其它操作`)
          return false
        }
        return true
      },
      closeSelectedTag(view) {
        if (!this.hasUserInfo()) return
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView)
            } else {
              this.$router.push('/')
            }
          }
        })
      },
      closeOthersTags() {
        if (!this.hasUserInfo()) return
        this.$router.push(this.selectedTag)
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags() {
        if (!this.hasUserInfo()) return
        this.$store.dispatch('delAllViews')
        this.$router.push('/')
      },
      openMenu(tag, e) {
        this.visible = true
        this.selectedTag = tag
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        this.left = e.clientX - offsetLeft + 15 // 15: margin right
        this.top = e.clientY - 40
      },
      closeMenu() {
        this.visible = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    border-radius: 0 !important;
    padding: 0;
    margin: 0 auto;
    width: calc(100% - 180px);
    z-index: 270;
    position: fixed;
    top: 54px;
    .tags-view-wrapper {
      background: #f2f2f2;
      height: 26px;
      border-bottom: 1px solid #d8dce5;
      .tags-view-item {
        display: inline-block;
        position: relative;
        height: 20px;
        line-height: 20px;
        border: 1px solid #ccc;
        color: #606266;
        background: #fff;
        border-radius: 4px;
        padding: 0 6px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 2px;
        &:first-of-type {
          margin-left: 15px;
        }
        &.active {
          background-color: #E6F1FC;
          color: #0099FF;
          border-color: #A3D0FD;
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
  .no-sidebar-navbar-width {
    width: calc(100% - 54px);
  }
  .tip{
    font-size: 12px;
    color: red;
    position: absolute;
    width: 100%;
    margin-top: 2px;
    animation: tip linear 60s;
    animation-fill-mode: forwards;
  }
  @keyframes tip
  {
    from {transform: translate(100%)}
    to {transform: translate(-100%)}
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        font-size: 16px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -2px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
