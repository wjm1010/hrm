<template>
  <section class="app-main">
    <!-- <Itool></Itool> -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  // import Itool from './Itools'
  export default {
    name: 'AppMain',
    components: {
      // Itool
    },
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.fullPath
      }
    }
  }
</script>
