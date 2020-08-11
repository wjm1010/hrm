<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <template v-if="item.children.length===1 && !item.children[0].children">
        <router-link :to="item.path+'/'+item.children[0].path" :key="item.children[0].name" v-if="item.children.length===1 && !item.children[0].hidden">
          <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
            <svg-icon v-if="item.children[0]&&item.children[0].icon" :icon-class="item.children[0].icon"></svg-icon>
            <span v-if="item.children[0]&&item.children[0].title">{{generateTitle(item.children[0].title)}}</span>
          </el-menu-item>
        </router-link>
      </template>
      <el-submenu v-else :index="item.name||item.path" :key="item.name" v-show="item">
        <template slot="title">
          <svg-icon v-if="item&&item.icon" :icon-class="item.icon"></svg-icon>
          <span v-if="item&&item.title">{{generateTitle(item.title)}}</span>
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item
            :is-nest="true"
            class="nest-menu"
            v-if="child.children&&child.children.length"
            :routes="[child]"
            :key="child.path"></sidebar-item>
          <router-link v-else :to="item.path+'/'+child.path" :key="child.path">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child&&child.icon" :icon-class="child.icon"></svg-icon>
              <span v-if="child&&child.title">{{generateTitle(child.title)}}</span>
              <!-- 名单数字提示 -->
              <p class="tip" v-if="totalNum[child.path]">
                <span>{{totalNum[child.path]}}</span>
              </p>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
  import { generateTitle } from '@/utils/i18n'

  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        totalNum: {}
      }
    },
    created() {
      this.$eventBus.$on('refresh-sidebar', this.init)
      this.$eventBus.$on('change-sidebar', res => { this.totalNum = res })
      this.init()
    },
    methods: {
      generateTitle,
      init() {
        this.$http.post('public_getTelentPoolCountList', { num: '1' }, { isFilterUrl: true }).then(res => res.data && (this.totalNum = res.data)).catch(() => {
          this.$message.error('获取左侧菜单栏数字请求失败，请稍后重试！')
        })
      }
    },
  }
</script>
<style scoped>
  .tip{
    font-weight: bold;
    display: flex;
    align-items: center;
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
  }
</style>


