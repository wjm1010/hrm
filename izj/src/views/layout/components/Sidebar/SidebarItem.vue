<template>
  <div class="menu-wrapper">
    <div class="main-link">
      <hamburger
        class="hamburger-container"
        :toggleClick="toggleSideBar"
        :isActive="sidebar.opened">
      </hamburger>

      <router-link to="" style="width: auto">
        <h3 class="text" v-if="sidebar.opened" >班主任工作台</h3>
      </router-link>
    </div>
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <router-link v-if="item.children.length===1 && !item.children[0].children" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <p class="tip" v-if="totalNum[item.children[0].meta.title === 'dashboard']"><span class="act" v-if="Number(totalNum[item.children[0].name].new)">{{totalNum[item.children[0].name].new}}</span><span v-if="Number(totalNum[item.children[0].name].new)">/</span><span>{{totalNum[item.children[0].name].total}}</span></p>
          <!-- 待回访列表提示数字 -->
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{generateTitle(item.children[0].meta.title)}}</span><span class="red" v-if="item.children[0].meta.title === 'dashboard' && Number(totalNum)">{{totalNum}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name" v-show="item.meta">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.title)}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'

export default {
  name: 'SidebarItem',
  data() {
    return {
      totalNum: {},
    }
  },
  components: {
    Hamburger
  },
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  created() {
    const init = () => {
      this.$http.get('visit_listCount').then(res => res.data && (this.totalNum = res.data.total)).catch(() => {
        this.$message.error('获取左侧菜单栏数字请求失败，请稍后重试！')
      })
    }
    init()
    setInterval(() => {
      init()
    }, 120000)
  },
  methods: {
    generateTitle,
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  }
}
</script>

<style scoped>
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
    text-align: center;
    transition: .38s;
    display: inline-block;
    color: #2C7EFF;
  }
  .main-link{
    height: 50px;
    line-height: 50px;
    padding-left: 8px;
    border-bottom: 1px solid #e6e6e6;
  }
  .text{
    display: inline-block;
    float: left;
    margin: 0 5px;
    color: #2C7EFF;
  }
  .red{
    float: right;
    color: red;
  }
  .tip{
    font-weight: bold;
    display: flex;
    align-items: center;
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
  }
  .tip .act{
    color: red
  }
</style>

