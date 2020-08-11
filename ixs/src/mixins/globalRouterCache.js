import Vue from 'vue'

Vue.mixin({
  watch: {
    '$route'(to) {
      if (to.name === this.$options.name && !to.meta.noCache) {
        this.getList && this.getList()
      }
    }
  }
})
